#!/usr/bin/env python3
"""3 s closing card: Noelle Russell's book floating and spinning, with the credit line.

Textures come from the user's own front/back cover photos. The spine is redrawn (the spine
photo is at a steep diagonal). Output: closing_card.mp4 (video only, 1080x1920, 30 fps).
"""
import math
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = '/home/user/claude-code-tests'
PHOTOS = '/root/.claude/uploads/b637815a-cb09-5c60-9941-10dd084c7fd0/'
OUT = f'{HERE}/closing/closing_card.mp4'
W_, H_ = 1080, 1920
FPS, DUR = 30, 3.0

# ---- textures --------------------------------------------------------------
def _paint(im, box, ref):
    from PIL import ImageDraw as _D
    c = im.getpixel(ref)
    _D.Draw(im).rectangle(box, fill=c)
    return im


_f = Image.open(PHOTOS + 'd4efbf48-image.jpg').convert('RGB')
_f = _paint(_f, (190, 1040, 336, 1258), (700, 1000))      # thumb on the left edge of the cover
front = _f.crop((208, 100, 1408, 1955))
_b = Image.open(PHOTOS + 'c654c8e5-image.jpg').convert('RGB')
_b = _paint(_b, (150, 1430, 310, 1635), (900, 1560))      # finger at the lower-left of the back cover
back = _b.crop((175, 95, 1420, 1960))
front = front.resize((840, int(840 * front.size[1] / front.size[0])), Image.LANCZOS)
back = back.resize((840, int(840 * back.size[1] / back.size[0])), Image.LANCZOS)
BW, BH = 1.0, front.size[1] / front.size[0]     # book width / height in world units
BT = 0.20                                         # thickness

NAVY, GOLD, PAPER = (24, 34, 58), (170, 138, 52), (244, 241, 232)


