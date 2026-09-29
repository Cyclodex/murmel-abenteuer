// Ausflug 💀: Bergab-Mission vom Gipfel ins Tal. Weggabelung (schmaler Grat oder Treppe mit Hammer),
// Fluss mit Steinen, Brücke mit Falltüren, Steinschlag quer über den Weg.
export default {
  id: 'ausflugs', schwer: 'ausflug', name: 'Vom Gipfel ins Tal', emoji: '🏔️', theme: 'garten',
  start: [0, 20, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 20, 6], to: [0, 20, -4], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 20, -4], to: [0, 20, -10], width: 8 },
    // links: schmaler Grat ohne Rand (Bonusstern), rechts: Treppe und Hammer
    { type: 'weg', from: [-2.5, 20, -10], to: [-2.5, 14, -34], width: 1.8 },
    { type: 'treppe', from: [2.5, 20, -10], to: [2.5, 14, -22], steps: 8, width: 3, walls: 0.6 },
    { type: 'weg', from: [2.5, 14, -22], to: [2.5, 14, -34], width: 3, walls: 0.6 },
    { type: 'hammer', at: [2.5, 14, -28], side: 1, length: 4, size: [2.6, 1.4, 1.6] },
    { type: 'weg', from: [0, 14, -34], to: [0, 14, -40], width: 8 },
    { type: 'checkpoint', at: [0, 14, -36.5], size: [8, 3, 3] },
    // Fluss hinunter, Steine im Wasser
    { type: 'fluss', from: [0, 14, -40], to: [0, 8, -64], width: 3.6, speed: 4 },
    { type: 'deko', form: 'stein', at: [-1, 11.05, -49], scale: 0.45, fest: true },
    { type: 'deko', form: 'stein', at: [1, 9.55, -55], scale: 0.45, fest: true },
    { type: 'weg', from: [0, 7.3, -64], to: [0, 7.3, -70], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 7.3, -67], size: [6, 3, 3] },
    // Brücke mit Falltüren
    { type: 'weg', from: [0, 7.3, -70], to: [0, 7.3, -72], width: 3 },
    { type: 'falltuer', at: [0, 7.3, -73.5], size: [3, 3] },
    { type: 'weg', from: [0, 7.3, -75], to: [0, 7.3, -77], width: 3 },
    { type: 'falltuer', at: [0, 7.3, -78.5], size: [3, 3] },
    { type: 'weg', from: [0, 7.3, -80], to: [0, 7.3, -82], width: 3 },
    { type: 'falltuer', at: [0, 7.3, -83.5], size: [3, 3] },
    { type: 'weg', from: [0, 7.3, -85], to: [0, 7.3, -90], width: 4 },
    { type: 'checkpoint', at: [0, 7.3, -87.5], size: [4, 3, 3] },
    // Steinschlag: Felsen rollen von rechts quer über den abschüssigen Weg
    { type: 'weg', from: [0, 7.3, -90], to: [0, 4, -106], width: 4 },
    { type: 'weg', from: [16, 10, -98], to: [2, 5.65, -98], width: 3, walls: 0.6 },
    { type: 'felsen', from: [15, 10.5, -98], dir: [-1, 0], speed: 3, every: 5 },
    { type: 'weg', from: [0, 4, -106], to: [0, 4, -118], width: 6, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [0, 4, -108], size: [6, 3, 3] },
    { type: 'ziel', at: [0, 4, -115] },
    // Landschaft
    { type: 'deko', form: 'baum', at: [-9, 6, -20], scale: 0.9 },
    { type: 'deko', form: 'baum', at: [10, 2, -60] },
    { type: 'deko', form: 'zwerg', at: [-4.5, 7.3, -66], yaw: 30, scale: 0.5 },
    { type: 'deko', form: 'pilz', at: [4, 14, -38], scale: 0.6 },

    { type: 'stern', at: [0, 20.9, -1] },
    { type: 'stern', at: [2.5, 14.9, -28] },
    { type: 'stern', at: [0, 11.5, -52] },
    { type: 'stern', at: [0, 8.2, -78.5] },
    { type: 'stern', at: [0, 6.5, -98] },
    { type: 'stern', at: [0, 4.9, -111] },
    { type: 'stern', at: [-2.5, 17.4, -22], bonus: true }
  ]
};
