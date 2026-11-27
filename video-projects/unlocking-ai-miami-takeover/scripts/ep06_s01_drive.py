"""EP06 S01 drive rig: locked Ferrari+Noelle over a multi-layer parallax Miami street.

Deterministic compositing (no generative video). Inputs in episodes/06-walter-website/08-s01-drive/:
  plate_full.png      SH01_R02 upscaled to 1080x1920 (car source; final frame matches it)
  car_mask.png        Ferrari+Noelle alpha (scripts/ep06_s01_mask.py)
  clean_plate_R01.png Delgado with the car removed
  store1..4_R01.png   new storefront plates sharing Delgado's camera/street geometry

World layout, left -> right: store1 store2 store3 store4 delgado. The car drives right, so the
world scrolls right-to-left and the take ends with Delgado exactly where it is in SH01_R02.

Layers (y bands at 1080x1920) and parallax factors relative to the storefront layer:
  sky        0..~520 (colour-keyed)  0.06   nearly static
  buildings  0..1240                 1.00   storefronts, palms, back sidewalk
  road       1240..1445              1.55   car depth: drives wheel rotation
  foreground 1445..1920 + bollards   2.10   waterfront walkway, bollards, water
  car                                0      locked; wheels spin clockwise; reflection on road

Usage: python3 scripts/ep06_s01_drive.py episode|cruise [out.mp4]
  episode: 24 fps, cruise then ease to a stop at Delgado (EP06 S01)
  cruise : 30 fps, 6 s constant speed starting on Delgado (series asset per brief), Delgado exits left
"""
import os, subprocess, sys
import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "episodes/06-walter-website/08-s01-drive")
W, H = 1080, 1920
Y_ROAD, Y_FG = 1240, 1445
K = {"sky": 0.06, "bld": 1.0, "road": 1.55, "fg": 2.10}
OVER = 140                      # plate overlap (feathered seam) in px
WHEELS = [(225, 1210), (722, 1210)]
R_ROT = 56                      # rotate rim + inner tyre only; outer tyre ring and arch stay put
R_ROLL = 63                     # rolling radius for angular speed


def rd(name):
    return cv2.imread(os.path.join(D, name)).astype(np.float32)


def sky_mask(img):
    """1 where pixel is open sky: saturated magenta/purple/orange, connected to the top edge, above y=560."""
    hsv = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2HSV)
    h, s, v = [hsv[..., i].astype(int) for i in range(3)]
    green = (h > 28) & (h < 95)
    cand = ((s > 70) & (v > 90) & ~green).astype(np.uint8)
    cand[560:] = 0
    n, lab = cv2.connectedComponents(cand, connectivity=4)
    top = set(np.unique(lab[0])) - {0}
    m = np.isin(lab, list(top)).astype(np.uint8)
    # cut at the roofline: first row where most of the middle span is not sky
    frac = 1 - m[:, 150:930].mean(1)
    roof = int(np.argmax(frac > 0.55))
    m[roof:] = 0
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(m.astype(np.float32), (5, 5), 0)


def strip(plates):
    """Concatenate plates left->right with feathered overlap. Returns (pano, x of last plate)."""
    step = W - OVER
    pano = np.zeros((H, step * (len(plates) - 1) + W, 3), np.float32)
    wsum = np.zeros((H, pano.shape[1], 1), np.float32)
    ramp = np.ones(W, np.float32)
    ramp[:OVER] = np.linspace(0, 1, OVER)
    ramp[-OVER:] = np.linspace(1, 0, OVER)
    for i, p in enumerate(plates):
        r = ramp.copy()
        if i == 0:
            r[:OVER] = 1
        if i == len(plates) - 1:
            r[-OVER:] = 1
        pano[:, i * step:i * step + W] += p * r[None, :, None]
        wsum[:, i * step:i * step + W] += r[None, :, None]
    return pano / np.maximum(wsum, 1e-6), step * (len(plates) - 1)


