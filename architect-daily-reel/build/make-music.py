# Original synthesized ambient bed for the reel (numpy only, no samples, no licensing). 37 s, stereo.
import numpy as np, wave, sys
SR=44100; DUR=37.0; N=int(SR*DUR); t=np.arange(N)/SR
rng=np.random.default_rng(2810)
BPM=96; beat=60/BPM; bar=4*beat
mid=lambda m:440*2**((m-69)/12)
prog=[(57,[57,60,64]),(53,[53,57,60]),(48,[48,52,55]),(55,[55,59,62])]  # Am F C G
L=np.zeros(N); R=np.zeros(N)
def add(sig,start,pan=0.0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n<=0: return
    L[i:i+n]+=sig[:n]*(1-max(pan,0)); R[i:i+n]+=sig[:n]*(1+min(pan,0))
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    e[:na]=np.linspace(0,1,na)**2; e[-nr:]*=np.linspace(1,0,nr)**2; return e
nb=int(np.ceil(DUR/bar))
for b in range(nb):
    root,tri=prog[b%4]; s=b*bar; n=int((bar+1.2)*SR); tt=np.arange(n)/SR
    # pad: detuned soft stacked voices, few harmonics
    pad=np.zeros(n)
    for m in tri+[tri[0]+12]:
        f=mid(m)
        for d in (-0.15,0.15):
            ph=2*np.pi*f*(1+d/100)*tt
            pad+=np.sin(ph)+0.35*np.sin(2*ph)+0.12*np.sin(3*ph)
    pad*=env(n,0.9,1.1)*0.045
    add(pad,s,-0.25); add(pad[::-1][::-1]*0.9,s+0.012,0.25)
    # sub bass
    bn=int((bar+0.3)*SR); bt=np.arange(bn)/SR
    add(np.sin(2*np.pi*mid(root-12)*bt)*env(bn,0.08,0.4)*0.22,s)
# plucks (arp) rise through the news scenes, thin out for the close
step=beat/2
k=0; tm=4.0
while tm<33.9:
    b=int(tm//bar); root,tri=prog[b%4]
    notes=tri+[tri[0]+12,tri[1]+12,tri[2]+12,tri[1]+12]
    m=notes[k%len(notes)]+ (12 if (k//8)%2 else 0)
    amp=0.05+0.07*np.clip((tm-4)/17,0,1)
    if tm>=30: amp*=0.45   # cursor/typing: pull back
    n=int(0.9*SR); tt=np.arange(n)/SR; f=mid(m)
    p=(np.sin(2*np.pi*f*tt)+0.4*np.sin(4*np.pi*f*tt)*np.exp(-tt*6))*np.exp(-tt*5.5)*amp
    add(p,tm,0.45*np.sin(k*1.3)); tm+=step; k+=1
# soft pulse on beats from 10 s to 30 s
tm=10.0
while tm<30.0:
    n=int(0.3*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*(52+40*np.exp(-tt*30))*tt)*np.exp(-tt*11)*0.14,tm); tm+=beat
# airy noise swell into the close lockup
sw=rng.standard_normal(N); k2=np.ones(400)/400; sw=np.convolve(sw,k2,'same')
sw*=np.interp(t,[0,30,33.8,34.6,37],[0,0,0,0.5,0.1])*0.02; L+=sw; R+=sw[::-1]
fade=np.minimum(1,t/1.2)*np.minimum(1,(DUR-t)/1.8)
L*=fade; R*=fade
st=np.stack([L,R],1); st=st/np.max(np.abs(st))*0.9
pcm=(st*32767).astype('<i2')
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
