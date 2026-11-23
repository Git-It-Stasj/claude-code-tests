// Melanie Guido — engineering motion reel. 15 s, 129 BPM, 1920x1080.
// Every frame is a pure function of t: seek(t) redraws the whole canvas.
const W = 1920, H = 1080, FPS = 60, END = 15, P = 60 / 129, B = (n) => n * P;
const cv = document.getElementById('c'), x = cv.getContext('2d');
const C = { ink: '#0B0D10', ink2: '#1A1F27', paper: '#ECE8DF', acc: '#FF5B14', yel: '#FFD21F', white: '#F6F3EC', sil: '#F2EEE6' };
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lr = (a, b, k) => a + (b - a) * k, pr = (t, a, d) => cl((t - a) / d);
const E = {
  i2: (k) => k * k, i3: (k) => k * k * k, o2: (k) => 1 - (1 - k) ** 2, o3: (k) => 1 - (1 - k) ** 3,
  io3: (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2),
  bo: (k, s = 2) => 1 + (s + 1) * (k - 1) ** 3 + s * (k - 1) ** 2,
  el: (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 2 ** (-10 * k) * Math.sin(((k * 10 - 0.75) * 2 * Math.PI) / 3) + 1),
  xo: (k) => (k >= 1 ? 1 : 1 - 2 ** (-10 * k)), xi: (k) => (k <= 0 ? 0 : 2 ** (10 * k - 10)),
};
const h = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const mix = (c1, c2, k) => { const a = hex(c1), b = hex(c2); return `rgb(${a.map((v, i) => Math.round(lr(v, b[i], k))).join(',')})`; };
function hex(c) { if (c.startsWith('rgb')) return c.match(/\d+/g).slice(0, 3).map(Number); const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
const rgba = (c, a) => { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; };

// ---------- drawing helpers ----------
function font(f, size, w = 400, stretch = 'normal') { x.font = `${f === 'Ser' ? '' : w + ' '}${size}px ${f}`; x.fontStretch = stretch; }
function txt(s, px, py, f, size, col, { w = 400, align = 'left', ls = 0, base = 'alphabetic', stretch = 'normal', a = 1 } = {}) {
  font(f, size, w, stretch); x.letterSpacing = ls + 'px'; x.textAlign = align; x.textBaseline = base; x.fillStyle = col;
  x.globalAlpha *= a; x.fillText(s, px, py); x.globalAlpha /= a; x.letterSpacing = '0px';
}
function mono(s, px, py, col, size = 16, opt = {}) { txt(s, px, py, 'Mono', size, col, { w: 500, ls: size * 0.2, ...opt }); }
function circ(cx, cy, r, col) { x.beginPath(); x.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2); x.fillStyle = col; x.fill(); }
function ell(cx, cy, rx, ry, col) { x.beginPath(); x.ellipse(cx, cy, Math.max(0, rx), Math.max(0, ry), 0, 0, Math.PI * 2); x.fillStyle = col; x.fill(); }
function rr(px, py, w, hh, r) { x.beginPath(); x.roundRect(px, py, w, hh, r); }
function bg(col) { x.fillStyle = col; x.fillRect(0, 0, W, H); }
function dotGrid(col = 'rgba(236,232,223,0.07)') { x.fillStyle = col; for (let gy = 24; gy < H; gy += 48) for (let gx = 24; gx < W; gx += 48) x.fillRect(gx - 1.3, gy - 1.3, 2.6, 2.6); }
function line(x1, y1, x2, y2, col, lw = 2) { x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.strokeStyle = col; x.lineWidth = lw; x.stroke(); }
function bead(cx, cy, r, sx = 1, sy = 1, col = C.acc, glow = 0) {
  x.save(); x.translate(cx, cy); x.scale(sx, sy);
  if (glow) { x.shadowColor = col; x.shadowBlur = glow; }
  const g = x.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
  g.addColorStop(0, mix(col, '#FFFFFF', 0.45)); g.addColorStop(0.55, col); g.addColorStop(1, mix(col, '#000000', 0.25));
  circ(0, 0, r, g); x.restore();
}
function readout(px, py, lines, col, ttl, bgc) { // tool overlay panel
  const lh = 30, w = 380, hh = lines.length * lh + 58;
  x.save(); rr(px, py, w, hh, 6); x.fillStyle = bgc; x.fill(); x.strokeStyle = rgba(col, 0.35); x.lineWidth = 1.5; x.stroke();
  mono(ttl, px + 20, py + 32, C.acc, 14);
  line(px + 20, py + 44, px + w - 20, py + 44, rgba(col, 0.25), 1);
  lines.forEach((l, i) => { mono(l[0], px + 20, py + 74 + i * lh, rgba(col, 0.6), 15); mono(l[1], px + w - 20, py + 74 + i * lh, col, 15, { align: 'right' }); });
  x.restore();
}
function cursor(px, py, col = C.ink, fill = C.white) {
  x.save(); x.translate(px, py); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 34); x.lineTo(9, 26); x.lineTo(16, 41); x.lineTo(22, 38); x.lineTo(15, 23); x.lineTo(26, 23); x.closePath();
  x.fillStyle = fill; x.fill(); x.strokeStyle = col; x.lineWidth = 2; x.stroke(); x.restore();
}
function vignette(a = 0.5) { const g = x.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); x.fillStyle = g; x.fillRect(0, 0, W, H); }
function noise(fr, cells, a = 1, pal = [C.ink, C.acc, C.yel, C.paper, C.ink, C.ink2]) {
  const s = cells; x.globalAlpha = a;
  for (let gy = 0; gy < H; gy += s) for (let gx = 0; gx < W; gx += s) { x.fillStyle = pal[Math.floor(h(gx * 0.13 + gy * 7.7 + fr * 91.3) * pal.length)]; x.fillRect(gx, gy, s, s); }
  x.globalAlpha = 1;
}

