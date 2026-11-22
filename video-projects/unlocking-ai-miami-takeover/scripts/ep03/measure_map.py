"""Measure keyframe->clip mapping (scale, offset) on frame 0, then phone drift across the used window via phase correlation.
usage: measure_map.py keyframe clip t_end x0 y0 x1 y1   (phone box in KEYFRAME pixels)"""
import sys, subprocess, numpy as np, cv2
kf, clip, t_end = sys.argv[1], sys.argv[2], float(sys.argv[3]); box = list(map(int, sys.argv[4:8]))
def frame(t):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(t), "-i", clip, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    return cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
K = cv2.imread(kf); f0 = frame(0); H, W = f0.shape[:2]
g0 = cv2.cvtColor(f0, cv2.COLOR_BGR2GRAY).astype(np.float32)
best = None
for s in np.arange(W / K.shape[1] - 0.01, W / K.shape[1] + 0.03, 0.001):
    ks = cv2.resize(K, None, fx=s, fy=s, interpolation=cv2.INTER_AREA); kg = cv2.cvtColor(ks, cv2.COLOR_BGR2GRAY).astype(np.float32)
    if kg.shape[0] < H or kg.shape[1] < W: continue
    r = cv2.matchTemplate(kg, g0[20:-20, 20:-20], cv2.TM_CCOEFF_NORMED); _, mv, _, ml = cv2.minMaxLoc(r)
    if best is None or mv > best[0]: best = (mv, s, ml[0] - 20, ml[1] - 20)
mv, s, ox, oy = best
print(f"map: scale {s:.4f}, keyframe crop offset x={ox} y={oy} (clip = keyframe*s cropped at offset), match {mv:.4f}")
# phone box in clip coords, then drift by phase correlation vs frame 0
cb = [int(round(box[0]*s - ox)), int(round(box[1]*s - oy)), int(round(box[2]*s - ox)), int(round(box[3]*s - oy))]
print("phone box in clip:", cb)
ref = g0[cb[1]:cb[3], cb[0]:cb[2]]; win = np.hanning(ref.shape[0])[:, None] * np.hanning(ref.shape[1])[None, :]
for t in np.arange(0, t_end + 1e-6, max(t_end / 8, 0.1)):
    g = cv2.cvtColor(frame(t), cv2.COLOR_BGR2GRAY).astype(np.float32)[cb[1]:cb[3], cb[0]:cb[2]]
    (dx, dy), resp = cv2.phaseCorrelate(ref * win, g * win)
    print(f"  t={t:4.2f}s drift dx={dx:+5.1f} dy={dy:+5.1f} (resp {resp:.2f})")
