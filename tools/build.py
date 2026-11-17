#!/usr/bin/env python3
"""Vault Reserved — sayfa derleyici.

Kullanım:  python3 tools/build.py

src/index.html (kaynak) → index.html (yayınlanan sayfa):
  • <!--pic isim|alt metin|sizes|loading--> işaretlerini, assets/img içindeki
    AVIF + WebP boyutlarından üretilen <picture> etiketlerine çevirir.
  • <!--build:css yol--> işaretinin yerine CSS'i küçültüp <style> olarak gömer
    (ayrı CSS isteği ilk çizimi geciktirmesin diye).
  • {{RSV}} yerine Check&Place rezervasyon linkini yazar.
Gerekli: Pillow (pip install pillow) — sadece görsel ölçüleri okumak için.
"""
import html
import os
import re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'img')
RSV = ('https://checkandplace.com/public/request/vault/vault/077973045f6b'
       '?template=2&amp;background=full&amp;font=mono-space&amp;campaignCode=online')


def variants(name):
    ws = sorted(int(m.group(1)) for f in os.listdir(IMG)
                if (m := re.fullmatch(re.escape(name) + r'-(\d+)\.avif', f)))
    if not ws:
        raise SystemExit(f'Görsel bulunamadı: {name}')
    w, h = Image.open(os.path.join(IMG, f'{name}-{ws[-1]}.webp')).size
    return ws, w, h


def picture(m):
    parts = m.group(1).split('|')
    name, alt, sizes = parts[0], parts[1], parts[2]
    loading = parts[3] if len(parts) > 3 else 'lazy'
    ws, w, h = variants(name)
    alt = '' if alt == '_' else alt
    mid = min(ws, key=lambda x: abs(x - 960))
    sset = lambda ext: ', '.join(f'assets/img/{name}-{x}.{ext} {x}w' for x in ws)
    return (f'<picture><source type="image/avif" srcset="{sset("avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{sset("webp")}" sizes="{sizes}">'
            f'<img src="assets/img/{name}-{mid}.webp" width="{w}" height="{h}" '
            f'alt="{html.escape(alt, quote=True)}" loading="{loading}" decoding="async"></picture>')


def minify_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    kept = []
    def keep(m):
        kept.append(m.group(0))
        return f'\x00{len(kept) - 1}\x00'
    css = re.sub(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'', keep, css)   # strings untouched
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,>])\s*', r'\1', css)
    css = re.sub(r':\s+', ':', css)
    css = css.replace(';}', '}').strip()
    return re.sub(r'\x00(\d+)\x00', lambda m: kept[int(m.group(1))], css)


def inline_css(m):
    path = m.group(1)
    css = open(os.path.join(ROOT, path), encoding='utf-8').read()
    base = os.path.dirname(path)                       # assets/css
    css = re.sub(r'url\("\.\./', f'url("{os.path.dirname(base)}/', css)  # ../fonts → assets/fonts
    return f'<style>{minify_css(css)}</style>'


src = open(os.path.join(ROOT, 'src', 'index.html'), encoding='utf-8').read()
out = re.sub(r'<!-- KAYNAK DOSYA:.*?-->\n', '<!-- Bu dosya tools/build.py ile üretilir; düzenlemeyi src/index.html üzerinde yapın. -->\n', src, count=1)
out = out.replace('{{RSV}}', RSV)
out, n_pic = re.subn(r'<!--pic ([^>]+?)-->', picture, out)
out, n_css = re.subn(r'<!--build:css ([^ ]+)-->', inline_css, out)
assert '<!--pic' not in out and '{{RSV}}' not in out
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(out)
print(f'index.html üretildi: {n_pic} görsel, {n_css} gömülü CSS, {len(out.encode()) // 1024} KB')
