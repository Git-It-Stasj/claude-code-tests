---
name: sizzle-reel
description: House playbook for vertical event/speaker sizzle reels (HyperFrames + GSAP, Higgsfield backgrounds, ElevenLabs music). Use whenever the user asks for a sizzle reel, promo reel, speaker reel, event teaser, highlight reel or "a reel like the Noelle one", and whenever they revise one. Captures taste from past projects so the first cut lands close to final, and requires a client profile to be loaded or created for every client and updated with every correction.
---

# Sizzle reel playbook

This file is the accumulated taste from real projects. Every rule here was a revision round once.
Follow it by default; deviate only when the brief says so, and say which rule you broke and why.

Reference build (bundled): `assets/starter/build-reference.mjs` (generator: beat grid, scenes, HUD, variants) and `assets/starter/aeo-reference.mjs` (AEO sidecars). It is the Noelle Russell reel; copy its structure and swap content and tokens. Don't start from a blank page.

## Client profile protocol (mandatory — do not skip)

Every reel has a client profile. This is how taste carries over between projects.

**Step A — at the start (before the brief):**
1. Look for a profile, in this order: `client-profiles/<client-slug>.md` in the user's project, then this skill's `references/clients/<client-slug>.md`.
2. Found: read it, apply it as the defaults, and tell the user "Using the saved profile for <name>". Only ask brief questions it doesn't answer.
3. Not found: say "No profile yet for <name>, I'll create one". Copy `templates/client-profile.md`, fill it from the brief and their materials (website, logo, photos), mark it `Status: DRAFT`, and save it as `client-profiles/<client-slug>.md` in the project before building.

**Step B — every revision round:** each time the user corrects something, add it to the profile's "Preferences learned" or "Never do" as a general rule (for example, "No text touches chart lines", not "move THE GAP 20 px"). If the correction applies to every client, add it to this playbook as well.

**Step C — at delivery:** mark the profile `CONFIRMED`, record the approved music prompt, and send the profile file to the user with the video. Then tell them where it was saved.

**Where profiles live (skills are read-only on claude.ai):**
- **Claude Code / a repo:** commit `client-profiles/<slug>.md` in the project, or copy it into `.claude/skills/sizzle-reel/references/clients/` to make it permanent for every project.
- **claude.ai:** an uploaded skill can't edit itself. Give the user the profile file and say: "Add this file to `references/clients/` in your skill and re-upload, or add it to this Project's knowledge." If a playbook rule changed, also give them the updated `SKILL.md`.

Never finish a reel project without Step C.

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
8. **Formats** — which platforms? 9:16 (Reels/Shorts/Stories), 4:5 1080×1350 (LinkedIn/Instagram feed), 16:9. Build a format switch into the generator from day one (`P(a916, b45)` position helper); never crop a 9:16 into 4:5, re-lay out each scene and re-run the snapshot QA.

Anything already in the client profile doesn't need asking again (see the protocol above).

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

Run Step C of the client profile protocol. Add every correction that applies to all clients as a rule in the right section here, and add a row for it to `references/iteration-log.md`. The goal is fewer rounds every time.
See `references/iteration-log.md` for how each rule was learned.
