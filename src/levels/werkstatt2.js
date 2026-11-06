// Werkstatt 2: Sägewerk. Neu: das Sägeblatt (drehender Balken) auf dem Sägetisch, die Nagelwand und das Schleifband.
// Oben über den Sägetisch, durch die Nagelwand 10 m hinunter ins Sägemehl, dann trägt das Schleifband die Murmel zum Ziel hinauf.
const TZ = -18;  // Sägetisch: Mitte (12 x 12, von z = -12 bis -24)
const NZ = -32;  // Nagelwand: obere Vorderkante
const U = -10;  // Höhe unten (Sägemehl unter der Nagelwand): die Nagelwand ist 10 m hoch
const O = U + 3; // Höhe nach dem Schleifband
const BODEN = U - 6; // Schneidematte (killY - 1): bis dort reichen Tischbeine und Kisten

// Sägetisch aus Stahl mit Rand, vorne und hinten offen (wie der Teller in Küche 2), rechts vorne eine Nische
const tisch = (z, open = 2.7) => [
  { type: 'klotz', at: [0, -0.5, z], size: [12, 1, 12], look: 'stahl' },
  { type: 'wand', from: [-6.2, 0, z + 6], to: [-6.2, 0, z - 6] },
  { type: 'wand', from: [6.2, 0, z + 6], to: [6.2, 0, z + 5.5] },
  { type: 'wand', from: [6.2, 0, z + 3], to: [6.2, 0, z - 6] },
  { type: 'wand', from: [-6.4, 0, z + 6.2], to: [-open, 0, z + 6.2] },
  { type: 'wand', from: [open, 0, z + 6.2], to: [6.4, 0, z + 6.2] },
  { type: 'wand', from: [-6.4, 0, z - 6.2], to: [-open, 0, z - 6.2] },
  { type: 'wand', from: [open, 0, z - 6.2], to: [6.4, 0, z - 6.2] },
  { type: 'nische', at: [6, 0, z + 4.25], yaw: -90 },
  // Tischbeine (nur Optik)
  ...[[-5.2, 5.2], [5.2, 5.2], [-5.2, -5.2], [5.2, -5.2]].map(([x, dz]) =>
    ({ type: 'klotz', at: [x, (BODEN - 1) / 2, z + dz], size: [1.2, -1 - BODEN, 1.2], look: 'latte-dunkel', deko: true }))
];
// Kiste neben der Bahn, auf der Werkzeug liegt (nur Optik, ohne Physik); oben = Höhe der Oberkante
const kiste = (x, z, b, t, oben, look = 'latte-dunkel') =>
  ({ type: 'klotz', at: [x, (oben + BODEN) / 2, z], size: [b, oben - BODEN, t], look, deko: true });

export default {
  id: 'ws2', name: 'Sägewerk', emoji: '🪚', theme: 'werkstatt',
  start: [0, 0, 2], killY: U - 5,
  parts: [
    // Start, dann ein Stück Sägemehl vor dem Sägetisch
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -12], width: 5, walls: 0.8, surface: 'saegemehl' },
    // Sägetisch: das Sägeblatt dreht sich in der Mitte, rechts vorne die Nische mit dem Bonusstern
    ...tisch(TZ),
    { type: 'balken', at: [0, 0, TZ], length: 10, speed: 35, farbe: 'saege' },
    { type: 'weg', from: [0, 0, -24], to: [0, 0, NZ], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -26.5], size: [5, 3, 3] },

    // Nagelwand: oben hineinrollen, von Nagel zu Nagel hinunter, unten ins Sägemehl
    { type: 'nagelbrett', at: [0, 0, NZ], breite: 10, hoehe: -U },
    { type: 'weg', from: [0, U, NZ + 1.5], to: [0, U, -39.5], width: 11, surface: 'saegemehl' },
    { type: 'wand', from: [-5.9, U, NZ + 1.7], to: [5.9, U, NZ + 1.7] },
    { type: 'wand', from: [-5.7, U, NZ + 1.5], to: [-5.7, U, -39.5] },
    { type: 'wand', from: [-5.9, U, -39.7], to: [5.5, U, -39.7] },
    { type: 'wand', from: [5.7, U, NZ + 1.5], to: [5.7, U, -34.1] },
    { type: 'checkpoint', at: [0, U, -36.2], yaw: -90, size: [3, 3, 11] },

    // nach rechts hinaus, das Schleifband trägt die Murmel die Rampe hoch (wie das Förderband in Küche 1)
    { type: 'weg', from: [5.5, U, -37], to: [14, U, -37], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [9, U, -37], yaw: -90, size: [5, 3, 3] },
    { type: 'band', from: [14, U, -37], to: [24, O, -37], width: 4, walls: 0.8, look: 'schleifband' },
    { type: 'weg', from: [24, O, -37], to: [34, O, -37], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [31.5, O, -37] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [3.5, 0.9, TZ] },
    { type: 'stern', at: [0, 0.9, -29] },
    { type: 'stern', at: [0, U + 0.9, -37] },
    { type: 'stern', at: [19, U + 2.4, -37] },
    { type: 'stern', at: [8.5, 0.9, TZ + 4.25], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', at: [-1.7, 0, -4], yaw: -7 },
    { type: 'domino', at: [1.8, 0, -25.2], yaw: 9 },
    { type: 'domino', at: [11.5, U, -38.8], yaw: -84 },

    // Riesiges Werkzeug neben der Bahn (nur Optik)
    // Bretterstapel mit dem Fuchsschwanz rechts vom Start
    kiste(8, -1, 5.5, 14, -2),
    { type: 'deko', form: 'holzstapel', at: [8, -2, -1], scale: 1.5 },
    { type: 'deko', form: 'saege', at: [8, 0.68, -1], yaw: 6, scale: 0.85 },
    // Kreissägeblatt dreht sich links vom Sägetisch
    kiste(-12.5, TZ, 8, 8, -1.5, 'latte-natur'),
    { type: 'deko', form: 'saegeblatt', at: [-12.5, -1.5, TZ], scale: 1.15, dreh: 50 },
    // Hammer links neben der Nagelwand, Kopf bei den Nägeln
    kiste(-10, -29.5, 5, 11, -1),
    { type: 'deko', form: 'hammer', at: [-10, -1, -29], scale: 1.1 },
    // unten auf der Schneidematte: Farbdose hinter dem Sägemehl, Schrauben und Mutter beim Schleifband, Werkzeugkasten hinter dem Ziel
    { type: 'deko', form: 'farbdose', at: [-2, BODEN, -46], scale: 1.3, farbe: 0x1E88E5 },
    { type: 'deko', form: 'schraube', at: [17, BODEN, -30.5], scale: 1.4 },
    { type: 'deko', form: 'schraube', at: [21.5, BODEN, -31], scale: 1.2, farbe: 0xD4A93A },
    { type: 'deko', form: 'mutter', at: [12, BODEN, -45], yaw: 20, scale: 1.6 },
    { type: 'deko', form: 'werkzeugkasten', at: [29, BODEN, -46.5], scale: 2 }
  ]
};
