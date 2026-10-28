const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async () => {
  const o = process.argv[2], V = o === 'v', FPS = 30, N = 40 * FPS;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: V ? 1080 : 1920, height: V ? 1920 : 1080 } });
  await p.goto('file://' + __dirname + '/index.html?o=' + o); await p.waitForFunction('window.READY');
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-vf', 'noise=alls=3:allf=t', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `out_video_${o}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => seek(t), i / FPS);
    const buf = await p.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(o, i);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log(o, 'done');
})();
