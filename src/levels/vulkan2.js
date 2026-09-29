// Vulkan 2: Feuerberg. Profi: Förderband gegen die Fahrtrichtung, Balken fegt über einen schmalen Steg,
// Seitenwind ohne Rand, rutschige Eis-Abfahrt.
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
    // Eis-Abfahrt, unten eine Kurve
    { type: 'weg', from: [0, 3, -58], to: [0, 1, -66], width: 3, surface: 'eis' },
    { type: 'weg', from: [0, 1, -66], to: [0, 1, -70], width: 3, walls: 0.6 },
    { type: 'kurve', at: [0, 1, -70], yaw: 0, turn: -90, radius: 5, width: 3, walls: 0.6 },
    { type: 'weg', from: [-5, 1, -75], to: [-15, 1, -75], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [-6.5, 1, -75], yaw: 90, size: [5, 3, 2] },
    { type: 'ziel', at: [-12, 1, -75] },

    { type: 'stern', at: [0, 0.9, -10] },
    { type: 'stern', at: [0, 3.9, -39] },
    { type: 'stern', at: [0, 3.9, -52.5] },
    { type: 'stern', at: [0, 2.9, -62] },
    { type: 'stern', at: [-9, 1.9, -75] },
    { type: 'stern', at: [7, 3.9, -29], bonus: true }
  ]
};
