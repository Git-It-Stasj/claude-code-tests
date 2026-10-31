import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Palette pulled from said-and-done.com (light + dark themes)
const C = {bg:'#111214', bg2:'#1C1817', ink:'#EDEBE7', gold:'#F2B84A', cream:'#FAF6F0', amber:'#A86C12', dark:'#15171A'};
const SERIF = 'Fraunces, Georgia, serif';
const SANS = '"Public Sans", system-ui, sans-serif';

const CARD = {x:40, y:330, w:1000, h:1030};
const S = CARD.w / 1080;

type Part = {srcStart:number; rate:number; dur:number};
type Evt = {f:number; x:number; y:number; w:number; h:number};
type Seg = {id:string; clip:string; from:number; dur:number; parts:Part[]; offY:[number,number][]; events:Evt[]; pop?:{at:number; fx:number; fy:number; z:number}};

const ev = (f:number,x:number,y:number,w:number,h:number):Evt => ({f,x:x*2,y:y*2,w:w*2,h:h*2});

const SEGS: Seg[] = [
  {id:'land', clip:'land', from:90, dur:120, parts:[{srcStart:0, rate:1.4, dur:120}], offY:[[0,0]], events:[]},
  {id:'ca', clip:'ca_flow', from:210, dur:180, parts:[{srcStart:12, rate:1.6, dur:180}],
   offY:[[0,0],[22,380],[118,380],[156,430]],
   events:[ev(66,270,354,456,48),ev(118,270,403,456,44),ev(140,270,410,456,48),ev(220,270,442,456,40)],
   pop:{at:146, fx:500, fy:640, z:1.14}},
  {id:'money', clip:'peters_money', from:390, dur:70, parts:[{srcStart:36, rate:2, dur:70}], offY:[[0,150]],
   events:[ev(50,437,222,166,36),ev(144,270,410,456,44)]},
  {id:'votes', clip:'donalds_votes', from:460, dur:70, parts:[{srcStart:44, rate:2.4, dur:70}], offY:[[0,100]],
   events:[ev(50,270,222,166,36),ev(140,100,322,140,36)]},
  {id:'stances', clip:'kiggans_stances', from:530, dur:70, parts:[{srcStart:20, rate:2.4, dur:70}], offY:[[0,150]],
   events:[ev(88,382,303,100,32)]},
  {id:'fl', clip:'fl_flow', from:600, dur:75, parts:[{srcStart:10, rate:4.6, dur:45},{srcStart:215, rate:2.2, dur:30}],
   offY:[[0,0],[8,380],[36,380],[52,430]],
   events:[ev(62,270,354,456,48),ev(108,270,403,456,44),ev(130,270,410,456,48),ev(213,270,442,456,40)]},
  {id:'va', clip:'va_flow', from:675, dur:75, parts:[{srcStart:10, rate:4.6, dur:45},{srcStart:217, rate:2.2, dur:30}],
   offY:[[0,0],[8,380],[36,380],[52,430]],
   events:[ev(62,270,354,456,48),ev(110,270,403,456,44),ev(132,270,410,456,48),ev(215,270,442,456,40)]},
];

const mapEvt = (seg:Seg, f:number) => {
  let start = 0;
  for (const p of seg.parts) {
    const end = p.srcStart + p.dur * p.rate;
    if (f <= end || p === seg.parts[seg.parts.length-1]) return start + (f - p.srcStart) / p.rate;
    start += p.dur;
  }
  return 0;
};

