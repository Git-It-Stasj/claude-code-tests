"""Assemble EP05 (vertical 1080x1920) from manifests/ep05-penny.json.

Usage: python3 scripts/ep05_assemble.py manifests/ep05-penny.json <out.mp4>
Picture: each shot trimmed (in, speed) to its slot. Audio: voice stems at their times, native clip audio
where flagged, optional music bed ducked under dialogue. Overlays: title, captions, evergreen end card.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_overlays as bo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, FPS, SR = 1080, 1920, 24, 48000
dur_of = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                        capture_output=True, text=True, check=True).stdout)

m = json.load(open(sys.argv[1])); out = os.path.abspath(sys.argv[2])
ep = os.path.join(ROOT, m["episode_dir"])
ev = json.load(open(os.path.join(ROOT, m["event"])))
work = os.path.join(os.path.dirname(out), "work_" + os.path.splitext(os.path.basename(out))[0]); os.makedirs(work, exist_ok=True)
total = m["shots"][-1]["t"][1]

# end card lines from the event pack (evergreen: no date/time)
e = ev["end_card"]; ec = dict(m["end_card"])
ec["lines"] = ec["lines"][:2] + [e.get("event_line"), e.get("date_line"), e.get("time_line"), e.get("format_line")]
ec["registration"] = e["registration"]
if e.get("promo"): ec["promo"] = e["promo"]
bo.endcard({"end_card": ec}, os.path.join(work, "endcard.png"))
bo.title(os.path.join(work, "title.png"))

# dialogue: resolve files, lengths, captions
lines = []
for d in m["dialogue"]:
    f = os.path.join(ROOT, ev["invite_vo"][d["slot"]]["file"] if d.get("slot") else d["file"])
    n = dur_of(f); cap = os.path.join(work, f"cap_{d['id']}.png")
    bo.caption(d["text"], cap, y=d.get("cap_y", 1330))
    lines.append((d, f, n, cap))

ins, fc = [], []
def add(*a): ins.extend(a); return len([x for x in ins if x == "-i"]) - 1
# picture
vl = []
for k, s in enumerate(m["shots"]):
    i = add("-i", os.path.join(ep, s["file"]))
    a, b = s["t"]; sp = s.get("speed", 1.0); src_in = s.get("in", 0.0); L = b - a
    fc.append(f"[{i}:v]trim={src_in}:{src_in + L*sp},setpts=(PTS-STARTPTS)/{sp},fps={FPS},scale={W}:{H},setsar=1,format=yuv420p,"
              f"tpad=stop_mode=clone:stop_duration=1,trim=0:{L},setpts=PTS-STARTPTS[v{k}]")
    vl.append(f"[v{k}]")
fc.append("".join(vl) + f"concat=n={len(vl)}:v=1:a=0[base]")
# overlays
cur = "base"; n_ov = 0
ovs = [(os.path.join(work, "title.png"), o["t"]) for o in m["overlays"] if o["kind"] == "title"]
ovs += [(cap, (d["at"], d["at"] + n + 0.25)) for d, f, n, cap in lines if not d.get("no_caption")]
ovs += [(os.path.join(work, "endcard.png"), o["t"]) for o in m["overlays"] if o["kind"] == "endcard"]
for png, (a, b) in ovs:
    i = add("-loop", "1", "-t", str(total), "-i", png)
    fc.append(f"[{cur}][{i}:v]overlay=0:0:enable='between(t,{a},{b})'[o{n_ov}]"); cur = f"o{n_ov}"; n_ov += 1
# audio: dialogue stem
al = []
for j, (d, f, n, cap) in enumerate(lines):
    i = add("-i", f)
    fc.append(f"[{i}:a]aresample={SR},aformat=channel_layouts=stereo,volume={d.get('gain_db', 0)}dB,adelay={int(d['at']*1000)}:all=1[d{j}]"); al.append(f"[d{j}]")
fc.append("".join(al) + f"amix=inputs={len(al)}:normalize=0,apad=whole_dur={total}[dlg]")
# native clip audio
nl = []
for k, s in enumerate(m["shots"]):
    if "native_audio_db" in s:
        i = add("-i", os.path.join(ep, s["file"])); a, b = s["t"]; src_in = s.get("in", 0.0)
        fc.append(f"[{i}:a]atrim={src_in}:{src_in + b - a},asetpts=PTS-STARTPTS,aresample={SR},aformat=channel_layouts=stereo,"
                  f"volume={s['native_audio_db']}dB,afade=t=out:st={max(0, b-a-0.3)}:d=0.3,adelay={int(a*1000)}:all=1[n{k}]"); nl.append(f"[n{k}]")
mix = ["[dlg]"] + nl
if m.get("music_file"):
    i = add("-i", os.path.join(ROOT, m["music_file"]))
    fc.append(f"[{i}:a]aresample={SR},aformat=channel_layouts=stereo,volume={m.get('music_db', -14)}dB,atrim=0:{total},afade=t=out:st={total-2}:d=2[mus];"
              f"[dlg]asplit=2[dlg1][key];[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[duck]")
    mix = ["[dlg1]", "[duck]"] + nl
fc.append("".join(mix) + f"amix=inputs={len(mix)}:normalize=0,atrim=0:{total},loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
cmd = ["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", f"[{cur}]", "-map", "[aout]",
       "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-c:a", "aac", "-b:a", "192k", "-ar", str(SR), "-t", str(total), out]
subprocess.run(cmd, check=True)
print(out, round(dur_of(out), 2), "s (target", total, ")")
