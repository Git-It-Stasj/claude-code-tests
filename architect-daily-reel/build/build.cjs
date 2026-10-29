// Architect Daily, Oct 28 2026 - sizzle reel generator.
// Emits one standalone index.html (HTML + one paused GSAP timeline) per aspect ratio.
// Run: node build/build.cjs      (needs playwright for the one-off connector measurement)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");

// ───────────────────────── ONE CONSTANTS BLOCK ─────────────────────────
// Every scene window is derived from here (markup attributes AND timeline).
const TOTAL = 37;
const SCENES = {
  intro: [0, 4],
  n1: [4, 10],
  n2: [10, 16],
  n3: [16, 21],
  nm: [21, 30],
  close: [30, 37],
};
const SCENE_ORDER = ["intro", "n1", "n2", "n3", "nm", "close"];
// Music bed: ducks under the closing lockup (starts 0.2 s before the lockup, 0.7 s ramp).
const MUSIC = { file: "architect-daily-bed.m4a", level: 1, duckAt: SCENES.close[0] + 3.8, duckRamp: 0.7, duckTo: 0.3 };
const COPY = {
  question: "How did you use AI today?",
};
// ───────────────────────────────────────────────────────────────────────

const BRAND = { bg: "#070D1F", card: "#0D1530", blue: "#3D7FFF", gold: "#F0C040", ink: "#E8EEFF" };
const LINE_T = 4; // connector thickness (px)

// seeded shuffle (no Math.random)
function shuffle(n, seed) {
  const a = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ───────────────────────── layouts ─────────────────────────
const LAYOUTS = {
  "16x9": {
    W: 1920, H: 1080, name: "16x9",
    mx: 96, hudY: 40, hudFs: 20,
    tagFs: 22, hlFs: 88, bodyFs: 34, capFs: 42, srcFs: 22,
    capTop: 876, srcTop: 972, barTop: 1034, barH: 6,
    markIntro: 280, markClose: 190,
    dots: { cols: 10, rows: 6, cw: 70, ch: 70, dia: 38, cardW: 764, cardH: 590, top: 90 },
    // new-to-me boxes: absolute
    nm: {
      form: [326, 340, 460, 84], air: [326, 500, 460, 96],
      o1: [96, 740, 440, 92], o2: [576, 740, 440, 92],
      grid: [1080, 420, 744],
    },
    gridCols: "250px 104px 120px 96px 174px",
  },
  "9x16": {
    W: 1080, H: 1920, name: "9x16",
    mx: 72, hudY: 112, hudFs: 24,
    tagFs: 26, hlFs: 96, bodyFs: 42, capFs: 48, srcFs: 24,
    capTop: 1392, srcTop: 1560, barTop: 1700, barH: 8,
    markIntro: 360, markClose: 300,
    dots: { cols: 6, rows: 10, cw: 136, ch: 58, dia: 44, cardW: 936, cardH: 700, top: 84 },
    nm: {
      form: [220, 560, 640, 96], air: [220, 720, 640, 110],
      o1: [72, 950, 456, 112], o2: [552, 950, 456, 112],
      grid: [72, 1110, 936],
    },
    gridCols: "292px 124px 170px 130px 220px",
  },
};

// ───────────────────────── markup helpers ─────────────────────────
function markHTML(id, size) {
  const t = Math.max(6, Math.round(size * 0.04));
  const sides = [1, 0.74, 0.48, 0.22].map((f) => Math.round(size * f));
  let edges = "";
  sides.forEach((s, k) => {
    const o = (size - s) / 2;
    const L = o, T = o;
    edges +=
      `<i class="e sq${k} e0" style="left:${L}px;top:${T}px;width:${s}px;height:${t}px"></i>` +
      `<i class="e sq${k} e1" style="left:${L + s - t}px;top:${T}px;width:${t}px;height:${s}px"></i>` +
      `<i class="e sq${k} e2" style="left:${L}px;top:${T + s - t}px;width:${s}px;height:${t}px"></i>` +
      `<i class="e sq${k} e3" style="left:${L}px;top:${T}px;width:${t}px;height:${s}px"></i>`;
  });
  return `<div id="${id}" class="mk" style="width:${size}px;height:${size}px"><div class="glow"></div>${edges}</div>`;
}

function lockHTML(id) {
  return `<div id="${id}" class="lock"><div class="shackle"></div><div class="lbody"><i class="kh"></i><i class="ks"></i></div></div>`;
}

function dotsHTML(P) {
  const d = P.dots;
  const gridW = d.cols * d.cw, gridH = d.rows * d.ch;
  const x0 = Math.round((d.cardW - gridW) / 2), y0 = d.top;
  let out = "";
  for (let r = 0; r < d.rows; r++)
    for (let c = 0; c < d.cols; c++) {
      const i = r * d.cols + c;
      const cx = x0 + c * d.cw + d.cw / 2, cy = y0 + r * d.ch + d.ch / 2;
      out += `<i id="n3-d${i}" class="dot" style="left:${cx - d.dia / 2}px;top:${cy - d.dia / 2}px;width:${d.dia}px;height:${d.dia}px"></i>`;
    }
  // gold rising line (segments rotated + scaled from their start)
  const pts = [[0.07, 0.9], [0.3, 0.78], [0.52, 0.6], [0.76, 0.36], [0.93, 0.14]].map(([a, b]) => [
    Math.round(a * d.cardW), Math.round(b * d.cardH),
  ]);
  let segs = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const len = Math.hypot(bx - ax, by - ay), ang = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
    segs += `<i id="n3-g${i}" class="gline" data-ang="${ang.toFixed(3)}" style="left:${ax}px;top:${ay - 3}px;width:${len.toFixed(2)}px"></i>`;
  }
  const tip = pts[pts.length - 1];
  segs += `<i id="n3-gtip" class="gtip" style="left:${tip[0] - 14}px;top:${tip[1] - 14}px"></i>`;
  segs += `<div id="n3-glabel" class="glabel" style="left:${tip[0] - 250}px;top:${tip[1] - 62}px;width:236px;text-align:right">AI INVESTMENT</div>`;
  return { dots: out + segs, nPts: pts.length - 1, total: d.cols * d.rows };
}

