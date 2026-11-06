// Autopilot-Routen für src/levels/chilbi2.js (siehe tests/autopilot.js).
const XL = 0, XR = 9;                   // Arena: hier wird links bzw. rechts gequert
const SX = 5 * Math.sin(Math.PI / 3);   // so weit links hält die Gondel am Bonus-Steg
// Auto n ist eben vom Querungspunkt weggefahren (Mitte überquert), bis es zurückkommt, bleibt Zeit
const weg = (n, time, pause) => { const per = 2 * (time + pause), a = (pause + 0.5 * time) / per; return ['phase', ['schieber', n, a, a + 0.08]]; };
// Arena im Zickzack (links queren, Gasse nach rechts mit Stern links, rechts queren, Gasse nach links mit Stern rechts,
// links queren, hinaus nach rechts), Steg, Doppelhammer (zwischen den Hämmern warten), Einstieg ins Riesenrad
const anfang = [
  { x: 0, z: -3, speed: 3 }, { x: XL, z: -6.3, speed: 2, r: 0.5 },
  { x: XL, z: -11.75, speed: 4, r: 0.6, wait: weg(0, 1.6, 1.6) }, { x: -1.1, z: -11.75, speed: 2, r: 0.5 },
  { x: XR, z: -11.75, speed: 3, r: 0.5 },
  { x: XR, z: -17.25, speed: 4, r: 0.6, wait: weg(1, 2.4, 1.0) }, { x: 10.1, z: -17.25, speed: 2, r: 0.5 },
  { x: XL, z: -17.25, speed: 3, r: 0.5 },
  { x: XL, z: -22.6, speed: 4, r: 0.6, wait: weg(2, 1.1, 2.2) }, { x: XR, z: -22.6, speed: 3, r: 0.6 },
  { x: XR, z: -26, speed: 2.5, r: 0.6 }, { x: XR, z: -31, speed: 3, r: 0.6 }, { x: XR, z: -37, speed: 2, r: 0.5 },
  { x: XR, z: -41.75, speed: 5, r: 0.6, wait: ['phase', ['hammer', 0, 0.72, 0.85]] }, { x: XR + 0.7, z: -41.75, speed: 1.5, r: 0.4 },
  { x: XR, z: -41.75, speed: 1.5, r: 0.5 },
  { x: XR, z: -48, speed: 5, r: 0.6, wait: ['phase', ['hammer', 1, 0.72, 0.85]] },
  { x: XR, z: -53.2, speed: 2, r: 0.6 }, { x: XR, z: -56, speed: 2.5, r: 0.5, wait: ['phase', ['riesenrad', 0, 0, 0.2]] }
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
