// Prüfstand, bewegliche Teile und Fallen. Alle starten bei [0, 0, 2] und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, parts, extra) => ({ id: 'p-' + id, name, emoji: '🔧', theme: 'spielzimmer', start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });
const teller = (z, open = 2.7) => [ // quadratischer Teller 12 x 12 mit Rand, vorne und hinten offen (wie in Küche 2)
  { type: 'klotz', at: [0, -0.5, z], size: [12, 1, 12] },
  { type: 'wand', from: [-6.2, 0, z + 6], to: [-6.2, 0, z - 6] },
  { type: 'wand', from: [6.2, 0, z + 6], to: [6.2, 0, z - 6] },
  { type: 'wand', from: [-6.4, 0, z + 6.2], to: [-open, 0, z + 6.2] },
  { type: 'wand', from: [open, 0, z + 6.2], to: [6.4, 0, z + 6.2] },
  { type: 'wand', from: [-6.4, 0, z - 6.2], to: [-open, 0, z - 6.2] },
  { type: 'wand', from: [open, 0, z - 6.2], to: [6.4, 0, z - 6.2] }
];

export default [
  // Plattform fährt über die Lücke (wie in Spielzimmer 2)
  lv('plattform', 'Plattform', [
    anlauf(-8),
    { type: 'plattform', from: [0, 0, -10], to: [0, 0, -16], size: [4.5, 4], time: 2.5, pause: 2.5 },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -26], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -23] }
  ]),
  // Wippe: Einfahrt unten, kippt nach vorne, wenn die Murmel über die Mitte rollt (wie in Spielzimmer 2)
  lv('wippe', 'Wippe', [
    anlauf(-6),
    { type: 'wippe', at: [0, 0.695, -10], size: [4, 8], angle: 10 },
    { type: 'weg', from: [0, 0, -14], to: [0, 0, -24], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -20] }
  ]),
  // Schalter fährt die Brücke hoch (wie in Spielzimmer 3)
  lv('schalter', 'Schalter und Brücke', [
    anlauf(-8, 6),
    { type: 'schalter', at: [1.8, 0, -5.5], id: 'b1' },
    { type: 'bruecke', from: [0, 0, -8], to: [0, 0, -16], width: 4, walls: 0.6, id: 'b1', drop: 12 },
    { type: 'weg', from: [0, 0, -16], to: [0, 0, -26], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -22] }
  ]),
  // Drehender Balken auf einem Teller (wie in Küche 2)
  lv('balken', 'Drehbalken', [
    anlauf(-6),
    ...teller(-12),
    { type: 'balken', at: [0, 0, -12], length: 10, speed: 35 },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -26], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -23] }
  ]),
  // Dominos umwerfen (wie in Küche 3)
  lv('domino', 'Dominos', [
    anlauf(-6),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -22], width: 5, walls: 0.8, caps: 'end' },
    { type: 'domino', from: [0, 0, -9], to: [0, 0, -15], count: 6, size: [3.6, 1.8, 0.3] },
    { type: 'ziel', at: [0, 0, -19] }
  ]),
  // Falltür: klappt kurz nach dem Drauffahren auf, schnell drüberrollen (wie die Klappen der Spielzeugkiste in Spielzimmer 2 💀)
  lv('falltuer', 'Falltür', [
    anlauf(-8),
    { type: 'weg', from: [0, 0, -8], to: [0, 0, -10], width: 3 },
    { type: 'falltuer', at: [0, 0, -11.5], size: [3, 3] },
    { type: 'weg', from: [0, 0, -13], to: [0, 0, -22], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -18] }
  ]),
  // Schieber auf einem schmalen Brett ohne Rand (wie der Sandschieber auf der Zinne in Garten 2 💀)
  lv('schieber', 'Schieber', [
    anlauf(-4),
    { type: 'wand', from: [-2.7, 0, -4], to: [-0.9, 0, -4] },
    { type: 'wand', from: [0.9, 0, -4], to: [2.7, 0, -4] },
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -14], width: 1.4 },
    { type: 'schieber', from: [-3.2, 0, -11], to: [0.3, 0, -11], size: [2, 1.2, 2], time: 1, pause: 1 },
    { type: 'weg', from: [0, 0, -14], to: [0, 0, -22], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -19] }
  ]),
  // Hammer schlägt auf ein Brett ohne Rand (wie der blaue Hammer vor dem Ziel in Spielzimmer 2 💀)
  lv('hammer', 'Hammer', [
    anlauf(-6),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -15], width: 3 },
    { type: 'hammer', at: [0, 0, -10.5], side: -1, length: 4, size: [3.2, 1.4, 1.6], farbe: 'blau', offset: 1.7 },
    { type: 'weg', from: [0, 0, -15], to: [0, 0, -22], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -19] }
  ]),
  // Felsen rollt von rechts quer über den Hang (wie im Steingarten in Garten 3 💀)
  lv('felsen', 'Felsen', [
    anlauf(-3),
    { type: 'weg', from: [0, 0, -3], to: [0, -3, -15], width: 5 },
    { type: 'weg', from: [14, 2.5, -11], to: [2.5, -2, -11], width: 3, walls: 0.6, caps: 'start' },
    { type: 'felsen', from: [13, 2.4, -11], dir: [-1, 0], speed: 3, every: 4 },
    { type: 'weg', from: [0, -3, -15], to: [0, -3, -24], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -3, -21] }
  ]),
  // Kanone schiesst die Murmel auf eine höhere Bahn (wie in Vulkan 3), lange Landebahn: der Flummi springt weit
  lv('kanone', 'Kanone', [
    anlauf(-4),
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -9], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -4], to: [-1.5, 0, -4] },
    { type: 'wand', from: [1.5, 0, -4], to: [2.7, 0, -4] },
    { type: 'kanone', at: [0, 0, -7], target: [0, 4, -24], time: 1.6 },
    { type: 'weg', from: [0, 4, -19], to: [0, 4, -38], width: 4, walls: 0.6, caps: 'both' },
    { type: 'ziel', at: [0, 4, -34] }
  ])
];
