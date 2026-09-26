"""
Re-encode every JPG under public/ (progressive, quality 80, only kept when
smaller), write a WebP sibling next to it, and record pixel dimensions in
lib/image-dimensions.json so <Picture> can set width/height (no layout
shift). Run after adding images:  python3 scripts/optimise-images.py
Needs Pillow:  pip install pillow
"""
import json
import os
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
MANIFEST = ROOT / 'lib' / 'image-dimensions.json'
MAX_EDGE = 1600

dims = {}
before = after = 0

for path in sorted(PUBLIC.rglob('*')):
    if path.suffix.lower() not in ('.jpg', '.jpeg', '.png') or 'og' in path.parts:
        continue
    im = Image.open(path)
    im.load()
    web = '/' + path.relative_to(PUBLIC).as_posix()

    if max(im.size) > MAX_EDGE:
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)

    size_in = path.stat().st_size
    before += size_in
    if path.suffix.lower() in ('.jpg', '.jpeg'):
        rgb = im.convert('RGB')
        buf = BytesIO()
        rgb.save(buf, 'JPEG', quality=80, optimize=True, progressive=True)
        if buf.tell() < size_in:
            path.write_bytes(buf.getvalue())
    else:
        rgb = im

    webp = path.with_suffix('.webp')
    rgb.save(webp, 'WEBP', quality=76, method=6)
    after += min(path.stat().st_size, webp.stat().st_size)

    dims[web] = [im.size[0], im.size[1]]

MANIFEST.write_text(json.dumps(dims, indent=1, sort_keys=True) + '\n')
print(f'{len(dims)} images: {before // 1024} KB -> {after // 1024} KB served as WebP')
