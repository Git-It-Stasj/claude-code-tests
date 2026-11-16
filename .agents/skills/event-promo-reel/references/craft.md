# Craft notes: building the reel in HyperFrames

Read this before editing `assets/template/index-9x16.html`. Every item below cost a re-render once.

## Contents
1. Template anatomy
2. Timing on the beat grid
3. Rules HyperFrames enforces (and how the template meets them)
4. Bugs we hit and their fixes
5. Layout and readability numbers
6. Footage rules
7. The 4:5 (LinkedIn) and other ratios
8. QA loop

## 1. Template anatomy
One `index.html`, one paused GSAP timeline registered as `window.__timelines["main"]`.
- `#bg` full-bleed navy gradient (root child).
- Footage: `<div class="vwrap" id="vwN">` (untimed) → `<video class="clip" muted playsinline data-start data-duration>`. GSAP scales the *wrapper* for push-ins.
- Scenes `#s1…#s8`: `class="clip scene full"` divs with `data-start/data-duration`, each holding that section's text/graphics.
- Persistent overlays at the end of root: HUD (event name left, date right, gold rule), `#flash`, `#vig`, `#grain`.
- One `<audio id="mix" src="assets/media/mix.m4a">` — the pre-mixed music + SFX from `scripts/mix.py`.
- Helpers in the script: `t(n)` = beat → seconds; `slam`, `rise`, `out`, `flash`, `wipe`.

The AILI copy, colours and section logic are all in the template; swap copy/brand/sections, keep the machinery.

## 2. Timing on the beat grid
`const B = <period>, T0 = <t0>, t = n => T0 + n*B` — values from `beatgrid.py`. Write scene `data-start` values in seconds (4 decimals) computed from the same formula. 30 s at 128 BPM = 64 beats = eight 8-beat phrases; the template's 8 sections map one per phrase. Put the section that deserves the biggest moment (the event's signature experience) on the **measured lift**, and the CTA's punch on the **final hit**.

## 3. Rules HyperFrames enforces
- Time the `<video>` **or** its wrapper, never both → untimed `.vwrap`, timed `<video>`.
- Don't tween `display/visibility` on a `.clip`; animate children or opacity.
- No CSS `transform` on something GSAP transforms → set start values inside `fromTo`.
- No `Date.now()`, unseeded random, timers. Counters use a **proxy tween with `onUpdate`** (seek-safe); `tl.call` can skip values when the renderer seeks.
- Footage grades/blur must not be CSS filters → pre-blur stills with PIL (e.g. the host-photo background plate). CSS `drop-shadow` on text is fine.
- Fonts via local `@font-face` in `assets/fonts/`; GSAP local in `assets/vendor/`.
- Intentional overlap/overflow (glitch layers): `data-layout-allow-overlap data-layout-allow-overflow`.

## 4. Bugs we hit
- **Washed-out first section**: `fromTo('#flash', {opacity:.45}…)` renders its *from* state immediately, laying a white veil over everything before the first flash. Every flash `fromTo` needs `immediateRender: false`. Same for any second `fromTo` on an element that already has one (`#cta`, `#seatnum`, rings).
- **Cover-art crop showing half a word**: when cropping the event's cover art for a background plate, crop below any lettering.
- **Number overlapping its label** in the CTA: give the big number its own row (font 230 px, top ~826) with label below, then the button.
- **Renderer temp dir committed**: add `out/work-*/` to `.gitignore` before the first render.
- **Brand colour from the wrong source**: a Luma/Eventbrite page's accent colour is the platform's UI, not the organiser's brand. Take brand from the organiser's logo and the event's own cover art.

## 5. Layout and readability (1080×1920)
- Words only inside y **168–1330** (top: status bar; bottom: captions/buttons on Reels/TikTok). Below 1330 = texture only (the cover-art wave plate works well).
- Smallest text **28 px** (lint floor). Hero lines 120–170 px Montserrat 900; one idea per line, ~5 words max.
- Every line on screen ≥ ~0.5 s + 0.3 s/word; the closing line ≥ 2 s before the end — so land REGISTER NOW + URL by ~27.7 s.
- Frame 0 is the thumbnail: the hook text must already be on screen (no fade-in from black).
- HUD labels need an opaque dark pill behind them (contrast lint over bright footage).

## 6. Footage rules
- AI video **will** draw garbled pseudo-text on screens/walls. Look at the strip `prep_footage.sh` writes; keep only the clean head and slow it (`use_first_seconds`), or reroll (one reroll ≈ 7.5 credits).
- Prompts end with "no readable text, no logos"; describe palette (navy, electric indigo, gold) and camera move.
- Never run a real person's photo through AI video (approval covers the photo, not an AI version). Animate it with graphics only: push-in, flare, badge.
- Generic AI "people" in b-roll are fine; don't make them look like anyone real.

## 7. 4:5 and other ratios
4:5 (1080×1350, LinkedIn/feed): `assets/template/index-4x5.html` shows the method — the whole 1920 layout sits in `#stage` shifted `top:-130px`, so the 168–1330 text band lands at 38–1200. Put it in its own folder (`4x5/index.html`, `assets` symlinked to `../assets`) because `snapshot` and `render` take a project dir. Then fix what the crop breaks (it was: host photo cropping the top of the head → scale photo to 1080 wide, move down, shift host text +60; CTA frame → resize to the 1350 frame). 1:1 works the same way with a larger offset; 16:9 needs a real recomposition, not an offset.

## 8. QA loop
1. `npx hyperframes@0.8.222 check --json` — fix errors and every line_unread / text_below_floor / contrast warning; scene-structure ("nested_structure_needs_subcomposition", "track too dense") warnings are advisory.
2. `npx hyperframes@0.8.222 snapshot <dir> -o qa/snap --at <one time per section after its animations settle> --no-end` and **look at the contact sheet**. Compare a frame's mean colour to the source clip if something looks washed out.
3. Render: `npx hyperframes@0.8.222 render <dir> -o out/<name>.mp4 -q delivery -f 30` (~2.5 min for 30 s).
4. Verify: `ffprobe` (size, fps, 30.0 s), `ffmpeg -af ebur128` (~−14/−15 LUFS, peak < −1 dBFS), 1 fps contact sheet of the final MP4.
