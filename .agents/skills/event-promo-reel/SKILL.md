---
name: event-promo-reel
description: Make a fast-paced, on-brand 30-second motion-graphics promo reel for an upcoming event (summit, workshop, conference, launch party, webinar, retreat) from its event page (Luma, Eventbrite, Meetup, a landing page). Cuts kinetic type and AI b-roll (Higgsfield) to an ElevenLabs music bed and sci-fi sound design on a measured beat grid, built and rendered with HyperFrames; delivers a 9:16 Reel/TikTok/Shorts MP4 and a 4:5 LinkedIn cut, ending on an urgency + scarcity CTA. Plans and quotes credits before spending anything. Use this whenever someone wants a promo video, hype reel, sizzle, teaser, countdown or "make a reel for my event / this Luma link", even if they don't name Higgsfield, ElevenLabs or HyperFrames, and also to revise, re-sound or re-cut a reel made this way.
---

# Event promo reel

A 30 s vertical reel that sells one event: hook → promises → what happens there → the signature experience → the host → the payoff → **urgency + scarcity CTA**. The reference build is the AI Business Summit reel (`references/example-storyboard-aili.md`); the template that reproduces it is `assets/template/index-9x16.html`. The person who commissioned that reel loved it, so reuse its structure, sound palette and pacing, and change content, brand and footage per event.

## Tools this uses
- **Firecrawl** `firecrawl_scrape` (formats `markdown` + `branding`) for the event page.
- **Higgsfield** `generate_video` / `generate_video_batch` / `jobs_wait` for b-roll.
- **ElevenLabs** creative flow tools for music and any new SFX (bundled SFX in `assets/sfx/` are pre-approved).
- **HyperFrames CLI** pinned `npx hyperframes@0.8.222` (check, snapshot, render) — local HTML/GSAP, not the HeyGen cloud tools.
- `ffmpeg`, Python with `librosa` and `Pillow`.

## Workflow

### 1. Research (free)
Scrape the event page. Pull every fact you'll put on screen from it, word for word: title, date, time, city, host and credentials, the agenda hooks, what attendees leave with, prices/levels. Download the cover art, the organiser's logo and the host's photo (Luma: event cover in `uploads/…`, host avatar on `/user/<handle>`; request full size with `width=1200`).

