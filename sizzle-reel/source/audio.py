import numpy as np, wave
SR=44100; D=44.5; N=int(SR*D); rng=np.random.default_rng(7)
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
    if 3.5<=st<39.0:
        add(k,st,0.55)
        n=int(beat*0.5*SR); f=midi(bass_root[b])
        for j in (0,1):
            tt=np.arange(n)/SR; add(np.sin(2*np.pi*f*tt)*np.exp(-tt*5)+0.3*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*8),st+j*beat/2,0.28)
    if 8.0<=st<39.0:
        add(h,st+beat/2,0.09,0.3)
        if i%2==1: add(sn,st,0.22)
    if 16.5<=st<39.0: add(h,st+beat/4,0.04,-0.3); add(h,st+3*beat/4,0.04,0.3)
    if 27.0<=st<39.0 and i%2==0: add(ho,st+beat/2,0.05)
# arp from 13s
for i in range(int((39-16.5)/(beat/2))):
    st=16.5+i*beat/2; b=int(st//bar)%4; c=chords[b]
    m=c[[0,1,2,1][i%4]]+12; n=int(0.3*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*midi(m)*tt)*np.exp(-tt*9)*0.5+np.sin(2*np.pi*midi(m)*2*tt)*np.exp(-tt*14)*0.15,st,0.16,0.4 if i%2 else -0.4)
# hook: sparse low pulses 0-3s
for st in (0.0,1.83):
    n=int(1.4*SR); tt=np.arange(n)/SR; add(np.sin(2*np.pi*midi(33)*tt)*np.exp(-tt*2.2),st,0.35)
# soft transition swells (tonal, quiet) instead of noise whooshes
def swell(dur=0.45):
    n=int(dur*SR); tt=np.arange(n)/SR; f=260+520*(tt/dur)**1.5
    ph=2*np.pi*np.cumsum(f)/SR; e=np.sin(np.pi*np.linspace(0,1,n))**2
    return (np.sin(ph)+0.35*np.sin(2*ph))*e
cuts=[55,105,240,495,630,765,900,1035]
for fr in cuts: add(swell(),fr/30-0.25,0.10,0.0)
# tonal riser into CTA
n=int(2.8*SR); tt=np.arange(n)/SR; f=220+880*(tt/2.8)**2; ph=2*np.pi*np.cumsum(f)/SR
add((np.sin(ph)+0.4*np.sin(2*ph))*(tt/2.8)**1.8*0.5,36.2,0.10)
# soft ticks on taps
taps=[283,325,342,406,506,581,634,690,815,920,938,946,978,1055,1073,1082,1114]
def click():
    n=int(0.07*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*900*tt)+0.4*np.sin(2*np.pi*1350*tt))*np.exp(-tt*55)
cl=click()
for fr in taps: add(cl,fr/30,0.10,0.2)
# CTA impact at 25.0 + sustained chord
n=int(2.0*SR); tt=np.arange(n)/SR; imp=np.sin(2*np.pi*(38+60*np.exp(-tt*8))*tt)*np.exp(-tt*3)+lp(rng.standard_normal(n),900)*np.exp(-tt*6)*0.5
add(imp,39.0,0.6)
c=[57,60,64,69]; n=int(5.5*SR); pad=sum(saw(midi(m),n,d) for m in c for d in(-0.003,0.003))/8; pad=lp(pad,2600)
add(pad*env(n,0.05,2.5),39.0,0.25)
# master: normalize, fade out 27.6->30, short fade-in
m=np.max(np.abs(np.concatenate([L,R]))); L/=m; R/=m; L*=0.85; R*=0.85
fo=np.ones(N); i0=int(42.0*SR); fo[i0:]=np.linspace(1,0,N-i0)**1.5; fi=np.minimum(1,t/0.05)
L*=fo*fi; R*=fo*fi
pcm=(np.stack([L,R],1)*32767).astype('<i2')
with wave.open('music2.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
