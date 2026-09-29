// Autopilot-Routen der schweren Level der Welt spielzimmer (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  sz1s: [
    // Hauptweg: Autos abwarten, Lego-Strassennetz, Dominos, Hammer abwarten, Turbo-Rampe, Kreisel abwarten
    [
      { x: 0, z: -6, speed: 4 }, { x: 1.46, z: -11.54, speed: 3 }, { x: 5, z: -13, speed: 3 }, { x: 8, z: -13, speed: 2, r: 0.5 },
      { x: 12.5, z: -13, speed: 4, r: 0.6, wait: ['phase', ['schieber', 0, 0.88, 0.95]] },
      { x: 18, z: -13, speed: 4, wait: ['phase', ['schieber', 1, 0.88, 0.95]] },
      { x: 22.83, z: -14.17, speed: 3 }, { x: 24, z: -18, speed: 3 }, { x: 29, z: -22, speed: 2.5 },
      { x: 29, z: -28, speed: 2.5, r: 0.6 }, { x: 25, z: -28, speed: 2.5, r: 0.6 }, { x: 25, z: -34, speed: 2.5, r: 0.6 }, { x: 23, z: -34, speed: 2, r: 0.6 },
      { x: 23, z: -40, speed: 2.5, r: 0.6 }, { x: 29, z: -40, speed: 2.5, r: 0.6 }, { x: 29, z: -44, speed: 2.5, r: 0.6 }, { x: 24, z: -49, speed: 3 },
      { x: 24, z: -51.5, speed: 3 }, { x: 24, z: -63, speed: 5 }, { x: 22.54, z: -67.54, speed: 3 }, { x: 19, z: -69, speed: 3 },
      { x: 15, z: -69, speed: 2, r: 0.6 }, { x: 8, z: -69, speed: 5, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
      { x: -5, z: -69, speed: 6 }, { x: -7, z: -69, speed: 3 }, { x: -10.54, z: -70.46, speed: 3 }, { x: -12, z: -74, speed: 3 },
      { x: -10.3, z: -80.7, speed: 2, r: 0.5 }, { x: -10.3, z: -88, speed: 5, wait: ['balkenWeg', [-10.3, -84]] }, { x: -12, z: -90.5, speed: 3 }, { x: -12, z: -95 }
    ],
    // Umweg über den Balken zum Bonusstern
    [
      { x: 0, z: -6, speed: 4 }, { x: 1.46, z: -11.54, speed: 3 }, { x: 5, z: -13, speed: 3 }, { x: 8, z: -13, speed: 2, r: 0.5 },
      { x: 12.5, z: -13, speed: 4, r: 0.6, wait: ['phase', ['schieber', 0, 0.88, 0.95]] },
      { x: 18, z: -13, speed: 4, wait: ['phase', ['schieber', 1, 0.88, 0.95]] },
      { x: 22.83, z: -14.17, speed: 3 }, { x: 22, z: -19, speed: 3 }, { x: 19.5, z: -23, speed: 2 }, { x: 19.5, z: -30, speed: 2, r: 0.6 },
      { x: 19.5, z: -39, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 19.5, z: -44, speed: 2 }
    ]
  ],
  sz2s: [
    // Hauptweg: Plattformen umsteigen, Fahrstuhl, Regalbrett mit Hammer, Wippe, Klappen schnell, Treppe, Hammer
    [
      { x: 0, z: -5, speed: 3 }, { x: 0, z: -7.3, speed: 1.5 }, { x: 0, z: -10, speed: 2, wait: ['phase', ['plattform', 0, 0, 0.05]] }, { x: 0, z: -19.5, speed: 2, wait: ['platAtTo', 0] },
      { x: 0, z: -29.5, speed: 2, wait: ['platAtTo', 1] }, { x: 0, z: -32.5, speed: 1.5 }, { x: 0, z: -36, speed: 2, wait: ['phase', ['plattform', 2, 0, 0.05]] },
      { x: 0, z: -40, speed: 2, wait: ['platAtTo', 2] }, { x: 0, z: -47, speed: 3 }, { x: 2, z: -48, speed: 2, r: 0.6 }, { x: 4, z: -48, speed: 2, r: 0.5 },
      { x: 10, z: -48, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 12, z: -49.5, speed: 2 }, { x: 12, z: -59, speed: 3 },
      { x: 12, z: -65, speed: 2.5, r: 0.6 }, { x: 3, z: -65, speed: 3 }, { x: 0, z: -68, speed: 2, r: 0.6 },
      { x: 0, z: -84, speed: 6, r: 1 }, { x: 0, z: -86, speed: 1.5, r: 0.6 }, { x: 0, z: -99, speed: 2 }, { x: 0, z: -102.5, speed: 2, r: 0.5 },
      { x: 0, z: -108, speed: 5, wait: ['phase', ['hammer', 1, 0.72, 0.85]] }, { x: 0, z: -114 }
    ],
    // Abkürzung über das schmale Brett mit der Klappe zum Bonusstern
    [
      { x: 0, z: -5, speed: 3 }, { x: 0, z: -7.3, speed: 1.5 }, { x: 0, z: -10, speed: 2, wait: ['phase', ['plattform', 0, 0, 0.05]] }, { x: 0, z: -19.5, speed: 2, wait: ['platAtTo', 0] },
      { x: 0, z: -29.5, speed: 2, wait: ['platAtTo', 1] }, { x: 0, z: -32.5, speed: 1.5 }, { x: 0, z: -36, speed: 2, wait: ['phase', ['plattform', 2, 0, 0.05]] },
      { x: 0, z: -40, speed: 2, wait: ['platAtTo', 2] }, { x: 0, z: -47, speed: 2 }, { x: 0, z: -62, speed: 6, r: 1 }, { x: 0, z: -66, speed: 2 }
    ]
  ],
  sz3s: [
    // Hauptweg: um die Klötze in der Knete, durch den Trichter, Eis-Teppich, Schalter am Eis-Steg, Brücke, Hammer, Kreisel umfahren
    [
      { x: 0, z: -4, speed: 3 }, { x: 0.9, z: -7, speed: 2 }, { x: 0.9, z: -9, speed: 2 }, { x: -0.9, z: -11, speed: 2 }, { x: -0.9, z: -13, speed: 2 },
      { x: 0, z: -15, speed: 3 }, { x: 0, z: -20.5, speed: 3 }, { x: 0, z: -26.5, speed: 3 }, { x: 0, z: -30, speed: 2 }, { x: 0, z: -35, speed: 2 },
      { x: 0, z: -39, speed: 1.5, r: 0.6 }, { x: -2, z: -39, speed: 1.5, r: 0.6 }, { x: -2, z: -45, speed: 1.5, r: 0.6 }, { x: 0, z: -45, speed: 1.5, r: 0.6 },
      { x: 0, z: -49, speed: 2 }, { x: 4, z: -50, speed: 2, r: 0.6 }, { x: 11.5, z: -50, speed: 1.5, r: 0.5 }, { x: 4, z: -50, speed: 2, r: 0.6 },
      { x: 0, z: -51, speed: 1.5, r: 0.6 }, { x: 0, z: -61, speed: 3 }, { x: 0, z: -65, speed: 3 }, { x: 0, z: -71.5, speed: 2, r: 0.5 },
      { x: 0, z: -77, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -79, speed: 2, r: 0.6 }, { x: -4.3, z: -81, speed: 2, r: 0.6 },
      { x: -4.3, z: -88.6, speed: 2, r: 0.5 }, { x: -1, z: -89.4, speed: 1.5, r: 0.5 }, { x: 0, z: -91, speed: 2 }, { x: 0, z: -99, speed: 3 }, { x: 0, z: -103 }
    ],
    // langer Knete-Umweg zum Bonusstern
    [
      { x: 0, z: -4, speed: 3 }, { x: 0.9, z: -7, speed: 2 }, { x: 0.9, z: -9, speed: 2 }, { x: -0.9, z: -11, speed: 2 }, { x: -0.9, z: -13, speed: 2 },
      { x: 0, z: -15, speed: 3 }, { x: 0, z: -20.5, speed: 3 }, { x: 0, z: -26.5, speed: 3 }, { x: 0, z: -30, speed: 2 }, { x: 0, z: -35, speed: 2 },
      { x: 0, z: -39, speed: 1.5, r: 0.6 }, { x: -2, z: -39, speed: 1.5, r: 0.6 }, { x: -2, z: -45, speed: 1.5, r: 0.6 }, { x: 0, z: -45, speed: 1.5, r: 0.6 },
      { x: 0, z: -49, speed: 2 }, { x: -12, z: -50, speed: 3 }, { x: -12, z: -64, speed: 3 }, { x: -3, z: -65, speed: 3 }
    ]
  ],
  sz4s: [
    // Hauptweg: Abfahrt bremsen, Spirale hinunter, an den Klötzen vorbei, Trichter, Hammer abwarten, Plattform, Looping
    [
      { x: 0, z: -2, speed: 3 }, { x: 0, z: -10, speed: 3 }, { x: 0, z: -15, speed: 3 }, { x: 0, z: -19, speed: 2 }, { x: -3.5, z: -21, speed: 2 },
      { follow: true, bisY: 3.6, speed: 3 }, { x: -3.5, z: -26, speed: 3 }, { x: -2.8, z: -30, speed: 3 }, { x: -4.2, z: -38, speed: 3 },
      { x: -3.5, z: -47, speed: 3 }, { x: 1, z: -52, speed: 3 }, { x: 2, z: -58, speed: 2 }, { x: 2, z: -64, speed: 2 }, { x: 2, z: -66.5, speed: 2, r: 0.5 },
      { x: 2, z: -72, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 2, z: -78.5, speed: 1.5, r: 0.6 },
      { x: 2, z: -81, speed: 2, wait: ['phase', ['plattform', 0, 0, 0.05]] }, { x: 2, z: -90, speed: 2, wait: ['platAtTo', 0] }, { x: 2, z: -92, speed: 2 },
      { x: 3.46, z: -96.54, speed: 2.5 }, { x: 7, z: -98, speed: 3 }, { x: 10, z: -98, speed: 5 }, { x: 11.5, z: -98, speed: 8 },
      { x: 16, z: -93, free: true, r: 2.5 }, { x: 23, z: -93, speed: 7 }, { x: 26, z: -93 }
    ],
    // Abkürzung durch den ersten Looping zum Bonusstern
    [
      { x: 0, z: -2, speed: 3 }, { x: 0, z: -10, speed: 3 }, { x: 0, z: -15, speed: 3 }, { x: 0, z: -19, speed: 2 }, { x: 3, z: -22, speed: 3 },
      { x: 3, z: -24, speed: 5 }, { x: 3, z: -25.5, speed: 8 }, { x: 8, z: -30, free: true, r: 2.5 }, { x: 8, z: -35, speed: 2 }
    ]
  ]
};
