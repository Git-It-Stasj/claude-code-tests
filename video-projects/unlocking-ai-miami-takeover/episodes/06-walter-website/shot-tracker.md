# EP06 Walter — Shot tracker

Frames: `02-approved-storyboard/` (R01 = user art, untouched). Touch-ups: `02-approved-storyboard/touchup/*_R02.png`
(scripts: `scripts/emblem_swap.py`, `scripts/ep06_touchups.py`). Clips: `04-generated-clips/`. QA strips: `09-quality-control/`.
Higgsfield media IDs: `media_ids_r01.txt`.

| Shot | Source frame | Model | Clip | Status |
|---|---|---|---|---|
| SH01 | SH01_R02 (Ferrari badges removed) | MiniMax 5s, start=end frame | SH01_R02 | PASS. R01 rejected: car turned to camera and lost its roof |
| SH02 | SH02_R01 | Grok 2s | SH02_R01 | PASS |
| SH03 | SH03_R01 | Grok 3s | SH03_R01 | PASS |
| SH04 | SH04_R01 | Grok 2s | SH04_R01 | PASS |
| SH05 | SH05_R01 | Grok 2s | SH05_R01 | PASS (hand reaches for monitor) |
| SH06 | SH05_R01 → SH06_END_R01 | MiniMax 5s start/end | SH06_R01 | PASS (turn at 0.4–1.6s, then hold) |
| SH07A | SH07A_R01 | Grok 2s | SH07A_R02 | PASS. R01 rejected: sunglasses removed, face drift |
| SH07B | SH07A_R02 last frame | post push-in 1.0→1.18 (3s) | SH07B_R01 | PASS. Lip-sync target for "You missed a spot" |
| SH08 | SH08_R02 (Apple logo → tiger) | Grok 5s | SH08_R01 | PASS, note: slight camera drift right |
| SH09 | SH09_R01 (was unmapped frame 8; user call) | Grok 3s | SH09_R01 | PASS |
| SH10A | SH10A_R02 (Apple logo → tiger) | Grok 2s | SH10A_R01 | PASS (portrait glows, Vic leans in) |
| SH10B | SH10B_R02 (Apple logo → tiger) | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R03 | PASS |
| SH11A | SH11A_R01 | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R03 | PASS |
| SH11B | SH11B_R02 (nav garble removed) | post composite (`scripts/ep06_screen_seq.py`) | — | DROPPED (user: monitor order 1-2-3 = 11A, 12A, 12B) |
| SH12A | SH12A_R01 | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R03 | PASS |
| SH12B | SH12B_R01 | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R03 | PASS |
| SH12C | SH12C_R02 touch-up (clear lens → sunglasses, `scripts/ep06_sh12c_sunglasses.py`) | MiniMax 5s, start=end | SH12C_R03, use 3.8–5.0s | PASS. R01 drifted/garbled; R02 had clear glasses (user: sunglasses) |
| SH13 | SH13_R01 (standing; user call) | Grok 3s | SH13_R02 | PASS. R01 rejected: pencil/shaved side lost, face drift |
| SH14A+B | SH14A_R01 → SH14B_R01 | MiniMax 5s start/end | SH14_R01 | PASS (one card throughout) |
| SH15 | SH15_R01 | Grok 3s | SH15_R01 | PASS |
| SH16A | SH16A_R02 (plate smudge removed) | Grok 2s | SH16A_R01 | PASS |
| SH16B | SH16B_R02 (motion lines removed) | MiniMax 5s | SH16B_R01 | PASS (one card, car recedes on road) |

Unused: SH13_ALT_SEATED_R01_UNUSED (user picked standing).

Screen sequence `EP06_SH10B-12B_SCREEN_R03.mp4` (6.5s, user order): 10B 0–1.9, 11A 1.9–3.5 (flash), 12A 3.5–5.1 (light-bar rebuild), 12B 5.1–6.5 (scan sweep). Frames are not pixel-aligned, so transitions are full-frame.

## Audio
- Music: `audio/music/ep06_walter_bed_40s_R01.mp3` (40.0s, ElevenLabs Music v2.5, instrumental).
- Noelle (Sloane, ElevenLabs v4, stab 0.45 / sim 0.8) in `audio/voices/ep06/`: L02 missed spot 1.49s, L04 I can tell 1.23s, L06 Relax. I know a guy 2.85s, L07 Meet Walter / Your AI website builder 3.24s (split at ~1.15s), L10 Don't push it, Vic 1.72s.
- Vic / Walter: auditions in `audio/voices/candidates/ep06/` (Vic: Barrett, Gideon, Harrison; Walter: Julian, Evan, Callum). User picks: Vic = Gideon, Walter = Barrett.

## Lip sync (sync_so, default detection, cut_off)
03, 07B, 08 (Vic only; Noelle's off-camera "I can tell" left out), 09, 10A, 13, 14 - all PASS (mouth crops in 09-quality-control/EP06_LS_*_mouth.jpg).
SH14 first job took ~20 min; a backup job (353b6b84, auto active-speaker) was submitted before the first finished - first result used.

## Export
`exports/ep06/EP06_walter_website_v1.mp4`: 1080x1920, 24 fps, 41.1s, -16.2 LUFS, peak -2.5 dBFS. Manifest `manifests/ep06-walter-website.json`.

## v2 (user tweaks 2026-11-27)
- SH04 -> SH04_R02 (Grok, Noelle mouth closed), lip-synced Vic (end of L01; auto active-speaker; manual-coords job stalled in queue).
- SH05 -> SH05_R02 (MiniMax SH06_END -> SH05 frames): monitor faces Vic, spins to Noelle. Old SH05/SH06/SH07A retired.
- SH06 -> SH06_R02 (MiniMax SH05 -> SH07A frames, played 1.8x): Noelle raised palm -> lifts sunglasses, points.
- SH07B -> SH07B_R02 push-in rebuilt from SH06_R02 last frame (seamless cut), re-lip-synced.
- SH01 tracking shot: waiting on user start keyframe (Ferrari centered, nose right, generic storefront).
- Export `exports/ep06/EP06_walter_website_v2.mp4`: 41.7s, -16.3 LUFS, peak -2.6 dBFS.

## v3 (2026-11-27) — S01 tracking drive
- S01 rebuilt per user brief as deterministic parallax compositing (`scripts/ep06_s01_drive.py`), no generative video:
  locked Ferrari+Noelle cutout (`scripts/ep06_s01_mask.py`), wheels rotated clockwise from road travel, car reflection on wet road,
  layers sky 0.06x / storefronts 1x / road 1.55x / waterfront+bollards 2.1x, motion blur per layer.
- Plates (user-approved, nano_banana_pro, ~10 cr): Delgado clean plate (job 2470116d) + LUNA BOUTIQUE (cf5a5a13),
  CAFE PALMERA (2d865c16), GALERIA SOL (34dec346), AZUL INTERIORS (5802e84d). Invented names, no real brands.
- Episode cut: 4.0 s, cruise 2.3 s, ease to stop at 3.7 s, settles onto the approved SH01_R02 frame (dissolve 3.6-3.9 s).
- Runtime 41.7 -> 44.1 s. Approved 40 s music bed unchanged, placed 2.4 s later (`music_at`) so it still resolves on the end card.
- Car SFX: car_arrive src 8.0 s, 0 dB.
