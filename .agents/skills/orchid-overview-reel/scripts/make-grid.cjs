#!/usr/bin/env node
// episode.json + coords.json -> grid.json (96 BPM, every beat position for build, music and QA) and a draft STORYBOARD.md
// Usage: node make-grid.cjs <videoDir>
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || '.');
const EP = JSON.parse(fs.readFileSync(path.join(dir, 'episode.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(dir, 'coords.json'), 'utf8'));
const BPM = 96, P = 60 / BPM, r = (x) => Math.round(x * 100) / 100;
const D = CO.desktop;
const has = { headline: !!D.h1, cta: !!D.hero, event: !!D.event1, testimonials: !!D.testim };

// --- chapter 1: the real site
let t = 10;
const g = { bpm: BPM, period: P, fps: 30, motifDraw: [0, 2], windowOpen: [2, 3] };
// --- chapter 2: audit, one slot per finding; an event with two places gets one extra scroll
const items = EP.findings.map((f) => {
  const located = (f.kind === 'headline' && has.headline) || (f.kind === 'cta' && has.cta) || (f.kind === 'event' && has.event) || (f.kind === 'testimonials' && has.testimonials);
  const two = f.kind === 'event' && located && !!D.event2;
  const it = { kind: f.kind, located, start: t, scroll: t, box: t + (located ? 1 : 0.5) };
  if (two) { it.scroll2 = t + 2; it.box2 = t + 3; t += 4; } else t += located ? 3 : 2;
  it.end = t; return it;
});
const auditEnd = t;
// --- diagnosis ladder (lower level line first so it reads in order)
const L = EP.ladder, hasLines = !!(L.marketLine && L.siteLine);
const ladder = { start: auditEnd, lines: hasLines ? [auditEnd + 6, auditEnd + 9] : [], gap: L.gapLine ? auditEnd + (hasLines ? 10.5 : 7) : null };
ladder.end = auditEnd + (hasLines ? 13 : 8);
g.audit = { items, ladder };
g.preDropGap = [ladder.end - 0.5, ladder.end];
// --- chapter 3: before/after fixes, then the voice-of-the-market cards
t = ladder.end;
const fixItems = [];
if (has.headline) fixItems.push({ kind: 'headline' });
if (has.cta) fixItems.push({ kind: 'cta' });
if (EP.fixes.event && has.event) fixItems.push({ kind: 'event' });
fixItems.forEach((f) => { f.start = t; f.wipe = t + 3.5; f.end = t + 8; t += 8; });
const flurry = EP.quotes.map((_, i) => t + i * 5);
g.fix = { items: fixItems, flurry, flurryEnd: t + 5 * EP.quotes.length };
t = g.fix.flurryEnd;
const fixEnd = t;
// --- chapter 4: testimonial (only when the client approved one)
let resp = null;
if (EP.testimonial) {
  const len = EP.testimonial.body.length + EP.testimonial.attr.length;
  const typeBeats = Math.max(8, Math.round(len / 39)), holdBeats = Math.max(12, Math.round(len / 45));
  resp = { morph: [t, t + 1.5], type: [t + 1.5, t + 1.5 + typeBeats], hold: [t + 1.5 + typeBeats, t + 1.5 + typeBeats + holdBeats] };
  t = Math.ceil(resp.hold[1] + 1.5);
}
g.response = resp;
// --- chapter 5: lockup
const lockStart = t;
g.lockup = { motif: [lockStart, lockStart + 1.5], wordmark: lockStart + 1, tagline: lockStart + 2.5, subtitle: lockStart + 3.5 };
g.beats = lockStart + 7;
const names = [['site', 'THE REAL SITE', 0, 10], ['audit', 'THE AUDIT', 10, ladder.end], ['fix', 'THE FIX', ladder.end, fixEnd]];
if (resp) names.push(['response', 'THE RESPONSE', fixEnd, lockStart]);
names.push(['lockup', 'LOCKUP', lockStart, g.beats]);
g.chapters = names.map(([key, name, start, end], i) => ({ id: String(i + 1).padStart(2, '0'), key, name, start: r(start), end: r(end) }));
fs.writeFileSync(path.join(dir, 'grid.json'), JSON.stringify(g, null, 1));

// --- draft storyboard + dwell table for the confirmation gate
const sec = (b) => (b * P).toFixed(1) + ' s';
let md = `# ${EP.business} — The Architect overview reel\n\n${BPM} BPM · period ${P} s · ${g.beats} beats = ${sec(g.beats)} · 30 fps. \`grid.json\` drives music, build and QA.\n\n`;
md += `**Source:** \`12-report.html\` (verbatim) and live captures of ${EP.siteUrl} taken ${new Date().toISOString().slice(0, 10)} (unedited; annotations are overlays).\n\n`;
md += `## Chapters\n| # | Chapter | Beats | Time |\n|---|---|---|---|\n` + g.chapters.map((c) => `| ${c.id} | ${c.name} | ${c.start}–${c.end} | ${sec(c.start)}–${sec(c.end)} |`).join('\n') + '\n\n';
md += `## Findings shown (in order)\n` + EP.findings.map((f, i) => `${i + 1}. **${f.sev}** — ${f.title} _(${f.kind}${items[i].located ? ', located on the page' : ', NOT located: shown in the panel without a box'})_`).join('\n') + '\n\n';
md += `## Diagnosis\nSite speaks at Level ${L.siteLevel}, market at Level ${L.marketLevel}. Lines: ${hasLines ? `“${L.siteLine}” / “${L.marketLine}”` : 'not found in report (ladder only)'}. Lower level reads first.\n\n`;
md += `## Fixes (before → after)\n` + fixItems.map((f) => `- ${f.kind}: “${(EP.fixes[f.kind].caption || '')}” — before ${sec(f.wipe - f.start)}, after ${sec(f.end - f.wipe - 1)}`).join('\n') + '\n\n';
md += `## Voice of the market (${EP.quotes.length} cards × 3.1 s, longest → shortest)\n` + [...EP.quotes].sort((a, b) => b.text.length - a.text.length).map((q) => `- “${q.text}” — ${q.source}`).join('\n') + '\n\n';
md += resp ? `## Testimonial\nTyped ${sec(resp.type[1] - resp.type[0])}, then held ${sec(resp.hold[1] - resp.hold[0])}. Photo: ${EP.testimonial.photo || 'none'}.\n\n` : `## Testimonial\nSkipped: no approved testimonial supplied.\n\n`;
const notes = [];
Object.entries({ desktop: CO.desktop, mobile: CO.mobile }).forEach(([n, c]) => (c.notes || []).forEach((x) => notes.push(`${n}: ${x}`)));
if ((CO.mobile.fixed || []).length) notes.push('mobile sticky/fixed element(s): ' + CO.mobile.fixed.map((f) => `“${f.text}”`).join(', ') + ' — the audit/fix scrolls stay clear of it; mention it to the client');
md += `## Flags for the confirmation gate\n` + (notes.length ? notes.map((x) => `- ${x}`).join('\n') : '- none') + '\n';
fs.writeFileSync(path.join(dir, 'STORYBOARD.md'), md);
console.log(`grid.json: ${g.beats} beats = ${sec(g.beats)}; chapters: ${g.chapters.map((c) => `${c.id} ${c.name} ${c.start}-${c.end}`).join(' | ')}`);
console.log('STORYBOARD.md draft written');
