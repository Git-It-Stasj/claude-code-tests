---
name: architect-daily-reel
description: Make the Architect Daily sizzle reel (37 s, 16:9 + 9:16 MP4s with music) in the locked house format - same intro, three "News to you" scenes, one "New to me" build scene, same typed-question close and logo lockup. Use when the user gives (or asks to turn into) the day's three news items and a "new to me" build, e.g. "make today's Architect Daily reel", "sizzle reel for Oct 29", "build the reel from this newsletter".
---

# Architect Daily reel (locked format)

The format never changes; only the episode JSON does. One command renders both aspect ratios, lints, checks, extracts QA frames and writes VERIFY.md. Rendering is local (HyperFrames + FFmpeg). **Never use HeyGen cloud/MCP tools for this.**

## The locked format (do not improvise)

| Time | Scene | Fixed by template |
| --- | --- | --- |
| 0-4 s | Intro | Gold four-concentric-square mark draws itself, mono label `ARCHITECT DAILY / <date>`, caption "Vision, not just noise." |
| 4-10 s | NEWS TO YOU 01 | Tag, headline, one body line, visual module, caption, source line |
| 10-16 s | NEWS TO YOU 02 | same |
| 16-21 s | NEWS TO YOU 03 | same |
| 21-30 s | NEW TO ME (gold tag) | Node diagram with data pulses (form -> database -> two outputs), Airtable-style grid whose SAMPLE row fills field by field, gold check, final gold connection, two captions |
| 30-37 s | Close | 1 s gold block-cursor blink, types "How did you use AI today?" at 25 chars/s, hold with blinking cursor, then the same mark animation + lowercase "the architect" (Josefin Sans Light) + "Stay Vigilant. Stay Visionary." (blue) + `linkedin.com/in/nastasjaterry` |

Always on: HUD ("ARCHITECT DAILY" top-left, date top-right), segmented progress bar with gaps between scenes, navy `#070D1F` solid background on every scene layer, brand colors (card `#0D1530`, blue `#3D7FFF`, gold `#F0C040` payoff only, off-white `#E8EEFF`), fonts bundled locally (Space Grotesk Bold headlines, DM Sans body, JetBrains Mono labels), music bed ducked to 30% under the logo (33.8-34.5 s). Scene windows come from one constants block in `scripts/build.cjs`.

## Inputs to collect (ask only for what is missing)

1. **Date**: `date.slug` (YYYY-MM-DD) and `date.label` (e.g. `OCT 29, 2026`).
2. **Three news items**, each: `headline` (<=46 chars; `\n` forces a line break), `body` (ONE line, <=100), `caption` (<=56, an action or question, not a headline repeat), `sources` (`Sources: A, B, Oct 27-28`), and a **visual** chosen from:
   - `stats`: two count-up cards (`value`, `decimals`, `suffix`, `label` <=40) then a gold lock builds in. For numbers/percentages.
   - `document`: a paper card with a gold stamp (`brand`, `stamp`, `sectionA`, `sectionB`, `fact`). For filings, policies, reports. `brand` is plain uppercase text; if the user supplies a logo file path set `logo` to that path (resolved next to the episode JSON). **Never draw or approximate a logo.**
   - `dotgrid`: 60 dots, a share fade out (`fadeShare`) while a gold line rises (`label`, `lineLabel`). For headcount / workforce vs spend stories. Mark it illustrative.
   Any visual can go in any slot. Keep the tone neutral and factual; attribute claims ("per Reuters").
3. **New to me**: `headline` (<=36), four `nodes` (`form`, `air`, `o1`, `o2`, each `kicker` + `title`), `grid` (`title`, 5 `columns`, `row` of 4 text values; the 5th cell is the gold check), and two `captions`. The diagram shape (source -> database -> two outputs) is fixed; relabel it.
4. **Music**: the shipped original bed is used every time. If the user supplies a track, replace `scripts/audio/architect-daily-bed.m4a` (keep the filename) or ask whether to keep the house bed for consistency.

**Sample data only.** The grid row must use an `@example.com/.org/.net` address; the validator rejects anything else. Never put real visitor or client information on screen.

## Run

Copy `examples/episode.template.json` (or the approved `examples/2026-10-28.json`), fill it, then:

```bash
node .agents/skills/architect-daily-reel/scripts/make-reel.cjs path/to/episode.json --out architect-daily
# add --draft for a fast preview render
```

Outputs land in `architect-daily/<slug>/out/`: `architect-daily-<slug>-16x9.mp4`, `...-9x16.mp4`, `frames-*`, `strip-*.png`, `connector-check.txt`, `VERIFY.md`. A render takes about 1.5 minutes (both ratios in parallel).

Needs: Node 22+, FFmpeg, `playwright` (Chromium) resolvable from Node, network for `npx hyperframes@0.8.214` (pinned so every episode renders identically). If npx reports "Permission denied", the script repairs the cache and retries.

## QA before saying it's done (this part is yours, not the script's)

The script's automated checks (episode validation, lint 0 errors, connector lines end exactly at output-box top-center, no blank/white frames, size/duration/audio, music duck depth) must all pass. Then **look at the strips** (Read the PNGs) for both ratios and confirm:
- scene order intro -> News 01 -> 02 -> 03 -> New to Me -> cursor -> typed question -> logo;
- every source line visible, not touching its caption; text inside its boxes; no overlaps (long headlines or captions are the usual cause: shorten the copy, never shrink the type);
- the Airtable row fully filled with the gold check at 29 s; connectors touch the output boxes;
- at 30.5 s the cursor is on screen; at 36 s the lockup is complete.
If something is wrong, fix the copy or the episode JSON and re-run. Change `scripts/build.cjs` only when the user explicitly asks to change the format itself.

Tick "Strips reviewed" in `VERIFY.md`, then deliver both MP4s (SendUserFile) and say where the folder is. Commit/push only when asked.

## Files

- `scripts/build.cjs`: the locked template + episode validator + HTML/GSAP generator (one paused timeline per ratio; transforms and opacity only; no background-clip text).
- `scripts/make-reel.cjs`: the one-command pipeline. `scripts/verify-connectors.cjs`: connector geometry check. `scripts/make-music.py`: regenerates the synthesized music bed (numpy).
- `scripts/vendor/`: GSAP and the brand fonts (never rely on system fonts).
- `examples/`: `2026-10-28.json` (the approved reel, regenerates byte-identical pixels) and `episode.template.json`.
