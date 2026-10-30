"""Original synthesized bed for the Glow Hawaii sizzle. 128 BPM, 64 beats = 30.000 s.
Pure numpy synthesis: no samples, no copyrighted material."""
import json, wave, sys, numpy as np
G = json.load(open(sys.argv[1])); out = sys.argv[2]
SR = 44100; P = G['period']; N = int(round(G['beats'] * P * SR))
rng = np.random.default_rng(128)
L = np.zeros(N); R = np.zeros(N)
def add(sig, t0, gain=1.0, pan=0.0):
    i = int(round(t0 * SR)); 
    if i >= N: return
    s = sig[: N - i]; L[i:i+len(s)] += s * gain * (1 - max(pan, 0)); R[i:i+len(s)] += s * gain * (1 + min(pan, 0))
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.003, r=None):
    t = tt(d); r = r or d * 0.6; e = np.minimum(t / a, 1) * np.exp(-t / r * 4); return e
def lp(x, fc):  # one-pole lowpass
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
def kick(d=0.32):
    t = tt(d); f = 46 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * 1.0 + 0.25 * np.sin(ph * 2) * np.exp(-t * 30)
def hat(d=0.06, open_=False):
    d = 0.22 if open_ else d; n = rng.standard_normal(int(d * SR)); n = np.diff(n, prepend=0); return n * np.exp(-tt(d) * (14 if open_ else 55)) * 0.5
def clap(d=0.18):
    n = rng.standard_normal(int(d * SR)); n = np.diff(n, prepend=0); t = tt(d)
    return n * (np.exp(-t * 22) + 0.6 * np.exp(-((t - 0.012) ** 2) * 2e4)) * 0.45
def pluck(f, d=0.28):
    t = tt(d); s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.5 for k in (1, 2, 3, 4)); return s * np.exp(-t * 11) * 0.5
def bass(f, d):
    t = tt(d); s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t); return s * np.minimum(t / 0.01, 1) * np.minimum((d - t) / 0.03, 1) * 0.9
def pad(freqs, d):
    t = tt(d); s = np.zeros_like(t)
    for f in freqs:
        for det in (-0.004, 0.0, 0.004):
            s += np.sin(2 * np.pi * f * (1 + det) * t) + 0.35 * np.sin(4 * np.pi * f * (1 + det) * t)
    a = np.minimum(t / 0.5, 1) * np.minimum((d - t) / 0.6, 1); return s / (len(freqs) * 3) * a * 0.55
def riser(d, up=True):
    n = rng.standard_normal(int(d * SR)); n = np.diff(n, prepend=0); t = tt(d) / d
    e = t ** 2.2 if up else (1 - t) ** 2; return n * e * 0.6
def boom(d=1.4):
    t = tt(d); return np.sin(2 * np.pi * 38 * t * (1 + 0.8 * np.exp(-t * 6))) * np.exp(-t * 2.4) * 1.2
def tick(d=0.012):
    t = tt(d); return np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 400) * 0.5
def blip(f=880, d=0.09):
    t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-t * 35) * 0.45
B = lambda b: b * P
mid = lambda n: 440 * 2 ** ((n - 69) / 12)
chords = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G
ch4 = (51, 60); fix = (34, 51); flur = G['fix']['flurry'] + [G['fix']['flurryEnd']]
gap0, gap1 = G['preDropGap']
# pads: one chord per bar (4 beats), whole piece; response chapter keeps pads only
for bar in range(16):
    r, notes = chords[bar % 4]; add(pad([mid(n) for n in notes], 4 * P + 0.5), B(bar * 4), 0.9, 0)
# kicks / claps / hats / bass
for b in range(2, 64):
    in_resp = ch4[0] + 1.5 <= b < ch4[1]; in_gap = gap0 <= b < gap1
    if in_gap: continue
    if b >= 60: 
        if b == 60: add(kick(), B(b), 1.1)
        continue
    if not in_resp:
        add(kick(), B(b), 0.95)
        if b % 2 == 1 and b >= 6: add(clap(), B(b), 0.8)
    if b >= 4:
        add(hat(open_=True), B(b) + P / 2, 0.55)
        add(hat(), B(b), 0.3 if not in_resp else 0.0)
    if b >= 6 and not in_resp:
        r, _ = chords[(b // 4) % 4]; add(bass(mid(r - 12), P * 0.48), B(b) + P / 2, 0.75); 
# flurry 16th hats (beats 45-51)
for k in range(int((flur[-1] - 45) * 4)): add(hat(), B(45) + k * P / 4, 0.35)
# arp pluck: chapters 2-3
for s in range(int(13 * 2), int(51 * 2)):
    t = s * P / 2
    if gap0 <= s / 2 < gap1: continue
    r, notes = chords[(int(s / 8)) % 4]; add(pluck(mid(notes[(s) % 3] + 12), 0.25), t, 0.35, pan=0.4 if s % 2 else -0.4)
# response chapter: soft plucks
for s in range(int(ch4[0] * 2), int(ch4[1] * 2)):
    if s % 2: continue
    r, notes = chords[(int(s / 8)) % 4]; add(pluck(mid(notes[(s // 2) % 3] + 12), 0.4), s * P / 2, 0.28, pan=0.2)
# riser into the drop, pre-drop gap, drop
add(riser(B(33.5) - B(29)), B(29), 0.8); add(riser(0.22, up=False), B(33.5), 0.5)
add(boom(), B(34), 0.9); add(kick(0.4), B(34), 1.2); add(clap(0.3), B(34), 0.9)
# whoosh at chapter boundaries
for b in (2, 13, 51, 60): add(riser(P * 0.9, up=True), B(b) - P * 0.9, 0.5)
# audit callout blips, fix wipes
for k in ('headline', 'buttons', 'testimonials'): add(blip(1320), B(G['audit'][k]['box']), 1.0)
add(blip(1320), B(G['audit']['summit']['box1']), 1.0); add(blip(1320), B(G['audit']['summit']['box2']), 1.0)
for k in ('headline', 'button', 'summit'): add(blip(1760, 0.14), B(G['fix'][k]['wipe']), 1.0)
for b in G['fix']['flurry']: add(tick(0.02), B(b), 1.4)
# typing ticks
t0, t1 = [B(x) for x in G['response']['type']]; nchar = 211
for c in range(0, nchar, 2): add(tick(), t0 + (t1 - t0) * c / nchar, 0.7)
# lockup: hit + shimmer chord, swell
add(boom(1.8), B(60), 0.8); add(pad([mid(n) for n in (57, 60, 64, 69)], 2.4), B(60), 1.1)
add(blip(1760, 0.5), B(62.5), 0.6); add(blip(2093, 0.5), B(62.5) + 0.12, 0.4)
# master: soft clip, fade ends, normalize ~ -14 LUFS-ish (peak -1.5 dB)
for ch in (L, R):
    ch *= np.minimum(1, (N - np.arange(N)) / (0.4 * SR)); ch *= np.minimum(1, np.arange(N) / (0.01 * SR))
m = np.tanh(np.stack([L, R]) * 0.9); m = m / np.max(np.abs(m)) * 0.84
pcm = (m.T * 32767).astype('<i2'); w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('wrote', out, N / SR, 's')
