# VERIFY - Architect Daily, Oct 28 2026

Files: `architect-daily-2026-10-28-16x9.mp4` (1920x1080, 30fps, 37.0s), `architect-daily-2026-10-28-9x16.mp4` (1080x1920, 30fps, 37.0s). Silent: no music file supplied, no audio track.

Checks run
- `hyperframes lint`: 0 errors, 8 warnings (only "put scenes in sub-compositions"; intentional single-file build). `hyperframes check`: lint/runtime/layout/contrast OK (38/38 contrast samples passed).
- Rendered with `--quality looks`; ffprobe confirms size/fps/duration. Frames extracted with FFmpeg at 1, 3, 7, 13, 18, 25, 30.5, 32, 33.5, 36 s plus 9, 15, 20, 27, 29, 34.5 s (`frames-16x9/`, `frames-9x16/`, strips `strip-*.png`).
- No blank/white frames; navy background on every frame.
- Order seen in frames: intro (1, 3s) -> IBM (7, 9s) -> Anthropic (13, 15s) -> Microsoft (18, 20s) -> New to Me (25-29s) -> blinking cursor (30.5s) -> typed question (32, 33.5s) -> logo lockup (34.5, 36s).
- Source lines visible with captions below/above and no overlap: News 01 from 5.2s to ~9.7s, News 02 from 11.6s, News 03 from 17.0s (each well over 2s).
- Connectors: measured box top-center vs. last connector segment end, both layouts (`connector-check.txt`): identical (16x9 x=316/796,y=740; 9x16 x=300/780,y=950). Zoom crops: `zoom-connectors-*.png`.
- Airtable row fully filled by ~27.5s (jane@example.com, 13/30, Taxiing, Yes, gold check); SAMPLE DATA tag shown.

Notes / deviations
- Typing runs 31.25-32.25s (25 chars/s), then held with blinking cursor until 34.0s (about 1.75s of full line).
- Mark stroke is drawn with scaleX/scaleY edge bars (transform-only) instead of stroke-dashoffset. Number count-ups update text via onUpdate.
- Anthropic wordmark is plain text (no logo file supplied). Dot grid and its fade share are illustrative, labelled as such. Paper grey bars are placeholder lines.
- Vertical keeps content inside 72px side margins; lower ~25% is intentionally calm space.
