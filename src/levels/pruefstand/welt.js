// Prüfstand, echte Dinge und Badezimmer. Alle starten bei [0, 0, 2] und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, parts, extra) => ({ id: 'p-' + id, name, emoji: '🔧', theme: 'spielzimmer', start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });

export default [
  // Pfanne mit Lücke vorne: Rampe hinauf auf den Rand, hinein und durch die Lücke hinaus (wie in Am heissen Herd, k1s, ohne die Herdplatte)
  lv('pfanne', 'Pfanne', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 1.2, -9.4], width: 2.6 },
    { type: 'schuessel', at: [0, 0, -15], r: 3, R: 5, h: 1.2, rim: 0.4, art: 'pfanne', offen: [0], griff: 90 },
    { type: 'weg', from: [0, 0, -17], to: [0, 0, -24], width: 2 },
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -30], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -27] }
  ], { theme: 'kueche' }),
  // Lavabo mit Abfluss: Turbo und Schanze hinein, die Murmel gurgelt durchs Rohr hinunter (wie in Fynns Badezimmer)
  lv('lavabo', 'Lavabo', [
    anlauf(-7, 4),
    { type: 'weg', from: [0, 0, -7], to: [0, 0, -10], width: 3, walls: 0.8 },
    { type: 'turbo', at: [0, 0, -8.5], size: [2.6, 2], speed: 10 },
    { type: 'weg', from: [0, 0, -10], to: [0, 1.2, -13], width: 3, walls: 0.5 },
    { type: 'schuessel', at: [0, -1.5, -21], r: 1.5, R: 4.5, h: 2, rim: 1, art: 'lavabo', abfluss: true },
    { type: 'wand', from: [-6, 0.5, -25.7], to: [6, 0.5, -25.7], height: 6 },
    { type: 'klotz', at: [0, 3.8, -25.45], size: [7, 4, 0.1], look: 'spiegel', deko: true },
    { type: 'roehre', from: [0, -1.5, -21], down: true, to: [0, -6.5, -38.5], toYaw: 0, farbe: 0xB0BEC5 },
    { type: 'weg', from: [0, -6.5, -38.5], to: [0, -6.5, -48], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -6.5, -45] }
  ], { theme: 'badezimmer', killY: -13 }),
  // Badewanne mit Schiffchen: vom Rand aufs Deck, das Trampolin springt über das Wasser auf den Weg (wie in Fynns Badezimmer)
  lv('schiff', 'Schiffchen', [
    anlauf(-8.2),
    { type: 'wanne', at: [0, -1.5, -16], size: [9, 14], rim: 1.2, depth: 2, enten: [[-3, 3], [3.2, -4]] },
    { type: 'schiff', at: [0, -1.5, -12.2], size: [4.5, 6], farbe: 0xE53935, trampolin: { vorne: 2, size: [3, 1.4], ziel: [0, 0, -28], time: 1 } },
    { type: 'weg', from: [0, 0, -25], to: [0, 0, -33], width: 5, walls: 0.8, caps: 'both' },
    { type: 'ziel', at: [0, 0, -30] }
  ], { theme: 'badezimmer', killY: -10 }),
  // Wasserstrahl aus dem Hahn quer über den Weg: hindurchrollen, er wäscht und drückt nach unten (wie über dem Lavabo in Fynns Badezimmer)
  lv('strahl', 'Wasserstrahl', [
    anlauf(-6),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -22], width: 5, walls: 0.8, caps: 'end' },
    { type: 'strahl', at: [0, 4, -12], unten: 0, r: 0.6, hahn: true, yaw: 90, lang: 3.8, fuss: 4 },
    { type: 'ziel', at: [0, 0, -19] }
  ], { theme: 'badezimmer' }),
  // Toilette als Ziel: von der Ablage hinunter in die Schüssel, das Ziel liegt im Rohr (wie in Bad-Chaos, b1s)
  lv('klo', 'Klo', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, -0.4, -9.5], width: 3, walls: 0.6 },
    { type: 'klo', at: [0, -3, -14], yaw: 0 },
    { type: 'ziel', at: [0, -5, -14] }
  ], { theme: 'badezimmer' })
];
