// v3: readable text blocks + Noelle photo scene.  node build3.mjs a|b -> index.html
import fs from "node:fs";
const variant = process.argv[2] || "a";
const V = { a: { time: "10:00AM", co: "With KPMG, GitHub and Intuit" },
            b: { time: "12:45PM", co: "With KPMG, GitHub and Credit Karma" } }[variant];
const DUR = 37, BEAT = 60 / 128;
const B = (n) => (n === 0 ? 0 : +Math.min(DUR, 0.03 + n * BEAT).toFixed(3));
const AMB = "#FFC53D", WHT = "#FFFFFF", SOFT = "#D5D8FA";
let html = "", js = "", n = 0;

// text-block item. lines: {t,size,c,k:'hd'|'eye'|'bd'}
function item(o) {
  const id = "i" + n++, s = B(o.b0), e = B(o.b1), d = +(e - s).toFixed(3);
  const lines = o.lines.map((l) => {
    const k = l.k || "hd";
    const st = k === "eye" ? `font-family:'JetBrains Mono';font-weight:800;letter-spacing:.08em;line-height:1.2;`
      : k === "bd" ? `font-family:'Space Grotesk';font-weight:700;letter-spacing:0;line-height:1.25;text-transform:none;white-space:normal;padding:0 60px;` : "";
    const mb = Math.round(l.size * (l.gap ?? (k === "hd" ? 0.04 : 0.35)));
    const itl = k === "hd" && l.c === AMB ? "font-weight:800;font-style:italic;" : "";
    return `<div class="ln" style="font-size:${l.size}px;color:${l.c || WHT};margin-bottom:${mb}px;${itl}${st}">${l.t}</div>`;
  }).join("");
  html += `<div id="${id}" class="clip it" data-start="${s}" data-duration="${d}" data-track-index="${o.track || 3}" style="top:${o.top}px"><div class="in">${lines}</div></div>\n`;
  const from = `{y:60,opacity:0}`;
  const to = `{y:0,opacity:1,duration:.4,ease:"power3.out",stagger:${o.stag ?? 0.16}}`;
  js += `tl.fromTo("#${id} .ln",${from},${to},${+(s + (o.delay || 0)).toFixed(3)});`;
  js += `tl.fromTo("#${id} .in",{scale:1},{scale:1.035,duration:${d},ease:"none"},${s});`;
  js += `tl.to("#${id} .in",{opacity:0,duration:.14,ease:"power1.in"},${+(e - 0.14).toFixed(3)});\n`;
  return id;
}
const raw = (b0, b1, track, inner, style, tween, cls = "") => { const id = "r" + n++;
  const s = B(b0), e = B(b1);
  html += `<div id="${id}" class="clip it ${cls}" data-start="${s}" data-duration="${+(e - s).toFixed(3)}" data-track-index="${track}" style="${style}">${inner}</div>\n`;
  js += tween(id, s, e) + "\n"; return id; };
const E = (t) => ({ t, size: 34, c: AMB, k: "eye" });
const H = (t, size, c) => ({ t, size, c, k: "hd" });
const Bd = (t, size = 48, c = SOFT) => ({ t, size, c, k: "bd" });

// ---- HOOK (text now ANIMATES IN; frame 0 is the bare background) -----------
item({ b0: 0, b1: 5, top: 600, stag: .3, delay: .1, lines: [H("EVERYONE", 235), H("IS SPENDING", 182), H("ON AI.", 330, AMB)] });
item({ b0: 5, b1: 10, top: 600, lines: [H("WHO IS", 300), H("MEASURING", 222), H("THE VALUE?", 200, AMB)] });
// ---- SETTING ----------------------------------------------------------------
item({ b0: 10, b1: 15, top: 520, lines: [E("// MICROSOFT IGNITE 2026"), H("SAN FRANCISCO", 150), H("NOV 17–20", 240, AMB), Bd("Moscone Center and online")] });
item({ b0: 15, b1: 20, top: 500, lines: [E("// PRESENTED BY KPMG"), H("THE AI", 300), H("HOUSE", 300, AMB), Bd("The room where enterprise AI gets done.", 46, WHT)] });
// ---- NOELLE (photo scene, everything lands on a beat; 1s hold after last credential)
const NEND = 30.13;   // last credential at beat 28 (+1.0 s)
raw(20, NEND, 1, "", "left:0;top:0;width:1080px;height:1920px;background:#3518B2", (id, s) => `tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:.2},${s});`);
raw(20, NEND, 2, `<img src="assets/noelle.jpg" class="photo" alt="Noelle Russell on stage">`, "left:0;top:110px;width:1080px;height:1350px",
  (id, s, e) => `tl.fromTo("#${id} .photo",{scale:1.14,opacity:0,y:40},{scale:1.0,opacity:1,y:0,duration:.45,ease:"power3.out"},${s});tl.to("#${id} .photo",{scale:1.05,duration:${+(e - s - .45).toFixed(2)},ease:"none"},${+(s + .45).toFixed(2)});`);
