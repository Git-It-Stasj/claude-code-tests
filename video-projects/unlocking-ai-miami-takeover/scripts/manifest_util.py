"""Load an episode manifest and merge in its event pack (evergreen swap layer).

An episode manifest stays evergreen. Everything tied to one live event (end-card
event line, date, time, registration, promo, and Noelle's invite voiceover with
its captions) lives in events/<id>.json and is referenced by "event" in the
episode manifest. To re-run the video for a new event, write a new event pack
and point "event" at it. No re-animation is needed: the invite lines are
voiceover (Noelle's mouth isn't animated after the sunglasses shot).
"""
import json, os, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def speech_len(path, a=0.0, b=None):
    """Seconds of audio after trimming leading/trailing silence (within [a,b] if given)."""
    trim = f"atrim={a}:{b}," if b is not None else f"atrim={a},"
    with tempfile.NamedTemporaryFile(suffix=".wav") as t:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-af",
                        trim + "asetpts=PTS-STARTPTS,silenceremove=start_periods=1:start_threshold=-45dB,"
                        "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse", t.name], check=True)
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", t.name],
                             capture_output=True, text=True, check=True).stdout
        return float(out.strip() or 0)


def load(manifest_path, check=True):
    m = json.load(open(manifest_path))
    ev_path = m.get("event")
    if not ev_path:
        return m
    ev = json.load(open(os.path.join(ROOT, ev_path)))
    m["_event_id"] = ev["id"]

    # 1. End card: lines[0], [1] are evergreen; [2..5] come from the event
    ec = m["end_card"]
    e = ev["end_card"]
    # evergreen packs may omit event_line/date_line/time_line (empty string = line not drawn)
    ec["lines"] = ec["lines"][:2] + [e.get("event_line", ""), e.get("date_line", ""), e.get("time_line", ""), e.get("format_line", "LIVE")]
    ec["registration"] = e["registration"]
    if e.get("promo"):
        ec["promo"] = e["promo"]
    else:
        ec.pop("promo", None)

    # 2. Invite voiceover + captions, placed into the episode's fixed slots
    caps = {c["id"]: c for c in m["captions"]}
    problems = []
    for key, slot in m["event_slots"].items():
        vo = ev["invite_vo"][key]
        f = os.path.join(ROOT, vo["file"])
        segs = vo.get("segs")
        entry = {"file": vo["file"], "at": slot["at"], "trim_silence": segs is None}
        entry["segs"] = segs or [[0, 999]]
        m["audio_edit"][key] = entry
        caps[slot["caption"]]["text"] = vo.get("caption", vo["text"])
        if check:
            n = sum(speech_len(f, a, b) for a, b in segs) if segs else speech_len(f)
            if n > slot["max_s"] + 0.15:
                problems.append(f'{key} ("{vo["text"]}") is {n:.2f}s; the shot {slot["shot"]} slot allows {slot["max_s"]}s')
    if problems:
        raise SystemExit("EVENT VO TOO LONG. Shorten the line or speed it up, then re-generate it:\n  " + "\n  ".join(problems))
    return m
