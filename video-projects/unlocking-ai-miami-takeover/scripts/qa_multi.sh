#!/usr/bin/env bash
# usage: qa_multi.sh clip.mp4 out.jpg [n=6] -> n frames evenly spaced, timestamped, side by side
set -e; in=$1; out=$2; n=${3:-6}; tmp=$(mktemp -d)
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in"); args=""
for i in $(seq 0 $((n-1))); do t=$(python3 -c "print(round(min($i*$d/($n-1),$d-0.1),2))")
  ffmpeg -v error -y -ss $t -i "$in" -frames:v 1 -vf "scale=-1:420,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='$t':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black" "$tmp/$i.png"; args="$args -i $tmp/$i.png"; done
ffmpeg -v error -y $args -filter_complex hstack=$n "$out"; rm -rf "$tmp"
