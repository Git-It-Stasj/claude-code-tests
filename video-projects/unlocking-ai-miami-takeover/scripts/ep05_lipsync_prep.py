"""Build sync_so inputs for EP05 on-screen dialogue: per shot, the exact slot section of the clip (speed applied)
and an audio track with that shot's lines at their edit offsets. Writes episodes/05-penny-seo-content/lipsync/plan.json.
Two-face shots get one segment per speaker turn with a face point (full-res px, at the segment's first frame)."""
import json, os, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m = json.load(open(os.path.join(R, 'manifests/ep05-penny.json')))
ep = os.path.join(R, m['episode_dir']); out = os.path.join(ep, 'lipsync'); os.makedirs(out, exist_ok=True)
MIMI = {'S02': (243, 664), 'S04': (233, 648), 'S06': (240, 680), 'S08': (295, 664), 'S11a': (301, 697), 'S11c': (259, 697)}
NOEL = {'S03': (866, 365), 'S04': (784, 632), 'S06': (855, 518), 'S08': (781, 535), 'S11a': (803, 454), 'S11c': (826, 405)}
# shot -> (send length s, [(line id, speaker, seg start, seg end)])  None speaker = single face, no segments
PLAN = {'S02': (1.9, [('L01', 'MIMI', 0.25, 1.65)]),
        'S03': (3.6, [('L02', 'NOELLE', 0.3, 3.6)]),
        'S04': (3.0, [('L03', 'MIMI', 0.25, 3.0)]),
        'S06': (3.3, [('L04', 'NOELLE', 0.15, 1.1), ('L05', 'MIMI', 1.55, 3.3)]),
        'S08': (4.8, [('L07', 'NOELLE', 0.2, 3.2), ('L08', 'MIMI', 3.3, 4.8)]),
        'S11a': (3.84, [('L11', 'MIMI', 0.2, 2.25), ('L12', 'NOELLE', 2.4, 3.84)]),
        'S11c': (1.9, [('L14', 'MIMI', 0.25, 1.9)])}
shots = {s['id']: s for s in m['shots']}; lines = {d['id']: d for d in m['dialogue']}
plan = {}
for sid, (L, segs) in PLAN.items():
    s = shots[sid]; a0 = s['t'][0]; sp = s.get('speed', 1.0); i0 = s.get('in', 0.0)
    v = os.path.join(out, f'{sid}_in.mp4'); au = os.path.join(out, f'{sid}_in.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(ep, s['file']), '-vf',
        f'trim={i0}:{i0+L*sp},setpts=(PTS-STARTPTS)/{sp},fps=24', '-an', '-t', str(L), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', v], check=True)
    ins, fl = [], []
    for k, (lid, who, a, b) in enumerate(segs):
        d = lines[lid]; ins += ['-i', os.path.join(R, d['file'])]
        fl.append(f'[{k}:a]aresample=44100,aformat=channel_layouts=mono,adelay={int(max(0, d["at"]-a0)*1000)}:all=1[x{k}]')
    fc = ';'.join(fl) + ';' + ''.join(f'[x{k}]' for k in range(len(segs))) + f'amix=inputs={len(segs)}:normalize=0,apad=whole_dur={L},atrim=0:{L}[o]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc, '-map', '[o]', '-c:a', 'libmp3lame', '-b:a', '192k', au], check=True)
    sg = None
    if segs[0][1]:
        sg = [{'start_time': a, 'end_time': b, 'active_speaker_detection': {'frame_number': 0,
               'coordinates': list((MIMI if who == 'MIMI' else NOEL)[sid])}} for lid, who, a, b in segs]
    plan[sid] = {'video': os.path.relpath(v, R), 'audio': os.path.relpath(au, R), 'len': L, 'segments': sg}
json.dump(plan, open(os.path.join(out, 'plan.json'), 'w'), indent=2)
print(json.dumps({k: (v['len'], bool(v['segments'])) for k, v in plan.items()}))
