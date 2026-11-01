# Lessons Learned: "Mama Tiger Reads" book-page → talking-animal video

Format: ~35–50 s vertical 9:16 (1080×1920, 30 fps). Page photo with a karaoke highlighter synced to the voice → **hard cut** → one continuous lip-synced animal clip with captions → short spinning-book credit card.

This file records what went wrong the first time, what fixed it, and the fastest route next time. Short version: **most of the time and credits were lost to five avoidable mistakes** (see "Top 10 rules").

---

## Top 10 rules (read these first)

1. **Generate the animal scene as ONE clip, not chunks.** Stitching 4–5 short clips produced visible pops at every join; no fade length fully hid them. MiniMax H3 takes 4–15 s per clip, so a ≤15 s reading fits in one generation. Plan the script so the on-camera reading is **≤ 14.5 s**. (30 credits for 15 s.)
2. **Use MiniMax H3 with `image_references` + `audio_references` for lip-synced reading.** It was the only model that was both lip-synced and long enough. Wan 2.7 lip-sync is loose; Kling 3.0 ignores your audio and speaks in its own voice; Intone/Seedance need a Plus plan; Grok 1.5 failed on the provider side.
3. **Never let a model render book text at close-up from a plain scene image.** It garbles it ("NEELLE RUSSSLL", "ENTANEASN T6 EXCSTION"). Fix that worked: pass **the real cover photo as a second image reference** *and* spell every string in the prompt in caps.
4. **Fix text before animating.** Garbled lettering on the start frame was found late and cost re-runs. Check the start frame at 100% for every word before spending video credits.
5. **Measure sync, never eyeball it.** The user caught "two words behind" twice because I tuned visually. Extract audio from the *rendered mp4* and run energy-onset detection (see script below). Report numbers.
6. **ffmpeg `adelay` is silently dropped when frames are piped in with `-af`.** Build the delayed audio as a separate file, then mux. This single bug caused the "highlighter two words ahead" complaint and a pile of wasted highlighter tweaks.
7. **Report the credit cost and balance before every generation** and use `get_cost: true` first. A failed/`nsfw` job is not charged.
8. **A content-filter `nsfw` status can be a false positive** (it fired on a tiger reading a book). Retry with only the proven reference image and a plainer prompt. Don't assume the prompt is the cause.
9. **Don't deliver until you've checked every join, every caption time and loudness.** Send previews early, but state clearly what is *not* verified (e.g. lip-sync viewed by a human).
10. **Hard cut means hard cut.** The user explicitly did *not* want a warm-light fade between the page and the animal scene. Cut on the last word of passage 1.

---

## Decisions we made (and why)

| Decision | Choice | Reason |
|---|---|---|
| Voice | ElevenLabs designed voice, "motherly, sultry, grandma" ("Mama Tiger – Lamplighter Grandma"), `eleven_v4` TTS | User-requested character; designed once and saved for reuse |
| Pace | ~135 wpm for the tiger reading; page passage tightened further | Original pace felt too slow; user asked for faster |
| Loudness | Normalise each narration to **−16 LUFS, peak −1.5 dBFS** (highpass 80 Hz, +2 dB at 3 kHz) | "Make sure the voice is clear and audible"; Kling's own audio was −27 LUFS, unusable |
| Scene 1 | Page photo, golden multiply-blend highlighter, **no captions** (highlighter *is* the visual) | User preference |
| Scene 2 | Animal scene **with plain captions** (no karaoke) | User preference |
| Transition | **Hard cut** after the last word of passage 1 | User preference |
| Opening of scene 2 | Pull-back from the book cover to the full scene | User's concept: tiger eyes on the cover, zoom out to the mama tiger reading to cubs |
| Video model | **MiniMax H3**, 9:16, 15 s, one clip | Lip-sync + length; user compared and chose it |
| Closing card | 3 s, spinning 3D book from the user's real cover/back photos, credit line, **no logo** | User preference |
| Sound | **No fireplace sound** | User preference (the fireplace *glow* still appears in wide shots) |
| Pull the voice into the pull-back | Voice enters ~0.7 s after the cut, during the pull-back | Silent gap after the cut felt dead |

---

## The efficient pipeline (do it in this order)

