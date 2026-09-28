// Spielzimmer 2: Fahrstuhl-Regal. Neu: bewegte Plattformen und Wippe.
export default {
  id: 'sz2',
  name: 'Fahrstuhl-Regal',
  emoji: '🛗',
  theme: 'spielzimmer',
  start: [0, 0, 2],
  killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    // Plattform fährt über die Lücke
    { type: 'plattform', from: [0, 0, -10], to: [0, 0, -16], size: [4.5, 4], time: 2.5, pause: 2.5 },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -26], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -20], size: [5, 3, 3] },
    // Fahrstuhl nach oben
    { type: 'plattform', from: [0, 0, -28], to: [0, 3, -28], size: [4.5, 4], time: 2, pause: 2.5 },
    // Obere Ebene (dick, damit man unten nicht drunter durchrollt), links eine Nische
    { type: 'weg', from: [0, 3, -30], to: [0, 3, -40], width: 5, thick: 3 },
    { type: 'wand', from: [2.7, 3, -30], to: [2.7, 3, -40] },
    { type: 'wand', from: [-2.7, 3, -30], to: [-2.7, 3, -31] },
    { type: 'wand', from: [-2.7, 3, -33.5], to: [-2.7, 3, -40] },
    { type: 'nische', at: [-2.5, 3, -32.25], yaw: 90 },
    { type: 'checkpoint', at: [0, 3, -35], size: [5, 3, 3] },
    // Wippe: Einfahrt unten, kippt nach vorne, wenn die Murmel über die Mitte rollt
    { type: 'wippe', at: [0, 3.695, -44], size: [4, 8], angle: 10 },
    { type: 'weg', from: [0, 3, -48], to: [0, 3, -58], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 3, -54] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 0.9, -13] },
    { type: 'stern', at: [0, 0.9, -23] },
    { type: 'stern', at: [0, 3.9, -37] },
    { type: 'stern', at: [0, 4.6, -44] },
    { type: 'stern', at: [-5, 3.9, -32.25], bonus: true },

    { type: 'klotz', at: [7, -8, -20], size: [2, 2, 2], look: 'abc', text: 'D', deko: true },
    { type: 'klotz', at: [-8, -7.4, -46], size: [4, 3.2, 2], look: 'lego-blau', deko: true }
  ]
};
