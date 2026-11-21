"""EP02 ending: start tight & square-on to the BBY TIGR plate, pull back to the exact framing of the
drive-off clip's first frame, so the cut into S12.mp4 is invisible. Director note replaces the plate cutaway.
Usage: python3 scripts/ep02/plate_pullback.py <S12_keyframe.png> <out.mp4> [dur]"""
import sys, os, subprocess, tempfile
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; DUR = float(sys.argv[3]) if len(sys.argv) > 3 else 1.3
im = Image.open(src).convert("RGB")
start = (660 - 146, 962 - 260, 660 + 146, 962 + 260)          # plate, 9:16
end = (0, 7 / 0.765, 941, 7 / 0.765 + 1264 / 0.765)            # == grok clip frame 0 (scale .765, oy 7)
def ease(x): return x * x * (3 - 2 * x)
tmp = tempfile.mkdtemp(); n = int(round(DUR * 24))
for i in range(n):
    p = ease(max(0, (i / (n - 1) - 0.12) / 0.88))               # brief hold on the plate first
    box = tuple(a + (b - a) * p for a, b in zip(start, end))
    im.resize((1080, 1920), Image.LANCZOS, box=box).save(f"{tmp}/{i:04d}.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "24", "-i", f"{tmp}/%04d.png", "-c:v", "libx264",
                "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", out], check=True)
print("wrote", out, n)
