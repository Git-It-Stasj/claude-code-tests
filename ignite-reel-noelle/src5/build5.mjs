// v5: graphics upgrade + AEO-friendly on-screen entities.  node build5.mjs a|b -> index.html
import fs from "node:fs";
const variant = process.argv[2] || "a";
// format: "916" (default, 1080x1920) or "45" (1080x1350 for LinkedIn feed)
const F45 = process.argv[3] === "45", P = (a, b) => (F45 ? b : a), HGT = P(1920, 1350);
const hk = (x) => Math.round(P(x, x * 0.88));
const LG = { kpmg: `<img src="assets/logos/kpmg.svg" alt="KPMG" style="height:92px">`, gh: `<img src="assets/logos/github-mark.svg" alt="" style="height:78px"><img src="assets/logos/github-wordmark.svg" alt="GitHub" style="height:74px">`,
  intuit: `<img src="assets/logos/intuit.svg" alt="Intuit" style="height:62px">`, ck: `<img src="assets/logos/creditkarma.svg" alt="Credit Karma" style="height:60px">` };
const V = { a: { time: "10:00AM", co: "With KPMG, GitHub and Intuit", logos: [LG.kpmg, LG.gh, LG.intuit] },
            b: { time: "12:45PM", co: "With KPMG, GitHub and Credit Karma", logos: [LG.kpmg, LG.gh, LG.ck] } }[variant];
const DUR = 35, BEAT = 60 / 128;   // ends on the ticket; final hit on beat 68 (32.13 s) rings out to 35 s
// The music (ElevenLabs take 3) drifts 0.226 s late after its breakdown (~beat 57); cues from beat 58 on follow the music's real beats.
const LATE_FROM = 58, LATE = 0.226;
const B = (n) => (n === 0 ? 0 : +Math.min(DUR, 0.03 + n * BEAT + (n >= LATE_FROM ? LATE : 0)).toFixed(3));
const r3 = (x) => +x.toFixed(3);
const AMB = "#FFC53D", WHT = "#FFFFFF", SOFT = "#D5D8FA", NAVY = "#0A0E2E";
let html = "", js = "", n = 0;
const T = (s) => js += s + "\n";

// ---------- text helpers --------------------------------------------------------
const words = (t) => t.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");
const chars = (t) => [...t].map((c) => c === " " ? " " : `<span class="c">${c}</span>`).join("");
function lineStyle(l) {
  const k = l.k || "hd";
  const st = k === "eye" ? `font-family:'JetBrains Mono';font-weight:800;letter-spacing:.1em;line-height:1.2;`
    : k === "bd" ? `font-family:'Space Grotesk';font-weight:700;letter-spacing:0;line-height:1.22;text-transform:none;white-space:normal;padding:0 ${l.pad ?? 60}px;` : "";
  const itl = k === "hd" && l.c === AMB ? "font-weight:800;font-style:italic;" : "";
  const mb = Math.round(l.size * (l.gap ?? (k === "hd" ? 0.0 : 0.35)));
  return `font-size:${l.size}px;color:${l.c || WHT};margin-bottom:${mb}px;${itl}${st}`;
}
// mode: rise (masked line rise), blur (per-word blur-in), letters (per-letter)
function item(o) {
  const id = "i" + n++, s = B(o.b0), e = B(o.b1), d = r3(e - s), mode = o.mode || "rise";
  const lines = o.lines.map((l, i) => {
    const inner = mode === "blur" ? words(l.t) : mode === "letters" && (l.k || "hd") === "hd" ? chars(l.t) : l.t;
    return mode === "rise"
      ? `<div class="mk"><div class="ln L${i}" style="${lineStyle(l)}">${inner}</div></div>`
      : `<div class="ln L${i}" style="${lineStyle(l)}">${inner}</div>`;
  }).join("");
  html += `<div id="${id}" class="clip it" data-start="${s}" data-duration="${d}" data-track-index="${o.track || 3}" style="top:${o.top}px;${o.style || ""}"><div class="in">${lines}</div></div>\n`;
  o.lines.forEach((l, i) => {
    const t0 = o.at ? B(o.at[i]) : r3(s + (o.delay || 0) + i * (o.stag ?? 0.14));
    const sel = `#${id} .L${i}`;
    if (mode === "rise") T(`tl.fromTo("${sel}",{yPercent:105},{yPercent:0,duration:.55,ease:"expo.out"},${t0});`);
    else if (mode === "blur") T(`tl.fromTo("${sel} .w",{opacity:0,filter:"blur(16px)"},{opacity:1,filter:"blur(0px)",duration:.22,ease:"power2.out",stagger:.07},${t0});`);
    else if ((l.k || "hd") === "hd") T(`tl.fromTo("${sel} .c",{opacity:0,filter:"blur(10px)",y:-30},{opacity:1,filter:"blur(0px)",y:0,duration:.25,ease:"power3.out",stagger:.035},${t0});`);
    else T(`tl.fromTo("${sel}",{opacity:0,filter:"blur(10px)"},{opacity:1,filter:"blur(0px)",duration:.25,ease:"power2.out"},${t0});`);
  });
  if (!o.noExit && e < DUR - .01) T(`tl.to("#${id} .in",{opacity:0,filter:"blur(12px)",duration:.16,ease:"power2.in"},${r3(e - 0.17)});`);
  return id;
}
const raw = (b0, b1, track, inner, style, tween, cls = "") => { const id = "r" + n++;
  const s = B(b0), e = B(b1);
  html += `<div id="${id}" class="clip ${cls}" data-start="${s}" data-duration="${r3(e - s)}" data-track-index="${track}" style="position:absolute;${style}">${inner}</div>\n`;
  if (tween) T(tween(id, s, e)); return id; };
