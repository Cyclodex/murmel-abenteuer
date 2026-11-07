// Autopilot-Routen für src/levels/pruefstand/werkstatt.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  // warten, bis der Schraubstock gerade aufgeht (Takt: offen bis 0.34, zu ab 0.5, wieder auf ab 0.84)
  'p-schraubstock': [{ x: 0, z: -3, speed: 2 }, { x: 0, z: -7.3, speed: 1.5, r: 0.6 }, { x: 0, z: -13, speed: 4, wait: ['phase', ['schraubstock', 0, 0.94, 0.03]] }, { x: 0, z: -19, speed: 3 }],
  'p-messband': [{ x: 0, z: -3, speed: 3 }, { x: 2.5, z: -8, speed: 2, r: 0.6 }, { x: -2.3, z: -10.5, speed: 2 }, { x: -2.3, z: -21, speed: 3, wait: 'bridgeUp' }, { x: -2.3, z: -27 }],
  'p-saegemehl': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -14, speed: 3 }, { x: 0, z: -19, speed: 2 }]
};
