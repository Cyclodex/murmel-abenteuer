// Prüfstand, Bahnteile: Rampe, Kurve, Looping, Spirale, Trampolin, Rutsche, Trichter, Röhre, Band, Treppe, Oberflächen
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
  ]),
  // Spirale: eine Runde, 4 m hinunter (wie in Vulkan 3)
  lv('spirale', 'Spirale', [
    anlauf(-6, 3),
    { type: 'spirale', at: [0, 0, -6], yaw: 0, turn: 360, rise: -4, radius: 4, width: 3, walls: 0.6 },
    { type: 'weg', from: [0, -4, -6], to: [0, -4, -14], width: 3, walls: 0.6, caps: 'end' },
    { type: 'ziel', at: [0, -4, -12] }
  ]),
  // Trampolin im schmalen Schlitz, hinauf auf den Absatz, dort ein Stern (wie der Toaster in Küche 1 schwer)
  lv('trampolin', 'Trampolin', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 3.4 },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.7, 0, -6] },
    { type: 'wand', from: [1.7, 0, -6], to: [2.7, 0, -6] },
    { type: 'trampolin', at: [0, 0, -9], size: [3, 1.6], jump: 10, tempo: 4 },
    { type: 'weg', from: [0, 3, -13], to: [0, 3, -24], width: 5, walls: 0.8, caps: 'end' },
    { type: 'stern', at: [0, 3.9, -19] },
    { type: 'ziel', at: [0, 3, -21] }
  ]),
  // Gerade Rutsche hinunter (wie in Spielzimmer 5)
  lv('rinne', 'Rutsche', [
    anlauf(-6, 4),
    { type: 'rinne', from: [0, 0, -6], to: [0, -4, -20], r: 1.6, bogen: 75, farbe: 0x42A5F5 },
    { type: 'weg', from: [0, -4, -20], to: [0, -4, -28], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -4, -25] }
  ]),
  // Rutsche mit Steilkurve links (wie die Lava-Rinne in Vulkan 2)
  lv('rinnenkurve', 'Rutschenkurve', [
    anlauf(-6, 2.6),
    { type: 'rinne', from: [0, 0, -6], to: [0, -2, -16], r: 1.6, bogen: 80, farbe: 0xFF5722 },
    { type: 'rinne', at: [0, -2, -16], yaw: 0, turn: -90, radius: 6, rise: -1, r: 1.6, bogen: 80, farbe: 0xE64A19 },
    { type: 'weg', from: [-6, -3, -22], to: [-16, -3, -22], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [-13, -3, -22] }
  ]),
  // Spiraltrichter: schräg über die Bande hinein, darunter fängt eine Schüssel auf (wie in Spielzimmer 5)
  lv('trichter', 'Trichter', [
    anlauf(-6, 3.2),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 3.2, walls: 0.6 },
    { type: 'weg', from: [0, 0, -10], to: [3, 0, -15.2], width: 3.2, walls: 0.6 },
    { type: 'trichter', at: [10.5, -5.35, -15.2], R: 6, h: 3.5, loch: 0.9, rim: 1.2, farbe: 0xFFB300 },
    { type: 'schuessel', at: [10.5, -10, -15.2], r: 2, R: 4.5, h: 2, rim: 0.5, art: 'schuessel', offen: [0] },
    { type: 'weg', from: [10.5, -10, -17.1], to: [10.5, -10, -26], width: 3, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [10.5, -10, -23] }
  ], { killY: -14 }),
  // Röhre: die Murmel fliegt geführt durch den Schlauch (wie in Garten 1)
  lv('roehre', 'Röhre', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.2, 0, -6] },
    { type: 'wand', from: [1.2, 0, -6], to: [2.7, 0, -6] },
    { type: 'roehre', from: [0, 0, -8], yaw: 0, to: [0, 0, -26], toYaw: 0, bogen: 5 },
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -32], width: 5, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.9, 0, -23.8], to: [2.9, 0, -23.8] },
    { type: 'ziel', at: [0, 0, -29] }
  ]),
  // Förderband gegen die Fahrtrichtung (wie in Vulkan 2)
  lv('band', 'Förderband', [
    anlauf(-6, 3),
    { type: 'band', from: [0, 0, -18], to: [0, 0, -6], width: 3, walls: 0.6, speed: 3, grip: 1 },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -26], width: 3, walls: 0.6, caps: 'end' },
    { type: 'ziel', at: [0, 0, -23] }
  ]),
  // Treppe hinunter, 6 Stufen (wie der Tellerstapel in Küche 2 schwer)
  lv('treppe', 'Treppe', [
    anlauf(-6, 4),
    { type: 'treppe', from: [0, 0, -6], to: [0, -6, -20], steps: 6, width: 4, walls: 0.6 },
    { type: 'weg', from: [0, -6, -20], to: [0, -6, -28], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -6, -25] }
  ], { killY: -12 }),
  // Oberflächen hintereinander: Eis, Schlamm, Pfütze, Sand, Seife, Handtuch
  lv('oberflaechen', 'Oberflächen', [
    anlauf(-4),
    ...['eis', 'schlamm', 'pfuetze', 'sand', 'seife', 'handtuch'].map((surface, k) =>
      ({ type: 'weg', from: [0, 0, -4 - 4 * k], to: [0, 0, -8 - 4 * k], width: 5, walls: 0.8, surface })),
    { type: 'weg', from: [0, 0, -28], to: [0, 0, -34], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -31] }
  ])
];
