# EP04 — Stan: The Empty Pipeline (9:16 evergreen) — production plan

Keyframes: `keyframes/final/` (src originals kept in `keyframes/src/`). Contact sheet: `qa/EP04_keyframes_final_contact.jpg`.

## Keyframe fixes (done, pending SQA approval)
| Shot | Fix | Method | Credits |
|---|---|---|---|
| S01 | Hood + grille prancing-horse badges removed | local pixel fill (no regeneration) | 0 |
| S02 | Steering-wheel badge removed (plain dark hub) | local pixel fill | 0 |
| S03, S06 | Apple logo removed from laptop lid | local pixel fill | 0 |
| S05 | Laptop screen now shows the empty Pipeline board (matches S08); only the screen area was pasted back, faces untouched | GPT Image 2.6 edit + screen-only composite | 2 |
| S07 | Upscaled 768x1376 → 2160x3856, saved at 1080x1935 | Bytedance upscale | 2 |
| S08 | NEW: empty Pipeline CRM, built from the S12 Stan laptop frame (same laptop/desk/props) — before/after pair with S12–S13 | GPT Image 2.6 edit | 2 |
| S16 | Plate reads FLORIDA / BBY TIGR (sharp), rear badges removed | GPT Image 2.6 edit | 2 |

## S04
No S04 still was supplied (frame 4 is S05 per brief). Plan: fold S04 into S05 — S05 opens on a slow push through the glass before Noelle steps in.

## Script (updated)
| Line | Speaker | Text | Where | Delivery |
|---|---|---|---|---|
| L1a | Noelle | "Nice office…" | S05 (walking in) | VO (she is small in frame) |
| L1b | Noelle | "…where are the leads?" | S07 sunglasses lower | lip sync |
| L2 | Marcus | "I'm working on that." | S10 cuff adjust | lip sync |
| L3 | Noelle | "I know a guy." | S11 | lip sync |
| L4 | Stan | "Prospects matched. Outreach drafted." | S12–S13 laptop | screen VO, phone/laptop EQ |
| L5 | Marcus | "He finds leads AND writes the emails?" | S14 | lip sync |
| L6 | Noelle | "I thought you'd ask." | S15 card handoff | VO |
| L6b | Noelle | "Unlocking AI Challenge. Grab your seat at the link." (evergreen pack) | S15A → S16 → end card | VO |

Voices: Noelle = Sloane (locked). Marcus Vega and Stan: samples in `audio/samples/`, awaiting pick.

## Shot / clip plan (Grok 1.5 unless noted)
S01 2s · S02 2s · S03 2s · S05(+S04) 3s · S06 3s · S07 3s · S08 2s · S09 2s · S10 3s · S11 2s · S11A 2s · S12+S13 one 4s take from the Stan frame (cards light up in sequence) · S14 3s · S15 3s · S15A 3s · S16 3s.

Estimated runtime with the added lines: ~38–40s (spec 32–35s). Way back to spec: drop S03 or trim S08/S09 to 1s each.

## Spend log
| Step | Credits |
|---|---|
| Voice samples (6) + Noelle lines (3) | ~2.5 |
| Image edits (S08, S16, S05) + S07 upscale | 8 |
| S01 clip (Grok 2s) | 9 |
| S01 v2 + S02–S16 clips (Grok), incl. retired S12 Grok take | ~198 |
| Lip sync S07, S10, S11, S14 (sync_so) | ~38 |
| Marcus lines (Sterling) | ~0.5 |
| **Balance after clips** | **840** |

## Clip status (all internal QA passed; awaiting SQA)
| Shot | File | Notes |
|---|---|---|
| S01 | clips/S01_v2.mp4 | car fixed centre, street scrolls bottom→top (v1 retired) |
| S02 | clips/S02.mp4 | head tilt + glint, roof closed |
| S03 | clips/S03.mp4 | dolly to window |
| S05 (+S04) | clips/S05.mp4 | push through glass, Noelle walks in |
| S06 | clips/S06.mp4 | Marcus head-turn back, arms crossed |
| S07 | clips/S07_lipsync.mp4 | glasses down + "…where are the leads?" (glasses come fully off) |
| S08 | clips/S08.mp4 | empty pipeline, static screen |
| S09 | clips/S09.mp4 | tumbleweed; Grok re-framed palms slightly vs keyframe |
| S10 | clips/S10_lipsync.mp4 | cuff + "I'm working on that." |
| S11 | clips/S11_lipsync.mp4 | "I know a guy." |
| S11A | clips/S11A.mp4 | cursor → Bring Online glow |
| S12–S13 | clips/S12.mp4 | built in post from keyframe (Grok take altered Stan's face + "Pipeline" label → retired) |
| S14 | clips/S14_lipsync.mp4 | "He finds leads AND writes the emails?" ("Wait." trimmed) |
| S15 | clips/S15.mp4 | one card, clean handoff |
| S15A | clips/S15A.mp4 | look-back first, then walks out |
| S16 | clips/S16.mp4 | drives away up the lane, BBY TIGR legible |

Voices: Marcus Vega = Sterling (dc382508-c8bd-443c-8cb2-46e57b8d2e6f), Stan = Kevin (f1373f24-3b96-433f-9a68-e595810ef608).
Review reel (raw clips in order, no music): review/EP04_clips_review_reel.mp4 (44.6s raw → ~38–40s after trims).

## Round 3 (SQA notes 1–8) — v1 assembled cut
- S07 v2: new keyframe in S11's crisp style (keyframes/final/S07_v2_crop.png), clips/S07_v2_lipsync.mp4
- S06: new line L0 "Business is booming!" (Sterling), clips/S06_lipsync.mp4
- S08/S09 cut to 1.0s each; music ducks to ~12% across both (desert beat)
- S15 v2: Marcus low buzz cut (head-only composite), clips/S15_v2.mp4
- S15A v2: Stan dashboard on laptop, watch removed, look-back held (+0.5s freeze in edit), clips/S15A_v2.mp4
- S16 v3: street-level plate → crane up to overhead, MiniMax H3 6s, clips/S16_v3.mp4
- Music: new 44s original synthwave (ElevenLabs Music v2.5), audio/music/ep04_synthwave_44s.mp3
- Edit: edit.json + assemble_ep04.py → exports/vertical/EP04_stan_9x16_v1.mp4 (43.1s, -14 LUFS)
- Round 3 spend ≈ 87 credits (keyframes 8, Grok 3×13.5, MiniMax 12, lip sync ~21, music 6, voice 0.2)

## Round 4 — v2 cut (exports/vertical/EP04_stan_9x16_v2.mp4, 43.6s, -14.7 LUFS)
- Desert beat: music fully muted 14.45–16.5s; vulture screech (audio/sfx/vulture.mp3) + whistling wind (audio/sfx/desert_wind.mp3)
- S15A v3 (MiniMax 5s): look back, then one smooth walk out (no stutter); 0.6s hold on the look-back in edit
- S16 v4 (MiniMax 6s): three-lane street throughout, street-level plate → crane to overhead
- Round 4 spend ≈ 26 credits (image 2, MiniMax 2×12, SFX ~0.5)
