---
name: sizzle-reel
description: House playbook for vertical event/speaker sizzle reels (HyperFrames + GSAP, Higgsfield backgrounds, ElevenLabs music). Use whenever the user asks for a sizzle reel, promo reel, speaker reel, event teaser or "a reel like the Noelle one". Captures the taste decisions from past projects so the first cut lands close to final. Read before writing any composition; load the matching client profile from references/clients/.
---

# Sizzle reel playbook

This file is the accumulated taste from real projects. Every rule here was a revision round once.
Follow it by default; deviate only when the brief says so, and say which rule you broke and why.

Reference build: `ignite-reel-noelle/src5/build5.mjs` (generator), `src5/aeo.mjs` (AEO sidecars).
Start new reels by copying that structure, not from a blank page.

## 0. Before building: settle the brief (stops rounds 2–7 from happening)

Fill `templates/brief.md` with the user before the first render. Ask everything in one message.
The questions that caused re-work last time, in order of cost:

1. **Music** — length must equal video length, and it must *end with a payoff* (see §4). Confirm: generated vs supplied, BPM (default 128), ending style (big final hit + ring-out).
2. **Ending** — what is the last frame? (Last time: CTA → removed → ends on the details ticket.) Is the link shown in the video or only in the post?
3. **Photo** — get the exact photo now. Ask "is there a signature shirt/logo/look?" (Noelle: the "I ❤ AI" shirt).
4. **Variants** — which facts differ per version (time, co-speakers)? Build one generator with a variant switch from day one.
5. **Partners/sponsors** — logos, not words. Get or fetch official SVGs up front (§6).
6. **Reference images** — if the user has a chart/layout in mind, get the image before drawing it.
7. **Length** — default 30–35 s vertical 1080×1920 @ 30 fps.

Look up the client profile in `references/clients/`. If none exists, create one at the end of the project.

## 1. Structure (the template that worked)

All cuts land on a beat; scenes open on the **1 of a four-count** (beat index divisible by 4).

| # | Scene | Beats (128 BPM) | Content |
|---|---|---|---|
| 1 | Hook | 0–10 | Provocative question in 2 lines + an illustrative chart (no numbers = no factual claim) |
| 2 | Event | 10–15 | Event name + date strip with dates lighting up on consecutive beats |
| 3 | Venue / host | 15–20 | Host brand framed by a drawn line motif (house outline etc.) |
| 4 | Speaker | 20–32 | Iris into photo, name builds letter-by-letter, credentials 1 per beat, **3-beat hold** after the last so the next scene starts on the next four-count |
| 5 | Session | 32–44 | Session title + a simple conversion diagram (A → B chips) |
| 6 | Method | 44–64 | Steps land on the 1 of each four-count (48/52/56); sponsor logos then land on consecutive beats (60/61/62) |
| 7 | Details | 64–end | Ticket: fields on consecutive beats, final hit on the last field, image held ~2–3 s while the music rings out. No exit animation on the last scene. |

Beat function: `B(n) = 0.03 + n * 60/BPM` (+ any measured offset from the music, §4).

## 2. Visual taste (defaults)

- **Palette:** deep navy base, one hot accent (amber/yellow), soft lavender secondary text, white headlines. One accent only. A violet radial stage for the speaker photo.
- **Type system (3 roles):** condensed black/extra-bold italic display (Barlow Condensed 900/800i) for headlines, monospace 700–800 (JetBrains Mono) for labels with `// PREFIX` style, grotesk (Space Grotesk 700) for body. Uppercase headlines, line-height ~0.92.
- **Minimum type 28 px** at 1080 wide. Anything smaller fails readability.
- **HUD frame** on every shot: corner brackets, entity line (`NAME // HOST // EVENT`), beat-ticked progress rail, numbered chapter labels. Hide HUD elements that would sit on the speaker's face/hair.
- **Graphics over stock:** draw diagrams as SVG strokes that animate on (charts, outlines, spines connecting steps). They read premium and cost no credits.
- **Backgrounds:** AI-generated loops (Higgsfield) under a navy grade at reduced opacity, faint 90 px grid, vignette. Check clip length ÷ playback rate ≥ screen time **plus margin**, or the background freezes (§7).
- **Transitions:** accent light sweeps on scene seams, background push every bar, blur-out exits. **No white flashes.**
- **No focus brackets/chevrons around faces.** The user removed them.
- **Logos:** official SVGs rendered single-colour white (`filter: brightness(0) invert(1)`), stacked vertically like a sponsor list under a `// IN CONVERSATION WITH` label, one per beat.

