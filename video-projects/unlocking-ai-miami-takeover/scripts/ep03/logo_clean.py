"""Remove car-brand badges from a clip: each badge is tracked frame to frame (template match on a context patch)
and filled per frame. Fill modes: 'inpaint' (badge on paint/leather), 'dark' (inpaint only the dark emblem inside a
coloured cap), 'clone' (copy the same rows from dx pixels away, for badges on a repeating grille).
usage: logo_clean.py CLIP_NAME   (config below; writes <name>_nologo.mp4 next to it, audio copied)"""
import cv2, numpy as np, subprocess, sys, os
CL = os.path.join(os.path.dirname(__file__), "../../episodes/03-sonny-social-media/clips/v")
# boxes are (x0, y0, x1, y1) in clip pixels at frame 0; ROI = car region used for feature tracking (frame 0)
ROI = {"S01_raw": (0, 700, 704, 1100), "S12A_raw": (150, 700, 600, 1200), "S12B": (0, 250, 300, 520), "S13_raw": (330, 560, 720, 800)}
CFG = {
    "S01_raw": [dict(box=(509, 810, 528, 823), mode="detect", roi=(400, 740, 680, 900)),   # hood badge
                dict(box=(186, 862, 209, 889), mode="hull", flat=True, roi=(110, 780, 290, 990)),     # front wheel cap
                dict(box=(22, 829, 37, 846), mode="hull", flat=True, roi=(0, 760, 110, 930))],         # rear wheel cap
    "S12A_raw": [dict(box=(318, 922, 352, 970), mode="hull", roi=(230, 820, 450, 1080))],  # front wheel cap
    "S12B":     [dict(box=(22, 355, 80, 433), mode="clone", dx=72, dy=-8, static=True)],                 # dashboard horse
    "S13_raw":  [dict(box=(512, 642, 553, 692), mode="clone", dx=-64),      # rear horse on grille
                 dict(box=(522, 615, 540, 630), mode="inpaint", pad=0),            # small emblem above grille
                 dict(box=(495, 593, 528, 612), mode="clone", dx=44),            # engine-lid ornament
                 dict(box=(644, 617, 696, 631), mode="inpaint", pad=0)],           # model script badge
}

