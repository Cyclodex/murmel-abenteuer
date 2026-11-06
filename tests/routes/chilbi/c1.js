// Autopilot-Routen für src/levels/chilbi1.js (siehe tests/autopilot.js).
const X = 6, KZ = -66, RING = 5.5; // Mittellinie der Theke, Karussell: Mitte (z) und Radius der Fahrlinie zwischen den Rössli
const ring = phi => ({ x: X + RING * Math.sin(phi * Math.PI / 180), z: KZ + RING * Math.cos(phi * Math.PI / 180) });
// Zuckerwatte dreimal im S (der Steg hat keinen Rand), Theke: rechts an den Dosen vorbei, ersten Wurfball abwarten, links
// an den Dosen vorbei, zweiten Wurfball abwarten; aufs Karussell, wenn ein grosses Rössli vorbei ist, und im Ring hinter
// ihm her bis zur Lücke rechts
const anfang = [
  { x: 0, z: -2, speed: 3 }, { x: 0, z: -5.5, speed: 3, r: 0.6 }, { x: 0.65, z: -8.3, speed: 3, r: 0.5 },
  { x: 3, z: -9, speed: 3, r: 0.6 }, { x: 5.1, z: -9.9, speed: 3, r: 0.6 }, { x: 6.25, z: -12.5, speed: 3, r: 0.5 },
  { x: 6.2, z: -15, speed: 3, r: 0.6 }, { x: 5.1, z: -17.1, speed: 3, r: 0.6 }, { x: 3, z: -18, speed: 3, r: 0.6 },
  { x: 0.9, z: -18.9, speed: 3, r: 0.6 }, { x: 0, z: -21.5, speed: 3, r: 0.6 }, { x: 0.9, z: -24.1, speed: 3, r: 0.6 },
  { x: 3, z: -25, speed: 3, r: 0.6 }, { x: 5.1, z: -25.9, speed: 3, r: 0.6 }, { x: X, z: -28.5, speed: 3, r: 0.6 },
  { x: X, z: -31, speed: 3 },
  { x: X + 0.9, z: -34, speed: 2.5, r: 0.5 }, { x: X + 0.9, z: -38, speed: 2, r: 0.5 },
  { x: X + 0.9, z: -41.4, speed: 4, r: 0.5, wait: ['phase', ['felsen', 0, 0.15, 0.3]] },
  { x: X - 0.9, z: -41.8, speed: 2, r: 0.5 }, { x: X - 0.9, z: -45, speed: 2, r: 0.5 },
  { x: X + 0.9, z: -48, speed: 4, r: 0.6, wait: ['phase', ['felsen', 1, 0.15, 0.3]] },
  { x: X + 0.9, z: -51.3, speed: 2, r: 0.5 },
  { x: X + 0.9, z: -55, speed: 4, r: 0.6, wait: ['phase', ['felsen', 2, 0.15, 0.3]] },
  { x: X, z: -56.5, speed: 3 }, { x: X, z: -58.6, speed: 2, r: 0.5 },
  { ...ring(0), speed: 2.1, r: 0.6, wait: ['balkenWeg', [X, KZ + 5.7]] },
  { ...ring(30), speed: 2.1, r: 0.8 }, { ...ring(60), speed: 2.1, r: 0.8 }, { ...ring(90), speed: 2.1, r: 0.8 }
];
// weiter im Ring bis zur Lücke links, hinaus, die Rampe hinunter, um die Ecke ins Ziel
const schluss = [
  { ...ring(120), speed: 2.1, r: 0.8 }, { ...ring(150), speed: 2.1, r: 0.8 }, { ...ring(180), speed: 2.1, r: 0.8 },
  { ...ring(200), speed: 2.1, r: 0.6 }, { ...ring(230), speed: 2.1, r: 0.8 }, { ...ring(255), speed: 2.1, r: 0.8 },
  { x: X - 6, z: KZ, speed: 2, r: 0.6 }, { x: X - 9.5, z: KZ, speed: 2.5, r: 0.6 }, { x: X - 14.25, z: KZ - 0.3, speed: 2.5, r: 0.6 },
  { x: X - 18, z: KZ, speed: 2.5, r: 0.6 }, { x: X - 20.1, z: KZ - 0.9, speed: 2, r: 0.5 }, { x: X - 21, z: KZ - 3, speed: 2, r: 0.5 },
  { x: X - 21, z: -75, speed: 3 }
];

export default {
  c1: [
    // Hauptweg
    [...anfang, ...schluss],
    // Bonusstern: rechts durch die Lücke aufs Brett, warten, bis das nächste Rössli vorbei ist, wieder hinein
    [...anfang, { x: X + 7.5, z: KZ, speed: 2, r: 0.5 }, { x: X + 8.6, z: KZ, speed: 1.5, r: 0.4 },
      { x: X + 5.5, z: KZ, speed: 3, r: 0.6, wait: ['balkenWeg', [X + 6, KZ]] }, ...schluss]
  ]
};
