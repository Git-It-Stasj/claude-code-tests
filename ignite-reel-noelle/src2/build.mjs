// node build.mjs a|b  -> index.html   (a = brief fact list, b = Noelle's LinkedIn post)
import fs from "node:fs";
const variant = process.argv[2] || "a";
const V = { a: { time: "10:00AM", co: ["KPMG, GITHUB", "AND INTUIT"] },
            b: { time: "12:45PM", co: ["KPMG, GITHUB", "AND CREDIT KARMA"] } }[variant];
const DUR = 37, BEAT = 60 / 128;
const B = (n) => (n === 0 ? 0 : +Math.min(DUR, 0.03 + n * BEAT).toFixed(3));
const AMB = "#FFC53D", WHT = "#FFFFFF";
let html = "", js = "", n = 0;

// ---- generic kinetic-type item ------------------------------------------------
function item(o) {
  const id = "i" + n++;
  const s = B(o.b0), e = B(o.b1), d = +(e - s).toFixed(3);
  const gap = o.gap ?? 0.04;
  const hs = o.lines.map((l) => l.size * 0.88);
  const total = hs.reduce((a, b) => a + b, 0) + gap * o.lines.reduce((a, l) => a + l.size, 0) / 1;
  const top = Math.round((o.cy ?? 880) - total / 2);
  const lines = o.lines.map((l) => {
    const inner = o.fx === "letters" ? [...l.t].map((c) => `<span class="ch">${c === " " ? "&nbsp;" : c}</span>`).join("") : l.t;
    const ff = l.sans ? "font-family:'Inter';font-weight:900;letter-spacing:.14em;line-height:1.1;" : "";
    return `<div class="ln${l.caps === false ? " nc" : ""}" style="font-size:${l.size}px;color:${l.c || WHT};margin-bottom:${Math.round(l.size * gap)}px;${ff}${l.css || ""}">${inner}</div>`;
  }).join("");
  html += `<div id="${id}" class="clip it" data-start="${s}" data-duration="${d}" data-track-index="${o.track || 3}" style="top:${top}px"><div class="in">${lines}</div></div>\n`;
  const rot = (n % 2 ? 1 : -1) * 2.2;
  if (o.fx === "letters") {
    js += `tl.fromTo("#${id} .ch",{y:220,opacity:0,rotation:9},{y:0,opacity:1,rotation:0,duration:.3,ease:"back.out(1.7)",stagger:.035},${s});`;
    js += `tl.fromTo("#${id} .in",{scale:1.0},{scale:1.05,duration:${d},ease:"none"},${s});\n`;
  } else if (o.fx === "stag") {
    js += `tl.fromTo("#${id} .ln",{y:110,opacity:0,scale:1.15},{y:0,opacity:1,scale:1,duration:.24,ease:"power4.out",stagger:${o.stag ?? 0.09}},${s});`;
    js += `tl.fromTo("#${id} .in",{scale:1.0},{scale:1.05,duration:${d},ease:"none"},${s});\n`;
  } else if (o.first) {
    js += `tl.fromTo("#${id} .in",{scale:1.4,opacity:1},{scale:1,duration:.22,ease:"expo.out"},${s});`;
    js += `tl.to("#${id} .in",{scale:1.06,duration:${d - 0.22},ease:"none"},${s + 0.22});\n`;
  } else {
    js += `tl.fromTo("#${id} .in",{scale:2.3,opacity:0,rotation:${rot}},{scale:1,opacity:1,rotation:0,duration:.17,ease:"expo.out"},${s});`;
    js += `tl.to("#${id} .in",{scale:1.06,duration:${Math.max(0.05, d - 0.17)},ease:"none"},${s + 0.17});\n`;
  }
  return id;
}
const raw = (b0, b1, track, inner, style, tween) => { const id = "r" + n++;
  const s = B(b0), e = B(b1);
  html += `<div id="${id}" class="clip it" data-start="${s}" data-duration="${+(e - s).toFixed(3)}" data-track-index="${track}" style="${style}">${inner}</div>\n`;
  js += tween(id, s, e) + "\n"; return id; };
const L = (t, size, c) => ({ t, size, c });
const W = (b0, b1, t, size, c, extra = {}) => item({ b0, b1, lines: [L(t, size, c)], ...extra });

