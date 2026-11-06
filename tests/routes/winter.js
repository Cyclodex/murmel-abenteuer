// Autopilot-Routen der Welt Winter.

// Schlittelhang: Eisbahnen im Zickzack über die Schnee-Inseln (Ende einer Bahn, Anfang der nächsten), dann auf die Schneebrücke
const steilhang = [
  { x: 0, z: -1.5, speed: 2 }, { x: 3.5, z: -9.3, speed: 2, r: 0.5 }, { x: 3.5, z: -12.3, speed: 1.5, r: 0.5 },
  { x: -3.5, z: -19.3, speed: 2, r: 0.5 }, { x: -4.3, z: -21.8, speed: 1.2, r: 0.5 }, { x: -3.5, z: -22.3, speed: 1.2, r: 0.5 },
  { x: 3.5, z: -29.3, speed: 2, r: 0.5 }, { x: 3.5, z: -32.3, speed: 1.5, r: 0.5 }, { x: -3.5, z: -39.3, speed: 2, r: 0.5 },
  { x: -3.5, z: -42.3, speed: 1.5, r: 0.5 }, { x: 0, z: -49.3, speed: 2, r: 0.5 }, { x: 0, z: -53, speed: 2 }
];
const spalte = [{ x: 0, z: -55.3, speed: 1.5, r: 0.5 }, { x: 0, z: -60.5, speed: 3, r: 0.5, wait: ['phase', ['felsen', 0, 0.8, 0.85]] }];

// Eisweiher: Bobbahn folgen bis auf den Schnee vor dem Weiher
const bob = [{ x: 0, z: -3, speed: 3 }, { follow: true, bisY: 0.8, speed: 5 }, { x: 0, z: -37, speed: 3 }, { x: 0, z: -41, speed: 1.5 }];
// Eisrisse: Mitte des Eisstreifens, Reihe für Reihe (Kachel 2.4)
const eisrisse = [
  { x: -1.2, z: -43.6, speed: 1.5, r: 0.6 }, { x: -3.6, z: -46, speed: 1.5, r: 0.6 }, { x: -2.4, z: -48.4, speed: 1.2, r: 0.6 },
  { x: -6, z: -49.8, speed: 1.2, r: 0.7 }, { x: -3.6, z: -53.2, speed: 1.5, r: 0.6 }, { x: -1.2, z: -55.6, speed: 1.5, r: 0.6 },
  { x: 1.2, z: -58, speed: 1.5, r: 0.6 }, { x: 3.6, z: -60.4, speed: 1.5, r: 0.6 }, { x: 3.6, z: -62.8, speed: 1.2, r: 0.6 },
  { x: 1.2, z: -65.2, speed: 1.5, r: 0.6 }, { x: -1.2, z: -67.6, speed: 1.5, r: 0.6 }
];

export default {
  // Schlittelhang: auf den Schnee-Inseln bremsen und wenden, auf der Schneebrücke vor jeder Lawinenbahn warten, bis ihr Schneeball
  // vorbei ist, am Hang unten und auf dem Absatz links warten, bis der Schneeball vorbei ist
  wi1: [
    [
      ...steilhang, ...spalte,
      { x: 0, z: -65, speed: 3, r: 0.5, wait: ['phase', ['felsen', 1, 0.8, 0.85]] }, { x: 0, z: -69, speed: 3, r: 0.6, wait: ['phase', ['felsen', 2, 0.8, 0.85]] }, { x: 0, z: -72, speed: 2 }, { x: 0, z: -77, speed: 2, r: 0.6 },
      { x: 2.4, z: -79.5, speed: 3, r: 0.7, wait: ['phase', ['felsen', 3, 0.96, 0.99]] }, { x: 2.4, z: -89.5, speed: 4, r: 0.7 },
      { x: 0, z: -91, speed: 2, r: 0.6 },
      { x: 2.4, z: -93, speed: 3, r: 0.7, wait: ['phase', ['felsen', 3, 0.72, 0.78]] }, { x: 2.4, z: -101.5, speed: 4, r: 0.7 },
      { x: -1, z: -103.5, speed: 2, r: 0.7 }, { x: -4.4, z: -103.6, speed: 2, r: 0.5 }, { x: -2.4, z: -107.5, speed: 2 }
    ],
    // Bonusstern am Lawinenhang rechts: hinter dem zweiten Schneeball hinauf und gleich zurück
    [...steilhang, ...spalte, { x: 0, z: -62.9, speed: 2, r: 0.4, wait: ['phase', ['felsen', 1, 0.82, 0.87]] }, { x: 2.4, z: -63, speed: 2.5, r: 0.7 }, { x: 0, z: -62.6, speed: 2, r: 0.4 }]
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
  // Skischanze: zwischen den Schneebällen durch, über den Grat, Schanze (im Flug nicht lenken),
  // im Auslauf der Abstecher zum Bonusstern vor dem Iglu
  wi3: [
    { x: 0, z: -4 }, { x: 0, z: -9.5, speed: 1.5, r: 0.6 },
    { x: 0, z: -14.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 0, 0.75, 0.9]] }, { x: 0, z: -19.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 1, 0.75, 0.9]] },
    { x: 0, z: -24.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 2, 0.75, 0.9]] }, { x: 0, z: -28, speed: 3 },
    { x: 0, z: -34, speed: 3 }, { x: 0, z: -38, speed: 3 }, { x: 0, z: -44, speed: 3 }, { x: 0, z: -48, speed: 3 },
    { x: 0, z: -51, speed: 5 }, { x: 0, z: -62, speed: 12, r: 2 }, { x: 0, z: -72, speed: 12, r: 2 }, { x: 0, z: -79, speed: 12, r: 1.5 },
    { x: 0, z: -92, free: true, r: 5 }, { x: 0, z: -123.5, speed: 6, r: 0.8 },
    { x: 5, z: -127, speed: 3 }, { x: 8.4, z: -127, speed: 2, r: 0.6 }, { x: 4, z: -128, speed: 3 }, { x: 0, z: -133.5, speed: 3 }
  ]
};