function questionHTML(text) {
  const words = text.split(" ");
  let i = 0, html = "";
  words.forEach((w, wi) => {
    html += `<span class="w">`;
    for (const chr of w) {
      html += `<span class="sl"><i class="cu" id="cl-cu${i}"></i></span><span class="ch" id="cl-ch${i}">${chr}</span>`;
      i++;
    }
    html += `</span>`;
    if (wi < words.length - 1) {
      html += `<span class="sl"><i class="cu" id="cl-cu${i}"></i></span><span class="ch" id="cl-ch${i}"> </span>`;
      i++;
    }
  });
  html += `<span class="sl"><i class="cu" id="cl-cu${i}"></i></span>`;
  return { html, n: i };
}

function connectorsHTML(geo) {
  let out = "";
  const seg = (id, s, cls) =>
    `<i id="${id}" class="${cls}" style="left:${s.left}px;top:${s.top}px;width:${s.w}px;height:${s.h}px;transform-origin:${s.origin}"></i>`;
  for (const [k, c] of Object.entries(geo.paths)) {
    c.segs.forEach((s, i) => (out += seg(`nm-${k}-s${i}`, s, "ln")));
    if (k !== "c0") c.segs.forEach((s, i) => (out += seg(`nm-g${k.slice(1)}-s${i}`, s, "ln gold")));
    const p0 = c.pts[0];
    out += `<i id="nm-p${k.slice(1)}" class="pulse" style="left:${p0[0] - 8}px;top:${p0[1] - 8}px"></i>`;
  }
  return out;
}

