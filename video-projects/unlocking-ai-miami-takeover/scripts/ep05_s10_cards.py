"""EP05 S10: replace the garbled AI card arrival with an exact 1-2-3-4 reveal built from the approved end frame.

v3 (user's call): the Kling clip plays continuously from 0s; the four exact cards (cut from S10_end_cards.png)
fly out of the phone one by one starting CARD_AT and stay pasted on top (they cover the model's own garbled cards),
and the gold 'Draft ready for review' pill pops in at BADGE_AT. The shot is LEN seconds.
Usage: python3 scripts/ep05_s10_cards.py <kling_clip.mp4> <out.mp4>
"""
import subprocess, sys, os, tempfile, shutil
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
END = os.path.join(ROOT, 'episodes/05-penny-seo-content/keyframes/S10_end_cards.png')
src, out = sys.argv[1], sys.argv[2]
FPS = 24
CARD_AT, LEN = 0.75, 5.0
# card boxes in end-still pixels (941x1672): x0, y0, x1, y1 (incl. glow + chevron below)
CARDS = [(240, 630, 630, 852), (220, 840, 655, 1060), (200, 1050, 705, 1285), (165, 1275, 725, 1540)]
ORIGIN = (470, 600)        # bottom of the phone, where cards emerge
STARTS = [0.0, 0.4, 0.8, 1.2]  # seconds into B
DUR = 0.4
BADGE = (190, 1538, 700, 1632)  # gold 'Draft ready for review' pill, in end-still pixels
BADGE_AT, BADGE_DUR = 2.75, 0.25  # 0.4s after the last card lands

tmp = tempfile.mkdtemp()
def ff(*a): subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)
ff('-i', src, '-vf', f'fps={FPS}', os.path.join(tmp, 'k%04d.png'))
kf = sorted(f for f in os.listdir(tmp) if f.startswith('k'))
# v4 (user-caught): the Kling clip grows its own cards from ~2.9s, which peeked out under the pasted ones.
# Base = clean 0-BASE_END, then ping-pong back and forth over the last BACK seconds, so no model cards ever show.
BASE_END, BACK = 2.6, 1.2
n_end, n_back = int(BASE_END*FPS), int(BACK*FPS)
idx = list(range(n_end))
while len(idx) < int(LEN*FPS):
    idx += list(range(n_end-2, n_end-n_back-1, -1)) + list(range(n_end-n_back+1, n_end))
kf = [kf[i] for i in idx[:int(LEN*FPS)]]
W, H = Image.open(os.path.join(tmp, kf[0])).size
end = Image.open(END).convert('RGB').resize((W, H), Image.LANCZOS)
sx, sy = W / 941, H / 1672

sprites = []
for (x0, y0, x1, y1) in CARDS:
    box = (round(x0*sx), round(y0*sy), round(x1*sx), round(y1*sy))
    spr = end.crop(box)
    m = Image.new('L', spr.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([4, 4, spr.size[0]-5, spr.size[1]-5], radius=34, fill=255)
    sprites.append((box, spr, m.filter(ImageFilter.GaussianBlur(4))))

bbox = (round(BADGE[0]*sx), round(BADGE[1]*sy), round(BADGE[2]*sx), round(BADGE[3]*sy))
bspr = end.crop(bbox)
bm = Image.new('L', bspr.size, 0)
ImageDraw.Draw(bm).rounded_rectangle([3, 3, bspr.size[0]-4, bspr.size[1]-4], radius=40, fill=255)
bm = bm.filter(ImageFilter.GaussianBlur(4))
def badge(f, t):
    p = (t - BADGE_AT) / BADGE_DUR
    if p <= 0: return
    p = min(p, 1.0); s = 0.85 + 0.15*(1 - (1-p)**3)
    w, h = int(bspr.size[0]*s), int(bspr.size[1]*s)
    cx, cy = (bbox[0]+bbox[2])/2, (bbox[1]+bbox[3])/2
    f.paste(bspr.resize((w, h), Image.LANCZOS), (int(cx-w/2), int(cy-h/2)), bm.resize((w, h)).point(lambda v: int(v*p)))
def ease(t): return 1 - (1 - t) ** 3
frames = []
for i in range(min(len(kf), int(LEN*FPS))):
    t = i / FPS; f = Image.open(os.path.join(tmp, kf[i])).convert('RGB')
    for (box, spr, m), st in zip(sprites, STARTS):
        p = (t - CARD_AT - st) / DUR
        if p <= 0: continue
        p = min(p, 1.0); e = ease(p)
        s = 0.25 + 0.75*e
        w, h = max(1, int(spr.size[0]*s)), max(1, int(spr.size[1]*s))
        cx0, cy0 = ORIGIN[0]*sx, ORIGIN[1]*sy
        cx1, cy1 = (box[0]+box[2])/2, (box[1]+box[3])/2
        cx, cy = cx0 + (cx1-cx0)*e, cy0 + (cy1-cy0)*e
        a = m.resize((w, h)).point(lambda v: int(v*min(1.0, p/0.4)))
        f.paste(spr.resize((w, h), Image.LANCZOS), (int(cx-w/2), int(cy-h/2)), a)
    badge(f, t)
    frames.append(f)
for j, f in enumerate(frames): f.save(os.path.join(tmp, f'o{j:04d}.png'))
ff('-framerate', str(FPS), '-i', os.path.join(tmp, 'o%04d.png'), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', out)
shutil.rmtree(tmp)
print(out, len(frames)/FPS, 's')
