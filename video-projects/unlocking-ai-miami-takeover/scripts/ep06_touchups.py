"""EP06 still touch-ups (user asked Claude to handle them). Writes R02 frames to 02-approved-storyboard/touchup/.
R01 originals stay untouched."""
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from delogo_track import fill

D = os.path.join(os.path.dirname(__file__), '..', 'episodes', '06-walter-website', '02-approved-storyboard')
O = os.path.join(D, 'touchup')
load = lambda n: np.array(Image.open(os.path.join(D, f'EP06_{n}_R01.png')).convert('RGB'))
save = lambda a, n: Image.fromarray(a).save(os.path.join(O, f'EP06_{n}_R02.png'))

def diffuse(img, mask, iters=400):
    """Fill masked pixels by repeated neighbour averaging (small-area inpaint)."""
    a = img.astype(np.float32); m = mask.copy()
    a[m] = 0
    known = ~m
    for _ in range(iters):
        s = np.zeros_like(a); c = np.zeros(m.shape, np.float32)
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            s += np.roll(np.roll(a * known[..., None], dy, 0), dx, 1)
            c += np.roll(np.roll(known.astype(np.float32), dy, 0), dx, 1)
        upd = m & (c > 0)
        a[upd] = s[upd] / c[upd][:, None]
        known = known | upd
    return a.astype(np.uint8)

# SH01: Ferrari shield on the door, two yellow wheel-centre badges
a = load('SH01')
fill(a, 557, 982, 582, 1005)
for cx, cy in ((194, 1060), (629, 1060)):
    r = 8
    yy, xx = np.ogrid[:a.shape[0], :a.shape[1]]
    disc = (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r
    hub = a[cy - r - 4:cy + r + 5, cx - r - 4:cx + r + 5].reshape(-1, 3)
    grey = np.median(hub[(hub.max(1) - hub.min(1)) < 40], axis=0)   # unsaturated hub metal
    a[disc] = grey.astype(np.uint8)
save(a, 'SH01')

# SH16A: orange smudge across BBY TIGR -> plate white, letters kept
a = load('SH16A')
x0, y0, x1, y1 = 660, 1105, 865, 1215
reg = a[y0:y1, x0:x1].astype(int)
orange = (reg[..., 0] > 170) & (reg[..., 0] - reg[..., 2] > 120) & (reg[..., 1] < reg[..., 0] - 55)
lum = reg.sum(2)
white = np.median(reg[(lum > np.percentile(lum, 80)) & ~orange].reshape(-1, 3), axis=0)
m = np.zeros(a.shape[:2], bool); m[y0:y1, x0:x1] = orange
# grow by 1px so the anti-aliased rim goes too
m = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)
a[m] = white.astype(np.uint8)
save(a, 'SH16A')

# SH16B: two motion arcs left of the card
a = load('SH16B')
H, W, _ = a.shape
yy, xx = np.mgrid[:H, :W]
# card top-left edge runs (427,437)->(475,377); keep only pixels up-left of it
side = (xx - 427) * (377 - 437) - (yy - 437) * (475 - 427)
box = (xx > 400) & (xx < 495) & (yy > 360) & (yy < 430) & (side > 40)
v = a.astype(int)
arc = box & (v[..., 0] > 200) & (v[..., 1] > 140) & (v[..., 0] - v[..., 2] > 60)
arc = arc | np.roll(arc, 1, 0) | np.roll(arc, -1, 0) | np.roll(arc, 1, 1) | np.roll(arc, -1, 1)
a = diffuse(a, arc)
save(a, 'SH16B')

# SH11B: garbled nav words ("· Image" after Services, "Aoor." before Contact)
a = load('SH11B')
def solid(a, x0, y0, x1, y1, pad=6):
    ring = a[y0-pad:y1+pad, x0-pad:x1+pad].reshape(-1, 3).astype(int)
    bar = np.median(ring[ring.sum(1) > np.percentile(ring.sum(1), 60)], axis=0)   # bar colour, not text
    a[y0:y1, x0:x1] = bar.astype(np.uint8)
solid(a, 483, 488, 544, 524)
solid(a, 592, 462, 640, 492)
save(a, 'SH11B')
print('done')