def frames(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.split(",")
    W, H = int(r[0]), int(r[1])
    pr = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-i", p, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
    while True:
        b = pr.stdout.read(W * H * 3)
        if len(b) < W * H * 3: break
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()

def main(name):
    src = os.path.join(CL, name + ".mp4"); out = os.path.join(CL, name + "_nologo.mp4")
    fps = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", src], capture_output=True, text=True).stdout.strip()
    logos = [dict(L, pos=np.array(L["box"][:2], float)) for L in CFG[name]]
    prev = None; enc = None; track = []
    for i, f in enumerate(frames(src)):
        H, W = f.shape[:2]; g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        if prev is None:  # features around each badge at frame 0 (per-badge ROI, else the clip's car ROI)
            orb = cv2.ORB_create(3000); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
            for L in logos:
                rx0, ry0, rx1, ry1 = L.get("roi", ROI[name]); m0 = np.zeros_like(g); m0[ry0:ry1, rx0:rx1] = 255
                for M in logos:
                    x0, y0, x1, y1 = M["box"]; m0[max(y0 - 3, 0):y1 + 3, max(x0 - 3, 0):x1 + 3] = 0
                L["k0"], L["d0"] = orb.detectAndCompute(g, m0); L["A"] = np.float32([[1, 0, 0], [0, 1, 0]])
        else:
            k1, d1 = orb.detectAndCompute(g, None)
            for L in logos:
                mt = sorted(bf.match(L["d0"], d1), key=lambda m: m.distance)[:300]
                P0 = np.float32([L["k0"][m.queryIdx].pt for m in mt]); P1 = np.float32([k1[m.trainIdx].pt for m in mt])
                A2, inl = cv2.estimateAffinePartial2D(P0, P1, ransacReprojThreshold=2.0)
                if A2 is not None and inl.sum() > 12 and not L.get("static"): L["A"] = A2
        for L in logos:
            A = L["A"]; sc = float(np.hypot(A[0, 0], A[1, 0]))
            x0, y0, x1, y1 = L["box"]; c = A @ np.array([(x0 + x1) / 2, (y0 + y1) / 2, 1.0])
            L["pos"] = c - np.array([(x1 - x0) * sc / 2, (y1 - y0) * sc / 2]); L["sc"] = sc
        prev = g; o = f.copy(); track.append([(int(L["pos"][0]), int(L["pos"][1]), round(L["sc"], 3)) for L in logos])
        for L in logos:
            x0, y0, x1, y1 = L["box"]; w, h = int(round((x1 - x0) * L["sc"])), int(round((y1 - y0) * L["sc"])); X, Y = np.round(L["pos"]).astype(int)
            mk = np.zeros((H, W), np.uint8)
            if L["mode"] == "dark":
                cv2.ellipse(mk, (X + w // 2, Y + h // 2), (w // 2 - 1, h // 2 - 1), 0, 0, 360, 255, -1)
                hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
                mk = ((mk > 0) & ((hsv[..., 2] < 140) | (hsv[..., 1] < 70))).astype(np.uint8) * 255
                mk = cv2.dilate(mk, np.ones((3, 3), np.uint8))
                o = cv2.inpaint(o, mk, 4, cv2.INPAINT_TELEA)
            elif L["mode"] == "cap":  # repaint the centre cap as a plain yellow disc with a dark rim
                c = (X + w // 2, Y + h // 2); ax = (max(w // 2 - 1, 2), max(h // 2 - 1, 2))
                cv2.ellipse(mk, c, ax, 0, 0, 360, 255, -1)
                hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV); yel = (mk > 0) & (hsv[..., 0] >= 15) & (hsv[..., 0] <= 35) & (hsv[..., 1] > 120) & (hsv[..., 2] > 150)
                col = np.median(f[yel], axis=0) if yel.sum() > 5 else np.array([30, 200, 240])
                lay = o.copy(); cv2.ellipse(lay, c, ax, 0, 0, 360, col.tolist(), -1)
                cv2.ellipse(lay, c, ax, 0, 0, 360, (col * 0.45).tolist(), max(1, w // 14), cv2.LINE_AA)
                a = cv2.GaussianBlur(cv2.dilate(mk, np.ones((3, 3), np.uint8)).astype(np.float32) / 255, (0, 0), 0.8)[..., None]
                o = (lay * a + o * (1 - a)).astype(np.uint8)
            elif L["mode"] == "hull":  # keep the yellow centre cap, fill only the dark emblem inside it
                c = (X + w // 2, Y + h // 2); search = np.zeros((H, W), np.uint8)
                cv2.ellipse(search, c, (int(w * 0.75), int(h * 0.75)), 0, 0, 360, 255, -1)
                hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
                yel = ((search > 0) & (hsv[..., 0] >= 14) & (hsv[..., 0] <= 38) & (hsv[..., 1] > 110) & (hsv[..., 2] > 140)).astype(np.uint8)
                n, lab, st, cen = cv2.connectedComponentsWithStats(yel)
                if n > 1:
                    j = 1 + int(np.argmin([np.hypot(*(cen[k] - c)) - 0.05 * st[k, 4] for k in range(1, n)]))
                    pts = cv2.findNonZero((lab == j).astype(np.uint8))
                    if pts is not None and len(pts) > 8:
                        hm = np.zeros((H, W), np.uint8); cv2.fillConvexPoly(hm, cv2.convexHull(pts), 255)
                        hm = cv2.erode(hm, np.ones((3, 3), np.uint8))
                        mk = ((hm > 0) & (lab != j)).astype(np.uint8) * 255
                        mk = cv2.dilate(mk, np.ones((2, 2), np.uint8)) & hm
                        if L.get("flat"):  # tiny caps: a soft flat disc in the cap's own yellow
                            col = np.median(f[lab == j], axis=0); hd = cv2.dilate(hm, np.ones((3, 3), np.uint8))
                            a = cv2.GaussianBlur(hd.astype(np.float32) / 255, (0, 0), 0.7)[..., None]
                            o = (np.full_like(o, col.astype(np.uint8)) * a + o * (1 - a)).astype(np.uint8)
                        else:
                            o = cv2.inpaint(o, mk, 3, cv2.INPAINT_TELEA)
            elif L["mode"] == "detect":  # small badge on plain paint: find it each frame as a compact blob that stands out from the paint
                cx, cy = X + w // 2, Y + h // 2; R0 = int(max(w, h) * 1.6)
                x0w, y0w, x1w, y1w = max(cx - R0, 0), max(cy - R0, 0), min(cx + R0, W), min(cy + R0, H)
                gw = cv2.cvtColor(f[y0w:y1w, x0w:x1w], cv2.COLOR_BGR2GRAY).astype(np.int16)
                dev = (np.abs(gw - cv2.medianBlur(gw.astype(np.uint8), 21).astype(np.int16)) > 22).astype(np.uint8)
                n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(dev, np.ones((3, 3), np.uint8)))
                keep = np.zeros_like(dev)
                for k in range(1, n):
                    bw, bh = st[k, 2], st[k, 3]
                    if bw < w * 2.2 and bh < h * 2.2 and bw > 2:  # compact: badge, not a long panel line
                        keep[lab == k] = 1
                mk[y0w:y1w, x0w:x1w] = cv2.dilate(keep, np.ones((5, 5), np.uint8)) * 255
                o = cv2.inpaint(o, mk, 5, cv2.INPAINT_TELEA)
            elif L["mode"] == "clone":
                cv2.rectangle(mk, (X, Y), (X + w, Y + h), 255, -1)
                a = cv2.GaussianBlur(mk.astype(np.float32) / 255, (0, 0), 2.5)[..., None]
                sh = np.roll(np.roll(o, -L["dx"], axis=1), -L.get("dy", 0), axis=0)  # pixel at (x,y) takes the value from (x+dx, y+dy)
                o = (sh * a + o * (1 - a)).astype(np.uint8)
            else:
                pd = L.get("pad", 2); cv2.ellipse(mk, (X + w // 2, Y + h // 2), (w // 2 + pd, h // 2 + pd), 0, 0, 360, 255, -1)
                o = cv2.inpaint(o, mk, L.get("r", 5), cv2.INPAINT_TELEA)
        if enc is None:
            enc = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", fps, "-i", "-",
                                    "-i", src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest", out], stdin=subprocess.PIPE)
        enc.stdin.write(o.tobytes())
    enc.stdin.close(); enc.wait()
    print(f"wrote {out}: {i + 1} frames; track first/last {track[0]} -> {track[-1]}")

if __name__ == "__main__":
    for n in sys.argv[1:]: main(n)
