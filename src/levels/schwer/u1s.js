// Korallenriff 💀: Weggabelung (schmaler Korallengrat in der Seitenströmung oder Gang mit Riesenmuschel),
// Korallen-Irrgarten mit Löchern und Strömung, Meeresströmung (Fluss) mit Korallen, Brücke im Querstrom,
// zwei zuschnappende Riesenmuscheln vor der Schatztruhe.
export default {
  id: 'u1s', schwer: 'u1', name: 'Strudel im Korallenriff', emoji: '🪸', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -14,
  parts: [
    // Start: die Strömung schiebt vorwärts
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -10], width: 5, walls: 0.8, caps: 'start' },
    { type: 'wind', at: [0, 0, -5], size: [5, 3, 4], yaw: 0, strength: 4 },
    { type: 'weg', from: [0, 0, -10], to: [0, 0, -14], width: 9 },
    // links: schmaler Korallengrat ohne Rand, Seitenströmung nach links (Bonusstern)
    { type: 'weg', from: [-3.2, 0, -14], to: [-3.2, 0, -34], width: 1.6 },
    { type: 'wind', at: [-3.2, 0, -25], size: [8, 3, 4], yaw: 90, strength: 2.5 },
    // rechts: Gang mit einer Riesenmuschel, die zuschnappt
    { type: 'weg', from: [3, 0, -14], to: [3, 0, -34], width: 3.2, walls: 0.8 },
    { type: 'hammer', at: [3, 0, -24], side: 1, length: 4, size: [2.8, 1.4, 1.6], farbe: 'lila' },
    { type: 'weg', from: [0, 0, -34], to: [0, 0, -40], width: 9 },
    { type: 'checkpoint', at: [0, 0, -37], size: [9, 3, 3] },
    // Korallen-Irrgarten: Löcher, Korallenblöcke, Strömung nach links
    {
      type: 'feld', at: [0, 0, -40], cell: 2, map: [
        '..#..',
        '.w##.',
        'w.w#.',
        '..w#w',
        '.###.',
        'w#.w.',
        '.#w..',
        '.#.w.',
        '.##w.',
        '#####'
      ]
    },
    { type: 'wind', at: [0, 0, -47], size: [6, 3, 10], yaw: 90, strength: 2 },
    { type: 'weg', from: [0, 0, -60], to: [0, 0, -66], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -63], size: [4, 3, 3] },
    // Meeresströmung hinunter, Korallen im Weg
    { type: 'fluss', from: [0, 0, -66], to: [0, -5, -90], width: 3.6, speed: 4 },
    { type: 'deko', form: 'koralle', at: [-0.9, -2.35, -74], scale: 0.4, fest: true },
    { type: 'deko', form: 'koralle', at: [0.9, -4, -82], scale: 0.4, fest: true, farbe: 0xB388FF },
    { type: 'weg', from: [0, -5.7, -90], to: [0, -5.7, -96], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, -5.7, -93], size: [6, 3, 3] },
    // Kurve nach rechts, Brücke ohne Rand im Querstrom (abwechselnd nach vorne und hinten)
    { type: 'kurve', at: [0, -5.7, -96], yaw: 0, turn: 90, radius: 5, width: 4, walls: 0.8 },
    { type: 'weg', from: [5, -5.7, -101], to: [27, -5.7, -101], width: 2 },
    { type: 'wind', at: [11, -5.7, -101], size: [4, 3, 5], yaw: 0, strength: 3 },
    { type: 'wind', at: [20, -5.7, -101], size: [4, 3, 5], yaw: 180, strength: 3 },
    { type: 'weg', from: [27, -5.7, -101], to: [31, -5.7, -101], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [29, -5.7, -101], yaw: -90, size: [4, 3, 3] },
    { type: 'kurve', at: [31, -5.7, -101], yaw: -90, turn: -90, radius: 5, width: 4, walls: 0.8 },
    // Muschel-Allee: zwei Riesenmuscheln schnappen abwechselnd zu, kein Rand
    { type: 'weg', from: [36, -5.7, -106], to: [36, -5.7, -126], width: 3 },
    { type: 'hammer', at: [36, -5.7, -112], side: 1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'rot' },
    { type: 'hammer', at: [36, -5.7, -119], side: -1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'lila', offset: 1.74 },
    { type: 'weg', from: [36, -5.7, -126], to: [36, -5.7, -136], width: 6, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [36, -5.7, -128], size: [6, 3, 3] },
    { type: 'ziel', at: [36, -5.7, -133] },

    // Riff
    { type: 'deko', form: 'koralle', at: [-7, 0, -20], scale: 1.4 },
    { type: 'deko', form: 'koralle', at: [8.5, 0, -30], scale: 1.2, farbe: 0xFFD54F },
    { type: 'deko', form: 'fisch', at: [-6, 2.5, -8], yaw: 20, scale: 1.2 },
    { type: 'deko', form: 'fisch', at: [7, 1, -52], yaw: -70, farbe: 0x4FC3F7 },
    { type: 'deko', form: 'muschel', at: [-7, 0, -38], scale: 1.2 },
    { type: 'deko', form: 'seestern', at: [-6, -5.7, -94], yaw: 20 },
    { type: 'deko', form: 'anker', at: [16, -9, -107], yaw: 30 },
    { type: 'deko', form: 'fisch', at: [16, -3, -95], yaw: 90, farbe: 0xFFEB3B },
    { type: 'deko', form: 'truhe', at: [37.5, -5.7, -135], scale: 0.5 },
    { type: 'deko', form: 'koralle', at: [33, -5.7, -132], scale: 0.6, farbe: 0xB388FF },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [3, 0.9, -24] },
    { type: 'stern', at: [0, 0.9, -51] },
    { type: 'stern', at: [2, 0.9, -57] },
    { type: 'stern', at: [0, -2.1, -78] },
    { type: 'stern', at: [16, -4.8, -101] },
    { type: 'stern', at: [36, -4.8, -115.5] },
    { type: 'stern', at: [-3.2, 0.9, -27], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [-3.5, 0, -36.5], to: [-2.6, 0, -40.2], count: 3 },
    { type: 'domino', at: [38, -5.7, -130], yaw: 1 },
    { type: 'domino', at: [-1.5, -5.7, -94], yaw: -33 },
    { type: 'domino', at: [31, -5.7, -100], yaw: -95 },
    { type: 'domino', at: [0, 0, -10.5], yaw: -57 }
  ]
};
