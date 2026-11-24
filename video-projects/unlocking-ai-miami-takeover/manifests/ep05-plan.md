# EP05 Plan: Penny, the AI SEO & Blog Writer

Balance at planning: **724.47 credits** (Plus plan). Format: 9:16, ~50–55s, 12 shots.
Voices: separate stems (Noelle = Sloane, fixed). Mimi and Penny are new voices and need casting.

## Pipeline (same as EP01)
1. Voice lines first. Shot lengths lock to the real reads, not the provisional 55s map.
2. Picture: `kling_o3_flf` (Kling 3.0 Omni Frames), **pro, sound off** (1.25 cr/s), start frame + end frame wherever two approved stills bracket the move. Sound **on** (1.8 cr/s) only for the two car shots, for engine audio. Min clip length is 3s.
3. Lip sync: `sync_so`, about 3.5 cr per second of clip, on-screen speakers only.
4. Music bed (~55s), assembler, captions and evergreen end card in post.
5. Submit at most 2 paid jobs at a time.

## Still → shot map
| Shot | Start still | End still | Gen | Sound | Est. |
|---|---|---|---|---|---|
| 01 Arrival | Ferrari front, Noelle driving, Mimi in window | — | 5s | on | 9.0 |
| 02 Noelle enters | Doorway walk-in, Mimi arms out | — | 5s | off | 6.25 |
| 03 Ambush | Mimi lunging, arms wide | — | 4s | off | 5.0 |
| 04 Sunglasses / referrals | Mimi laughing, Noelle lowers glasses | — | 4s | off | 5.0 |
| 05 Finger count | Mimi counting, Noelle hand at chin | — | 4s | off | 5.0 |
| 06 "And Google?" | "???" confusion two-shot | — | 4s | off | 5.0 |
| 07 "Girl. We need to talk." | Noelle solo close-up | — | 4s | off | 5.0 |
| 08 Website problem | Noelle shows website, Mimi doubtful | — | 5s | off | 6.25 |
| 09 "Meet Penny" | Penny screen, clean | Penny screen, 3 feature panels | 4s | off | 5.0 |
| 10 Penny works | `S10_start_clean.png` | `S10_end_cards.png` | 8s | off | 10.0 |
| 11a Card reveal | Noelle pulls card from blazer | Noelle hands card over | 4s | off | 5.0 |
| 11b Handoff | Noelle hands card over | Noelle retrieves phone | 4s | off | 5.0 |
| 11c Retrieval | Noelle retrieves phone | — | 3s | off | 3.75 |
| 12A Walkout | Interior walkout, car in doorway | — | 4s | off | 5.0 |
| 12B Drive-away | Rear Ferrari, BBY TIGR, Mimi waving | — | 6s | on | 10.8 |
| | | | | **Clips** | **≈91** |

## Lip sync (≈80)
Two-shot faces are the risk: default face detection may lock onto the wrong face. Pilot S07 (solo) and S06 (two-shot) first.
Candidates, trimmed to the spoken part: S02 Mimi, S03 Noelle, S04 Mimi, S06 both, S07 Noelle, S08 both, S11 both. About 23s × 3.5.
Penny is the phone voice, so no sync.

## Budget
| Item | Credits |
|---|---|
| Voice casting (Mimi, Penny) + ~17 lines | ~10 |
| Picture, 15 clips | ~91 |
| Lip sync | ~80 |
| Music bed ~55s | ~10 |
| **Planned** | **~191** |
| Buffer: S10 ×2, S11 segments ×2, 3 misc retakes, 1 lip-sync redo | ~60 |
| **Worst case** | **~250** (leaves ~474) |

## Phases and gates
0. Free: upload stills, fix logos, write manifest, voice casting shortlist.
1. Voices (~10): cast Mimi + Penny, record all lines, lock shot lengths.
2. Pilot (~36): S07 + S10 + S11a clips, S07 lip sync. Review before continuing.
3. Remaining clips (~60), two at a time, QA strips per shot.
4. Lip sync (~70) after picture lock.
5. Music, assembly, captions, end card.

## Open items before spending
- ~~S10 clean start frame~~: received, `episodes/05-penny-seo-content/keyframes/S10_start_clean.png`.
- **Logo:** gold shield badge on the S01 front wheel. User's call: paint out in post (`delogo_track.py --badge`).
- **S08 phone** is black/silver; S09–S11 use the gold phone. Fix the still or accept.
- ~~S08 website date~~: user's call, keep "Jan 12, 2024". It is the owner's last post date, which is the story point.
- **S10 end frame:** tiny phone text reads "Keyword Reearch". Small; fix if a corrected still is easy.
- **S03:** arms-wide lunge; prompt locks "no hug, no contact".
- **End card:** reuse `events/evergreen.json` (registration link under the car) unless told otherwise.

