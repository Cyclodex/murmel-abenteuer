// Autopilot-Route für src/levels/schweiz2.js (Uhrwerk), siehe tests/autopilot.js.
const X = -9;
export default {
  sch2: [
    { x: 0, z: -4, speed: 3 },
    // erstes Zahnrad: drauf, mitfahren bis rechts, in die Nische zum Bonusstern, zurück aufs Rad, mitfahren bis hinten
    { x: 0, z: -7.6, speed: 2, r: 0.6 },
    { x: 6.2, z: -10.05, speed: 2.5, r: 0.7, wait: ['nahe', [2.4, -10.05, 1.2]] },
    { x: 2.6, z: -10.05, speed: 2, r: 0.6 },
    { x: 0, z: -15.5, speed: 3, wait: ['nahe', [0, -12.5, 1.2]] },
    { x: 0, z: -17.5, speed: 3 },
    // grosses Rad trägt nach links, dort hinüber aufs kleine, das trägt nach hinten
    { x: 0, z: -21.1, speed: 2, r: 0.6 },
    { x: X + 2.5, z: -24.1, speed: 2.5, r: 0.6, wait: ['nahe', [-2.9, -24.1, 1.2]] },
    { x: X, z: -29.6, speed: 3, wait: ['nahe', [X, -26.5, 1.2]] },
    { x: X, z: -32, speed: 3 },
    // Zifferblatt: in der Ecke vorne links warten, bis der Minutenzeiger vorbei ist, dann links herum (Stern bei 9 Uhr)
    { x: X - 5, z: -35, speed: 2, r: 0.6 },
    { x: X - 4.5, z: -40, speed: 4, r: 0.6, wait: ['balkenWeg', [X - 4.43, -40.78]] },
    { x: X, z: -47.5, speed: 4 },
    // Lift: einsteigen, wenn er gerade unten angekommen ist (dann bleibt genug Zeit), oben aussteigen
    { x: X, z: -51.2, speed: 2, r: 0.5 },
    { x: X, z: -54, speed: 2, r: 0.5, wait: ['phase', ['plattform', 0, 0.97, 0.07]] },
    { x: X, z: -57.5, speed: 2, wait: 'platAtTo' },
    // Pendel, Glockenhammer
    { x: X, z: -60.5, speed: 2, r: 0.6 },
    { x: X, z: -66.5, speed: 5, wait: ['phase', ['pendel', 0, 0.02, 0.1]] },
    { x: X, z: -70.5, speed: 2, r: 0.5 },
    { x: X, z: -76.5, speed: 5, wait: ['phase', ['hammer', 0, 0.72, 0.85]] },
    { x: X, z: -81.5 }
  ]
};
