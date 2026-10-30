#!/usr/bin/env node
// One command: episode JSON -> validated build -> lint -> render 16:9 + 9:16 (with ducked music) -> QA frames -> VERIFY.md
// Usage: node make-reel.cjs <episode.json> [--out <dir>] [--draft]
const { spawnSync, spawn } = require("child_process");
const fs = require("fs"), path = require("path");
const HF = "hyperframes@0.8.214"; // pinned so every episode renders identically
const args = process.argv.slice(2);
const epPath = path.resolve(args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--out") || "");
const outBase = path.resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "architect-daily");
const draft = args.includes("--draft");
if (!fs.existsSync(epPath)) { console.error("usage: node make-reel.cjs <episode.json> [--out <dir>] [--draft]"); process.exit(2); }
const ep = JSON.parse(fs.readFileSync(epPath, "utf8"));
const slug = ep.date.slug, dir = path.join(outBase, slug), out = path.join(dir, "out");
const RATIOS = ["16x9", "9x16"], FRAME_TIMES = [1, 3, 7, 9, 13, 15, 18, 20, 25, 27, 29, 30.5, 32, 33.5, 34.5, 36];
const log = (m) => console.log("▸ " + m);
const run = (cmd, a, o = {}) => spawnSync(cmd, a, { encoding: "utf8", maxBuffer: 1 << 28, ...o });
function hf(a, cwd) { // npx cache can lose the exec bit; repair once and retry
  let r = run("npx", ["-y", HF, ...a], { cwd });
  if (/Permission denied/.test((r.stderr || "") + (r.stdout || ""))) { run("bash", ["-c", "chmod +x ~/.npm/_npx/*/node_modules/hyperframes/bin/*.mjs"]); r = run("npx", ["-y", HF, ...a], { cwd }); }
  return r;
}
const report = { slug, checks: [] };
const check = (name, ok, detail) => { report.checks.push({ name, ok, detail }); console.log((ok ? "  ✓ " : "  ✗ ") + name + (detail ? " — " + detail : "")); return ok; };

