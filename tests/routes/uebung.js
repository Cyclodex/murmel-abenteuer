// Autopilot-Routen der schweren Level der Welt Übung (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  ausflugs: [
    // Hauptweg: Treppe, am Hammer warten bis er hochgeht, Bach, Falltüren schnell, Steinschlag abwarten,
    // Nagelwand, Serpentinen (Hammer, Schieber, Hammer), Schluchtbrücke schnell, Wasserfall, Strand, Sandburg
    [
      { x: 0, z: -2, speed: 3 }, { x: 2.5, z: -9, speed: 2 }, { x: 2.5, z: -21, speed: 2.5 }, { x: 2.5, z: -25.5, speed: 2 },
      { x: 2.5, z: -31, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 0, z: -37, speed: 3 }, { x: 0, z: -41, speed: 2 },
      { x: 0, z: -46, speed: 3 }, { x: 0.9, z: -49, speed: 3 }, { x: -0.9, z: -55, speed: 3 }, { x: 0, z: -60, speed: 3 },
      { x: 0, z: -68, speed: 2 }, { x: 0, z: -70.5, speed: 1, r: 0.6 }, { x: 0, z: -88, speed: 6, r: 1 },
      { x: 0, z: -90, speed: 1.5, r: 0.6 }, { x: 0, z: -103, speed: 4, wait: ['phase', ['felsen', 0, 0.65, 0.75]] },
      // Nagelwand: oben hineinrollen, unten weiter
      { x: 0, z: -108, speed: 3 }, { x: 0, z: -113, speed: 2, r: 0.8 }, { x: 0, z: -124, speed: 3 },
      // Serpentinen
      { x: 0, z: -130.5, speed: 1.5, r: 0.6 }, { x: 0, z: -136.5, speed: 5, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
      { x: 0, z: -148, speed: 3 }, { x: 1.2, z: -152.8, speed: 2.5 }, { x: 4, z: -154, speed: 2.5 }, { x: 6.8, z: -152.8, speed: 2.5 },
      { x: 8, z: -148.5, speed: 2.5 }, { x: 8, z: -135.5, speed: 1.5, r: 0.6 },
      { x: 8, z: -129, speed: 4, wait: ['phase', ['schieber', 0, 0.93, 0.03]] },
      { x: 8.8, z: -125.2, speed: 2.5 }, { x: 12, z: -124, speed: 2.5 }, { x: 15.2, z: -125.2, speed: 2.5 }, { x: 16, z: -130, speed: 3 },
      { x: 16, z: -143.5, speed: 1.5, r: 0.6 }, { x: 16, z: -149.5, speed: 5, wait: ['phase', ['hammer', 2, 0.72, 0.85]] },
      // Schluchtbrücke mit Falltüren: schnell drüber
      { x: 16, z: -164, speed: 6, r: 1 },
      // Wasserfall
      { x: 16, z: -167, speed: 2 }, { x: 16, z: -175, speed: 3 }, { x: 16.9, z: -186, speed: 3 }, { x: 15.1, z: -193, speed: 3 }, { x: 16, z: -199, speed: 3 },
      // Strand mit Krabbenlöchern
      { x: 16, z: -204, speed: 2 }, { x: 16, z: -208.5, speed: 2, r: 0.5 }, { x: 16, z: -211, speed: 2, r: 0.5 }, { x: 14, z: -213, speed: 2, r: 0.5 },
      { x: 14, z: -217, speed: 2, r: 0.5 }, { x: 16.5, z: -218.5, speed: 2, r: 0.5 }, { x: 18, z: -220.5, speed: 2, r: 0.5 }, { x: 18, z: -223, speed: 2 },
      // Rasensprenger und Sandburg
      { x: 16, z: -226, speed: 2, r: 0.6 }, { x: 16, z: -235, speed: 4, wait: ['balkenWeg', [16, -228]] },
      { x: 16, z: -246, speed: 2.5 }, { x: 16, z: -252, speed: 2 }
    ],
    // Umweg über den Grat zum Bonusstern
    [{ x: 0, z: -3, speed: 3 }, { x: -2.5, z: -9, speed: 2 }, { x: -2.5, z: -24, speed: 2, r: 0.8 }]
  ]
};
