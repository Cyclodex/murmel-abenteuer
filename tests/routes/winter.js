// Autopilot-Routen der Welt Winter.

// Schlittelhang: Eisbahnen im Zickzack über die Schnee-Inseln (Ende einer Bahn, Anfang der nächsten), auf der Insel vor einer
// Lawinen-Bahn warten, bis der Lawinenstoss lange genug ruht, dann auf die Schneebrücke
const steilhang = [
  { x: 0, z: -1.5, speed: 2 }, { x: 3.5, z: -9.3, speed: 2, r: 0.5 }, { x: 3.5, z: -12.3, speed: 1.5, r: 0.5 },
  { x: -3.5, z: -19.3, speed: 2, r: 0.5, wait: ['frei', 'knall', 0, 3.5] }, { x: -4.3, z: -21.8, speed: 1.2, r: 0.5 }, { x: -3.5, z: -22.3, speed: 1.2, r: 0.5 },
  { x: 3.5, z: -29.3, speed: 2, r: 0.5 }, { x: 3.5, z: -32.3, speed: 1.5, r: 0.5 }, { x: -3.5, z: -39.3, speed: 2, r: 0.5, wait: ['frei', 'knall', 1, 3.5] },
  { x: -3.5, z: -42.3, speed: 1.5, r: 0.5 }, { x: 0, z: -49.3, speed: 2, r: 0.5 }, { x: 0, z: -53, speed: 2 }
];
// Schneebrücke: vor jeder Lawinenbahn warten, bis die Salve vorbei ist und der nächste Ball noch auf sich warten lässt
const spalte = [{ x: 0, z: -55.3, speed: 1.5, r: 0.5 }, { x: 0, z: -60.5, speed: 3, r: 0.5, wait: ['frei', 'felsen', 0, 1.8, [0, -58]] }];

// Eisweiher: Bobbahn folgen bis auf den Schnee vor dem Weiher
const bob = [{ x: 0, z: -3, speed: 3 }, { follow: true, bisY: 0.8, speed: 5 }, { x: 0, z: -37, speed: 3 }, { x: 0, z: -41, speed: 1.5 }];
// Eisrisse: Mitte des Eisstreifens, Reihe für Reihe (Kachel 2.4)
const eisrisse = [
  { x: -1.2, z: -43.6, speed: 1.5, r: 0.6 }, { x: -3.6, z: -46, speed: 1.5, r: 0.6 }, { x: -2.4, z: -48.4, speed: 1.2, r: 0.6 },
  { x: -6, z: -49.8, speed: 1.2, r: 0.7 }, { x: -3.6, z: -53.2, speed: 1.5, r: 0.6 }, { x: -1.2, z: -55.6, speed: 1.5, r: 0.6 },
  { x: 1.2, z: -58, speed: 1.5, r: 0.6 }, { x: 3.6, z: -60.4, speed: 1.5, r: 0.6 }, { x: 3.6, z: -62.8, speed: 1.2, r: 0.6 },
  { x: 1.2, z: -65.2, speed: 1.5, r: 0.6 }, { x: -1.2, z: -67.6, speed: 1.5, r: 0.6 }
];

// Skischanze: unter der Startschranke durch, wenn sie lange genug offen bleibt
const schranke = [
  { x: 0, z: -1, speed: 2 }, { x: 0, z: -3.5, speed: 1.5, r: 0.5 },
  { x: 0, z: -7, speed: 3, r: 0.8, wait: ['frei', 'schieber', 0, 1.4, [0, -5]] }
];

