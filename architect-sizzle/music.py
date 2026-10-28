import numpy as np, wave
SR=44100; DUR=40.0; N=int(SR*DUR); BPM=120; BEAT=60/BPM
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def tt(d): return np.arange(int(d*SR))/SR
def put(sig,start,g=1.0,pan=0.0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n<=0 or i<0: return
    l=g*np.cos((pan+1)*np.pi/4); r=g*np.sin((pan+1)*np.pi/4)
    L[i:i+n]+=sig[:n]*l; R[i:i+n]+=sig[:n]*r
def lp(x,n): 
    if n<=1: return x
    return np.convolve(x,np.ones(n)/n,mode='same')
def osc(f,d,harm=(1,)):
    t=tt(d); ph=2*np.pi*np.cumsum(np.broadcast_to(f,t.shape))/SR
    return sum(np.sin(h*ph)/h**0.8 for h in harm)
def kick(g=1): 
    t=tt(.35); f=45+90*np.exp(-t*28); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*g + 0.2*g*np.exp(-t*120)*rng.standard_normal(len(t))
def hat(d=.05): t=tt(d); n=np.diff(rng.standard_normal(len(t)+1)); return n*np.exp(-t*(70 if d<.1 else 25))
def clap():
    t=tt(.3); n=rng.standard_normal(len(t)); n=n-lp(n,6); e=np.exp(-t*18)+0.6*np.exp(-((t-.012)%.02)*0)*np.exp(-t*40); return n*e*0.9
def whoosh(d,up=True):
    t=tt(d); n=rng.standard_normal(len(t)); dark=lp(n,60); bright=n-lp(n,8)
    k=(t/d)**1.6; s=dark*(1-k)+bright*k*0.8; e=(t/d)**1.5*np.exp(-((t/d)**6)*0.0)
    e=np.minimum(1,t/d*1.0)**1.4*(1-np.clip((t-d*.88)/(d*.12),0,1)); return s*e*2.2
def pluck(f,d=.5,dec=14,harm=(1,2,3)): t=tt(d); return osc(f,d,harm)*np.exp(-t*dec)*np.minimum(1,t*400)
def ding(f,d=1.0,g=1): t=tt(d); return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2.76*t)+0.25*np.sin(2*np.pi*f*5.4*t))*np.exp(-t*5)*np.minimum(1,t*300)*g
def click(g=1): t=tt(.03); return np.diff(rng.standard_normal(len(t)+1))*np.exp(-t*220)*g
def sub(f=48,d=1.6): t=tt(d); return np.sin(2*np.pi*f*t*(1-0.12*(1-np.exp(-t*3))))*np.exp(-t*2.2)

chords=[(55.0,[220,261.63,329.63]),(43.65,[174.61,220,261.63]),(65.41,[261.63,329.63,392]),(49.0,[196,246.94,293.66])]
def ramp(t,a,b): return float(np.clip((t-a)/(b-a),0,1))

# --- layers on a bar grid ---
nb=int(DUR/ (BEAT*4))
pad=np.zeros(N); bass=np.zeros(N); arp=np.zeros(N); lead=np.zeros(N)
for bar in range(nb):
    t0=bar*4*BEAT; root,tones=chords[bar%4]; d=4*BEAT+0.4
    p=sum(osc(f*(1+dt),d,(1,2,3)) for f in tones for dt in (-0.004,0.004))*np.minimum(1,tt(d)/0.5)*np.clip(1-(tt(d)-4*BEAT)/0.4,0,1)
    i=int(t0*SR); n=min(len(p),N-i); pad[i:i+n]+=p[:n]*0.05
    for e in range(8):  # 8th bass
        tb=t0+e*BEAT/2; b=osc(root*2,.3,(1,2,3,4,5))*np.exp(-tt(.3)*7)*np.minimum(1,tt(.3)*300)
        i=int(tb*SR); n=min(len(b),N-i); bass[i:i+n]+=b[:n]*0.28
    for s in range(16):  # 16th arp
        pat=[0,1,2,1,2,1,0,1][s%8]; f=tones[pat]*2*(2 if s%8 in(3,7) else 1)
        a=pluck(f,.35,16); i=int((t0+s*BEAT/4)*SR); n=min(len(a),N-i); arp[i:i+n]+=a[:n]*0.11
    for q,(off,nt) in enumerate([(0,2),(2.5*BEAT,1)]):
        f=tones[nt]*4; a=pluck(f,1.0,3.5,(1,2)); i=int((t0+off)*SR); n=min(len(a),N-i); lead[i:i+n]+=a[:n]*0.10