const exitBlur = (id, e, sel = ".in") => e >= DUR - .01 ? "" : `tl.to("#${id} ${sel}",{opacity:0,filter:"blur(12px)",duration:.16,ease:"power2.in"},${r3(e - .17)});`;
const E = (t, c = AMB, size = 32) => ({ t, size, c, k: "eye", gap: .45 });
const H = (t, size, c) => ({ t, size, c, k: "hd" });
const Bd = (t, size = 48, c = SOFT, pad) => ({ t, size, c, k: "bd", pad });

// ================= 01 THE PROBLEM (hook) =========================================
// lines land ON the beat: 0.1 s, beat 1, beat 2 (frame 0 = background + HUD + chart axis)
item({ b0: 0, b1: 5, top: P(470, 150), at: [0.2, 1, 2], lines: [H("EVERYONE", hk(235)), H("IS SPENDING", hk(182)), H("ON AI.", hk(330), AMB)] });
item({ b0: 5, b1: 10, top: P(470, 150), mode: "blur", at: [5, 6, 7], lines: [H("WHO IS", hk(300)), H("MEASURING", hk(222)), H("THE VALUE?", hk(200), AMB)] });
// spend vs value chart (decoration band, y 1340-1560)
raw(0, 10, 2, `<svg width="900" height="230" viewBox="0 0 900 230" class="in">
  <line x1="0" y1="200" x2="900" y2="200" stroke="rgba(213,216,250,.35)" stroke-width="3"/>
  ${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 100}" y1="194" x2="${i * 100}" y2="206" stroke="rgba(213,216,250,.35)" stroke-width="3"/>`).join("")}
  <path id="spend" d="M0 196 C 250 182, 450 160, 600 125 S 820 50, 880 12" fill="none" stroke="${AMB}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
  <path id="value" d="M0 196 C 300 192, 600 182, 880 168" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="4 18" opacity="0"/>
  <g id="gap" opacity="0"><path d="M812 143 L864 143 M852 133 L866 143 L852 153" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><line x1="880" y1="22" x2="880" y2="158" stroke="#fff" stroke-width="4" stroke-dasharray="8 8"/><circle cx="880" cy="12" r="14" fill="${AMB}"/><circle cx="880" cy="168" r="12" fill="#fff"/></g>
</svg>
<div class="lab" id="labS" style="left:600px;top:12px;color:${AMB}">AI SPEND</div>
<div class="lab" id="labV" style="left:600px;top:214px;color:#fff;opacity:0">MEASURED VALUE</div>
<div class="lab" id="labG" style="left:652px;top:124px;color:#fff;opacity:0;font-size:32px">THE GAP</div>`,
  `left:90px;top:${P(1330, 830)}px;width:900px;height:240px`,
  (id, s, e) => `tl.fromTo("#spend",{attr:{"stroke-dashoffset":1}},{attr:{"stroke-dashoffset":0},duration:2.0,ease:"power2.in"},0.1);
