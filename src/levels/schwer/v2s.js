// Vulkan 2 💀: Abstieg vom Feuerberg. Bergab-Mission vom Gipfel bis in die Eishöhle: Förderband ohne Rand,
// Gabelung (steiler Grat oder Basalt-Treppe mit Steinstampfer), Lavabomben rollen quer über zwei Absätze,
// Schmelzwasser-Bach mit Steinen, Steg mit zwei drehenden Balken und Dampfstössen, Eisfeld mit Löchern im Gletscher.
export default {
  id: 'v2s', schwer: 'v2', name: 'Abstieg vom Feuerberg', emoji: '🧗', theme: 'vulkan',
  start: [0, 30, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 30, 6], to: [0, 30, -4], width: 5, walls: 0.8, caps: 'start' },
    // Förderband schiebt zurück, ohne Rand
    { type: 'band', from: [0, 30, -12], to: [0, 30, -4], width: 2.4, speed: 3, grip: 1 },
    { type: 'weg', from: [0, 30, -12], to: [0, 30, -20], width: 14 },
    { type: 'checkpoint', at: [0, 30, -16], size: [14, 3, 3] },
    // links: steiler Grat ohne Rand (Bonusstern), rechts: Basalt-Treppe und Steinstampfer
    { type: 'weg', from: [-4.5, 30, -20], to: [-4.5, 22, -44], width: 1.6 },
    { type: 'treppe', from: [4.5, 30, -20], to: [4.5, 22, -34], steps: 8, width: 3, walls: 0.6 },
    { type: 'weg', from: [4.5, 22, -34], to: [4.5, 22, -44], width: 3, walls: 0.6 },
    { type: 'hammer', at: [4.5, 22, -39.5], side: 1, length: 4, size: [3.2, 1.4, 1.6], farbe: 'orange' },
    { type: 'weg', from: [0, 22, -44], to: [0, 22, -50], width: 14 },
    { type: 'checkpoint', at: [0, 22, -47], size: [14, 3, 4] },
    // Lavabomben: Felsen rollen aus Rinnen quer über die Absätze
    { type: 'weg', from: [0, 22, -50], to: [0, 19, -60], width: 3.5 },
    { type: 'weg', from: [0, 19, -60], to: [0, 19, -66], width: 4 },
    { type: 'checkpoint', at: [0, 19, -60.7], size: [4, 3, 1.4] },
    { type: 'weg', from: [14, 23, -63], to: [2.3, 19, -63], width: 2.4, walls: 0.6 },
    { type: 'felsen', from: [13.5, 22.83, -63], dir: [-1, 0], speed: 2, every: 4.5 },
    { type: 'weg', from: [0, 19, -66], to: [0, 16, -76], width: 3.5 },
    { type: 'weg', from: [0, 16, -76], to: [0, 16, -82], width: 4 },
    { type: 'weg', from: [-14, 20, -79], to: [-2.3, 16, -79], width: 2.4, walls: 0.6 },
    { type: 'felsen', from: [-13.5, 19.83, -79], dir: [1, 0], speed: 2, every: 4.5, offset: 2 },
    // Schmelzwasser-Bach vom Gletscher trägt die Murmel hinunter, Steine im Wasser
    { type: 'fluss', from: [0, 16, -82], to: [0, 9, -108], width: 3.6, speed: 4 },
    { type: 'deko', form: 'vulkanstein', at: [-1, 13.15, -90], scale: 0.45, fest: true },
    { type: 'deko', form: 'vulkanstein', at: [1, 10.72, -99], scale: 0.45, fest: true },
    { type: 'weg', from: [0, 8.3, -108], to: [0, 8.3, -114], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 8.3, -111], size: [5, 3, 3] },
    // Steg ohne Rand: zwei drehende Balken, dann Dampfstösse von links und rechts
    { type: 'weg', from: [0, 8.3, -114], to: [0, 8.3, -146], width: 2.2 },
    { type: 'balken', at: [2.6, 8.3, -120], length: 8, speed: -50, farbe: 'orange' },
    { type: 'klotz', at: [2.6, 4.3, -120], size: [0.8, 8, 0.8], look: 'basalt-dunkel', deko: true },
    { type: 'balken', at: [-2.6, 8.3, -130], length: 8, speed: 50, farbe: 'rot' },
    { type: 'klotz', at: [-2.6, 4.3, -130], size: [0.8, 8, 0.8], look: 'basalt-dunkel', deko: true },
    { type: 'checkpoint', at: [0, 8.3, -134.5], size: [2.2, 3, 1.4] },
    { type: 'wind', at: [0, 8.3, -137.5], size: [2.2, 3, 2.5], yaw: -90, strength: 6 },
    { type: 'wind', at: [0, 8.3, -142.5], size: [2.2, 3, 2.5], yaw: 90, strength: 6 },
    // hinunter in die Eishöhle: Eisfeld mit Löchern
    { type: 'weg', from: [0, 8.3, -146], to: [0, 5, -154], width: 3, walls: 0.6 },
    { type: 'checkpoint', at: [0, 5, -155], size: [10, 3, 2] },
    {
      type: 'feld', at: [0, 5, -154], cell: 2, map: [
        '..e..',
        '.ee..',
        '.e.e.',
        '.eee.',
        '..e..',
        'eeeee'
      ]
    },
    { type: 'weg', from: [0, 5, -166], to: [0, 2, -174], width: 3, walls: 0.6, surface: 'eis' },
    { type: 'kurve', at: [0, 2, -174], yaw: 0, turn: -90, radius: 5, width: 3, walls: 0.6 },
    { type: 'weg', from: [-5, 2, -179], to: [-15, 2, -179], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [-6.5, 2, -179], yaw: 90, size: [5, 3, 2] },
    { type: 'ziel', at: [-12, 2, -179] },

    // Gipfel, Gletscher und Eishöhle
    { type: 'deko', form: 'vulkanstein', at: [-5, 30, 3], scale: 0.7 },
    { type: 'deko', form: 'vulkanstein', at: [5.5, 30, -1], scale: 0.5, yaw: 60 },
    { type: 'deko', form: 'kristall', at: [-6, 22, -48.5], scale: 0.5, farbe: 0xFF7043 },
    { type: 'deko', form: 'vulkanstein', at: [9, 3, -95], scale: 2 },
    { type: 'deko', form: 'vulkanstein', at: [-10, 0, -120], scale: 2.4, yaw: 30 },
    { type: 'klotz', at: [-7, 8, -160], size: [2, 8, 14], look: 'eis', deko: true },
    { type: 'klotz', at: [7, 8, -160], size: [2, 8, 14], look: 'eis', deko: true },
    { type: 'deko', form: 'kristall', at: [-5.5, 5, -157], scale: 0.6, farbe: 0x80DEEA },
    { type: 'deko', form: 'kristall', at: [5.5, 5, -163], scale: 0.7, farbe: 0x80DEEA },
    { type: 'deko', form: 'kristall', at: [-9, 2, -182], scale: 0.5, farbe: 0x80DEEA },

    { type: 'stern', at: [0, 30.9, -9] },
    { type: 'stern', at: [0, 19.9, -63] },
    { type: 'stern', at: [0, 16.9, -79] },
    { type: 'stern', at: [0, 13, -95] },
    { type: 'stern', at: [0, 9.2, -125] },
    { type: 'stern', at: [0, 9.2, -140] },
    { type: 'stern', at: [-2, 5.9, -161] },
    { type: 'stern', at: [-9, 2.9, -179] },
    { type: 'stern', at: [-4.5, 26.9, -32], bonus: true }
  ]
};
