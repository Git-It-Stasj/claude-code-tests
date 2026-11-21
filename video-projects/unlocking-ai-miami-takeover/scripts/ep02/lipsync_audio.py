"""Build a lip-sync input track: the clip's exact length, with the trimmed line placed at its on-screen offset."""
import sys, subprocess
src, segs, offset, length, out = sys.argv[1], eval(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
fl = [f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[p{i}]" for i, (a, b) in enumerate(segs)]
fl.append("".join(f"[p{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,adelay={int(offset*1000)}|{int(offset*1000)},apad=whole_dur={length},atrim=0:{length}[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", ";".join(fl), "-map", "[o]", "-ac", "1", "-ar", "44100", "-b:a", "192k", out], check=True)
