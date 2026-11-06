// Autopilot-Routen der Echten Orte im Haus (src/levels/zuhause/), id -> Wegpunkte (siehe tests/autopilot.js).
export default {
  // Schreibtisch: Bücher hinunter, Slalom um die Farbstifte, Kartonrolle, an der Lampe vorbei, über die Kante in die Schublade
  kz1: [
    { x: 10, z: -6, speed: 2 }, { x: 10, z: -18, speed: 2 }, { x: 5, z: -21, speed: 2 }, { x: 3.5, z: -24, speed: 2 },
    { x: 9, z: -29, speed: 2 }, { x: 15.5, z: -33, speed: 2 }, { x: 12, z: -38, speed: 2 }, { x: 10, z: -42, speed: 2 },
    { x: 10, z: -53, speed: 2 }, { x: 2, z: -52, speed: 2 }, { x: -20, z: -53, speed: 2 }, { x: -33, z: -55, speed: 2 }
  ],
  // Bett: Kissenhang hinunter, über die Falten nach Süden, um den Teddy, zwischen Hase und Hund zurück,
  // das Bilderbuch hinauf, durch die Kurve und über die Lücke auf den Nachttisch, in die Schale
  kz2: [
    { x: 42, z: -12, speed: 2 }, { x: 42, z: -26, speed: 3 }, { x: 42, z: -44, speed: 4 }, { x: 42, z: -72, speed: 4 },
    { x: 42, z: -96, speed: 3 }, { x: 38, z: -104, speed: 3 }, { x: 26, z: -107, speed: 3 }, { x: 14, z: -104, speed: 3 },
    { x: 15, z: -90, speed: 3 }, { x: 19, z: -78, speed: 3 }, { x: 19, z: -66, speed: 3 }, { x: 10, z: -61, speed: 3 },
    { x: 9, z: -50, speed: 3 }, { x: 3.1, z: -45, speed: 3 }, { x: 3.1, z: -24, speed: 8, r: 1.5 },
    { x: -12, z: -19, speed: 8, r: 3 }, { x: -14, z: -19, speed: 2 }, { x: -12, z: -12, speed: 2 }, { x: -12, z: -6, speed: 1.5 }
  ],
  // Fensterbank: Slalom um die Töpfe (Zimmerkante, Glas, Zimmerkante), durch den Untersetzer mit Erde,
  // zwischen den Spielfiguren durch, am Topf vorbei an der Kante entlang und in die Muschel
  kz3: [
    { x: -1, z: -9, speed: 2 }, { x: -3.5, z: -15, speed: 2 }, { x: -1, z: -20, speed: 2 }, { x: 3.5, z: -26, speed: 2 },
    { x: 1, z: -31, speed: 2 }, { x: -1, z: -36, speed: 2 }, { x: -1, z: -44, speed: 2 }, { x: -1, z: -51, speed: 2 },
    { x: -1, z: -57, speed: 2 }, { x: 0, z: -63, speed: 2 }, { x: -3.5, z: -68, speed: 2 }, { x: -3.5, z: -77, speed: 2 },
    { x: 0, z: -80, speed: 1.5 }, { x: 0, z: -84, speed: 1.5 }
  ]
};
