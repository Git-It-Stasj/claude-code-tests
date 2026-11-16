# Sound palette (approved on the AI Business Summit reel)

The requester's taste: **sci-fi / AI**, polished, never violent. Anything percussive and sharp on a text slam reads as a **gunshot**, and was rejected. A glitchy, abstract "breach" sound was called jarring and "doesn't sound like an alarm". People like sounds they *recognise* (a starship red alert) over abstract ones.

## Bundled, approved files (`assets/sfx/`, ElevenLabs Sound Effects v2)
| File | Use | Gain in mix | Prompt that made it |
|---|---|---|---|
| `slam-data-swoosh.mp3` | every text slam + scene transition | **−6.9 dB** (approved at "10% quieter" than −6) | "Smooth cinematic data stream swoosh, airy synthetic whoosh with granular digital texture and a subtle sub-bass bloom at the end, sleek AI tech transition, soft attack" (0.9 s, influence 0.7) |
| `alert-starship-red-alert.mp3` | the tension/alarm beat (one hit, let it ring into the reveal) | −6 dB | "Spaceship red alert alarm, classic rising two-tone starship klaxon whoop repeating twice, clean synthetic sci-fi bridge alert, clear and recognizable" (2 s, influence 0.75) |
| `tick.mp3` | counters, tile pops, countdown (quarter-beats) | 0 to −2 dB (it is quiet) | "Single crisp digital UI counter tick, short and clean" (0.5 s) |
| `impact.mp3` | the big reveals (drop, host photo); light on the final hit | −3 to −8 dB | "Deep cinematic trailer impact hit with sub boom and short metallic shimmer tail" (2 s) |

Reuse these by default — they are approved and cost nothing. Generate new ones only when the event's tone is clearly different (e.g. a wellness retreat, a gala), and then follow the sample process below.

## Rejected (don't reuse)
- Generic "fast clean airy whoosh swipe" → heard as gunshots on slams.
- "Digital glitch burst + cyber alarm beeps" → jarring, not recognisable as an alarm.
- Laser zaps / glassy energy-beam sweeps → not liked.
- Hologram materialize, power-up thrum, two-note interface chime → fine but not chosen.

## Sample process when a sound changes
1. Generate 2–4 directions with *different* ideas (not 4 takes of one prompt), 1–2 takes each. SFX cost ~10 credits/second.
2. Build in-context clips with `scripts/sound_samples.sh` (the reel stretch with that sound swapped in) and send them; label each with a one-line description.
3. Lock what's approved; note gain tweaks ("10% quieter" ≈ −0.9 dB).

## Music (ElevenLabs Music v2.5, instrumental, 30 s)
Prompt that worked: "Driving cinematic electronic trailer track at exactly 128 BPM, confident and urgent. Opens instantly on a punchy kick and pulsing synth bass with ticking hi-hats, builds over the first 14 seconds with rising arpeggiated synths and big stabs, then tension with a filtered riser and snare roll …, a massive drop … and a final impact hit and short ring-out at 29 seconds. Crisp modern production, no vocals."
Set `duration_seconds: 30, instrumental: true` via `creative_add_flow_node` + `creative_run_flow_nodes` (generate_in_flow can't set duration). 2 takes ≈ 1,800 credits. The model does **not** place the drop where you ask — measure with `scripts/beatgrid.py` and cut to where it really lifts. Reject a take that fades out before the end.
