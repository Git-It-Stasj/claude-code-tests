# Noelle Russell – Ignite 2026 reel v5 (graphics rebuild + AEO)

1080x1920, 30 fps, 37.0 s, H.264/AAC. Music only (same ElevenLabs track, 128 BPM), no voiceover, no captions burned in.

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

## Still to confirm before posting
1. Time and panel: 10:00AM + Intuit, or 12:45PM + Credit Karma. Post only the matching file.
2. "[ ADD HANDLE / SITE HERE ]" on the close, plus the `REPLACE_WITH_…` URLs in the JSON-LD.
3. Photo permission and credit, permission to name KPMG and Microsoft, and the ElevenLabs music licence.
4. A 16:9 version has not been made.
5. Frame 0 shows the HUD entity line, the chart axis and the background, but the hook text builds in from 0.2 s, per your tweak. Set a thumbnail as the cover.
