/* The Architect Assessment — 40s sizzle. Every frame is a pure function of t (seconds). */
const Q = new URLSearchParams(location.search);
const V = Q.get('o') === 'v';
const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
document.documentElement.style.setProperty('--W', W + 'px');
document.documentElement.style.setProperty('--H', H + 'px');
document.body.classList.toggle('v', V);
document.body.style.setProperty('--cy', (V ? 845 : 480) + 'px');
const CY = V ? 845 : 480;

const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, d) => clamp((t - a) / d);
const oc = x => 1 - Math.pow(1 - x, 3);
const oe = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const mix = (a, b, k) => a + (b - a) * k;
const GOLD = '#F0C040', BLUE = '#3D7FFF';

/* ---------- reusable bits ---------- */
const mark = (color = GOLD, sw = 3.4, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="miter">
   <rect pathLength="1" x="5" y="5" width="90" height="90"/><rect pathLength="1" x="18" y="18" width="64" height="64"/>
   <rect pathLength="1" x="31" y="31" width="38" height="38"/><rect pathLength="1" x="43" y="43" width="14" height="14"/></svg>`;
const C = 2 * Math.PI * 88;
const ringHTML = (id, color) => `<div class="ring" id="${id}"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="88" fill="none" stroke="rgba(232,238,255,.1)" stroke-width="18"/>
  <circle class="arc" cx="100" cy="100" r="88" fill="none" stroke="${color}" stroke-width="18" stroke-linecap="round" stroke-dasharray="0 ${C}" style="filter:drop-shadow(0 0 12px ${color})"/></svg>
  <div class="num"><span class="n">0</span><small>of 30</small></div></div>`;
const setRing = (id, k, score = 13) => {
  const r = $(id); r.querySelector('.arc').setAttribute('stroke-dasharray', `${C * k * score / 30} ${C}`);
  r.querySelector('.n').textContent = Math.round(score * k);
};
const checkSVG = c => `<svg viewBox="0 0 40 40" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="M7 21l8 8 17-18"/></svg>`;
const setCheck = (box, k) => { box.querySelector('path').style.strokeDashoffset = 1 - k; };
const sty = (el, o) => Object.assign(el.style, o);
const op = (el, o) => { el.style.opacity = o; };
const place = (el, x = 0, y = 0, s = 1, o = 1) => { el.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${s})`; el.style.opacity = o; };
const rise = (el, k, dy = 26) => { el.style.opacity = k; el.style.transform = `translateY(${(1 - k) * dy}px)`; };

