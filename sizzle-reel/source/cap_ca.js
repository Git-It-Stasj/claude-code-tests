const {Rec,ctx,flow}=require('./harness');
(async()=>{ const take=process.argv[2]||1; const {b,p}=await ctx();
  await p.goto('https://said-and-done.com',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
  const r=new Rec(p,'ca_flow',take); await r.hold(12); await flow(r,'California','Peters','Scott H. Peters'); r.save();
  console.log(p.url()); await b.close(); })();
