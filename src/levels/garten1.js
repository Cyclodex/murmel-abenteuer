// Garten 1: Gartenschlauch. Neu: Röhren (die Murmel fliegt durch den Schlauch), Beet mit Schlamm und Pfütze (wäscht die Murmel).
export default {
  id: 'g1', name: 'Gartenschlauch', emoji: '🐍', theme: 'garten',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, 0], width: 5, walls: 0.8, caps: 'start' },
    // Beet: Schlamm macht die Murmel dreckig
    { type: 'weg', from: [0, 0, 0], to: [0, 0, -6], width: 5, walls: 0.8, surface: 'schlamm' },
    // Trichter zur Röhre: der Weg endet, nur der Schlauch führt weiter
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.2, 0, -6] },
    { type: 'wand', from: [1.2, 0, -6], to: [2.7, 0, -6] },
    { type: 'roehre', from: [0, 0, -8], yaw: 0, to: [0, 0, -26], toYaw: 0, bogen: 5 },
    // Landung, links eine Nische
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -32], width: 5 },
    // Pfütze wäscht den Dreck ab
    { type: 'weg', from: [0, 0, -32], to: [0, 0, -36], width: 5, surface: 'pfuetze' },
    { type: 'wand', from: [2.7, 0, -24], to: [2.7, 0, -36] },
    { type: 'wand', from: [-2.7, 0, -24], to: [-2.7, 0, -29] },
    { type: 'wand', from: [-2.7, 0, -31.5], to: [-2.7, 0, -36] },
    { type: 'wand', from: [-2.9, 0, -23.8], to: [2.9, 0, -23.8] },
    { type: 'nische', at: [-2.5, 0, -30.25], yaw: 90 },
    { type: 'checkpoint', at: [0, 0, -28], size: [5, 3, 3] },
    { type: 'kurve', at: [0, 0, -36], yaw: 0, turn: 90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [5, 0, -41], to: [13, 0, -41], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [7, 0, -41], yaw: -90, size: [5, 3, 3] },
    // zweiter Schlauch hoch aufs Beet
    { type: 'weg', from: [13, 0, -41], to: [18, 0, -41], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [13, 0, -43.7], to: [13, 0, -42.2] },
    { type: 'wand', from: [13, 0, -39.8], to: [13, 0, -38.3] },
    { type: 'roehre', from: [16, 0, -41], yaw: -90, to: [26, 4, -41], toYaw: -90, bogen: 3, farbe: 0xFF7043 },
    { type: 'weg', from: [24, 4, -41], to: [34, 4, -41], width: 6, walls: 0.8, caps: 'both' },
    { type: 'ziel', at: [31, 4, -41] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 4.65, -17] },
    { type: 'stern', at: [10, 0.9, -41] },
    { type: 'stern', at: [21, 5.15, -41] },
    { type: 'stern', at: [28, 4.9, -41] },
    { type: 'stern', at: [-5, 0.9, -30.25], bonus: true }
  ]
};
