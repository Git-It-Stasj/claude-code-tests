"""Lip-sync inputs v2: any source clip + any source window, audio placed at the line's on-screen offset in the SHOT.
usage: lipsync_prep2.py NAME RAWCLIP SHOT_ID SRC_A SRC_B LINE_ID [shot_offset_of_window]"""
import sys, os, json, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
C = os.path.join(ROOT, "episodes/03-sonny-social-media/clips/v"); A = os.path.join(ROOT, "audio/voices/ep03/lipsync")
name, raw, sid, a, b, lid = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), sys.argv[6]
win_off = float(sys.argv[7]) if len(sys.argv) > 7 else 0.0   # where this window starts inside the shot
m = json.load(open(os.path.join(ROOT, "manifests/ep03-sonny-social-media.json")))
T = {s["id"]: s["t"] for s in m["shots"]}; e = m["audio_edit"][lid]; L = round(b - a, 3)
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(a), "-i", os.path.join(C, raw), "-t", str(L), "-an", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-r", "24", os.path.join(C, f"{name}_lsin.mp4")], check=True)
off = round(e["at"] - (T[sid][0] + win_off), 3)
segs = [list(x) for x in e["segs"]]
if off < 0:  # file starts before the window (lead silence): trim it off instead of delaying
    assert -off < 0.3, off; segs[0][0] += -off; off = 0.0
args = ["ffmpeg", "-nostdin", "-v", "error", "-y"]
for _ in segs: args += ["-i", os.path.join(ROOT, e["file"])]
fc = [f"[{i}:a]atrim={s}:{t},asetpts=PTS-STARTPTS[p{i}]" for i, (s, t) in enumerate(segs)]
d = int(off * 1000)
fc.append("".join(f"[p{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,adelay={d}|{d},apad=whole_dur={L},atrim=0:{L}[o]")
out = os.path.join(A, f"{name}_{lid}.mp3")
subprocess.run(args + ["-filter_complex", ";".join(fc), "-map", "[o]", "-ac", "1", "-ar", "44100", "-b:a", "192k", out], check=True)
print(f"{name}: {raw} src {a}-{b} ({L}s), {lid} offset {off}s -> {name}_lsin.mp4 + {os.path.basename(out)}")
