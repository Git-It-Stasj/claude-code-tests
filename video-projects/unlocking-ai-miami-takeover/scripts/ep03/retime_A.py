"""Option A retime (director, 2026-11-22): fit the recorded dialogue in 35.0s without speeding voices.
Internal pauses in L4/L9 are trimmed with segs; dialogue shots grow, non-dialogue holds shrink.
Lines are placed by measured speech onset; asserts every line ends inside its shot."""
import os, subprocess, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOTAL = 35.0

def onset_end(path, segs):
    """(lead silence, speech end) in the concatenated-segs timeline."""
    trim = ";".join(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[s{i}]" for i, (a, b) in enumerate(segs))
    cat = "".join(f"[s{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1[o]"
    tmp = "/tmp/claude-0/-home-user-claude-code-tests/a4a18822-d57f-5271-b4d4-6821e78a9fa5/scratchpad/_seg.wav"
    # each seg gets its own input to avoid reusing [0:a] (project filtergraph rule)
    args = ["ffmpeg", "-nostdin", "-v", "error", "-y"]
    for _ in segs: args += ["-i", os.path.join(ROOT, path)]
    fc = ";".join(f"[{i}:a]atrim={a}:{b},asetpts=PTS-STARTPTS[s{i}]" for i, (a, b) in enumerate(segs)) + ";" + cat
    subprocess.run(args + ["-filter_complex", fc, "-map", "[o]", tmp], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", tmp], capture_output=True, text=True).stdout)
    out = subprocess.run(["ffmpeg", "-nostdin", "-i", tmp, "-af", "silencedetect=n=-40dB:d=0.05", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", out)]
    lead = en[0] if st and st[0] < 0.01 and en else 0.0
    end = dur
    if st and (len(en) < len(st) or en[-1] >= dur - 0.03):  # trailing silence runs to EOF
        end = st[-1]
    return round(lead, 3), round(end, 3)

LINES = {  # id: (file, segs)
 "L1": ("audio/voices/ep03/L1_noelle.mp3", [[0, 99]]),
 "L2": ("audio/voices/ep03/L2_sonny.mp3", [[0, 99]]),
 "L3": ("audio/voices/ep03/L3_val.mp3", [[0, 99]]),
 "L4": ("audio/voices/ep03/L4_noelle.mp3", [[0, 0.82], [1.02, 2.69]]),
 "L5": ("audio/voices/ep03/L5_noelle.mp3", [[0, 99]]),
 "L6": ("audio/voices/ep03/L6_val.mp3", [[0, 99]]),
 "L7": ("audio/voices/ep03/L7_noelle.mp3", [[0, 99]]),
 "L8": ("audio/voices/ep03/L8_sonny.mp3", [[0, 99]]),
 "L9": ("audio/voices/ep03/L9_val.mp3", [[0, 0.57], [0.83, 2.14]]),
 "L9b": ("audio/voices/ep03/L9_val.mp3", [[2.50, 3.87]]),  # 'How do I get this?' placed separately (v3 sync nudge)
 "L6a": ("audio/voices/events/evergreen-ep03/L6a.mp3", [[0, 99]]),
}

def apply(m):
    M = {k: (f, s, *onset_end(f, s)) for k, (f, s) in LINES.items()}  # file, segs, lead, end
    place, T = {}, {}
    def put(lid, speech_start):
        f, s, lead, end = M[lid]; at = round(speech_start - lead, 2)
        place[lid] = (at, round(at + lead, 2), round(at + end, 2)); return place[lid][2]
    t = 0.0
    def shot(sid, dur): 
        nonlocal t; T[sid] = [round(t, 2), round(t + dur, 2)]; t += dur
    shot("01", 1.8); shot("02", 2.0); put("L1", T["02"][0] + 0.35)
    shot("03", 1.8); put("L2", T["03"][0] + 0.1)
    shot("04", 1.3); shot("05", 2.4); put("L3", T["05"][0] + 0.7)
    shot("06", 2.5); put("L4", T["06"][0] + 0.1)
    s0 = t; e = put("L5", s0 + 0.1); shot("08", round(e + 0.06 - s0, 2))
    s0 = t; e = put("L6", s0 + 0.04); shot("08V", round(e + 0.06 - s0, 2))
    s0 = t; e = put("L7", s0 + 0.04); shot("08B", round(e + 0.12 - s0, 2))
    shot("09", 3.0); put("L8", T["09"][0] + 0.15)
    # v3: voice nudged later to match the synced mouth (measured lag: 2 frames on part 1, 7-8 frames on part 2)
    s10 = t; e = put("L9", s10 + 0.1 + 0.08)
    e = put("L9b", place["L9"][0] + 1.88 + 0.22 + M["L9b"][2]); shot("10", round(e + 0.08 - s10, 2))
    shot("11G", 1.2); put("L6a", T["11G"][0] + 0.05)
    shot("11", 3.0); L6b_at = round(T["11"][0] + 0.1, 2)
    shot("12", 1.3); shot("12A", 1.1); shot("12B", 2.0); shot("13", round(TOTAL - t, 2))
    owner = {"L1": "02", "L2": "03", "L3": "05", "L4": "06", "L5": "08", "L6": "08V", "L7": "08B", "L8": "09", "L9": "10", "L9b": "10", "L6a": "11G"}
    for lid, sid in owner.items():
        a, b = T[sid]; assert a <= place[lid][1] and place[lid][2] <= b + 1e-6, (lid, place[lid], T[sid])
    assert T["13"][1] - T["13"][0] >= 2.5, T["13"]
    for s in m["shots"]:
        s["t"] = T[s["id"]]; s["dur"] = round(s["t"][1] - s["t"][0], 2)
        if s["id"] == "09": s["extra_timing"] = "drafts pop +0.35/+0.75/+1.15s, Review ticks +1.6/+1.9/+2.2s, Queue+Schedule pulse +2.55s (shot-relative)"
    m["audio_edit"] = {lid: {"file": M[lid][0], "at": place[lid][0], "segs": M[lid][1], **({"device_eq": True} if lid == "L8" else {})} for lid in place if lid != "L6a"}
    txt = {d["id"]: d["text"] for d in m["dialogue"]}
    caps = []
    for i, lid in enumerate(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9"], 1):
        endp = place["L9b"][2] if lid == "L9" else place[lid][2]
        a, b = T[owner[lid]]; c = {"id": f"c{i}", "text": txt[lid] if lid != "L8" else f"\"{txt[lid]}\"", "t": [round(max(a, place[lid][1] - 0.05), 2), round(min(b, endp + 0.12), 2)]}
        if lid in ("L5", "L7"): c["y"] = 1600
        if lid == "L8": c["y"] = 1660
        caps.append(c)
    for prev, cur in zip(caps, caps[1:]):  # never two captions on screen at once
        if cur["t"][0] < prev["t"][1] + 0.02: prev["t"][1] = round(cur["t"][0] - 0.02, 2)
    caps.append({"id": "c10", "text": "", "t": [round(place["L6a"][1] - 0.05, 2), round(T["11G"][1] - 0.05, 2)]})
    caps.append({"id": "c11", "text": "", "t": [L6b_at, round(L6b_at + 2.95, 2)]})
    m["captions"] = caps
    m["event_slots"]["L6a"].update({"at": place["L6a"][0], "max_s": 1.15}); m["event_slots"]["L6b"].update({"at": L6b_at, "max_s": 2.9})
    S = lambda sid, off: round(T[sid][0] + off, 2)
    m["sfx_cues"] = [
     {"type": "native", "shot": "01", "file": "S01_raw.mp4", "at": 0.0, "dur": T["01"][1], "gain_db": -4, "_note": "native engine settle"},
     {"type": "engine_idle_bed", "at": T["02"][0], "dur": T["04"][0] - T["02"][0], "gain_db": -18, "_note": "muffled cabin idle"},
     {"type": "boutique_ambience", "at": T["04"][0], "dur": T["12A"][0] - T["04"][0], "gain_db": -24},
     {"type": "door_chime", "at": S("04", 0.1)},
     {"type": "fabric_rustle", "at": S("05", 0.1)}, {"type": "fabric_rustle", "at": S("05", 1.5)},
     {"type": "whoosh", "at": S("09", -0.1), "_note": "punch-in to S09"},
     *[{"type": "ping", "at": S("09", o)} for o in (0.35, 0.75, 1.15)],
     *[{"type": "click", "at": S("09", o)} for o in (1.6, 1.9, 2.2)], {"type": "chime", "at": S("09", 2.55)},
     {"type": "glint", "at": S("11G", 0.3), "_note": "sunglasses"},
     {"type": "card_accent", "at": S("11", 0.6)},
     {"type": "door_open", "at": S("12A", 0.05)}, {"type": "door_close", "at": S("12A", 1.15)},
     {"type": "click", "at": S("12B", 0.62)}, {"type": "click", "at": S("12B", 1.5)},
     {"type": "native", "shot": "13", "file": "S13_raw.mp4", "at": T["13"][0], "dur": round(TOTAL - T["13"][0], 2), "gain_db": 2, "_note": "native drive-off engine (Ep02 pattern)"},
    ]
    m["overlays"] = [{"file": "title.png", "t": [0.3, 1.7]}, {"file": "sonny_lt.png", "t": [S("09", 0.1), S("09", 2.9)]}, {"file": "endcard.png", "t": [S("13", 0.6), TOTAL]}]
    m["end_card"]["window"] = [S("13", 0.6), TOTAL]
    m["duration_s"] = TOTAL; m["timing_version"] = "A (director-approved 2026-11-22): measured dialogue, 35.0s"
    return m
