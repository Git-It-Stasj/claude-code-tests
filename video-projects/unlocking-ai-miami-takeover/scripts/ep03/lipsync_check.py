"""Lip-sync QA: mouth-band motion (lipsync output) vs input-audio level, per 0.25s; plus a mouth crop strip.
usage: lipsync_check.py lipsync.mp4 audio.mp3 x0 y0 w h strip.jpg"""
import sys, subprocess, io, numpy as np
from PIL import Image
p, a, x0, y0, w, h, out = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7]), sys.argv[7]
raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", p, "-vf", f"crop={w}:{h}:{x0}:{y0},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(float); m = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))
aud = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", a, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], capture_output=True).stdout
x = np.abs(np.frombuffer(aud, np.int16).astype(float)); n = len(f) / 24
print("t(s):   ", [round(i * .25, 2) for i in range(int(n * 4))])
print("motion: ", [round(float(m[i:i + 6].mean()), 1) for i in range(0, len(m), 6)])
print("audio:  ", [int(x[i:i + 2000].mean()) for i in range(0, len(x), 2000)][:int(n * 4)])
rgb = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", p, "-vf", f"crop={w}:{h}:{x0}:{y0},fps=6", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
fr = np.frombuffer(rgb, np.uint8).reshape(-1, h, w, 3)
Image.fromarray(np.hstack(list(fr))).save(out, quality=88)
