"""Cut the lip-sync windows from the raw clips and build matching audio tracks.
Audio: line segs concatenated (each seg from its own input: no reused [0:a] label), delayed to its offset, padded to the window length."""
import subprocess, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
C = os.path.join(ROOT, "episodes/03-sonny-social-media/clips/v"); A = os.path.join(ROOT, "audio/voices/ep03/lipsync")
os.makedirs(A, exist_ok=True)
m = json.load(open(os.path.join(ROOT, "manifests/ep03-sonny-social-media.json")))
T = {s["id"]: s["t"] for s in m["shots"]}; AE = m["audio_edit"]
# name: (shot, src window in shot, line)
JOBS = {"S02": ("02", (0.0, 2.0), "L1"), "S05": ("05", (0.0, 2.4), "L3"), "S08a": ("08", (0.0, 2.45), "L5"),
        "S08b": ("08", (4.25, 5.57), "L7"), "S10": ("10", (0.0, 3.32), "L9")}
for name, (sid, (a, b), lid) in JOBS.items():
    raw = os.path.join(C, f"S{sid}_raw.mp4"); L = round(b - a, 3)
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(a), "-i", raw, "-t", str(L), "-an", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-r", "24", os.path.join(C, f"{name}_lsin.mp4")], check=True)
    f, segs, at = AE[lid]["file"], AE[lid]["segs"], AE[lid]["at"]
    off = round(at - (T[sid][0] + a), 3); assert off >= 0, (name, off)
    args = ["ffmpeg", "-nostdin", "-v", "error", "-y"]
    for _ in segs: args += ["-i", os.path.join(ROOT, f)]
    fc = [f"[{i}:a]atrim={s}:{e},asetpts=PTS-STARTPTS[p{i}]" for i, (s, e) in enumerate(segs)]
    d = int(off * 1000)
    fc.append("".join(f"[p{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,adelay={d}|{d},apad=whole_dur={L},atrim=0:{L}[o]")
    out = os.path.join(A, f"{name}_{lid}.mp3")
    subprocess.run(args + ["-filter_complex", ";".join(fc), "-map", "[o]", "-ac", "1", "-ar", "44100", "-b:a", "192k", out], check=True)
    dv = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(C, f"{name}_lsin.mp4")], capture_output=True, text=True).stdout)
    da = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], capture_output=True, text=True).stdout)
    print(f"{name}: window {a}-{b} ({L}s) video {dv:.3f}s audio {da:.3f}s line {lid} offset {off}s")
