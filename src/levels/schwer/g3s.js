// Garten 3 💀: Maulwurf-Wiese. Vom Baumhaus zwei Runden um den Stamm hinunter (die zweite ohne Rand),
// Steingarten-Hang mit rollenden Steinen, Treppe aus Steinplatten, Blumentopf-Dominos, Wiese voller Maulwurfslöcher
// (Gabelung: schmaler Zickzack durch die Löcher oder Rand mit zwei Gartenhämmern und Magnet), morscher Steg mit Falltüren.
export default {
  id: 'g3s', schwer: 'g3', name: 'Maulwurf-Wiese', emoji: '🕳️', theme: 'garten',
  start: [0, 16, 2], killY: -7,
  parts: [
    // Baumhaus
    { type: 'weg', from: [0, 16, 6], to: [0, 16, -4], width: 4, walls: 0.8, caps: 'start' },
    { type: 'spirale', at: [0, 16, -4], yaw: 0, turn: 360, radius: 5, rise: -5, width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 11, -4], size: [4, 3, 2] },
    { type: 'spirale', at: [0, 11, -4], yaw: 0, turn: 360, radius: 5, rise: -5, width: 3 },
    { type: 'klotz', at: [5, 6, -4], size: [2.4, 28, 2.4], look: 'stamm', deko: true },
    { type: 'deko', form: 'baum', at: [5, 14, -4], scale: 1.3 },
    { type: 'weg', from: [0, 6, -4], to: [0, 6, -10], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 6, -7], size: [4, 3, 3] },
    // Steingarten-Hang: Steine rollen von beiden Seiten quer über den Weg
    { type: 'weg', from: [0, 6, -10], to: [0, 1, -30], width: 5 },
    { type: 'weg', from: [14, 8.5, -18], to: [2.5, 4, -18], width: 3, walls: 0.6, caps: 'start' },
    { type: 'felsen', from: [13, 8.4, -18], dir: [-1, 0], speed: 3, every: 4 },
    { type: 'weg', from: [-14, 6.75, -25], to: [-2.5, 2.25, -25], width: 3, walls: 0.6, caps: 'start' },
    { type: 'felsen', from: [-13, 6.6, -25], dir: [1, 0], speed: 3, every: 4, offset: 2 },
    { type: 'weg', from: [0, 1, -30], to: [0, 1, -34], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 1, -32], size: [5, 3, 3] },
    // Treppe aus Steinplatten ohne Rand
    { type: 'treppe', from: [0, 1, -34], to: [0, -3, -44], steps: 6, width: 3 },
    // Blumentöpfe als Dominos
    { type: 'weg', from: [0, -3, -44], to: [0, -3, -62], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, -3, -46], size: [5, 3, 3] },
    { type: 'domino', from: [0, -3, -51], to: [0, -3, -58], count: 7, size: [3.6, 1.8, 0.3] },
    { type: 'weg', from: [0, -3, -62], to: [0, -3, -66], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, -3, -64], size: [5, 3, 3] },
    // Maulwurf-Wiese: links im Zickzack zwischen den Löchern (kurz), rechts am Rand mit Hämmern und Magnet (lang)
    { type: 'feld', at: [0, -3, -66], cell: 2, walls: 0.8, look: 'klotz-gruen', map: [
      '#########',
      '....#..##',
      '#...#..##',
      '#.###..##',
      '..#....##',
      '..#....##',
      '#.###..##',
      '....#..##',
      '#...#..##',
      '#########'
    ] },
    { type: 'wand', from: [-9.4, -3, -66.2], to: [-2.9, -3, -66.2] },
    { type: 'wand', from: [2.9, -3, -66.2], to: [9.4, -3, -66.2] },
    { type: 'wand', from: [-9.4, -3, -85.8], to: [-2.9, -3, -85.8] },
    { type: 'wand', from: [2.9, -3, -85.8], to: [9.4, -3, -85.8] },
    { type: 'hammer', at: [7, -3, -72], side: 1, length: 4, size: [3.6, 1.4, 1.6], farbe: 'rot' },
    { type: 'hammer', at: [7, -3, -80], side: 1, length: 4, size: [3.6, 1.4, 1.6], farbe: 'blau', offset: 1.74 },
    { type: 'magnet', at: [4, -3, -76], radius: 3.5, strength: 5 },
    // Maulwurfshügel
    { type: 'deko', form: 'stein', at: [8.3, -3, -76.5], scale: 0.35, farbe: 0x6D4C41, fest: true },
    { type: 'deko', form: 'stein', at: [-8, -3, -69], scale: 0.35, farbe: 0x6D4C41, fest: true },
    { type: 'deko', form: 'stein', at: [-8, -3, -73], scale: 0.35, farbe: 0x6D4C41, fest: true },
    { type: 'deko', form: 'stein', at: [-8, -3, -81], scale: 0.35, farbe: 0x6D4C41, fest: true },
    { type: 'weg', from: [0, -3, -86], to: [0, -3, -90], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, -3, -88], size: [5, 3, 3] },
    // morscher Steg mit Falltüren
    { type: 'weg', from: [0, -3, -90], to: [0, -3, -92], width: 3 },
    { type: 'falltuer', at: [0, -3, -93.5], size: [3, 3] },
    { type: 'weg', from: [0, -3, -95], to: [0, -3, -97], width: 3 },
    { type: 'falltuer', at: [0, -3, -98.5], size: [3, 3] },
    { type: 'weg', from: [0, -3, -100], to: [0, -3, -102], width: 3 },
    { type: 'weg', from: [0, -3, -102], to: [0, -3, -110], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, -3, -106] },

    // Garten
    { type: 'deko', form: 'zwerg', at: [-2.5, 6, -9], yaw: -30, scale: 0.35 },
    { type: 'deko', form: 'pilz', at: [8, -8, -12], scale: 1.4 },
    { type: 'deko', form: 'blume', at: [-6, -8, -40], scale: 1.3 },
    { type: 'deko', form: 'blume', at: [6, -8, -48], scale: 1.2, farbe: 0xFFD54F },
    { type: 'deko', form: 'giesskanne', at: [-14, -8, -60], yaw: 60, scale: 1.2 },
    { type: 'deko', form: 'zwerg', at: [13, -8, -78], yaw: 90, scale: 1.2, farbe: 0xE53935 },
    { type: 'deko', form: 'baum', at: [-16, -8, -92] },
    { type: 'deko', form: 'zwerg', at: [2.5, -3, -108], yaw: 20, scale: 0.4 },

    { type: 'stern', at: [0, 16.9, 0] },
    { type: 'stern', at: [10, 14.4, -4] },
    { type: 'stern', at: [10, 9.4, -4] },
    { type: 'stern', at: [0, 4, -21.5] },
    { type: 'stern', at: [0, -2.1, -60] },
    { type: 'stern', at: [7, -2.1, -76] },
    { type: 'stern', at: [0, -2.1, -98.5] },
    { type: 'stern', at: [-4, -2.1, -76], bonus: true }
  ]
};
