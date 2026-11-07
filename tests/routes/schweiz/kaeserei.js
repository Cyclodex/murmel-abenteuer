// Autopilot-Routen für src/levels/schweiz1.js (Käserei), siehe tests/autopilot.js.
const KY = -3, KZ = -38, GANG = KZ - 0.2, FACH = KZ - 2;
// Kacheln des Emmentalers: Spalte c (0 links), Reihe n (0 vorne)
const kachel = (c, n, speed = 2, r = 0.4) => ({ x: 16 + (c - 3) * 1.6, z: -18 - (n + 0.5) * 1.6, speed, r });
// vom Fach bei x0 zum Fach bei x1: im Fach warten, bis die Salve vorbei ist und so lange kein Laib mehr startet, dass
// der nächste die Murmel erst im nächsten Fach einholt (je weiter hinten, desto kürzer)
const fach = (x0, x1, rest = 2.2) => [
  { x: x0, z: FACH, speed: 1, r: 0.5, wait: ['frei', 'felsen', 0, rest, [x0 + 1.5, KZ]] },
  { x: x0 + 0.5, z: GANG, speed: 2.5, r: 0.5 },
  { x: x1 - 1, z: GANG, speed: 3.5, r: 0.6 },
  { x: x1, z: FACH, speed: 1.5, r: 0.4 }
];

// Steg, Kessi, Labyrinth bis zur Gabelung vor der hinteren Sackgasse
const anfang = [
  { x: 0, z: -3, speed: 3 }, { x: 0, z: -9.4, speed: 2, r: 0.4 },
  // Kessi: warten, bis es hinter dem Eingang lange nicht blubbert, dann bis ein Ende der Harfe links naht, dann gleich
  // hinter dem vorderen Ende quer hinüber und rechts hinaus
  { x: 0, z: -9.45, speed: 1, r: 0.6, wait: ['frei', 'knall', 0, 4.4] },
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
      // vor dem langen Gang warten, bis lange kein Laib aus dem Regal fällt
      kachel(1, 8), kachel(1, 9, 1.5), { ...kachel(1, 10, 2.5), wait: ['frei', 'fallend', 0, 3.5] }, kachel(5, 10, 2.5), kachel(5, 12), { x: 19.2, z: -41, speed: 2, r: 0.5 },
      // Wendel hinunter in den Keller
      { x: 19.2, z: -42.6, speed: 1.5, r: 0.5 },
      { follow: true, bisY: -2.1, speed: 2.5 },
      { x: 27.2, z: -41.9, speed: 1.5, r: 0.4 },
      // Keller: hinter jeder Salve her ins nächste Fach
      ...fach(27.2, 32, 2),
      ...fach(32, 38, 1.2),
      ...fach(38, 44, 0.6),
      { x: 44, z: FACH, speed: 1, r: 0.5, wait: ['frei', 'felsen', 0, 0.4, [45.5, KZ]] },
      { x: 44.5, z: GANG, speed: 2.5, r: 0.5 },
      { x: 48.2, z: GANG, speed: 2.5, r: 0.5 },
      { x: 48.2, z: KZ - 7.5 }
    ],
    // Bonusstern: in die hintere Sackgasse
    [...anfang, kachel(0, 8, 1.2), kachel(0, 7, 1)]
  ]
};
