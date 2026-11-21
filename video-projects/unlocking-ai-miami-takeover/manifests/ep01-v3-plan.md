# EP01 v3 Plan: lip sync, new ending, plate cutaway

Balance before v3: **~233.7 credits**. Voices are approved as is (Sloane / Marcus / Emily).

## 1. Lip sync (Sync Lipsync 3, ~3.6 credits/sec)
| Shot | Speaker | Line | Clip | Est. |
|---|---|---|---|---|
| 05 | Noelle | "Phones ringing? That's money walking out." | 3s | 10.8 |
| 06 | Owner | "I can't keep up!" | 2s | 7.2 |
| 07 | Noelle | "Relax. I made you something. Dial this." | 3s | 10.8 |
| 09 | Owner | "Wait… that's AI? How do I get it?" | 4s | 14.4 |
| | | | **Subtotal** | **43.2** |

- **Not synced:** S08 is Rachel on the phone, so no face. S10–S12 are Noelle voiceover per the director's note. Her mouth is already closed in S10, and S11 has only one slight lip part.
- **Method:** each raw clip gets an audio file trimmed to that clip with the line at its exact on-screen offset. Lip sync runs on the raw clip before overlays, then the episode re-assembles.
- **Risk:** sync models are tuned on real faces, so cel-shaded mouths may soften. To control it, run **S05 first** (10.8 credits) and review before the other three.

## 2. New ending from the new reference image (`S13B_user_rear_plate.png`)
One continuous grok clip, **6s** (27.0 credits). Noelle pushes off the car, walks to the driver's door, ducks low and sits, the door shuts, and the car pulls away into the distance.
- The prompt locks the roofline: she ducks fully below the roof and her head is never above it. The plate cutaway hides the moment she settles into the seat, which is where take 2 failed.
- This replaces S13 (take 2, head through roof) **and** S14 (the old drive-off with the duplicate car).

## 3. Shot 14A: plate cutaway
Free 9:16 crop of the new image centered on **BBY TIGR**, with Noelle outside the crop. A **2s** grok clip (9.0 credits): the car dips and rebounds on its suspension as her weight settles in, the exhaust idles, and the tail lights glow.

## 4. New timeline for the last 5 seconds (total stays 32.0s)
To free a second, S01 is trimmed 2.6→2.2s and S03/S04 1.8→1.5s each. Dialogue and captions after S04 shift 1.0s earlier.

| Time | Shot | End card |
|---|---|---|
| 26.0–27.3 | S12 walks out, owner with card | — |
| 27.3–28.9 | S13 (new) walks to the door, ducks in | off, so she stays visible |
| 28.9–29.9 | **14A plate bounce** | **ON** |
| 29.9–32.0 | S13 continues: door shuts, drives into the distance | ON, link under the car |

The register link has moved to the bottom, below the car (y≈1650). This is already rendered and free.

## Budget
| Item | Credits |
|---|---|
| Lip sync, 4 shots | 43.2 |
| New S13 ending (6s) | 27.0 |
| 14A plate bounce (2s) | 9.0 |
| **Planned** | **79.2** |
| Buffer: 1 ending retake + 1 lip-sync redo | ~38 |
| **Worst case** | **~117** (leaves ~116) |
