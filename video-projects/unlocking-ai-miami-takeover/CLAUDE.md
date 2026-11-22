# Unlocking AI: Miami Takeover — Project Rules

## Preemptive Checks — run before starting this category of work

- Before submitting paid Higgsfield jobs (grok, minimax, ElevenLabs, sync_so, music), submit at most 2 at once and wait for a slot to free. The account cap is 2 concurrent jobs across all models: in Ep02 a third was refused with "max 2 concurrent job(s)". Audio returns in about 10s, so finish all voice lines before starting video pairs.
- Before animating a reaction or expression shot of a seated character (laughing, gasping, leaning toward camera), use `minimax_h3_max` with the user's keyframe as BOTH `start_image` and `end_image`, not grok. In Ep02 S08, two grok takes failed: one morphed the face at 1.8s, and the other (even with "head stays in the same position") drifted the face and made the laptop fold shut and vanish. Minimax anchored at both ends held the face and the props.
- Before animating a "character gets into a car" shot, use a rear or rear-quarter framing where the roof hides the body, lock the roofline in the prompt ("ducks fully below the roof, head never above it"), and cover the sit-down moment with a cutaway. Two earlier takes failed: in one she walked away from the car, in the other her head poked through the roof.
- Before running sync_so lip sync, use default face detection and do not pass manual `active_speaker_detection` coordinates for a single speaker. The manual-coordinate job queued for a long time and then failed; the default worked on the cel-shaded faces.
- Before running `scripts/assemble_vertical.py`, set the Bash timeout to at least 600000 ms. A full render takes longer than the 120s default.
- Before removing files through a shell variable, write the target as `"${VAR:?}"/*` or as a literal absolute path. A bare `rm -f $VAR/*` is blocked by the safety check, and the whole command fails with it.
- Before waiting on a Higgsfield job, use `jobs_wait` or a background command with an `until` loop. A foreground `sleep` is blocked by the harness.
- Before compositing post-built graphics onto a grok clip, measure the keyframe-to-clip mapping by scaling the keyframe, cropping, and comparing with the clip's first frame. Grok outputs in Ep02 were the keyframe scaled 0.765 with a 0–7px crop. Guessing the scale would misplace overlays and break seamless cuts.
- Before building a crop-zoomed QA strip (mouths, plates, UI), grab one full frame and locate the target first. In Ep02 the lip-sync crops for S04 and S08 both missed the face on the first try and had to be redone.

## Campaign decisions (user's calls)

- Use only the user-supplied keyframes. Never generate or regenerate shot images; ask for them.
- Run vertical 9:16 first. Widescreen 16:9 is deferred until the user asks for it.
- Voices are approved and fixed: Noelle = Sloane, Owner = Marcus, Rachel = Emily (IDs in `manifests/reference-assets.json`).
- Voices (Ep02): Exec = Gia (`530df032-c311-483b-a750-cb3c9e1bcdfd`, stab 0.4), Eva = Imogen (`3811e986-0891-47cf-a1f5-78a1d62a547a`, stab 0.6, laptop `device_eq`). New supporting characters and employees still get 3 candidate samples before use.
- In Ep01, Noelle is voiceover after shot 10: no lip sync or mouth animation from there on. Lip sync only shots where the speaker is on screen.
- BBY TIGR is a recurring plate detail.
- Registration: https://stan.store/noelleai/unlockingai. The link sits low in frame, under the car.
- Ep01 music is the original 32s track, fading out at about 32s. The 35s runtime ends on car sound only.
- To extend a shot, use the last frame of the current clip as the start image, so the cut is seamless.
- Regenerate only failed shots. Keep retired takes listed in the manifest.
- Episodes are evergreen by default: no dates, times or promo codes in picture, captions or VO. Use `events/evergreen.json` unless the user asks for a dated event pack.
- Every AI-employee demo must visibly show the employee working: state changes such as red→green, ticks, or text typing in. Build these in post over the user's keyframe (see `scripts/ep02/eva_ui_anim.py`), never with grok. A static screen was flagged as not enough.
- The supporting character stays stressed until the AI employee is revealed: no smiles, no turning away from Noelle before the demo. Ep02 S04 take 1 was rejected for an early smile.
- Never jump-cut between two near-identical keyframes (for example "desk" then "desk + notifications"). Merge them into one shot and add the new elements in post. The user asked for notification cards to pop in one at a time to build stress.
- The ending must flow continuously into the drive-off. No static plate cutaway, and no zoom on a still where the car is frozen. Use the approved pattern: Minimax with first frame = plate close-up crop and last frame = the drive-off clip's first frame, played at about 2× (see `manifests/ep02-eva-executive-assistant.json`, shot 12M).

## Evergreen event swaps

- When the user asks to change the event date, time, link, promo or invite voiceover, follow `EVERGREEN.md`. Edit only `events/<id>.json` and the two VO slots (L6a in shot 10, sunglasses, max 1.2s; L6b in shot 11, invite card, max 3.7s). Never re-animate for an event swap.
- Keep event-specific text out of episode manifests. It belongs in the event pack that `"event"` points to.

## Editing and QA

- Never change an approved asset (music bed, voice, keyframe, logo) as a side effect of a different change. If the change seems to require altering it, ask first. Extending the runtime once led to unrequested "extended music", which the user reverted in favor of the original track.
- Back every QA claim about motion or content with sampled frames at several timestamps, never a single frame or a guess. A "glasses barely move" note was wrong and had to be corrected after review.
- In ffmpeg filtergraphs, never use an input stream label (e.g. `[0:a]`) twice. Use `asplit`/`split`, or pass the file as two inputs. Reusing a label can give output of the wrong length with no error (19.3s instead of 35.2s). Check every rendered file's duration with ffprobe.
- When an episode has a spec'd length (the brief says 32s) and a requested change breaks it, do the change, state the new length, and offer a way back to spec.
- Animate on-screen UI, notification cards and any readable text in post, not with grok. Grok warps text and duplicates UI elements: Ep02 S03B grew 4 notification cards to 6. Cut elements from the user's keyframe with a rounded, feathered mask and composite them (`scripts/ep02/notif_pop.py`).
- Don't pixel-diff two user keyframes to extract the elements that differ between them. They are separate renders and not pixel-aligned (Ep02 S03A/S03B differed in 32% of pixels everywhere). Cut the element with a mask instead.
- Captions on 3:4 shots that show a demo screen go at y≈1600, below the screen and just under the "Dramatization" note. The default y=1330 covered Eva's UI, and y=1700 ran into the phone app's bottom bar. Use the per-caption `"y"` key.
- When moving files by name prefix, match the exact filename (`S12_user.png`), not a glob (`S12*`). In Ep02 `ls S12*.png | head -1` picked `S12P_plate_crop.png` and retired the wrong file.

## Token discipline

- Batch retrieval into one call before a multi-step build; preload context once and reference it afterwards.
- Iterate in this same session ("in [file], change X to Y, keep Z") rather than starting a new chat per change.
- Before paid generation or a large build, state the scope and credit estimate and confirm before running it.
- Before building an asset from scratch, check whether an existing script, template or clip can be extended instead.
