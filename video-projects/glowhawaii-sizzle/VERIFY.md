# VERIFY — evidence for the Glow Hawaii sizzle reel

| Check | Result | Evidence |
|---|---|---|
| Output formats | 1920×1080 and 1080×1920, H.264 + AAC, 30 fps, 68.77 s | `ffprobe` on `out/*.mp4` |
| HyperFrames lint (`check`) | 0 errors · 7–8 warnings (scene-structure advice "move scenes into sub-compositions", duplicate screenshot tiles) | `16x9`, `9x16` `npx hyperframes@0.8.222 check` |
| Contact sheet per chapter | 12 sheets (5 chapters, fix chapter split in two, × 2 ratios) in `qa/sheets/` | `qa/sheets/` |
| Cuts vs 96 BPM grid | Quote-card cuts at beats 60, 65, 70, 75, 80, 85, 90 and the window open (b2) / drop (b36) all within **0.75 frame** of the grid | `qa/cuts-16x9.txt`, `qa/cuts-9x16.txt` |
| Dwell times (per the review notes) | Five levels fully settled **2.3 s** before the Level 2 line; Level 2 line alone **1.9 s**; Level 3 line **2.2 s**; every BEFORE and every AFTER state **2.2 s**; every quote card **3.1 s** | `grid.json` (beats × 0.625 s) |
| Verbatim text | 43 (16:9) / 46 (9:16) report-sourced strings, **0 mismatches**; typed reply equals the supplied text exactly | `scripts/qa-text.cjs` → `qa/qa-text.json` |
| Text size / overflow | Timeline sampled every 0.1 s over the full 68.75 s: smallest text **24 px** (HUD); **0** frames with text under 24 px, 0 overflow, 0 text outside the frame, in both ratios. Text inside the site screenshots is the real site and is excluded. | `qa/qa-text.json` |
| Audio | −14.1 LUFS, sample peak −0.4 dBFS | `ffmpeg ebur128` |
| Vertical safe zone | All text inside y 168–1330; below 1330 only texture | by construction + sampled bounds |

## Notes the checks cannot hide
- The 9:16 detector lists a few extra "cuts" at about 11–13 s (up to ~4 frames off the grid). They are the peaks of the 1-beat scroll jumps through ~9,000 px of the mobile page (beats 17–18, 20–21), not edits.
- The 9:16 reel does not start on a cut, so a thumbnail from frame 0 shows the motif; pick a poster frame from ch. 2 for LinkedIn if wanted.
