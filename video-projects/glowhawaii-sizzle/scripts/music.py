"""Original synthesized bed for the Glow Hawaii sizzle. 96 BPM, 48 beats = 30.000 s.
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
SW = 0.09 * P                      # laid-back swing on off-beat eighths
# island feel: I - V - vi - IV in C major, one chord per bar (4 beats)
chords = [(48, [55, 60, 64, 67]), (43, [55, 59, 62, 67]), (45, [57, 60, 64, 69]), (41, [53, 57, 60, 65])]
C2, C3, C4, C5 = [c['start'] for c in G['chapters'][1:]]
ladder0 = G['audit']['ladder']['start']
flur = G['fix']['flurry'] + [G['fix']['flurryEnd']]
gap0, gap1 = G['preDropGap']
NB = G['beats']
for bar in range((NB + 3) // 4):
    r, notes = chords[bar % 4]; add(pad([mid(n) for n in notes], 4 * P + 0.5), B(bar * 4), 0.8, 0)
# one groove, unchanged from the first bar to the lockup: soft kick, rim on 2/4, swung shaker, syncopated bass
for b in range(2, NB):
    if b >= C5:
        if b == C5: add(kick(), B(b), 1.1)
        continue
    add(kick(), B(b), 0.8 if b % 2 == 0 else 0.55)
    if b % 2 == 1 and b >= 4: add(clap(0.12), B(b), 0.55)
    if b >= 4:
        add(hat(open_=(b % 2 == 1)), B(b) + P / 2 + SW, 0.4)
        add(hat(), B(b), 0.22)
        r, _ = chords[(b // 4) % 4]
        add(bass(mid(r - 12), P * 0.7), B(b), 0.8)
        if b % 4 in (1, 2): add(bass(mid(r - 12 + 7), P * 0.35), B(b) + P * 0.5 + SW, 0.6)
# ukulele-style arpeggio, swung, through the whole piece until the lockup
for s_ in range(int(2 * 2), int(C5 * 2)):
    t = s_ * P / 2 + (SW if s_ % 2 else 0)
    r, notes = chords[(int(s_ / 8)) % 4]; add(pluck(mid(notes[s_ % 4] + 12), 0.3), t, 0.33, pan=0.4 if s_ % 2 else -0.4)
# audit selection blips (same as before); typing ticks, sparse and soft
for k in ('headline', 'buttons', 'testimonials'): add(blip(1320), B(G['audit'][k]['box']), 1.0)
add(blip(1320), B(G['audit']['summit']['box1']), 1.0); add(blip(1320), B(G['audit']['summit']['box2']), 1.0)
import json as _j, os as _o
T_ = _j.load(open(_o.path.join(_o.path.dirname(__file__), '..', 'testimonial.json'), encoding='utf8')); nchar = len(T_['body']) + len(T_['attr'])
t0, t1 = [B(x) for x in G['response']['type']]
for c in range(0, nchar, 5): add(tick(), t0 + (t1 - t0) * c / nchar, 0.3)
# lockup: hit + shimmer chord
add(boom(1.8), B(C5), 0.8); add(pad([mid(n) for n in (60, 64, 67, 72)], 2.4), B(C5), 1.1)
add(blip(1760, 0.5), B(G['lockup']['tagline']), 0.6); add(blip(2093, 0.5), B(G['lockup']['tagline']) + 0.12, 0.4)
# master
for ch in (L, R):
    ch *= np.minimum(1, (N - np.arange(N)) / (0.4 * SR)); ch *= np.minimum(1, np.arange(N) / (0.01 * SR))
m = np.tanh(np.stack([L, R]) * 0.9); m = m / np.max(np.abs(m)) * 0.84
pcm = (m.T * 32767).astype('<i2'); w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('wrote', out, N / SR, 's')
