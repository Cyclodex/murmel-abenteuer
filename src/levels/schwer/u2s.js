// Blasenlift 💀: mit Blasen und Quallen (Trampolin) über Seetang-Rad und Abgründe hinauf zum Muschelgrat,
// dann den Tiefsee-Abhang hinunter, während Felsbrocken herunterrollen, und die Spirale ohne Rand ins Ziel.
// Bonus: ein eigener Blasenlift hoch hinauf zur Perle.
export default {
  id: 'u2s', schwer: 'u2', name: 'Quallenturm', emoji: '🪼', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -14,
  parts: [
    // Boden: erster Blasenlift
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -12], width: 5, walls: 0.8, caps: 'both' },
    { type: 'wind', at: [0, 0, -10], size: [4, 6, 4], up: true, strength: 12 },
    // Riff 1: links ein Brett zum Bonus-Blasenlift, dann das Seetang-Rad ohne Rand
    { type: 'weg', from: [0, 5, -12], to: [0, 5, -17], width: 5 },
    { type: 'wand', from: [2.7, 5, -12], to: [2.7, 5, -17] },
    { type: 'wand', from: [-2.7, 5, -12], to: [-2.7, 5, -13.6] },
    { type: 'wand', from: [-2.7, 5, -15.4], to: [-2.7, 5, -17] },
    { type: 'checkpoint', at: [0, 5, -15], size: [5, 3, 3] },
    { type: 'weg', from: [-2.5, 5, -14.5], to: [-8, 5, -14.5], width: 1.4 },
    { type: 'weg', from: [-8, 5, -14.5], to: [-12.5, 5, -14.5], width: 4.5, walls: 0.8, caps: 'end' },
    { type: 'wind', at: [-10.5, 5, -14.5], size: [2.4, 8, 2.4], up: true, strength: 10 },
    { type: 'weg', from: [0, 5, -17], to: [0, 5, -29], width: 4 },
    { type: 'balken', at: [0, 5, -23], length: 4.6, speed: 50, farbe: 'gruen' },
    { type: 'weg', from: [0, 5, -29], to: [0, 5, -33], width: 5, walls: 0.8, caps: 'end' },
    // Qualle wirft die Murmel hinauf zum Quallengarten
    { type: 'trampolin', at: [0, 5, -31], size: [3, 2], jump: 13, tempo: 4 },
    { type: 'weg', from: [0, 10, -34], to: [0, 10, -44], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 10, -37.5], size: [5, 3, 3] },
    // Quallen: von Insel zu Insel über den Abgrund
    { type: 'trampolin', at: [0, 10, -42.5], size: [3, 2], jump: 8, tempo: 6 },
    { type: 'weg', from: [0, 10, -46.5], to: [0, 10, -53], width: 3.5, look: 'fels' },
    { type: 'trampolin', at: [0, 10, -52], size: [3, 2], jump: 8, tempo: 6 },
    { type: 'weg', from: [0, 10, -55.5], to: [0, 10, -64], width: 4, walls: 0.8, caps: 'end', look: 'fels' },
    { type: 'wind', at: [0, 10, -62], size: [4, 6, 4], up: true, strength: 12 },
    // Muschelgrat: schmal, eine Riesenmuschel schnappt zu
    { type: 'weg', from: [0, 15, -64], to: [0, 15, -75], width: 2.4 },
    { type: 'hammer', at: [0, 15, -70], side: 1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'lila' },
    { type: 'weg', from: [0, 15, -75], to: [0, 15, -80], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 15, -77.5], size: [5, 3, 3] },
    // Tiefsee-Abhang ohne Rand: Felsbrocken rollen hinunter und fallen unten in die Tiefe
    { type: 'weg', from: [0, 15, -80], to: [0, 3, -112], width: 4 },
    { type: 'felsen', from: [0, 15, -81], dir: [0, -1], speed: 2, every: 8 },
    { type: 'weg', from: [0, 3, -112], to: [0, 3, -120], width: 6 },
    { type: 'weg', from: [3, 3, -116], to: [10, 3, -116], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [7, 3, -116], yaw: -90, size: [4, 3, 3] },
    // Spirale mit niedrigem Rand hinunter
    { type: 'spirale', at: [10, 3, -116], yaw: -90, turn: 360, radius: 5, rise: -8, width: 3, walls: 0.3 },
    { type: 'weg', from: [10, -5, -116], to: [22, -5, -116], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [19, -5, -116] },

    // Tiefsee
    { type: 'deko', form: 'koralle', at: [-5, 0, -4], scale: 1.3 },
    { type: 'deko', form: 'fisch', at: [6, 8, -20], yaw: 80, scale: 1.3, farbe: 0x4FC3F7 },
    { type: 'deko', form: 'fisch', at: [-6, 13, -52], yaw: -60 },
    { type: 'deko', form: 'muschel', at: [-3.5, 15, -79], scale: 0.6, farbe: 0xF8BBD0 },
    { type: 'deko', form: 'koralle', at: [6, 6, -96], scale: 1.2, farbe: 0xB388FF },
    { type: 'deko', form: 'seestern', at: [-1.5, 3, -118], yaw: 30, scale: 0.5 },
    { type: 'deko', form: 'anker', at: [3, -8, -104], yaw: 20 },
    { type: 'deko', form: 'truhe', at: [20.6, -5, -117.6], scale: 0.5 },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 6.5, -10] },
    { type: 'stern', at: [1.2, 5.9, -23] },
    { type: 'stern', at: [0, 14, -45.5] },
    { type: 'stern', at: [0, 15.9, -70] },
    { type: 'stern', at: [0, 9.9, -96] },
    { type: 'stern', at: [10, -0.1, -106] },
    { type: 'stern', at: [-10.5, 12, -14.5], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [0, 3, -116.7], to: [1.6, 3, -117.7], count: 2, quer: 3 },
    { type: 'domino', at: [-1.5, 0, -4.7], yaw: -5 },
    { type: 'domino', at: [1.5, 10, -39.2], yaw: 12 },
    { type: 'domino', at: [-0.5, 5, -19.2], yaw: -50 },
    { type: 'domino', at: [15.5, -5, -117.2], yaw: -113 }
  ]
};
