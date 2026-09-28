// Weltraum 3: Wurmloch. Magnet-Brücke, Wurmloch-Röhre, drehender Stationsarm.
export default {
  id: 'w3', name: 'Wurmloch', emoji: '🌀', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    // Brücke ohne Rand, Magnete ziehen zur Seite
    { type: 'weg', from: [0, 0, -8], to: [0, 0, -30], width: 3 },
    { type: 'checkpoint', at: [0, 0, -10], size: [3, 3, 3] },
    { type: 'magnet', at: [4, 0, -13], radius: 4.5, strength: 8 },
    { type: 'magnet', at: [-4, 0, -22], radius: 4.5, strength: 8 },
    // Bonus-Insel links über einen schmalen Steg
    { type: 'weg', from: [-1.5, 0, -17], to: [-3.6, 0, -17], width: 1.2 },
    { type: 'klotz', at: [-4.5, -0.5, -17], size: [2, 1, 2] },
    // Wurmloch
    { type: 'weg', from: [0, 0, -30], to: [0, 0, -34], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-1.7, 0, -30], to: [-1.2, 0, -30] },
    { type: 'wand', from: [1.2, 0, -30], to: [1.7, 0, -30] },
    { type: 'roehre', from: [0, 0, -32], yaw: 0, to: [-10, 6, -44], toYaw: 90, bogen: 6, farbe: 0xB388FF },
    // Station mit drehendem Arm
    { type: 'weg', from: [-8, 6, -44], to: [-27, 6, -44], width: 8, walls: 0.8, caps: 'both' },
    { type: 'checkpoint', at: [-11, 6, -44], yaw: 90, size: [8, 3, 3] },
    { type: 'balken', at: [-17, 6, -44], length: 7, speed: 30, farbe: 'blau' },
    { type: 'ziel', at: [-24, 6, -44] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -17] },
    { type: 'stern', at: [0, 0.9, -26] },
    { type: 'stern', at: [-3.88, 8.4, -39.13] },
    { type: 'stern', at: [-17, 6.9, -41] },
    { type: 'stern', at: [-4.5, 0.9, -17], bonus: true }
  ]
};
