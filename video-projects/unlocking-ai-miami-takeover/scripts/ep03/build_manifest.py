"""One-off generator for manifests/ep03-sonny-social-media.json (Stage A). Re-running overwrites the manifest."""
import json, hashlib, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KF = "episodes/03-sonny-social-media/keyframes/user"
LOCK = ("Keep identity, wardrobe, car geometry (fixed hardtop roof) and cel-shaded graphic-novel style exactly as the "
        "start frame. Exactly two arms and two hands per person. No other cars, no new people, no duplicated props, no new text.")
SONNY = "Sonny's face stays hidden (cropped by frame and covered by his long black hair); he never turns toward camera."

def kf(name):
    p = os.path.join(ROOT, KF, name)
    im = Image.open(p)
    return {"keyframe": name, "src_dims": list(im.size), "sha256_12": hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]}

def shot(id, t, src, gen, gen_s, desc, prompt=None, stay=None, cam=None, dialogue=None, approval="approved (user-supplied storyboard frame)", gate=None, extra=None):
    s = {"id": id, "t": t, "dur": round(t[1]-t[0], 2), "ratio": "9:16"}
    if src: s.update(kf(src))
    s.update({"approval": approval, "gen": gen, "gen_s": gen_s, "desc": desc})
    if prompt: s["prompt"] = prompt + " " + LOCK
    if stay: s["must_stay_still"] = stay
    if cam: s["camera"] = cam
    if dialogue: s["dialogue"] = dialogue
    s.update({"file": f"S{id}.mp4", "qc": "not started", "revisions": []})
    if gate: s["gate"] = gate
    if extra: s.update(extra)
    return s

