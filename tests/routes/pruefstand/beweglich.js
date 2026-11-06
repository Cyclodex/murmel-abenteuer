// Autopilot-Routen für src/levels/pruefstand/beweglich.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  'p-plattform': [{ x: 0, z: -7.3, speed: 2 }, { x: 0, z: -10, speed: 2, wait: 'platAtFrom' }, { x: 0, z: -19, speed: 2, wait: 'platAtTo' }, { x: 0, z: -23, speed: 3 }],
  'p-wippe': [{ x: 0, z: -5 }, { x: 0, z: -10, speed: 3 }, { x: 0, z: -15, speed: 3 }, { x: 0, z: -20 }],
  'p-schalter': [{ x: 1.8, z: -5.5, speed: 2 }, { x: 0, z: -7, speed: 2, wait: 'bridgeUp' }, { x: 0, z: -16 }, { x: 0, z: -22 }],
  'p-balken': [{ x: 0, z: -5 }, { x: 4, z: -8, speed: 2 }, { x: 3.5, z: -12, speed: 4, r: 0.6, wait: ['balkenWeg', [3.8, -9.5]] }, { x: 0, z: -18, speed: 4 }, { x: 0, z: -23 }],
  'p-domino': [{ x: 0, z: -8, speed: 4 }, { x: 0, z: -19 }],
  'p-falltuer': [{ x: 0, z: -6, speed: 2, r: 0.6 }, { x: 0, z: -15, speed: 6, r: 1 }, { x: 0, z: -18, speed: 2 }],
  'p-schieber': [{ x: 0, z: -3, speed: 2 }, { x: 0, z: -8, speed: 1.5, r: 0.6 }, { x: 0, z: -15, speed: 4, wait: ['phase', ['schieber', 0, 0.8, 0.95]] }, { x: 0, z: -19, speed: 3 }],
  'p-hammer': [{ x: 0, z: -4, speed: 2 }, { x: 0, z: -7.5, speed: 2, r: 0.5 }, { x: 0, z: -13, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -19 }],
  'p-felsen': [{ x: 0, z: -2, speed: 2 }, { x: 0, z: -6, speed: 1.5, r: 0.6 }, { x: 0, z: -14.5, speed: 4, r: 0.8, wait: ['phase', ['felsen', 0, 0.82, 0.9]] }, { x: 0, z: -21 }],
  'p-kanone': [{ x: 0, z: -3, speed: 3 }, { x: 0, z: -7, speed: 2 }, { x: 0, z: -24, speed: 2 }, { x: 0, z: -34 }],
  // Takte als Listen: warten mit 'frei' (Hammer oben, Auto weg, Felsen vorbei, Böe aus), dem Putschauto hinterherfahren
  'p-takt': [
    { x: 0, z: -4, speed: 2 }, { x: 0, z: -7.5, speed: 2, r: 0.5 }, { x: 0, z: -13, speed: 5, wait: ['frei', 'hammer', 0, 2.3] },
    { x: 0, z: -16, speed: 3 },
    { x: 0, z: -24, speed: 5, r: 1, follow: ['schieber', 0, 4], wait: ['frei', 'schieber', 0, 1, [0, -18.5, 3.3]] },
    { x: 0, z: -30, speed: 3, wait: ['frei', 'schieber', 0, 2.5, [0, -29, 3.2]] }, { x: 0, z: -34, speed: 1.5, r: 0.6 },
    { x: 0, z: -42.5, speed: 4, r: 0.8, wait: ['frei', 'felsen', 0, 0.8, [0, -39]] }, { x: 0, z: -48.5, speed: 2, r: 0.6 },
    { x: 0, z: -58, speed: 5, wait: ['frei', 'wind', 0, 2.4] }, { x: 0, z: -64 }
  ],
  'p-riesenrad': [{ x: 0, z: -5.2, speed: 2, r: 0.6 }, { x: 0, z: -8, speed: 2.5, r: 0.5, wait: ['phase', ['riesenrad', 0, 0, 0.2]] }, { x: 0, z: -12, speed: 2.5, wait: ['gondel', [0, 3]] }, { x: 0, z: -17, speed: 3 }]
};
