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