// ---------- layout measured once ----------
const L = {};
function measure() {
  font('Disp', 250, 900, 'expanded'); x.letterSpacing = '0px';
  const w = 'DESIGN'; L.dW = x.measureText(w).width; L.dX = W / 2 - L.dW / 2;
  L.dL = [...w].map((ch, i) => ({ ch, x: L.dX + x.measureText(w.slice(0, i)).width }));
  font('Disp', 230, 900, 'expanded'); const n = 'NANOFAB'; L.nW = x.measureText(n).width; L.nX = W / 2 - L.nW / 2;
  L.nL = [...n].map((ch, i) => ({ ch, x: L.nX + x.measureText(n.slice(0, i)).width, cw: x.measureText(ch).width }));
  font('Disp', 118, 900, 'normal'); x.letterSpacing = '4px'; L.mW = x.measureText('MELANIE GUIDO').width; x.letterSpacing = '0px';
  L.mX = W / 2 - (L.mW + 60) / 2;
  font('Disp', 120, 900, 'normal'); x.letterSpacing = '6px'; L.wpW = x.measureText('MANUFACTURE  ').width; x.letterSpacing = '0px';
  // FEA mesh: 200x200 µm electrode (square) + Cr/Pt trace + pad
  const S = 500, sx = 600, sy = 290, n1 = 12, nodes = [], tris = [];
  const add = (px, py) => (nodes.push([px, py]), nodes.length - 1);
  const grid = (ox, oy, w2, h2, nx, ny) => { const id = []; for (let j = 0; j <= ny; j++) { id[j] = []; for (let i = 0; i <= nx; i++) id[j][i] = add(ox + (w2 * i) / nx, oy + (h2 * j) / ny); }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = id[j][i], b = id[j][i + 1], c = id[j + 1][i], d = id[j + 1][i + 1]; if ((i + j) % 2) tris.push([a, b, d], [a, d, c]); else tris.push([a, b, c], [b, d, c]); } };
  grid(sx, sy, S, S, n1, n1); grid(sx + S, sy + S / 2 - 30, 360, 60, 9, 2); grid(sx + S + 360, sy + S / 2 - 90, 180, 180, 4, 4);
  L.mesh = { nodes, tris, jx: sx + S, jy: sy + S / 2 };
  const edges = []; tris.forEach((t) => { edges.push([t[0], t[1]], [t[1], t[2]], [t[2], t[0]]); }); L.mesh.edges = edges;
  // particle targets: points along mesh edges
  L.parts = []; for (let i = 0; i < 2400; i++) { const e = edges[Math.floor(h(i * 3.1) * edges.length)], k = h(i * 5.7), a = nodes[e[0]], b = nodes[e[1]];
    L.parts.push({ tx: lr(a[0], b[0], k), ty: lr(a[1], b[1], k), ang: h(i * 1.3) * Math.PI * 2, sp: 250 + h(i * 2.9) * 750, d: h(i * 7.1) * 0.35, col: h(i * 9.3) < 0.55 ? C.acc : h(i * 9.3) < 0.85 ? C.white : '#FFB38A', r: 1.4 + h(i * 4.4) * 2.6 }); }
  // gantt rows
  L.gantt = Array.from({ length: 11 }, (_, i) => { const s = 0.05 + h(i * 3.3) * 0.45 + i * 0.02; return { s, e: Math.min(0.97, s + 0.12 + h(i * 8.1) * 0.35), crit: [1, 3, 4, 7, 9].includes(i) }; });
}

// ---------- 01 · EXTRUSION (B0–B4) ----------
const PLATE = 800, R = 34, GND = PLATE - R, NOZ = 214;
function beadY(t) {
  if (t < 0.14) return NOZ + R * E.o2(t / 0.14) * 0.6;
  if (t < B(1)) return lr(NOZ + R * 0.6, GND, E.i2((t - 0.14) / (B(1) - 0.14)));
  const hop = (a, hgt) => GND - hgt * 4 * ((t - B(a)) / P) * (1 - (t - B(a)) / P);
  if (t < B(2)) return hop(1, 330); if (t < B(3)) return hop(2, 150);
  if (t < B(3.5)) { const u = (t - B(3)) / (P / 2); return GND - 60 * 4 * u * (1 - u); }
  return GND;
}
function ch1(t) {
  bg(C.ink); dotGrid();
  // nozzle + heater block
  x.fillStyle = '#2A2F37'; rr(900, -10, 120, 150, 8); x.fill(); x.fillStyle = C.acc; x.globalAlpha = 0.85; x.fillRect(900, 70, 120, 12); x.globalAlpha = 1;
  x.beginPath(); x.moveTo(925, 140); x.lineTo(995, 140); x.lineTo(968, NOZ - 10); x.lineTo(952, NOZ - 10); x.closePath(); x.fillStyle = '#C9A15A'; x.fill();
  mono('HOT END', 1040, 60, 'rgba(236,232,223,0.45)', 13); mono('FDM', 1040, 84, C.acc, 13);
  // build plate ruler
  line(240, PLATE, 1680, PLATE, 'rgba(236,232,223,0.8)', 2);
  for (let i = 0; i <= 72; i++) { const px = 240 + i * 20, big = i % 5 === 0; line(px, PLATE, px, PLATE + (big ? 22 : 10), 'rgba(236,232,223,0.45)', 1.5); if (i % 10 === 0) mono(String(i * 2), px, PLATE + 48, 'rgba(236,232,223,0.45)', 13, { align: 'center' }); }
  mono('BUILD PLATE · MM', 240, PLATE - 18, 'rgba(236,232,223,0.45)', 13);
  const y = beadY(t), vy = (beadY(t) - beadY(Math.max(0, t - 1 / FPS))) * FPS;
  let sx = 1, sy = 1, cx = 960;
  for (const c of [1, 2, 3]) { const d = t - B(c); if (d >= 0 && d < 0.3) { const s = 0.38 * Math.exp(-d * 16) * Math.cos(d * 38) * (c === 3 ? 0.7 : 1); sx = 1 + s; sy = 1 - s; } }
  if (Math.abs(vy) > 300 && sy === 1) { sy = 1 + Math.min(0.32, Math.abs(vy) / 4200); sx = 1 / sy; }
  const grow = t < 0.14 ? E.o2(t / 0.14) : 1;
  // laser smear B3.5–B4
  const lk = pr(t, B(3.45), B(4) - B(3.45));
  if (lk > 0) {
    const k = E.xi(lk), len = lr(2 * R, 2400, k), th = lr(2 * R, 6, E.o3(lk));
    x.save(); x.shadowColor = C.acc; x.shadowBlur = 40 + 60 * k; x.fillStyle = mix(C.acc, '#FFFFFF', k * 0.85);
    rr(cx - len * 0.25, GND - th / 2 + (R - th / 2) * 0, len, th, th / 2); x.fill(); x.restore();
  } else {
    const hgt = GND - y; ell(cx, PLATE + 4, R * (1.5 - hgt / 700) * sx, 7, `rgba(255,91,20,${0.35 * (1 - hgt / 700)})`);
    bead(cx, y + R * (1 - sy), R * grow, sx, sy, C.acc, 24);
    // leader + readout
    if (t > 0.3) {
      const a = pr(t, 0.3, 0.2), lx = cx + 26, ly = y - 26, kx = cx + 170, ky = y - 130;
      x.globalAlpha = a; line(lx, ly, kx, ky, 'rgba(236,232,223,0.6)', 1.5); line(kx, ky, kx + 260, ky, 'rgba(236,232,223,0.6)', 1.5);
      const z = ((GND - y) / 20).toFixed(1).padStart(5, ' '), v = (-vy / 20).toFixed(0).padStart(5, ' ');
      mono(`Z   ${z} MM`, kx + 6, ky - 46, C.paper, 15); mono(`VEL ${v} MM/S`, kx + 6, ky - 24, C.paper, 15); mono(`SCL ${sx.toFixed(2)} / ${sy.toFixed(2)}`, kx + 6, ky + 26, 'rgba(236,232,223,0.6)', 15);
      x.globalAlpha = 1;
    }
  }
  return 'dark';
}

