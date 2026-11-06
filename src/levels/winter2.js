// Winter 2: Eisweiher. Bobbahn mit flachen Kurven: wer zu schnell ist, fliegt über den Rand hinaus (bremsen!).
// Der Weiher ist voller Eisrisse: nur ein Streifen Eis hält, diagonal im Zickzack, ohne Rand und spiegelglatt.
// Dann zwei treibende Eisschollen ohne Rand, selbst aus Eis: die erste fährt über den Weiher, die zweite quer
// zum Steg hinüber. Takt abwarten, aufspringen, stillhalten, am anderen Ufer absteigen. Zum Schluss eine
// randlose Eiskurve zur Fischerhütte.
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
    // Bobbahn: steil hinunter, dann S-Kurven mit flachem Rand (zu schnell = hinausfliegen)
    { type: 'rinne', from: [0, 7, -4], to: [0, 5, -12], r: 1.6, bogen: 75, farbe: 0xBFE6FA },
    { type: 'rinne', at: [0, 5, -12], yaw: 0, turn: 90, radius: 5, rise: -1.25, r: 1.6, bogen: 45, farbe: 0xBFE6FA },
    { type: 'rinne', at: [5, 3.75, -17], yaw: -90, turn: -180, radius: 5, rise: -2.5, r: 1.6, bogen: 45, farbe: 0xBFE6FA },
    { type: 'rinne', at: [5, 1.25, -27], yaw: 90, turn: 90, radius: 5, rise: -1.25, r: 1.6, bogen: 45, farbe: 0xBFE6FA },
    // Auslauf im Pulverschnee (bremst und schluckt Hüpfer)
    { type: 'weg', from: [0, 0, -32], to: [0, 0, -40], width: 4, walls: 0.8, surface: 'schnee' },
    { type: 'checkpoint', at: [0, 0, -37], size: [4, 3, 2] },

    // Eisrisse: nur der diagonale Streifen hält (Zickzack, ohne Rand); Abstecher zu den Sternen
    { type: 'feld', at: [0, 0, -40], cell: 2.4, map: [
      '..nnn..',
      '..ee...',
      '...ee.e',
      '....eee',
      '....ee.',
      '...ee..',
      '..ee...',
      '.ee....',
      'ee.....',
      'eee....',
      '.ee....',
      '..ee...',
      '..nnn..'
    ] },
    { type: 'klotz', at: [0, -0.7, -71], size: [20, 0.2, 64], look: 'pfuetze', deko: true }, // offenes Wasser
    { type: 'deko', form: 'pinguin', at: [-9.6, 0, -60], yaw: -90, scale: 0.6 },
    { type: 'deko', form: 'pinguin', at: [9.8, 0, -47], yaw: 90, scale: 0.6 },
    { type: 'deko', form: 'fisch', at: [4.3, -0.5, -52], yaw: 20, scale: 0.35 },
    // Ufer mit Tannen, Iglu und Schneemann (nur Kulisse)
    { type: 'klotz', at: [-14, -0.5, -60], size: [8, 1, 44], look: 'schnee', deko: true },
    { type: 'klotz', at: [14, -0.5, -60], size: [8, 1, 44], look: 'schnee', deko: true },
    { type: 'deko', form: 'iglu', at: [-13.8, 0, -54], yaw: -90, scale: 0.7 },
    { type: 'deko', form: 'tanne', at: [-13, 0, -44] },
    { type: 'deko', form: 'tanne', at: [-14.5, 0, -70], scale: 0.8 },
    { type: 'deko', form: 'tanne', at: [14, 0, -66] },
    { type: 'deko', form: 'schneemann', at: [12.8, 0, -50], yaw: 90 },
    { type: 'weg', from: [0, 0, -71.2], to: [0, 0, -75], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -73], size: [4, 3, 2] },

    // Erste Eisscholle: treibt über den Weiher, ohne Rand und glatt
    { type: 'plattform', from: [0, 0, -77], to: [0, 0, -87], size: [3.6, 3.6], time: 4.5, pause: 3.5, rim: 0, surface: 'eis', offset: 13.8 },
    { type: 'weg', from: [0, 0, -89], to: [0, 0, -93], width: 3.6, walls: 0.6 },
    { type: 'checkpoint', at: [0, 0, -91], size: [3.6, 3, 2] },
    // Zweite Eisscholle: vom schmalen Eissteg quer hinüber zum anderen Steg
    { type: 'weg', from: [0, 0, -93], to: [0, 0, -97], width: 1.6, surface: 'eis' },
    { type: 'plattform', from: [0, 0, -99], to: [9, 0, -99], size: [3.6, 3.6], time: 4, pause: 3.5, rim: 0, surface: 'eis', offset: 8.5 },
    { type: 'weg', from: [9, 0, -101], to: [9, 0, -104], width: 1.6, surface: 'eis' },
    // randlose Eiskurve zur Fischerhütte
    { type: 'kurve', at: [9, 0, -104], yaw: 0, turn: -90, radius: 5, width: 1.8, surface: 'eis' },
    { type: 'weg', from: [4, 0, -109], to: [-6, 0, -109], width: 6, walls: 0.8, caps: 'end', surface: 'schnee' },
    { type: 'deko', form: 'huette', at: [-4.5, 0, -114.5], yaw: 0, scale: 0.75 },
    { type: 'ziel', at: [-2, 0, -109] },
    { type: 'klotz', at: [4, -0.7, -100], size: [24, 0.2, 30], look: 'pfuetze', deko: true },
    { type: 'deko', form: 'tanne', at: [-8, -1, -100] },
    { type: 'deko', form: 'tanne', at: [16, -1, -110], scale: 0.9 },

    { type: 'stern', at: [0, 6.6, -8] },
    { type: 'stern', at: [-2.4, 0.9, -48.6] },
    { type: 'stern', at: [0, 0.9, -82] },
    { type: 'stern', at: [4.5, 0.9, -99] },
    { type: 'stern', at: [7.54, 0.9, -107.54] },
    { type: 'stern', at: [7.2, 0.9, -65.4], bonus: true }
  ]
};
