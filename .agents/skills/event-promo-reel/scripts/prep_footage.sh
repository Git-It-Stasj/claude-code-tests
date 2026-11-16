#!/usr/bin/env bash
# Retime one AI clip to an exact beat-length segment at 30 fps so the <video> plays 1:1 in HyperFrames.
#   prep_footage.sh <src.mp4> <out.mp4> <seconds_needed> [speed=1.0] [use_first_seconds]
# speed >1 speeds up (setpts=PTS/speed). use_first_seconds keeps only the clean head of a clip
# (e.g. before AI-garbled text appears) and slows it to fill <seconds_needed> with motion interpolation.
# Also writes <out>.strip.png (6 frames) — LOOK at it for garbled pseudo-text, warped hands, logos.
set -euo pipefail
src=$1; out=$2; need=$3; speed=${4:-1.0}; head=${5:-}
enc="-an -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -r 30"
pad=$(python3 -c "print($need+0.1)")
if [ -n "$head" ]; then
  f=$(python3 -c "print(($need+0.4)/$head)")
  ffmpeg -v error -y -i "$src" -vf "trim=0:$head,setpts=PTS-STARTPTS,setpts=PTS*$f,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,trim=0:$pad,setpts=PTS-STARTPTS" $enc "$out"
else
  ffmpeg -v error -y -i "$src" -vf "setpts=PTS/$speed,fps=30,trim=0:$pad,setpts=PTS-STARTPTS" $enc "$out"
fi
ffmpeg -v error -y -i "$out" -vf "fps=6/$need,scale=220:-1,tile=6x1" -frames:v 1 "$out.strip.png"
printf '%s %ss\n' "$out" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")"
