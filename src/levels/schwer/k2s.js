// Küche 2 💀: Backstube. Teller ohne Rand mit riesigem Schneebesen, hinein in die Rührschüssel mit zwei Rührbesen,
// zähe Teigbahn unter dem Fleischklopfer, Weggabelung (Eierkarton mit Löchern oder Weg mit Rührbesen),
// Tellerstapel als Treppe hinunter und zum Schluss abstossende Magnete auf dem schmalen Kochlöffel.
export default {
  id: 'k2s', schwer: 'k2', name: 'Wirbel in der Backstube', emoji: '🧁', theme: 'kueche',
  start: [0, 0, 2], killY: -14,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -9.6], width: 2.4 },
    // Teller mit flachem Rand, ein riesiger Schneebesen dreht darüber
    { type: 'schuessel', at: [0, 0, -15], r: 5.5, R: 6.5, h: 0.6, rim: 0.4, art: 'schuessel', offen: [180, 0] },
    { type: 'balken', at: [0, 0, -15], length: 10, speed: 40, farbe: 'blau' },
    { type: 'weg', from: [0, 0, -20.4], to: [0, 0, -23], width: 2.4 },
    { type: 'checkpoint', at: [0, 0, -22], size: [2.4, 3, 2] },
    // Rampe hinauf auf den Rand der Rührschüssel, drinnen zwei Rührbesen, vorne hinaus durch die Lücke
    { type: 'weg', from: [0, 0, -23], to: [0, 2.5, -30.6], width: 2.6 },
    { type: 'schuessel', at: [0, 0, -38], r: 4, R: 7, h: 2.5, rim: 0.5, art: 'schuessel', offen: [0] },
    { type: 'balken', at: [-2.2, 0, -38], length: 3.4, speed: 60, farbe: 'gelb' },
    { type: 'balken', at: [2.2, 0, -38], length: 3.4, speed: -60, farbe: 'gruen' },
    // zähe Teigbahn, der Fleischklopfer haut drauf
    { type: 'weg', from: [0, 0, -41.8], to: [0, 0, -46], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -44], size: [3, 3, 3] },
    { type: 'weg', from: [0, 0, -46], to: [0, 0, -58], width: 3, walls: 0.8, surface: 'schlamm' },
    { type: 'hammer', at: [0, 0, -53], side: 1, length: 4, size: [2.4, 1.4, 1.2], up: 2 },
    { type: 'weg', from: [0, 0, -58], to: [0, 0, -64], width: 14, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -61], size: [14, 3, 3] },
    { type: 'domino', at: [-5, 0, -59.5], yaw: 15 },
    { type: 'domino', at: [5.5, 0, -59.5], yaw: -20 },
    // Gabelung links: Eierkarton mit Löchern (kurz, Bonusstern)
    { type: 'feld', at: [-4, 0, -64], cell: 2, look: 'kachel-gelb', map: [
      '####',
      '.##.',
      '.#..',
      '.##.',
      '..#.',
      '.##.',
      '.#..',
      '####'
    ] },
    // rechts: Weg mit Rand und einem Rührbesen
    { type: 'weg', from: [5, 0, -64], to: [5, 0, -80], width: 4, walls: 0.8 },
    { type: 'balken', at: [5, 0, -72], length: 3.6, speed: 70, farbe: 'rot' },
    { type: 'weg', from: [0, 0, -80], to: [0, 0, -86], width: 14, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -83], size: [14, 3, 3] },
    { type: 'domino', at: [-5, 0, -83.5], yaw: -10 },
    { type: 'domino', at: [5, 0, -84.5], yaw: 20 },
    // Tellerstapel hinunter
    { type: 'treppe', from: [0, 0, -86], to: [0, -6, -100], steps: 6, width: 4, walls: 0.6 },
    // schmaler Kochlöffel ohne Rand mit abstossenden Magneten
    { type: 'weg', from: [0, -6, -100], to: [0, -6, -104], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, -6, -102], size: [4, 3, 3] },
    { type: 'weg', from: [0, -6, -104], to: [0, -6, -120], width: 2.4, look: 'ramp' },
    { type: 'magnet', at: [-1.2, -6, -109], radius: 2.5, strength: -5 },
    { type: 'magnet', at: [1.2, -6, -115], radius: 2.5, strength: -5 },
    { type: 'weg', from: [0, -6, -120], to: [0, -6, -127], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -6, -124] },

    // Backstube
    { type: 'deko', form: 'milch', at: [-6, -15, -4], yaw: 20, scale: 2 },
    { type: 'deko', form: 'kaese', at: [10, -15, -14], yaw: -30, scale: 3 },
    { type: 'deko', form: 'teekanne', at: [-15, -15, -36], yaw: 40, scale: 2.5 },
    { type: 'deko', form: 'glas', at: [9, -15, -46], scale: 2.5 },
    { type: 'deko', form: 'loeffel', at: [-9, -15, -52], yaw: 15, scale: 2 },
    { type: 'deko', form: 'tasse', at: [15, -15, -72], yaw: -60, scale: 3, farbe: 0xFFD54F },
    ...Array.from({ length: 12 }, (_, i) => ({ type: 'deko', form: 'teller', at: [8, -15 + i * 0.72, -93], scale: 1.2 })),
    { type: 'deko', form: 'apfel', at: [-8, -15, -112], scale: 2.5 },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -15] },
    { type: 'stern', at: [0, 0.9, -38] },
    { type: 'stern', at: [0, 0.9, -50] },
    { type: 'stern', at: [0, 0.9, -83] },
    { type: 'stern', at: [0, -2.9, -94.2], r: 1.8 },
    { type: 'stern', at: [0, -5.1, -112] },
    { type: 'stern', at: [-3, 0.9, -71], bonus: true }
  ]
};
