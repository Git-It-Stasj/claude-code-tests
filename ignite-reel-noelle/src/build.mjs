// Usage: node build.mjs <variant: a|b>  -> writes index.html (+ ../out/captions.srt, ../out/script.txt)
import fs from "node:fs";
const variant = process.argv[2] || "a";
const V = {
  a: { time: "10:00am", co: "With KPMG, GitHub and Intuit" },   // facts list
  b: { time: "12:45pm", co: "With KPMG, GitHub and Credit Karma" }, // Noelle's LinkedIn post
}[variant];
const DUR = 37;
const esc = (s) => s.replace(/\*([^*]+)\*/g, '<b class="hl">$1</b>');
const plain = (s) => s.replace(/\*/g, "");

// Voiceover segments (from silence detection on the ElevenLabs take) -> caption groups
const SEG = [
  [0.1, 1.96, ["Everyone is spending on *AI.*"]],
  [2.42, 4.98, ["Almost no one is", "*measuring* what it returns."]],
  [5.53, 7.73, ["At Microsoft *Ignite 2026,*"]],
  [7.94, 10.84, ["inside The *AI House*", "presented by *KPMG,*"]],
  [11.28, 13.34, ["*Noelle Russell*", "takes that question on."]],
  [13.8, 16.59, ["She is the founder of", "the *AI Leadership Institute,*"]],
  [16.91, 19.41, ["a five-time *Microsoft AI MVP,*"]],
  [19.59, 23.21, ["and the number one", "*agentic AI leader* of 2025."]],
  [23.74, 25.52, ["On *Wednesday, November 18,*"]],
  [25.75, 30.54, ["she joins leaders from", "*KPMG* and *GitHub*", "to show how to move", "from *token spend*"]],
  [30.71, 31.7, ["to *business value.*"]],
  [32.2, 33.07, ["*Noelle Russell.*"]],
  [33.52, 35.64, ["*Responsible AI* that scales."]],
];
const groups = [];
for (const [s, e, gs] of SEG) {
  const w = gs.map((g) => plain(g).length), tot = w.reduce((a, b) => a + b, 0);
  let t = s;
  gs.forEach((g, i) => {
    const d = ((e - s) * w[i]) / tot;
    groups.push({ text: g, start: t, end: i === gs.length - 1 ? e + 0.12 : t + d });
    t += d;
  });
}
const f = (n) => n.toFixed(2);
const capHtml = groups.map((g, i) =>
  `<div id="cap${i}" class="clip cap" data-start="${f(g.start)}" data-duration="${f(g.end - g.start)}" data-track-index="5"><span class="capin">${esc(g.text)}</span></div>`).join("\n");
const capJs = groups.map((g, i) => `
 tl.fromTo("#cap${i} .capin",{opacity:0,y:26,scale:.94},{opacity:1,y:0,scale:1,duration:.16,ease:"power3.out"},${f(g.start)});
 tl.to("#cap${i} .capin",{opacity:0,duration:.08,ease:"power2.in"},${f(g.end - 0.08)});`).join("");

