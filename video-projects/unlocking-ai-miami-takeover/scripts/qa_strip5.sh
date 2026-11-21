#!/usr/bin/env bash
# usage: qa_strip5.sh clip.mp4 out.jpg [height]  -> frames at 0/25/50/75/100% (bible section 10: >=5 timestamps)
set -e
in=$1; out=$2; h=${3:-300}
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
tmp=$(mktemp -d); args=(); i=0
for f in 0 0.25 0.5 0.75 1; do
  t=$(python3 -c "print(max(min($d*$f,$d-0.08),0))")
  ffmpeg -v error -y -ss $t -i "$in" -frames:v 1 -vf scale=-2:$h "$tmp/$i.png"; args+=(-i "$tmp/$i.png"); i=$((i+1))
done
ffmpeg -v error -y "${args[@]}" -filter_complex hstack=5 "$out"; rm -rf "$tmp"
