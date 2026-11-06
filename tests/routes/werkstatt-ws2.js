// Autopilot-Route für ws2 «Sägewerk» (Wegpunkte, siehe tests/autopilot.js).
export default [
  // Start, Sägemehl, rechts um die Ecke auf den Sägetisch (ausserhalb des Sägeblatts bleiben: Mitte [0, -18], Reichweite 5.5)
  { x: 0, z: -6 }, { x: 0, z: -10, speed: 3 }, { x: 1.7, z: -12.4, speed: 2, r: 0.5 },
  // Nische rechts vorne: Bonusstern
  { x: 4.5, z: -13.75, speed: 2, r: 0.6 }, { x: 8.5, z: -13.75, speed: 2, r: 0.5 }, { x: 4, z: -14, speed: 2 },
  // warten, bis das Sägeblatt vorbei ist, dann am Stern vorbei und hinten hinaus (wie Küche 2)
  { x: 3.5, z: -18, speed: 4, r: 0.6, wait: ['balkenWeg', [3.8, -15.5]] }, { x: 0, z: -24, speed: 4 },
  // Nagelwand: oben hineinrollen, unten im Sägemehl weiter zum Stern
  { x: 0, z: -28, speed: 3 }, { x: 0, z: -33, speed: 2, r: 0.8 }, { x: 0, z: -37, speed: 3, r: 0.6 },
  // nach rechts hinaus, Schleifband hinauf, Ziel
  { x: 9, z: -37, speed: 3 }, { x: 14, z: -37 }, { x: 24, z: -37, speed: 4 }, { x: 31.5, z: -37 }
];
