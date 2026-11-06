// Werkstatt 3: Schraubstock. Die Strecke führt als schmales Brett ohne Rand über die Werkbank. Gefahren:
// Klötzchen umwerfen, dann die Schraubstock-Gasse: drei Schraubstöcke mit verschiedenen Takten (langsam, mittel, schnell)
// auf einem Brett ohne Rand; zwischen ihnen warten, bis der nächste aufgeht. Rechts herum ohne Rand zur Wasserwaage, die als
// Wippe über der Werkzeugkiste liegt. Dann die Magnetleiste: Magnete links neben dem randlosen Brett ziehen die Murmel zur
// Kante, und genau dort schlägt der Holzhammer auf (warten, während der Magnet zieht). Zum Schluss ein schmales Brett
// ohne Rand hinunter zum Werkzeugkasten. Bonusstern: links vom Podest nach der Gasse auf einem ganz schmalen Steg.
const M = -7;          // Schneidematte (killY - 1): dort steht das riesige Werkzeug
const ZW = -41;        // Achse nach der Kurve (es geht nach +x): Wasserwaage, Magnetleiste, Hammer
const XE = 50;         // Achse des Bretts hinunter zum Ziel (es geht nach -z)
const YE = -2.4;       // Höhe unten beim Werkzeugkasten
const BRETT = 1.8;     // Breite des Bretts in der Gasse
const sockel = (x, z, b, t, top) => ({ type: 'klotz', at: [x, (M + top) / 2, z], size: [b, top - M, t], look: 'latte-dunkel', deko: true });
// Schraubstöcke: [z, time, pause, seite]
const STOCK = [[-13.5, 1.2, 2.5, 1], [-20.5, 1.0, 1.8, -1], [-27.5, 0.7, 1.5, 1]];
// Magnete der Leiste links neben dem Brett
const MAGNET = [21.5, 25, 28.5, 33.5];

