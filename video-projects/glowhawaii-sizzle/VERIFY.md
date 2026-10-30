# VERIFY — evidence for the Glow Hawaii sizzle reel

| Check | Result | Evidence |
|---|---|---|
| Output formats | 1920×1080 and 1080×1920, H.264 + AAC, 30 fps, 30.000 s | `ffprobe` on `out/*.mp4` |
| HyperFrames lint (`check`) | 0 errors · 7–8 warnings (scene-structure advice "move scenes into sub-compositions", duplicate screenshot tiles) | `16x9`, `9x16` `npx hyperframes@0.8.222 check` |
| Contact sheet per chapter | 10 sheets (5 chapters × 2 ratios) reviewed | `qa/sheets/` |
| Cuts vs 128 BPM grid | Flurry cuts at beats 45, 46, 47, 48, 49, 49.5, 50 all within **0.94 frame**; window open b2 and the b34 drop within 0.88 frame | `qa/cuts-16x9.txt`, `qa/cuts-9x16.txt` |
| Verbatim text | 43 (16:9) / 46 (9:16) report-sourced strings, **0 mismatches**; typed reply equals the supplied text exactly | `scripts/qa-text.cjs` → `qa/qa-text.json` |
| Text size / overflow | Timeline sampled every 0.1 s: smallest text **24 px** (HUD); **0** frames with text under 24 px, 0 overflow, 0 text outside the frame, in both ratios. Text inside the site screenshots is the real site and is excluded. | `qa/qa-text.json` |
| Audio | −14.0 LUFS, sample peak −0.3 dBFS | `ffmpeg ebur128` |
| Vertical safe zone | All text inside y 168–1330; below 1330 only texture | by construction + sampled bounds |

## Notes the checks cannot hide
- The 9:16 detector lists two "cuts" at 10.17 s and 12.03 s (offset 2.4–2.7 frames). They are the mid-points of the 1-beat scroll jumps through ~9,000 px of the mobile page (beats 21–22, 25–26), not edits.
- The 9:16 reel does not start on a cut, so a thumbnail from frame 0 shows the motif; pick a poster frame from ch. 2 for LinkedIn if wanted.
