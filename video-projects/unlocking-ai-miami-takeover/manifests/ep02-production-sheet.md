# EP02: THE OVERWHELMED EXECUTIVE (Eva, AI Executive Assistant) — Production Sheet v1

Status: pre-production. Nothing paid has run. Manifest: `manifests/ep02-eva-executive-assistant.json`. Storyboard: `qa/ep02_storyboard.jpg`.

## Evergreen rules applied
- No dates, times, "Black Friday" or promo anywhere in picture, captions or VO. Event pack: `events/evergreen.json` (end card = UNLOCKING AI CHALLENGE / BUILD AN AI-AMPLIFIED BUSINESS / LIVE + register link).
- Invite lines (L6a, L6b) stay voiceover in event slots, so a dated version can still be swapped in later per `EVERGREEN.md` without re-animating.
- `build_overlays.py` / `manifest_util.py` now skip missing event/date/time lines (Black Friday pack renders unchanged).

## Script (32.0s)
| Line | Speaker | Text | Shot | Mode |
|---|---|---|---|---|
| L1 | Noelle | Whoa. You running a business... or an inbox? | S04 | lip sync |
| L2 | Exec | I need another me! | S05 | lip sync |
| L3 | Noelle | Better. Meet Eva. | S06 | lip sync |
| L4 | Eva | Your inbox and schedule? Let's get organized. | S07 | laptop-speaker EQ, no sync |
| L5 | Exec | She handles all that? Where do I sign up? | S08 | lip sync |
| L6a | Noelle | Funny you ask. (slot ≤1.2s) | S09 | VO |
| L6b | Noelle | Unlocking AI Challenge. It's live. Bring your inbox. (slot ≤3.6s) | S10 | VO |
| L7 | Noelle | I'll show you. | S11 | VO (back turned) |

Claims: Eva's UI shows "Drafts Ready / Review & Edit" (human approves). Matches Marblism's positioning (inbox triage, drafts in your tone, scheduling). Nothing shown as sent. "Dramatization" note on S07.

## ElevenLabs specs (via Higgsfield `elevenlabs_v4`)
| Role | Voice | Settings | Status |
|---|---|---|---|
| Noelle | Sloane `b57b22a0-f287-405b-bc82-6f08f5e6bb1f` | stab 0.45, sim 0.8 | locked |
| Exec (EXEC_02) | candidates: Gia `530df032-c311-483b-a750-cb3c9e1bcdfd`, Maya `b0f766b7-8703-4bd1-b973-f857c36837b6`, Elena `ca83ca7f-c186-493d-bd69-0d765fa861b2` | stab 0.4, sim 0.8, frazzled→delighted | director picks |
| Eva | candidates: Chloe `e9cfbbf0-4476-46be-b396-596eb774b165`, Imogen `3811e986-0891-47cf-a1f5-78a1d62a547a`, Ainsley `731b4ffe-e95e-59f4-8c00-81608936091f` | stab 0.6, sim 0.8, crisp/warm/efficient | director picks |
Synthetic voices are never presented as Noelle's real voice.

Eva post-FX: highpass 250 / lowpass 6000 / light compressor (laptop speaker, slightly fuller than Rachel's phone EQ).

## Animation prompts
Per-shot grok prompts live in the manifest (`shots[].prompt`). Every prompt locks identity, wardrobe, hardtop roof, style; one action; static or simple camera; negatives (no other cars, people, duplicated props, new text).
Free shots: S03A push-in, S07 push-in + post-built UI highlight pulses (keeps Eva's UI text crisp; grok warps on-screen text), S12P plate crop push-in.

## Budget (balance 135.88 credits)
| Item | Tier A (Ep01 quality) | Tier B (fits balance) |
|---|---|---|
| Grok clips | 29s = 130.5 | 19s = 85.5 (S02, S05, S06, S08 become free push-ins) |
| Lip sync | 10s = 36.0 | 10s = 36.0 (synced on the push-in video) |
| Voices incl. candidates | ~3 | ~3 |
| Music 32s | 4.7 | 4.7 |
| Subtotal | 174.2 | 129.2 |
| +15% retake buffer | ~200 | none left |

## 16:9 widescreen keyframe prompts (director generates; never cropped/stretched)
Common suffix: "premium 2.5D cel-shaded graphic novel, crisp black outlines, saturated Miami pink/orange sunset, deep purple shadows, neon reflections, 16:9, no text, no logos, no badges."
- W01 Arrival: low wide tracking shot, Noelle (voluminous dark curls, black rectangular sunglasses, purple pantsuit, black I♥AI tee) driving the yellow 1980s wedge FIXED-HARDTOP coupe with side strakes along a palm-lined neon Art Deco boulevard, waterfront skyline and setting sun right.
- W02 Discovery: interior over-shoulder from passenger side, 1980s dark sports-car interior, Noelle glancing out her window at a glass office tower lobby where a stressed executive sits at a paper-covered desk.
- W03 Chaos: wide office, executive (curly updo, cream blazer, navy collared blouse, gold hoops) at desk centered, paper stacks, steaming mug, four glowing notification cards floating left and right of her, floor-to-ceiling windows on the bay.
- W04 Enters: Noelle pushing the glass door open on the left third, executive seen from behind right, desk foreground.
- W05 Exec: medium shot, hands up in exasperation, laptop foreground, skyline behind.
- W06 Offer: Noelle standing left holding one phone showing a glowing assistant app, pointing at it; executive's shoulder in right foreground; laptop full of cluttered windows.
- W07 Eva UI: laptop close-up, purple assistant dashboard with a stylized pop-art assistant portrait, four cards (inbox triage, schedule check, requests, drafts ready), no readable brand names.
- W08 Reaction: executive leaning back delighted, hands on chest, laptop foreground.
- W09 Signature: Noelle seated, lowering sunglasses with a knowing smirk, palms and skyline behind.
- W10 Invite: Noelle (left) handing one black card with a gold key to the delighted seated executive (right), SAME office as W03.
- W11 Exit: executive foreground right cheering with the card; Noelle walking out through the door left toward the yellow hardtop coupe parked at the curb.
- W12 Drive-off: rear three-quarter of the yellow hardtop coupe, quad exhaust, Florida plate "BBY TIGR", driving away down the wet waterfront boulevard toward the sun.
