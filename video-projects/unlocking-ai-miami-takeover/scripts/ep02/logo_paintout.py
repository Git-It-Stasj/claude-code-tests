"""Paint out brand marks (Ferrari badges/lettering) from Ep02 clips, frame by frame.
Tracks live in scripts/ep02/logo_tracks/ (template-tracked; S02 hub by colour detection).
Writes <clip>_nologo.mp4 next to the original; originals are never modified.
  python3 scripts/ep02/logo_paintout.py [S01 S02 S12M S12]
"""
import cv2, json, os, subprocess, sys, numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
V = os.path.join(ROOT, "episodes/02-eva-executive-assistant/clips/v")
TR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logo_tracks")
load = lambda n: json.load(open(os.path.join(TR, n)))

def rect(t, i, grow):
    r = t["track"][str(i)]; s = r[2]; w, h = t["box"][2]*s, t["box"][3]*s
    return r[0], r[1], w/2 + grow*max(s, .5), h/2 + grow*max(s, .5)

def inpaint_rect(f, t, i, grow=3, rad=5):
    cx, cy, hw, hh = rect(t, i, grow)
    m = np.zeros(f.shape[:2], np.uint8)
    cv2.rectangle(m, (int(cx-hw), int(cy-hh)), (int(cx+hw), int(cy+hh)), 255, -1)
    return cv2.inpaint(f, m, rad, cv2.INPAINT_TELEA)

def clone_left(f, t, i, grow=3, k=1.6):
    """Grille: copy the slats from just left of the badge (horizontal pattern), feathered."""
    cx, cy, hw, hh = rect(t, i, grow)
    dx = int(2*hw*k)
    x0, y0, x1, y1 = int(cx-hw), int(cy-hh), int(cx+hw), int(cy+hh)
    src = f[y0:y1, x0-dx:x1-dx].astype(np.float32)
    a = np.zeros((y1-y0, x1-x0), np.float32); a[2:-2, 2:-2] = 1
    a = cv2.GaussianBlur(a, (0, 0), 1.5)[..., None]
    out = f.copy(); out[y0:y1, x0:x1] = (src*a + f[y0:y1, x0:x1]*(1-a)).astype(np.uint8)
    return out

def fill_disc(f, d, i, grow=5):
    x, y, r = d[str(i)]; R = r + grow
    H, W = f.shape[:2]
    ann = np.zeros((H, W), np.uint8)
    cv2.circle(ann, (int(x), int(y)), int(R+10), 255, -1); cv2.circle(ann, (int(x), int(y)), int(R+3), 0, -1)
    col = np.median(f[ann > 0], axis=0)
    m = np.zeros((H, W), np.float32); cv2.circle(m, (int(x), int(y)), int(R), 1, -1)
    m = cv2.GaussianBlur(m, (0, 0), 2)[..., None]
    flat = np.empty_like(f, dtype=np.float32); flat[:] = col
    # faint lighter rim so it reads as a plain hub cap, not a hole
    rim = np.zeros((H, W), np.float32); cv2.circle(rim, (int(x), int(y)), int(R-6), 1, 2)
    rim = cv2.GaussianBlur(rim, (0, 0), 1.2)[..., None]
    flat = flat + rim*18
    return np.clip(flat*m + f*(1-m), 0, 255).astype(np.uint8)

def wheel_cap(f, i, region=(150, 720, 230, 815), last=40):
    """S01 front wheel centre cap: lemon-yellow shield (hue ~42, body paint is ~20). Colour-keyed per frame."""
    if i > last: return f
    x0, y0, x1, y1 = region
    hsv = cv2.cvtColor(f[y0:y1, x0:x1], cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (23, 70, 60), (50, 255, 255))
    if cv2.countNonZero(m) == 0: return f
    m = cv2.dilate(m, np.ones((11, 11), np.uint8))
    M = np.zeros(f.shape[:2], np.uint8); M[y0:y1, x0:x1] = m
    return cv2.inpaint(f, M, 5, cv2.INPAINT_TELEA)

JOBS = {
    "S01": ("S01.mp4", lambda f, i, T: wheel_cap(clone_left(inpaint_rect(f, T["hood"], i, 3, 5), T["grille"], i, 3), i),
            {"hood": "trk_s01hood.json", "grille": "trk_s01grille.json"}),
    "S02": ("S02.mp4", lambda f, i, T: fill_disc(f, T["disc"], i), {"disc": "disc_s02.json"}),
    "S12M": ("S12M_pullback.mp4", lambda f, i, T: inpaint_rect(f, T["txt"], i, 4, 5), {"txt": "trk_s12mtxt.json"}),
    "S12": ("S12.mp4", lambda f, i, T: inpaint_rect(f, T["txt"], i, 3, 4), {"txt": "trk_s12txt.json"}),
}

def run(key):
    src, fn, tr = JOBS[key]; T = {k: load(v) for k, v in tr.items()}
    cap = cv2.VideoCapture(os.path.join(V, src)); fps = cap.get(cv2.CAP_PROP_FPS)
    W, H = int(cap.get(3)), int(cap.get(4))
    out = os.path.join(V, src.replace(".mp4", "_nologo.mp4"))
    p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                          "-r", str(fps), "-i", "-", "-i", os.path.join(V, src), "-map", "0:v", "-map", "1:a?",
                          "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", out], stdin=subprocess.PIPE)
    i = 0
    while True:
        ok, f = cap.read()
        if not ok: break
        p.stdin.write(fn(f, i, T).tobytes()); i += 1
    p.stdin.close(); p.wait(); print(key, i, "frames ->", out)

for k in (sys.argv[1:] or JOBS): run(k)
