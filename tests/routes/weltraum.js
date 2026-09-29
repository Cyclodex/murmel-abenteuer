// Autopilot-Routen der schweren Level der Welt weltraum (id -> Wegpunkte, siehe tests/autopilot.js).

// w1s: Anfang (Krater, Sprung zur Mondbasis) und Schluss (Stampfer, Falltüren, Eis-Komet, Landestation) für beide Wege
const w1sStart = [
  { x: 0, z: -6.5, speed: 3 }, { x: 0, z: -21, speed: 5 }, { x: 0, z: -24, speed: 3 }, { x: 0, z: -30, speed: 5 }, { x: 0, z: -46, speed: 5 }
];
const w1sEnde = [
  { x: 0, z: -88, speed: 2 }, { x: 0, z: -89.5, speed: 2, r: 0.6 }, { x: 0, z: -100, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
  { x: 0, z: -118, speed: 6 }, { x: 0, z: -119.5, speed: 2 }, { x: 0, z: -136, speed: 4 }, { x: 0, z: -140, speed: 4 },
  { x: 0, z: -152, speed: 4 }, { x: 0, z: -156 }
];

// w2s: Asteroid mit Kratern bis zur Werft, und vom Treffpunkt mit dem Shuttle zum Landeplatz
const w2sStart = [
  { x: 0, z: -6, speed: 2 }, { x: 0, z: -24, speed: 2, r: 0.8 }, { x: -4, z: -26, speed: 2 }, { x: -4, z: -32, speed: 2.5 },
  { x: 0, z: -34.5, speed: 2 }, { x: 0, z: -37.5, speed: 2 }, { x: 0, z: -40, speed: 2 }, { x: 0, z: -60, speed: 3 }
];
const w2sEnde = [
  { x: 0, z: -106, speed: 3 }, { x: 0, z: -112.3, speed: 2, r: 0.5 }, { x: 0, z: -116, speed: 3, r: 0.6, wait: ['phase', ['plattform', 0, 0, 0.06]] },
  { x: 0, z: -131, speed: 3, wait: 'platAtTo' }, { x: 0, z: -135, speed: 2 }, { x: 0, z: -160 }
];

// w3s: Magnet-Brücke bis zur Station 1, und ab Station 2 Klammer, Luftschleusen und Zielstation
const w3sStart = [
  { x: 0, z: -6, speed: 3 }, { x: 0, z: -15, speed: 2.5 }, { x: 0, z: -24, speed: 2.5 }, { x: 0, z: -33, speed: 2.5 }, { x: 0, z: -43, speed: 3 }
];
const w3sEnde = [
  { x: 0, z: -101, speed: 3 }, { x: 0, z: -106, speed: 2 }, { x: 0, z: -109.5, speed: 2, r: 0.6 },
  { x: 0, z: -118, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -129, speed: 6 }, { x: 0, z: -132, speed: 2 },
  { x: 2.6, z: -135, speed: 2, r: 0.5 }, { x: 2.6, z: -135, speed: 2, r: 0.5, wait: ['balkenWeg', [2.6, -136.95]] }, { x: 2.6, z: -141.5, speed: 4, wait: ['balkenWeg', [2.6, -140.89]] }, { x: 0, z: -143 }
];

export default {
  w1s: [
    // Hauptweg: rechts mit der Mondfähre
    [
      ...w1sStart, { x: 7, z: -52, speed: 3 }, { x: 7, z: -55.5, speed: 2 },
      { x: 7, z: -59.8, speed: 2, r: 0.6, wait: 'platAtFrom' }, { x: 7, z: -76.5, speed: 3, wait: 'platAtTo' }, { x: 7, z: -81, speed: 3 }, { x: 3, z: -85, speed: 3 },
      ...w1sEnde
    ],
    // links über den Kraterrand (Bonusstern): Meteor abwarten
    [
      ...w1sStart, { x: -3.5, z: -52, speed: 2 }, { x: -3.5, z: -61, speed: 2, r: 0.6 },
      { x: -3.5, z: -67, speed: 3, wait: ['phase', ['felsen', 0, 0.55, 0.65]] }, { x: -3.5, z: -80, speed: 3 }, { x: -2, z: -84, speed: 3 },
      ...w1sEnde
    ]
  ],
  w2s: [
    // Hauptweg: Werftgang mit Schiebern (jeweils warten, bis er zurück ist) und Presse
    [
      ...w2sStart, { x: 5, z: -64, speed: 3 }, { x: 5, z: -72, speed: 2, r: 0.6 },
      { x: 5, z: -78.5, speed: 4, r: 0.6, wait: ['phase', ['schieber', 0, 0, 0.08]] },
      { x: 5, z: -85.5, speed: 4, r: 0.6, wait: ['phase', ['schieber', 1, 0, 0.08]] }, { x: 5, z: -91.5, speed: 2, r: 0.6 },
      { x: 5, z: -100, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
      ...w2sEnde
    ],
    // Kanonen-Abkürzung über den Eis-Kometen (Bonusstern)
    [
      ...w2sStart, { x: -5, z: -64, speed: 3 }, { x: -5, z: -67, speed: 2 }, { x: -5, z: -99, speed: 5 },
      ...w2sEnde
    ]
  ],
  w3s: [
    // Hauptweg: Stationsring (Arme abwarten) und Hüllenlecks im Zickzack.
    // Vor jedem Arm zweimal warten (zwei Punkte hintereinander): so fährt die Murmel genau am Anfang der Lücke los.
    [
      ...w3sStart, { x: 5.3, z: -49.3, speed: 2, r: 0.5 },
      { x: 5.3, z: -49.3, speed: 2, r: 0.5, wait: ['balkenWeg', [5.3, -51.16]] }, { x: 5.3, z: -55.5, speed: 4, r: 0.8, wait: ['balkenWeg', [5.3, -54.74]] },
      { x: 5.3, z: -59.3, speed: 1.5, r: 0.5 },
      { x: 5.3, z: -59.3, speed: 1.5, r: 0.5, wait: ['balkenWeg', [5.3, -63.02]] }, { x: 5.3, z: -66, speed: 5, r: 0.8, wait: ['balkenWeg', [5.3, -59.62]] },
      { x: 3, z: -68.5, speed: 2, r: 0.6 },
      { x: 3, z: -73, speed: 1.5, r: 0.5 }, { x: 5, z: -73, speed: 1.5, r: 0.5 }, { x: 5, z: -77, speed: 1.5, r: 0.5 }, { x: 3, z: -77, speed: 1.5, r: 0.5 },
      { x: 3, z: -79, speed: 1.5, r: 0.5 }, { x: 1, z: -79, speed: 1.5, r: 0.5 }, { x: 1, z: -83, speed: 1.5, r: 0.5 }, { x: 3, z: -84, speed: 2, r: 0.6 },
      { x: 3, z: -95, speed: 3 },
      ...w3sEnde
    ],
    // links über den schmalen Steg ins Wurmloch (Bonusstern)
    [
      ...w3sStart, { x: -4, z: -46.5, speed: 2, r: 0.6 }, { x: -4, z: -48.5, speed: 1.5, r: 0.4 }, { x: -4, z: -62, speed: 2 }, { x: -4, z: -64, speed: 2 }, { x: -2, z: -100, speed: 3 },
      ...w3sEnde
    ]
  ]
};
