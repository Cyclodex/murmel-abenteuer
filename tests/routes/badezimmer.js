// Autopilot-Routen der Welt Badezimmer (normale und schwere Level).
export default {
  b1: [
    // Hauptweg: Looping, Lift, Matsch, zwischen den Steinen durch, Band, Schanze ins Lavabo, Schiffchen, Toilette
    [
      { x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 3 },
      { x: 5, z: -18, speed: 2, wait: 'platAtFrom' }, { x: 5, z: -20.5, speed: 1.5, r: 0.5 }, { x: 5, z: -28, speed: 1.5, r: 0.5, wait: 'platAtTo' },
      { x: 5, z: -32, speed: 2 }, { x: 5, z: -40, speed: 3 }, { x: 5, z: -41.5, speed: 1.5, r: 0.6 },
      { x: 5, z: -46.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 0, 0.75, 0.9]] }, { x: 5, z: -51.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 1, 0.75, 0.9]] },
      { x: 5, z: -55, speed: 3 }, { x: 5, z: -66, speed: 9 }, { x: 5, z: -76, free: true, r: 2 }, { x: 5, z: -79, speed: 1, r: 0.8 },
      { x: 5, z: -100.5, speed: 2 }, { x: 5, z: -108.5, speed: 2 }, { x: 5, z: -115.5, speed: 2 }, { x: 5, z: -126 }
    ],
    // Umweg durch den Matsch in die Nische zum Bonusstern
    [{ x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 3 },
      { x: 5, z: -18, speed: 2, wait: 'platAtFrom' }, { x: 5, z: -20.5, speed: 1.5, r: 0.5 }, { x: 5, z: -28, speed: 1.5, r: 0.5, wait: 'platAtTo' },
      { x: 5, z: -32, speed: 2 }, { x: 4, z: -37.25, speed: 2 }, { x: -0.5, z: -37.25, speed: 2, r: 0.5 }]
  ]
};