// ───────────────────────── CSS ─────────────────────────
function css(P) {
  const { W, H } = P;
  const portrait = P.name === "9x16";
  return `
@font-face{font-family:"Josefin Sans";font-weight:300;font-style:normal;src:url("assets/fonts/josefin-sans-300.woff2") format("woff2")}
@font-face{font-family:"Space Grotesk";font-weight:700;font-style:normal;src:url("assets/fonts/space-grotesk-700.woff2") format("woff2")}
@font-face{font-family:"DM Sans";font-weight:400;font-style:normal;src:url("assets/fonts/dm-sans-400.woff2") format("woff2")}
@font-face{font-family:"DM Sans";font-weight:500;font-style:normal;src:url("assets/fonts/dm-sans-500.woff2") format("woff2")}
@font-face{font-family:"JetBrains Mono";font-weight:400;font-style:normal;src:url("assets/fonts/jetbrains-mono-400.woff2") format("woff2")}
@font-face{font-family:"JetBrains Mono";font-weight:500;font-style:normal;src:url("assets/fonts/jetbrains-mono-500.woff2") format("woff2")}
:root{--bg:${BRAND.bg};--card:${BRAND.card};--blue:${BRAND.blue};--gold:${BRAND.gold};--ink:${BRAND.ink};--mx:${P.mx}px}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${BRAND.bg}}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${BRAND.bg};color:var(--ink);font-family:"DM Sans",sans-serif}
.scene{position:absolute;left:0;top:0;width:${W}px;height:${H}px;background:${BRAND.bg};overflow:hidden}
.stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;background:${BRAND.bg}}
.mono{font-family:"JetBrains Mono",monospace;text-transform:uppercase}

/* HUD */
#hud{position:absolute;left:0;top:0;width:${W}px;height:${H}px;z-index:50;pointer-events:none}
.hudt{position:absolute;top:${P.hudY}px;font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${P.hudFs}px;letter-spacing:.26em;text-transform:uppercase;color:var(--ink);opacity:.82;white-space:nowrap}
#hud-l{left:${P.mx}px;padding-left:${P.hudFs + 14}px}
#hud-l::before{content:"";position:absolute;left:0;top:50%;margin-top:-${P.hudFs / 4}px;width:${P.hudFs / 2}px;height:${P.hudFs / 2}px;background:var(--blue)}
#hud-r{right:${P.mx}px}
.pseg{position:absolute;top:${P.barTop}px;height:${P.barH}px;background:rgba(232,238,255,.14);border-radius:${P.barH}px;overflow:hidden}
.pfill{position:absolute;left:0;top:0;width:100%;height:100%;background:var(--blue);transform-origin:0% 50%}

/* shared text */
.col{display:flex;flex-direction:column;align-items:flex-start;gap:${portrait ? 30 : 26}px}
.tag{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${P.tagFs}px;letter-spacing:.3em;text-transform:uppercase;color:var(--blue);display:flex;align-items:center;gap:16px}
.tag::before{content:"";width:${P.tagFs * 1.6}px;height:3px;background:currentColor}
.tag.goldt{color:var(--gold)}
.hl{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:${P.hlFs}px;line-height:1.04;letter-spacing:-.025em;color:var(--ink)}
.body{font-family:"DM Sans",sans-serif;font-weight:400;font-size:${P.bodyFs}px;line-height:1.36;color:rgba(232,238,255,.86)}
.cap{position:absolute;left:${P.mx}px;top:${P.capTop}px;width:${W - 2 * P.mx}px;font-family:"DM Sans",sans-serif;font-weight:500;font-size:${P.capFs}px;line-height:1.22;color:var(--ink);border-left:6px solid var(--blue);padding:4px 0 4px 24px;opacity:0}
.src{position:absolute;left:${P.mx}px;top:${P.srcTop}px;width:${W - 2 * P.mx}px;font-family:"JetBrains Mono",monospace;font-weight:400;font-size:${P.srcFs}px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,238,255,.7);opacity:0}
.card{background:var(--card);border-radius:22px;box-shadow:0 0 0 1px rgba(61,127,255,.28),0 0 56px rgba(61,127,255,.16),0 22px 44px rgba(0,0,0,.4)}

/* mark */
.mk{position:absolute}
.mk .e{position:absolute;background:var(--gold);box-shadow:0 0 14px rgba(240,192,64,.5)}
.mk .e0{transform-origin:0% 50%}.mk .e1{transform-origin:50% 0%}.mk .e2{transform-origin:100% 50%}.mk .e3{transform-origin:50% 100%}
.mk .glow{position:absolute;left:-30%;top:-30%;width:160%;height:160%;background:radial-gradient(closest-side,rgba(240,192,64,.26),rgba(240,192,64,0));opacity:0}

/* intro */
#in-mark{left:${(W - P.markIntro) / 2}px;top:${portrait ? 560 : 240}px}
#in-label{position:absolute;left:0;width:${W}px;text-align:center;top:${portrait ? 1010 : 590}px;font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 28 : 26}px;letter-spacing:.34em;text-transform:uppercase;color:var(--blue);opacity:0}
#in-cap{left:0;width:${W}px;top:${portrait ? 1110 : 690}px;border:0;padding:0;text-align:center;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:${portrait ? 76 : 72}px;letter-spacing:-.02em}

/* lock */
.lock{position:relative;width:${portrait ? 140 : 150}px;height:${portrait ? 170 : 180}px}
.lock .shackle{position:absolute;left:${portrait ? 28 : 30}px;top:0;width:${portrait ? 84 : 90}px;height:${portrait ? 96 : 100}px;border:14px solid var(--gold);border-bottom:0;border-radius:60px 60px 0 0;box-shadow:0 0 22px rgba(240,192,64,.45)}
.lock .lbody{position:absolute;left:0;bottom:0;width:100%;height:${portrait ? 100 : 108}px;background:var(--gold);border-radius:18px;box-shadow:0 0 34px rgba(240,192,64,.5);transform-origin:50% 100%}
.lock .kh{position:absolute;left:50%;margin-left:-11px;top:26px;width:22px;height:22px;border-radius:50%;background:var(--bg)}
.lock .ks{position:absolute;left:50%;margin-left:-5px;top:42px;width:10px;height:30px;border-radius:4px;background:var(--bg)}

/* stat cards */
.stat{position:absolute;padding:${portrait ? "22px 34px" : "30px 44px"};display:flex;flex-direction:column;justify-content:center;gap:${portrait ? 6 : 10}px}
.stat .num{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:${portrait ? 104 : 132}px;line-height:1;letter-spacing:-.03em;color:var(--ink)}
.stat .lab{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 24 : 24}px;letter-spacing:.2em;text-transform:uppercase;color:var(--blue)}

/* paper */
.paper{position:${portrait ? "relative" : "absolute"};background:#F3F0E6;color:#12141B;border-radius:10px;padding:${portrait ? "40px 44px" : "44px 52px"};display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 0 0 1px rgba(255,255,255,.1),0 0 70px rgba(61,127,255,.2),0 30px 60px rgba(0,0,0,.5)}
.paper .phead{display:flex;justify-content:space-between;align-items:center}
.paper .brand{font-family:"DM Sans",sans-serif;font-weight:500;font-size:${portrait ? 38 : 40}px;letter-spacing:.26em;color:#0B0D12}
.paper .stamp{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:${portrait ? 34 : 34}px;letter-spacing:.14em;background:var(--gold);color:#11131A;padding:10px 20px;border-radius:6px;box-shadow:0 0 0 3px rgba(240,192,64,.5)}
.paper .rule{height:3px;background:#12141B;opacity:.85}
.paper .sec{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 22 : 22}px;letter-spacing:.24em;text-transform:uppercase;color:#4B5160}
.paper .fact{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:${portrait ? 50 : 52}px;line-height:1.1;letter-spacing:-.02em;color:#0B0D12}
.paper .bars{display:flex;flex-direction:column;gap:${portrait ? 16 : 18}px}
.paper .bar{height:${portrait ? 14 : 14}px;border-radius:7px;background:#C9C6BC}
.paper .bar.s{width:62%}.paper .bar.m{width:84%}

/* dots card */
#n3-card{position:${portrait ? "relative" : "absolute"};width:${P.dots.cardW}px;height:${P.dots.cardH}px;overflow:hidden}
#n3-card .clab{position:absolute;left:34px;top:30px;font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 22 : 20}px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,238,255,.7)}
.dot{position:absolute;border-radius:50%;background:var(--blue);box-shadow:0 0 16px rgba(61,127,255,.5)}
.gline{position:absolute;height:6px;border-radius:3px;background:var(--gold);box-shadow:0 0 16px rgba(240,192,64,.7);transform-origin:0% 50%}
.gtip{position:absolute;width:28px;height:28px;border-radius:50%;background:var(--gold);box-shadow:0 0 28px rgba(240,192,64,.9)}
.glabel{position:absolute;font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 22 : 20}px;letter-spacing:.2em;color:var(--gold)}

/* new to me */
.node{position:absolute;display:flex;flex-direction:column;justify-content:center;padding:0 ${portrait ? 28 : 26}px;gap:6px;background:var(--card);border-radius:18px;box-shadow:0 0 0 1px rgba(61,127,255,.4),0 0 44px rgba(61,127,255,.18)}
.node .k{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 18 : 16}px;letter-spacing:.24em;text-transform:uppercase;color:var(--blue)}
.node .t{font-family:"DM Sans",sans-serif;font-weight:500;font-size:${portrait ? 28 : 27}px;line-height:1.15;color:var(--ink)}
.node .rim{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:18px;border:3px solid var(--gold);box-shadow:0 0 30px rgba(240,192,64,.55);opacity:0}
.ln{position:absolute;background:var(--blue);box-shadow:0 0 12px rgba(61,127,255,.7)}
.ln.gold{background:var(--gold);box-shadow:0 0 14px rgba(240,192,64,.8)}
.pulse{position:absolute;width:16px;height:16px;border-radius:50%;background:var(--ink);box-shadow:0 0 18px 4px rgba(61,127,255,.9);opacity:0}
.gcard{position:absolute;overflow:hidden}
.gcard .gtop{display:flex;justify-content:space-between;align-items:center;padding:${portrait ? "20px 26px" : "20px 28px"}}
.gcard .gtitle{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 20 : 18}px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,238,255,.75)}
.gcard .sample{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 18 : 16}px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);border:2px solid rgba(232,238,255,.55);border-radius:6px;padding:5px 10px}
.grow{display:grid;grid-template-columns:${P.gridCols};align-items:center}
.grow>div{position:relative;height:100%;display:flex;align-items:center;padding:0 ${portrait ? 16 : 12}px;border-top:1px solid rgba(232,238,255,.14);border-right:1px solid rgba(232,238,255,.1)}
.grow>div:last-child{border-right:0}
.ghead{height:${portrait ? 60 : 58}px;background:rgba(61,127,255,.12)}
.ghead>div{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:${portrait ? 17 : 15}px;letter-spacing:.14em;text-transform:uppercase;color:rgba(232,238,255,.85);white-space:nowrap}
.gdata{height:${portrait ? 92 : 88}px}
.gdata>div span{position:relative;font-family:"DM Sans",sans-serif;font-weight:500;font-size:${portrait ? 26 : 25}px;color:var(--ink);opacity:0;white-space:nowrap}
.gdata>div .fl{position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(61,127,255,.3);opacity:0}
.gdata svg{opacity:0;width:44px;height:44px}

/* close */
#cl-q{position:absolute;left:${P.mx}px;width:${W - 2 * P.mx}px;top:${portrait ? 700 : 420}px;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:${portrait ? 112 : 112}px;line-height:1.12;letter-spacing:-.02em;color:var(--ink)}
#cl-q .w{white-space:nowrap}
#cl-q .ch{opacity:0}
#cl-q .sl{display:inline-block;position:relative;width:0;height:1em;vertical-align:-0.12em}
#cl-q .cu{position:absolute;left:0;top:.04em;width:.5em;height:.9em;background:var(--gold);opacity:0;box-shadow:0 0 22px rgba(240,192,64,.55)}
#cl-lock{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
#cl-mark{left:${(W - P.markClose) / 2}px;top:${portrait ? 520 : 240}px}
#cl-word{position:absolute;left:0;width:${W}px;text-align:center;top:${portrait ? 900 : 490}px;font-family:"Josefin Sans",sans-serif;font-weight:300;font-size:${portrait ? 156 : 132}px;letter-spacing:.02em;line-height:1;color:var(--ink);opacity:0}
#cl-tag{position:absolute;left:0;width:${W}px;text-align:center;top:${portrait ? 1110 : 660}px;font-family:"DM Sans",sans-serif;font-weight:500;font-size:${portrait ? 54 : 46}px;color:var(--blue);opacity:0}
#cl-handle{position:absolute;left:0;width:${W}px;text-align:center;top:${portrait ? 1250 : 770}px;font-family:"JetBrains Mono",monospace;font-weight:400;font-size:${portrait ? 30 : 26}px;letter-spacing:.2em;color:rgba(232,238,255,.82);opacity:0}

/* per-layout flow positions */
${
  portrait
    ? `.col{position:absolute;left:${P.mx}px;top:210px;width:${W - 2 * P.mx}px}
.flow{position:absolute;left:${P.mx}px;top:210px;width:${W - 2 * P.mx}px;display:flex;flex-direction:column;align-items:flex-start;gap:30px}
#n1-c1{left:${P.mx}px;top:790px;width:936px;height:196px}
#n1-c2{left:${P.mx}px;top:1006px;width:936px;height:196px}
#n1-lock{position:absolute;left:${(W - 140) / 2}px;top:1222px}
#n2-paper{width:936px;height:600px;margin-top:6px}
#nm-col{position:absolute;left:${P.mx}px;top:210px;width:${W - 2 * P.mx}px}`
    : `.col{position:absolute;left:${P.mx}px;top:140px;width:900px}
#nm-col{position:absolute;left:${P.mx}px;top:140px;width:1728px}
#n1-c1{left:1060px;top:150px;width:764px;height:260px}
#n1-c2{left:1060px;top:450px;width:764px;height:260px}
#n1-lock{position:absolute;left:${P.mx}px;top:640px}
#n2-paper{left:1090px;top:120px;width:730px;height:730px}
#n3-card{left:1060px;top:160px}`
}
`;
}

// ───────────────────────── page-side timeline ─────────────────────────
const TIMELINE_JS = String.raw`
const tl = gsap.timeline({ paused: true });
const S = (k) => SCENES[k][0];
const E = "power3.out";
const IN = (sel, t, o = {}) => tl.fromTo(sel, { opacity: 0, y: o.y ?? 26 }, { opacity: 1, y: 0, duration: o.d ?? 0.6, ease: o.ease ?? E }, t);

