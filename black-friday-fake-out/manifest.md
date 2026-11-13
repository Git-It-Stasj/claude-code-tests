# Black Friday Fake-Out — Batch Manifest

Run: Nov 12, 2026 · model `kling_o3_flf` (Kling 3.0 Omni Frames), std, sound on, 9:16, start_image only · 1.25 credits/s (confirmed with get_cost)

Result URLs all start with `https://d8j0ntlcm91z4.cloudfront.net/user_35DfehXfxEopMf3dxeXRVhHkrfr/`; the table shows the file name only.

| shot | job ID | result URL | seconds | credits | status | re-rolled? | notes |
|---|---|---|---|---|---|---|---|
| 1 | ff0d58d7-e898-43f3-9e34-72a1ea040906 | hf_20261112_232217_ff0d58d7-e898-43f3-9e34-72a1ea040906.mp4 | 3 | 3.75 | completed | no | |
| 2 | 44d8cba7-9036-41f9-9ff6-11dabb4da663 | hf_20261112_232217_44d8cba7-9036-41f9-9ff6-11dabb4da663.mp4 | 3 | 3.75 | completed | no | dialogue: "It's today." |
| 3 | 10a90bf2-e58d-4930-851d-789c758eb78d | hf_20261112_232216_10a90bf2-e58d-4930-851d-789c758eb78d.mp4 | 4 | 5.00 | completed | no | |
| 4 | 87744ed0-d483-4dfc-baba-13139d969b88 | hf_20261112_232216_87744ed0-d483-4dfc-baba-13139d969b88.mp4 | 3 | 3.75 | completed | no | |
| 5 | 54e96173-fb22-4f84-bca0-e470d502a125 | hf_20261112_232217_54e96173-fb22-4f84-bca0-e470d502a125.mp4 | 4 | 5.00 | completed | no | dialogue: off-screen mutter |
| 6 | (not provided) | — | — | — | done earlier | — | job ID not given in the brief or the doc |
| 7C | ac1fc3c1-eb9a-44ad-ba3e-b5adc6413391 | — | — | — | done earlier | — | alternate take a887658a-628d-4f52-b20c-1e22b74bc9d1 |
| 7D | 8fa291e8-8a6f-4411-8be3-36395c10061c | hf_20261112_232059_8fa291e8-8a6f-4411-8be3-36395c10061c.mp4 | 4 | 5.00 | completed | no | dialogue |
| 8 | dff44d14-a328-452c-bb2b-c1a1e218519c | hf_20261112_232142_dff44d14-a328-452c-bb2b-c1a1e218519c.mp4 | 6 | 7.50 | completed | no | not flagged; original prompt |
| 8B | f0a69553-eea9-49d1-8317-ba87bd37c501 | hf_20261112_232059_f0a69553-eea9-49d1-8317-ba87bd37c501.mp4 | 4 | 5.00 | completed | no | not flagged; original prompt |
| 9 | c58dc316-ddaa-43ac-88de-195181e9faa6 | hf_20261112_232142_c58dc316-ddaa-43ac-88de-195181e9faa6.mp4 | 4 | 5.00 | completed | no | |
| 11 | 221a07f7-83de-4de1-83b1-63c37f873fa0 | hf_20261112_232142_221a07f7-83de-4de1-83b1-63c37f873fa0.mp4 | 3 | 3.75 | completed | no | |
| 12 | 4c945c91-3b7b-4ae4-8df9-b6ef18daa22f | — | — | — | done earlier (approved) | — | |
| 12B | 0a0de6e5-b1a9-4741-a521-6652afaa8169 | hf_20261112_232059_0a0de6e5-b1a9-4741-a521-6652afaa8169.mp4 | 3 | 3.75 | completed | no | dialogue: "...Saturday?" |
| 12C | CapCut | — | 2 | 0 | CapCut only | — | still + push-in |
| 13A | 0accbe47-3b53-4255-8fdd-32f444ada15d | hf_20261112_232059_0accbe47-3b53-4255-8fdd-32f444ada15d.mp4 | 3 | 3.75 | completed | no | dialogue |
| 13 | b595693b-0c11-47c8-ab8d-0e3796de3a06 | hf_20261112_232142_b595693b-0c11-47c8-ab8d-0e3796de3a06.mp4 | 4 | 5.00 | completed | no | dialogue: "TOMORROW?!" |
| 14 | 5466eca7-41fe-422d-9eb2-7e9e1dee8570 | hf_20261112_232059_5466eca7-41fe-422d-9eb2-7e9e1dee8570.mp4 | 5 | 6.25 | completed | no | |
| 15 | CapCut | — | — | 0 | CapCut only | — | end card |
| Score | 0e258a14-0931-4b29-88b1-99abfa8f014b | hf_20261112_232238_0e258a14-0931-4b29-88b1-99abfa8f014b.mp3 | 60 | 8.72 | completed | no | elevenlabs_music_v2_5, instrumental, 60.03s |

