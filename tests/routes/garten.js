// Autopilot-Routen der schweren Level der Welt garten (id -> Wegpunkte, siehe tests/autopilot.js).
// Schlammbeet im Zickzack (Welt Garten, Level g1s)
const beet = [
  { x: 0, z: -3.5, speed: 2 }, { x: -2, z: -5, speed: 1.5, r: 0.6 }, { x: -2, z: -11, speed: 2, r: 0.6 }, { x: 2, z: -11, speed: 1.5, r: 0.6 },
  { x: 2, z: -15, speed: 2, r: 0.6 }, { x: -2, z: -15, speed: 1.5, r: 0.6 }, { x: -2, z: -19, speed: 2, r: 0.6 }, { x: 0, z: -22, speed: 2 },
  { x: 0, z: -28.5, speed: 3, r: 1 }
];

// Brücke im Wind, Sandkasten, Förmchen, Hammer, Burgtor und Springbrunnen hoch auf die Burg (g2s)
const burgHoch = [
  { x: 0, z: -3, speed: 3.5 }, { x: -0.4, z: -8, speed: 3.5, r: 0.8 }, { x: 0.4, z: -14, speed: 3.5, r: 0.8 }, { x: -0.4, z: -20, speed: 3.5, r: 0.8 },
  { x: 0, z: -25.5, speed: 3 }, { x: -5, z: -25.5, speed: 3, r: 0.7 }, { x: -5, z: -31, speed: 3, r: 0.7 }, { x: -3, z: -31, speed: 3, r: 0.7 },
  { x: -3, z: -35, speed: 3, r: 0.7 }, { x: 0, z: -35, speed: 3, r: 0.7 }, { x: 0, z: -39.5, speed: 3 }, { x: 0, z: -42, speed: 3 },
  { x: 0, z: -47, speed: 3 }, { x: 0, z: -51, speed: 3 }, { x: 0, z: -58, speed: 4 }, { x: 0, z: -63, speed: 2, r: 0.6 },
  { x: 0, z: -69, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -80, speed: 4 }, { x: 0, z: -87, speed: 3 },
  { x: 0, z: -92, speed: 2, wait: ['hoehe', 8] }, { x: 2, z: -94, speed: 3 }
];

// Baumhaus-Spirale, Steinschlag, Treppe und Dominos bis vor die Maulwurf-Wiese (g3s)
const wieseVor = [
  { x: 0, z: -3.5, speed: 3 }, { follow: true, bisY: 6.6, speed: 4 }, { x: 0, z: -9, speed: 2 }, { x: 0, z: -13, speed: 1.5, r: 0.6 },
  { x: 0, z: -21.5, speed: 4, r: 0.8, wait: ['phase', ['felsen', 0, 0.82, 0.9]] }, { x: 0, z: -29, speed: 4, wait: ['phase', ['felsen', 1, 0.8, 0.88]] },
  { x: 0, z: -32.5, speed: 2 }, { x: 0, z: -45, speed: 3 }, { x: 0, z: -49, speed: 3 }, { x: 0, z: -61, speed: 5 }, { x: 0, z: -65, speed: 3 },
  { x: 0, z: -67, speed: 2, r: 0.8 }
];

export default {
  g1s: [
    // Hauptweg: Beet, Schlauch, Rasen mit Sprenger, Hämmer abwarten, Bach um die Steine, Planschbecken, Sprenger abwarten
    [
      ...beet,
      { x: 2, z: -52, speed: 3 }, { x: 8.5, z: -56, speed: 2.5 }, { x: 8.5, z: -66, speed: 2.5 }, { x: 7.8, z: -71, speed: 2 }, { x: 6, z: -75.5 },
      { x: 3, z: -78.5, speed: 2 }, { x: 3, z: -80, speed: 1.5, r: 0.6 },
      { x: 3, z: -87, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 3, z: -94, speed: 5, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
      { x: 3, z: -99, speed: 3 }, { x: 4, z: -104, speed: 4 }, { x: 4, z: -108, speed: 4 }, { x: 2, z: -111, speed: 4 }, { x: 2, z: -115, speed: 4 },
      { x: 3, z: -120, speed: 3 }, { x: 3, z: -127, speed: 3 }, { x: 3, z: -133, speed: 2 }, { x: 3, z: -135, speed: 1.5, r: 0.6 },
      { x: 3, z: -143.5, speed: 5, r: 0.8, wait: ['balkenWeg', [3, -140]] }, { x: 3, z: -151, speed: 5, wait: ['balkenWeg', [3, -147]] }, { x: 3, z: -155 }
    ],
    // Umweg über das schmale Brett zum Bonusstern
    [...beet, { x: -3.2, z: -50.5, speed: 2 }, { x: -3.6, z: -54, speed: 3.5, r: 0.8 }, { x: -3.2, z: -60.5, speed: 3.5, r: 0.8 }, { x: -2.8, z: -63, speed: 3.5, r: 0.8 }, { x: -3.2, z: -71, speed: 3 }]
  ],
  g2s: [
    // Hauptweg: Brücke im Wind, Sandkasten, Förmchen, Hammer, Springbrunnen, Wendeltreppe, Schalter, Graben, Zugbrücke
    [
      ...burgHoch,
      { x: 6, z: -96.5, speed: 2 }, { x: 6, z: -99, speed: 2 }, { follow: true, bisY: 1.6, speed: 4 }, { x: 6, z: -110, speed: 5 }, { x: 6, z: -121, speed: 4 },
      { x: 2, z: -126, speed: 2.5 }, { x: -1, z: -128, speed: 2, r: 0.6 }, { x: 3, z: -129, speed: 2 }, { x: 3, z: -145, speed: 4 },
      { x: 3, z: -151, speed: 4, wait: 'bridgeUp' }, { x: 3, z: -161, speed: 5 }
    ],
    // Umweg über die Zinne mit dem Sandschieber zum Bonusstern
    [...burgHoch, { x: 0, z: -96.5, speed: 2 }, { x: 0, z: -100, speed: 1.5, r: 0.6 }, { x: 0, z: -107, speed: 4, wait: ['phase', ['schieber', 0, 0.8, 0.95]] }, { x: 0, z: -112, speed: 3 }]
  ],
  g3s: [
    // Hauptweg: Spirale, Steine abwarten, Treppe, Dominos, rechts am Rand an den Hämmern vorbei, schnell über die Falltüren
    [
      ...wieseVor,
      { x: 7, z: -67.2, speed: 2.5, r: 0.8 }, { x: 7, z: -69, speed: 1.5, r: 0.6 },
      { x: 7, z: -76, speed: 5, r: 0.8, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 7, z: -83, speed: 5, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
      { x: 7, z: -85, speed: 2 }, { x: 0, z: -85, speed: 2.5 }, { x: 0, z: -87, speed: 2 }, { x: 0, z: -103, speed: 6, r: 1 }, { x: 0, z: -106 }
    ],
    // Umweg im Zickzack durch die Maulwurfslöcher zum Bonusstern
    [
      ...wieseVor,
      { x: 0, z: -73, speed: 2, r: 0.6 }, { x: -4, z: -73, speed: 2, r: 0.6 }, { x: -4, z: -79, speed: 2, r: 0.6 }, { x: 0, z: -79, speed: 2, r: 0.6 },
      { x: 0, z: -85, speed: 2 }, { x: 0, z: -87, speed: 2 }
    ]
  ]
};
