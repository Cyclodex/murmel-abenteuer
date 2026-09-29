// Autopilot-Routen der schweren Level der Welt unterwasser (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  u1s: [
    // Hauptweg: rechts an der Riesenmuschel vorbei, Irrgarten, Strömung mit Korallen, Querstrom-Brücke, zwei Muscheln
    [
      { x: 0, z: -8, speed: 3 }, { x: 3, z: -13, speed: 3 }, { x: 3, z: -20.5, speed: 2, r: 0.6 },
      { x: 3, z: -28, speed: 4, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 3, z: -33, speed: 3 }, { x: 0, z: -37.5, speed: 3 },
      { x: 0, z: -41, speed: 2 }, { x: 0, z: -43, speed: 1.5, r: 0.6 }, { x: -2, z: -43, speed: 1.5, r: 0.6 }, { x: -2, z: -51, speed: 2, r: 0.6 },
      { x: 2, z: -51, speed: 1.5, r: 0.6 }, { x: 2, z: -57, speed: 2, r: 0.6 }, { x: 0, z: -57, speed: 1.5, r: 0.6 }, { x: 0, z: -61, speed: 2 },
      { x: 0, z: -66, speed: 2 }, { x: 0.9, z: -74, speed: 3 }, { x: -0.9, z: -82, speed: 3 }, { x: 0, z: -89, speed: 3 }, { x: 0, z: -94, speed: 3 },
      { x: 1.46, z: -99.54, speed: 3 }, { x: 5, z: -101, speed: 3 }, { x: 27, z: -101, speed: 3 },
      { x: 34.54, z: -102.46, speed: 3 }, { x: 36, z: -107, speed: 2 }, { x: 36, z: -108.5, speed: 1.5, r: 0.6 },
      { x: 36, z: -115.5, speed: 4, r: 0.8, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
      { x: 36, z: -123, speed: 4, wait: ['phase', ['hammer', 2, 0.72, 0.85]] }, { x: 36, z: -133, speed: 3 }
    ],
    // kurzer Weg über den Korallengrat (Bonusstern), danach wie der Hauptweg
    [
      { x: 0, z: -8, speed: 3 }, { x: -3.2, z: -13, speed: 2 }, { x: -3.2, z: -27, speed: 2, r: 0.8 }, { x: -3.2, z: -33, speed: 2 }, { x: 0, z: -37.5, speed: 3 },
      { x: 0, z: -41, speed: 2 }, { x: 0, z: -43, speed: 1.5, r: 0.6 }, { x: -2, z: -43, speed: 1.5, r: 0.6 }, { x: -2, z: -51, speed: 2, r: 0.6 },
      { x: 2, z: -51, speed: 1.5, r: 0.6 }, { x: 2, z: -57, speed: 2, r: 0.6 }, { x: 0, z: -57, speed: 1.5, r: 0.6 }, { x: 0, z: -61, speed: 2 },
      { x: 0, z: -66, speed: 2 }, { x: 0.9, z: -74, speed: 3 }, { x: -0.9, z: -82, speed: 3 }, { x: 0, z: -89, speed: 3 }, { x: 0, z: -94, speed: 3 },
      { x: 1.46, z: -99.54, speed: 3 }, { x: 5, z: -101, speed: 3 }, { x: 27, z: -101, speed: 3 },
      { x: 34.54, z: -102.46, speed: 3 }, { x: 36, z: -107, speed: 2 }, { x: 36, z: -108.5, speed: 1.5, r: 0.6 },
      { x: 36, z: -115.5, speed: 4, r: 0.8, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
      { x: 36, z: -123, speed: 4, wait: ['phase', ['hammer', 2, 0.72, 0.85]] }, { x: 36, z: -133, speed: 3 }
    ]
  ],
  u2s: [
    // Hauptweg: Blasenlift, Seetang-Rad abwarten, Quallen, Blasenlift, Muschel abwarten, hinter einem Felsen den Abhang hinunter, Spirale
    [
      { x: 0, z: -8, speed: 2 }, { x: 0, z: -10, speed: 1.5 }, { x: 0, z: -15, wait: ['hoehe', 6] },
      { x: 1.2, z: -19.5, speed: 2, r: 0.6 }, { x: 1.2, z: -27, speed: 4, wait: ['balkenWeg', [1.2, -21]] },
      { x: 0, z: -30.5, speed: 2 }, { x: 0, z: -37, free: true, r: 2 }, { x: 0, z: -41.8, speed: 2, r: 0.6 },
      { x: 0, z: -49.5, free: true, r: 2 }, { x: 0, z: -51.3, speed: 2, r: 0.6 }, { x: 0, z: -58.5, free: true, r: 2 },
      { x: 0, z: -60.8, speed: 1.5 }, { x: 0, z: -65, wait: ['hoehe', 16] }, { x: 0, z: -66.5, speed: 2, r: 0.6 },
      { x: 0, z: -74, speed: 4, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -77.5, speed: 2 },
      { x: 0, z: -111, speed: 5, wait: ['phase', ['felsen', 0, 0.1, 0.2]] }, { x: 0.5, z: -115, speed: 3 }, { x: 3, z: -116, speed: 3 },
      { x: 8, z: -116, speed: 3 }, { follow: true, bisY: -4.4, speed: 3 }, { x: 14, z: -116, speed: 3 }, { x: 19, z: -116 }
    ],
    // mit Umweg übers Brett zum Bonus-Blasenlift: hinauf zur Perle, seitlich hinaus, zurück aufs Riff
    [
      { x: 0, z: -8, speed: 2 }, { x: 0, z: -10, speed: 1.5 }, { x: 0, z: -14.5, wait: ['hoehe', 6] },
      { x: -2, z: -14.5, speed: 1.5, r: 0.5 }, { x: -8, z: -14.5, speed: 1.5, r: 0.5 }, { x: -10.5, z: -14.5, speed: 1.2, r: 0.4 },
      { x: -10.5, z: -14.5, r: 0.4, wait: ['hoehe', 11.5] }, { x: -8.8, z: -14.5, speed: 1, r: 0.4 }, { x: -8.8, z: -14.5, r: 0.4, wait: 'amBoden' },
      { x: -2, z: -14.5, speed: 1.5, r: 0.5 },
      { x: 1.2, z: -19.5, speed: 2, r: 0.6 }, { x: 1.2, z: -27, speed: 4, wait: ['balkenWeg', [1.2, -21]] },
      { x: 0, z: -30.5, speed: 2 }, { x: 0, z: -37, free: true, r: 2 }, { x: 0, z: -41.8, speed: 2, r: 0.6 },
      { x: 0, z: -49.5, free: true, r: 2 }, { x: 0, z: -51.3, speed: 2, r: 0.6 }, { x: 0, z: -58.5, free: true, r: 2 },
      { x: 0, z: -60.8, speed: 1.5 }, { x: 0, z: -65, wait: ['hoehe', 16] }, { x: 0, z: -66.5, speed: 2, r: 0.6 },
      { x: 0, z: -74, speed: 4, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -77.5, speed: 2 },
      { x: 0, z: -111, speed: 5, wait: ['phase', ['felsen', 0, 0.1, 0.2]] }, { x: 0.5, z: -115, speed: 3 }, { x: 3, z: -116, speed: 3 },
      { x: 8, z: -116, speed: 3 }, { follow: true, bisY: -4.4, speed: 3 }, { x: 14, z: -116, speed: 3 }, { x: 19, z: -116 }
    ]
  ],
  u3s: [
    // Hauptweg: Strömungsband und Falltüren, Seetang-Räder, Kisten und Muschel abwarten, Dominos, Röhre, Schatzkammer
    [
      { x: 0, z: -3, speed: 3 }, { x: 2, z: -6, speed: 3 }, { x: 2, z: -19, speed: 6 }, { x: 2, z: -34.5, speed: 6, r: 1 },
      { x: 0, z: -37.5, speed: 3 }, { x: 2.4, z: -39, speed: 2, r: 0.6 },
      { x: 2.4, z: -48, speed: 3.5, r: 0.8, wait: ['balkenWeg', [2.4, -44]] }, { x: -2.4, z: -48.5, speed: 2.5, r: 0.6 },
      { x: -2.4, z: -57.5, speed: 3.5, wait: ['balkenWeg', [-2.4, -53]] },
      { x: 0, z: -58.5, speed: 2 }, { x: 0, z: -61.5, speed: 1.5, r: 0.6 },
      { x: 0, z: -67, speed: 3, r: 0.6, wait: ['phase', ['schieber', 0, 0.85, 0.95]] },
      { x: 0, z: -73.5, speed: 3, r: 0.6, wait: ['phase', ['schieber', 1, 0.85, 0.95]] },
      { x: 0, z: -80, speed: 4, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -83, speed: 3 },
      { x: 0, z: -97, speed: 5 }, { x: 0, z: -100, speed: 2 }, { x: 0, z: -114, speed: 2 },
      { x: -1, z: -115, speed: 1.5, r: 0.6 }, { x: -1, z: -121, speed: 1.5, r: 0.6 }, { x: 1, z: -121, speed: 1.5, r: 0.6 },
      { x: 1, z: -127, speed: 1.5, r: 0.6 }, { x: -3, z: -127, speed: 1.5, r: 0.6 }, { x: -3, z: -125, speed: 1, r: 0.6 },
      { x: -3, z: -127, speed: 1, r: 0.6 }, { x: 0, z: -129, speed: 1.5, r: 0.6 }, { x: 0, z: -134 }
    ],
    // links über den Mastbaum und die kaputten Planken (Bonusstern), danach wie der Hauptweg
    [
      { x: 0, z: -3, speed: 3 }, { x: -3, z: -6, speed: 2 }, { x: -3, z: -20, speed: 2 }, { x: -3, z: -23, speed: 1.5, r: 0.6 },
      { x: -5, z: -23, speed: 1.5, r: 0.6 }, { x: -5, z: -27, speed: 1.5, r: 0.6 }, { x: -3, z: -27, speed: 1.5, r: 0.6 },
      { x: -3, z: -31, speed: 1.5, r: 0.6 }, { x: -1, z: -31, speed: 1.5, r: 0.6 }, { x: -1, z: -35.5, speed: 2 },
      { x: 0, z: -37.5, speed: 3 }, { x: 2.4, z: -39, speed: 2, r: 0.6 },
      { x: 2.4, z: -48, speed: 3.5, r: 0.8, wait: ['balkenWeg', [2.4, -44]] }, { x: -2.4, z: -48.5, speed: 2.5, r: 0.6 },
      { x: -2.4, z: -57.5, speed: 3.5, wait: ['balkenWeg', [-2.4, -53]] },
      { x: 0, z: -58.5, speed: 2 }, { x: 0, z: -61.5, speed: 1.5, r: 0.6 },
      { x: 0, z: -67, speed: 3, r: 0.6, wait: ['phase', ['schieber', 0, 0.85, 0.95]] },
      { x: 0, z: -73.5, speed: 3, r: 0.6, wait: ['phase', ['schieber', 1, 0.85, 0.95]] },
      { x: 0, z: -80, speed: 4, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -83, speed: 3 },
      { x: 0, z: -97, speed: 5 }, { x: 0, z: -100, speed: 2 }, { x: 0, z: -114, speed: 2 },
      { x: -1, z: -115, speed: 1.5, r: 0.6 }, { x: -1, z: -121, speed: 1.5, r: 0.6 }, { x: 1, z: -121, speed: 1.5, r: 0.6 },
      { x: 1, z: -127, speed: 1.5, r: 0.6 }, { x: -3, z: -127, speed: 1.5, r: 0.6 }, { x: -3, z: -125, speed: 1, r: 0.6 },
      { x: -3, z: -127, speed: 1, r: 0.6 }, { x: 0, z: -129, speed: 1.5, r: 0.6 }, { x: 0, z: -134 }
    ]
  ]
};