**Clips:** 14 of 14 completed · 66.25 credits · score 8.72 · **total spent 74.97**

## Final balance
**65.95 credits** (started at 140.92). No re-rolls were needed. The under-30 alert and the hard stop were never triggered.

## Choices I made on my own
1. **Model:** used `kling_o3_flf` as you confirmed, not the doc's `kling3_0`. Ran get_cost first: 3s = 3.75, 4s = 5, 5s = 6.25, 6s = 7.5, which is 1.25 credits/s as expected.
2. **Cost checks:** ran get_cost once for each clip length rather than once per shot, because price depends only on length and the batch tool can't preflight cost. Each clip went out with `max_credits` set to its cost.
3. **Batching:** ran 9, 11, 8 and 13 as one batch of 4, since steps 2 and 3 had only two shots each. Batch order matched your run order. I submitted each batch as soon as the previous one went in, without waiting for it to finish. I checked the balance before every batch.
4. **Score max_credits:** the music model rejected `max_credits` with a 422 "extra inputs not permitted" error, and no job was created. Following your error rule, I called show_generations (only_completed false) first and found no new score job. Then I resubmitted once without `max_credits`, after a get_cost preflight of 8.72. It charged 8.72 as expected.
5. **Prompt format:** each prompt is the CAMERA line, a line break, then the doc prompt word for word.
6. **Project folder:** your saved Higgsfield setting is not to auto-create a project, so the jobs are in your general history, not a project folder.
7. **8B fallback wording:** a Haiku agent suggested replacements for the flag-prone words in 8B: "dashes" for "charges", "rolls into" for "plows", "corrals" for "squashes". 8B wasn't flagged, so I didn't use them. They're saved here in case you re-roll 8B by hand:
   > Grandma in her tracksuit dashes forward behind a long train of nested red shopping carts, low and determined like a bobsled push. The cart train rolls into the shopper and the two football fans and corrals all three against the store's glass doors, faces smooshed on the glass. …

## Skipped or failed
- **No failures and no flags.** All 14 clips and the score completed on the first try.
- **Shot 6:** already done; no job ID was provided.
- **Shots 7C and 12:** already done (IDs above).
- **Shot 7A:** skipped, no still.
- **Shots 12C and 15:** CapCut only.
- **Job 68949d48-47b5-4be4-b248-3a9939ae4c00:** not used.

## ⚠️ Audio check needed
**Nobody has listened to any of the audio yet.** Check the dialogue on shots **2, 5, 7D, 8, 8B, 12B, 13A and 13**. Look for garbled lines, wrong speakers and unwanted team names. Also check for music Kling slipped in despite "No music". The doc says to mute or duck that in CapCut rather than re-roll.

---

# QA round 1 (Nov 13)

| shot | verdict | new job ID (re-roll) | result URL | credits | notes |
|---|---|---|---|---|---|
| 1 | REVISE → re-rolled | 113b8905-d2aa-4697-bd3a-471bec1119e3 | hf_20261113_011316_113b8905-d2aa-4697-bd3a-471bec1119e3.mp4 | 3.75 | more urgent alarm; fingers tap around the screen trying to hit snooze. Alternate alarm sounds are in `sfx/` |
| 2 | REVISE → waiting on a new start still | — | — | — | needs a still with him lying under the covers. Plan: that still as start_image, the current still (ea6216de) as end_image |
| 3 | APPROVE | | | | |
| 4 | APPROVE | | | | |
| 5 | APPROVE | | | | the off-screen mutter is the shopper arriving and seeing the line |
| 7D | APPROVE | | | | rethinking how the characters get into position |
| NEW 7E | TODO | — | — | — | Bills fan grabs the cutter, spins him around: "Hey! Back of the line!" Plays before 8; needs a still |
| 8 | APPROVE | | | | |
| 8B | REVISE → re-rolled | 0e997d7e-c9d5-4f89-bb65-cfd3016b6c7f | hf_20261113_011316_0e997d7e-c9d5-4f89-bb65-cfd3016b6c7f.mp4 | 5.00 | keeps "Excuse me, boys!"; doors shudder but stay shut |
| 9 | APPROVE | | | | |
| 11 | APPROVE | | | | |
| 12B | APPROVE | | | | |
| 13A | APPROVE | | | | considering a re-run with the two fans swapping positions |
| 13 | APPROVE | | | | possible goat bleat in the audio; mute in CapCut if so |
| 14 | REVISE → re-rolled | 13b5c51c-2642-4b6b-b322-89829eb98c30 | hf_20261113_011316_13b5c51c-2642-4b6b-b322-89829eb98c30.mp4 | 6.25 | left-hand wave, tiger held in her right hand, then dragged |

