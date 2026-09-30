// Badezimmer 1: Fynns Badezimmer (Idee von Fynn). Turbo in den Looping, Lift über die Lücke, durch den Matsch
// (dreckig!), Steine rollen aus den Zahnputzbechern quer über den Weg, Förderband, Turbo und Schanze ins Lavabo:
// dort wird die Murmel gewaschen und gurgelt durch den Abfluss hinunter in die Badewanne. Über die Schiffchen
// hüpfen und rollen, zum Schluss mit dem Trampolin in die Toilette.
export default {
  id: 'b1', name: 'Fynns Badezimmer', emoji: '🚽', theme: 'badezimmer',
  start: [0, 0, 2], killY: -13,
  parts: [
    // Start, Turbo in den Looping
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -10], width: 3, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.9, 0, -6] },
    { type: 'wand', from: [1.9, 0, -6], to: [2.7, 0, -6] },
    { type: 'turbo', at: [0, 0, -8.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [0, 0, -10], yaw: 0, radius: 3, width: 3, shift: 5 },
    // Badvorleger nach dem Looping bremst vor der Lücke
    { type: 'weg', from: [5, 0, -10], to: [5, 0, -13], width: 4, walls: 0.8 },
    { type: 'weg', from: [5, 0, -13], to: [5, 0, -18], width: 4, walls: 0.8, surface: 'handtuch' },
    { type: 'checkpoint', at: [5, 0, -15], size: [4, 3, 2] },

    // Lift fährt waagrecht über die Lücke
    { type: 'plattform', from: [5, 0, -20], to: [5, 0, -28], size: [4.5, 4], time: 2.5, pause: 2.5 },
    { type: 'weg', from: [5, 0, -30], to: [5, 0, -34], width: 5 },
    { type: 'checkpoint', at: [5, 0, -31.5], size: [5, 3, 2] },
    // Matsch von den Gummistiefeln macht dreckig, links eine Nische mit dem Bonusstern
    { type: 'weg', from: [5, 0, -34], to: [5, 0, -40], width: 5, surface: 'schlamm' },
    { type: 'wand', from: [7.7, 0, -30], to: [7.7, 0, -40] },
    { type: 'wand', from: [2.3, 0, -30], to: [2.3, 0, -36] },
    { type: 'wand', from: [2.3, 0, -38.5], to: [2.3, 0, -40] },
    { type: 'nische', at: [2.5, 0, -37.25], yaw: 90, surface: 'schlamm' },
    { type: 'deko', form: 'ente', at: [-9, -4, -34], yaw: -70, scale: 1.4 },

    // Steine rollen aus den Zahnputzbechern links quer über den Weg und fallen rechts hinunter
    { type: 'weg', from: [5, 0, -40], to: [5, 0, -53], width: 4 },
    { type: 'wand', from: [2.8, 0, -40], to: [2.8, 0, -42.6] },
    { type: 'wand', from: [2.8, 0, -45.4], to: [2.8, 0, -47.6] },
    { type: 'wand', from: [2.8, 0, -50.4], to: [2.8, 0, -53] },
    { type: 'wand', from: [7.2, 0, -40], to: [7.2, 0, -42.6] },
    { type: 'wand', from: [7.2, 0, -45.4], to: [7.2, 0, -47.6] },
    { type: 'wand', from: [7.2, 0, -50.4], to: [7.2, 0, -53] },
    { type: 'weg', from: [-3, 3, -44], to: [3, 0, -44], width: 2.4, walls: 0.6, caps: 'start' },
    { type: 'weg', from: [-3, 3, -49], to: [3, 0, -49], width: 2.4, walls: 0.6, caps: 'start' },
    { type: 'felsen', from: [-2.2, 3.6, -44], dir: [1, 0], speed: 0.5, every: 4, r: 0.8 },
    { type: 'felsen', from: [-2.2, 3.6, -49], dir: [1, 0], speed: 0.5, every: 4, r: 0.8, offset: 2 },
    { type: 'deko', form: 'becher', at: [-4.8, 2.4, -44], scale: 0.9, farbe: 0x4FC3F7 },
    { type: 'deko', form: 'becher', at: [-4.8, 2.4, -49], scale: 0.9, farbe: 0xFF8A65 },

    // Förderband, Turbo und Schanze ins Lavabo
    { type: 'weg', from: [5, 0, -53], to: [5, 0, -55], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [5, 0, -54], size: [4, 3, 2] },
    { type: 'band', from: [5, 0, -55], to: [5, 0, -65], width: 4, walls: 0.8, speed: 8 },
    { type: 'weg', from: [5, 0, -65], to: [5, 0, -68], width: 3, walls: 0.8 },
    { type: 'turbo', at: [5, 0, -66.5], size: [2.6, 2], speed: 10 },
    { type: 'weg', from: [5, 0, -68], to: [5, 1.2, -71], width: 3, walls: 0.5 },
    // Lavabo (nasse Keramik): Murmel springt und kreist, das Wasser wäscht sie, in der Mitte gurgelt sie durch den Abfluss hinunter
    { type: 'schuessel', at: [5, -1.5, -79], r: 1.5, R: 4.5, h: 2, rim: 1, art: 'lavabo', abfluss: true },
    { type: 'strahl', at: [5, 4, -76], unten: -0.4, r: 0.6, hahn: true, yaw: 90, lang: 3.8, fuss: 3.6 },
    // Fliesenwand mit Spiegel direkt hinter dem Becken (zu weite Sprünge prallen zurück ins Lavabo)
    { type: 'wand', from: [-1, 0.5, -83.7], to: [11, 0.5, -83.7], height: 6 },
    { type: 'klotz', at: [5, 3.8, -83.45], size: [7, 4, 0.1], look: 'spiegel', deko: true },
    { type: 'roehre', from: [5, -1.5, -79], down: true, to: [5, -6.5, -95], toYaw: 0, bogen: 3, speed: 14, out: 6, fang: 0.7, farbe: 0xB0BEC5 },

    // Badewanne: über die Schiffchen hüpfen und rollen, nicht ins Wasser fallen!
    { type: 'wanne', at: [5, -8, -106], size: [9, 24], rim: 1.2, depth: 2, enten: [[-3, -8], [3.2, 2], [-3.2, 9]] },
    { type: 'schiff', at: [5, -8, -99], size: [4.5, 6], farbe: 0xE53935, trampolin: { vorne: 2, size: [3, 1.4], ziel: [5, -7.5, -106], time: 1 } },
    { type: 'checkpoint', at: [5, -7.5, -98], size: [4.5, 3, 4] },
    { type: 'schiff', at: [5, -8, -107], size: [4, 4.5], farbe: 0x1E88E5, trampolin: { vorne: 1.4, size: [3, 1.2], ziel: [5, -7.5, -112.5], time: 1 } },
    { type: 'schiff', at: [5, -8, -113.5], size: [4, 5], farbe: 0x43A047, trampolin: { vorne: 1.6, size: [3, 1.4], ziel: [5, -8, -126], time: 1.3 } },

    // Toilette: Ziel
    { type: 'klo', at: [5, -8, -126], yaw: 0 },
    { type: 'ziel', at: [5, -8, -126] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [2.5, 5.3, -10] },
    { type: 'stern', at: [5, 0.9, -24] },
    { type: 'stern', at: [5, 0.9, -46.5] },
    { type: 'stern', at: [5, 0.9, -60] },
    { type: 'stern', at: [5, -6.6, -112.5] },
    { type: 'stern', at: [-0.5, 0.9, -37.25], bonus: true }
  ]
};
