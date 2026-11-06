// Winter 1: Schlittelhang. Neu: bergab rollen auf der Piste, Pulverschnee (bremst) und Eis (rutschig).
// Von der Berghütte den Hang hinunter: um die Slalomstangen und den Schneemann, über den gefrorenen Weiher zum Iglu.
export default {
  id: 'wi1', name: 'Schlittelhang', emoji: '🛷', theme: 'winter',
  start: [0, 5.1, 2], killY: -8,
  parts: [
    // Holzsteg vor der Berghütte, daneben steht ein Schlitten bereit
    { type: 'weg', from: [0, 5.1, 6], to: [0, 5.1, -4], width: 5, walls: 0.8, caps: 'start' },
    { type: 'klotz', at: [-8.95, 4.6, 0.5], size: [12.1, 1, 9], look: 'schnee', deko: true },
    { type: 'deko', form: 'huette', at: [-10.5, 5.1, 0.5], yaw: -90 },
    { type: 'deko', form: 'schlitten', at: [-4.6, 5.1, 1.5] },
    { type: 'wand', from: [-4.4, 5.1, -4], to: [-2.7, 5.1, -4] },
    { type: 'wand', from: [2.7, 5.1, -4], to: [4.4, 5.1, -4] },

    // Oberer Hang: Slalom um die Stangen
    { type: 'weg', from: [0, 5.1, -4], to: [0, 3, -18], width: 8, walls: 0.8 },
    { type: 'deko', form: 'torstange', at: [-1, 4.6, -7], fest: true },
    { type: 'deko', form: 'torstange', at: [1, 4, -11], fest: true, farbe: 0x1E88E5 },
    { type: 'deko', form: 'torstange', at: [-1, 3.4, -15], fest: true },
    // Holzsteg zum Verschnaufen
    { type: 'weg', from: [0, 3, -18], to: [0, 3, -24], width: 8, walls: 0.8 },
    { type: 'checkpoint', at: [0, 3, -21], size: [8, 3, 3] },

    // Unterer Hang: Pulverschnee bremst, rechts um den Schneemann herum
    { type: 'weg', from: [0, 3, -24], to: [0, 2.4, -28], width: 8, walls: 0.8 },
    { type: 'weg', from: [0, 2.4, -28], to: [0, 1.65, -33], width: 8, walls: 0.8, surface: 'schnee' },
    { type: 'weg', from: [0, 1.65, -33], to: [0, 0.6, -40], width: 8, walls: 0.8 },
    { type: 'deko', form: 'schneemann', at: [-2, 1.1, -36.5], yaw: 180, fest: true },
    { type: 'weg', from: [0, 0.6, -40], to: [0, 0, -44], width: 8, walls: 0.8, surface: 'schnee' },
    { type: 'wand', from: [-4.4, 0, -44], to: [-3.2, 0, -44] },
    { type: 'wand', from: [3.2, 0, -44], to: [4.4, 0, -44] },

    // Schneehänge neben der Piste mit Tannen
    { type: 'weg', from: [-6.9, 5.1, -4], to: [-6.9, 3, -18], width: 5, surface: 'schnee' },
    { type: 'weg', from: [6.9, 5.1, -4], to: [6.9, 3, -18], width: 5, surface: 'schnee' },
    { type: 'weg', from: [-6.9, 3, -24], to: [-6.9, 0, -44], width: 5, surface: 'schnee' },
    { type: 'weg', from: [6.9, 3, -24], to: [6.9, 0, -44], width: 5, surface: 'schnee' },
    { type: 'deko', form: 'tanne', at: [-7, 4.05, -10] },
    { type: 'deko', form: 'tanne', at: [7.2, 3.3, -15], scale: 0.8 },
    { type: 'deko', form: 'tanne', at: [7, 2.25, -28] },
    { type: 'deko', form: 'tanne', at: [-7.1, 1.65, -32], scale: 1.1 },
    { type: 'deko', form: 'tanne', at: [7.3, 0.45, -40], scale: 0.7 },

    // Unten im Schneefeld: Holzsteg, dann der gefrorene Weiher (rutschig!), am Ufer ein Pinguin
    { type: 'klotz', at: [8, -0.55, -63], size: [36, 1, 38], look: 'schnee', deko: true },
    { type: 'weg', from: [0, 0, -44], to: [0, 0, -48], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -46], size: [6, 3, 3] },
    { type: 'weg', from: [0, 0, -48], to: [0, 0, -56], width: 6, walls: 0.8, surface: 'eis' },
    { type: 'deko', form: 'pinguin', at: [-5.6, -0.05, -52], yaw: -90 },
    { type: 'weg', from: [0, 0, -56], to: [0, 0, -60], width: 6, walls: 0.8 },
    { type: 'kurve', at: [0, 0, -60], yaw: 0, turn: 90, radius: 5, width: 6, walls: 0.8 },

    // Ziel vor dem grossen Schlitten; links eine Nische vor dem Iglu
    { type: 'weg', from: [5, 0, -65], to: [19, 0, -65], width: 6 },
    { type: 'wand', from: [5, 0, -61.8], to: [19, 0, -61.8] },
    { type: 'wand', from: [5, 0, -68.2], to: [9.75, 0, -68.2] },
    { type: 'wand', from: [12.25, 0, -68.2], to: [19, 0, -68.2] },
    { type: 'wand', from: [19.2, 0, -68.4], to: [19.2, 0, -61.6] },
    { type: 'nische', at: [11, 0, -68], yaw: 0 },
    { type: 'deko', form: 'iglu', at: [11, -0.05, -76.9], yaw: 180 },
    { type: 'deko', form: 'schlitten', at: [22.5, -0.05, -66], scale: 2, farbe: 0xE53935 },
    { type: 'ziel', at: [16, 0, -65] },

    { type: 'stern', at: [0, 6, -2] },
    { type: 'stern', at: [-1, 4.95, -11] },
    { type: 'stern', at: [2, 2, -37] },
    { type: 'stern', at: [0, 0.9, -52] },
    { type: 'stern', at: [8, 0.9, -65] },
    { type: 'stern', at: [11, 0.9, -70.5], bonus: true }
  ]
};