export default {
  // Schlittelhang: auf den Schnee-Inseln bremsen und wenden (vor den Lawinenstössen warten), auf der Schneebrücke vor jeder
  // Lawinenbahn warten, bis ihre Salve vorbei ist, am Hang unten und auf dem Absatz links warten, bis die Salve vorbei ist
  wi1: [
    [
      ...steilhang, ...spalte,
      { x: 0, z: -65.1, speed: 3, r: 0.4, wait: ['frei', 'felsen', 1, 1.8, [0, -63]] }, { x: 0, z: -70.3, speed: 3, r: 0.6, wait: ['frei', 'felsen', 2, 1.8, [0, -67.5]] }, { x: 0, z: -72, speed: 2 }, { x: 0, z: -77, speed: 2, r: 0.6 },
      { x: 2.4, z: -79.5, speed: 3, r: 0.7, wait: ['frei', 'felsen', 3, 1.5, [2.4, -80]] }, { x: 2.4, z: -89.5, speed: 4, r: 0.7 },
      { x: 0, z: -91, speed: 2, r: 0.6 },
      { x: 2.4, z: -93, speed: 3, r: 0.7, wait: ['frei', 'felsen', 3, 3.5, [2.4, -92]] }, { x: 2.4, z: -101.5, speed: 4, r: 0.7 },
      { x: -1, z: -103.5, speed: 2, r: 0.7 }, { x: -4.4, z: -103.6, speed: 2, r: 0.5 }, { x: -2.4, z: -107.5, speed: 2 }
    ],
    // Bonusstern am Lawinenhang rechts: hinter dem zweiten Schneeball hinauf und gleich zurück
    [...steilhang, ...spalte, { x: 0, z: -62.9, speed: 2, r: 0.4, wait: ['frei', 'felsen', 1, 2.5, [0, -63]] }, { x: 2.4, z: -63, speed: 2.5, r: 0.7 }, { x: 0, z: -62.6, speed: 2, r: 0.4 }]
  ],
  // Eisweiher: Bobbahn mit Tempo 5 (schneller fliegt man in den flachen Kurven hinaus), im Zickzack über den Eisstreifen
  // (Abstecher zum Stern), Schollen gleich am Anfang ihrer Pause betreten und auf der Scholle stillhalten
  wi2: [
    [
      ...bob, ...eisrisse,
      { x: 0, z: -70, speed: 1.5 }, { x: 0, z: -74.4, speed: 1.5, r: 0.5 },
      { x: 0, z: -77, speed: 1.5, r: 0.6, wait: ['phase', ['plattform', 0, 0, 0.04]] }, { x: 0, z: -90.5, speed: 2, wait: 'platAtTo' },
      { x: 0, z: -96.4, speed: 1.2, r: 0.5 },
      { x: 0, z: -99, speed: 1.5, r: 0.6, wait: ['phase', ['plattform', 1, 0, 0.04]] }, { x: 9, z: -99, speed: 1.5, r: 0.6, wait: ['platAtTo', 1] },
      { x: 9, z: -102, speed: 1.5, r: 0.6 }, { x: 9, z: -104, speed: 1.5, r: 0.6 }, { x: 7.54, z: -107.54, speed: 1.5, r: 0.6 },
      { x: 4, z: -109, speed: 1.5, r: 0.6 }, { x: -2, z: -109, speed: 3 }
    ],
    // Abstecher zum Bonusstern auf dem Eiszipfel rechts
    [...bob, ...eisrisse.slice(0, 9), { x: 7.2, z: -62.8, speed: 1.2, r: 0.5 }, { x: 7.2, z: -65.2, speed: 1, r: 0.5 }]
  ],
  // Skischanze: Startschranke passieren, wenn sie lange genug offen bleibt, Anlauf, Tisch genau mittig, im Flug nicht lenken,
  // über den Grat (auf dem Schnee vor der Eisplatte warten, bis keine Eiszapfen fallen), Doppelschranke einzeln abwarten,
  // vor dem Eiskanal die Eiszapfen-Salve abwarten, im Eiskanal Tempo halten. Bonus: links oben am Anlauf
  wi3: [
    [
      ...schranke,
      { x: 1.8, z: -14, speed: 4, r: 0.7 }, { x: 0, z: -22, speed: 5, r: 1.5 }, { x: 0, z: -27, speed: 5, r: 1 },
      { x: 0, z: -30.2, speed: 6, r: 0.8 }, { x: 0, z: -45, free: true, r: 4 }, { x: 0, z: -70, speed: 5, r: 1 },
      { x: 0, z: -77, speed: 3 }, { x: 0, z: -79, speed: 2 }, { x: 1.76, z: -84.24, speed: 2, r: 0.6 },
      { x: 6, z: -86, speed: 2, r: 0.6 }, { x: 11, z: -86, speed: 1.5, r: 0.5 },
      { x: 16, z: -86, speed: 2.5, r: 0.6, wait: ['frei', 'fallend', 0, 2.6] }, { x: 20.24, z: -87.76, speed: 2, r: 0.6 },
      { x: 22, z: -92, speed: 2, r: 0.6 }, { x: 22, z: -95, speed: 2 }, { x: 22, z: -97.2, speed: 1.5, r: 0.5 },
      { x: 22, z: -100, speed: 2.5, r: 0.5, wait: ['frei', 'schieber', 1, 1.2, [22, -98.5]] },
      { x: 22, z: -102.5, speed: 2.5, r: 0.5, wait: ['frei', 'schieber', 2, 1.2, [22, -101.5]] },
      { x: 22, z: -104, speed: 3, r: 0.6, wait: ['frei', 'fallend', 1, 2.5] },
      { follow: true, bisY: -31, speed: 5 },
      { x: 8.2, z: -113.5, speed: 2, r: 0.5 }, { x: 6, z: -116.5, speed: 2 }
    ],
    [...schranke, { x: -2.2, z: -9, speed: 2, r: 0.5 }]
  ]
};
