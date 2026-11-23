// 30 s cut (16:9 or 9:16) of the Melanie Guido reel. Loads after reel.js and reuses its chapters.
// A monotone time-map stretches each chapter: quick moves keep their speed, the extra time goes
// into slow holds. Plain-language captions say what she did; the 9:16 cut gets a per-chapter crop.
const VERT = new URLSearchParams(location.search).get('o') === 'v';
window.VERT = VERT;
const SW = VERT ? 1080 : 1920, SH = VERT ? 1920 : 1080, END30 = 32, PN = 60 / 112, TOTB = END30 / PN, BN = (n) => n * PN;
cv.width = SW; cv.height = SH;

// [new beat, old beat] keyframes (old beats are reel.js's 129 BPM grid)
const MAP = [[0, 0], [4, 4], [4.9, 4.9], [5.8, 5.15], [7.4, 6.6], [10, 7.0], [12, 8], [16, 12], [17, 13], [23.4, 15.4], [23.45, 15.45], [24, 16],
  [25, 17], [26.6, 18.6], [31.55, 19.55], [32, 20], [39.5, 23.5], [40, 24], [41.5, 25], [43, 26], [44.5, 26.5], [46, 27], [47.5, 27.5], [48.7, 27.78],
  [49, 28], [53, 31], [56, 32.25], [END30 * 112 / 60, 33.4]];  // last segment: 2 s hold on the end card
function oldT(t) {
  const b = t / PN;
  for (let i = 1; i < MAP.length; i++) if (b <= MAP[i][0]) { const [n0, o0] = MAP[i - 1], [n1, o1] = MAP[i]; return lr(o0, o1, (b - n0) / (n1 - n0)) * P; }
  return MAP[MAP.length - 1][1] * P;
}

const CHN = [
  [0, '01 · EXTRUSION', 0.75, 960, 'Meet Melanie Guido.', 'Mechanical engineer — design & manufacturing.'],
  [4, '02 · DESIGN INTENT', 0.68, 960, 'From CAD to real parts', 'She models parts in SOLIDWORKS and AutoCAD, then makes them real with FDM and resin 3D printing.'],
  [12, '03 · CLEANROOM', 0.6, 960, 'Hands-on in the cleanroom', 'In the SDSU NanoFab cleanroom she fabricated a micro-scale energy-storage device.'],
  [16, '04 · INTERDIGITATED', 0.66, 1140, 'A micro-supercapacitor', 'Interlocking comb electrodes hold charge for quick bursts of power. Simulated in COMSOL: 1.91 µF and 23.9 µJ at 5 V.'],
  [24, '05 · FINITE ELEMENTS', 0.66, 1180, 'Simulate before you build', 'Finite-element analysis in Femap / Nastran, plus MEMS design: a glucose-sensing BioFET with 200 µm electrodes, laid out in CoventorWare.'],
  [32, '06 · SOFT ROBOTICS', 0.58, 1000, 'Teaching by building', 'As a summer-camp mentor she led students to 3D-print molds, cast a silicone robotic hand, and read its sensors with Arduino + Python.'],
  [40, '·· P6 SCHEDULE', 0.54, 960, 'Project scheduling', 'Civil-project planning in Oracle Primavera P6.'],
  [41.5, '·· SIGNAL TIMING', 0.54, 960, 'Traffic signal systems', 'Coursework in signal operations & control.'],
  [43, '·· BILINGÜE', 0.54, 960, 'Fluent in Spanish', 'Bilingual — English and Spanish.'],
  [44.5, '·· EMT', 0.54, 960, 'Licensed EMT', 'Emergency medical response, 2022–2023.'],
  [46, '·· BIOMIMICRY', 0.54, 960, 'Biomimicry', 'Resin-printed water-collection prototypes.'],
  [47.5, '·· TOOLPATHS', 0.54, 960, 'Teaching assistant', 'Additive Manufacturing at SDSU, 2026.'],
  [49, '07 · FIN', 0.8, 960, null, null],
];
const SEGN = [0, 4, 12, 16, 24, 32, 40, 49, TOTB];
function chAt(b) { let i = 0; CHN.forEach((c, j) => { if (b >= c[0] - 1e-6) i = j; }); return i; }

