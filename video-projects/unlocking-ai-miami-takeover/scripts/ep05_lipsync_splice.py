"""Splice lip-synced sections back into EP05 shots: <shot>_out.mp4 (synced head of the slot) + the rest of the
original clip after it (same 'in'/'speed'), written to clips/final/<shot>_ls.mp4 with in=0, speed=1.
Updates manifests/ep05-penny.json for every shot that has a lipsync/<shot>_out.mp4."""
import json, os, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mp = os.path.join(R, 'manifests/ep05-penny.json'); m = json.load(open(mp))
ep = os.path.join(R, m['episode_dir']); ls = os.path.join(ep, 'lipsync')
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
for s in m['shots']:
    o = os.path.join(ls, f"{s['id']}_out.mp4")
    if not os.path.exists(o) or s.get('lipsynced'): continue
    L = s['t'][1] - s['t'][0]; sp = s.get('speed', 1.0); i0 = s.get('in', 0.0); d = dur(o)
    src = os.path.join(ep, s['file']); dst = os.path.join(ep, f"clips/final/{s['id']}_ls.mp4")
    fc = (f"[0:v]fps=24,scale=1080:1920,setsar=1,format=yuv420p,trim=0:{d},setpts=PTS-STARTPTS[a];"
          f"[1:v]trim={i0 + d*sp}:{i0 + L*sp},setpts=(PTS-STARTPTS)/{sp},fps=24,scale=1080:1920,setsar=1,format=yuv420p[b];"
          f"[a][b]concat=n=2:v=1:a=0,tpad=stop_mode=clone:stop_duration=1,trim=0:{L}[v]")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', o, '-i', src, '-filter_complex', fc, '-map', '[v]', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', dst], check=True)
    s['orig_file'] = s['file']; s['file'] = os.path.relpath(dst, ep); s['in'] = 0.0; s.pop('speed', None); s['lipsynced'] = True
    print(s['id'], 'synced head', round(d, 2), 's of', round(L, 2))
json.dump(m, open(mp, 'w'), indent=2, ensure_ascii=False); open(mp, 'a').write('\n')
