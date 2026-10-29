# Architect Daily, Oct 28 2026 - sizzle reel
- `build/build.cjs` generates `16x9/index.html` and `9x16/index.html` (scene windows live in its single constants block; edit, then `node build/build.cjs`).
- Preview: `cd 16x9 && npx hyperframes preview`  | Render: `npx hyperframes render --quality looks --fps 30 --output ../out/<name>.mp4`
- Fonts and GSAP are local in `assets/` (no network at render time).
