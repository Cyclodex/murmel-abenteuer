// Garten 1 💀: Wasserschlacht. Schlammbeet mit Maulwurfslöchern, Gartenschlauch hoch aufs Deck,
// Weggabelung (schmales Brett mit Schlauch-Wasserstrahlen oder Rasen mit Rasensprenger), zwei Gartenhämmer,
// Bach mit Steinen, Planschbecken (wäscht) und zwei Rasensprenger vor dem Ziel.
export default {
  id: 'g1s', schwer: 'g1', name: 'Wasserschlacht', emoji: '💦', theme: 'garten',
  start: [0, 0, 2], killY: -5,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // Schlammbeet mit Löchern: im Zickzack hindurch
    { type: 'feld', at: [0, 0, -4], cell: 2, walls: 0.8, map: [
      'sssss',
      '.s...',
      '.sss.',
      '...s.',
      '.sss.',
      '.s.s.',
      'ss.ss',
      'sssss'
    ] },
    { type: 'wand', from: [-5.4, 0, -4.2], to: [-2.9, 0, -4.2] },
    { type: 'wand', from: [2.9, 0, -4.2], to: [5.4, 0, -4.2] },
    { type: 'wand', from: [-5.4, 0, -19.8], to: [-2.9, 0, -19.8] },
    { type: 'wand', from: [2.9, 0, -19.8], to: [5.4, 0, -19.8] },
    // Pfütze wäscht den Schlamm ab
    { type: 'weg', from: [0, 0, -20], to: [0, 0, -26], width: 5, walls: 0.8, surface: 'pfuetze' },
    { type: 'checkpoint', at: [0, 0, -22.5], size: [5, 3, 3] },
    // Gartenschlauch hoch aufs Deck
    { type: 'weg', from: [0, 0, -26], to: [0, 0, -30], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -26], to: [-1.2, 0, -26] },
    { type: 'wand', from: [1.2, 0, -26], to: [2.7, 0, -26] },
    { type: 'roehre', from: [0, 0, -28], yaw: 0, to: [0, 5, -44], toYaw: 0, bogen: 4 },
    { type: 'weg', from: [0, 5, -42], to: [0, 5, -50], width: 8, walls: 0.8, caps: 'start' },
    { type: 'checkpoint', at: [0, 5, -47], size: [8, 3, 3] },
    // Gabelung links: schmales Brett ohne Rand, zwei Schläuche spritzen quer darüber
    { type: 'weg', from: [-3.2, 5, -50], to: [-3.2, 5, -72], width: 1.6 },
    { type: 'wind', at: [-3.2, 5, -56], size: [3, 3, 4], yaw: -90, strength: 5, look: 'schlauch' },
    { type: 'wind', at: [-3.2, 5, -65], size: [3, 3, 4], yaw: 90, strength: 5, look: 'schlauch' },
    // Gabelung rechts: Rasen mit Rasensprenger (sicher, aber nass und lang)
    { type: 'weg', from: [5, 5, -50], to: [5, 5, -72], width: 10 },
    { type: 'wand', from: [4.2, 5, -49.8], to: [10.4, 5, -49.8] },
    { type: 'wand', from: [10.2, 5, -50], to: [10.2, 5, -72] },
    { type: 'wand', from: [-0.2, 5, -50], to: [-0.2, 5, -72] },
    { type: 'wand', from: [-0.4, 5, -72.2], to: [5.5, 5, -72.2] },
    { type: 'sprenger', at: [5, 5, -61], length: 8, speed: 60, strength: 9 },
    // Wiese: die Wege kommen wieder zusammen
    { type: 'weg', from: [3, 5, -72], to: [3, 5, -78], width: 14 },
    { type: 'wand', from: [-4.2, 5, -78.2], to: [1.5, 5, -78.2] },
    { type: 'wand', from: [4.5, 5, -78.2], to: [10.2, 5, -78.2] },
    { type: 'checkpoint', at: [3, 5, -75], size: [14, 3, 3] },
    // Steg mit zwei Gartenhämmern
    { type: 'weg', from: [3, 5, -78], to: [3, 5, -96], width: 3 },
    { type: 'hammer', at: [3, 5, -83], side: 1, length: 4, farbe: 'gruen' },
    { type: 'hammer', at: [3, 5, -90], side: -1, length: 4, farbe: 'gelb', offset: 1.74 },
    { type: 'weg', from: [3, 5, -96], to: [3, 5, -100], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [3, 5, -98], size: [5, 3, 3] },
    // Bach mit Steinen
    { type: 'fluss', from: [3, 5, -100], to: [3, 1, -120], width: 3.6, speed: 4 },
    { type: 'deko', form: 'stein', at: [2, 3.1, -106], scale: 0.45, fest: true },
    { type: 'deko', form: 'stein', at: [4, 1.7, -113], scale: 0.45, fest: true },
    { type: 'weg', from: [3, 0.3, -120], to: [3, 0.3, -121.5], width: 3.6, walls: 0.8 },
    // Planschbecken: über den Rand hinein, vorne durch die Lücke hinaus, das Wasser wäscht
    { type: 'schuessel', at: [3, -0.9, -127], r: 3, R: 5, h: 1.2, rim: 0.5, art: 'schuessel', surface: 'pfuetze', offen: [0] },
    { type: 'weg', from: [3, -0.9, -129.5], to: [3, -0.9, -134], width: 2.4, walls: 0.6 },
    { type: 'checkpoint', at: [3, -0.9, -132.5], size: [2.4, 3, 2] },
    // Rasen ohne Rand mit zwei Rasensprengern
    { type: 'weg', from: [3, -0.9, -134], to: [3, -0.9, -152], width: 4 },
    { type: 'sprenger', at: [6.5, -0.9, -140], length: 9, speed: 60, strength: 10 },
    { type: 'sprenger', at: [-0.5, -0.9, -147], length: 9, speed: -60, strength: 10 },
    { type: 'weg', from: [3, -0.9, -152], to: [3, -0.9, -158], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [3, -0.9, -155] },

    // Garten
    { type: 'deko', form: 'giesskanne', at: [-4, 0, 3], yaw: -30, scale: 0.4 },
    { type: 'deko', form: 'eimer', at: [3.5, 0, -1], scale: 0.3, farbe: 0xE53935 },
    { type: 'deko', form: 'zwerg', at: [8.5, 5, -44], yaw: 20, scale: 0.4 },
    { type: 'deko', form: 'blume', at: [-3, 5, -75.5], scale: 0.5 },
    { type: 'deko', form: 'blume', at: [9, 5, -76], scale: 0.5, farbe: 0xB388FF },
    { type: 'deko', form: 'baum', at: [16, -6, -90] },
    { type: 'deko', form: 'baum', at: [-12, -6, -130], scale: 1.2 },
    { type: 'deko', form: 'zwerg', at: [8, -0.9, -156], yaw: 40, scale: 0.5, farbe: 0xE53935 },
    { type: 'deko', form: 'giesskanne', at: [-3, -0.9, -156], yaw: 30, scale: 0.4 },

    { type: 'stern', at: [0, 0.9, -1] },
    { type: 'stern', at: [2, 0.9, -13] },
    { type: 'stern', at: [0, 6.4, -36] },
    { type: 'stern', at: [8.5, 5.9, -61] },
    { type: 'stern', at: [3, 5.9, -83] },
    { type: 'stern', at: [3, 3.5, -109] },
    { type: 'stern', at: [3, 0, -127] },
    { type: 'stern', at: [3, 0, -143.5] },
    { type: 'stern', at: [-3.2, 5.9, -60.5], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [5.8, 5, -66.5], to: [6.5, 5, -70.2], count: 3 },
    { type: 'domino', at: [4.3, -0.9, -150.5], yaw: -7 },
    { type: 'domino', at: [-3.2, 5, -45], yaw: 7 },
    { type: 'domino', at: [1.8, -0.9, -135.5], yaw: -7 },
    { type: 'domino', at: [8.3, 5, -53], yaw: -45 }
  ]
};