tl.fromTo("#labS",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:"power3.out"},1.9);
tl.fromTo("#value",{opacity:0},{opacity:.9,duration:.4},${B(5.5)});
tl.fromTo("#labV",{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:"power3.out"},${B(6)});
tl.fromTo("#gap",{opacity:0},{opacity:1,duration:.2},${B(8)});
tl.fromTo("#labG",{opacity:0,x:-16},{opacity:1,x:0,duration:.3,ease:"expo.out"},${B(8)});
${exitBlur(id, e)}`);

// ================= 02 IGNITE ======================================================
item({ b0: 10, b1: 15, top: P(400, 190), lines: [E("// MICROSOFT IGNITE 2026"), H("SAN FRANCISCO", P(150, 132)), H("NOV 17–20", P(240, 210), AMB), Bd("Moscone Center and online")], stag: .12 });
{ const days = [["S", 15], ["M", 16], ["T", 17], ["W", 18], ["T", 19], ["F", 20], ["S", 21]];
  const cells = days.map(([d, k], i) => `<div class="day" id="d${k}"><small>${d}</small><b>${k}</b></div>`).join("");
  raw(10, 15, 2, `<div class="in cal"><div class="calh">NOVEMBER 2026</div><div class="row7">${cells}</div></div>`, `left:0;top:${P(1010, 720)}px;width:1080px`,
    (id, s, e) => `tl.fromTo("#${id} .day",{y:40,opacity:0},{y:0,opacity:1,duration:.4,ease:"expo.out",stagger:.04},${r3(s + .15)});
tl.fromTo("#${id} .calh",{opacity:0},{opacity:1,duration:.3},${r3(s + .15)});
${[17, 18, 19, 20].map((k, i) => `tl.fromTo("#d${k}",{backgroundColor:"rgba(255,255,255,.06)",color:"#fff",scale:1},{backgroundColor:"${AMB}",color:"${NAVY}",scale:1.08,duration:.18,ease:"power3.out",immediateRender:false},${B(11 + i)});`).join("\n")}
${exitBlur(id, e)}`); }

// ================= 03 THE AI HOUSE =================================================
const HS = P({ apex: 200, side: 520, base: 1250 }, { apex: 60, side: 320, base: 1000 });
raw(15, 20, 2, `<svg class="in" width="1080" height="1400" viewBox="0 0 1080 1400">
  <path id="house" d="M120 ${HS.base} L120 ${HS.side} L540 ${HS.apex} L960 ${HS.side} L960 ${HS.base} Z" fill="rgba(10,14,46,.35)" stroke="${AMB}" stroke-width="7" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
  ${[[120, HS.side], [540, HS.apex], [960, HS.side], [960, HS.base], [120, HS.base]].map(([x, y], i) => `<circle class="nd" cx="${x}" cy="${y}" r="16" fill="${AMB}"/>`).join("")}
</svg>`, "left:0;top:110px;width:1080px;height:1400px",
  (id, s, e) => `tl.fromTo("#house",{attr:{"stroke-dashoffset":1}},{attr:{"stroke-dashoffset":0},duration:1.1,ease:"power2.inOut"},${s});
tl.fromTo("#${id} .nd",{scale:0,transformOrigin:"50% 50%"},{scale:1,duration:.3,ease:"back.out(2)",stagger:.18},${r3(s + .1)});
${exitBlur(id, e)}`);
item({ b0: 15, b1: 20, top: 110 + HS.side - 38, at: [15.3, 15.7, 16.2, 16.8], lines: [H("THE AI", 240), H("HOUSE", 270, AMB), { ...Bd("The room where enterprise AI gets done.", 46, WHT, 190), gap: .5 }, { ...E("// PRESENTED BY KPMG"), gap: 0 }] });

// ================= 04 THE SPEAKER (photo; every element on a beat; 1 s hold) =====
const STEP0 = P(540, 350), STEP = P(220, 150);
const NEND = 32;   // last credential on beat 28, 3-beat hold, The Session lands on the next count of 4 (beat 32)
raw(20, NEND, 1, "", `left:0;top:0;width:1080px;height:${HGT}px;background:radial-gradient(ellipse at 50% 35%,#4A22C8 0%,#3518B2 45%,#1B0E6A 100%)`,
  (id, s) => `tl.fromTo("#${id}",{clipPath:"circle(0% at 50% 47%)"},{clipPath:"circle(120% at 50% 47%)",duration:.5,ease:"expo.out"},${s});`);
