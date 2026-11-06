// Werkstatt 1: Werkbank. Die Strecke läuft ohne Rand der Werkbank entlang. Gefahren: Auf der Werkbank-Kante liegt Werkzeug
// (Schrauben, Muttern, ein Rollmeter) als feste Hindernisse, man zielt durch die schmalen Lücken neben der Kante. Dann fahren
// die Schubladen im Takt aus der Bank und schieben die Murmel vom Brett ohne Rand: in den Lücken zwischen ihnen warten.
// Vier Schubladen mit verschiedenen Takten. Zwei Bohrmaschinen (links und rechts, gegenläufig) drehen ihre Bohrer quer über
// einen schmalen Weg ohne Rand (abpassen, zwischen ihnen warten), dann ein Brett ohne Rand hinauf zum Rollmeter.
// Den Schalter am Ende eines ganz schmalen Stegs drücken, dann trägt das Messband ohne Rand als einzige Brücke zum Ziel.
// Bonusstern: hinter dem Schalter am Ende des Stegs.
const M = -7;        // Schneidematte (killY - 1): dort steht das riesige Werkzeug
const Y1 = 1.5;      // Höhe beim Rollmeter (nach dem Brett hinauf)
const XB = -1.5;     // Achse des Messbands
const KANTE = 2.8;   // Breite der Werkbank-Kante
// Werkzeug als Hindernis auf der Kante: [form, x, z, scale, yaw]
const WERKZEUG = [['schraube', 0.7, -7, 0.3, 0], ['mutter', -0.75, -11, 0.4, 20], ['rollmeter', 0.72, -15, 0.4, 0],
  ['schraube', -0.7, -19, 0.3, 0], ['mutter', 0.75, -22, 0.4, -15]];
// Schubladen: [z, time, pause, offset]
const LADE = [[-31, 0.9, 2.2, 0], [-36, 0.7, 2.0, 1.1], [-41, 1.1, 1.8, 2.3], [-46, 0.8, 1.6, 0.6]];
// Bohrmaschinen: [x, z, speed]
const BOHRER = [[-2.6, -59, 40], [2.6, -67, -50]];

