# Glow Hawaii — The Architect sizzle reel (30 s)

96 BPM (island tempo) · period 0.625 s · 138 beats = 86.25 s · 30 fps · `grid.json` is the single source of truth for music, build and QA.
Outputs: `out/glowhawaii-sizzle-16x9.mp4` (1920×1080) · `out/glowhawaii-sizzle-9x16.mp4` (1080×1920) · editable HTML/GSAP in `16x9/index.html`, `9x16/index.html`.

**Sources.** Every claim, finding, quote and recommendation is verbatim from `assets/Glowhawaii-Architect-Report.html`. Site imagery is real Playwright captures of https://glowhawaii.com taken 2026-10-30 (`assets/shots/`, unedited tiles of `desktop-full.png` 1440 px and `mobile-full.png` 390 px @2x). Olelo's testimonial text is from the brief (`testimonial.json`); Stasj confirmed it is approved for public use. Her photo is the hero portrait from glowhawaii.com (`assets/olelo-portrait.jpg`, original 1024×1535 file).

**Held-back colour / motif.** Motif = four concentric squares with a small X in the innermost square (geometry from the supplied reference image): Electric Blue → Navy on the opening and chapter stamps, gold gradient (upper-left → lower-right, fading to dark) on the closing lockup. It draws on at 0:00, opens into the browser window at beat 2, stamps across each chapter boundary (beats 10, 36, 95) and re-forms as the lockup at beat 45.

| # | Chapter (HUD label) | Beats → time | Brand-native object | Tool overlay | In-transform | Out-transform | Value | SFX |
|---|---|---|---|---|---|---|---|---|
| 01 | THE REAL SITE | 0–10 → 0.00–6.25 s | Real site in browser window (desktop) + phone (mobile) | Playwright readouts: `FULL PAGE 10309 PX`, viewport sizes | Motif draws; its square opens (clip-path) into the desktop window (b2–3) | Phone slides out, audit panel slides in; motif stamp (b9.5–10) | ink | draw whoosh, kick enters b2 |
| 02 | THE AUDIT | 10–36 → 6.25–22.50 s | Same screenshots + severity panel `CONVERSION KILLER AUDIT` | Cursor drags a selection box; HUD severity chips (HIGH/MEDIUM) | Window scrolls to each finding (1 beat) | Window fades → diagnosis ladder (b29); pre-drop dip b33.5–34 | ink / navy | blip per box, riser b29→33.5, silent half-beat gap |
| 03 | THE FIX | 36–95 → 22.50–59.38 s (before/after 36–60, quote cards 60–95) | Real screenshots + RECOMMENDED overlay cards | BEFORE / AFTER chip; gold wipe edge | Paper curtain slams in on the drop (b35.5–36) | Flurry hard cuts, ends on ink (b51) | **paper** | drop boom b34, wipe blips, tick per flurry cut |
| 04 | THE RESPONSE | 95–131 → 59.38–81.88 s | Gold-accent quote card | Typed-on text + block cursor | Gold rule draws, card opens from it (b51.7) | Card fades/rises (b59.2) | ink + gold | typing ticks |
| 05 | LOCKUP | 131–138 → 81.88–86.25 s | Motif → "the architect" (Josefin Sans 200) | — | Squares draw and settle (b60) | End hold | ink | hit + shimmer b60, tagline chime b62.5 |

## Beat sheet (beats; × 0.625 = seconds)
- **Ch1** 0 motif draws · 2 window opens · 2.5 phone opens · 3–10 slow scroll (headline "Come alive again." stays in view).
- **Ch2** 10 scroll to top · 11 box 1 *Headline names no pain and no audience* (High) · 13→14 scroll, box 2a *Expired UNBOUND-U summit still promoted* (High, 1 of 2) · 15→16 fast scroll, box 2b (2 of 2) · 17→18 *Hero buttons don’t lead to a booking* (Medium) · 20→21 *Testimonials don’t say who the client is* (Medium).
- **Diagnosis** 23 "Where Your Market Is Right Now" · 23.5–25.3 rungs Level 1→5 build · all five settled 2.3 s · **29** "Your homepage headline speaks at Level 2" (top line; 1.9 s alone, Level 2 pulses) · **32** "Your market sits at Level 3" (second line, below Level 2; Level 3 pulses) + 33.5 "That gap is the opportunity." · 35.5–36 dip.
- **Ch3 fix** (8 beats each = 5 s: BEFORE 2.2 s → 1-beat wipe → AFTER 2.2 s): headline 36 (wipe 39.5) · button 44 (wipe 47.5) · summit 52 (wipe 55.5).
- **Quote cards** (hard cuts, 5 beats = 3.1 s each, slow zoom-out kept, fixed title **"Audience Awareness"**) at 60, 65, 70, 75, 80, 85, 90 → 95: the seven Voice-of-the-Market quotes, longest → shortest.
- **Ch4 testimonial** 95 rule · 95.7 card opens (Olelo's photo from glowhawaii.com on the left, text right) · 96.5–114 typed on with block cursor (10.9 s) · 114–129.2 full text held (9.5 s) · 130.2 exit. Text in `testimonial.json`, verbatim from the brief.
- **Ch5** 131 motif (gold gradient, upper-left → lower-right) · 132 wordmark · 132.5 rule · 133.5 "Stay Vigilant. Stay Visionary." · 134.5 "Orchid Orchestration" (quiet) · hold to 86.25 s.

## Source map (on-screen text → report)
Findings and severities: *Conversion Killer Audit* cards 1, 2, 3, 5. Fix captions: kill-card "Fix" text ("Put their pain into the headline in their words", "Remove the October 16 card in both places") and the Messaging Gap Red Flag ("Make the hero’s main button “Book a free 30-minute call.”"). New headline: Rewritten Copy → Headline. Quotes + attributions: Voice of the Market (all seven, complete, unmodified). Ladder: Diagnosis section. Wordmark/tagline: report nav/footer and closing card.

## Rule compliance
- **No mockups.** Screens are unedited captures; every overlay is labelled `AFTER · RECOMMENDED` or `REMOVED`, i.e. an annotation, never presented as the live site.
- **Hard cuts only in the flurry** (verified: 7 cuts, all within 1 frame of grid).
- **Music.** Original synthesized bed (numpy, no samples, no third-party material) at exactly 96 BPM: I–V–vi–IV in C major, swung shaker, syncopated bass, ukulele-style arpeggio, one unchanging groove from the first bar to the lockup (no riser, drop, half-time or density change); only light UI blips on the audit boxes and soft typing ticks remain, `scripts/music.py`, `audio/architect-bed.m4a`.
