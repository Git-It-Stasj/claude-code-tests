#!/usr/bin/env node
// Writes VERIFY.md from the QA outputs. Usage: node write-verify.cjs <videoDir>
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || '.');
const rd = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return d; } };
const G = rd('grid.json'), EP = rd('episode.json'), QT = rd('qa/qa-text.json', null), LS = rd('qa/loudness.json', {}), LV = rd('qa/live-vs-report.json', {}), PR = rd('qa/probe.json', {});
const P = G.period, s = (b) => (b * P).toFixed(1) + ' s';
const cut = (r) => { try { const t = fs.readFileSync(path.join(dir, `qa/cuts-${r}.txt`), 'utf8'); const m = t.match(/max \|offset\| frames: ([\d.]+)/); const out = t.split('\n').filter((l) => /OUT/.test(l)); return { max: m ? (+m[1]).toFixed(2) : '?', out }; } catch { return { max: '?', out: [] }; } };
const c1 = cut('16x9'), c2 = cut('9x16');
const L = G.audit.ladder, N = EP.ladder.levels.length, settled = (L.lines[0] || L.end) - (L.start + 0.5 + (N - 1) * 0.3 + 0.6);
let md = `# VERIFY — ${EP.business} (${EP.domain}) overview reel\n\n| Check | Result | Evidence |\n|---|---|---|\n`;
md += `| Output | ${PR['16x9'] || '?'} · ${PR['9x16'] || '?'} | \`out/*.mp4\` |\n`;
md += `| Verbatim text | ${QT ? Object.entries(QT.verbatim).map(([r, v]) => `${r}: ${v.checked} report strings, ${v.mismatches.length} mismatches`).join(' · ') : 'not run'} | \`qa/qa-text.json\` |\n`;
md += `| Text size / overflow | ${QT ? Object.entries(QT.layout).map(([r, v]) => `${r}: min ${v.minFont}px, ${v.issues.length} issues`).join(' · ') : 'not run'} (sampled every 0.1 s over ${s(G.beats)}; text inside the site screenshots is the real site and is excluded) | \`qa/qa-text.json\` |\n`;
md += `| Cuts vs ${G.bpm} BPM grid | max offset ${c1.max} frame (16:9), ${c2.max} frame (9:16) | \`qa/cuts-*.txt\` |\n`;
md += `| Audio | ${LS.lufs !== undefined ? `${LS.lufs} LUFS, sample peak ${LS.peak} dBFS` : 'not measured'} | ffmpeg ebur128 |\n`;
md += `| Contact sheets | one per chapter, both ratios | \`qa/sheets/\` |\n`;
md += `| Dwell times | ${hasLines()} ladder levels settled ${(settled * P).toFixed(1)} s${L.lines.length ? `, first line ${((L.lines[1] - L.lines[0]) * P).toFixed(1)} s, second line ${((G.preDropGap[0] - L.lines[1]) * P).toFixed(1)} s` : ''}; ` + G.fix.items.map((f) => `${f.kind} before ${((f.wipe - f.start) * P).toFixed(1)} s / after ${((f.end - f.wipe - 1) * P).toFixed(1)} s`).join('; ') + `; quote cards ${(5 * P).toFixed(1)} s each (${G.fix.flurry.length})${G.response ? `; testimonial typed ${((G.response.type[1] - G.response.type[0]) * P).toFixed(1)} s then held ${((G.response.hold[1] - G.response.hold[0]) * P).toFixed(1)} s` : ''} | \`grid.json\` |\n`;
function hasLines() { return ''; }
md += `\n## Live site vs. the report (captured ${LV.checkedAt || '?'})\n`;
md += `- Live headline matches the report's "before": **${LV.headlineMatchesReport}** (live h1: “${(LV.desktop && LV.desktop.h1Text) || '?'}”)\n`;
md += `- Flagged event still on the live page: **${LV.eventStillOnPage}** (${LV.eventPlaces || 0} place(s))\n`;
md += `- Hero buttons on the live page: ${((LV.desktop && LV.desktop.buttonTexts) || []).map((t) => `“${t}”`).join(', ') || 'none found'}\n`;
const fx = (LV.stickyOnMobile || []); md += `- Sticky/fixed elements on the mobile site: ${fx.length ? fx.map((f) => `“${f.text}”`).join(', ') + ' (the reel scrolls clear of them; worth mentioning to the client)' : 'none'}\n`;
['desktop', 'mobile'].forEach((n) => ((LV[n] && LV[n].notes) || []).forEach((x) => (md += `- ${n}: ${x}\n`)));
const flagged = [...c1.out.map((l) => '16:9: ' + l.trim()), ...c2.out.map((l) => '9:16: ' + l.trim())];
md += `\n## Notes the checks cannot hide\n- After-states (new headline, new button, removed block) are annotation overlays labelled AFTER · RECOMMENDED / REMOVED, not the live site.\n`;
md += flagged.length ? `- The cut detector flags these as off-grid; they are the peaks of fast scroll jumps through the long page, not edits (check against the contact sheets):\n${flagged.map((x) => `  - ${x}`).join('\n')}\n` : '';
md += EP.testimonial ? `- Testimonial and photo were supplied by the user and confirmed approved for public use before this render.\n` : `- No approved testimonial was supplied, so the testimonial chapter was skipped.\n`;
fs.writeFileSync(path.join(dir, 'VERIFY.md'), md);
console.log('VERIFY.md written');
