const { chromium } = require('playwright');
(async () => {
  const [o, ...ts] = process.argv.slice(2); const V = o === 'v';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: V ? 1080 : 1920, height: V ? 1920 : 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/index30.html?o=' + o); await p.waitForFunction('window.READY', null, { timeout: 15000 });
  for (const t of ts.map(Number)) { await p.evaluate(t => seek(t), t); await p.screenshot({ path: `qa/${o}_${t.toFixed(2).padStart(5, '0')}.png` }); }
  if (errs.length) console.log('ERR', errs.join('\n')); await b.close();
})();
