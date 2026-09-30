// Autopilot-Routen für src/levels/pruefstand/bahn.js (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  'p-rampe': [{ x: 0, z: -4, speed: 5 }, { x: 0, z: -16, speed: 4 }, { x: 0, z: -24, speed: 4 }, { x: 0, z: -30, speed: 3 }],
  'p-kurve': [{ x: 0, z: -4 }, { x: 1.46, z: -9.54 }, { x: 5, z: -11 }, { x: 12, z: -11 }, { x: 15.54, z: -12.46 }, { x: 17, z: -16 }, { x: 17, z: -22, speed: 3 }],
  'p-looping': [{ x: 0, z: -4 }, { x: 0, z: -7, speed: 4 }, { x: 0, z: -9.5, speed: 8 }, { x: 5, z: -13, free: true, r: 2.5 }, { x: 5, z: -17, speed: 3 }],
  'p-spirale': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -5.5, speed: 2 }, { follow: true, bisY: -3.3, speed: 3 }, { x: 0, z: -10, speed: 4 }, { x: 0, z: -12, speed: 3 }],
  'p-trampolin': [{ x: 0, z: -4 }, { x: 0, z: -7, speed: 3 }, { x: 0, z: -16, speed: 4, r: 1.5 }, { x: 0, z: -17.2, speed: 2, r: 0.5, wait: 'amBoden' }, { x: 0, z: -21, speed: 2 }],
  'p-rinne': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -20, free: true, r: 2 }, { x: 0, z: -25, speed: 3 }],
  'p-rinnenkurve': [{ x: 0, z: -4, speed: 2.5 }, { x: 0, z: -6, speed: 2.5, r: 0.8 }, { x: 0, z: -16, free: true, r: 1 }, { x: -6, z: -22, free: true, r: 1.5 }, { x: -13, z: -22 }],
  'p-trichter': [
    { x: 0, z: -4 }, { x: 0, z: -9, speed: 5 }, { x: 3, z: -15.2, speed: 6, r: 1.5 }, { x: 10.5, z: -15.2, free: true, r: 0.6 },
    { x: 10.5, z: -15.2, speed: 1, wait: ['tiefer', -7] }, { x: 10.5, z: -18, speed: 2 }, { x: 10.5, z: -23, speed: 3 }
  ],
  'p-roehre': [{ x: 0, z: -4 }, { x: 0, z: -8, speed: 3 }, { x: 0, z: -29 }],
  'p-band': [{ x: 0, z: -4 }, { x: 0, z: -8, speed: 4 }, { x: 0, z: -18, speed: 4 }, { x: 0, z: -23, speed: 3 }],
  'p-treppe': [{ x: 0, z: -4, speed: 2 }, { x: 0, z: -19, speed: 2.5 }, { x: 0, z: -25, speed: 2 }],
  'p-oberflaechen': [{ x: 0, z: -4, speed: 3 }, { x: 0, z: -16, speed: 3 }, { x: 0, z: -28, speed: 3 }, { x: 0, z: -31, speed: 2 }]
};
