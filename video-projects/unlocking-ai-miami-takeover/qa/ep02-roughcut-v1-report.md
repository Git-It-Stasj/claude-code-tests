# EP02 rough cut v1: QA report

File: `exports/vertical/EP02_eva_9x16_v1_roughcut_TEMPVOICES.mp4`. 32.000s, 1080x1920, 24 fps, -16.0 LUFS integrated. Event pack: `evergreen`, with no date, time or promo anywhere.
Not final: there is no lip sync yet, exec and Eva use TEMP candidate voices (Elena, Chloe), and S08 is a placeholder take.

## Per-shot (5+ frames sampled each)
| Shot | Source | Verdict | Notes |
|---|---|---|---|
| S01 | grok 3s | PASS | Hardtop intact, wheels turn, car approaches camera |
| S02 | grok 2s | PASS | Interior locked, head turn, office stays put |
| S03A | free push-in | PASS | |
| S03B | grok 2s | SOFT | Notification cards grow from 4 to 6. Reads as "more pile up", which fits the beat. Flagged to the director |
| S04 | grok 4s | PASS / SOFT | Noelle strides in. The exec smiles in the last second (the beat wants her stressed) |
| S05 | grok 2s | PASS | Hands up, then back to the keyboard |
| S06 | grok 2s | PASS | One phone, Eva screen stable |
| S07 | free push-in | PASS | UI text crisp. Caption moved to y=1600 so it doesn't cover the demo |
| S08 | grok 3s x2 | **FAIL x2** | Take 1: face/hair morph at 1.8s. Take 2: face drift, and the laptop closes and vanishes at 2.4s. Take 1 is a TEMP placeholder. Escalated |
| S09 | grok 2s | PASS | Glasses lower, lips closed. Background modern car mostly leaves frame |
| S10 | grok 4s | PASS | Single card handed over, Noelle's lips closed |
| S11 | grok 2s | PASS | Walks out continuously, glances back, one card |
| S12 / S12B | grok 5s | PASS | Single car recedes, roof stable |
| S12P | free crop push-in | PASS | BBY TIGR legible |

## Timing (measured TTS, pauses tightened by segment trims)
L1 3.40s, L3 1.80s, L6a 1.22s (slot 1.25), L6b 3.97s (slot 4.0), L7 0.76s. S04 and S10 were extended to 4s generations to fit.

## Spend (credits)
| Item | Credits |
|---|---|
| Voices: 8 Noelle and event lines + 6 candidates | ~3 |
| Music 32s | ~5 |
| Grok, 34s incl. 2 S08 takes | ~153 |
| **Total** | **161.1** (balance 1135.88 → 974.77) |
Remaining to finish: lip sync on 4 shots (~13s, ~47), an S08 fix (~13–14), and possibly 1 voice regen.