const srtT = (t) => { const ms = Math.round(t * 1000); const p = (n, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
fs.mkdirSync("../out", { recursive: true });
fs.writeFileSync(variant === "a" ? "../out/captions.srt" : "../out/captions-ALT-per-post.srt",
  groups.map((g, i) => `${i + 1}\n${srtT(g.start)} --> ${srtT(g.end)}\n${plain(g.text)}\n`).join("\n"));

const scene = (id, s, e, inner) => `<div id="${id}" class="clip scene" data-start="${s}" data-duration="${e - s}" data-track-index="1"><div class="in" id="${id}-in">${inner}</div></div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
:root{--navy:#0A0E2E;--violet:#3A1C7A;--violet2:#5B2BB5;--ink:#FFFFFF;--soft:#C9CCF0;--accent:#FFC53D;--font:'Inter',sans-serif;}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--navy)}
#root{position:absolute;inset:0;font-family:var(--font);color:var(--ink);overflow:hidden}
#bg{position:absolute;inset:0;background:linear-gradient(165deg,#0A0E2E 0%,#1B1160 48%,#4A22A0 100%)}
.blob{position:absolute;border-radius:50%}
#b1{left:-300px;top:900px;width:1100px;height:1100px;background:radial-gradient(circle,rgba(123,63,228,.55),rgba(123,63,228,0) 65%)}
#b2{left:350px;top:-250px;width:1000px;height:1000px;background:radial-gradient(circle,rgba(255,197,61,.20),rgba(255,197,61,0) 65%)}
.ring{position:absolute;left:-160px;top:760px;width:1400px;height:520px;border-radius:50%;border:2px solid rgba(255,197,61,.30)}
#r2{border-color:rgba(190,170,255,.22);top:740px;height:620px}
#grid{position:absolute;inset:0;opacity:.5;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:90px 90px}
.scene{position:absolute;inset:0}
.in{position:absolute;inset:0}
.abs{position:absolute;left:130px;width:820px}
.eyebrow{font-weight:700;font-size:36px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
.huge{font-weight:900;font-size:118px;line-height:.98;letter-spacing:-.035em}
.big{font-weight:900;font-size:88px;line-height:1.02;letter-spacing:-.03em}
.mid{font-weight:700;font-size:50px;line-height:1.15;letter-spacing:-.01em}
.soft{color:var(--soft);font-weight:400}
.acc{color:var(--accent)}
.chip{position:absolute;left:130px;width:820px;height:104px;border-radius:26px;background:rgba(255,255,255,.09);border:2px solid rgba(255,255,255,.22);display:flex;align-items:center;padding-left:40px;font-weight:700;font-size:46px;letter-spacing:-.01em}
.chip i{display:block;width:12px;height:56px;border-radius:6px;background:var(--accent);margin-right:30px}
.beat{position:absolute;left:130px;width:820px;display:flex;align-items:center;gap:34px;font-weight:700;font-size:46px;line-height:1.1}
.beat u{flex:none;width:84px;height:84px;border-radius:50%;background:var(--accent);color:#14103A;text-decoration:none;font-weight:900;font-size:50px;display:flex;align-items:center;justify-content:center}
.card{position:absolute;left:130px;width:820px;border-radius:36px;background:rgba(10,14,46,.72);border:2px solid rgba(255,197,61,.7);padding:48px 52px}
.row{font-weight:900;letter-spacing:-.025em}
.rule{height:2px;background:rgba(255,255,255,.2);margin:30px 0}
.ph{position:absolute;left:130px;width:820px;padding:34px 20px;border:4px dashed var(--accent);border-radius:28px;text-align:center;font-weight:900;font-size:40px;letter-spacing:.02em;color:var(--accent);background:rgba(255,197,61,.08)}
.cap{position:absolute;left:0;top:1190px;width:1080px;height:230px;display:flex;align-items:flex-start;justify-content:center}
.capin{display:inline-block;max-width:820px;text-align:center;font-weight:900;font-size:58px;line-height:1.12;letter-spacing:-.015em;padding:16px 32px;border-radius:26px;background:rgba(6,8,30,.62);text-shadow:0 2px 10px rgba(0,0,0,.45)}
.hl{color:var(--accent);font-weight:900}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">

<div id="bgwrap" style="position:absolute;inset:0" data-layout-ignore>
 <div id="bg"></div><div id="grid"></div>
 <div class="blob" id="b1"></div><div class="blob" id="b2"></div>
 <div class="ring" id="r1"></div><div class="ring" id="r2"></div>
</div>

${scene("s1", 0, 5.5, `
 <div class="abs huge" id="s1-a" style="top:400px">Everyone is spending on <span class="acc">AI.</span></div>
 <div class="abs big" id="s1-b" style="top:860px">Who is measuring the <span class="acc">value?</span></div>`)}

${scene("s2", 5.5, 11.2, `
 <div class="abs eyebrow" id="s2-a" style="top:340px">Microsoft Ignite 2026</div>
 <div class="abs huge" id="s2-b" style="top:410px;font-size:104px">San Francisco<br><span class="acc">Nov 17–20</span></div>
 <div class="abs big" id="s2-c" style="top:410px;font-size:100px">The AI House</div>
 <div class="abs mid" id="s2-d" style="top:540px">presented by KPMG</div>
 <div class="abs mid soft" id="s2-e" style="top:700px;font-size:46px">The room where enterprise AI gets done.</div>`)}

${scene("s3", 11.2, 23.75, `
 <div class="abs huge" id="s3-a" style="top:300px;font-size:124px">Noelle<br>Russell</div>
 <div class="abs mid" id="s3-b" style="top:580px;color:var(--accent);font-size:44px">Founder, AI Leadership Institute</div>
 <div class="chip" id="s3-c1" style="top:690px"><i></i>5x Microsoft AI MVP</div>
 <div class="chip" id="s3-c2" style="top:808px"><i></i>#1 Agentic AI Leader 2025</div>
 <div class="chip" id="s3-c3" style="top:926px"><i></i>3.4M+ learners</div>
 <div class="chip" id="s3-c4" style="top:1044px;font-size:38px"><i></i>TEDx speaker &amp; best-selling author</div>`)}

${scene("s4", 23.75, 29.9, `
 <div class="abs mid" id="s4-a" style="top:290px;font-size:52px">From token spend to business value:</div>
 <div class="abs big" id="s4-b" style="top:440px;font-size:84px"><span class="acc">the Frontier value method.</span></div>
 <div class="beat" id="s4-1" style="top:790px"><u>1</u><span>Pick the right workflows</span></div>
 <div class="beat" id="s4-2" style="top:905px"><u>2</u><span>Model the human-agent cost</span></div>
 <div class="beat" id="s4-3" style="top:1020px"><u>3</u><span>Underwrite outcomes, not tokens</span></div>
 <div class="abs mid soft" id="s4-4" style="top:700px;font-size:42px">${V.co}</div>`)}

${scene("s5", 29.9, 33.3, `
 <div class="abs eyebrow" id="s5-a" style="top:290px;font-size:30px">The AI House presented by KPMG</div>
 <div class="card" id="s5-b" style="top:360px">
  <div class="row" style="font-size:96px">Wed Nov 18</div>
  <div class="rule"></div>
  <div class="row" style="font-size:96px"><span class="acc">${V.time}</span></div>
  <div class="mid soft" style="font-size:34px;margin-top:6px">Pacific time</div>
  <div class="rule"></div>
  <div class="row" style="font-size:58px;line-height:1.1">KPMG Exchange</div>
  <div class="mid soft" style="font-size:44px;margin-top:8px">175 4th St, San Francisco</div>
 </div>
 <div class="abs eyebrow" id="s5-c" style="top:1040px;font-size:32px;color:var(--soft)">Invitation only</div>`)}

${scene("s6", 33.3, 37, `
 <div class="abs huge" id="s6-a" style="top:340px;font-size:124px">Noelle<br>Russell</div>
 <div class="abs big acc" id="s6-b" style="top:670px;font-size:66px">Responsible AI that scales.</div>
 <div class="ph" id="s6-c" style="top:900px">[ ADD HANDLE / SITE HERE ]</div>`)}

${capHtml}

<audio id="vo" src="assets/voiceover.mp3" data-start="0" data-duration="35.84" data-track-index="8" data-volume="1"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
const up = (s,t,d=.55,y=70)=>tl.fromTo(s,{opacity:0,y:y},{opacity:1,y:0,duration:d,ease:"power4.out"},t);
const out = (s,t)=>tl.to(s,{opacity:0,y:-40,duration:.22,ease:"power2.in"},t);
// background motion (deterministic)
tl.fromTo("#r1",{rotation:-14},{rotation:22,duration:${DUR},ease:"none"},0);
tl.fromTo("#r2",{rotation:30},{rotation:-18,duration:${DUR},ease:"none"},0);
tl.fromTo("#b1",{x:0,y:0},{x:220,y:-260,duration:${DUR},ease:"none"},0);
tl.fromTo("#b2",{x:0,y:0},{x:-260,y:420,duration:${DUR},ease:"none"},0);
// S1 hook
tl.fromTo("#s1-a",{opacity:1,scale:.96},{opacity:1,scale:1,duration:.8,ease:"power3.out"},0); up("#s1-b",1.95,.5); out("#s1-in",5.22);
// S2 setting
up("#s2-a",5.6,.45,40); up("#s2-b",5.75,.6); out("#s2-a",7.75); out("#s2-b",7.75);
up("#s2-c",8.0,.6); up("#s2-d",8.45,.5); up("#s2-e",9.7,.5); out("#s2-in",10.95);
// S3 Noelle
up("#s3-a",11.3,.6); up("#s3-b",13.85,.5,40);
up("#s3-c1",16.9,.45,50); up("#s3-c2",19.55,.45,50); up("#s3-c3",20.9,.45,50); up("#s3-c4",22.1,.45,50);
out("#s3-in",23.5);
// S4 session
up("#s4-a",23.8,.5,40); up("#s4-b",24.2,.55);
up("#s4-4",25.9,.45,30); up("#s4-1",26.7,.45,50); up("#s4-2",27.8,.45,50); up("#s4-3",28.9,.45,50);
out("#s4-in",29.65);
// S5 details
up("#s5-a",30.05,.45,30); up("#s5-b",30.15,.6,90); up("#s5-c",30.9,.4,20); out("#s5-in",33.05);
// S6 close
up("#s6-a",33.4,.6); up("#s6-b",34.1,.55); up("#s6-c",34.6,.5,40);
${capJs}
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body>
</html>`;
fs.writeFileSync("index.html", html);