def debollard(img):
    """Remove the two waterfront bollards (and their water reflections) by copying neighbouring columns."""
    out = img.copy()
    for (x0, x1), dx in (((38, 172), 160), ((918, 1052), -160)):
        w = x1 - x0
        ramp = np.ones(w, np.float32); ramp[:12] = np.linspace(0, 1, 12); ramp[-12:] = np.linspace(1, 0, 12)
        r = ramp[None, :, None]
        out[1355:, x0:x1] = img[1355:, x0 + dx:x1 + dx] * r + img[1355:, x0:x1] * (1 - r)
    return out


def sample(pano, x, y0, y1):
    """Window of width W starting at float x (wraps), with sub-pixel shift."""
    pw = pano.shape[1]
    xi = int(np.floor(x)); fr = x - xi
    idx = (np.arange(xi, xi + W + 1) % pw)
    band = pano[y0:y1, idx]
    return band[:, :W] * (1 - fr) + band[:, 1:] * fr


def hblur(img, px):
    k = int(min(max(px, 1), 60))
    if k <= 1:
        return img
    return cv2.blur(img, (k, 1))


def rot_disc(src, c, ang, n):
    """Average of n rotations of the wheel disc around c, spanning ang[0]..ang[1] degrees."""
    acc = np.zeros_like(src)
    for a in np.linspace(ang[0], ang[1], n):
        M = cv2.getRotationMatrix2D(c, a, 1.0)
        acc += cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return acc / n


def profile(mode):
    """Return fps, list of storefront-layer offsets s(t) (px travelled, ends at 0 for episode)."""
    if mode == "episode":
        fps, t1, t2, hold = 24, 2.3, 3.7, 0.3          # cruise, decel to stop, hold on Delgado
        n = int(round((t2 + hold) * fps))
        ts = np.arange(n) / fps
        dist_total = 4 * (W - OVER)                      # store1 centred -> delgado centred
        v = dist_total / (t1 + (t2 - t1) / 2)
        s = np.where(ts < t1, v * ts,
             np.where(ts < t2, v * t1 + v * ((ts - t1) - (ts - t1) ** 2 / (2 * (t2 - t1))), dist_total))
        return fps, s - dist_total                       # negative -> 0 at Delgado
    fps, dur = 30, 6.0
    n = int(round(dur * fps))
    v = 4 * (W - OVER) / dur * 0.9
    return fps, np.arange(n) / fps * v                   # starts at Delgado, moves on to the right


