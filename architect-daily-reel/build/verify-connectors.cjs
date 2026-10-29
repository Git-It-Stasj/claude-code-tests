// Re-measures the rendered DOM: each connector's last vertical segment must end exactly at its box's top-center.
const { chromium } = require("playwright"); const path = require("path");
(async () => { const b = await chromium.launch();
 for (const r of ["16x9","9x16"]) {
  const p = await b.newPage(); const [w,h]=r==="16x9"?[1920,1080]:[1080,1920]; await p.setViewport?.(); await p.setViewportSize({width:w,height:h});
  await p.goto("file://"+path.resolve(__dirname,"..",r,"index.html")); await p.waitForTimeout(800);
  const o = await p.evaluate(() => { const R=id=>document.getElementById(id).getBoundingClientRect(); const out={};
   for (const [c,box] of [["c1","nm-o1"],["c2","nm-o2"]]) { const bx=R(box); const segs=[...document.querySelectorAll(`[id^=nm-${c}-s]`)]; const last=segs[segs.length-1];
     const l=last.offsetLeft,t=last.offsetTop,wd=last.offsetWidth,ht=last.offsetHeight;
     out[c]={lineCenterX:l+wd/2,lineEndY:t+ht,boxTopCenterX:document.getElementById(box).offsetLeft+document.getElementById(box).offsetWidth/2,boxTopY:document.getElementById(box).offsetTop}; }
   return out; });
  console.log(r, JSON.stringify(o)); await p.close(); }
 await b.close(); })();
