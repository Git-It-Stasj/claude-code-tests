# Noelle Russell – Ignite 2026 reel v5 (graphics rebuild + AEO)

1080x1920, 30 fps, 35.0 s (round 7), H.264/AAC. Music only (same ElevenLabs track, 128 BPM), no voiceover, no captions burned in.

## All v4 tweaks kept
1. The hook animates in. "EVERYONE / IS SPENDING / ON AI." rises in through masks and lands on beats 0, 1 and 2.
2. and 4. Same edgier type system: Barlow Condensed Black and ExtraBold Italic, JetBrains Mono labels, Space Grotesk body.
3. Credentials land one per beat (24 to 28). The scene holds 1.0 s after the last one.
5. One session block: "THE FRONTIER VALUE METHOD: FROM TOKEN SPEND TO BUSINESS VALUE".
6. The three method steps land on beats 41, 44 and 47.

## New graphics
- **HUD frame on every shot:** corner brackets, an entity line ("NOELLE RUSSELL // AI HOUSE BY KPMG // IGNITE 2026"), a beat-ticked progress rail and numbered chapter labels. The entity line hides during the photo scene so it never sits on her hair.
- **Hook:** an animated "AI spend vs measured value" chart. The amber spend curve draws in, the flat value line follows, and "THE GAP" lands on the question. It is illustrative only, with no numbers, so it makes no factual claim.
- **Ignite:** a November 2026 calendar strip where 17, 18, 19 and 20 light up on consecutive beats.
- **The AI House:** a house outline drawn as one stroke, with vertex nodes popping in, framing the title.
- **Speaker:** an iris opens from the house onto a violet stage, then an amber scan line wipes the photo on. Face brackets snap in, her name builds letter by letter, and numbered credential rows each grow a bar on the beat.
- **Session:** after the title block, a "TOKEN SPEND → BUSINESS VALUE" conversion diagram (outlined chip, arrow, glowing chip) lands on three beats.
- **Method:** numbered nodes are joined by an amber spine that draws itself to each new step.
- **Details:** an event ticket tilts up in 3D, with an amber header, perforation, fields that rise in on the beat, a decorative barcode and "// INVITATION ONLY".
- **Close:** her name builds letter by letter, then the tagline, the title line and the handle placeholder, held about 2.3 s.
- **Transitions:** amber light sweeps on the scene seams, a background push on every bar, and blur-out exits. The v4 white flashes are gone.
- **Backgrounds:** the same Higgsfield clips under a navy grade, a faint 90 px grid and a vignette. No new Higgsfield credits were spent.

## AEO (answer engine optimization)
See `POST-COPY-AEO.md`. In short:
- Embedded MP4 metadata.
- Descriptive file names.
- Chapters and an on-screen-text VTT, both sidecars (nothing is burned in).
- A plain-text transcript.
- schema.org VideoObject/Event/Person JSON-LD.
- Two cover thumbnails.
- Platform post copy written answer-first, an FAQ and alt text.

## Files (`out/v5/`)
| File | Use |
|---|---|
| `noelle-russell-ai-house-kpmg-microsoft-ignite-2026-9x16.mp4` | Fact-list version: 10:00AM, KPMG/GitHub/Intuit |
| `...-9x16-ALT-per-post.mp4` | LinkedIn-post version: 12:45PM, KPMG/GitHub/Credit Karma |
| `thumbnail-hook.jpg`, `thumbnail-speaker.jpg` | Cover images |
| `chapters*.vtt`, `on-screen-text*.vtt`, `on-screen-text-transcript*.txt` | Sidecars, per variant |
| `videoobject*.jsonld` | Structured data, per variant |
| `POST-COPY-AEO.md` | Titles, captions, descriptions, FAQ, alt text |

Source: `src5/build5.mjs` (`node build5.mjs a|b`) and `src5/aeo.mjs` (`node aeo.mjs a|b`).

## Round 2 fixes (Nov 17)
1. The AI House: the title block is now centred inside the house walls, clear of the roof lines.
2. Speaker: the focus brackets around Noelle are removed.
3. Details ticket: date, time, venue and "invitation only" now land on four consecutive beats (57–60) with a faster 0.3 s rise.
   - **Music fix:** the ElevenLabs track faded out from about 29.5 s. It now loops its last 16-beat section on the bar line, plays at full level to 36.2 s, then fades over 0.8 s. The original is kept in `qa/music-original.mp3`.
4. Close: the placeholder is replaced with the link bit.ly/4iUaePY. The link is also added to the post copy, transcript, VTT and JSON-LD.

## Round 3 fixes (Nov 17)
1. **The AI House:** "THE AI" is now centred on the house's side vertices (y 630). "// PRESENTED BY KPMG" moved under the tagline so no text touches the roof lines.
2. **Chart:** the spend curve now stays low under the label, then climbs steeply at the right end. "THE GAP", "AI SPEND" and "MEASURED VALUE" no longer touch any line (the value label moved below the axis).
3. **Close is now a call to action:** NOELLE RUSSELL / FOUNDER · AI LEADERSHIP INSTITUTE, then "// MICROSOFT IGNITE 2026 / GET YOUR FREE / DIGITAL PASS", an amber button "bit.ly/4iUaePY →" and "TAP THE LINK TO CLAIM YOURS". It lands by 34.3 s and holds about 2.7 s. The chapter is renamed "08 GET YOUR PASS".
4. **Photo:** replaced with the "I ❤ AI" shirt photo (`assets/noelle-photo-iheartai.jpg`).
5. **Music:** fades out over the final 1.5 s (35.5 to 37.0 s).

