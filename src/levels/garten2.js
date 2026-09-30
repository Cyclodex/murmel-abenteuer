// Garten 2: Pusteblume. Neu: Wind von der Seite und Aufwind hoch zum Baumhaus.
export default {
  id: 'g2', name: 'Pusteblume', emoji: '🌬️', theme: 'garten',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    // Windige Brücke ohne Rand: gegensteuern!
    { type: 'weg', from: [0, 0, -8], to: [0, 0, -24], width: 4 },
    { type: 'checkpoint', at: [0, 0, -9], size: [4, 3, 2] },
    { type: 'wind', at: [0, 0, -12], size: [4, 3, 3], yaw: -90, strength: 5 },
    { type: 'wind', at: [0, 0, -19.5], size: [4, 3, 3], yaw: 90, strength: 5 },
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -36], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [0, 0, -27], size: [5, 3, 3] },
    // Aufwind hoch aufs Baumhaus
    { type: 'wind', at: [0, 0, -34], size: [4, 7, 4], up: true, strength: 16 },
    { type: 'weg', from: [0, 6, -36], to: [0, 6, -50], width: 5 },
    { type: 'wand', from: [2.7, 6, -36], to: [2.7, 6, -50] },
    { type: 'wand', from: [-2.7, 6, -36], to: [-2.7, 6, -40] },
    { type: 'wand', from: [-2.7, 6, -42.5], to: [-2.7, 6, -50] },
    { type: 'wand', from: [-2.9, 6, -50.2], to: [2.9, 6, -50.2] },
    { type: 'nische', at: [-2.5, 6, -41.25], yaw: 90 },
    { type: 'checkpoint', at: [0, 6, -38], size: [5, 3, 3] },
    { type: 'ziel', at: [0, 6, -46] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 0.9, -15.75], r: 1.6 },
    { type: 'stern', at: [0, 0.9, -30] },
    { type: 'stern', at: [0, 8, -34] },
    { type: 'stern', at: [0, 6.9, -43] },
    { type: 'stern', at: [-5, 6.9, -41.25], bonus: true },
    { type: 'klotz', at: [0, -3, -43], size: [1.6, 18, 1.6], look: 'stamm', deko: true },

    // einzelne Dominosteine
    { type: 'domino', at: [-1.7, 0, -25.7], yaw: -12 },
    { type: 'domino', at: [-1.7, 0, -4.2], yaw: 12 }
  ]
};
