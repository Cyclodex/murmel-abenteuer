// Weltraum 2: Kanonenflug. Neu: Kanone schiesst die Murmel auf die nächste Plattform.
export default {
  id: 'w2', name: 'Kanonenflug', emoji: '💥', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -3], to: [0, 0, -8], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -3], to: [-1.5, 0, -3] },
    { type: 'wand', from: [1.5, 0, -3], to: [2.7, 0, -3] },
    { type: 'kanone', at: [0, 0, -6], target: [0, 4, -24], time: 1.6 },
    // Plattform 1 (schmal, führt direkt in die zweite Kanone)
    { type: 'weg', from: [0, 4, -19], to: [0, 4, -36], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [0, 4, -22], size: [3, 3, 3] },
    { type: 'kanone', at: [0, 4, -33], target: [12, 8, -48], time: 1.8 },
    // Plattform 2
    { type: 'weg', from: [12, 8, -42], to: [12, 8, -56], width: 6, walls: 0.8, caps: 'both' },
    { type: 'checkpoint', at: [12, 8, -45], size: [6, 3, 3] },
    { type: 'ziel', at: [12, 8, -52] },

    { type: 'stern', at: [0, 0.9, -1] },
    { type: 'stern', at: [0, 4.48, -15.7] },
    { type: 'stern', at: [0, 4.9, -28] },
    { type: 'stern', at: [6.43, 8.88, -41.05] },
    { type: 'stern', at: [12, 8.9, -49] },
    { type: 'stern', at: [0, 4.9, -20], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', at: [13.3, 8, -43.5], yaw: -63 }
  ]
};
