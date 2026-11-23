# Unlocking AI: Miami Takeover — Project Rules

## Preemptive Checks — run before starting this category of work

- Before submitting paid Higgsfield jobs (grok, flux, ElevenLabs, sync_so, music), submit at most 2 at a time and wait for them to finish. The account now caps concurrency at 2; a 3-job batch had its third job rejected.
- Before animating a "character gets into a car" shot, use a rear or rear-quarter framing where the roof hides the body, lock the roofline in the prompt ("ducks fully below the roof, head never above it"), and cover the sit-down moment with a cutaway. Two earlier takes failed: in one she walked away from the car, in the other her head poked through the roof.
- Before running sync_so lip sync, use default face detection and do not pass manual `active_speaker_detection` coordinates for a single speaker. The manual-coordinate job queued for a long time and then failed; the default worked on the cel-shaded faces.
- Before running `scripts/assemble_vertical.py`, set the Bash timeout to at least 600000 ms. A full render takes longer than the 120s default.
- Before removing files through a shell variable, write the target as `"${VAR:?}"/*` or as a literal absolute path. A bare `rm -f $VAR/*` is blocked by the safety check, and the whole command fails with it.
- Before waiting on a Higgsfield job, use `jobs_wait` or a background command with an `until` loop. A foreground `sleep` is blocked by the harness.
- Before submitting paid Higgsfield jobs in auto mode, get approval in the user's own words naming the scope (e.g. "approved: run the 16:9 pilot and the evergreen voice lines"). A plain "go" did not get past the auto-mode safety check: the batch was blocked and cost a round-trip.
- Before uploading to Higgsfield, PUT each file with `python3 scripts/hf_put.py <file> <content-type> <upload_url>` (it prints the HTTP status) and then call `media_confirm`. Hand-built curl commands with the long presigned URLs are slow and error-prone.
- Before waiting on a MiniMax H3 job, schedule a `send_later` check-in (about 5 min) instead of polling. A 10s 2K render took over 8 minutes, and 15+ empty `jobs_wait` calls were wasted.
- Before running the assembler, check that every `shots[].file` in the manifest exists on disk, and build the generation queue from the manifest's shot list. S02 was left out of the 16:9 queue and only showed up when the final render failed.
- Before reviewing lip sync, find the face in one full-size frame and crop from there (a crop sheet of the mouth area every 1/6 s). Crops from fixed coordinates missed the mouth 3 times in Ep04 (S07 twice, S14 once, where he leans in) and had to be redone.
- Before running ffmpeg on Grok clips, select the first video stream only (`-map 0:v:0`). Grok MP4s carry a second video stream, and `-map 0:v` failed on all 16 clips while building the Ep04 review reel.
- Before overlaying still PNGs (title, captions, end card) on video in ffmpeg, give each one `-loop 1 -framerate 24 -t <total>`. Without it a PNG shows for only one frame: Ep04 v1 rendered with no title, captions or end card, and nothing reported an error.
- Before sending a QA frame grab near the end of a clip, seek to at most duration − 0.12 s. A grab at 98% of the length returned no frame, and building the strip failed.
- Before uploading a lip-sync audio file to Higgsfield, convert it to mp3. The upload slot is typed audio/mpeg even when the filename ends in .wav.
- Before mixing a generated wind or ambience SFX, measure its energy below 200 Hz (`lowpass=f=200,volumedetect` against the full file) and high-pass it at about 400 Hz if the low end dominates. Two Mirelo wind files were mostly rumble below 200 Hz and read as "a train" (user-caught in Ep04 v2).

## Campaign decisions (user's calls)

