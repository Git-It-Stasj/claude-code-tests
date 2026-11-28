"""Paste a lip-synced face crop back into its full frame (crop-sync-paste for small faces).
Usage: python3 scripts/ep06_facecrop_paste.py full.mp4 synced_crop.mp4 x y size out.mp4
The crop was taken at (x, y, size x size) of full.mp4 and upscaled; it is scaled back down and blended in with
a feathered border so only the (re-synced) face area changes."""
import sys, subprocess
import cv2, numpy as np
full, crop, x, y, sz, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
a, b = cv2.VideoCapture(full), cv2.VideoCapture(crop)
fps = a.get(cv2.CAP_PROP_FPS); w = int(a.get(3)); h = int(a.get(4))
m = np.zeros((sz, sz), np.float32); f = sz // 8
m[f:-f, f:-f] = 1; m = cv2.GaussianBlur(m, (0, 0), f / 2.5)[..., None]
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
                      "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
n = 0
while True:
    ok, fr = a.read()
    if not ok: break
    ok2, c = b.read()
    if ok2:
        c = cv2.resize(c, (sz, sz), interpolation=cv2.INTER_AREA).astype(np.float32)
        reg = fr[y:y + sz, x:x + sz].astype(np.float32)
        fr[y:y + sz, x:x + sz] = (reg * (1 - m) + c * m).astype(np.uint8)
    p.stdin.write(fr.tobytes()); n += 1
p.stdin.close(); p.wait(); print(out, n, "frames")
