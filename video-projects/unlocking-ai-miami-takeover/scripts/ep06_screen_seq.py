"""EP06 Walter screen sequence (SH10B -> SH11A -> SH11B -> SH12A -> SH12B) as one composited clip.

The five approved stills share the monitor angle but are not pixel-aligned, so transitions are
full-frame (light-bar wipe, flash dissolve, scan sweep) rather than per-region reveals.
Each segment gets a slow push-in. Output: 1080x1920, 24 fps, silent.

Usage: python3 scripts/ep06_screen_seq.py [out.mp4]
Segment timings (seconds) are in SEGMENTS; transitions sit at the start of each segment.
"""
import os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SB = os.path.join(ROOT, "episodes/06-walter-website/02-approved-storyboard")
W, H, FPS = 1080, 1920, 24

# (frame file, segment length s, transition into this segment, transition length s)
SEGMENTS = [
    ("touchup/EP06_SH10B_R02.png", 1.9, None, 0.0),
    ("EP06_SH11A_R01.png",         1.4, "flash", 0.25),
    ("touchup/EP06_SH11B_R02.png", 1.4, "lightbar", 0.45),
    ("EP06_SH12A_R01.png",         0.9, "flash", 0.2),
    ("EP06_SH12B_R01.png",         0.9, "scan", 0.45),
]
PUSH = 0.045  # zoom gained over each segment


def load(f):
    im = Image.open(os.path.join(SB, f)).convert("RGB")
    return im.resize((W, H), Image.LANCZOS)


def zoom(im, s):
    """Center push-in: scale s >= 1, aimed slightly above center (monitor)."""
    w, h = int(W * s), int(H * s)
    big = im.resize((w, h), Image.BILINEAR)
    x0 = (w - W) // 2
    y0 = int((h - H) * 0.42)
    return np.asarray(big.crop((x0, y0, x0 + W, y0 + H)), dtype=np.float32)


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


def transition(kind, a, b, p):
    """Blend frame a -> b at progress p (0..1)."""
    if kind == "flash":
        k = ease(p)
        out = a * (1 - k) + b * k
        glow = np.sin(np.pi * p) * 0.35
        return out + (255 - out) * glow
    xx = np.arange(W, dtype=np.float32)[None, :, None]
    yy = np.arange(H, dtype=np.float32)[:, None, None]
    if kind == "lightbar":  # diagonal light bar sweeps left->right, revealing b behind it
        edge = -300 + (W + 600) * ease(p)
        pos = xx + (yy - H / 2) * 0.25
        m = np.clip((edge - pos) / 60 + 0.5, 0, 1)
        out = a * (1 - m) + b * m
        bar = np.exp(-((pos - edge) / 45) ** 2)
        tint = np.array([235, 200, 255], np.float32)
        return out * (1 - 0.85 * bar) + tint * 0.85 * bar
    if kind == "scan":  # top->bottom scan line with a blueprint-grid glow trailing it
        edge = -150 + (H + 300) * ease(p)
        m = np.clip((edge - yy) / 40 + 0.5, 0, 1)
        out = a * (1 - m) + b * m
        line = np.exp(-((yy - edge) / 18) ** 2)
        grid = ((xx % 60 < 2) | (yy % 60 < 2)).astype(np.float32)
        trail = np.exp(-np.clip(edge - yy, 0, None) / 160) * (yy < edge)
        g = np.clip(line + 0.35 * grid * trail, 0, 1)
        tint = np.array([140, 220, 255], np.float32)
        return out * (1 - 0.8 * g) + tint * 0.8 * g
    raise ValueError(kind)


def main(out):
    frames = [load(f) for f, *_ in SEGMENTS]
    total = sum(s[1] for s in SEGMENTS)
    n = int(round(total * FPS))
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    starts = np.cumsum([0] + [s[1] for s in SEGMENTS])
    for i in range(n):
        t = i / FPS
        k = min(int(np.searchsorted(starts, t, side="right") - 1), len(SEGMENTS) - 1)
        _, dur, kind, tl = SEGMENTS[k]
        local = t - starts[k]
        cur = zoom(frames[k], 1 + PUSH * local / dur)
        if kind and local < tl:
            prev_dur = SEGMENTS[k - 1][1]
            prev = zoom(frames[k - 1], 1 + PUSH * (1 + local / prev_dur))
            cur = transition(kind, prev, cur, local / tl)
        p.stdin.write(np.clip(cur, 0, 255).astype(np.uint8).tobytes())
    p.stdin.close()
    p.wait()
    print(out, f"{total:.2f}s", "segment starts:", [round(float(s), 2) for s in starts[:-1]])


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        ROOT, "episodes/06-walter-website/04-generated-clips/EP06_SH10B-12B_SCREEN_R02.mp4"))
