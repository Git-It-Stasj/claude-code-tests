"""Detects hard cuts in the rendered MP4 (ffmpeg scene score) and reports each one's offset from the 128 BPM grid, in frames."""
import subprocess, re, sys, json
mp4 = sys.argv[1]; import os; G = json.load(open(os.path.join(os.path.dirname(os.path.abspath(mp4)), '..', 'grid.json'))); P = G['period']; FPS = G['fps']
r = subprocess.run(['ffmpeg','-i',mp4,'-vf',"select='gt(scene,0.18)',showinfo",'-an','-f','null','-'],capture_output=True,text=True)
ts = [float(m.group(1)) for m in re.finditer(r'pts_time:([\d.]+)', r.stderr)]
rows = []
for t in ts:
    half = t / (P/2); n = round(half); off_frames = (t - n*(P/2)) * FPS
    rows.append((t, n/2, off_frames))
for t,b,o in rows: print(f"cut @ {t:6.3f}s  nearest grid {b:5.1f} beats ({b*P:6.3f}s)  offset {o:+.2f} frames  {'OK' if abs(o)<=2 else 'OUT'}")
print('max |offset| frames:', max(abs(o) for _,_,o in rows) if rows else None, ' n=',len(rows))