/* ---------- build scenes ---------- */
const S = {};
const nextStepText = 'Pick one task you repeat every week and start there.';
function build() {
  $('brandbar').innerHTML = mark(GOLD, 4) + '<span class="wm">the architect</span>';

  $('s0').innerHTML = `<div id="bigmark" style="width:${V ? 360 : 300}px;height:${V ? 360 : 300}px;margin-top:${V ? 0 : -60}px">${mark(GOLD, 2.6)}</div>`;

  $('s1').innerHTML = `<div class="card res" id="oldcard"><div class="badge mono" style="color:rgba(232,238,255,.75);border-color:rgba(232,238,255,.25)">Before · old results page</div>
   <div class="row">${ringHTML('oring', BLUE)}<div><div class="mono">Your AI-readiness level</div><div class="lvl">Taxiing</div>
   <p>Here is where you landed today. Close this tab and it is gone.</p></div></div>
   <div class="next"><div class="mono">Your next step</div><p>${nextStepText}</p>
   <div class="book"><i class="hl" id="hl"></i><span id="booktxt">Booking link coming soon</span><i class="st" id="st"></i></div></div></div>`;

  $('s2').innerHTML = `<div class="card step" id="stepcard"><div style="display:flex;justify-content:space-between"><span class="mono">New · Email step</span><span class="mono" style="color:rgba(232,238,255,.55)">Step 3 of 3</span></div>
   <div class="track"><i id="tb" style="background:${BLUE};box-shadow:0 0 18px ${BLUE}"></i><i id="tg" style="background:${GOLD};box-shadow:0 0 22px ${GOLD}"></i></div>
   <h2><span id="hb" style="color:${BLUE}">Your results are ready</span><span id="hg" style="color:${GOLD}">Your results are ready</span></h2>
   <p class="sub">Where should we send your full report?</p>
   <div class="input"><span id="em"></span><i class="caret" id="caret"></i></div>
   <div class="chk"><div class="box" id="cbox">${checkSVG('#070D1F')}</div><span>Yes, I’d like follow-up from The Architect.</span></div>
   <div class="btn" id="sbtn">Email me my report</div></div>`;

  buildDiagram();

  const bars = [['Strategy', 3], ['Data', 1], ['Tools', 4], ['People', 3], ['Risk', 2]];
  $('s4').innerHTML = `<div class="card inbox abs" id="inbox" style="position:absolute;left:50%;top:${CY}px">
    <div style="display:flex;justify-content:space-between;margin-bottom:22px"><span class="mono">Inbox</span><span class="mono" style="color:rgba(232,238,255,.5)">jane@example.com</span></div>
    <div class="irow new" id="newrow" style="height:0"><div class="av">${mark(GOLD, 5)}</div><div class="t"><b>The Architect</b><span>Your AI-readiness report: Taxiing, 13 of 30</span></div><span class="tm gold">NOW</span></div>
    <div class="irow" style="height:104px;opacity:.45"><div class="av"></div><div class="t"><b>Studio Weekly</b><span>Five things worth reading this week</span></div><span class="tm">9:41</span></div>
    <div class="irow" style="height:104px;opacity:.3"><div class="av"></div><div class="t"><b>Calendar</b><span>Reminder: planning session tomorrow</span></div><span class="tm">8:12</span></div></div>
   <div class="card mail" id="mail" style="position:absolute;left:50%;top:${CY}px">
    <div class="mhead"><div class="lg">${mark(GOLD, 4)}<span class="wm">the architect</span></div><span class="tag">Stay Vigilant. Stay Visionary.</span></div>
    <div class="mbody"><div class="mgrid"><div class="lvlbox">${ringHTML('mring', GOLD)}<div class="mono" style="margin-top:14px">Your level</div><div class="lv" id="mlv">Taxiing</div></div>
     <div class="blocks"><div class="blk gd" id="b1"><div class="mono">#1 thing to address</div><p>Your customer data lives in too many places.</p></div>
      <div class="blk" id="b2"><div class="mono">Your next step</div><p>${nextStepText}</p></div></div></div>
     <div class="bars"><div class="mono">How you scored</div>${bars.map((b, i) => `<div class="brow ${b[1] === 1 ? 'low' : ''}" id="br${i}"><span class="bl">${b[0]}</span><div class="bt"><i></i></div><span class="bv">${b[1]}/6</span></div>`).join('')}</div></div></div>`;
  S.bars = bars;

  $('s5').innerHTML = `<div id="toast" style="position:absolute;left:50%;top:${V ? 250 : 168}px;border:1.5px solid ${GOLD};background:var(--card);padding:16px 28px;border-radius:999px;box-shadow:0 0 50px rgba(240,192,64,.3)" class="mono gold">✉ &nbsp;New email · New lead</div>
   <div class="card mail" id="mail2" style="position:absolute;left:50%;top:${CY}px">
    <div class="mhead"><div class="lg">${mark(GOLD, 4)}<span class="wm">the architect</span></div><span class="tag">Owner copy</span></div>
    <div class="sub-sj">Subject: NEW LEAD — Taxiing · 13/30</div>
    <div class="mbody"><div class="lead" id="lead"><span class="chip">NEW LEAD</span>
     <div class="lgrid"><div class="f" id="f1"><div class="mono">Email</div><div class="val">jane@example.com</div></div>
      <div class="f" id="f2"><div class="mono">Follow-up</div><div class="val gold">YES</div></div>
      <div class="f" id="f3"><div class="mono">Source</div><div class="val">Assessment page</div></div>
      <div class="f wide" id="f4"><div class="mono">The one thing they named</div><div class="q">“Following up with customers takes me forever.”</div></div></div></div>
     <div id="ana"><div class="mono">The analysis</div>
      <div class="blk" style="margin-top:12px"><p>Strongest area: <b>Tools</b>, 4/6. Biggest gap: <b class="gold">Data</b>, 1/6. Best first move: one automated follow-up flow.</p></div></div></div></div>`;

  const tk = id => `<div class="tick" id="${id}">${checkSVG('#070D1F')}</div>`;
  const skel = w => `<div style="height:20px;width:${w}px;border-radius:10px;background:rgba(232,238,255,.14)"></div>`;
  $('s6').innerHTML = `<div class="card grid" id="gridcard" style="position:absolute;left:50%;top:${CY}px">
    <div class="gtabs"><b>Submissions</b><span class="mono" style="color:rgba(232,238,255,.5)">Grid view</span><span style="flex:1"></span><span class="mono" style="color:rgba(232,238,255,.5)">3 records</span></div>
    <div class="gr h"><div>Email</div><div>Level</div><div>Score</div><div>Opt-in</div><div>Report Emailed</div></div>
    <div class="gr dim"><div>${skel(V ? 200 : 300)}</div><div>${skel(V ? 100 : 130)}</div><div>${skel(60)}</div><div>${skel(80)}</div><div>${skel(40)}</div></div>
    <div class="gr dim"><div>${skel(V ? 170 : 260)}</div><div>${skel(V ? 100 : 130)}</div><div>${skel(60)}</div><div>${skel(80)}</div><div>${skel(40)}</div></div>
    <div class="gr" id="grow" style="border-bottom:none"><div id="c1"><span id="c1t"></span></div><div id="c2"><span class="pill b">Taxiing</span></div><div id="c3"><b class="hd">13</b></div>
     <div id="c4"><span class="pill y">YES</span></div><div id="c5">${tk('c5k')}</div></div></div>`;

  $('s7').innerHTML = `<div class="card res"><div class="row">${ringHTML('nring', GOLD)}<div><div class="mono">Your AI-readiness level</div><div class="lvl">Taxiing</div>
   <p>Your full report is in your inbox.</p></div></div>
   <div class="next" style="border-color:rgba(240,192,64,.35);background:rgba(240,192,64,.05)"><div class="mono gold">Your next step</div><p>${nextStepText}</p>
   <div style="position:relative;display:inline-block;margin-top:26px"><div id="pingr" style="position:absolute;inset:0;border:3px solid ${GOLD};border-radius:16px;opacity:0"></div><div class="btn g" id="cbtn">Contact me to learn more</div></div></div></div>`;
  setRing('nring', 1);

  $('s8').innerHTML = `<div id="glow"></div><div style="display:flex;flex-direction:column;align-items:center;margin-top:${V ? -60 : -40}px">
   <div class="lock" id="lock">${mark(GOLD, 3.2, 'lm')}<span class="wm" id="lwm">the architect</span></div>
   <div class="tagl" id="tag">Stay Vigilant. Stay Visionary.</div><div class="cta" id="cta">Take the free assessment</div>
   <div class="url" id="url">nastasjaterry.com/assessment</div></div>`;
}

