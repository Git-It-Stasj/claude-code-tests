#!/usr/bin/env bash
# usage: qa_dl.sh <result_url> <out_name>   -> clips/<out>.mp4 + qa/<out>_strip.jpg (5 frames)
set -e
url=$1; name=$2
curl -s -o clips/$name.mp4 "$url"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 clips/$name.mp4)
T=$(mktemp -d); i=0; args=()
for f in 0 0.25 0.5 0.75 1; do t=$(python3 -c "print(max(0,min($d*$f,$d-0.12)))"); ffmpeg -v error -y -ss $t -i clips/$name.mp4 -frames:v 1 -vf scale=-1:560 $T/$i.png; args+=(-i $T/$i.png); i=$((i+1)); done
ffmpeg -v error -y "${args[@]}" -filter_complex hstack=5 qa/${name}_strip.jpg
rm -rf "${T:?}"; echo "$name $d"
