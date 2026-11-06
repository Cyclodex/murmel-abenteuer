// Winter 2: Eisweiher. Neu: Bobbahn (Rinne in S-Kurven), zugefrorener Weiher mit Eislöchern (spiegelglatt!),
// Skilift (Plattform fährt schräg hinauf zur Berghütte).
export default {
  id: 'wi2', name: 'Eisweiher', emoji: '⛸️', theme: 'winter',
  start: [0, 7, 2], killY: -6,
  parts: [
    // Starthaus der Bobbahn oben am Hang
    { type: 'weg', from: [0, 7, 6], to: [0, 7, -4], width: 4, walls: 0.8, caps: 'start' },
    { type: 'klotz', at: [-6.4, 6.5, 1], size: [8, 1, 9], look: 'schnee', deko: true },
    { type: 'deko', form: 'huette', at: [-6.6, 7, 1], yaw: -90, scale: 0.8 },
    { type: 'deko', form: 'torstange', at: [-2.2, 7.8, -3.6], farbe: 0xE53935 },
    { type: 'deko', form: 'torstange', at: [2.2, 7.8, -3.6], farbe: 0x1E88E5 },
    // Bobbahn: gerade hinunter, dann S-Kurven (rechts, links herum zurück, rechts)
    { type: 'rinne', from: [0, 7, -4], to: [0, 5, -12], r: 1.6, bogen: 75, farbe: 0xBFE6FA },
    { type: 'rinne', at: [0, 5, -12], yaw: 0, turn: 90, radius: 5, rise: -1.25, r: 1.6, bogen: 75, farbe: 0xBFE6FA },
    { type: 'rinne', at: [5, 3.75, -17], yaw: -90, turn: -180, radius: 5, rise: -2.5, r: 1.6, bogen: 75, farbe: 0xBFE6FA },
    { type: 'rinne', at: [5, 1.25, -27], yaw: 90, turn: 90, radius: 5, rise: -1.25, r: 1.6, bogen: 75, farbe: 0xBFE6FA },
    // Auslauf im Pulverschnee (bremst und schluckt Hüpfer)
    { type: 'weg', from: [0, 0, -32], to: [0, 0, -40], width: 4, walls: 0.8, surface: 'schnee' },
    { type: 'checkpoint', at: [0, 0, -37], size: [4, 3, 2] },

    // Eisweiher: Eis mit drei Fischerlöchern, rundherum Schnee; auf der Schneeinsel hinter dem Loch der Bonusstern
    { type: 'feld', at: [0, 0, -40], cell: 2, walls: 0.8, thick: 0.5, map: [
      'nnnnnnn',
      'neeeeen',
      'ne.eeen',
      'neeeeen',
      'neeenen',
      'n.ee.en',
      'neeeeen',
      'neeeeen',
      'nnnnnnn'
    ] },
    { type: 'wand', from: [-7.4, 0, -40.2], to: [-2.4, 0, -40.2] },
    { type: 'wand', from: [2.4, 0, -40.2], to: [7.4, 0, -40.2] },
    { type: 'wand', from: [-7.4, 0, -57.8], to: [-2.9, 0, -57.8] },
    { type: 'wand', from: [2.9, 0, -57.8], to: [7.4, 0, -57.8] },
    { type: 'klotz', at: [0, -0.7, -49], size: [14, 0.2, 18], look: 'pfuetze', deko: true }, // Wasser unter dem Eis
    { type: 'deko', form: 'pinguin', at: [-6.1, 0, -47], yaw: -90, scale: 0.6, fest: true },
    { type: 'deko', form: 'pinguin', at: [4.2, 0, -47], yaw: 90, scale: 0.6, fest: true },
    { type: 'deko', form: 'fisch', at: [-4.3, 0, -53.2], yaw: 20, scale: 0.35 },
    // Ufer mit Tannen, Iglu und Schneemann (nur Kulisse)
    { type: 'klotz', at: [-11.4, -0.5, -49], size: [8, 1, 20], look: 'schnee', deko: true },
    { type: 'klotz', at: [11.4, -0.5, -49], size: [8, 1, 20], look: 'schnee', deko: true },
    { type: 'deko', form: 'iglu', at: [-11.2, 0, -50], yaw: -90, scale: 0.7 },
    { type: 'deko', form: 'tanne', at: [-10.6, 0, -43] },
    { type: 'deko', form: 'tanne', at: [-12.4, 0, -56], scale: 0.8 },
    { type: 'deko', form: 'tanne', at: [11.8, 0, -55.5] },
    { type: 'deko', form: 'schneemann', at: [10.2, 0, -45.5], yaw: 90 },

    // Talstation, Skilift schräg hinauf über die Schlucht
    { type: 'weg', from: [0, 0, -58], to: [0, 0, -64], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -60], size: [5, 3, 2] },
    { type: 'plattform', from: [0, 0, -66], to: [0, 3, -74], size: [4.5, 4], time: 3, pause: 2.5, rim: 0.5, offset: 7 },
    // Liftmasten mit Querbalken und Seil (nur Kulisse)
    { type: 'klotz', at: [-4.7, -0.25, -63], size: [0.5, 13.5, 0.5], look: 'stamm', deko: true },
    { type: 'klotz', at: [4.7, -0.25, -63], size: [0.5, 13.5, 0.5], look: 'stamm', deko: true },
    { type: 'klotz', at: [0, 6.7, -63], size: [10.4, 0.4, 0.5], look: 'stamm', deko: true },
    { type: 'klotz', at: [-4.7, 1.25, -77], size: [0.5, 16.5, 0.5], look: 'stamm', deko: true },
    { type: 'klotz', at: [4.7, 1.25, -77], size: [0.5, 16.5, 0.5], look: 'stamm', deko: true },
    { type: 'klotz', at: [0, 9.7, -77], size: [10.4, 0.4, 0.5], look: 'stamm', deko: true },
    { type: 'wand', from: [0, 6.3, -63], to: [0, 9.3, -77], height: 0.12, thick: 0.12, look: 'band' },
    // Bergstation mit Hütte
    { type: 'weg', from: [0, 3, -76], to: [0, 3, -90], width: 8, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [0, 3, -78], size: [8, 3, 2] },
    { type: 'deko', form: 'huette', at: [0, 3, -86.8], yaw: 180, scale: 0.75, fest: true },
    { type: 'ziel', at: [0, 3, -82] },

    { type: 'stern', at: [0, 7.9, -1] },
    { type: 'stern', at: [10, 3.4, -22] },
    { type: 'stern', at: [-1, 0.9, -47] },
    { type: 'stern', at: [1, 0.9, -53] },
    { type: 'stern', at: [0, 2.4, -70] },
    { type: 'stern', at: [2, 0.9, -49], bonus: true }
  ]
};
