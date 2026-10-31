const {Rec,ctx}=require('./harness');
const which=process.argv[2], take=process.argv[3]||1;
const tabBtn=(p,n)=>p.locator('button:visible,[role=tab]:visible').filter({hasText:new RegExp('^'+n+'$')}).first();
const topic=(p,n)=>p.locator('button:visible').filter({hasText:new RegExp('^'+n+'$')}).first();
const text=async p=>(await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' / ');
(async()=>{ const {b,p}=await ctx();
 if(which==='money'){
  await p.goto('https://said-and-done.com/preview/profile/scott-h-peters-d076be',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const r=new Rec(p,'peters_money',take); const tb=tabBtn(p,'Backing');
  await r.scrollEl(tb,200,30); await r.hold(6); await r.tap(tb,{after:20});
  await r.scrollEl(p.locator('h2',{hasText:'money picture'}),110,36); await r.hold(24);
  const ex=p.locator('summary:visible,button:visible').filter({hasText:/Donations by size/}).first();
  if(await ex.count()){ await r.tap(ex,{after:30}); }
  await r.scrollTo(await p.evaluate(()=>window.scrollY+420),50); await r.hold(24);
  const org=p.locator('summary:visible,button:visible').filter({hasText:/Organizations/}).first();
  if(await org.count()){ await r.scrollEl(org,360,40); await r.tap(org,{after:30}); await r.hold(20);}
  r.save(); console.log((await text(p)).slice(0,1800));
 }
 if(which==='votes'){
  await p.goto('https://said-and-done.com/preview/profile/byron-donalds-c5b77c',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const r=new Rec(p,'donalds_votes',take); const tb=tabBtn(p,'Record');
  await r.scrollEl(tb,200,30); await r.hold(6); await r.tap(tb,{after:20});
  await r.scrollEl(p.locator('h2',{hasText:'Votes in the news'}),110,44); await r.hold(12);
  await r.tap(topic(p,'Child safety online'),{after:30}); await r.scrollTo(await p.evaluate(()=>window.scrollY+380),50); await r.hold(30);
  r.save(); console.log((await text(p)).slice(0,1800));
 }
 if(which==='stances'){
  await p.goto('https://said-and-done.com/preview/profile/jennifer-a-kiggans-02e553',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const r=new Rec(p,'kiggans_stances',take);
  await r.scrollEl(p.locator('h2',{hasText:'Their platform'}),150,60); await r.hold(14);
  console.log('topics:',await p.locator('button:visible').allInnerTexts());
  const t=topic(p,'Healthcare'); const t2=(await t.count())?t:topic(p,'General economy');
  await r.tap(t2,{after:30}); await r.scrollTo(await p.evaluate(()=>window.scrollY+380),50); await r.hold(30);
  r.save(); console.log((await text(p)).slice(0,1800));
 }
 await b.close(); })();
