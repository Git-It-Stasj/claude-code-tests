# AI Business Summit — 30 s vertical reel

**Output:** `out/aili-summit-reel-9x16.mp4` · 1080×1920 · 30 fps · 30.0 s · H.264 + AAC
**Source:** `index.html` (HyperFrames + GSAP, editable in the HyperFrames desktop app / Studio)
**Event:** AI Business Summit: Build & Scale An AI-Powered Business · AI Leadership Institute · host Noelle Russell · Sat Nov 14, 10 AM–5 PM · Fort Lauderdale, FL · https://luma.com/aibusinesssummit

## Grid
Music is the clock. ElevenLabs take A measured at **127.997 BPM**, first beat at 0.0202 s (max beat-fit error 12 ms).
Beat *n* = `0.0202 + n × 0.46875 s`. Eight 8-beat phrases = 30.0 s. The track's real lift is at **beat 32 (15.02 s)** and its final hit at **beat 62 (29.08 s)**; the edit is built around those, not around the prompt.

| Beats | Time | Section | Picture | On screen (all copy from the Luma page or the brief) |
|---|---|---|---|---|
| 0–8 | 0.00–3.77 | Hook | Higgsfield clip 1 (founder under a storm of inbox cards), push-in | WHAT IF (frame 0) → **AI** slams b2 → COULD… b5 |
| 8–16 | 3.77–7.52 | Promises | Higgsfield clip 2 (gold light through an AI workspace) | BRING YOU MORE CLIENTS (b8) · CLOSE MORE SALES (b10) · AND GIVE YOU YOUR WEEK BACK? (b13–14), gold wipe + whoosh on each |
| 16–24 | 7.52–11.27 | 7 systems | Navy + event cover wave | WE TAKE YOU THROUGH / 7 AI SYSTEMS / EVERY BUSINESS NEEDS; tiles 01–07 pop one per beat with a tick |
| 24–32 | 11.27–15.02 | Tease | Same plate, red creeping in | IN ORDER. (b24) · WHILE YOU EAT. (b26) · **AND** with RGB-split glitch growing on half-beats (b28.5–32) |
| 32–40 | 15.02–18.77 | AI Breach Room Live | Higgsfield clip 3 (war room), red pulse per beat | THE AI BREACH ROOM · LIVE badge · INCIDENT CLOCK running · LIVE LEADERBOARD reshuffling per beat · 3 AWARDS. / NO SECURITY BACKGROUND REQUIRED |
| 40–48 | 18.77–22.52 | Host | Noelle's trophy photo (supplied), push-in, gold flare on the trophy | HOSTED BY / NOELLE RUSSELL · **MINDVALLEY TRAINER OF THE YEAR** gold badge (b42, glint) · BUILT AI AT AMAZON ALEXA · MICROSOFT · IBM · AWS · ACCENTURE (one name per half-beat) |
| 48–56 | 22.52–26.27 | Payoff | Higgsfield clip 4 (gold roadmap drawing itself) | YOU LEAVE WITH YOUR OWN 90-DAY AI ROADMAP · + AT LEAST ONE SYSTEM RUNNING · STATUS: RUNNING |
| 56–64 | 26.27–30.00 | CTA | AILI shield (recoloured for navy) + wave | THIS SATURDAY · NOV 14 · 10AM–5PM · FORT LAUDERDALE, FL · seat counter spins and locks: ONLY **20** SEATS LEFT (b58.5) · REGISTER NOW + luma.com/aibusinesssummit (b59), punched on the music's final hit (b62), pulsing gold frame |

## Brand
AILI navy `#0C2350` + gold (from the AILI shield), electric indigo/lavender light from the event cover art. Montserrat 900 (cover-style headlines), Alfa Slab One (AILI-style slab, used on the award badge), JetBrains Mono (HUD/labels).

## Sources and generation log
| Asset | Tool | Detail |
|---|---|---|
| Clips 1–4 | Higgsfield · Kling 3.0 Pro · 9:16 · 5 s · silent | 4 × 7.5 = **30 credits**. Jobs: `57fbbc69…` (inbox), `6ab70952…` (workspace), `2756cbde…` (breach), `adbb1d2f…` (roadmap) |
| Clip 4 usage | — | Only the first 1.62 s is used (slowed ×2.45 with motion interpolation) — later frames contain AI-garbled pseudo-text labels |
| Music | ElevenLabs Music v2.5 · instrumental · 30 s | 2 takes; **take A** used (take B fades out from 23 s) |
| SFX | ElevenLabs Sound Effects v2 | impact, glitch alarm, whoosh, tick (2 takes each); 22 hits placed on the grid by `scripts/mix.py` |
| Host photo | Supplied in chat, approved for use | `assets/src/noelle-trophy.png`; Luma profile portrait kept as a backup |
| Cover art, AILI logo | Luma event page | `assets/src/` |
| Claims | Luma event page | "7 AI systems every business needs, in order, while you eat", "AI Breach Room Live", "Three awards. No security background required", 90-day roadmap, Mindvalley Trainer of the Year, Built AI at Amazon Alexa, Microsoft, IBM, AWS, and Accenture |
| "Only 20 seats left" | The brief | Scarcity line supplied by the requester |

## Rebuild
```
python3 scripts/mix.py                      # audio/src → assets/media/mix.m4a (−14 LUFS target)
npx hyperframes@0.8.222 check --json
npx hyperframes@0.8.222 render -o out/aili-summit-reel-9x16.mp4 -q delivery -f 30
```