T=np.arange(N)/SR
def env(pieces): # piecewise linear (t,v)
    xs,vs=zip(*pieces); return np.interp(T,xs,vs)
g_pad=env([(0,0),(1.5,.55),(4,.7),(9,.8),(15,.9),(21,.9),(33,.8),(36.8,1),(37.9,.9),(38.3,0)])
g_bass=env([(0,0),(8.99,0),(9.0,.9),(15,1),(32.9,1),(33.0,.8),(36.9,.5),(37.0,1),(38,.9)])
g_arp=env([(0,0),(4,0),(4.01,.35),(9,.5),(9.01,.8),(15,.95),(21,1),(33,.8),(36.5,1.1),(38,1)])
g_lead=env([(0,0),(20.99,0),(21.0,.9),(33,.9),(33.01,0),(36.99,0),(37,.8),(38,.7)])
# sidechain from kick (kicks start at 4, hits)
kicks=[t for t in np.arange(4,38.3,BEAT)]
sc=np.ones(N)
for kt in kicks:
    i=int(kt*SR); n=min(int(.4*SR),N-i); sc[i:i+n]=np.minimum(sc[i:i+n],1-0.62*np.exp(-np.arange(n)/SR/0.11))
bed=(pad*g_pad+bass*g_bass*1.0+arp*g_arp+lead*g_lead)*sc
# delay on arp/lead for width
dl=int(BEAT*.75*SR); wet=np.zeros(N); wet[dl:]=(arp*g_arp+lead*g_lead)[:-dl]*0.35; wet2=np.zeros(N); wet2[dl*2:]=wet[:-dl*2]*0.5
L+=bed+wet*0.9; R+=bed+wet2*1.4+np.roll(wet,int(.012*SR))*0.3
# drums
for kt in kicks:
    g=0.55*(0.5+0.5*ramp(kt,4,5.5))
    if kt>=36.9: g=0.9
    put(kick(1),kt,g)
for ht in np.arange(4+BEAT/2,38.3,BEAT): put(hat(.05),ht,0.07*(1+ramp(ht,4,9)),0.3)
for ht in np.arange(15,36.9,BEAT/4):
    if (ht-15)%BEAT>1e-6 and ht>=15: put(hat(.03),ht,0.025,-0.25)
