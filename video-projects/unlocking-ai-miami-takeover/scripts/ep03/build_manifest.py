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
  dialogue="L1", approval="approved (director confirmed corrected signage revision, 2026-11-22)",
  extra={"flags": ["Source is a 660x1183 JPEG (soft when upscaled).", "Director confirmed S02 is the corrected signage revision."], "lipsync": True}),
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
  "Val shifts the armfuls of dresses on their hangers, struggling to keep hold, fabric swaying under its own weight, then looks up, surprised but still frazzled (no smile yet), and calls out. The customer at the right edge stays at the counter, turned toward Val. The white palm-print T-shirt stays on her shoulder and the purple phone stays in her pocket. Static camera.",
  ["neon sign", "mannequin", "chandelier", "phone in pocket"], "static", dialogue="L3",
  extra={"lipsync": True, "flags": ["Right-edge figure is a customer Val is helping before Noelle arrives (director). Keep full frame, no crop."]}),
 shot("06", [9.5, 11.5], "S06_user.png", "minimax_h3_max 768p start=end=keyframe", 5,
  "Friendly reunion: shared laugh (src 0-2.0s used)",
  "Noelle and Val laugh together warmly; Noelle gives Val a gentle side hug, Val keeps holding all the hangers. Small natural head and shoulder movement only, curls moving softly. Static camera.",
  ["neon sign", "chandelier", "dresses on hangers"], "static", dialogue="L4",
  extra={"lipsync": "test on Noelle only; fallback: line plays over the laugh, no sync", "notes": "Arm check passed at 4x: Noelle has one arm across Val's back and one hand at Val's waist."}),
 shot("08", [11.5, 15.5], "S08_user_instagram.png", "minimax_h3_max 768p start=end=keyframe (src 0-4.0s) + original screen re-composited", 5,
  "Noelle calls out the ghost-town Instagram; Val admits it; 'I know a guy'",
  "Noelle holds the phone steady toward camera and points at it, with a small playful head tilt and a knowing smirk while she talks. The phone does not move or rotate. Val's hair at the left edge sways slightly. Static camera.",
  ["phone size, position, angle and screen", "neon sign"], "static; last 0.35s free digital push-in toward the phone, matching S09's phone scale for the cut",
  dialogue=["L5", "L6", "L7"],
  extra={"screen": "The keyframe's own sparse-grid screen is masked and re-composited each frame so text can't warp.", "lipsync": "Noelle lines L5 and L7 only",
         "flags": ["Instagram-style profile shows '12 Posts' but only 3 tiles are filled. Harmless; leave it (no numbers are animated)."]}),
 shot("09", [15.5, 19.0], "S09_user_sonny_drafts.png", "minimax_h3_max 768p start=end=keyframe (src 0-3.5s) + post-built screen animation", 5,
  "Noelle shows Sonny at work on her phone: drafts appear and get queued for Val's review",
  "Noelle holds the phone up close to camera and points at the screen with her other hand, confident smirk, curls moving softly. The phone does not move or rotate. Val's shoulder and hair stay in the left foreground. Static camera.",
  ["phone size, position, angle and screen (screen animated in post)", "neon sign", "chandelier"], "static",
  dialogue=["L8"],
  extra={"cut_in": "Punch-in on a whoosh at 15.5: S08 ends on a digital push toward the phone, so the bigger S09 phone reads as Noelle thrusting it at Val, not as a jump cut between near-identical frames.",
         "screen": "post-built over the user's frame (scripts/ep03/sonny_ui_anim.py, Stage B): 15.5 Sonny header, waveform animating while L8 plays; banner '3 Posts Drafted for Your Approval' types in; Posts 1-3 pop in at 15.9/16.5/17.1 tagged 'Draft'; each 'Review' chip lights green with a tick 17.6/17.9/18.2; 'Queue to Instagram' and the Schedule tab pulse at 18.4 (highlighted, not pressed: Val still has to approve). All elements cut from this frame with feathered masks, so the layout is exactly the user's.",
         "notes": "Sonny's face on the app avatar is intentional (director): concealed in person, revealed only as his app profile. Keep as drawn."}),
 shot("10", [19.0, 21.6], "S10_user.png", "minimax_h3_max 768p start=end=keyframe", 5,
  "Val's amazed reaction (src 0-2.6s)",
  "Val's eyes widen and she gasps in delighted disbelief, hand at her mouth, then speaks excitedly, holding her clothes. Noelle beside her smiles calmly at her phone. Small natural movement only. Static camera.",
  ["phones", "clothes bundle", "neon sign", "Noelle's curls (compact)"], "static", dialogue="L9", extra={"lipsync": True}),
 shot("11G", [21.6, 22.8], "S11G_user_sunglasses.png", "grok_video_v15 720p start_image", 2,
  "Signature gesture: Noelle lowers her sunglasses ('Glad you asked.' VO)",
  "Noelle slowly slides her sunglasses a little further down her nose with her right hand, revealing her eyes, raising one eyebrow with a knowing smirk, lips closed. Curls move slightly. Static camera.",
  ["neon sign", "clothing rack", "doorway and parked car in background"], "static", dialogue="L6a",
  extra={"notes": "Director-supplied reference (image 2, 2026-11-22). Placed at the invitation reveal, the only sunglasses beat in the episode.",
         "flags": ["Car through the door reads as a modern yellow coupe; small, background. Acceptable."]}),
 shot("11", [22.8, 25.8], "S11_user.png", "grok_video_v15 720p start_image", 3,
  "Black-key invitation handoff; Val juggles clothes to take it",
  "Noelle holds out the black card with the gold key; Val, juggling her armful of clothes and hangers, fumbles slightly, then takes the card with one hand. Exactly one card, always held, never floating. Noelle's other hand stays in her pocket and her lips stay closed. Static camera.",
  ["neon sign", "chandelier", "gold key emblem on card"], "static", dialogue=["L6b"],
  extra={"notes": "Arm check passed at 4x: Noelle has one hand in her pocket and one holding the card; Val has one hand on the hangers and one on the card."}),
 shot("12", [25.8, 27.3], "S12_user.png", "grok_video_v15 720p start_image", 2,
  "Exit: Noelle walks out, Val stays inside with the card",
  "Noelle walks away from camera through the open glass doors toward the parked yellow coupe, steady stride, heels on the floor. Val in the left foreground holds the card and clothes, smiling after her. Static camera.",
  ["door frames", "neon sign", "parked car"], "static", dialogue=["L6b (tail)"],
  extra={"flags": ["The car through the door reads as a modern yellow coupe (round tail lamps), not exactly the 80s wedge. Background and small, so acceptable."]}),
 shot("12A", [27.3, 28.8], "S12A_user_rev03.png", "grok_video_v15 720p start_image", 2,
  "Noelle settles into the driver's seat (Rev03)",
  "Noelle lowers herself the last few inches into the driver's seat and pulls the door toward her with her right hand. The fixed yellow hardtop roof stays in place above her; the door panel stays rigid. Static camera.",
  ["door panel shape", "side strakes", "wheel", "boutique signage"], "static",
  approval="approved Rev03 (director confirmed hardtop, 2026-11-22)", extra={"qc_watch": "Roofline: check for any open-top read across sampled frames; regenerate only if the roof changes."}),
 shot("12B", [28.8, 31.3], "S12B_user.png", "minimax_h3_max 768p start=end=keyframe + post-built phone screen", 5,
  "Payoff: Sonny never stopped working, 3 drafts ready for Val's review",
  "Sonny's index finger taps the phone screen twice; his other hand holds the phone steady. His red trouser legs shift slightly. The phone does not move. " + SONNY + " Static camera.",
  ["phone position and size", "gear knob", "console", "dash badge"], "static",
  extra={"screen": "post: re-use the Sonny UI from PH, one tap highlights 'Review' on Post 2 in sync with the finger. No counts, follower or engagement numbers.",
         "flags": ["App avatar face is intentional (director).", "Prancing-horse dash badge is a real brand mark, as in Ep01/Ep02 user frames. Flagged; not altered."]}),
 shot("13", [31.3, 34.7], "S13_user.png", "grok_video_v15 720p start_image", 4,
  "Ferrari departs into the sunset; end card from 32.1s",
  "The yellow hardtop coupe accelerates gently away from camera down the boulevard toward the setting sun, wheels turning, tail lights glowing, reflections following on the wet road. Camera stays still. Single car only.",
  ["license plate 'BBY TIGR'", "roofline", "quad exhaust", "palms"], "static",
  extra={"notes": "Plate is already readable in frame 0, so no separate plate pull-back (12M) is needed. Plate legibility is QA'd frame-by-frame."}),
]

