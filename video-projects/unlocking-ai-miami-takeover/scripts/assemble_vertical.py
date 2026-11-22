"""Assemble a 32s 1080x1920 vertical episode from an episode manifest.

Usage: python3 scripts/assemble_vertical.py manifests/ep01-rachel-receptionist.json <out.mp4>

Steps:
  1. SFX stem: synthesized cues (ring/chime/click/whoosh) + native clip audio where flagged.
  2. Dialogue stem: trimmed/tightened lines placed on the timeline (Rachel gets phone EQ).
  3. Music stem: ducked under dialogue (sidechain).
  4. Picture: each shot trimmed to its slot; 9:16 clips cover-scaled, 3:4 clips over blurred fill.
  5. Overlays: title, Rachel lower-third, captions, end card - timed from the manifest.
Stems are written next to the output for re-mixing.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from manifest_util import load

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, FPS, SR = 1080, 1920, 24, 48000


def run(cmd):
    print(" ".join(cmd[:6]), "...")
    subprocess.run(cmd, check=True)


def sfx_source(kind, dur=None):
    """Return (lavfi expression, duration) for a synthesized cue. `dur` sizes the bed-type cues (Ep03+)."""
    # --- Ep03 additions (additive: Ep01/Ep02 cue types below are unchanged) ---
    if kind == "door_chime":
        kind = "chime"
    if kind == "fabric_rustle":  # soft cloth swish
        return ("anoisesrc=d=0.45:c=pink:a=0.5:r=48000:seed=11,bandpass=f=3200:w=2500,tremolo=f=14:d=0.6,afade=t=in:d=0.08,afade=t=out:st=0.2:d=0.25", 0.45)
    if kind == "glint":  # rising sparkle for the sunglasses beat
        return ("aevalsrc='0.25*sin(2*PI*(1800+2600*t)*t)*exp(-5*t)+0.15*sin(2*PI*4200*t)*exp(-9*t)':s=48000:d=0.45", 0.45)
    if kind == "card_accent":  # soft low hit + shimmer as the key card changes hands
        return ("aevalsrc='0.5*sin(2*PI*70*t)*exp(-7*t)+0.18*sin(2*PI*1568*t)*exp(-3*t)+0.12*sin(2*PI*2349*t)*exp(-3.5*t)':s=48000:d=0.9", 0.9)
    if kind == "door_open":  # latch click + short swish
        return ("aevalsrc='0.5*sin(2*PI*900*t)*exp(-60*t)+0.25*(2*random(0)-1)*sin(PI*t/0.45)':s=48000:d=0.45,lowpass=f=2500", 0.45)
    if kind == "door_close":  # car-door thud
        return ("aevalsrc='0.8*sin(2*PI*62*t)*exp(-14*t)+0.3*sin(2*PI*130*t)*exp(-20*t)':s=48000:d=0.5", 0.5)
    if kind == "boutique_ambience":  # quiet room tone
        d = dur or 5.0
        return (f"anoisesrc=d={d}:c=brown:a=0.35:r=48000:seed=21,lowpass=f=1200,highpass=f=80,afade=t=in:d=0.4,afade=t=out:st={max(d - 0.4, 0)}:d=0.4", d)
    if kind == "engine_idle_bed":  # muffled idle heard from inside the cabin
        d = dur or 3.0
        return (f"aevalsrc='0.35*sin(2*PI*41*t)*(0.65+0.35*sin(2*PI*8.5*t))+0.15*sin(2*PI*82*t)':s=48000:d={d},lowpass=f=300,afade=t=in:d=0.2,afade=t=out:st={max(d - 0.3, 0)}:d=0.3", d)
    if kind == "ring":   # vintage desk-phone bell: 440+480 Hz, 20 Hz trill, 0.9 s
        return ("aevalsrc='0.35*(sin(2*PI*440*t)+sin(2*PI*480*t))*(0.5+0.5*sgn(sin(2*PI*20*t)))*exp(-0.6*t)':s=48000:d=0.9", 0.9)
    if kind == "chime":  # two-note door chime
        return ("aevalsrc='0.4*sin(2*PI*1318*t)*exp(-3*t)+0.4*sin(2*PI*1046*(t-0.25))*exp(-3*(t-0.25))*gte(t,0.25)':s=48000:d=1.4", 1.4)
    if kind == "click":  # call-connect blip
        return ("aevalsrc='0.5*sin(2*PI*1400*t)*exp(-40*t)':s=48000:d=0.15", 0.15)
    if kind == "ping":   # notification pop (Ep02 inbox chaos)
        return ("aevalsrc='0.45*sin(2*PI*1760*t)*exp(-18*t)+0.3*sin(2*PI*2637*t)*exp(-22*t)':s=48000:d=0.3", 0.3)
    if kind == "whoosh":  # band-swept noise
        return ("anoisesrc=d=0.5:c=pink:a=0.6:r=48000:seed=7,highpass=f=400,lowpass=f=5000,afade=t=in:d=0.25,afade=t=out:st=0.25:d=0.25", 0.5)
    raise ValueError(kind)


def main(manifest, out):
    m = load(manifest)
    print("event:", m.get("_event_id", "(none)"))
    ep = os.path.dirname(os.path.dirname(os.path.abspath(manifest)))
    epdir = os.path.join(ROOT, m.get("episode_dir", "episodes/01-rachel-receptionist"))
    clips = os.path.join(epdir, "clips", "v")
    ovl = os.path.join(epdir, "overlays")
    work = os.path.join(os.path.dirname(os.path.abspath(out)), "stems_" + os.path.splitext(os.path.basename(out))[0])
    os.makedirs(work, exist_ok=True)
    dur = m["duration_s"]

    # ---------- 1. SFX stem ----------
    ins, fl, labels = [], [], []
    nin = 0
    for i, c in enumerate(m["sfx_cues"]):
        at_ms = int(c["at"] * 1000)
        if c["type"] == "native":
            ins += ["-i", os.path.join(clips, c.get("file", f"S{c['shot']}.mp4"))]
            idx = nin; nin += 1
            fl.append(f"[{idx}:a]atrim={c.get('src_in',0)}:{c.get('src_in',0)+c['dur']},asetpts=PTS-STARTPTS,aresample={SR},volume={c['gain_db']}dB,"
                      f"afade=t=out:st={c['dur']-0.3}:d=0.3,adelay={at_ms}|{at_ms}[s{i}]")
        else:
            src, d = sfx_source(c["type"], c.get("dur"))
            ins += ["-f", "lavfi", "-i", src]
            idx = nin; nin += 1
            gain = c.get("gain_db", {"ring": -6, "chime": -4, "click": -2, "whoosh": -8, "ping": -8, "door_chime": -6, "fabric_rustle": -14,
                                     "glint": -10, "card_accent": -6, "door_open": -8, "door_close": -6,
                                     "boutique_ambience": -26, "engine_idle_bed": -14}[c["type"]])
            fl.append(f"[{idx}:a]aformat=channel_layouts=stereo,volume={gain}dB,adelay={at_ms}|{at_ms}[s{i}]")
        labels.append(f"[s{i}]")
    fl.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad=whole_dur={dur},atrim=0:{dur}[sfx]")
    sfx = os.path.join(work, "sfx.wav")
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fl), "-map", "[sfx]", "-ac", "2", "-ar", str(SR), sfx])

    # ---------- 2. Dialogue stem ----------
    srcfile = {d["id"]: os.path.join(ROOT, d["file"]) for d in m["dialogue"] if "file" in d}
    ins, fl, labels = [], [], []
    for i, (key, e) in enumerate(m["audio_edit"].items()):
        ins += ["-i", os.path.join(ROOT, e["file"]) if "file" in e else srcfile[e.get("src", key)]]
        parts = []
        for j, (a, b) in enumerate(e["segs"]):
            fl.append(f"[{i}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={max(b-a-0.03,0)}:d=0.03[d{i}_{j}]")
            parts.append(f"[d{i}_{j}]")
        chain = f"{''.join(parts)}concat=n={len(parts)}:v=0:a=1,aresample={SR},aformat=channel_layouts=stereo"
        if e.get("trim_silence"):  # freshly generated event VO: strip lead/tail silence
            chain += ",silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        if e.get("device_eq"):  # laptop speaker: fuller than a phone
            chain += ",highpass=f=250,lowpass=f=6000,acompressor=threshold=-20dB:ratio=3,volume=1dB"
        if e.get("phone_eq"):
            chain += ",highpass=f=350,lowpass=f=3400,acompressor=threshold=-20dB:ratio=4,volume=2dB"
        at_ms = int(e["at"] * 1000)
        fl.append(f"{chain},adelay={at_ms}|{at_ms}[d{i}]")
        labels.append(f"[d{i}]")
    fl.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad=whole_dur={dur},atrim=0:{dur},"
              f"loudnorm=I=-16:TP=-1.5:LRA=7[dlg]")
    dlg = os.path.join(work, "dialogue.wav")
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fl), "-map", "[dlg]", "-ar", str(SR), dlg])

    # ---------- 3. Music stem + mix ----------
    music = os.path.join(ROOT, m.get("music_file", "audio/music/ep01_synthwave_32s.mp3"))
    mix = os.path.join(work, "mix.wav")
    fo_st, fo_d = m.get("music_fade_out", [dur - 0.4, 0.4])
    run(["ffmpeg", "-v", "error", "-y", "-i", music, "-i", dlg, "-i", sfx, "-filter_complex",
         f"[0:a]aresample={SR},atrim=0:{dur},volume=-7dB,afade=t=out:st={fo_st}:d={fo_d},apad=whole_dur={dur}[mus];"
         f"[1:a]asplit=2[dl][key];"
         f"[mus][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[duck];"
         f"[duck][dl][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.89[mix]",
         "-map", "[mix]", "-ar", str(SR), mix])

    # ---------- 4. Picture ----------
    ins, fl, vlabels = [], [], []
    for i, s in enumerate(m["shots"]):
        t0, t1 = s["t"]; d = round(t1 - t0, 3)
        ins += ["-i", os.path.join(clips, s.get("file", f"S{s['id']}.mp4"))]
        a0 = s.get("src_in", 0); sp = s.get("slow", 1.0)  # source in-point (s) and slow-down factor
        base = f"[{i}:v]trim={a0}:{a0 + d / sp},setpts=(PTS-STARTPTS)*{sp},fps={FPS},trim=0:{d},setpts=PTS-STARTPTS"
        if s["ratio"] == "3:4":
            fl.append(f"{base},split=2[a{i}][b{i}]")
            fl.append(f"[a{i}]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=40:4,eq=brightness=-0.12:saturation=1.2[bg{i}]")
            fl.append(f"[b{i}]scale={W}:-2[fg{i}]")
            fl.append(f"[bg{i}][fg{i}]overlay=0:(H-h)/2,setsar=1[v{i}]")
        else:
            fl.append(f"{base},scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1[v{i}]")
        vlabels.append(f"[v{i}]")
    fl.append(f"{''.join(vlabels)}concat=n={len(vlabels)}:v=1:a=0[pic]")

    # ---------- 5. Overlays ----------
    cur = "[pic]"
    n = len(m["shots"])
    items = [(o["file"], o["t"]) for o in m["overlays"]] + [(f"cap_{c['id']}.png", c["t"]) for c in m["captions"]]
    for k, (f, (a, b)) in enumerate(items):
        ins += ["-loop", "1", "-t", str(dur), "-i", os.path.join(ovl, f)]
        idx = n + k
        fout = "" if b >= dur else f",fade=t=out:st={b-0.15}:d=0.15:alpha=1"
        fade = f"[{idx}:v]format=rgba,fade=t=in:st={a}:d=0.15:alpha=1{fout}[o{k}]"
        fl.append(fade)
        fl.append(f"{cur}[o{k}]overlay=0:0:enable='between(t,{a},{b})'[c{k}]")
        cur = f"[c{k}]"
    ins += ["-i", mix]
    fl.append(f"{cur}format=yuv420p[vout]")
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fl),
         "-map", "[vout]", "-map", f"{n + len(items)}:a", "-t", str(dur),
         "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-r", str(FPS),
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
    print("wrote", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