/* ---------- node diagram ---------- */
const NODES = [];
function buildDiagram() {
  const nw = V ? 430 : 290, nh = V ? 132 : 150, y0 = V ? 330 : 470, cx = 540;
  const defs = V
    ? [['A', 'Assessment page', 'Visitor answers', cx, 330], ['B', 'n8n', 'Re-score · rebuild', cx, 590], ['C', 'Airtable', 'Log the lead', cx, 850], ['D', 'Gmail', 'Two outputs', cx, 1110],
       ['E1', 'Visitor report', 'To the visitor', 300, 1370, 1], ['E2', 'My copy', 'To me', 780, 1370, 1]]
    : [['A', 'Assessment page', 'Visitor answers', 230, y0], ['B', 'n8n', 'Re-score · rebuild', 595, y0], ['C', 'Airtable', 'Log the lead', 960, y0], ['D', 'Gmail', 'Two outputs', 1325, y0],
       ['E1', 'Visitor report', 'To the visitor', 1700, y0 - 140, 1], ['E2', 'My copy', 'To me', 1700, y0 + 140, 1]];
  const ow = V ? 380 : nw;
  let h = '<svg id="dsvg" width="' + W + '" height="' + H + '" style="position:absolute;inset:0;overflow:visible"></svg>';
  defs.forEach((d, i) => {
    const w = d[5] ? ow : nw;
    NODES.push({ id: d[0], x: d[3], y: d[4], w, h: nh });
    h += `<div class="node ${d[5] ? 'g' : ''}" id="n${d[0]}" style="width:${w}px;height:${nh}px;left:${d[3] - w / 2}px;top:${d[4] - nh / 2}px"><b>${d[1]}</b><small>${d[2]}</small></div>`;
  });
  const bx1 = V ? NODES[1].x - nw / 2 - 34 : NODES[1].x - nw / 2 - 34, by1 = NODES[1].y - nh / 2 - 46;
  const bx2 = V ? NODES[3].x + nw / 2 + 34 : NODES[3].x + nw / 2 + 34, by2 = NODES[3].y + nh / 2 + 46;
  h += `<div id="srvbox" style="position:absolute;left:${bx1}px;top:${by1}px;width:${bx2 - bx1}px;height:${by2 - by1}px;border:2px dashed rgba(61,127,255,.55);border-radius:30px;opacity:0;background:rgba(61,127,255,.035)"></div>
        <div id="srvlab" class="mono" style="left:${bx1 + 24}px;top:${by1 + 14}px;font-size:17px">Server-side</div>`;
  $('s3').innerHTML = h;
  const clip = (a, b) => { // point on rect a toward b
    const dx = b.x - a.x, dy = b.y - a.y, t = Math.min((a.w / 2 + 6) / Math.abs(dx || 1e-9), (a.h / 2 + 6) / Math.abs(dy || 1e-9));
    return { x: a.x + dx * t, y: a.y + dy * t };
  };
  const NS = 'http://www.w3.org/2000/svg', svg = $('dsvg');
  const E = [['A', 'B', 0, 0], ['B', 'C', 1, .35], ['C', 'D', 2, .7], ['D', 'E1', 3, 1.05, 1], ['D', 'E2', 3, 1.05, 1]];
  S.edges = E.map((e, i) => {
    const a = NODES.find(n => n.id === e[0]), b = NODES.find(n => n.id === e[1]);
    const p1 = clip(a, b), p2 = clip(b, a), col = e[4] ? GOLD : BLUE;
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', p1.x); ln.setAttribute('y1', p1.y); ln.setAttribute('x2', p2.x); ln.setAttribute('y2', p2.y);
    ln.setAttribute('stroke', col); ln.setAttribute('stroke-width', 4); ln.setAttribute('pathLength', 1); ln.setAttribute('stroke-dasharray', 1);
    ln.style.filter = `drop-shadow(0 0 8px ${col})`; svg.appendChild(ln);
    const dots = [0, 1, 2].map(j => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 11 - j * 3); c.setAttribute('fill', e[4] ? GOLD : '#9fc0ff'); c.style.filter = `drop-shadow(0 0 12px ${col})`; svg.appendChild(c); return c; });
    return { ln, p1, p2, dots, off: e[3], gold: !!e[4], tb: [15.7, 16.3, 16.9, 17.5, 17.6][i] };
  });
}

