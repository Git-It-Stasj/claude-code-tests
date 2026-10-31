#!/usr/bin/env python3
"""Scene 1: page photo with a golden highlighter sweeping in sync with passage 1.

Usage:
  render_scene1.py still <t_seconds> <out.png>     # one frame
  render_scene1.py video <out.mp4>                 # full scene with audio
"""
import json
import subprocess
import sys

import numpy as np
from PIL import Image, ImageFilter

HERE = '/home/user/claude-code-tests'
PAGE = '/root/.claude/uploads/b637815a-cb09-5c60-9941-10dd084c7fd0/4a6114df-image.jpg'
AUDIO = f'{HERE}/audio/passage1_norm.wav'

import os
SPEED = float(os.environ.get('SPEED', '1.0'))   # narration tempo (pitch preserved)
OFF = 0.6            # narration starts this many seconds into the scene
TAIL = 0.9           # warm-light ramp at the very end
T_TOTAL = OFF + 20.36 / SPEED + TAIL + 0.05
FPS = 30
OUT_W, OUT_H = 1080, 1920

# word timings from the passage-1 transcription (seconds in the audio file)
WORDS = [
    ("Lamplighters", .30, .98), ("are", 1.02, 1.14), ("known", 1.16, 1.44), ("not", 1.52, 1.78),
    ("only", 1.86, 2.14), ("for", 2.18, 2.28), ("their", 2.32, 2.44), ("ability", 2.48, 2.98),
    ("to", 3.04, 3.14), ("light", 3.2, 3.4), ("lamps", 3.52, 4.06),
    ("but", 4.4, 4.56), ("also", 4.66, 5.04), ("for", 5.08, 5.2), ("having", 5.26, 5.5),
    ("a", 5.56, 5.58), ("deep", 5.86, 6.12), ("understanding", 6.2, 6.98), ("of", 7.04, 7.1),
    ("the", 7.16, 7.22), ("environment", 7.26, 7.96), ("in", 8.0, 8.1),
    ("which", 8.14, 8.34), ("they", 8.38, 8.5), ("operate.", 8.58, 9.16), ("They", 9.74, 9.92),
    ("see", 9.98, 10.1), ("the", 10.16, 10.28), ("nooks", 10.36, 10.64), ("and", 10.68, 10.78),
    ("crannies,", 10.92, 11.54), ("understand", 11.9, 12.42),
    ("challenges,", 12.54, 13.22), ("and", 13.58, 13.66), ("consider", 13.74, 14.24),
    ("the", 14.28, 14.4), ("needs", 14.48, 14.8), ("of", 14.86, 14.96), ("those", 15.0, 15.28),
    ("who", 15.3, 15.4), ("will", 15.42, 15.62), ("benefit", 15.66, 16.12), ("from", 16.18, 16.3),
    ("their", 16.34, 16.5), ("guidance.", 16.54, 17.14), ("They", 17.8, 17.9), ("are", 17.96, 18.2),
    ("doers,", 18.26, 18.82), ("not", 19.22, 19.4), ("just", 19.46, 19.68), ("talkers.", 19.74, 20.36),
]
WORDS = [(w, a / SPEED, b / SPEED) for (w, a, b) in WORDS]
LINE_WORD_COUNTS = [11, 11, 10, 11, 8]

# ---------------------------------------------------------------- page geometry
lines = json.load(open(f'{HERE}/scene1/lines.json'))
txt = np.load(f'{HERE}/scene1/txt_mask.npy')


def segment(band, xl, xr, gap):
    col = band.sum(0) > 0
    segs, s, last, g = [], None, None, 0
    for x in range(xl, xr + 1):
        if col[x]:
            if s is None:
                s = x
            last, g = x, 0
        elif s is not None:
            g += 1
            if g >= gap:
                segs.append((s, last))
                s = None
    if s is not None:
        segs.append((s, last))
    return segs


# line 5 detected 7/8 words at gap 9: lower the gap until it matches
for li, L in enumerate(lines):
    n = LINE_WORD_COUNTS[li]
    if len(L['segs']) != n:
        yc = (L['top'] + L['bot']) // 2
        band = txt[yc - 26:yc + 26, :]
        for gap in (8, 7, 6, 5, 4):
            sg = segment(band, L['xl'], L['xr'], gap)
            if len(sg) == n:
                L['segs'] = sg
                break
        else:
            # fall back: split the widest segment by character count
            sg = list(L['segs'])
            while len(sg) < n:
                i = max(range(len(sg)), key=lambda k: sg[k][1] - sg[k][0])
                a, b = sg[i]
                m = (a + b) // 2
                sg[i:i + 1] = [(a, m - 4), (m + 4, b)]
            L['segs'] = sg

# ---------------------------------------------------------------- canvas
M = 800
page = Image.open(PAGE).convert('RGB')
W0, H0 = page.size
arr = np.asarray(page).astype(np.float32) * np.array([1.16, 1.07, 0.90], np.float32)  # warm, brighter paper
page = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
cw, ch = W0 + 2 * M, H0 + 2 * M
bg = np.asarray(page.resize((cw, ch), Image.BILINEAR).filter(ImageFilter.GaussianBlur(70))).astype(np.float32) * 0.40
inset = Image.new('L', (W0, H0), 0)
inset.paste(255, (26, 26, W0 - 26, H0 - 26))
fm = np.asarray(inset.filter(ImageFilter.GaussianBlur(20))).astype(np.float32)[..., None] / 255.0
canvas = bg.copy()
canvas[M:M + H0, M:M + W0] = bg[M:M + H0, M:M + W0] * (1 - fm) + np.asarray(page).astype(np.float32) * fm
canvas = canvas.astype(np.float32)

