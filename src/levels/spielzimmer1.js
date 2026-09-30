// Spielzimmer 1: Bauklotz-Weg. Neu: Kurven (Kamera dreht mit) und Turbo-Streifen.
export default {
  id: 'sz1',
  name: 'Bauklotz-Weg',
  emoji: '🧱',
  theme: 'spielzimmer',
  start: [0, 0, 2],
  killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -10], width: 5, walls: 0.8, caps: 'start' },
    // Gerade mit Lücke links -> Nische mit Bonusstern
    { type: 'weg', from: [0, 0, -10], to: [0, 0, -20], width: 5 },
    { type: 'wand', from: [2.7, 0, -10], to: [2.7, 0, -20] },
    { type: 'wand', from: [-2.7, 0, -10], to: [-2.7, 0, -13] },
    { type: 'wand', from: [-2.7, 0, -15.5], to: [-2.7, 0, -20] },
    { type: 'nische', at: [-2.5, 0, -14.25], yaw: 90 },
    // Rechtskurve
    { type: 'kurve', at: [0, 0, -20], yaw: 0, turn: 90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [5, 0, -25], to: [20, 0, -25], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [7, 0, -25], yaw: -90, size: [5, 3, 3] },
    { type: 'turbo', at: [11, 0, -25], yaw: -90, size: [3, 2], speed: 9 },
    // Rampe hoch und Linkskurve
    { type: 'weg', from: [20, 0, -25], to: [28, 2, -25], width: 5, walls: 0.8 },
    { type: 'kurve', at: [28, 2, -25], yaw: -90, turn: -90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [33, 2, -30], to: [33, 2, -40], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [33, 2, -36] },

    { type: 'stern', at: [0, 0.9, -4] },
    { type: 'stern', at: [0, 0.9, -17] },
    { type: 'stern', at: [1.46, 0.9, -23.54] },
    { type: 'stern', at: [15, 0.9, -25] },
    { type: 'stern', at: [31.54, 2.9, -26.46] },
    { type: 'stern', at: [-5, 0.9, -14.25], bonus: true },

    // Deko auf dem Teppich
    { type: 'klotz', at: [-7, -8, -4], size: [2, 2, 2], look: 'abc', text: 'A', deko: true },
    { type: 'klotz', at: [-7, -6, -4], size: [2, 2, 2], look: 'abc', text: 'B', deko: true, yaw: 20 },
    { type: 'klotz', at: [9, -8, -12], size: [2, 2, 2], look: 'abc', text: 'C', deko: true },
    { type: 'klotz', at: [24, -7.4, -34], size: [4, 3.2, 2], look: 'lego-gruen', deko: true },

    // einzelne Dominosteine
    { type: 'domino', at: [5, 0, -26.5], yaw: -83 }
  ]
};
