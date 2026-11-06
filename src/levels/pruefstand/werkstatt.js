// Prüfstand, Werkstatt: Schraubstock, Messband, Sägemehl. Alle starten bei [0, 0, 2] und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, parts, extra) => ({ id: 'p-' + id, name, emoji: '🔧', theme: 'werkstatt', start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });

export default [
  // Schraubstock quer über einem Brett ohne Rand: durchfahren, solange er offen ist
  lv('schraubstock', 'Schraubstock', [
    anlauf(-4),
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -8], width: 3, walls: 0.8 },
    { type: 'weg', from: [0, 0, -8], to: [0, 0, -12], width: 3 },
    { type: 'schraubstock', at: [0, 0, -10], weit: 3 },
    { type: 'weg', from: [0, 0, -12], to: [0, 0, -22], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -19] }
  ]),
  // Messband: rechts den Schalter drücken, links neben dem Rollmeter aufs Band und über die Lücke
  lv('messband', 'Messband', [
    anlauf(-4),
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -12], width: 9 },
    { type: 'schalter', at: [2.5, 0, -8], id: 'm1' },
    { type: 'messband', from: [-2.3, 0, -7], to: [-2.3, 0, -20], width: 3, id: 'm1', kante: 5 },
    { type: 'weg', from: [-2.3, 0, -20], to: [-2.3, 0, -30], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [-2.3, 0, -27] }
  ]),
  // Sägemehl bremst
  lv('saegemehl', 'Sägemehl', [
    anlauf(-4),
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -14], width: 5, walls: 0.8, surface: 'saegemehl' },
    { type: 'weg', from: [0, 0, -14], to: [0, 0, -22], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -19] }
  ])
];
