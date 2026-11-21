"""EP02 S03: pop the four notification cards (cut from the director's image 4) one at a time
over the animated stressed-exec base clip. Director note: cards add up one by one, no jump cut.
Usage: python3 scripts/ep02/notif_pop.py <base.mp4> <cards_keyframe.png> <out.mp4>"""
import sys, os, subprocess, tempfile, glob, math
from PIL import Image, ImageDraw, ImageFilter
base, cardsrc, out = sys.argv[1:4]
SC, OX, OY = 0.765, 7, 1            # keyframe -> clip mapping (measured)
CARDS = [  # (box in keyframe px, pop time s)
    ((52, 135, 372, 392), 0.30),    # mail 99+
    ((18, 410, 312, 638), 0.72),    # calendar !
    ((800, 430, 1072, 652), 1.12),  # bell 99+
    ((745, 135, 1035, 405), 1.50),  # checklist
]
src = Image.open(cardsrc).convert("RGBA")
sprites = []
for (x0, y0, x1, y1), t in CARDS:
    c = src.crop((x0, y0, x1, y1))
    m = Image.new("L", c.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((6, 6, c.size[0] - 6, c.size[1] - 6), radius=34, fill=255)
    c.putalpha(m.filter(ImageFilter.GaussianBlur(5)))
    c = c.resize((int(c.size[0] * SC), int(c.size[1] * SC)), Image.LANCZOS)
    cx, cy = (x0 + x1) / 2 * SC - OX, (y0 + y1) / 2 * SC - OY
    sprites.append((c, cx, cy, t))
tmp = tempfile.mkdtemp()
subprocess.run(["ffmpeg", "-v", "error", "-i", base, f"{tmp}/f%04d.png"], check=True)
frames = sorted(glob.glob(f"{tmp}/f*.png"))
for i, fp in enumerate(frames):
    t = i / 24
    fr = Image.open(fp).convert("RGBA")
    for k, (c, cx, cy, t0) in enumerate(sprites):
        dt = t - t0
        if dt < 0: continue
        if dt < 0.12:   s = 0.3 + 0.82 * dt / 0.12          # grow to 1.12
        elif dt < 0.22: s = 1.12 - 0.12 * (dt - 0.12) / 0.10 # settle to 1.0
        else:           s = 1.0
        bob = 4 * math.sin((t + k) * 3.1)                    # gentle float once settled
        a = min(1, dt / 0.08)
        w, h = int(c.size[0] * s), int(c.size[1] * s)
        sp = c.resize((w, h), Image.LANCZOS)
        if a < 1:
            al = sp.getchannel("A").point(lambda v: int(v * a)); sp.putalpha(al)
        fr.alpha_composite(sp, (int(cx - w / 2), int(cy - h / 2 + (bob if dt > 0.22 else 0))))
    fr.convert("RGB").save(fp)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "24", "-i", f"{tmp}/f%04d.png", "-c:v", "libx264",
                "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", out], check=True)
print("wrote", out, len(frames))
