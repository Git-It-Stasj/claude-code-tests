#!/usr/bin/env python3
"""Digitally re-frame MiniMax clip 1 so its zoom hands off to clip 2's tight start frame.

MiniMax pulled back further than asked. We measure each frame's zoom/offset against frame 0
(normalised cross-correlation over scale), then crop the 2K frame so the viewport eases from
clip 1's own first framing to the framing clip 2 starts on.
"""
import subprocess
import sys

import numpy as np
from PIL import Image

HERE = '/home/user/claude-code-tests/mm'
SRC, NEXT, OUT = f'{HERE}/mm_clip1.mp4', f'{HERE}/mm_clip2.mp4', f'{HERE}/mm_clip1_stab.mp4'
FPS = 30
W, H = 288, 512                    # analysis size
NW, NH = 1440, 2560                # native size
OW, OH = 1080, 1920


def frames(path, fps, w=W, h=H):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-vf', f'fps={fps},scale={w}:{h},format=gray',
                          '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)


def place(F, R, scales):
    """Best (ncc, s, dx, dy) for R scaled by s placed inside F."""
    Hh, Ww = F.shape
    F2 = F * F
    iF = np.pad(F, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    iF2 = np.pad(F2, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    fF = np.fft.rfft2(F)
    best = (-2, 1.0, 0, 0)
    for s in scales:
        th, tw = int(round(Hh * s)), int(round(Ww * s))
        T = np.asarray(Image.fromarray(R.astype(np.uint8)).resize((tw, th), Image.BILINEAR), np.float32)
        Tz = T - T.mean()
        tn = np.sqrt((Tz ** 2).sum()) + 1e-6
        Tp = np.zeros_like(F)
        Tp[:th, :tw] = Tz
        corr = np.fft.irfft2(fF * np.conj(np.fft.rfft2(Tp)), s=F.shape)
        vh, vw = Hh - th + 1, Ww - tw + 1
        num = corr[:vh, :vw]
        n = th * tw
        s1 = iF[th:th + vh, tw:tw + vw] - iF[:vh, tw:tw + vw] - iF[th:th + vh, :vw] + iF[:vh, :vw]
        s2 = iF2[th:th + vh, tw:tw + vw] - iF2[:vh, tw:tw + vw] - iF2[th:th + vh, :vw] + iF2[:vh, :vw]
        den = np.sqrt(np.maximum(s2 - s1 * s1 / n, 1e-3)) * tn
        ncc = num / den
        iy, ix = np.unravel_index(np.argmax(ncc), ncc.shape)
        if ncc[iy, ix] > best[0]:
            best = (float(ncc[iy, ix]), float(s), int(ix), int(iy))
    return best


def smooth(a, k=7):
    a = np.asarray(a, float)
    pad = np.pad(a, (k // 2, k // 2), mode='edge')
    return np.convolve(pad, np.ones(k) / k, mode='valid')


def main():
    AF = 15
    fr = frames(SRC, AF)
    R = fr[0]
    scales = np.arange(0.50, 1.0001, 0.02)
    res = [place(f, R, scales) for f in fr]
    nccs = np.array([r[0] for r in res])
    s = smooth([r[1] for r in res])
    dx = smooth([r[2] for r in res])
    dy = smooth([r[3] for r in res])
    print('frames', len(fr), 'min ncc %.2f' % nccs.min(), 'scale first/mid/last %.2f %.2f %.2f' % (s[0], s[len(s) // 2], s[-1]))

    # where clip 2's first frame sits relative to clip 1's first frame
    c2 = frames(NEXT, AF)[0]
    n2, s2, dx2, dy2 = place(c2, R, np.arange(0.50, 1.0001, 0.01))
    # clip-1-frame0 coordinates (0..1) spanned by clip 2's first frame
    vx0, vx1 = -dx2 / (s2 * W), (W - dx2) / (s2 * W)
    vy0, vy1 = -dy2 / (s2 * H), (H - dy2) / (s2 * H)
    print('clip2 start vs clip1 frame0: ncc %.2f scale %.2f -> viewport x %.2f..%.2f y %.2f..%.2f' % (n2, s2, vx0, vx1, vy0, vy1))
    Vend = np.array([vx0, vy0, vx1, vy1])
    Vstart = np.array([0.0, 0.0, 1.0, 1.0])

    n_out = int(round(len(fr) / AF * FPS))
    t_src = np.arange(len(fr)) / AF
    t_out = np.arange(n_out) / FPS
    s_i = np.interp(t_out, t_src, s)
    dx_i = np.interp(t_out, t_src, dx)
    dy_i = np.interp(t_out, t_src, dy)

    dur = n_out / FPS
    cmd_in = ['ffmpeg', '-loglevel', 'error', '-i', SRC, '-vf', f'fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    cmd_out = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{OW}x{OH}', '-r', str(FPS),
               '-i', '-', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', OUT]
    pin = subprocess.Popen(cmd_in, stdout=subprocess.PIPE)
    pout = subprocess.Popen(cmd_out, stdin=subprocess.PIPE)
    fb = NW * NH * 3
    k = 0
    minw = 1e9
    while True:
        buf = pin.stdout.read(fb)
        if len(buf) < fb or k >= n_out:
            break
        t = k / FPS
        a = min(t / 6.56, 1.0)
        a = a * a * (3 - 2 * a) * 0.0 + a              # linear ease toward clip 2's framing
        V = Vstart + (Vend - Vstart) * a
        # viewport (clip-1 frame-0 coords) -> analysis pixels of frame k -> native pixels
        x0 = (V[0] * s_i[k] * W + dx_i[k]) * (NW / W)
        x1 = (V[2] * s_i[k] * W + dx_i[k]) * (NW / W)
        y0 = (V[1] * s_i[k] * H + dy_i[k]) * (NH / H)
        y1 = (V[3] * s_i[k] * H + dy_i[k]) * (NH / H)
        # keep 9:16 and inside the frame
        cxm, cym = (x0 + x1) / 2, (y0 + y1) / 2
        hh = min((y1 - y0) / 2, NH / 2)
        ww = hh * OW / OH
        cxm = min(max(cxm, ww), NW - ww)
        cym = min(max(cym, hh), NH - hh)
        minw = min(minw, 2 * ww)
        img = Image.frombuffer('RGB', (NW, NH), buf, 'raw', 'RGB', 0, 1)
        img = img.resize((OW, OH), Image.LANCZOS, box=(cxm - ww, cym - hh, cxm + ww, cym + hh))
        pout.stdin.write(img.tobytes())
        k += 1
    pout.stdin.close()
    pout.wait()
    pin.terminate()
    print('wrote', OUT, k, 'frames; narrowest crop %.0f px wide (need >= 1080 for full sharpness)' % minw)


if __name__ == '__main__':
    main()
