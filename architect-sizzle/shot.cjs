const { chromium } = require('playwright');
(async () => {
  const [,, o, ...ts] = process.argv;
  const b = await chromium.launch(); const V = o === 'v';
  const p = await b.newPage({ viewport: { width: V ? 1080 : 1920, height: V ? 1920 : 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('LOG', m.text()));
  await p.goto('file://' + __dirname + '/index.html?o=' + o); await p.waitForFunction('window.READY');
  for (const t of ts) { await p.evaluate(t => seek(t), +t); await p.screenshot({ path: `frames/shot_${o}_${t}.png` }); }
  await b.close();
})();
