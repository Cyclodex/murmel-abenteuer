// Schweiz 1: Käserei. Zwischen den Milchkannen durch, die Rampe hinauf ins kupferne Käsekessi (die Käseharfe rührt),
// über den Emmentaler um die Löcher herum, die Kellertreppe hinunter in den Käsekeller: dort rollen Laibe aus dem
// Regal quer über den Weg. Das Ziel liegt auf einem riesigen Stück Käse.
const K = [0, 0, -20];   // Käsekessi: Mitte des Bodens
const E = -31;           // Emmentaler: vordere Kante (z), 7 x 12 Kacheln zu 1.5 m
const KY = -3, KZ = -58; // Käsekeller: Höhe des Bodens, Mitte des Gangs (führt nach +x)
const rinde = (from, to) => ({ type: 'wand', from, to, height: 0.8, look: 'rinde' });
// Laib rollt aus dem Regal über ein Brett hinunter und quer über den Gang (Lücke in beiden Wänden)
const laib = (x, offset) => [
  { type: 'weg', from: [x, 0, KZ - 8.5], to: [x, KY, KZ - 2.5], width: 2.8, walls: 0.6, caps: 'start', look: 'holz' },
  { type: 'felsen', form: 'laib', from: [x, -0.1, KZ - 7.7], dir: [0, 1], speed: 0.5, every: 5, r: 1, offset }
];