raw(20, NEND, 2, `<div class="pwrap"><img src="assets/noelle.jpg" class="photo" alt="Noelle Russell, Founder of AI Leadership Institute, on stage"></div><div class="scan"></div>`,
  `left:0;top:${P(110, 0)}px;width:1080px;height:${P(1350, 1000)}px`,
  (id, s, e) => `tl.fromTo("#${id} .pwrap",{clipPath:"inset(0% 0% 100% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",duration:.7,ease:"power3.out"},${r3(s + .05)});
tl.fromTo("#${id} .scan",{y:0,opacity:1},{y:${P(900, 700)},opacity:1,duration:.7,ease:"power3.out"},${r3(s + .05)});
tl.to("#${id} .scan",{opacity:0,duration:.2},${r3(s + .75)});
tl.fromTo("#${id} .photo",{scale:1.12},{scale:1.02,duration:${r3(e - s)},ease:"power1.out"},${s});`);
item({ b0: 21, b1: NEND, top: P(975, 600), track: 4, mode: "letters", at: [21], lines: [H("NOELLE RUSSELL", 142)] });
item({ b0: 22, b1: NEND, top: P(1125, 745), track: 4, mode: "blur", at: [22], lines: [{ t: "FOUNDER, AI LEADERSHIP INSTITUTE", size: 28, c: AMB, k: "eye" }] });
["#1 Agentic AI Leader 2025", "5x Microsoft AI MVP", "3.4M+ learners", "TEDx speaker", "Best-selling author"].forEach((t, i) =>
  raw(24 + i, NEND, 4, `<div class="in row"><b>0${i + 1}</b><i></i><span>${t}</span></div>`, `left:0;width:1080px;top:${P(1200 + i * 84, 812 + i * 74)}px`,
    (id, s, e) => `tl.fromTo("#${id} .row i",{scaleY:0},{scaleY:1,duration:.18,ease:"expo.out"},${s});
tl.fromTo("#${id} .row span",{x:-60,opacity:0,filter:"blur(8px)"},{x:0,opacity:1,filter:"blur(0px)",duration:.26,ease:"expo.out"},${s});
tl.fromTo("#${id} .row b",{opacity:0},{opacity:1,duration:.15},${s});
${exitBlur(id, e)}`));

// ================= 05 THE SESSION (one block) ======================================
item({ b0: NEND, b1: 44, top: P(420, 210), stag: .2, delay: .05, lines: [E("// THE SESSION"), H("THE FRONTIER", 150, AMB), H("VALUE METHOD:", 150, AMB), H("FROM TOKEN SPEND", 112), H("TO BUSINESS VALUE", 112)] });
raw(36, 44, 4, `<div class="in conv"><div class="chip c1">TOKEN SPEND</div><div class="arr"><i></i></div><div class="chip c2">BUSINESS VALUE</div></div>`, `left:0;top:${P(1140, 900)}px;width:1080px`,
  (id, s, e) => `tl.fromTo("#${id} .c1",{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:"expo.out"},${s});
tl.fromTo("#${id} .arr i",{scaleX:0},{scaleX:1,duration:.4,ease:"power2.inOut"},${B(37)});
tl.fromTo("#${id} .c2",{opacity:0,scale:.6},{opacity:1,scale:1,duration:.35,ease:"back.out(1.6)"},${B(38)});
${exitBlur(id, e)}`);

// ================= 06 THE METHOD (steps on the 1 of each count of 4: beats 48/52/56; logos on 60/61/62) =========================
raw(44, 64, 3, `<div class="in" style="font-family:'Barlow Condensed';font-weight:800;font-style:italic;font-size:104px;color:${AMB};text-transform:uppercase;line-height:.95">The Frontier<br>Value Method</div>`, `left:0;width:1080px;top:${P(300, 130)}px;text-align:center`,
  (id, s, e) => `tl.fromTo("#${id} .in",{opacity:0,filter:"blur(14px)",scale:1.08},{opacity:1,filter:"blur(0px)",scale:1,duration:.35,ease:"expo.out"},${s});${exitBlur(id, e)}`);