## Owner (Mimi) voice auditions
All lines read in one take, `elevenlabs_v4`, stability 0.35, similarity 0.8. Files in `audio/voices/candidates/`.
| File | Voice | ID |
|---|---|---|
| MIMI-A_Marisol.mp3 | Marisol | 75e72cd5-011b-4130-a474-e8b1ab341f04 |
| MIMI-B_Roxie.mp3 | Roxie | f6448975-768e-4327-b932-1b7c973d58e9 |
| MIMI-C_Gia.mp3 | Gia | 530df032-c311-483b-a750-cb3c9e1bcdfd |
| MIMI-D_Pixie.mp3 (+ _fast) | Pixie | 0178ef57-ada4-43d9-992b-8d9221045bb4 |
| MIMI-E_Kayla.mp3 (+ _fast) | Kayla | 5c615d8a-5135-539d-8ab0-497b7ceabbae |
| MIMI-F_Zoe.mp3 (+ _fast) | Zoe | d0374db1-44b9-4f05-939e-0a9ae9dbbe6a |

Round 2 (user asked for higher pitch, faster): no pauses in the script, stability 0.3. `_fast` = ffmpeg `asetrate=44100*1.06,aresample=44100,atempo=1.06` (+12% speed, ~+1 semitone), free in post.

**Mimi voice: approved = Zoe, `_fast` post-process (director's pick, round 2 take F).**

## Penny voice auditions
Audition text (intro is audition-only): "Hi, I'm Penny, your AI SEO and blog writer. Your first article is ready for review." Stability 0.6.
| File | Voice | ID |
|---|---|---|
| PENNY-A_Imogen.mp3 | Imogen | 3811e986-0891-47cf-a1f5-78a1d62a547a |
| PENNY-B_Nora.mp3 | Nora | d081b915-6623-4a44-bacf-80d0f1c90a03 |
| PENNY-C_Celine.mp3 | Celine | 57ccb351-84d7-54ba-afd4-26b566ca6023 |
| PENNY-D_Ines.mp3 | Ines | 023ebf5e-1970-40d8-825c-a5ef6a1dd4ff |
| PENNY-E_Tamsin.mp3 | Tamsin | 9eb5a147-c322-4f8a-8bc5-a30679dfaf5c |
| PENNY-F_Luna.mp3 | Luna | 375a3398-e3b4-4f91-845d-42181e352899 |

Round 1 (A–C) rejected: "sound like old ladies". Imogen is already Eva's voice (EP02); never reuse it. Round 2 (D–F): younger, accent OK, stability 0.5.

S10 start frame replaced with the user's corrected version (`S10_start_clean.png`); the first one is kept as `S10_start_clean_v1_retired.png`.

**Penny voice: approved = Tamsin.**

S10 background: the start frame shows an ottoman and side table that the end frame doesn't. User's call: accept it, because the cards cover that area as they appear.

All 16 approved stills plus the corrected S10 pair are in `episodes/05-penny-seo-content/keyframes/` under their shot names.

## Evergreen invite line (user's call)
Noelle says the series evergreen invite line, voiceover, while she hands Mimi the black gold-key card (S11a→S11b).
Reuse `events/evergreen.json` L6b as is: "Unlocking AI Challenge. Grab your seat at the link." (`audio/voices/events/evergreen/L6b.mp3`, 4.05s, Sloane). It costs 0 credits, and swapping the event later works exactly as it does for EP01.
It is voiceover, so it gets no lip sync. The manifest points `"event"` at `events/evergreen.json`, so the episode follows EVERGREEN.md.

Shot 11 dialogue order: Mimi "She writes blogs about MY business?!" → Noelle "Exactly." → **L6b over the card reveal and handoff** → Noelle "Ready to unlock AI?" → Mimi "Oh, ABSOLUTELY!" during the phone retrieval.

### Revision (user's call): one combined invite line
EP05 Shot 11 invite VO: **"Unlocking AI Challenge. Grab your seat at the link if you're ready."** It replaces both L6b and "Ready to unlock AI?". Mimi's "Oh, ABSOLUTELY!" answers "if you're ready".
EP01 keeps its own L6b unchanged. EP05's line is recorded new (Sloane) and stored in the evergreen pack as `L6b_ep05` (`audio/voices/events/evergreen/L6b_ep05.mp3`), so event swaps still edit only the pack.
Storyboard: `qa/EP05_storyboard.jpg`.