// ---- A  HOOK  (beats 0-8) ------------------------------------------------------
W(0, 1, "EVERYONE", 290, WHT, { first: true });
W(1, 2, "IS", 440); W(2, 3, "SPENDING", 290); W(3, 4, "ON AI.", 420, AMB);
W(4, 5, "WHO'S", 400); W(5, 6, "MEASURING", 270); W(6, 7, "THE", 460); W(7, 8, "VALUE?", 380, AMB);
// ---- B  SETTING (8-20) ---------------------------------------------------------
W(8, 9, "MICROSOFT", 250); W(9, 10, "IGNITE", 360); W(10, 11, "2026", 460, AMB);
item({ b0: 11, b1: 12.5, lines: [L("SAN", 330, AMB), L("FRANCISCO", 270)], fx: "stag" });
W(12.5, 14, "NOV 17–20", 250, WHT, { fx: "stag" });
item({ b0: 14, b1: 17, lines: [L("THE AI", 360), L("HOUSE", 360, AMB), { t: "PRESENTED BY KPMG", size: 44, c: WHT, sans: true, caps: true }], fx: "stag", stag: 0.12 });
item({ b0: 17, b1: 20, lines: [L("THE ROOM WHERE", 190), L("ENTERPRISE AI", 190), L("GETS DONE.", 190, AMB)], fx: "stag", stag: 0.22 });
// ---- C  NOELLE (20-36) ---------------------------------------------------------
item({ b0: 20, b1: 24, lines: [L("NOELLE", 380), L("RUSSELL", 340, AMB)], fx: "letters", cy: 800 });
item({ b0: 22, b1: 24, lines: [{ t: "FOUNDER, AI LEADERSHIP INSTITUTE", size: 38, c: WHT, sans: true }], fx: "stag", cy: 1290, track: 4 });
item({ b0: 24, b1: 27, lines: [L("#1", 620, AMB), L("AGENTIC AI LEADER", 135), L("2025", 135, AMB)], fx: "stag", stag: .1 });
item({ b0: 27, b1: 30, lines: [L("5X", 620, AMB), L("MICROSOFT AI MVP", 140)], fx: "stag", stag: .1 });
const cnt = item({ b0: 30, b1: 33, lines: [L("3.4M+", 430, AMB), L("LEARNERS", 230)], fx: "stag", stag: .1 });
js += `{const o={v:0},el=document.querySelector("#${cnt} .ln");tl.to(o,{v:3.4,duration:.55,ease:"power2.out",onUpdate(){el.textContent=o.v.toFixed(1)+"M+";}},${B(30)});}\n`;
item({ b0: 33, b1: 36, lines: [{ t: "TEDx SPEAKER", size: 190, caps: false }, L("& BEST-SELLING", 150, AMB), L("AUTHOR", 150, AMB)], fx: "stag", stag: .11 });
// ---- D  SESSION (36-58) --------------------------------------------------------
const tok = item({ b0: 36, b1: 38, lines: [L("TOKEN", 400), L("SPEND", 400)], fx: "stag", stag: .12 });
raw(37.3, 38, 4, "", "left:90px;top:870px;width:900px;height:34px;background:#FFC53D;box-shadow:0 0 40px #FFC53D", (id, s) => `tl.fromTo("#${id}",{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:.18,ease:"power4.out"},${s});`);
item({ b0: 38, b1: 40, lines: [{ t: "TO", size: 40, sans: true, c: AMB }, L("BUSINESS", 290), L("VALUE", 500, AMB)], fx: "stag", stag: .1 });
item({ b0: 40, b1: 44, lines: [L("THE", 160, AMB), L("FRONTIER", 300), L("VALUE METHOD", 175, AMB)], fx: "stag", stag: .16 });
item({ b0: 44, b1: 47.5, lines: [L("01", 300, AMB), L("PICK THE RIGHT", 160), L("WORKFLOWS", 270, AMB)], fx: "stag", stag: .1 });
item({ b0: 47.5, b1: 51, lines: [L("02", 300, AMB), L("MODEL THE", 190), L("HUMAN-AGENT", 190, AMB), L("COST", 300)], fx: "stag", stag: .1 });
item({ b0: 51, b1: 55, lines: [L("03", 300, AMB), L("UNDERWRITE", 225), L("OUTCOMES.", 225, AMB), L("NOT TOKENS.", 225)], fx: "stag", stag: .1 });
item({ b0: 55, b1: 58, lines: [{ t: "WITH", size: 40, sans: true, c: AMB }, L(V.co[0], 190), L(V.co[1], 190, AMB)], fx: "stag", stag: .12 });
// ---- E  DETAILS (58-70) --------------------------------------------------------
raw(58, 70, 2, "", "left:90px;top:330px;width:900px;height:1020px;border-radius:44px;background:rgba(8,10,40,.78);border:4px solid #FFC53D;box-shadow:0 0 90px rgba(255,197,61,.35)",
  (id, s) => `tl.fromTo("#${id}",{opacity:0,scale:.8},{opacity:1,scale:1,duration:.3,ease:"back.out(1.5)"},${s});`);
