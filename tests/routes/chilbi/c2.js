// Autopilot-Routen für src/levels/chilbi2.js (siehe tests/autopilot.js).
const XR = 9;                           // hier geht es aus der Arena auf den Steg
const SX = 5 * Math.sin(Math.PI / 3);   // so weit links hält die Gondel am Bonus-Steg
// Arena: die drei Putschautos fahren Schleifen mit gleicher Dauer (16.4 s), darum sagt ein einziges Auto, wann eine Lücke
// im ganzen Verkehr kommt (ausgesucht mit einer Simulation der Pfade): Tor -> Insel, wenn das gelbe Auto 6 s weg von
// [7.5, -5.5] bleibt; um den Mast herum (dort kommt keines hin); Insel -> Steg, wenn das rote 5 s weg von [-3, -17.5] bleibt.
// Steg: warten, bis der Karussell-Arm 2.2 s zur Seite bleibt. Doppelhammer: vor jedem Hammer warten, bis er oben bleibt.
// Riesenrad: einsteigen, wenn es noch mindestens 1.7 s hält.
const anfang = [
  { x: 0, z: -3, speed: 2, r: 0.5 },
  { x: 1.5, z: -7.7, speed: 4, r: 0.8, wait: ['frei', 'schieber', 2, 6, [7.5, -5.5, 3.5]] }, { x: 3, z: -12.4, speed: 4, r: 0.6 },
  { x: 3.3, z: -15.2, speed: 1.5, r: 0.4 }, { x: 6, z: -15.6, speed: 1.5, r: 0.4 },
  { x: 7.5, z: -20.3, speed: 4, r: 0.8, wait: ['frei', 'schieber', 0, 5, [-3, -17.5, 6]] }, { x: XR, z: -24.4, speed: 2.5, r: 0.5 },
  { x: XR, z: -31.5, speed: 5, r: 0.6, wait: ['frei', 'besen', 0, 2.2] }, { x: XR, z: -37, speed: 2, r: 0.5 },
  { x: XR, z: -41.75, speed: 5, r: 0.6, wait: ['frei', 'hammer', 0, 1.6] }, { x: XR + 0.7, z: -41.75, speed: 1.5, r: 0.4 },
  { x: XR, z: -41.75, speed: 1.5, r: 0.5 },
  { x: XR, z: -48, speed: 5, r: 0.6, wait: ['frei', 'hammer', 1, 2] },
  { x: XR, z: -53.2, speed: 2, r: 0.6 }, { x: XR, z: -56, speed: 2.5, r: 0.5, wait: ['frei', 'riesenrad', 0, 1.7] }
];

export default {
  c2: [
    // Hauptweg: oben aussteigen, über den Hochsteg im Zickzack, um den Rutschturm hinunter, über den Platz ins Ziel
    [...anfang, { x: XR, z: -59.5, speed: 2, r: 0.6, wait: ['gondel', [0, 3]] }, { x: XR, z: -64, speed: 2.5, r: 0.5 },
      { x: XR - 0.9, z: -66.9, speed: 2, r: 0.5 }, { x: XR - 3, z: -68, speed: 2, r: 0.5 }, { x: XR - 7, z: -68, speed: 2.5, r: 0.5 },
      { x: XR - 9.1, z: -68.9, speed: 2, r: 0.5 }, { x: XR - 10, z: -71, speed: 2, r: 0.5 }, { x: XR - 10, z: -73.5, speed: 2.5 },
      { follow: true, bisY: 5.6, speed: 5 }, { x: XR - 10, z: -79, speed: 3 }, { x: 0, z: -89, speed: 4 }],
    // Bonusstern: eine Gondel weiter fahren, über den Steg und die schmale Rampe zum Platz
    [...anfang, { x: XR - SX, z: -60, speed: 2, r: 0.6, wait: ['gondel', [0, 4]] }, { x: XR - SX, z: -79, speed: 2.5 }, { x: 0, z: -89, speed: 3 }]
  ]
};
