// Autopilot-Routen der Welt Winter.

// Eisweiher: Bobbahn folgen bis auf den Schnee vor dem Weiher
const bob = [{ x: 0, z: -3, speed: 3 }, { follow: true, bisY: 0.8, speed: 5 }, { x: 0, z: -37, speed: 4 }, { x: 0, z: -41, speed: 2.5 }];

export default {
  // Schlittelhang: Slalom um die Stangen, rechts am Schneemann vorbei, über das Eis, in die Nische vor dem Iglu (Bonusstern) und ins Ziel
  wi1: [
    { x: 0, z: -3 }, { x: 0.9, z: -7, r: 0.8 }, { x: -0.9, z: -11, r: 0.8 }, { x: 0.9, z: -15, r: 0.8 },
    { x: 0, z: -21, speed: 5 }, { x: 1.5, z: -31, speed: 5 }, { x: 2, z: -37 }, { x: 0, z: -42 }, { x: 0, z: -46 },
    { x: 0, z: -52, speed: 3.5 }, { x: 0, z: -59, speed: 3.5 }, { x: 1.46, z: -63.54 }, { x: 5, z: -65 }, { x: 8, z: -65, speed: 3 },
    { x: 11, z: -66.5, speed: 2 }, { x: 11, z: -70.5, speed: 2, r: 0.5 }, { x: 11, z: -66, speed: 2 }, { x: 16, z: -65 }
  ],
  // Eisweiher: im Slalom um die Eislöcher, mit dem Skilift hinauf. Einsteigen gleich am Anfang der Pause des Lifts
  // (platAtFrom gälte auch im letzten Moment der Pause, dann führe die Murmel dem Lift in die Lücke nach)
  wi2: [
    [
      ...bob, { x: 0, z: -44.5, speed: 2.2, r: 0.8 }, { x: -1, z: -47, speed: 2.2, r: 0.8 }, { x: 0.2, z: -50, speed: 2.2, r: 0.8 },
      { x: 1, z: -53, speed: 2.2, r: 0.8 }, { x: 0, z: -57, speed: 2.5 }, { x: 0, z: -62.3, speed: 2.5, r: 0.6 },
      { x: 0, z: -66, speed: 2, wait: ['phase', ['plattform', 0, 0, 0.07]] }, { x: 0, z: -78, speed: 2, wait: 'platAtTo' }, { x: 0, z: -82, speed: 3 }
    ],
    // Umweg zum Bonusstern auf der Schneeinsel hinter dem Eisloch
    [...bob, { x: 0, z: -44.5, speed: 1.8, r: 0.8 }, { x: -1, z: -47, speed: 1.5, r: 0.7 }, { x: -0.3, z: -49.6, speed: 1.2, r: 0.6 }, { x: 2, z: -49.2, speed: 1.2, r: 0.5 }]
  ],
  // Skischanze: zwischen den Schneebällen durch, über den Grat, Schanze (im Flug nicht lenken),
  // im Auslauf der Abstecher zum Bonusstern vor dem Iglu
  wi3: [
    { x: 0, z: -4 }, { x: 0, z: -9.5, speed: 1.5, r: 0.6 },
    { x: 0, z: -14.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 0, 0.75, 0.9]] }, { x: 0, z: -19.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 1, 0.75, 0.9]] },
    { x: 0, z: -24.5, speed: 4, r: 0.6, wait: ['phase', ['felsen', 2, 0.75, 0.9]] }, { x: 0, z: -28, speed: 3 },
    { x: 0, z: -34, speed: 3 }, { x: 0, z: -38, speed: 3 }, { x: 0, z: -44, speed: 3 }, { x: 0, z: -48, speed: 3 },
    { x: 0, z: -51, speed: 5 }, { x: 0, z: -62, speed: 12, r: 2 }, { x: 0, z: -72, speed: 12, r: 2 }, { x: 0, z: -79, speed: 12, r: 1.5 },
    { x: 0, z: -92, free: true, r: 5 }, { x: 0, z: -123.5, speed: 6, r: 0.8 },
    { x: 5, z: -127, speed: 3 }, { x: 8.4, z: -127, speed: 2, r: 0.6 }, { x: 4, z: -128, speed: 3 }, { x: 0, z: -133.5, speed: 3 }
  ]
};
