// Autopilot-Routen der Echten Orte im Haus (src/levels/zuhause/), id -> Wegpunkte (siehe tests/autopilot.js).
export default {
  // Schreibtisch: Bücher hinunter, Slalom um die Farbstifte, Kartonrolle, an der Lampe vorbei, über die Kante in die Schublade
  kz1: [
    { x: 10, z: -6, speed: 2 }, { x: 10, z: -18, speed: 2 }, { x: 5, z: -21, speed: 2 }, { x: 3.5, z: -24, speed: 2 },
    { x: 9, z: -29, speed: 2 }, { x: 15.5, z: -33, speed: 2 }, { x: 12, z: -38, speed: 2 }, { x: 10, z: -42, speed: 2 },
    { x: 10, z: -53, speed: 2 }, { x: 2, z: -52, speed: 2 }, { x: -20, z: -53, speed: 2 }, { x: -33, z: -55, speed: 2 }
  ]
};
