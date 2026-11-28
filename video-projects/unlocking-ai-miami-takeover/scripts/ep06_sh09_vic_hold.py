"""SH09 (user 2026-11-28): Vic's mouth moved during Noelle's "Relax. I know a guy." (baked into the Grok take
from ~2.0 s). From frame START on, Vic's region (feathered box, clear of Noelle) is taken from the frames
before it played backwards (closed-mouth smirk); Noelle's lip-synced face is untouched.
Usage: python3 scripts/ep06_sh09_vic_hold.py in.mp4 out.mp4"""
import sys, subprocess
import cv2, numpy as np
src, out = sys.argv[1], sys.argv[2]
START = 46                       # first frame where Vic's mouth opens (24 fps)
BOX = (365, 140, 720, 640)       # x0, y0, x1, y1 in the 720x1264 frame: Vic's head, hand and shoulders
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS)
fr = []
while True:
    ok, f = cap.read()
    if not ok: break
    fr.append(f)
h, w = fr[0].shape[:2]
x0, y0, x1, y1 = BOX
m = np.zeros((h, w), np.float32); m[y0:y1, x0:x1] = 1
m = cv2.GaussianBlur(m, (0, 0), 14)[..., None]
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
                      "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
for i, f in enumerate(fr):
    if i >= START:
        j = max(START - 1 - (i - START), 0)          # ping-pong back through the closed-mouth frames
        f = (f * (1 - m) + fr[j] * m).astype(np.uint8)
    p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print(out, len(fr), "frames, Vic held from", START)
