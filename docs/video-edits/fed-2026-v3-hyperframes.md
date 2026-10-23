# FED-2026 v3 — My first video edit with HyperFrames + Claude Code

A record of the third pass on a captioned vertical edit, built with
[HyperFrames](https://github.com/heygen-com/hyperframes) and driven by Claude Code.

- **Project:** `/Users/thestasj/GitHub/my-video` (local machine, not a git repo)
- **HyperFrames CLI:** `hyperframes@0.8.186`
- **Deliverable:** `renders/fed-2026-captioned-v3.mp4`
- **Status:** waiting for my review of v3

---

## Why there was a v3

I didn't approve v2. I asked for three changes:

1. **The "LUISA" slam covered my face.** It had to be completely gone by frame 143 (4.767 s).
2. **The captions after the slam were off.**
3. **The ending seemed to skip "Ta-ta for now" and then replay the end.**

I also approved two other changes: normalising the audio to −14 LUFS and deleting an unused
camera-shake component.

---

## What changed

### 1. Slam shortened (`compositions/slam.html`)

| Setting | v2 | v3 |
|---|---|---|
| `OUT` | 1.12 | 0.74 |
| Fades | — | 0.20–0.24 s |
| Flame fade-out jitter | — | 0.04 |
| Embers | — | capped to finish by local 0.98 |
| "THE LIONESS" entrance | — | T+0.16, over 0.22 s |

`T = 0.24` is unchanged. The whole slam is now gone by **4.74 s (frame 142)**, one frame
earlier than the limit.

### 2. Slam host and roar SFX (`index.html`)

- The slam host's `data-duration` went from 2 to **1.1**.
- `#sfx-roar`'s `data-duration` went from 2.3 to **1.45**, and `data-fade-out="0.35"` was added
  so the roar stops playing over my speech. *I didn't ask for this one. Claude flagged it to me.*
- `HIT = 3.98` (punch-in) is unchanged. The camera zoom-out still starts at `HIT + 1.31`.

### 3. Post-slam captions retimed (`compositions/captions.html` + `assets/video/transcript.json`)

In this section the ElevenLabs Scribe word timings ran **0.25–0.35 s late**. Claude retimed them
from the audio loudness envelope instead:

| Group | Start | Duration | Words |
|---|---|---|---|
| cg3 | 5.10 | 1.00 | AND 5.10–5.30 · WE 5.50–5.60 · ARE 5.62–5.72 |
| cg4 | 6.10 | 1.22 | LEAVING 6.10–6.50 |

- The same changes were mirrored in `transcript.json` (words w8–w11).
- The loud burst at about 4.95 s is my scream, which you can see in the frames. It is
  deliberately left without a caption.
- ⚠️ These times are **estimates from the loudness envelope**, not a new transcription.

### 4. Ending investigated — no defect found in the files

- Frame matching showed that v2, the Studio render and v3 all follow `fed-1080.mp4` frame for
  frame, with no repeated footage.
- In the audio, "Ta-ta / for / now" falls at **22.80 / 23.15 / 23.30 s**, and the captions
  light up correctly.
- The most likely cause is playback in the Studio preview or in a player that loops.

### 5. Loudness normalised

- Rendered with `--quality delivery`, giving `v3-raw.mp4`.
- Audio filter chain:
  ```
  volume=14.5dB,alimiter=limit=0.79:attack=3:release=80:level=false
  ```
  The audio was encoded as AAC at 192k, and the video stream was copied unchanged.
- **Result: −14.1 LUFS integrated, peak −1.3 dBFS.**
- `loudnorm` was tried in both linear and dynamic mode. On this short clip it stalled at
  −15.2 LUFS, so it wasn't used.

### 6. Cleanup

- Deleted `compositions/components/camera-shake.html` and the `components/` directory, which was
  then empty (I approved this).

---

## Lessons learned

- **Scribe timings can drift around loud moments.** Right after the slam and scream, the word
  timings were about 0.3 s late. Checking them against the loudness envelope found the drift.
- **`loudnorm` struggles with short clips.** It didn't reach the target, but a fixed gain plus
  `alimiter` got to −14 LUFS with a safe peak.
- **HyperFrames Studio rewrites your markup.** Running `check` added `data-hf-id` attributes to
  `captions.html`. After that, edits that match old markup exactly fail, so match on attribute
  values instead.
- **"The video skips" may be the player, not the file.** Frame-matching the render against the
  source footage showed that the file itself was fine.

---

## How to verify

```sh
cd /Users/thestasj/GitHub/my-video

# Composition is valid (expect ok: true)
npx --yes hyperframes@0.8.186 check --json

# Visual spot-checks
npx --yes hyperframes@0.8.186 snapshot --at 4.5,4.77,5.15,5.55,6.2,23.18
#  4.5   → slam visible
#  4.77  → face clear, no slam
#  5.15  → "AND"
#  5.55  → "AND WE ARE"
#  6.2   → "LEAVING"
#  23.18 → "TA-TA FOR"

# Loudness (expect I ≈ −14.1 LUFS, peak ≈ −1.3 dBFS)
ffmpeg -hide_banner -i renders/fed-2026-captioned-v3.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary

# Preview server
npx --yes hyperframes@0.8.186 preview --status
```

---

## Open questions

- [ ] **Is v3 approved?** In particular, do the estimated caption times between 5.0 and 6.5 s
      sound right? If not, run Scribe again on a 4.5–7.5 s clip.
- [ ] **Where did the "skip then replay" happen?** Was it in the Studio preview or another
      player? If it happens in v3, note the timestamp.
- [ ] **Roar:** keep the shortened 1.45 s version with the fade, or go back to full length?
- [ ] `renders/my-video_2026-10-22_23-33-08.mp4` and its `.meta.json` are a Studio render that
      Claude didn't create. They were left untouched.
- [ ] `ELEVENLABS_API_KEY` is still empty in `.env`. That's fine for now, because the connector
      handles transcription. It's only needed for scripted or batch Scribe calls.

## Running state at handoff

- The HyperFrames Studio preview is running at `http://localhost:3002/#project/my-video`
  (PID 57123). Stop it after reviewing:
  `npx hyperframes preview --stop`
