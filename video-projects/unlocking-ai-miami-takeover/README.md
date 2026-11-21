# UNLOCKING AI: MIAMI TAKEOVER — Production System v2.0

A 7-episode, 32-second animated ad series for the **Unlocking AI Challenge** (Black Friday, Fri Nov 27 2026, 3:00–5:00 PM ET, LIVE).
Each episode follows the same pipeline and is driven by one manifest in `manifests/`.

## Layout
| Path | Contents |
|---|---|
| `references/` | Approved master sheets plus panel crops (Noelle, Shop Owner 1, vehicle). **Never regenerate.** |
| `manifests/reference-assets.json` | Canonical registry: file paths, Higgsfield media IDs, voice IDs and settings |
| `manifests/epNN-*.json` | Per-episode manifest: dialogue timing, 10-shot list, refs, paired 9:16/16:9 framing, status |
| `episodes/NN-*/keyframes, clips/` | Per-episode stills and animated shots |
| `audio/voices, music, sfx/` | Separate stems |
| `exports/vertical, widescreen/` | Final MP4s |
| `qa/` | Frame strips and QA reports |
| `templates/` | End card and phone-UI overlays (built in post, not generated) |

## Toolchain (validated 2026-11-21)
| Need | Tool | Model | Unit cost |
|---|---|---|---|
| Keyframes (multi-reference) | Higgsfield | `gpt_image_2_6`, medium quality, 1k | ~1 credit/image |
| Image-to-video | Higgsfield | `grok_video_v15`, 720p, start frame | 4.5 credits/sec |
| Start+end-frame shots (expression changes) | Higgsfield | `minimax_h3_max` 768p (5s minimum) | ~12.5 credits/5s |
| Dialogue | ElevenLabs via Higgsfield | `elevenlabs_v4`, preset voices | ~0.23 credits/line |
| Music | ElevenLabs via Higgsfield | `elevenlabs_music_v2_5`, instrumental | ~4.7 credits/32s |
| Compositing, captions, end card, export | Local ffmpeg | — | free |

"Hyper Frames" is HeyGen's HTML-video product and is **not** a Higgsfield model. Its MCP is connected but its compose and render tools are disabled for CLI agents, so it isn't used in this pipeline.

No direct ElevenLabs API key is configured. Voices go through Higgsfield's ElevenLabs models. Firing six TTS lines in parallel hit a 429 rate limit, so submit them two at a time.

## Daily loop
1. Copy the Ep01 manifest, then edit the employee, problem, environment, dialogue and shots.
2. Generate only the missing keyframes (9:16 and 16:9 pairs), then run continuity QA.
3. Generate dialogue and validate timing (`ffprobe` + `silencedetect`).
4. Animate each shot from its approved keyframe. Regenerate only failed shots.
5. Composite, captions, end card, then export both aspect ratios, then QA, then log costs.
