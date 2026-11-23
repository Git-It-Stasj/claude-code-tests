const { chromium } = require('playwright');
(async () => {
  const ts = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY', null, { timeout: 15000 });
  for (const t of ts) { await p.evaluate(t => seek(t), t); await p.screenshot({ path: `qa/s_${t.toFixed(2)}.png` }); }
  if (errs.length) console.log('ERR', errs.join('\n')); await b.close();
})();
