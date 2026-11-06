// Winter 3: Skischanze. Neu: Schneebälle rollen quer über den Steg, Schneekanone bläst über den eisigen Grat,
// Turbo-Start in den Anlauf, Absprung vom Schanzentisch (fester Schwung für jede Murmel), weiter Flug und Landung
// im Pulverschnee: er schluckt den Aufprall und bremst. Bonusstern vor dem Iglu am Auslauf.
const TY = -6.5, AY = -16.4; // Höhe Schanzentisch, Höhe Auslauf
export default {
  id: 'wi3', name: 'Skischanze', emoji: '🎿', theme: 'winter',
  start: [0, 0, 2], killY: -22,
  parts: [
    // Bergstation mit Hütte
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    { type: 'klotz', at: [-7.7, -0.5, -0.5], size: [9.2, 1, 13], look: 'schneeblock', deko: true },
    { type: 'deko', form: 'huette', at: [-7.9, 0, 1.5], yaw: -90 },
    { type: 'deko', form: 'tanne', at: [-8.3, 0, -4.8], scale: 0.7 },
    { type: 'deko', form: 'schlitten', at: [-4.4, 0, -4.6], scale: 0.8 },

    // Schneeballhang: drei Schneemänner werfen Schneebälle, sie rollen quer über den Steg und fallen rechts hinunter
    { type: 'weg', from: [0, 0, -8], to: [0, 0, -26], width: 4 },
    { type: 'wand', from: [-2.7, 0, -8], to: [-1.9, 0, -8] },
    { type: 'wand', from: [1.9, 0, -8], to: [2.7, 0, -8] },
    ...[-1, 1].flatMap(k => [[-8, -10.6], [-13.4, -15.6], [-18.4, -20.6], [-23.4, -26]].map(([a, b]) => ({ type: 'wand', from: [k * 2.2, 0, a], to: [k * 2.2, 0, b] }))),
    ...[-12, -17, -22].flatMap((z, i) => [
      { type: 'weg', from: [-8, 3, z], to: [-2, 0, z], width: 2.4, walls: 0.6, caps: 'start' },
      { type: 'felsen', from: [-7.2, 3.6, z], dir: [1, 0], speed: 0.5, every: 4, r: 0.8, offset: [0, 2.6, 1.3][i], farbe: 0xFFFFFF },
      { type: 'deko', form: 'schneemann', at: [-10.2, 3, z], yaw: -90, scale: 0.8 }
    ]),
    { type: 'klotz', at: [-10.2, 2.5, -17], size: [4, 1, 15], look: 'schneeblock', deko: true },

    // Podest nach den Schneebällen
    { type: 'weg', from: [0, 0, -26], to: [0, 0, -30], width: 5, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -26], to: [-1.9, 0, -26] },
    { type: 'wand', from: [1.9, 0, -26], to: [2.7, 0, -26] },
    { type: 'checkpoint', at: [0, 0, -28], size: [5, 3, 2] },

    // Grat: Eis, die Schneekanone bläst von links, rechts hält eine Schneemauer
    { type: 'weg', from: [0, 0, -30], to: [0, 0, -33], width: 5 },
    { type: 'weg', from: [0, 0, -33], to: [0, 0, -45], width: 5, surface: 'eis' },
    { type: 'weg', from: [0, 0, -45], to: [0, 0, -50], width: 5 },
    { type: 'wand', from: [2.7, 0, -30], to: [2.7, 0, -50] },
    { type: 'wand', from: [-2.7, 0, -30], to: [-2.7, 0, -35.4] },
    { type: 'wand', from: [-2.7, 0, -42.6], to: [-2.7, 0, -50] },
    { type: 'wind', at: [0, 0, -39], size: [6, 3, 5], yaw: -90, strength: 4 },
    { type: 'checkpoint', at: [0, 0, -47.5], size: [5, 3, 2] },

    // Schanze: Turbo-Start, Anlauf hinunter, Absprung am Schanzentisch
    { type: 'weg', from: [0, 0, -50], to: [0, 0, -53], width: 3, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -50], to: [-1.9, 0, -50] },
    { type: 'wand', from: [1.9, 0, -50], to: [2.7, 0, -50] },
    { type: 'turbo', at: [0, 0, -51.8], size: [2.6, 2], speed: 9 },
    { type: 'weg', from: [0, 0, -53], to: [0, TY, -77], width: 3, walls: 0.8 },
    { type: 'weg', from: [0, TY, -77], to: [0, TY, -81], width: 3, walls: 0.5 },
    { type: 'trampolin', at: [0, TY, -80], size: [3, 2], tempo: 12, jump: 3 },

    // Aufsprunghang aus Pulverschnee, beginnt gleich unter dem Schanzentisch
    { type: 'weg', from: [0, TY - 1.1, -80.5], to: [0, AY, -120.5], width: 12, walls: 1, caps: 'start', surface: 'schnee' },
    { type: 'deko', form: 'tanne', at: [-10.5, -23, -98], scale: 1.5 },
    { type: 'deko', form: 'tanne', at: [10.5, -23, -108], scale: 1.3 },

    // Auslauf: Zuschauer, Iglu mit dem Bonusstern vor dem Eingang, Ziel zwischen den Torstangen
    { type: 'weg', from: [0, AY, -120.5], to: [0, AY, -137], width: 12.8 },
    { type: 'wand', from: [-6.2, AY, -120.5], to: [-6.2, AY, -137] },
    { type: 'wand', from: [6.2, AY, -120.5], to: [6.2, AY, -125.75] },
    { type: 'wand', from: [6.2, AY, -128.25], to: [6.2, AY, -137] },
    { type: 'wand', from: [-6.4, AY, -137.2], to: [6.4, AY, -137.2], height: 3 },
    { type: 'checkpoint', at: [0, AY, -122.5], size: [12, 3, 2], side: -1 },
    { type: 'nische', at: [6.4, AY, -127], yaw: -90, depth: 3 },
    { type: 'deko', form: 'iglu', at: [14.6, AY, -127], yaw: 90 },
    { type: 'klotz', at: [14.4, AY - 0.5, -127], size: [9.2, 1, 9], look: 'schneeblock', deko: true },
    { type: 'klotz', at: [-8.4, AY, -129], size: [4, 2, 12], look: 'schneeblock', deko: true },
    { type: 'deko', form: 'pinguin', at: [-8.4, AY + 1, -125.5], yaw: -90 },
    { type: 'deko', form: 'pinguin', at: [-8.4, AY + 1, -129], yaw: -70, scale: 0.8 },
    { type: 'deko', form: 'pinguin', at: [-8.4, AY + 1, -132.5], yaw: -110 },
    { type: 'deko', form: 'torstange', at: [-2.6, AY, -133.5], farbe: 0x1E88E5 },
    { type: 'deko', form: 'torstange', at: [2.6, AY, -133.5], yaw: 180 },
    { type: 'ziel', at: [0, AY, -133.5] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 0.9, -14.5] },
    { type: 'stern', at: [0, 0.9, -38] },
    { type: 'stern', at: [0, TY + 0.95, -85], r: 1.4 },
    { type: 'stern', at: [0, AY + 0.9, -123.5] },
    { type: 'stern', at: [8.4, AY + 0.9, -127], bonus: true }
  ]
};
