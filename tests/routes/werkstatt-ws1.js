// Autopilot-Routen für ws1 «Werkbank» (Wegpunkte, siehe tests/autopilot.js).
// Kante: im Zickzack durch die Lücken neben dem Werkzeug, neben dem Rollmeter halten, bis der Kompressor lange genug still
// bleibt. Schubladen: vor jeder halten, losfahren, wenn sie lange genug drinnen bleibt (Taktlisten, darum 'frei'), in der
// Lücke dahinter wieder halten. Bohrer: losfahren, wenn einer gerade über den Weg gestrichen ist. Schalter am Steg drücken,
// zurück, aufs Band warten, über das Messband ins Ziel.
const LZ = [-31, -36, -41, -46]; // z der Schubladen wie im Level
const zurueck = n => ['frei', 'schieber', n, 2.0, [-0.2, LZ[n], 2.3]];
const XB = -1.5;

const bisSchalter = [
  { x: 0, z: -3, speed: 2.5 }, { x: -0.53, z: -7, speed: 2, r: 0.5 }, { x: 0.65, z: -11, speed: 2, r: 0.5 },
  { x: -0.68, z: -15, speed: 2, r: 0.5 }, { x: 0.53, z: -19, speed: 3, r: 0.5, wait: ['frei', 'knall', 0, 1.8] }, { x: -0.63, z: -22, speed: 2, r: 0.5 },
  { x: 0, z: -25, speed: 2.5 }, { x: -0.2, z: -29, speed: 1.5, r: 0.5 },
  { x: -0.2, z: -33.5, speed: 3, r: 0.5, wait: zurueck(0) }, { x: -0.2, z: -38.5, speed: 3, r: 0.5, wait: zurueck(1) },
  { x: -0.2, z: -43.5, speed: 3, r: 0.5, wait: zurueck(2) }, { x: 0, z: -50.5, speed: 3, wait: zurueck(3) },
  { x: 0, z: -52, speed: 2 }, { x: 0, z: -55.3, speed: 1.5, r: 0.5 },
  { x: 0, z: -63, speed: 3.5, r: 0.5, wait: ['balkenWeg', [0, -59]] }, { x: 0, z: -72, speed: 4, wait: ['balkenWeg', [0, -67]] },
  { x: 0, z: -75, speed: 2.5 }, { x: 0, z: -79.5, speed: 2.5 },
  { x: 1, z: -81, speed: 2 }, { x: 2.5, z: -82, speed: 1.5, r: 0.5 }, { x: 6.4, z: -82, speed: 1.5, r: 0.5 }
];

export default [
  // Hauptweg
  [
    ...bisSchalter, { x: 1, z: -82, speed: 1.5, r: 0.6 }, { x: 1, z: -85.8, speed: 1.5, r: 0.5 }, { x: XB, z: -86, speed: 1.5, r: 0.5 },
    { x: XB, z: -94, speed: 2.5, wait: 'bridgeUp' }, { x: XB, z: -101.5, speed: 2.5 }, { x: XB, z: -104 }
  ],
  // am Schalter vorbei bis ans Ende des Stegs zum Bonusstern
  [...bisSchalter, { x: 9, z: -82, speed: 1.2, r: 0.5 }]
];
