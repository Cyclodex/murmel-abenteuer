// Schweiz 1: Käserei. Über einen schmalen Steg ohne Rand ins kupferne Käsekessi: gleich hinter dem Eingang blubbert die
// Milch (Knall aus dem Boden, mal dreimal kurz hintereinander, mal lange nicht; die Scheibe hebt sich und leuchtet vorher),
// die Käseharfe rührt schnell, man fährt gleich hinter ihr her quer hinüber und durch die enge Lücke rechts hinaus. Der
// Emmentaler ist ein Labyrinth: ein Weg eine Kachel breit, daneben nur Löcher. Über dem langen Gang oben fallen Laibe aus
// einem Regal (Schatten und Wackeln vorher), mal zwei kurz hintereinander, mal lange keiner; wer getroffen wird, fliegt ins
// Loch. Eine schmale Wendel ohne Rand führt in den Käsekeller. Dort rollen Laibe in Fahrtrichtung durch den Gang, in Salven
// und jeder anders: gross und langsam, klein und schnell, mal leicht versetzt. Man wartet in den Fächern des Regals, bis die
// Salve vorbei ist, und fährt zum nächsten Fach. Auf der anderen Seite hat der Gang keinen Rand.
const K = [0, 0, -15];     // Käsekessi: Mitte des Bodens
const E = [16, 0, -18];    // Emmentaler: Mitte der vorderen Kante (7 x 13 Kacheln zu 1.6 m)
const KY = -3, KZ = -38;   // Käsekeller: Höhe des Bodens, Mitte des Gangs (führt nach +x)
const FACH = [32, 38, 44]; // Fächer im Regal (x)
// Regal an der linken Seite des Gangs: Bretter zwischen den Fächern, hinten eine Wand
const regal = [[22, 26], [28.4, 30.8], [33.2, 36.8], [39.2, 42.8], [45.2, 47], [49.4, 51]];

