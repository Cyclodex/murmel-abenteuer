// Autopilot-Routen der schweren Level der Welt kueche (id -> Wegpunkte, siehe tests/autopilot.js).
// Erste Route = Hauptweg (sicher), zweite = riskanter Weg mit dem Bonusstern (fährt auch bis ins Ziel).

// Am heissen Herd: Anfang bis zur Gabelung, Ende ab dem Toaster
const k1sA = [
  { x: 0, z: -3, speed: 3 }, { x: 0, z: -19.5, speed: 5 }, { x: 0, z: -22, speed: 3 }, { x: 0, z: -25, speed: 2.5 }, { x: 0, z: -29.5, speed: 2.5 },
  { x: 0, z: -36.5, speed: 2 }, { x: 0, z: -45.5, speed: 3, wait: ['phase', ['schieber', 0, 0.28, 0.4]] }, { x: 0, z: -51, speed: 2 },
  { x: 0, z: -55, speed: 3 }, { x: 0, z: -61, speed: 2 }, { x: 0, z: -69, speed: 3 }
];
const k1sB = [
  { x: 0, z: -101, speed: 2 }, { x: 0, z: -105, speed: 3 }, { x: 0, z: -114, speed: 4, r: 1.5 }, { x: 0, z: -115.2, speed: 2, r: 0.5, wait: 'amBoden' }, { x: 0, z: -118.5, speed: 2 },
  { x: 0, z: -126, speed: 5, wait: ['phase', ['hammer', 1, 0.72, 0.85]] }, { x: -1.2, z: -130.8, speed: 3 }, { x: -4, z: -132, speed: 3 },
  { x: -17, z: -132, speed: 4 }, { x: -22, z: -132, speed: 3 }
];

// Backstube: Anfang bis zur Gabelung, Ende ab dem Zusammenfluss
const k2sA = [
  { x: 0, z: -3, speed: 3 }, { x: 0, z: -9, speed: 2 }, { x: 0, z: -21, speed: 4, wait: ['balkenWeg', [0, -12]] }, { x: 0, z: -23, speed: 3 },
  { x: 0, z: -30, speed: 3 }, { x: 0, z: -38, speed: 3 }, { x: 0, z: -43, speed: 2 }, { x: 0, z: -51, speed: 2 },
  { x: 0, z: -57, speed: 5, wait: ['phase', ['hammer', 0, 0.76, 0.85]] }, { x: 0, z: -60, speed: 2 }
];
const k2sB = [
  { x: 0, z: -84, speed: 2 }, { x: 0, z: -99, speed: 2.5 }, { x: 0, z: -103, speed: 2 }, { x: 0, z: -119, speed: 2.5 }, { x: 0, z: -124 }
];

// Kühlschrank und Spüle: Anfang bis zur Gabelung, Ende ab dem Zusammenfluss
const k3sA = [
  { x: 0, z: -3, speed: 3 }, { x: 0, z: -5, speed: 2 }, { x: -2, z: -7, speed: 1.5, r: 0.6 }, { x: -2, z: -8.5, speed: 1.5, r: 0.6 },
  { x: 0, z: -11, speed: 1.5, r: 0.6 }, { x: 0, z: -13, speed: 1.5, r: 0.6 }, { x: 2, z: -15, speed: 1.5, r: 0.6 }, { x: 2, z: -16.5, speed: 1.5, r: 0.6 },
  { x: 0, z: -18.5, speed: 2 }, { x: 0, z: -29, speed: 3 }, { x: 0, z: -34, speed: 3 }, { x: 0, z: -47, speed: 5 }, { x: 0, z: -50, speed: 2, r: 0.6 },
  { x: 12, z: -58, speed: 2 }
];
const k3sB = [
  { x: 35, z: -58, speed: 2 }, { x: 43, z: -58, speed: 3 }, { x: 50, z: -58, speed: 2, r: 0.5 },
  { x: 50, z: -72, speed: 3, wait: 'abfluss' }, { x: 51.2, z: -78, speed: 3 }, { x: 51.2, z: -82, speed: 3 }, { x: 48.8, z: -86, speed: 3 }, { x: 48.8, z: -88, speed: 3 },
  { x: 51.2, z: -92, speed: 3 }, { x: 51.2, z: -94, speed: 3 }, { x: 50, z: -97, speed: 2 }, { x: 50, z: -100, speed: 2 },
  { x: 50, z: -107, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 50, z: -112 }
];

export default {
  k1s: [
    // rechts über das Band, das zurückschiebt
    [...k1sA, { x: 3.5, z: -75, speed: 2 }, { x: 3.5, z: -97, speed: 3 }, ...k1sB],
    // links über den Kochlöffel am Fleischklopfer vorbei (Bonusstern)
    [...k1sA, { x: -3, z: -75, speed: 2 }, { x: -3, z: -84, speed: 2 }, { x: -3, z: -90, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
      { x: -3, z: -97, speed: 3 }, ...k1sB]
  ],
  k2s: [
    // rechts am Rührbesen vorbei
    [...k2sA, { x: 2, z: -62, speed: 2 }, { x: 5, z: -65, speed: 2 }, { x: 5, z: -69, speed: 2 },
      { x: 5, z: -76, speed: 4, wait: ['balkenWeg', [5, -71]] }, { x: 5, z: -80, speed: 3 }, ...k2sB],
    // links durch den Eierkarton (Bonusstern)
    [...k2sA, { x: -2, z: -62, speed: 2 }, { x: -5, z: -65, speed: 2 }, { x: -5, z: -69, speed: 1.5, r: 0.5 }, { x: -3, z: -69, speed: 1.5, r: 0.5 },
      { x: -3, z: -73, speed: 1.5, r: 0.5 }, { x: -5, z: -73, speed: 1.5, r: 0.5 }, { x: -5, z: -78, speed: 1.5 }, ...k2sB]
  ],
  k3s: [
    // rechts über die Keksdosen-Klappen (schnell!)
    [...k3sA, { x: 15, z: -63, speed: 2 }, { x: 17, z: -63, speed: 2, r: 0.6 }, { x: 30, z: -63, speed: 6, r: 1 }, { x: 33, z: -59, speed: 2 }, ...k3sB],
    // links über das Schneidebrett mit den Kartoffeln (Bonusstern)
    [...k3sA, { x: 16, z: -58, speed: 2 }, { x: 21, z: -58, speed: 2 }, { x: 28, z: -58, speed: 4, wait: ['phase', ['felsen', 0, 0.65, 0.75]] },
      { x: 33, z: -58, speed: 2 }, ...k3sB]
  ]
};