## Round 4 fixes (Nov 17)
1. **Speaker:** the scene holds 2 beats (0.94 s) after the last credential, then cuts at 14.09 s.
2. **Ending:** the video now ends on the details ticket, and the "Get your free digital pass" close is removed. The fields land on beats 57–60 (26.7–28.2 s), then the ticket holds to 31.0 s.
   - **Music:** cut on the bar at 28.16 s and faded over 0.6 s, with a final synthetic cymbal crash on that downbeat. The crash is an ElevenLabs sound effect (`assets/sfx-crash-raw.mp3`), slowed and given a reverb tail so it rings out by 31 s.
   - **Progress line:** rescaled so it fills over 31 s, with the tick count recalculated.
   - **Link:** bit.ly/4iUaePY is now only in the post copy, not in the video.
3. **Chart:** redrawn to your reference. The spend curve is a smooth convex rise to the top-right dot. "THE GAP →" sits under the curve, pointing at the dashed gap line. "AI SPEND" is above the curve and "MEASURED VALUE" is below the axis. No label touches a line.
4. **The AI House:** the cap line of "THE AI" now sits exactly on the side vertices (measured: cap top at y 630, which is the vertex centre).

## Round 5 fixes (Nov 17)
1. **Speaker hold:** the photo now stays a full 2.0 s after the last credential (13.16 s to 15.16 s). Every later scene moved 3 beats later so cuts and reveals stay on the beat. Total length is 32.4 s; the crash is on beat 63 (29.56 s) and the ticket holds to 32.4 s.
2. **Sponsor list:** the co-speaker sentence is replaced by "// IN CONVERSATION WITH" and a vertical stack of white logos. Each logo lands on its own beat (53, 54, 55).
   - **10:00AM version:** KPMG, GitHub, Intuit.
   - **12:45PM version:** KPMG, GitHub, Credit Karma.
   - **Logo sources:** Wikimedia Commons official SVGs, in `src5/assets/logos/`: `KPMG_blue_logo.svg`, `GitHub_logo_2013.svg` with `GitHub_Invertocat_Logo.svg`, `Credit_Karma_logo.svg`, `Intuit_logo_2022.svg`. They are shown as single-colour white, a standard dark-background sponsor treatment.
   - **Permission:** confirm logo use with each company before posting.

## Round 6 fixes (Nov 17)
1. **Speaker hold:** the last credential lands on beat 28 and holds for 3 beats. The Session cuts in on the next count of 4 (beat 32, 15.03 s).
2. **The Method:** the scene opens on beat 44. Each step lands on the 1 of a count of 4 (beats 48, 52, 56), and the sponsor logos land on consecutive beats (60, 61, 62). The ticket comes in on beat 64, its fields land on 65–68, and the payoff is on 68.
3. **Music rebuilt for a crescendo and payoff:**
   - The looped splice that repeated around 28 s is gone. The original track now plays untouched up to 28.16 s.
   - **Build (28.16–31.91 s):** the last two bars replay with a stepped high-pass sweep, one step per beat, with gain rising each beat. A synthesized riser plays on top: a rising tone, a brightening noise swell, and a snare roll that accelerates from 8ths to 32nds. The source is `src5/assets/sfx-riser.wav`.
   - **Payoff on beat 68 (31.91 s):** an ElevenLabs sub-boom impact (`sfx-impact.mp3`), the slowed synthetic crash, and one bar of the main groove ringing out with an echo tail. The fade ends at 34.75 s.
   - **Levels:** about -13 dB groove, a dip into the build, then a rise to -13.6 dB just before the hit. The payoff peaks at -9 dB and fades to silence.

## Round 7 fixes (Nov 17)
1. **New music.** The whole bed is replaced by a new ElevenLabs Music track (eleven_music_v2_5), composed for this cut. It is an instrumental, 128 BPM, premium-electronic keynote opener: full-energy groove, a fuller uplifting section, then a breakdown that builds into one big sustained final hit with a ringing chord.
   - **Removed:** the round-6 synthesized riser/snare roll (the ticking) and the looped splice. The sub-boom impact and synthetic crash are also no longer used.
   - **Vocal check:** an ElevenLabs Scribe transcription came back empty, so no vocals.
   - **Beat alignment:** the track's beats sit within 15 ms of the video grid through beat 54. After its breakdown (about 26–28 s) the music runs 0.226 s late, so every cue from beat 58 on is shifted by the same amount. The logos land at 28.38/28.85/29.32 s and the ticket fields at 30.73/31.19/31.66 s. The final hit and "invitation only" land on 32.13 s, matching the music's own beat at 32.135 s. The ring-out fades by 35.0 s.
   - **Takes:** four were generated. Two ended early and one drifted off the grid at 22 s. The raw pick is `qa/music-v6-elevenlabs-take3-raw.mp3`.
2. **Background freeze fixed.** The grid clip under The Session and The Method ran 15 s of screen time from an 8 s source at 0.65× speed. It ran out at 27.3 s and froze. It now plays at 0.52× (15.4 s of footage). The opening tunnel clip was also slowed from 0.85× to 0.8× for a safety margin.

## Still to confirm before posting
1. Time and panel: 10:00AM + Intuit, or 12:45PM + Credit Karma. Post only the matching file.
2. The `REPLACE_WITH_…` URLs in the JSON-LD (the handle is now the link bit.ly/4iUaePY).
3. Photo permission and credit, permission to name KPMG and Microsoft, and the ElevenLabs music licence.
4. A 16:9 version has not been made.
5. Frame 0 shows the HUD entity line, the chart axis and the background, but the hook text builds in from 0.2 s, per your tweak. Set a thumbnail as the cover.
