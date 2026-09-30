// Autopilot-Routen für src/levels/pruefstand/kraefte.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  'p-wind': [{ x: 0, z: -4 }, { x: 0, z: -7, speed: 3 }, { x: 0, z: -22, speed: 3 }, { x: 0, z: -27 }],
  'p-aufwind': [{ x: 0, z: -4 }, { x: 0, z: -8, speed: 2 }, { x: 0, z: -13, wait: ['hoehe', 7] }, { x: 0, z: -20 }],
  'p-magnet': [{ x: 0, z: -6 }, { x: 0, z: -28, speed: 2.5 }, { x: 0, z: -31 }],
  'p-magnet-ab': [
    { x: 0, z: -5, speed: 2 }, { x: 0.9, z: -10, speed: 1.5, r: 0.5 }, { x: 0, z: -12.5, speed: 1.5, r: 0.5 }, { x: -0.9, z: -15, speed: 1.5, r: 0.5 },
    { x: 0, z: -17.5, speed: 2 }, { x: 0, z: -21, speed: 2 }
  ],
  'p-sprenger': [
    { x: 0, z: -4, speed: 2 }, { x: 0, z: -7, speed: 1.5, r: 0.6 }, { x: 0, z: -15.5, speed: 5, r: 0.8, wait: ['balkenWeg', [0, -12]] },
    { x: 0, z: -23, speed: 5, wait: ['balkenWeg', [0, -19]] }, { x: 0, z: -27 }
  ],
  'p-herdplatte': [{ x: 0, z: -4 }, { x: 0, z: -21, speed: 2 }],
  'p-fluss': [{ x: 0, z: -5, speed: 3 }, { x: 0, z: -15, speed: 4 }, { x: 0, z: -26, speed: 3 }, { x: 0, z: -29, speed: 3 }],
  'p-feld': [
    { x: 0, z: -5.5, speed: 2 }, { x: -2, z: -7, speed: 1.5, r: 0.6 }, { x: -2, z: -13, speed: 2, r: 0.6 }, { x: 2, z: -13, speed: 1.5, r: 0.6 },
    { x: 2, z: -17, speed: 2, r: 0.6 }, { x: -2, z: -17, speed: 1.5, r: 0.6 }, { x: -2, z: -21, speed: 2, r: 0.6 }, { x: 0, z: -24, speed: 2 },
    { x: 0, z: -25, speed: 3 }
  ],
  'p-nagelbrett': [{ x: 0, z: -2, speed: 3 }, { x: 0, z: -7, speed: 2, r: 0.8 }, { x: 0, z: -16, speed: 3 }]
};