(async () => {
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(epPath, path.join(dir, "episode.json"));
  log("build + validate episode");
  let r = run("node", [path.join(__dirname, "build.cjs"), epPath, dir], { stdio: ["ignore", "inherit", "inherit"] });
  if (r.status !== 0) process.exit(r.status || 1);

  log("lint");
  for (const ratio of RATIOS) { const l = hf(["lint"], path.join(dir, ratio)); const m = /(\d+) error\(s\), (\d+) warning\(s\)/.exec(l.stdout + l.stderr);
    if (!check("lint " + ratio, m && m[1] === "0", m ? `${m[1]} errors, ${m[2]} warnings (sub-composition advice only is expected)` : "no lint summary")) process.exit(1); }

  log("connector geometry");
  r = run("node", [path.join(__dirname, "verify-connectors.cjs"), dir]); fs.writeFileSync(path.join(out, "connector-check.txt"), r.stdout);
  if (!check("connector lines end exactly at output-box top-center (both ratios)", r.status === 0, r.stdout.trim().slice(0, 160))) process.exit(1);

  log("render " + RATIOS.join(" + ") + (draft ? " (draft)" : ""));
  await Promise.all(RATIOS.map((ratio) => new Promise((res) => {
    const mp4 = path.join(out, `architect-daily-${slug}-${ratio}.mp4`);
    const p = spawn("npx", ["-y", HF, "render", "--quality", draft ? "draft" : "looks", "--fps", "30", "--output", mp4], { cwd: path.join(dir, ratio) });
    let t = ""; p.stdout.on("data", (d) => (t += d)); p.stderr.on("data", (d) => (t += d)); p.on("close", (c) => { if (c !== 0) { console.error(t.slice(-1500)); } res(); });
  })));

  log("probe + QA frames");
  const sizes = { "16x9": "1920,1080", "9x16": "1080,1920" };
  for (const ratio of RATIOS) {
    const mp4 = path.join(out, `architect-daily-${slug}-${ratio}.mp4`);
    if (!check("file exists " + ratio, fs.existsSync(mp4) && fs.statSync(mp4).size > 100000)) process.exit(1);
    const pr = run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,duration", "-of", "json", mp4]); const st = JSON.parse(pr.stdout).streams;
    const v = st.find((s) => s.codec_type === "video"), a = st.find((s) => s.codec_type === "audio");
    check(`${ratio} size/duration/audio`, `${v.width},${v.height}` === sizes[ratio] && Math.abs(parseFloat(v.duration) - 37) < 0.1 && !!a, `${v.width}x${v.height}, ${parseFloat(v.duration).toFixed(2)}s, audio ${a ? "yes" : "NO"}`);
    const fd = path.join(out, "frames-" + ratio); fs.rmSync(fd, { recursive: true, force: true }); fs.mkdirSync(fd, { recursive: true });
    for (const t of FRAME_TIMES) run("ffmpeg", ["-v", "error", "-y", "-ss", String(t), "-i", mp4, "-frames:v", "1", path.join(fd, `f_${t}s.png`)]);
    // blank/white detector: mean luma must sit between navy-dark and mid (paper scene is ~80; a blank white frame is ~235)
    let bad = [];
    for (const t of FRAME_TIMES) { const f = path.join(fd, `f_${t}s.png`); const q = run("ffmpeg", ["-hide_banner", "-i", f, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"]); const m = /YAVG=([\d.]+)/.exec(q.stderr); const y = m ? parseFloat(m[1]) : -1; if (!(y > 6 && y < 150)) bad.push(t + "s(Y=" + y + ")"); }
    check(`${ratio} no blank/white frames`, bad.length === 0, bad.join(", "));
    // contact strips for review
    const mk = (name, ts) => { const sc = ratio === "16x9" ? "640:-1" : "360:-1"; const inp = ts.flatMap((t) => ["-i", path.join(fd, `f_${t}s.png`)]);
      const fc = ts.map((_, i) => `[${i}:v]scale=${sc}[s${i}]`).join(";") + ";" + ts.map((_, i) => `[s${i}]`).join("") + `hstack=${ts.length}`;
      run("ffmpeg", ["-v", "error", "-y", ...inp, "-filter_complex", fc, "-frames:v", "1", path.join(out, `strip-${ratio}-${name}.png`)]); };
    const groups = ratio === "16x9" ? [[1, 3, 7], [9, 13, 15], [18, 20, 25], [27, 29, 30.5], [32, 33.5, 34.5], [36]] : [[1, 3, 7, 9, 13], [15, 18, 20, 25, 27], [29, 30.5, 32, 33.5, 34.5]];
    groups.filter((g) => g.length > 1).forEach((g, i) => mk("abcdef"[i], g));
    if (ratio === "16x9") mk("f", [34.5, 36].length > 1 ? [34.5, 36] : [36]);
  }
  log("audio duck check");
  const lvl = (mp4, t, d) => { const q = run("ffmpeg", ["-hide_banner", "-ss", String(t), "-t", String(d), "-i", mp4, "-af", "volumedetect", "-f", "null", "-"]); const m = /mean_volume: (-?[\d.]+) dB/.exec(q.stderr); return m ? parseFloat(m[1]) : -99; };
  const m16 = path.join(out, `architect-daily-${slug}-16x9.mp4`); const L = { t20: lvl(m16, 20, 2), t31: lvl(m16, 31, 2), t33: lvl(m16, 33, 1), t35: lvl(m16, 35, 1.5) };
  check("music ducks under the logo (35s at least 8 dB below 33s)", L.t33 - L.t35 >= 8 && L.t20 > -30, JSON.stringify(L));

  const ok = report.checks.every((c) => c.ok);
  const md = `# VERIFY - Architect Daily, ${ep.date.label}\n\nGenerated by \`make-reel.cjs\` (HyperFrames ${HF.split("@")[1]}, locked format). Quality: ${draft ? "draft" : "looks"}, 30 fps, 37.0 s, music bed ducked under the closing logo.\n\n## Automated checks\n${report.checks.map((c) => `- [${c.ok ? "x" : " "}] ${c.name}${c.detail ? " - " + c.detail : ""}`).join("\n")}\n\n## Look at the strips (visual confirmation)\nOpen \`strip-16x9-*.png\` and \`strip-9x16-*.png\` and confirm: scene order intro -> News 01 -> 02 -> 03 -> New to Me -> blinking cursor -> typed question -> logo; each news source line visible and not overlapping its caption; text fits its boxes; Airtable row fully filled with the gold check at 29 s; connectors touch the output boxes; no overlaps.\n\n- [ ] Strips reviewed\n\n## Locked format (cannot vary per episode)\nIntro 0-4 s, News 01/02/03 (4-10 / 10-16 / 16-21 s), New to Me 21-30 s, Close 30-37 s (cursor blink, typed "How did you use AI today?", lockup with tagline and handle). Brand colors, fonts, HUD, progress bar, music and ducking are fixed in \`scripts/build.cjs\`.\n`;
  fs.writeFileSync(path.join(out, "VERIFY.md"), md);
  console.log(`\n${ok ? "DONE" : "FINISHED WITH FAILURES"} -> ${out}\n  review strips, then deliver the two MP4s.`);
  process.exit(ok ? 0 : 1);
})();
