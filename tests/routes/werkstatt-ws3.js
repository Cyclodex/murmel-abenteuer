// Autopilot-Routen für ws3 «Schraubstock» (Wegpunkte, siehe tests/autopilot.js).
// Schraubstock-Gasse: vor jedem Schraubstock 2.7 m vor der Mitte halten und losfahren, wenn er gerade aufgeht
// (0.7 s vor ganz offen; jeder hat einen anderen Takt). Magnetleiste: am Rand gegen den Zug halten, vor dem Hammer warten.
const STOCK = [[1.2, 2.5], [1.0, 1.8], [0.7, 1.5]]; // [time, pause] wie im Level
const auf = n => { const [time, pause] = STOCK[n], per = 2 * (time + pause); return ['phase', ['schraubstock', n, 1 - 0.7 / per, 0.1 / per]]; };
const ZW = -41;

const anfang = [
  { x: 0, z: -3, speed: 3 }, { x: 0.8, z: -8, speed: 2.5, r: 0.8 }, { x: 0, z: -10.8, speed: 1.5, r: 0.5 },
  { x: 0, z: -15.5, speed: 4, wait: auf(0) }, { x: 0, z: -17.8, speed: 1.5, r: 0.5 },
  { x: 0, z: -22.5, speed: 4, wait: auf(1) }, { x: 0.4, z: -24.8, speed: 1.5, r: 0.5 },
  { x: 0, z: -30, speed: 4, wait: auf(2) }, { x: 0, z: -34, speed: 2.5 }
];

export default [
  // Hauptweg: Kurve ohne Rand, Wasserwaage, Magnetleiste, Holzhammer, Kurve und Brett hinunter
  [
    ...anfang, { x: 0, z: -36.5, speed: 2 }, { x: 1.17, z: -39.83, speed: 2, r: 0.6 }, { x: 4, z: ZW, speed: 2 },
    { x: 13, z: ZW, speed: 2.5 }, { x: 17, z: ZW, speed: 2.5 }, { x: 25, z: ZW - 0.3, speed: 2, r: 0.6 },
    { x: 34, z: ZW, speed: 2, r: 0.5 }, { x: 40.5, z: ZW, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
    { x: 43, z: ZW, speed: 3 }, { x: 46, z: ZW, speed: 2 }, { x: 49.12, z: ZW - 0.88, speed: 2, r: 0.5 }, { x: 50, z: ZW - 3, speed: 2 },
    { x: 50, z: ZW - 10, speed: 2.5 }, { x: 50, z: ZW - 21, speed: 3 }
  ],
  // vom Podest nach der Gasse links über den ganz schmalen Steg zum Bonusstern
  [...anfang, { x: 0, z: -35, speed: 1.5, r: 0.5 }, { x: -7.5, z: -35, speed: 1.5, r: 0.5 }]
];
