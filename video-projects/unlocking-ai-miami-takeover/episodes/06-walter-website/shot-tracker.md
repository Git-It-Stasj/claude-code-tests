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
| SH10B | SH10B_R02 (Apple logo → tiger) | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R01 | PASS |
| SH11A | SH11A_R01 | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R01 | PASS |
| SH11B | SH11B_R02 (nav garble removed) | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R01 | PASS |
| SH12A | SH12A_R01 | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R01 | PASS |
| SH12B | SH12B_R01 | post composite (`scripts/ep06_screen_seq.py`) | SH10B-12B_SCREEN_R01 | PASS |
| SH12C | SH12C_R01 | MiniMax 5s, start=end frame | SH12C_R02, use 3.4–5.0s | PASS (tail only: mid-take turns to camera). R01 (Grok) rejected: both faced camera, pencil lost, URL garbled |
| SH13 | SH13_R01 (standing; user call) | Grok 3s | SH13_R02 | PASS. R01 rejected: pencil/shaved side lost, face drift |
| SH14A+B | SH14A_R01 → SH14B_R01 | MiniMax 5s start/end | SH14_R01 | PASS (one card throughout) |
| SH15 | SH15_R01 | Grok 3s | SH15_R01 | PASS |
| SH16A | SH16A_R02 (plate smudge removed) | Grok 2s | SH16A_R01 | PASS |
| SH16B | SH16B_R02 (motion lines removed) | MiniMax 5s | SH16B_R01 | PASS (one card, car recedes on road) |

Unused: SH13_ALT_SEATED_R01_UNUSED (user picked standing).

Screen sequence `EP06_SH10B-12B_SCREEN_R01.mp4` (8.5s): 10B 0–2.0, 11A 2.0–3.8 (flash in), 11B 3.8–5.6 (light-bar wipe), 12A 5.6–7.0 (flash), 12B 7.0–8.5 (scan sweep). Frames are not pixel-aligned, so transitions are full-frame.

## Audio
- Music: `audio/music/ep06_walter_bed_40s_R01.mp3` (40.0s, ElevenLabs Music v2.5, instrumental).
- Noelle (Sloane, ElevenLabs v4, stab 0.45 / sim 0.8) in `audio/voices/ep06/`: L02 missed spot 1.49s, L04 I can tell 1.23s, L06 Relax. I know a guy 2.85s, L07 Meet Walter / Your AI website builder 3.24s (split at ~1.15s), L10 Don't push it, Vic 1.72s.
- Vic / Walter: auditions in `audio/voices/candidates/ep06/` (Vic: Barrett, Gideon, Harrison; Walter: Julian, Evan, Callum). Waiting on user pick.
