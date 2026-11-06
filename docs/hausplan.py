# Erzeugt docs/hausplan.svg aus den Raumdaten (Masse in m, x nach Osten, z nach Norden, Süden = unten im Bild)
import math
U = 1.6  # cm pro Einheit
S = 40   # px pro m
HAUS = (10.0, 9.0)
GESCHOSSE = {
 'UG (Keller)': [('Werkstatt', 0, 0, 4, 9), ('Treppe', 4, 0, 5.2, 3.5), ('Gang', 4, 3.5, 5.2, 9), ('Waschküche', 5.2, 0, 10, 4.5), ('Vorratskeller', 5.2, 4.5, 10, 9)],
 'EG': [('Wohnzimmer', 0, 0, 4, 5), ('Treppe', 4, 0, 5.2, 3.5), ('Gang', 4, 3.5, 5.2, 5), ('Esszimmer', 5.2, 0, 10, 5), ('Eingang', 0, 5, 2.5, 9), ('WC', 2.5, 5, 4, 9), ('Küche', 4, 5, 10, 9)],
 'OG': [('Kinderzimmer', 0, 0, 4, 3.5), ('Treppe', 4, 0, 5.2, 3.5), ('Elternzimmer', 5.2, 0, 10, 3.5), ('Gang', 0, 3.5, 10, 5), ('Badezimmer', 0, 5, 4, 9), ('Büro', 4, 5, 10, 9)],
}
KIZI = [ # Kinderzimmer: Möbel (Name, x0, z0, x1, z1, Höhe m)
 ('Schreibtisch', 1.4, 0.1, 2.6, 0.9, 0.75), ('Stuhl', 1.75, 0.95, 2.25, 1.4, 0.45), ('Bett', 0.0, 1.4, 0.9, 3.4, 0.5),
 ('Nachttisch', 0.95, 3.0, 1.4, 3.45, 0.5), ('Regal', 3.65, 0.3, 4.0, 1.3, 1.8), ('Schrank', 3.4, 2.0, 4.0, 3.5, 2.0),
 ('Spielkiste', 3.25, 1.5, 3.85, 1.9, 0.4), ('Teppich', 1.2, 1.4, 3.2, 2.7, 0.01)]
FARBE = {'Kinderzimmer': '#FFE0B2', 'Treppe': '#CFD8DC', 'Gang': '#ECEFF1'}
out = []
def rect(x, y, w, h, fill, stroke='#37474F', sw=1.5, extra=''):
    out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>')
def text(x, y, t, size=11, anchor='middle', weight='normal', fill='#263238'):
    out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}" fill="{fill}" font-family="system-ui,sans-serif">{t}</text>')
W, H = 3 * (HAUS[0] * S + 40) + 40, 0
ox, oy = 30, 50
text(20, 26, 'Haus «Zuhause»: Grundrisse 10 × 9 m (Süden unten, Garten im Süden)', 15, 'start', 'bold')
for i, (name, raeume) in enumerate(GESCHOSSE.items()):
    x0 = ox + i * (HAUS[0] * S + 40); y0 = oy + 20
    text(x0 + HAUS[0] * S / 2, y0 - 8, name, 13, weight='bold')
    for (r, a, b, c, d) in raeume:
        px, py = x0 + a * S, y0 + (HAUS[1] - d) * S
        rect(px, py, (c - a) * S, (d - b) * S, FARBE.get(r, '#FFFFFF'))
        text(px + (c - a) * S / 2, py + (d - b) * S / 2, r, 10 if (c - a) < 2 else 11)
        if r not in ('Treppe', 'Gang'):
            text(px + (c - a) * S / 2, py + (d - b) * S / 2 + 13, f'{c-a:g} × {d-b:g} m', 9, fill='#607D8B')
    rect(x0, y0, HAUS[0] * S, HAUS[1] * S, 'none', '#263238', 3)
y1 = oy + 20 + HAUS[1] * S + 50
# Schnitt Nord-Süd
text(20, y1 - 14, 'Schnitt Süd–Nord (Höhen in m)', 15, 'start', 'bold')
sx, base = 30, y1 + 9.5 * S  # base = EG-Boden
traufe, neig = 5.5, 30
first = traufe + 4.5 * math.tan(math.radians(neig))
def pt(z, y): return (sx + z * S, base - y * S)
for (nm, y0_, y1_) in [('UG', -2.5, 0), ('EG', 0, 2.75), ('OG', 2.75, 5.5)]:
    a = pt(0, y1_); rect(a[0], a[1], 9 * S, (y1_ - y0_) * S, '#FFFFFF')
    text(a[0] + 4.5 * S, a[1] + (y1_ - y0_) * S / 2 + 4, nm, 12)