item({ b0: 58, b1: 70, lines: [{ t: "THE AI HOUSE · KPMG EXCHANGE", size: 34, c: AMB, sans: true }], fx: "stag", cy: 400, track: 4 });
item({ b0: 58.5, b1: 70, lines: [L("WED", 190), L("NOV 18", 230)], fx: "stag", cy: 630, track: 4, stag: .12 });
item({ b0: 61, b1: 70, lines: [L(V.time, 230, AMB), { t: "PACIFIC TIME", size: 34, sans: true }], fx: "stag", cy: 975, track: 4, stag: .12 });
item({ b0: 64, b1: 70, lines: [L("KPMG EXCHANGE", 120), { t: "175 4TH ST, SAN FRANCISCO", size: 32, sans: true, c: WHT }], fx: "stag", cy: 1215, track: 4, stag: .12 });
item({ b0: 67, b1: 70, lines: [{ t: "INVITATION ONLY", size: 36, c: AMB, sans: true }], fx: "stag", cy: 1440, track: 4 });
// ---- F  CLOSE (70-79) ----------------------------------------------------------
item({ b0: 70, b1: 79, lines: [L("NOELLE", 340), L("RUSSELL", 300, AMB)], fx: "letters", cy: 560 });
item({ b0: 73, b1: 79, lines: [L("RESPONSIBLE AI", 170), L("THAT SCALES.", 170, AMB)], fx: "stag", cy: 1080, track: 4, stag: .2 });
raw(75.5, 79, 5, `<div class="in" style="margin:0 90px;padding:30px 10px;border:5px dashed #FFC53D;border-radius:30px;text-align:center;font-family:Inter;font-weight:900;font-size:42px;letter-spacing:.06em;color:#FFC53D;background:rgba(255,197,61,.10)">[ ADD HANDLE / SITE HERE ]</div>`,
  "left:0;width:1080px;top:1330px", (id, s) => `tl.fromTo("#${id} .in",{y:80,opacity:0,scale:1.2},{y:0,opacity:1,scale:1,duration:.28,ease:"back.out(1.6)"},${s});`);

// ---- backgrounds (Higgsfield / MiniMax H3 Max clips) ---------------------------
const vid = (id, src, b0, b1, ms, rate) => { const s = B(b0), e = B(b1);
  return `<video id="${id}" class="clip vid" src="assets/${src}" muted playsinline data-start="${s}" data-duration="${+(e - s).toFixed(3)}" data-media-start="${ms}" data-playback-rate="${rate}" data-track-index="0"></video>`; };
const vids = [vid("v1", "hf_tunnel.mp4", 0, 20, 0, 0.8), vid("v2", "hf_ribbon.mp4", 20, 36, 0, 1), vid("v3", "hf_grid.mp4", 36, 58, 0, 0.75),
  vid("v4", "hf_tunnel.mp4", 58, 70, 1.5, 1), vid("v5", "hf_ribbon.mp4", 70, 79, 3, 1)].join("\n");

// ---- global beat engine --------------------------------------------------------
let beatJs = "";
for (let i = 0; i < 79; i++) { const t = B(i);
  beatJs += `tl.fromTo("#vidwrap",{scale:${i % 4 === 0 ? 1.1 : 1.05}},{scale:1,duration:.3,ease:"power3.out",immediateRender:false},${t});`;
  beatJs += `tl.fromTo("#pulse",{opacity:${i % 4 === 0 ? 0.28 : 0.1}},{opacity:0,duration:.22,ease:"power2.out",immediateRender:false},${t});\n`; }
const hits = [8, 14, 17, 20, 24, 27, 30, 33, 36, 38, 40, 44, 47.5, 51, 55, 58, 64, 70, 73, 77];
let hitJs = "";
hits.forEach((b, i) => { const t = B(b);
  hitJs += `tl.fromTo("#flash",{opacity:.75},{opacity:0,duration:.2,ease:"power2.out",immediateRender:false},${t});`;
  hitJs += `tl.fromTo("#ring${i % 2}",{scale:.1,opacity:.9},{scale:3.2,opacity:0,duration:.55,ease:"power2.out",immediateRender:false},${t});\n`; });
hitJs = `tl.set("#flash",{opacity:0},0);tl.set("#ring0,#ring1",{opacity:0},0);tl.set("#pulse",{opacity:0},0);\n` + hitJs;

const out = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0A0E2E}
#root{position:absolute;inset:0;overflow:hidden;background:#0A0E2E;font-family:'Inter',sans-serif}
#vidwrap{position:absolute;inset:0}
.vid{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
#grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,10,40,.55) 0%,rgba(10,14,46,.38) 45%,rgba(30,12,80,.6) 100%)}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 40%,rgba(4,4,24,.75) 100%)}
#pulse{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,197,61,.55),rgba(255,197,61,0) 65%);opacity:0;mix-blend-mode:screen}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
.ring{position:absolute;left:290px;top:760px;width:500px;height:500px;border-radius:50%;border:8px solid #FFC53D;opacity:0}
.it{position:absolute;left:0;width:1080px;text-align:center}
.ln{font-family:'League Gothic','Oswald',sans-serif;text-transform:uppercase;line-height:.88;white-space:nowrap;text-shadow:0 8px 50px rgba(0,0,0,.55)}
.ln.nc{text-transform:none}
.ch{display:inline-block}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
<div id="vidwrap" data-layout-ignore>
${vids}
</div>
<div id="grade" data-layout-ignore></div><div id="vig" data-layout-ignore></div><div id="pulse" data-layout-ignore></div>
<div class="ring" id="ring0" data-layout-ignore></div><div class="ring" id="ring1" data-layout-ignore></div>
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
</script></body></html>`;
fs.writeFileSync("index.html", out);
console.log("items", n);