export default {
  id: 'sch1', name: 'Käserei', emoji: '🧀', theme: 'schweiz', variante: 'kaeserei',
  start: [0, 0, 2], killY: -11,
  parts: [
    // Käserei: Start zwischen den Milchkannen, dann ein schmaler Steg ohne Rand zum Kessi
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 4, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'milchkanne', at: [-3.2, 0, 0], scale: 0.55, fest: true },
    { type: 'deko', form: 'milchkanne', at: [3.2, 0, -2], scale: 0.55, yaw: 40, fest: true },
    { type: 'weg', from: [0, 0, -3], to: [0, 0, -11], width: 1.6 },

    // Käsekessi: die Harfe rührt schnell, vorne hinein, rechts durch die enge Lücke hinaus
    { type: 'schuessel', at: K, r: 4.5, R: 6, h: 1.2, rim: 0.5, art: 'kessi', offen: [180, -90], luecke: 1.6 },
    { type: 'balken', at: K, length: 8.4, speed: 60, form: 'kaeseharfe', farbe: 'holz' },
    // Blubbern im Kessi: gleich hinter dem Eingang (wirft zurück auf den Steg oder in die Harfe), dazu eines in der Mitte
    { type: 'knall', pos: [0, 0, -11.2], r: 1.1, kick: [6, 4.5, 7, 5], up: 0.7, takt: [4.6, 1, 1, 6.2, 2.4], warn: 0.7, look: 'kessi' },
    { type: 'knall', pos: [K[0], 0, K[2]], r: 1.3, kick: 5, up: 0.9, takt: [3, 1.5, 4.5], offset: 1, warn: 0.6, look: 'kessi' },
    { type: 'weg', from: [4.2, 0, K[2]], to: [9, 0, K[2]], width: 1.4 },
    { type: 'weg', from: [9, 0, K[2]], to: [13, 0, K[2]], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [11, 0, K[2]], yaw: -90, size: [3, 3, 2] },
    { type: 'kurve', at: [13, 0, K[2]], yaw: -90, turn: -90, radius: 3, width: 3, walls: 0.8 },

    // Emmentaler-Labyrinth: ein Weg eine Kachel breit, zwei Sackgassen (links vorne ein Stern, links hinten der Bonus)
    { type: 'feld', at: E, cell: 1.6, look: 'kaese', map: [
      '.....#.',
      '.....#.',
      '.#####.',
      '.#.....',
      '####...',
      '#..#...',
      '...###.',
      '.....#.',
      '.#####.',
      '.#.....',
      '####...',
      '...#...',
      '...#...'
    ] },
    { type: 'checkpoint', at: [16, 0, -30], size: [1.6, 3, 1.6] },
    // Laibe fallen aus dem Regal über dem langen Gang oben (Reihe 10, Spalten 2 bis 4) und stossen quer ins Loch
    { type: 'fallend', form: 'laib', r: 0.65, from: [14.4, 6, -34.8], to: [17.6, -34.8], stellen: [0.5, 0, 1, 0.3, 0.75],
      every: [0.9, 0.9, 6.5, 1.4, 6], warn: 0.7, liegt: 1.2, kick: 5 },
    { type: 'klotz', at: [16, 6.6, -34.8], size: [7, 0.25, 2.2], look: 'holz', deko: true },
    ...[12, 20].map(x => ({ type: 'klotz', at: [x, 1.3, -34.8], size: [0.3, 10.6, 0.3], look: 'holz', deko: true })),
    { type: 'deko', form: 'laib', at: [12.8, 6.75, -34.8], yaw: 30, scale: 0.7 },
    { type: 'deko', form: 'laib', at: [19.2, 6.75, -34.8], yaw: 80, scale: 0.7 },
    { type: 'weg', from: [19.2, 0, -38.8], to: [19.2, 0, -42.8], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [19.2, 0, -41], size: [3, 3, 2] },

    // Kellerabgang: schmale Wendel ohne Rand hinunter, unten ins Regal hinein
    { type: 'kurve', at: [19.2, 0, -42.8], yaw: 0, turn: 180, radius: 4, width: 1.6, rise: KY },
    { type: 'weg', from: [27.2, KY, -42.8], to: [27.2, KY, KZ - 1.1], width: 2.4, walls: 0.8 },
    { type: 'checkpoint', at: [27.2, KY, -42], size: [2.4, 3, 1.4] },

    // Käsekeller: Gang ohne Rand rechts, links das Regal mit Fächern; die Laibe rollen vom hinteren Ende her mit
    { type: 'weg', from: [22, KY, KZ], to: [51, KY, KZ], width: 2.2 },
    { type: 'klotz', at: [36.5, KY - 0.5, KZ - 2.1], size: [29, 1, 2], look: 'holz' },
    ...regal.map(([a, b]) => ({ type: 'klotz', at: [(a + b) / 2, KY + 0.7, KZ - 2.1], size: [b - a, 1.4, 2], look: 'holz' })),
    ...FACH.map(x => ({ type: 'klotz', at: [x, KY + 0.7, KZ - 3.3], size: [2.4, 1.4, 0.4], look: 'holz' })),
    { type: 'deko', form: 'kaeseregal', at: [20.5, KY, KZ], yaw: 90, scale: 1.2 },
    // Salven: drei bis vier Laibe kurz hintereinander, jeder mit anderer Grösse und anderem Tempo, dann eine Pause
    { type: 'felsen', form: 'laib', from: [23, KY, KZ + 0.2], dir: [1, 0], speed: [12, 15, 10, 14, 11], every: [1, 1.3, 0.8, 5.5, 1.1, 1.1, 6.5],
      r: [0.75, 0.5, 0.85, 0.6, 0.8, 0.65, 0.55], wobble: 0.2, anzahl: 4 },

    // Ziel: im letzten Fach links hinaus, auf ein riesiges Stück Käse
    { type: 'weg', from: [48.2, KY, KZ - 3.1], to: [48.2, KY, KZ - 10], width: 2.4, walls: 0.8, caps: 'end', look: 'kaese' },
    { type: 'ziel', at: [48.2, KY, KZ - 7.5] },

    // Käserei und Keller rundherum
    { type: 'deko', form: 'kaeseregal', at: [-8.5, -2, -2], yaw: 90 },
    { type: 'deko', form: 'milchkanne', at: [6, -2, -5], yaw: -30 },
    { type: 'deko', form: 'laib', at: [-9.5, -3, -16], yaw: 20 },
    { type: 'deko', form: 'laib', at: [-9.5, -1.4, -16], yaw: 50, scale: 0.8 },
    { type: 'deko', form: 'kaeseregal', at: [7, -3, -30], yaw: -90, scale: 1.2 },
    { type: 'deko', form: 'laib', at: [30, -9, KZ + 6], yaw: 10 },
    { type: 'deko', form: 'laib', at: [40, -9, KZ + 6.5], yaw: 70 },
    { type: 'deko', form: 'milchkanne', at: [54, -7, KZ], yaw: 15 },

    // Sterne: im Kessi neben der Linie, in der vorderen Sackgasse, in zwei Fächern, am offenen Rand des Gangs;
    // Bonus in der hinteren Sackgasse des Labyrinths
    { type: 'stern', at: [1.8, 0.9, -13.4] },
    { type: 'stern', at: [11.2, 0.9, -22] },
    { type: 'stern', at: [FACH[0], KY + 0.9, KZ - 2.6] },
    { type: 'stern', at: [41, KY + 0.9, KZ + 0.8] },
    { type: 'stern', at: [FACH[2], KY + 0.9, KZ - 2.6] },
    { type: 'stern', at: [11.2, 0.9, -30], bonus: true }
  ]
};
