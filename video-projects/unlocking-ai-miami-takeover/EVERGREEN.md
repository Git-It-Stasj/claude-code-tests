# Evergreen Event Swap: re-use an episode for a new Challenge date

The episode is permanent. **Only the "event pack" changes**, and it lives in its own file in `events/`.
A swap re-records two short voiceover lines and redraws the end card. **No re-animation is needed**, because Noelle is voiceover from the sunglasses shot onward.

**Cost:** about 1 credit (two short voice lines). **Time:** a few minutes.

---

## What changes and what stays

| Time | Shot | Beat | Changes per event? |
|---|---|---|---|
| 0–20.8s | 1–9 | Drive-in, problem, Rachel demo, owner amazed | **No**, evergreen |
| 20.8–22.3s | **10** | **Noelle lowers her sunglasses** | **Yes. VO slot L6a, max 1.2s (2–3 words).** Today: *"Black Friday."* |
| 22.3–26.0s | **11** | Noelle hands over the black invite card | **Yes. VO slot L6b, max 3.7s (8–10 words).** Today: *"Unlocking AI Challenge. Three to five Eastern."* |
| 26.0–27.3s | 12 | Walks out | No. *"I'll show you."* stays |
| 28.9–35.0s | 14A–13C | Plate, drive-off, **end card** | **Yes: event line, date, time, registration link, promo code** |

The captions for shots 10 and 11 follow the voiceover text automatically.

---

## The event pack (`events/<id>.json`)

```json
{
  "id": "spring-2027",
  "label": "Spring Unlocking AI Challenge, Mar 18 2027",
  "end_card": {
    "event_line": "SPRING KICKOFF",
    "date_line": "THURSDAY, MARCH 18, 2027",
    "time_line": "3:00-5:00 PM ET",
    "format_line": "LIVE",
    "registration": "stan.store/noelleai/unlockingai",
    "promo": "USE CODE XXXX  •  $27 → $1"
  },
  "invite_vo": {
    "L6a": { "text": "Spring kickoff.", "file": "audio/voices/events/spring-2027/L6a.mp3" },
    "L6b": { "text": "Unlocking AI Challenge. March eighteenth, three Eastern.", "file": "audio/voices/events/spring-2027/L6b.mp3" }
  }
}
```

- `promo` is optional. Delete the key and the yellow promo pill disappears.
- Start from `events/_TEMPLATE.json`. The current Black Friday pack is `events/black-friday-2026.json`.
- Write dates in the voiceover as words ("March eighteenth", "three Eastern") so the voice reads them naturally.

---

## How to run a swap

Paste this into a Claude Code chat in this repo and fill in the brackets:

> **Evergreen swap for EP01.** New event: **[name / hook]**, **[weekday, month day, year]**, **[time] ET**, **[LIVE or other]**.
> Registration: **[link, or "same"]**. Promo: **[code and price, or "none"]**.
> Shot 10 VO (sunglasses, max 3 words): **"[…]"**
> Shot 11 VO (invite card, max 10 words): **"[…]"**
> Follow EVERGREEN.md.

Claude then does these steps:
1. Copies `_TEMPLATE.json` to `events/<id>.json` and fills it in.
2. Generates the two lines in Noelle's locked voice: Sloane `b57b22a0-f287-405b-bc82-6f08f5e6bb1f`, stability 0.45, similarity_boost 0.8, `elevenlabs_v4`. It saves them to `audio/voices/events/<id>/L6a.mp3` and `L6b.mp3`.
3. Points the episode at the new pack: `"event": "events/<id>.json"` in `manifests/ep01-rachel-receptionist.json`.
4. Rebuilds:
   ```
   python3 scripts/build_overlays.py manifests/ep01-rachel-receptionist.json episodes/01-rachel-receptionist/overlays
   python3 scripts/assemble_vertical.py manifests/ep01-rachel-receptionist.json exports/vertical/EP01_rachel_9x16_<id>.mp4
   ```
   If a line runs longer than its slot, the build **stops and says which line is too long and by how much**. Claude then shortens the line or re-generates it with a faster delivery.
5. QA: checks a frame of the end card (date, time, link, promo) and listens to shots 10–12.

To go back to any earlier event, point `"event"` at its old pack and rebuild. Each event keeps its own files.

---

## Guardrails
- Use only links, codes and prices that Noelle's team supplies. Never invent them.
- Keep the invite in the same style: hook, then "Unlocking AI Challenge", then the time. Noelle's mouth isn't animated in shots 10–12, so any wording fits visually as long as it fits the time slot.
- Leave out guarantees and revenue claims (same rules as the series bible).