// ---------- 02 · DESIGN INTENT (B4–B8) ----------
function ch2(t) {
  bg(C.paper);
  const order = [3, 0, 5, 2, 4, 1];
  const drag = E.io3(pr(t, B(5.6), B(6.6) - B(5.6))), sc = 1 + 0.1 * drag;
  const wpk = pr(t, B(7), B(1)); // wallpaper progress
  const baseY = 520, fade = 1 - E.o2(pr(t, B(7.05), 0.22));
  // CAD construction lines
  x.globalAlpha = 0.5 * fade; line(0, baseY, W, baseY, 'rgba(11,13,16,0.18)', 1); line(W / 2, 0, W / 2, H, 'rgba(11,13,16,0.12)', 1); x.globalAlpha = 1;
  x.save(); x.translate(W / 2, baseY - 90); x.scale(sc, sc); x.translate(-W / 2, -(baseY - 90)); x.globalAlpha = fade;
  L.dL.forEach((l, i) => {
    const st = B(4) + 0.06 + order.indexOf(i) * 0.075, k = pr(t, st, 0.34); if (k <= 0) return;
    const dy = -170 * (1 - E.bo(k, 2.2)), blur = k < 0.5;
    if (blur) for (let g = 1; g <= 3; g++) txt(l.ch, l.x, baseY + dy - g * 28, 'Disp', 250, rgba(C.ink, 0.12), { w: 900, stretch: 'expanded' });
    x.save(); x.translate(l.x, baseY + dy); x.scale(1, k < 0.5 ? 1.15 : 1); txt(l.ch, 0, 0, 'Disp', 250, C.ink, { w: 900, stretch: 'expanded' }); x.restore();
  });
  x.restore();
  // selection box + cursor
  const sk = pr(t, B(5.15), 0.12);
  if (sk > 0 && fade > 0) {
    x.globalAlpha = sk * fade;
    const bw = L.dW * sc + 40, bh = 210 * sc + 30, bx = W / 2 - bw / 2, by = baseY - 90 - bh / 2 - 10 * sc;
    x.strokeStyle = C.acc; x.lineWidth = 3; x.strokeRect(bx, by, bw, bh);
    for (const [hx, hy] of [[0, 0], [0.5, 0], [1, 0], [0, 0.5], [1, 0.5], [0, 1], [0.5, 1], [1, 1]]) { x.fillStyle = C.white; x.fillRect(bx + bw * hx - 8, by + bh * hy - 8, 16, 16); x.strokeRect(bx + bw * hx - 8, by + bh * hy - 8, 16, 16); }
    const tag = `W ${Math.round(bw)}  H ${Math.round(bh)}  SX ${(sc * 100).toFixed(1)}%`;
    font('Mono', 15, 500); x.letterSpacing = '3px'; const tw = x.measureText(tag).width + 24; x.letterSpacing = '0px';
    x.fillStyle = C.acc; x.fillRect(bx, by - 40, tw, 30); mono(tag, bx + 12, by - 19, C.white, 15, { ls: 3 });
    // dimension line under
    const dy2 = by + bh + 34; line(bx, dy2, bx + bw, dy2, rgba(C.ink, 0.5), 1.5); line(bx, dy2 - 10, bx, dy2 + 10, rgba(C.ink, 0.5), 1.5); line(bx + bw, dy2 - 10, bx + bw, dy2 + 10, rgba(C.ink, 0.5), 1.5);
    mono('SOLIDWORKS · SKETCH 1 · FULLY DEFINED', W / 2, dy2 + 30, rgba(C.ink, 0.6), 13, { align: 'center' });
    const ck = E.io3(pr(t, B(5.2), B(5.6) - B(5.2))), hxp = bx + bw, hyp = by + bh;
    cursor(lr(1560, hxp, ck) + 2, lr(930, hyp, ck) + 2);
    x.globalAlpha = 1;
  }
  // & manufacture (serif aside)
  const mk = pr(t, B(6.3), 0.3);
  if (mk > 0 && fade > 0) { x.save(); x.beginPath(); x.rect(0, 0, lr(500, W, E.o3(mk)), H); x.clip(); txt('& manufacture', W / 2, 850, 'Ser', 150, C.acc, { align: 'center', a: fade }); x.restore(); }
  // wallpaper of print layers
  if (wpk > 0) {
    x.save(); x.translate(W / 2, H / 2); x.rotate(-0.21);
    const rows = 14, rh = 132;
    for (let r = 0; r < rows; r++) {
      const ri = rows - 1 - r, rk = pr(wpk, ri * 0.035, 0.25); if (rk <= 0) continue;
      const yy = (r - rows / 2) * rh + 50, dir = r % 2 ? 1 : -1, off = dir * (200 * E.o3(rk) + wpk * 220) - (r * 173) % L.wpW;
      const filled = r === 5 || r === 9, band = r === 7 && wpk > 0.62;
      if (band) { x.fillStyle = C.ink; x.fillRect(-2000, yy - rh + 24, 4000, rh); }
      font('Disp', 120, 900, 'normal'); x.letterSpacing = '6px'; x.globalAlpha = E.o2(rk);
      for (let k = -4; k < 5; k++) {
        const px = off + k * L.wpW - 1200;
        if (filled && wpk > 0.45) { x.fillStyle = C.acc; x.fillText('MANUFACTURE', px, yy); }
        else if (band) { x.fillStyle = C.paper; x.fillText('MANUFACTURE', px, yy); }
        else { x.strokeStyle = C.ink; x.lineWidth = 2; x.strokeText('MANUFACTURE', px, yy); }
      }
      x.letterSpacing = '0px'; x.globalAlpha = 1;
    }
    x.restore();
  }
  return 'paper';
}

