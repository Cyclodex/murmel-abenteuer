# Kinderzimmer im Detail: Masse in cm (x nach Osten ab Westwand, z nach Norden ab Südwand, y = Höhe ab Boden).
# python3 docs/kinderzimmer.py -> docs/kinderzimmer.svg und Tabelle in Einheiten (1 Einheit = 1.6 cm)
import os
U = 1.6
RAUM = (400, 350, 250)
# (Name, x0, z0, x1, z1, y0, y1, Level-Nr oder None, Farbe)
DINGE = [
 ('Schreibtisch', 140, 10, 260, 90, 0, 75, 1, '#FFCC80'),
 ('Stuhl', 175, 95, 225, 140, 0, 45, None, '#E0E0E0'),
 ('Fensterbank', 115, 0, 265, 25, 88, 90, 3, '#ECEFF1'),
 ('Heizkörper', 140, 0, 240, 10, 15, 70, None, '#F5F5F5'),
 ('Regal', 365, 30, 400, 130, 0, 180, 4, '#D7CCC8'),
 ('Bett', 0, 140, 90, 340, 0, 50, 2, '#90CAF9'),
 ('Nachttisch', 95, 300, 140, 345, 0, 50, 2, '#E0E0E0'),
 ('Schrank', 340, 200, 400, 350, 0, 200, 6, '#BCAAA4'),
 ('Teppich', 120, 140, 320, 270, 0, 1, None, '#C5E1A5'),
 ('Kugelbahn', 230, 185, 290, 215, 1, 61, 5, '#FFE082'),
 ('Spielkiste', 325, 150, 385, 190, 0, 40, 5, '#E0E0E0'),
]
REGAL_BRETTER = [0, 36, 72, 108, 144, 180]  # Oberkante der Böden in cm
FENSTER = (120, 260, 90, 220)  # x0, x1, Brüstung, Sturz (Südwand)
TUER = (200, 280, 200)         # x0, x1, Höhe (Nordwand)
WAND_DINGE = [  # (Name, Wand, Mitte entlang der Wand, Höhe Mitte, Breite, Höhe)
 ('Steckdose', 'S', 100, 30, 8, 8), ('Steckdose', 'W', 310, 30, 8, 8), ('Lichtschalter', 'N', 290, 105, 8, 8),
 ('Poster', 'W', 240, 150, 50, 70), ('Uhr', 'O', 160, 200, 30, 30)]
out = []
def rect(x, y, w, h, fill, stroke='#455A64', sw=1.2, extra=''):
    out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>')
def text(x, y, t, size=10, anchor='middle', weight='normal', fill='#263238'):
    out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}" fill="{fill}" font-family="system-ui,sans-serif">{t}</text>')
def nummer(x, y, n):
    out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="9" fill="#2F6FEB"/>'); text(x, y + 4, str(n), 11, weight='bold', fill='#FFFFFF')
K = 1.2  # px pro cm
# Draufsicht
ox, oy = 30, 50
text(ox, 26, 'Kinderzimmer 400 × 350 × 250 cm (Süden unten), Ziffern = Level', 15, 'start', 'bold')
rect(ox, oy, RAUM[0] * K, RAUM[1] * K, '#FFF8EE', '#263238', 3)
for (n, x0, z0, x1, z1, y0, y1, lv, f) in sorted(DINGE, key=lambda d: d[0] != 'Teppich'):
    px, py = ox + x0 * K, oy + (RAUM[1] - z1) * K
    rect(px, py, (x1 - x0) * K, (z1 - z0) * K, f, extra='fill-opacity="0.92"')
    if n != 'Teppich' or True:
        text(px + (x1 - x0) * K / 2, py + (z1 - z0) * K / 2 + 4, n, 10 if (x1 - x0) > 50 else 8)
    if lv: nummer(px + 10, py + 10, lv)
