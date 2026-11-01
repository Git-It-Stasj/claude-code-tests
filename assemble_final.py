#!/usr/bin/env python3
"""Final assembly: Scene 1 (page) -> hard cut -> tiger scene (captions) -> dissolve -> closing card."""
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

H = '/home/user/claude-code-tests'
OUT = f'{H}/preview/final.mp4'

CUT = 18.40            # hard cut right after "talkers."
S2_NARR = 0.7          # narration starts this far into the tiger scene (voice enters during the pull-back)
INTRO_LEN = 1.6        # macro->pull-back, retimed from intro.mp4 [0.25, 3.0]
FD = 0.9               # eased crossfade length at each clip join
S2_LEN = S2_NARR + 15.0
CARD_LEN = 3.0
XF = 0.35              # dissolve into the closing card
TAIL_LEN = S2_LEN + CARD_LEN - XF
TOTAL = CUT + TAIL_LEN

# caption chunks: (text, first-word start, last-word end) in narration seconds (from the passage-2 transcription)
CAPS = [
    ("Like the lamplighters, it's crucial as a leader", 0.28, 3.46),
    ("in today's dynamic and complex world", 3.50, 6.14),
    ("to have a comprehensive understanding", 6.38, 8.36),
    ("of your team, your industry,", 8.42, 10.34),
    ("and the rapidly evolving landscape", 10.68, 12.88),
    ("of responsible AI.", 12.94, 14.42),
]


def caption_png(text, path):
    img = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 52)
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if font.getlength(t) <= 900:
            cur = t
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    lh = 66
    wmax = max(font.getlength(l) for l in lines)
    cy = 1585
    x0, x1 = (1080 - wmax) / 2 - 38, (1080 + wmax) / 2 + 38
    y0, y1 = cy - (len(lines) * lh) / 2 - 22, cy + (len(lines) * lh) / 2 + 22
    d.rounded_rectangle([x0, y0, x1, y1], radius=34, fill=(12, 8, 5, 150))
    for i, l in enumerate(lines):
        x = (1080 - font.getlength(l)) / 2
        y = cy - (len(lines) * lh) / 2 + i * lh
        d.text((x, y), l, font=font, fill=(255, 250, 240, 255), stroke_width=2, stroke_fill=(0, 0, 0, 200))
    img.save(path)


def main():
    caps = []
    for i, (txt, a, b) in enumerate(CAPS):
        p = f'{H}/preview/cap_{i}.png'
        caption_png(txt, p)
        nxt = CAPS[i + 1][1] if i + 1 < len(CAPS) else 99
        t0 = CUT + S2_NARR + a - 0.05
        t1 = CUT + S2_NARR + min(b + 0.25, nxt - 0.03)
        caps.append((p, t0, t1))

    inputs = [f'{H}/preview/scene1_synced.mp4', f'{H}/clips/intro.mp4', f'{H}/mm/mm_clip1_stab.mp4',
              f'{H}/mm/mm_clip2.mp4', f'{H}/mm/mm_clip3.mp4', f'{H}/closing/closing_card.mp4',
              f'{H}/preview/scene1_audio_fixed.wav', f'{H}/audio/passage2_norm.wav']
    cmd = ['ffmpeg', '-y', '-loglevel', 'error']
    for p in inputs:
        cmd += ['-i', p]
    for p, _, _ in caps:
        cmd += ['-framerate', '30', '-loop', '1', '-t', f'{TOTAL:.2f}', '-i', p]

    vf = lambda n, d, extra='': f'[{n}:v]trim=0:{d},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p{extra}'
    f = []
    f.append(vf(0, CUT) + '[s1]')
    f.append(f'[1:v]trim=0.25:3.05,setpts=(PTS-STARTPTS)*{INTRO_LEN/2.75:.5f},scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p,trim=0:{INTRO_LEN}[v0]')
    f.append(vf(2, 6.26 + FD + 0.05) + '[v1]')
    f.append(vf(3, 4.24 + FD + 0.05) + '[v2]')
    f.append(vf(4, 4.5) + '[v3]')
    f.append(vf(5, CARD_LEN) + '[card]')
    EZ = "A*(1-P*P*(3-2*P))+B*(P*P*(3-2*P))"
    c1, c2, c3 = S2_NARR, S2_NARR + 6.26, S2_NARR + 10.5       # clip starts (= pauses in the narration)
    f.append(f"[v0][v1]xfade=transition=custom:expr='{EZ}':duration={FD}:offset={c1}[x1]")
    f.append(f"[x1][v2]xfade=transition=custom:expr='{EZ}':duration={FD}:offset={c2}[x2]")
    f.append(f"[x2][v3]xfade=transition=custom:expr='{EZ}':duration={FD}:offset={c3}[x3]")
    f.append(f'[x3][card]xfade=transition=fade:duration={XF}:offset={S2_LEN - XF}[tail]')
    f.append('[s1][tail]concat=n=2:v=1:a=0[cat]')
    last = 'cat'
    for i, (_, t0, t1) in enumerate(caps):
        f.append(f"[{last}][{8 + i}:v]overlay=0:0:enable='between(t,{t0:.2f},{t1:.2f})'[o{i}]")
        last = f'o{i}'
    # audio: scene-1 narration (already delayed/tempo-adjusted) cut at the hard cut + tiger-scene narration
    f.append(f'[6:a]atrim=0:{CUT},asetpts=PTS-STARTPTS[a1]')
    d2 = int((CUT + S2_NARR) * 1000)
    f.append(f'[7:a]atrim=0:14.9,afade=t=out:st=14.6:d=0.3,adelay={d2}:all=1[a2]')
    f.append(f'[a1][a2]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f}[aout]')
    cmd += ['-filter_complex', ';'.join(f), '-map', f'[{last}]', '-map', '[aout]', '-t', f'{TOTAL:.3f}',
            '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
            '-movflags', '+faststart', OUT]
    print('total', round(TOTAL, 2), 's; captions', [(round(a, 2), round(b, 2)) for _, a, b in caps])
    subprocess.run(cmd, check=True)
    print('wrote', OUT)


if __name__ == '__main__':
    main()
