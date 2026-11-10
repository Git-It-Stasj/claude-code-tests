"""Builds the final 30 s mix: ElevenLabs music take A + ElevenLabs SFX placed on the 128 BPM grid.
Beat n is at 0.0202 + n*0.46875 s (fitted from the music itself)."""
import subprocess, json, os
LASER = os.environ.get("LASER", "slamD-dataswoosh")    # sound on text slams / transitions
ALARM = os.environ.get("ALARM", "alarmA-2")    # sound on the AND / breach alert
OUT = os.environ.get("OUT", "assets/media/mix.m4a")
B, T0 = 0.46875, 0.0202
t = lambda n: T0 + n*B
ev = []  # (file, time, gain_dB, pre_roll)
for n in (8, 10, 13, 48, 56, 59):            ev.append((LASER, t(n), -6.9, 0.06))   # approved: data swoosh, ~10% quieter than first pass
for n in range(17, 24):                  ev.append(('tick-B', t(n), 0, 0.02))
for n in [56.5 + k*0.25 for k in range(8)]: ev.append(('tick-B', t(n), -2, 0.02))   # countdown ticks
ev.append((ALARM, t(28.5), -6, 0.02))
ev += [('impact-B', t(32), -4, 0.03), ('impact-B', t(40), -3, 0.03), ('impact-B', t(62), -8, 0.03)]
inputs = ['-i', 'audio/src/music-A.mp3']; fl = []
for i, (f, tt, g, pre) in enumerate(ev, 1):
    inputs += ['-i', f'audio/src/{f}.mp3']
    d = max(0, int(round((tt - pre) * 1000)))
    fl.append(f'[{i}:a]aresample=48000,volume={g}dB,adelay={d}|{d}[e{i}]')
fl.append('[0:a]aresample=48000,volume=0dB[m]')
fl.append('[m]' + ''.join(f'[e{i}]' for i in range(1, len(ev)+1)) + f'amix=inputs={len(ev)+1}:normalize=0:duration=first,atrim=0:30.0,afade=t=out:st=29.75:d=0.25[mix]')
cmd = ['ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(fl),'-map','[mix]','-ar','48000','-c:a','pcm_s16le','audio/mix-pre.wav']
subprocess.run(cmd, check=True)
# two-pass loudnorm to -14 LUFS / -1 dBTP
r = subprocess.run(['ffmpeg','-hide_banner','-i','audio/mix-pre.wav','-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
m = json.loads(r[r.rindex('{'):])
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-v','error','-y','-i','audio/mix-pre.wav','-af',af,'-ar','48000','-c:a','aac','-b:a','256k',OUT],check=True)
print(len(ev), 'events placed; input', m['input_i'], 'LUFS')
