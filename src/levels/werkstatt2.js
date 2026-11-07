// Werkstatt 2: Sägewerk. Gefahren: Der Sägetisch hat keinen Rand mehr, zwei Sägeblätter drehen gegeneinander; man fährt
// aussen an der Tischkante vorbei, wenn das Blatt gerade weg ist, und wartet zwischen den beiden. Dann drei lose Latten
// (Falltüren) in einer Reihe über dem Sägemehl: zügig drüber, sonst klappen sie weg (jede Latte hält jedes Mal anders lang).
// Durch die Nagelwand hinunter, ohne Rand im S um die Bretterstapel: Aus dem Regal darüber fallen Schrauben auf das schmale
// Brett (sie wackeln vorher und werfen einen Schatten), mal in schneller Folge, mal mit langer Pause; wer getroffen wird,
// fliegt seitlich hinunter. Im Zickzack über schmale Latten. Das Schleifband läuft gegen die Fahrtrichtung und stottert:
// mal langsam, mal ein Ruck nach unten, kurz steht es oder läuft sogar mit. Oben, ohne Rand, die Kreissäge abpassen, dann
// ins Ziel. Bonusstern: hinten rechts an der Tischecke.
const XL = -3;   // Achse der Latten und der Nagelwand
const NZ = -40;  // Nagelwand: obere Vorderkante
const U = -8;    // Höhe unten (Sägemehl unter der Nagelwand)
const O = U + 1.5; // Höhe nach dem Schleifband
const ZB = -54;  // Achse des Schleifbands (es geht nach +x)
const XS = 40;   // oberes Ende des Schleifbands
const LATTEN = [[12, ZB], [16, ZB - 4], [20, ZB], [24, ZB - 4], [28, ZB]]; // Ecken der Latten im Zickzack
const BODEN = -14; // Schneidematte (killY - 1): bis dort reichen Tischbeine und Kisten
// Kiste neben der Bahn, auf der Werkzeug liegt (nur Optik, ohne Physik); oben = Höhe der Oberkante
const kiste = (x, z, b, t, oben, look = 'latte-dunkel') =>
  ({ type: 'klotz', at: [x, (oben + BODEN) / 2, z], size: [b, oben - BODEN, t], look, deko: true });

