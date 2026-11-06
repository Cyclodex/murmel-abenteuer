// Werkstatt 3: Schraubstock. Neu: der Schraubstock als Tor, das auf- und zugeht und quetscht, dazu ein Holzhammer.
// Klötzchen umwerfen, durch den ersten Schraubstock, das Brett hinunter ins Sägemehl, um die Kurve, unter dem Hammer
// durch, durch den zweiten Schraubstock, Schalter drücken und über das Messband zum Werkzeugkasten.
const Y = -1.2;  // untere Ebene (nach dem Brett)
const Z = -50;   // Achse des Wegs nach der Kurve (es geht nach +x)
const B = -52.3; // Achse des Messbands und des Auslaufs
const M = -7;    // Schneidematte (killY - 1): dort steht das riesige Werkzeug
const sockel = (x, z, b, t, top) => ({ type: 'klotz', at: [x, (M + top) / 2, z], size: [b, top - M, t], look: 'latte-dunkel', deko: true });
export default {
  id: 'ws3', name: 'Schraubstock', emoji: '🗜️', theme: 'werkstatt',
  start: [0, 0, 2], killY: -6,
  parts: [
    // Start, Klötzchen umwerfen
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -18], width: 5, walls: 0.8 },
    { type: 'domino', from: [0, 0, -9], to: [0, 0, -13], count: 3, quer: 3 },
    // schmaler Gang zum ersten Schraubstock: unter den Backen hat das Brett keinen Rand
    { type: 'wand', from: [-2.7, 0, -18], to: [-1.9, 0, -18] },
    { type: 'wand', from: [1.9, 0, -18], to: [2.7, 0, -18] },
    { type: 'weg', from: [0, 0, -18], to: [0, 0, -22], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -19.5], size: [3, 3, 2] },
    { type: 'weg', from: [0, 0, -22], to: [0, 0, -26], width: 3 },
    { type: 'schraubstock', at: [0, 0, -24], weit: 3, offset: 3.9 },
    // Auslauf, links hinter der festen Backe (und der Farbdose) eine Nische mit dem Bonusstern
    { type: 'weg', from: [0, 0, -26], to: [0, 0, -31], width: 5 },
    { type: 'wand', from: [-2.9, 0, -26], to: [-1.7, 0, -26] },
    { type: 'wand', from: [1.7, 0, -26], to: [2.9, 0, -26] },
    { type: 'wand', from: [2.7, 0, -26.2], to: [2.7, 0, -31] },
    { type: 'wand', from: [-2.7, 0, -26.2], to: [-2.7, 0, -27.25] },
    { type: 'wand', from: [-2.7, 0, -29.75], to: [-2.7, 0, -31] },
    { type: 'nische', at: [-2.5, 0, -28.5], yaw: 90 },
    { type: 'checkpoint', at: [0, 0, -30], size: [5, 3, 2] },
    // Brett hinunter, unten bremst das Sägemehl, dann die Kurve nach rechts
    { type: 'weg', from: [0, 0, -31], to: [0, Y, -39], width: 5, walls: 0.8 },
    { type: 'weg', from: [0, Y, -39], to: [0, Y, -45], width: 5, walls: 0.8, surface: 'saegemehl' },
    { type: 'kurve', at: [0, Y, -45], yaw: 0, turn: 90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [5, Y, Z], to: [10, Y, Z], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [7, Y, Z], yaw: -90, size: [5, 3, 2] },
    // Holzhammer schlägt von links auf das Brett (dort ohne Rand)
    { type: 'wand', from: [10, Y, Z - 2.7], to: [10, Y, Z - 1.9] },
    { type: 'wand', from: [10, Y, Z + 1.9], to: [10, Y, Z + 2.7] },
    { type: 'weg', from: [10, Y, Z], to: [12, Y, Z], width: 3, walls: 0.8 },
    { type: 'weg', from: [12, Y, Z], to: [16, Y, Z], width: 3 },
    { type: 'hammer', at: [14, Y, Z], yaw: -90, side: -1, length: 4, size: [3.2, 1.4, 1.6], farbe: 'orange', offset: 1.7 },
    { type: 'weg', from: [16, Y, Z], to: [24, Y, Z], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [20, Y, Z], yaw: -90, size: [3, 3, 2] },
    // zweiter Schraubstock, die bewegliche Backe kommt von links
    { type: 'weg', from: [24, Y, Z], to: [28, Y, Z], width: 3 },
    { type: 'schraubstock', at: [26, Y, Z], yaw: -90, weit: 3, seite: -1, offset: 3.9 },
    // Plattform mit Rand: rechts der Schalter, links das Rollmeter, sein Band fährt über die Lücke
    { type: 'weg', from: [28, Y, Z], to: [38, Y, Z], width: 9 },
    { type: 'wand', from: [27.8, Y, Z + 4.7], to: [38.4, Y, Z + 4.7] },
    { type: 'wand', from: [27.8, Y, Z - 4.7], to: [38.4, Y, Z - 4.7] },
    { type: 'wand', from: [28, Y, Z - 4.5], to: [28, Y, Z - 1.9] },
    { type: 'wand', from: [28, Y, Z + 1.9], to: [28, Y, Z + 4.5] },
    { type: 'wand', from: [38.2, Y, B + 2], to: [38.2, Y, Z + 4.5] },
    { type: 'wand', from: [38.2, Y, Z - 4.5], to: [38.2, Y, B - 1.95] },
    { type: 'checkpoint', at: [30.5, Y, Z + 0.5], yaw: -90, size: [4, 3, 2] },
    { type: 'schalter', at: [34, Y, Z + 2.5], id: 'm1' },
    { type: 'messband', from: [33, Y, B], to: [46, Y, B], width: 3, id: 'm1', kante: 5 },
    // Auslauf und Ziel vor dem Werkzeugkasten
    { type: 'weg', from: [46, Y, B], to: [56, Y, B], width: 5, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [49.5, Y, B], yaw: -90, size: [5, 3, 2] },
    { type: 'ziel', at: [53, Y, B] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -27.5] },
    { type: 'stern', at: [0, Y + 0.9, -42] },
    { type: 'stern', at: [17.5, Y + 0.9, Z] },
    { type: 'stern', at: [42, Y + 0.9, B] },
    { type: 'stern', at: [-5, 0.9, -28.5], bonus: true },

    // riesiges Werkzeug neben der Bahn (ohne Physik): auf der Schneidematte oder auf dunklen Balken
    sockel(6, 0, 4.5, 11.5, -0.5),
    { type: 'deko', form: 'hammer', at: [6, -0.5, 0], yaw: 0 },
    sockel(-6, -12.5, 4, 12.5, -0.5),
    { type: 'deko', form: 'saege', at: [-6, -0.5, -12.5], yaw: 0 },
    { type: 'deko', form: 'farbdose', at: [-7.5, M, -23], scale: 1.8, farbe: 0xE53935 },
    sockel(6, -29.5, 3.6, 3.6, -0.5),
    { type: 'deko', form: 'mutter', at: [6, -0.5, -29.5], yaw: 20 },
    sockel(-6, -38, 3, 10.5, Y - 0.5),
    { type: 'deko', form: 'schraubenzieher', at: [-6, Y - 0.5, -38], yaw: 0, farbe: 0x43A047 },
    { type: 'deko', form: 'schraube', at: [17.5, M, -45.3], scale: 1.4 },
    sockel(20, -54.6, 9.2, 1.2, Y - 0.5),
    { type: 'deko', form: 'bleistift', at: [20, Y - 0.5, -54.6], yaw: 90, scale: 0.8 },
    { type: 'deko', form: 'farbdose', at: [30.5, M, -40.5], scale: 1.6, farbe: 0x1E88E5 },
    { type: 'deko', form: 'saegeblatt', at: [42, M, B], scale: 1.3, dreh: 90 },
    { type: 'deko', form: 'werkzeugkasten', at: [60.5, M, B], yaw: 90, scale: 1.8 },

    // einzelne Dominosteine
    { type: 'domino', at: [1.9, 0, -4.2], yaw: 12 },
    { type: 'domino', at: [1.9, 0, -28.6], yaw: -80 },
    { type: 'domino', at: [50.5, Y, B - 1.9], yaw: -70 }
  ]
};