item({ b0: 21, b1: NEND, top: 985, track: 4, lines: [H("NOELLE RUSSELL", 142)] });
item({ b0: 22, b1: NEND, top: 1135, track: 4, lines: [{ t: "FOUNDER, AI LEADERSHIP INSTITUTE", size: 28, c: AMB, k: "eye" }] });
["#1 Agentic AI Leader 2025", "5x Microsoft AI MVP", "3.4M+ learners", "TEDx speaker", "Best-selling author"].forEach((t, i) =>
  raw(24 + i, NEND, 4, `<div class="in row"><i></i>${t}</div>`, `left:0;width:1080px;top:${1215 + i * 84}px`,
    (id, s) => `tl.fromTo("#${id} .in",{x:-70,opacity:0},{x:0,opacity:1,duration:.22,ease:"power3.out"},${s});`));
// ---- SESSION ----------------------------------------------------------------
item({ b0: NEND, b1: 40, top: 520, lines: [E("// THE SESSION"), H("THE FRONTIER", 150, AMB), H("VALUE METHOD:", 150, AMB), H("FROM TOKEN SPEND", 112), H("TO BUSINESS VALUE", 112)], stag: .22 });
raw(40, 56, 3, `<div class="in" style="font-family:'Barlow Condensed';font-weight:900;font-size:96px;color:#FFC53D;text-transform:uppercase;line-height:.95;letter-spacing:.01em">The Frontier<br>Value Method</div>`, "left:0;width:1080px;top:300px;text-align:center",
  (id, s) => `tl.fromTo("#${id} .in",{y:50,opacity:0},{y:0,opacity:1,duration:.3,ease:"power3.out"},${s});`);
["Pick the right workflows", "Model the human&#8209;agent cost", "Underwrite outcomes, not tokens"].forEach((t, i) =>
  raw(41 + i * 3, 56, 4, `<div class="in step"><u>${i + 1}</u><span>${t}</span></div>`, `left:0;width:1080px;top:${640 + i * 270}px`,
    (id, s) => `tl.fromTo("#${id} .in",{x:-90,opacity:0},{x:0,opacity:1,duration:.3,ease:"power3.out"},${s});`));
raw(50, 56, 4, `<div class="in co">${V.co}</div>`, "left:0;width:1080px;top:1450px;text-align:center",
  (id, s) => `tl.fromTo("#${id} .in",{y:40,opacity:0},{y:0,opacity:1,duration:.3,ease:"power3.out"},${s});`);
// ---- DETAILS ----------------------------------------------------------------
raw(56, 68, 2, "", "left:90px;top:330px;width:900px;height:1020px;border-radius:44px;background:rgba(8,10,40,.78);border:4px solid #FFC53D;box-shadow:0 0 90px rgba(255,197,61,.35)",
  (id, s) => `tl.fromTo("#${id}",{opacity:0,scale:.9},{opacity:1,scale:1,duration:.4,ease:"power3.out"},${s});`);
const card = (b0, cy, lines, track = 4) => item({ b0, b1: 68, top: cy, track, lines });
card(56, 360, [E("// THE AI HOUSE · KPMG EXCHANGE")]);
card(57, 465, [H("WED", 170), H("NOV 18", 215)]);
card(60, 860, [H(V.time, 215, AMB), { t: "PACIFIC TIME", size: 30, k: "eye", c: WHT }]);
card(63, 1160, [H("KPMG EXCHANGE", 105), { t: "175 4TH ST, SAN FRANCISCO", size: 26, k: "eye", c: WHT }]);
item({ b0: 66, b1: 68, top: 1400, track: 4, lines: [{ t: "// INVITATION ONLY", size: 32, c: AMB, k: "eye" }] });
// ---- CLOSE ------------------------------------------------------------------
item({ b0: 68, b1: 79, top: 330, lines: [H("NOELLE", 290), H("RUSSELL", 270, AMB)] });
item({ b0: 71, b1: 79, top: 940, track: 4, lines: [H("RESPONSIBLE AI", 140), H("THAT SCALES.", 150, AMB)] });
raw(74, 79, 5, `<div class="in" style="margin:0 90px;padding:30px 10px;border:5px dashed #FFC53D;border-radius:30px;text-align:center;font-family:'JetBrains Mono';font-weight:800;font-size:36px;letter-spacing:.04em;color:#FFC53D;background:rgba(255,197,61,.10)">[ ADD HANDLE / SITE HERE ]</div>`,
  "left:0;width:1080px;top:1330px", (id, s) => `tl.fromTo("#${id} .in",{y:60,opacity:0},{y:0,opacity:1,duration:.3,ease:"power3.out"},${s});`);

// ---- backgrounds ------------------------------------------------------------
const vid = (id, src, b0, b1, ms, rate) => { const s = B(b0), e = B(b1);
  return `<video id="${id}" class="clip vid" src="assets/${src}" muted playsinline data-start="${s}" data-duration="${+(e - s).toFixed(3)}" data-media-start="${ms}" data-playback-rate="${rate}" data-track-index="0"></video>`; };
