"""Score + SFX for the 30 s cut. 112 BPM, 30 s, synthesized locally (no paid generation).
Writes qa/master30_raw.wav; loudness is normalized afterwards with ffmpeg loudnorm (-14 LUFS, -1.2 dBTP)."""
import numpy as np, wave
SR = 48000; DUR = 30.0; N = int(SR * DUR); P = 60 / 112
B = lambda n: n * P
MAP = [[0, 0], [4, 4], [4.9, 4.9], [5.8, 5.15], [7.4, 6.6], [10, 7.0], [12, 8], [16, 12], [17, 13], [23.4, 15.4], [23.45, 15.45], [24, 16],
  [25, 17], [26.6, 18.6], [31.55, 19.55], [32, 20], [39.5, 23.5], [40, 24], [41.5, 25], [43, 26], [44.5, 26.5], [46, 27], [47.5, 27.5], [48.7, 27.78],
  [49, 28], [53, 31], [56, 32.25]]
Bo = lambda o: float(np.interp(o, [m[1] for m in MAP], [m[0] for m in MAP])) * P  # old-cut beat -> new time
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N); T = np.arange(N) / SR
def tt(d): return np.arange(int(d * SR)) / SR
def put(sig, start, g=1.0, pan=0.0):
    i = int(round(start * SR)); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    l = g * np.cos((pan + 1) * np.pi / 4); r = g * np.sin((pan + 1) * np.pi / 4)
    L[i:i + n] += sig[:n] * l; R[i:i + n] += sig[:n] * r
def lp(v, n): return v if n <= 1 else np.convolve(v, np.ones(n) / n, mode='same')
def saw(f, d, det=(0,)):
    t = tt(d); return sum(2 * ((f * (1 + e) * t) % 1) - 1 for e in det) / len(det)
def kick(d=.42): t = tt(d); f = 42 + 110 * np.exp(-t * 30); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + 0.25 * np.exp(-t * 150) * rng.standard_normal(len(t))
def hat(d=.05): t = tt(d); return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t * 80)
def clap(): t = tt(.28); n = rng.standard_normal(len(t)); n = n - lp(n, 5); return n * (np.exp(-t * 20) + 0.5 * np.exp(-t * 60)) * 0.9
def pop(f=520): t = tt(.12); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t * 60))) / SR) * np.exp(-t * 38)
def click(): t = tt(.025); return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t * 260)
def tick(f=2600): t = tt(.04); return np.sin(2 * np.pi * f * t) * np.exp(-t * 120)
def sub(f=46, d=1.8): t = tt(d); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * np.exp(-t * 18))) / SR) * np.exp(-t * 1.8)
def crash(d=1.6): t = tt(d); n = rng.standard_normal(len(t)); return (n - lp(n, 3)) * np.exp(-t * 3.2) * 0.6
def whoosh(d, rev=False):
    t = tt(d); n = rng.standard_normal(len(t)); k = t / d; s = lp(n, 40) * (1 - k) + (n - lp(n, 6)) * k * 0.7
    e = k ** 1.8 * np.clip((1 - k) / 0.06, 0, 1); return s * e * 2.2
def beep(f=1320, d=.12): t = tt(d); return np.sign(np.sin(2 * np.pi * f * t)) * 0.3 * np.exp(-t * 12) * np.minimum(1, t * 800)
def stab(fs, d=.5, dec=6): t = tt(d); return sum(lp(saw(f, d, (-.006, .006)), 6) for f in fs) / len(fs) * np.exp(-t * dec) * np.minimum(1, t * 500)
def glitch(d=.2):
    t = tt(d); s = np.sign(np.sin(2 * np.pi * 180 * t * (1 + 3 * (np.floor(t * 40) % 3)))) * (np.floor(t * 60) % 2); return s * 0.5 * np.exp(-t * 6)
def env(pieces): xs, vs = zip(*pieces); return np.interp(T, xs, vs)

