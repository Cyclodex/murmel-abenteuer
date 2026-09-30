// Küche 3: Keksdose. Kekse umwerfen, durch den Strohhalm, aufs Band, durch den Küchentrichter in die Schüssel.
const T = [39.2, -0.35, -40.5]; // Trichter: Mitte des Lochs (Bande oben bei y = 4.1, Anlauf bei 5)
const SY = -5;                  // Schüssel darunter: Höhe des Bodens
export default {
  id: 'k3', name: 'Keksdose', emoji: '🍪', theme: 'kueche',
  start: [0, 0, 2], killY: -10,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -20], width: 5, walls: 0.8 },
    { type: 'domino', from: [0, 0, -9], to: [0, 0, -15], count: 6, size: [3.6, 1.8, 0.3] },
    // Strohhalm
    { type: 'weg', from: [0, 0, -20], to: [0, 0, -24], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 0, -20], to: [-1.2, 0, -20] },
    { type: 'wand', from: [1.2, 0, -20], to: [2.7, 0, -20] },
    { type: 'roehre', from: [0, 0, -22], yaw: 0, to: [8, 2, -30], toYaw: -90, bogen: 3, farbe: 0xFF4FA0 },
    // Landung (nach +x), links eine Nische
    { type: 'weg', from: [6, 2, -30], to: [18, 2, -30], width: 5 },
    { type: 'wand', from: [5.8, 2, -32.9], to: [5.8, 2, -27.1] },
    { type: 'wand', from: [6, 2, -27.3], to: [18, 2, -27.3] },
    { type: 'wand', from: [6, 2, -32.7], to: [12.5, 2, -32.7] },
    { type: 'wand', from: [15, 2, -32.7], to: [18, 2, -32.7] },
    { type: 'nische', at: [13.75, 2, -32.5], yaw: 0 },
    { type: 'checkpoint', at: [10, 2, -30], yaw: -90, size: [5, 3, 3] },
    // Band hoch, Anlauf und schräg über den Rand in den Küchentrichter, darunter fängt eine Schüssel die Murmel auf
    { type: 'band', from: [18, 2, -30], to: [30, 5, -30], width: 4, walls: 0.8 },
    { type: 'weg', from: [30, 5, -30], to: [34, 5, -30], width: 3.2, walls: 0.6 },
    { type: 'checkpoint', at: [32, 5, -30], yaw: -90, size: [3.2, 3, 2] },
    { type: 'weg', from: [34, 5, -30], to: [T[0], 5, -33], width: 3.2, walls: 0.6 },
    { type: 'trichter', at: T, R: 6, h: 3.5, loch: 0.9, rim: 1.2, farbe: 0xB0BEC5 },
    { type: 'schuessel', at: [T[0], SY, T[2]], r: 2, R: 4.5, h: 2, rim: 0.5, art: 'schuessel', offen: [-90] },
    { type: 'weg', from: [T[0] + 1.9, SY, T[2]], to: [T[0] + 14, SY, T[2]], width: 3, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [T[0] + 7, SY, T[2]], yaw: -90, size: [3, 3, 2] },
    { type: 'ziel', at: [T[0] + 11, SY, T[2]] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -18] },
    { type: 'stern', at: [2.88, 4.15, -27.13] },
    { type: 'stern', at: [24, 4.4, -30] },
    // unter dem Trichterloch: nur wer durch den Trichter fällt, holt ihn
    { type: 'stern', at: [T[0], SY + 2.4, T[2]] },
    { type: 'stern', at: [13.75, 2.9, -35], bonus: true }
  ]
};
