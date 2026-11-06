// Autopilot-Routen für src/levels/chilbi2.js (siehe tests/autopilot.js).
const SX = 5 * Math.sin(Math.PI / 3); // so weit links hält die Gondel am Bonus-Steg
// Putschauto-Bahn (vor jedem Auto warten, bis es am Rand steht), unter dem Hammer durch, Einstieg ins Riesenrad
const anfang = [
  { x: 0, z: -7.2, speed: 3, r: 0.6 }, { x: 0, z: -12.5, speed: 5, r: 0.6, wait: ['phase', ['schieber', 0, 0.45, 0.56]] },
  { x: 4.5, z: -12.5, speed: 3, r: 0.6 }, { x: 0, z: -12.5, speed: 3, r: 0.5 },
  { x: 0, z: -17.5, speed: 5, r: 0.6, wait: ['phase', ['schieber', 1, 0.45, 0.56]] }, { x: 0, z: -22.5, speed: 5, r: 0.6, wait: ['phase', ['schieber', 2, 0.45, 0.56]] },
  { x: 0, z: -26, speed: 3 }, { x: 0, z: -28.3, speed: 2, r: 0.5 }, { x: 0, z: -34, speed: 5, wait: ['phase', ['hammer', 0, 0.78, 0.9]] },
  { x: 0, z: -39.2, speed: 2, r: 0.6 }, { x: 0, z: -42, speed: 2.5, r: 0.5, wait: ['phase', ['riesenrad', 0, 0, 0.2]] }
];

export default {
  c2: [
    // Hauptweg: oben aussteigen, um den Rutschturm hinunter, über den Platz ins Ziel
    [...anfang, { x: 0, z: -46.5, speed: 2.5, wait: ['gondel', [0, 3]] }, { x: 0, z: -51, speed: 3 }, { follow: true, bisY: 5.6, speed: 5 },
      { x: 0, z: -57, speed: 4 }, { x: -2.2, z: -70, speed: 4 }],
    // Bonusstern: eine Gondel weiter fahren, über den versteckten Steg und die Rampe zum Platz, den Stern im Auslauf holen
    [...anfang, { x: -SX, z: -47, speed: 2.5, wait: ['gondel', [0, 4]] }, { x: -SX, z: -58, speed: 3 }, { x: -2.5, z: -63, speed: 3 },
      { x: 0, z: -56, speed: 2.5, r: 0.6 }, { x: -2.2, z: -70, speed: 4 }]
  ]
};