// ---------- 03 · CLEANROOM (B8–B12) ----------
const ROWX = (i) => 540 + 120 * i, ROWY = 540;
function ch3(t) {
  bg(C.ink); dotGrid();
  const settle = 1 + 0.06 * (1 - E.o3(pr(t, B(8), 0.4)));
  const ly = 600;
  x.save(); x.translate(W / 2, ly - 80); x.scale(settle, settle); x.translate(-W / 2, -(ly - 80));
  L.nL.forEach((l, i) => {
    const st = B(9.3) + i * 0.11, k = pr(t, st, 0.22), cx = l.x + l.cw / 2;
    const mv = E.io3(pr(t, B(11), B(0.75)));
    if (k < 1) { x.save(); x.translate(cx, ly - 80); x.scale(1 - E.i2(k) * 0.9, 1 - E.i2(k) * 0.9); x.translate(-cx, -(ly - 80));
      x.shadowColor = 'rgba(255,255,255,0.7)'; x.shadowBlur = 36; txt(l.ch, l.x, ly, 'Disp', 230, C.white, { w: 900, stretch: 'expanded', a: 1 - E.i2(k) }); x.restore(); }
    if (k > 0.3) { const dk = E.bo(pr(k, 0.3, 0.7), 2.5); const tx2 = lr(cx, ROWX(i < 3 ? i : i + 1), mv), ty2 = lr(ly - 80, ROWY, mv);
      const str = 1 + 0.5 * E.io3(pr(t, B(11.6), B(0.4))); bead(tx2, ty2, 26 * dk, 1, str, C.acc, 18); }
  });
  x.restore();
  // 8th dot: the bead drops in from above
  const dk = pr(t, B(10.3), B(0.7));
  if (dk > 0) { const mv = E.io3(pr(t, B(11), B(0.75)));
    const fy = lr(-60, ly - 80 - 170, E.i2(cl(dk / 0.8))), land = dk > 0.8;
    const sq = land ? 0.3 * Math.exp(-(dk - 0.8) * 40) : 0; const bx2 = lr(W / 2, ROWX(3), mv), by2 = land ? lr(ly - 250, ROWY, mv) : fy;
    const str = 1 + 0.5 * E.io3(pr(t, B(11.6), B(0.4)));
    bead(bx2, by2, 26, 1 + sq, (1 - sq) * str, C.acc, 18); }
  // subtitle
  const sa = 1 - pr(t, B(9.2), 0.2);
  mono('SDSU NANOFAB  ·  CLEANROOM  ·  JAN–MAY 2026', W / 2, 700, rgba(C.paper, 0.7), 18, { align: 'center', a: sa });
  mono('MICRO-SUPERCAPACITOR — DESIGNED + FABRICATED', W / 2, 736, C.acc, 18, { align: 'center', a: sa });
  return 'dark';
}

// ---------- 04 · INTERDIGITATED (B12–B16) ----------
function ch4(t) {
  bg(C.paper);
  const cam = E.io3(pr(t, B(12), B(4)));
  x.save(); x.translate(W / 2 - 80, H / 2); x.scale(1 + 0.12 * cam, 1 + 0.12 * cam); x.rotate(-0.035 * cam); x.translate(-(W / 2 - 80), -H / 2);
  const V = 5 * E.io3(pr(t, B(13), B(2.4))), Ek = V / 5;
  // electrolyte well
  x.fillStyle = rgba(C.acc, 0.05 + 0.08 * Ek); rr(470, 290, 980, 500, 10); x.fill();
  // bus bars
  const bk = E.o3(pr(t, B(12.25), B(0.6)));
  x.fillStyle = C.ink; x.fillRect(480, 240, 960 * bk, 50); x.fillRect(1440 - 960 * bk, 790, 960 * bk, 50);
  mono('+', 455, 276, C.ink, 26, { align: 'right', a: bk }); mono('−', 1470, 828, C.ink, 26, { a: bk });
  // fingers morph from dots
  for (let i = 0; i < 8; i++) {
    const k = E.io3(pr(t, B(12) + i * 0.035, B(0.6))), top = i % 2 === 0;
    const fy0 = top ? 290 : 350, fy1 = top ? 730 : 790, cy = lr(ROWY, (fy0 + fy1) / 2, k), hh = lr(78, fy1 - fy0, k), w = lr(52, 56, k);
    x.fillStyle = mix(C.acc, C.ink, k); rr(ROWX(i) - w / 2, cy - hh / 2, w, hh, lr(26, 4, k)); x.fill();
    if (Ek > 0) { x.strokeStyle = rgba(C.acc, 0.9 * Ek); x.lineWidth = 3; x.stroke(); }
  }
  // ions drift to finger walls as V rises
  for (let g = 0; g < 7; g++) for (let j = 0; j < 16; j++) {
    const id = g * 16 + j, cat = j % 2 === 0, gc = (ROWX(g) + ROWX(g + 1)) / 2, side = (g % 2 === 0 ? 1 : -1) * (cat ? 1 : -1);
    const base = (h(id * 3.7) - 0.5) * 40, yy = 380 + h(id * 1.9) * 330 + Math.sin(t * 3 + id) * 4 * (1 - Ek);
    const xx = gc + lr(base, side * 22, E.o2(cl(Ek * 1.2 - h(id) * 0.2)));
    const a = pr(t, B(12.6), 0.3);
    if (cat) circ(xx, yy, 5, rgba(C.acc, a)); else { x.beginPath(); x.arc(xx, yy, 4.5, 0, 7); x.strokeStyle = rgba(C.ink, 0.7 * a); x.lineWidth = 2; x.stroke(); }
  }
  x.restore();
  // readout (screen space)
  const ra = pr(t, B(12.8), 0.2);
  x.globalAlpha = ra;
  readout(1480, 300, [['V', V.toFixed(2) + ' V'], ['C_SIM', '1.91 µF'], ['E = ½CV²', (0.5 * 1.91 * V * V).toFixed(1) + ' µJ'], ['TARGET', 'TRANSIENT BUFFER']], C.ink, 'COMSOL · ANALYTICAL', 'rgba(255,255,255,0.65)');
  // colorbar
  const g = x.createLinearGradient(1480, 0, 1860, 0); g.addColorStop(0, C.ink); g.addColorStop(0.6, C.acc); g.addColorStop(1, '#FFE0C8');
  x.fillStyle = g; x.fillRect(1480, 520, 380, 12); mono('0 V', 1480, 556, rgba(C.ink, 0.6), 13); mono('5 V', 1860, 556, rgba(C.ink, 0.6), 13, { align: 'right' });
  x.globalAlpha = 1;
  txt('1.91 µF', 120, 940, 'Ser', 92, C.acc, { a: pr(t, B(14.5), 0.25) });
  mono('INTERDIGITATED ELECTRODES · SIMULATED', 124, 975, rgba(C.ink, 0.55), 14, { a: pr(t, B(14.5), 0.25) });
  // pre-drop: iris closes on B15.5–B16
  const ik = pr(t, B(15.45), B(0.55));
  if (ik > 0) { x.save(); x.beginPath(); x.rect(0, 0, W, H); x.arc(ROWX(3) + 60, H / 2, lr(1300, 0, E.i3(ik)), 0, Math.PI * 2, true); x.fillStyle = C.ink; x.fill('evenodd'); x.restore(); }
  return ik > 0.6 ? 'dark' : 'paper';
}

