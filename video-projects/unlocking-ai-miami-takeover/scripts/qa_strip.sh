#!/usr/bin/env bash
# usage: qa_strip.sh clip.mp4 out.jpg  -> first/middle/last frame strip
set -e
in=$1; out=$2
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
m=$(python3 -c "print($d/2)"); l=$(python3 -c "print(max($d-0.08,0))")
tmp=$(mktemp -d)
for t in 0 $m $l; do ffmpeg -v error -y -ss $t -i "$in" -frames:v 1 -vf scale=-1:360 "$tmp/$t.png"; done
ffmpeg -v error -y -i "$tmp/0.png" -i "$tmp/$m.png" -i "$tmp/$l.png" -filter_complex hstack=3 "$out"
rm -rf "$tmp"
