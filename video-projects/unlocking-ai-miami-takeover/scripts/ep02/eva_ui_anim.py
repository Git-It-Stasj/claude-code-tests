"""EP02 S07: animate Eva's UI in post so text stays crisp (director note: show Eva working).
Scan + checkmarks down the task cards, draft reply types itself, meeting rows start red and turn green.
Usage: python3 scripts/ep02/eva_ui_anim.py <keyframe.png> <out.mp4>"""
import sys, os, subprocess, tempfile, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src, out = sys.argv[1], sys.argv[2]
FPS, DUR, OW, OH = 24, 3.4, 816, 1088
base = Image.open(src).convert("RGB")
W, H = base.size

def hue_shift(img, box, target_h, min_s=0.22, min_v=0.45):
    reg = np.asarray(img.crop(box).convert("HSV")).astype(float)
    h, s, v = reg[..., 0], reg[..., 1], reg[..., 2]
    m = (s > min_s * 255) & (v > min_v * 255)
    h[m] = target_h * 255
    s[m] = np.clip(s[m] * 1.15, 0, 255)
    out = Image.fromarray(np.dstack([h, s, v]).astype(np.uint8), "HSV").convert("RGB")
    img2 = img.copy(); img2.paste(out, box[:2]); return img2

ROWS = [(748, 818, 1042, 872), (752, 872, 1046, 926), (755, 926, 1050, 982)]
CARDS = [(568, 345, 1012, 445), (575, 440, 1022, 537), (583, 535, 1030, 630), (590, 630, 1037, 737)]
TEXT = (382, 852, 722, 990)
PRIORITY = (85, 838, 338, 900)

# state images
def recolor_fill(img, box, ref_rgb, min_v=0.55):
    """Repaint the light row fill (not the dark text/icons) with ref colour, keeping shading."""
    reg = np.asarray(img.crop(box).convert("HSV")).astype(float)
    rh, rs, rv = colorsys.rgb_to_hsv(*[c / 255 for c in ref_rgb])
    m = reg[..., 2] > min_v * 255
    reg[..., 0][m] = rh * 255
    reg[..., 1][m] = np.clip(rs * 255 * (reg[..., 2][m] / (rv * 255)), 0, 255)
    out = Image.fromarray(reg.astype(np.uint8), "HSV").convert("RGB")
    img2 = img.copy(); img2.paste(out, box[:2]); return img2
PINK = base.getpixel((990, 835))
red_all = base
for r in ROWS[1:]:
    red_all = recolor_fill(red_all, r, PINK)          # mint -> the same red/pink as the conflict row
row1_green = hue_shift(base, ROWS[0], 0.44, min_s=0.15, min_v=0.35)  # pink -> mint, triangle -> green
d = ImageDraw.Draw(row1_green)
fill = row1_green.getpixel((990, 835))
d.rounded_rectangle((905, 826, 1032, 864), radius=8, fill=fill)
f = ImageFont.truetype(os.path.join(ROOT, "templates/fonts/Anton-Regular.ttf"), 27)
d.text((912, 828), "Resolved", font=f, fill=(25, 20, 70))
# text-free draft panel: heavy median removes the glyphs, keeps the panel gradient
panel = base.crop(TEXT).filter(ImageFilter.MedianFilter(21)).filter(ImageFilter.GaussianBlur(6))
LINES = [(852, 884), (884, 914), (914, 944), (944, 990)]

def check_badge(sz):
    b = Image.new("RGBA", (sz, sz), (0, 0, 0, 0)); g = ImageDraw.Draw(b)
    g.ellipse((0, 0, sz - 1, sz - 1), fill=(40, 210, 120, 255), outline=(255, 255, 255, 255), width=max(2, sz // 14))
    g.line([(sz * .25, sz * .52), (sz * .43, sz * .70), (sz * .76, sz * .32)], fill=(255, 255, 255, 255), width=max(3, sz // 8), joint="curve")
    return b

def ease(x): x = min(max(x, 0), 1); return 1 - (1 - x) ** 3

tmp = tempfile.mkdtemp()
n = int(DUR * FPS)
for i in range(n):
    t = i / FPS
    fr = red_all.copy()
    # meetings: rows turn green one at a time (row2, row3, then row1 conflict resolves)
    for k, (row, at) in enumerate([(ROWS[1], 1.45), (ROWS[2], 1.75)]):
        if t >= at: fr.paste(base.crop(row), row[:2])
    if t >= 2.05: fr.paste(row1_green.crop(ROWS[0]), ROWS[0][:2])
    # draft reply types in, line by line, 0.45-1.55s
    fr.paste(panel, TEXT[:2])
    for k, (y0, y1) in enumerate(LINES):
        p = (t - 0.45 - k * 0.27) / 0.27
        if p <= 0: continue
        x1 = TEXT[0] + int((TEXT[2] - TEXT[0]) * min(p, 1))
        fr.paste(base.crop((TEXT[0], y0, x1, y1)), (TEXT[0], y0))
    fr = fr.convert("RGBA")
    ov = Image.new("RGBA", fr.size, (0, 0, 0, 0)); g = ImageDraw.Draw(ov)
    # flashes on rows as they flip
    for row, at in [(ROWS[1], 1.45), (ROWS[2], 1.75), (ROWS[0], 2.05)]:
        a = max(0, 1 - abs(t - at) / 0.18)
        if a: g.rounded_rectangle(row, radius=14, outline=(120, 255, 190, int(255 * a)), width=6)
    # scan bar down the task cards 0.1-1.15s + card glow + check pops
    sy = 345 + (737 - 345) * ease((t - 0.1) / 1.05)
    if 0.1 <= t <= 1.25:
        for w_, al in [(14, 50), (6, 120), (2, 255)]:
            g.line([(560, sy), (1045, sy + 8)], fill=(170, 120, 255, al), width=w_)
    for k, c in enumerate(CARDS):
        at = 0.3 + k * 0.25
        a = max(0, 1 - abs(t - at) / 0.22)
        if a: g.rounded_rectangle(c, radius=16, outline=(190, 150, 255, int(230 * a)), width=5)
    for k, c in enumerate(CARDS):
        at = 0.3 + k * 0.25
        if t < at: continue
        s = 1 + 0.35 * max(0, 1 - (t - at) / 0.15) if t - at < 0.3 else 1
        sz = int(40 * s * ease((t - at) / 0.12) + 1)
        if sz > 4:
            b = check_badge(sz); ov.alpha_composite(b, (c[0] - sz // 3, c[1] - sz // 3))
    # priority row pulse
    pa = int(70 + 60 * (0.5 + 0.5 * np.sin(t * 7)))
    g.rounded_rectangle(PRIORITY, radius=14, outline=(200, 160, 255, pa), width=4)
    fr = Image.alpha_composite(fr, ov).convert("RGB")
    # slow push-in toward the right/centre of the UI
    z = 1 + 0.08 * (t / DUR)
    cw, ch = W / z, H / z
    cx, cy = (W - cw) * 0.62, (H - ch) * 0.45
    fr.crop((int(cx), int(cy), int(cx + cw), int(cy + ch))).resize((OW, OH), Image.LANCZOS).save(f"{tmp}/{i:04d}.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/%04d.png", "-c:v", "libx264",
                "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", out], check=True)
print("wrote", out, n, "frames")
