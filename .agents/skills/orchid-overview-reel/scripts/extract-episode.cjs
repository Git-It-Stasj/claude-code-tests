#!/usr/bin/env node
// Report -> episode.json. Everything the reel says that comes from the report is read here, verbatim.
// Usage: node extract-episode.cjs <path/to/12-report.html> <videoDir>
const fs = require('fs'), path = require('path');
const [reportPath, videoDir] = process.argv.slice(2);
if (!reportPath || !videoDir) { console.error('usage: extract-episode.cjs <12-report.html> <videoDir>'); process.exit(2); }
const html = fs.readFileSync(reportPath, 'utf8');
const m = html.match(/const REPORT = (\{[\s\S]*?\n\});/);
if (!m) { console.error('Could not find "const REPORT = {...}" in the report. The report template may have changed; read the report by hand and write episode.json manually (see references/episode-schema.md).'); process.exit(1); }
const R = JSON.parse(m[1]);
const warn = [];
const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const sentences = (s) => strip(s).split(/(?<=[.!?”"])\s+(?=[A-Z“"])/).map((x) => x.trim()).filter(Boolean);
// a caption must fit on one line at 38 px: if the sentence is long, keep the leading clause (still a verbatim substring)
const clause = (s, max = 78) => {
  s = s.trim();
  if (s.length <= max) return s;
  const cut = s.search(/[:;,]\s/);
  return cut > 20 && cut <= max ? s.slice(0, cut) : s.slice(0, max).replace(/\s+\S*$/, '');
};

// ---- domain / names
const siteUrl = R.meta.siteUrl;
const domain = new URL(siteUrl).hostname.replace(/^www\./, '');

// ---- findings: top 2 High + top 2 Medium, preferring ones we can point at on the page
const kindOf = (it) => {
  const t = `${it.title} ${it.where}`.toLowerCase();
  if (/expired|outdated|already (happened|passed)|past (event|date)|ended/.test(t) || /(summit|webinar|event|workshop|promo|sale)/.test(t) && /expired|outdated|still/.test(t)) return 'event';
  if (/testimonial|review|social proof/.test(t)) return 'testimonials';
  if (/button|cta|call to action|booking|book a/.test(t)) return 'cta';
  if (/headline|h1|hero (line|text)/.test(t)) return 'headline';
  return 'other';
};
const sevName = { high: 'High', med: 'Medium', medium: 'Medium', low: 'Low' };
const all = R.killers.items.map((it, i) => ({ idx: i, sev: sevName[it.severity] || it.severity, title: it.title, where: it.where, fix: strip(it.fix), kind: kindOf(it) }));
const pick = (sev, n) => {
  const pool = all.filter((f) => f.sev === sev);
  const located = pool.filter((f) => f.kind !== 'other'), rest = pool.filter((f) => f.kind === 'other');
  return [...located, ...rest].slice(0, n);
};
const chosen = [...pick('High', 2), ...pick('Medium', 2)].sort((a, b) => a.idx - b.idx);
if (chosen.length < 4) warn.push(`Only ${chosen.length} High/Medium findings found; the reel will show ${chosen.length}.`);
const kinds = chosen.map((f) => f.kind);
if (new Set(kinds.filter((k) => k !== 'other')).size !== kinds.filter((k) => k !== 'other').length) warn.push('Two chosen findings share a kind; only the first gets a selection box.');

// ---- diagnosis ladder
const body = strip(R.diagnosis.levelBody);
const grab = (re) => (body.match(re) || [null])[0];
const marketLine = grab(/Your market sits at Level \d/);
const siteLine = grab(/Your homepage headline speaks at Level \d/);
const gapLine = grab(/That gap is the opportunity\./);
if (!marketLine || !siteLine) warn.push('Could not find the "Your market sits at Level X" / "Your homepage headline speaks at Level Y" sentences in the report; the reel will show the ladder without those lines.');
if (R.diagnosis.levels.length !== 5) warn.push(`Ladder has ${R.diagnosis.levels.length} levels; the layout assumes 5.`);

