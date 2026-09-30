// Prüfstand, Bahnteile: Rampe, Kurve, Looping, ...
// Alle starten bei [0, 0, 2] und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, parts, extra) => ({ id: 'p-' + id, name, emoji: '🔧', theme: 'spielzimmer', start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });

export default [
  // Rampe hinauf und hinunter
  lv('rampe', 'Rampe', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 2, -14], width: 5, walls: 0.8 },
    { type: 'weg', from: [0, 2, -14], to: [0, 2, -18], width: 5, walls: 0.8 },
    { type: 'weg', from: [0, 2, -18], to: [0, 0, -26], width: 5, walls: 0.8 },
    { type: 'weg', from: [0, 0, -26], to: [0, 0, -32], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -30] }
  ]),
  // Kurve rechts, dann links
  lv('kurve', 'Kurven', [
    anlauf(),
    { type: 'kurve', at: [0, 0, -6], yaw: 0, turn: 90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [5, 0, -11], to: [12, 0, -11], width: 5, walls: 0.8 },
    { type: 'kurve', at: [12, 0, -11], yaw: -90, turn: -90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [17, 0, -16], to: [17, 0, -24], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [17, 0, -22] }
  ]),
  // Looping mit Turbo davor (Tempo wie in Spielzimmer 4, die knappste Stelle)
  lv('looping', 'Looping', [
    anlauf(-6, 5),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 3, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.9, 0, -6] },
    { type: 'wand', from: [1.9, 0, -6], to: [2.7, 0, -6] },
    { type: 'turbo', at: [0, 0, -8.5], size: [2.6, 2], speed: 11.5 },
    { type: 'looping', at: [0, 0, -10], yaw: 0, radius: 3, width: 3, shift: 5 },
    { type: 'weg', from: [5, 0, -10], to: [5, 0, -20], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [5, 0, -17] }
  ])
];
