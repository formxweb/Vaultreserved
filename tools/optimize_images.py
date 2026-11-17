"""Vault Reserved — fotoğraf hattı.

Kullanım:
    python3 tools/optimize_images.py <kaynak_klasör> [hero_odak_x]

Kaynak klasördeki her <isim>.jpg dosyası, assets/img/ içine AVIF + WebP
olarak 5 boyutta (480–1600 px) yazılır. Sitedeki isimlerle aynı dosya adlarını kullanın
(hero.jpg, whisky-sphere.jpg, cigar-room.jpg ...), HTML'e dokunmanıza gerek kalmaz.
hero_odak_x: mobil dikey kırpımın yatay odağı (0–1, varsayılan 0.5).
Gerekli: Pillow (pip install pillow) — yalnızca bu araç için, site için değil.
"""
import os
import sys
from PIL import Image, ImageEnhance

SRC = sys.argv[1]
FOCUS_X = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5
DST = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
WIDTHS = {}
DEFAULT = [480, 720, 960, 1200, 1600]
# İsteğe bağlı renk ayarı: (doygunluk, parlaklık, kontrast). Gerçek fotoğraflarda gerekirse düzenleyin.
GRADE = {}


def save(im, name, widths):
    for w in widths:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(os.path.join(DST, f'{name}-{w}.avif'), quality=52, speed=4)
        r.save(os.path.join(DST, f'{name}-{w}.webp'), quality=74, method=6)
    print(f'{name}: {im.width}x{im.height}')


for f in sorted(os.listdir(SRC)):
    if not f.lower().endswith(('.jpg', '.jpeg', '.png')):
        continue
    name = os.path.splitext(f)[0]
    im = Image.open(os.path.join(SRC, f)).convert('RGB')
    g = GRADE.get(name)
    if g:
        im = ImageEnhance.Color(im).enhance(g[0])
        im = ImageEnhance.Brightness(im).enhance(g[1])
        im = ImageEnhance.Contrast(im).enhance(g[2])
    save(im, name, WIDTHS.get(name, DEFAULT))
    if name == 'hero':
        H = im.height
        W = round(H * 9 / 16)
        cx = int(im.width * FOCUS_X)
        x0 = max(0, min(im.width - W, cx - W // 2))
        save(im.crop((x0, 0, x0 + W, H)), 'hero-portrait', [600, 900])

print('Şimdi sayfayı yeniden üretin: python3 tools/build.py')
