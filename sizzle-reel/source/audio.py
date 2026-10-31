import numpy as np, wave
SR=44100; D=30.0; N=int(SR*D); rng=np.random.default_rng(7)
t=np.arange(N)/SR
L=np.zeros(N); R=np.zeros(N)
def add(sig,start,gain=1.0,pan=0.0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n<=0: return
    L[i:i+n]+=sig[:n]*gain*(1-max(0,pan)); R[i:i+n]+=sig[:n]*gain*(1+min(0,pan))
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    if na>0: e[:na]=np.linspace(0,1,na)
    if nr>0: e[-nr:]=np.minimum(e[-nr:],np.linspace(1,0,nr))
    return e
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
def hp(x,fc): return x-lp(x,fc)
def midi(m): return 440*2**((m-69)/12)
def saw(f,n,det=0.0):
    tt=np.arange(n)/SR; return 2*((tt*f*(1+det))%1)-1
bpm=100; beat=60/bpm
chords=[[57,60,64],[53,57,60],[48,55,60],[55,59,62]]  # Am F C G
bass_root=[33,29,36,31]
bar=4*beat
# pads (whole piece, swelling)
for b in range(int(D/bar)+1):
    c=chords[b%4]; st=b*bar; n=int(bar*SR*1.05)
    pad=sum(saw(midi(m),n,d) for m in c for d in(-0.004,0.004))/6
    pad=lp(pad,900+ 1800*min(1,st/22))
    amp=0.10+0.10*min(1,st/20)
    add(pad*env(n,0.25,0.4),st,amp)
# bass from 3s: eighth pulse
def kick():
    n=int(0.28*SR); tt=np.arange(n)/SR; f=45+110*np.exp(-tt*28); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)
def hat(o=False):
    n=int((0.18 if o else 0.05)*SR); x=hp(rng.standard_normal(n),6000); return x*np.exp(-np.arange(n)/SR*(18 if o else 70))
def snare():
    n=int(0.2*SR); tt=np.arange(n)/SR; x=hp(rng.standard_normal(n),1500)*np.exp(-tt*22)+np.sin(2*np.pi*190*tt)*np.exp(-tt*30)*0.5; return x
k=kick(); h=hat(); ho=hat(True); sn=snare()
for i in range(int(D/beat)):
    st=i*beat; b=int(st//bar)%4
    if 3.0<=st<27.0:
        add(k,st,0.55)
        n=int(beat*0.5*SR); f=midi(bass_root[b])
        for j in (0,1):
            tt=np.arange(n)/SR; add(np.sin(2*np.pi*f*tt)*np.exp(-tt*5)+0.3*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*8),st+j*beat/2,0.28)
    if 7.0<=st<27.0:
        add(h,st+beat/2,0.16,0.3)
        if i%2==1: add(sn,st,0.22)
    if 13.0<=st<27.0: add(h,st+beat/4,0.07,-0.3); add(h,st+3*beat/4,0.07,0.3)
    if 20.0<=st<27.0 and i%2==0: add(ho,st+beat/2,0.1)
# arp from 13s
for i in range(int((27-13)/(beat/2))):
    st=13+i*beat/2; b=int(st//bar)%4; c=chords[b]
    m=c[[0,1,2,1][i%4]]+12; n=int(0.3*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*midi(m)*tt)*np.exp(-tt*9)*0.5+np.sin(2*np.pi*midi(m)*2*tt)*np.exp(-tt*14)*0.15,st,0.16,0.4 if i%2 else -0.4)
# hook: sparse low pulses 0-3s
for st in (0.0,1.6):
    n=int(1.4*SR); tt=np.arange(n)/SR; add(np.sin(2*np.pi*midi(33)*tt)*np.exp(-tt*2.2),st,0.35)
# whooshes on cuts
def whoosh(dur=0.5,up=True):
    n=int(dur*SR); x=rng.standard_normal(n); tt=np.linspace(0,1,n)
    out=np.zeros(n); 
    y=lp(x,2500); y=hp(y,300)
    e=np.sin(np.pi*tt)**2
    return y*e
cuts=[48,90,210,390,460,530,600,675]
for fr in cuts:
    w=whoosh(0.42); add(w,fr/30-0.24,0.9,0.0)
# riser into CTA
n=int(2.6*SR); x=rng.standard_normal(n); tt=np.linspace(0,1,n); r=hp(lp(x,6000),400)*(tt**2.2); add(r,22.4,0.35)
# click on taps
taps=[244,276,290,340,397,444,462,500,558,611,621,626,644,686,697,701,720]
def click():
    n=int(0.05*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*1800*tt)+0.5*np.sin(2*np.pi*3100*tt))*np.exp(-tt*110)
cl=click()
for fr in taps: add(cl,fr/30,0.28,0.2)
# CTA impact at 25.0 + sustained chord
n=int(2.0*SR); tt=np.arange(n)/SR; imp=np.sin(2*np.pi*(38+60*np.exp(-tt*8))*tt)*np.exp(-tt*3)+lp(rng.standard_normal(n),900)*np.exp(-tt*6)*0.5
add(imp,25.0,0.7)
c=[57,60,64,69]; n=int(5*SR); pad=sum(saw(midi(m),n,d) for m in c for d in(-0.003,0.003))/8; pad=lp(pad,2600)
add(pad*env(n,0.05,2.5),25.0,0.25)
# master: normalize, fade out 27.6->30, short fade-in
m=np.max(np.abs(np.concatenate([L,R]))); L/=m; R/=m; L*=0.85; R*=0.85
fo=np.ones(N); i0=int(27.6*SR); fo[i0:]=np.linspace(1,0,N-i0)**1.5; fi=np.minimum(1,t/0.05)
L*=fo*fi; R*=fo*fi
pcm=(np.stack([L,R],1)*32767).astype('<i2')
with wave.open('music.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
