"""Paint out a logo on a still and paste the baby tiger emblem in its place.

Usage: python3 scripts/emblem_swap.py <in.png> <out.png> <x0> <y0> <x1> <y1> <tiger_width>
  x0..y1 = logo box (filled from its border); the tiger is centred on the box, scaled to tiger_width px.
Tiger source: EP06 SH12B bezel emblem (user-approved art).
"""
import sys, os
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from delogo_track import fill

src, dst = sys.argv[1], sys.argv[2]
x0, y0, x1, y1, tw = map(int, sys.argv[3:8])
EP = os.path.join(os.path.dirname(__file__), '..', 'episodes', '06-walter-website', '02-approved-storyboard')
img = np.array(Image.open(src).convert('RGB'))
pad = 4
fill(img, x0 - pad, y0 - pad, x1 + pad, y1 + pad)

t = np.array(Image.open(os.path.join(EP, 'EP06_SH12B_R01.png')).convert('RGB').crop((228, 1288, 342, 1360))).astype(np.float32)
lum = t.mean(axis=2)
bg = np.median(lum[:, :6])
alpha = np.clip((bg - lum - 25) / 50, 0, 1)            # dark tiger on light bezel
ys, xs = np.where(alpha > 0.5)
t, alpha = t[ys.min():ys.max()+1, xs.min():xs.max()+1], alpha[ys.min():ys.max()+1, xs.min():xs.max()+1]
th = round(tw * t.shape[0] / t.shape[1])
T = np.array(Image.fromarray(t.astype(np.uint8)).resize((tw, th), Image.LANCZOS)).astype(np.float32)
A = np.array(Image.fromarray((alpha * 255).astype(np.uint8)).resize((tw, th), Image.LANCZOS)).astype(np.float32)[..., None] / 255
cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
px, py = cx - tw // 2, cy - th // 2
reg = img[py:py+th, px:px+tw].astype(np.float32)
img[py:py+th, px:px+tw] = (reg * (1 - A) + T * A).astype(np.uint8)
Image.fromarray(img).save(dst)
print(dst, 'tiger', tw, 'x', th, 'at', px, py)
