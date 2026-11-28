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
- Before animating a car pulling away from camera, plan to stabilise it in post (`scripts/ep06_sh16a_stabilize.py` + `scripts/ep06_sh16a_fix.py`). Both Grok and MiniMax tracked the car with the camera despite "locked-off static camera" prompts (EP06 16A R01 and R02). Use only the frames before the stabilised edge reaches the car (about 1.9 s), and hide the uncovered edge with a constant right-anchored crop-zoom. Filling it from frame 0 ghosted the parked car; a mirrored fill showed as blur (user-caught).
- Before showing a licence plate on screen, replace it in post with `assets/plates/BBY_TIGR_florida_plate.png`: the user's reference design (`assets/plates/reference/`), with palms, FLORIDA, the orange and BBY TIGR. Put it on a polynomial-smoothed track, tinted from the plate's bright pixels only. Generated plates come out garbled. Per-frame placement jittered, and a median tint that included the lettering went grey (two user-caught rounds).
- Before running sync_so on a face narrower than about 120 px, crop and upscale it 3x (keeping other faces out of the crop), sync that, then paste it back with `scripts/ep06_facecrop_paste.py`. A full-frame sync on an 80 px face barely moved the mouth (user-caught, EP06 SH09).
- If MiniMax returns `nsfw` on a keyframe, switch to Grok rather than rewording. The EP06 SH10A frame was rejected twice with different prompts (no charge), and Grok accepted it on the first try.
- Before compositing a grabCut cutout, render the mask over solid green and check the cabin/glass, the wheels and stray background. grabCut is not stable between runs: a re-run dropped the dark glass and Noelle, making the hardtop read as a convertible. Add an explicit polygon for dark glass and fill the silhouette.
- Before thresholding colours (plate, sky, glass), sample the real HSV values of the target region first. The plate detector failed twice on an assumed "white, low saturation" plate that was actually S≈100 under sunset light.

## Campaign decisions (user's calls)

- Use only the user-supplied keyframes. Never generate or regenerate shot images; ask for them.
- 16:9 is a native re-shoot from user-supplied 16:9 keyframes (`keyframes/user/16x9/`). No AI reframe or blurred pillarbox; the user rejected both as "tacky" for the main YouTube asset. `manifests/*-16x9.json` inherits audio, captions and event from the 9:16 manifest via `"base"` and overrides only picture and layout.
- No visible third-party logos (user's call, EP01 v8 / 16:9 v3). The Ferrari badge and Apple logos were painted out in post with `scripts/delogo_track.py` (`--badge` mode for round badges). In keyframe QA for new episodes, flag any logo before animating so it can be fixed in the image instead.
- Voices are approved and fixed: Noelle = Sloane, Owner = Marcus, Rachel = Emily (IDs in `manifests/reference-assets.json`).
- In Ep01, Noelle is voiceover after shot 10: no lip sync or mouth animation from there on. Lip sync only shots where the speaker is on screen.
- BBY TIGR is a recurring plate detail.
- Registration: https://stan.store/noelleai/unlockingai. The link sits low in frame, under the car.
- Ep01 music is the original 32s track, fading out at about 32s. The 35s runtime ends on car sound only.
- To extend a shot, use the last frame of the current clip as the start image, so the cut is seamless.
- Regenerate only failed shots. Keep retired takes listed in the manifest.
- Exception to "never generate shot images": for parallax rigs the user approved generated background plates in their own words (EP06 S01: a Delgado clean plate plus 4 invented storefronts with no real brands, about 10 credits). Each new plate still needs that kind of explicit approval.
- In vehicle and character prompts, restate the keyframe pose and accessories as constraints, e.g. "arms stay crossed, hands never go near the monitor", "dark opaque sunglasses, never clear, stays in profile". Grok uncrossed Vic's arms through the screen and swapped Noelle's sunglasses for clear glasses (both user-caught). For holds, MiniMax with the same frame as start and end kept the pose.

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
- In lip-sync QA, check the mouths of the non-speaking characters as well as the speaker's, in frames across the whole shot. Vic visibly talked during Noelle's "I know a guy" because it was baked into the Grok take (user-caught). Fix in post by time-remapping a feathered region from that character's own closed-mouth frames (`scripts/ep06_sh09_vic_hold.py`).
- Cut action shots as the action lands, and check the frozen time between the end of a gesture and the start of the line. Noelle's point held for about 1 s, then held again through the push-in ("sits for a couple of seconds", user-caught).
- When a shot dissolves into an approved still, start the dissolve only once the motion has stopped (within a few pixels). Starting 70 px early ghosted the Delgado sign.
- Keep UI and website changes inside the monitor. Flatten each still's screen into a shared screen space and composite it back into one fixed monitor (`scripts/ep06_screen_live.py`). The user rejected full-frame wipes and asked to see Walter revising the site live.

## Token discipline

- Batch retrieval into one call before a multi-step build; preload context once and reference it afterwards.
- Iterate in this same session ("in [file], change X to Y, keep Z") rather than starting a new chat per change.
- Before paid generation or a large build, state the scope and credit estimate and confirm before running it.
- Before building an asset from scratch, check whether an existing script, template or clip can be extended instead.
