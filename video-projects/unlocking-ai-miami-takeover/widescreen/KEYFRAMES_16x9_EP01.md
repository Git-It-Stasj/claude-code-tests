# EP01 16:9 Keyframe Brief: what to make, one image per shot

The 16:9 cut is a **native re-shoot**: new landscape keyframes are re-animated. The **audio is locked.** Voices, music, SFX and timings are the same as the vertical cut, so every shot must fit the same time slot. The evergreen event pack (`events/*.json`) drives both cuts.

## Specs for every keyframe
- **Exactly 16:9**, 1920×1080 PNG preferred (1280×720 minimum). Never letterboxed or padded.
- **Same characters and wardrobe as the vertical keyframes.** Noelle wears the purple suit, "I ♥ AI" tee, sunglasses and curly hair. The owner has grey hair and glasses, and wears an apron. The car is the yellow 80s supercar with plate **BBY TIGR**. Use the vertical keyframes as reference images.
- **Same look:** Miami synthwave, cel-shaded, magenta and orange sunset palette.
- **Keep the bottom 15% calm** (no faces or key props there), because captions sit there.
- **Lip-sync shots (05, 06, 07, 09):** the speaker's face is front-on or three-quarter, the mouth is clearly visible and **at least 1/4 of frame height**, and the mouth is closed or neutral in the keyframe.
- **Shots 10–12:** Noelle's mouth is closed or smirking. She is voiceover from here, with no lip sync.
- File names: `keyframes/user/16x9/S01.png`, `S02.png` … `S14A.png`, `S13C.png` (optional).

## Shot list (slot = time on screen; it must match the vertical cut)

| Shot | Slot | Line | 16:9 composition (cinematic upgrade) |
|---|---|---|---|
| 01 | 0.0–2.2 | (title) | **Wide tracking profile**: the yellow car cruises Ocean Drive left to right, with palms, Art Deco hotels and the sunset over the water. Noelle is visible at the wheel with sunglasses on. Leave the upper-left sky clear for the title. |
| 02 | 2.2–4.0 | – | **POV through the windshield**: her hand is on the wheel in the foreground, and the struggling shop is framed in the windshield. The owner is visible through the shop glass, head in hand. |
| 03 | 4.0–5.5 | – | **Wide interior**: the owner is slumped at the counter on the left (phone ringing, papers). Noelle is silhouetted in the doorway on the right, backlit by the sunset. |
| 04 | 5.5–7.0 | – | **Medium-wide**: Noelle strides in toward the counter, phone in hand, with the owner frazzled behind the counter. |
| 05 | 7.0–10.1 | Noelle: "Phones ringing? That's money walking out." | **Medium close-up, Noelle on the left third, facing camera** (lip sync). The laptop revenue dashboard is in the right foreground and the ringing desk phone is visible. |
| 06 | 10.1–11.9 | Owner: "I can't keep up!" | **Medium close-up, owner on the right third** (lip sync), phone to his ear and papers flying. The window and palms are behind him. |
| 07 | 11.9–14.9 | Noelle: "Relax. I made you something. Dial this." | **Over-the-shoulder two-shot**: the owner's shoulder and head are soft in the right foreground. Noelle faces camera (lip sync, face large enough) and holds her phone out toward him. |
| 08 | 14.9–17.6 | Rachel (phone): "Thanks for calling! How can I help?" | **Insert**: the phone fills the right half with the waveform UI ("RACHEL / AI RECEPTIONIST" is added in the edit). The owner's amazed face is soft-focus on the left. |
| 09 | 17.6–20.8 | Owner: "Wait… that's AI? How do I get it?" | **Medium close-up, owner centered** (lip sync), grinning in disbelief with the phone in hand. |
| 10 | 20.8–22.3 | VO (event): "Black Friday." | **Close-up, Noelle on the right third**, fingers on her sunglasses about to lower them, with a smirk (mouth closed). The shop is out of focus on the left. |
| 11 | 22.3–26.0 | VO (event): "Unlocking AI Challenge…" | **Profile two-shot across the counter**: Noelle on the left hands the **black card with the gold key** to the owner on the right. The card is at frame center. |
| 12 | 26.0–27.3 | VO: "I'll show you." | **Depth shot**: the owner holds the card up in the foreground (right) staring at it, and Noelle walks out through the door in the background (left). |
| 13 | 27.3–28.9 (+13B 29.9–32.0) | – | **Rear-quarter wide on the street**: Noelle at the driver door, car at the right of frame. **The roof must hide her body when she ducks in.** The road leads away to the horizon. This one image drives both 13 and 13B. |
| 14A | 28.9–29.9 | – | **Low insert on the rear plate BBY TIGR**, with exhaust glow and a wet street. |
| 13C | 32.0–35.0 | – | **Optional.** Default: made from the last frame of the 13 clip, so no image is needed. |

**End card (28.9–35.0)** sits over 14A, 13B and 13C. In 16:9 the event text block goes in the **left 40%** of frame, so in **13 and 14A keep the car in the right 60%** and the left side calm (sky and water).

## Physics and intent checks (from the vertical cut)
- Car entry: rear or rear-quarter framing, roof hides the body, and the sit-down is covered by the 14A cutaway.
- One car only, with no duplicates in reflections.
- The card is black with a gold key. The phone UI faces the camera in 08.
