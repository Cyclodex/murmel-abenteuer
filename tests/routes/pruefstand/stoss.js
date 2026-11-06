// Autopilot-Routen für src/levels/pruefstand/stoss.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  // an den Pilzen vorbei, am Topf rechts absichtlich anstossen (kick 5 nach links), dann ins Ziel
  'p-bumper': [{ x: 0, z: -4, speed: 3 }, { x: 0.8, z: -9, speed: 3 }, { x: -0.2, z: -14, speed: 3 }, { x: 0.8, z: -19, speed: 3 }, { x: 2.2, z: -22.5, speed: 2.5, r: 1 }, { x: 0, z: -27, speed: 3 }, { x: 0, z: -31, speed: 2 }]
};