// ---------- 05 · FINITE ELEMENTS (B16–B20) ----------
function heat(v) { return v < 0.5 ? mix('#1B2230', C.acc, v * 2) : mix(C.acc, '#FFE9D6', (v - 0.5) * 2); }
function ch5(t) {
  bg(C.ink); dotGrid();
  const M = L.mesh, t0 = B(16), lt = t - t0;
  const conv = (p) => E.io3(pr(lt, P * 1.05 + p.d * P, P * 1.4));
  const meshA = pr(t, B(18.6), B(0.5)), fillK = pr(t, B(18.9), B(0.7));
  // heat fill
  if (fillK > 0) M.tris.forEach((tr) => { const [a, b, c] = tr.map((i) => M.nodes[i]); const mx = (a[0] + b[0] + c[0]) / 3, my = (a[1] + b[1] + c[1]) / 3;
    if (mx > 600 + 1100 * E.o2(fillK)) return; const d = Math.hypot(mx - M.jx, my - M.jy); const v = cl(1 - d / 520) ** 1.6;
    x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.lineTo(c[0], c[1]); x.closePath(); x.fillStyle = heat(v * (0.6 + 0.4 * Math.sin(t * 6 + d * 0.02) ** 2)); x.fill(); });
  if (meshA > 0) { x.beginPath(); M.edges.forEach(([a, b]) => { x.moveTo(...M.nodes[a]); x.lineTo(...M.nodes[b]); }); x.strokeStyle = rgba(C.paper, 0.55 * meshA); x.lineWidth = 1; x.stroke(); }
  // particles
  x.save(); x.globalCompositeOperation = 'lighter';
  const pa = 1 - pr(t, B(19), B(0.6));
  if (pa > 0) L.parts.forEach((p, i) => {
    const bk = E.xo(cl(lt / (P * 1.2))), sw = Math.sin(i * 1.7 + lt * 3) * 60 * (1 - conv(p));
    const ang = p.ang + lt * 1.4 * (1 - conv(p)), bx = 960 + Math.cos(ang) * p.sp * bk + sw, by = 540 + Math.sin(ang) * p.sp * bk * 0.62 + sw * 0.5;
    const k = conv(p); circ(lr(bx, p.tx, k), lr(by, p.ty, k), p.r * (1 - 0.4 * k), rgba(p.col, 0.85 * pa));
  });
  x.restore();
  // iris flash
  const fk = pr(t, t0, 0.35);
  if (fk < 1) { x.beginPath(); x.arc(960, 540, lr(10, 1150, E.xo(fk)), 0, 7); x.strokeStyle = rgba(C.white, 1 - fk); x.lineWidth = lr(80, 2, fk); x.stroke(); }
  // overlay
  const ra = pr(t, B(18.7), 0.2);
  x.globalAlpha = ra;
  readout(1480, 300, [['SOLVER', 'NX NASTRAN'], ['NODES', String(M.nodes.length)], ['ELEMENTS', String(M.tris.length) + ' TRI3'], ['σ_VM', fillK > 0 ? 'NORMALIZED' : '—']], C.paper, 'FEMAP · STATIC', 'rgba(11,13,16,0.7)');
  mono('BIOFET ELECTRODE  ·  200 µm × 200 µm  ·  Cr/Pt TRACE  ·  POLYIMIDE', 600, 860, rgba(C.paper, 0.7), 15, { ls: 2.5 });
  line(600, 830, 1100, 830, rgba(C.paper, 0.5), 1.5); line(600, 822, 600, 838, rgba(C.paper, 0.5), 1.5); line(1100, 822, 1100, 838, rgba(C.paper, 0.5), 1.5);
  x.globalAlpha = 1;
  // out: hot spot floods orange
  const ok = pr(t, B(19.55), B(0.45));
  if (ok > 0) circ(M.jx, M.jy, 2400 * E.xi(ok), C.acc);
  return ok > 0.7 ? 'paper' : 'dark';
}

