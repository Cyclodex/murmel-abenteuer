// Autopilot-Routen für src/levels/pruefstand/stoss.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  // an den Pilzen vorbei, am Topf rechts absichtlich anstossen (kick 5 nach links), dann ins Ziel
  'p-bumper': [{ x: 0, z: -4, speed: 3 }, { x: 0.8, z: -9, speed: 3 }, { x: -0.2, z: -14, speed: 3 }, { x: 0.8, z: -19, speed: 3 }, { x: 2.2, z: -22.5, speed: 2.5, r: 1 }, { x: 0, z: -27, speed: 3 }, { x: 0, z: -31, speed: 2 }],
  // vor jeder Scheibe warten, bis sie lange genug still bleibt
  'p-knall': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -8.5, speed: 1.5, r: 0.6 }, { x: 0, z: -16, speed: 4, wait: ['frei', ['knall', 0, 2]] }, { x: 0, z: -21.5, speed: 1.5, r: 0.6 }, { x: 0, z: -29, speed: 4, wait: ['frei', ['knall', 1, 2]] }, { x: 0, z: -33, speed: 2 }],
  'p-fallend': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -9, speed: 1.5, r: 0.6 }, { x: 0, z: -15, speed: 4, wait: ['frei', ['fallend', 0, 1.5]] }, { x: 0, z: -18, speed: 2, r: 0.6 }, { x: 0, z: -28, speed: 5, wait: ['frei', ['fallend', 1, 2.2]] }, { x: 0, z: -33, speed: 2 }],
  'p-besen': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -6.5, speed: 1.5, r: 0.6 }, { x: 0, z: -18, speed: 5, wait: ['frei', ['besen', 0, 2.2]] }, { x: 0, z: -27, speed: 3 }],
  'p-rutschplatte': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -8.5, speed: 1.5, r: 0.6 }, { x: 0, z: -14, speed: 4, wait: ['frei', ['rutschplatte', 0, 1.5]] }, { x: 0, z: -20, speed: 4 }, { x: 0, z: -23, speed: 2 }]
};