**0. Intake (ask once, up front)**
- Passage 1 (page) and passage 2 (animal reads). Page photo, character image, book cover/back/spine photos.
- Confirm: hard cut? captions on which scene? logo? sound effects? target length? voice character?
- Tell the user the credit plan and balance *before* generating anything.

**1. Transcribe the page photo** → get approval of passage text before any audio.

**2. Voice**
- `creative_design_voice` once → `creative_save_designed_voice`. Reuse that voice id.
- Generate both passages. Transcribe each take with Scribe (word timestamps) – these timestamps drive highlighter and captions.
- Normalise: two-pass `loudnorm` to −16 LUFS, `linear=true`.

**3. Scene 1 – highlighter (local render, PIL + numpy)**
- Detect line geometry and per-word boxes from the page photo (column-gap detection on a text mask; lower the gap threshold on short last lines).
- Bar rules that matched speech: lead 0.06 s, complete each word at ~70 % of its duration, **hold through pauses**, soft edge ~22 px, gold multiply colour (1.0, 0.78, 0.28).
- Build the audio **separately** (`atempo`, `adelay`, `apad`), render video-only, then mux with `-c:v copy`.
- Verify with onset detection on the final mp4: first/last speech time vs. first/last word in the transcript.

**4. Scene 2 – animal clip (one generation)**
- Pre-flight the start/reference image: all text correct at 100 %. Fix with an image edit first if not.
- Prepare an audio reference = narration with ~0.5 s of lead-in silence, ≤ 15.0 s total (MiniMax max).
- Upload: `media_upload` → `curl PUT` → `media_confirm` for each of: scene image, real cover photo (for lettering), audio.
- `generate_video` with `get_cost: true`, then generate. 15 s ≈ **~15 min wall-clock**, 30 credits.
- Prompt template (worked):
  > One continuous shot with no cuts. The shot opens tight and close on the book cover held in the mama tiger's paws, then the camera pulls back slowly and smoothly, revealing the mama tiger in round glasses reading aloud from the open book, and keeps pulling back to the wide view of her in the leather armchair with her three tiger cubs listening at her feet, as in the first reference image. The book cover is exactly the second reference image, with perfectly sharp, correctly spelled lettering: NOELLE RUSSELL, SCALING RESPONSIBLE AI, FROM ENTHUSIASM TO EXECUTION, WILEY. Warm library lamplight. The mama tiger's mouth moves precisely in sync with the supplied speech audio as she reads the story aloud warmly.
- Decline preset suggestions ("Earth zoom out", "IN THE DARK") with `declined_preset_id` – they trigger on "zoom out" wording.
- Inspect frames at 0.3, 1.5, 3, 4.5, 6, 9, 12, 14.5 s **and zoom into the cover at full res** before assembling.

**5. Closing card (local render)** – spinning perspective-warped 3D box, depth-sorted faces, one eased full turn landing front-facing, credit line fades in. Remove thumbs/fingers from textures by copying clean paper from a nearby region with feathered edges (not a flat colour block).

**6. Assemble** (one ffmpeg `filter_complex`): scene 1 (trim at cut) → `concat` hard cut → clip → 0.35 s `xfade` dissolve to card. Captions as transparent PNG overlays with `enable='between(t,a,b)'`. Audio: scene-1 track + narration with `adelay`, then `amix=normalize=0`, `apad`, `atrim`.

**7. Verify, then send** – see QA checklist.

---

## Model notes (as of this project)

| Model | Verdict |
|---|---|
| **MiniMax H3** | **Use.** `image_references` + `audio_references`; 4–15 s; 2K output (1440×2560); ~2 credits/s. Cannot combine start/end frames with an audio reference. May garble small text unless given a real reference. |
| Wan 2.7 | Supports start/end frames and audio reference but lip-sync is loose. ~2.5 credits/s. |
| Kling 3.0 | Great visuals, but generates its **own** voice; won't use your audio. |
| Intone, Seedance 2.5 | Need a Plus plan on this account. |
| Grok Video 1.5 | Failed on the provider side twice (not charged). `audio_references` needs `image_references`, not `start_image`. |

Other API quirks: Intone needs exactly two image references. Zoom-out/"Earth zoom" presets get auto-suggested – decline them. `generate_video` takes JSON; paths with backslashes break parsing.

---

## Mistakes that cost the most (and the fix)

