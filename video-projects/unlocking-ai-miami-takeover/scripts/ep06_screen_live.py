"""EP06 Walter screen sequence v2: everything happens INSIDE one fixed monitor, Walter revising the site live.

User notes (2026-11-28): keep the wipe contained on the monitor screen; show Walter revising the website
"in real time". The approved stills frame the monitor differently, so each still's screen (inner-glass quad,
hand-picked corners) is flattened into a common screen space, composed there, then warped back into the
monitor of the base still (SH11A). The room around the monitor never changes.

Beats (s): 0-1.9 Walter profile (SH10B) | 1.9-2.3 page-load scan -> audit (SH11A) | 3.0 Walter cursor appears
| 3.2-5.0 cursor edits chrome, nav, hero, cards one by one (-> SH12A) | 5.0-6.3 hero/cards update, then the
five checklist items tick one at a time (-> SH12B) | hold.

Usage: python3 scripts/ep06_screen_live.py [out.mp4]
"""
import os, subprocess, sys
import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SB = os.path.join(ROOT, "episodes/06-walter-website/02-approved-storyboard")
W, H, FPS, DUR = 1080, 1920, 24, 6.5
FW, FH = 1000, 1240
PUSH = 0.05
# inner-glass corners (TL, TR, BR, BL) at 648x1152 preview scale -> /0.6 for 1080x1920
QUADS = {
    "10B": ("touchup/EP06_SH10B_R02.png", [(20, 315), (598, 100), (600, 832), (10, 862)]),
    "11A": ("EP06_SH11A_R01.png", [(22, 320), (606, 105), (616, 832), (14, 852)]),
    "12A": ("EP06_SH12A_R01.png", [(12, 325), (636, 148), (640, 868), (4, 872)]),
    "12B": ("EP06_SH12B_R01.png", [(22, 312), (618, 95), (624, 846), (16, 860)]),
}
BASE = "11A"
FLAT = np.float32([(0, 0), (FW, 0), (FW, FH), (0, FH)])
# edit regions in flat screen space (u0, v0, u1, v1), normalised
EDITS_A = [(0.00, 0.00, 1.00, 0.12), (0.00, 0.12, 0.75, 0.28), (0.00, 0.28, 0.75, 0.73), (0.00, 0.73, 0.75, 1.00)]
SIDEBAR = (0.75, 0.12, 1.00, 1.00)
HERO_CARDS = (0.00, 0.12, 0.75, 1.00)
CHECKS = [(0.75, 0.47 + 0.105 * i, 1.00, 0.47 + 0.105 * (i + 1)) for i in range(5)]


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


def px(r):
    u0, v0, u1, v1 = r
    return int(u0 * FW), int(v0 * FH), int(u1 * FW), int(v1 * FH)