// ---- fixes
const copy = R.copy;
const headlineItem = all.find((f) => f.kind === 'headline');
const ctaFlag = (R.gap.flags || []).map((f) => strip(f.text)).find((t) => /button/i.test(t));
const ctaItem = all.find((f) => f.kind === 'cta');
const eventItem = all.find((f) => f.kind === 'event');
const pickSentence = (text, re) => (sentences(text).find((s) => re.test(s)) || sentences(text)[0] || '');
const fixes = {
  headline: { before: strip(R.gap.before.headline).replace(/^[“"]|[”".]+$/g, ''), after: strip(copy.headline), caption: clause(pickSentence(headlineItem ? headlineItem.fix : '', /headline/i)) },
  cta: { after: strip(copy.cta), caption: clause(ctaFlag ? pickSentence(ctaFlag, /main button/i) : pickSentence(ctaItem ? ctaItem.fix : '', /button/i)) },
  event: eventItem ? { caption: clause(pickSentence(eventItem.fix, /^(Remove|Replace|Delete|Update|Take)/)) } : null,
};
if (!fixes.headline.caption) warn.push('No headline fix caption found; write one by hand (must be a verbatim substring of the report).');
if (!fixes.cta.caption) warn.push('No CTA fix caption found; write one by hand.');
if (eventItem && !fixes.event.caption) warn.push('No event fix caption found; write one by hand.');

// ---- event needles for locating it on the live site (date + name from the red flag)
let eventNeedles = [];
const flagText = (R.gap.flags || []).map((f) => strip(f.text)).join(' ');
const dm = flagText.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);
if (dm) eventNeedles.push(dm[1]);
const nm = (R.gap.flags || []).map((f) => (f.text.match(/<strong>([^<]+)<\/strong>/) || [])[1]).filter(Boolean)[0];
if (nm) eventNeedles.push(nm.split(',')[0].trim());
if (eventItem && !eventNeedles.length) warn.push('An event finding exists but no date/name could be read from the red flag; add "eventNeedles" to episode.json by hand.');

const episode = {
  domain, siteUrl, business: R.meta.business, client: R.meta.client,
  hudTitle: `${R.meta.business.toUpperCase()} · SITE AUDIT`,
  headlineText: fixes.headline.before,
  auditTitle: R.killers.eyebrow,
  findings: chosen.map(({ sev, title, where, kind }) => ({ sev, title, where, kind })),
  ladder: {
    eyebrow: R.diagnosis.eyebrow, title: R.diagnosis.title,
    levels: R.diagnosis.levels.map((l) => ({ name: l.name })),
    marketLevel: R.diagnosis.level, siteLevel: R.diagnosis.siteLevel,
    marketLine, siteLine, gapLine,
  },
  fixes, eventNeedles,
  quotes: R.voice.quotes.map((q) => ({ text: q.text, source: q.source })),
  tagline: R.meta.tagline,
  testimonial: null, // fill in only with text the client has approved: {"body": "...", "attr": "\n\n— Name, Title · Business", "photo": "photo.jpg", "photoAlt": "Name"}
};
fs.mkdirSync(videoDir, { recursive: true });
fs.writeFileSync(path.join(videoDir, 'episode.json'), JSON.stringify(episode, null, 2));
console.log(`episode.json written for ${domain}`);
console.log(`  findings (${episode.findings.length}): ` + episode.findings.map((f) => `${f.sev}/${f.kind}`).join(', '));
console.log(`  ladder: site Level ${episode.ladder.siteLevel}, market Level ${episode.ladder.marketLevel}`);
console.log(`  quotes: ${episode.quotes.length}; event fix: ${fixes.event ? 'yes' : 'no'}`);
console.log(`  captions: ${JSON.stringify([fixes.headline.caption, fixes.cta.caption, fixes.event && fixes.event.caption])}`);
warn.forEach((w) => console.log('  WARNING: ' + w));
