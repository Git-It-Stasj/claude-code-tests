"""Paint out a small round wheel-hub badge that moves and grows: track it frame by frame with a
template refreshed every frame (handles drift/scale), then fill the disc from its surroundings.

Usage: python3 scripts/delogo_hub.py <in.mp4> <out.mp4> <cx> <cy> <r> [search=18] [yscale=1]
  cx, cy, r = badge centre and horizontal radius in frame 0; yscale stretches the disc vertically
  (a hub seen at an angle is a tall ellipse). Audio is copied. Prints the track.
"""
import subprocess, sys, json
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view as swv
from PIL import Image, ImageDraw, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
cx, cy, r = map(float, sys.argv[3:6]); S = int(sys.argv[6]) if len(sys.argv) > 6 else 18
YS = float(sys.argv[7]) if len(sys.argv) > 7 else 1.0
p = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
    "stream=width,height,r_frame_rate", "-of", "json", src], capture_output=True, text=True).stdout)["streams"][0]
W, H, fps = p["width"], p["height"], p["r_frame_rate"]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).copy()
g = lambda f: f.astype(np.float32).mean(2)
T = int(r * 1.6 * YS)                     # template half-size (badge + some hub around it)
track = []
prev = g(F[0]); x, y = cx, cy
for i, f in enumerate(F):
    if i:
        cur = g(f)
        tpl = prev[int(y)-T:int(y)+T, int(x)-T:int(x)+T]
        win = cur[int(y)-T-S:int(y)+T+S, int(x)-T-S:int(x)+T+S]
        if win.shape == (2*(T+S), 2*(T+S)):
            v = swv(win, tpl.shape)
            err = ((v - tpl) ** 2).mean((2, 3))
            dy, dx = np.unravel_index(err.argmin(), err.shape)
            x += dx - S; y += dy - S
        prev = cur
    rr = r * (1 + 0.15 * i / max(1, len(F) - 1))     # wheel grows slightly as the car nears
    track.append((x, y, rr))
    # fill: blur of the ring just outside the badge, pasted into the disc with a soft edge
    R = int(rr * 1.8 * YS); x0, y0 = int(x) - R, int(y) - R
    crop = Image.fromarray(f[y0:y0+2*R, x0:x0+2*R])
    ring = np.array(crop).astype(np.float32)
    yy, xx = np.mgrid[0:2*R, 0:2*R]; d = np.hypot(xx - R, (yy - R) / YS)
    band = (d > rr * 1.15) & (d < rr * 1.5)
    col = ring[band].mean(0)
    fillimg = Image.new("RGB", crop.size, tuple(int(c) for c in col))
    m = Image.new("L", crop.size, 0); ImageDraw.Draw(m).ellipse([R-rr*1.12, R-rr*1.12*YS, R+rr*1.12, R+rr*1.12*YS], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(rr * 0.15))
    crop.paste(fillimg, (0, 0), m)
    F[i, y0:y0+2*R, x0:x0+2*R] = np.array(crop)
print("track (frame, x, y, r):", [(i, round(t[0]), round(t[1]), round(t[2])) for i, t in enumerate(track) if i % 24 == 0 or i == len(track)-1])
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", fps, "-i", "-",
    "-i", src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "copy", dst], stdin=subprocess.PIPE)
enc.communicate(F.tobytes())