export default {
  id: 'ws3', name: 'Schraubstock', emoji: '🗜️', theme: 'werkstatt',
  start: [0, 0, 2], killY: -6,
  parts: [
    // Start, Klötzchen umwerfen
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -3], to: [0, 0, -9], width: 4, walls: 0.8 },
    { type: 'domino', from: [0, 0, -4.5], to: [0, 0, -7], count: 2, quer: 3 },

    // Schraubstock-Gasse: ein Brett ohne Rand, drei Schraubstöcke mit verschiedenen Takten
    { type: 'weg', from: [0, 0, -9], to: [0, 0, -33], width: BRETT },
    ...STOCK.map(([z, time, pause, seite]) => ({ type: 'schraubstock', at: [0, 0, z], weit: 3, time, pause, seite })),

    // Podest nach der Gasse; links (Lücke im Rand) der ganz schmale Steg zum Bonusstern
    { type: 'weg', from: [0, 0, -33], to: [0, 0, -37], width: 3 },
    { type: 'wand', from: [1.7, 0, -33], to: [1.7, 0, -37] },
    { type: 'wand', from: [-1.7, 0, -33], to: [-1.7, 0, -34.4] },
    { type: 'wand', from: [-1.7, 0, -35.6], to: [-1.7, 0, -37] },
    { type: 'checkpoint', at: [0, 0, -35], size: [3, 3, 2] },
    { type: 'weg', from: [-1.5, 0, -35], to: [-8, 0, -35], width: 1.2 },

    // rechts herum ohne Rand, dann die Wasserwaage als Wippe über der Werkzeugkiste
    { type: 'kurve', at: [0, 0, -37], yaw: 0, turn: 90, radius: 4, width: BRETT },
    { type: 'weg', from: [4, 0, ZW], to: [6, 0, ZW], width: BRETT },
    { type: 'wippe', at: [9.5, 0.608, ZW], size: [1.8, 7], yaw: -90, angle: 10, rim: 0.2 },
    { type: 'weg', from: [13, 0, ZW], to: [15, 0, ZW], width: BRETT },
    { type: 'weg', from: [15, 0, ZW], to: [19, 0, ZW], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [17, 0, ZW], yaw: -90, size: [3, 3, 2] },

    // Magnetleiste: links neben dem Brett ohne Rand ziehen Magnete zur Kante; am Ende schlägt der Holzhammer auf
    { type: 'weg', from: [19, 0, ZW], to: [41, 0, ZW], width: BRETT },
    ...MAGNET.map(x => ({ type: 'magnet', at: [x, 0, ZW - 2.1], radius: 3, strength: 3.2 })),
    { type: 'klotz', at: [27.5, -0.4, ZW - 2.4], size: [14, 0.8, 0.8], look: 'stahl', deko: true },
    { type: 'hammer', at: [37, 0, ZW], yaw: -90, side: 1, length: 4, size: [3, 1.4, 1.6], farbe: 'orange' },
    { type: 'weg', from: [41, 0, ZW], to: [45, 0, ZW], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [43, 0, ZW], yaw: -90, size: [3, 3, 2] },

    // ohne Rand links herum und das schmale Brett hinunter zum Werkzeugkasten
    { type: 'weg', from: [45, 0, ZW], to: [47, 0, ZW], width: 1.6 },
    { type: 'kurve', at: [47, 0, ZW], yaw: -90, turn: -90, radius: 3, width: 1.6 },
    { type: 'weg', from: [XE, 0, ZW - 3], to: [XE, YE, ZW - 17], width: 1.6 },
    { type: 'weg', from: [XE, YE, ZW - 17], to: [XE, YE, ZW - 24], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [XE, YE, ZW - 21] },

    // Sterne: hinter den Klötzchen, zwischen dem zweiten und dritten Schraubstock am Rand, auf der Wasserwaage,
    // an der Kante vor dem Magneten, kurz vor dem Hammer, auf dem Brett hinunter; Bonus am Ende des schmalen Stegs
    { type: 'stern', at: [1.2, 0.9, -8] },
    { type: 'stern', at: [0.5, 0.9, -24] },
    { type: 'stern', at: [9.5, 1.5, ZW] },
    { type: 'stern', at: [25, 0.9, ZW - 0.5] },
    { type: 'stern', at: [33.5, 0.9, ZW] },
    { type: 'stern', at: [XE, YE / 2 + 0.9, ZW - 10] },
    { type: 'stern', at: [-7.5, 0.9, -35], bonus: true },

    // riesiges Werkzeug neben der Bahn (ohne Physik): auf der Schneidematte oder auf dunklen Balken
    sockel(6, 0, 4.5, 11.5, -0.5),
    { type: 'deko', form: 'hammer', at: [6, -0.5, 0], yaw: 0 },
    sockel(-6, -12.5, 4, 12.5, -0.5),
    { type: 'deko', form: 'saege', at: [-6, -0.5, -12.5], yaw: 0 },
    { type: 'deko', form: 'farbdose', at: [-7.5, M, -23], scale: 1.8, farbe: 0xE53935 },
    sockel(6, -29.5, 3.6, 3.6, -0.5),
    { type: 'deko', form: 'mutter', at: [6, -0.5, -29.5], yaw: 20 },
    { type: 'deko', form: 'werkzeugkasten', at: [9.5, M, ZW], yaw: 0, scale: 1.4 },
    { type: 'deko', form: 'schraube', at: [17.5, M, -47], scale: 1.4 },
    sockel(27.5, ZW - 6, 9.2, 1.2, -0.5),
    { type: 'deko', form: 'bleistift', at: [27.5, -0.5, ZW - 6], yaw: 90, scale: 0.8 },
    { type: 'deko', form: 'farbdose', at: [37, M, -34], scale: 1.6, farbe: 0x1E88E5 },
    sockel(-6, -40, 3, 8, -0.5),
    { type: 'deko', form: 'schraubenzieher', at: [-6, -0.5, -40], yaw: 0, farbe: 0x43A047 },
    { type: 'deko', form: 'saegeblatt', at: [44, M, -52], scale: 1.3, dreh: 90 },
    { type: 'deko', form: 'werkzeugkasten', at: [XE, M, ZW - 29], yaw: 0, scale: 1.8 }
  ]
};