**Re-roll spend:** 15.00 · **Higgsfield balance:** 50.95

## Alternate alarm sounds for shot 1 (ElevenLabs, eleven_text_to_sound_v2), in `sfx/`
- **A1–A4 "klaxon":** rapid, shrill, escalating beeps with phone rattle. A1 and A2 are about 0.5s; A3 and A4 about 1s.
- **B1–B4 "siren":** frantic, pulsing red-alert alarm with screen taps. B1 and B3 are 1s, B2 is 2s, B4 is 14s.
- Most clips are short, so loop or stack them in CapCut to cover the full 3 seconds. B4 is the only one long enough without looping.
- ElevenLabs flow: https://elevenlabs.io/app/flows/74EizGGZMt110sYsnjo2 (8 takes, about 7¢ total)

# QA round 2 (Nov 13)

| shot | verdict | new job ID | result URL | credits | notes |
|---|---|---|---|---|---|
| 1 | APPROVE | 113b8905-d2aa-4697-bd3a-471bec1119e3 | (round 1 re-roll) | | |
| 8B start still | new | 8a6199c4-677a-4031-a90c-82ec5c90ad19 | hf_20261113_012517_8a6199c4-677a-4031-a90c-82ec5c90ad19.png | 0.50 (2 variants) | gpt_image_2_6 edit of 2f659837 with the reader removed. Unused variant: 48e8fd0a-9fc2-4674-a498-c117f3adfef4 |
| 8B | REJECT → redone | b7212fc2-8d74-49aa-a2c6-4985c811e454 | hf_20261113_012609_b7212fc2-8d74-49aa-a2c6-4985c811e454.mp4 | 5.00 | the new still is both start_image and end_image, to keep the doors shut. Frame check: doors stay shut and the reader is gone, but there is very little motion |
| 14 | REVISE → re-rolled | 9d8bc441-c50d-454d-8d3c-85527463058e | hf_20261113_012528_9d8bc441-c50d-454d-8d3c-85527463058e.mp4 | 6.25 | carries the tiger by its paw (no string); left-hand wave. Frame check: the tiger dangles from her hand more than it drags |

**Higgsfield balance:** 39.20

# 8B option 2 (Nov 13)

| item | job ID | result URL | credits | notes |
|---|---|---|---|---|
| 8B start still (before the impact) | 65a691a1-11ed-4058-b8b5-ccd3f92b3eb9 | hf_20261113_014236_65a691a1-11ed-4058-b8b5-ccd3f92b3eb9.png | 0.50 (2 variants) | Grandma about 10 ft back, men at the closed doors, no reader. Unused variant: 91ee9bb9-9d11-4d1b-a98f-913c5b71efc9 |
| 8B (option 2) | a392a639-8c34-4dfc-bbe5-b838802935ef | hf_20261113_014334_a392a639-8c34-4dfc-bbe5-b838802935ef.mp4 | 5.00 | start 65a691a1 → end 8a6199c4. Frame check: she charges and the doors stay shut the whole time, but at about 2.0–2.4s she snaps from near the doors back to her end-frame pose (morph to the last frame) |

**Higgsfield balance:** 33.70

# 8B continuous attempt (Nov 13)

| item | job / media ID | result URL | credits | notes |
|---|---|---|---|---|
| 8B start still (your upload: fight + Grandma 10 ft back) | media d5b0f738-7275-43c1-be35-f3759cae2c63 | `8B_start_fight_still.png` in this folder | 0 | |
| 8B continuous | 3f9b5ce7-39ab-40c2-b8f3-b73b0b1711f6 | hf_20261113_021225_3f9b5ce7-39ab-40c2-b8f3-b73b0b1711f6.mp4 | 6.25 | 5s, start d5b0f738 → end 8a6199c4. Frame check: the scuffle and the charge read well and the doors stay shut, but at about 2.6s Grandma snaps from beside the doors back to the left foreground (her position in the end frame), then pushes in again |

**Higgsfield balance:** 27.45. One more 5s clip (6.25) leaves 21.20. 8B and shot 2 together would go below the 20-credit hard stop.
