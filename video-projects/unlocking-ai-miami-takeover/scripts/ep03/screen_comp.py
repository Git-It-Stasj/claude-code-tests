"""EP03 post-built phone screens (project rule: animate UI/text in post, never with the video model).

A layer is drawn in KEYFRAME pixels, then mapped into the clip with the measured keyframe->clip transform
(scale s, crop offset ox/oy; see measure_map.py) plus per-frame phone drift from phase correlation.
Layer colours are matched to the clip on frame 0, edges are feathered.

usage: screen_comp.py S08|S09|S12B
"""
import os, sys, subprocess, json
import numpy as np, cv2

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KF = os.path.join(ROOT, "episodes/03-sonny-social-media/keyframes/user")
CL = os.path.join(ROOT, "episodes/03-sonny-social-media/clips/v")
FPS = 24


def ease(x):
    x = min(max(x, 0.0), 1.0); return 1 - (1 - x) ** 3


def read_frames(path):
    w, h = map(int, subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height",
                                    "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip().split(","))
    p = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-r", str(FPS), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(w * h * 3)
        if len(b) < w * h * 3: break
        yield np.frombuffer(b, np.uint8).reshape(h, w, 3)


def rrect_mask(shape, box, r, feather):
    m = np.zeros(shape, np.float32); x0, y0, x1, y1 = box
    cv2.rectangle(m, (x0 + r, y0), (x1 - r, y1), 1, -1); cv2.rectangle(m, (x0, y0 + r), (x1, y1 - r), 1, -1)
    for cx, cy in [(x0 + r, y0 + r), (x1 - r, y0 + r), (x0 + r, y1 - r), (x1 - r, y1 - r)]: cv2.circle(m, (cx, cy), r, 1, -1)
    return cv2.GaussianBlur(m, (0, 0), feather) if feather else m


def glow(rgba, box, color, alpha, width=5, r=14):
    """Neon rounded outline (true rounded corners) drawn into an RGBA float layer (keyframe px)."""
    if alpha <= 0.01: return
    x0, y0, x1, y1 = box
    for w_, a_ in [(width * 4, 0.18), (width * 2, 0.35), (width, 1.0)]:
        outer = rrect_mask(rgba.shape[:2], (x0 - w_ // 2, y0 - w_ // 2, x1 + w_ // 2, y1 + w_ // 2), r + w_ // 2, 0)
        inner = rrect_mask(rgba.shape[:2], (x0 + w_ // 2, y0 + w_ // 2, x1 - w_ // 2, y1 - w_ // 2), max(r - w_ // 2, 1), 0)
        ring = cv2.GaussianBlur(np.clip(outer - inner, 0, 1), (0, 0), max(w_ / 3, 1))
        a = np.clip(ring * a_ * alpha * 1.6, 0, 1)[..., None]
        rgba[..., :3] = rgba[..., :3] * (1 - a) + np.array(color, np.float32) * a
        rgba[..., 3:] = np.maximum(rgba[..., 3:], a)


# ---------------------------------------------------------------- shot recipes (keyframe coordinates)
def recipe_S08():
    K = cv2.cvtColor(cv2.imread(os.path.join(KF, "S08_user_instagram.png")), cv2.COLOR_BGR2RGB).astype(np.float32)
    screen = (258, 614, 522, 1160)
    mask = rrect_mask(K.shape[:2], screen, 26, 3)
    def layer(t):  # static, crisp re-composite of the user's own screen
        return K, mask
    shot = os.environ.get("SHOT", "S08")
    if shot == "S08B":
        return dict(clip="S08B_lipsync.mp4", out="S08B.mp4", K=K, s=0.8162, ox=0, oy=10, track=(230, 600, 545, 1180),
                    layer=layer, colour_box=screen, pushin=dict(last=0.35, zoom=0.12, centre=(390, 880)))
    return dict(clip="S08a_lipsync.mp4", out="S08.mp4", K=K, s=0.8162, ox=0, oy=10, track=(230, 600, 545, 1180),
                layer=layer, colour_box=screen, dur=2.3)


def recipe_S09():
    K = cv2.cvtColor(cv2.imread(os.path.join(KF, "S09_user_sonny_drafts.png")), cv2.COLOR_BGR2RGB).astype(np.float32)
    screen = (252, 600, 590, 1345)
    mask = rrect_mask(K.shape[:2], screen, 30, 3)
    LIST = (250, 852, 588, 1192); BANNER = (250, 748, 582, 852); WAVE = (438, 682, 542, 748)
    ROWS = [((250, 852, 586, 962), 0.35), ((250, 964, 586, 1076), 0.75), ((250, 1078, 588, 1192), 1.15)]
    CHIPS = [((466, 913, 579, 953), 1.60), ((469, 1024, 582, 1064), 1.90), ((473, 1138, 586, 1178), 2.20)]
    QUEUE = (268, 1192, 584, 1256); SCHED = (434, 1264, 512, 1326)
    dark = K[LIST[1]:LIST[3], LIST[0]:LIST[2]].reshape(-1, 3)
    bg = np.median(dark[dark.sum(1) < 90], axis=0)  # the app's own background colour
    # empty screen: the app's background colour, blended in through a feathered mask (no hard fill edges)
    hole = np.zeros(K.shape[:2], np.float32)
    for bb in (LIST, BANNER, WAVE): hole[bb[1]:bb[3], bb[0]:bb[2]] = 1
    hole = cv2.GaussianBlur(hole, (0, 0), 5)[..., None]
    base = K * (1 - hole) + bg * hole
    # Sonny's voice level drives the waveform (L8 starts 0.15s into the shot, see manifest audio_edit)
    m = json.load(open(os.path.join(ROOT, "manifests/ep03-sonny-social-media.json")))
    T09 = [s for s in m["shots"] if s["id"] == "09"][0]["t"][0]; L8 = m["audio_edit"]["L8"]
    a = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", os.path.join(ROOT, L8["file"]), "-ac", "1", "-ar", "24000", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.abs(np.frombuffer(a, np.int16).astype(np.float32)); hop = 24000 // FPS
    env = np.array([x[i:i + hop].mean() for i in range(0, len(x), hop)]); env = np.convolve(env / max(env.max(), 1), np.ones(3) / 3, "same")
    l8_at = L8["at"] - T09

    def pending(patch):  # grey, dimmed chip before Sonny marks it ready
        g = patch.mean(axis=2, keepdims=True); return np.repeat(g, 3, axis=2) * 0.55 + 18

    def layer(t):
        L = np.concatenate([base.copy(), np.ones(K.shape[:2] + (1,), np.float32)], axis=2)
        # waveform: vertical scale follows the voice envelope (flat line when silent)
        k = int(round((t - l8_at) * FPS)); e = env[k] if 0 <= k < len(env) else 0.0
        f = 0.18 + 1.0 * e
        wv = K[WAVE[1]:WAVE[3], WAVE[0]:WAVE[2]]; hh = max(2, int(wv.shape[0] * f))
        wv2 = cv2.resize(wv, (wv.shape[1], hh), interpolation=cv2.INTER_AREA); yc = (WAVE[1] + WAVE[3]) // 2
        L[yc - hh // 2:yc - hh // 2 + hh, WAVE[0]:WAVE[2], :3] = np.maximum(L[yc - hh // 2:yc - hh // 2 + hh, WAVE[0]:WAVE[2], :3], wv2)
        # banner wipes in left->right
        p = ease((t - 0.05) / 0.35)
        if p > 0:
            xr = BANNER[0] + int((BANNER[2] - BANNER[0]) * p)
            L[BANNER[1]:BANNER[3], BANNER[0]:xr, :3] = K[BANNER[1]:BANNER[3], BANNER[0]:xr]
        # rows pop in one by one (fade + rise + scale), chips grey until checked
        for (bx, at) in ROWS:
            a_ = ease((t - at) / 0.22)
            if a_ <= 0: continue
            patch = K[bx[1]:bx[3], bx[0]:bx[2]].copy()
            for cb, cat in CHIPS:
                if bx[1] <= cb[1] < bx[3] and t < cat:
                    patch[cb[1] - bx[1]:cb[3] - bx[1], cb[0] - bx[0]:cb[2] - bx[0]] = pending(patch[cb[1] - bx[1]:cb[3] - bx[1], cb[0] - bx[0]:cb[2] - bx[0]])
            sc = 0.94 + 0.06 * a_; ph, pw = patch.shape[:2]
            pr = cv2.resize(patch, (int(pw * sc), int(ph * sc)), interpolation=cv2.INTER_AREA)
            dy = int((1 - a_) * 16); x0 = bx[0] + (pw - pr.shape[1]) // 2; y0 = bx[1] + (ph - pr.shape[0]) // 2 + dy
            reg = L[y0:y0 + pr.shape[0], x0:x0 + pr.shape[1], :3]
            reg[:] = reg * (1 - a_) + pr[:reg.shape[0], :reg.shape[1]] * a_
        # flash ring as each chip turns green
        for cb, cat in CHIPS:
            if t >= cat: glow(L, cb, (120, 255, 170), max(0.0, 1 - (t - cat) / 0.35), width=3, r=16)
        # queue button dim until drafts are reviewed, then Queue + Schedule pulse (highlighted, NOT pressed)
        qa = 0.45 if t < 2.55 else 1.0
        q = K[QUEUE[1]:QUEUE[3], QUEUE[0]:QUEUE[2]]
        L[QUEUE[1]:QUEUE[3], QUEUE[0]:QUEUE[2], :3] = base[QUEUE[1]:QUEUE[3], QUEUE[0]:QUEUE[2]] * 0 + bg * (1 - qa) + q * qa
        if t >= 2.55:
            pa = 0.55 + 0.45 * np.sin((t - 2.55) * 9)
            glow(L, QUEUE, (190, 140, 255), pa, width=4, r=26); glow(L, SCHED, (190, 140, 255), pa * 0.9, width=3, r=12)
        return L[..., :3], mask
    return dict(clip="S09_raw.mp4", out="S09.mp4", K=K, s=0.8162, ox=0, oy=10, track=(230, 570, 615, 1365), keep_skin=(500, 600, 600, 1345),
                layer=layer, colour_box=screen, dur=3.0)


def recipe_S12B():
    K = cv2.cvtColor(cv2.imread(os.path.join(KF, "S12B_user.png")), cv2.COLOR_BGR2RGB).astype(np.float32)
    # taps measured from fingertip contact (skin coverage peaks): 0.62s on Post 2 'Review', 1.50s on Post 1 'Review'
    TAPS = []  # v3 director: no green highlight over Sonny's finger (was 0.62s Post 2 / 1.50s Post 1)
    def layer(t):
        L = np.zeros(K.shape[:2] + (4,), np.float32)
        for at, chip in TAPS:
            if at <= t < at + 0.45: glow(L, chip, (120, 255, 170), 1 - (t - at) / 0.45, width=2, r=8)
        return L[..., :3], L[..., 3]
    return dict(clip="S12B_raw.mp4", out="S12B.mp4", K=K, s=0.8153, ox=0, oy=9, track=(330, 460, 500, 560),
                layer=layer, colour_box=None, dur=2.0)


# ---------------------------------------------------------------- compositor
def run(R):
    src = os.path.join(CL, R["clip"]); out = os.path.join(CL, R["out"])
    s, ox, oy = R["s"], R["ox"], R["oy"]
    tb = [int(round(v * s)) - o for v, o in zip(R["track"], (ox, oy, ox, oy))]
    ref = None; gain = np.ones(3, np.float32); enc = None; n = 0
    for i, fr in enumerate(read_frames(src)):
        t = i / FPS
        if "dur" in R and t >= R["dur"] - 1e-6: break
        H, W = fr.shape[:2]
        g = cv2.cvtColor(fr, cv2.COLOR_RGB2GRAY).astype(np.float32)[tb[1]:tb[3], tb[0]:tb[2]]
        if ref is None:
            ref = g; win = cv2.createHanningWindow((g.shape[1], g.shape[0]), cv2.CV_32F)
            # phone-local offset of frame 0 vs the keyframe map (a lean/drift before the window starts)
            ksg = cv2.cvtColor(cv2.resize(R["K"], None, fx=s, fy=s, interpolation=cv2.INTER_AREA).astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
            kref = ksg[tb[1] + oy:tb[3] + oy, tb[0] + ox:tb[2] + ox]
            (bx, by), resp0 = cv2.phaseCorrelate(kref * win, g * win)
            print(f"frame-0 phone offset vs keyframe map: dx={bx:+.1f} dy={by:+.1f} (resp {resp0:.2f})")
            dx = dy = 0.0
            if R["colour_box"]:  # match keyframe colours to the clip's rendering of the same screen
                cb = R["colour_box"]; ks = cv2.resize(R["K"], None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
                kb = ks[int(cb[1] * s) - oy:int(cb[3] * s) - oy, int(cb[0] * s) - ox:int(cb[2] * s) - ox].reshape(-1, 3)
                fb = fr[int(cb[1] * s) - oy:int(cb[3] * s) - oy, int(cb[0] * s) - ox:int(cb[2] * s) - ox].reshape(-1, 3).astype(np.float32)
                gain = np.clip(fb.mean(0) / np.maximum(kb.mean(0), 1), 0.8, 1.25)
        else:
            (dx, dy), _ = cv2.phaseCorrelate(ref * win, g * win)
        dx_t, dy_t = dx + bx, dy + by
        rgb, alpha = R["layer"](t)
        M = np.float32([[s, 0, -ox + dx_t], [0, s, -oy + dy_t]])
        lw = cv2.warpAffine(rgb, M, (W, H), flags=cv2.INTER_AREA) * gain
        aw = cv2.warpAffine(alpha.astype(np.float32), M, (W, H), flags=cv2.INTER_LINEAR)[..., None]
        ks = R.get("keep_skin")
        if ks:  # a finger reaching in from the right stays ON TOP of the post-built screen
            x0, y0, x1, y1 = [int(round(v * s)) for v in ks]; x0 += int(-ox + dx_t); x1 += int(-ox + dx_t); y0 += int(-oy + dy_t); y1 += int(-oy + dy_t)
            hsv = cv2.cvtColor(fr[y0:y1, x0:x1], cv2.COLOR_RGB2HSV)
            sk = ((hsv[..., 0] <= 24) & (hsv[..., 1] >= 60) & (hsv[..., 2] >= 90)).astype(np.uint8)
            nlab, lab = cv2.connectedComponents(sk)
            edge = set(np.unique(lab[:, -3:])) - {0}  # only blobs touching the right edge of the strip (the finger)
            keep = np.isin(lab, list(edge)).astype(np.float32)
            keep = cv2.GaussianBlur(cv2.dilate(keep, np.ones((5, 5), np.uint8)), (0, 0), 1.5)
            aw[y0:y1, x0:x1, 0] *= (1 - np.clip(keep * 1.3, 0, 1))
        o = fr.astype(np.float32) * (1 - aw) + lw * aw
        pi = R.get("pushin")
        if pi:
            T = R["total"]; z = 1 + pi["zoom"] * ease((t - (T - pi["last"])) / pi["last"]) if t > T - pi["last"] else 1.0
            if z > 1.0001:
                cx, cy = pi["centre"][0] * s - ox + dx_t, pi["centre"][1] * s - oy + dy_t
                Z = np.float32([[z, 0, cx - z * cx], [0, z, cy - z * cy]]); o = cv2.warpAffine(o, Z, (W, H), flags=cv2.INTER_LINEAR)
        if enc is None:
            enc = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                    "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
        enc.stdin.write(np.clip(o, 0, 255).astype(np.uint8).tobytes()); n += 1
    enc.stdin.close(); enc.wait()
    print(f"wrote {out}: {n} frames ({n / FPS:.2f}s), colour gain {np.round(gain, 3)}")


if __name__ == "__main__":
    shot = sys.argv[1]; os.environ["SHOT"] = shot; R = globals()[f"recipe_{'S08' if shot == 'S08B' else shot}"]()
    if "pushin" in R:
        R["total"] = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(CL, R["clip"])], capture_output=True, text=True).stdout)
    run(R)