export default {
  id: 'ws2', name: 'Sägewerk', emoji: '🪚', theme: 'werkstatt',
  start: [0, 0, 2], killY: BODEN + 1,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },

    // Sägetisch aus Stahl ohne Rand, zwei Sägeblätter drehen gegeneinander
    { type: 'klotz', at: [0, -0.5, -13], size: [8.4, 1, 18], look: 'stahl' },
    { type: 'balken', at: [0, 0, -8.5], length: 6, speed: 35, farbe: 'saege' },
    { type: 'balken', at: [0, 0, -17.5], length: 6, speed: -35, farbe: 'saege' },
    ...[[-3.6, -5], [3.6, -5], [-3.6, -21], [3.6, -21]].map(([x, z]) =>
      ({ type: 'klotz', at: [x, (BODEN - 1) / 2, z], size: [1, -1 - BODEN, 1], look: 'latte-dunkel', deko: true })),

    // lose Latten: drei Falltüren in einer Reihe, darunter das Sägemehl
    { type: 'weg', from: [XL, 0, -22], to: [XL, 0, -24.5], width: 2.4, walls: 0.8 },
    { type: 'checkpoint', at: [XL, 0, -23.2], size: [2.4, 3, 1.6] },
    { type: 'weg', from: [XL, 0, -24.5], to: [XL, 0, -26], width: 1.6 },
    ...[[-27.25, [0.9, 0.6, 1.2], [2, 1.2, 3]], [-29.75, [0.8, 1.1, 0.6], [1.5, 2.6]], [-32.25, [1.0, 0.7], [2.4, 1, 1.8]]]
      .map(([z, delay, offen]) => ({ type: 'falltuer', at: [XL, 0, z], size: [1.6, 2.5], delay, offen })),
    { type: 'weg', from: [XL, 0, -33.5], to: [XL, 0, -36], width: 1.6 },
    { type: 'weg', from: [XL, 0, -36], to: [XL, 0, NZ], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [XL, 0, -38], size: [3, 3, 2] },
    { type: 'klotz', at: [XL, BODEN + 0.6, -30], size: [6, 1.2, 9], look: 'saegemehl', deko: true },

    // Nagelwand: oben hineinrollen, von Nagel zu Nagel hinunter ins Sägemehl
    { type: 'nagelbrett', at: [XL, 0, NZ], breite: 6, hoehe: -U },
    { type: 'weg', from: [XL, U, NZ + 1.5], to: [XL, U, NZ - 4], width: 7, surface: 'saegemehl' },
    { type: 'wand', from: [XL - 3.7, U, NZ + 1.7], to: [XL + 3.7, U, NZ + 1.7] },
    { type: 'wand', from: [XL - 3.5, U, NZ + 1.5], to: [XL - 3.5, U, NZ - 4] },
    { type: 'wand', from: [XL - 3.7, U, NZ - 4.2], to: [XL + 3.7, U, NZ - 4.2] },
    { type: 'wand', from: [XL + 3.5, U, NZ + 1.5], to: [XL + 3.5, U, NZ - 1.2] },
    { type: 'wand', from: [XL + 3.5, U, NZ - 2.8], to: [XL + 3.5, U, NZ - 4] },
    { type: 'checkpoint', at: [XL - 1, U, NZ - 2], yaw: -90, size: [3, 3, 4] },

    // ohne Rand im S um die Bretterstapel
    { type: 'weg', from: [XL + 3.5, U, NZ - 2], to: [4, U, NZ - 2], width: 1.6 },
    { type: 'kurve', at: [4, U, NZ - 2], yaw: -90, turn: -90, radius: 3, width: 1.6 },
    { type: 'weg', from: [7, U, NZ - 5], to: [7, U, ZB + 3], width: 1.6 },
    // Schraubenregal über dem Brett: Schrauben fallen im unregelmässigen Takt und stossen zur Seite
    { type: 'fallend', from: [7, U + 5.5, -45.5], to: [7, -50.5], stellen: [0.5, 0.15, 0.85, 0.35, 0.7], every: [0.9, 0.6, 5.5, 1.4, 0.7, 4.8],
      warn: 0.8, liegt: 0.6, kick: 4, form: 'schraube', anzahl: 3 },
    { type: 'klotz', at: [6.8, U + 6.1, -48], size: [3, 0.25, 8], look: 'latte-dunkel', deko: true },
    ...[-44.5, -51.5].map(z => ({ type: 'klotz', at: [5.4, (U + 6.1 + BODEN) / 2, z], size: [0.3, U + 6.1 - BODEN, 0.3], look: 'latte-dunkel', deko: true })),
    { type: 'kurve', at: [7, U, ZB + 3], yaw: 0, turn: 90, radius: 3, width: 1.6 },
    { type: 'weg', from: [10, U, ZB], to: [12, U, ZB], width: 2.4, walls: 0.8 },
    { type: 'checkpoint', at: [11, U, ZB], yaw: -90, size: [2.4, 3, 1.6] },

    // Latten im Zickzack ohne Rand, an den Ecken liegen kleine Klötze
    ...LATTEN.slice(1).map((p, k) => ({ type: 'weg', from: [LATTEN[k][0], U, LATTEN[k][1]], to: [p[0], U, p[1]], width: 1.2, look: 'latte-natur' })),
    ...LATTEN.map(([x, z]) => ({ type: 'klotz', at: [x, U - 0.5, z], size: [1.3, 1, 1.3], yaw: 45, look: 'latte-dunkel' })),

    // Schleifband ohne Rand läuft hinunter: hinauf gegen das Band; oben die Kreissäge links
    { type: 'band', from: [XS, O, ZB], to: [28, U, ZB], width: 2.2, speed: 1.5, grip: 0.8, look: 'schleifband',
      takt: [[2.2, 1], [1.4, 1.8], [1.6, -1], [2.5, 1.2], [1, 0]] },
    { type: 'weg', from: [XS, O, ZB], to: [XS + 2.5, O, ZB], width: 2.4, walls: 0.8 },
    { type: 'checkpoint', at: [XS + 1.25, O, ZB], yaw: -90, size: [2.4, 3, 1.6] },
    { type: 'weg', from: [XS + 2.5, O, ZB], to: [XS + 12, O, ZB], width: 1.6 },
    { type: 'balken', at: [XS + 6.5, O, ZB - 2.6], length: 6.4, speed: 40, farbe: 'saege' },
    { type: 'weg', from: [XS + 12, O, ZB], to: [XS + 18, O, ZB], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [XS + 15.5, O, ZB] },

    // Sterne: aussen an der Tischkante (rechts, dann links), auf der mittleren Latte, unter der Nagelwand, im S,
    // oben auf dem Schleifband; Bonus hinten rechts an der Tischecke
    { type: 'stern', at: [3.7, 0.9, -8.5] },
    { type: 'stern', at: [-3.7, 0.9, -17.5] },
    { type: 'stern', at: [XL, 0.9, -29.75] },
    { type: 'stern', at: [1.5, U + 0.9, NZ - 2] },
    { type: 'stern', at: [7.5, U + 0.9, -48] },
    { type: 'stern', at: [20, U + 0.9, ZB] },
    { type: 'stern', at: [XS - 3, U + 1.5 * 9 / 12 + 0.9, ZB] },
    { type: 'stern', at: [3.6, 0.9, -21.4], bonus: true },

    // Riesiges Werkzeug neben der Bahn (nur Optik)
    // Bretterstapel mit dem Fuchsschwanz rechts vom Start
    kiste(8, -1, 5.5, 14, -2),
    { type: 'deko', form: 'holzstapel', at: [8, -2, -1], scale: 1.5 },
    { type: 'deko', form: 'saege', at: [8, 0.68, -1], yaw: 6, scale: 0.85 },
    // Kreissägeblatt dreht sich links vom Sägetisch
    kiste(-10.5, -13, 6, 8, -1.5, 'latte-natur'),
    { type: 'deko', form: 'saegeblatt', at: [-10.5, -1.5, -13], scale: 1.0, dreh: 50 },
    // Hammer links neben der Nagelwand
    kiste(-10, NZ + 1, 5, 11, -1),
    { type: 'deko', form: 'hammer', at: [-10, -1, NZ + 1.5], scale: 1.1 },
    // Bretterstapel innen im S
    kiste(3, -49, 3.4, 8, U - 0.5),
    { type: 'deko', form: 'holzstapel', at: [3, U - 0.5, -49], scale: 1.1 },
    kiste(11, -46, 3.4, 8, U - 0.5),
    { type: 'deko', form: 'holzstapel', at: [11, U - 0.5, -46], scale: 1.1 },
    // unten auf der Schneidematte: Farbdose, Schrauben beim Schleifband, Werkzeugkasten hinter dem Ziel
    { type: 'deko', form: 'farbdose', at: [-2, BODEN, -50], scale: 1.3, farbe: 0x1E88E5 },
    { type: 'deko', form: 'schraube', at: [34, BODEN, -48], scale: 1.4 },
    { type: 'deko', form: 'schraube', at: [38.5, BODEN, -48.5], scale: 1.2, farbe: 0xD4A93A },
    { type: 'deko', form: 'mutter', at: [16, BODEN, -62], yaw: 20, scale: 1.6 },
    { type: 'deko', form: 'werkzeugkasten', at: [XS + 22, BODEN, ZB], yaw: 90, scale: 2 }
  ]
};
