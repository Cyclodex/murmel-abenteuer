// Autopilot-Routen für src/levels/pruefstand/bahn.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  'p-rampe': [{ x: 0, z: -4, speed: 5 }, { x: 0, z: -16, speed: 4 }, { x: 0, z: -24, speed: 4 }, { x: 0, z: -30, speed: 3 }],
  'p-kurve': [{ x: 0, z: -4 }, { x: 1.46, z: -9.54 }, { x: 5, z: -11 }, { x: 12, z: -11 }, { x: 15.54, z: -12.46 }, { x: 17, z: -16 }, { x: 17, z: -22, speed: 3 }],
  'p-looping': [{ x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 3 }]
};
