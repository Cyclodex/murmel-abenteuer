// Autopilot-Routen für src/levels/pruefstand/schweiz.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  'p-zahnrad': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -7.6, speed: 2, r: 0.6 }, { x: 0, z: -15, speed: 3, wait: ['nahe', [0, -12.5, 1.2]] }, { x: 0, z: -21 }],
  'p-pendel': [{ x: 0, z: -6, speed: 3 }, { x: 0, z: -11.5, speed: 2, r: 0.6 }, { x: 0, z: -17.5, speed: 5, wait: ['phase', ['pendel', 0, 0.02, 0.1]] }, { x: 0, z: -23 }]
};