const vids = [vid("v1", "hf_tunnel.mp4", 0, 20, 0, 0.85), vid("v3", "hf_grid.mp4", 30.13, 56, 0, 0.65),
  vid("v4", "hf_tunnel.mp4", 56, 68, 1.5, 1), vid("v5", "hf_ribbon.mp4", 68, 79, 3, 1)].join("\n");
let beatJs = "";
for (let i = 0; i < 79; i++) beatJs += `tl.fromTo("#vidwrap",{scale:${i % 4 === 0 ? 1.07 : 1.035}},{scale:1,duration:.3,ease:"power3.out",immediateRender:false},${B(i)});\n`;
let hitJs = `tl.set("#flash",{opacity:0},0);tl.set("#ring0",{opacity:0},0);\n`;
[5, 10, 15, 20, 30.13, 40, 56, 68].forEach((b) => { const t = B(b);
  hitJs += `tl.fromTo("#flash",{opacity:.5},{opacity:0,duration:.25,ease:"power2.out",immediateRender:false},${t});`;
  hitJs += `tl.fromTo("#ring0",{scale:.1,opacity:.8},{scale:3.2,opacity:0,duration:.6,ease:"power2.out",immediateRender:false},${t});\n`; });

fs.writeFileSync("index.html", `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"Barlow Condensed";font-weight:900;font-style:normal;src:url("assets/fonts/BarlowCondensed-900.ttf")}
@font-face{font-family:"Barlow Condensed";font-weight:800;font-style:italic;src:url("assets/fonts/BarlowCondensed-800i.ttf")}
@font-face{font-family:"JetBrains Mono";font-weight:800;font-style:normal;src:url("assets/fonts/JetBrainsMono-800.ttf")}
@font-face{font-family:"Space Grotesk";font-weight:700;font-style:normal;src:url("assets/fonts/SpaceGrotesk-700.ttf")}
@font-face{font-family:"Space Grotesk";font-weight:500;font-style:normal;src:url("assets/fonts/SpaceGrotesk-500.ttf")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0A0E2E}
#root{position:absolute;inset:0;overflow:hidden;background:#0A0E2E;font-family:'Inter',sans-serif}
#vidwrap{position:absolute;inset:0}
.vid{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
#grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,10,40,.62) 0%,rgba(10,14,46,.5) 45%,rgba(30,12,80,.68) 100%)}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 40%,rgba(4,4,24,.75) 100%)}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
.ring{position:absolute;left:290px;top:760px;width:500px;height:500px;border-radius:50%;border:8px solid #FFC53D;opacity:0}
.it{position:absolute;left:0;width:1080px;text-align:center}
.ln{font-family:'Barlow Condensed',sans-serif;font-weight:900;text-transform:uppercase;line-height:.92;letter-spacing:.005em;white-space:nowrap;text-shadow:0 6px 40px rgba(0,0,0,.55)}
.photo{display:block;width:1080px;height:1350px;object-fit:cover;transform-origin:50% 0%;-webkit-mask-image:linear-gradient(180deg,#000 0%,#000 50%,rgba(0,0,0,0) 76%);mask-image:linear-gradient(180deg,#000 0%,#000 50%,rgba(0,0,0,0) 76%)}
.row{display:flex;align-items:center;gap:24px;justify-content:flex-start;padding-left:150px;font-family:'Space Grotesk';font-weight:700;font-size:50px;letter-spacing:-.005em;color:#fff;text-shadow:0 3px 20px rgba(20,8,90,.8);white-space:nowrap}
.row i{display:block;flex:none;width:13px;height:52px;border-radius:6px;background:#FFC53D}
.step{display:flex;align-items:center;gap:34px;text-align:left;padding:0 100px;font-family:'Space Grotesk';font-weight:700;font-size:60px;line-height:1.1;color:#fff}
.step u{flex:none;width:124px;height:124px;border-radius:50%;background:#FFC53D;color:#14103A;text-decoration:none;font-family:'Barlow Condensed';font-weight:900;font-size:78px;display:flex;align-items:center;justify-content:center}
.co{font-family:'Space Grotesk';font-weight:500;font-size:44px;color:#D5D8FA;padding:0 90px}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
<div id="vidwrap" data-layout-ignore>
${vids}
</div>
<div id="grade" data-layout-ignore></div><div id="vig" data-layout-ignore></div>
<div class="ring" id="ring0" data-layout-ignore></div>
${html}
<div id="flash" data-layout-ignore></div>
<audio id="music" src="assets/music.mp3" data-start="0" data-duration="37" data-track-index="9" data-volume="1" data-fade-out="0.6"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
${beatJs}
${hitJs}
${js}
window.__timelines["main"] = tl;
tl.seek(0);
</script></body></html>`);
console.log("items", n);
