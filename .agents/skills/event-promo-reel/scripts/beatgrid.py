#!/usr/bin/env python3
"""Measure a music take so the edit can be cut to it.

Usage:  python3 beatgrid.py music-A.mp3 [music-B.mp3 ...] [--bpm 128] [--out grid.json]

For each take prints: fitted BPM, first-beat offset (t0), beat-fit error, loudness per
second, where the energy LIFTS (biggest jumps in treble/sub energy, snapped to beats),
the final hit, and whether the take FADES OUT before the end (a fading take is wrong
under a CTA ending). Writes grid.json for the first take (or the one you pass first).

Beat n is at  t0 + n * period.  Use that formula everywhere (GSAP and the SFX mix).
Needs: pip install librosa
"""
import sys, json, argparse
import numpy as np
import librosa

ap = argparse.ArgumentParser()
ap.add_argument('files', nargs='+')
ap.add_argument('--bpm', type=float, default=128)
ap.add_argument('--out', default='grid.json')
a = ap.parse_args()

grids = []
for f in a.files:
    y, sr = librosa.load(f, sr=22050, mono=True)
    dur = len(y) / sr
    _, beats = librosa.beat.beat_track(y=y, sr=sr, units='time', start_bpm=a.bpm, tightness=400)
    n = np.arange(len(beats))
    period, phase = np.polyfit(n, beats, 1)
    t0 = phase % period
    err = float(np.abs(np.polyval([period, phase], n) - beats).max())
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
    fr = librosa.fft_frequencies(sr=sr)
    t = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=512)
    def band(mask):
        e = S[mask].sum(0)
        return np.array([20 * np.log10(e[(t >= i) & (t < i + .5)].mean() + 1e-9) for i in np.arange(0, dur - .5, .5)])
    hi, sub = band(fr > 4000), band(fr < 120)
    rms = librosa.feature.rms(y=y)[0]
    tr = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
    persec = [20 * np.log10(rms[(tr >= i) & (tr < i + 1)].mean() + 1e-9) for i in range(int(dur))]
    jumps = np.diff(hi) + 0.5 * np.diff(sub)
    period, t0, err = float(period), float(t0), float(err)
    lifts = sorted({int(round(((i + 1) * .5 - t0) / period)) for i in np.argsort(jumps)[-4:]})
    fades = persec[-1] < max(persec) - 12
    g = {'file': f, 'bpm': round(60 / period, 3), 'period': round(period, 6), 't0': round(t0, 4),
         'beat_fit_error_s': round(err, 4), 'duration_s': round(dur, 3), 'beats': int((dur - t0) // period),
         'lift_beats': lifts, 'lift_times': [round(t0 + b * period, 3) for b in lifts], 'fades_out': bool(fades),
         'loudness_db_per_s': [round(float(v), 1) for v in persec]}
    grids.append(g)
    print(f"\n{f}\n  {g['bpm']} BPM  t0={g['t0']}s  fit err={g['beat_fit_error_s']}s  beats={g['beats']}")
    print(f"  energy lifts at beats {lifts} -> {g['lift_times']} s")
    print(f"  fades out before end: {fades}")
    print('  dB/s', ' '.join(f'{v:.0f}' for v in persec))

json.dump(grids[0], open(a.out, 'w'), indent=1)
print(f"\nwrote {a.out} for {grids[0]['file']}  (beat n = t0 + n*period)")