// scene fade in/out (on the .stage child, never on the .clip)
const OUT_D = 0.28;
SCENE_ORDER.forEach((k) => {
  const st = "#sc-" + k + " .stage";
  if (k !== "intro" && k !== "close") tl.fromTo(st, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power1.out" }, S(k));
  if (k !== "close") tl.fromTo(st, { opacity: 1 }, { opacity: 0, duration: OUT_D, ease: "power1.in", immediateRender: false }, SCENES[k][1] - OUT_D - 0.02);
});

// progress bar: one segment per scene, gaps between them
SCENE_ORDER.forEach((k) => {
  tl.fromTo("#pf-" + k, { scaleX: 0 }, { scaleX: 1, duration: SCENES[k][1] - SCENES[k][0], ease: "none" }, S(k));
});

// the gold four-square mark: identical animation for intro and closing lockup
function drawMark(sel, t0) {
  for (let k = 0; k < 4; k++)
    for (let e = 0; e < 4; e++) {
      const prop = e % 2 === 0 ? "scaleX" : "scaleY";
      tl.fromTo(sel + " .sq" + k + ".e" + e, { [prop]: 0 }, { [prop]: 1, duration: 0.15, ease: "power2.out" }, t0 + k * 0.28 + e * 0.12);
    }
  tl.fromTo(sel + " .glow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, t0 + 0.4);
}

function count(sel, to, dec, t0, d, suffix) {
  const o = { v: 0 };
  tl.fromTo(o, { v: 0 }, { v: to, duration: d, ease: "power2.out", onUpdate: () => { document.querySelector(sel).textContent = o.v.toFixed(dec) + suffix; } }, t0);
}

// ── INTRO 0-4 ──
{
  const s = S("intro");
  drawMark("#in-mark", s + 0.3);
  IN("#in-label", s + 1.5, { y: 14, d: 0.6 });
  IN("#in-cap", s + 2.1, { y: 22, d: 0.6 });
}

// ── NEWS 01 ──
{
  const s = S("n1");
  IN("#n1-tag", s + 0.2, { y: 14 }); IN("#n1-hl", s + 0.35); IN("#n1-body", s + 0.9);
  IN("#n1-c1", s + 1.5, { y: 34, d: 0.7 }); IN("#n1-c2", s + 2.0, { y: 34, d: 0.7 });
  count("#n1-n1", 76, 0, s + 1.6, 1.3, "%"); count("#n1-n2", 99.4, 1, s + 2.1, 1.3, "%");
  tl.fromTo("#n1-lock .lbody", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, s + 3.2);
  tl.fromTo("#n1-lock .shackle", { y: -34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, s + 3.55);
  tl.fromTo("#n1-lock .kh,#n1-lock .ks", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, s + 3.95);
  IN("#n1-cap", s + 3.5, { y: 18, d: 0.5 }); IN("#n1-src", s + 1.2, { y: 8, d: 0.5 });
}

// ── NEWS 02 ──
{
  const s = S("n2");
  IN("#n2-tag", s + 0.2, { y: 14 }); IN("#n2-hl", s + 0.35); IN("#n2-body", s + 1.0);
  tl.fromTo("#n2-paper", { opacity: 0, y: 60, rotation: -3.5 }, { opacity: 1, y: 0, rotation: -1.5, duration: 0.8, ease: E }, s + 1.3);
  IN("#n2-brand", s + 1.9, { y: 10, d: 0.5 }); IN("#n2-sec1", s + 2.1, { y: 10, d: 0.5 });
  IN("#n2-fact", s + 2.35, { y: 14, d: 0.6 });
  tl.fromTo("#n2-bars", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" }, s + 2.0);
  tl.fromTo("#n2-stamp", { opacity: 0, scale: 1.9, rotation: -2 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.28, ease: "power4.in" }, s + 3.1);
  IN("#n2-cap", s + 3.5, { y: 18, d: 0.5 }); IN("#n2-src", s + 1.6, { y: 8, d: 0.5 });
}

// ── NEWS 03 ──
{
  const s = S("n3");
  IN("#n3-tag", s + 0.2, { y: 14 }); IN("#n3-hl", s + 0.3); IN("#n3-body", s + 0.8);
  tl.fromTo("#n3-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, s + 0.9);
  for (let i = 0; i < DOT_TOTAL; i++)
    tl.fromTo("#n3-d" + i, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, s + 1.15 + (i / DOT_TOTAL) * 0.5);
  FADE_ORDER.forEach((idx, j) => tl.to("#n3-d" + idx, { opacity: 0.1, scale: 0.8, duration: 0.45, ease: "power2.inOut" }, s + 1.9 + j * 0.03));
  for (let i = 0; i < G_SEGS; i++) {
    const ang = parseFloat(document.querySelector("#n3-g" + i).dataset.ang);
    tl.fromTo("#n3-g" + i, { scaleX: 0, rotation: ang }, { scaleX: 1, rotation: ang, duration: 0.42, ease: "none" }, s + 2.0 + i * 0.4);
  }
  tl.fromTo("#n3-gtip", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, s + 2.0 + G_SEGS * 0.4);
  IN("#n3-glabel", s + 2.0 + G_SEGS * 0.4, { y: 8, d: 0.4 });
  IN("#n3-cap", s + 3.0, { y: 18, d: 0.5 }); IN("#n3-src", s + 1.0, { y: 8, d: 0.5 });
}

// ── NEW TO ME 21-30 ──
{
  const s = S("nm");
  IN("#nm-tag", s + 0.15, { y: 14 }); IN("#nm-hl", s + 0.3);
  const speed = 520;
  const draw = (prefix, c, t0) => {
    let t = t0;
    c.segs.forEach((g, i) => { const d = Math.max(0.12, g.len / speed); tl.fromTo("#" + prefix + "-s" + i, { [g.prop]: 0 }, { [g.prop]: 1, duration: d, ease: "none" }, t); t += d; });
    return t;
  };
  const pulse = (id, pts, t0) => {
    let t = t0;
    tl.fromTo(id, { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: 0, y: 0, duration: 0.1 }, t);
    for (let i = 1; i < pts.length; i++) {
      const d = Math.max(0.1, Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) / 640);
      tl.to(id, { x: pts[i][0] - pts[0][0], y: pts[i][1] - pts[0][1], duration: d, ease: "none" }, t); t += d;
    }
    tl.to(id, { opacity: 0, duration: 0.12 }, t);
    return t;
  };
  IN("#nm-form", s + 0.7, { y: 24 });
  draw("nm-c0", GEO.paths.c0, s + 1.2);
  IN("#nm-air", s + 1.5, { y: 24 });
  pulse("#nm-p0", GEO.paths.c0.pts, s + 1.9);
  IN("#nm-o1", s + 2.2, { y: 24 }); IN("#nm-o2", s + 2.35, { y: 24 });
  draw("nm-c1", GEO.paths.c1, s + 2.8); draw("nm-c2", GEO.paths.c2, s + 2.8);
  pulse("#nm-p1", GEO.paths.c1.pts, s + 3.7); pulse("#nm-p2", GEO.paths.c2.pts, s + 3.7);
  // grid + sample row filled field by field
  tl.fromTo("#nm-grid", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, s + 3.6);
  const fields = [4.5, 5.0, 5.5, 6.0];
  fields.forEach((t, i) => {
    tl.fromTo("#nm-f" + i, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: E }, s + t);
    tl.fromTo("#nm-fl" + i, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, s + t);
    tl.to("#nm-fl" + i, { opacity: 0, duration: 0.7, ease: "power1.out" }, s + t + 0.12);
  });
  tl.fromTo("#nm-f4", { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)" }, s + 6.5);
  tl.fromTo("#nm-fl4", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, s + 6.5);
  tl.to("#nm-fl4", { opacity: 0, duration: 0.7, ease: "power1.out" }, s + 6.62);
  tl.fromTo("#nm-sample", { opacity: 0 }, { opacity: 1, duration: 0.4 }, s + 3.9);
  // final lit connection in gold
  const gEnd = Math.max(draw("nm-g1", GEO.paths.c1, s + 7.1), draw("nm-g2", GEO.paths.c2, s + 7.1));
  tl.fromTo("#nm-o1 .rim,#nm-o2 .rim", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, gEnd - 0.1);
  // captions: two beats, each held well past 1.5 s
  IN("#nm-cap1", s + 1.2, { y: 18, d: 0.5 });
  tl.to("#nm-cap1", { opacity: 0, y: -10, duration: 0.3, ease: "power1.in" }, s + 5.2);
  IN("#nm-cap2", s + 5.6, { y: 18, d: 0.5 });
}

// ── CLOSE 30-37 ──
{
  const s = S("close");
  const typeStart = s + 1.25, cps = 25;
  // cursor state as a pure function of time: explicit on/off events
  const set = (i, on, t) => tl.set("#cl-cu" + i, { opacity: on ? 1 : 0 }, t);
  set(0, true, s);                    // alone on navy, blinking at 2 Hz
  set(0, false, s + 0.7); set(0, true, s + 1.0);
  for (let i = 0; i < Q_N; i++) {
    const t = typeStart + i / cps;
    set(i, false, t);
    tl.set("#cl-ch" + i, { opacity: 1 }, t);
    set(i + 1, true, t);
  }
  const typeEnd = typeStart + Q_N / cps;
  for (let b = 1; typeEnd + b * 0.5 < s + 4.0; b++) set(Q_N, b % 2 === 0, typeEnd + b * 0.5);   // blink while the full line is held
  // hold, then resolve into the lockup
  tl.fromTo("#cl-q", { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" }, s + 3.95);
  tl.set("#cl-cu" + Q_N, { opacity: 0 }, s + 4.0);
  drawMark("#cl-mark", s + 4.0);
  IN("#cl-word", s + 4.75, { y: 18, d: 0.55 });
  IN("#cl-tag", s + 5.15, { y: 14, d: 0.5 });
  IN("#cl-handle", s + 5.5, { y: 10, d: 0.5 });
}

window.__timelines["main"] = tl;
`;

// ───────────────────────── assemble ─────────────────────────
function pageHTML(P, geo, withScript) {
  const st = (k) => `data-start="${SCENES[k][0]}" data-duration="${SCENES[k][1] - SCENES[k][0]}"`;
  const dots = dotsHTML(P);
  const q = questionHTML(COPY.question);
  const portrait = P.name === "9x16";
  const nm = P.nm;
  const box = (id, [x, y, w, h], k, t) =>
    `<div id="${id}" class="node" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><span class="k">${k}</span><span class="t">${t}</span><i class="rim"></i></div>`;

  // progress segments with gaps
  const barW = P.W - 2 * P.mx, gap = 10;
  let bar = "";
  SCENE_ORDER.forEach((k, i) => {
    const [a, b] = SCENES[k];
    const left = P.mx + (a / TOTAL) * barW, width = ((b - a) / TOTAL) * barW - (i < SCENE_ORDER.length - 1 ? gap : 0);
    bar += `<div class="pseg" style="left:${left.toFixed(2)}px;width:${width.toFixed(2)}px"><div id="pf-${k}" class="pfill"></div></div>`;
  });

  const cardInner = (n, id, lab) =>
    `<div class="num" id="${id}">0%</div><div class="lab">${lab}</div>`;

  const paper = `      <div id="n2-paper" class="paper">
        <div class="phead"><div id="n2-brand" class="brand">ANTHROPIC</div><div id="n2-stamp" class="stamp">FORM S-1</div></div>
        <div class="rule"></div>
        <div id="n2-sec1" class="sec">Registration statement</div>
        <div id="n2-bars" class="bars"><i class="bar"></i><i class="bar m"></i><i class="bar s"></i></div>
        <div class="sec">Risk factors</div>
        <div id="n2-fact" class="fact">Training paused 1+ month over security concerns (per Reuters)</div>
        <div class="bars"><i class="bar"></i><i class="bar m"></i><i class="bar"></i><i class="bar s"></i></div>
      </div>
`;

  const body = `
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${P.W}" data-height="${P.H}">

  <!-- INTRO -->
  <div id="sc-intro" class="clip scene" ${st("intro")} data-track-index="1"><div class="stage">
    ${markHTML("in-mark", P.markIntro)}
    <div id="in-label">Architect Daily / Oct 28, 2026</div>
    <div id="in-cap" class="cap">Vision, not just noise.</div>
  </div></div>

  <!-- NEWS 01 -->
  <div id="sc-n1" class="clip scene" ${st("n1")} data-track-index="1"><div class="stage">
    <div class="${portrait ? "flow" : "col"}">
      <div id="n1-tag" class="tag">News to you 01</div>
      <h1 id="n1-hl" class="hl">Agents now need managers.</h1>
      <p id="n1-body" class="body">IBM launched tools to identify and control AI agents inside companies.</p>
    </div>
    <div id="n1-c1" class="stat card">${cardInner(1, "n1-n1", "Enabled agents idle 60+ days")}</div>
    <div id="n1-c2" class="stat card">${cardInner(2, "n1-n2", "Lack DLP on sensitive connections")}</div>
    ${lockHTML("n1-lock")}
    <div id="n1-cap" class="cap">Deploying agents without documentation is sprawl.</div>
    <div id="n1-src" class="src">Sources: Aidapted, AI Weekly, Oct 27-28</div>
  </div></div>

  <!-- NEWS 02 -->
  <div id="sc-n2" class="clip scene" ${st("n2")} data-track-index="1"><div class="stage">
    <div class="${portrait ? "flow" : "col"}">
      <div id="n2-tag" class="tag">News to you 02</div>
      <h1 id="n2-hl" class="hl">A frontier lab files to go public.</h1>
      <p id="n2-body" class="body">Anthropic filed an S-1 for a proposed IPO.</p>
      ${portrait ? paper : ""}
    </div>
    ${portrait ? "" : paper}
    <div id="n2-cap" class="cap">Read how labs disclose risk.</div>
    <div id="n2-src" class="src">Sources: The Neuron, Reuters via The Neuron, Oct 27</div>
  </div></div>

  <!-- NEWS 03 -->
  <div id="sc-n3" class="clip scene" ${st("n3")} data-track-index="1"><div class="stage">
    <div class="${portrait ? "flow" : "col"}">
      <div id="n3-tag" class="tag">News to you 03</div>
      <h1 id="n3-hl" class="hl">~60,000 buyouts.<br>AI spend up.</h1>
      <p id="n3-body" class="body">Microsoft is offering ~60,000 voluntary buyouts while increasing its AI investment.</p>
      ${portrait ? `<div id="n3-card" class="card"><div class="clab">Workforce (illustrative)</div>${dots.dots}</div>` : ""}
    </div>
    ${portrait ? "" : `<div id="n3-card" class="card"><div class="clab">Workforce (illustrative)</div>${dots.dots}</div>`}
    <div id="n3-cap" class="cap">Who holds your workflow knowledge?</div>
    <div id="n3-src" class="src">Sources: AI Weekly, Aidapted, Oct 27-28</div>
  </div></div>

  <!-- NEW TO ME -->
  <div id="sc-nm" class="clip scene" ${st("nm")} data-track-index="1"><div class="stage">
    <div id="nm-col" class="col">
      <div id="nm-tag" class="tag goldt">New to me</div>
      <h1 id="nm-hl" class="hl">Website to inbox, fully wired.</h1>
    </div>
    ${box("nm-form", nm.form, "Input", "Website contact form")}
    ${box("nm-air", nm.air, "Database", "Airtable (contact records)")}
    ${box("nm-o1", nm.o1, "Output 01", "Assessment results to client")}
    ${box("nm-o2", nm.o2, "Output 02", "Copy to me")}
    ${geo ? connectorsHTML(geo) : ""}
    <div id="nm-grid" class="gcard card" style="left:${nm.grid[0]}px;top:${nm.grid[1]}px;width:${nm.grid[2]}px">
      <div class="gtop"><span class="gtitle">Airtable / Contacts</span><span id="nm-sample" class="sample">Sample data</span></div>
      <div class="grow ghead"><div>Email</div><div>Score</div><div>Level</div><div>Opt-in</div><div>Report emailed</div></div>
      <div class="grow gdata">
        <div><i id="nm-fl0" class="fl"></i><span id="nm-f0">jane@example.com</span></div>
        <div><i id="nm-fl1" class="fl"></i><span id="nm-f1">13/30</span></div>
        <div><i id="nm-fl2" class="fl"></i><span id="nm-f2">Taxiing</span></div>
        <div><i id="nm-fl3" class="fl"></i><span id="nm-f3">Yes</span></div>
        <div><i id="nm-fl4" class="fl"></i><svg id="nm-f4" viewBox="0 0 44 44"><path d="M8 23 L18 33 L37 10" fill="none" stroke="#F0C040" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>
    </div>
    <div id="nm-cap1" class="cap">Built today. Documented today.</div>
    <div id="nm-cap2" class="cap">Claude Code turned the build into this reel.</div>
  </div></div>

  <!-- CLOSE -->
  <div id="sc-close" class="clip scene" ${st("close")} data-track-index="1"><div class="stage">
    <div id="cl-q">${q.html}</div>
    <div id="cl-lock">
      ${markHTML("cl-mark", P.markClose)}
      <div id="cl-word">the architect</div>
      <div id="cl-tag">Stay Vigilant. Stay Visionary.</div>
      <div id="cl-handle">linkedin.com/in/nastasjaterry</div>
    </div>
  </div></div>

  <audio id="music" class="clip" src="assets/${MUSIC.file}" data-start="0" data-duration="${TOTAL}" data-track-index="20" data-volume="${MUSIC.level}"
    data-automation='${JSON.stringify({version:1,lanes:[{target:"volume",points:[{t:0,v:1},{t:MUSIC.duckAt,v:1},{t:MUSIC.duckAt+MUSIC.duckRamp,v:MUSIC.duckTo},{t:TOTAL,v:MUSIC.duckTo}]}]})}'></audio>

  <!-- persistent HUD -->
  <div id="hud" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="9">
    <div id="hud-l" class="hudt">Architect Daily</div>
    <div id="hud-r" class="hudt">Oct 28, 2026</div>
    ${bar}
  </div>
</div>`;

  const sceneConsts = `const SCENES = ${JSON.stringify(SCENES)};\nconst SCENE_ORDER = ${JSON.stringify(SCENE_ORDER)};\nconst TOTAL = ${TOTAL};`;
  const fade = shuffle(dots.total, 20261028).slice(0, Math.round(dots.total * 0.6));
  const script = withScript
    ? `<script src="assets/gsap.min.js"></script>
<script>
window.__timelines = window.__timelines || {};
// ── constants (scene windows come from build/build.cjs; edit them there) ──
${sceneConsts}
const DOT_TOTAL = ${dots.total};
const FADE_ORDER = ${JSON.stringify(fade)};   // dots that fade out (seeded shuffle, no Math.random)
const G_SEGS = ${dots.nPts};
const Q_N = ${q.n};                           // characters in the typed question
const GEO = ${JSON.stringify(geo)};            // connector geometry, measured once at build time
${TIMELINE_JS}
</script>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${P.W}, height=${P.H}">
<title>Architect Daily - Oct 28, 2026 (${P.name})</title>
<style>${css(P)}</style>
</head>
<body>
${body}
${script}
</body>
</html>
`;
}

function pathSegs(pts) {
  const t = LINE_T;
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if (x0 === x1) {
      // vertical (always drawn top to bottom); ends exactly on y1
      segs.push({ left: +(x0 - t / 2).toFixed(2), top: +y0.toFixed(2), w: t, h: +(y1 - y0).toFixed(2), origin: "50% 0%", prop: "scaleY", len: y1 - y0 });
    } else {
      const right = x1 > x0;
      segs.push({ left: +(Math.min(x0, x1) - t / 2).toFixed(2), top: +(y0 - t / 2).toFixed(2), w: +(Math.abs(x1 - x0) + t).toFixed(2), h: t, origin: right ? "0% 50%" : "100% 50%", prop: "scaleX", len: Math.abs(x1 - x0) });
    }
  }
  return segs;
}

async function measure(P, browser) {
  const tmp = path.join(ROOT, P.name, "_measure.html");
  fs.writeFileSync(tmp, pageHTML(P, null, false));
  const page = await browser.newPage({ viewport: { width: P.W, height: P.H } });
  await page.goto("file://" + tmp);
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const out = {};
    for (const id of ["nm-form", "nm-air", "nm-o1", "nm-o2"]) {
      const b = document.getElementById(id).getBoundingClientRect();
      out[id] = { x: b.x, y: b.y, w: b.width, h: b.height };
    }
    return out;
  });
  await page.close();
  fs.unlinkSync(tmp);
  return r;
}

(async () => {
  const browser = await chromium.launch();
  const only = process.argv[2];
  for (const P of Object.values(LAYOUTS)) {
    if (only && only !== P.name) continue;
    const m = await measure(P, browser);
    const bot = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h });
    const top = (b) => ({ x: b.x + b.w / 2, y: b.y });
    const f = bot(m["nm-form"]), a = top(m["nm-air"]);
    const ab = bot(m["nm-air"]), t1 = top(m["nm-o1"]), t2 = top(m["nm-o2"]);
    const midY = ab.y + (t1.y - ab.y) / 2;
    const elbow = (s, e) => (s.x === e.x ? [[s.x, s.y], [e.x, e.y]] : [[s.x, s.y], [s.x, midY], [e.x, midY], [e.x, e.y]]);
    const paths = { c0: { pts: elbow(f, a) }, c1: { pts: elbow(ab, t1) }, c2: { pts: elbow(ab, t2) } };
    for (const c of Object.values(paths)) c.segs = pathSegs(c.pts);
    const geo = { thickness: LINE_T, boxes: m, paths };
    const dir = path.join(ROOT, P.name);
    fs.mkdirSync(path.join(dir, "assets/fonts"), { recursive: true });
    for (const f2 of fs.readdirSync(path.join(__dirname, "vendor"))) {
      const dst = f2.endsWith(".woff2") ? path.join(dir, "assets/fonts", f2) : path.join(dir, "assets", f2);
      fs.copyFileSync(path.join(__dirname, "vendor", f2), dst);
    }
    fs.copyFileSync(path.join(__dirname, "audio", MUSIC.file), path.join(dir, "assets", MUSIC.file));
    fs.writeFileSync(path.join(dir, "index.html"), pageHTML(P, geo, true));
    fs.writeFileSync(path.join(dir, "connector-geometry.json"), JSON.stringify(geo, null, 2));
    console.log("built", P.name, "midY", midY);
  }
  await browser.close();
})();