function wrap(s, maxW) { const out = []; let cur = ''; for (const w of s.split(' ')) { const tst = cur ? cur + ' ' + w : w; if (x.measureText(tst).width > maxW && cur) { out.push(cur); cur = w; } else cur = tst; } if (cur) out.push(cur); return out; }
function camera(b) { // 9:16 crop: scale + center x, eased across chapter boundaries
  const i = chAt(b), c = CHN[i], p = CHN[Math.max(0, i - 1)], k = E.io3(cl((b - c[0] + 0.25) / 0.75));
  return [lr(p[2], c[2], k), lr(p[3], c[3], k)];
}
function captions(t, mode) {
  const b = t / PN, i = chAt(b), c = CHN[i]; if (!c[4]) return;
  const nxt = CHN[i + 1] ? CHN[i + 1][0] : TOTB, len = nxt - c[0], fast = len < 2;
  const inK = E.o3(pr(b, c[0] + (fast ? 0.05 : 0.3), fast ? 0.3 : 0.6)), inK2 = E.o3(pr(b, c[0] + (fast ? 0.15 : 0.55), fast ? 0.3 : 0.6)), outK = 1 - pr(b, nxt - (fast ? 0.12 : 0.35), fast ? 0.1 : 0.3);
  const ink = mode === 'paper', col = ink ? C.ink : C.white, sub = ink ? 'rgba(11,13,16,0.78)' : 'rgba(246,243,236,0.82)';
  const card = (x0, y0, w, hh, a) => { x.globalAlpha = a; rr(x0, y0, w, hh, 10); x.fillStyle = ink ? 'rgba(236,232,223,0.93)' : 'rgba(11,13,16,0.88)'; x.fill(); x.globalAlpha = 1; };
  const widest = (ls) => Math.max(...ls.map((l) => x.measureText(l).width));
  if (VERT) {
    font('Disp', 62, 900); x.letterSpacing = '0px'; const hl = wrap(c[4], 900); const hw = widest(hl);
    card(48, 228, hw + 48, hl.length * 72 + 44, inK * outK);
    hl.forEach((l, j) => txt(l, 72, 300 + j * 72 + 20 * (1 - inK), 'Disp', 62, col, { w: 900, a: inK * outK }));
    if (fast) { x.fillStyle = C.yel; x.globalAlpha = inK * outK; x.fillRect(48, 228, 10, hl.length * 72 + 44); x.globalAlpha = 1; }
    font('Grot', 40, 500); const bl = wrap(c[5], 900); const bw = widest(bl);
    card(48, 1388, bw + 48, bl.length * 56 + 40, inK2 * outK);
    bl.forEach((l, j) => txt(l, 72, 1440 + j * 56 + 14 * (1 - inK2), 'Grot', 40, sub, { w: 500, a: inK2 * outK }));
  } else {
    font('Disp', 44, 900); x.letterSpacing = '0px'; const hw = x.measureText(c[4]).width;
    font('Grot', 27, 500); const bl = wrap(c[5], 1060); const bw = widest(bl);
    card(48, 900, Math.max(hw, bw) + 48, 76 + bl.length * 36, inK * outK);
    if (fast) { x.fillStyle = C.yel; x.globalAlpha = inK * outK; x.fillRect(48, 900, 8, 76 + bl.length * 36); x.globalAlpha = 1; }
    txt(c[4], 72, 952 + 12 * (1 - inK), 'Disp', 44, col, { w: 900, a: inK * outK });
    bl.forEach((l, j) => txt(l, 72, 994 + j * 36 + 10 * (1 - inK2), 'Grot', 27, sub, { w: 500, a: inK2 * outK }));
  }
}
function hud30(t, mode, fr) {
  const col = mode === 'paper' ? 'rgba(11,13,16,0.85)' : 'rgba(241,241,241,0.88)', b = t / PN, acc = mode === 'paper' && b >= 32 && b < 40 ? C.ink : C.acc;
  x.strokeStyle = col; x.lineWidth = 2;
  for (const [cx, cy, dx, dy] of [[36, 36, 1, 1], [SW - 36, 36, -1, 1], [36, SH - 36, 1, -1], [SW - 36, SH - 36, -1, -1]]) { x.beginPath(); x.moveTo(cx, cy + 30 * dy); x.lineTo(cx, cy); x.lineTo(cx + 30 * dx, cy); x.stroke(); }
  const fs = VERT ? 15 : 16, spec = `${SW}×${SH}  ·  60P  ·  112 BPM`;
  mono(VERT ? 'MELANIE GUIDO / REEL' : 'MELANIE GUIDO  /  ENGINEERING REEL', 72, 80, col, fs);
  mono(spec, SW - 72, 80, col, fs, { align: 'right' });
  font('Mono', fs, 500); x.letterSpacing = fs * 0.2 + 'px'; const tw = x.measureText(spec).width; x.letterSpacing = '0px';
  circ(SW - 72 - tw - 18, 74, 5, rgba(acc, (t / PN) % 1 < 0.5 ? 1 : 0.25));
  const pad = (n) => String(n).padStart(2, '0');
  mono(`TC 00:00:${pad(Math.floor(fr / FPS))}:${pad(fr % FPS)}`, 72, 110, mode === 'paper' ? 'rgba(11,13,16,0.5)' : 'rgba(241,241,241,0.5)', 13);
  const bx = VERT ? 72 : 1208, bw = VERT ? SW - 144 : 640, by = VERT ? SH - 86 : 1022, f = t / END30;
  for (let i = 0; i < SEGN.length - 1; i++) { const x0 = bx + (SEGN[i] / TOTB) * bw + (i ? 2 : 0), x1 = bx + (SEGN[i + 1] / TOTB) * bw - (i < SEGN.length - 2 ? 2 : 0);
    x.fillStyle = mode === 'paper' ? 'rgba(11,13,16,0.16)' : 'rgba(255,255,255,0.26)'; x.fillRect(x0, by, x1 - x0, 5);
    x.fillStyle = acc; x.fillRect(x0, by, cl(bx + f * bw - x0, 0, x1 - x0), 5); }
  circ(bx + f * bw, by + 2.5, 7.5, acc);
  const c = CHN[chAt(b)], since = t - BN(c[0]); let lab = c[1];
  if (since < 0.16 && c[0] > 0) { const n = Math.floor((since / 0.16) * lab.length); lab = [...lab].map((ch, i) => (i < n || ch === ' ' || ch === '·' ? ch : GLY[Math.floor(h(fr * 13 + i) * GLY.length)])).join(''); }
  mono(lab, bx + bw, by - 22, col, 16, { align: 'right' });
}
function vig(a) { const g = x.createRadialGradient(SW / 2, SH / 2, Math.min(SW, SH) * 0.35, SW / 2, SH / 2, Math.max(SW, SH) * 0.62); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); x.fillStyle = g; x.fillRect(0, 0, SW, SH); }

