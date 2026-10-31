// 1) Verbatim check: every on-screen string tagged data-t="report" must appear in the report (visible text or its REPORT json).
// 2) Layout audit: sample the timeline; flag text under 24px (effective), text outside the frame, clipped/overflowing boxes.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const GR = JSON.parse(fs.readFileSync(path.join(ROOT, 'grid.json'), 'utf8'));
const norm = (s) => s.replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"').replace(/ʻ/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
const rep = fs.readFileSync(path.join(ROOT, 'assets/Glowhawaii-Architect-Report.html'), 'utf8').replace(/data:[a-z/+\-]+;base64,[A-Za-z0-9+/=]+/g, '');
const repText = norm(rep.replace(/<script[\s\S]*?<\/script>/g, (m) => m).replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'") + ' ' + rep.replace(/\\"/g, '"').replace(/\\u2019/g, "'"));
const TJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'testimonial.json'), 'utf8'));
const REPLY = TJ.body + TJ.attr;
(async () => {
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa/text-manifest.json'), 'utf8'));
  const out = { verbatim: {}, layout: {} }; let lines = [];
  for (const r of Object.keys(man)) {
    const items = [...new Map(man[r].map((m) => [m.src + '|' + m.text, m])).values()];
    const bad = items.filter((m) => m.src === 'report' && !repText.includes(norm(m.text)));
    out.verbatim[r] = { checked: items.filter((m) => m.src === 'report').length, mismatches: bad.map((b) => b.text), hud: items.filter((m) => m.src === 'hud').length, brief: items.filter((m) => m.src === 'brief' || m.src === 'brand').map((m) => m.text) };
  }
  const b = await chromium.launch();
  for (const [r, W, H] of [['16x9', 1920, 1080], ['9x16', 1080, 1920]]) {
    const page = await b.newPage({ viewport: { width: W, height: H } });
    await page.goto('file://' + path.join(ROOT, r, 'index.html')); await page.waitForTimeout(2500);
    const res = await page.evaluate(async ({ W, H, REPLY, DUR, TYEND }) => {
      const tl = window.__timelines.main; const issues = []; let minFont = 999, minWhere = '';
      const clipOf = (e) => { while (e && e !== document.body) { if (e.classList && e.classList.contains('clip') && e.dataset.start !== undefined) return e; e = e.parentElement; } return null; };
      const effOpacity = (e) => { let o = 1; for (let n = e; n && n !== document.body; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return o; };
      const effScale = (e) => { let s = 1; for (let n = e; n && n !== document.body; n = n.parentElement) { const t = getComputedStyle(n).transform; if (t && t !== 'none') { const m = new DOMMatrix(t); s *= Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); } } return s; };
      const els = [...document.querySelectorAll('[data-t], .tg, .nh, .rq, #tc, #chl, .h')];
      const seen = new Set();
      for (let t = 0; t <= DUR; t += 0.1) {
        tl.time(t, false); await new Promise((r) => requestAnimationFrame(() => r()));
        for (const e of els) {
          const c = clipOf(e); if (c) { const s = +c.dataset.start, d = +c.dataset.duration; if (t < s || t >= s + d) continue; }
          if (!(e.textContent || '').trim()) continue;
          if (effOpacity(e) < 0.6) continue;
          const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const rc = e.getBoundingClientRect(); if (rc.width === 0) continue;
          // ignore text hidden by an ancestor clip-path wipe (inset) that has not revealed it yet
          let hidden = false; for (let n = e; n && n !== document.body; n = n.parentElement) { const cp = getComputedStyle(n).clipPath; if (cp && cp.startsWith('inset(')) { const v = cp.match(/[\d.]+%/g); if (v && v.some((x) => parseFloat(x) >= 90)) hidden = true; } }
          if (hidden) continue;
          const fs = parseFloat(cs.fontSize) * effScale(e);
          const key = (e.id || e.className || e.tagName) + ':' + Math.round(fs);
          if (fs < 24 - 0.5 && !seen.has('f' + key)) { seen.add('f' + key); issues.push({ t: +t.toFixed(1), type: 'font<24', size: +fs.toFixed(1), text: e.textContent.trim().slice(0, 50), el: e.id || e.className }); }
          if (fs < minFont) { minFont = fs; minWhere = e.textContent.trim().slice(0, 40); }
          const inside = rc.left >= -1 && rc.top >= -1 && rc.right <= W + 1 && rc.bottom <= H + 1;
          if (!inside && !seen.has('o' + key)) { seen.add('o' + key); issues.push({ t: +t.toFixed(1), type: 'outside-frame', text: e.textContent.trim().slice(0, 50), rect: [rc.left | 0, rc.top | 0, rc.right | 0, rc.bottom | 0] }); }
          if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && getComputedStyle(e).overflow !== 'visible' && !seen.has('w' + key)) { seen.add('w' + key); issues.push({ t: +t.toFixed(1), type: 'h-overflow', text: e.textContent.trim().slice(0, 50) }); }
        }
        // container overflow: cards that hold text
        for (const sel of ['.newcard', '.pill', '.removed', '.rcard', '.row', '.rowv', '.rung', '.rungv', '.fin', '.chip']) {
          for (const e of document.querySelectorAll(sel)) {
            const c = clipOf(e); if (c) { const s = +c.dataset.start, d = +c.dataset.duration; if (t < s || t >= s + d) continue; }
            if (effOpacity(e) < 0.6) continue;
            if (e.scrollHeight > e.clientHeight + 3 && e.clientHeight > 0 && !seen.has('c' + sel + e.id)) { seen.add('c' + sel + e.id); issues.push({ t: +t.toFixed(1), type: 'content-overflow', el: sel + '#' + e.id, scrollH: e.scrollHeight, clientH: e.clientHeight }); }
          }
        }
        // typed reply final text
        if (Math.abs(t - (TYEND + 0.3)) < 0.05) { const ty = document.getElementById('typed').textContent + document.getElementById('typed2').textContent; if (ty !== REPLY) issues.push({ t, type: 'reply-mismatch', got: ty }); }
      }
      return { issues, minFont: +minFont.toFixed(1), minWhere };
    }, { W, H, REPLY, DUR: GR.beats * GR.period, TYEND: GR.response.type[1] * GR.period });
    out.layout[r] = res; await page.close();
  }
  await b.close();
  fs.writeFileSync(path.join(ROOT, 'qa/qa-text.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
})();
