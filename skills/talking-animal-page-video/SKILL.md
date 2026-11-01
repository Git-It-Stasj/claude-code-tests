---
name: talking-animal-page-video
description: Build a ~40 s vertical video from a book/page photo — karaoke highlighter synced to a designed ElevenLabs voice, hard cut, ONE continuous lip-synced MiniMax H3 animal clip with captions, and a spinning-book credit card. Use when the user wants a "character reads the book" video, page highlighting matched to narration, or a lip-synced animal/character reading scene. Encodes lessons from the Mama Tiger project.
---

# Talking-animal page video

Read `LESSONS_LEARNED.md` (same repo) for the full story. Follow these rules in order:

1. **Intake once**: passage 1 (page, highlighted) and passage 2 (character reads, ≤ 14.5 s of speech), page photo, character image, cover/back/spine photos. Confirm hard cut, caption scene, logo, sound effects, voice character, runtime. State the credit plan and balance before any generation.
2. **Approve transcripts first**, then design the voice once (ElevenLabs `creative_design_voice` → `creative_save_designed_voice`), generate, transcribe with Scribe (word timestamps), normalise to −16 LUFS / −1.5 dBFS peak.
3. **Scene 1**: highlighter from per-word boxes + Scribe timings (lead 0.06 s, word complete at 70 %, hold through pauses). Build delayed audio **separately** and mux — never rely on `adelay` inside a piped-frames render. Verify sync by onset detection on the rendered mp4.
4. **Scene 2 = ONE clip** on MiniMax H3 (`image_references` + `audio_references`, 9:16, ≤15 s, 30 credits for 15 s). Never chunk into short clips. Never use Kling (own voice), Wan (loose lip-sync) or start/end frames with audio (unsupported). Pre-check start-frame text at 100 %; add the real cover photo as a second image reference and spell every cover string in caps in the prompt. Add ~0.5 s silence before the narration in the audio reference. Decline zoom presets with `declined_preset_id`. Run `get_cost` first; `nsfw` status may be a false positive and isn't charged — retry with only proven references.
5. **Closing card**: 3 s spinning 3D book from real photos, credit line, no logo unless asked. Remove thumbs by copying clean nearby paper with feathered edges, never a flat colour block.
6. **Assemble** in one ffmpeg `filter_complex`: scene 1 → hard `concat` → clip → 0.35 s `xfade` → card; caption PNG overlays timed to Scribe words; `amix normalize=0`.
7. **QA by measurement** (see checklist in LESSONS_LEARNED.md): speech onsets, hard-cut position, ≤1 s gap after cut, caption timing, loudness, text legibility at 100 %, no speech over the card. Report runtime, credits spent/remaining, and what a human must still check (lip-sync). Commit/push; never open a PR unless asked.
