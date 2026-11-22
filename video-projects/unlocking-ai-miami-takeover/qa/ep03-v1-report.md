# EP03 v1: QA report (Sonny, AI Social Media Manager)

File: `exports/vertical/EP03_sonny_9x16_v1.mp4`. **35.000s, 1080x1920, 24 fps, -16.6 LUFS, LRA 4.7, peak -1.2 dBFS.** Event pack: `evergreen-ep03`.
Voices: Noelle = Sloane, Val = **Ines**, Sonny = **Caspian** (director picks). Timing A (director-approved): measured dialogue, no voice speed-up.
Contact sheet: `qa/ep03/EP03_v1_contact.jpg`. Per-shot strips: `qa/ep03/`.

## Picture (every claim backed by sampled frames, see strips)
| Shot | Source | Verdict |
|---|---|---|
| 01 Arrival | grok 3s | PASS: one car, hardtop, sign stable, push-in |
| 02 Question | minimax anchored + sync_so | PASS picture; **lip sync partial** (see below) |
| 03 Sonny | minimax anchored (take 2) | PASS. Take 1 grok retired: camera pulled back and showed a blank face at 1.1s |
| 04 Enters | grok 2s | PASS |
| 05 Val chaos | grok 3s + sync_so | PASS; note: the customer gains a held pink shopping bag (~0.7s) |
| 06 Reunion | minimax anchored | PASS (no lip sync by design, both mid-laugh) |
| 08 Ghost town | minimax 6s + 2 sync_so windows + re-composited screen + push-in | PASS; splices at 2.46/4.25s invisible |
| 09 Sonny at work | minimax anchored + post UI (`screen_comp.py`) | PASS: banner wipe, posts pop as Draft, Review chips grey to green, waveform driven by L8, Queue/Schedule highlighted not pressed |
| 10 Reaction | minimax anchored + sync_so | PASS |
| 11G Sunglasses | grok 2s, src 0.75-1.95 | PASS: single lowering gesture, lips closed (VO) |
| 11 Key card | grok 3s | PASS: one card, Val fumbles then takes it |
| 12 Exit | grok 2s | PASS |
| 12A Into car | grok 2s | **DIRECTOR REVIEW**: motion fine; no roof visible above her once seated (inherited from Rev03 frame) |
| 12B Sonny still working | minimax anchored + tap glows | PASS: glows at measured fingertip contacts 0.62s/1.50s |
| 13 Drive-off | grok 4s + native engine | PASS: plate BBY TIGR legible (2x crops), end card 33.09-35.0 |

## Lip sync (sync_so, default detection, cut_off), measured mouth motion vs audio level
| Shot | Line | Verdict |
|---|---|---|
| S05 | Noelle! Girl! | PASS |
| S10 | Wait! He did all that? How do I get this? | PASS |
| S08a | Your Instagram's a ghost town! | PASS |
| S08b | I know a guy. | WEAK: grin held, slight lip motion |
| S02 | Hey, you coming in? | PARTIAL: 'Hey,' articulated, 'you coming in?' low motion. Re-run gave the same result |
Noelle's anchored grin resists re-shaping; Val's neutral/open mouths sync well.

## Audio
Dialogue placed by measured onset; every line ends inside its shot (asserted by `retime_A.py`), speech regions verified on the stem. Music: `ep03_retro_action_35s.mp3` (ElevenLabs Music, instrumental, 35s), ducked under dialogue. SFX: synthesized cues (ambience, rustle, pings, clicks, whoosh, glint, card accent, door open/close, cabin idle) + native engine on S01/S13. Sonny's L8 uses device EQ.

## Compliance
No Black Friday, dates, times or promo. No follower/engagement/sales numbers animated (static Instagram counts are the user's frame). Drafts shown as Draft/Review, nothing published. "Dramatization" note on the demo. No VIVA MODE text anywhere (all signage from the user's frames). Registration line = team-supplied link from the event pack. Synthetic voices are not presented as real recordings.

## Spend
| Item | Credits |
|---|---|
| Voices (6 candidates + 10 lines) | ~4.9 |
| Video: 15 clips + S03 retake | ~193.7 |
| Lip sync: 6 jobs (incl. S02 re-run) | ~48.7 |
| Music 35s | ~4.7 |
| **Episode total** | **~252** (balance 878.22 -> ~626) |

## Open for director
1. S02 / S08b Noelle lip sync is partial/weak. Options: accept (she's smirking, lines still read), or another approach (e.g. a sync on a different source window, est. 5-8 credits each).
2. S12A roofline.
3. S05 customer's shopping bag (keep or retake ~13.5).
4. S01 title card sits over the awning monogram for 1.4s (move lower if wanted, free).

---
# EP03 v2 (director notes 2026-11-22)
File: `exports/vertical/EP03_sonny_9x16_v2.mp4`. 35.000s, 1080x1920, -16.6 LUFS, peak -1.1 dBFS. Changed shots: `qa/ep03/EP03_v2_changed_shots.jpg`.

| Note | Fix | Verdict |
|---|---|---|
| S02 mouth doesn't move | Re-animated talking take + sync | PASS (motion follows audio) |
| S06 mouth doesn't move | Talking take + sync; auto-detect synced Val, retake with coordinates on Noelle | PARTIAL: Noelle articulates "Val!", grins through the rest |
| Val says "I barely have time to post" (new frame) | New shot 08V 14.10-16.20 | PASS |
| "I know a guy" re-animate | New shot 08B (talking take + sync, 3x v1 motion) + push-in | PASS |
| S09 finger goes into the phone | Fingertip kept above the post-built screen | PASS (free) |
| S10 Val must say both lines | Take 2 retired (roles swapped); take 3 Val drops hand and talks, Noelle still | PASS |
| S05 customer leaves | Customer takes bags and exits right; Val calls out | PASS |

New lesson: in two-person shots sync_so auto-detect can pick the wrong face; pass `active_speaker_detection` {frame_number, coordinates}.
Spend v2: ~146 credits (6 minimax 75, 1 grok 13.5, 7 sync ~57.5). Balance 479.61. Episode total ~399.

## v3 (final)
- S06 hug: minimax take 3 (Val silent) + sync_so on Noelle (coords 610,330). Mouth-band motion on Noelle tracks L4 (peaks 0.25–0.5s, 1.0–2.25s); Val's opening open grin (frames 0–17) held to her closed smile in post (feathered mouth patch from frame 18, phase-correlation aligned). Val mouth motion ≤1 after patch except head-move residue; strips at 4 fps across 9.3–11.8s confirm.
- S09 finger: unchanged per director (push-in + screen animation is enough).
- S10: L9 +0.08s, L9b +0.30s; cross-correlation lag ~0 on both parts.
- S12B: green tap glows removed; click SFX kept.
- Export EP03_sonny_9x16_v3.mp4: 35.000s, -16.7 LUFS, -1.1 dBTP.

## v4
- 08B → 09 jump: 08B push-in now phone-matched (last 0.6s, ×1.32, S08 phone centre (390,887) → S09 phone centre (421,972), keyframe px) and dissolves into S09 frame 0 over 5 frames; strips at 12 fps across 16.6–17.8s show one continuous move.
- S09 fingertip: pale nail tip was outside the skin mask and got covered by the screen layer; mask now adds bright low-saturation pixels hugging the finger, tighter edge. Crops at 0.4/0.5/0.6/0.8/1.4/2.2s match the raw clip's full nail.
- Export EP03_sonny_9x16_v4.mp4: 35.000s.
