# Noelle Russell – Ignite 2026 sizzle reel: notes

## READ FIRST: your brief and Noelle's post disagree
| | Fact list (brief) | Noelle's LinkedIn post (screenshot) |
|---|---|---|
| Time | Wed Nov 18, 10:00–10:45am | "S04 · Wednesday, November 18 · 12:45 to 1:45 PM" |
| Panel | KPMG, GitHub, Intuit | "leaders from GitHub and Credit Karma" |

I could not tell which is current. Two MP4s were rendered, identical except for those two on-screen strings:
- `noelle-ignite-reel-9x16.mp4`: follows your fact list (10:00am, KPMG/GitHub/Intuit). It is the primary because you said to use nothing else.
- `noelle-ignite-reel-9x16-ALT-per-post.mp4`: follows her post (12:45pm, KPMG/GitHub/Credit Karma).
Post only the version that matches the confirmed schedule. Intuit owns Credit Karma, so the panelist line may simply be two names for one company, but confirm with Noelle or the AI House. The voiceover avoids the conflict ("leaders from KPMG and GitHub", no time spoken). The ALT SRT is `captions-ALT-per-post.srt` (identical text; the spoken captions do not change).

## Assumptions
- Assets folder was empty; the two screenshots are kept in `assets/` as reference only. Reel is built purely from type, motion graphics and abstract backgrounds. Her photo and the KPMG/Microsoft logos in the speaker card were NOT used (no logo recreation, and the card is a KPMG/Microsoft graphic).
- "Pacific time" note is kept as you asked; the facts list says "San Francisco time".
- Credentials appear in the order Noelle is introduced in the voiceover (founder, 5x MVP, #1), then 3.4M+ and TEDx/author, rather than the brief's order, to stay in sync with narration.
- Beats 1–3 appear one by one; "Invitation only" is added to the details card (it is in the facts list) so the reel doesn't invite the general public.
- Voice: ElevenLabs "Emma" (female American, confident). One take was generated, credits spent: ~469.
- Caption timing: sentence boundaries came from silence detection on the voiceover; word timing inside each sentence is proportional by character count (no whisper installed). Re-check the SRT against audio if you edit anything.
- Music: none. Slot left empty. Add a track in `src/index.html` (an `<audio id="music" ...>` at low volume, ~ -18 dB under the VO) and re-render.
- Not done: the 1920x1080 version (layout is vertical-specific; needs a recompose).

## Placeholders
- Closing card shows a dashed box "[ ADD HANDLE / SITE HERE ]" at ~34.6–37.0s. Replace the text in `src/build.mjs` (search `ADD HANDLE`) and re-render. DO NOT post with the placeholder.

## Fonts and colors
- Font: Inter (900 display, 700 body, 400 secondary), bundled with HyperFrames.
- Colors: navy #0A0E2E → #1B1160 → violet #4A22A0 gradient; accent amber #FFC53D; text white #FFFFFF; secondary #C9CCF0. Caption plates rgba(6,8,30,.62).
- Specs: 1080x1920, 30fps, 37.0s, H.264 + AAC, CRF "delivery" quality.

## Safe zones
Key text stays above y=1350 and below y=290 (captions around y=1190–1370). Your rules (top 150px, bottom 250px) are met. HyperFrames' stricter built-in TikTok/Reels/Shorts check still warns on right edge (> x≈890) and caption band; I judged these overly conservative and left them.

## Confirm before posting
1. Permission to name KPMG, Microsoft and Modev. (Modev is not named on screen; it is only in the facts list. KPMG and Microsoft are named in text only, no logos.)
2. Session time and panel (see table above) and that "Pacific time" is correct.
3. Her handle / site / call to action, then replace the placeholder.
4. Whether the voiceover voice is acceptable (it's a stock voice, not Noelle).
5. Add licensed music if wanted.
6. "Invitation only" wording and the title "Founder, AI Leadership Institute" (her LinkedIn headline says something different, "MindValley Trainer of the Year | CEO of 1s…"; I used the facts-list billing).

## Files
- `src/build.mjs` generates `src/index.html`, `out/captions.srt`. Run `node build.mjs a` or `b`, then render with the HyperFrames CLI.
- Note: `npx skills add heygen-com/hyperframes` also created `.agents/`, `.claude/skills/` and `skills-lock.json` at the repo root; they are not part of the deliverable.
