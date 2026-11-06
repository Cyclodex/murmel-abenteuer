// Prüfstand, Stösse: Bumper, Knall, fallende Dinge, Besen, Rutschplatte (src/elements-stoss.js). Alle starten bei [0, 0, 2]
// und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, theme, parts, extra) => ({ id: 'p-' + id, name, emoji: '💥', theme, start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });

export default [
  // Bumper: Flipper-Gasse mit Rand, die Murmel fährt knapp an drei Pilzen vorbei und prallt am letzten ab
  lv('bumper', 'Bumper', 'chilbi', [
    anlauf(-4),
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -26], width: 8, walls: 1 },
    { type: 'bumper', pos: [-2, 0, -9] },
    { type: 'bumper', pos: [2, 0, -14], look: 'pilz', r: 0.7 },
    { type: 'bumper', pos: [-1.5, 0, -19], look: 'reifen', r: 0.8, hoch: 0.7 },
    { type: 'bumper', pos: [2.6, 0, -22.5], look: 'topf', kick: 5 },
    { type: 'weg', from: [0, 0, -26], to: [0, 0, -34], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -31] }
  ]),
  // Knall: Luftdüse auf dem Steg ohne Rand stösst quer hinunter, danach blubbert ein Kessi radial in der Gasse mit Rand
  lv('knall', 'Knall', 'chilbi', [
    anlauf(-6),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -20], width: 4 },
    { type: 'knall', pos: [0, 0, -12], richtung: [1, 0], takt: [2.5, 1, 4], warn: 0.6, kick: [6, 4, 7], look: 'duese' },
    { type: 'weg', from: [0, 0, -20], to: [0, 0, -36], width: 5, walls: 1, caps: 'end' },
    { type: 'knall', pos: [0, 0, -25], r: 1.8, takt: [2, 3], kick: 5, up: 0.8, look: 'kessi' },
    { type: 'ziel', at: [0, 0, -33] }
  ])
];
