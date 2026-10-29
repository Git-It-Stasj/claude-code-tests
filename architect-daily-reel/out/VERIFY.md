# VERIFY - Architect Daily, Oct 28 2026

Files: `architect-daily-2026-10-28-16x9.mp4` (1920x1080, 30fps, 37.0s), `architect-daily-2026-10-28-9x16.mp4` (1080x1920, 30fps, 37.0s). Audio: original synthesized ambient bed (`build/make-music.py`, no samples/licensing; normalized to about -18 LUFS), AAC stereo.

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

Music (added)
- Bed runs the full 37 s with a 1.2 s fade-in and 1.8 s fade-out; plucks and a soft pulse build through the news scenes and pull back for the cursor/typing.
- Ducking: `data-automation` volume lane on `<audio id="music">` drops from 1.0 to 0.3 between 33.8 s and 34.5 s, under the logo lockup (constants in `build/build.cjs`, `MUSIC`).
- Measured mean level (16x9): 20 s -19.1 dB, 31 s -19.3 dB, 33 s -19.6 dB, 35 s -33.3 dB. Both MP4s carry an AAC track, 37.0 s.
- To use your own track, replace `build/audio/architect-daily-bed.m4a` (or change `MUSIC.file`) and rebuild.