chords = [(73.42, [293.66, 349.23, 440.0]), (58.27, [233.08, 293.66, 349.23]), (87.31, [349.23, 440.0, 523.25]), (65.41, [261.63, 329.63, 392.0])]
pad = np.zeros(N); bass = np.zeros(N); arp = np.zeros(N); lead = np.zeros(N)
for bar in range(15):
    t0 = B(bar * 4); root, tones = chords[bar % 4]; d = B(4) + 0.3
    p = sum(lp(saw(f, d, (-.005, .005)), 14) for f in tones) * np.minimum(1, tt(d) / 0.25) * np.clip(1 - (tt(d) - B(4)) / 0.3, 0, 1)
    i = int(t0 * SR); n = max(0, min(len(p), N - i)); pad[i:i + n] += p[:n] * 0.06
    for e in range(8):
        b = lp(saw(root, .3, (0, .01)), 4) * np.exp(-tt(.3) * 8) * np.minimum(1, tt(.3) * 400)
        i = int((t0 + e * P / 2) * SR); n = max(0, min(len(b), N - i)); bass[i:i + n] += b[:n] * 0.32
    for s in range(16):
        f = tones[[0, 1, 2, 1][s % 4]] * (2 if s % 8 in (3, 7) else 1) * 2
        a = np.sin(2 * np.pi * f * tt(.25)) * np.exp(-tt(.25) * 18) * np.minimum(1, tt(.25) * 600)
        i = int((t0 + s * P / 4) * SR); n = max(0, min(len(a), N - i)); arp[i:i + n] += a[:n] * 0.10
    for off, nt in [(0, 2), (B(1.5), 1), (B(3), 0)]:
        f = tones[nt] * 2; a = lp(saw(f, .45, (-.004, .004)), 3) * np.exp(-tt(.45) * 5) * np.minimum(1, tt(.45) * 300)
        i = int((t0 + off) * SR); n = max(0, min(len(a), N - i)); lead[i:i + n] += a[:n] * 0.09
g_pad = env([(0, .4), (B(4), .7), (B(24), .9), (B(40), 1.1), (B(49), 1.2), (30, 1)])
g_bass = env([(0, 0), (B(12) - .01, 0), (B(12), .7), (B(23.5), .9), (B(23.5) + .01, 0), (B(24), 0), (B(24) + .01, 1), (B(40) - .01, 1), (B(40), 0), (B(49) - .01, 0), (B(49), .6), (30, .3)])
g_arp = env([(0, 0), (B(4) - .01, 0), (B(4), .45), (B(23.5), .9), (B(23.5) + .01, 0), (B(24), 0), (B(24) + .01, .8), (B(40), .8), (B(40) + .01, .4), (B(49), .4), (B(49) + .01, .5), (30, .2)])
g_lead = env([(0, 0), (B(24) - .01, 0), (B(24), 1), (B(40) - .01, 1), (B(40), 0), (B(49), 0), (B(49) + .01, .7), (30, .4)])
kicks = [B(b) for b in [1, 2, 3]] + [B(b) for b in range(4, 24)] + [B(b) for b in range(24, 40)] + [B(b) for b in range(49, 56)]
sc = np.ones(N)
for kt in kicks:
    i = int(kt * SR); n = min(int(.35 * SR), N - i); sc[i:i + n] = np.minimum(sc[i:i + n], 1 - 0.55 * np.exp(-np.arange(n) / SR / 0.1))