def main(mode, out):
    plate = rd("plate_full.png")
    alpha = (cv2.imread(os.path.join(D, "car_mask.png"), 0).astype(np.float32) / 255)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)[..., None]
    delg = rd("clean_plate_R01.png")
    stores = [rd(f"store{i}_R01.png") for i in (1, 2, 3, 4)]
    if mode == "episode":
        world = stores + [delg]
    else:  # delgado first, then the four storefronts, then wrap
        world = [delg] + stores
    world = [debollard(p) for p in world]
    pano, last_x = strip(world)
    anchor = last_x if mode == "episode" else 0          # pano x that equals the SH01 framing

    # sky: Delgado's own sky, palms replaced by neighbouring cloud columns, extended 320 px to the left
    # for the slow drift; the drift ends at 0 so the last frame's sky is Delgado's.
    SKY_H, EXT = 620, 320
    sk = delg[:SKY_H].copy()
    def paste(dst_x0, dst_x1, src_x0):
        w = dst_x1 - dst_x0
        r = np.ones(w, np.float32); r[:25] = np.linspace(0, 1, 25); r[-25:] = np.linspace(1, 0, 25)
        if dst_x0 == 0: r[:25] = 1
        if dst_x1 == W: r[-25:] = 1
        r = r[None, :, None]
        sk[:, dst_x0:dst_x1] = sk[:, src_x0:src_x0 + w] * r + sk[:, dst_x0:dst_x1] * (1 - r)
    paste(0, 345, 345)          # left palm  <- clouds just right of it
    paste(790, W, 430)          # right palm <- clouds left of it
    rows = sk[270:300].mean(0, keepdims=True)                     # below the roofline: continue the horizon glow
    ramp = np.linspace(0, 1, SKY_H - 300)[:, None, None]
    sk[300:] = cv2.GaussianBlur(np.repeat(rows, SKY_H - 300, 0), (41, 1), 0) * (0.8 + 0.2 * (1 - ramp))
    sky = np.zeros((Y_ROAD, EXT + W, 3), np.float32)
    sky[:SKY_H, EXT:] = sk; sky[:SKY_H, :EXT] = sk[:, 360:360 + EXT]
    sky[SKY_H:] = sky[SKY_H - 1]
    skym_pano, _ = strip([np.repeat(sky_mask(p)[..., None], 3, 2) for p in world])

    # waterfront: one bollard-free strip (Delgado's, mirror-tiled -> seamless) + evenly spaced bollard sprites
    fg_base = debollard(delg)
    diff = np.abs(delg - fg_base).max(2)
    spr_a = np.zeros((H, W), np.float32)
    spr_a[1355:Y_FG, 40:170] = np.clip((diff[1355:Y_FG, 40:170] - 18) / 30, 0, 1)   # cone top over the road
    spr_a[Y_FG:1625, 54:157] = 1                                                    # post on the walkway
    fade = np.linspace(0.85, 0, 1770 - 1625)[:, None]
    spr_a[1625:1770, 60:151] = fade                                                 # its reflection in the water
    spr_a = cv2.GaussianBlur(spr_a, (5, 5), 0)
    sprite = delg[1355:, 40:170].copy(); sprite_a = spr_a[1355:, 40:170, None].copy()
    fgb = fg_base[1355:]
    fg_strip = np.concatenate([fgb, fgb[:, ::-1]], 1)            # period 2160
    # bollards sit every 880 px of fg travel; at the SH01 framing they are at x=40 and x=920
    fps, s = profile(mode)
    car = plate.copy()
    yb = 1284                                            # car ground line
    refl_img = np.zeros_like(plate); refl_a = np.zeros_like(alpha)
    # simple mirrored reflection about the ground line
    src_rows = np.clip(2 * yb - np.arange(yb, H), 0, H - 1)
    refl_img[yb:] = plate[src_rows]; refl_a[yb:] = alpha[src_rows]
    fade = np.clip(1 - (np.arange(H) - yb) / 140.0, 0, 1)[:, None, None]
    refl_a = refl_a * fade * 0.42
    refl_a[:Y_ROAD] = 0; refl_a[Y_FG:] = 0
    refl_img = cv2.GaussianBlur(refl_img, (9, 9), 0)

    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps),
           "-i", "-", "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    ang = 0.0
    for i, si in enumerate(s):
        dv = abs(si - (s[i - 1] if i else s[0] - (s[1] - s[0])))   # store-layer px this frame
        x = {k: anchor + si * K[k] for k in K}
        bld = sample(pano, x["bld"], 0, Y_ROAD)
        skyb = sample(sky, EXT + (x["sky"] - anchor) * (1 if mode == "episode" else -1), 0, Y_ROAD)
        smk = sample(skym_pano, x["bld"], 0, Y_ROAD)
        bld = hblur(bld, dv * K["bld"] * 0.5)
        frame = np.empty((H, W, 3), np.float32)
        frame[:Y_ROAD] = skyb * smk + bld * (1 - smk)
        road = sample(pano, x["road"], Y_ROAD, H)
        frame[Y_ROAD:] = hblur(road, dv * K["road"] * 0.5)
        # car reflection (stays with car) on the wet road
        frame[Y_ROAD:Y_FG] = frame[Y_ROAD:Y_FG] * (1 - refl_a[Y_ROAD:Y_FG]) + refl_img[Y_ROAD:Y_FG] * refl_a[Y_ROAD:Y_FG]
        bx = 1.0 * (x["fg"] - anchor)                                # fg-layer travel from the SH01 framing
        fgf = sample(fg_strip, bx % fg_strip.shape[1], 0, H - 1355)
        fgl = np.empty((H - 1355, W, 3), np.float32)
        fgl[:] = frame[1355:]
        fgl[Y_FG - 1355:] = fgf[Y_FG - 1355:]
        # bollard sprites: x positions repeat every 880 px of fg travel
        acc = np.zeros((H - 1355, W, 1), np.float32)
        for k in range(-40, 40):
            sx = 40 + k * 880 - bx
            if sx < -130 or sx > W:
                continue
            xi = int(np.floor(sx)); fr = sx - xi
            M = np.float32([[1, 0, fr], [0, 1, 0]])
            spr = cv2.warpAffine(sprite, M, (130, H - 1355)); spa = cv2.warpAffine(sprite_a, M, (130, H - 1355))[..., None]
            x0, x1 = max(xi, 0), min(xi + 130, W)
            fgl[:, x0:x1] = fgl[:, x0:x1] * (1 - spa[:, x0 - xi:x1 - xi]) + spr[:, x0 - xi:x1 - xi] * spa[:, x0 - xi:x1 - xi]
            acc[:, x0:x1] = np.maximum(acc[:, x0:x1], spa[:, x0 - xi:x1 - xi])
        # motion blur only on the moving foreground (rows that belong to it)
        fgmov = hblur(fgl, dv * K["fg"] * 0.5)
        m_fg = cv2.dilate(acc, np.ones((1, 15), np.uint8))[..., None] if acc.ndim == 3 else acc
        m_fg = np.clip(m_fg.reshape(H - 1355, W, 1), 0, 1); m_fg[Y_FG - 1355:] = 1
        frame[1355:] = fgmov * m_fg + fgl * (1 - m_fg)
        # wheels: clockwise (negative angle in OpenCV), angle from road travel / rolling radius
        dang = np.degrees(dv * K["road"] / R_ROLL)
        carf = car.copy()
        if dang > 0.05:
            for c in WHEELS:
                disc = rot_disc(plate, c, (-ang, -(ang + min(dang, 40))), 6 if dang > 4 else 1)
                yy, xx = np.ogrid[:H, :W]
                d = np.sqrt((xx - c[0]) ** 2 + (yy - c[1]) ** 2)
                m = np.clip(R_ROT - d, 0, 1.5)[..., None] / 1.5
                carf = carf * (1 - m) + disc * m
        ang = (ang + dang) % 360
        # extremely subtle suspension while moving
        bob = 0.8 * np.sin(i / fps * 2 * np.pi * 2.7) * min(dv / 20, 1)
        if abs(bob) > 0.05:
            M = np.float32([[1, 0, 0], [0, 1, bob]])
            carf = cv2.warpAffine(carf, M, (W, H), borderMode=cv2.BORDER_REPLICATE)
            ca = cv2.warpAffine(alpha, M, (W, H))[..., None]
        else:
            ca = alpha
        frame = frame * (1 - ca) + carf * ca
        if mode == "episode":   # settle onto the approved SH01_R02 frame as the car stops
            wgt = float(np.clip((i / fps - 3.6) / 0.3, 0, 1))
            if wgt > 0:
                frame = frame * (1 - wgt) + plate * wgt
        p.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
    p.stdin.close(); p.wait()
    print(out, len(s), "frames @", fps)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "episode"
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
        ROOT, "episodes/06-walter-website/04-generated-clips",
        "EP06_SH01_DRIVE_R01.mp4" if mode == "episode" else "SERIES_FERRARI_CRUISE_6s_30fps_R01.mp4")
    main(mode, out)
