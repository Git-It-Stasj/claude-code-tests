#!/usr/bin/env bash
# usage: qa_strip5.sh clip.mp4 out.jpg -> 5 evenly spaced frames side by side (0%, 25%, 50%, 75%, end)
set -e
in=$1; out=$2
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
tmp=$(mktemp -d); args=(); i=0
for p in 0 0.25 0.5 0.75 1; do t=$(python3 -c "print(max(min($d*$p,$d-0.08),0))"); ffmpeg -v error -y -ss $t -i "$in" -frames:v 1 -vf scale=-1:400 "$tmp/$i.png"; args+=(-i "$tmp/$i.png"); i=$((i+1)); done
ffmpeg -v error -y "${args[@]}" -filter_complex hstack=5 -q:v 4 "$out"
rm -rf "$tmp"