/* ---------- timeline ---------- */
const WIN = [[0, 4], [4, 9], [9, 15], [15, 21], [21, 28], [28, 33], [33, 37], [37, 38.3], [38.3, 40]];
const CAPS = [
  [0.9, 2.5, 'Before: they took the assessment…', 'big'], [2.6, 4.1, '…and got <b>nothing to keep.</b>', 'big'],
  [6.6, 9.1, 'No copy. <b>No way to reach me.</b>'],
  [12.9, 15.1, 'Email in. <b>Consent in their hands.</b>'],
  [16.0, 18.5, 'Scores re-checked. <b>Report rebuilt server-side.</b>'], [18.6, 21.1, 'Nothing from the browser is <b>ever emailed.</b>'],
  [22.4, 28.0, 'Every visitor gets their <b>full report.</b>'],
  [28.9, 31.0, 'I get the <b>analysis</b> too.'], [31.1, 33.2, 'Not just the scores.'],
  [33.7, 37.1, 'Every lead, <b>logged and trackable.</b>'],
];
const SAMPLE = [[9.4, 15.2], [21.4, 38.3]];

function sceneFrame(i, t) {
  const el = $('s' + i), [a, b] = WIN[i];
  if (t < a - 1e-6 || t > b + 0.5) { el.style.display = 'none'; return false; }
  el.style.display = 'flex';
  const e = i === 0 ? 1 : oc(pr(t, a, 0.5)), x = i === 8 ? 0 : pr(t, b, 0.45);
  const xs = (1 - e) * (V ? 0 : 170) + (-oc(x)) * (V ? 0 : 130);
  const ys = V ? (1 - e) * 220 - oc(x) * 160 : 0;
  const sc = i === 0 ? 1 + oc(x) * 0.18 : (i === 8 ? mix(0.96, 1, e) : 1);
  el.style.transform = `translate(${xs}px,${ys}px) scale(${sc})`;
  el.style.opacity = e * (1 - oc(x));
  return true;
}