def make_spine():
    tw, th = 340, int(340 * BH / BT)              # texture is T wide, H tall
    t = Image.new('RGB', (tw, th), PAPER)
    d = ImageDraw.Draw(t)
    bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    serif = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'

    def rot_text(txt, font, fill, cx, cy):
        f = ImageFont.truetype(font[0], font[1])
        bb = d.textbbox((0, 0), txt, font=f)
        im = Image.new('RGBA', (bb[2] + 10, bb[3] + 10), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((0, 0), txt, font=f, fill=fill)
        im = im.rotate(-90, expand=True)           # reads top to bottom
        t.paste(im, (int(cx - im.size[0] / 2), int(cy - im.size[1] / 2)), im)
        return im.size[1]

    rot_text('RUSSELL', (serif, 30), (110, 110, 110), tw / 2, th * 0.07)
    h1 = rot_text('SCALING', (bold, 98), NAVY, tw / 2, th * 0.26)
    h2 = rot_text('RESPONSIBLE', (bold, 98), GOLD, tw / 2, th * 0.55)
    rot_text('AI', (bold, 98), NAVY, tw / 2, th * 0.80)
    rot_text('WILEY', (serif, 34), (40, 40, 40), tw / 2, th * 0.945)
    return t


spine = make_spine()


def make_pages(w=200, h=600, horizontal=False):
    a = np.full((h, w, 3), 238, np.float32)
    rng = np.random.default_rng(3)
    lines = (np.sin(np.arange(h if not horizontal else w) * 1.9) * 0.5 + 0.5) * 9
    if horizontal:
        a -= lines[None, :, None]
    else:
        a -= lines[:, None, None]
    a += rng.normal(0, 1.5, a.shape)
    a[..., 2] -= 6
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


pages_side = make_pages(240, 700)
pages_top = make_pages(700, 240, horizontal=True)

# faces: texture, corners TL,TR,BR,BL (world coords), outward normal
w2, h2, t2 = BW / 2, BH / 2, BT / 2
FACES = [
    ('front', front, [(-w2, h2, t2), (w2, h2, t2), (w2, -h2, t2), (-w2, -h2, t2)], (0, 0, 1), 1.00),
    ('back', back, [(w2, h2, -t2), (-w2, h2, -t2), (-w2, -h2, -t2), (w2, -h2, -t2)], (0, 0, -1), 0.92),
    ('spine', spine, [(-w2, h2, -t2), (-w2, h2, t2), (-w2, -h2, t2), (-w2, -h2, -t2)], (-1, 0, 0), 0.95),
    ('edge', pages_side, [(w2, h2, t2), (w2, h2, -t2), (w2, -h2, -t2), (w2, -h2, t2)], (1, 0, 0), 0.85),
    ('top', pages_top, [(-w2, h2, -t2), (w2, h2, -t2), (w2, h2, t2), (-w2, h2, t2)], (0, 1, 0), 1.0),
    ('bottom', pages_top, [(-w2, -h2, t2), (w2, -h2, t2), (w2, -h2, -t2), (-w2, -h2, -t2)], (0, -1, 0), 0.6),
]

# ---- camera ----------------------------------------------------------------
D = 6.0
SCALE = 645.0 * 6.0 * 2   # px per world unit at the book plane x D x supersample
SS = 2                                      # supersample factor


def rot(p, th, ph):
    x, y, z = p
    x1 = x * math.cos(th) + z * math.sin(th)
    z1 = -x * math.sin(th) + z * math.cos(th)
    y2 = y * math.cos(ph) - z1 * math.sin(ph)
    z2 = y * math.sin(ph) + z1 * math.cos(ph)
    return np.array([x1, y2, z2])


def project(p, cx, cy):
    s = SCALE / (D - p[2])
    return (cx + s * p[0], cy - s * p[1])


def persp_coeffs(dst, src):
    """Coefficients for PIL PERSPECTIVE mapping output (dst) pixels -> source pixels."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float))


LIGHT = np.array([-0.35, 0.55, 0.76]); LIGHT /= np.linalg.norm(LIGHT)

# ---- background ------------------------------------------------------------
yy, xx = np.mgrid[0:H_, 0:W_].astype(np.float32)
r = np.sqrt(((xx - W_ / 2) / (W_ * 0.62)) ** 2 + ((yy - H_ * 0.43) / (H_ * 0.40)) ** 2)
glow = np.clip(1 - r, 0, 1) ** 1.6
BG = np.zeros((H_, W_, 3), np.float32)
BG[..., 0] = 20 + 120 * glow
BG[..., 1] = 12 + 70 * glow
BG[..., 2] = 8 + 32 * glow
vig = np.clip(1 - 0.35 * (((xx - W_ / 2) / (W_ / 2)) ** 2 + ((yy - H_ / 2) / (H_ / 2)) ** 2), 0.4, 1)[..., None]
BG *= vig


def ease(u):
    u = min(max(u, 0), 1)
    return u * u * (3 - 2 * u)


def credit_layer(alpha):
    lay = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 46)
    f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 38)
    col = (244, 226, 190, int(255 * alpha))
    for txt, f, y in (('From Scaling Responsible AI', f1, 1560), ('by Noelle Russell (Wiley)', f2, 1632)):
        bb = d.textbbox((0, 0), txt, font=f)
        d.text(((W_ - bb[2]) / 2, y), txt, font=f, fill=col)
    return lay


def render_frame(t):
    u = t / DUR
    th = 2 * math.pi * ease(t / 2.55)              # one full turn, lands facing front
    ph = math.radians(10 + 4 * math.sin(2 * math.pi * u))
    bob = 14 * math.sin(2 * math.pi * (t / DUR) * 1.0)
    cx, cy = W_ * SS / 2, (H_ * 0.43 - bob) * SS
    canvas = Image.new('RGB', (W_ * SS, H_ * SS), (0, 0, 0))
    mask = Image.new('L', (W_ * SS, H_ * SS), 0)
    cam = np.array([0, 0, D])
    drawn = []
    for name, tex, corners, normal, base in FACES:
        pc = [rot(c, th, ph) for c in corners]
        n = rot(normal, th, ph)
        ctr = sum(pc) / 4
        if np.dot(n, cam - ctr) <= 0:
            continue
        drawn.append((ctr[2], name, tex, pc, n, base))
    drawn.sort(key=lambda x: x[0])
    for _, name, tex, pc, n, base in drawn:
        dst = [project(p, cx, cy) for p in pc]
        tw, thh = tex.size
        src = [(0, 0), (tw, 0), (tw, thh), (0, thh)]
        xs = [p[0] for p in dst]; ys = [p[1] for p in dst]
        x0, y0 = int(max(min(xs) - 2, 0)), int(max(min(ys) - 2, 0))
        x1, y1 = int(min(max(xs) + 3, W_ * SS)), int(min(max(ys) + 3, H_ * SS))
        local = [(px - x0, py - y0) for px, py in dst]
        co = persp_coeffs(local, src)
        warped = tex.transform((x1 - x0, y1 - y0), Image.PERSPECTIVE, tuple(co), Image.BICUBIC)
        shade = base * (0.52 + 0.48 * max(float(np.dot(n, LIGHT)), 0.0))
        arr = np.clip(np.asarray(warped).astype(np.float32) * shade * 1.10, 0, 255).astype(np.uint8)
        fm = Image.new('L', (x1 - x0, y1 - y0), 0)
        ImageDraw.Draw(fm).polygon(local, fill=255)
        canvas.paste(Image.fromarray(arr), (x0, y0), fm)
        mask.paste(255, (x0, y0), fm)
    book = canvas.resize((W_, H_), Image.LANCZOS)
    bm = mask.resize((W_, H_), Image.LANCZOS)
    # soft floor shadow that breathes with the bob
    sh = Image.new('L', (W_, H_), 0)
    sw = 330 - 10 * math.sin(2 * math.pi * u)
    ImageDraw.Draw(sh).ellipse([W_ / 2 - sw, 1470 - 34, W_ / 2 + sw, 1470 + 34], fill=120)
    sh = np.asarray(sh.filter(ImageFilter.GaussianBlur(26))).astype(np.float32)[..., None] / 255
    base_img = BG * (1 - sh * 0.7)
    out = np.asarray(book).astype(np.float32) * (np.asarray(bm).astype(np.float32)[..., None] / 255) + \
        base_img * (1 - np.asarray(bm).astype(np.float32)[..., None] / 255)
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert('RGBA')
    a = ease((t - 1.35) / 0.5)
    if a > 0:
        img = Image.alpha_composite(img, credit_layer(a))
    return img.convert('RGB')


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'still':
        render_frame(float(sys.argv[2])).save(sys.argv[3])
    else:
        n = int(DUR * FPS)
        p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W_}x{H_}',
                              '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
                              '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
        for i in range(n):
            p.stdin.write(render_frame(i / FPS).tobytes())
        p.stdin.close(); p.wait()
        print('wrote', OUT)
