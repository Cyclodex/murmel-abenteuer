// Autopilot-Routen für src/levels/chilbi3.js (siehe tests/autopilot.js).
const BAND = 13, KR = -76;
// Kehre: Punkt auf dem Bogen um [9, -85] mit Radius r, phi = Grad ab dem Anfang der Kehre
const kehre = (phi, r = 4) => ({ x: 9 - r * Math.cos(phi * Math.PI / 180), z: -85 - r * Math.sin(phi * Math.PI / 180) });
// Neben dem Bahnhof warten, bis der Mitnehmer still steht und noch mindestens 1.4 s stehen bleibt (oben hält er höchstens
// 1.2 s, also steht er dann unten), vor ihn rollen und hinaufschieben lassen
const lift = [
  { x: -4, z: -5, speed: 3 }, { x: -2.6, z: -5, speed: 1.5, r: 0.4 },
  { x: 0, z: -5, speed: 2.5, r: 0.4, wait: ['frei', 'schieber', 0, 1.4] }, { x: 0, z: -5.2, speed: 0.5, r: 0.3 },
  { x: 0, z: -12, speed: 3, r: 0.6 }, { x: 0.65, z: -16, speed: 3, r: 0.6 }, { x: 0, z: -20, speed: 3, r: 0.6 },
  { x: 0, z: -24, speed: 2, r: 0.6 }
];
// Abfahrt, Steg mit Turbo, Sprung über die Lücke, Looping, Bremssand, vor der Kehre warten, bis die Düse lange still
// bleibt, aufs Band, wenn der Wagen an einem Ende lange wartet, Kanone, Podest, Rampe, Ziel
const rest = [
  { x: 0, z: -27, speed: 2, r: 0.6 }, { x: 0, z: -36, free: true, r: 1.5 }, { x: 0.25, z: -39.5, speed: 5, r: 0.6 },
  { x: 0, z: -42, speed: 5, r: 0.6 }, { x: 0, z: -52, free: true, r: 2 }, { x: 0, z: -63, speed: 8, r: 1 },
  { x: 5, z: -69, free: true, r: 2.5 }, { x: 5.7, z: -75, speed: 3, r: 0.6 }, { x: 5, z: -81, speed: 2, r: 0.6 },
  { x: 5, z: -82.6, speed: 2, r: 0.4 }, { x: 5, z: -84.5, speed: 2, r: 0.5, wait: ['frei', 'knall', 0, 3.4] }, { ...kehre(45, 4.4), speed: 2, r: 0.5 }, { ...kehre(90, 4.6), speed: 2, r: 0.4 },
  { ...kehre(135, 4.2), speed: 1.5, r: 0.5 },
  { ...kehre(170), speed: 2, r: 0.4, wait: ['frei', 'schieber', 1, 4.8, [BAND, KR, 2.4]] },
  { x: BAND, z: -83, speed: 3, r: 0.5 }, { x: BAND + 0.4, z: -80, speed: 3, r: 0.5 }, { x: BAND, z: -70, speed: 3, r: 0.6 },
  { x: BAND, z: -63.5, speed: 2 }, { x: 21, z: -64.5, speed: 1.5, r: 0.6 }, { x: 21, z: -66, speed: 2, r: 0.5 },
  { x: 21, z: -74, speed: 2.5, r: 0.6 }, { x: 21, z: -80, speed: 3 }
];

export default {
  c3: [
    // Hauptweg
    [...lift, ...rest],
    // Bonusstern: oben über das schmale Brett nach links und zurück
    [...lift, { x: -1.5, z: -24, speed: 1.5, r: 0.4 }, { x: -4.8, z: -24, speed: 1.2, r: 0.4 }, { x: 0, z: -24, speed: 1.5, r: 0.5 }, ...rest]
  ]
};
