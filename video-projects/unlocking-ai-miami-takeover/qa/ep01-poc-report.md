# Ep01 Proof-of-Concept — QA + Cost Report (2026-11-21)

## Integrations
| Check | Result |
|---|---|
| Higgsfield MCP | ✅ connected, starter plan, 430.95 credits at start |
| ElevenLabs | ✅ via Higgsfield `elevenlabs_v4` (no direct API key). Parallel submits hit a 429, so send ≤2 at a time |
| Master sheets (Noelle, Shop Owner 1, car) | ✅ in `references/`, 18 panel crops cut, 12 uploaded as Higgsfield media |
| ffmpeg/ffprobe | ✅ local |

## Shot 01 test (vertical)
- Keyframes `S01_9x16_v1.png` and `S01_16x9_v1.png` are **PASS**. Both match the sheet: car silhouette, 5-bar side strakes, rectangular light/grille, five-spoke wheels, Noelle's curls and sunglasses visible, palette on-model, no text.
- Video `clips/S01_9x16_test_grok.mp4` (grok_video_v15, 3s, 704×1280) is **PASS**. Across frames 0/24/48/70, body panels, strakes and wheels stay rigid with no morphing. Parallax on the palms is correct and the cel-shaded style holds.
- Minor: small hood/wheel badges are rendered, which is acceptable. Native output is 720p, so it is upscaled to 1080×1920 in post. A 1080p render costs 8 credits/sec instead of 4.5.
- The clip carries model-generated audio, which is discarded because we use separate stems.

## Dialogue timing (actual TTS)
| Line | Spoken | Window | Result |
|---|---|---|---|
| L1 Noelle | 3.06s | 3s | OK (starts 0.05s early) |
| L2 Owner | 1.30s | 2s | OK |
| L3 Noelle | 3.60s | 3s | Tighten pauses by 0.6s |
| L4 Rachel | 2.00s | 3s | OK |
| L5 Owner | 3.15s | 4s | OK |
| L6 Noelle | 6.26s | 5s | Tighten pauses by 0.9s, then a 0.4s J-cut into the finale |

The voices are stock presets (Sloane, Marcus, Emily) and still **need a listen and approval**.

## Spend so far
**17.1 credits** (413.84 remaining): 2 keyframes, 6 TTS lines and one 3-second video.

## Estimate to finish Ep01
| Item | 9:16 only | Both native ratios |
|---|---|---|
| Keyframes: 9 shots + plates + end-card bg (~1/ea) | ~14 | ~26 |
| Video: 29s remaining at 4.5/s (2 start+end shots on minimax) | ~135 | ~270 |
| Music + SFX | ~8 | ~8 |
| 20% regeneration buffer | ~30 | ~60 |
| **Total** | **~187** | **~364** |

The balance of ~414 credits covers **one** full dual-native episode, or about **two** vertical-only episodes. Seven episodes need roughly 2,500 credits dual-native, or about 1,300 credits vertical-first with native widescreen only on the hero shots.
