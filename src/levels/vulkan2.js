// Vulkan 2: Feuerberg. Profi: Förderband gegen die Fahrtrichtung, Balken fegt über einen schmalen Steg,
// Seitenwind ohne Rand, Lava-Rinne mit Steilkurve.
export default {
  id: 'v2', name: 'Feuerberg', emoji: '⛰️', theme: 'vulkan',
  start: [0, 0, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // Band schiebt zurück, danach hoch auf den Berg
    { type: 'band', from: [0, 0, -16], to: [0, 0, -4], width: 3, walls: 0.6, speed: 3, grip: 1 },
    { type: 'weg', from: [0, 0, -16], to: [0, 3, -26], width: 3, walls: 0.6 },
    { type: 'weg', from: [0, 3, -26], to: [0, 3, -32], width: 4 },
    { type: 'checkpoint', at: [0, 3, -28], size: [4, 3, 3] },
    // schmaler Abzweig rechts zum Bonusstern
    { type: 'weg', from: [2, 3, -29], to: [7.5, 3, -29], width: 1.4 },
    // Steg, über den ein Balken fegt
    { type: 'weg', from: [0, 3, -32], to: [0, 3, -46], width: 2.6 },
    { type: 'balken', at: [2.8, 3, -39], length: 8, speed: -50, farbe: 'orange' },
    { type: 'klotz', at: [2.8, -1, -39], size: [0.8, 8, 0.8], look: 'basalt-dunkel', deko: true },
    { type: 'checkpoint', at: [0, 3, -44.5], size: [2.6, 3, 2] },
    // Seitenwind ohne Rand
    { type: 'weg', from: [0, 3, -46], to: [0, 3, -58], width: 2.6 },
    { type: 'wind', at: [0, 3, -50], size: [2.6, 3, 2.5], yaw: -90, strength: 5 },
    { type: 'wind', at: [0, 3, -55], size: [2.6, 3, 2.5], yaw: 90, strength: 5 },
    // Lava-Rinne: steil hinunter, unten eine Kurve, in der die schnelle Murmel die Aussenwand hochfährt
    { type: 'rinne', from: [0, 3, -58], to: [0, 1, -68], r: 1.6, bogen: 80, farbe: 0xFF5722 },
    { type: 'rinne', at: [0, 1, -68], yaw: 0, turn: -90, radius: 6, rise: -1, r: 1.6, bogen: 80, farbe: 0xE64A19 },
    { type: 'weg', from: [-6, 0, -74], to: [-16, 0, -74], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [-7.5, 0, -74], yaw: 90, size: [5, 3, 2] },
    { type: 'ziel', at: [-13, 0, -74] },

    { type: 'stern', at: [0, 0.9, -10] },
    { type: 'stern', at: [0, 3.9, -39] },
    { type: 'stern', at: [0, 3.9, -52.5] },
    { type: 'stern', at: [0, 2.9, -63] },
    // hoch an der Aussenwand der Kurve: nur wer mit Schwung hineinfährt, holt ihn
    { type: 'stern', at: [-2.01, 1.44, -73.7], r: 0.7 },
    { type: 'stern', at: [7, 3.9, -29], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', at: [-8.5, 0, -75.7], yaw: 81 }
  ]
};
