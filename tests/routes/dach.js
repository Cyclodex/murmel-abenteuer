// Autopilot-Routen der Welt Dach (id -> Wegpunkte, siehe tests/autopilot.js).

// Vom Deck auf den First
const first = [{ x: 0, z: -1.5, speed: 2 }, { x: 0, z: -3, speed: 1.2, r: 0.5 }];

export default {
  // First: in jeder Böe gegen den Wind halten. Ziegel-Schräge: über dem oberen Schneefang zur Lücke, rechts an der Gaube
  // vorbei zum Stern, unter der Gaube am unteren Schneefang entlang nach links, warten, bis die Kastanie durch die Lücke ist,
  // hindurch auf den Laufsteg. Dort vor dem ersten losen Brett warten, bis der Rotorarm vorbei ist, und ohne Halt über die Bretter.
  // Die Dachkante mittig hinunter, in der Rinne warten, bis die Murmel liegt, in den Kessel und durchs Fallrohr in die Tonne
  d1: [
    [
      ...first,
      { x: 3, z: -3.4, speed: 3, r: 0.5 }, { x: 6.5, z: -3.5, speed: 3, r: 0.5 }, { x: 8.5, z: -3, speed: 3, r: 0.5 },
      { x: 11.5, z: -2.5, speed: 3, r: 0.5 }, { x: 13.5, z: -3, speed: 3, r: 0.5 }, { x: 16.5, z: -3.5, speed: 3, r: 0.5 },
      { x: 19.5, z: -3, speed: 3, r: 0.5 }, { x: 22, z: -3.3, speed: 1.5, r: 0.6 },
      { x: 26, z: -6.4, speed: 2, r: 0.7 }, { x: 32.3, z: -6.9, speed: 2.5, r: 0.5 }, { x: 32.3, z: -8.2, speed: 1.2, r: 0.5 },
      { x: 35, z: -9.2, speed: 1.5, r: 0.8 }, { x: 35.5, z: -10, speed: 1.5, r: 0.5 }, { x: 34.5, z: -11.8, speed: 1.5, r: 0.5 },
      { x: 29, z: -11.8, speed: 1.5, r: 0.5 }, { x: 24, z: -11.8, speed: 1.2, r: 0.4 },
      { x: 21.3, z: -12.6, speed: 1.5, r: 0.5, wait: ['phase', ['felsen', 0, 0.45, 0.55]] }, { x: 21.5, z: -15.5, speed: 1.5, r: 0.5 },
      { x: 23, z: -16, speed: 1.5, r: 0.5 }, { x: 26.8, z: -16, speed: 1.2, r: 0.4 },
      { x: 31.5, z: -16, speed: 4.5, r: 0.6, wait: ['balkenWeg', [31.5, -16]] }, { x: 39, z: -16, speed: 4.5, r: 0.6 },
      { x: 45, z: -16, speed: 2.5, r: 0.6 }, { x: 48.6, z: -16.2, speed: 1.2, r: 0.4 },
      { x: 48.6, z: -20, speed: 2, r: 0.5 }, { x: 48.6, z: -24, speed: 2, r: 0.5 }, { x: 48.6, z: -27.5, speed: 2, r: 0.6 },
      { x: 48.6, z: -28.7, free: true, r: 1.2 }, { x: 49, z: -28.7, speed: 1, r: 5, wait: 'amBoden' },
      { x: 53, z: -28.7, speed: 2.5, r: 0.6 }, { x: 55.3, z: -28.7, speed: 2, r: 0.4 }, { x: 65.7, z: -28.7, speed: 2, wait: 'abfluss' }
    ],
    // Bonusstern links am Ende des Firsts unter der Antenne
    [...first, { x: -2.5, z: -3, speed: 1.5, r: 0.5 }, { x: -5.2, z: -3, speed: 1, r: 0.5 }]
  ]
};
