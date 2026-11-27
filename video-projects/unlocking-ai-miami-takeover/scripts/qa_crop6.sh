#!/usr/bin/env bash
# usage: qa_crop6.sh clip.mp4 out.jpg "crop=w:h:x:y" -> 6 evenly spaced cropped frames side by side (lip-sync QA)
set -e
in=$1; out=$2; crop=$3
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
tmp=$(mktemp -d); args=(); i=0
for p in 0.08 0.25 0.42 0.58 0.75 0.92; do t=$(python3 -c "print($d*$p)"); ffmpeg -v error -y -ss $t -i "$in" -frames:v 1 -vf "$crop,scale=-1:300" "$tmp/$i.png"; args+=(-i "$tmp/$i.png"); i=$((i+1)); done
ffmpeg -v error -y "${args[@]}" -filter_complex hstack=6 -q:v 4 "$out"
rm -rf "$tmp"
