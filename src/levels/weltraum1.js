// Weltraum 1: Mondhüpfer. Wenig Schwerkraft: mit dem Trampolin weit springen, in der Luft lenken.
export default {
  id: 'w1', name: 'Mondhüpfer', emoji: '🌙', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    { type: 'trampolin', at: [0, 0, -6], size: [4, 2], jump: 6, tempo: 5 },
    // Plattform B
    { type: 'weg', from: [0, 0, -16], to: [0, 0, -28], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -21], size: [6, 3, 3] },
    { type: 'trampolin', at: [0, 0, -26], size: [5, 2], jump: 6, tempo: 5 },
    // Plattform C (höher)
    { type: 'weg', from: [0, 3, -33], to: [0, 3, -50], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 3, -45] },
    // Bonus-Asteroid rechts, mit Trampolin zurück Richtung Plattform B
    { type: 'klotz', at: [5, 1.5, -12], size: [4, 1, 4] },
    { type: 'trampolin', at: [5, 2, -12], size: [4, 4], jump: 5, tempo: 4, yaw: 25 },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 4.2, -12] },
    { type: 'stern', at: [0, 4.5, -31] },
    { type: 'stern', at: [0, 3.9, -40] },
    { type: 'stern', at: [0, 0.9, -23.5] },
    { type: 'stern', at: [5, 3.2, -12], bonus: true, r: 2.2 }
  ]
};
