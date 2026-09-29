// Autopilot-Routen der schweren Level der Welt vulkan (id -> Wegpunkte, siehe tests/autopilot.js).
// Zweite Route = anderer Weg der Gabelung mit Bonusstern; sie fährt bis ins Ziel und sammelt alle Sterne.
const S = (n, a, b) => ['phase', ['schieber', n, a, b]];
const HAM = (n, a = 0.72, b = 0.85) => ['phase', ['hammer', n, a, b]];
// Lavabombe ist gerade vorbeigerollt (kreuzt die Bahn bei Phase ~0.72..0.83)
const FEL = (n, a = 0.87, b = 0.3) => ['phase', ['felsen', n, a, b]];

// v1s: Schieber-Steg bis zur Gabelung, ab dem Treffpunkt gemeinsamer Rest
const v1Start = [
  { x: 0, z: -4, speed: 3 }, { x: 0, z: -11, speed: 4, wait: S(0, 0.82, 0.92) }, { x: 0, z: -18, speed: 4, wait: S(1, 0.82, 0.92) }, { x: 0, z: -21.5, speed: 3 }
];
const v1Rest = [
  { x: 1, z: -54, speed: 3 }, { x: 0, z: -56, speed: 2 }, { x: 1.17, z: -58.83, speed: 2 }, { x: 5.5, z: -60, speed: 2 },
  { x: 13, z: -60, speed: 5, wait: HAM(0) }, { x: 26, z: -60, speed: 6, r: 1 }, { x: 30, z: -60, speed: 2 },
  { x: 33.83, z: -61.17, speed: 2 }, { x: 35, z: -65.5, speed: 2 },
  { x: 35, z: -71, speed: 4.5, wait: HAM(1) }, { x: 35, z: -77, speed: 4.5, wait: HAM(2) }, { x: 35, z: -83, speed: 4.5, wait: HAM(3) },
  { x: 35, z: -88, speed: 2.5 }, { x: 35, z: -96, speed: 2.5 }, { x: 35, z: -105, speed: 2.5 },
  { x: 35, z: -106.8, speed: 1.5 }, { x: 35, z: -108.5, speed: 1.5, r: 0.5, wait: ['platAtFrom', 1] },
  { x: 35, z: -116.5, speed: 1.5, wait: ['platAtTo', 1], r: 0.5 }, { x: 35, z: -124 }
];

// v2s: Band bis zur Gabelung, ab dem Treffpunkt gemeinsamer Rest
const v2Start = [{ x: 0, z: -3, speed: 3 }, { x: 0, z: -15, speed: 4 }];
const v2Rest = [
  { x: 0, z: -47, speed: 3 }, { x: 0, z: -49.5, speed: 2 },
  { x: 0, z: -60.5, speed: 3 }, { x: 0, z: -66.5, speed: 4, wait: FEL(0) },
  { x: 0, z: -76.5, speed: 3 }, { x: 0, z: -82.5, speed: 4, wait: FEL(1) },
  { x: 0, z: -86, speed: 3 }, { x: 0.9, z: -90, speed: 3 }, { x: -0.9, z: -99, speed: 3 }, { x: 0, z: -104, speed: 3 }, { x: 0, z: -110, speed: 2 },
  { x: 0, z: -115, speed: 2 }, { x: 0, z: -125, speed: 4, r: 0.8, wait: ['balkenWeg', [0, -120]] },
  { x: 0, z: -135, speed: 4, r: 0.8, wait: ['balkenWeg', [0, -130]] }, { x: 0, z: -146, speed: 3, r: 0.8 },
  { x: 0, z: -153, speed: 2 }, { x: 0, z: -159, speed: 1.5, r: 0.6 }, { x: -2, z: -159, speed: 2, r: 0.6 }, { x: -2, z: -163, speed: 2, r: 0.6 },
  { x: 0, z: -163, speed: 2, r: 0.6 }, { x: 0, z: -167, speed: 2 },
  { x: 0, z: -173, speed: 2.5 }, { x: -1.46, z: -177.54, speed: 2.5 }, { x: -5, z: -179, speed: 2.5 }, { x: -12, z: -179 }
];

