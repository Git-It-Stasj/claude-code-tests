"""Assemble EP04 (Stan) vertical cut from edit.json.

Usage: python3 assemble_ep04.py edit.json out.mp4
Picture: each shot trimmed [in, in+dur] from its clip, scaled/cropped to 1080x1920, concatenated.
Audio: music bed (ducked under dialogue), dialogue lines at absolute times, simple SFX.
Overlays (PNG, built with ../../scripts/build_overlays.py helpers): title, Stan label, captions, end card.
"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
import build_overlays as bo  # noqa: E402

W, H, FPS, SR = 1080, 1920, 24, 48000


def run(cmd):
    subprocess.run(cmd, check=True)


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


def main(edit_path, out):
    e = json.load(open(edit_path))
    work = os.path.join(HERE, "work", os.path.splitext(os.path.basename(out))[0])
    os.makedirs(work, exist_ok=True)

    # ---- overlays ----
    ov = os.path.join(work, "ov"); os.makedirs(ov, exist_ok=True)
    bo.title(os.path.join(ov, "title.png"))
    bo.employee_lt(os.path.join(ov, "stan_lt.png"), e["lower_third"]["name"], e["lower_third"]["role"])
    bo.endcard({"end_card": e["end_card"]}, os.path.join(ov, "endcard.png"))
    for c in e["captions"]:
        bo.caption(c["text"], os.path.join(ov, f"cap_{c['id']}.png"))

    # ---- picture: trim + normalize each shot, then concat ----
    parts, t = [], 0.0
    lst = os.path.join(work, "list.txt")
    with open(lst, "w") as fl:
        for i, s in enumerate(e["shots"]):
            p = os.path.join(work, f"v{i:02d}.mp4")
            vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},setsar=1"
            if s.get("hold_first"):  # freeze the first frame for N seconds before the clip plays
                vf = f"{vf},tpad=start_duration={s['hold_first']}:start_mode=clone"
            run(["ffmpeg", "-v", "error", "-y", "-ss", str(s["in"]), "-i", os.path.join(HERE, s["file"]),
                 "-map", "0:v:0", "-t", str(s["dur"]), "-vf", vf, "-an", "-c:v", "libx264", "-crf", "16",
                 "-pix_fmt", "yuv420p", p])
            fl.write(f"file '{p}'\n")
            s["_t"] = t; t += s["dur"]
    total = t
    pic = os.path.join(work, "picture.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", pic])

    # ---- overlays onto picture ----
    ins, fg, last = ["-i", pic], [], "0:v"
    ovs = [("title.png", *e["title_window"]), ("stan_lt.png", *e["lower_third"]["window"]),
           ("endcard.png", *e["end_card"]["window"])] + [(f"cap_{c['id']}.png", *c["t"]) for c in e["captions"]]
    for k, (f, a, b) in enumerate(ovs):
        ins += ["-loop", "1", "-framerate", str(FPS), "-t", str(total), "-i", os.path.join(ov, f)]
        fade = f",fade=in:st={a}:d=0.15:alpha=1,fade=out:st={b - 0.15}:d=0.15:alpha=1"
        fg.append(f"[{k + 1}:v]format=rgba{fade}[o{k}]")
        fg.append(f"[{last}][o{k}]overlay=0:0:enable='between(t,{a},{b})'[v{k}]")
        last = f"v{k}"
    picov = os.path.join(work, "picture_ov.mp4")
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fg), "-map", f"[{last}]",
         "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p", "-t", str(total), picov])

    # ---- dialogue stem ----
    ins, fg, labels = [], [], []
    for k, d in enumerate(e["dialogue"]):
        ins += ["-i", os.path.join(HERE, d["file"])]
        eq = ",highpass=f=300,lowpass=f=3800,acompressor" if d.get("screen_eq") else ""
        ms = int(d["at"] * 1000)
        fg.append(f"[{k}:a]aresample={SR},aformat=channel_layouts=stereo,volume={d.get('gain_db', 0)}dB{eq},adelay={ms}|{ms}[d{k}]")
        labels.append(f"[d{k}]")
    fg.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{total}[dlg]")
    dlg = os.path.join(work, "dialogue.wav")
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fg), "-map", "[dlg]", "-ar", str(SR), dlg])

    # ---- sfx stem (synthesized cues) ----
    srcs = {
        "engine": "anoisesrc=d={d}:c=brown:a=0.5:r=48000:seed=3,lowpass=f=180,volume=1.6,afade=t=in:d=0.3,afade=t=out:st={fo}:d=0.6",
        "wind": "anoisesrc=d={d}:c=pink:a=0.35:r=48000:seed=11,bandpass=f=900:w=600,afade=t=in:d=0.2,afade=t=out:st={fo}:d=0.3",
        "ui": "aevalsrc='0.35*sin(2*PI*1760*t)*exp(-18*t)+0.25*sin(2*PI*2637*(t-0.08))*exp(-18*(t-0.08))*gte(t,0.08)':s=48000:d={d}",
        "whoosh": "anoisesrc=d={d}:c=pink:a=0.5:r=48000:seed=7,highpass=f=400,lowpass=f=5000,afade=t=in:d={h},afade=t=out:st={h}:d={h}",
        "card": "anoisesrc=d={d}:c=white:a=0.25:r=48000:seed=5,highpass=f=2500,afade=t=out:st=0.02:d=0.1",
        "type": "aevalsrc='0.3*sin(2*PI*2200*t)*exp(-60*mod(t,0.11))':s=48000:d={d}",
    }
    ins, fg, labels = [], [], []
    for k, c in enumerate(e["sfx"]):
        expr = srcs[c["type"]].format(d=c["dur"], fo=max(c["dur"] - 0.6, 0), h=c["dur"] / 2)
        ins += ["-f", "lavfi", "-i", expr]
        ms = int(c["at"] * 1000)
        fg.append(f"[{k}:a]aformat=channel_layouts=stereo,volume={c.get('gain_db', 0)}dB,adelay={ms}|{ms}[s{k}]")
        labels.append(f"[s{k}]")
    fg.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{total}[sfx]")
    sfx = os.path.join(work, "sfx.wav")
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fg), "-map", "[sfx]", "-ar", str(SR), sfx])

    # ---- music: trim/fade, volume automation for the tumbleweed drop, duck under dialogue ----
    mu = e["music"]
    drop = "+".join(f"between(t,{a},{b})" for a, b in mu.get("drops", [])) or "0"
    mfil = (f"[0:a]aresample={SR},aformat=channel_layouts=stereo,atrim=0:{total},asetpts=PTS-STARTPTS,"
            f"volume={mu.get('gain_db', -6)}dB,volume='if({drop},0.12,1)':eval=frame,"
            f"afade=t=out:st={total - mu.get('fade_out', 1.5)}:d={mu.get('fade_out', 1.5)}[m];"
            f"[1:a]asplit=2[sc][dl];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];"
            f"[md][dl][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.95[mix]")
    mix = os.path.join(work, "mix.wav")
    run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(HERE, mu["file"]), "-i", dlg, "-i", sfx,
         "-filter_complex", mfil, "-map", "[mix]", "-ar", str(SR), "-t", str(total), mix])

    run(["ffmpeg", "-v", "error", "-y", "-i", picov, "-i", mix, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
         "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR),
         "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out])
    print(out, round(dur(out), 2), "s (timeline", round(total, 2), ")")
    for s in e["shots"]:
        print(f"  {s['id']:5s} {s['_t']:6.2f}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
