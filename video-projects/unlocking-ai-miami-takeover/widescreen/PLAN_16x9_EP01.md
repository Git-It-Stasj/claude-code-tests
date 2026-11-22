# EP01 16:9 Production Plan (native re-shoot)

The audio is locked: VO, music, SFX and timings are identical to `EP01_rachel_9x16_v6`, and the event pack is shared. The source is grok_video_v15 at 720p and 4.5 credits/s, with the start image taken from `keyframes/user/16x9/`.

## Keyframe QA (received 15 images, all 1672×941, 16:9)

| Shot | Status | Note |
|---|---|---|
| S01 | OK | Title goes in the calm sky upper right |
| S02 | OK* | The steering wheel carries the real Ferrari horse badge (also in the vertical cut). Optional fix for a paid YouTube ad |
| S03→S04 | CONTINUITY | The car outside jumps position and size between the two frames. Fix: one continuous camera move (see below) |
| S05 | RISK | Noelle's face is about 11% of frame height, so lip sync could be soft. Mitigation: the prompt asks for a slow push-in; this shot is in the pilot |
| S06 | OK | Lip sync, large face |
| S07 | RISK | Lip sync. The owner's head is also in frame (back and profile), so face detection could pick the wrong face. This shot is in the pilot |
| S08 | OK | The RACHEL name tag is added in the edit |
| S09 | OK | Lip sync, large face |
| S10 | OK | VO only |
| S11 | FIX? | The car seen through the window is a different modern supercar, not the yellow Testarossa-style car |
| S12 | FIX? | The car seen through the door is a yellow sedan/taxi, not the hero car |
| S13 | **FIX** | The shirt reads "I ♥ AI I" (garbled), and she is large and in focus |
| S14A | OK | BBY TIGR is clean |
| S13C | OK* | The tiny plate is gibberish and the taillights are round. It shrinks as the car drives away; acceptable |

## Shot plan

| Slot | Shot | Gen | Motion prompt essentials | Lip sync |
|---|---|---|---|---|
| 0.0–2.2 | S01 | 3s | Car cruises toward camera along Ocean Drive, wheels splash, palms sway, slow tracking | – |
| 2.2–4.0 | S02 | 2s | POV, car rolls to a stop, hand on wheel, owner in the shop window rubs his head, phone ringing | – |
| 4.0–7.0 | **S03→S04 merged** | 5s flux_3_video, start=S03 end=S04, retimed to 3s | One continuous dolly-in: Noelle walks from the door toward the counter while the camera pushes in, and the parked car outside shifts by natural parallax | – |
| 7.0–10.1 | S05 | 4s | Slow push-in on Noelle, owner shoulder static, phone vibrates | L1 Noelle |
| 10.1–11.9 | S06 | 2s | Owner on the phone, papers shake, exasperated | L2 Owner |
| 11.9–14.9 | S07 | 4s | Noelle extends the phone toward the owner, he reaches for it | L3 Noelle |
| 14.9–17.6 | S08 | 3s | Phone waveform pulses, slight hand drift, background bokeh | – |
| 17.6–20.8 | S09 | 4s | Owner looks at the phone, amazed, gestures | L5 Owner |
| 20.8–22.3 | S10 | 2s | Noelle slowly lowers her sunglasses, eyes revealed, mouth closed smirk | – |
| 22.3–26.0 | S11 | 4s | She slides the black card across, he takes it, the gold key glints | – |
| 26.0–27.3 | S12 | 2s | Owner fist-pumps holding the card, Noelle exits through the door | – |
| 27.3–28.9 + 29.9–32.0 | S13 (+13B) | 6s | Rear view: she pushes off, walks to the driver door on the left, ducks fully below the roof (head never above it), door shuts, car pulls away straight into the distance | – |
| 28.9–29.9 | S14A | 2s | Taillights flare, car bounces once on its suspension, exhaust shimmer | – |
| 32.0–35.0 | S13C | 4s | Car keeps driving away along the bay until it is tail lights, camera static | – |

## End card (16:9 layout)
- **Top band** over the sky: "UNLOCKING AI CHALLENGE" on one line, with the event, date, time and LIVE on one line below it.
- **Bottom band:** the register pill, with the promo pill beside it.
- The plate (62–73% of frame height) stays clear. This works over S14A, S13 and S13C without image changes.

## Cost (estimates)
| Item | Credits |
|---|---|
| Grok 13 shots, 42s at 4.5/s | 189 |
| Flux merged 03→04, 5s at 720p | 30 |
| Lip sync, 4 shots (14s) | about 51 |
| Retake buffer | about 40 |
| **Total** | **about 310** (balance 458) |

The 1080p native option (grok at 8/s) would add about 147 credits. It isn't recommended; the plan is 720p upscaled to 1920×1080 in the edit.

## Pilot (step 1, about 75 credits)
1. Merge S03→S04 with flux (30). This tests the continuity fix and how well its style matches grok.
2. S05, 4s, plus lip sync (18 + about 15). This tests lip sync on a small face.
3. S07, 4s, plus lip sync (18 + about 15). This tests lip sync with two faces in frame.

S13 (the car entry, 27) waits until the fixed S13 keyframe arrives.
