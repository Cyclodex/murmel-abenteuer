// Autopilot-Route für ws1 (Werkbank): durchs Sägemehl, das Brett hinauf, Kurve nach links, Schalter drücken und warten,
// bis das Messband ausgefahren ist, drüben in die Nische zum Bonusstern und ins Ziel.
export default [
  { x: 0, z: -3 }, { x: 0, z: -12 }, { x: 0, z: -15, speed: 3 }, { x: 0, z: -25 }, { x: 0, z: -27, speed: 3 },
  { x: -1.46, z: -31.54, speed: 3, r: 0.6 }, { x: -5, z: -33, speed: 3 }, { x: -8, z: -33, speed: 3 },
  { x: -13, z: -35.5, speed: 2, r: 0.6 }, { x: -15, z: -30.7, speed: 2 }, { x: -26, z: -30.7, speed: 3, wait: 'bridgeUp' },
  { x: -30.75, z: -31.2, speed: 3 }, { x: -30.75, z: -35.7, speed: 2, r: 0.5 }, { x: -30.75, z: -31.2, speed: 2 }, { x: -35, z: -30.7 }
];
