// Generates the two HyperFrames compositions (16x9 and 9x16) from grid.json + measured site coordinates.
// Usage: node scripts/build.cjs   -> writes 16x9/index.html, 9x16/index.html, qa/text-manifest.json
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'grid.json'), 'utf8'));
const P = G.period, FPS = G.fps;
const b = (x) => +(x * P).toFixed(4);
const C2S = G.chapters[1].start, C3S = G.chapters[2].start, C4S = G.chapters[3].start, C5S = G.chapters[4].start, NB = G.beats;
const LD = G.audit.ladder.start, FXG = G.fix, FL0 = G.fix.flurry[0], DROPGAP = G.preDropGap[0];
const VD = 7; // vertical cut: desktop window closes / mobile window opens
const FONTS = fs.readFileSync(path.join(ROOT, 'assets/fonts/fonts.css'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- copy: every string is verbatim from the report, the live site, or the brief ----------
const C = {
  findings: [
    { sev: 'High', title: 'Headline names no pain and no audience', where: 'Homepage · Hero headline' },
    { sev: 'High', title: 'Expired UNBOUND-U summit still promoted', where: 'Homepage · Card under the hero and “On stage” section' },
    { sev: 'Medium', title: 'Hero buttons don’t lead to a booking', where: 'Homepage · Hero buttons' },
    { sev: 'Medium', title: 'Testimonials don’t say who the client is', where: 'Homepage and Testimonials page' },
  ],
  newHeadline: 'So tired all the time? Or asking “what now?” You’re not the only one.',
  newButton: 'Book a free 30-minute call',
  fixCaps: ['Put their pain into the headline in their words', 'Make the hero’s main button “Book a free 30-minute call.”', 'Remove the October 16 card in both places'],
  quotes: [ // [text, source] in report order of appearance; flurry order is set below
    ['I have been struggling with the “what now” question.', 'YouTube · The Empty Nest Chapter: How I Rediscovered Myself After 15 Years as a Stay-at-Home Mom'],
    ['Now, who am i is a real useless feeling. Finding yourself is tough.', 'YouTube · Why You\'re Feeling Useless After Retirement (And How To Fix It)'],
    ['So tired at 63. Five months to retirement and planning on starting to exercise and eat good.', 'r/AskWomenOver60 · comment'],
    ['I realized I\'d spent my entire adulthood as someone\'s wife and mother, I had no idea who I really was.', 'r/AskWomenOver50 · comment'],
    ['I had forgotten what I really liked to eat.. I had been cooking for my family the whole time.', 'YouTube · The Empty Nest Chapter: How I Rediscovered Myself After 15 Years as a Stay-at-Home Mom'],
    ['I’m microanalysing everything I eat. It’s exhausting.', 'YouTube · Why Your Diet Is Making Menopause Worse (It\'s Not Just Hormones)'],
    ['Life truly began for me at 50!!', 'r/AskWomenOver50 · comment'],
  ],
  reply: 'Aloha Nastasja, I\'m so glad you ran this report because I think it\'s great suggestions. I loved your feedback and report. It confirmed I should improve and make changes on my website. You are awesome! Mahalo nui loa!',
  ladder: [
    ['Level 1', 'Problem Unaware', ''], ['Level 2', 'Benefit Claims', 'Your site today'], ['Level 3', 'Mechanism Introduction', 'Your market is here'],
    ['Level 4', 'Mechanism Stacking', ''], ['Level 5', 'Identification', ''],
  ],
};
const FLURRY_ORDER = [3, 2, 4, 1, 5, 0, 6]; // longest to shortest, ends on "Life truly began for me at 50!!"
const SEV = { High: '#FF6B6B', Medium: '#F0C040' };

// ---------- measured coordinates (css px, full-page) from assets/measure*.json ----------
const SITE = {
  desktop: { cssW: 1440, cssH: 10309, tiles: 3, pngW: 1440,
    h1: [118, 189, 662, 95], summit1: [118, 852, 1204, 88], summit2: [130, 7164, 1180, 480],
    buttons: [118, 553, 508, 82], testim: [504, 5862, 806, 808], hero: [130, 565, 484, 58], bar: [0, 842, 1440, 107], headCard: [118, 186, 690, 206] },
  mobile: { cssW: 390, cssH: 15449, tiles: 4, pngW: 780,
    h1: [14, 148, 362, 62], summit1: [8, 1213, 374, 288], summit2: [36, 10570, 318, 104], buttons: [12, 869, 262, 148],
    testim: [20, 9002, 350, 409], hero: [20, 877, 262, 58], bar: [0, 1205, 390, 304], headCard: [14, 140, 362, 150] },
};

function build(ratio) {
  const V = ratio === '9x16';
  const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
  const T = []; // timeline statements
  const clips = [];
  const manifest = [];
  const tag = (src, text) => { manifest.push({ src, text }); return `data-t="${src}"`; };
  const bar = 52; // browser chrome height
  // layout
  const L = V
    ? { hudTop: 182, hudBot: 1296, ruler: 1308, win: { x: 180, y: 232, w: 720, h: 790 }, deskWin: { x: 60, y: 232, w: 960, h: 790 }, fixWin: { x: 90, y: 232, w: 900, h: 790 }, capY: 1046, panelY: 1034, mx: 40 }
    : { hudTop: 44, hudBot: 1010, ruler: 1010, win: { x: 80, y: 110, w: 1160, h: 770 }, fixWin: { x: 120, y: 100, w: 1680, h: 760 }, capY: 916, panel: { x: 1290, y: 110, w: 550, h: 770 }, phone: { x: 1405, y: 150, w: 314, h: 680 }, mx: 40 };

  // ---- strip + window builders ----
  const tilesHtml = (kind, s) => {
    const S = SITE[kind]; let out = '';
    for (let i = 0; i < S.tiles; i++) out += `<img src="assets/shots/${kind}-${i}.png" style="display:block;width:${S.cssW * s}px" alt="">`;
    return out;
  };
  const pxbox = (a, s) => ({ x: a[0] * s, y: a[1] * s, w: a[2] * s, h: a[3] * s });
  const scrollState = {};
  const scrollTo = (id, s, sy, t0, dur, ease = 'power3.inOut') => {
    const from = scrollState[id] ?? 0;
    const ir = scrollState[id] === undefined ? '' : ',immediateRender:false';
    T.push(`tl.fromTo('#${id}-strip',{y:${-from * s}},{y:${-sy * s},duration:${dur},ease:'${ease}'${ir}},${t0});`);
    scrollState[id] = sy;
  };
  const winHtml = (id, r, kind, s, extra = '', isPhone = false) => {
    const S = SITE[kind];
    const chrome = isPhone ? '' : `<div class="bar" style="height:${bar}px"><i></i><i></i><i></i><span class="url" ${tag('hud', 'glowhawaii.com')}>glowhawaii.com</span></div>`;
    const top = isPhone ? 0 : bar;
    return `<div id="${id}" class="win${isPhone ? ' phone' : ''}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">${chrome}<div class="vp" style="top:${top}px;height:${r.h - top}px"><div id="${id}-strip" class="strip" style="width:${S.cssW * s}px;height:${S.cssH * s}px">${tilesHtml(kind, s)}${extra}</div></div></div>`;
  };

  // ---- motif svg ----
  const motif = (id, size, cls = '') => {
    const gold = cls === 'close';
    const stops = gold ? '<stop offset="0" stop-color="#F0C040"/><stop offset=".55" stop-color="#C9A135" stop-opacity=".85"/><stop offset="1" stop-color="#F0C040" stop-opacity=".1"/>'
      : '<stop offset="0" stop-color="#3D7FFF"/><stop offset="1" stop-color="#22358A"/>';
    return `<svg id="${id}" class="motif ${cls}" width="${size}" height="${size}" viewBox="0 0 40 40" fill="none">
  <defs><linearGradient id="${id}-g" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="38" y2="38">${stops}</linearGradient></defs>
  <g stroke="url(#${id}-g)" stroke-opacity="${gold ? 1 : 0.85}" stroke-linejoin="miter">
    <rect class="sq" x="2" y="2" width="36" height="36" stroke-width="${gold ? 0.8 : 0.9}" pathLength="1"/><rect class="sq" x="5.5" y="5.5" width="29" height="29" stroke-width="${gold ? 0.8 : 0.9}" pathLength="1"/>
    <rect class="sq" x="9" y="9" width="22" height="22" stroke-width="${gold ? 0.8 : 0.9}" pathLength="1"/><rect class="sq" x="12.5" y="12.5" width="15" height="15" stroke-width="${gold ? 0.8 : 0.9}" pathLength="1"/>
    <path class="dg" d="M16.2 16.2L23.8 23.8M23.8 16.2L16.2 23.8" stroke-width="0.4" pathLength="1"/>
  </g></svg>`; };
  const motifCenter = (id, size, cx, cy, cls = '') => `<div id="${id}-w" class="mwrap" style="left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px">${motif(id, size, cls)}</div>`;

  // =============== SCENE 1 : THE REAL SITE ===============
  const sDesk = V ? 960 / 1440 : L.win.w / 1440;                 // desktop strip scale
  const sMob = V ? L.win.w / 390 : L.phone.w / 390;               // mobile strip scale in ch1 (v: audit uses same)
  const sMobAudit = V ? L.win.w / 390 : 0;
  let s1 = '';
  const sq = L.win; // the square the motif opens into
  s1 += motifCenter('mo-open', V ? 560 : 520, W / 2, V ? 640 : H / 2, 'open');
  let winShared, deskR;
  if (!V) {
    // desktop window persists through the audit; boxes live inside its strip
    const boxes = [];
    const mkBox = (id, a, sev, label, s) => {
      const p = pxbox(a, s), col = SEV[sev];
      const chipTop = p.y > 70 ? -46 : p.h + 8;
      boxes.push(`<div id="${id}" class="sel" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;border-color:${col};background:${col}14"><i class="hd tl" style="background:${col}"></i><i class="hd br" style="background:${col}"></i><div id="${id}-chip" class="chip" style="top:${chipTop}px;background:${col}" ${tag('hud', label)}>${label}</div></div>`);
    };
    const sd = sDesk;
    mkBox('bx-h1', SITE.desktop.h1, 'High', 'HIGH', sd);
    mkBox('bx-s1', SITE.desktop.summit1, 'High', 'HIGH · 1 OF 2', sd);
    mkBox('bx-s2', SITE.desktop.summit2, 'High', 'HIGH · 2 OF 2', sd);
    mkBox('bx-bt', SITE.desktop.buttons, 'Medium', 'MEDIUM', sd);
    mkBox('bx-ts', SITE.desktop.testim, 'Medium', 'MEDIUM', sd);
    winShared = winHtml('win', L.win, 'desktop', sd, boxes.join(''));
  }
  clips.push(['s1', 0, b(C2S + 0.75), `<div id="s1" class="clip scene" data-start="0" data-duration="${b(C2S + 0.75)}" data-track-index="1">${s1}</div>`]);

  // ---- window / phone / captions for chapter 1 + 2 ----
  let wins = '';
  const winStart = b(G.windowOpen[0]);
  if (!V) {
    wins += `<div id="w12" class="clip" data-start="${winStart}" data-duration="${b(C3S + 0.5) - winStart}" data-track-index="2">${winShared}
      ${winHtml('phone', L.phone, 'mobile', sMob, '', true).replace('class="win phone"', 'class="win phone"')}
      <div id="cap-desk" class="cap" style="left:${L.win.x}px;top:${L.capY}px" ${tag('hud', 'DESKTOP · 1440 × 900')}>DESKTOP · 1440 × 900</div>
      <div id="cap-mob" class="cap" style="left:${L.phone.x - 10}px;top:${L.phone.y + L.phone.h + 36}px" ${tag('hud', 'MOBILE · 390 × 844')}>MOBILE · 390 × 844</div>
      <div id="cap-pw" class="cap gold" style="left:${L.win.x + 410}px;top:${L.capY}px" ${tag('hud', 'PLAYWRIGHT · FULL PAGE 10309 PX')}>PLAYWRIGHT · FULL PAGE 10309 PX</div>
      <div id="cursor" class="cursor"><svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 3-8 8-3z" fill="#E8EEFF" stroke="#070D1F" stroke-width="1.6" stroke-linejoin="round"/></svg></div>
    </div>`;
  }
  // desktop (ch1) + mobile windows for vertical
  if (V) {
    const sdk = 960 / 1440, sm = L.win.w / 390;
    const boxes = [];
    const mkBox = (id, a, sev, label) => {
      const p = pxbox(a, sm), col = SEV[sev];
      const chipTop = p.y > 70 ? -46 : p.h + 8;
      boxes.push(`<div id="${id}" class="sel" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;border-color:${col};background:${col}14"><i class="hd tl" style="background:${col}"></i><i class="hd br" style="background:${col}"></i><div id="${id}-chip" class="chip" style="top:${chipTop}px;background:${col}" ${tag('hud', label)}>${label}</div></div>`);
    };
    mkBox('bx-h1', SITE.mobile.h1, 'High', 'HIGH');
    mkBox('bx-s1', SITE.mobile.summit1, 'High', 'HIGH · 1 OF 2');
    mkBox('bx-s2', SITE.mobile.summit2, 'High', 'HIGH · 2 OF 2');
    mkBox('bx-bt', SITE.mobile.buttons, 'Medium', 'MEDIUM');
    mkBox('bx-ts', SITE.mobile.testim, 'Medium', 'MEDIUM');
    wins += `<div id="w1d" class="clip" data-start="${winStart}" data-duration="${b(VD + 1.5) - winStart}" data-track-index="2">${winHtml('wind', L.deskWin, 'desktop', sdk)}
      <div id="cap-desk" class="cap" style="left:${L.deskWin.x}px;top:${L.deskWin.y + L.deskWin.h + 24}px" ${tag('hud', 'DESKTOP · 1440 × 900')}>DESKTOP · 1440 × 900</div></div>
    <div id="w12" class="clip" data-start="${b(VD)}" data-duration="${b(C3S + 0.5) - b(VD)}" data-track-index="3">${winHtml('win', L.win, 'mobile', sm, boxes.join(''), false)}
      <div id="cap-mob" class="cap" style="left:${L.win.x}px;top:${L.win.y + L.win.h + 24}px" ${tag('hud', 'MOBILE · 390 × 844')}>MOBILE · 390 × 844</div>
      <div id="cap-pw" class="cap gold" style="left:${L.win.x + 360}px;top:${L.win.y + L.win.h + 24}px" ${tag('hud', 'FULL PAGE 15449 PX')}>FULL PAGE 15449 PX</div>
      <div id="cursor" class="cursor"><svg width="40" height="40" viewBox="0 0 24 24"><path d="M3 2l7 19 3-8 8-3z" fill="#E8EEFF" stroke="#070D1F" stroke-width="1.6" stroke-linejoin="round"/></svg></div></div>`;
  }

  // =============== SCENE 2 : AUDIT PANEL + LADDER ===============
  let s2 = '';
  const rowH = V ? 0 : 150;
  if (!V) {
    s2 += `<div id="panel" class="panel" style="left:${L.panel.x}px;top:${L.panel.y}px;width:${L.panel.w}px;height:${L.panel.h}px">
      <div class="ph" ${tag('report', 'Conversion Killer Audit')}>CONVERSION KILLER AUDIT</div>`;
    C.findings.forEach((f, i) => {
      s2 += `<div id="row${i}" class="row" style="top:${62 + i * (rowH + 16)}px;height:${rowH}px"><div class="tagrow"><span class="sevtag" style="background:${SEV[f.sev]}" ${tag('report', f.sev)}>${f.sev.toUpperCase()}</span><span class="idx">0${i + 1}</span></div><div class="ttl" ${tag('report', f.title)}>${esc(f.title)}</div></div>`;
    });
    s2 += `</div>`;
  } else {
    s2 += `<div id="panel" class="panelv" style="left:${L.win.x}px;top:${L.panelY}px;width:${L.win.w}px;height:280px">`;
    C.findings.forEach((f, i) => {
      s2 += `<div id="row${i}" class="rowv"><div class="tagrow"><span class="sevtag" style="background:${SEV[f.sev]}" ${tag('report', f.sev)}>${f.sev.toUpperCase()}</span><span class="idx">0${i + 1} / 04</span></div><div class="ttl" ${tag('report', f.title)}>${esc(f.title)}</div><div class="whr" ${tag('report', f.where)}>${esc(f.where)}</div></div>`;
    });
    s2 += `</div>`;
  }
  // ladder
  const lad = (() => {
    const x0 = V ? 60 : 80, x1 = V ? 1020 : 1840, y0 = V ? 232 : 110;
    let h = `<div id="ladder" class="ladder" style="left:${x0}px;top:${y0}px;width:${x1 - x0}px;height:${V ? 1050 : 790}px">`;
    h += `<div class="lab" ${tag('report', 'The Diagnosis')}>THE DIAGNOSIS</div><div id="lh2" class="lh2" ${tag('report', 'Where Your Market Is Right Now')}>Where Your Market Is Right Now</div>`;
    if (!V) {
      const cw = 328, gap = 30, base = 600;
      C.ladder.forEach((r, i) => {
        const hh = 180 + i * 62, cls = i === 1 ? 'site' : i === 2 ? 'mkt' : '';
        h += `<div id="rg${i}" class="rung ${cls}" style="left:${i * (cw + gap)}px;top:${base - hh + 150}px;width:${cw}px;height:${hh}px"><div class="rl" ${tag('report', r[0])}>${r[0].toUpperCase()}</div><div class="rn" ${tag('report', r[1])}>${r[1]}</div>${r[2] ? `<div class="rs" ${tag('report', r[2])}>${r[2]}</div>` : ''}</div>`;
      });
      h += `<div id="l3" class="lline mkt" style="left:0;top:190px" ${tag('report', 'Your market sits at Level 3')}>Your market sits at Level 3</div>`;
      h += `<div id="l2" class="lline site" style="left:0;top:256px" ${tag('report', 'Your homepage headline speaks at Level 2')}>Your homepage headline speaks at Level 2</div>`;
      h += `<div id="gapq" class="gapq" style="left:${2 * (cw + gap) - 12}px;top:348px;max-width:340px" ${tag('report', 'That gap is the opportunity.')}>That gap is the opportunity.</div>`;
    } else {
      const rw = 960, rh = 124, gap = 10, top0 = 150;
      C.ladder.forEach((r, i) => {
        const cls = i === 1 ? 'site' : i === 2 ? 'mkt' : '', fill = 28 + i * 18;
        h += `<div id="rg${i}" class="rungv ${cls}" style="top:${top0 + i * (rh + gap)}px;height:${rh}px;width:${rw}px"><div class="fillv" style="width:${fill}%"></div><div class="rl" ${tag('report', r[0])}>${r[0].toUpperCase()}</div><div class="rn" ${tag('report', r[1])}>${r[1]}</div>${r[2] ? `<div class="rs" ${tag('report', r[2])}>${r[2]}</div>` : ''}</div>`;
      });
      h += `<div id="l3" class="lline mkt" style="left:0;top:${top0 + 5 * (rh + gap) + 16}px" ${tag('report', 'Your market sits at Level 3')}>Your market sits at Level 3</div>`;
      h += `<div id="l2" class="lline site" style="left:0;top:${top0 + 5 * (rh + gap) + 78}px" ${tag('report', 'Your homepage headline speaks at Level 2')}>Your homepage headline speaks at Level 2</div>`;
      h += `<div id="gapq" class="gapq" style="left:0;top:${top0 + 5 * (rh + gap) + 140}px" ${tag('report', 'That gap is the opportunity.')}>That gap is the opportunity.</div>`;
    }
    return h + '</div>';
  })();
  s2 += lad;
  clips.push(['s2', b(C2S), b(C3S + 0.5), `<div id="s2" class="clip scene" data-start="${b(C2S)}" data-duration="${b(C3S + 0.5) - b(C2S)}" data-track-index="4">${s2}</div>`]);

  // =============== SCENE 3 : THE FIX (paper) ===============
  const fixKind = V ? 'mobile' : 'desktop';
  const sFix = V ? L.fixWin.w / 390 : L.fixWin.w / 1440;
  let fixOv = '';
  const fb = SITE[fixKind];
  const hc = pxbox(fb.headCard, sFix), hero = pxbox(fb.hero, sFix), bar2 = pxbox(fb.bar, sFix);
  fixOv += `<div id="fx-h1o" class="sel before" style="left:${pxbox(fb.h1, sFix).x}px;top:${pxbox(fb.h1, sFix).y}px;width:${pxbox(fb.h1, sFix).w}px;height:${pxbox(fb.h1, sFix).h}px;border-color:#FF6B6B"></div>`;
  fixOv += `<div id="fx-h1" class="newcard" style="left:${hc.x}px;top:${hc.y}px;width:${hc.w}px;height:${hc.h}px;clip-path:inset(0 100% 0 0)"><div class="tg" ${tag('hud', 'AFTER · RECOMMENDED')}>AFTER · RECOMMENDED</div><div class="nh" ${tag('report', C.newHeadline)}>${esc(C.newHeadline)}</div></div><div id="fx-h1-edge" class="edge" style="left:${hc.x}px;top:${hc.y}px;height:${hc.h}px"></div>`;
  fixOv += `<div id="fx-bto" class="sel before" style="left:${hero.x - 8}px;top:${hero.y - 8}px;width:${hero.w + 16}px;height:${hero.h + 16}px;border-color:#F0C040"></div>`;
  fixOv += `<div id="fx-bt" class="pill" style="left:${hero.x}px;top:${hero.y}px;width:${hero.w}px;height:${hero.h}px;clip-path:inset(0 100% 0 0)"><span ${tag('report', C.newButton)}>${C.newButton}</span></div><div id="fx-bt-edge" class="edge" style="left:${hero.x}px;top:${hero.y}px;height:${hero.h}px"></div>`;
  fixOv += `<div id="fx-so" class="sel before" style="left:${bar2.x + 6}px;top:${bar2.y + 6}px;width:${bar2.w - 12}px;height:${bar2.h - 12}px;border-color:#FF6B6B"></div>`;
  fixOv += `<div id="fx-sm" class="removed" style="left:${bar2.x}px;top:${bar2.y}px;width:${bar2.w}px;height:${bar2.h}px;clip-path:inset(0 100% 0 0)"><span class="rm" ${tag('hud', 'REMOVED')}>REMOVED</span></div><div id="fx-sm-edge" class="edge" style="left:${bar2.x}px;top:${bar2.y}px;height:${bar2.h}px"></div>`;
  let s3 = `<div id="paper" class="paper"></div>`;
  s3 += `<div id="fixwrap">` + winHtml('fixwin', L.fixWin, fixKind, sFix, fixOv) +
    `<div id="fxchip" class="fxchip" style="left:${L.fixWin.x}px;top:${L.fixWin.y + L.fixWin.h + (V ? 24 : 16)}px"><span id="chB" ${tag('hud', 'BEFORE')}>BEFORE</span><span id="chA" ${tag('hud', 'AFTER · RECOMMENDED')}>AFTER · RECOMMENDED</span></div>`;
  C.fixCaps.forEach((c, i) => { s3 += `<div id="fcap${i}" class="fcap" style="left:${L.fixWin.x}px;top:${L.fixWin.y + L.fixWin.h + (V ? 92 : 78)}px;width:${L.fixWin.w}px" ${tag('report', c)}>${esc(c)}</div>`; });
  s3 += `</div>`;
  // flurry cards (hard cuts)
  const FL = G.fix.flurry, FLEND = G.fix.flurryEnd;
  const palette = [['#0D1530', '#E8EEFF', '#F0C040'], ['#E8EEFF', '#070D1F', '#3D7FFF'], ['#3D7FFF', '#E8EEFF', '#F0C040'], ['#F0C040', '#070D1F', '#070D1F'], ['#070D1F', '#E8EEFF', '#F0C040'], ['#E8EEFF', '#070D1F', '#3D7FFF'], ['#070D1F', '#E8EEFF', '#F0C040']];
  FL.forEach((st, i) => {
    const q = C.quotes[FLURRY_ORDER[i]], pal = palette[i];
    const len = q[0].length; const fs_ = V ? (len > 80 ? 66 : len > 50 ? 80 : 104) : (len > 80 ? 70 : len > 50 ? 88 : 120);
    s3 += `<div id="fc${i}" class="fcard" style="background:${pal[0]};color:${pal[1]};opacity:0"><div class="ftitle" style="color:${pal[1]}" ${tag('brief', 'Audience Awareness')}>Audience Awareness</div><div class="fin" style="padding:${V ? '240px 70px 220px' : '120px 150px'}"><div class="qm" style="color:${pal[2]}">“</div><div class="fq" style="font-size:${fs_}px" ${tag('report', q[0])}>${esc(q[0])}</div><div class="fs" style="color:${pal[2]}" ${tag('report', q[1])}>${esc(q[1])}</div></div></div>`;
  });
  clips.push(['s3', b(C3S), b(C4S + 0.5), `<div id="s3" class="clip scene" data-start="${b(C3S)}" data-duration="${b(C4S + 0.5) - b(C3S)}" data-track-index="5">${s3}</div>`]);

  // =============== SCENE 4 : THE RESPONSE ===============
  const cw = V ? 940 : 1440, ch = V ? 780 : 620, cx0 = (W - cw) / 2, cy0 = V ? 300 : (H - ch) / 2 - 20;
  let s4 = `<div id="rrule" class="rrule" style="left:${cx0}px;top:${cy0 + ch / 2}px;width:${cw}px"></div>
  <div id="rcard" class="rcard" style="left:${cx0}px;top:${cy0}px;width:${cw}px;height:${ch}px;clip-path:inset(50% 0 50% 0)">
   <div class="rlab" ${tag('brief', 'REPLY · OLELO PAʻA OGAWA')}>REPLY · OLELO PAʻA OGAWA</div>
   <div class="rq" style="font-size:${V ? 48 : 54}px"><span id="typed"></span><span id="cur" class="cur"></span></div>
   <div id="rsrc" class="rsrc" ${tag('report', 'Glow Hawaii · The Aloha Chef')}>Glow Hawaii · The Aloha Chef</div></div>`;
  clips.push(['s4', b(C4S), b(C5S + 0.5), `<div id="s4" class="clip scene" data-start="${b(C4S)}" data-duration="${b(C5S + 0.5) - b(C4S)}" data-track-index="6">${s4}</div>`]);

  // =============== SCENE 5 : LOCKUP ===============
  const mcx = W / 2, mcy = V ? 560 : 300, msz = V ? 440 : 340;
  const wmY = V ? 800 : 500;
  let s5 = motifCenter('mo-close', msz, mcx, mcy, 'close');
  s5 += `<div id="wm" class="wm" style="top:${wmY}px;font-size:${V ? 124 : 168}px" ${tag('brand', 'the architect')}>the architect</div>
  <div id="tg" class="tgl" style="top:${wmY + (V ? 190 : 250)}px" ${tag('report', 'Stay Vigilant. Stay Visionary.')}>Stay Vigilant. Stay Visionary.</div>
  <div id="sub" class="sub" style="top:${wmY + (V ? 270 : 330)}px" ${tag('brief', 'Orchid Orchestration')}>Orchid Orchestration</div>
  <div id="wmrule" class="wmrule" style="top:${wmY + (V ? 168 : 232)}px"></div>`;
  clips.push(['s5', b(C5S), b(NB), `<div id="s5" class="clip scene" data-start="${b(C5S)}" data-duration="${b(NB) - b(C5S)}" data-track-index="7">${s5}</div>`]);

  // stamp (chapter-change motif)
  const stamp = motifCenter('mo-stamp', V ? 760 : 820, W / 2, V ? 700 : H / 2, 'stamp');

  // =============== HUD ===============
  const rulerW = V ? 400 : 560, rulerX = V ? (W - rulerW) / 2 : (W - rulerW) / 2;
  let segs = '', acc = 0;
  G.chapters.forEach((c, i) => {
    const w = ((c.end - c.start) / G.beats) * rulerW; const gap = 6;
    segs += `<div class="seg" style="left:${acc}px;width:${w - gap}px"><i id="pf${i}"></i></div>`; acc += w;
  });
  const hud = `<div id="hud" class="hud">
    <i class="cm tl"></i><i class="cm tr"></i><i class="cm bl"></i><i class="cm br"></i>
    <div class="h t-l" style="top:${L.hudTop}px;left:${V ? 60 : 80}px" ${tag('hud', 'GLOW HAWAII · SITE AUDIT')}>GLOW HAWAII · SITE AUDIT</div>
    <div class="h t-r" style="top:${L.hudTop}px;right:${V ? 60 : 80}px"><span ${tag('hud', `${W}×${H} · 30P · ${G.bpm} BPM`)}>${W}×${H} · 30P · ${G.bpm} BPM</span> <b id="rec"></b></div>
    <div id="tc" class="h" style="top:${L.hudBot}px;left:${V ? 60 : 80}px">00:00:00:00</div>
    <div id="ruler" class="ruler" style="top:${V ? L.ruler : L.hudBot + 14}px;left:${rulerX}px;width:${rulerW}px">${segs}</div>
    <div id="chl" class="h t-r" style="top:${L.hudBot}px;right:${V ? 60 : 80}px">01 · THE REAL SITE</div>
  </div>`;

  // =============== TIMELINE ===============
  const A = G.audit, F = G.fix;
  // opening: motif draws, becomes the window
  T.push(`gsap.set('#mo-open .sq,#mo-open .dg',{strokeDasharray:1,strokeDashoffset:1});`);
  T.push(`tl.to('#mo-open .sq',{strokeDashoffset:0,duration:${b(1.2)},ease:'power2.out',stagger:${b(0.18)}},0);`);
  T.push(`tl.to('#mo-open .dg',{strokeDashoffset:0,duration:${b(1)},ease:'power2.out'},${b(0.8)});`);
  T.push(`tl.fromTo('#mo-open-w',{scale:.86,rotation:-8,transformOrigin:'50% 50%'},{scale:1,rotation:0,duration:${b(2)},ease:'power3.out',immediateRender:false},0);`);
  T.push(`tl.to('#mo-open-w',{scale:${V ? 2.4 : 2.6},opacity:0,duration:${b(1.2)},ease:'power3.in'},${b(2)});`);
  // window open: clip-path from the motif's square
  const openInset = (r, size) => `inset(${(r.h - size) / 2}px ${(r.w - size) / 2}px ${(r.h - size) / 2}px ${(r.w - size) / 2}px)`;
  const openR = V ? L.deskWin : L.win;
  T.push(`tl.fromTo('#${V ? 'wind' : 'win'}',{clipPath:'${openInset(openR, V ? 560 : 520)}'},{clipPath:'inset(0px 0px 0px 0px)',duration:${b(1)},ease:'power3.inOut'},${b(2)});`);
  T.push(`gsap.set('#${V ? 'wind' : 'win'}',{clipPath:'${openInset(openR, V ? 560 : 520)}'});`);
  if (!V) {
    T.push(`tl.fromTo('#phone',{clipPath:'inset(50% 50% 50% 50%)',x:60},{clipPath:'inset(0% 0% 0% 0%)',x:0,duration:${b(1)},ease:'power3.out'},${b(2.5)});`);
    T.push(`gsap.set('#phone',{clipPath:'inset(50% 50% 50% 50%)'});`);
    ['cap-desk', 'cap-mob', 'cap-pw'].forEach((id, i) => T.push(`tl.fromTo('#${id}',{opacity:0,y:12},{opacity:1,y:0,duration:${b(0.6)},ease:'power2.out'},${b(3.2 + i * 0.4)});`));
    scrollTo('win', sDesk, 140, b(3), b(C2S - 3), 'power1.inOut');
    scrollTo('phone', sMob, 110, b(3.5), b(C2S - 3.5), 'power1.inOut');
  } else {
    ['cap-desk'].forEach((id) => T.push(`tl.fromTo('#${id}',{opacity:0,y:12},{opacity:1,y:0,duration:${b(0.6)},ease:'power2.out'},${b(3.2)});`));
    scrollTo('wind', 960 / 1440, 150, b(3), b(VD - 3), 'power1.inOut');
    // desktop closes into the centre; the mobile window opens from the same point
    T.push(`tl.to('#wind',{clipPath:'inset(${(L.deskWin.h) / 2}px ${(L.deskWin.w) / 2}px ${(L.deskWin.h) / 2}px ${(L.deskWin.w) / 2}px)',duration:${b(1)},ease:'power3.in'},${b(VD)});`);
    T.push(`tl.to('#cap-desk',{opacity:0,duration:${b(0.5)}},${b(VD)});`);
    const wm = L.win;
    T.push(`gsap.set('#win',{clipPath:'inset(${wm.h / 2}px ${wm.w / 2}px ${wm.h / 2}px ${wm.w / 2}px)'});`);
    T.push(`tl.fromTo('#win',{clipPath:'inset(${wm.h / 2 - 2}px ${wm.w / 2 - 2}px ${wm.h / 2 - 2}px ${wm.w / 2 - 2}px)'},{clipPath:'inset(0px 0px 0px 0px)',duration:${b(1)},ease:'power3.out'},${b(VD + 0.5)});`);
    ['cap-mob', 'cap-pw'].forEach((id, i) => T.push(`tl.fromTo('#${id}',{opacity:0,y:12},{opacity:1,y:0,duration:${b(0.6)},ease:'power2.out'},${b(VD + 1.4 + i * 0.4)});`));
    scrollTo('win', sMob, 120, b(VD + 1), b(C2S - VD - 1), 'power1.inOut');
  }
  // chapter-change stamps (motif transforms across boundaries)
  [C2S, C3S, C4S].forEach((bt, k) => {
    T.push(`tl.fromTo('#mo-stamp-w',{scale:.5,rotation:-30,opacity:0,transformOrigin:'50% 50%'},{scale:1.05,rotation:0,opacity:.55,duration:${b(0.5)},ease:'power3.out'${k ? ',immediateRender:false' : ''}},${b(bt - 0.5)});`);
    T.push(`tl.to('#mo-stamp-w',{scale:1.9,opacity:0,duration:${b(0.8)},ease:'power2.in'},${b(bt)});`);
  });
  // The stamp is a single element, tweened 3 times; reset between uses via explicit fromTo values above.

  // ---------- audit ----------
  const sAud = V ? L.win.w / 390 : sDesk;
  const kind = V ? 'mobile' : 'desktop';
  const SS = SITE[kind];
  const winPos = (a, sy) => ({ x: a[0] * sAud, y: (a[1] - sy) * sAud, w: a[2] * sAud, h: a[3] * sAud });
  const vpTop = bar; // desktop chrome offset
  const audRow = (i, t0, t1) => {
    T.push(`tl.to('#row${i}',{opacity:1,x:0,duration:${b(0.5)},ease:'power3.out'},${t0});`);
    T.push(`tl.to('#row${i}',{opacity:.38,duration:${b(0.4)}},${t1});`);
  };
  const hideBox = (id, t) => T.push(`tl.to('#${id}',{opacity:0,duration:${b(0.4)}},${t});`);
  const drawBox = (id, a, sy, t0, dur) => {
    const p = winPos(a, sy);
    const cx0_ = (V ? L.win.x : L.win.x) + p.x, cy0_ = L.win.y + vpTop + p.y;
    T.push(`tl.fromTo('#${id}',{clipPath:'inset(0 100% 100% 0)',opacity:1},{clipPath:'inset(0 0% 0% 0)',opacity:1,duration:${dur},ease:'power2.out',immediateRender:false},${t0});`);
    T.push(`tl.fromTo('#${id}-chip',{opacity:0,y:8},{opacity:1,y:0,duration:${b(0.35)},ease:'power2.out',immediateRender:false},${t0 + dur});`);
    // cursor drags from top-left to bottom-right of the box
    T.push(`tl.fromTo('#cursor',{x:${cx0_ - 40},y:${cy0_ - 30},opacity:0},{x:${cx0_ + 4},y:${cy0_ + 2},opacity:1,duration:${b(0.3)},ease:'power2.out',immediateRender:false},${t0 - b(0.35)});`);
    T.push(`tl.to('#cursor',{x:${cx0_ + p.w - 4},y:${cy0_ + p.h - 4},duration:${dur},ease:'power2.out'},${t0});`);
    T.push(`tl.to('#cursor',{opacity:0,duration:${b(0.3)}},${t0 + dur + b(0.4)});`);
  };
  T.push(`gsap.set('#cursor',{opacity:0});`);
  T.push(`gsap.set('.row,.rowv',{opacity:0,x:${V ? 0 : 40}});`);
  const boxDur = b(0.45);
  if (!V) {
    // panel entrance (phone exits)
    T.push(`tl.fromTo('#panel',{opacity:0,x:80},{opacity:1,x:0,duration:${b(0.9)},ease:'power3.out'},${b(C2S)});`);
    T.push(`gsap.set('#panel',{opacity:0});`);
    T.push(`tl.to('#phone',{x:140,opacity:0,duration:${b(0.8)},ease:'power3.in'},${b(C2S)});`);
    T.push(`tl.to('#cap-mob,#cap-pw',{opacity:0,duration:${b(0.5)}},${b(C2S)});`);
  } else {
    T.push(`tl.fromTo('#panel',{opacity:0,y:40},{opacity:1,y:0,duration:${b(0.9)},ease:'power3.out'},${b(C2S)});`);
    T.push(`gsap.set('#panel',{opacity:0});`);
    T.push(`tl.to('#cap-mob,#cap-pw',{opacity:0,duration:${b(0.5)}},${b(C2S)});`);
  }
  // in vertical the rows overlap in one slot: show one at a time
  const rowIn = (i, t0, t1) => V
    ? (T.push(`tl.fromTo('#row${i}',{opacity:0,y:30},{opacity:1,y:0,duration:${b(0.5)},ease:'power3.out'},${t0});`), T.push(`tl.to('#row${i}',{opacity:0,duration:${b(0.3)}},${t1});`))
    : audRow(i, t0, t1);
  // 1 headline
  scrollTo('win', sAud, 0, b(A.headline.scroll), b(1), 'power3.inOut');
  drawBox('bx-h1', SS.h1, 0, b(A.headline.box), boxDur); rowIn(0, b(A.headline.box), b(A.headline.end));
  hideBox('bx-h1', b(A.headline.end) - b(0.3));
  // 2 summit x2
  const sy1 = V ? 1130 : 420, sy2 = V ? 10520 : 6990;
  scrollTo('win', sAud, sy1, b(A.summit.scroll), b(1), 'power3.inOut');
  drawBox('bx-s1', SS.summit1, sy1, b(A.summit.box1), boxDur); rowIn(1, b(A.summit.box1), b(A.summit.end));
  scrollTo('win', sAud, sy2, b(A.summit.scroll2), b(1), 'expo.inOut');
  hideBox('bx-s1', b(A.summit.scroll2));
  drawBox('bx-s2', SS.summit2, sy2, b(A.summit.box2), boxDur);
  hideBox('bx-s2', b(A.summit.end) - b(0.3));
  // 3 buttons
  const sy3 = V ? 845 : 300;
  scrollTo('win', sAud, sy3, b(A.buttons.scroll), b(1), 'expo.inOut');
  drawBox('bx-bt', SS.buttons, sy3, b(A.buttons.box), boxDur); rowIn(2, b(A.buttons.box), b(A.buttons.end));
  hideBox('bx-bt', b(A.buttons.end) - b(0.3));
  // 4 testimonials
  const sy4 = V ? 8985 : 5850;
  scrollTo('win', sAud, sy4, b(A.testimonials.scroll), b(1), 'expo.inOut');
  drawBox('bx-ts', SS.testim, sy4, b(A.testimonials.box), boxDur); rowIn(3, b(A.testimonials.box), b(A.testimonials.end));
  hideBox('bx-ts', b(A.testimonials.end) - b(0.3));
  if (!V) {
    T.push(`tl.to('#panel',{x:100,opacity:0,duration:${b(0.8)},ease:'power3.in'},${b(LD)});`);
  } else T.push(`tl.to('#panel',{opacity:0,duration:${b(0.5)}},${b(LD)});`);
  // active row highlight (gold edge)
  // ladder: window shrinks into the first rung
  T.push(`tl.to('#win',{opacity:0,y:-30,duration:${b(0.9)},ease:'power3.in'},${b(LD)});`);
  T.push(`gsap.set('#ladder',{opacity:0});`);
  const LA = G.audit.ladder;
  T.push(`tl.to('#ladder',{opacity:1,duration:${b(0.5)}},${b(LD + 0.2)});`);
  T.push(`tl.fromTo('#lh2',{y:30,opacity:0},{y:0,opacity:1,duration:${b(0.8)},ease:'power3.out'},${b(LD + 0.3)});`);
  for (let i = 0; i < 5; i++) T.push(`tl.fromTo('#rg${i}',{opacity:0,y:${V ? 0 : 60},x:${V ? -80 : 0}},{opacity:1,y:0,x:0,duration:${b(0.6)},ease:'power3.out'},${b(LD + 0.5 + i * 0.3)});`);
  T.push(`gsap.set('#ladder .rung,#ladder .rungv,#l3,#l2,#gapq,#lh2',{opacity:0});`);
  T.push(`tl.fromTo('#l2',{opacity:0,y:18},{opacity:1,y:0,duration:${b(0.6)}},${b(LA.l2)});`);
  T.push(`tl.fromTo('#rg1',{scale:1.07},{scale:1,duration:${b(1)},ease:'power2.out',immediateRender:false},${b(LA.l2)});`);
  T.push(`tl.fromTo('#l3',{opacity:0,y:18},{opacity:1,y:0,duration:${b(0.6)}},${b(LA.l3)});`);
  T.push(`tl.fromTo('#rg2',{scale:1.07},{scale:1,duration:${b(1)},ease:'power2.out',immediateRender:false},${b(LA.l3)});`);
  T.push(`tl.fromTo('#gapq',{opacity:0,y:18},{opacity:1,y:0,duration:${b(0.6)}},${b(LA.gap)});`);
  // pre-drop gap: everything dips
  T.push(`tl.to('#ladder',{opacity:.12,duration:${b(0.25)},ease:'power2.in'},${b(DROPGAP)});`);

  // ---------- paper curtain at the drop ----------
  T.push(`gsap.set('#paper',{x:${-W}});`);
  T.push(`tl.fromTo('#paper',{x:${-W}},{x:0,duration:${b(0.5)},ease:'power4.in'},${b(DROPGAP)});`);
  T.push(`tl.set('#paper',{x:${W}},${b(C4S)});`);
  // ---------- fix ----------
  const fixS = sFix;
  const wf = L.fixWin;
  T.push(`tl.fromTo('#fixwin',{clipPath:'inset(${wf.h / 2}px ${wf.w / 2}px ${wf.h / 2}px ${wf.w / 2}px)'},{clipPath:'inset(0px 0px 0px 0px)',duration:${b(0.8)},ease:'power3.out'},${b(C3S)});`);
  T.push(`gsap.set('#fixwin',{clipPath:'inset(${wf.h / 2}px ${wf.w / 2}px ${wf.h / 2}px ${wf.w / 2}px)'});`);
  T.push(`gsap.set('#fxchip',{opacity:0});gsap.set('#fixwrap .fcap',{opacity:0});gsap.set('#chA',{opacity:0});gsap.set('.fcard',{opacity:0});`);
  T.push(`tl.to('#fxchip',{opacity:1,duration:${b(0.5)}},${b(C3S + 0.4)});`);
  const doWipe = (id, wpx, t0) => {
    T.push(`tl.fromTo('#${id}',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:${b(1)},ease:'power3.inOut',immediateRender:false},${t0});`);
    T.push(`tl.fromTo('#${id}-edge',{x:0,opacity:1},{x:${wpx},opacity:1,duration:${b(1)},ease:'power3.inOut',immediateRender:false},${t0});`);
    T.push(`tl.to('#${id}-edge',{opacity:0,duration:${b(0.1)}},${t0 + b(1)});`);
  };
  const fixCapShow = (i, t0, t1) => { T.push(`tl.fromTo('#fcap${i}',{opacity:0,y:14},{opacity:1,y:0,duration:${b(0.5)},ease:'power2.out'},${t0});`); T.push(`tl.to('#fcap${i}',{opacity:0,duration:${b(0.3)}},${t1});`); };
  const showSel = (id, t0, t1) => { T.push(`gsap.set('#${id}',{opacity:0});`); T.push(`tl.to('#${id}',{opacity:1,duration:${b(0.3)}},${t0});`); T.push(`tl.to('#${id}',{opacity:0,duration:${b(0.3)}},${t1});`); };
  const swapChip = (t) => { T.push(`tl.set('#chB',{opacity:0},${t});`); T.push(`tl.set('#chA',{opacity:1},${t});`); };
  const resetChip = (t) => { T.push(`tl.set('#chB',{opacity:1},${t});`); T.push(`tl.set('#chA',{opacity:0},${t});`); };
  // 1 headline
  scrollTo('fixwin', fixS, V ? 90 : 0, b(C3S), 0.001, 'none');
  showSel('fx-h1o', b(C3S + 0.8), b(FXG.headline.wipe));
  fixCapShow(0, b(C3S + 1), b(FXG.headline.end));
  doWipe('fx-h1', hc.w, b(FXG.headline.wipe)); swapChip(b(F.headline.wipe));
  // 2 button (scroll first)
  const syBt = V ? 845 : 40;
  scrollTo('fixwin', fixS, syBt, b(FXG.button.start - 0.4), b(0.7), 'power3.inOut');
  T.push(`tl.to('#fx-h1',{opacity:0,duration:${b(0.4)}},${b(FXG.button.start - 0.3)});`);
  resetChip(b(FXG.button.start));
  showSel('fx-bto', b(FXG.button.start + 0.8), b(FXG.button.wipe));
  fixCapShow(1, b(FXG.button.start + 1), b(FXG.button.end));
  doWipe('fx-bt', hero.w, b(FXG.button.wipe)); swapChip(b(F.button.wipe));
  // 3 summit
  const sySm = V ? 1150 : 380;
  scrollTo('fixwin', fixS, sySm, b(FXG.summit.start - 0.4), b(0.7), 'power3.inOut');
  T.push(`tl.to('#fx-bt',{opacity:0,duration:${b(0.4)}},${b(FXG.summit.start - 0.3)});`);
  resetChip(b(FXG.summit.start));
  showSel('fx-so', b(FXG.summit.start + 0.8), b(FXG.summit.wipe));
  fixCapShow(2, b(FXG.summit.start + 1), b(FXG.summit.end));
  doWipe('fx-sm', bar2.w, b(FXG.summit.wipe)); swapChip(b(F.summit.wipe));
  // flurry hard cuts
  const flEnds = FL.slice(1).concat([FLEND]);
  FL.forEach((st, i) => {
    T.push(`tl.set('#fc${i}',{opacity:1},${b(st)});`);
    T.push(`tl.set('#fc${i}',{opacity:0},${b(flEnds[i])});`);
    T.push(`tl.fromTo('#fc${i} .fin',{scale:1.06},{scale:1,duration:${b(flEnds[i] - st)},ease:'power2.out'},${b(st)});`);
  });
  T.push(`tl.set('#fixwrap',{opacity:0},${b(FL0)});`);

  // ---------- response ----------
  T.push(`gsap.set('#rrule',{scaleX:0,transformOrigin:'50% 50%'});`);
  T.push(`tl.fromTo('#rrule',{scaleX:0},{scaleX:1,duration:${b(0.8)},ease:'power3.out'},${b(C4S)});`);
  T.push(`tl.fromTo('#rcard',{clipPath:'inset(50% 0% 50% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:${b(0.9)},ease:'power3.inOut'},${b(C4S + 0.7)});`);
  T.push(`tl.to('#rrule',{opacity:0,duration:${b(0.3)}},${b(C4S + 1.4)});`);
  T.push(`gsap.set('#rsrc',{opacity:0});tl.to('#rsrc',{opacity:1,duration:${b(0.5)}},${b(G.response.hold[0])});`);
  // lockup
  T.push(`gsap.set('#mo-close .sq,#mo-close .dg',{strokeDasharray:1,strokeDashoffset:1});`);
  T.push(`tl.to('#rcard',{opacity:0,y:-40,duration:${b(0.8)},ease:'power3.in'},${b(C5S - 0.8)});`);
  T.push(`tl.to('#mo-close .sq',{strokeDashoffset:0,duration:${b(1)},ease:'power3.out',stagger:${b(0.2)}},${b(C5S)});`);
  T.push(`tl.to('#mo-close .dg',{strokeDashoffset:0,duration:${b(0.8)},ease:'power3.out'},${b(C5S + 0.8)});`);
  T.push(`tl.fromTo('#mo-close-w',{scale:2.4,rotation:25,transformOrigin:'50% 50%'},{scale:1,rotation:0,duration:${b(1.4)},ease:'expo.out'},${b(C5S)});`);
  T.push(`gsap.set('#wm,#tg,#sub',{opacity:0});gsap.set('#wmrule',{scaleX:0});`);
  T.push(`tl.fromTo('#wm',{opacity:0,y:36},{opacity:1,y:0,duration:${b(1.2)},ease:'power3.out'},${b(G.lockup.wordmark)});`);
  T.push(`tl.to('#wmrule',{scaleX:1,duration:${b(0.8)},ease:'power3.out',transformOrigin:'50% 50%'},${b(G.lockup.wordmark + 0.5)});`);
  T.push(`tl.fromTo('#tg',{opacity:0,y:16},{opacity:1,y:0,duration:${b(0.7)},ease:'power2.out'},${b(G.lockup.tagline)});`);
  T.push(`tl.fromTo('#sub',{opacity:0,y:12},{opacity:.62,y:0,duration:${b(0.8)},ease:'power2.out'},${b(G.lockup.subtitle)});`);
  // mo-close: ensure initial state is hidden before 60

  // ---------- driver (HUD) ----------
  const driver = `
const CH=${JSON.stringify(G.chapters)},BEATS=${G.beats},P=${P},FPS=${FPS},END=${b(G.beats)};
const FLB=${JSON.stringify(FL)},FLEND=${FLEND},PAL=${JSON.stringify(palette.map(p => p[0]))};
const REPLY=${JSON.stringify(C.reply)},TY0=${b(G.response.type[0])},TY1=${b(G.response.type[1])};
const el=id=>document.getElementById(id);
const hud=el('hud'),tc=el('tc'),chl=el('chl'),rec=el('rec'),typed=el('typed'),cur=el('cur');
const pf=CH.map((c,i)=>el('pf'+i));
const dark=['#E8EEFF','#070D1F'];
function frame(t){
  const f=Math.round(t*FPS),ss=Math.floor(f/FPS),ff=f%FPS;
  tc.textContent='00:00:'+String(ss).padStart(2,'0')+':'+String(ff).padStart(2,'0');
  const beat=t/P;
  let ci=CH.length-1;for(let i=0;i<CH.length;i++){if(beat>=CH[i].start&&beat<CH[i].end){ci=i;break;}}
  chl.textContent=CH[ci].id+' · '+CH[ci].name;
  CH.forEach((c,i)=>{const p=Math.max(0,Math.min(1,(beat-c.start)/(c.end-c.start)));pf[i].style.transform='scaleX('+p+')';});
  rec.style.opacity=(Math.floor(beat*2)%2===0)?1:0.15;
  // HUD ink/paper flip: paper chapter 34-45 and flurry cards by their background
  let col='#E8EEFF';
  if(beat>=${C3S}&&beat<${FL0}) col='#070D1F';
  else if(beat>=${FL0}&&beat<${C4S}){let k=0;for(let i=0;i<FLB.length;i++){if(beat>=FLB[i])k=i;}const bg=PAL[k];col=(bg==='#E8EEFF'||bg==='#F0C040')?'#070D1F':'#E8EEFF';}
  hud.style.setProperty('--hc',col);
  // typing
  const tb=Math.max(0,Math.min(1,(t-TY0)/(TY1-TY0)));
  const n=Math.floor(tb*REPLY.length+0.0001);
  typed.textContent=REPLY.slice(0,n);
  const typing=(t>=TY0&&t<TY1);
  cur.style.opacity=(t<TY0-0.3||t>${b(C5S)})?0:(typing?1:(Math.floor(beat*2)%2===0?1:0));
}
tl.fromTo({t:0},{t:0},{t:END,duration:END,ease:'none',onUpdate:function(){frame(this.targets()[0].t);}},0);
`;

  // =============== CSS ===============
  const css = `
${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#070D1F}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#070D1F;font-family:'DM Sans',sans-serif;color:#E8EEFF}
.abs,.scene,#bgink,#grid,#vig,#grain,#hud{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
.clip{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
.scene{overflow:hidden}
#bgink{background:radial-gradient(ellipse 70% 60% at 70% 20%,#10224f 0%,#0D1530 45%,#070D1F 100%)}
#grid{background-image:radial-gradient(rgba(106,160,255,.28) 1.5px,transparent 1.6px);background-size:48px 48px;opacity:.5}
#vig{background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.32) 100%);pointer-events:none}
#grain{background:url('assets/grain.png');opacity:.09;mix-blend-mode:overlay;pointer-events:none}
.paper{position:absolute;left:0;top:0;width:${W}px;height:${H}px;background:#E8EEFF;background-image:radial-gradient(rgba(7,13,31,.16) 1.5px,transparent 1.6px);background-size:48px 48px}
.mwrap{position:absolute}
.motif{display:block;overflow:visible}
.win{position:absolute;background:#0D1530;border:2px solid rgba(106,160,255,.5);box-shadow:0 30px 90px rgba(0,0,0,.55),0 0 0 1px rgba(7,13,31,.8);overflow:hidden;border-radius:14px}
.win .bar{position:absolute;left:0;top:0;right:0;background:#0D1530;border-bottom:2px solid rgba(106,160,255,.3);display:flex;align-items:center;gap:10px;padding:0 18px}
.win .bar i{width:14px;height:14px;border-radius:50%;background:#3D7FFF;opacity:.7}
.win .bar .url{margin-left:18px;font:500 24px 'JetBrains Mono',monospace;color:#6AA0FF;letter-spacing:.04em}
.win.phone{border-radius:34px;border:8px solid #0D1530;outline:2px solid rgba(106,160,255,.5)}
.vp{position:absolute;left:0;right:0;overflow:hidden;background:#fff}
.strip{position:absolute;left:0;top:0}
.sel{position:absolute;border:4px solid;opacity:0;clip-path:inset(0 100% 100% 0)}
.sel.before{opacity:0}
.sel .hd{position:absolute;width:14px;height:14px}.sel .hd.tl{left:-9px;top:-9px}.sel .hd.br{right:-9px;bottom:-9px}
.chip{position:absolute;opacity:0;left:-4px;padding:5px 14px;font:500 24px/1.25 'JetBrains Mono',monospace;color:#070D1F;letter-spacing:.1em;white-space:nowrap;border-radius:4px}
.cursor{position:absolute;left:0;top:0;opacity:0;z-index:30}
.cap{position:absolute;font:500 24px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#6AA0FF;white-space:nowrap}
.cap.gold{color:#F0C040}
.panel{position:absolute;opacity:0}
.panel .ph{font:500 24px 'JetBrains Mono',monospace;letter-spacing:.16em;color:#6AA0FF;height:48px}
.row{position:absolute;left:0;right:0;background:#0F1838;border:2px solid rgba(106,160,255,.25);border-left:6px solid #F0C040;border-radius:12px;padding:18px 22px;opacity:0}
.tagrow{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.sevtag{font:500 24px/1.25 'JetBrains Mono',monospace;letter-spacing:.12em;color:#070D1F;padding:4px 14px;border-radius:6px}
.idx{font:500 24px 'JetBrains Mono',monospace;color:#9AA7CC;letter-spacing:.1em}
.ttl{font:700 32px/1.2 'Plus Jakarta Sans',sans-serif;color:#E8EEFF;letter-spacing:-.01em}
.panelv{position:absolute;opacity:0}
.rowv{position:absolute;left:0;top:0;right:0;opacity:0}
.rowv .ttl{font-size:42px;margin-top:4px}
.whr{font:400 24px/1.3 'JetBrains Mono',monospace;color:#9AA7CC;margin-top:8px}
.ladder{position:absolute;opacity:0}
.lab{font:500 24px 'JetBrains Mono',monospace;letter-spacing:.2em;color:#6AA0FF}
.lh2{font:800 ${V ? 64 : 76}px/1.05 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em;margin-top:14px;max-width:${V ? 940 : 1500}px}
.rung{position:absolute;border:2px solid rgba(106,160,255,.3);background:#0F1838;border-radius:14px;padding:22px}
.rung.site{border-color:#3D7FFF;background:linear-gradient(160deg,#10286a,#0A1A44);box-shadow:0 0 0 1px rgba(61,127,255,.4),0 20px 60px -20px rgba(61,127,255,.6)}
.rung.mkt{border-color:#F0C040;background:linear-gradient(160deg,#1A2A60,#0F1838);box-shadow:0 0 0 1px rgba(240,192,64,.3),0 20px 60px -20px rgba(240,192,64,.4)}
.rl{font:500 24px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#9AA7CC}.site .rl{color:#6AA0FF}.mkt .rl{color:#F0C040}
.rn{font:700 32px/1.15 'Plus Jakarta Sans',sans-serif;margin-top:10px}
.rs{font:500 24px/1.25 'JetBrains Mono',monospace;margin-top:12px;letter-spacing:.06em}.site .rs{color:#6AA0FF}.mkt .rs{color:#F0C040}
.rungv{position:absolute;left:0;border:2px solid rgba(106,160,255,.3);background:#0F1838;border-radius:14px;padding:14px 22px;overflow:hidden}
.rungv .fillv{position:absolute;left:0;top:0;bottom:0;background:rgba(106,160,255,.14)}
.rungv.site{border-color:#3D7FFF;background:#0A1A44}.rungv.site .fillv{background:rgba(61,127,255,.4)}
.rungv.mkt{border-color:#F0C040;background:#1A2A60}.rungv.mkt .fillv{background:rgba(240,192,64,.3)}
.rungv .rl,.rungv .rn,.rungv .rs{position:relative}.rungv .rl{margin-top:0}.rungv .rn{margin-top:4px;font-size:36px}.rungv .rs{position:absolute;right:22px;top:16px;margin:0}
.lline{position:absolute;font:700 ${V ? 46 : 44}px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.01em}.lline.mkt{color:#F0C040}.lline.site{color:#6AA0FF}
.gapq{position:absolute;font:500 ${V ? 32 : 28}px 'DM Sans',sans-serif;color:#E8EEFF;border-left:4px solid #F0C040;padding-left:16px;max-width:${V ? 940 : 520}px}
.fxchip{position:absolute;font:500 24px 'JetBrains Mono',monospace;letter-spacing:.14em;height:44px}
.fxchip span{position:absolute;left:0;top:0;padding:6px 16px;border-radius:6px;white-space:nowrap}
#chB{background:#FF6B6B;color:#070D1F}#chA{background:#F0C040;color:#070D1F}
.fcap{position:absolute;font:700 ${V ? 40 : 38}px/1.2 'Plus Jakarta Sans',sans-serif;color:#070D1F;letter-spacing:-.01em}
.newcard{position:absolute;background:#070D1F;border:4px solid #F0C040;border-radius:10px;padding:${V ? '12px 16px' : '14px 22px'};overflow:hidden}
.newcard .tg{font:500 24px 'JetBrains Mono',monospace;color:#F0C040;letter-spacing:.14em;margin-bottom:8px}
.newcard .nh{font:800 ${V ? 50 : 42}px/1.12 'Plus Jakarta Sans',sans-serif;color:#E8EEFF;letter-spacing:-.02em}
.pill{position:absolute;background:#F0C040;border-radius:999px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.pill span{font:800 ${V ? 34 : 34}px 'Plus Jakarta Sans',sans-serif;color:#070D1F;white-space:nowrap}
.removed{position:absolute;background:#070D1F;border-top:4px solid #F0C040;border-bottom:4px solid #F0C040;display:flex;align-items:center;justify-content:center}
.removed .rm{font:500 ${V ? 44 : 40}px 'JetBrains Mono',monospace;color:#F0C040;letter-spacing:.3em}
.edge{position:absolute;opacity:0;width:6px;background:#F0C040;box-shadow:0 0 24px #F0C040;opacity:0}
.ftitle{position:absolute;left:${V ? 70 : 150}px;top:${V ? 250 : 118}px;font:800 ${V ? 64 : 72}px/1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em}
.fcard{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden}
.fin{position:absolute;left:0;top:0;right:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.qm{font:800 ${V ? 220 : 240}px/.6 'Plus Jakarta Sans',sans-serif;height:${V ? 110 : 120}px}
.fq{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;line-height:1.08;letter-spacing:-.025em}
.fs{font:500 28px/1.3 'JetBrains Mono',monospace;letter-spacing:.04em;margin-top:34px;max-width:${V ? 940 : 1400}px}
.rrule{position:absolute;height:4px;background:#F0C040;box-shadow:0 0 28px #F0C040}
.rcard{position:absolute;background:linear-gradient(160deg,#14214A,#0D1530 60%);border:3px solid #F0C040;border-radius:22px;box-shadow:0 0 90px rgba(240,192,64,.22);padding:${V ? '56px 58px' : '52px 72px'}}
.rlab{font:500 26px 'JetBrains Mono',monospace;letter-spacing:.2em;color:#F0C040}
.rq{font-family:'DM Sans',sans-serif;font-weight:500;line-height:1.36;margin-top:${V ? 36 : 30}px;color:#E8EEFF;min-height:${V ? 470 : 370}px}
.cur{display:inline-block;width:.52em;height:1.02em;background:#F0C040;vertical-align:-.14em;margin-left:4px}
.rsrc{position:absolute;left:${V ? 58 : 72}px;bottom:${V ? 44 : 40}px;font:500 26px 'JetBrains Mono',monospace;color:#6AA0FF;letter-spacing:.1em}
.wm{position:absolute;left:0;width:${W}px;text-align:center;font:200 160px/1 'Josefin Sans',sans-serif;letter-spacing:.04em;color:#E8EEFF;text-transform:lowercase}
.wmrule{position:absolute;left:${W / 2 - (V ? 260 : 330)}px;width:${V ? 520 : 660}px;height:3px;background:linear-gradient(90deg,transparent,#F0C040,transparent)}
.tgl{position:absolute;left:0;width:${W}px;text-align:center;font:500 ${V ? 32 : 32}px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#6AA0FF}
.sub{position:absolute;left:0;width:${W}px;text-align:center;font:400 ${V ? 32 : 32}px 'DM Sans',sans-serif;letter-spacing:.3em;color:#E8EEFF;text-transform:uppercase}
#mo-stamp-w{opacity:0}
.hud{--hc:#E8EEFF;z-index:100;pointer-events:none}
.hud .h{position:absolute;font:500 24px 'JetBrains Mono',monospace;letter-spacing:${V ? '.1em' : '.2em'};color:var(--hc);white-space:nowrap}
.hud .t-r{text-align:right}
.hud b{display:inline-block;width:16px;height:16px;border-radius:50%;background:#FF6B6B;margin-left:8px;vertical-align:-1px}
.hud .cm{position:absolute;width:40px;height:40px;border-color:var(--hc);border-style:solid;border-width:0;opacity:.7}
.hud .cm.tl{left:${L.mx}px;top:${V ? 168 : L.mx}px;border-top-width:2px;border-left-width:2px}
.hud .cm.tr{right:${L.mx}px;top:${V ? 168 : L.mx}px;border-top-width:2px;border-right-width:2px}
.hud .cm.bl{left:${L.mx}px;top:${V ? 1330 - 40 : H - L.mx - 40}px;border-bottom-width:2px;border-left-width:2px}
.hud .cm.br{right:${L.mx}px;top:${V ? 1330 - 40 : H - L.mx - 40}px;border-bottom-width:2px;border-right-width:2px}
.ruler{position:absolute;height:12px}
.ruler .seg{position:absolute;top:0;height:6px;background:color-mix(in srgb,var(--hc) 25%,transparent)}
.ruler .seg i{display:block;height:100%;background:var(--hc);transform-origin:0 50%;transform:scaleX(0)}
`;
  // vertical deco below 1330 (platform UI zone): texture only
  const decoV = V ? `<div class="abs" style="top:1340px;height:580px;background:linear-gradient(180deg,rgba(7,13,31,0),rgba(7,13,31,.65));pointer-events:none"></div>` : '';

  const body = `<div id="root" data-composition-id="main" data-start="0" data-duration="${b(G.beats)}" data-width="${W}" data-height="${H}">
<div id="bgink"></div><div id="grid"></div>
${clips.filter(c => c[0] === 's1').map(c => c[3]).join('')}
${wins}
${clips.filter(c => c[0] === 's2').map(c => c[3]).join('')}
${clips.filter(c => c[0] === 's3').map(c => c[3]).join('')}
${clips.filter(c => c[0] === 's4').map(c => c[3]).join('')}
${clips.filter(c => c[0] === 's5').map(c => c[3]).join('')}
${stamp}
<div id="vig"></div><div id="grain"></div>${decoV}
${hud}
<audio id="bed" src="assets/architect-bed.m4a" data-start="0" data-duration="${b(G.beats)}" data-volume="1"></audio>
</div>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${W}, height=${H}">
<title>Glow Hawaii Sizzle · ${ratio}</title>
<style>${css}</style></head><body>
${body}
<script src="assets/vendor/gsap.min.js"></script>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
${T.join('\n')}
${driver}
window.__timelines["main"] = tl;
</script></body></html>`;
  fs.mkdirSync(path.join(ROOT, ratio), { recursive: true });
  fs.writeFileSync(path.join(ROOT, ratio, 'index.html'), html);
  return manifest;
}

const m1 = build('16x9'), m2 = build('9x16');
fs.mkdirSync(path.join(ROOT, 'qa'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'qa/text-manifest.json'), JSON.stringify({ '16x9': m1, '9x16': m2 }, null, 1));
console.log('built', m1.length, m2.length);