raw(48, 64, 2, `<div class="spine"><i id="sp1"></i><i id="sp2"></i></div>`, `left:0;top:0;width:1080px;height:${HGT}px`,
  (id, s, e) => `tl.fromTo("#sp1",{scaleY:0},{scaleY:1,duration:.45,ease:"power2.inOut"},${r3(B(52) - .45)});
tl.fromTo("#sp2",{scaleY:0},{scaleY:1,duration:.45,ease:"power2.inOut"},${r3(B(56) - .45)});${exitBlur(id, e, ".spine")}`);
["Pick the right workflows", "Model the human&#8209;agent cost", "Underwrite outcomes, not tokens"].forEach((t, i) =>
  raw(48 + i * 4, 64, 4, `<div class="in step"><u>${i + 1}</u><span>${t}</span></div>`, `left:0;width:1080px;top:${STEP0 + i * STEP}px`,
    (id, s, e) => `tl.fromTo("#${id} .step u",{scale:0},{scale:1,duration:.3,ease:"back.out(2.2)"},${s});
tl.fromTo("#${id} .step span",{x:-50,opacity:0,filter:"blur(10px)"},{x:0,opacity:1,filter:"blur(0px)",duration:.3,ease:"expo.out"},${r3(s + .04)});
${exitBlur(id, e)}`));
raw(60, 64, 4, `<div class="spons"><div class="sl">// IN CONVERSATION WITH</div>${V.logos.map((l, k) => `<div class="lg lg${k}">${l}</div>`).join("")}</div>`, `left:0;width:1080px;top:${P(1150, 806)}px`,
  (id, s, e) => `tl.fromTo("#${id} .sl",{opacity:0,filter:"blur(10px)"},{opacity:1,filter:"blur(0px)",duration:.3,ease:"power2.out"},${s});
${[0, 1, 2].map((k) => `tl.fromTo("#${id} .lg${k}",{opacity:0,y:30,filter:"blur(10px)"},{opacity:1,y:0,filter:"blur(0px)",duration:.3,ease:"expo.out"},${B(60 + k)});`).join("\n")}
${exitBlur(id, e, ".spons")}`);

// ================= 07 THE DETAILS (ticket) ==========================================
const bars = Array.from({ length: 28 }, (_, i) => { const w = [3, 6, 3, 9, 4, 3, 7, 3][i % 8] + (i % 5 === 0 ? 3 : 0);
  return `<i style="width:${w}px"></i>`; }).join("");
raw(64, 75, 2, `<div class="tk" style="opacity:0"><div class="tkh">// THE AI HOUSE · PRESENTED BY KPMG</div><div class="perf"></div><div class="bars">${bars}</div></div>`,
  `left:90px;top:${P(290, 130)}px;width:900px;height:${P(1050, 940)}px`,
  (id, s, e) => `tl.fromTo("#${id} .tk",{opacity:0,y:120,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.6,ease:"expo.out"},${s});
tl.fromTo("#${id} .bars i",{scaleY:0},{scaleY:1,duration:.2,ease:"expo.out",stagger:.006},${B(68)});
${exitBlur(id, e, ".tk")}`);
const field = (b0, top, label, val, track = 4) => raw(b0, 75, track,
  `<div class="in fld"><div class="fl">${label}</div>${val}</div>`, `left:150px;width:780px;top:${top}px`,
  (id, s, e) => `tl.fromTo("#${id} .fl",{opacity:0,x:-20},{opacity:1,x:0,duration:.25,ease:"expo.out"},${s});
tl.fromTo("#${id} .fv",{yPercent:105},{yPercent:0,duration:.3,ease:"expo.out",stagger:.06},${s});
${exitBlur(id, e)}`);
field(65, P(420, 260), "DATE", `<div class="mk"><div class="fv" style="font-size:170px">WED NOV 18</div></div>`);
field(66, P(650, 470), "TIME · PACIFIC", `<div class="mk"><div class="fv" style="font-size:200px;color:${AMB};font-style:italic;font-weight:800">${V.time}</div></div>`);
field(67, P(950, 750), "VENUE", `<div class="mk"><div class="fv" style="font-size:104px">KPMG EXCHANGE</div></div><div class="mk"><div class="fv" style="font-family:'JetBrains Mono';font-weight:800;font-size:30px;letter-spacing:.06em;color:${SOFT};padding-top:8px">175 4TH ST, SAN FRANCISCO</div></div>`);
raw(68, 75, 5, `<div class="in" style="font-family:'JetBrains Mono';font-weight:800;font-size:30px;letter-spacing:.1em;color:${AMB}">// INVITATION ONLY</div>`, `left:150px;top:${P(1245, 963)}px;width:500px`,
  (id, s, e) => `tl.fromTo("#${id} .in",{opacity:0,filter:"blur(10px)"},{opacity:1,filter:"blur(0px)",duration:.25},${s});${exitBlur(id, e)}`);

// ================= persistent HUD (entity line on every frame = thumbnail + AEO) =====
const chapters = [[0, "01 THE PROBLEM"], [10, "02 IGNITE 2026"], [15, "03 THE AI HOUSE"], [20, "04 THE SPEAKER"], [NEND, "05 THE SESSION"], [44, "06 THE METHOD"], [64, "07 THE DETAILS"]];
chapters.forEach(([b0, label], i) => { const b1 = i < chapters.length - 1 ? chapters[i + 1][0] : 75;
  if (b0 === 20) return; // speaker scene: credentials own the lower band
  raw(b0, b1, 7, `<div class="in chap">${label}</div>`, `left:0;top:${P(1600, 1176)}px;width:1080px`,
    (id, s) => `tl.fromTo("#${id} .in",{opacity:0,y:14},{opacity:1,y:0,duration:.3,ease:"expo.out"},${s});`); });