shots = [
 shot("01", [0.0, 2.0], "S01_user.jpg", "grok_video_v15 720p start_image", 3,
  "Arrival: Ferrari settles at the curb outside Val Cruz BOUTIQUE",
  "Low-angle shot. The yellow hardtop coupe rolls the last few inches to a stop at the curb and settles on its suspension. Palm fronds sway gently, neon reflections shimmer on the wet pavement, people stroll in the far background. Slow push-in toward the car.",
  ["boutique awning text 'Val Cruz BOUTIQUE'", "mannequins", "roof and body geometry"], "slow push-in",
  extra={"flags": ["Source is a 662x1182 JPEG: upscales soft to 1080x1920. Ask for the full-res original."]}),
 shot("02", [2.0, 4.0], "S02_user.jpg", "minimax_h3_max 768p start=end=keyframe", 5,
  "Noelle asks Sonny if he's coming in (src 0-2.0s used)",
  "Noelle turns her head slightly toward the passenger and smiles, speaking a short line, curls moving softly. Her hands stay on the wheel and gear knob. The passenger's hand and phone stay still at the left edge. Static camera.",
  ["gear shifter", "console", "storefront sign in window", "Sonny's sleeve and phone"], "static",
  dialogue="L1", approval="PENDING: storefront-signage correction (see gate)",
  gate="SIGNAGE: this upload already reads 'Val Cruz BOUTIQUE' with the VC monogram (checked at 4x crop), so it looks like the corrected revision. No approval record exists; needs an explicit yes from the director before animation.",
  extra={"flags": ["Source is a 660x1183 JPEG (soft when upscaled).", "S01 and S02 were uploaded with the same original filename DD9142E8...; confirm S02 is the corrected revision, not an older take."], "lipsync": True}),
 shot("03", [4.0, 5.5], "S03_user.png", "grok_video_v15 720p start_image", 2,
  "Mystery passenger: Sonny answers off-camera, thumb moving on phone",
  "Sonny, seen from the neck down in his red suit, scrolls his glowing phone with a small thumb movement and settles back in the seat. Neon light flickers across the cabin from the boulevard outside. " + SONNY + " Static camera.",
  ["gear shifter", "console knobs", "Noelle's curls in the right foreground"], "static", dialogue="L2"),
 shot("04", [5.5, 7.0], "S04_user.png", "grok_video_v15 720p start_image", 2,
  "Noelle walks into the boutique alone, Ferrari parked outside",
  "Noelle walks forward into the boutique toward camera with a confident stride, smiling, curls bouncing slightly. The yellow coupe stays parked outside the doorway; nobody follows her. Static camera.",
  ["parked Ferrari", "door frames", "mannequin on the right"], "static"),
 shot("05", [7.0, 9.5], "S05_user.png", "grok_video_v15 720p start_image", 3,
  "Val overwhelmed, juggling dresses; looks up and greets Noelle",
  "Val shifts the armfuls of dresses on their hangers, struggling to keep hold, fabric swaying under its own weight, then looks up, surprised but still frazzled (no smile yet), and calls out. The white palm-print T-shirt stays on her shoulder and the purple phone stays in her pocket. Static camera.",
  ["neon sign", "mannequin", "chandelier", "phone in pocket"], "static", dialogue="L3",
  extra={"lipsync": True, "flags": ["Right edge shows part of a third person (sleek dark hair, white top, gold bangles) who is not Noelle. Plan: 1.12x centered-left post crop to drop the right ~12%. Director to confirm."]}),
 shot("06", [9.5, 11.5], "S06_user.png", "minimax_h3_max 768p start=end=keyframe", 5,
  "Friendly reunion: shared laugh (src 0-2.0s used)",
  "Noelle and Val laugh together warmly; Noelle gives Val a gentle side hug, Val keeps holding all the hangers. Small natural head and shoulder movement only, curls moving softly. Static camera.",
  ["neon sign", "chandelier", "dresses on hangers"], "static", dialogue="L4",
  extra={"lipsync": "test on Noelle only; fallback: line plays over the laugh, no sync", "notes": "Arm check passed at 4x: Noelle has one arm across Val's back and one hand at Val's waist."}),
 shot("PH", [11.5, 19.0], "S08_user_instagram.png", "minimax_h3_max 768p start=end=keyframe + post-built phone screen", 8,
  "Merged S07+S08+S09: Noelle calls out the ghost-town Instagram, Val admits it, 'I know a guy', screen transforms into Sonny's drafts",
  "Noelle holds the phone steady toward camera and points at it, with a small playful head tilt and a knowing smirk while she talks. The phone does not move or rotate. Val's hair at the left edge sways slightly. Static camera.",
  ["phone size, position, angle and screen (screen is replaced in post)", "neon sign"], "static",
  dialogue=["L5", "L6", "L7", "L8"],
  extra={"screen": "post-built (scripts/ep03/sonny_ui_anim.py, Stage B): 11.5-15.8 sparse grid from S08 frame; 15.8 wipe to Sonny UI; drafts 1-3 pop at 16.0/16.6/17.2 marked 'Draft'; Review chips turn green 17.8-18.4; 'Queue to Instagram' stays unpressed. Thumbnails and layout cut from S09_user_sonny_drafts.png with a feathered mask and fitted to the S08 phone with a perspective warp.",
          "why_merged": "Only one keyframe exists for S07/S08, and S08/S09 are near-identical compositions. Project rule: never jump-cut near-identical keyframes; merge and build the change in post.",
          "lipsync": "Noelle lines L5 and L7 only", "secondary_keyframe": kf("S09_user_sonny_drafts.png"),
          "flags": ["S09 app header shows Sonny's full face as the avatar, which breaks the 'face concealed' rule. Plan: replace it in post with a hair-silhouette and waveform badge.",
                    "Instagram-style profile shows '12 Posts' but only 3 tiles are filled. Harmless, and leave it (no numbers are animated)."]}),
 shot("10", [19.0, 21.6], "S10_user.png", "minimax_h3_max 768p start=end=keyframe", 5,
  "Val's amazed reaction (src 0-2.6s)",
  "Val's eyes widen and she gasps in delighted disbelief, hand at her mouth, then speaks excitedly, holding her clothes. Noelle beside her smiles calmly at her phone. Small natural movement only. Static camera.",
  ["phones", "clothes bundle", "neon sign", "Noelle's curls (compact)"], "static", dialogue="L9", extra={"lipsync": True}),
 shot("11", [21.6, 25.1], "S11_user.png", "grok_video_v15 720p start_image", 4,
  "Black-key invitation handoff; Val juggles clothes to take it",
  "Noelle holds out the black card with the gold key; Val, juggling her armful of clothes and hangers, fumbles slightly, then takes the card with one hand. Exactly one card, always held, never floating. Noelle's other hand stays in her pocket and her lips stay closed. Static camera.",
  ["neon sign", "chandelier", "gold key emblem on card"], "static", dialogue=["L6a", "L6b"],
  extra={"notes": "Arm check passed at 4x: Noelle has one hand in her pocket and one holding the card; Val has one hand on the hangers and one on the card.",
         "sunglasses_gate": "No Ep03 frame shows Noelle lowering her sunglasses. Per the brief it is NOT invented here. Options: (a) director supplies a frame and it is inserted before S11 (+1.2s), (b) skip the gesture this episode."}),
 shot("12", [25.1, 26.6], "S12_user.png", "grok_video_v15 720p start_image", 2,
  "Exit: Noelle walks out, Val stays inside with the card",
  "Noelle walks away from camera through the open glass doors toward the parked yellow coupe, steady stride, heels on the floor. Val in the left foreground holds the card and clothes, smiling after her. Static camera.",
  ["door frames", "neon sign", "parked car"], "static", dialogue=["L6b (tail)"],
  extra={"flags": ["The car through the door reads as a modern yellow coupe (round tail lamps), not exactly the 80s wedge. Background and small, so acceptable."]}),
 shot("12A", [26.6, 28.1], "S12A_user_rev03.png", "grok_video_v15 720p start_image", 2,
  "Noelle settles into the driver's seat (Rev03)",
  "Noelle lowers herself the last few inches into the driver's seat and pulls the door toward her with her right hand. The door panel stays rigid. Static camera.",
  ["door panel shape", "side strakes", "wheel", "boutique signage"], "static",
  approval="approved Rev03 per brief, but see gate",
  gate="ROOF: at 4x no roof is visible above Noelle. Her head and torso sit above the door-glass line and the car reads as open-top or targa, which conflicts with 'never a convertible'. Project history: Ep01 lost two takes on this exact problem. Options: (a) director confirms Rev03 anyway, (b) supply a rear-quarter 12A where the roof hides her, (c) drop 12A and cut S12 to S12B with door-open/close SFX bridging (runtime 32.5s). Recommend (c) until a fix arrives."),
 shot("12B", [28.1, 30.6], "S12B_user.png", "minimax_h3_max 768p start=end=keyframe + post-built phone screen", 5,
  "Payoff: Sonny never stopped working, 3 drafts ready for Val's review",
  "Sonny's index finger taps the phone screen twice; his other hand holds the phone steady. His red trouser legs shift slightly. The phone does not move. " + SONNY + " Static camera.",
  ["phone position and size", "gear knob", "console", "dash badge"], "static",
  extra={"screen": "post: re-use the Sonny UI from PH, one tap highlights 'Review' on Post 2 in sync with the finger. No counts, follower or engagement numbers.",
         "flags": ["The app avatar shows a small male face. Plan: replace it with the same silhouette badge as PH.", "Prancing-horse dash badge is a real brand mark, as in Ep01/Ep02 user frames. Flagged; not altered."]}),
 shot("13", [30.6, 34.0], "S13_user.png", "grok_video_v15 720p start_image", 4,
  "Ferrari departs into the sunset; end card from 31.4s",
  "The yellow hardtop coupe accelerates gently away from camera down the boulevard toward the setting sun, wheels turning, tail lights glowing, reflections following on the wet road. Camera stays still. Single car only.",
  ["license plate 'BBY TIGR'", "roofline", "quad exhaust", "palms"], "static",
  extra={"notes": "Plate is already readable in frame 0, so no separate plate pull-back (12M) is needed. Plate legibility is QA'd frame-by-frame."}),
]