def load():
    flats, full = {}, {}
    for k, (f, q) in QUADS.items():
        im = cv2.resize(cv2.imread(os.path.join(SB, f)), (W, H), interpolation=cv2.INTER_AREA).astype(np.float32)
        full[k] = im
        M = cv2.getPerspectiveTransform(np.float32(q) / 0.6, FLAT)
        flats[k] = cv2.warpPerspective(im, M, (FW, FH), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return flats, full


def scan_swap(dst, a, b, r, p, vertical=True, glow=(255, 120, 230)):
    """Within rect r, reveal b over a with a scan edge at progress p; draw a glowing scan line."""
    x0, y0, x1, y1 = px(r)
    if p <= 0:
        dst[y0:y1, x0:x1] = a[y0:y1, x0:x1]; return
    if p >= 1:
        dst[y0:y1, x0:x1] = b[y0:y1, x0:x1]; return
    if vertical:
        n = y1 - y0; e = ease(p) * (n + 30) - 15
        m = np.clip((e - np.arange(n)) / 12 + 0.5, 0, 1)[:, None, None]
        line = np.exp(-((np.arange(n) - e) / 5) ** 2)[:, None, None]
    else:
        n = x1 - x0; e = ease(p) * (n + 30) - 15
        m = np.clip((e - np.arange(n)) / 12 + 0.5, 0, 1)[None, :, None]
        line = np.exp(-((np.arange(n) - e) / 5) ** 2)[None, :, None]
    reg = a[y0:y1, x0:x1] * (1 - m) + b[y0:y1, x0:x1] * m
    g = np.array(glow, np.float32)
    dst[y0:y1, x0:x1] = reg * (1 - 0.8 * line) + g * 0.8 * line


def edit_box(img, r, alpha, col=(255, 90, 220)):
    if alpha <= 0:
        return
    x0, y0, x1, y1 = px(r)
    ov = img.copy()
    cv2.rectangle(ov, (x0 + 5, y0 + 5), (x1 - 5, y1 - 5), col, 8, cv2.LINE_AA)
    glow = np.zeros_like(img); cv2.rectangle(glow, (x0 + 4, y0 + 4), (x1 - 4, y1 - 4), col, 14, cv2.LINE_AA)
    glow = cv2.GaussianBlur(glow, (0, 0), 8)
    img[:] = img * (1 - alpha) + np.clip(ov + glow * 0.9, 0, 255) * alpha


def cursor(img, x, y, alpha=1.0, click=0.0):
    if alpha <= 0:
        return
    ov = np.clip(img, 0, 255).astype(np.uint8)
    if click > 0:  # click ripple
        cv2.circle(ov, (int(x), int(y)), int(10 + 40 * click), (255, 230, 255), 3, cv2.LINE_AA)
    pts = (np.float32([(0, 0), (0, 46), (12, 35), (21, 56), (30, 52), (21, 32), (37, 32)]) * 1.7).astype(np.int32) + [int(x), int(y)]
    cv2.fillPoly(ov, [pts], (255, 255, 255), cv2.LINE_AA)
    cv2.polylines(ov, [pts], True, (40, 10, 40), 4, cv2.LINE_AA)
    tx, ty = int(x) + 50, int(y) + 92
    cv2.rectangle(ov, (tx, ty), (tx + 190, ty + 60), (200, 40, 150), -1, cv2.LINE_AA)
    cv2.putText(ov, "Walter", (tx + 16, ty + 44), cv2.FONT_HERSHEY_DUPLEX, 1.45, (255, 255, 255), 3, cv2.LINE_AA)
    img[:] = img * (1 - alpha) + ov.astype(np.float32) * alpha


def centre(r):
    x0, y0, x1, y1 = px(r)
    return x0 + (x1 - x0) * 0.55, y0 + (y1 - y0) * 0.45


def screen_at(t, F):
    """Flat screen image at time t."""
    s = F["10B"].copy()
    cur = None
    if t < 1.9:
        return s, None
    if t < 2.3:  # page load: audit page scans in top->bottom
        scan_swap(s, F["10B"], F["11A"], (0, 0, 1, 1), (t - 1.9) / 0.4, glow=(255, 200, 140))
        return s, None
    s = F["11A"].copy()
    # cursor path: appears 2.9, visits each Phase-A region, then the checklist
    stepA, a0 = 0.45, 3.2
    if t >= 2.9:
        cur_alpha = min((t - 2.9) / 0.2, 1)
    # Phase A: chrome, nav, hero, cards (11A -> 12A), sidebar swaps with the chrome step
    for i, r in enumerate(EDITS_A):
        ts = a0 + i * stepA
        p = (t - ts - 0.12) / (stepA - 0.12)
        scan_swap(s, F["11A"], F["12A"], r, p)
        if i == 0:
            scan_swap(s, F["11A"], F["12A"], SIDEBAR, p, vertical=False, glow=(140, 220, 255))
        if ts - 0.05 <= t < ts + stepA + 0.1:
            edit_box(s, r, min((t - ts + 0.05) / 0.1, 1) * (1 - max(0, (t - ts - stepA) / 0.1)))
    b0 = a0 + 4 * stepA  # 5.0
    if t >= b0:
        s = F["12A"].copy()
        scan_swap(s, F["12A"], F["12B"], HERO_CARDS, (t - b0) / 0.3)
        scan_swap(s, F["12A"], F["12B"], (0.75, 0.0, 1.0, 0.47), (t - b0) / 0.3)
        for i, r in enumerate(CHECKS):
            ts = b0 + 0.3 + i * 0.2
            scan_swap(s, F["12A"], F["12B"], r, (t - ts) / 0.15, vertical=False, glow=(120, 255, 140))
            if ts - 0.02 <= t < ts + 0.22:
                edit_box(s, r, 1.0, col=(120, 255, 140))
    # cursor position: keyframes (time, region centre)
    keys = [(2.9, (0.55, 0.55)), (a0, centre(EDITS_A[0]))]
    for i, r in enumerate(EDITS_A):
        keys.append((a0 + i * stepA + 0.1, centre(r)))
    keys.append((b0 + 0.05, centre(HERO_CARDS)))
    for i, r in enumerate(CHECKS):
        keys.append((b0 + 0.3 + i * 0.2, (px(r)[0] + 40, (px(r)[1] + px(r)[3]) / 2 - 10)))
    keys.append((DUR, keys[-1][1]))
    keys = [(k, (v[0] * FW, v[1] * FH) if max(v) <= 1.0 else v) for k, v in keys]
    if t >= 2.9:
        for (k0, p0), (k1, p1) in zip(keys, keys[1:]):
            if k0 <= t <= k1:
                e = ease((t - k0) / max(k1 - k0, 1e-3))
                x = p0[0] + (p1[0] - p0[0]) * e; y = p0[1] + (p1[1] - p0[1]) * e
                click = max(0.0, 1 - (t - k0) / 0.25) if k0 >= a0 and (t - k0) < 0.25 else 0.0
                cur = (x, y, cur_alpha, click)
                break
    return s, cur


def zoom(im, s):
    w, h = int(W * s), int(H * s)
    big = cv2.resize(im, (w, h), interpolation=cv2.INTER_LINEAR)
    x0 = (w - W) // 2; y0 = int((h - H) * 0.42)
    return big[y0:y0 + H, x0:x0 + W]


def main(out):
    F, full = load()
    base = full[BASE]
    Mb = cv2.getPerspectiveTransform(FLAT, np.float32(QUADS[BASE][1]) / 0.6)
    mask = cv2.warpPerspective(np.ones((FH, FW), np.float32), Mb, (W, H))
    mask = cv2.GaussianBlur(mask, (5, 5), 0)[..., None]
    n = int(round(DUR * FPS))
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        t = i / FPS
        s, cur = screen_at(t, F)
        if cur:
            cursor(s, *cur)
        scr = cv2.warpPerspective(s, Mb, (W, H), flags=cv2.INTER_CUBIC)
        fr = base * (1 - mask) + scr * mask
        fr = zoom(fr, 1 + PUSH * t / DUR)
        p.stdin.write(np.clip(fr, 0, 255).astype(np.uint8).tobytes())
    p.stdin.close(); p.wait()
    print(out, n, "frames")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        ROOT, "episodes/06-walter-website/04-generated-clips/EP06_SH10B-12B_SCREEN_LIVE_R01.mp4"))
