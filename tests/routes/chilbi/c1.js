// Autopilot-Route für src/levels/chilbi1.js (siehe tests/autopilot.js).
export default {
  // Torbogen, Zuckerwatte mit Abstecher in die Ecke zum Bonusstern, Dosen umkegeln, hinter dem Rössli her übers Karussell, Rutsche, Zelt
  c1: [
    { x: 0, z: -4 }, { x: 0, z: -9, speed: 3 }, { x: -1, z: -10.5, speed: 3 }, { x: -5, z: -10.5, speed: 3, r: 0.5 }, { x: 0, z: -10.5, speed: 3 },
    { x: 0, z: -15, speed: 3 }, { x: 0, z: -22.5 }, { x: 0, z: -27.5, speed: 3 },
    { x: 2.6, z: -33.4, speed: 4, r: 0.6, wait: ['balkenWeg', [1.4, -32.2]] }, { x: 8, z: -36 },
    { x: 13, z: -36, speed: 3 }, { x: 15.5, z: -36, speed: 3 }, { follow: true, bisY: -4.4, speed: 5 },
    { x: 21, z: -46 }, { x: 21, z: -56.5 }
  ]
};
