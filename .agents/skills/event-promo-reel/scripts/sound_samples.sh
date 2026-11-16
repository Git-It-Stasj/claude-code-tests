#!/usr/bin/env bash
# Build in-context A/B samples so the requester judges a sound inside the reel, not in isolation.
#   sound_samples.sh <cues.json> <sfx-name> <rendered.mp4> <start_s> <len_s> <outdir> cand1.mp3 [cand2.mp3 ...]
# e.g. sound_samples.sh cues.json slam out/reel-9x16.mp4 3.0 5.0 samples audio/src/slamC.mp3 audio/src/slamD.mp3
# Each candidate replaces <sfx-name> in the full mix; the clip is that stretch of the rendered reel at 540 px.
set -euo pipefail
cues=$1; name=$2; video=$3; ss=$4; len=$5; outdir=$6; shift 6
here=$(cd "$(dirname "$0")" && pwd); mkdir -p "$outdir"
var=OVERRIDE_$(echo "$name" | tr '[:lower:]' '[:upper:]')
for cand in "$@"; do
  base=$(basename "${cand%.*}"); tmp="$outdir/.$base.m4a"
  env "$var=$cand" OUT="$tmp" python3 "$here/mix.py" "$cues" >/dev/null
  ffmpeg -v error -y -ss "$ss" -t "$len" -i "$video" -ss "$ss" -t "$len" -i "$tmp" -map 0:v -map 1:a \
    -vf scale=540:-2 -c:v libx264 -crf 24 -c:a aac -b:a 192k -shortest "$outdir/$name-$base.mp4"
  rm -f "$tmp"; echo "$outdir/$name-$base.mp4"
done
