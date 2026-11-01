#!/usr/bin/env python3
"""Final assembly with ONE continuous tiger clip.

Scene 1 (page, highlighter) -> hard cut -> single 15 s clip (cover pull-back, mama tiger reading, captions)
-> dissolve -> closing card.   usage: assemble_single.py [clip.mp4] [out.mp4]
"""
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

H = '/home/user/claude-code-tests'
CLIP = sys.argv[1] if len(sys.argv) > 1 else f'{H}/single/one.mp4'
OUT = sys.argv[2] if len(sys.argv) > 2 else f'{H}/preview/final.mp4'

CUT = 18.40            # hard cut right after "talkers."
LEAD = 0.5             # silence baked in front of the narration in the clip's audio reference
S2_LEN = 15.0          # the single continuous clip (used length)
CARD_LEN = 3.0
XF = 0.35              # dissolve into the closing card
TOTAL = CUT + S2_LEN + CARD_LEN - XF

# caption chunks: (text, first-word start, last-word end) in narration seconds (passage-2 transcription)
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
    lines, cur = [], ''
    for w in text.split():
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
        caps.append((p, CUT + LEAD + a - 0.05, CUT + LEAD + min(b + 0.25, nxt - 0.03)))

    inputs = [f'{H}/preview/scene1_synced.mp4', CLIP, f'{H}/closing/closing_card.mp4',
              f'{H}/preview/scene1_audio_fixed.wav', f'{H}/audio/passage2_norm.wav']
    cmd = ['ffmpeg', '-y', '-loglevel', 'error']
    for p in inputs:
        cmd += ['-i', p]
    for p, _, _ in caps:
        cmd += ['-framerate', '30', '-loop', '1', '-t', f'{TOTAL:.2f}', '-i', p]

    vf = lambda n, d: f'[{n}:v]trim=0:{d},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p'
    f = [vf(0, CUT) + '[s1]', vf(1, S2_LEN) + '[v0]', vf(2, CARD_LEN) + '[card]',
         f'[v0][card]xfade=transition=fade:duration={XF}:offset={S2_LEN - XF}[tail]',
         '[s1][tail]concat=n=2:v=1:a=0[cat]']
    last = 'cat'
    for i, (_, t0, t1) in enumerate(caps):
        f.append(f"[{last}][{5 + i}:v]overlay=0:0:enable='between(t,{t0:.2f},{t1:.2f})'[o{i}]")
        last = f'o{i}'
    f.append(f'[3:a]atrim=0:{CUT},asetpts=PTS-STARTPTS[a1]')
    f.append(f'[4:a]adelay={int(LEAD * 1000)}:all=1,atrim=0:14.95,afade=t=out:st=14.7:d=0.25,adelay={int(CUT * 1000)}:all=1[a2]')
    f.append(f'[a1][a2]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f}[aout]')
    cmd += ['-filter_complex', ';'.join(f), '-map', f'[{last}]', '-map', '[aout]', '-t', f'{TOTAL:.3f}',
            '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
            '-movflags', '+faststart', OUT]
    print('total', round(TOTAL, 2), 's; captions', [(round(a, 2), round(b, 2)) for _, a, b in caps])
    subprocess.run(cmd, check=True)
    print('wrote', OUT)


if __name__ == '__main__':
    main()
