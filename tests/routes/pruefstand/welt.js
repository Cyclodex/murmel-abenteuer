// Autopilot-Routen für src/levels/pruefstand/welt.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  'p-pfanne': [{ x: 0, z: -5, speed: 2 }, { x: 0, z: -9, speed: 3 }, { x: 0, z: -15, speed: 2 }, { x: 0, z: -23, speed: 3 }, { x: 0, z: -27 }],
  'p-lavabo': [{ x: 0, z: -3, speed: 3 }, { x: 0, z: -8, speed: 9 }, { x: 0, z: -18, free: true, r: 2 }, { x: 0, z: -21, speed: 1, r: 0.3 },
    { x: 0, z: -42.5, speed: 2, wait: 'abfluss' }, { x: 0, z: -45 }],
  'p-schiff': [{ x: 0, z: -4 }, { x: 0, z: -8, speed: 2 }, { x: 0, z: -12, speed: 1.5, r: 0.6 }, { x: 0, z: -28, speed: 2 }, { x: 0, z: -30 }],
  'p-strahl': [{ x: 0, z: -4 }, { x: 0, z: -12, speed: 3 }, { x: 0, z: -19 }],
  'p-klo': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -7, speed: 6 }, { x: 0, z: -14 }]
};