export default {
  id: 'ws1', name: 'Werkbank', emoji: '🪵', theme: 'werkstatt',
  start: [0, 0, 2], killY: -6,
  parts: [
    // Start neben dem riesigen Werkzeugkasten
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 5, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'werkzeugkasten', at: [-9.5, M, 0], yaw: -90, scale: 2.2 },

    // Werkbank-Kante ohne Rand, Werkzeug liegt im Weg
    { type: 'weg', from: [0, 0, -3], to: [0, 0, -24], width: KANTE, look: 'latte-natur' },
    ...WERKZEUG.map(([form, x, z, scale, yaw]) => ({ type: 'deko', form, at: [x, 0, z], scale, yaw, fest: true })),
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -28], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -26], size: [3, 3, 2] },

    // Schubladen fahren rechts aus der Werkbank quer über das Brett ohne Rand
    { type: 'weg', from: [0, 0, -28], to: [0, 0, -49], width: 2.2 },
    { type: 'klotz', at: [3.7, 1, -38.5], size: [5, 3, 21], look: 'latte-dunkel' },
    ...LADE.map(([z, time, pause, offset]) => ({ type: 'schieber', from: [2.5, 0, z], to: [-0.4, 0, z], size: [2.4, 0.9, 2], time, pause, offset, look: 'latte-natur' })),
    { type: 'weg', from: [0, 0, -49], to: [0, 0, -53], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -51], size: [3, 3, 2] },

    // Bohrmaschinen links und rechts: die Bohrer drehen quer über den schmalen Weg, dann ein Brett ohne Rand hinauf
    { type: 'weg', from: [0, 0, -53], to: [0, 0, -71], width: 1.6 },
    ...BOHRER.map(([x, z, speed]) => [
      { type: 'balken', at: [x, 0, z], length: 6.4, speed, farbe: 'stahl' },
      { type: 'klotz', at: [x, -1.5, z], size: [1.6, 3, 2.4], look: 'latte-blau', deko: true }]).flat(),
    { type: 'weg', from: [0, 0, -71], to: [0, Y1, -79], width: 1.6 },

    // Rollmeter-Plattform: rechts ein ganz schmaler Steg zum Schalter, links das Gehäuse, sein Band ist die einzige Brücke
    { type: 'weg', from: [0, Y1, -79], to: [0, Y1, -87], width: 6 },
    { type: 'wand', from: [-3.2, Y1, -78.8], to: [-0.8, Y1, -78.8] },
    { type: 'wand', from: [0.8, Y1, -78.8], to: [3.2, Y1, -78.8] },
    { type: 'wand', from: [-3.2, Y1, -79], to: [-3.2, Y1, -87.2] },
    { type: 'wand', from: [3.2, Y1, -79], to: [3.2, Y1, -81.4] },
    { type: 'wand', from: [3.2, Y1, -82.6], to: [3.2, Y1, -87.2] },
    { type: 'wand', from: [-3.2, Y1, -87.2], to: [XB - 0.9, Y1, -87.2] },
    { type: 'wand', from: [XB + 0.9, Y1, -87.2], to: [3.2, Y1, -87.2] },
    { type: 'checkpoint', at: [1, Y1, -80.5], size: [3, 3, 2] },
    { type: 'weg', from: [3, Y1, -82], to: [9.5, Y1, -82], width: 1.2 },
    { type: 'schalter', at: [6.4, Y1, -82], id: 'm1' },
    { type: 'messband', from: [XB, Y1, -84], to: [XB, Y1, -100], width: 1.6, id: 'm1', kante: 3, rand: 0 },

    // drüben: Podest vor dem Hammer, Ziel
    { type: 'weg', from: [XB, Y1, -100], to: [XB, Y1, -106], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [XB, Y1, -103.5] },
    { type: 'klotz', at: [XB, (M + Y1) / 2, -110.5], size: [5, Y1 - M, 9], look: 'latte-dunkel', deko: true },
    { type: 'deko', form: 'hammer', at: [XB, Y1, -111], yaw: 0 },

    // Sterne: in der Lücke neben der Mutter, zwischen den Schubladen an der Kante, beim Bohrer, auf dem Brett hinauf,
    // mitten auf dem Messband; Bonus hinter dem Schalter
    { type: 'stern', at: [0.75, 0.9, -11] },
    { type: 'stern', at: [-0.7, 0.9, -33.5] },
    { type: 'stern', at: [0.4, 0.9, -63] },
    { type: 'stern', at: [0, Y1 / 2 + 0.9, -75] },
    { type: 'stern', at: [XB, Y1 + 0.9, -94] },
    { type: 'stern', at: [9, Y1 + 0.9, -82], bonus: true },

    // riesiges Werkzeug neben der Bahn (nur Optik)
    { type: 'klotz', at: [7, (M - 0.5) / 2, -10], size: [6, -0.5 - M, 13], look: 'latte-natur', deko: true },
    { type: 'deko', form: 'saege', at: [7.2, -0.5, -10], yaw: 8 },
    { type: 'deko', form: 'schraube', at: [-6, M, -21], yaw: 30, scale: 2 },
    { type: 'deko', form: 'farbdose', at: [-8, M, -40], yaw: 40, scale: 2.4, farbe: 0xE53935 },
    { type: 'deko', form: 'bleistift', at: [3.7, 2.5, -36], yaw: 0, scale: 1.2 },
    { type: 'deko', form: 'farbdose', at: [6, M, -73], yaw: -20, scale: 2.2, farbe: 0x1E88E5 },
    { type: 'deko', form: 'mutter', at: [-9, M, -93], yaw: 25, scale: 1.4 },
    { type: 'deko', form: 'saegeblatt', at: [8, M, -95], scale: 1.3, dreh: 40 }
  ]
};
