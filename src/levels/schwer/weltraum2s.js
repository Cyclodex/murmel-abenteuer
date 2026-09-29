// Weltraum 2 💀: Raumwerft im Asteroidengürtel. Kanone auf einen Asteroiden mit Kratern (Feld mit Löchern),
// Kanone zur Werft, Gabelung: Kanonen-Abkürzung auf einen Eis-Kometen (Bonusstern) oder Werftgang mit
// Luftschleusen-Schiebern und der Werft-Presse (Hammer), dann Pendel-Shuttle und Schuss zum Landeplatz.
export default {
  id: 'w2s', schwer: 'w2', name: 'Asteroiden-Werft', emoji: '☄️', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    // Start und erste Kanone
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -3], to: [0, 0, -8], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -3], to: [-1.5, 0, -3] },
    { type: 'wand', from: [1.5, 0, -3], to: [2.7, 0, -3] },
    { type: 'kanone', at: [0, 0, -6], target: [0, 3, -20.5], time: 3 },
    // Asteroid mit Kratern: um die Löcher herum steuern
    { type: 'feld', at: [0, 3, -19], cell: 2, look: 'ramp', map: [
      '.###.',
      '#####',
      '##.##',
      '#...#',
      '#..##',
      '##.##',
      '#####',
      '#####',
      '#####'
    ] },
    { type: 'checkpoint', at: [0, 3, -21], size: [10, 3, 4] },
    { type: 'wand', from: [-3, 3, -37], to: [-1.5, 3, -37] },
    { type: 'wand', from: [1.5, 3, -37], to: [3, 3, -37] },
    { type: 'weg', from: [0, 3, -37], to: [0, 3, -42], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'kanone', at: [0, 3, -40], target: [0, 8, -56], time: 2.6 },
    // Werft (Gabelung)
    { type: 'weg', from: [0, 8, -53], to: [0, 8, -64], width: 14 },
    { type: 'checkpoint', at: [0, 8, -59], size: [14, 3, 4] },
    { type: 'klotz', at: [-11, 7.5, -58], size: [5, 1, 5], look: 'neon-gelb', deko: true },
    { type: 'deko', form: 'rakete', at: [-11, 8, -58], scale: 1.4 },
    // links: Kanonen-Abkürzung auf einen schmalen Eis-Kometen (Bonusstern)
    { type: 'weg', from: [-5, 8, -64], to: [-5, 8, -69], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'kanone', at: [-5, 8, -67], target: [-5, 9, -80], time: 2.4 },
    { type: 'weg', from: [-5, 9, -77], to: [-5, 8, -100], width: 2, surface: 'eis' },
    // rechts: Werftgang mit Luftschleusen-Schiebern (ohne Rand) und der Werft-Presse
    { type: 'weg', from: [5, 8, -64], to: [5, 8, -70], width: 3, walls: 0.6 },
    { type: 'weg', from: [5, 8, -70], to: [5, 8, -88], width: 3 },
    { type: 'schieber', from: [8.6, 8, -75], to: [4.8, 8, -75], size: [2.4, 1.2, 2], time: 1.2, pause: 2, look: 'neon-pink' },
    { type: 'schieber', from: [8.6, 8, -82], to: [4.8, 8, -82], size: [2.4, 1.2, 2], time: 1.2, pause: 2, offset: 4.6, look: 'neon-pink' },
    { type: 'checkpoint', at: [5, 8, -86.5], size: [3, 3, 2] },
    { type: 'weg', from: [5, 8, -88], to: [5, 8, -100], width: 3, walls: 0.6 },
    { type: 'hammer', at: [5, 8, -94], side: 1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'orange' },
    // Treffpunkt
    { type: 'weg', from: [0, 8, -100], to: [0, 8, -110], width: 14 },
    { type: 'checkpoint', at: [0, 8, -104], size: [14, 3, 4] },
    // Pendel-Shuttle zur Abschuss-Station
    { type: 'weg', from: [0, 8, -110], to: [0, 8, -113], width: 3 },
    { type: 'plattform', from: [0, 8, -115], to: [0, 8, -127], size: [4, 4], time: 2.5, pause: 1.5 },
    { type: 'weg', from: [0, 8, -129], to: [0, 8, -138], width: 4, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [0, 8, -131], size: [4, 3, 3] },
    { type: 'kanone', at: [0, 8, -135], target: [0, 4, -155], time: 2.5 },
    // Landeplatz
    { type: 'weg', from: [0, 4, -150], to: [0, 4, -164], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 4, -160] },
    // Weltraum rundherum
    { type: 'deko', form: 'satellit', at: [14, 12, -90], dreh: 25 },
    { type: 'deko', form: 'ufo', at: [-14, 14, -130], dreh: 50, farbe: 0xFF4081 },
    { type: 'deko', form: 'kristall', at: [-9, 0, -30], farbe: 0x80DEEA },
    { type: 'deko', form: 'rakete', at: [12, 3, -150], yaw: -30, farbe: 0x43A047 },

    { type: 'stern', at: [0, 0.9, -1] },
    { type: 'stern', at: [0, 3.9, -24] },
    { type: 'stern', at: [-4, 3.9, -28] },
    { type: 'stern', at: [0, 3.9, -35] },
    { type: 'stern', at: [0, 8.9, -59.5] },
    { type: 'stern', at: [0, 8.9, -106] },
    { type: 'stern', at: [0, 8.9, -121] },
    { type: 'stern', at: [0, 4.9, -157] },
    { type: 'stern', at: [-5, 9.35, -90], bonus: true }
  ]
};
