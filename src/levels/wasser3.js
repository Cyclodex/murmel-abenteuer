// Unterwasser 3: Schatztruhe. Alles zusammen: Strömungsband, Seetang-Rad, Muscheln, Röhre, Magnet.
export default {
  id: 'u3', name: 'Schatztruhe', emoji: '💰', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'band', from: [0, 0, -6], to: [0, 0, -18], width: 4, walls: 0.8 },
    // Teller mit Seetang-Rad
    { type: 'klotz', at: [0, -0.5, -24], size: [10, 1, 12] },
    { type: 'wand', from: [-5.2, 0, -18], to: [-5.2, 0, -30] },
    { type: 'wand', from: [5.2, 0, -18], to: [5.2, 0, -30] },
    { type: 'wand', from: [-5.4, 0, -17.8], to: [-2.2, 0, -17.8] },
    { type: 'wand', from: [2.2, 0, -17.8], to: [5.4, 0, -17.8] },
    { type: 'wand', from: [-5.4, 0, -30.2], to: [-2.7, 0, -30.2] },
    { type: 'wand', from: [2.7, 0, -30.2], to: [5.4, 0, -30.2] },
    { type: 'balken', at: [0, 0, -24], length: 8, speed: 35, farbe: 'gruen' },
    // Muscheln (Dominos)
    { type: 'weg', from: [0, 0, -30], to: [0, 0, -44], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -32], size: [5, 3, 3] },
    { type: 'domino', from: [0, 0, -35], to: [0, 0, -41], count: 4, quer: 3 },
    // Röhre zur Schatztruhe
    { type: 'weg', from: [0, 0, -44], to: [0, 0, -48], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -44], to: [-1.2, 0, -44] },
    { type: 'wand', from: [1.2, 0, -44], to: [2.7, 0, -44] },
    { type: 'roehre', from: [0, 0, -46], yaw: 0, to: [0, 3, -60], toYaw: 0, bogen: 4, farbe: 0x4DD0E1 },
    { type: 'weg', from: [0, 3, -58], to: [0, 3, -70], width: 6 },
    { type: 'wand', from: [3.2, 3, -58], to: [3.2, 3, -70] },
    { type: 'wand', from: [-3.2, 3, -58], to: [-3.2, 3, -61] },
    { type: 'wand', from: [-3.2, 3, -63.5], to: [-3.2, 3, -70] },
    { type: 'wand', from: [-3.6, 3, -57.8], to: [3.6, 3, -57.8] },
    { type: 'wand', from: [-3.6, 3, -70.2], to: [3.6, 3, -70.2] },
    { type: 'nische', at: [-3, 3, -62.25], yaw: 90 },
    { type: 'magnet', at: [-5.3, 3, -62.25], radius: 3.2, strength: 4 },
    { type: 'ziel', at: [0, 3, -66] },
    { type: 'klotz', at: [0, 3.6, -68.6], size: [2.4, 1.2, 1.2], look: 'klotz-orange', deko: true },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -12] },
    { type: 'stern', at: [3, 0.9, -24] },
    { type: 'stern', at: [0, 0.9, -43] },
    { type: 'stern', at: [0, 5.4, -53] },
    { type: 'stern', at: [-5.5, 3.9, -62.25], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', at: [1.8, 3, -62.7], yaw: -37 },
    { type: 'domino', at: [-3.7, 0, -19.7], yaw: 17 },
    { type: 'domino', at: [-3.7, 0, -27.7], yaw: 34 }
  ]
};
