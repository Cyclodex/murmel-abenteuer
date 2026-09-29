// Autopilot-Routen der schweren Level der Welt Übung (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  ausflugs: [
    // Hauptweg: Treppe, am Hammer warten bis er hochgeht, Fluss, Falltüren schnell, Steinschlag abwarten
    [
      { x: 0, z: -2, speed: 3 }, { x: 2.5, z: -9, speed: 2 }, { x: 2.5, z: -21, speed: 2.5 }, { x: 2.5, z: -25.5, speed: 2 },
      { x: 2.5, z: -31, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -37, speed: 3 }, { x: 0, z: -41, speed: 2 },
      { x: 0, z: -46, speed: 3 }, { x: 0.9, z: -49, speed: 3 }, { x: -0.9, z: -55, speed: 3 }, { x: 0, z: -60, speed: 3 },
      { x: 0, z: -68, speed: 2 }, { x: 0, z: -70.5, speed: 1, r: 0.6 }, { x: 0, z: -88, speed: 6, r: 1 },
      { x: 0, z: -90, speed: 1.5, r: 0.6 }, { x: 0, z: -103, speed: 4, wait: ['phase', ['felsen', 0, 0.65, 0.75]] }, { x: 0, z: -115 }
    ],
    // Umweg über den Grat zum Bonusstern
    [{ x: 0, z: -3, speed: 3 }, { x: -2.5, z: -9, speed: 2 }, { x: -2.5, z: -24, speed: 2, r: 0.8 }]
  ]
};
