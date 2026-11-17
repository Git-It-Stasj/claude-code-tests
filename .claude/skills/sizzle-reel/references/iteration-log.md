# Iteration log → rules

How each rule in SKILL.md was learned (Noelle Russell / Ignite 2026 reel, v1–v5, rounds 1–7).
Format: what the user asked · root cause · rule.

## Early versions (v1–v4)
| Request | Root cause | Rule |
|---|---|---|
| v2 "more high energy" | First cut too polite | Default to keynote-opener energy: hard type, beat-locked cuts |
| v4: hook should animate in, edgier type, credentials one per beat, one session block | Static text, soft fonts | Condensed black display + mono labels; lists one item per beat |
| "Redo on Opus, better graphics" | Text over stock footage looked generic | Draw SVG diagrams that animate on; HUD frame; light sweeps; no white flashes |

## v5 rounds
| Round | Request | Root cause | Rule |
|---|---|---|---|
| 2.1 | House text hits the roof line | Text centred on the box, not the shape | Align text to the outline's geometry; measure |
| 2.2 | Remove focus chevrons on Noelle | Decoration on a face reads cheesy | No brackets around faces |
| 2.3 | Ticket lines on beat, faster; music ends at 30 s of 37 | Generated track shorter than the cut | Music length = video length; lists ~0.3 s rises on consecutive beats |
| 2.4 | Insert link | Not in the brief | Ask about links/CTA up front |
| 3.1 | "THE AI" must align with house vertices | Optical alignment ignored | Cap height on vertices, verified by pixel |
| 3.2 | "THE GAP" touches lines | Label placed before curve was final | No text touches any line; check snapshot |
| 3.3 | Close → free digital pass CTA | Ending not agreed | Ask what the last frame is |
| 3.4 | Replace photo with "I ❤ AI" shirt | Didn't ask for signature look | Ask for signature photo/branding |
| 3.5 | Music fade last 1.5 s | — | Short tail fade only |
| 4.1 | Hold speaker 2 beats after last credential | Cut too fast after a list | Hold after lists, counted in beats |
| 4.2 | End after the info ticket, crash, hold 2 s, fix progress bar | Video ran past its natural end | End on details; progress rail derived from duration |
| 4.3 | Chart must match reference image | Drew my own interpretation | Get and match references exactly |
| 4.4 | House words to vertices (again) | Previous fix not precise | Measure, don't eyeball |
| 5.1 | Stay 2 s on speaker after last credential | — | (superseded by 6.1) |
| 5.2 | Co-speakers as logos, stacked like sponsors | Words looked weak | Logos, white, vertical stack, one per beat |
| 6.1 | 3-beat hold so next scene starts on a four-count | Hold measured in seconds | Scenes start on the 1 of a four-count |
| 6.2 | Method lines on four-counts; logos on beats | Arbitrary cue times | Section items on four-counts, list items on beats |
| 6.3 | Music repeats at 28 s, ending abrupt; wants crescendo + payoff | Looped splice + hard crash | No loops/splices; arc must build to a payoff |
| 7 | Ticking noise ~27 s; background freezes | Synth snare roll; clip shorter than screen time at its rate | No synthesized risers; compose the whole track to length; check clip length ÷ rate |

## Biggest lessons
1. **Music caused 4 of 7 rounds.** Generate a full-length track with the arc in the prompt first, before animating.
2. **Precision layout caused 4 rounds.** Measure alignment and collisions in snapshots before delivering.
3. **Unasked brief questions caused 4 rounds** (photo, ending, link, logos). Use the brief template.
