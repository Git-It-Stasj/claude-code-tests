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