const Ring: React.FC<{t:number; e:Evt}> = ({t, e}) => {
  const a = t + 8; // frames since ring start
  if (a < 0 || a > 30) return null;
  const grow = interpolate(a, [8, 28], [0.35, 1.7], {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing:Easing.out(Easing.cubic)});
  const op = interpolate(a, [0, 6, 12, 30], [0, 1, 0.9, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const glow = interpolate(a, [0, 8, 12], [0, 1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const pad = 10;
  return (
    <>
      <div style={{position:'absolute', left:e.x-e.w/2-pad, top:e.y-Math.min(e.h/2,40)-pad+Math.min(e.h/2,40)-e.h/2, width:e.w+pad*2, height:e.h+pad*2, borderRadius:14, border:`6px solid ${C.gold}`, boxShadow:`0 0 40px 8px ${C.gold}`, opacity:glow*0.9}} />
      <div style={{position:'absolute', left:e.x-70, top:e.y-70, width:140, height:140, borderRadius:70, border:`8px solid ${C.gold}`, opacity:op, transform:`scale(${grow})`, boxShadow:`0 0 30px ${C.gold}`}} />
      <div style={{position:'absolute', left:e.x-18, top:e.y-18, width:36, height:36, borderRadius:18, background:C.gold, opacity:op, boxShadow:'0 0 0 6px rgba(17,18,20,.55)'}} />
    </>
  );
};

const SegmentView: React.FC<{seg:Seg}> = ({seg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ks = seg.offY.length>1 ? seg.offY : [[0,seg.offY[0][1]],[1,seg.offY[0][1]]];
  const offY = interpolate(f, ks.map(k=>k[0]), ks.map(k=>k[1]), {easing:Easing.inOut(Easing.cubic), extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  let z = 1, zx = 500, zy = 300;
  if (seg.pop) { const s = spring({frame:f-seg.pop.at, fps, config:{damping:13, stiffness:170, mass:0.7}}); z = 1 + (seg.pop.z-1)*s; zx = seg.pop.fx; zy = seg.pop.fy; }
  const enter = spring({frame:f, fps, config:{damping:16, stiffness:200}});
  const sc = 0.94 + 0.06*enter, ty = (1-enter)*40;
  const flash = interpolate(f, [0, 6], [0.6, 0], {extrapolateRight:'clamp'});
  let outStart = 0;
  return (
    <AbsoluteFill>
      <div style={{position:'absolute', left:CARD.x, top:CARD.y, width:CARD.w, height:CARD.h, borderRadius:30, overflow:'hidden', border:`4px solid ${C.gold}`, boxShadow:'0 30px 90px rgba(0,0,0,.6)', transform:`translateY(${ty}px) scale(${sc})`, background:C.cream}}>
        <div style={{position:'absolute', inset:0, transformOrigin:`${zx}px ${zy}px`, transform:`scale(${z})`}}>
          <div style={{position:'absolute', left:0, top:0, width:1080, height:1920, transformOrigin:'0 0', transform:`translateY(${-offY*S}px) scale(${S})`}}>
            {seg.parts.map((p,i)=>{ const st = outStart; outStart += p.dur; return (
              <Sequence key={i} from={st} durationInFrames={p.dur}>
                <OffthreadVideo src={staticFile(`clips/${seg.clip}.mp4`)} startFrom={p.srcStart} playbackRate={p.rate} muted style={{width:1080, height:1920}} />
              </Sequence>); })}
            {seg.events.map((e,i)=> <Ring key={i} t={f-mapEvt(seg,e.f)} e={e} />)}
          </div>
        </div>
      </div>
      <AbsoluteFill style={{background:C.cream, opacity:flash, pointerEvents:'none'}} />
    </AbsoluteFill>
  );
};

type Cap = {from:number; to:number; lines:React.ReactNode[]};
const hl = (t:string) => <span style={{color:C.gold}}>{t}</span>;
const CAPS: Cap[] = [
  {from:96, to:208, lines:['What they said', <>vs. {hl('what they did.')}</>]},
  {from:216, to:388, lines:[<>Pick your {hl('state.')}</>, <>Pick your {hl('rep.')}</>]},
  {from:392, to:458, lines:[<>See {hl('who funds')} them.</>]},
  {from:462, to:528, lines:[<>See {hl('how they voted.')}</>]},
  {from:532, to:598, lines:[<>See {hl('where they stand.')}</>]},
  {from:602, to:748, lines:[<>Same steps. {hl('Every state.')}</>]},
];
type Lab = {from:number; to:number; text:string};
const LABS: Lab[] = [
  {from:96, to:208, text:'said-and-done.com'},
  {from:216, to:340, text:'California'},
  {from:340, to:388, text:'Scott H. Peters · California · Democrat'},
  {from:392, to:458, text:'Scott H. Peters · California · Democrat'},
  {from:462, to:528, text:'Byron Donalds · Florida · Republican'},
  {from:532, to:598, text:'Jennifer A. Kiggans · Virginia · Republican'},
  {from:602, to:644, text:'Florida'},
  {from:644, to:673, text:'Byron Donalds · Florida · Republican'},
  {from:677, to:720, text:'Virginia'},
  {from:720, to:748, text:'Jennifer A. Kiggans · Virginia · Republican'},
];

const Caption: React.FC<{c:Cap}> = ({c}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const n = c.lines.length;
  const out = interpolate(f, [c.to-c.from-4, c.to-c.from], [1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <div style={{position:'absolute', left:40, width:1000, top:1385, height:190, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', opacity:out}}>
      {c.lines.map((l,i)=>{ const s = spring({frame:f-i*4, fps, config:{damping:14, stiffness:210, mass:0.6}});
        return <div key={i} style={{fontFamily:SERIF, fontWeight:600, fontSize:n>1?74:82, lineHeight:1.08, color:C.ink, textAlign:'center', transform:`scale(${0.85+0.15*s}) translateY(${(1-s)*26}px)`, opacity:s, textShadow:'0 4px 24px rgba(0,0,0,.55)', letterSpacing:-0.5}}>{l}</div>; })}
    </div>
  );
};
const Label: React.FC<{l:Lab; url?:boolean}> = ({l}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, l.to-l.from-3, l.to-l.from], [0, 1, 1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const isUrl = l.text.includes('.com');
  return (
    <div style={{position:'absolute', left:40, width:1000, top:262, height:54, display:'flex', justifyContent:'center', alignItems:'center', opacity:o}}>
      <div style={{fontFamily:SANS, fontWeight:700, fontSize:isUrl?36:32, letterSpacing:isUrl?1:0.5, color:isUrl?C.dark:C.gold, background:isUrl?C.gold:'rgba(242,184,74,.12)', border:`2px solid ${C.gold}`, borderRadius:999, padding:'8px 28px', whiteSpace:'nowrap'}}>{l.text}</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const a = spring({frame:f, fps, config:{damping:14, stiffness:140}});
  const b = spring({frame:f-48, fps, config:{damping:13, stiffness:150}});
  const showA = f < 48;
  const fadeA = interpolate(f, [40, 48], [1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const s = showA ? a : b; const o = showA ? fadeA : 1;
  const bar = interpolate(showA ? f : f-48, [6, 30], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing:Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', opacity:o}}>
      <div style={{width:900, textAlign:'center', transform:`scale(${0.9+0.1*s}) translateY(${(1-s)*30}px)`, opacity:Math.min(1, s*1.4)}}>
        {showA
          ? <div style={{fontFamily:SERIF, fontWeight:600, fontSize:132, lineHeight:1.05, color:C.ink}}>Politicians make <span style={{color:C.gold}}>promises.</span></div>
          : <div style={{fontFamily:SERIF, fontWeight:600, fontSize:140, lineHeight:1.05, color:C.ink}}>Did they <span style={{color:C.gold}}>keep</span> them?</div>}
        <div style={{margin:'44px auto 0', height:10, width:360*bar, background:C.gold, borderRadius:5}} />
      </div>
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s1 = spring({frame:f, fps, config:{damping:13, stiffness:150}});
  const s2 = spring({frame:f-14, fps, config:{damping:14, stiffness:160}});
  const s3 = spring({frame:f-30, fps, config:{damping:12, stiffness:170}});
  const s4 = spring({frame:f-50, fps, config:{damping:20, stiffness:120}});
  const pop = (s:number) => ({opacity:Math.min(1,s*1.5), transform:`scale(${0.88+0.12*s}) translateY(${(1-s)*34}px)`});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{width:960, textAlign:'center', marginTop:-40}}>
        <div style={{...pop(s1), fontFamily:SERIF, fontWeight:600, fontSize:158, lineHeight:1, color:C.ink}}>Said <span style={{color:C.gold}}>vs.</span> Done.</div>
        <div style={{...pop(s2), fontFamily:SERIF, fontWeight:600, fontSize:78, lineHeight:1.1, color:C.ink, marginTop:44}}>Check before you vote.</div>
        <div style={{...pop(s3), display:'inline-block', marginTop:70, background:C.gold, color:C.dark, fontFamily:SANS, fontWeight:700, fontSize:88, padding:'26px 56px', borderRadius:26, boxShadow:'0 0 60px rgba(242,184,74,.35)'}}>said-and-done.com</div>
        <div style={{...pop(s4), fontFamily:SANS, fontWeight:600, fontSize:34, color:'rgba(237,235,231,.78)', marginTop:46, letterSpacing:0.5}}>Nonpartisan · Public records · Check the record yourself</div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 4], [0, 1], {extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 38%, ${C.bg2} 0%, ${C.bg} 70%)`, opacity:fadeIn}}>
      <style>{`@font-face{font-family:Fraunces;src:url(${staticFile('fonts/fraunces.woff2')}) format('woff2');font-weight:100 900;}@font-face{font-family:"Public Sans";src:url(${staticFile('fonts/publicsans.woff2')}) format('woff2');font-weight:100 900;}`}</style>
      <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
      {SEGS.map(s => <Sequence key={s.id} from={s.from} durationInFrames={s.dur}><SegmentView seg={s} /></Sequence>)}
      {LABS.map((l,i) => <Sequence key={i} from={l.from} durationInFrames={l.to-l.from}><Label l={l} /></Sequence>)}
      {CAPS.map((c,i) => <Sequence key={i} from={c.from} durationInFrames={c.to-c.from}><Caption c={c} /></Sequence>)}
      <Sequence from={750} durationInFrames={150}><CTA /></Sequence>
    </AbsoluteFill>
  );
};
