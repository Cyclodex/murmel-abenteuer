// Autopilot-Routen für src/levels/schweiz3.js (Schoggifabrik), siehe tests/autopilot.js.
const SY = -4, KZ = -65, T = [28.2, -9.35, -75.5], GX = 47;
// Kachel des Giessblechs: Reihe n (0 vorne), Spalte c (0 links)
const blech = (n, c, speed = 2, r = 0.4) => ({ x: GX + (n + 0.5) * 1.6, z: T[2] + (c - 2) * 1.6, speed, r });
// Stössel n ist eben zurück in der Wand
const stoessel = n => ['phase', ['schieber', n, 0.95, 0.03]];

export default {
  sch3: [
    [
      // Sortierbänder: gegen den Schub gerade hindurch, links am Rand zum Stern
      { x: 0, z: -2.5, speed: 3 }, { x: 0, z: -6, speed: 2.5, r: 0.6 }, { x: 0, z: -9, speed: 2.5, r: 0.6 },
      { x: -0.4, z: -11.4, speed: 2.5, r: 0.6 }, { x: 0, z: -15.5, speed: 2.5, r: 0.6 },
      // Tafelband: warten, bis der erste Schieber zurückkommt, dann in einem Zug an beiden vorbei
      { x: 0, z: -18.4, speed: 1.5, r: 0.4 },
      { x: 0, z: -22, speed: 4, r: 0.6, wait: ['phase', ['schieber', 0, 0.8, 0.95]] }, { x: -0.3, z: -27.5, speed: 4, r: 0.6 },
      // Schoggifluss, Schoggifall auf das Sims, vor jedem Stössel warten
      { x: 0, z: -31, speed: 2 }, { x: 0, z: -33, speed: 2 }, { x: 0, z: -40.5, speed: 3 },
      { x: 0, z: -47.5, speed: 1.5, r: 0.4 },
      { x: 0, z: -52, speed: 3, r: 0.4, wait: stoessel(2) },
      { x: 0, z: -56.5, speed: 3, r: 0.5, wait: stoessel(3) },
      // um die Kurve und durch den Kühltunnel
      { x: 0, z: -61.5, speed: 2.5, r: 0.6 }, { x: 0.9, z: -64.1, speed: 2.5, r: 0.6 }, { x: 3, z: KZ, speed: 2.5, r: 0.6 },
      { x: 9, z: KZ + 0.3, speed: 2.5, r: 0.6 }, { x: 15, z: KZ, speed: 2.5, r: 0.6 },
      // Anlauf, schräg in den Trichter, unten durch den Abfluss aufs Giessblech
      { x: T[0] - 7.2, z: KZ, speed: 5 }, { x: T[0], z: T[2] + 7.5, speed: 6, r: 1.5 }, { x: T[0], z: T[2], free: true, r: 0.6 },
      { x: GX - 4, z: T[2], speed: 1.5, r: 0.6, wait: ['tiefer', -15.5] }, { x: GX - 0.5, z: T[2], speed: 1.5, r: 0.4 },
      // Giessblech: durch die Lücken zwischen den Formen, im Zickzack
      blech(0, 2), blech(1, 3, 1.5, 0.5), blech(3, 2, 1.5, 0.5), blech(5, 1, 1.5, 0.5), blech(7, 2, 1.5, 0.5),
      blech(8, 2), { x: GX + 17.4, z: T[2] }
    ],
    // Bonusstern: am rechten Rand des Sortierbands, das nach rechts hinausschiebt
    [{ x: 0, z: -2.5, speed: 3 }, { x: 0, z: -6, speed: 2.5, r: 0.6 }, { x: 0.85, z: -9, speed: 1, r: 0.3 }]
  ]
};
