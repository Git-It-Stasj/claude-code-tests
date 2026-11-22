# EP02 v2: QA report (director tweaks + lip sync)

File: `exports/vertical/EP02_eva_9x16_v2.mp4`. 32.000s, 1080x1920, 24 fps, -16.1 LUFS, peak -1.1 dBFS. Event pack: `evergreen`.
Voices: Noelle = Sloane, Exec = **Gia**, Eva = **Imogen** (director picks, registered in reference-assets.json).

## Director tweaks
| Note | Fix | Verdict |
|---|---|---|
| S03A→S03B jump; cards should pop one at a time | One shot: grok base from image 3 (static camera) + 4 cards cut from image 4, popping in at 0.30/0.72/1.12/1.50s with bounce and ping SFX (`scripts/ep02/notif_pop.py`) | PASS |
| S04 exec should stay stressed, not turn away or smile | grok retake with explicit gaze/expression lock | PASS: frowning, faces Noelle throughout |
| S07 show Eva working (red → green) | Post-built UI animation (`scripts/ep02/eva_ui_anim.py`): scan with ticks down the 4 task cards, draft reply types out, meetings all red → green one by one, "Conflict" → "Resolved", click/chime SFX | PASS |
| Remove plate close-up cutaway | Opens square-on to BBY TIGR, pulls back to the exact first frame of the drive-off clip (`scripts/ep02/plate_pullback.py`), then the car drives into the distance under the end card | PASS: no visible cut at 27.7s |

## Lip sync (sync_so, default detection, cut_off)
| Shot | Line | Verdict |
|---|---|---|
| S06 (test first) | Better. Meet Eva. | PASS: closed before, opens on each word, closed at pause |
| S04 | Whoa. You running a business... or an inbox? | PASS |
| S05 | I need another me! | PASS |
| S08 | She handles all that? Where do I sign up? | PASS. Minimax start=end keyframe, 0–2.62s retimed x1.15 before sync |

## Spend
| Round | Credits |
|---|---|
| v1 rough cut | 161.1 |
| v2: S03 base 3s, S04 retake 4s, S08 Minimax 5s, lip sync ~11s | 84.1 |
| **Episode total** | **245.2** (balance 1135.88 → 890.72) |

## v3: animated plate pull-back (director request)
- `S12M_pullback.mp4`: minimax_h3_max, start = plate close-up crop, end = S12 keyframe (= drive-off frame 0), 5.18s played at 2x (26.4–28.99s).
- QA, 10 frames: plate stays "BBY TIGR", roof, louvers and quad exhausts stable, single car, road moving throughout. PASS.
- Seam into S12 at 28.99s checked frame-by-frame: no visible jump. Engine audio runs continuously from 26.4s. End card from 27.9s, once the full car is revealed.
- `exports/vertical/EP02_eva_9x16_v3.mp4`: 32.000s, 1080x1920, -15.9 LUFS. Cost ~15 credits (episode total ~260).
