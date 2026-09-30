// Prüfstand, Kräfte, Wasser und Felder. Alle starten bei [0, 0, 2] und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, parts, extra) => ({ id: 'p-' + id, name, emoji: '🔧', theme: 'spielzimmer', start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });

export default [
  // Seitenwind auf einer Brücke ohne Rand: Ventilator nach rechts, Gartenschlauch nach links (wie Garten 2 und Garten 1 schwer)
  lv('wind', 'Wind', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -22], width: 4 },
    { type: 'wind', at: [0, 0, -10], size: [4, 3, 3], yaw: -90, strength: 5 },
    { type: 'wind', at: [0, 0, -17.5], size: [4, 3, 3], yaw: 90, strength: 5, look: 'schlauch' },
    { type: 'weg', from: [0, 0, -22], to: [0, 0, -30], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -27] }
  ]),
  // Aufwind hinauf auf eine Terrasse (wie Garten 2)
  lv('aufwind', 'Aufwind', [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -10], width: 5, walls: 0.8, caps: 'both' },
    { type: 'wind', at: [0, 0, -8], size: [4, 7, 4], up: true, strength: 16 },
    { type: 'weg', from: [0, 6, -10], to: [0, 6, -24], width: 5 },
    { type: 'wand', from: [2.7, 6, -10], to: [2.7, 6, -24] },
    { type: 'wand', from: [-2.7, 6, -10], to: [-2.7, 6, -24] },
    { type: 'wand', from: [-2.9, 6, -24.2], to: [2.9, 6, -24.2] },
    { type: 'ziel', at: [0, 6, -20] }
  ]),
  // Anziehende Magnete neben einer Brücke ohne Rand, wenig Schwerkraft (wie Weltraum 3)
  lv('magnet', 'Magnet', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -28], width: 3 },
    { type: 'magnet', at: [4, 0, -11], radius: 4.5, strength: 8 },
    { type: 'magnet', at: [-4, 0, -20], radius: 4.5, strength: 8 },
    { type: 'weg', from: [0, 0, -28], to: [0, 0, -34], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -31] }
  ], { theme: 'weltraum', physik: { schwerkraft: 0.45, abprall: 0.5 }, killY: -10 }),
  // Abstossende Magnete auf einem Steg ohne Rand (wie Vulkan 3)
  lv('magnet-ab', 'Magnet abstossend', [
    anlauf(-6, 4),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -18], width: 3 },
    { type: 'magnet', at: [-1.2, 0, -10], radius: 2.2, strength: -5 },
    { type: 'magnet', at: [1.2, 0, -15], radius: 2.2, strength: -5 },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -24], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -21] }
  ]),
  // Rasen ohne Rand mit zwei Rasensprengern, abwarten bis der Strahl vorbei ist (wie Garten 1 schwer)
  lv('sprenger', 'Rasensprenger', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -24], width: 4 },
    { type: 'sprenger', at: [3.5, 0, -12], length: 9, speed: 60, strength: 10 },
    { type: 'sprenger', at: [-3.5, 0, -19], length: 9, speed: -60, strength: 10 },
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -30], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -27] }
  ]),
  // Zwei Herdplatten mitten auf dem Weg: die Murmel hüpft darüber (wie Küche 1 schwer)
  lv('herdplatte', 'Herdplatte', [
    anlauf(),
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -24], width: 5, walls: 0.8, caps: 'end' },
    { type: 'herdplatte', at: [0, 0, -10], r: 1.3 },
    { type: 'herdplatte', at: [0, 0, -16], r: 2.2 },
    { type: 'ziel', at: [0, 0, -21] }
  ]),
  // Bach bergab, trägt die Murmel mit (leichte schwimmen, schwere rollen am Grund; wie Garten 1 schwer)
  lv('fluss', 'Fluss', [
    anlauf(),
    { type: 'fluss', from: [0, 0, -6], to: [0, -4, -26], width: 3.6, speed: 4 },
    { type: 'weg', from: [0, -4.7, -26], to: [0, -4.7, -32], width: 3.6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -4.7, -29] }
  ]),
  // Feld mit Löchern: im Zickzack hindurch (Plan wie das Schlammbeet in Garten 1 schwer, hier normaler Boden)
  lv('feld', 'Feld mit Löchern', [
    anlauf(),
    { type: 'feld', at: [0, 0, -6], cell: 2, walls: 0.8, map: [
      '#####',
      '.#...',
      '.###.',
      '...#.',
      '.###.',
      '.#.#.',
      '##.##',
      '#####'
    ] },
    { type: 'wand', from: [-5.4, 0, -6.2], to: [-2.9, 0, -6.2] },
    { type: 'wand', from: [2.9, 0, -6.2], to: [5.4, 0, -6.2] },
    { type: 'wand', from: [-5.4, 0, -21.8], to: [-2.9, 0, -21.8] },
    { type: 'wand', from: [2.9, 0, -21.8], to: [5.4, 0, -21.8] },
    { type: 'weg', from: [0, 0, -22], to: [0, 0, -28], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -25] }
  ]),
  // Nagelwand: oben hineinrollen, 14 m von Nagel zu Nagel hinunter, unten weiter (wie Ausflug schwer)
  lv('nagelbrett', 'Nagelbrett', [
    anlauf(-6, 4),
    { type: 'nagelbrett', at: [0, 0, -6], breite: 10, hoehe: 14 },
    { type: 'weg', from: [0, -14, -4.5], to: [0, -14, -20], width: 11, walls: 0.8, caps: 'both' },
    { type: 'ziel', at: [0, -14, -16] }
  ], { killY: -22 })
];