dialogue = [
 {"id": "L1", "speaker": "NOELLE", "text": "Hey, you coming in?", "shot": "02", "mode": "lipsync"},
 {"id": "L2", "speaker": "SONNY", "text": "Nah, I'm good here.", "shot": "03", "mode": "off-camera, no sync"},
 {"id": "L3", "speaker": "VAL", "text": "Noelle! Girl!", "shot": "05", "mode": "lipsync"},
 {"id": "L4", "speaker": "NOELLE", "text": "Val! What is going on here?", "shot": "06", "mode": "over laugh (sync test)"},
 {"id": "L5", "speaker": "NOELLE", "text": "Your Instagram's a ghost town!", "shot": "08", "mode": "lipsync"},
 {"id": "L6", "speaker": "VAL", "text": "I barely have time to post!", "shot": "08", "mode": "off-camera"},
 {"id": "L7", "speaker": "NOELLE", "text": "I know a guy.", "shot": "08", "mode": "lipsync"},
 {"id": "L8", "speaker": "SONNY", "text": "Three posts ready for your approval.", "shot": "09", "mode": "device audio (phone EQ)"},
 {"id": "L9", "speaker": "VAL", "text": "Wait! He did all that? How do I get this?", "shot": "10", "mode": "lipsync"},
 {"id": "L6a", "speaker": "NOELLE", "text": "(event slot)", "shot": "11G", "mode": "VO, lips closed"},
 {"id": "L6b", "speaker": "NOELLE", "text": "(event slot)", "shot": "11", "mode": "VO"},
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
 {"id": "c8", "text": "\"Three posts ready for your approval.\"", "t": [16.25, 18.95], "y": 1660},
 {"id": "c9", "text": "Wait! He did all that? How do I get this?", "t": [19.05, 21.55]},
 {"id": "c10", "text": "", "t": [21.7, 22.75]},
 {"id": "c11", "text": "", "t": [22.9, 25.9]},
]
sfx = [
 {"type": "native", "shot": "01", "at": 0.0, "dur": 2.0, "gain_db": -10, "_note": "engine settle/idle"},
 {"type": "engine_idle_bed", "at": 2.0, "dur": 3.5, "gain_db": -18, "_note": "muffled cabin idle under S02-S03"},
 {"type": "boutique_ambience", "at": 5.5, "dur": 21.0, "gain_db": -24},
 {"type": "door_chime", "at": 5.6},
 {"type": "fabric_rustle", "at": 7.1}, {"type": "fabric_rustle", "at": 8.6},
 {"type": "whoosh", "at": 15.4, "_note": "punch-in to S09"},
 {"type": "ping", "at": 15.9}, {"type": "ping", "at": 16.5}, {"type": "ping", "at": 17.1},
 {"type": "click", "at": 17.6}, {"type": "click", "at": 17.9}, {"type": "click", "at": 18.2}, {"type": "chime", "at": 18.4},
 {"type": "card_accent", "at": 23.3, "_note": "low shimmer + soft hit as the card changes hands"},
 {"type": "glint", "at": 21.9, "_note": "sunglasses"},
 {"type": "door_open", "at": 27.4}, {"type": "door_close", "at": 28.65},
 {"type": "click", "at": 29.7}, {"type": "click", "at": 30.3},
 {"type": "engine_rev_accel", "at": 31.2, "dur": 3.5, "gain_db": -6},
]
m = {
 "episode": 3, "title": "Sonny: The Invisible Business", "version": 1,
 "featured_ai_employee": {"name": "Sonny", "role": "AI Social Media Manager", "vendor": "Marblism",
   "claim_scope": "Drafts social posts for the owner to review and approve. Nothing is shown as published; no follower, engagement or sales numbers. Demo is a dramatization."},
 "business_problem": "Neglected Instagram, no time to post",
 "characters": ["NOELLE_01", "SHOP_OWNER_03 (Valentina 'Val' Cruz)", "SONNY (face concealed)"],
 "duration_s": 34.7,
 "deliverable_scope": "VERTICAL first (9:16 1080x1920). 16:9 needs native widescreen frames from the director; reframe plan in the production sheet.",
 "keyframe_source": "User-supplied images - DO NOT REGENERATE. " + KF + "/",
 "license_plate": "BBY TIGR visible in S13 frame 0.",
 "video_model": {"model": "grok_video_v15", "resolution": "720p", "cost_per_s": 4.5, "anchored": "minimax_h3_max 768p, 12.5 per 5s (verified 2026-11-22)"},
 "shots": shots, "dialogue": dialogue, "captions": captions,
 "overlays": [{"file": "title.png", "t": [0.3, 1.9]}, {"file": "sonny_lt.png", "t": [15.6, 18.9]}, {"file": "endcard.png", "t": [32.1, 34.7]}],
 "audio_edit": audio_edit, "sfx_cues": sfx,
 "end_card": {"lines": ["UNLOCKING AI CHALLENGE", "BUILD AN AI-AMPLIFIED BUSINESS"], "registration": "", "window": [32.1, 34.7]},
 "music_file": "audio/music/ep03_retro_action_35s.mp3",
 "episode_dir": "episodes/03-sonny-social-media",
 "lower_third": {"name": "SONNY", "role": "AI SOCIAL MEDIA MANAGER", "file": "sonny_lt.png"},
 "event": "events/evergreen-ep03.json",
 "event_slots": {"L6a": {"shot": "11G", "beat": "Noelle lowers her sunglasses", "at": 21.75, "max_s": 1.2, "caption": "c10", "guide": "2-3 words, no date"},
                 "L6b": {"shot": "11", "beat": "Noelle hands Val the black key card", "at": 22.9, "max_s": 3.0, "caption": "c11", "guide": "<=8 words"}},
 "voices": {"NOELLE": "Sloane b57b22a0-f287-405b-bc82-6f08f5e6bb1f (locked)", "VAL": "Ines 023ebf5e-1970-40d8-825c-a5ef6a1dd4ff (stab 0.4, sim 0.8) - director pick", "SONNY": "Caspian ef70cc83-3015-4bad-9359-0ea968c43ec0 (stab 0.6, sim 0.8) - director pick", "_jobs": "L1 39edc790, L2 4b796695, L3 5f7fcb1d, L4 f4b1b0c0, L5 d0610711, L6 65fc3665, L7 a28b779b, L8 0e40dfb5, L9 5f515d1c, L6a 32b6a94f"},
 "director_decisions_2026-11-22": ["S02 corrected signage approved", "S12A hardtop confirmed, keep", "Sonny's face on the app avatar is intentional", "Sunglasses frame supplied (S11G)", "S05 right-edge figure is a customer, keep", "Voice candidate plan approved", "No Sonny reference sheet: frames are the reference", "Budget approved (~250 credits)"],
 "open_items": ["Sonny UI: Queue/Schedule highlighted, not pressed (default unless director says otherwise)"],
 "approval_status": "Stage B authorized: voice candidates next",
 "retired_takes": [],
}
import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import retime_A; m = retime_A.apply(m)
json.dump(m, open(os.path.join(ROOT, "manifests/ep03-sonny-social-media.json"), "w"), indent=1)
print("shots", len(shots), "sum", round(sum(s["dur"] for s in shots), 2))
