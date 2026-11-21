# EP01 "The Phone Problem": Vertical v1 QA (2026-11-21)

**Output:** `exports/vertical/EP01_rachel_9x16_v1_TEMPVOICES.mp4` (1080×1920, 24 fps, 32.00s, H.264/AAC, −15.5 LUFS integrated)
**Stems:** `exports/vertical/stems_EP01_rachel_9x16_v1_TEMPVOICES/{dialogue,sfx,mix}.wav`, music in `audio/music/`
**Rebuild:** `python3 scripts/build_overlays.py manifests/ep01-rachel-receptionist.json episodes/01-rachel-receptionist/overlays && python3 scripts/assemble_vertical.py manifests/ep01-rachel-receptionist.json <out.mp4>`

## Shots: all 14 are animated from the user-supplied frames (no images regenerated)
| Shot | Result | Notes |
|---|---|---|
| 01 Driving | PASS | Car rigid, spray and parallax good, title stamp over the sky |
| 02 POV spots shop | PASS | The steering-wheel hub shows a real-brand badge (it's in the source frame) |
| 03 Owner overwhelmed | PASS | Noelle walks in naturally in the background |
| 04 Walks in | PASS | |
| 05 Identifies problem | PASS | Laptop numbers stay stable |
| 06 Owner responds (3:4) | PASS | Blurred fill |
| 07 Offers phone | PASS | Handoff and hands are correct |
| 08 Rachel answers | PASS | Waveform animates; "RACHEL / AI RECEPTIONIST" label plus a "Dramatization" note |
| 09 Amazed (3:4) | PASS | Model added a comic burst, which stays on-style |
| 10 Lowers glasses (3:4) | SOFT | The glasses barely move; this reads as a smirk and push-in. One regeneration at 2s costs about 9 credits |
| 11 Invite card (3:4) | PASS | Clean card handoff, a single card |
| 12 Walks out (3:4) | PASS | |
| 13 Poses by car | FIXED (v2) | Take 2 (13.5 credits): she smiles, opens the door, gets in and the car pulls away. Take 1 is kept as `S13_take1_walks_away.mp4` |
| 14 Drives off | FIXED (v2) | The source clip has a duplicate car entering at 0.25–1.1s, so the edit uses 1.17s onward, slowed 15%. The plate isn't legible at this size |

## Identity and continuity
Noelle's curls, sunglasses, purple suit and I♥AI shirt hold in every shot. The owner's glasses, beard, hair, shirt and apron hold in every shot.
Known source-frame drift: the car seen through the shop windows in S03, S04, S05 and S10 reads as a generic yellow sedan.

## Audio
- **Dialogue:** the voices are **TEMP** (Sloane, Marcus, Emily) until you pick. L3 and L6 had their pauses tightened. L6 is split across S10–S12. Rachel's line has a phone EQ.
- **Music:** ElevenLabs Music v2.5 original, 32s, ducked under dialogue.
- **SFX:** ring, chime, click and whoosh are synthesized. The engine sound comes from the model's native audio on S01 and S14.
- **Lip sync:** the mouths are model-animated and not synced to the TTS. This is acceptable for the 2.5D style; a lipsync pass is optional.

## Marketing
- **End card:** UNLOCKING AI CHALLENGE / BUILD AN AI-AMPLIFIED BUSINESS / BLACK FRIDAY / FRIDAY, NOVEMBER 27, 2026 / 3:00–5:00 PM ET • LIVE. All were checked against the brief.
- **Registration:** stan.store/noelleai/unlockingai
- **Claims:** Rachel is shown only answering a call. There are no revenue or ranking promises, and the demo is labelled "Dramatization".

## Cost
| Item | Credits |
|---|---|
| PoC (earlier) | 17.11 |
| 14 clips, 36s at 4.5/s | 162.00 |
| Music | 4.66 |
| **Total Ep01 to date** | **183.77** |

Remaining balance is 247.18. Re-voicing after you pick voices costs about 2 credits.

## v2 (after review)
`exports/vertical/EP01_rachel_9x16_v2_TEMPVOICES.mp4`. Shot 13 was re-animated so Noelle gets into the car; shot 14 was trimmed to remove a duplicate car; the end card now holds solid to the last frame. Ep01 total spend is **197.27 credits**.

## v3 (lip sync, new ending, plate cutaway)
`exports/vertical/EP01_rachel_9x16_v3.mp4`: 32.00s, −15.6 LUFS.

- **Lip sync (Sync Lipsync 3):** S05 Noelle, S06 owner, S07 Noelle and S09 owner all PASS. Mouth shapes track the dialogue and the cel-shading holds without smearing.
  - The first S05 attempt failed when manual `active_speaker_detection` coordinates were set. It was not charged, and default detection works.
- **Noelle as voiceover after S10:** S10–S12 are not synced, as directed, and her mouth is closed in S10.
- **New ending** from `S13B_user_rear_plate.png`, one 6s clip:
  - She walks to the driver's door and ducks in fully below the roof (PASS).
  - The 14A BBY TIGR plate cutaway is a free crop of the same image animated with a suspension dip and rebound (PASS).
  - Then back to the door shutting and the car driving into the distance.
- **Edit changes:**
  - The end card now starts at the plate cutaway (28.9s), so it no longer covers Noelle walking to the car.
  - The register link sits below the car.
  - The opening was trimmed by 1.0s in total.
- **Retired takes:** `S13_take1_walks_away.mp4`, `S13_take2_head_through_roof.mp4` and `S14.mp4` (duplicate car).

### v3 spend
| Item | Credits |
|---|---|
| New ending clip (6s) | 27.0 |
| 14A plate clip (2s) | 9.0 |
| Lip sync, 4 shots | 43.8 |
| **v3 total** | **79.8** |
| **Ep01 total to date** | **277.07** |

Remaining balance is 153.88.

## v4 (extended drive-off)
`exports/vertical/EP01_rachel_9x16_v4.mp4` runs **35.0s** (was 32.0s).

- **New shot 13C (32.0–35.0):** a 4s grok clip that starts on the exact last frame of `S13_v3_rear.mp4`.
  - The camera holds still while the car keeps driving down the neon waterfront road until only its tail lights show in the distance.
  - The cut from 13B is seamless because both clips share the same frame.
  - The edit plays the clip at 1.18× so the car gets further away within 3s.
  - QA: one car, the shape holds, nothing new appears (PASS).
- **End card** now holds from 28.9s to 35.0s.
- **Engine audio:** the clip's own engine sound is mixed in at −9 dB.
- **Music (revised after review):** the original 32s track is back, fading out at 31.6–32.0s. The last 3s carry only the car sound (13C engine and tires at −6 dB), as the director requested. The `music_fade_out` setting is in the manifest.
- **Previous version:** the v3 manifest is kept as `manifests/ep01-rachel-receptionist.v3.json`.

| Item | Credits |
|---|---|
| 13C extension (4s) | 18.0 |
| **Ep01 total to date** | **295.07** |

## v5 (promo code)
`exports/vertical/EP01_rachel_9x16_v5.mp4` runs 35.0s, at 0 credits.

- Added a yellow promo pill under the register link: **USE CODE GTA6LI  •  $27 → $1**. The code and price came from the director.
- The register pill moved up from y 1650 to y 1600 to make room. The promo pill ends around y 1720 and stays clear of the car and the bottom UI zone.
- The →, $ and digits all render in Anton. No other changes.