rect(ox + FENSTER[0] * K, oy + RAUM[1] * K - 4, (FENSTER[1] - FENSTER[0]) * K, 8, '#81D4FA', '#01579B', 1.5)
text(ox + (FENSTER[0] + FENSTER[1]) / 2 * K, oy + RAUM[1] * K + 18, 'Fenster', 10)
rect(ox + TUER[0] * K, oy - 4, (TUER[1] - TUER[0]) * K, 8, '#8D6E63', '#3E2723', 1.5)
text(ox + (TUER[0] + TUER[1]) / 2 * K, oy - 9, 'Tür zum Gang', 10)
out.append(f'<circle cx="{ox + 200 * K:.1f}" cy="{oy + 175 * K:.1f}" r="12" fill="none" stroke="#F9A825" stroke-width="2" stroke-dasharray="3 3"/>')
text(ox + 200 * K, oy + 175 * K - 16, 'Deckenlampe', 9, fill='#8D6E00')
# Ansicht Südwand (von innen, Westen links)
ax, ay = ox + RAUM[0] * K + 60, 70
text(ax, 56, 'Südwand von innen', 15, 'start', 'bold')
H = RAUM[2] * K
rect(ax, ay, RAUM[0] * K, H, '#FFFDF7', '#263238', 2)
fy = lambda y: ay + H - y * K
rect(ax + FENSTER[0] * K, fy(FENSTER[3]), (FENSTER[1] - FENSTER[0]) * K, (FENSTER[3] - FENSTER[2]) * K, '#B3E5FC', '#01579B', 2)
text(ax + 190 * K, fy(160), 'Fenster (Garten)', 10)
VORNE = ['Bett', 'Regal', 'Heizkörper', 'Fensterbank', 'Schreibtisch', 'Stuhl']  # von hinten (Wand) nach vorne gezeichnet
for (n, x0, z0, x1, z1, y0, y1, lv, f) in sorted(DINGE, key=lambda d: VORNE.index(d[0]) if d[0] in VORNE else -1):
    if n in VORNE:
        rect(ax + x0 * K, fy(y1), (x1 - x0) * K, max(2, (y1 - y0) * K), f, extra='fill-opacity="0.85"')
        if n not in ('Fensterbank',): text(ax + (x0 + x1) / 2 * K, fy((y0 + y1) / 2) + 4, n, 9)
        if lv and n != 'Bett': nummer(ax + x0 * K + 10, fy(y1) - 12, lv)
text(ax + 190 * K, fy(90) - 4, 'Fensterbank 90', 9)
for (n, w, m, h, b, hh) in WAND_DINGE:
    if w == 'S': rect(ax + (m - b / 2) * K, fy(h + hh / 2), b * K, hh * K, '#FFFFFF', '#263238', 1); text(ax + m * K, fy(h + hh / 2) - 3, n, 8)
rect(ax, fy(6), RAUM[0] * K, 6 * K, '#BCAAA4', 'none', 0)
# Ansicht Ostwand (von innen, Süden links): Regal mit Böden, Schrank, Spielkiste
bx, by = ax, ay + H + 60
text(bx, by - 14, 'Ostwand von innen (Süden links)', 15, 'start', 'bold')
rect(bx, by, RAUM[1] * K, H, '#FFFDF7', '#263238', 2)
gy = lambda y: by + H - y * K
for (n, x0, z0, x1, z1, y0, y1, lv, f) in DINGE:
    if n in ('Regal', 'Schrank', 'Spielkiste'):
        rect(bx + z0 * K, gy(y1), (z1 - z0) * K, (y1 - y0) * K, f, extra='fill-opacity="0.85"')
        text(bx + (z0 + z1) / 2 * K, gy(y1) + 14, n, 9)
        if lv: nummer(bx + z0 * K + 10, gy(y1) - 12, lv)
for b in REGAL_BRETTER:
    rect(bx + 30 * K, gy(b + 2), 100 * K, 2 * K, '#6D4C41', 'none', 0)
    text(bx + 30 * K - 4, gy(b) + 3, f'{b}', 8, 'end')
for (n, w, m, h, b, hh) in WAND_DINGE:
    if w == 'O': rect(bx + (m - b / 2) * K, gy(h + hh / 2), b * K, hh * K, '#FFFFFF', '#263238', 1); text(bx + m * K, gy(h + hh / 2) - 3, n, 8)
W = ax + RAUM[0] * K + 30; Ht = max(oy + RAUM[1] * K + 30, by + H + 20)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.0f}" height="{Ht:.0f}" viewBox="0 0 {W:.0f} {Ht:.0f}"><rect width="100%" height="100%" fill="#FFFFFF"/>' + ''.join(out) + '</svg>'
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kinderzimmer.svg'), 'w').write(svg)
# Überlappungen (ohne Teppich und Dinge auf/über anderen) prüfen
boden = [d for d in DINGE if d[5] == 0 and d[0] != 'Teppich']
for i in range(len(boden)):
    for j in range(i + 1, len(boden)):
        a, b = boden[i], boden[j]
        if a[1] < b[3] and b[1] < a[3] and a[2] < b[4] and b[2] < a[4]: print('ÜBERLAPPUNG', a[0], b[0])
from decimal import Decimal, ROUND_HALF_UP
f = lambda v: str((Decimal(v) / Decimal('1.6')).quantize(Decimal('0.01'), ROUND_HALF_UP)).rstrip('0').rstrip('.')
print('| Ding | cm (B × T × H) | Einheiten | Oberkante (Einheiten) |\n|---|---|---|---|')
for (n, x0, z0, x1, z1, y0, y1, lv, c) in DINGE:
    print(f'| {n} | {x1-x0} × {z1-z0} × {y1-y0} | {f(x1-x0)} × {f(z1-z0)} × {f(y1-y0)} | {f(y1)} |')
print('Regalböden (Einheiten):', ', '.join(f(b) for b in REGAL_BRETTER))
