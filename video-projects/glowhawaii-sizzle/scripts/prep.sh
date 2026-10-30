#!/usr/bin/env bash
# Copies shared assets into each HyperFrames project directory (they render from their own folder).
set -e
cd "$(dirname "$0")/.."
for r in 16x9 9x16; do
  mkdir -p $r/assets
  cp -r assets/fonts assets/vendor assets/shots assets/grain.png $r/assets/
  cp audio/architect-bed.m4a $r/assets/architect-bed.m4a
done
