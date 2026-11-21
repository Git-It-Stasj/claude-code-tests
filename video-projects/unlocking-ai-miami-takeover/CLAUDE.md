# Unlocking AI: Miami Takeover — Project Rules

## Preemptive Checks — run before starting this category of work

- Before submitting more than 3 paid Higgsfield jobs at once (grok, ElevenLabs, sync_so, music), submit in batches of at most 3 and wait for each batch to finish. Larger batches hit 429 rate limits, which previously forced resubmits on three different models.
- Before animating a "character gets into a car" shot, use a rear or rear-quarter framing where the roof hides the body, lock the roofline in the prompt ("ducks fully below the roof, head never above it"), and cover the sit-down moment with a cutaway. Two earlier takes failed: in one she walked away from the car, in the other her head poked through the roof.
- Before running sync_so lip sync, use default face detection and do not pass manual `active_speaker_detection` coordinates for a single speaker. The manual-coordinate job queued for a long time and then failed; the default worked on the cel-shaded faces.
- Before running `scripts/assemble_vertical.py`, set the Bash timeout to at least 600000 ms. A full render takes longer than the 120s default.
- Before removing files through a shell variable, write the target as `"${VAR:?}"/*` or as a literal absolute path. A bare `rm -f $VAR/*` is blocked by the safety check, and the whole command fails with it.
- Before waiting on a Higgsfield job, use `jobs_wait` or a background command with an `until` loop. A foreground `sleep` is blocked by the harness.

## Campaign decisions (user's calls)

- Use only the user-supplied keyframes. Never generate or regenerate shot images; ask for them.
- Run vertical 9:16 first. Widescreen 16:9 is deferred until the user asks for it.
- Voices are approved and fixed: Noelle = Sloane, Owner = Marcus, Rachel = Emily (IDs in `manifests/reference-assets.json`).
- In Ep01, Noelle is voiceover after shot 10: no lip sync or mouth animation from there on. Lip sync only shots where the speaker is on screen.
- BBY TIGR is a recurring plate detail.
- Registration: https://stan.store/noelleai/unlockingai. The link sits low in frame, under the car.
- Ep01 music is the original 32s track, fading out at about 32s. The 35s runtime ends on car sound only.
- To extend a shot, use the last frame of the current clip as the start image, so the cut is seamless.
- Regenerate only failed shots. Keep retired takes listed in the manifest.

## Editing and QA

- Never change an approved asset (music bed, voice, keyframe, logo) as a side effect of a different change. If the change seems to require altering it, ask first. Extending the runtime once led to unrequested "extended music", which the user reverted in favor of the original track.
- Back every QA claim about motion or content with sampled frames at several timestamps, never a single frame or a guess. A "glasses barely move" note was wrong and had to be corrected after review.
- In ffmpeg filtergraphs, never use an input stream label (e.g. `[0:a]`) twice. Use `asplit`/`split`, or pass the file as two inputs. Reusing a label can give output of the wrong length with no error (19.3s instead of 35.2s). Check every rendered file's duration with ffprobe.
- When an episode has a spec'd length (the brief says 32s) and a requested change breaks it, do the change, state the new length, and offer a way back to spec.

## Token discipline

- Batch retrieval into one call before a multi-step build; preload context once and reference it afterwards.
- Iterate in this same session ("in [file], change X to Y, keep Z") rather than starting a new chat per change.
- Before paid generation or a large build, state the scope and credit estimate and confirm before running it.
- Before building an asset from scratch, check whether an existing script, template or clip can be extended instead.