- Use the user-supplied keyframes. Change a keyframe only when the user asks for that specific fix (Ep04: new S08 empty pipeline, S16 plate and lanes, S07 redraw, S05/S15/S15A edits). Prefer a local pixel fix. For a GPT Image edit, paste back only the changed area (a screen, a head, a wrist), so approved faces and composition stay exactly as they were.
- 16:9 is a native re-shoot from user-supplied 16:9 keyframes (`keyframes/user/16x9/`). No AI reframe or blurred pillarbox; the user rejected both as "tacky" for the main YouTube asset. `manifests/*-16x9.json` inherits audio, captions and event from the 9:16 manifest via `"base"` and overrides only picture and layout.
- No visible third-party logos (user's call, EP01 v8 / 16:9 v3). The Ferrari badge and Apple logos were painted out in post with `scripts/delogo_track.py` (`--badge` mode for round badges). In keyframe QA for new episodes, flag any logo before animating so it can be fixed in the image instead.
- Voices are approved and fixed: Noelle = Sloane, Owner = Marcus, Rachel = Emily (IDs in `manifests/reference-assets.json`).
- In Ep01, Noelle is voiceover after shot 10: no lip sync or mouth animation from there on. Lip sync only shots where the speaker is on screen.
- BBY TIGR is a recurring plate detail.
- Registration: https://stan.store/noelleai/unlockingai. The link sits low in frame, under the car.
- Ep01 music is the original 32s track, fading out at about 32s. The 35s runtime ends on car sound only.
- To extend a shot, use the last frame of the current clip as the start image, so the cut is seamless.
- Regenerate only failed shots. Keep retired takes listed in the manifest.
- Voices: Marcus Vega (Ep04 owner) = Sterling `dc382508-c8bd-443c-8cb2-46e57b8d2e6f`; Stan = Kevin `f1373f24-3b96-433f-9a68-e595810ef608`. The "Marcus" preset is Ep01's shop owner; don't reuse it for a different owner.
- Overhead driving shots (S01 style): the camera tracks the car. The car stays fixed in the centre and the street, palms and buildings scroll from bottom to top. Don't animate the car crossing a still frame (user-caught in Ep04 S01 v1).
- The street is a 3-lane boulevard in every vehicle shot. Put the lane count ("exactly two dashed lane lines") and "car about one lane wide" in every vehicle prompt. Ep04 S16 came back at 3x car scale and then with 4 lanes (both user-caught).
- Departure shots: start at street level square on the BBY TIGR plate, then crane up and back to overhead in one MiniMax take.
- Noelle's look back as she leaves is a signature move. Hold it at least 1.2 s, then one smooth walk out with no stutter step (user-caught in Ep04 S15A). Do the hold-then-exit as a single MiniMax take, not Grok; add a freeze on the first frame in the edit if the look is shorter.
- Comedy cutaways run 1 s each (Ep04 S08 empty pipeline, S09 tumbleweed). The music cuts to silence under the gag, with SFX only: crickets on the empty pipeline, then a light breeze with no rumble under the tumbleweed. A vulture screech read as a whistle and was replaced (user's call, Ep04 v3).
- Each episode gets its own music track, generated to the final runtime (ElevenLabs Music v2.5, about 6 credits for 44 s). Don't stretch Ep01's 32 s track over a longer cut.

## Evergreen event swaps

- Shot 10 (sunglasses) line is the series catchphrase: "I know a gal." when the AI employee is female, "I know a guy." when male (Sonny, Stan, Walter). Use it in every episode.
- Ep01 runs the fully evergreen pack (`events/evergreen.json`): no day, date or time anywhere, in VO or on screen.

- When the user asks to change the event date, time, link, promo or invite voiceover, follow `EVERGREEN.md`. Edit only `events/<id>.json` and the two VO slots (L6a in shot 10, sunglasses, max 1.2s; L6b in shot 11, invite card, max 3.7s). Never re-animate for an event swap.
- Keep event-specific text out of episode manifests. It belongs in the event pack that `"event"` points to.

## Editing and QA

- Never change an approved asset (music bed, voice, keyframe, logo) as a side effect of a different change. If the change seems to require altering it, ask first. Extending the runtime once led to unrequested "extended music", which the user reverted in favor of the original track.
- Back every QA claim about motion or content with sampled frames at several timestamps, never a single frame or a guess. A "glasses barely move" note was wrong and had to be corrected after review.
- In ffmpeg filtergraphs, never use an input stream label (e.g. `[0:a]`) twice. Use `asplit`/`split`, or pass the file as two inputs. Reusing a label can give output of the wrong length with no error (19.3s instead of 35.2s). Check every rendered file's duration with ffprobe.
- When an episode has a spec'd length (the brief says 32s) and a requested change breaks it, do the change, state the new length, and offer a way back to spec.

- For a continuous multi-beat action (walk to car, get in, drive into the distance), animate it as one long take with MiniMax H3 (10s, about 20 credits) from one keyframe, with "locked-off static camera, never orbits" in the prompt. Don't stitch short grok clips or reuse one clip across slots on both sides of a cutaway. That gave a car that spun, a character still getting in after the cutaway, and a jump to a separate drive-off image (user-caught in 16:9 v1).
- In clip QA, check camera stability and the order of events as well as the subject. A v1 frame check confirmed the head stayed below the roof but missed the camera orbiting the car.
- In every motion prompt, give each visible character an action. A walk-in where only Noelle moved read as "weird" because the owner was frozen (user-caught).
- In vehicle prompts, describe the car as it is in the keyframe and add "no spoiler, nothing added to the car". Grok added a rear wing halfway through one take.
- With flux start/end-frame clips, trim the last ~0.5s before the jump to the end image (it showed as a motion spike at about 2.8s of 5s).
- When estimating cost, price lip sync (sync_so) at about 3.5 credits per second of clip, not ~8 per shot. The 16:9 pilot came in at 96 credits against a ~75 estimate.
- In keyframe QA, check every recurring character's hair, facial hair, watch and accessories across all frames before animating. Marcus's buzz cut (S15) and his watch (S15A) didn't match in Ep04, and the user caught both after the clips were made.
- If a supplied keyframe is lower resolution or drawn differently from its sibling frames, upscaling isn't enough. Redraw it with an approved sibling (same character) as the style reference, then crop. Ep04 S07 was upscaled, still animated soft, and had to be redone.
- Don't run Grok on screens with readable UI text or approved product-character art. Build those shots in post (glows lighting up in sequence plus a slow push-in). Grok rewrote "Pipeline" to "Prospect" and redrew Stan's face (Ep04 S12, self-caught).
- When removing logos from keyframes, use a row-by-row fill for patterned areas (grilles, steering-wheel hubs). The default bilinear fill in `delogo_track.fill` smeared both. `fill()` changes the array in place and returns None.
- Budget an extra ~40% over the first-pass estimate for 1–2 revision rounds after the first cut. Ep04 was estimated at ~225 credits and came in at ~370 (first pass 260, revisions 87 + 26).

## Token discipline

- Batch retrieval into one call before a multi-step build; preload context once and reference it afterwards.
- Iterate in this same session ("in [file], change X to Y, keep Z") rather than starting a new chat per change.
- Before paid generation or a large build, state the scope and credit estimate and confirm before running it.
- Before building an asset from scratch, check whether an existing script, template or clip can be extended instead.
