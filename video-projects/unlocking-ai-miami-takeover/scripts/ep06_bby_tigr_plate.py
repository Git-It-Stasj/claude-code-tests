"""Render the BBY TIGR Florida plate as clean artwork (user 2026-11-28: needs the Florida orange in the middle).
Cream plate, dark rim, two bolts, FLORIDA on top, BBY [orange] TIGR in condensed caps (Anton).
Writes assets/plates/BBY_TIGR_florida_plate.png (RGBA, 2:1)."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = os.path.join(ROOT, "templates/fonts/Anton-Regular.ttf")
W, H, S = 600, 300, 1
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
d.rounded_rectangle((4, 4, W - 5, H - 5), 26, fill=(246, 242, 234, 255), outline=(40, 34, 36, 255), width=8)
d.rounded_rectangle((16, 16, W - 17, H - 17), 18, outline=(120, 110, 108, 255), width=2)
for bx in (150, W - 150):
    d.ellipse((bx - 11, 26, bx + 11, 48), fill=(70, 66, 66, 255)); d.ellipse((bx - 5, 32, bx + 5, 42), fill=(170, 165, 160, 255))
top = ImageFont.truetype(F, 50)
tw = d.textlength("FLORIDA", font=top); d.text(((W - tw) / 2, 22), "FLORIDA", font=top, fill=(28, 26, 30, 255))
for size in range(172, 100, -2):                 # largest caps that fit with the orange between them
    big = ImageFont.truetype(F, size); ow = int(size * 0.56); gap = int(size * 0.09)
    l, r = "BBY", "TIGR"
    lw, rw = d.textlength(l, font=big), d.textlength(r, font=big)
    total = lw + gap + ow + gap + rw
    if total <= W - 70:
        break
x0 = (W - total) / 2; ty = 66 + (172 - size) * 0.45
d.text((x0, ty), l, font=big, fill=(22, 20, 24, 255))
d.text((x0 + lw + gap + ow + gap, ty), r, font=big, fill=(22, 20, 24, 255))
# orange: inked outline, two-tone cel shading, highlight, green leaf + stem
cx, cy = x0 + lw + gap + ow / 2, 178
d.ellipse((cx - ow / 2, cy - ow / 2, cx + ow / 2, cy + ow / 2), fill=(236, 120, 20, 255), outline=(60, 30, 10, 255), width=5)
d.chord((cx - ow / 2 + 5, cy - ow / 2 + 5, cx + ow / 2 - 5, cy + ow / 2 - 5), 20, 160, fill=(204, 92, 14, 255))
d.ellipse((cx - 30, cy - 34, cx - 8, cy - 14), fill=(255, 196, 110, 255))
d.polygon([(cx + 2, cy - ow / 2 + 2), (cx + 46, cy - ow / 2 - 26), (cx + 22, cy - ow / 2 + 8)], fill=(46, 140, 60, 255), outline=(20, 60, 25, 255))
d.line([(cx - 2, cy - ow / 2 + 4), (cx + 4, cy - ow / 2 - 12)], fill=(60, 40, 20, 255), width=5)
os.makedirs(os.path.join(ROOT, "assets/plates"), exist_ok=True)
out = os.path.join(ROOT, "assets/plates/BBY_TIGR_florida_plate.png")
im.save(out); print(out, "text span", round(total), "of", W)
