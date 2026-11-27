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
| SH07B | — (user: push-in on SH07A end) | post | — | TODO in edit |
| SH08 | SH08_R02 (Apple logo → tiger) | Grok 5s | SH08_R01 | PASS, note: slight camera drift right |
| SH09 | SH09_R01 (was unmapped frame 8; user call) | Grok 3s | SH09_R01 | PASS |
| SH10A | SH10A_R02 (Apple logo → tiger) | Grok 2s | — | rendering |
| SH10B | SH10B_R02 (Apple logo → tiger) | post composite | — | TODO |
| SH11A | SH11A_R01 | post composite | — | TODO |
| SH11B | SH11B_R02 (nav garble removed) | post composite | — | TODO |
| SH12A | SH12A_R01 | post composite | — | TODO |
| SH12B | SH12B_R01 | post composite | — | TODO |
| SH12C | SH12C_R01 | Grok | — | open question (user note: "S10A is right before Vic spins the monitor around") |
| SH13 | SH13_R01 (standing; user call) | Grok 3s | SH13_R02 | PASS. R01 rejected: pencil/shaved side lost, face drift |
| SH14A+B | SH14A_R01 → SH14B_R01 | MiniMax 5s start/end | SH14_R01 | PASS (one card throughout) |
| SH15 | SH15_R01 | Grok 3s | SH15_R01 | PASS |
| SH16A | SH16A_R02 (plate smudge removed) | Grok 2s | SH16A_R01 | PASS |
| SH16B | SH16B_R02 (motion lines removed) | MiniMax 5s | — | rendering |

Unused: SH13_ALT_SEATED_R01_UNUSED (user picked standing).
