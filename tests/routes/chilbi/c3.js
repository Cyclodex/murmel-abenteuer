// Autopilot-Routen für src/levels/chilbi3.js (siehe tests/autopilot.js).
const AUTO = (n, a, b) => ['phase', ['schieber', n, a, b]];
// Kettenlift, Abfahrt, Looping, Zuckerwatte, Helix, Kanone bis auf das Zuckerwatte-Kissen
const bisBude = [
  { x: 0, z: -4, speed: 4 }, { x: 0, z: -7, speed: 3 }, { x: 0, z: -26, speed: 3 }, { x: 0, z: -29.5, speed: 3 },
  { x: 0, z: -46, free: true, r: 2 }, { x: 0, z: -51.5, speed: 8 }, { x: 5, z: -55, free: true, r: 2.5 },
  { x: 5, z: -59.5, speed: 3 }, { x: 5, z: -63, speed: 2.5, r: 0.8 }, { follow: true, bisY: -2.3, speed: 5 },
  { x: 5, z: -68, speed: 3 }, { x: 5, z: -72, speed: 3 }, { x: 5, z: -75, speed: 2 }, { x: 5, z: -92, speed: 2 },
  { x: 5, z: -98, speed: 3 }
];

export default {
  c3: [
    // Hauptweg: unter dem Hammer durch, auf der Putschauto-Bahn zwischen den Autos durch, ins Ziel
    [
      ...bisBude,
      { x: 5, z: -105.5, speed: 2, r: 0.5 }, { x: 5, z: -111, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: 5, z: -114, speed: 3 },
      { x: 5, z: -117.1, speed: 2, r: 0.5 }, { x: 5, z: -120.9, speed: 4, r: 0.6, wait: AUTO(0, 0.43, 0.53) },
      { x: 5, z: -123.1, speed: 2, r: 0.5 }, { x: 5, z: -126.9, speed: 4, r: 0.6, wait: AUTO(1, 0.93, 0.03) },
      { x: 5, z: -131, speed: 3 }, { x: 5, z: -134 }
    ],
    // Abstecher in die Büchsen-Bude zum Bonusstern
    [...bisBude, { x: 5.5, z: -100.5, speed: 2, r: 0.6 }, { x: 9, z: -100.5, speed: 2, r: 0.5 }]
  ]
};
