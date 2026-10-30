// Re-measures each built project: the last vertical segment of both Airtable->output connectors must end
// exactly on the top-center of its output box. Usage: node verify-connectors.cjs <outDir>   (exit 1 on mismatch)
const { chromium } = require("playwright"); const path = require("path");
(async () => {
  const outDir = path.resolve(process.argv[2] || "."); const b = await chromium.launch(); let bad = false; const res = {};
  for (const r of ["16x9", "9x16"]) {
    const p = await b.newPage(); const [w, h] = r === "16x9" ? [1920, 1080] : [1080, 1920]; await p.setViewportSize({ width: w, height: h });
    await p.goto("file://" + path.join(outDir, r, "index.html")); await p.waitForTimeout(800);
    // offsetTop/offsetLeft ignore the entrance tweens' transforms, so this is the settled position
    const o = await p.evaluate(() => { const out = {};
      for (const [c, box] of [["c1", "nm-o1"], ["c2", "nm-o2"]]) { const bx = document.getElementById(box); const segs = [...document.querySelectorAll(`[id^=nm-${c}-s]`)]; const last = segs[segs.length - 1];
        out[c] = { lineCenterX: last.offsetLeft + last.offsetWidth / 2, lineEndY: last.offsetTop + last.offsetHeight, boxTopCenterX: bx.offsetLeft + bx.offsetWidth / 2, boxTopY: bx.offsetTop }; }
      return out; });
    for (const v of Object.values(o)) if (Math.abs(v.lineCenterX - v.boxTopCenterX) > 0.01 || Math.abs(v.lineEndY - v.boxTopY) > 0.01) bad = true;
    res[r] = o; await p.close();
  }
  console.log(JSON.stringify(res)); await b.close(); process.exit(bad ? 1 : 0);
})();
