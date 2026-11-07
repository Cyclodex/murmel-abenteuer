// Kinderzimmer (OG, Südwest-Ecke des Hauses, docs/plan-echte-orte.md Abschnitt 9). Alle Masse in cm:
// x nach Osten ab Westwand, y = Höhe ab Boden, z nach Norden ab Südwand. 1 Einheit im Spiel = 1.6 cm (Murmel Ø 1.6 cm).
// box = [x0, z0, x1, z1] (Grundriss), y = [unten, oben]. Grauer Rohbau: einfache Formen, Details folgen.
export default {
  id: 'kinderzimmer',
  cm: [400, 250, 350],        // Breite (x), Höhe (y), Tiefe (z)
  aussen: -275,               // Garten liegt 2.75 m unter dem Zimmerboden (OG)
  fenster: { wand: 'S', von: 120, bis: 260, unten: 90, oben: 220 },
  tuer: { wand: 'N', von: 200, bis: 280, hoehe: 200 },
  moebel: [
    { id: 'schreibtisch', art: 'tisch', box: [140, 10, 260, 90], y: [0, 75], platte: 4, farbe: 0xC9B79C },
    { id: 'stuhl', art: 'stuhl', box: [175, 95, 225, 140], y: [0, 45], lehne: 90, farbe: 0x9FB4C7 },
    { id: 'fensterbank', art: 'kiste', box: [115, 0, 265, 25], y: [88, 90], farbe: 0xE8E8E8 },
    { id: 'heizkoerper', art: 'kiste', box: [140, 0, 240, 10], y: [15, 70], farbe: 0xF2F2F2 },
    { id: 'regal', art: 'regal', box: [365, 30, 400, 130], y: [0, 180], boeden: [0, 36, 72, 108, 144, 180], farbe: 0xB9A58C },
    { id: 'bett', art: 'bett', box: [0, 140, 90, 340], y: [0, 50], farbe: 0xA7B9C9 },
    { id: 'nachttisch', art: 'kiste', box: [95, 300, 140, 345], y: [0, 50], farbe: 0xB9A58C },
    { id: 'schrank', art: 'kiste', box: [340, 200, 400, 350], y: [0, 200], farbe: 0xBDB2A6 },
    { id: 'teppich', art: 'kiste', box: [120, 140, 320, 270], y: [0, 1], farbe: 0xA9C79A },
    { id: 'kugelbahn', art: 'kiste', box: [230, 185, 290, 215], y: [1, 61], farbe: 0xE6CF8E },
    { id: 'spielkiste', art: 'kiste', box: [325, 150, 385, 190], y: [0, 40], farbe: 0xD9A07A }
  ]
};
