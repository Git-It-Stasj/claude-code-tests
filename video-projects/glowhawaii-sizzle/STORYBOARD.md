# Glow Hawaii — The Architect sizzle reel (30 s)

96 BPM (island tempo) · period 0.625 s · 48 beats = 30.000 s · 30 fps · `grid.json` is the single source of truth for music, build and QA.
Outputs: `out/glowhawaii-sizzle-16x9.mp4` (1920×1080) · `out/glowhawaii-sizzle-9x16.mp4` (1080×1920) · editable HTML/GSAP in `16x9/index.html`, `9x16/index.html`.

**Sources.** Every claim, finding, quote and recommendation is verbatim from `assets/Glowhawaii-Architect-Report.html`. Site imagery is real Playwright captures of https://glowhawaii.com taken 2026-10-30 (`assets/shots/`, unedited tiles of `desktop-full.png` 1440 px and `mobile-full.png` 390 px @2x). Olelo's reply is from the brief; Stasj confirmed it is approved for public use.

**Held-back colour / motif.** Motif = the report's mark (four concentric squares + two diagonals, Electric Blue → Navy, 0.8 opacity). It draws on at 0:00, opens into the browser window at beat 2, stamps across each chapter boundary (beats 10, 26, 38) and re-forms as the lockup at beat 45.

| # | Chapter (HUD label) | Beats → time | Brand-native object | Tool overlay | In-transform | Out-transform | Value | SFX |
|---|---|---|---|---|---|---|---|---|
| 01 | THE REAL SITE | 0–10 → 0.00–6.25 s | Real site in browser window (desktop) + phone (mobile) | Playwright readouts: `FULL PAGE 10309 PX`, viewport sizes | Motif draws; its square opens (clip-path) into the desktop window (b2–3) | Phone slides out, audit panel slides in; motif stamp (b9.5–10) | ink | draw whoosh, kick enters b2 |
| 02 | THE AUDIT | 10–26 → 6.25–16.25 s | Same screenshots + severity panel `CONVERSION KILLER AUDIT` | Cursor drags a selection box; HUD severity chips (HIGH/MEDIUM) | Window scrolls to each finding (1 beat) | Window fades → diagnosis ladder (b29); pre-drop dip b33.5–34 | ink / navy | blip per box, riser b29→33.5, silent half-beat gap |
| 03 | THE FIX | 26–38 → 16.25–23.75 s | Real screenshots + RECOMMENDED overlay cards | BEFORE / AFTER chip; gold wipe edge | Paper curtain slams in on the drop (b25.5–26) | Flurry hard cuts, ends on ink (b51) | **paper** | drop boom b34, wipe blips, tick per flurry cut |
| 04 | THE RESPONSE | 38–45 → 23.75–28.13 s | Gold-accent quote card | Typed-on text + block cursor | Gold rule draws, card opens from it (b51.7) | Card fades/rises (b59.2) | ink + gold | typing ticks |
| 05 | LOCKUP | 45–48 → 28.13–30.00 s | Motif → "the architect" (Josefin Sans 200) | — | Squares draw and settle (b60) | End hold | ink | hit + shimmer b60, tagline chime b62.5 |

## Beat sheet (beats; × 0.625 = seconds)
- **Ch1** 0 motif draws · 2 window opens · 2.5 phone opens · 3–10 slow scroll (headline "Come alive again." stays in view).
- **Ch2** 10 scroll to top · 11 box 1 *Headline names no pain and no audience* (High) · 13→14 scroll, box 2a *Expired UNBOUND-U summit still promoted* (High, 1 of 2) · 15→16 fast scroll, box 2b (2 of 2) · 17→18 *Hero buttons don’t lead to a booking* (Medium) · 20→21 *Testimonials don’t say who the client is* (Medium) · 23 diagnosis: "Where Your Market Is Right Now", Level 1–5, "Your market sits at Level 3", "Your homepage headline speaks at Level 2", "That gap is the opportunity." · 25.5–26 dip.
- **Ch3** 26 headline B/A (wipe b27) · 29 button B/A (wipe b30) · 32 summit B/A (wipe b33) · **flurry (hard cuts)** at 34 (1 beat), 35, 35.5, 36, 36.5, 37, 37.5 (½ beat each), ends b38: the seven Voice-of-the-Market quotes, longest → shortest.
- **Ch4** 38 rule · 38.7 card · 39.5–43.5 typing · 43.5 attribution "Glow Hawaii · The Aloha Chef" · 44.2 exit.
- **Ch5** 45 motif · 46 wordmark · 46.5 rule · 47 "Stay Vigilant. Stay Visionary." · 47.5 "Orchid Orchestration" (quiet) · hold to 30.0.

## Source map (on-screen text → report)
Findings and severities: *Conversion Killer Audit* cards 1, 2, 3, 5. Fix captions: kill-card "Fix" text ("Put their pain into the headline in their words", "Remove the October 16 card in both places") and the Messaging Gap Red Flag ("Make the hero’s main button “Book a free 30-minute call.”"). New headline: Rewritten Copy → Headline. Quotes + attributions: Voice of the Market (all seven, complete, unmodified). Ladder: Diagnosis section. Wordmark/tagline: report nav/footer and closing card.

## Rule compliance
- **No mockups.** Screens are unedited captures; every overlay is labelled `AFTER · RECOMMENDED` or `REMOVED`, i.e. an annotation, never presented as the live site.
- **Hard cuts only in the flurry** (verified: 7 cuts, all within 1 frame of grid).
- **Music.** Original synthesized bed (numpy, no samples, no third-party material) at exactly 96 BPM: I–V–vi–IV in C major, swung shaker, syncopated bass, ukulele-style arpeggio, `scripts/music.py`, `audio/architect-bed.m4a`.