export default {
  id: 'sch1', name: 'Käserei', emoji: '🧀', theme: 'schweiz', variante: 'kaeserei',
  start: [0, 0, 2], killY: -11,
  parts: [
    // Käserei: zwischen zwei Milchkannen durch
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -9], width: 6, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'milchkanne', at: [-1, 0, -4], scale: 0.55, fest: true },
    { type: 'deko', form: 'milchkanne', at: [1, 0, -7], scale: 0.55, yaw: 40, fest: true },
    { type: 'wand', from: [-3.2, 0, -9], to: [-1.9, 0, -9] },
    { type: 'wand', from: [1.9, 0, -9], to: [3.2, 0, -9] },

    // Rampe hinauf auf den Rand des Käsekessis, drinnen rührt die Käseharfe, hinten hinaus durch die Lücke
    { type: 'weg', from: [0, 0, -9], to: [0, 1.4, -13.5], width: 3, walls: 0.6 },
    { type: 'schuessel', at: K, r: 4, R: 6, h: 1.4, rim: 0.5, art: 'kessi', offen: [0] },
    { type: 'balken', at: K, length: 5, speed: 25, form: 'kaeseharfe', farbe: 'holz' },
    { type: 'weg', from: [0, 0, -23.8], to: [0, 0, -28], width: 2.6, walls: 0.8 },
    { type: 'wand', from: [-2.7, 0, -28], to: [-1.7, 0, -28] },
    { type: 'wand', from: [1.7, 0, -28], to: [2.7, 0, -28] },
    { type: 'weg', from: [0, 0, -28], to: [0, 0, E], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -29.5], size: [5, 3, 2] },

    // Emmentaler: um die Löcher herum (erst rechts, dann links), links in der Rinde eine Nische mit dem Bonusstern
    { type: 'feld', at: [0, 0, E], cell: 1.5, look: 'kaese', map: [
      '#######',
      '#######',
      '.##.###',
      '###..##',
      '###.#.#',
      '######.',
      '#######',
      '.#.###.',
      '##..###',
      '#.#.##.',
      '#######',
      '#######'
    ] },
    rinde([-5.65, 0, E + 0.2], [-2.9, 0, E + 0.2]),
    rinde([2.9, 0, E + 0.2], [5.65, 0, E + 0.2]),
    rinde([5.45, 0, E], [5.45, 0, E - 18]),
    rinde([-5.45, 0, E], [-5.45, 0, E - 7.75]),
    rinde([-5.45, 0, E - 10.25], [-5.45, 0, E - 18]),
    rinde([-5.65, 0, E - 18.2], [-2.9, 0, E - 18.2]),
    rinde([2.9, 0, E - 18.2], [5.65, 0, E - 18.2]),
    { type: 'nische', at: [-5.25, 0, E - 9], yaw: 90, look: 'kaese' },
    { type: 'weg', from: [0, 0, E - 18], to: [0, 0, -53], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -51], size: [5, 3, 2] },

    // um die Ecke und die Kellertreppe hinunter
    { type: 'kurve', at: [0, 0, -53], yaw: 0, turn: 90, radius: 5, width: 5, walls: 0.8 },
    { type: 'weg', from: [5, 0, KZ], to: [15, KY, KZ], width: 5, walls: 0.8 },
    { type: 'weg', from: [15, KY, KZ], to: [19, KY, KZ], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [17, KY, KZ], yaw: -90, size: [5, 3, 2] },

    // Käsekeller: zwei Laibe rollen aus dem Regal quer über den Gang und fallen vorne hinunter
    { type: 'weg', from: [19, KY, KZ], to: [32, KY, KZ], width: 5 },
    ...[-1, 1].flatMap(k => [[19, 20.9], [24.1, 26.9], [30.1, 32]].map(([a, b]) => ({ type: 'wand', from: [a, KY, KZ + k * 2.7], to: [b, KY, KZ + k * 2.7] }))),
    ...laib(22.5, 4.4),
    ...laib(28.5, 2.5),
    { type: 'deko', form: 'kaeseregal', at: [25.5, -4.5, KZ - 10.2], scale: 1.4 },
    { type: 'weg', from: [32, KY, KZ], to: [35, KY, KZ], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [33.5, KY, KZ], yaw: -90, size: [5, 3, 2] },

    // Ziel auf einem riesigen Stück Käse mit Rinde
    { type: 'weg', from: [35, KY, KZ], to: [43, KY, KZ], width: 8, thick: 2.5, look: 'kaese' },
    rinde([35.2, KY, KZ - 4.4], [35.2, KY, KZ - 2.9]),
    rinde([35.2, KY, KZ + 2.9], [35.2, KY, KZ + 4.4]),
    rinde([35, KY, KZ - 4.2], [43, KY, KZ - 4.2]),
    rinde([35, KY, KZ + 4.2], [43, KY, KZ + 4.2]),
    rinde([43.2, KY, KZ - 4.4], [43.2, KY, KZ + 4.4]),
    { type: 'ziel', at: [39.5, KY, KZ] },

    // Käserei und Keller rundherum
    { type: 'deko', form: 'kaeseregal', at: [-8.5, -2, -2], yaw: 90 },
    { type: 'deko', form: 'milchkanne', at: [6, -2, -5], yaw: -30 },
    { type: 'deko', form: 'milchkanne', at: [8.6, -2, -2.5], yaw: 60, scale: 0.8 },
    { type: 'deko', form: 'laib', at: [-9.5, -3, -22], yaw: 20 },
    { type: 'deko', form: 'laib', at: [-9.5, -1.4, -22], yaw: 50, scale: 0.8 },
    { type: 'deko', form: 'kaeseregal', at: [12, -3, -40], yaw: -90, scale: 1.2 },
    { type: 'deko', form: 'laib', at: [22.3, -10, KZ + 6.5], yaw: 10 },
    { type: 'deko', form: 'laib', at: [28.8, -10, KZ + 7], yaw: 70 },
    { type: 'deko', form: 'laib', at: [26, -8.4, KZ + 6.6], yaw: 35, scale: 0.9 },
    { type: 'deko', form: 'milchkanne', at: [10, -7, KZ + 6], yaw: 15 },

    { type: 'stern', at: [1.4, 0.9, -4] },
    { type: 'stern', at: [3.6, 0.9, -20] },
    { type: 'stern', at: [2.25, 0.9, E - 5.25] },
    { type: 'stern', at: [-2.25, 0.9, E - 12.75] },
    { type: 'stern', at: [25.5, KY + 0.9, KZ] },
    { type: 'stern', at: [-7.75, 0.9, E - 9], bonus: true }
  ]
};