# vignette (warm)
yy, xx = np.mgrid[0:OUT_H, 0:OUT_W].astype(np.float32)
r2 = ((xx - OUT_W / 2) / (OUT_W / 2)) ** 2 + ((yy - OUT_H * 0.46) / (OUT_H / 2)) ** 2
VIG = np.clip(1.0 - 0.30 * r2 ** 1.1, 0.52, 1.0)[..., None]
VIG = VIG * np.array([1.0, 0.97, 0.90], np.float32)

# ---------------------------------------------------------------- highlight model
GOLD = np.array([1.0, 0.78, 0.28], np.float32)   # multiply colour
HALF_H = 25
SOFT = 38.0
word_idx = []
i = 0
for n in LINE_WORD_COUNTS:
    word_idx.append(list(range(i, i + n)))
    i += n

line_static = []
for li, L in enumerate(lines):
    xl, xr = L['xl'] - 14, L['xr'] + 14
    yc_mid = (L['top'] + L['bot']) / 2.0 - 1
    k = L['slope']
    y0, y1 = int(yc_mid - HALF_H - 12 - abs(k) * 700), int(yc_mid + HALF_H + 12 + abs(k) * 700)
    ys = np.arange(y0, y1, dtype=np.float32)[:, None]
    xs = np.arange(xl, xr, dtype=np.float32)[None, :]
    yc = yc_mid + k * (xs - (L['xl'] + L['xr']) / 2.0)
    av = np.clip((HALF_H - np.abs(ys - yc)) / 4.0, 0, 1)
    left = np.clip((xs - xl) / 8.0, 0, 1)
    line_static.append(dict(y0=y0, y1=y1, xl=xl, xr=xr, av=av * left, xs=xs))


def line_pos(li, t):
    """Leading-edge x (page px) of the highlighter on line li at scene time t, or None."""
    L = lines[li]
    idx = word_idx[li]
    w = [(WORDS[j][1] + OFF, WORDS[j][2] + OFF, L['segs'][n]) for n, j in enumerate(idx)]
    if t < w[0][0] - 0.02:
        return None
    if t >= w[-1][1]:
        return float(L['xr'] + 14 + SOFT)
    for n, (s, e, seg) in enumerate(w):
        x0, x1 = seg
        if s <= t <= e:
            return x0 + (x1 - x0) * (t - s) / max(e - s, 1e-3)
        if n + 1 < len(w) and e < t < w[n + 1][0]:
            nx0 = w[n + 1][2][0]
            return x1 + (nx0 - x1) * (t - e) / max(w[n + 1][0] - e, 1e-3)
    return None


def line_alpha(li, t):
    L_end = WORDS[word_idx[li][-1]][2] + OFF
    if t < L_end + 0.25:
        return 0.88
    d = min((t - (L_end + 0.25)) / 0.6, 1.0)
    return 0.88 + (0.40 - 0.88) * d


def render_frame(t):
    work = canvas.copy()
    for li, S in enumerate(line_static):
        pos = line_pos(li, t)
        if pos is None:
            continue
        hf = np.clip((pos - S['xs']) / SOFT + 1.0, 0, 1)
        a = (S['av'] * hf * line_alpha(li, t))[..., None]
        reg = work[M + S['y0']:M + S['y1'], M + S['xl']:M + S['xr']]
        reg *= 1.0 - a * (1.0 - GOLD)
    # camera: slow push-in (~5%) with a gentle upward drift
    u = min(t / T_TOTAL, 1.0)
    z = 1.0 + 0.05 * u
    Wc = 1400.0 / z
    Hc = Wc * OUT_H / OUT_W
    cx = W0 / 2 + M
    cy = (960 - 150 * u) + M
    box = (cx - Wc / 2, cy - Hc / 2, cx + Wc / 2, cy + Hc / 2)
    img = Image.fromarray(np.clip(work, 0, 255).astype(np.uint8)).resize((OUT_W, OUT_H), Image.BICUBIC, box=box)
    f = np.asarray(img).astype(np.float32) * VIG
    # fade in from black
    f *= min(t / 0.5, 1.0)
    # warm light ramp at the end (lamp being lit)
    w = (t - (T_TOTAL - TAIL)) / TAIL
    if w > 0:
        w = min(w, 1.0)
        w = w * w * (3 - 2 * w)
        glow = np.array([255, 222, 160], np.float32)
        f = f * (1 - w) + glow * w
    return np.clip(f, 0, 255).astype(np.uint8)


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'still':
        Image.fromarray(render_frame(float(sys.argv[2]))).save(sys.argv[3])
    else:
        out = sys.argv[2]
        n = int(T_TOTAL * FPS)
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{OUT_W}x{OUT_H}',
               '-r', str(FPS), '-i', '-', '-i', AUDIO,
               '-af', f'atempo={SPEED},adelay={int(OFF * 1000)}|{int(OFF * 1000)},apad=whole_dur={T_TOTAL:.3f}',
               '-t', f'{T_TOTAL:.3f}', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
               '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for i in range(n):
            p.stdin.write(render_frame(i / FPS).tobytes())
        p.stdin.close()
        p.wait()