p = [pt(-0.6, traufe - 0.35), pt(4.5, first), pt(9.6, traufe - 0.35)]
out.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in [pt(0, traufe), pt(4.5, first), pt(9, traufe)])}" fill="#FFF8E1" stroke="#37474F" stroke-width="1.5"/>')
out.append(f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in p)}" fill="none" stroke="#B23A2E" stroke-width="5"/>')
text(pt(4.5, first)[0], pt(4.5, first)[1] + 30, 'Estrich', 11)
for z in (-0.6, 9.6):
    g = pt(z, traufe - 0.4); out.append(f'<circle cx="{g[0]:.1f}" cy="{g[1]:.1f}" r="5" fill="#90A4AE" stroke="#37474F"/>')
gnd = pt(-3, 0); rect(gnd[0], gnd[1], 15 * S, 4, '#7CB342', 'none', 0)
text(pt(-1.6, 0)[0], pt(-1.6, 0)[1] - 6, 'Garten', 10)
text(pt(0, 0)[0], pt(0, -2.9)[1], 'Süd', 10)
text(pt(9, 0)[0], pt(9, -2.9)[1], 'Nord', 10)
k = pt(0, 2.75); rect(k[0], k[1] - 2.5 * S, 3.5 * S, 2.5 * S, '#FFE0B2', '#E65100', 2)
text(k[0] + 1.75 * S, k[1] - 1.25 * S, 'Kinderzimmer', 11, weight='bold')
for (lbl, y) in [('0 (EG-Boden)', 0), ('2.75', 2.75), (f'Traufe {traufe:g}', traufe), (f'First {first:.2f}', first), ('−2.5', -2.5)]:
    a = pt(9.9, y); text(a[0] + 50, a[1] - 4, lbl, 10, 'start')
text(pt(4.5, -3.3)[0], pt(4.5, -3.3)[1], f'Satteldach {neig}°, Rinnen an beiden Traufen, Fallrohr in die Regentonne', 10)
# Kinderzimmer möbliert
kx, ky, KS = 720, y1 + 20, 110
text(kx, y1 - 14, 'Kinderzimmer 4 × 3.5 × 2.5 m = 250 × 218.75 × 156.25 Einheiten', 15, 'start', 'bold')
rect(kx, ky, 4 * KS, 3.5 * KS, '#FFF3E0', '#263238', 3)
for (n, a, b, c, d, h) in KIZI:
    px, py = kx + a * KS, ky + (3.5 - d) * KS
    fill = {'Teppich': '#C5E1A5', 'Schreibtisch': '#FFCC80', 'Bett': '#90CAF9'}.get(n, '#E0E0E0')
    rect(px, py, (c - a) * KS, (d - b) * KS, fill, '#455A64', 1.2, 'fill-opacity="0.9"')
    text(px + (c - a) * KS / 2, py + (d - b) * KS / 2 + 4, n, 10 if (c - a) > 0.5 else 8)
# Fenster Süd, Tür Nord
rect(kx + 1.2 * KS, ky + 3.5 * KS - 4, 1.4 * KS, 8, '#81D4FA', '#01579B', 1.5)
text(kx + 1.9 * KS, ky + 3.5 * KS + 20, 'Fenster (Süd), Brüstung 0.9 m', 10)
rect(kx + 2.0 * KS, ky - 4, 0.8 * KS, 8, '#8D6E63', '#3E2723', 1.5)
text(kx + 2.4 * KS, ky - 10, 'Tür zum Gang', 10)
text(kx + 4 * KS + 8, ky + 3.5 * KS / 2, 'Osten: Treppe', 10, 'start')
W = max(kx + 4 * KS + 110, 3 * (HAUS[0] * S + 40) + 20); H = max(ky + 3.5 * KS + 40, base + 3.3 * S + 20)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.0f}" height="{H:.0f}" viewBox="0 0 {W:.0f} {H:.0f}"><rect width="100%" height="100%" fill="#FFFFFF"/>' + ''.join(out) + '</svg>'
open(__import__('os').path.join(__import__('os').path.dirname(__file__), 'hausplan.svg'), 'w').write(svg)
print('First', round(first, 3), 'W', W, 'H', H)
for n, a, b, c, d, h in KIZI: print(n, f'{(c-a)*100:.0f}x{(d-b)*100:.0f}x{h*100:.0f} cm =', round((c-a)*100/U, 2), round((d-b)*100/U, 2), round(h*100/U, 2))
for g, rs in GESCHOSSE.items():
    a = sum((c-a_)*(d-b) for _, a_, b, c, d in rs); print(g, 'Fläche', a)
