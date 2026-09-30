// Weltraum 1 💀: Mondbasis. Trampolin-Sprünge über Abgründe, Landung in einem Mondkrater, Gabelung
// (schmaler Kraterrand mit Meteoriten oder Mondfähre), zwei Stampfer im Bergwerk, Luftschleusen (Falltüren),
// Eis-Komet mit abstossenden Magneten und ein letzter hoher Sprung zur Landestation.
export default {
  id: 'w1s', schwer: 'w1', name: 'Mondbasis-Marathon', emoji: '🌑', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    // Startrampe mit Rakete, Trampolin in den Krater
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    { type: 'trampolin', at: [0, 0, -6.5], size: [5, 2], jump: 6, tempo: 5 },
    { type: 'klotz', at: [-9, -0.5, -1], size: [5, 1, 5], look: 'neon-blau' },
    { type: 'deko', form: 'rakete', at: [-9, 0, -1] },
    // Mondkrater: hinein fallen, hinten durch die Lücke hinaus
    { type: 'schuessel', at: [0, -1, -20], r: 3, R: 6, h: 1.5, rim: 0.6, art: 'sandkuchen', offen: [0] },
    { type: 'weg', from: [0, -1, -22.6], to: [0, -1, -31], width: 2.6 },
    { type: 'checkpoint', at: [0, -1, -26.5], size: [2.6, 3, 2] },
    { type: 'trampolin', at: [0, -1, -29.3], size: [2.6, 2], jump: 8, tempo: 5 },
    // Mondbasis (Gabelung)
    { type: 'weg', from: [0, 2, -40], to: [0, 2, -52], width: 16 },
    { type: 'checkpoint', at: [0, 2, -47], size: [16, 3, 4] },
    // links: schmaler Kraterrand ohne Rand, Meteoriten rollen quer darüber (Bonusstern)
    { type: 'weg', from: [-3.5, 2, -52], to: [-3.5, 2, -80], width: 1.5 },
    { type: 'weg', from: [-13, 6, -64], to: [-4.25, 2, -64], width: 3, walls: 0.6, caps: 'start' },
    { type: 'felsen', from: [-12, 5.5, -64], dir: [1, 0], speed: 3.5, every: 4.5, r: 0.8 },
    // rechts: Mondfähre über den Abgrund
    { type: 'weg', from: [7, 2, -52], to: [7, 2, -57], width: 3 },
    { type: 'plattform', from: [7, 2, -59], to: [7, 2, -73], size: [4, 4], time: 3, pause: 2 },
    { type: 'weg', from: [7, 2, -75], to: [7, 2, -80], width: 3 },
    // Treffpunkt
    { type: 'weg', from: [0, 2, -80], to: [0, 2, -88], width: 16 },
    { type: 'checkpoint', at: [0, 2, -84], size: [16, 3, 4] },
    { type: 'deko', form: 'kristall', at: [-7, 2, -86], scale: 0.6, fest: true },
    { type: 'deko', form: 'kristall', at: [7, 2, -86], scale: 0.6, fest: true, farbe: 0x4FC3F7 },
    // Bergwerk: zwei Stampfer hintereinander
    { type: 'weg', from: [0, 2, -88], to: [0, 2, -100], width: 3, walls: 0.6 },
    { type: 'hammer', at: [0, 2, -92], side: 1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'lila' },
    { type: 'hammer', at: [0, 2, -97], side: -1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'lila', offset: 2.48 },
    // Luftschleusen (Falltüren)
    { type: 'weg', from: [0, 2, -100], to: [0, 2, -102], width: 3 },
    { type: 'falltuer', at: [0, 2, -103.5], size: [3, 3] },
    { type: 'weg', from: [0, 2, -105], to: [0, 2, -107], width: 3 },
    { type: 'falltuer', at: [0, 2, -108.5], size: [3, 3] },
    { type: 'weg', from: [0, 2, -110], to: [0, 2, -112], width: 3 },
    { type: 'falltuer', at: [0, 2, -113.5], size: [3, 3] },
    { type: 'weg', from: [0, 2, -115], to: [0, 2, -120], width: 5 },
    { type: 'checkpoint', at: [0, 2, -117.5], size: [5, 3, 3] },
    // Eis-Komet: glatte Rampe hinunter, Magnete stossen zur Seite
    { type: 'weg', from: [0, 2, -120], to: [0, -1, -136], width: 3, surface: 'eis' },
    { type: 'magnet', at: [-2.8, 0.9, -126], radius: 4, strength: -8 },
    { type: 'magnet', at: [2.8, -0.1, -131], radius: 4, strength: -8 },
    { type: 'weg', from: [0, -1, -136], to: [0, -1, -142], width: 4 },
    { type: 'checkpoint', at: [0, -1, -137.5], size: [4, 3, 2] },
    { type: 'trampolin', at: [0, -1, -140], size: [4, 2], jump: 8, tempo: 4 },
    // Landestation
    { type: 'weg', from: [0, 4, -146], to: [0, 4, -160], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 4, -156] },
    // Weltraum rundherum
    { type: 'deko', form: 'satellit', at: [14, 7, -62], dreh: 20 },
    { type: 'deko', form: 'ufo', at: [-12, 9, -108], dreh: 40 },
    { type: 'deko', form: 'kristall', at: [3.5, -2, -130], scale: 0.8, farbe: 0x80DEEA },
    { type: 'deko', form: 'kristall', at: [-3.5, -1, -124], scale: 0.7, farbe: 0x80DEEA },
    { type: 'deko', form: 'rakete', at: [8, 4, -157], yaw: 20, scale: 0.8, farbe: 0x1E88E5 },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 4.3, -13.5] },
    { type: 'stern', at: [0, -0.1, -21] },
    { type: 'stern', at: [0, 6.3, -38] },
    { type: 'stern', at: [0, 2.9, -88.5] },
    { type: 'stern', at: [0, 2.9, -94.5] },
    { type: 'stern', at: [0, 2.9, -108.5] },
    { type: 'stern', at: [0, 6.5, -146.5] },
    { type: 'stern', at: [-3.5, 2.9, -70], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [-1.9, 2, -41.5], to: [-1.9, 2, -45.3], count: 3 },
    { type: 'domino', at: [1.6, 4, -148], yaw: -15 },
    { type: 'domino', at: [4.6, 2, -87], yaw: 73 },
    { type: 'domino', at: [1.6, 2, -116.5], yaw: 12 },
    { type: 'domino', at: [-6.9, 2, -81.5], yaw: -10 }
  ]
};