dialogue = [
 {"id": "L1", "speaker": "NOELLE", "text": "Hey, you coming in?", "shot": "02", "mode": "lipsync"},
 {"id": "L2", "speaker": "SONNY", "text": "Nah, I'm good here.", "shot": "03", "mode": "off-camera, no sync"},
 {"id": "L3", "speaker": "VAL", "text": "Noelle! Girl!", "shot": "05", "mode": "lipsync"},
 {"id": "L4", "speaker": "NOELLE", "text": "Val! What is going on here?", "shot": "06", "mode": "over laugh (sync test)"},
 {"id": "L5", "speaker": "NOELLE", "text": "Your Instagram's a ghost town!", "shot": "PH", "mode": "lipsync"},
 {"id": "L6", "speaker": "VAL", "text": "I barely have time to post!", "shot": "PH", "mode": "off-camera"},
 {"id": "L7", "speaker": "NOELLE", "text": "I know a guy.", "shot": "PH", "mode": "lipsync"},
 {"id": "L8", "speaker": "SONNY", "text": "Three posts ready for your approval.", "shot": "PH", "mode": "device audio (phone EQ)"},
 {"id": "L9", "speaker": "VAL", "text": "Wait! He did all that? How do I get this?", "shot": "10", "mode": "lipsync"},
 {"id": "L6a", "speaker": "NOELLE", "text": "(event slot)", "shot": "11", "mode": "VO, lips closed"},
 {"id": "L6b", "speaker": "NOELLE", "text": "(event slot)", "shot": "11-12", "mode": "VO"},
]
audio_edit = {
 "L1": {"file": "audio/voices/ep03/L1_noelle.mp3", "at": 2.4},
 "L2": {"file": "audio/voices/ep03/L2_sonny.mp3", "at": 4.15},
 "L3": {"file": "audio/voices/ep03/L3_val.mp3", "at": 8.1},
 "L4": {"file": "audio/voices/ep03/L4_noelle.mp3", "at": 9.75},
 "L5": {"file": "audio/voices/ep03/L5_noelle.mp3", "at": 11.7},
 "L6": {"file": "audio/voices/ep03/L6_val.mp3", "at": 13.6},
 "L7": {"file": "audio/voices/ep03/L7_noelle.mp3", "at": 15.2},
 "L8": {"file": "audio/voices/ep03/L8_sonny.mp3", "at": 16.3, "device_eq": True},
 "L9": {"file": "audio/voices/ep03/L9_val.mp3", "at": 19.1},
}
captions = [
 {"id": "c1", "text": "Hey, you coming in?", "t": [2.35, 3.95]},
 {"id": "c2", "text": "Nah, I'm good here.", "t": [4.1, 5.45]},
 {"id": "c3", "text": "Noelle! Girl!", "t": [8.05, 9.45]},
 {"id": "c4", "text": "Val! What is going on here?", "t": [9.7, 11.45]},
 {"id": "c5", "text": "Your Instagram's a ghost town!", "t": [11.65, 13.5], "y": 1600},
 {"id": "c6", "text": "I barely have time to post!", "t": [13.55, 15.1], "y": 1600},
 {"id": "c7", "text": "I know a guy.", "t": [15.15, 16.2], "y": 1600},
 {"id": "c8", "text": "\"Three posts ready for your approval.\"", "t": [16.25, 18.95], "y": 1600},
 {"id": "c9", "text": "Wait! He did all that? How do I get this?", "t": [19.05, 21.55]},
 {"id": "c10", "text": "", "t": [21.7, 22.9]},
 {"id": "c11", "text": "", "t": [23.0, 26.0]},
]
sfx = [
 {"type": "native", "shot": "01", "at": 0.0, "dur": 2.0, "gain_db": -10, "_note": "engine settle/idle"},
 {"type": "engine_idle_bed", "at": 2.0, "dur": 3.5, "gain_db": -18, "_note": "muffled cabin idle under S02-S03"},
 {"type": "boutique_ambience", "at": 5.5, "dur": 19.6, "gain_db": -24},
 {"type": "door_chime", "at": 5.6},
 {"type": "fabric_rustle", "at": 7.1}, {"type": "fabric_rustle", "at": 8.6},
 {"type": "whoosh", "at": 15.75, "_note": "screen wipe to Sonny UI"},
 {"type": "ping", "at": 16.0}, {"type": "ping", "at": 16.6}, {"type": "ping", "at": 17.2},
 {"type": "click", "at": 17.8}, {"type": "click", "at": 18.1}, {"type": "click", "at": 18.4},
 {"type": "card_accent", "at": 22.1, "_note": "low shimmer + soft hit as the card changes hands"},
 {"type": "door_open", "at": 26.7}, {"type": "door_close", "at": 27.95},
 {"type": "click", "at": 29.0}, {"type": "click", "at": 29.6},
 {"type": "engine_rev_accel", "at": 30.5, "dur": 3.5, "gain_db": -6},
]
m = {
 "episode": 3, "title": "Sonny: The Invisible Business", "version": 1,
 "featured_ai_employee": {"name": "Sonny", "role": "AI Social Media Manager", "vendor": "Marblism",
   "claim_scope": "Drafts social posts for the owner to review and approve. Nothing is shown as published; no follower, engagement or sales numbers. Demo is a dramatization."},
 "business_problem": "Neglected Instagram, no time to post",
 "characters": ["NOELLE_01", "SHOP_OWNER_03 (Valentina 'Val' Cruz)", "SONNY (face concealed)"],
 "duration_s": 34.0, "duration_alt_s": {"without_12A": 32.5, "with_sunglasses_insert": 35.2},
 "deliverable_scope": "VERTICAL first (9:16 1080x1920). 16:9 needs native widescreen frames from the director; reframe plan in the production sheet.",
 "keyframe_source": "User-supplied images - DO NOT REGENERATE. " + KF + "/",
 "license_plate": "BBY TIGR visible in S13 frame 0.",
 "video_model": {"model": "grok_video_v15", "resolution": "720p", "cost_per_s": 4.5, "anchored": "minimax_h3_max 768p, 12.5 per 5s (verified 2026-11-22)"},
 "shots": shots, "dialogue": dialogue, "captions": captions,
 "overlays": [{"file": "title.png", "t": [0.3, 1.9]}, {"file": "sonny_lt.png", "t": [15.8, 18.9]}, {"file": "endcard.png", "t": [31.4, 34.0]}],
 "audio_edit": audio_edit, "sfx_cues": sfx,
 "end_card": {"lines": ["UNLOCKING AI CHALLENGE", "BUILD AN AI-AMPLIFIED BUSINESS"], "registration": "", "window": [31.4, 34.0]},
 "music_file": "audio/music/ep03_retro_action_34s.mp3",
 "episode_dir": "episodes/03-sonny-social-media",
 "lower_third": {"name": "SONNY", "role": "AI SOCIAL MEDIA MANAGER", "file": "sonny_lt.png"},
 "event": "events/evergreen-ep03.json",
 "event_slots": {"L6a": {"shot": "11", "beat": "Noelle offers the black key card", "at": 21.75, "max_s": 1.2, "caption": "c10", "guide": "2-3 words, no date"},
                 "L6b": {"shot": "11-12", "beat": "Val takes the card / Noelle exits", "at": 23.0, "max_s": 3.0, "caption": "c11", "guide": "<=8 words"}},
 "voices": {"NOELLE": "Sloane b57b22a0-f287-405b-bc82-6f08f5e6bb1f (locked)", "VAL": "TBD: 3 candidates (production sheet)", "SONNY": "TBD: 3 candidates (production sheet)"},
 "gates_open": ["G1 S02 signage approval", "G2 S12A roof", "G3 sunglasses frame (supply or skip)", "G4 avatar face replacement in post (S09/S12B)", "G5 S05 right-edge crop", "G6 Val + Sonny voice picks", "G7 Sonny canonical reference sheet not in repo", "G8 spend authorization"],
 "approval_status": "Stage A pre-production: nothing paid has run",
 "retired_takes": [],
}
json.dump(m, open(os.path.join(ROOT, "manifests/ep03-sonny-social-media.json"), "w"), indent=1)
print("shots", len(shots), "sum", round(sum(s["dur"] for s in shots), 2))
