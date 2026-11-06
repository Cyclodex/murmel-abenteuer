// Autopilot-Routen für ws3 «Schraubstock» (Wegpunkte, siehe tests/autopilot.js).
// Schraubstock: 2.7 m vor der Mitte warten, bis er gerade aufgeht (Takt: offen bis 0.34, zu ab 0.5, wieder auf ab 0.84).
const auf = n => ['phase', ['schraubstock', n, 0.94, 0.03]];
// Start, Klötzchen, erster Schraubstock
const anfang = [
  { x: 0, z: -8, speed: 4 }, { x: 0, z: -16.5 }, { x: 0, z: -19.5, speed: 2 }, { x: 0, z: -21.3, speed: 1.5, r: 0.6 }
];

export default [
  // Hauptweg
  [
    ...anfang, { x: 0, z: -27, speed: 4, wait: auf(0) },
    // Brett hinunter, Sägemehl, Kurve nach rechts
    { x: 0, z: -30, speed: 3 }, { x: 0, z: -38.5, speed: 3 }, { x: 0, z: -44.5, speed: 3 }, { x: 1.46, z: -48.54, speed: 3 }, { x: 5, z: -50, speed: 3 },
    // Hammer: 3 m davor warten, bis er gerade hochgeht
    { x: 8, z: -50, speed: 3 }, { x: 11, z: -50, speed: 2, r: 0.5 }, { x: 16.5, z: -50, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
    // zweiter Schraubstock
    { x: 20, z: -50, speed: 2.5 }, { x: 23.3, z: -50, speed: 1.5, r: 0.6 }, { x: 28.6, z: -50, speed: 4, wait: auf(1) },
    // Schalter rechts, links neben dem Rollmeter aufs Band, über die Lücke ins Ziel
    // (bei jedem Checkpoint liegt ein Wegpunkt ohne wait am nächsten: dort macht der Autopilot nach einem Absturz weiter)
    { x: 30.5, z: -49.5, speed: 3 }, { x: 34, z: -47.5, speed: 2, r: 0.6 }, { x: 36.5, z: -52.3, speed: 2 },
    { x: 47, z: -52.3, speed: 3, wait: 'bridgeUp' }, { x: 49.5, z: -52.3, speed: 3 }, { x: 53, z: -52.3 }
  ],
  // nach dem ersten Schraubstock links in die Nische zum Bonusstern
  [...anfang, { x: 0, z: -27.5, speed: 3, wait: auf(0) }, { x: -1.5, z: -28.5, speed: 2 }, { x: -5, z: -28.5, speed: 1.5, r: 0.5 }]
];
