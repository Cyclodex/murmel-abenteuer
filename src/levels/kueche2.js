// Küche 2: Mixer. Neu: drehende Balken (Rührbesen), abstossender Magnet.
const teller = (z, open = 2.7) => [ // quadratischer Teller 12 x 12 mit Rand, vorne und hinten offen
  { type: 'klotz', at: [0, -0.5, z], size: [12, 1, 12] },
  { type: 'wand', from: [-6.2, 0, z + 6], to: [-6.2, 0, z - 6] },
  { type: 'wand', from: [6.2, 0, z + 6], to: [6.2, 0, z - 6] },
  { type: 'wand', from: [-6.4, 0, z + 6.2], to: [-open, 0, z + 6.2] },
  { type: 'wand', from: [open, 0, z + 6.2], to: [6.4, 0, z + 6.2] },
  { type: 'wand', from: [-6.4, 0, z - 6.2], to: [-open, 0, z - 6.2] },
  { type: 'wand', from: [open, 0, z - 6.2], to: [6.4, 0, z - 6.2] }
];
export default {
  id: 'k2', name: 'Mixer', emoji: '🌀', theme: 'kueche',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    ...teller(-12),
    { type: 'balken', at: [0, 0, -12], length: 10, speed: 35 },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -26], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -21], size: [5, 3, 3] },
    ...teller(-32),
    { type: 'balken', at: [-3, 0, -32], length: 5, speed: 50, farbe: 'blau' },
    { type: 'balken', at: [3, 0, -32], length: 5, speed: -50, farbe: 'gruen' },
    { type: 'weg', from: [0, 0, -38], to: [0, 0, -50], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [0, 0, -40], size: [5, 3, 3] },
    { type: 'magnet', at: [0, 0, -44], radius: 2.5, strength: -5 },
    { type: 'ziel', at: [0, 0, -47.5] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [3.5, 0.9, -12] },
    { type: 'stern', at: [0, 0.9, -23] },
    { type: 'stern', at: [0, 0.9, -32] },
    { type: 'stern', at: [0, 0.9, -41.5] },
    { type: 'stern', at: [5, 0.9, -7], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', at: [-1.7, 0, -38], yaw: -11 },
    { type: 'domino', at: [-1.7, 0, -4], yaw: -7 }
  ]
};
