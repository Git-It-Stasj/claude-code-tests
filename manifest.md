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
