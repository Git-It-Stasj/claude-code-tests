"""SH16A post fixes (user 2026-11-28): (1) garbled BBY TIGR plate -> paste the clean plate from the approved
keyframe onto the tracked plate every frame; (2) blurred stabilisation edge at left -> constant 1.14x zoom
anchored right (crop CROP_L px off the left), so the frame stays locked.
Usage: python3 scripts/ep06_sh16a_fix.py in_stab.mp4 out.mp4"""
import os, sys, subprocess
import cv2, numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, out = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS); W = int(cap.get(3)); H = int(cap.get(4))
CROP_L = 95


def find_plate(img, roi):
    x0, y0, x1, y1 = roi
    hsv = cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2HSV)
    m = ((hsv[..., 2] > 195) & (hsv[..., 1] < 150)).astype(np.uint8)  # warm-white plate; yellow paint is S>180
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    best = None
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if h > 8 and 1.5 < w / h < 2.8 and a > 0.5 * w * h and (best is None or a > best[4]):
            best = (x + x0, y + y0, w, h, a)
    return best


kf = cv2.resize(cv2.imread(os.path.join(ROOT, "episodes/06-walter-website/02-approved-storyboard/touchup/EP06_SH16A_R02.png")), (W, H),
                interpolation=cv2.INTER_AREA)
kp = find_plate(kf, (300, 750, 768, 1050))
assert kp, "plate not found in keyframe"
plate = kf[kp[1]:kp[1] + kp[3], kp[0]:kp[0] + kp[2]]
ch = int(round((W - CROP_L) * H / W)); cy = (H - ch) // 2
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
                      "-c:v", "libx264", "-crf", "15", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
prev, n, miss, missed = None, 0, 0, []
while True:
    ok, f = cap.read()
    if not ok: break
    roi = (200, 600, W, 1150) if prev is None else (max(prev[0] - 60, 0), max(prev[1] - 60, 0), min(prev[0] + prev[2] + 60, W), min(prev[1] + prev[3] + 60, H))
    b = find_plate(f, roi)
    if b is None or (prev and abs(b[2] - prev[2]) > 0.25 * prev[2]):
        b = prev; miss += 1; missed.append(n)
    if b:
        x, y, w, h = [int(v) for v in b[:4]]
        pad = 2
        r = cv2.resize(plate, (w + 2 * pad, h + 2 * pad), interpolation=cv2.INTER_AREA).astype(np.float32)
        mk = np.zeros((h + 2 * pad, w + 2 * pad), np.float32); mk[1:-1, 1:-1] = 1
        mk = cv2.GaussianBlur(mk, (3, 3), 0)[..., None]
        reg = f[y - pad:y + h + pad, x - pad:x + w + pad].astype(np.float32)
        if reg.shape == r.shape:
            f[y - pad:y + h + pad, x - pad:x + w + pad] = (reg * (1 - mk) + r * mk).astype(np.uint8)
        prev = b
    f = cv2.resize(f[cy:cy + ch, CROP_L:], (W, H), interpolation=cv2.INTER_CUBIC)
    p.stdin.write(f.tobytes()); n += 1
p.stdin.close(); p.wait()
print(out, n, "frames, plate misses:", miss, "in-use window (12-46):", [i for i in missed if 12 <= i <= 46], "keyframe plate", kp[:4])
