// Autopilot-Route für src/levels/schweiz2.js (Uhrwerk), siehe tests/autopilot.js.
const D = 6.85 / Math.SQRT2, H = Math.SQRT1_2;
const G = [[0, -8.2], [-D, -8.2 - D], [0, -8.2 - 2 * D], [-D, -8.2 - 3 * D]];
const RING = [3.2, 2.45, 3.2, 2.45];                // auf diesem Ring fährt die Murmel mit
// Punkt auf dem Ring von Zahnrad n in Richtung [dx, dz]
const ring = (n, dx, dz) => [G[n][0] + dx * RING[n], G[n][1] + dz * RING[n]];
const X = -D, ZF = -40, XF = X - 4.7, XS = XF - 4.7;
// vom Ring n hinüber auf Ring m, sobald die Murmel bei der Übergabe ist
const hinueber = (n, m, dx, dz) => {
  const [ax, az] = ring(n, dx, dz), [bx, bz] = ring(m, -dx, -dz);
  return { x: bx, z: bz, speed: 2, r: 0.5, wait: ['nahe', [ax, az, 0.7]] };
};
const gewicht = n => ['platAtTo', n];
const anfang = [{ x: 0, z: -2, speed: 3 }, { x: 0, z: -5, speed: 2, r: 0.5 }];

export default {
  sch2: [
    [
      ...anfang,
      // Zahnräder: mitfahren bis zur Übergabe, hinüber, auf dem letzten bis hinten
      hinueber(0, 1, -H, -H), hinueber(1, 2, H, -H), hinueber(2, 3, -H, -H),
      { x: X, z: -27.5, speed: 2, r: 0.6, wait: ['nahe', [...ring(3, 0, -1), 0.7]] },
      { x: X, z: -31, speed: 3, r: 0.6 },
      // Zugfeder: der Bahn folgen
      { follow: true, bisY: -2.3, speed: 3 },
      // Zifferblatt: in der Ecke warten, bis beide Zeiger an der Kante vorbei sind, dann der Kante entlang zur nächsten Ecke
      // (rechts erst beide Zeiger, dann noch einmal nur der Minutenzeiger: sein Ende ist eben an der Ecke vorbei;
      // hinten reicht der Stundenzeiger nicht bis an den Weg)
      { x: XF + 4.5, z: ZF + 4.7, speed: 2.5, r: 0.5 },
      { x: XF + 4.5, z: ZF + 4.6, speed: 1, r: 0.6, wait: ['balkenWeg', [XF + 4.11, ZF + 0.87]] },
      { x: XF + 4.5, z: ZF - 4.3, speed: 4, r: 0.6, wait: ['balkenWeg', [XF + 4.46, ZF + 4.31]] },
      { x: XF + 4.5, z: ZF - 5, speed: 1, r: 0.4 },
      { x: XF - 3.7, z: ZF - 5, speed: 4, r: 0.6, wait: ['balkenWeg', [XF + 3.73, ZF - 4.95]] },
      { x: XS, z: ZF - 5, speed: 1.5, r: 0.4 },
      { x: XS, z: -48.4, speed: 3, r: 0.5 },
      // Uhrgewichte: auf jedes, sobald es oben angekommen ist (jedes folgt dem vorigen 1.5 s später)
      { x: XS, z: -50.2, speed: 2.5, r: 0.5, wait: gewicht(0) },
      { x: XS, z: -52.6, speed: 2.5, r: 0.5, wait: gewicht(1) },
      { x: XS, z: -55, speed: 2.5, r: 0.5, wait: gewicht(2) },
      { x: XS, z: -57.5, speed: 2.5, r: 0.6 },
      // vor dem Pendel warten, bis es lange an der Seite bleibt, zwischen Pendel und Hammer warten, bis der Hammer lange
      // oben bleibt, unter ihm hindurch, vor dem zweiten Pendel wieder warten
      { x: XS, z: -60.2, speed: 2, r: 0.4 },
      { x: XS, z: -63.2, speed: 3, r: 0.35, wait: ['frei', 'pendel', 0, 1.4] },
      { x: XS, z: -66.4, speed: 4, r: 0.5, wait: ['frei', 'hammer', 0, 1.6] },
      { x: XS, z: -67.6, speed: 1, r: 0.3 },
      { x: XS, z: -72, speed: 4.5, r: 0.6, wait: ['frei', 'pendel', 1, 1.6] },
      { x: XS, z: -77 }
    ],
    // Bonusstern: auf dem ersten Rad die Runde andersherum bis rechts, hinüber auf die Schraube
    [...anfang, { x: 5.2, z: -8.2, speed: 1.5, r: 0.5, wait: ['nahe', [3.2, -8.2, 0.7]] }]
  ]
};
