// Autopilot-Routen für src/levels/schweiz1.js (Käserei), siehe tests/autopilot.js.
const KY = -3, KZ = -38, GANG = KZ - 0.2, FACH = KZ - 2;
// Kacheln des Emmentalers: Spalte c (0 links), Reihe n (0 vorne)
const kachel = (c, n, speed = 2, r = 0.4) => ({ x: 16 + (c - 3) * 1.6, z: -18 - (n + 0.5) * 1.6, speed, r });
// vom Fach bei x0 zum Fach bei x1, sobald der Laib (Felsen n) in der Phase a..b ist (vorbei)
const fach = (x0, x1, n, a, b) => [
  { x: x0, z: GANG, speed: 2.5, r: 0.5, wait: ['phase', ['felsen', n, a, b]] },
  { x: x1 - 1, z: GANG, speed: 3.5, r: 0.6 },
  { x: x1, z: FACH, speed: 1.5, r: 0.4 }
];

// Steg, Kessi, Labyrinth bis zur Gabelung vor der hinteren Sackgasse
const anfang = [
  { x: 0, z: -3, speed: 3 }, { x: 0, z: -9.4, speed: 2, r: 0.4 },
  // Kessi: warten, bis ein Ende der Harfe links naht, dann gleich hinter dem vorderen Ende quer hinüber und rechts hinaus
  { x: 0, z: -9.45, speed: 1, r: 0.6, wait: ['balkenWeg', [3.6, -15]] },
  { x: 1.9, z: -13.2, speed: 3, r: 0.7, wait: ['balkenWeg', [0, -11.4]] },
  { x: 4.6, z: -15, speed: 3, r: 0.6 }, { x: 8, z: -15, speed: 2.5, r: 0.6 }, { x: 13, z: -15, speed: 3, r: 0.8 },
  { x: 15.1, z: -15.9, speed: 2.5, r: 0.8 }, { x: 16, z: -18.6, speed: 2, r: 0.5 },
  // Labyrinth: vorne links in die Sackgasse (Stern) und zurück
  kachel(3, 2), kachel(0, 2, 1.2), kachel(1, 2, 1.2), kachel(1, 4), kachel(5, 4), kachel(5, 6), kachel(3, 6), kachel(3, 8)
];

export default {
  sch1: [
    [
      ...anfang,
      kachel(1, 8), kachel(1, 10), kachel(5, 10), kachel(5, 12), { x: 19.2, z: -41, speed: 2, r: 0.5 },
      // Wendel hinunter in den Keller
      { x: 19.2, z: -42.6, speed: 1.5, r: 0.5 },
      { follow: true, bisY: -2.1, speed: 2.5 },
      { x: 27.2, z: -41.9, speed: 1.5, r: 0.4 },
      // Keller: hinter jedem Laib her ins nächste Fach
      { x: 27.2, z: -40.3, speed: 1, r: 0.4 },
      ...fach(27.2, 32, 0, 0.15, 0.23),
      ...fach(32, 38, 1, 0.3, 0.38),
      ...fach(38, 44, 0, 0.45, 0.53),
      { x: 44, z: GANG, speed: 2.5, r: 0.5, wait: ['phase', ['felsen', 1, 0.6, 0.68]] },
      { x: 48.2, z: GANG, speed: 2.5, r: 0.5 },
      { x: 48.2, z: KZ - 7.5 }
    ],
    // Bonusstern: in die hintere Sackgasse
    [...anfang, kachel(0, 8, 1.2), kachel(0, 7, 1)]
  ]
};
