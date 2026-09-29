// Küche 3 💀: Vom Kühlschrank in die Spüle. Eisfach mit Eiswürfeln und Löchern, Butter-Rutsche, Keks-Dominos,
// durch den Strohhalm, Weggabelung (Schneidebrett mit rollenden Kartoffeln oder Keksdosen-Klappen),
// am Wasserhahn vorbei ins Spülbecken, durch den Abfluss hinunter, Kassenband mit Tassen und Fleischklopfer.
export default {
  id: 'k3s', schwer: 'k3', name: 'Vom Kühlschrank in die Spüle', emoji: '🧊', theme: 'kueche',
  start: [0, 10, 2], killY: -16,
  parts: [
    // im Kühlschrank
    { type: 'weg', from: [0, 10, 6], to: [0, 10, -4], width: 5, walls: 0.8, caps: 'start' },
    // Eisfach: spiegelglatt, Eiswürfel im Weg, Löcher am Rand
    { type: 'feld', at: [0, 10, -4], cell: 2, walls: 0.8, look: 'eis', map: [
      'eeeee',
      '.ewe.',
      'eeeee',
      'e.e.e',
      'eeeee',
      '.ewe.',
      'eeeee'
    ] },
    { type: 'checkpoint', at: [0, 10, -5], size: [10, 3, 2] },
    // Butter-Rutsche ohne Rand
    { type: 'weg', from: [0, 10, -18], to: [0, 6, -30], width: 3, surface: 'eis' },
    // Keks-Dominos: schnell hineinrollen
    { type: 'weg', from: [0, 6, -30], to: [0, 6, -48], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 6, -32], size: [5, 3, 3] },
    { type: 'domino', from: [0, 6, -37], to: [0, 6, -44], count: 6, size: [3.6, 1.8, 0.3] },
    // Strohhalm aus dem Glas
    { type: 'weg', from: [0, 6, -48], to: [0, 6, -52], width: 2, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-2.7, 6, -48], to: [-1.2, 6, -48] },
    { type: 'wand', from: [1.2, 6, -48], to: [2.7, 6, -48] },
    { type: 'roehre', from: [0, 6, -50], yaw: 0, to: [10, 3, -58], toYaw: -90, bogen: 3, farbe: 0xFF4FA0 },
    { type: 'weg', from: [8, 3, -58], to: [16, 3, -58], width: 14, walls: 0.8, caps: 'start' },
    { type: 'checkpoint', at: [12, 3, -58], yaw: -90, size: [14, 3, 3] },
    // Gabelung links: Schneidebrett ohne Rand, Kartoffeln rollen quer darüber (Bonusstern)
    { type: 'weg', from: [16, 3, -58], to: [32, 0, -58], width: 2.4, look: 'ramp' },
    { type: 'weg', from: [24, 5.2, -46], to: [24, 1.5, -56.8], width: 2.6, walls: 0.6, look: 'ramp' },
    { type: 'felsen', from: [24, 5.2, -46.6], dir: [0, -1], speed: 2, every: 4.5, r: 0.8, farbe: 0xC8A45C }, // Kartoffeln
    // rechts: Keksdosen-Klappen, die unter der Murmel aufgehen
    { type: 'weg', from: [16, 3, -63], to: [18, 3, -63], width: 3, walls: 0.8 },
    { type: 'falltuer', at: [19.5, 3, -63], size: [3, 3], yaw: -90 },
    { type: 'weg', from: [21, 3, -63], to: [22, 3, -63], width: 3, walls: 0.8 },
    { type: 'falltuer', at: [23.5, 3, -63], size: [3, 3], yaw: -90 },
    { type: 'weg', from: [25, 3, -63], to: [26, 3, -63], width: 3, walls: 0.8 },
    { type: 'falltuer', at: [27.5, 3, -63], size: [3, 3], yaw: -90 },
    { type: 'weg', from: [29, 3, -63], to: [32, 0, -63], width: 3, walls: 0.8 },
    // Spüle: Abtropffläche, schmaler Rand mit Wasserhahn, dann hinein ins Becken und durch den Abfluss
    { type: 'weg', from: [32, 0, -58], to: [38, 0, -58], width: 14, walls: 0.8 },
    { type: 'checkpoint', at: [35, 0, -58], yaw: -90, size: [14, 3, 3] },
    { type: 'weg', from: [38, 0, -58], to: [43.6, 0, -58], width: 2.2 },
    { type: 'wand', from: [38, 0, -55.3], to: [44, 0, -55.3], height: 3, look: 'kachel-weiss' },
    { type: 'wind', at: [41, 0, -58], size: [2.6, 3, 4], yaw: 0, strength: 6, look: 'hahn' },
    { type: 'schuessel', at: [50, -2.5, -58], r: 1.5, R: 4, h: 2.5, rim: 2.5, art: 'lavabo', aussen: false, abfluss: true, hahn: -90 },
    { type: 'roehre', from: [50, -2.5, -58], down: true, to: [50, -10, -70], toYaw: 0, bogen: 3, fang: 0.8, farbe: 0xB0BEC5 },
    // unter der Spüle: Kassenband mit Tassen, Fleischklopfer vor dem Ziel
    { type: 'weg', from: [50, -10, -66], to: [50, -10, -76], width: 5, walls: 0.8, caps: 'start' },
    { type: 'checkpoint', at: [50, -10, -73], size: [5, 3, 3] },
    { type: 'band', from: [50, -10, -76], to: [50, -10, -98], width: 5, walls: 0.8, speed: 4, grip: 3 },
    { type: 'deko', form: 'tasse', at: [48.6, -10, -81], scale: 0.45, fest: true },
    { type: 'deko', form: 'tasse', at: [51.4, -10, -87], scale: 0.45, fest: true, farbe: 0xE53935 },
    { type: 'deko', form: 'tasse', at: [48.6, -10, -93], scale: 0.45, fest: true, farbe: 0x4FC3F7 },
    { type: 'weg', from: [50, -10, -98], to: [50, -10, -108], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [50, -10, -99], size: [3, 3, 2] },
    { type: 'hammer', at: [50, -10, -103], side: 1, length: 4, size: [2.4, 1.4, 1.6] },
    { type: 'weg', from: [50, -10, -108], to: [50, -10, -115], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [50, -10, -112] },

    // Küche
    { type: 'deko', form: 'milch', at: [-9, -17, 0], yaw: 15, scale: 3.5 },
    { type: 'deko', form: 'kaese', at: [9, -17, -4], yaw: -20, scale: 4 },
    { type: 'deko', form: 'flasche', at: [-6, -17, -26], scale: 3 },
    { type: 'klotz', at: [-3.4, 5.5, -51], size: [3.6, 1, 3.6], look: 'kachel-weiss' },
    { type: 'deko', form: 'glas', at: [-3.4, 6, -51] },
    { type: 'deko', form: 'apfel', at: [7, -17, -40], scale: 3, farbe: 0x7CB342 },
    { type: 'deko', form: 'orange', at: [30, -17, -44], scale: 3 },
    { type: 'deko', form: 'flasche', at: [45.5, 0, -54], farbe: 0xFFD54F },
    { type: 'deko', form: 'tasse', at: [57, -17, -86], yaw: 60, scale: 1.5 },
    { type: 'deko', form: 'teekanne', at: [42, -17, -104], yaw: -30, scale: 1.3 },

    { type: 'stern', at: [0, 10.9, -1] },
    { type: 'stern', at: [0, 10.9, -11] },
    { type: 'stern', at: [0, 8.9, -24] },
    { type: 'stern', at: [0, 6.9, -46] },
    { type: 'stern', at: [35, 0.9, -58] },
    { type: 'stern', at: [48, -1.1, -58], r: 1.3 },
    { type: 'stern', at: [50, -9.1, -84] },
    { type: 'stern', at: [24, 2.4, -58], bonus: true }
  ]
};
