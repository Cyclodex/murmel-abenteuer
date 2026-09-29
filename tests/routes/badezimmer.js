// Autopilot-Routen der Welt Badezimmer (normale und schwere Level).

// Bad-Chaos: Anfang bis nach den zwei Liften, Ende ab dem Matschfeld bzw. der Seifenleiste
const b1sA = [
  { x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 2.5 },
  { x: 5, z: -18, speed: 2, wait: 'platAtFrom' }, { x: 5, z: -19.75, speed: 1.5, r: 0.5 }, { x: 5, z: -28.25, speed: 1.5, r: 0.5, wait: 'platAtTo' },
  { x: 5, z: -31.5, speed: 2 }, { x: 5, z: -33, speed: 1.5, r: 0.5, wait: ['platAtFrom', 1] }, { x: 5, z: -34.75, speed: 1.5, r: 0.5 },
  { x: 5, z: -43.25, speed: 1.5, r: 0.5, wait: ['platAtTo', 1] }, { x: 5, z: -46.5, speed: 2 }
];
const b1sB = [
  { x: 5, z: -62, speed: 2 }, { x: 5, z: -65.5, speed: 1.5, r: 0.6 },
  { x: 5, z: -70.25, speed: 4, r: 0.6, wait: ['phase', ['felsen', 0, 0.8, 0.95]] }, { x: 5, z: -74.75, speed: 4, r: 0.6, wait: ['phase', ['felsen', 1, 0.8, 0.95]] },
  { x: 5, z: -79.25, speed: 4, r: 0.6, wait: ['phase', ['felsen', 2, 0.8, 0.95]] }, { x: 5, z: -83, speed: 3 },
  { x: 5, z: -97, speed: 6 }, { x: 5, z: -99, speed: 9 }, { x: 5, z: -109, free: true, r: 2 }, { x: 5, z: -112, speed: 1, r: 0.8 },
  { x: 5, z: -134.1, speed: 2 }, { x: 5, z: -140.5, speed: 1.5, r: 0.6 }, { x: 5, z: -141.3, speed: 1, r: 0.4, wait: ['phase', ['schiff', 2, 0, 0.05]] },
  { x: 5, z: -144.5, speed: 3, r: 0.8 }, { x: 5, z: -152.5, speed: 1.5, r: 0.6, wait: ['phase', ['schiff', 2, 0.5, 0.58]] },
  { x: 5, z: -158, speed: 2 }, { x: 5, z: -166.5, speed: 2 }, { x: 5, z: -176, speed: 6 }, { x: 5, z: -183 }
];

export default {
  b1: [
    // Hauptweg: Looping, Lift, Matsch, zwischen den Steinen durch, Band, Schanze ins Lavabo, Schiffchen, Toilette
    [
      { x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 3 },
      { x: 5, z: -18, speed: 2, wait: 'platAtFrom' }, { x: 5, z: -20.5, speed: 1.5, r: 0.5 }, { x: 5, z: -28, speed: 1.5, r: 0.5, wait: 'platAtTo' },
      { x: 5, z: -32, speed: 2 }, { x: 5, z: -40, speed: 3 }, { x: 5, z: -41.5, speed: 1.5, r: 0.6 },
      { x: 5, z: -46.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 0, 0.75, 0.9]] }, { x: 5, z: -51.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 1, 0.75, 0.9]] },
      { x: 5, z: -55, speed: 3 }, { x: 5, z: -66, speed: 9 }, { x: 5, z: -76, free: true, r: 2 }, { x: 5, z: -79, speed: 1, r: 0.8 },
      { x: 5, z: -100.5, speed: 2 }, { x: 5, z: -108.5, speed: 2 }, { x: 5, z: -115.5, speed: 2 }, { x: 5, z: -126 }
    ],
    // Umweg durch den Matsch in die Nische zum Bonusstern
    [{ x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 3 },
      { x: 5, z: -18, speed: 2, wait: 'platAtFrom' }, { x: 5, z: -20.5, speed: 1.5, r: 0.5 }, { x: 5, z: -28, speed: 1.5, r: 0.5, wait: 'platAtTo' },
      { x: 5, z: -32, speed: 2 }, { x: 4, z: -37.25, speed: 2 }, { x: -0.5, z: -37.25, speed: 2, r: 0.5 }]
  ],
  b1s: [
    // rechts durch das Matschfeld zwischen den Abflusslöchern
    [...b1sA, { x: 5, z: -49, speed: 1.5 }, { x: 5, z: -53, speed: 1.5, r: 0.6 }, { x: 7, z: -53.2, speed: 1.5, r: 0.6 }, { x: 7, z: -55, speed: 1.5, r: 0.6 },
      { x: 9, z: -55.2, speed: 1.5, r: 0.6 }, { x: 9, z: -59.5, speed: 1.5, r: 0.6 }, ...b1sB],
    // links über die Seifenleiste zum Bonusstern
    [...b1sA, { x: 2.5, z: -47.5, speed: 1.5, r: 0.5 }, { x: 2.5, z: -56, speed: 1.5, r: 0.5 }, { x: 2.5, z: -59.5, speed: 1.5, r: 0.5 }, ...b1sB]
  ]
};
