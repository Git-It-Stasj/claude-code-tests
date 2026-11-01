#!/usr/bin/env node
// Live site -> real full-page captures (tiled) + page coordinates for every thing the reel points at.
// Usage: node capture-site.cjs <videoDir> [--photo]
// Reads <videoDir>/episode.json. Writes <videoDir>/assets/shots/{desktop,mobile}-N.png, <videoDir>/coords.json,
// <videoDir>/qa/locate-{desktop,mobile}.png (boxes drawn on the page so you can check them), <videoDir>/qa/live-vs-report.json.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const videoDir = path.resolve(process.argv[2] || '.');
const wantPhoto = process.argv.includes('--photo');
const EP = JSON.parse(fs.readFileSync(path.join(videoDir, 'episode.json'), 'utf8'));
const shots = path.join(videoDir, 'assets/shots'), qa = path.join(videoDir, 'qa');
fs.mkdirSync(shots, { recursive: true }); fs.mkdirSync(qa, { recursive: true });
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'))); }

// runs inside the page; returns css-px page coordinates [x, y, w, h]
function locate({ headlineText, needles, isMobile }) {
  const sx = window.scrollX, sy = window.scrollY, vw = window.innerWidth, vh = window.innerHeight;
  const norm = (s) => (s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  const vis = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05; };
  const R = (r) => [Math.round(r.x + sx), Math.round(r.y + sy), Math.round(r.width), Math.round(r.height)];
  const pad = (a, p) => [a[0] - p, Math.max(0, a[1] - p), a[2] + 2 * p, a[3] + 2 * p];
  const union = (rs) => { const x0 = Math.min(...rs.map((a) => a[0])), y0 = Math.min(...rs.map((a) => a[1])), x1 = Math.max(...rs.map((a) => a[0] + a[2])), y1 = Math.max(...rs.map((a) => a[1] + a[3])); return [x0, y0, x1 - x0, y1 - y0]; };
  const isFixed = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
  const out = { vw, vh, notes: [] };
  // fixed / sticky elements (reported in viewport coordinates: they sit at this spot in a full-page capture)
  out.fixed = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && vis(e)).map((e) => { const r = e.getBoundingClientRect(); return { text: (e.innerText || '').trim().slice(0, 40), rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }; }).filter((f) => f.rect[2] > 20 && f.rect[3] > 20);
  // --- headline
  const h1s = [...document.querySelectorAll('h1')].filter(vis);
  const want = norm(headlineText);
  const h1 = h1s.find((e) => want && norm(e.innerText).includes(want)) || h1s.find((e) => e.getBoundingClientRect().top + sy < vh * 1.6) || h1s[0];
  if (h1) {
    const range = document.createRange(); range.selectNodeContents(h1);
    const rr = [...range.getClientRects()].filter((r) => r.width > 2); const tight = rr.length ? union(rr.map((r) => R(r))) : R(h1.getBoundingClientRect());
    out.h1 = pad(tight, 10); out.h1Text = h1.innerText.trim();
  } else { out.h1 = null; out.notes.push('no visible h1 found'); }
  // --- hero buttons: button-like links/buttons just under the h1, not fixed, not in the nav
  if (out.h1) {
    const btnLike = [...document.querySelectorAll('a,button,[role="button"]')].filter((e) => {
      if (!vis(e) || isFixed(e)) return false;
      const t = (e.innerText || '').trim(); if (t.length < 2 || t.length > 42) return false;
      const r = e.getBoundingClientRect(), cs = getComputedStyle(e), y = r.top + sy;
      if (y < out.h1[1] + out.h1[3] - 20 || y > out.h1[1] + 900) return false;
      const filled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0;
      return filled && parseFloat(cs.paddingLeft) >= 8;
    }).map((e) => ({ e, r: R(e.getBoundingClientRect()), t: e.innerText.trim() })).sort((a, b) => a.r[1] - b.r[1] || a.r[0] - b.r[0]);
    if (btnLike.length) {
      const first = btnLike[0], group = btnLike.filter((b) => b.r[1] < first.r[1] + 170).slice(0, 3);
      out.hero = first.r; out.heroText = first.t; out.buttons = pad(union(group.map((g) => g.r)), 8); out.buttonTexts = group.map((g) => g.t);
    } else { out.hero = null; out.buttons = null; out.notes.push('no hero button found below the headline'); }
  }
  // --- headline overlay card (covers the headline and the line under it)
  if (out.h1) {
    const w = isMobile ? vw - 28 : Math.min(780, Math.max(out.h1[2], 560) + 120);
    out.headCard = [Math.max(8, out.h1[0] - 8), Math.max(0, out.h1[1] - 4), w, Math.max(isMobile ? 150 : 200, out.h1[3] + (isMobile ? 90 : 130))];
  }
  // --- event / promo that the report says is expired: every place its date or name appears
  const occ = [];
  if (needles && needles.length) {
    const ns = needles.map(norm);
    const all = [...document.querySelectorAll('body *')].filter((e) => vis(e) && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(e.tagName));
    const hits = all.filter((e) => { const t = norm(e.textContent); return ns.some((n) => t.includes(n)); });
    const minimal = hits.filter((e) => !hits.some((o) => o !== e && e.contains(o)));
    minimal.forEach((e) => occ.push(e));
  }
  const container = (e) => {
    let n = e;
    for (let i = 0; i < 8 && n && n !== document.body; i++, n = n.parentElement) {
      const r = n.getBoundingClientRect(), cs = getComputedStyle(n);
      const visual = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0 || ['SECTION', 'ASIDE', 'ARTICLE'].includes(n.tagName);
      if (r.height >= 70 && r.height <= 950 && r.width >= Math.min(280, vw * 0.7) && visual) return n;
    }
    return e;
  };
  if (occ.length) {
    const sorted = occ.map((e) => ({ e, y: e.getBoundingClientRect().top + sy })).sort((a, b) => a.y - b.y);
    const first = sorted[0], far = sorted.filter((o) => Math.abs(o.y - first.y) > 600)[0];
    const c1 = container(first.e); out.event1 = R(c1.getBoundingClientRect());
    out.event2 = far ? R(container(far.e).getBoundingClientRect()) : null;
    let strip = first.e; for (let n = first.e; n && n !== document.body; n = n.parentElement) { const r = n.getBoundingClientRect(); if (r.width >= vw * 0.95 && r.height < 420) { strip = n; break; } }
    out.eventBar = R(strip.getBoundingClientRect());
    if (!far && sorted.length > 1) out.notes.push('the event appears more than once but all within 600px of the first; treated as one place');
  } else { out.event1 = out.event2 = out.eventBar = null; if (needles && needles.length) out.notes.push('event needles not found on the live page'); }
  // --- testimonials block
  const heads = [...document.querySelectorAll('h1,h2,h3,[class*="eyebrow"],[class*="kicker"]')].filter(vis).filter((e) => /testimonial|kind words|what (my |our )?(clients|people|customers)|client (stories|love)|reviews|success stories|stories/i.test(e.innerText));
  const quoteSel = 'blockquote,figure,[class*="testimonial"],[class*="quote"],[class*="review"]';
  let qs = [];
  if (heads.length) {
    const sec = heads[0].closest('section') || heads[0].parentElement.parentElement;
    qs = [...sec.querySelectorAll(quoteSel)].filter(vis);
  }
  if (!qs.length) qs = [...document.querySelectorAll(quoteSel)].filter(vis);
  // outermost text-bearing candidates (skips media-only cards); a short first card is joined with the next two
  const outer = qs.filter((e) => !qs.some((o) => o !== e && o.contains(e))).filter((e) => (e.innerText || '').trim().length >= 80 && e.getBoundingClientRect().height > 60);
  let topQ = outer.slice(0, 1);
  if (topQ.length && topQ[0].getBoundingClientRect().height < 250) topQ = outer.slice(0, 3);
  out.testim = topQ.length ? union(topQ.map((e) => R(e.getBoundingClientRect()))) : null;
  if (!out.testim) out.notes.push('no testimonial block found');
  out.cssH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const coords = {}, live = { checkedAt: new Date().toISOString().slice(0, 10) };
  for (const [name, vp, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, userAgent: mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
    const p = await ctx.newPage();
    await p.goto(EP.siteUrl, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += vp.height / 2) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(250); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
    const loc = await p.evaluate(locate, { headlineText: EP.headlineText, needles: EP.eventNeedles || [], isMobile: mobile });
    const full = path.join(videoDir, 'assets', `${name}-full.png`);
    await p.screenshot({ path: full, fullPage: true });
    // tile the page (no tile taller than ~8000 image px so the browser can always decode it)
    const dpr = mobile ? 2 : 1, tiles = Math.ceil((loc.cssH * dpr) / 7700);
    execFileSync('python3', ['-c', `
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
im=Image.open(${JSON.stringify(full)}); W,H=im.size; n=${tiles}; step=-(-H//n)
for i in range(n):
    im.crop((0,i*step,W,min(H,(i+1)*step))).save(${JSON.stringify(shots + '/' + name)}+'-%d.png'%i)
print(W,H)
`], { stdio: 'inherit' });
    coords[name] = { cssW: vp.width, cssH: loc.cssH, tiles, pngW: vp.width * dpr, ...loc };
    live[name] = { h1Text: loc.h1Text, heroText: loc.heroText, buttonTexts: loc.buttonTexts, fixed: loc.fixed, notes: loc.notes };
    await ctx.close();
  }
  // --- photo candidate (only saved when asked; the client must approve its use before it goes in a video)
  if (wantPhoto) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
    await p.goto(EP.siteUrl, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {}); await p.waitForTimeout(1500);
    const imgs = await p.evaluate(() => [...document.querySelectorAll('img')].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, y: Math.round(i.getBoundingClientRect().y + scrollY) })).filter((i) => i.w >= 500 && i.y < 1400));
    const cand = imgs.filter((i) => i.h / i.w >= 1.15)[0] || imgs[0];
    if (cand) {
      const body = await (await p.request.get(cand.src)).body(); const tmp = path.join(videoDir, 'assets/photo-candidate.src'); fs.writeFileSync(tmp, body);
      execFileSync('python3', ['-c', `from PIL import Image; Image.open(${JSON.stringify(tmp)}).convert('RGB').save(${JSON.stringify(path.join(videoDir, 'assets/photo-candidate.jpg'))}, quality=93)`]);
      fs.unlinkSync(tmp); live.photoCandidate = cand; console.log('photo candidate saved:', cand.src, cand.alt);
    } else console.log('no photo candidate found in the first screen');
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(videoDir, 'coords.json'), JSON.stringify(coords, null, 2));
  // --- live site vs. report
  const norm = (s) => (s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[.\s]+$/g, '').trim();
  live.headlineMatchesReport = norm(coords.desktop.h1Text).includes(norm(EP.headlineText));
  live.eventStillOnPage = !!(coords.desktop.event1);
  live.eventPlaces = [coords.desktop.event1, coords.desktop.event2].filter(Boolean).length;
  live.stickyOnMobile = (coords.mobile.fixed || []);
  fs.writeFileSync(path.join(qa, 'live-vs-report.json'), JSON.stringify(live, null, 2));
  // --- preview: boxes drawn on the captured pages so the located elements can be checked by eye
  const draw = { desktop: ['h1', 'hero', 'buttons', 'event1', 'event2', 'eventBar', 'testim', 'headCard'], mobile: ['h1', 'hero', 'buttons', 'event1', 'event2', 'eventBar', 'testim', 'headCard'] };
  execFileSync('python3', ['-c', `
import json
from PIL import Image, ImageDraw
Image.MAX_IMAGE_PIXELS=None
C=json.load(open(${JSON.stringify(path.join(videoDir, 'coords.json'))}))
cols={'h1':'#ff3b3b','hero':'#f0c040','buttons':'#ff8800','event1':'#00c8ff','event2':'#00c8ff','eventBar':'#0077ff','testim':'#22cc66','headCard':'#cc44ff'}
for name,dpr in (('desktop',1),('mobile',2)):
    im=Image.open(${JSON.stringify(videoDir)}+'/assets/'+name+'-full.png').convert('RGB'); d=ImageDraw.Draw(im)
    for k,c in cols.items():
        a=C[name].get(k)
        if a:
            x,y,w,h=[v*dpr for v in a]; d.rectangle([x,y,x+w,y+h],outline=c,width=6 if name=='desktop' else 8); d.text((x+8,y+8),k,fill=c)
    # downscale and cut into readable pieces
    s=700/im.size[0]; im=im.resize((700,int(im.size[1]*s)))
    pieces=-(-im.size[1]//1400)
    for i in range(min(pieces,12)):
        im.crop((0,i*1400,700,min(im.size[1],(i+1)*1400))).save(${JSON.stringify(qa)}+'/locate-%s-%d.png'%(name,i))
print('preview pieces written')
`], { stdio: 'inherit' });
  const miss = ['h1', 'hero'].filter((k) => !coords.desktop[k] || !coords.mobile[k]);
  console.log('coords.json written. desktop page', coords.desktop.cssH, 'px, mobile', coords.mobile.cssH, 'px');
  console.log('live headline matches report:', live.headlineMatchesReport, '| event still on page:', live.eventStillOnPage, `(${live.eventPlaces} place(s))`);
  console.log('sticky/fixed on mobile:', JSON.stringify(live.stickyOnMobile));
  ['desktop', 'mobile'].forEach((n) => (coords[n].notes || []).forEach((x) => console.log(`NOTE (${n}): ${x}`)));
  if (miss.length) console.log('WARNING: could not locate', miss.join(', '), '- fill them in by hand in coords.json (css px [x,y,w,h]) before building');
})();
