// Level "Erster Ausflug" – das ursprüngliche Level.
// Koordinaten in Metern: x = rechts, y = oben, -z = vorwärts. Murmel-Radius 0.5.
export default {
  id: 'ausflug',
  name: 'Erster Ausflug',
  emoji: '🌳',
  start: [0, 0, 2],          // Punkt auf dem Boden; die Murmel startet 1 m darüber
  killY: -8,                 // tiefer = runtergefallen
  parts: [
    // Start + gerader Weg
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -16], width: 6, walls: 0.8, caps: 'start' },
    // Rampe hoch auf 1.5 m
    { type: 'weg', from: [0, 0, -16], to: [0, 1.5, -26], width: 6, walls: 0.8 },
    // Plattform oben, vorne offen (Absprung)
    { type: 'weg', from: [0, 1.5, -26], to: [0, 1.5, -32], width: 6, walls: 0.8 },
    // Unten mit Trampolin
    { type: 'weg', from: [0, 0, -32], to: [0, 0, -42], width: 6 },
    { type: 'wand', from: [-3.2, 0, -26], to: [-3.2, 0, -42], height: 0.8 },
    { type: 'wand', from: [3.2, 0, -26], to: [3.2, 0, -42], height: 0.8 },
    { type: 'trampolin', at: [0, 0, -38], size: [5.6, 2], jump: 11, push: 4 },
    // Hoher Block (Vorderseite ist eine Wand)
    { type: 'klotz', at: [0, 2, -48], size: [8, 4, 12] },
    { type: 'wand', from: [-4.2, 4, -42], to: [-4.2, 4, -54], height: 0.8 },
    { type: 'wand', from: [4.2, 4, -42], to: [4.2, 4, -54], height: 0.8 },
    // Brücke
    { type: 'weg', from: [0, 4, -54], to: [0, 4, -64], width: 3, walls: 0.6 },
    // Ziel-Plattform
    { type: 'weg', from: [0, 4, -64], to: [0, 4, -74], width: 8, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 4, -69], r: 1.2 },

    { type: 'checkpoint', at: [0, 1.5, -28], size: [6, 3, 3] },
    { type: 'checkpoint', at: [0, 4, -47], size: [8, 4, 10] },

    { type: 'stern', at: [0, 0.9, -4] },
    { type: 'stern', at: [0, 1.65, -21] },
    { type: 'stern', at: [0, 0.9, -35] },
    { type: 'stern', at: [-2, 4.9, -50] },
    { type: 'stern', at: [0, 4.9, -59] },

    // einzelne Dominosteine
    { type: 'domino', at: [1.8, 4, -52], yaw: -28 }
  ]
};
