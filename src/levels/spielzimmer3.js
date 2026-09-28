// Spielzimmer 3: Schalter-Brücke. Neu: Schlamm, Eis, Schalter + Brücke.
export default {
  id: 'sz3',
  name: 'Schalter-Brücke',
  emoji: '🔘',
  theme: 'spielzimmer',
  start: [0, 0, 2],
  killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -10], width: 5, walls: 0.8, caps: 'start' },
    // Schlamm bremst
    { type: 'weg', from: [0, 0, -10], to: [0, 0, -18], width: 5, walls: 0.8, surface: 'schlamm' },
    // Eis rutscht; Klötze zum Ausweichen; links eine Nische
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -30], width: 6, surface: 'eis' },
    { type: 'wand', from: [3.2, 0, -18], to: [3.2, 0, -30] },
    { type: 'wand', from: [-3.2, 0, -18], to: [-3.2, 0, -20] },
    { type: 'wand', from: [-3.2, 0, -22.5], to: [-3.2, 0, -30] },
    { type: 'nische', at: [-3, 0, -21.25], yaw: 90, surface: 'eis' },
    { type: 'klotz', at: [-1.3, 0.6, -24], size: [1.6, 1.2, 1.6], look: 'klotz-rot' },
    { type: 'klotz', at: [1.4, 0.6, -27.5], size: [1.6, 1.2, 1.6], look: 'klotz-blau', yaw: 30 },
    // Schalter fährt die Brücke hoch
    { type: 'weg', from: [0, 0, -30], to: [0, 0, -38], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -32], size: [6, 3, 3] },
    { type: 'schalter', at: [1.8, 0, -35.5], id: 'b1' },
    { type: 'bruecke', from: [0, 0, -38], to: [0, 0, -46], width: 4, walls: 0.6, id: 'b1', drop: 12 },
    { type: 'weg', from: [0, 0, -46], to: [0, 0, -56], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -52] },

    { type: 'stern', at: [0, 0.9, -4] },
    { type: 'stern', at: [0, 0.9, -14] },
    { type: 'stern', at: [-1.5, 0.9, -27.5] },
    { type: 'stern', at: [1.8, 1.3, -35.5] },
    { type: 'stern', at: [0, 0.9, -42] },
    { type: 'stern', at: [-5, 0.9, -21.25], bonus: true },

    { type: 'klotz', at: [-8, -8, -10], size: [2, 2, 2], look: 'abc', text: 'E', deko: true },
    { type: 'klotz', at: [8, -7.4, -42], size: [4, 3.2, 2], look: 'lego-gelb', deko: true }
  ]
};