function frame30(t) {
  const fr = Math.round(t * FPS), to = oldT(t), b = t / PN;
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.shadowBlur = 0; x.globalCompositeOperation = 'source-over';
  if (VERT) { const [s, cx] = camera(b); x.setTransform(s, 0, 0, s, 540 - cx * s, 900 - 540 * s); }
  else x.setTransform(0.8, 0, 0, 0.8, 960 - 960 * 0.8, 452 - 540 * 0.8);
  const mode = scene(to, fr);
  x.setTransform(1, 0, 0, 1, 0, 0); x.filter = 'none'; x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  const fl = flashA(to); if (fl > 0) { x.fillStyle = `rgba(255,255,255,${fl})`; x.fillRect(0, 0, SW, SH); }
  vig(mode === 'dark' ? 0.5 : 0.25);
  const capMode = fl > 0.5 ? 'paper' : mode;
  captions(t, capMode); hud30(t, capMode, fr);
  const fo = pr(t, END30 - 0.3, 0.3); if (fo > 0) { x.fillStyle = `rgba(0,0,0,${fo})`; x.fillRect(0, 0, SW, SH); }
}
window.seek = frame30;
document.fonts.ready.then(async () => {
  await Promise.all([document.fonts.load('900 100px Disp'), document.fonts.load('100px Ser'), document.fonts.load('500 16px Mono'), document.fonts.load('500 20px Grot')]);
  measure(); frame30(0); window.READY = true;
});