function seek(t) {
  const vis = WIN.map((_, i) => sceneFrame(i, t));

  /* 0 cold open */
  if (vis[0]) {
    const rs = $('bigmark').querySelectorAll('rect');
    rs.forEach((r, i) => r.style.strokeDashoffset = 1 - oc(pr(t, 0.15 + i * 0.28, 1.0)));
    rs.forEach(r => r.setAttribute('stroke-dasharray', 1));
    const g = oc(pr(t, 0.4, 2));
    $('bigmark').style.filter = `drop-shadow(0 0 ${14 + 26 * g}px rgba(240,192,64,${.35 + .4 * g}))`;
    $('bigmark').style.transform = `scale(${mix(0.9, 1.04, oc(pr(t, 0, 3.6)))})`;
  }
  /* 1 the gap */
  if (vis[1]) {
    const f = oc(pr(t, 4.35, 0.9)); setRing('oring', f);
    $('hl').style.transform = `scaleX(${oc(pr(t, 5.3, 0.55))})`;
    $('hl').style.opacity = 1 - pr(t, 6.5, .4) * .6;
    $('st').style.transform = `scaleX(${oc(pr(t, 6.05, 0.4))})`;
    $('booktxt').style.opacity = 1 - 0.6 * pr(t, 6.4, 0.4);
  }
  /* 2 new step */
  if (vis[2]) {
    const fill = mix(0.66, 1, oc(pr(t, 9.8, 0.8))); // progress to complete
    const sw = oc(pr(t, 10.2, 1.0));
    $('tb').style.transform = `scaleX(${fill})`;
    $('tg').style.transform = `scaleX(${fill})`; $('tg').style.clipPath = `inset(0 ${(1 - sw) * 100}% 0 0)`;
    $('hg').style.clipPath = `inset(0 ${(1 - sw) * 100}% 0 0)`;
    const txt = 'jane@example.com', n = Math.floor(clamp((t - 11.0) / 1.0) * txt.length);
    $('em').textContent = txt.slice(0, n);
    $('caret').style.opacity = t < 11 ? 0 : (t > 12.2 ? 0 : (Math.floor(t * 3) % 2 ? 0 : 1));
    const k = oc(pr(t, 12.3, 0.3)), cb = $('cbox');
    cb.style.background = `rgba(240,192,64,${k})`; cb.style.borderColor = k > 0 ? GOLD : 'rgba(232,238,255,.5)';
    cb.style.transform = `scale(${1 + 0.28 * Math.sin(Math.PI * pr(t, 12.3, 0.4))})`;
    cb.style.boxShadow = `0 0 ${40 * k}px rgba(240,192,64,${.7 * k})`;
    setCheck(cb, oc(pr(t, 12.35, 0.3)));
    $('sbtn').style.boxShadow = `0 0 ${50 * oc(pr(t, 12.7, .5))}px rgba(61,127,255,.6)`;
  }
  /* 3 the engine */
  if (vis[3]) {
    NODES.forEach((n, i) => {
      const tb = [15.3, 15.9, 16.5, 17.1, 17.7, 17.9][i], k = oe(pr(t, tb, 0.5));
      const el = $('n' + n.id); el.style.opacity = k; el.style.transform = `translateY(${(1 - k) * 24}px) scale(${mix(0.86, 1, k)})`;
    });
    S.edges.forEach(e => {
      e.ln.style.strokeDashoffset = 1 - oc(pr(t, e.tb, 0.4));
      const ps = (t - 17.1 - e.off) , seg = 0.4, per = 1.6;
      e.dots.forEach((d, j) => {
        const q = ((ps - j * 0.045) % per + per) % per / seg, on = ps > 0 && q >= 0 && q <= 1;
        d.setAttribute('cx', mix(e.p1.x, e.p2.x, oc(clamp(q)))); d.setAttribute('cy', mix(e.p1.y, e.p2.y, oc(clamp(q))));
        d.setAttribute('opacity', on ? (1 - j * 0.3) : 0);
      });
    });
    const sb = oc(pr(t, 16.3, 0.7)); $('srvbox').style.opacity = sb; $('srvlab').style.opacity = sb;
  }
  /* 4 the report */
  if (vis[4]) {
    const inb = $('inbox'), mail = $('mail');
    const h = 118 * oc(pr(t, 21.55, 0.5)); $('newrow').style.height = h + 'px';
    const ping = Math.sin(Math.PI * pr(t, 22.0, 0.6));
    $('newrow').style.boxShadow = `0 0 ${40 + 50 * ping}px rgba(240,192,64,${.2 + .35 * ping})`;
    const out = oc(pr(t, 22.85, 0.5));
    place(inb, 0, 0, 1 + out * 0.07, 1 - out); inb.style.display = out >= 1 ? 'none' : 'block';
    const inn = oc(pr(t, 22.95, 0.55));
    place(mail, 0, (1 - inn) * 50, mix(0.93, 1, inn), inn); mail.style.display = t < 22.9 ? 'none' : 'block';
    setRing('mring', oc(pr(t, 23.7, 1.2)));
    rise($('mlv'), oc(pr(t, 24.5, 0.45)), 18);
    rise($('b1'), oc(pr(t, 24.4, 0.5))); rise($('b2'), oc(pr(t, 24.85, 0.5)));
    S.bars.forEach((b, i) => {
      const k = oc(pr(t, 25.5 + i * 0.22, 0.8)), row = $('br' + i);
      row.querySelector('i').style.transform = `scaleX(${k * b[1] / 6})`;
      row.querySelector('.bv').textContent = Math.round(b[1] * k) + '/6'; row.style.opacity = clamp(k * 3);
    });
  }
  /* 5 my copy */
  if (vis[5]) {
    const tk = oc(pr(t, 28.1, 0.4)) * (1 - oc(pr(t, 28.85, 0.3)));
    const toast = $('toast'); toast.style.opacity = tk; toast.style.transform = `translate(-50%,${(1 - tk) * -40}px)`;
    const m = oc(pr(t, 28.9, 0.5)), mm = $('mail2'); place(mm, 0, (1 - m) * -60, mix(0.95, 1, m), m);
    [['f1', 29.4], ['f2', 29.8], ['f3', 30.2], ['f4', 30.6]].forEach(([id, a]) => { const k = oc(pr(t, a, 0.4)), el = $(id); el.style.opacity = k; el.style.transform = `translateX(${(1 - k) * 36}px)`; });
    const gp = Math.sin(Math.PI * pr(t, 29.1, 1.2));
    $('lead').style.boxShadow = `0 0 ${50 + 70 * gp}px rgba(240,192,64,${.2 + .3 * gp})`;
    rise($('ana'), oc(pr(t, 31.3, 0.6)));
  }
  /* 6 airtable */
  if (vis[6]) {
    place($('gridcard'), 0, 0, 1, 1);
    const txt = 'jane@example.com', n = Math.floor(clamp((t - 33.85) / 0.7) * txt.length);
    $('c1t').textContent = txt.slice(0, n);
    const cells = [['c1', 33.8, 34.6], ['c2', 34.7, 35.1], ['c3', 35.15, 35.55], ['c4', 35.6, 36.0], ['c5', 36.05, 36.45]];
    cells.forEach(([id, a, b]) => {
      const el = $(id), act = t >= a - 0.05 && t < b + 0.15;
      el.style.borderColor = act ? BLUE : 'transparent'; el.style.boxShadow = act ? '0 0 26px rgba(61,127,255,.5)' : 'none';
      if (id === 'c2' || id === 'c3' || id === 'c4') el.firstElementChild.style.opacity = oc(pr(t, a, 0.25));
    });
    const tk = oc(pr(t, 36.1, 0.3)), box = $('c5k');
    box.style.background = `rgba(240,192,64,${tk})`; box.style.borderColor = tk > 0 ? GOLD : 'rgba(232,238,255,.35)';
    box.style.transform = `scale(${1 + .3 * Math.sin(Math.PI * pr(t, 36.1, .4))})`; box.style.boxShadow = `0 0 ${34 * tk}px rgba(240,192,64,${.8 * tk})`;
    setCheck(box, oc(pr(t, 36.15, 0.3)));
    const done = oc(pr(t, 36.4, 0.4));
    $('grow').style.background = `rgba(240,192,64,${.07 * done})`; $('grow').style.boxShadow = `inset 0 0 0 ${2 * done}px rgba(240,192,64,${.55 * done})`;
  }
  /* 7 results + CTA button */
  if (vis[7]) {
    const k = oc(pr(t, 37.35, 0.3)), btn = $('cbtn');
    btn.style.transform = `scale(${1 + .09 * Math.sin(Math.PI * pr(t, 37.35, .45))})`;
    btn.style.boxShadow = `0 0 ${50 + 40 * k}px rgba(240,192,64,${.35 + .3 * k})`;
    const p = pr(t, 37.4, 0.9); const pg = $('pingr'); pg.style.opacity = (1 - p) * (p > 0 ? 1 : 0); pg.style.transform = `scale(${1 + p * .25},${1 + p * .7})`;
  }
  /* 8 final lockup */
  if (vis[8]) {
    const rs = $('lock').querySelectorAll('rect'); rs.forEach((r, i) => { r.setAttribute('stroke-dasharray', 1); r.style.strokeDashoffset = 1 - oc(pr(t, 38.3 + i * .06, 0.4)); });
    rise($('lwm'), oc(pr(t, 38.45, 0.4)), 20); rise($('tag'), oc(pr(t, 38.7, 0.4)), 20);
    const c = oc(pr(t, 38.95, 0.4)); $('cta').style.opacity = c; $('cta').style.transform = `translateY(${(1 - c) * 26}px) scale(${mix(.94, 1, c)})`;
    rise($('url'), oc(pr(t, 39.2, 0.4)), 14); $('glow').style.opacity = oc(pr(t, 38.3, 0.8));
  }

  /* persistent */
  const bb = pr(t, 4.4, 0.4) * (1 - pr(t, 36.9, 0.3)); $('brandbar').style.opacity = bb * .85;
  const sm = SAMPLE.reduce((m, [a, b]) => Math.max(m, pr(t, a, .25) * (1 - pr(t, b - .25, .25))), 0); $('sample').style.opacity = sm;
  /* captions */
  const cap = $('cap'); let on = null;
  CAPS.forEach(c => { if (t >= c[0] && t <= c[1]) on = c; });
  if (on) {
    const k = oc(pr(t, on[0], 0.28)) * (1 - oc(pr(t, on[1] - 0.25, 0.25)));
    if (cap.dataset.k !== on[2]) { cap.innerHTML = on[2]; cap.dataset.k = on[2]; cap.className = on[3] || ''; }
    cap.style.opacity = k; cap.style.transform = `translateY(${(1 - oc(pr(t, on[0], 0.35))) * 26}px)`;
  } else cap.style.opacity = 0;
  $('prog').firstElementChild.style.width = (t / 40 * 100) + '%'; $('prog').style.opacity = t > 38.2 ? 1 - pr(t, 38.2, .3) : 1;
}

build();
window.seek = seek;
document.fonts.ready.then(() => { seek(0); window.READY = true; });
