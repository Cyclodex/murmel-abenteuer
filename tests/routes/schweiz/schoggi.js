// Autopilot-Route für src/levels/schweiz3.js (Schoggifabrik), siehe tests/autopilot.js.
const Z1 = -57.2;                 // Mittellinie der Halle unten
const T = [65.2, -67.7];          // Abfülltrichter (x, z)
export default {
  sch3: [
    // Band, vor dem Stempel anhalten und durch, wenn er hochgeht; gegen das Band, in die Nische zum Bonusstern
    { x: 0, z: -5, speed: 4 }, { x: 0, z: -14, speed: 5 }, { x: 0, z: -18.8, speed: 2, r: 0.5 },
    { x: 0, z: -24.2, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -35, speed: 4 },
    { x: -1, z: -40.5, speed: 3 }, { x: -4.4, z: -40.5, speed: 2, r: 0.5 }, { x: -0.5, z: -40.7, speed: 3 },
    // Schoggifluss, Schoggifall, Querfluss, Kühltunnel
    { x: 0, z: -44, speed: 3 }, { x: 0, z: -53, speed: 5 }, { x: 5, z: Z1, speed: 5 }, { x: 10, z: Z1, speed: 5 },
    { x: 13, z: Z1, speed: 3 }, { x: 22, z: Z1, speed: 5 }, { x: 25, z: Z1, speed: 3 },
    // Giessblech in Schlangenlinie: links, rechts, links an den leeren Formen vorbei
    { x: 27.5, z: Z1 - 0.7, speed: 3 }, { x: 30.2, z: Z1 - 0.7, speed: 3, r: 0.7 }, { x: 32.2, z: Z1 + 2.5, speed: 3, r: 0.7 },
    { x: 34.2, z: Z1 + 2.5, speed: 3, r: 0.7 }, { x: 36.2, z: Z1 - 0.7, speed: 3, r: 0.7 }, { x: 38.2, z: Z1 - 0.7, speed: 3, r: 0.7 }, { x: 42, z: Z1, speed: 3 },
    // Band hoch, Anlauf, schräg in den Trichter, unten aus der Pralinenform hinaus in die Schachtel (wie Küche 3)
    { x: 44, z: Z1 }, { x: 56, z: Z1 }, { x: 59, z: Z1, speed: 5 }, { x: T[0], z: Z1 - 3, speed: 6, r: 1.5 }, { x: T[0], z: T[1], free: true, r: 0.6 },
    { x: T[0], z: T[1], speed: 1, wait: ['tiefer', -10.7] }, { x: T[0] + 2.8, z: T[1], speed: 2 }, { x: T[0] + 11, z: T[1] }
  ]
};