**Brand comes from the organiser, not the platform.** The page's accent colour is often the platform's UI (Luma reported magenta; the organiser's brand was navy + gold). Read the logo and the cover art for the palette.

If the requester points to a previous reel, read its project folder (`STORYBOARD.md`, `index.html`) — a video too large to upload doesn't stop you.

### 2. Plan and get approval before spending credits
Credits are the requester's money, and they said so: present a plan and wait for a yes. Include:
- **Storyboard**: eight 8-beat phrases at 128 BPM (30.0 s) — see the shape below — with on-screen copy and which phrases get AI footage.
- **Credit quote**: preflight each footage model with `get_cost: true`. Reference prices (Nov 2026): Kling 3.0 Pro, 9:16, 5 s, `sound: "off"` = **7.5 credits**; Kling 3.0 std silent 6.25; Seedance 2.5 = 35 (too expensive for b-roll). Four clips ≈ 30 credits. Music: 2 takes ≈ 1,800 ElevenLabs credits; new SFX ≈ 10/second.
- **Questions only the requester can answer**: whose brand (event organiser vs. the requester's own); formats (default 9:16, offer 4:5 for LinkedIn); permission for the host photo (and whether they have a better one — the requester supplied an award photo that became the best shot); the scarcity number ("only N seats left" — never invent it).

### 3. Generate (in parallel)
- **Higgsfield**: `get_preferences` once, then one `generate_video_batch` of ~4 clips: Kling 3.0 Pro, 9:16, 5 s, `sound: "off"` (ElevenLabs carries all audio). Prompt the scene, camera move and palette, and end with "no readable text, no logos". Poll `jobs_wait`.
- **ElevenLabs music**: create a flow, `creative_add_flow_node` (type `music`, `eleven_music_v2_5`, `duration_seconds: 30`, `instrumental: true`) and `creative_run_flow_nodes` with `generations_count: 2`. Prompt in `references/sound-palette.md`.
- **SFX**: reuse `assets/sfx/` (approved). Generate new ones only if the tone must differ, then follow the sample process in `references/sound-palette.md`.

### 4. Measure the music and fit the edit to it
`python3 scripts/beatgrid.py audio/src/music-*.mp3 --out grid.json`. Choose the take that **doesn't fade before the end** and has a clear lift. The model never puts the drop where the prompt asks (asked 20 s, got 15.0 s) — move the storyboard so the signature section lands on the measured lift and the CTA button lands on the final hit.

### 5. Prepare media
- `scripts/prep_footage.sh <src> <out> 3.75 [speed] [clean_head_s]` per clip; **look at the `.strip.png`** for garbled pseudo-text (a roadmap clip sprouted fake labels after 1.6 s; keep the clean head, slowed).
- Stills with PIL: blurred/darkened background plate behind the host photo; a crop of the cover art's graphic (below its lettering) as a texture plate; recolour the logo for a dark background if it's dark-on-transparent.
- Real people: photo only, animated with graphics. Never AI-animate them.

### 6. Build from the template
Copy `assets/template/index-9x16.html` to `<project>/index.html`, `assets/fonts`, `assets/vendor`, `assets/grain.png` into `<project>/assets/`. Then: set `B`/`T0` from `grid.json`, update each scene's `data-start`, swap copy, brand tokens (`:root`), footage, host and CTA. Write `cues.json` and run `python3 scripts/mix.py cues.json` (music + SFX on the grid, normalised to −14 LUFS). Read `references/craft.md` first — it lists the rules and the bugs that each cost a re-render.

### 7. QA, render, deliver
Follow §8 of `references/craft.md`: `check`, `snapshot` per section and look at it, render, verify duration/fps/loudness, 1 fps contact sheet. Write `STORYBOARD.md` (beat table, sources, generation log with job IDs and credits). Send the MP4 with the file tool. In a git repo: `.gitignore` for `footage/src/`, `out/work-*/`, snapshot PNGs; commit and push.

### 8. Revisions
- Sound notes ("sounds like gunshots", "jarring"): generate 2–4 *different directions*, build in-context clips with `scripts/sound_samples.sh`, send them, wait for a pick. Volume notes: "10% quieter" ≈ −0.9 dB.
- 4:5 LinkedIn cut: `references/craft.md` §7 and `assets/template/index-4x5.html`.

## Shape of the reel (128 BPM, beat n = t0 + n·0.46875 s)
| Beats | Section | What works |
|---|---|---|
| 0–8 | Hook | A question on screen at frame 0 ("WHAT IF"), the key word slams on beat 2 over a pain-point clip with a slow push-in |
| 8–16 | Promises | 3 outcome lines from the page, a slam + data swoosh each (beats 8, 10, 13) over an aspirational clip |
| 16–24 | Structure | The agenda as a counted system (tiles popping one per beat with ticks) on the brand plate |
| 24–32 | Tease | Short lines on beats, then a big word (e.g. "AND") with the **starship red alert** ringing into… |
| 32–40 | Signature experience | …the reveal on the measured lift: clip + live-feeling UI (badge, clock, leaderboard) |
| 40–48 | Host | Photo push-in, gold flare, **the strongest credential as a badge** (e.g. "Mindvalley Trainer of the Year"), other credentials one per half-beat |
| 48–56 | Payoff | What attendees leave with, over a hopeful clip |
| 56–64 | CTA | Logo → "THIS SATURDAY" + date/time/city → counter **499 → N** (power3.out, ticks each quarter beat) locks on "ONLY N SEATS LEFT" → REGISTER NOW button + URL by ~27.7 s, punched on the final hit, pulsing gold frame |

## Copy rules
- Every claim is from the event page or the requester. The scarcity number comes only from the requester.
- Urgency that doesn't go stale: "THIS SATURDAY" beats "4 DAYS LEFT" (a day count is wrong the day after you post it; offer per-day variants if they want one).
- Placeholder elements that aren't real data (leaderboard teams, incident clock) stay generic ("TEAM 1") and are mentioned to the requester.
