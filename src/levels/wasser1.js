// Unterwasser 1: Korallenriff. Neu: Strömung (schiebt vorwärts oder zur Seite).
export default {
  id: 'u1', name: 'Korallenriff', emoji: '🐠', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -10], width: 5, walls: 0.8, caps: 'start' },
    { type: 'wind', at: [0, 0, -6], size: [5, 3, 4], yaw: 0, strength: 5 },
    { type: 'kurve', at: [0, 0, -10], yaw: 0, turn: 90, radius: 6, width: 5, walls: 0.8 },
    // links offen, die Strömung drückt nach links
    { type: 'weg', from: [6, 0, -16], to: [22, 0, -16], width: 4 },
    { type: 'wand', from: [6, 0, -13.8], to: [22, 0, -13.8] },
    { type: 'checkpoint', at: [8, 0, -16], yaw: -90, size: [4, 3, 3] },
    { type: 'wind', at: [14, 0, -16], size: [4, 3, 6], yaw: 0, strength: 4 },
    { type: 'kurve', at: [22, 0, -16], yaw: -90, turn: -90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [27, 0, -21], to: [27, 0, -34], width: 6 },
    { type: 'wand', from: [30.2, 0, -21], to: [30.2, 0, -34] },
    { type: 'wand', from: [23.8, 0, -21], to: [23.8, 0, -24.5] },
    { type: 'wand', from: [23.8, 0, -27], to: [23.8, 0, -34] },
    { type: 'wand', from: [23.4, 0, -34.2], to: [30.6, 0, -34.2] },
    { type: 'nische', at: [24, 0, -25.75], yaw: 90 },
    { type: 'checkpoint', at: [27, 0, -23], size: [6, 3, 3] },
    { type: 'ziel', at: [27, 0, -30] },

    { type: 'stern', at: [0, 0.9, -4] },
    { type: 'stern', at: [11, 0.9, -16] },
    { type: 'stern', at: [18, 0.9, -16] },
    { type: 'stern', at: [25.5, 0.9, -18.5] },
    { type: 'stern', at: [27, 0.9, -27] },
    { type: 'stern', at: [21.5, 0.9, -25.75], bonus: true }
  ]
};
