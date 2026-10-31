const { chromium } = require('playwright'); const fs=require('fs');
const ease = t => t*t*t*(t*(t*6-15)+10);
class Rec {
  constructor(page, name, take){ this.p=page; this.name=name; this.dir=`frames/${name}_t${take}`; fs.rmSync(this.dir,{recursive:true,force:true}); fs.mkdirSync(this.dir,{recursive:true}); this.f=0; this.events=[]; this.cx=270; this.cy=480; }
  async snap(){ await this.p.screenshot({path:`${this.dir}/${String(this.f++).padStart(5,'0')}.jpg`,type:'jpeg',quality:92}); }
  async hold(n){ for(let i=0;i<n;i++) await this.snap(); }
  async scrollTo(y,n){ const y0=await this.p.evaluate(()=>window.scrollY); for(let i=1;i<=n;i++){ await this.p.evaluate(v=>window.scrollTo(0,v), y0+(y-y0)*ease(i/n)); await this.snap(); } }
  async scrollEl(loc,top,n){ const y=await loc.evaluate((e,t)=>e.getBoundingClientRect().top+window.scrollY-t,top); await this.scrollTo(Math.max(0,y),n); }
  async tap(loc,{lead=14,after=10,kind='tap'}={}){ // glide cursor, ring, click
    const bb=await loc.boundingBox(); const x=bb.x+bb.width/2, y=bb.y+Math.min(bb.height/2,40);
    for(let i=1;i<=lead;i++){ const t=ease(i/lead); await this.p.mouse.move(this.cx+(x-this.cx)*t, this.cy+(y-this.cy)*t); await this.snap(); }
    this.cx=x; this.cy=y; this.events.push({f:this.f,x,y,w:bb.width,h:bb.height,kind});
    await loc.click({force:true}); await this.hold(after); }
  async type(loc,text,per=2){ await loc.pressSequentially('',{}); for(const ch of text){ await loc.pressSequentially(ch); await this.hold(per);} }
  save(){ fs.writeFileSync(`${this.dir}/events.json`,JSON.stringify({frames:this.f,events:this.events})); console.log('saved',this.dir,this.f,'frames'); }
}
async function ctx(){ const b=await chromium.launch(); const c=await b.newContext({viewport:{width:540,height:960},deviceScaleFactor:2,isMobile:true,hasTouch:false}); const p=await c.newPage(); p.setDefaultTimeout(10000); return {b,p}; }
// shared: landing -> search -> profile, recorded
async function flow(r, state, q, name, {settle=45}={}){
  const p=r.p;
  const st=p.locator('#lookup-name-state'); await r.scrollEl(st,330,40);
  await r.tap(st); await r.type(st,state,2); await r.hold(8);
  await r.tap(p.locator('[role=option]').first(),{after:8});
  const nm=p.getByPlaceholder("Official's name"); await r.tap(nm); await r.type(nm,q,3); await p.waitForTimeout(800); await r.hold(14);
  const row=p.locator('button:visible,a:visible',{hasText:name}).first();
  await r.scrollEl(row,420,24); await r.tap(row,{after:10});
  await p.waitForSelector('h1'); await r.scrollTo(0,26); await r.hold(settle);
}
module.exports={Rec,ctx,flow,ease};