bed = (pad * g_pad + bass * g_bass + arp * g_arp + lead * g_lead) * sc
dl = int(B(.75) * SR); wet = np.zeros(N); wet[dl:] = (arp * g_arp + lead * g_lead)[:-dl] * 0.3
L += bed + wet; R += bed + np.roll(wet, int(.013 * SR)) * 1.3
for kt in kicks: put(kick(), kt, 0.75 if kt < B(4) else 0.85 if kt < B(24) else 1.0 if kt < B(40) else 0.7)
for b in np.arange(4.5, 23.5, 1): put(hat(), B(b), 0.10, 0.3)
for b in np.arange(24.5, 40, 0.5): put(hat(.035), B(b), 0.07 + 0.05 * (b % 1 == 0.5), -0.25)
for b in [17, 19, 21]: put(clap(), B(b), 0.3)
for b in range(25, 40, 2): put(clap(), B(b), 0.42)
rt = tt(B(7.5)); k = rt / rt[-1]; n = rng.standard_normal(len(rt)); put((lp(n, 30) * (1 - k) + (n - lp(n, 4)) * k) * k ** 2.4 * 0.5, B(16), 1)
put(np.sin(2 * np.pi * np.cumsum(200 * 2 ** (k * 2.5)) / SR) * k ** 2.5 * 0.09, B(16), 1)
for s_ in np.concatenate([np.arange(21, 22.5, .5), np.arange(22.5, 23.5, .25)]): put(clap(), B(s_), 0.15 + 0.2 * (s_ - 21) / 2.5)
duck = np.ones(N); duck[(T > B(23.5)) & (T < B(24))] = 0.12
L *= duck; R *= duck
# --- SFX: cues are old-cut beats mapped through Bo() so they stay locked to picture ---
for b, f in [(1, 520), (2, 600), (3, 690)]: put(pop(f), Bo(b), 0.55)              # bead contacts
put(whoosh(Bo(4) - Bo(3.45)), Bo(3.45), 0.55); put(crash(1.0), Bo(4), 0.35)        # laser + flash
for j in range(6): put(click(), Bo(4) + 0.06 + j * 0.075 + 0.2, 0.5, -0.4 + j * 0.16)  # letters land
put(tick(2200), Bo(5.15), 0.35); put(tick(1800), Bo(5.6), 0.3); put(tick(2400), Bo(6.6), 0.3)  # selection + drag
put(whoosh(Bo(8) - Bo(7)), Bo(7), 0.3)                                              # wallpaper
put(sub(55, 1.0), Bo(8), 0.6); put(clap(), Bo(8), 0.45)                             # invert
for j in range(7): put(pop(700 + j * 60), Bo(9.3 + j * 0.11 / (60 / 129)) + 0.07, 0.3, -0.5 + j * 0.15)  # letters -> dots
put(pop(480), Bo(10.3 + 0.8 * 0.7), 0.55)                                          # bead lands as 8th dot
for j in range(8): put(tick(1500 + j * 120), Bo(12) + j * 0.035 + 0.25, 0.25, -0.6 + j * 0.17)  # fingers
put(sub(42, 2.4), Bo(16), 1.0); put(crash(2.2), Bo(16), 0.55)                      # DROP: iris
sh = tt(3.0); put(sum(np.sin(2 * np.pi * f * sh) for f in [2093, 2637, 3136]) * np.exp(-sh * 1.2) * 0.05, Bo(18.6), 1)  # mesh shimmer
put(whoosh(Bo(20) - Bo(19.55)), Bo(19.55), 0.4)                                    # orange flood
for b in [20.15, 21.15, 22.15, 23.15]: put(lp(rng.standard_normal(int(.2 * SR)), 25) * np.exp(-tt(.2) * 18) * 1.5, Bo(b), 0.4)  # silicone squish
put(whoosh(Bo(24) - Bo(23.5)), Bo(23.5), 0.6)                                      # push into lens
for b, c in zip([24, 25, 26, 26.5, 27, 27.5], [0, 1, 2, 3, 0, 1]): put(stab(chords[c][1], .5), Bo(b), 0.6); put(kick(.25), Bo(b), 0.5)
for j in range(6): put(tick(3000), Bo(24) + j * 0.05, 0.15)
put(glitch(0.6), Bo(26), 0.25); put(beep(1046, .12), Bo(26.5) + 0.25, 0.3)
put(rng.standard_normal(int((Bo(28) - Bo(27.78)) * SR)) * 0.25, Bo(27.78), 0.6)    # pixel noise
put(sub(46, 2.5), Bo(28), 0.9); put(crash(2.5), Bo(28), 0.5); put(stab([293.66, 440, 587.33], 2.4, 1.2), Bo(28), 0.6)
for j in range(0, 44, 2): put(click(), Bo(29.2 + j / 44), 0.18)
for j in range(0, 52, 2): put(click(), Bo(30.2 + j / 52), 0.14)
put(pop(440), Bo(30), 0.7)                                                          # final period
st = tt(3); put(sum(np.sin(2 * np.pi * f * st) for f in [1174.7, 1760, 2349.3]) * np.exp(-st * 1.2) * 0.06, Bo(31), 1)
fade = np.clip((30 - T) / 0.3, 0, 1); L *= fade; R *= fade
m = max(np.abs(L).max(), np.abs(R).max()); out = (np.stack([L, R], 1) / m * 0.7 * 32767).astype(np.int16)
with wave.open('qa/master30_raw.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print('ok')
