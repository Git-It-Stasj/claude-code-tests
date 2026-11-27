"""Build manifests/ep06-walter-website.json (timeline, dialogue, captions, SFX) and prep lip-sync inputs.

Usage:
  python3 scripts/build_ep06_manifest.py            # write manifest
  python3 scripts/build_ep06_manifest.py --lipsync  # also cut lip-sync source clips + speaker-only audio
Lip-sync inputs land in episodes/06-walter-website/06-lipsync/in/: <shot>_video.mp4 is the shot exactly as
it plays in the edit (trimmed/slowed), <shot>_audio.wav holds only the on-screen speaker's lines at their
edit positions. When a shot's lip-sync result exists as 06-lipsync/out/<shot>_lipsync.mp4, the manifest uses it.
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = "episodes/06-walter-website"
CLIPS = os.path.join(ROOT, EP, "04-generated-clips")
LS = os.path.join(ROOT, EP, "06-lipsync")
V = "audio/voices/ep06/"
SR = 48000

# id, edit length s, clip, source in-point s, slow factor (>1 = slower), desc
SHOTS = [
    ("01", 1.6, "EP06_SH01_R02.mp4", 0.5, 1.0, "Ferrari arrives outside Delgado Custom Renovations"),
    ("02", 1.1, "EP06_SH02_R01.mp4", 0.0, 1.0, "Noelle enters"),
    ("03", 2.4, "EP06_SH03_R01.mp4", 0.3, 1.0, "Meet Vic"),
    ("04", 1.5, "EP06_SH04_R01.mp4", 0.2, 1.0, "Project gallery"),
    ("05", 0.9, "EP06_SH05_R01.mp4", 1.0, 1.0, "Website inquiry - Noelle reaches for monitor"),
    ("06", 1.6, "EP06_SH06_R01.mp4", 0.2, 1.0, "Monitor turned - outdated website"),
    ("07A", 0.9, "EP06_SH07A_R02.mp4", 1.1, 1.0, "Noelle peers over sunglasses"),
    ("07B", 1.6, "EP06_SH07B_R01.mp4", 0.0, 1.0, "Push-in - You missed a spot"),
    ("08", 5.8, "EP06_SH08_R01.mp4", 0.0, 1.16, "Vic's defense"),
    ("09", 2.8, "EP06_SH09_R01.mp4", 0.1, 1.0, "I know a guy"),
    ("10A", 1.2, "EP06_SH10A_R01.mp4", 0.8, 1.0, "Meet Walter"),
    ("10B-12B", 6.5, "EP06_SH10B-12B_SCREEN_R03.mp4", 0.0, 1.0, "Walter profile -> audit -> improvements -> updates in progress (post composite)"),
    ("12C", 1.2, "EP06_SH12C_R03.mp4", 3.8, 1.0, "Finished website reveal"),
    ("13", 2.1, "EP06_SH13_R02.mp4", 0.4, 1.0, "Now THAT'S craftsmanship"),
    ("14", 3.2, "EP06_SH14_R01.mp4", 0.3, 1.0, "Golden key invitation handoff"),
    ("15", 2.4, "EP06_SH15_R01.mp4", 0.0, 1.0, "Don't push it, Vic - walkout"),
    ("16A", 1.3, "EP06_SH16A_R01.mp4", 0.3, 1.0, "Ferrari departs (BBY TIGR)"),
    ("16B", 3.0, "EP06_SH16B_R01.mp4", 0.5, 1.0, "Into the Miami sunset + end card"),
]

# id, speaker, text, file, segs in file, shot, offset into shot (s)
LINES = [
    ("L01", "VIC", "I specialize in bringing outdated spaces into the modern era.", "EP06_L01_VIC_specialize.mp3", [[0, 4.0]], "03", 0.15),
    ("L02", "NOELLE", "You missed a spot.", "EP06_L02_NOELLE_missed_spot.mp3", [[0, 1.2]], "07B", 0.1),
    ("L03", "VIC", "Hey! I built that myself.", "EP06_L03_VIC_built_it_myself.mp3", [[0, 1.95]], "08", 0.05),
    ("L04", "NOELLE", "I can tell.", "EP06_L04_NOELLE_i_can_tell.mp3", [[0, 0.95]], "08", 2.15),
    ("L05", "VIC", "I'm a contractor, not a web designer.", "EP06_L05_VIC_contractor.mp3", [[0, 2.5]], "08", 3.3),
    ("L06", "NOELLE", "Relax. I know a guy.", "EP06_L06_NOELLE_know_a_guy.mp3", [[0, 2.6]], "09", 0.1),
    ("L07a", "NOELLE", "Meet Walter.", "EP06_L07_NOELLE_meet_walter.mp3", [[0, 1.12]], "10A", 0.08),
    ("L07b", "NOELLE", "Your AI website builder.", "EP06_L07_NOELLE_meet_walter.mp3", [[1.25, 3.08]], "10B-12B", 0.12),
    ("L08", "WALTER", "Let's give your website the same attention to detail... you give your homes.", "EP06_L08_WALTER_attention_to_detail.mp3", [[0, 4.52]], "10B-12B", 1.95),
    ("L09", "VIC", "Now THAT'S craftsmanship.", "EP06_L09_VIC_craftsmanship.mp3", [[0, 1.95]], "13", 0.15),
    ("L10", "VIC", "Hey! Does he do kitchens?", "EP06_L10_VIC_kitchens.mp3", [[0, 1.88]], "14", 1.25),
    ("L11", "NOELLE", "Don't push it, Vic.", "EP06_L11_NOELLE_dont_push_it.mp3", [[0, 1.72]], "15", 0.15),
]
# shots where the speaker's face is on screen -> lip sync (CLAUDE.md: only on-screen speakers)
LIPSYNC = {"03": ["L01"], "07B": ["L02"], "08": ["L03", "L05"], "09": ["L06"], "10A": ["L07a"], "13": ["L09"], "14": ["L10"]}


def starts():
    t, out = 0.0, {}
    for s in SHOTS:
        out[s[0]] = round(t, 3); t += s[1]
    return out, round(t, 3)


def manifest():
    st, dur = starts()
    shots = []
    for sid, d, f, a0, sp, desc in SHOTS:
        e = {"id": sid, "t": [st[sid], round(st[sid] + d, 3)], "ratio": "9:16", "desc": desc}
        lsf = os.path.join(LS, "out", f"{sid}_lipsync.mp4")
        if sid in LIPSYNC and os.path.exists(lsf):
            e.update({"file": os.path.relpath(lsf, CLIPS), "lipsync": True})
        else:
            e.update({"file": f, "src_in": a0, "slow": sp})
        shots.append(e)
    dialogue, edit, caps = [], {}, []
    for lid, spk, text, f, segs, sid, off in LINES:
        at = round(st[sid] + off, 3)
        dialogue.append({"id": lid, "speaker": spk, "text": text, "file": V + f})
        edit[lid] = {"at": at, "segs": segs}
        caps.append({"id": lid.lower(), "text": text.replace("...", "…"), "t": [at, round(at + sum(b - a for a, b in segs), 3)]})
    sfx = [
        {"type": "native", "path": "audio/sfx/ep06/car_arrive_v8_stop_idle.mp3", "src_in": 7.5, "at": 0.0, "dur": 3.0, "gain_db": -8},
        {"type": "native", "path": "audio/sfx/ep06/ambience_waves_distant_city.mp3", "src_in": 2.0, "at": 0.0, "dur": st["02"] + 1.1, "gain_db": -14},
        {"type": "whoosh", "at": round(st["06"] + 0.15, 3)},
        {"type": "native", "path": "audio/sfx/ep06/ui_startup_shimmer.mp3", "src_in": 0.0, "at": st["10B-12B"], "dur": 2.0, "gain_db": -9},
        {"type": "native", "path": "audio/sfx/ep06/digital_sweep.mp3", "src_in": 0.0, "at": round(st["10B-12B"] + 3.5, 3), "dur": 1.3, "gain_db": -12},
        {"type": "native", "path": "audio/sfx/ep06/ui_achievement.mp3", "src_in": 0.0, "at": round(st["10B-12B"] + 5.6, 3), "dur": 1.0, "gain_db": -9},
        {"type": "native", "path": "audio/sfx/ep06/ui_success_melodic.mp3", "src_in": 0.0, "at": round(st["12C"] + 0.05, 3), "dur": 1.0, "gain_db": -9},
        {"type": "native", "path": "audio/sfx/ep06/car_pull_away_fast.mp3", "src_in": 3.3, "at": st["16A"], "dur": round(dur - st["16A"], 3), "gain_db": -6},
        {"type": "native", "path": "audio/sfx/ep06/ambience_waves_distant_city.mp3", "src_in": 20.0, "at": st["16A"], "dur": round(dur - st["16A"], 3), "gain_db": -14},
    ]
    return {
        "episode": 6, "title": "Walter: The Website Makeover", "version": 1,
        "featured_ai_employee": {"name": "Walter", "role": "AI Website Builder", "vendor": "Marblism",
                                 "claim_scope": "Website redesign is a dramatization; no performance statistics shown."},
        "characters": ["NOELLE_01", "VIC_DELGADO", "WALTER_01"],
        "voices": {"NOELLE": "Sloane b57b22a0-f287-405b-bc82-6f08f5e6bb1f (stab 0.45 / sim 0.8)",
                   "VIC": "Gideon 1ad38ba4-9cc4-4f2f-9fde-b0fefdf67ae5 (stab 0.4 / sim 0.8) - user pick",
                   "WALTER": "Barrett d603a8cd-3fe1-55e0-9245-617a2589131e (stab 0.5 / sim 0.8) - user pick",
                   "model": "elevenlabs_v4"},
        "frame": [1080, 1920], "duration_s": dur,
        "episode_dir": EP, "clips_dir": "04-generated-clips", "overlay_subdir": "07-overlays",
        "music_file": "audio/music/ep06_walter_bed_40s_R01.mp3", "music_fade_out": [39.4, 0.65],
        "license_plate": "BBY TIGR - visible in shot 16A.",
        "shots": shots, "dialogue": dialogue, "audio_edit": edit, "captions": caps, "sfx_cues": sfx,
        "lower_third": {"name": "WALTER", "role": "AI WEBSITE BUILDER", "file": "walter_lt.png"},
        "overlays": [{"file": "title.png", "t": [0.15, 1.6]}, {"file": "endcard.png", "t": [round(st["16B"] + 0.3, 3), dur]}],
        "end_card": {"lines": ["UNLOCKING AI CHALLENGE", "BUILD AN AI-AMPLIFIED BUSINESS", "LIVE ONLINE", None, None, "LIMITED SEATS"],
                     "registration": "stan.store/noelleai/unlockingai",
                     "_note": "Evergreen pack lines without the promo-code line (brief: no time-limited offers)."},
        "lipsync": {"model": "sync_so", "shots": LIPSYNC, "dir": EP + "/06-lipsync"},
        "retired_takes": ["EP06_SH01_R01.mp4 (car turned to camera, lost roof)", "EP06_SH07A_R01.mp4 (sunglasses removed)",
                          "EP06_SH13_R01.mp4 (pencil/shaved side lost)", "EP06_SH12C_R01.mp4 (faced camera, URL garbled)", "EP06_SH12C_R02.mp4 (clear glasses; user: sunglasses)",
                          "EP06_SH10B-12B_SCREEN_R01/R02.mp4 (R02 order 10B-11A-11B-12A-12B; user asked for 11A-12A-12B)"],
    }


def prep_lipsync(m):
    os.makedirs(os.path.join(LS, "in"), exist_ok=True)
    st, _ = starts()
    shots = {s[0]: s for s in SHOTS}
    lines = {l[0]: l for l in LINES}
    for sid, lids in LIPSYNC.items():
        _, d, f, a0, sp, _ = shots[sid]
        vout = os.path.join(LS, "in", f"{sid}_video.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(CLIPS, f), "-vf",
                        f"trim={a0}:{a0 + d / sp},setpts=(PTS-STARTPTS)*{sp},fps=24,trim=0:{d},setpts=PTS-STARTPTS",
                        "-an", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", vout], check=True)
        ins, fl, lab = [], [], []
        for i, lid in enumerate(lids):
            _, _, _, lf, segs, _, off = lines[lid]
            a, b = segs[0]
            ins += ["-i", os.path.join(ROOT, V + lf)]
            ms = int(off * 1000)
            fl.append(f"[{i}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample={SR},adelay={ms}|{ms}[a{i}]")
            lab.append(f"[a{i}]")
        fl.append(f"{''.join(lab)}amix=inputs={len(lab)}:normalize=0,apad=whole_dur={d},atrim=0:{d}[o]")
        aout = os.path.join(LS, "in", f"{sid}_audio.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fl), "-map", "[o]",
                        "-ac", "1", "-ar", str(SR), aout], check=True)
        print(sid, d, vout, aout)


if __name__ == "__main__":
    m = manifest()
    out = os.path.join(ROOT, "manifests", "ep06-walter-website.json")
    json.dump(m, open(out, "w"), indent=1)
    print("wrote", out, "duration", m["duration_s"])
    if "--lipsync" in sys.argv:
        prep_lipsync(m)
