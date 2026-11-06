// Autopilot-Routen für src/levels/schweiz1.js (Käserei), siehe tests/autopilot.js.

// Anfang bis in die rechte Gasse des Emmentalers
const anfang = [
  // rechts und links an den Milchkannen vorbei, Rampe hinauf ins Käsekessi
  { x: 1.4, z: -4, r: 0.8 }, { x: -1.4, z: -7, r: 0.8 }, { x: 0, z: -9.5, speed: 3, r: 0.8 }, { x: 0, z: -13, speed: 3.5 },
  // im Kessi rechts aussen um die Käseharfe herum und durch die Lücke hinaus
  { x: 2.4, z: -16.5, speed: 3 }, { x: 3.6, z: -20, speed: 3.5 }, { x: 2.6, z: -22.4, speed: 3.5, r: 0.9 }, { x: 0.5, z: -23.6, speed: 3, r: 0.6 },
  { x: 0, z: -26.5 }, { x: 0, z: -31 },
  // Emmentaler: rechte Gasse
  { x: 2.25, z: -34.2, speed: 3, r: 0.8 }, { x: 2.25, z: -39.3, speed: 3.5, r: 0.8 }
];

export default {
  sch1: [
    // Hauptweg: quer hinüber in die linke Gasse, Kurve, Kellertreppe, vor jedem Laib warten, bis er vorbei ist
    [...anfang, { x: -2.25, z: -41.2, speed: 3.5, r: 0.8 }, { x: -2.25, z: -45.7, speed: 3.5, r: 0.8 }, { x: 0, z: -48.5, speed: 3.5, r: 0.8 }, { x: 0, z: -53 },
      { x: 1.46, z: -56.54 }, { x: 5, z: -58 }, { x: 15, z: -58 }, { x: 19.6, z: -58, speed: 1.5, r: 0.6 },
      { x: 25.5, z: -58, speed: 4, r: 0.6, wait: ['phase', ['felsen', 0, 0.5, 0.64]] },
      { x: 31.5, z: -58, speed: 4, r: 0.8, wait: ['phase', ['felsen', 1, 0.5, 0.64]] },
      { x: 34, z: -58 }, { x: 39.5, z: -58 }],
    // Umweg quer über den Emmentaler in die Nische in der Rinde (Bonusstern)
    [...anfang, { x: -3.5, z: -40, speed: 3, r: 0.8 }, { x: -7.75, z: -40, speed: 2.5, r: 0.6 }]
  ]
};
