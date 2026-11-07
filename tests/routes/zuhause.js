// Autopilot-Routen der Echten Orte im Haus (src/levels/zuhause/), id -> Wegpunkte (siehe tests/autopilot.js).
export default {
  // Schreibtisch: Fensterbank nach Westen (Slalom um die Töpfe, Stern im Durchzug, Untersetzer, Spielfiguren, Stern am
  // Westende), übers Lineal auf den Bücherturm, die Bücher hinunter, über die Wippe im Gegenwind, Slalom auf dem Heft,
  // Stern beim Magneten, im Kugelschreiber auf das Mauspad auf dem Stapel zielen, die Lineal-Rutsche hinunter in die Gasse,
  // unter dem Locher durch, in die Schublade, durch die
  // Bauklötze ins Katapult auf den Stuhl, über die Jacke, Stern an der Stuhlkante, die Rennbahn hinunter in den Becher
  kz1: [
    { x: 19, z: -64, speed: 5 }, { x: 24, z: -58, speed: 5 }, { x: 28, z: -53, speed: 4, r: 0.6 }, { x: 27.5, z: -47, speed: 4 },
    { x: 22.5, z: -43, speed: 5 }, { x: 23.4, z: -36, speed: 5 }, { x: 23.4, z: -31.5, speed: 4 }, { x: 23.4, z: -24.5, speed: 5 },
    { x: 25, z: -19, speed: 5 }, { x: 22, z: -14, speed: 5 }, { x: 24.5, z: -9, speed: 5 }, { x: 19.5, z: -2, speed: 5 },
    { x: 24, z: 8, speed: 3 }, { x: 29, z: 14, speed: 2, r: 0.4 }, { x: 21, z: 9, speed: 2, r: 0.5 },
    { x: 16.6, z: 9, speed: 1.5, r: 0.4 }, { x: 7, z: 9, speed: 2, r: 0.5 }, { x: -2.5, z: 9, speed: 1.5 },
    { x: -3, z: 5, speed: 2 }, { x: -3, z: -12, speed: 3 }, { x: -3, z: -20, speed: 2, r: 0.6 },
    { x: 4, z: -19.5, speed: 2, r: 0.6 }, { x: 4, z: -23, speed: 2, r: 0.5 }, { x: 4, z: -30, speed: 3, r: 0.6 },
    { x: 4, z: -37, speed: 3, r: 0.6 }, { x: 4, z: -41.5, speed: 2 },
    { x: 5.8, z: -45, speed: 2, r: 0.4 }, { x: 2.85, z: -47.75, speed: 2, r: 0.4 }, { x: 5.8, z: -50.5, speed: 2, r: 0.4 },
    { x: 2.85, z: -53.25, speed: 2, r: 0.4 }, { x: 5.8, z: -56, speed: 2, r: 0.4 }, { x: 5, z: -58.5, speed: 3 },
    { x: 7.5, z: -62.5, speed: 2, r: 0.4 }, { x: 3, z: -63, speed: 2 }, { x: 1, z: -63, speed: 2, aim: { x: -16, z: -26 } },
    { x: -20, z: -30, speed: 1.5, r: 0.6 }, { x: -21, z: -33, speed: 1.5, r: 0.5 }, { x: -21, z: -42, speed: 4 },
    { x: -21, z: -51, speed: 4, r: 0.5 }, { x: -21, z: -58, speed: 4, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
    { x: -18.3, z: -60.3, speed: 1.5, r: 0.6 }, { x: -18.6, z: -62, speed: 1.5, r: 0.5 }, { x: -24, z: -62, speed: 2.5 }, { x: -30.5, z: -61, speed: 2, r: 1.5 },
    { x: -29.8, z: -56, speed: 3, r: 0.6 }, { x: -30.5, z: -52, speed: 3, r: 0.6 }, { x: -33, z: -50.5, speed: 2 },
    { x: -42, z: -37, speed: 3 }, { x: -44, z: -31, speed: 3 }, { x: -44, z: -25, speed: 3 }, { x: -30.5, z: -21, speed: 2, r: 0.4 },
    { x: -42, z: -18.5, speed: 2, r: 0.6 }, { x: -42, z: -12, speed: 4 }, { x: -42, z: 40, free: true, r: 3 },
    { x: -42, z: 52, speed: 5 }, { x: -42, z: 62, speed: 3 }
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
