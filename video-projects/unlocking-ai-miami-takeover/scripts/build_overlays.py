"""Render transparent 1080x1920 overlay PNGs for the vertical edit.

Usage: python3 scripts/build_overlays.py <episode_manifest.json> <out_dir>
Produces: title.png, endcard.png, <lower_third.file> (default rachel_lt.png), cap_<id>.png
"""
import json, sys, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "templates", "fonts")
BANG = os.path.join(FONTS, "Bangers-Regular.ttf")
ANTON = os.path.join(FONTS, "Anton-Regular.ttf")
W, H = 1080, 1920
YELLOW = (255, 214, 10, 255)
PINK = (255, 46, 160, 255)
WHITE = (255, 255, 255, 255)
BLACK = (10, 8, 14, 255)


def font(path, size):
    return ImageFont.truetype(path, size)


def text_w(d, s, f):
    b = d.textbbox((0, 0), s, font=f)
    return b[2] - b[0], b[3] - b[1]


def label(img, cx, y, s, f, fg, bg=BLACK, pad=(28, 14), skew=-0.12, stroke=0, stroke_fill=BLACK):
    """Comic-book slanted label (poster style): black parallelogram + text."""
    d = ImageDraw.Draw(img)
    tw, th = text_w(d, s, f)
    bw, bh = tw + pad[0] * 2, th + pad[1] * 2
    x0 = cx - bw // 2
    off = int(bh * abs(skew))
    d.polygon([(x0 + off, y), (x0 + bw + off, y), (x0 + bw - off, y + bh), (x0 - off, y + bh)], fill=bg)
    d.text((cx - tw // 2, y + pad[1] - d.textbbox((0, 0), s, font=f)[1]), s, font=f, fill=fg,
           stroke_width=stroke, stroke_fill=stroke_fill)
    return y + bh


def big(img, cx, y, s, f, fg, stroke=8, stroke_fill=BLACK, shadow=PINK):
    d = ImageDraw.Draw(img)
    tw, th = text_w(d, s, f)
    top = d.textbbox((0, 0), s, font=f)[1]
    d.text((cx - tw // 2 + 8, y - top + 8), s, font=f, fill=shadow, stroke_width=stroke, stroke_fill=shadow)
    d.text((cx - tw // 2, y - top), s, font=f, fill=fg, stroke_width=stroke, stroke_fill=stroke_fill)
    return y + th


def endcard(m, out):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # soft dark scrim behind the text block for legibility over sky
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    for i in range(0, 900):
        a = int(150 * (1 - i / 900))
        sd.line([(0, 150 + i), (W, 150 + i)], fill=(20, 0, 40, a))
    img.alpha_composite(scrim)
    l = m["end_card"]["lines"]
    y = 230
    y = big(img, W // 2, y, l[0].replace(" CHALLENGE", ""), font(BANG, 150), YELLOW) + 6   # UNLOCKING AI
    y = big(img, W // 2, y, "CHALLENGE", font(BANG, 150), YELLOW) + 34
    y = label(img, W // 2, y, l[1], font(ANTON, 50), WHITE) + 40                            # BUILD AN AI-AMPLIFIED BUSINESS
    y = big(img, W // 2, y, l[2], font(BANG, 132), WHITE, shadow=PINK) + 30                 # BLACK FRIDAY
    y = label(img, W // 2, y, l[3], font(ANTON, 58), YELLOW) + 22                           # FRIDAY, NOVEMBER 27, 2026
    y = label(img, W // 2, y, f"{l[4]}  •  {l[5]}", font(ANTON, 58), BLACK, bg=YELLOW)      # 3:00-5:00 PM ET • LIVE
    # registration pill, above bottom UI safe zone
    url = m["end_card"]["registration"]
    label(img, W // 2, 1650, "REGISTER: " + url, font(ANTON, 44), WHITE, bg=PINK, skew=-0.08)
    img.save(out)


def title(out):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = 190
    y = big(img, W // 2, y, "UNLOCKING AI", font(BANG, 120), WHITE, shadow=(0, 0, 0, 180)) + 4
    big(img, W // 2, y, "MIAMI TAKEOVER", font(BANG, 132), PINK, stroke=8, shadow=(0, 0, 0, 180))
    img.save(out)


def employee_lt(out, name="RACHEL", role="AI RECEPTIONIST"):
    """AI-employee name label (top of frame, clear of captions) + 'Dramatization' note."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = label(img, W // 2, 210, name.upper(), font(BANG, 92), YELLOW) + 10
    label(img, W // 2, y, role.upper(), font(ANTON, 46), WHITE)
    d = ImageDraw.Draw(img)
    s, f = "Dramatization", font(ANTON, 28)
    tw, _ = text_w(d, s, f)
    d.text(((W - tw) // 2, 1560), s, font=f, fill=(255, 255, 255, 190), stroke_width=2, stroke_fill=BLACK)
    img.save(out)


def caption(text, out, y=1330):
    """Burned-in subtitle, mobile-safe (above bottom UI, clear of right rail)."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = font(ANTON, 62)
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if text_w(d, t, f)[0] > 860 and cur:
            lines.append(cur); cur = w_
        else:
            cur = t
    lines.append(cur)
    for i, ln in enumerate(lines):
        tw, th = text_w(d, ln, f)
        d.text(((W - tw) // 2, y + i * 82), ln, font=f, fill=WHITE, stroke_width=7, stroke_fill=BLACK)
    img.save(out)


if __name__ == "__main__":
    m = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    endcard(m, os.path.join(out, "endcard.png"))
    title(os.path.join(out, "title.png"))
    lt = m.get("lower_third", {"name": "RACHEL", "role": "AI RECEPTIONIST", "file": "rachel_lt.png"})
    employee_lt(os.path.join(out, lt.get("file", "employee_lt.png")), lt["name"], lt["role"])
    for c in m.get("captions", []):
        caption(c["text"], os.path.join(out, f"cap_{c['id']}.png"))
    print("ok")
