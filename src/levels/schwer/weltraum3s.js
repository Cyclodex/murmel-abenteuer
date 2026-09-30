// Weltraum 3 💀: Am Schwarzen Loch. Lange Magnet-Brücke ohne Rand, daneben zieht das Schwarze Loch,
// Gabelung: Stationsring mit zwei drehenden Armen und Hüllenlecks (Feld mit Löchern) oder schmaler Steg mit
// abstossendem Magnet ins Wurmloch (Bonusstern). Danach Andock-Klammer (Hammer), Luftschleusen und ein
// schneller Stationsarm vor dem Ziel.
export default {
  id: 'w3s', schwer: 'w3', name: 'Am Schwarzen Loch', emoji: '🕳️', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    // Magnet-Brücke: Magnete links und rechts, dann das Schwarze Loch
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -36], width: 2.2 },
    { type: 'checkpoint', at: [0, 0, -7.5], size: [2.2, 3, 2] },
    { type: 'magnet', at: [4, 0, -12], radius: 5, strength: 9 },
    { type: 'magnet', at: [-4, 0, -19], radius: 5, strength: 9 },
    { type: 'magnet', at: [5.5, 0, -28], radius: 7.5, strength: 12 },
    { type: 'deko', form: 'kristall', at: [6.5, -7, -28], scale: 1.4, farbe: 0x311B92, dreh: 90 },
    { type: 'deko', form: 'ufo', at: [10, -3, -31], scale: 0.5, dreh: 200, farbe: 0xFF4081 },
    // Station 1 (Gabelung)
    { type: 'weg', from: [0, 0, -36], to: [0, 0, -46], width: 12 },
    { type: 'checkpoint', at: [0, 0, -41], size: [12, 3, 4] },
    // rechts: Stationsring mit zwei Armen, danach Hüllenlecks
    { type: 'weg', from: [3, 0, -46], to: [3, 0, -70], width: 6 },
    { type: 'balken', at: [3, 0, -52], length: 5.5, speed: 35, farbe: 'blau' },
    { type: 'balken', at: [3, 0, -62], length: 5.5, speed: -35, farbe: 'rot' },
    { type: 'feld', at: [3, 0, -70], cell: 2, map: [
      '###',
      '#..',
      '##.',
      '.##',
      '..#',
      '.##',
      '##.'
    ] },
    { type: 'weg', from: [3, 0, -84], to: [3, 4, -96], width: 3 },
    // links: schmaler Steg, abstossender Magnet, Wurmloch zur Station 2
    { type: 'weg', from: [-4, 0, -46], to: [-4, 0, -62], width: 1.2 },
    { type: 'magnet', at: [-4, 0, -54], radius: 3, strength: -5 },
    { type: 'weg', from: [-4, 0, -62], to: [-4, 0, -66], width: 2, walls: 0.8, caps: 'end' },
    { type: 'roehre', from: [-4, 0, -64], yaw: 0, to: [-4, 4, -99], toYaw: 0, bogen: 8, speed: 10, farbe: 0xB388FF },
    // Station 2 (Treffpunkt)
    { type: 'weg', from: [0, 4, -96], to: [0, 4, -106], width: 12 },
    { type: 'checkpoint', at: [0, 4, -101], size: [12, 3, 4] },
    // Andock-Klammer (Hammer) und Luftschleusen
    { type: 'weg', from: [0, 4, -106], to: [0, 4, -118], width: 3, walls: 0.6 },
    { type: 'hammer', at: [0, 4, -112], side: -1, length: 4, size: [2.6, 1.4, 1.6], farbe: 'blau' },
    { type: 'weg', from: [0, 4, -118], to: [0, 4, -120], width: 3 },
    { type: 'falltuer', at: [0, 4, -121.5], size: [3, 3] },
    { type: 'weg', from: [0, 4, -123], to: [0, 4, -125], width: 3 },
    { type: 'falltuer', at: [0, 4, -126.5], size: [3, 3] },
    { type: 'weg', from: [0, 4, -128], to: [0, 4, -130], width: 3 },
    // Zielstation mit schnellem Arm
    { type: 'weg', from: [0, 4, -130], to: [0, 4, -146], width: 8, walls: 0.8, caps: 'end' },
    { type: 'wand', from: [-4.4, 4, -130], to: [-1.5, 4, -130] },
    { type: 'wand', from: [1.5, 4, -130], to: [4.4, 4, -130] },
    { type: 'checkpoint', at: [0, 4, -132.5], size: [8, 3, 3] },
    { type: 'balken', at: [0, 4, -138], length: 6, speed: 40, farbe: 'lila' },
    { type: 'ziel', at: [0, 4, -143] },
    // Weltraum rundherum
    { type: 'deko', form: 'satellit', at: [-12, 5, -20], dreh: 30, farbe: 0x8E24AA },
    { type: 'deko', form: 'ufo', at: [14, 8, -70], dreh: 40 },
    { type: 'deko', form: 'kristall', at: [-5, 4, -104], scale: 0.7, fest: true },
    { type: 'deko', form: 'kristall', at: [5, 4, -104], scale: 0.7, fest: true, farbe: 0x4FC3F7 },
    { type: 'deko', form: 'rakete', at: [10, 4, -140], yaw: 15, farbe: 0xFFC928 },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -17] },
    { type: 'stern', at: [0, 0.9, -28] },
    { type: 'stern', at: [0, 0.9, -43] },
    { type: 'stern', at: [0, 4.9, -101] },
    { type: 'stern', at: [0, 4.9, -112] },
    { type: 'stern', at: [0, 4.9, -124] },
    { type: 'stern', at: [2.6, 4.9, -138] },
    { type: 'stern', at: [-4, 0.9, -57], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [1.3, 0, -38.5], to: [2.3, 0, -42.2], count: 3 },
    { type: 'domino', at: [-3.2, 4, -141.5], yaw: 180 },
    { type: 'domino', at: [4.3, 4, -97.5], yaw: 40 },
    { type: 'domino', at: [-1.2, 0, -4], yaw: 26 },
    { type: 'domino', at: [1.8, 0, -70], yaw: 23 }
  ]
};
