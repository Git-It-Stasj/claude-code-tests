"""Contact sheets: one per chapter (fix chapter split in two) for each ratio. Usage: sheets.py <videoDir>"""
import json, subprocess, sys, os
d = sys.argv[1]; G = json.load(open(os.path.join(d, 'grid.json'))); P = G['period']
os.makedirs(os.path.join(d, 'qa/sheets'), exist_ok=True)
def sheet(r, name, a, b, cols, rows, w):
    n = cols * rows; fps = n / (b - a)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{a:.3f}', '-t', f'{b-a:.3f}', '-i', f'{d}/out/{r}.mp4', '-vf',
                    f'fps={fps:.4f},scale={w}:-1,tile={cols}x{rows}:padding=4:color=0x222222', '-frames:v', '1', f'{d}/qa/sheets/{r}-{name}.png'], check=True)
for r, (cols, rows, w) in (('16x9', (4, 3, 480)), ('9x16', (6, 2, 240))):
    for c in G['chapters']:
        name = f"{c['id']}-{c['name'].lower().replace(' ', '-')}"; t0, t1 = c['start'] * P, c['end'] * P
        if c['key'] == 'fix':
            mid = G['fix']['flurry'][0] * P; sheet(r, name + '-a', t0, mid, cols, rows, w); sheet(r, name + '-b', mid, t1, cols, rows, w)
        else: sheet(r, name, t0, t1, cols, rows, w)
print('sheets written to', os.path.join(d, 'qa/sheets'))
