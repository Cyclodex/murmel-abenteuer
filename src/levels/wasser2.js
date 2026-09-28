// Unterwasser 2: Blasenlift. Neu: Blasen tragen die Murmel nach oben, Spirale zurück nach unten.
export default {
  id: 'u2', name: 'Blasenlift', emoji: '🫧', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -12], width: 5, walls: 0.8, caps: 'both' },
    { type: 'wind', at: [0, 0, -10], size: [4, 6, 4], up: true, strength: 12 },
    // Riff 1, links eine Nische
    { type: 'weg', from: [0, 5, -12], to: [0, 5, -28], width: 5 },
    { type: 'wand', from: [2.7, 5, -12], to: [2.7, 5, -28] },
    { type: 'wand', from: [-2.7, 5, -12], to: [-2.7, 5, -16.75] },
    { type: 'wand', from: [-2.7, 5, -19.25], to: [-2.7, 5, -28] },
    { type: 'wand', from: [-2.9, 5, -28.2], to: [2.9, 5, -28.2] },
    { type: 'nische', at: [-2.5, 5, -18], yaw: 90 },
    { type: 'checkpoint', at: [0, 5, -15], size: [5, 3, 3] },
    { type: 'wind', at: [0, 5, -26], size: [4, 6, 4], up: true, strength: 12 },
    // Riff 2 und Spirale nach unten
    { type: 'weg', from: [0, 10, -28], to: [0, 10, -36], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 10, -31], size: [5, 3, 3] },
    { type: 'spirale', at: [0, 10, -36], yaw: 0, turn: 540, radius: 5, rise: -9, width: 4, walls: 0.8 },
    { type: 'weg', from: [10, 1, -36], to: [10, 1, -24], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [10, 1, -27] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 6.5, -10] },
    { type: 'stern', at: [0, 11.5, -26] },
    { type: 'stern', at: [5, 6.4, -31] },
    { type: 'stern', at: [10, 1.9, -31] },
    { type: 'stern', at: [-5, 5.9, -18], bonus: true }
  ]
};
