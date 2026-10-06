# YouTube transcripts: Andrej Karpathy channel

Channel listing: yt-dlp --flat-playlist -J on /videos (17 videos). /streams and /shorts tabs do not exist (yt-dlp: 'This channel does not have a streams/shorts tab'). Upload dates are null in videos.json: flat listing does not provide them and per-video metadata requests were blocked.

## Transcripts

| file | video id | title | caption type | words |
|---|---|---|---|---|
| (none) | | | | |

## Failed

Every video failed. Attempts:
- youtube-transcript-api on EWvNQjAaOHw: `RequestBlocked: Could not retrieve a transcript for the video https://www.youtube.com/watch?v=EWvNQjAaOHw! ... YouTube is blocking requests from your IP ... cloud provider`.
- yt-dlp fallback (--write-subs --write-auto-subs --skip-download --sub-langs en --sub-format json3) on EWvNQjAaOHw: `WARNING: Unable to download webpage: HTTP Error 429: Too Many Requests` then `ERROR: [youtube] EWvNQjAaOHw: Sign in to confirm you're not a bot. Use --cookies-from-browser or --cookies for authentication.`
- Cookies were not used and no proxy/TLS workaround was applied (README has no YouTube-specific tip). Because the block is IP-level, the remaining 16 videos were not requested individually; they are recorded as failed with the same cause (not individually tested).

| video id | title | error |
|---|---|---|
| EWvNQjAaOHw | How I use LLMs | RequestBlocked / HTTP 429 + bot check (IP blocked) (directly tested) |
| 7xTGNNLPyMI | Deep Dive into LLMs like ChatGPT | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| l8pRSuU81PU | Let's reproduce GPT-2 (124M) | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| zduSFxRajkE | Let's build the GPT Tokenizer | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| zjkBMFhNj_g | [1hr Talk] Intro to Large Language Models | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| kCc8FmEb1nY | Let's build GPT: from scratch, in code, spelled out. | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| t3YJ5hKiMQ0 | Building makemore Part 5: Building a WaveNet | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| q8SA3rM6ckI | Building makemore Part 4: Becoming a Backprop Ninja | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| P6sfmUTpUmc | Building makemore Part 3: Activations & Gradients, BatchNorm | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| TCH_1BHY58I | Building makemore Part 2: MLP | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| PaCmpygFfXo | The spelled-out intro to language modeling: building makemore | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| kVpDARqZdrQ | Stable diffusion dreams of psychedelic faces | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| 2oKjtvYslMY | Stable diffusion dreams of steampunk brains | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| sM9bozW295Q | Stable diffusion dreams of tattoos | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| VMj-3S1tku0 | The spelled-out intro to neural networks and backpropagation: building micrograd | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| vEnetcj_728 | Stable diffusion dreams of "blueberry spaghetti" for one night | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |
| Jv1ayv-04H4 | Stable diffusion dreams of steam punk neural networks | RequestBlocked / HTTP 429 + bot check (IP blocked) (not individually tested) |

Totals: 17 videos listed, 0 transcripts saved, 17 failed, 0 words.
