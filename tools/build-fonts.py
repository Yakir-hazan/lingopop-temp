"""Rebuild the self-hosted fonts in /fonts (run locally after adding a new Material icon to the app).

  npm i --no-save @fontsource-variable/rubik material-symbols   # sources, NOT committed
  pip install fonttools brotli
  python3 tools/build-fonts.py

Rubik: Hebrew + Latin variable subsets are copied as-is.
Material Symbols: subset to ONLY the icons used in game.html/app.js (+EXTRA), pinned to wght 400 / opsz 24 / GRAD 0,
FILL axis kept (the nav switches icons between outlined and filled)."""
import re, shutil, pathlib
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

root = pathlib.Path(__file__).resolve().parent.parent
nm = root / 'node_modules'
out = root / 'fonts'; out.mkdir(exist_ok=True)

for sub in ('hebrew', 'latin'):
    shutil.copy(nm / f'@fontsource-variable/rubik/files/rubik-{sub}-wght-normal.woff2', out / f'rubik-{sub}.woff2')

EXTRA = ['volume_off', 'replay', 'lock_open', 'home', 'stop', 'mic', 'close', 'check', 'star', 'arrow_back', 'arrow_forward']
src_text = ''.join((root / p).read_text(encoding='utf-8') for p in ('game.html', 'app.js', 'install.js'))
used = set(re.findall(r'material-symbols-outlined[^>]*>\s*([a-z_0-9]+)\s*<', src_text)) | set(re.findall(r"innerText\s*=\s*'([a-z_]+)'", src_text)) | set(EXTRA)

font = TTFont(nm / 'material-symbols/material-symbols-outlined.woff2')
glyphs = set(font.getGlyphOrder())
missing = sorted(u for u in used if u not in glyphs)
used = sorted(u for u in used if u in glyphs)
opts = subset.Options()
opts.layout_features = ['liga', 'rlig', 'calt', 'ccmp']
opts.layout_closure = False
opts.notdef_outline = True
opts.flavor = 'woff2'
opts.name_IDs = [1, 2]
s = subset.Subsetter(opts)
s.populate(glyphs=used + ['.notdef', 'space'], text='abcdefghijklmnopqrstuvwxyz0123456789_')
s.subset(font)
font = instancer.instantiateVariableFont(font, {'GRAD': 0, 'opsz': 24, 'wght': 400})
font.flavor = 'woff2'
font.save(out / 'material-symbols-subset.woff2')
print('icons:', len(used), 'missing:', missing)
for f in sorted(out.iterdir()): print(f.name, f.stat().st_size)
