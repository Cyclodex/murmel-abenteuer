// Autopilot-Routen für ws2 «Sägewerk» (Wegpunkte, siehe tests/autopilot.js).
// Sägetisch: rechts aussen halten, losfahren, wenn das erste Blatt gerade vorbei ist; zwischen den Blättern nach links
// queren, beim zweiten Blatt dasselbe. Latten schnell, Nagelwand, in der S-Kurve vor dem Regal halten, bis lange keine
// Schraube fällt, dann zügig darunter durch. Zickzack ohne Rand, gegen das stotternde Schleifband hinauf, oben auf die
// Kreissäge warten.
const NZ = -40, ZB = -54;

const tisch = [
  { x: 0, z: -3, speed: 2.5 }, { x: 3, z: -5, speed: 1.5, r: 0.5 },
  { x: 3, z: -13, speed: 3, r: 0.5, wait: ['balkenWeg', [3, -8.5]] }
];

export default [
  // Hauptweg
  [
    ...tisch, { x: -3, z: -13, speed: 2, r: 0.5 }, { x: -3, z: -21.5, speed: 3, wait: ['balkenWeg', [-3, -17.5]] },
    { x: -3, z: -23.5, speed: 2.5 }, { x: -3, z: -36, speed: 5 }, { x: -3, z: -38, speed: 2.5 }, { x: -3, z: NZ - 1, speed: 2, r: 0.8 },
    { x: -4, z: NZ - 2, speed: 2 }, { x: 0.5, z: NZ - 2, speed: 2 }, { x: 4, z: NZ - 2, speed: 2, r: 0.5 },
    { x: 6.12, z: -42.88, speed: 2, r: 0.5 }, { x: 7, z: -45, speed: 3.5, r: 0.6, wait: ['frei', 'fallend', 0, 2.5] },
    { x: 7.2, z: -48, speed: 3.5, r: 0.6 }, { x: 7, z: -51, speed: 2.5, r: 0.5 }, { x: 7.88, z: -53.12, speed: 2, r: 0.5 }, { x: 11, z: ZB, speed: 2, r: 0.5 },
    { x: 12, z: ZB, speed: 1.5, r: 0.5 }, { x: 16, z: ZB - 4, speed: 1.5, r: 0.5 }, { x: 20, z: ZB, speed: 1.5, r: 0.5 },
    { x: 24, z: ZB - 4, speed: 1.5, r: 0.5 }, { x: 28, z: ZB, speed: 1.5, r: 0.5 },
    { x: 37, z: ZB, speed: 3 }, { x: 41.25, z: ZB, speed: 2 }, { x: 42.6, z: ZB, speed: 1.5, r: 0.5 },
    { x: 50, z: ZB, speed: 4, wait: ['balkenWeg', [46.5, ZB]] }, { x: 55.5, z: ZB }
  ],
  // rechts am zweiten Blatt vorbei in die hintere Tischecke zum Bonusstern
  [...tisch, { x: 3.3, z: -21.1, speed: 2, r: 0.5, wait: ['balkenWeg', [3, -17.5]] }]
];
