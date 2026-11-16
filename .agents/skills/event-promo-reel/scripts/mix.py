#!/usr/bin/env python3
"""Mix the music bed + SFX hits on the beat grid, then loudness-normalise to -14 LUFS.

Usage:  python3 mix.py cues.json
cues.json:
{
  "music": "audio/src/music-A.mp3",
  "grid":  "grid.json",                      # from beatgrid.py (t0, period)
  "out":   "assets/media/mix.m4a",
  "duration": 30.0,
  "sfx": { "slam": "audio/sfx/slam-data-swoosh.mp3", "alert": "...", "tick": "...", "impact": "..." },
  "events": [                                # beat numbers, gain in dB, pre-roll seconds
    {"sfx": "slam",  "beats": [8, 10, 13, 48, 56, 59], "gain": -6.9, "pre": 0.06},
    {"sfx": "alert", "beats": [28.5], "gain": -6, "pre": 0.02},
    {"sfx": "tick",  "beats": [17,18,19,20,21,22,23], "gain": 0, "pre": 0.02},
    {"sfx": "impact","beats": [32, 40], "gain": -3, "pre": 0.03}
  ]
}
Env OVERRIDE_<NAME>=path swaps one sfx (used to build A/B sound samples), OUT=path overrides out.
"""
import sys, json, os, subprocess

c = json.load(open(sys.argv[1]))
g = json.load(open(c['grid']))
t = lambda n: g['t0'] + n * g['period']
sfx = {k: os.environ.get('OVERRIDE_' + k.upper(), v) for k, v in c['sfx'].items()}
out = os.environ.get('OUT', c['out'])
dur = c.get('duration', 30.0)

inputs, fl, k = ['-i', c['music']], [], 0
for ev in c['events']:
    for b in ev['beats']:
        k += 1
        inputs += ['-i', sfx[ev['sfx']]]
        d = max(0, int(round((t(b) - ev.get('pre', 0.03)) * 1000)))
        fl.append(f"[{k}:a]aresample=48000,volume={ev.get('gain', 0)}dB,adelay={d}|{d}[e{k}]")
fl.append('[0:a]aresample=48000[m]')
fl.append('[m]' + ''.join(f'[e{i}]' for i in range(1, k + 1)) +
          f'amix=inputs={k + 1}:normalize=0:duration=first,atrim=0:{dur},afade=t=out:st={dur - 0.25}:d=0.25[mix]')
pre = out + '.pre.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fl), '-map', '[mix]', '-ar', '48000', '-c:a', 'pcm_s16le', pre], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex('{'):])
af = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', out], check=True)
os.remove(pre)
print(f'{k} SFX hits placed; wrote {out}')
