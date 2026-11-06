// Winter 1: Schlittelhang. Von der Berghütte über den vereisten Steilhang hinunter: schmale Eisbahnen ohne Rand
// im Zickzack, dazwischen Inseln aus Pulverschnee, auf denen man bremsen und wenden muss (wer zu schnell ist,
// schiesst über die Insel hinaus). Dann über die Gletscherspalte auf einer schmalen Schneebrücke, über die von
// links und rechts Lawinen-Schneebälle donnern. Zum Schluss hinauf zum Iglu, den Schneebällen entgegen:
// unten warten, hinauf, auf dem Absatz zur Seite ausweichen, warten, ganz hinauf.
export default {
  id: 'wi1', name: 'Schlittelhang', emoji: '🛷', theme: 'winter',
  start: [0, 7.5, 2], killY: -6,
  parts: [
    // Holzsteg vor der Berghütte, daneben steht ein Schlitten bereit
    { type: 'weg', from: [0, 7.5, 6], to: [0, 7.5, -2], width: 5, walls: 0.8, caps: 'start' },
    { type: 'klotz', at: [-8.95, 7, 2], size: [12.1, 1, 9], look: 'schnee', deko: true },
    { type: 'deko', form: 'huette', at: [-10.5, 7.5, 2], yaw: -90 },
    { type: 'deko', form: 'schlitten', at: [-4.6, 7.5, 3] },

    // Eis-Steilhang: schmale Eisbahnen ohne Rand im Zickzack, Bremsinseln aus Pulverschnee
    { type: 'weg', from: [0, 7.5, -2], to: [3.5, 6, -9.4], width: 1.8, surface: 'eis' },
    { type: 'weg', from: [3.5, 6, -9], to: [3.5, 6, -12.6], width: 3.6, surface: 'schnee' },
    { type: 'weg', from: [3.5, 6, -12.2], to: [-3.5, 4.5, -19.4], width: 1.8, surface: 'eis' },
    { type: 'weg', from: [-3.5, 4.5, -19], to: [-3.5, 4.5, -22.6], width: 3.6, surface: 'schnee' },
    { type: 'checkpoint', at: [-3.5, 4.5, -20.8], size: [3.6, 3, 1.6] },
    { type: 'weg', from: [-3.5, 4.5, -22.2], to: [3.5, 3, -29.4], width: 1.8, surface: 'eis' },
    { type: 'weg', from: [3.5, 3, -29], to: [3.5, 3, -32.6], width: 3.6, surface: 'schnee' },
    { type: 'weg', from: [3.5, 3, -32.2], to: [-3.5, 1.5, -39.4], width: 1.8, surface: 'eis' },
    { type: 'weg', from: [-3.5, 1.5, -39], to: [-3.5, 1.5, -42.6], width: 3.6, surface: 'schnee' },
    { type: 'weg', from: [-3.5, 1.5, -42.2], to: [0, 0, -49.4], width: 1.8, surface: 'eis' },
    { type: 'deko', form: 'tanne', at: [-8, 3, -12] },
    { type: 'deko', form: 'tanne', at: [8.5, 1.5, -24], scale: 0.8 },
    { type: 'deko', form: 'tanne', at: [-8.5, 0, -33], scale: 1.1 },
    { type: 'deko', form: 'schneemann', at: [7, 0, -42], yaw: 90 },
    { type: 'weg', from: [0, 0, -49], to: [0, 0, -54], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -51.5], size: [4, 3, 2] },

    // Gletscherspalte: schmale Schneebrücke ohne Rand, Lawinen von links, rechts, links
    { type: 'weg', from: [0, 0, -54], to: [0, 0, -70], width: 1.4, surface: 'schnee' },
    { type: 'weg', from: [-12, 3, -58], to: [-0.7, 0, -58], width: 2.4, look: 'schnee' },
    { type: 'weg', from: [12, 3, -63], to: [0.7, 0, -63], width: 2.4, look: 'schnee' },
    { type: 'weg', from: [-12, 3, -67], to: [-0.7, 0, -67], width: 2.4, look: 'schnee' },
    { type: 'felsen', from: [-11.5, 2.87, -58], dir: [1, 0], speed: 2, every: 4, r: 0.8, farbe: 0xFFFFFF },
    { type: 'felsen', from: [11.5, 2.87, -63], dir: [-1, 0], speed: 2, every: 4, r: 0.8, farbe: 0xFFFFFF, offset: 1.4 },
    { type: 'felsen', from: [-11.5, 2.87, -67], dir: [1, 0], speed: 2, every: 4, r: 0.8, farbe: 0xFFFFFF, offset: 3.4 },
    { type: 'klotz', at: [-4, -3.5, -62], size: [6, 5, 18], look: 'eis', deko: true }, // Wände der Spalte
    { type: 'klotz', at: [4, -3.5, -62], size: [6, 5, 18], look: 'eis', deko: true },
    { type: 'deko', form: 'eiszapfen', at: [-1.6, -0.6, -60] },
    { type: 'deko', form: 'eiszapfen', at: [1.6, -0.6, -65] },

    // Aufstieg zum Iglu, den Schneebällen entgegen. Links daneben warten (Podest unten, Absatz in der Mitte)
    { type: 'weg', from: [0, 0, -70], to: [0, 0, -78], width: 2.4 },
    { type: 'wand', from: [-1.4, 0, -70], to: [-1.4, 0, -78] },
    { type: 'checkpoint', at: [0, 0, -73], size: [2.4, 3, 1.6], side: -1 },
    { type: 'weg', from: [2.4, 0, -70], to: [2.4, 0, -80], width: 2.4, look: 'schnee' },
    { type: 'weg', from: [2.4, 0, -80], to: [2.4, 2, -89], width: 2.4, look: 'schnee' },
    { type: 'weg', from: [2.4, 2, -89], to: [2.4, 2, -93], width: 2.4, look: 'schnee' },
    { type: 'weg', from: [0, 2, -89], to: [0, 2, -93], width: 2.4 },
    { type: 'wand', from: [-1.4, 2, -89], to: [-1.4, 2, -93] },
    { type: 'weg', from: [2.4, 2, -93], to: [2.4, 4, -102], width: 2.4, look: 'schnee' },
    { type: 'weg', from: [2.4, 4, -102], to: [2.4, 4, -110], width: 2.4, look: 'schnee' },
    { type: 'wand', from: [1.2, 4, -110.2], to: [3.6, 4, -110.2] },
    { type: 'felsen', from: [2.4, 4, -108], dir: [0, 1], speed: 2, every: 9, r: 0.8, farbe: 0xFFFFFF },
    // Gipfel mit Iglu: Ziel
    { type: 'weg', from: [-2.4, 4, -102], to: [-2.4, 4, -110], width: 7.2, surface: 'schnee' },
    { type: 'wand', from: [-6.2, 4, -102], to: [-6.2, 4, -110] },
    { type: 'wand', from: [-6, 4, -110.2], to: [1.2, 4, -110.2] },
    { type: 'wand', from: [1, 4, -106], to: [1, 4, -110] },
    { type: 'deko', form: 'iglu', at: [-3, 4, -115], yaw: 180 },
    { type: 'deko', form: 'schlitten', at: [-5, 4, -104], scale: 1.4, farbe: 0xE53935 },
    { type: 'deko', form: 'tanne', at: [8, 2, -96] },
    { type: 'ziel', at: [-2.4, 4, -107.5] },

    { type: 'stern', at: [1.75, 7.6, -5.7] },
    { type: 'stern', at: [-4.9, 5.4, -22.2] },
    { type: 'stern', at: [0, 0.9, -65] },
    { type: 'stern', at: [2.4, 1.9, -85] },
    { type: 'stern', at: [-5, 4.9, -103.5] },
    { type: 'stern', at: [2.6, 1.4, -63], bonus: true }
  ]
};
