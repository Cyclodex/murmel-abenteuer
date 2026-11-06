// Werkstatt 1: Werkbank. Neu: Sägemehl bremst – und das Messband: Schalter drücken, dann fährt es als Brücke über die Lücke.
const Y = 2;       // Höhe der oberen Werkbank (nach dem Brett)
const ZB = -30.7;  // Mitte des Messbands und des Wegs danach
export default {
  id: 'ws1', name: 'Werkbank', emoji: '🪵', theme: 'werkstatt',
  start: [0, 0, 2], killY: -8,
  parts: [
    // Start neben dem riesigen Werkzeugkasten
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'werkzeugkasten', at: [-9.5, -9, 0], yaw: -90, scale: 2.2 },
    // Sägemehl bremst; daneben liegt der Fuchsschwanz auf einem Holzklotz
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -12], width: 5, walls: 0.8, surface: 'saegemehl' },
    { type: 'weg', from: [0, 0, -12], to: [0, 0, -15], width: 5, walls: 0.8 },
    { type: 'klotz', at: [7, -4.5, -10], size: [7, 9, 13], look: 'latte-natur', deko: true },
    { type: 'deko', form: 'saege', at: [7.2, 0, -10], yaw: 8 },
    { type: 'klotz', at: [4.3, 0.2, -7.4], size: [1.8, 0.4, 1.4], yaw: 20, look: 'saegemehl', deko: true },
    { type: 'klotz', at: [4.6, 0.15, -11.2], size: [1.3, 0.3, 1.1], yaw: -15, look: 'saegemehl', deko: true },
    { type: 'deko', form: 'mutter', at: [8.6, 0, -15], yaw: 25, scale: 0.6 },
    // ein Brett als Rampe hinauf auf die obere Werkbank, links steckt eine riesige Schraube
    { type: 'weg', from: [0, 0, -15], to: [0, Y, -25], width: 4, walls: 0.8 },
    { type: 'deko', form: 'schraube', at: [-6, -9, -21], yaw: 30, scale: 2 },
    { type: 'weg', from: [0, Y, -25], to: [0, Y, -28], width: 4, walls: 0.8 },
    // Kurve nach links um die Farbdose
    { type: 'kurve', at: [0, Y, -28], yaw: 0, turn: -90, radius: 5, width: 4, walls: 0.8 },
    { type: 'deko', form: 'farbdose', at: [8, -9, -35], yaw: 40, scale: 2.4, farbe: 0xE53935 },
    { type: 'weg', from: [-5, Y, -33], to: [-9, Y, -33], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [-7, Y, -33], yaw: 90, size: [4, 3, 3] },

    // Plattform mit dem Rollmeter: rechts den Schalter drücken, dann links neben dem Gehäuse aufs Band und über die Lücke.
    // Latten ringsum, offen ist nur die Stelle, wo das Band liegt; rechts liegt ein Bleistift am Rand
    { type: 'weg', from: [-9, Y, -33], to: [-17, Y, -33], width: 9 },
    { type: 'wand', from: [-8.8, Y, -35.4], to: [-8.8, Y, -37.9] },
    { type: 'wand', from: [-8.8, Y, -28.1], to: [-8.8, Y, -30.6] },
    { type: 'wand', from: [-9, Y, -37.7], to: [-17.4, Y, -37.7] },
    { type: 'wand', from: [-9, Y, -28.3], to: [-17.4, Y, -28.3] },
    { type: 'wand', from: [-17.2, Y, -32.7], to: [-17.2, Y, -37.9] },
    { type: 'deko', form: 'bleistift', at: [-13, Y, -37.15], yaw: 90, scale: 0.72, fest: true },
    { type: 'schalter', at: [-13, Y, -35.5], id: 'm1' },
    { type: 'messband', from: [-12, Y, ZB], to: [-25, Y, ZB], width: 3, id: 'm1', kante: 5 },

    // drüben: Checkpoint, rechts eine Nische voll Sägemehl mit dem Bonusstern, Ziel vor dem Hammer
    { type: 'weg', from: [-25, Y, ZB], to: [-37.5, Y, ZB], width: 5 },
    { type: 'wand', from: [-25, Y, ZB + 2.7], to: [-37.5, Y, ZB + 2.7] },
    { type: 'wand', from: [-25, Y, ZB - 2.7], to: [-29.5, Y, ZB - 2.7] },
    { type: 'wand', from: [-32, Y, ZB - 2.7], to: [-37.5, Y, ZB - 2.7] },
    { type: 'wand', from: [-37.5, Y, ZB - 2.9], to: [-37.5, Y, ZB + 2.9] },
    { type: 'nische', at: [-30.75, Y, ZB - 2.5], yaw: 0, surface: 'saegemehl' },
    { type: 'checkpoint', at: [-27, Y, ZB], yaw: 90, size: [5, 3, 3] },
    { type: 'ziel', at: [-35, Y, ZB] },
    { type: 'klotz', at: [-41.1, -3.5, ZB], size: [5, 11, 12], look: 'latte-dunkel', deko: true },
    { type: 'deko', form: 'hammer', at: [-41.1, Y, ZB], yaw: 0 },
    { type: 'deko', form: 'farbdose', at: [-31, -9, -21.5], yaw: -20, scale: 2.4, farbe: 0x1E88E5 },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 0.9, -9] },
    { type: 'stern', at: [0, 1.9, -20] },
    { type: 'stern', at: [-1.46, Y + 0.9, -31.54] },
    { type: 'stern', at: [-21, Y + 0.9, ZB] },
    { type: 'stern', at: [-30.75, Y + 0.9, ZB - 5], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', at: [1.8, 0, 4.6], yaw: 20 },
    { type: 'domino', at: [-1.7, 0, -13.6], yaw: 95 },
    { type: 'domino', at: [-36.4, Y, ZB - 1.7], yaw: 35 }
  ]
};