if (!F45) fs.writeFileSync(`chapters-${variant}.json`, JSON.stringify(chapters.map(([b, l], i) => ({ start: B(b), end: i < chapters.length - 1 ? B(chapters[i + 1][0]) : DUR, label: l })), null, 1));

// light sweeps on scene seams
let sweepJs = `tl.set("#sweep",{x:-700},0);\n`;
[5, 10, 15, NEND, 44, 64].forEach((b) => { sweepJs += `tl.fromTo("#sweep",{x:-700,opacity:1},{x:1500,duration:.38,ease:"power2.inOut",immediateRender:false},${r3(B(b) - .19)});\n`; });
// bar-level background push (downbeats only)
let beatJs = "";
for (let i = 0; B(i) < DUR - .3; i += 4) beatJs += `tl.fromTo("#vidwrap",{scale:1.05},{scale:1,duration:.45,ease:"expo.out",immediateRender:false},${B(i)});\n`;
// progress rail
const ticks = Array.from({ length: Math.floor(DUR / (4 * BEAT)) + 1 }, (_, i) => `<i style="left:${(i * 4 * BEAT / DUR) * 840}px"></i>`).join("");

// ---------- backgrounds --------------------------------------------------------------
const vid = (id, src, b0, b1, ms, rate) => { const s = B(b0), e = B(b1);
  return `<video id="${id}" class="clip vid" src="assets/${src}" muted playsinline data-start="${s}" data-duration="${r3(e - s)}" data-media-start="${ms}" data-playback-rate="${rate}" data-track-index="0"></video>`; };
const vids = [vid("v1", "hf_tunnel.mp4", 0, 20, 0, 0.8), vid("v3", "hf_grid.mp4", NEND, 64, 0, 0.52),
  vid("v4", "hf_tunnel.mp4", 64, 75, 1.5, 1)].join("\n");

