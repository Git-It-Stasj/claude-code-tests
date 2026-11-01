#!/usr/bin/env bash
# Pipeline stages for one client. Usage: produce.sh <videoDir> <prepare|render|status|finish> [path/to/12-report.html]
# Stages are separate so none of them outlasts a tool timeout: prepare (music, build, QA gates) -> render (background) -> status (poll) -> finish (remux, QA, sheets, VERIFY.md)
set -euo pipefail
SK="$(cd "$(dirname "$0")/.." && pwd)"; VID="$(cd "$1" && pwd)"; STAGE="${2:-}"; REPORT="${3:-$VID/../12-report.html}"
HF="hyperframes@0.8.222"; export NODE_PATH="$(npm root -g 2>/dev/null || true)"
case "$STAGE" in
prepare)
  mkdir -p "$VID/audio" "$VID/out" "$VID/qa"
  python3 "$SK/scripts/music.py" "$VID/grid.json" "$VID/audio/bed.wav"
  ffmpeg -y -loglevel error -i "$VID/audio/bed.wav" -af loudnorm=I=-14:TP=-1.2:LRA=7 -c:a aac -b:a 192k "$VID/audio/bed.m4a"
  node "$SK/scripts/build.cjs" "$VID"
  for r in 16x9 9x16; do
    mkdir -p "$VID/$r/assets"
    cp -r "$SK/assets/fonts" "$SK/assets/vendor" "$SK/assets/grain.png" "$VID/$r/assets/"
    cp -r "$VID/assets/shots" "$VID/$r/assets/"
    [ -f "$VID/assets/photo.jpg" ] && cp "$VID/assets/photo.jpg" "$VID/$r/assets/photo.jpg"
    cp "$VID/audio/bed.m4a" "$VID/$r/assets/architect-bed.m4a"
  done
  node "$SK/scripts/qa-text.cjs" "$VID" "$REPORT" | python3 -c "
import sys,json
d=json.load(sys.stdin); bad=False
for r in ('16x9','9x16'):
    v=d['verbatim'][r]; l=d['layout'][r]
    print(r,'verbatim',v['checked'],'strings,',len(v['mismatches']),'mismatches | min font',l['minFont'],'| layout issues',len(l['issues']))
    for m in v['mismatches']: print('   MISMATCH:',m); bad=True
    for i in l['issues']: print('   ISSUE:',i); bad=True
sys.exit(1 if bad else 0)"
  for r in 16x9 9x16; do (cd "$VID/$r" && npx -y $HF check --json 2>/dev/null | python3 -c "
import sys,json
raw=sys.stdin.read(); d=json.loads(raw[raw.index('{\n  \"ok\"'):]); print('$r lint errors',d['lint']['errorCount'],'warnings',d['lint']['warningCount']); sys.exit(1 if d['lint']['errorCount'] else 0)"); done
  echo "PREPARE OK"
  ;;
render)
  rm -f "$VID/out/16x9.raw.mp4" "$VID/out/9x16.raw.mp4"
  for r in 16x9 9x16; do (cd "$VID/$r" && nohup npx -y $HF render -o "$VID/out/$r.raw.mp4" -q looks --fps 30 -w 3 --quiet > "$VID/qa/render-$r.log" 2>&1 &); done
  echo "renders started (poll with: produce.sh $VID status)"
  ;;
status)
  # a render is running while its npx process exists; sizes grow only at the end
  if pgrep -f "$HF render" >/dev/null 2>&1 || ps aux | grep -q "[h]yperframes@0.8.222 render"; then echo "RUNNING"; else ls -la "$VID/out"/*.raw.mp4 2>/dev/null && echo "DONE" || { echo "NO OUTPUT (check qa/render-*.log)"; exit 1; }; fi
  ;;
finish)
  : > "$VID/qa/probe.json"; PROBE='{}'
  for r in 16x9 9x16; do
    ffmpeg -y -loglevel error -i "$VID/out/$r.raw.mp4" -i "$VID/audio/bed.m4a" -map 0:v -map 1:a -c copy -shortest -movflags +faststart "$VID/out/$r.mp4"
    python3 "$SK/scripts/qa-cuts.py" "$VID/out/$r.mp4" > "$VID/qa/cuts-$r.txt" || true
    ffmpeg -i "$VID/out/$r.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' ' | tr '\n' ' ' > "$VID/qa/loud-$r.txt" || true
  done
  python3 - "$VID" <<'PY'
import sys,json,re,subprocess
d=sys.argv[1]; probe={}
for r in ('16x9','9x16'):
    o=subprocess.run(['ffprobe','-v','error','-show_entries','stream=codec_type,width,height,duration','-of','csv=p=0',f'{d}/out/{r}.mp4'],capture_output=True,text=True).stdout.split()
    v=[x for x in o if x.startswith('video')][0].split(','); probe[r]=f'{v[1]}x{v[2]} {float(v[3]):.1f} s + audio'
json.dump(probe,open(f'{d}/qa/probe.json','w'))
t=open(f'{d}/qa/loud-16x9.txt').read(); m=re.search(r'I:\s*(-?[\d.]+) LUFS',t); p=re.search(r'Peak:\s*(-?[\d.]+) dBFS',t)
json.dump({'lufs':m.group(1) if m else None,'peak':p.group(1) if p else None},open(f'{d}/qa/loudness.json','w'))
PY
  python3 "$SK/scripts/sheets.py" "$VID"
  node "$SK/scripts/write-verify.cjs" "$VID"
  echo "FINISH OK: $VID/out/16x9.mp4  $VID/out/9x16.mp4"
  ;;
*) echo "usage: produce.sh <videoDir> <prepare|render|status|finish> [report]"; exit 2;;
esac
