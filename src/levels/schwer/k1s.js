// Küche 1 💀: Am Herd. Schnelles Förderband ohne Rand, Kassenbänder quer, Kochfeld mit heissen Herdplatten und
// Pfannenwender, durch die heisse Pfanne, Weggabelung (schmaler Kochlöffel mit Fleischklopfer oder Band, das
// zurückschiebt), Toaster als Trampolin aufs Regal, Fleischklopfer und zum Schluss hinein in den Suppentopf.
export default {
  id: 'k1s', schwer: 'k1', name: 'Am heissen Herd', emoji: '🍳', theme: 'kueche',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // schnelles Förderband ohne Rand, dann zwei Kassenbänder, die quer schieben
    { type: 'band', from: [0, 0, -4], to: [0, 0, -20], width: 2.6, speed: 7 },
    { type: 'band', from: [-1.5, 0, -22], to: [1.5, 0, -22], width: 4, speed: 3, grip: 3 },
    { type: 'weg', from: [0, 0, -24], to: [0, 0, -26], width: 3 },
    { type: 'band', from: [1.5, 0, -28], to: [-1.5, 0, -28], width: 4, speed: 3, grip: 3 },
    { type: 'deko', form: 'salz', at: [-5, -9, -9], scale: 3 },
    { type: 'deko', form: 'salz', at: [5, -9, -14], scale: 3, farbe: 0x424242 },
    { type: 'deko', form: 'milch', at: [-7, -9, -24], yaw: 20, scale: 1.5 },
    { type: 'deko', form: 'kaese', at: [6, -9, -26], yaw: -15, scale: 3 },
    // Kochfeld: schwarze Glasplatte mit Herdplatten, der Pfannenwender schiebt quer darüber
    { type: 'weg', from: [0, 0, -30], to: [0, 0, -52], width: 14, look: 'band' },
    { type: 'checkpoint', at: [0, 0, -32], size: [14, 3, 3] },
    { type: 'herdplatte', at: [-3.5, 0, -38], r: 2.2 },
    { type: 'herdplatte', at: [3.5, 0, -38], r: 2.2 },
    { type: 'herdplatte', at: [-3.5, 0, -46], r: 2.2 },
    { type: 'herdplatte', at: [3.5, 0, -46], r: 2.2 },
    { type: 'herdplatte', at: [0, 0, -50], r: 1.3 },
    { type: 'schieber', from: [-8, 0, -42], to: [8, 0, -42], size: [2, 1.2, 3], time: 2.5, pause: 1 },
    { type: 'deko', form: 'teekanne', at: [-13, -9, -40], yaw: 30, scale: 1.8 },
    { type: 'deko', form: 'tasse', at: [12, -9, -48], yaw: -40, scale: 2, farbe: 0xE53935 },
    // Rampe hinauf auf den Rand der Pfanne, drinnen ist es heiss (die Murmel hüpft)
    { type: 'weg', from: [0, 0, -52], to: [0, 1.2, -55.4], width: 2.6 },
    { type: 'schuessel', at: [0, 0, -61], r: 3, R: 5, h: 1.2, rim: 0.4, art: 'pfanne', offen: [0], griff: 90 },
    { type: 'herdplatte', at: [0, 0, -61], r: 1.6, jump: 3 },
    { type: 'weg', from: [0, 0, -63], to: [0, 0, -70], width: 2 },
    { type: 'checkpoint', at: [0, 0, -66], size: [2, 3, 2] },
    { type: 'weg', from: [0, 0, -70], to: [0, 0, -76], width: 10, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -72], size: [10, 3, 3] },
    { type: 'deko', form: 'apfel', at: [-10, -9, -72], scale: 2 },
    { type: 'deko', form: 'tomate', at: [9, -9, -60], scale: 2.5 },
    // Gabelung links: schmaler Kochlöffel ohne Rand mit Fleischklopfer (kurz, gemein)
    { type: 'weg', from: [-3, 0, -76], to: [-3, 0, -98], width: 1.4, look: 'ramp' },
    { type: 'hammer', at: [-3, 0, -87], side: -1, length: 4, size: [2.2, 1.4, 1.6], farbe: 'gelb' },
    // rechts: Band, das zurückschiebt, mit Rand
    { type: 'band', from: [3.5, 0, -98], to: [3.5, 0, -76], width: 3, walls: 0.8, speed: 2, grip: 1 },
    { type: 'weg', from: [0, 0, -98], to: [0, 0, -104], width: 10, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -101], size: [10, 3, 3] },
    // Toaster: Trampolin im Schlitz, hinauf aufs Regal
    { type: 'weg', from: [0, 0, -104], to: [0, 0, -108], width: 3.4 },
    { type: 'deko', form: 'toaster', at: [0, -9, -106], yaw: 90, scale: 2 },
    { type: 'trampolin', at: [0, 0, -107], size: [3, 1.6], jump: 10, tempo: 4 },
    { type: 'weg', from: [0, 3, -111], to: [0, 3, -128], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 3, -117], size: [5, 3, 3] },
    { type: 'deko', form: 'glas', at: [-6, -9, -115], scale: 2 },
    { type: 'deko', form: 'flasche', at: [7, -9, -120], scale: 1.7 },
    // Fleischklopfer auf dem Regal
    { type: 'hammer', at: [0, 3, -122], side: 1, length: 4, size: [2.6, 1.4, 1.6] },
    // Kurve und Band hinauf zum Suppentopf, hineinplumpsen
    { type: 'kurve', at: [0, 3, -128], yaw: 0, turn: -90, radius: 4, width: 4, walls: 0.8 },
    { type: 'band', from: [-4, 3, -132], to: [-17.6, 6.2, -132], width: 3, walls: 0.8, speed: 5 },
    { type: 'schuessel', at: [-22, 3, -132], r: 2.5, R: 4, h: 3.2, rim: 0.5, art: 'topf', griff: 0 },
    { type: 'ziel', at: [-22, 3, -132], r: 2 },

    { type: 'stern', at: [0, 0.9, -1] },
    { type: 'stern', at: [0, 0.9, -13] },
    { type: 'stern', at: [0, 0.9, -42] },
    { type: 'stern', at: [0, 0.9, -61] },
    { type: 'stern', at: [0, 0.9, -102] },
    { type: 'stern', at: [0, 3.9, -115] },
    { type: 'stern', at: [-11, 5.5, -132] },
    { type: 'stern', at: [-3, 0.9, -92], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [-2.3, 0, -31.3], to: [-1.8, 0, -35.1], count: 3 },
    { type: 'domino', at: [0.2, 3, -130.3], yaw: 4 },
    { type: 'domino', at: [0.2, 0, -74.8], yaw: 53 },
    { type: 'domino', at: [-2.8, 0, -102.3], yaw: -32 },
    { type: 'domino', at: [3.7, 0, -50.3], yaw: -19 }
  ]
};
