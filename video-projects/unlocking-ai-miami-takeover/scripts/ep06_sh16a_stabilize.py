"""SH16A: lock the camera. MiniMax panned with the car despite a locked-off prompt; track the background
(car masked out) frame-to-frame, chain homographies back to frame 0, warp each frame into frame-0 view and
fill uncovered edges with a blurred mirror of the street. Usage: python3 scripts/ep06_sh16a_stabilize.py in.mp4 out.mp4"""
import sys, subprocess
import cv2, numpy as np
src, out = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS)
frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
h, w = frames[0].shape[:2]
orb = cv2.ORB_create(4000); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
def feats(f, i):
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY); m = np.full(g.shape, 255, np.uint8)
    m[int(h * 0.45):, :] = 0          # wet road + car: reflections/car move, ignore them
    return orb.detectAndCompute(g, m)
Hcum = [np.eye(3)]
kp0, d0 = feats(frames[0], 0)
prev = (kp0, d0)
for i in range(1, len(frames)):
    k, d = feats(frames[i], i)
    ms = sorted(bf.match(d, prev[1]), key=lambda x: x.distance)[:600]
    a = np.float32([k[x.queryIdx].pt for x in ms]); b = np.float32([prev[0][x.trainIdx].pt for x in ms])
    H, _ = cv2.findHomography(a, b, cv2.RANSAC, 3.0)
    Hcum.append(Hcum[-1] @ H)        # frame i -> frame 0
    prev = (k, d)
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps),
                      "-i", "-", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
for f, H in zip(frames, Hcum):
    wf = cv2.warpPerspective(f, H, (w, h))
    fill = cv2.GaussianBlur(cv2.warpPerspective(f, H, (w, h), borderMode=cv2.BORDER_REFLECT), (0, 0), 6)
    m = cv2.warpPerspective(np.ones((h, w), np.float32), H, (w, h))
    m = cv2.GaussianBlur(cv2.erode(m, np.ones((9, 9), np.uint8)), (21, 21), 0)[..., None]
    o = wf * m + fill * (1 - m)          # mirrored street, never the parked-car frame
    p.stdin.write(o.astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
np.save(out.rsplit(".", 1)[0] + "_H.npy", np.array(Hcum))
print(out, len(frames), "tx at end:", np.round(Hcum[-1][:2, 2], 1).tolist())