fs.writeFileSync("index.html", `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=${HGT}" />
<title>Noelle Russell at The AI House presented by KPMG, Microsoft Ignite 2026</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"Barlow Condensed";font-weight:900;font-style:normal;src:url("assets/fonts/BarlowCondensed-900.ttf")}
@font-face{font-family:"Barlow Condensed";font-weight:800;font-style:italic;src:url("assets/fonts/BarlowCondensed-800i.ttf")}
@font-face{font-family:"Barlow Condensed";font-weight:700;font-style:normal;src:url("assets/fonts/BarlowCondensed-700.ttf")}
@font-face{font-family:"JetBrains Mono";font-weight:800;font-style:normal;src:url("assets/fonts/JetBrainsMono-800.ttf")}
@font-face{font-family:"JetBrains Mono";font-weight:700;font-style:normal;src:url("assets/fonts/JetBrainsMono-700.ttf")}
@font-face{font-family:"Space Grotesk";font-weight:700;font-style:normal;src:url("assets/fonts/SpaceGrotesk-700.ttf")}
@font-face{font-family:"Space Grotesk";font-weight:500;font-style:normal;src:url("assets/fonts/SpaceGrotesk-500.ttf")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:${HGT}px;overflow:hidden;background:${NAVY}}
#root{position:absolute;inset:0;overflow:hidden;background:${NAVY}}
#vidwrap{position:absolute;inset:0}
.vid{position:absolute;left:0;top:0;width:1080px;height:${HGT}px;object-fit:cover}
#grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,10,40,.66) 0%,rgba(10,14,46,.52) 45%,rgba(30,12,80,.72) 100%)}
#grid{position:absolute;inset:0;background-image:linear-gradient(rgba(213,216,250,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(213,216,250,.07) 2px,transparent 2px);background-size:90px 90px;background-position:0 30px;-webkit-mask-image:radial-gradient(ellipse at 50% 45%,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse at 50% 45%,#000 20%,transparent 75%)}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 42%,rgba(4,4,24,.8) 100%)}
#sweep{position:absolute;top:-200px;left:0;width:260px;height:2400px;background:linear-gradient(90deg,rgba(255,197,61,0),rgba(255,224,150,.55),rgba(255,197,61,0));transform:rotate(14deg);mix-blend-mode:screen}
.it{position:absolute;left:0;width:1080px;text-align:center}
.mk{overflow:hidden;padding:0 .12em;margin:-.02em 0}
.ln{font-family:'Barlow Condensed',sans-serif;font-weight:900;text-transform:uppercase;line-height:.92;letter-spacing:.005em;white-space:nowrap;text-shadow:0 6px 40px rgba(0,0,0,.55)}
.w,.c{display:inline-block}
.lab{position:absolute;font-family:'JetBrains Mono';font-weight:800;font-size:28px;letter-spacing:.08em;white-space:nowrap}
.cal{display:flex;flex-direction:column;align-items:center;gap:18px}
.calh{font-family:'JetBrains Mono';font-weight:800;font-size:28px;letter-spacing:.2em;color:${SOFT}}
.row7{display:flex;gap:14px}
.day{width:118px;height:150px;border-radius:22px;background:rgba(255,255,255,.06);border:2px solid rgba(213,216,250,.25);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.day small{font-family:'JetBrains Mono';font-weight:800;font-size:28px;opacity:.8}
.day b{font-family:'Barlow Condensed';font-weight:900;font-size:72px;line-height:1}
.pwrap{width:1080px;height:${P(1350, 1000)}px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 0%,#000 50%,rgba(0,0,0,0) 76%);mask-image:linear-gradient(180deg,#000 0%,#000 50%,rgba(0,0,0,0) 76%)}
.photo{display:block;width:1080px;height:${P(1350, 1000)}px;object-fit:cover;object-position:50% ${P(50, 0)}%;transform-origin:50% 25%}
.scan{position:absolute;left:0;top:0;width:1080px;height:4px;background:${AMB};box-shadow:0 0 30px 8px rgba(255,197,61,.7)}
.brk{position:absolute;width:90px;height:90px;border:0 solid ${AMB}}
.brk.tl{left:0;top:0;border-top-width:8px;border-left-width:8px}.brk.tr{right:0;top:0;border-top-width:8px;border-right-width:8px}
.brk.bl{left:0;bottom:0;border-bottom-width:8px;border-left-width:8px}.brk.br{right:0;bottom:0;border-bottom-width:8px;border-right-width:8px}
.row{display:flex;align-items:center;gap:22px;padding-left:130px;font-family:'Space Grotesk';font-weight:700;font-size:50px;color:#fff;text-shadow:0 3px 20px rgba(20,8,90,.8);white-space:nowrap}
.row b{font-family:'JetBrains Mono';font-weight:800;font-size:28px;color:${AMB};width:44px}
.row i{display:block;flex:none;width:12px;height:52px;border-radius:6px;background:${AMB};transform-origin:50% 100%}
.conv{display:flex;align-items:center;justify-content:center;gap:0}
.chip{font-family:'JetBrains Mono';font-weight:800;font-size:34px;letter-spacing:.06em;padding:24px 30px;border-radius:999px;white-space:nowrap}
.c1{border:4px solid rgba(213,216,250,.6);color:${SOFT};background:rgba(10,14,46,.5)}
.c2{background:${AMB};color:${NAVY};box-shadow:0 0 50px rgba(255,197,61,.55)}
.arr{width:130px;height:8px;position:relative}
.arr i{position:absolute;inset:0;background:${AMB};transform-origin:0 50%}
.arr i:after{content:"";position:absolute;right:-6px;top:-13px;border-left:24px solid ${AMB};border-top:17px solid transparent;border-bottom:17px solid transparent}
.spine i{position:absolute;left:158px;width:8px;background:${AMB};transform-origin:50% 0;border-radius:4px}
#sp1{top:${STEP0 + 120}px;height:${STEP - 120}px}#sp2{top:${STEP0 + STEP + 120}px;height:${STEP - 120}px}
.step{display:flex;align-items:center;gap:34px;text-align:left;padding:0 100px;font-family:'Space Grotesk';font-weight:700;font-size:58px;line-height:1.1;color:#fff}
.step u{flex:none;width:120px;height:120px;border-radius:50%;background:${AMB};color:#14103A;text-decoration:none;font-family:'Barlow Condensed';font-weight:900;font-size:78px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 10px rgba(255,197,61,.18)}
.spons{display:flex;flex-direction:column;align-items:center;gap:${P(24, 12)}px}
.sl{font-family:'JetBrains Mono';font-weight:800;font-size:28px;letter-spacing:.14em;color:${SOFT}}
.lg{height:${P(96, 84)}px;display:flex;align-items:center;justify-content:center;gap:18px}
.lg img{display:block;filter:brightness(0) invert(1)}
.co{font-family:'Space Grotesk';font-weight:500;font-size:44px;color:${SOFT};padding:0 90px}
.tk{position:absolute;inset:0;border-radius:44px;background:linear-gradient(160deg,rgba(20,18,72,.92),rgba(8,10,40,.9));border:4px solid ${AMB};box-shadow:0 0 90px rgba(255,197,61,.3),inset 0 0 0 2px rgba(255,255,255,.04);overflow:hidden}
.tkh{height:96px;background:${AMB};color:${NAVY};font-family:'JetBrains Mono';font-weight:800;font-size:28px;letter-spacing:.08em;display:flex;align-items:center;justify-content:center}
.perf{position:absolute;left:30px;right:30px;top:${P(630, 585)}px;border-top:4px dashed rgba(213,216,250,.4)}
.bars{position:absolute;right:56px;bottom:52px;height:80px;display:flex;gap:4px;align-items:stretch}
.bars i{display:block;background:${SOFT};opacity:.85;transform-origin:50% 100%}
.fld{text-align:left}
.fl{font-family:'JetBrains Mono';font-weight:800;font-size:28px;letter-spacing:.14em;color:${AMB};margin-bottom:6px}
.fv{font-family:'Barlow Condensed';font-weight:900;text-transform:uppercase;line-height:.92;color:#fff;white-space:nowrap}
.fld .mk{padding:0}
#hud{position:absolute;inset:0}
.hl{position:absolute;left:0;width:1080px;top:${P(186, 70)}px;text-align:center;font-family:'JetBrains Mono';font-weight:700;font-size:28px;letter-spacing:.04em;color:rgba(213,216,250,.9)}
.hl b{color:${AMB};font-weight:800}
.cn{position:absolute;width:56px;height:56px;border:0 solid rgba(213,216,250,.5)}
.cn.a{left:48px;top:${P(170, 52)}px;border-top-width:4px;border-left-width:4px}.cn.b{right:48px;top:${P(170, 52)}px;border-top-width:4px;border-right-width:4px}
.cn.c{left:48px;top:${P(1700, 1244)}px;border-bottom-width:4px;border-left-width:4px}.cn.d{right:48px;top:${P(1700, 1244)}px;border-bottom-width:4px;border-right-width:4px}
.rail{position:absolute;left:120px;top:${P(1662, 1236)}px;width:840px;height:4px;background:rgba(213,216,250,.18)}
.rail i{position:absolute;top:-6px;width:3px;height:16px;background:rgba(213,216,250,.35)}
#fill{position:absolute;left:0;top:0;height:4px;width:840px;background:${AMB};transform-origin:0 50%;box-shadow:0 0 14px rgba(255,197,61,.8)}
.cta{display:flex;align-items:center;justify-content:center;gap:28px;margin:0 auto;width:860px;padding:30px 20px;border-radius:999px;background:${AMB};color:${NAVY};font-family:'JetBrains Mono';font-weight:800;font-size:58px;letter-spacing:.01em}
.cta b{font-family:'Space Grotesk';font-size:66px;line-height:1}
.chap{text-align:center;font-family:'JetBrains Mono';font-weight:800;font-size:28px;letter-spacing:.16em;color:${SOFT}}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="${HGT}">
<div id="vidwrap" data-layout-ignore>
${vids}
</div>
<div id="grade" data-layout-ignore></div><div id="grid" data-layout-ignore></div><div id="vig" data-layout-ignore></div>
${html}
<div id="hud" data-layout-ignore><div class="hl">NOELLE RUSSELL <b>//</b> AI HOUSE BY KPMG <b>//</b> IGNITE 2026</div>
<i class="cn a"></i><i class="cn b"></i><i class="cn c"></i><i class="cn d"></i>
<div class="rail">${ticks}<div id="fill"></div></div></div>
<div id="sweep" data-layout-ignore></div>
<audio id="music" src="assets/music.mp3" data-start="0" data-duration="${DUR}" data-track-index="9" data-volume="1"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.to(".hl",{opacity:0,duration:.2},${B(20)});tl.to(".hl",{opacity:1,duration:.3},${B(NEND)});
tl.fromTo("#fill",{scaleX:0},{scaleX:1,duration:${DUR},ease:"none"},0);
${beatJs}
${sweepJs}
${js}
window.__timelines["main"] = tl;
tl.seek(0);
</script></body></html>`);
console.log("items", n);
