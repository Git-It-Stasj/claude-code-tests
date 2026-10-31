const {Rec,ctx,flow}=require('./harness'); const w=process.argv[2], take=process.argv[3]||1;
(async()=>{ const {b,p}=await ctx();
 await p.goto('https://said-and-done.com',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
 if(w==='land'){ const r=new Rec(p,'land',take); await r.hold(36); await r.scrollTo(520,110); await r.hold(30); r.save(); }
 if(w==='fl'){ const r=new Rec(p,'fl_flow',take); await r.hold(8); await flow(r,'Florida','Donalds','Byron Donalds',{settle:36}); r.save(); }
 if(w==='va'){ const r=new Rec(p,'va_flow',take); await r.hold(8); await flow(r,'Virginia','Kiggans','Jennifer A. Kiggans',{settle:36}); r.save(); }
 await b.close(); })();
