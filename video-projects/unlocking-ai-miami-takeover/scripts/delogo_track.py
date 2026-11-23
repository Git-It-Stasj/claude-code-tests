"""Remove a logo from a clip: track a box from frame 0 and fill it from its border (like ffmpeg delogo, but moving).

Usage: python3 scripts/delogo_track.py <in.mp4> <out.mp4> <x> <y> <w> <h> [search_px=24]
       python3 scripts/delogo_track.py --badge <in.mp4> <out.mp4> <cx> <cy> <r>   (round yellow badge)
  x y w h = logo box in frame 0 (source pixels). Audio is copied unchanged.
Prints the tracked offset per frame so drift can be checked.
"""
import json, subprocess, sys
import numpy as np


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "json", path],
                         capture_output=True, text=True, check=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"], s["r_frame_rate"]


def fill(img, x0, y0, x1, y1):
    """Replace img[y0:y1, x0:x1] by bilinear interpolation of the 1-px border around it."""
    H, W, _ = img.shape
    x0, y0 = max(x0, 1), max(y0, 1)
    x1, y1 = min(x1, W - 1), min(y1, H - 1)
    h, w = y1 - y0, x1 - x0
    L = img[y0:y1, x0 - 1].astype(np.float32)
    R = img[y0:y1, x1].astype(np.float32) if x1 < W - 1 else L
    T = img[y0 - 1, x0:x1].astype(np.float32)
    B = img[y1, x0:x1].astype(np.float32) if y1 < H - 1 else T
    u = (np.arange(w, dtype=np.float32) + 1) / (w + 1)
    v = (np.arange(h, dtype=np.float32) + 1) / (h + 1)
    Hs = L[:, None, :] * (1 - u)[None, :, None] + R[:, None, :] * u[None, :, None]
    Vs = T[None, :, :] * (1 - v)[:, None, None] + B[None, :, :] * v[:, None, None]
    patch = (Hs + Vs) / 2
    # feather 3 px into the original so the edge doesn't show
    f = 3
    m = np.ones((h, w), np.float32)
    for i in range(f):
        a = (i + 1) / (f + 1)
        m[i, :] = np.minimum(m[i, :], a); m[-1 - i, :] = np.minimum(m[-1 - i, :], a)
        m[:, i] = np.minimum(m[:, i], a); m[:, -1 - i] = np.minimum(m[:, -1 - i], a)
    orig = img[y0:y1, x0:x1].astype(np.float32)
    img[y0:y1, x0:x1] = (patch * m[..., None] + orig * (1 - m[..., None])).clip(0, 255).astype(np.uint8)


def main(src, dst, x, y, w, h, search=24):
    W, H, fps = probe(src)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).copy()
    pad = 10
    tx0, ty0 = max(x - pad, 0), max(y - pad, 0)
    tx1, ty1 = min(x + w + pad, W), min(y + h + pad, H)
    gray = lambda f: f.astype(np.float32).mean(axis=2)
    tmpl = gray(frames[0])[ty0:ty1, tx0:tx1]
    dx = dy = 0
    log = []
    for i, f in enumerate(frames):
        g = gray(f)
        best = None
        for oy in range(dy - search, dy + search + 1, 2):
            for ox in range(dx - search, dx + search + 1, 2):
                a, b = ty0 + oy, tx0 + ox
                if a < 0 or b < 0 or a + tmpl.shape[0] > H or b + tmpl.shape[1] > W:
                    continue
                d = np.mean((g[a:a + tmpl.shape[0], b:b + tmpl.shape[1]] - tmpl) ** 2)
                if best is None or d < best[0]:
                    best = (d, ox, oy)
        _, bx, by = best
        for oy in range(by - 1, by + 2):          # 1-px refine
            for ox in range(bx - 1, bx + 2):
                a, b = ty0 + oy, tx0 + ox
                if a < 0 or b < 0 or a + tmpl.shape[0] > H or b + tmpl.shape[1] > W:
                    continue
                d = np.mean((g[a:a + tmpl.shape[0], b:b + tmpl.shape[1]] - tmpl) ** 2)
                if d < best[0]:
                    best = (d, ox, oy)
        _, dx, dy = best
        log.append((i, dx, dy, round(float(best[0]), 1)))
        fill(f, x + dx, y + dy, x + dx + w, y + dy + h)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", fps, "-i", "-", "-i", src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264",
                            "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", dst],
                           stdin=subprocess.PIPE)
    enc.communicate(frames.tobytes())
    print(dst, "track (frame, dx, dy, err):", log[0], log[len(log) // 2], log[-1],
          "max shift", max(abs(l[1]) for l in log), max(abs(l[2]) for l in log))




def badge_main(src, dst, cx, cy, r):
    """Round yellow badge (e.g. on a steering-wheel hub): find the yellow blob near the last centre
    each frame and cover it with a soft disc in the median colour of the ring just outside it."""
    W, H, fps = probe(src)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).copy()
    yy, xx = np.mgrid[0:H, 0:W]
    log = []
    for i, f in enumerate(frames):
        R_, G_, B_ = (f[..., k].astype(np.int16) for k in range(3))
        near = (xx - cx) ** 2 + (yy - cy) ** 2 < (r * 1.8) ** 2
        mask = near & (R_ > 170) & (G_ > 120) & (B_ < 120) & (R_ - B_ > 90)
        if mask.sum() > 30:
            cx, cy = float(xx[mask].mean()), float(yy[mask].mean())
            d = np.sqrt((xx[mask] - cx) ** 2 + (yy[mask] - cy) ** 2)
            r = max(r * 0.8, min(r * 1.2, float(np.percentile(d, 97))))
        dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        ring = (dist > r * 1.45) & (dist < r * 1.75)
        col = np.median(f[ring].astype(np.float32), axis=0) if ring.any() else np.array([30, 25, 35], np.float32)
        a = np.clip((r * 1.35 - dist) / 3.0, 0, 1)[..., None]   # soft edge
        f[:] = (f.astype(np.float32) * (1 - a) + col * a).clip(0, 255).astype(np.uint8)
        log.append((i, round(cx), round(cy), round(r)))
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", fps, "-i", "-", "-i", src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264",
                            "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", dst],
                           stdin=subprocess.PIPE)
    enc.communicate(frames.tobytes())
    print(dst, "badge track (frame, cx, cy, r):", log[0], log[len(log) // 2], log[-1])


if __name__ == "__main__":
    a = sys.argv
    if a[1] == "--badge":
        badge_main(a[2], a[3], *map(float, a[4:7]))
    else:
        main(a[1], a[2], *map(int, a[3:7]), *(int(v) for v in a[7:8]))
