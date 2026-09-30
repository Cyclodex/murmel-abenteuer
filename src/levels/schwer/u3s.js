// Schatztruhe 💀: im versunkenen Piratenschiff. Gabelung auf dem Deck (Strömungsband über Falltür-Planken
// oder kaputte Planken mit Löchern), zwei Seetang-Räder im Laderaum ohne Rand, Kanonendeck mit Kisten-Schiebern
// und Riesenmuschel, Muschel-Dominos, Röhre in die Schatzkammer mit Löchern und Magnet-Anker.
export default {
  id: 'u3s', schwer: 'u3', name: 'Das versunkene Piratenschiff', emoji: '⚓', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 9, walls: 0.8, caps: 'start' },
    // rechts: Strömungsband, dann Planken mit Falltüren (schnell drüber!)
    { type: 'band', from: [2, 0, -6], to: [2, 0, -19], width: 3, speed: 6 },
    { type: 'weg', from: [2, 0, -19], to: [2, 0, -21], width: 3 },
    { type: 'falltuer', at: [2, 0, -22.5], size: [3, 3] },
    { type: 'weg', from: [2, 0, -24], to: [2, 0, -26], width: 3 },
    { type: 'falltuer', at: [2, 0, -27.5], size: [3, 3] },
    { type: 'weg', from: [2, 0, -29], to: [2, 0, -31], width: 3 },
    { type: 'falltuer', at: [2, 0, -32.5], size: [3, 3] },
    // links: schmaler Mastbaum, dann kaputte Planken mit Löchern und Sand (Bonusstern)
    { type: 'weg', from: [-3, 0, -6], to: [-3, 0, -20], width: 1.6 },
    {
      type: 'feld', at: [-3, 0, -20], cell: 2, map: [
        '..#',
        '.##',
        '.#.',
        'a#.',
        '#.w',
        '##.',
        '.#.'
      ]
    },
    { type: 'weg', from: [-1, 0, -34], to: [-1, 0, -40], width: 11 },
    { type: 'checkpoint', at: [-1, 0, -37], size: [11, 3, 3] },
    // Laderaum: zwei Seetang-Räder, kein Rand
    { type: 'weg', from: [0, 0, -40], to: [0, 0, -57], width: 8 },
    { type: 'balken', at: [0, 0, -44], length: 6, speed: 40, farbe: 'gruen' },
    { type: 'balken', at: [0, 0, -53], length: 6, speed: -40, farbe: 'gruen' },
    { type: 'weg', from: [0, 0, -57], to: [0, 0, -60], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -58.5], size: [6, 3, 3] },
    // Kanonendeck: schmaler Steg, Kisten schieben von der Seite, am Ende schnappt eine Riesenmuschel
    { type: 'weg', from: [0, 0, -60], to: [0, 0, -80], width: 2.4 },
    { type: 'schieber', from: [-4, 0, -64], to: [-0.5, 0, -64], size: [3, 1, 1.6], time: 1, pause: 1.5, look: 'klotz-orange' },
    { type: 'schieber', from: [4, 0, -70], to: [0.5, 0, -70], size: [3, 1, 1.6], time: 1, pause: 1.5, offset: 1.25, look: 'klotz-orange' },
    { type: 'hammer', at: [0, 0, -76], side: 1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'blau' },
    { type: 'weg', from: [0, 0, -80], to: [0, 0, -84], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -82], size: [5, 3, 3] },
    // Muschel-Dominos
    { type: 'weg', from: [0, 0, -84], to: [0, 0, -98], width: 5, walls: 0.8 },
    { type: 'domino', from: [0, 0, -87], to: [0, 0, -95], count: 5, quer: 3 },
    // Röhre hinauf in die Schatzkammer
    { type: 'weg', from: [0, 0, -98], to: [0, 0, -102], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -98], to: [-1.2, 0, -98] },
    { type: 'wand', from: [1.2, 0, -98], to: [2.7, 0, -98] },
    { type: 'roehre', from: [0, 0, -100], yaw: 0, to: [0, 4, -112], toYaw: 0, bogen: 4, farbe: 0x4DD0E1 },
    { type: 'weg', from: [0, 4, -110], to: [0, 4, -114], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 4, -113], size: [6, 3, 3] },
    // Schatzkammer: Löcher, Schatzkisten, ein Magnet-Anker zieht zum Loch
    {
      type: 'feld', at: [0, 4, -114], cell: 2, map: [
        '.##.',
        '###.',
        '#.#.',
        'w.#.',
        '.##.',
        '.#..',
        '.#.w',
        '####'
      ]
    },
    { type: 'magnet', at: [1, 4, -119], radius: 3, strength: 5 },
    { type: 'weg', from: [0, 4, -130], to: [0, 4, -138], width: 8, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 4, -134] },

    // Wrack und Meer
    { type: 'klotz', at: [9, 4, -26], size: [0.9, 12, 0.9], look: 'klotz-orange', deko: true },
    { type: 'klotz', at: [9, 7, -26], size: [6, 0.5, 0.5], look: 'klotz-orange', deko: true },
    { type: 'deko', form: 'anker', at: [-9, 0, -12], yaw: 30 },
    { type: 'deko', form: 'fisch', at: [6, 3, -45], yaw: 90, scale: 1.3, farbe: 0xFFEB3B },
    { type: 'deko', form: 'koralle', at: [-7, 0, -50], scale: 1.2 },
    { type: 'deko', form: 'fisch', at: [-5, 2, -72], yaw: -30, farbe: 0x4FC3F7 },
    { type: 'deko', form: 'muschel', at: [3.6, 0, -82], scale: 0.4, farbe: 0xF8BBD0 },
    { type: 'deko', form: 'truhe', at: [3, 5.2, -115], yaw: 20, scale: 0.4 },
    { type: 'deko', form: 'truhe', at: [-3, 5.2, -123], yaw: -15, scale: 0.4 },
    { type: 'deko', form: 'truhe', at: [0, 4, -136.5], scale: 0.7 },
    { type: 'deko', form: 'seestern', at: [3, 4, -132], yaw: 40, scale: 0.4 },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -48.5] },
    { type: 'stern', at: [0, 0.9, -67] },
    { type: 'stern', at: [0, 0.9, -76] },
    { type: 'stern', at: [0, 0.9, -96.5] },
    { type: 'stern', at: [0, 5.9, -106] },
    { type: 'stern', at: [-3, 4.9, -125] },
    { type: 'stern', at: [-5, 0.9, -25], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [-3.5, 0, -36], to: [-2.9, 0, -39.8], count: 3 },
    { type: 'domino', at: [3, 4, -136], yaw: -194 },
    { type: 'domino', at: [3.5, 0, -3], yaw: -19 },
    { type: 'domino', at: [-2.5, 4, -114.5], yaw: 10 },
    { type: 'domino', at: [2, 0, -58], yaw: 5 }
  ]
};