export default {
  v1s: [
    // Hauptweg: Schieber abpassen, rechts über Plattform und Wippe, Hammer, Falltüren schnell, Stampfer-Gasse, Wippen, Plattform
    [
      ...v1Start,
      { x: 4, z: -23, speed: 3 }, { x: 5, z: -28.3, speed: 1.5 }, { x: 5, z: -30.5, speed: 1.5, r: 0.5, wait: 'platAtFrom' },
      { x: 5, z: -37.5, speed: 1.5, wait: 'platAtTo', r: 0.5 }, { x: 5, z: -40, speed: 2 }, { x: 5, z: -49, speed: 2.5 },
      ...v1Rest
    ],
    // links über das Feld mit Löchern: Stern und Bonusstern in der Sackgasse
    [
      ...v1Start,
      { x: -5, z: -24, speed: 2 }, { x: -5, z: -29, speed: 1.5, r: 0.5 }, { x: -5, z: -31, speed: 1.5, r: 0.5 }, { x: -3, z: -31, speed: 1.5, r: 0.5 },
      { x: -3, z: -37, speed: 1.5, r: 0.5 }, { x: -3, z: -35, speed: 1.5, r: 0.5 }, { x: -7, z: -35, speed: 1.5, r: 0.5 },
      { x: -7, z: -41, speed: 1.5, r: 0.5 }, { x: -5, z: -41, speed: 1.5, r: 0.5 }, { x: -5, z: -49, speed: 2 },
      ...v1Rest
    ]
  ],
  v2s: [
    // Hauptweg: Band, Treppe und Stampfer, Lavabomben abwarten, Bach, Balken abpassen, Dampf, Eisfeld, Eis-Abfahrt
    [
      ...v2Start,
      { x: 4.5, z: -18.5, speed: 2 }, { x: 4.5, z: -33, speed: 2.5 }, { x: 4.5, z: -36.5, speed: 2 }, { x: 4.5, z: -42.5, speed: 5, wait: HAM(0) },
      ...v2Rest
    ],
    // über den steilen Grat zum Bonusstern
    [
      ...v2Start,
      { x: -4.5, z: -19, speed: 2 }, { x: -4.5, z: -33, speed: 1.5, r: 0.8 }, { x: -4.5, z: -43, speed: 2 },
      ...v2Rest
    ]
  ],
  // Schieber im Schlamm, Kanone, Abzweig zum Bonusstern, Magnete, Spirale, Dominos, Stampfer und Schieber, Looping, Kanone
  v3s: [
    { x: 0, z: -5.3, speed: 3 }, { x: 0, z: -10.5, speed: 4, wait: S(0, 0.88, 0.96) }, { x: 0, z: -15, speed: 2 },
    { x: 0, z: -40, speed: 3 }, { x: 0, z: -48, speed: 2 }, { x: 1, z: -49, speed: 1.5, r: 0.5 }, { x: 6.5, z: -49, speed: 1.5, r: 0.5 },
    { x: 0.5, z: -49, speed: 1.5, r: 0.5 },
    { x: 0.6, z: -52, speed: 1.5, r: 0.5 }, { x: 0, z: -56, speed: 1.5, r: 0.5 },
    { x: -0.6, z: -60, speed: 1.5, r: 0.5 }, { x: 0, z: -64.5, speed: 1.5, r: 0.5 }, { follow: true, bisY: 0.7, speed: 3 },
    { x: 0, z: -68, speed: 3 }, { x: 0, z: -70, speed: 5 }, { x: 0, z: -80, speed: 5 }, { x: 0, z: -82.5, speed: 2 },
    { x: 0, z: -87.4, speed: 4.5, wait: HAM(0) }, { x: 0, z: -92.6, speed: 4, wait: S(1, 0.82, 0.92) }, { x: 0, z: -98, speed: 4.5, wait: HAM(1) },
    { x: 0, z: -101, speed: 3 }, { x: 0, z: -104, speed: 4 }, { x: 0, z: -107, speed: 8 }, { x: 5, z: -111, free: true, r: 2.5 },
    { x: 5, z: -114, speed: 3 }, { x: 5, z: -137 }
  ]
};
