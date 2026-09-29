// Küche 3: Keksdose. Kekse umwerfen, durch den Strohhalm, aufs Band.
export default {
  id: 'k3', name: 'Keksdose', emoji: '🍪', theme: 'kueche',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -20], width: 5, walls: 0.8 },
    { type: 'domino', from: [0, 0, -9], to: [0, 0, -15], count: 6, size: [3.6, 1.8, 0.3] },
    // Strohhalm
    { type: 'weg', from: [0, 0, -20], to: [0, 0, -24], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -20], to: [-1.2, 0, -20] },
    { type: 'wand', from: [1.2, 0, -20], to: [2.7, 0, -20] },
    { type: 'roehre', from: [0, 0, -22], yaw: 0, to: [8, 2, -30], toYaw: -90, bogen: 3, farbe: 0xFF4FA0 },
    // Landung (nach +x), links eine Nische
    { type: 'weg', from: [6, 2, -30], to: [18, 2, -30], width: 5 },
    { type: 'wand', from: [5.8, 2, -32.9], to: [5.8, 2, -27.1] },
    { type: 'wand', from: [6, 2, -27.3], to: [18, 2, -27.3] },
    { type: 'wand', from: [6, 2, -32.7], to: [12.5, 2, -32.7] },
    { type: 'wand', from: [15, 2, -32.7], to: [18, 2, -32.7] },
    { type: 'nische', at: [13.75, 2, -32.5], yaw: 0 },
    { type: 'checkpoint', at: [10, 2, -30], yaw: -90, size: [5, 3, 3] },
    { type: 'band', from: [18, 2, -30], to: [30, 2, -30], width: 4, walls: 0.8 },
    { type: 'weg', from: [30, 2, -30], to: [40, 2, -30], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [36, 2, -30] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -18] },
    { type: 'stern', at: [2.88, 4.15, -27.13] },
    { type: 'stern', at: [24, 2.9, -30] },
    { type: 'stern', at: [33, 2.9, -30] },
    { type: 'stern', at: [13.75, 2.9, -35], bonus: true }
  ]
};