### Layout precision rules (each of these was a revision)
- **Text never touches lines.** Labels on charts sit in clear space; check every label against every stroke in a snapshot.
- **Text inside an outline shape is optically aligned to the shape's geometry**, e.g. the cap height of the first line sits on the side vertices of the house. Measure with pixels (PIL), don't eyeball.
- **Charts:** if the user gives a reference, match it exactly (curve shape, label positions, arrow direction). Default chart: smooth convex amber "spend" curve rising to a dot at top right, flat dashed "value" line, `THE GAP →` under the curve pointing at the gap, value label below the axis.

## 3. Motion taste

- Everything enters **on a beat**; lists enter **one item per beat**, faster rather than slower (≈0.3 s rise).
- Headlines rise in through masks; names build letter by letter.
- Holds are counted in **beats**, not seconds, and chosen so the next cut lands on a four-count.
- The final scene has no exit; the last frame is a clean, readable hold of 2–3 s.

## 4. Music (the biggest time sink — do it right first)

The user's ear is the judge. These failed before:
- Looping/splicing a section → "repeats oddly".
- Hard cut + cymbal crash → "abrupt".
- Synthesized riser / snare roll → "ticking, tacky".
- Track shorter than video, or fading early (~29 s on a 35 s cut) → "music ends before the video".

What worked: **one generated track composed for the exact length**, no edits except a short tail fade.
- ElevenLabs Music `eleven_music_v2_5`, instrumental, 128 BPM, request length = video length + 3 s.
- Prompt the arc explicitly: *"premium electronic keynote opener, 128 BPM, full-energy groove from the first second, uplifting fuller section at ~60%, short breakdown at ~75%, building into one big sustained final hit with a ringing chord at [hit time], ring-out to the end, instrumental, no vocals"*.
- Generate 3–4 takes; reject takes that fade early or drift off grid. Pick by beat analysis (`hyperframes beats --json`), then shift late cues by the measured offset rather than editing audio.
- Verify instrumental with a Scribe transcription (empty = no vocals).
- Check levels with ffmpeg `volumedetect` at groove, breakdown, pre-hit, hit, tail. Hit should be the loudest moment.
- Trim to length, fade the final ~1 s. Never stack SFX on top unless asked.
- Always tell the user: "I can only check audio by measurement; please listen to the last 8 s."

## 5. AEO (answer-engine optimisation) kit — ship with every reel

- Entity line on every frame (name, host, event spelled identically everywhere).
- Descriptive hyphenated file names: `person-host-event-year-9x16.mp4`.
- MP4 metadata (title, artist, description incl. link, keywords, date).
- Sidecars: chapters VTT, on-screen-text VTT, plain transcript, schema.org VideoObject/Person/Event JSON-LD.
- `POST-COPY-AEO.md`: answer-first summary, titles < 70 chars, LinkedIn/IG/YouTube copy, YouTube chapters, FAQ, alt text.
- Two cover thumbnails (hook frame and speaker frame).
- No burned-in captions and no voiceover unless asked.

## 6. Assets

- **Logos:** Wikimedia Commons SVGs via `upload.wikimedia.org/wikipedia/commons/<md5[0]>/<md5[0:2]>/<File>.svg`. The Commons API rate-limits (429): find file names with web search instead. Simple Icons lacks many corporate marks.
- **Photo:** keep a copy in `assets/` with a descriptive name; crop for 9:16 with the face in the upper-middle third.
- **Backgrounds:** reuse existing Higgsfield clips before spending credits.

## 7. QA gates before showing the user anything

1. `hyperframes check` clean (no overlap, readability, static-guard warnings).
2. Snapshots at every scene's settled frame: inspect text vs lines, text vs face, alignment to shapes.
3. Background motion check: frame-diff across every scene; no frozen stretches.
4. Beat check: every cue time vs music beat times (≤ 20 ms off).
5. Audio: full length, no early fade, levels as in §4.
6. Final frame check: right variant facts (time, logos).

## 8. Delivery and process

- Render with the Bash tool's background mode (not `nohup`); report progress every 300 frames, naming the variant.
- Encode H.264 CRF 22 + AAC with metadata; put finals in `out/<version>/`; **send the files immediately** with SendUserFile (the user always asks "where is the downloadable file?").
- Keep `NOTES-<version>.md` with a numbered section per round.
- Commit and push after each round.
- End each delivery with the open checklist: correct variant, logo/photo permissions, JSON-LD URLs, music licence.

## 9. After the project

Update this playbook: add every new correction from the user as a rule in the right section, and update or create the client profile. The goal is fewer rounds every time.
See `references/iteration-log.md` for how each rule was learned.
