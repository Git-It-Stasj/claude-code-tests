"""SH16A post fixes (user 2026-11-28): (1) garbled BBY TIGR plate -> BBY [orange] TIGR artwork
(scripts/ep06_bby_tigr_plate.py) on a smoothed plate track (cubic fit, no jitter), tinted to the scene light; (2) blurred stabilisation edge at left -> constant 1.14x zoom
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


art = cv2.imread(os.path.join(ROOT, "assets/plates/BBY_TIGR_florida_plate.png"), cv2.IMREAD_UNCHANGED).astype(np.float32)
art_rgb, art_a = art[..., :3], art[..., 3:] / 255.0
BG = np.array([234, 242, 246], np.float32)      # artwork plate colour (BGR)
frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
# pass 1: detect the plate every frame
det, prev = [], None
for f in frames:
    roi = (200, 600, W, 1150) if prev is None else (max(prev[0] - 60, 0), max(prev[1] - 60, 0), min(prev[0] + prev[2] + 60, W), min(prev[1] + prev[3] + 60, H))
    b = find_plate(f, roi)
    if b is not None and (prev is None or abs(b[2] - prev[2]) < 0.25 * prev[2]):
        prev = b
        x, y, w, h = [float(v) for v in b[:4]]
        px = f[int(y):int(y + h), int(x):int(x + w)].reshape(-1, 3)
        tint = np.median(px[px.max(1) > 190], 0)       # plate paint only, not the lettering
        det.append((len(det), x + w / 2, y + h / 2, w, h, *tint))
    else:
        det.append(None)
idx = np.array([d[0] for d in det if d is not None]); val = np.array([d[1:] for d in det if d is not None])
# pass 2: smooth trajectories (cubic fit over the used window +-) -> no per-frame jitter
win = (idx >= 0) & (idx <= 60)
fit = [np.polyfit(idx[win], val[win, k], 3) for k in range(val.shape[1])]
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
                      "-c:v", "libx264", "-crf", "15", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
ch = int(round((W - CROP_L) * H / W)); cy = (H - ch) // 2
resid = []
for i, f in enumerate(frames):
    if i <= 60:
        cx, cyy, w, h, *tint = [np.polyval(c, i) for c in fit]
        if det[i] is not None:
            resid.append(abs(det[i][1] - cx) + abs(det[i][2] - cyy))
        w, h = w * 1.06, h * 1.08                  # cover the old plate edge fully
        sx, sy = w / art.shape[1], h / art.shape[0]
        M = np.float32([[sx, 0, cx - w / 2], [0, sy, cyy - h / 2]])
        rgb = cv2.warpAffine(art_rgb, M, (W, H), flags=cv2.INTER_AREA)
        al = cv2.warpAffine(art_a, M, (W, H), flags=cv2.INTER_LINEAR)[..., None]
        rgb = rgb * (np.array(tint, np.float32) / BG)            # match the scene light on the plate
        f = (f * (1 - al) + rgb * al).astype(np.uint8)
    f = cv2.resize(f[cy:cy + ch, CROP_L:], (W, H), interpolation=cv2.INTER_CUBIC)
    p.stdin.write(f.tobytes())
p.stdin.close(); p.wait()
print(out, len(frames), "frames; detections in window:", int(win.sum()), "mean |detection - smooth| px:", round(float(np.mean(resid)), 2))