// ---------- 06 · SOFT ROBOTICS (B20–B24) ----------
function act(t) { // grip on each beat, overshoot
  const b = (t - B(20)) / P; if (b < 0.15) return 0;
  const i = Math.floor(b - 0.15), f = b - 0.15 - i, close = i % 2 === 0;
  const k = E.el(cl(f / 0.7)); return close ? k : 1 - k;
}
function finger(px, py, segs, seg, w, bend, ang0) {
  let cx = px, cy = py, a = ang0;
  const pts = [];
  for (let i = 0; i < segs; i++) { pts.push([cx, cy, a]); cx += Math.sin(a) * seg; cy -= Math.cos(a) * seg; a -= bend / segs; }
  // body
  pts.forEach(([sx2, sy2, a2], i) => {
    x.save(); x.translate(sx2, sy2); x.rotate(a2);
    const g = x.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.6, C.sil); g.addColorStop(1, '#CFC6B6');
    rr(-w / 2, -seg - 2, w, seg + 6, 14); x.fillStyle = g; x.fill();
    x.fillStyle = 'rgba(11,13,16,0.08)'; x.fillRect(-w / 2 + 6, -seg + 3, w - 12, 3);
    line(-w / 2 + 7, -seg - 1, -w / 2 + 7, 3, 'rgba(11,13,16,0.55)', 4); // strain-limiting layer
    x.restore();
  });
  // sensor trace
  x.beginPath(); pts.forEach(([sx2, sy2, a2], i) => { const ox = Math.cos(a2) * (-w / 2 + 16), oy = Math.sin(a2) * (-w / 2 + 16); i ? x.lineTo(sx2 + ox, sy2 + oy) : x.moveTo(sx2 + ox, sy2 + oy); });
  x.strokeStyle = C.acc; x.lineWidth = 2.5; x.setLineDash([6, 5]); x.stroke(); x.setLineDash([]);
  return [cx, cy];
}
function ch6(t) {
  bg(C.acc);
  x.fillStyle = 'rgba(11,13,16,0.08)'; for (let gy = 24; gy < H; gy += 48) for (let gx = 24; gx < W; gx += 48) x.fillRect(gx - 1.3, gy - 1.3, 2.6, 2.6);
  const push = pr(t, B(23.5), B(0.5)), cam = 1 + 0.06 * pr(t, B(20), B(3.5)) + 2.6 * E.xi(push);
  const a = act(t), deg = a * 78;
  x.save(); x.translate(230, -110); if (push > 0) x.filter = `blur(${(18 * push).toFixed(1)}px)`;
  x.translate(820, 300); x.scale(cam, cam); x.translate(-820, -300);
  // palm
  const g = x.createLinearGradient(560, 0, 1060, 0); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#D9D0C0');
  rr(560, 740, 520, 260, 60); x.fillStyle = g; x.fill();
  x.fillStyle = 'rgba(11,13,16,0.85)'; rr(600, 960, 440, 40, 8); x.fill(); mono('FDM-PRINTED MOLD BASE', 820, 987, rgba(C.paper, 0.8), 12, { align: 'center' });
  const bend = (deg * Math.PI) / 180;
  [[640, 1.0], [760, 1.12], [880, 1.06], [1000, 0.92]].forEach(([fx, s], i) => finger(fx, 750, 6, 62 * s, 96, bend * (1 + i * 0.05), 0.04 * (i - 1.5)));
  finger(1070, 860, 4, 58, 92, -bend * 0.7, 1.05); // thumb
  x.restore(); x.filter = 'none';
  // overlay panel: sensor plot
  if (push < 0.5) {
    const px = 1440, py = 170, w = 400, hh = 280;
    x.fillStyle = 'rgba(11,13,16,0.92)'; rr(px, py, w, hh, 6); x.fill();
    mono('PIEZORESISTIVE · ARDUINO → PYTHON', px + 20, py + 34, C.acc, 13);
    line(px + 20, py + 48, px + w - 20, py + 48, 'rgba(236,232,223,0.2)', 1);
    x.save(); rr(px, py + 50, w, hh - 84, 6); x.clip(); x.beginPath(); for (let i = 0; i <= 200; i++) { const tt = t - (200 - i) * 0.008; const v = tt < B(20) ? 0 : act(tt); const xx = px + 20 + i * ((w - 40) / 200), yy = py + hh - 50 - Math.max(-0.04, v) * 150; i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
    x.strokeStyle = C.paper; x.lineWidth = 2.5; x.stroke(); x.restore();
    mono(`θ ${deg.toFixed(1).padStart(5, ' ')}°`, px + 20, py + hh - 14, C.paper, 15); mono('ECOFLEX SILICONE', px + w - 20, py + hh - 14, 'rgba(236,232,223,0.6)', 13, { align: 'right' });
    txt('soft hands,', 130, 300, 'Ser', 120, C.ink); txt('honest data.', 130, 410, 'Ser', 120, C.ink);
    mono('3D PRINTING CAMP · ROBOTICS · JUL 2026', 134, 470, C.ink, 15);
  }
  return 'paper';
}

// ---------- flurry (B24–B28) ----------
function fGantt(t) {
  bg(C.paper); const k = pr(t, B(24), P);
  mono('ORACLE PRIMAVERA P6  ·  CRITICAL PATH', 140, 200, C.ink, 16);
  const x0 = 140, x1 = 1780, rowH = 52;
  for (let i = 0; i <= 12; i++) line(x0 + ((x1 - x0) * i) / 12, 230, x0 + ((x1 - x0) * i) / 12, 230 + 11 * rowH, 'rgba(11,13,16,0.1)', 1);
  L.gantt.forEach((g, i) => { const d = E.o3(pr(k, i * 0.035, 0.3)); const xs = lr(x0, x1, g.s), xe = lr(x0, x1, g.s + (g.e - g.s) * d), y = 250 + i * rowH;
    x.fillStyle = g.crit ? C.acc : C.ink; x.fillRect(xs, y, Math.max(0, xe - xs), 28); mono(`A${(1000 + i * 10)}`, x0 - 10, y + 21, rgba(C.ink, 0.55), 12, { align: 'right' }); });
  const dd = lr(x0, x1, 0.15 + 0.7 * E.io3(k)); line(dd, 220, dd, 820, C.yel, 6); mono('DATA DATE', dd + 12, 236, C.ink, 13);
  return 'paper';
}
function fSignal(t) {
  bg(C.ink); const k = pr(t, B(25), P);
  x.save(); x.beginPath(); x.rect(0, 0, W, H); x.clip(); x.translate(W / 2, H / 2); x.rotate(-0.5);
  for (let i = -30; i < 30; i++) { if (i % 2) continue; x.fillStyle = C.yel; x.fillRect(i * 70 + (k * 140) % 140, -1400, 70, 2800); } x.restore();
  x.fillStyle = C.ink; rr(W / 2 - 150, 150, 300, 780, 40); x.fill();
  [[C.acc, 0.25], [C.yel, 1], [C.paper, 0.15]].forEach(([c, a], i) => { x.save(); if (a === 1) { x.shadowColor = c; x.shadowBlur = 60; } circ(W / 2, 290 + i * 250, 100, rgba(c, a)); x.restore(); });
  x.beginPath(); x.arc(W / 2, 540, 460, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * E.io3(k)); x.strokeStyle = C.paper; x.lineWidth = 10; x.stroke();
  x.fillStyle = C.ink; rr(140, 880, 520, 70, 6); x.fill(); mono('TRAFFIC SIGNAL OPS · Φ2 → Φ6', 164, 925, C.yel, 16);
  return 'dark';
}
function fHola(t, fr) {
  bg(C.yel); const j = (n) => (h(fr * 3.3 + n) - 0.5) * 30;
  for (let s = 0; s < 6; s++) { const y0 = 260 + s * 100; x.save(); x.beginPath(); x.rect(0, y0, W, 100); x.clip(); const dx = fr % 2 ? j(s) : 0;
    x.globalCompositeOperation = 'multiply'; txt('¡HOLA!', W / 2 + dx - 10, 690, 'Disp', 400, C.acc, { w: 900, align: 'center', stretch: 'expanded' });
    txt('¡HOLA!', W / 2 + dx + 10, 690, 'Disp', 400, '#3BC6FF', { w: 900, align: 'center', stretch: 'expanded' }); x.globalCompositeOperation = 'source-over';
    txt('¡HOLA!', W / 2 + dx, 690, 'Disp', 400, C.ink, { w: 900, align: 'center', stretch: 'expanded' }); x.restore(); }
  mono('BILINGÜE  ·  FLUENT SPANISH  ·  ESPAÑOL / ENGLISH', W / 2, 820, C.ink, 18, { align: 'center' });
  return 'paper';
}
function fECG(t) {
  bg(C.ink); dotGrid(); const k = pr(t, B(26.5), P / 2);
  const ecg = (u) => { const p = u % 0.5 / 0.5; return p > 0.42 && p < 0.46 ? -1 : p > 0.46 && p < 0.5 ? 0.45 : p > 0.38 && p < 0.42 ? 0.15 : p > 0.6 && p < 0.7 ? -0.18 * Math.sin((p - 0.6) * 31.4) : 0; };
  x.save(); x.shadowColor = C.acc; x.shadowBlur = 24; x.beginPath();
  for (let i = 0; i <= 400 * k; i++) { const u = i / 400, xx = 100 + u * 1720, yy = 540 + ecg(u * 1.0 + 0.1) * 300; i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
  x.strokeStyle = C.acc; x.lineWidth = 7; x.stroke(); x.restore();
  mono('LICENSED EMT  ·  2022–2023', 140, 900, C.yel, 18);
  return 'dark';
}
function fBumps(t) {
  bg(C.acc); const k = pr(t, B(27), P / 2);
  for (let r = 0; r < 12; r++) for (let c = 0; c < 22; c++) { const cx = c * 96 + (r % 2) * 48 - 20, cy = r * 92 + 20; const g = E.bo(cl(k * 2.4 - h(r * 22 + c) * 0.8), 2);
    ell(cx, cy, 34 * g, 28 * g, C.yel); ell(cx - 8, cy - 8, 12 * g, 9 * g, 'rgba(255,255,255,0.55)');
    if (h(r * 7 + c) > 0.7) circ(cx + 18, cy + 22 + k * 30, 9 * g, C.paper); }
  x.fillStyle = C.ink; rr(140, 860, 640, 70, 6); x.fill(); mono('BIOMIMICRY · WATER CAPTURE · SLA', 164, 905, C.yel, 16);
  return 'paper';
}
function fPath(t, fr) {
  bg(C.ink); const k = pr(t, B(27.5), P / 2);
  x.beginPath(); const n = 24; let started = false;
  for (let i = 0; i < n * k * 1.4 && i < n; i++) { const y = 230 + i * 26, a = i % 2 ? 1460 : 460, b = i % 2 ? 460 : 1460; if (!started) { x.moveTo(a, y); started = true; } x.lineTo(a, y); x.lineTo(b, y); }
  x.strokeStyle = C.yel; x.lineWidth = 9; x.lineJoin = 'round'; x.stroke();
  x.strokeStyle = C.paper; x.lineWidth = 3; x.strokeRect(440, 210, 1040, 640);
  mono('G1 X146.0 Y23.0 E0.84  ·  TA · ADDITIVE MANUFACTURING', 440, 900, C.paper, 15);
  if (t > B(27.78)) noise(fr, 40, 1);
  return 'dark';
}

// ---------- 07 · FIN (B28–end) ----------
function typed(s, t0, dur, t) { return s.slice(0, Math.floor(s.length * cl((t - t0) / dur))); }
function ch7(t, fr) {
  bg(C.ink); dotGrid();
  const rk = E.o3(pr(t, B(28), 0.32));
  x.save(); x.filter = `blur(${(22 * (1 - rk)).toFixed(1)}px)`; x.shadowColor = 'rgba(255,255,255,0.45)'; x.shadowBlur = 40;
  txt('MELANIE GUIDO', L.mX, 500, 'Disp', 118, C.white, { w: 900, ls: 4, a: rk }); x.restore(); x.filter = 'none';
  const nk = 1 - pr(t, B(28), 0.3); if (nk > 0) noise(fr, lr(16, 48, 1 - nk), nk);
  const lk = E.io3(pr(t, B(28.6), B(0.8))); line(L.mX, 548, L.mX + (L.mW + 60) * lk, 548, rgba(C.paper, 0.6), 2);
  const s1 = 'MECHANICAL ENGINEER — DESIGN & MANUFACTURING', s2 = 'M.S. SAN DIEGO STATE · DEC 2026  ·  FE CIVIL · MAY 2027';
  const a1 = typed(s1, B(29.2), B(1), t), a2 = typed(s2, B(30.2), B(1), t);
  mono(a1, L.mX, 606, C.paper, 22, { ls: 4 }); mono(a2, L.mX, 646, rgba(C.paper, 0.6), 18, { ls: 3.4 });
  const blink = Math.floor((t - B(29)) / (P / 2)) % 2 === 0;
  if (t > B(29) && (t < B(31.3) || blink)) { const cur = t < B(30.2) ? a1 : a2; font('Mono', t < B(30.2) ? 22 : 18, 500); x.letterSpacing = (t < B(30.2) ? 4 : 3.4) + 'px'; const cw = x.measureText(cur).width; x.letterSpacing = '0px';
    x.fillStyle = C.acc; x.fillRect(L.mX + cw + 4, t < B(30.2) ? 586 : 630, 14, t < B(30.2) ? 26 : 22); }
  // the bead lands as the period
  const px = L.mX + L.mW + 30, py = 500 - 17, fk = pr(t, B(29.5), B(0.5));
  if (fk > 0) { let y = lr(-80, py, E.i2(fk)), sx = 1, sy = 1; const d = t - B(30);
    if (d > 0) { const s = 0.4 * Math.exp(-d * 14) * Math.cos(d * 36); sx = 1 + s; sy = 1 - s; y = py + 17 * (1 - sy); }
    ell(px, 504, 22 * sx, 4, 'rgba(255,91,20,0.35)'); bead(px, y, 17, sx, sy, C.acc, 26); }
  txt('designed, simulated, fabricated — and taught.', L.mX, 770, 'Ser', 46, C.paper, { a: 0.55 * pr(t, B(31), B(0.8)) });
  return 'dark';
}

// ---------- HUD ----------
const CH = [[0, '01 · EXTRUSION'], [B(4), '02 · DESIGN INTENT'], [B(8), '03 · CLEANROOM'], [B(12), '04 · INTERDIGITATED'], [B(16), '05 · FINITE ELEMENTS'], [B(20), '06 · SOFT ROBOTICS'],
  [B(24), '·· P6 SCHEDULE'], [B(25), '·· SIGNAL TIMING'], [B(26), '·· BILINGÜE'], [B(26.5), '·· EMT'], [B(27), '·· BIOMIMICRY'], [B(27.5), '·· TOOLPATHS'], [B(28), '07 · FIN']];
const SEGB = [0, 4, 8, 12, 16, 20, 24, 28, END / P];
const GLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/';
function hud(t, mode, fr) {
  const col = mode === 'paper' ? 'rgba(11,13,16,0.85)' : 'rgba(241,241,241,0.88)', acc = mode === 'paper' && t > B(20) && t < B(24) ? C.ink : C.acc;
  x.strokeStyle = col; x.lineWidth = 2;
  for (const [cx, cy, dx, dy] of [[36, 36, 1, 1], [W - 36, 36, -1, 1], [36, H - 36, 1, -1], [W - 36, H - 36, -1, -1]]) { x.beginPath(); x.moveTo(cx, cy + 30 * dy); x.lineTo(cx, cy); x.lineTo(cx + 30 * dx, cy); x.stroke(); }
  mono('MELANIE GUIDO  /  ENGINEERING REEL', 72, 80, col, 16);
  mono('1920×1080  ·  60P  ·  129 BPM', W - 72, 80, col, 16, { align: 'right' });
  font('Mono', 16, 500); x.letterSpacing = '3.2px'; const tw = x.measureText('1920×1080  ·  60P  ·  129 BPM').width; x.letterSpacing = '0px';
  circ(W - 72 - tw - 18, 74, 5, rgba(acc === C.ink ? C.ink : C.acc, (t / P) % 1 < 0.5 ? 1 : 0.25));
  const pad = (n) => String(n).padStart(2, '0');
  mono(`TC 00:00:${pad(Math.floor(fr / FPS))}:${pad(fr % FPS)}`, 72, 1014, col, 20);
  const f = t / END;
  for (let i = 0; i < SEGB.length - 1; i++) { const x0 = 640 + (SEGB[i] * P / END) * 640 + (i ? 2 : 0), x1 = 640 + Math.min(640, (SEGB[i + 1] * P / END) * 640) - (i < SEGB.length - 2 ? 2 : 0);
    x.fillStyle = mode === 'paper' ? 'rgba(11,13,16,0.16)' : 'rgba(255,255,255,0.26)'; x.fillRect(x0, 1006, x1 - x0, 5);
    x.fillStyle = acc; x.fillRect(x0, 1006, cl(640 + f * 640 - x0, 0, x1 - x0), 5); }
  circ(640 + f * 640, 1008.5, 7.5, acc);
  let c = CH[0]; for (const e of CH) if (t >= e[0] - 1e-4) c = e;
  const since = t - c[0]; let lab = c[1];
  if (since < 0.16 && c[0] > 0) { const n = Math.floor((since / 0.16) * lab.length); lab = [...lab].map((ch, i) => (i < n || ch === ' ' || ch === '·' ? ch : GLY[Math.floor(h(fr * 13 + i) * GLY.length)])).join(''); }
  mono(lab, W - 72, 1014, col, 16, { align: 'right' });
}

// ---------- master ----------
function frame(t) {
  const fr = Math.round(t * FPS);
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.shadowBlur = 0; x.globalCompositeOperation = 'source-over';
  let mode;
  if (t < B(4)) mode = ch1(t);
  else if (t < B(8)) mode = ch2(t);
  else if (t < B(12)) mode = ch3(t);
  else if (t < B(16)) mode = ch4(t);
  else if (t < B(20)) mode = ch5(t);
  else if (t < B(24)) mode = ch6(t);
  else if (t < B(25)) mode = fGantt(t);
  else if (t < B(26)) mode = fSignal(t);
  else if (t < B(26.5)) mode = fHola(t, fr);
  else if (t < B(27)) mode = fECG(t);
  else if (t < B(27.5)) mode = fBumps(t);
  else if (t < B(28)) mode = fPath(t, fr);
  else mode = ch7(t, fr);
  x.shadowBlur = 0; x.globalAlpha = 1;
  // flashes, computed per frame (seek-safe)
  let fl = 0;
  fl = Math.max(fl, pr(t, B(3.82), B(4) - B(3.82)) * (t < B(4) ? 1 : 0), t >= B(4) ? 1 - pr(t, B(4), 0.14) : 0);
  if (t >= B(8)) fl = Math.max(fl, 0.5 * (1 - pr(t, B(8), 0.08)));
  if (t >= B(24)) fl = Math.max(fl, 0.35 * (1 - pr(t, B(24), 0.06)));
  if (fl > 0) { x.fillStyle = `rgba(255,255,255,${fl})`; x.fillRect(0, 0, W, H); }
  vignette(mode === 'dark' ? 0.55 : 0.28);
  hud(t, mode, fr);
  const fo = pr(t, END - 0.25, 0.25); if (fo > 0) { x.fillStyle = `rgba(0,0,0,${fo})`; x.fillRect(0, 0, W, H); }
}
window.seek = frame;
document.fonts.ready.then(async () => {
  await Promise.all([document.fonts.load('900 100px Disp'), document.fonts.load('100px Ser'), document.fonts.load('500 16px Mono')]);
  measure(); frame(0); window.READY = true;
  const q = new URLSearchParams(location.search).get('t'); if (q) frame(+q);
});
