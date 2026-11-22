#!/usr/bin/env bash
# usage: qa_strip.sh clip.mp4 out.jpg "t1 t2 ..." [height]   (explicit timestamps, >=5 per project rule)
set -e; in=$1; out=$2; ts=$3; h=${4:-420}; T=$(mktemp -d); a=()
for t in $ts; do ffmpeg -nostdin -v error -ss $t -i "$in" -frames:v 1 -vf scale=-2:$h "$T/$t.png"; a+=(-i "$T/$t.png"); done
n=$(echo $ts | wc -w); ffmpeg -nostdin -v error -y "${a[@]}" -filter_complex hstack=$n "$out"; rm -rf "$T"
