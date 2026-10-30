# Glow Hawaii — The Architect sizzle reel (30 s)

128 BPM · period 0.46875 s · 64 beats = 30.000 s · 30 fps · `grid.json` is the single source of truth for music, build and QA.
Outputs: `out/glowhawaii-sizzle-16x9.mp4` (1920×1080) · `out/glowhawaii-sizzle-9x16.mp4` (1080×1920) · editable HTML/GSAP in `16x9/index.html`, `9x16/index.html`.

**Sources.** Every claim, finding, quote and recommendation is verbatim from `assets/Glowhawaii-Architect-Report.html`. Site imagery is real Playwright captures of https://glowhawaii.com taken 2026-10-30 (`assets/shots/`, unedited tiles of `desktop-full.png` 1440 px and `mobile-full.png` 390 px @2x). Olelo's reply is from the brief; Stasj confirmed it is approved for public use.

**Held-back colour / motif.** Motif = the report's mark (four concentric squares + two diagonals, Electric Blue → Navy, 0.8 opacity). It draws on at 0:00, opens into the browser window at beat 2, stamps across each chapter boundary (beats 13, 34, 51) and re-forms as the lockup at beat 60.

| # | Chapter (HUD label) | Beats → time | Brand-native object | Tool overlay | In-transform | Out-transform | Value | SFX |
|---|---|---|---|---|---|---|---|---|
| 01 | THE REAL SITE | 0–13 → 0.00–6.09 s | Real site in browser window (desktop) + phone (mobile) | Playwright readouts: `FULL PAGE 10309 PX`, viewport sizes | Motif draws; its square opens (clip-path) into the desktop window (b2–3) | Phone slides out, audit panel slides in; motif stamp (b12.5–13) | ink | draw whoosh, kick enters b2 |
| 02 | THE AUDIT | 13–34 → 6.09–15.94 s | Same screenshots + severity panel `CONVERSION KILLER AUDIT` | Cursor drags a selection box; HUD severity chips (HIGH/MEDIUM) | Window scrolls to each finding (1 beat) | Window fades → diagnosis ladder (b29); pre-drop dip b33.5–34 | ink / navy | blip per box, riser b29→33.5, silent half-beat gap |
| 03 | THE FIX | 34–51 → 15.94–23.91 s | Real screenshots + RECOMMENDED overlay cards | BEFORE / AFTER chip; gold wipe edge | Paper curtain slams in on the drop (b33.5–34) | Flurry hard cuts, ends on ink (b51) | **paper** | drop boom b34, wipe blips, tick per flurry cut |
| 04 | THE RESPONSE | 51–60 → 23.91–28.13 s | Gold-accent quote card | Typed-on text + block cursor | Gold rule draws, card opens from it (b51.7) | Card fades/rises (b59.2) | ink + gold | typing ticks |
| 05 | LOCKUP | 60–64 → 28.13–30.00 s | Motif → "the architect" (Josefin Sans 200) | — | Squares draw and settle (b60) | End hold | ink | hit + shimmer b60, tagline chime b62.5 |

## Beat sheet (beats; × 0.46875 = seconds)
- **Ch1** 0 motif draws · 2 window opens · 2.5 phone opens · 3–13 slow scroll (desktop 0→140 px, phone 0→110 px; headline "Come alive again." stays in view).
- **Ch2** 13 scroll to top · 14 box 1 *Headline names no pain and no audience* (High) · 17→18 scroll, box 2a *Expired UNBOUND-U summit still promoted* (High, 1 of 2) · 19→20 fast scroll, box 2b (2 of 2) · 21→22 *Hero buttons don’t lead to a booking* (Medium) · 25→26 *Testimonials don’t say who the client is* (Medium) · 29 diagnosis chapter: "Where Your Market Is Right Now", Level 1–5, "Your site today" on Level 2, "Your market is here" on Level 3, "Your market sits at Level 3", "Your homepage headline speaks at Level 2", "That gap is the opportunity." · 33.5–34 dip.
- **Ch3** 34 headline B/A (wipe b35) · 38 button B/A (wipe b39) · 42 summit B/A (wipe b43) · **flurry (hard cuts)** at 45, 46, 47, 48 (1 beat each) then 49, 49.5 (½ beat) then 50 (1 beat), ending b51: the seven Voice-of-the-Market quotes, longest → shortest.
- **Ch4** 51 rule · 51.7 card · 52.5–58 typing · 58 attribution "Glow Hawaii · The Aloha Chef" · 59.2 exit.
- **Ch5** 60 motif · 61.5 wordmark · 62 rule · 62.5 "Stay Vigilant. Stay Visionary." · 63 "Orchid Orchestration" (quiet) · hold to 30.0.

## Source map (on-screen text → report)
Findings and severities: *Conversion Killer Audit* cards 1, 2, 3, 5. Fix captions: kill-card "Fix" text ("Put their pain into the headline in their words", "Remove the October 16 card in both places") and the Messaging Gap Red Flag ("Make the hero’s main button “Book a free 30-minute call.”"). New headline: Rewritten Copy → Headline. Quotes + attributions: Voice of the Market (all seven, complete, unmodified). Ladder: Diagnosis section. Wordmark/tagline: report nav/footer and closing card.

## Rule compliance
- **No mockups.** Screens are unedited captures; every overlay is labelled `AFTER · RECOMMENDED` or `REMOVED`, i.e. an annotation, never presented as the live site.
- **Hard cuts only in the flurry** (verified: 7 cuts + the ink hand-off at b51, all within 1 frame of grid).
- **Music.** Original synthesized bed (numpy, no samples, no third-party material) at exactly 128 BPM, `scripts/music.py`, `audio/architect-bed.m4a`.
