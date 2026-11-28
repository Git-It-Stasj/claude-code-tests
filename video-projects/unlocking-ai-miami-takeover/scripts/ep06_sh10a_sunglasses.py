"""SH10A: turn Noelle's clear lens into a dark sunglasses lens (user note: she wears sunglasses in S10A too; the Grok take swapped them for clear glasses).
Writes 02-approved-storyboard/touchup/EP06_SH10A_R03.png. Lens polygon is in frame pixels (941x1670)."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SB = os.path.join(ROOT, "episodes/06-walter-website/02-approved-storyboard")
im = Image.open(os.path.join(SB, "touchup/EP06_SH10A_R02.png")).convert("RGB")
ox, oy, s = 150, 450, 4  # polygon drawn on a 4x crop at (150,450)
poly = [(300, 168), (432, 162), (428, 250), (414, 330), (398, 352), (372, 334), (346, 284), (318, 222)]
poly = [(ox + x / s, oy + y / s) for x, y in poly]
mask = Image.new("L", im.size, 0); ImageDraw.Draw(mask).polygon(poly, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.7))
a = np.asarray(im, np.float32); m = np.asarray(mask, np.float32)[..., None] / 255
yy = np.arange(im.size[1], dtype=np.float32)[:, None, None]
t = np.clip((yy - (oy + 42)) / 45, 0, 1)                       # top -> bottom gradient
lens = np.array([22, 16, 24], np.float32) * (1 - t) + np.array([48, 30, 36], np.float32) * t
lens = lens + 0.12 * a                                          # keep a faint hint of what's behind
xx = np.arange(im.size[0], dtype=np.float32)[None, :, None]
streak = np.exp(-(((xx - (ox + 400 / s)) + (yy - (oy + 200 / s)) * 0.35) / 1.6) ** 2) * (np.abs(yy - (oy + 205 / s)) < 9)
lens = lens + streak * 110                                      # small specular glint, matches frame art
out = a * (1 - m) + lens * m
os.makedirs(os.path.join(SB, "touchup"), exist_ok=True)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(os.path.join(SB, "touchup/EP06_SH10A_R03.png"))
print("ok")