| Mistake | Cost | Fix |
|---|---|---|
| Chunked the animal scene into 4–5 clips | Visible pops at every join; 3 rounds of transition tweaking; ~30 credits of clips plus re-timing | One 15 s MiniMax clip |
| `adelay` dropped with piped frames | Highlighter looked "two words behind" twice; many unneeded highlighter tweaks | Separate audio build + mux; verify onset on the rendered file |
| `-ss`/`afade` placement bug → silent audio slices | Wan lip-sync wrongly judged | Put `-ss` before `-i`; run `volumedetect` on every slice |
| Text garbled in generated frames | Re-runs; user noticed in review | Real cover as extra reference + spelled-out strings; check at 100 % |
| Flat white rectangle over the thumb | User noticed immediately | Copy nearby clean paper with feathered edge + brightness match |
| Background poll `pgrep` matched itself | Wait never fired | Poll the job id instead |
| Tuned visuals instead of measuring | Repeated user complaints | Onset detection on rendered audio |
| 2.9 s silent gap after the hard cut | User complaint | Voice lead-in ≤ 0.7 s after the cut |

---

## QA checklist (run before every delivery)

- [ ] Transcript approved by user before voice generation.
- [ ] Every generated frame: all text correct at 100 % (cover, spine, signage).
- [ ] Scene 1: first/last speech onset vs. transcript within ±0.1 s (onset detection on rendered mp4).
- [ ] Highlighter: bar leads the word slightly, holds through pauses, finishes the final word.
- [ ] Hard cut lands within ~0.05 s of the last word's end.
- [ ] Gap between last word of scene 1 and first word of scene 2 ≤ ~1 s.
- [ ] Captions start within ~0.05 s of each chunk's first word; none left on screen over silence.
- [ ] Loudness −16 ± 0.5 LUFS, true-peak ≤ −1.5 dBFS.
- [ ] No speech after the closing card starts; credit line legible.
- [ ] Total runtime stated; credits spent and remaining stated.
- [ ] Say plainly what a human still needs to check (lip-sync viewing).
- [ ] Commit and push (never open a PR unless asked).

### Sync measurement snippet

```python
import subprocess, numpy as np
raw = subprocess.run(['ffmpeg','-loglevel','error','-i','final.mp4','-vn','-ac','1','-ar','16000','-f','s16le','-'],
                     capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(float)/32768
hop = 160; n = len(a)//hop                      # 10 ms hop
e = 20*np.log10(np.sqrt((a[:n*hop].reshape(n,hop)**2).mean(1)) + 1e-9)
t = np.where(e > e.max()-38)[0]*0.01            # speech = within 38 dB of peak
# group into segments separated by >0.5 s of silence -> print (start, end) of each
```

### ffmpeg gotchas

- Delayed narration: `adelay=<ms>:all=1`, built in a standalone audio command; mux with `-c:v copy -c:a aac`.
- `-ss` **before** `-i` when slicing audio that then gets filters with absolute times.
- Loudness: two-pass `loudnorm` with measured values and `linear=true`.
- Eased crossfade (only if you must join clips): `xfade=transition=custom:expr='A*(1-P*P*(3-2*P))+B*(P*P*(3-2*P))'`.
- Put the whole video graph in one `filter_complex` (trim → scale → fps → xfade/concat → overlays).

---

## Credits and time (this project)

- Starting balance ~22 credits (starter plan); topped up to 222.
- MiniMax H3: ~2 credits/s → 15 s = 30 credits. Wan 2.7: ~2.5/s.
- Failed or content-filtered jobs: not charged.
- A 15 s MiniMax job took ~15 min each. Plan the schedule around that; submit, then do local work (closing card, captions, assembly) while it renders.
- Cheapest safe plan next time: 1 fixed start frame + 1 audio + 1 real-cover reference → **one** 30-credit generation, with one 30-credit retry budgeted.

---

## Open items / honesty notes

- The final take **opens on the mama tiger's face** (cover lettering is correct), not on the cover-with-tiger-eyes macro the user first pictured. A cover-first opening with clean text would need another generation.
- Lip-sync was verified by audio-onset timing only; a human still has to watch it.
- The fireplace *glow* appears in wide shots (user only banned fireplace *sound*).
- A faint sliver of the finger remains at the lower-left edge of the back-cover texture; it is invisible at video size.
