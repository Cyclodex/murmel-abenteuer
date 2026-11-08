// Kinderzimmer (OG, Südwest-Ecke des Hauses, docs/plan-echte-orte.md Abschnitt 9). Alle Masse in cm:
// x nach Osten ab Westwand, y = Höhe ab Boden, z nach Norden ab Südwand. 1 Einheit im Spiel = 1.6 cm (Murmel Ø 1.6 cm).
// box = [x0, z0, x1, z1] (Grundriss), y = [unten, oben]. art sagt src/orte/bau.js, wie das Möbel aussieht.
const HOLZ = 0xD6BC94; // Buche hell: Schreibtisch, Regal, Bett, Nachttisch (gleich wie Look 'holz' im Theme zuhause)
export default {
  id: 'kinderzimmer',
  cm: [400, 250, 350],        // Breite (x), Höhe (y), Tiefe (z)
  aussen: -275,               // Garten liegt 2.75 m unter dem Zimmerboden (OG)
  fenster: { wand: 'S', von: 120, bis: 260, unten: 90, oben: 220 },
  tuer: { wand: 'N', von: 200, bis: 280, hoehe: 200 },
  farben: {
    wand: 0xE4EEEA, decke: 0xF7F5F0, leiste: 0xF4F1EA, holz: HOLZ, fuge: 0x8F6F4E, boden: [0xC9A47C, 0xBF996F, 0xD2AE86],
    bordure: { y: 140, h: 12, grund: 0xF6EBD3, muster: [0xE57373, 0x64B5F6, 0x81C784, 0xF2C14E] },
    bettdecke: 0x7FA7D6, kissen: 0xF7F3EA
  },
  // Vorhänge links und rechts vom Fenster bis zum Boden (Stange 14 cm über dem Fenster)
  vorhang: { links: [80, 114], rechts: [266, 300], farbe: 0xE8C27E },
  moebel: [
    { id: 'schreibtisch', art: 'tisch', box: [140, 10, 260, 90], y: [0, 75], platte: 4, farbe: HOLZ },
    { id: 'stuhl', art: 'stuhl', box: [175, 95, 225, 140], y: [0, 45], lehne: 90, farbe: 0x7FA6C9 },
    { id: 'fensterbank', art: 'fensterbank', box: [115, 0, 265, 25], y: [88, 90], farbe: 0xEDEBE6 },
    { id: 'heizkoerper', art: 'heizkoerper', box: [140, 0, 240, 10], y: [15, 70], farbe: 0xF4F4F2 },
    { id: 'regal', art: 'regal', box: [365, 30, 400, 130], y: [0, 180], boeden: [0, 36, 72, 108, 144, 180], farbe: HOLZ,
      inhalt: ['kisten', 'spardose', 'pokal', 'teddy', 'buecher'] },
    { id: 'bett', art: 'bett', box: [0, 140, 90, 340], y: [0, 50], farbe: HOLZ },
    { id: 'nachttisch', art: 'nachttisch', box: [95, 300, 140, 345], y: [0, 50], farbe: HOLZ },
    { id: 'schrank', art: 'schrank', box: [340, 200, 400, 350], y: [0, 200], farbe: 0xF1EEE8 },
    { id: 'teppich', art: 'teppich', box: [120, 140, 320, 270], y: [0, 1], farbe: 0x9CC48A },
    { id: 'kugelbahn', art: 'kugelbahn', box: [230, 185, 290, 215], y: [1, 61], farbe: 0xE6CF8E },
    { id: 'spielkiste', art: 'spielkiste', box: [325, 150, 385, 190], y: [0, 40], farbe: 0xE09A6E }
  ],
  // an den Wänden: u = cm entlang der Wand (S/N: x, W/O: z), y = Mitte über dem Boden
  wand: [
    { art: 'steckdose', wand: 'S', u: 124, y: 30, n: 2 },   // beim Schreibtisch
    { art: 'steckdose', wand: 'N', u: 152, y: 30 },         // beim Bett (neben dem Nachttisch)
    { art: 'schalter', wand: 'N', u: 296, y: 105 },         // neben der Tür
    { art: 'poster', wand: 'W', u: 240, y: 150, gross: [60, 84] }, // über dem Bett
    { art: 'zeichnung', wand: 'W', u: 175, y: 116, schief: 0.5 },
    { art: 'uhr', wand: 'O', u: 165, y: 195, r: 15 },
    { art: 'zeichnung', wand: 'O', u: 165, y: 116, schief: -0.4 }
  ],
  // am Boden: at = [x, z], yaw in Radiant (positiv dreht Osten nach Norden)
  kleinkram: [
    { art: 'baustein', at: [150, 165], y: 1, yaw: 0.4, farbe: 0xE53935 },
    { art: 'baustein', at: [162, 176], y: 1, yaw: -0.3, farbe: 0xFBC02D },
    { art: 'baustein', at: [156, 190], y: 1, yaw: 1.2, farbe: 0x1E88E5 },
    { art: 'baustein', at: [150.5, 165.5], y: 2.9, yaw: 0.4, farbe: 0x43A047 },
    { art: 'baustein', at: [300, 250], y: 1, yaw: 2.1, farbe: 0xFBC02D },
    { art: 'baustein', at: [118, 285], yaw: 0.9, farbe: 0xE53935 },
    { art: 'socke', at: [106, 170], yaw: 0.5, farbe: 0xF06292 },
    { art: 'socke', at: [112, 196], yaw: -1.9, farbe: 0xF06292 },
    { art: 'zeichnung', at: [200, 245], y: 1, yaw: 0.25 },
    { art: 'zeichnung', at: [300, 115], yaw: -0.5 },
    { art: 'ball', at: [318, 312], r: 10, farbe: 0xE57373 },
    { art: 'kabel', punkte: [[124, 30, 3], [124, 18, 4], [125, 2, 8], [130, 0.7, 25], [126, 0.7, 45], [134, 0.7, 62]] }
  ]
};
