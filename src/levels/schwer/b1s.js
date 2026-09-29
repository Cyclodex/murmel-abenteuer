// Fynns Badezimmer 💀: Bad-Chaos. Turbo in den Looping, zwei Lifte hintereinander, Weggabelung (schmale Seifenleiste
// ohne Rand mit Bonusstern oder Matschfeld mit Abflusslöchern), drei Steinrutschen ohne Rand rechts, schnelles
// Förderband mit Föhn von der Seite, Schanze ins Lavabo, Abfluss in die Badewanne, von Schiff zu Schiff mit der Fähre,
// hinauf auf die Ablage mit zwei Klappen und hinunter in die Toilette.
export default {
  id: 'b1s', schwer: 'b1', name: 'Bad-Chaos', emoji: '🧼', theme: 'badezimmer',
  start: [0, 0, 2], killY: -13,
  parts: [
    // ---------- Start, Turbo in den Looping, schmaler Badvorleger ----------
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 3, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.9, 0, -6] },
    { type: 'wand', from: [1.9, 0, -6], to: [2.7, 0, -6] },
    { type: 'turbo', at: [0, 0, -8.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [0, 0, -10], yaw: 0, radius: 3, width: 3, shift: 5 },
    { type: 'weg', from: [5, 0, -10], to: [5, 0, -13], width: 4, walls: 0.8 },
    { type: 'weg', from: [5, 0, -13], to: [5, 0, -18], width: 3, walls: 0.4, surface: 'handtuch' },
    { type: 'checkpoint', at: [5, 0, -15], size: [3, 3, 2] },

    // ---------- Zwei Lifte hintereinander ----------
    { type: 'plattform', from: [5, 0, -19.75], to: [5, 0, -28.25], size: [3.5, 3.5], time: 2, pause: 2 },
    { type: 'weg', from: [5, 0, -30], to: [5, 0, -33], width: 3 },
    { type: 'checkpoint', at: [5, 0, -31.5], size: [3, 3, 2] },
    { type: 'plattform', from: [5, 0, -34.75], to: [5, 0, -43.25], size: [3.5, 3.5], time: 2, pause: 2, offset: 2 },

    // ---------- Gabelung: links Seifenleiste ohne Rand (Bonusstern), rechts Matsch mit Abflusslöchern ----------
    { type: 'weg', from: [5, 0, -45], to: [5, 0, -48], width: 9, walls: 0.8 },
    { type: 'checkpoint', at: [5, 0, -46.5], size: [9, 3, 2] },
    { type: 'weg', from: [2.5, 0, -48], to: [2.5, 0, -60], width: 1.4, surface: 'seife' },
    {
      type: 'feld', at: [7, 0, -48], cell: 2, walls: 0.8, map: [
        'sss',
        's.s',
        '.ss',
        'ss.',
        's.s',
        'sss'
      ]
    },
    { type: 'weg', from: [5, 0, -60], to: [5, 0, -64], width: 9, walls: 0.8 },
    { type: 'checkpoint', at: [5, 0, -62], size: [9, 3, 2] },
    { type: 'deko', form: 'seife', at: [-3, -5, -54], yaw: 20, scale: 1.5 },

    // ---------- Drei Steinrutschen: Steine rollen aus den Bechern quer über den Weg, rechts kein Rand ----------
    { type: 'weg', from: [5, 0, -64], to: [5, 0, -81], width: 4 },
    { type: 'wand', from: [2.8, 0, -64], to: [2.8, 0, -66.6] },
    { type: 'wand', from: [2.8, 0, -69.4], to: [2.8, 0, -71.1] },
    { type: 'wand', from: [2.8, 0, -73.9], to: [2.8, 0, -75.6] },
    { type: 'wand', from: [2.8, 0, -78.4], to: [2.8, 0, -81] },
    { type: 'weg', from: [-3, 3, -68], to: [3, 0, -68], width: 2.4, walls: 0.6, caps: 'start' },
    { type: 'weg', from: [-3, 3, -72.5], to: [3, 0, -72.5], width: 2.4, walls: 0.6, caps: 'start' },
    { type: 'weg', from: [-3, 3, -77], to: [3, 0, -77], width: 2.4, walls: 0.6, caps: 'start' },
    { type: 'felsen', from: [-2.2, 3.6, -68], dir: [1, 0], speed: 0.5, every: 3.5, r: 0.8 },
    { type: 'felsen', from: [-2.2, 3.6, -72.5], dir: [1, 0], speed: 0.5, every: 3.5, r: 0.8, offset: 1.2 },
    { type: 'felsen', from: [-2.2, 3.6, -77], dir: [1, 0], speed: 0.5, every: 3.5, r: 0.8, offset: 2.4 },
    { type: 'deko', form: 'becher', at: [-4.8, 2.4, -68], scale: 0.9, farbe: 0x4FC3F7 },
    { type: 'deko', form: 'becher', at: [-4.8, 2.4, -72.5], scale: 0.9, farbe: 0xFF8A65 },
    { type: 'deko', form: 'becher', at: [-4.8, 2.4, -77], scale: 0.9, farbe: 0xA5D6A7 },

    // ---------- Schnelles Förderband ohne Rand, der Föhn bläst von links ----------
    { type: 'weg', from: [5, 0, -81], to: [5, 0, -84], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [5, 0, -82.5], size: [4, 3, 2] },
    { type: 'band', from: [5, 0, -84], to: [5, 0, -98], width: 3, speed: 8 },
    { type: 'wind', at: [5, 0, -91], size: [3, 3, 4], yaw: -90, strength: 4 },
    { type: 'deko', form: 'shampoo', at: [-6, -6, -90], yaw: 30, scale: 1.4, farbe: 0x26C6DA },

    // ---------- Turbo, Schanze ins Lavabo, Wasserstrahl, Abfluss ----------
    { type: 'weg', from: [5, 0, -98], to: [5, 0, -101], width: 3, walls: 0.8 },
    { type: 'turbo', at: [5, 0, -99.5], size: [2.6, 2], speed: 10 },
    { type: 'weg', from: [5, 0, -101], to: [5, 1.2, -104], width: 3, walls: 0.5 },
    { type: 'schuessel', at: [5, -1.5, -112], r: 1.5, R: 4.5, h: 2, rim: 1, art: 'lavabo', abfluss: true, surface: 'pfuetze' },
    { type: 'strahl', at: [5, 4, -109], unten: -0.4, r: 0.6, hahn: true, yaw: 90, lang: 3.8, fuss: 3.6 },
    { type: 'wand', from: [-1, 0.5, -116.7], to: [11, 0.5, -116.7], height: 6 },
    { type: 'klotz', at: [5, 3.8, -116.45], size: [7, 4, 0.1], look: 'spiegel', deko: true },
    { type: 'roehre', from: [5, -1.5, -112], down: true, to: [5, -6.5, -128], toYaw: 0, bogen: 3, speed: 14, out: 6, fang: 0.7, farbe: 0xB0BEC5 },

    // ---------- Badewanne: Schiff, Schiff, Fähre, Schiff mit Trampolin ----------
    { type: 'wanne', at: [5, -8, -145], size: [9, 30], rim: 1.2, depth: 2, enten: [[-3, -10], [3.2, -2], [-3.2, 6], [3, 12]] },
    { type: 'schiff', at: [5, -8, -132.5], size: [4.5, 5], farbe: 0xE53935, trampolin: { vorne: 1.6, size: [3, 1.2], ziel: [5, -7.5, -139], time: 1 } },
    { type: 'checkpoint', at: [5, -7.5, -131.5], size: [4.5, 3, 3] },
    { type: 'schiff', at: [5, -8, -140], size: [4, 4], farbe: 0x1E88E5 },
    { type: 'checkpoint', at: [5, -7.5, -139.5], size: [4, 3, 2] },
    { type: 'schiff', at: [5, -8, -144.5], to: [5, -8, -151.5], size: [4, 5], farbe: 0xFB8C00, time: 2.5, pause: 3, surface: 'normal' },
    { type: 'schiff', at: [5, -8, -156.5], size: [4, 5], farbe: 0x43A047, trampolin: { vorne: 1.6, size: [3, 1.2], ziel: [5, -5, -165], time: 1.1 } },

    // ---------- Ablage mit zwei Klappen, hinunter in die Toilette ----------
    { type: 'weg', from: [5, -5, -162], to: [5, -5, -167], width: 3.4, walls: 0.6, caps: 'start' },
    { type: 'checkpoint', at: [5, -5, -163.5], size: [3.4, 3, 2] },
    { type: 'falltuer', at: [5, -5, -168.5], size: [3, 3] },
    { type: 'weg', from: [5, -5, -170], to: [5, -5, -172], width: 3 },
    { type: 'falltuer', at: [5, -5, -173.5], size: [3, 3] },
    { type: 'weg', from: [5, -5, -175], to: [5, -5.4, -178.5], width: 3, walls: 0.6 },
    { type: 'klo', at: [5, -8, -183], yaw: 0 },
    { type: 'ziel', at: [5, -8, -183] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [2.5, 5.3, -10] },
    { type: 'stern', at: [5, 0.9, -24] },
    { type: 'stern', at: [5, 0.9, -39] },
    { type: 'stern', at: [7, 0.9, -55] },
    { type: 'stern', at: [5, 0.9, -74.75] },
    { type: 'stern', at: [5, 0.9, -95] },
    { type: 'stern', at: [5, -6.6, -148] },
    { type: 'stern', at: [5, -4.1, -171] },
    { type: 'stern', at: [5, -4.5, -177] },
    { type: 'stern', at: [2.5, 0.9, -56], bonus: true }
  ]
};