for ct in np.arange(9+BEAT,36.9,BEAT*2): put(clap(),ct,0.34*(1.0 if ct>=15 else .75),0.0)
# riser 33-37 + snare roll
rt=tt(4.0); n=rng.standard_normal(len(rt)); k=(rt/4.0); riser=(lp(n,40)*(1-k)+(n-lp(n,5))*k)*(k**2.0)*0.9
put(riser,33,0.30,0.0)
rf=180*2**(rt/4.0*2.2); rp=np.sin(2*np.pi*np.cumsum(rf)/SR)*(k**2.5)*0.12; put(rp,33,1,0)
for s_t in np.concatenate([np.arange(35.0,36.0,.25),np.arange(36.0,36.75,.125),np.arange(36.75,37.0,.0625)]): put(clap(),s_t,0.28+0.3*ramp(s_t,35,37),0)
# the pre-hit micro-gap handled by envelope: duck 36.93-37.0 then hit
duck=np.ones(N); duck[(T>36.92)&(T<37.0)]=0.15
L*=duck; R*=duck
# impact at 37.0 (button) and 9.0 (gold sweep payoff handled by hit at 10.2?)
put(sub(48,1.4),37.0,0.9); put(kick(1),37.0,1.0); put(hat(.5),37.0,0.12,0); put(ding(1318.5,1.4,.35),37.0,0.28,0.2)
put(sub(52,1.2),9.0,0.6); put(sub(44,1.2),4.0,0.45); put(sub(52,1.0),0.15,0.35)
# cold-open: mark draw shimmer + heartbeat
for bt in [0.5,1.0,2.0,2.5,3.0]: put(kick(1),bt,0.18)
shim=osc(np.linspace(300,1400,int(1.6*SR)),1.6,(1,2))*np.sin(np.pi*np.linspace(0,1,int(1.6*SR)))**2*0.05; put(shim,0.15,1,0)
# transitions: whoosh ending at scene start
for s in [4,9,15,21,28,33,37]: put(whoosh(.55),s-0.5,0.20,0.0)
put(whoosh(.5),5.0,0.12,0.2); put(click(1)*3,6.05,0.2); put(whoosh(.18),6.0,0.12,-0.2)   # highlight + strike
# gold sweep (bar+label) 10.2-11.2 : rising chime
for i,f in enumerate([523.25,659.25,783.99,1046.5]): put(ding(f,1.2,1),10.25+i*0.22,0.16,-0.3+0.2*i)
# typing ticks
for i in range(16): put(click(1),11.0+i*(1.0/16),0.12,0)
for i in range(16): put(click(1),33.85+i*(0.7/16),0.10,0)
# checkbox tick (gold)
put(click(1)*2,12.3,0.3); put(ding(1567.98,1.0,1),12.33,0.20,0.2); put(ding(2093,.8,1),12.42,0.10,-0.2)
# node pops
for tb in [15.3,15.9,16.5,17.1,17.7,17.9]: put(pluck(660,.3,18,(1,2)) ,tb,0.16,0); put(sub(90,.25),tb,0.2)
for tb in [15.7,16.3,16.9,17.5]: put(whoosh(.2),tb-0.05,0.07,0)
for k in range(8): put(pluck(1760,.15,40,(1,)),17.1+k*0.6+ (k%2)*0.01,0.05,(-1)**k*0.4)
# emails
put(ding(987.77,1.2,1),21.9,0.30,-0.1); put(ding(1318.5,1.0,.7),21.98,0.20,0.1)
put(whoosh(.35),22.85,0.15,0)
for i,t0 in enumerate([24.4,24.85]): put(pluck(880*(1+i*.25),.3,20,(1,2)),t0,0.15,0)
for i in range(5): put(pluck(440*2**(i/5),.25,25,(1,2)),25.5+i*0.22,0.12,-0.3+0.15*i)
put(ding(1174.66,1.2,1),28.15,0.30,0.1); put(ding(1568,1.0,.7),28.23,0.18,-0.1); put(whoosh(.3),28.8,0.14,0)
for t0 in [29.4,29.8,30.2,30.6]: put(click(1)*2,t0,0.2); put(pluck(1318.5,.25,22,(1,2)),t0,0.10,0)
# airtable cells
for t0 in [34.7,35.15,35.6]: put(click(1)*2.5,t0,0.25); put(sub(110,.2),t0,0.25)
put(ding(1567.98,1.2,1),36.1,0.25,0); put(ding(2093,1.0,1),36.18,0.14,0.2); put(sub(80,.5),36.4,0.3)
# master: duck to silence for the final card; fade at start
m=np.ones(N); m[T>=37.95]=np.clip(1-(T[T>=37.95]-37.95)/0.33,0,1)
m*=np.minimum(1,T/0.03); L*=m; R*=m
# soft clip + normalize
st=np.stack([L,R],1); st=np.tanh(st*1.1)/np.tanh(1.1); st=st/np.max(np.abs(st))*0.89
pcm=(st*32767).astype('<i2')
with wave.open('music_raw.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
