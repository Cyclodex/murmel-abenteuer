// Prüfstand, Bauteile der Welt Schweiz. Alle starten bei [0, 0, 2] und fahren nach -z. Level-Format wie in src/levels/*.js.
const lv = (id, name, parts, extra) => ({ id: 'p-' + id, name, emoji: '🔧', theme: 'schweiz', variante: 'uhrwerk', start: [0, 0, 2], killY: -8, parts, ...extra });
const anlauf = (z = -6, width = 5) => ({ type: 'weg', from: [0, 0, 6], to: [0, 0, z], width, walls: 0.8, caps: 'start' });

export default [
  // Zahnrad: vorne aufs Rad rollen, stillhalten und mitfahren, hinten wieder hinunter (die Achse in der Mitte versperrt den geraden Weg)
  lv('zahnrad', 'Zahnrad', [
    anlauf(-6, 4),
    { type: 'zahnrad', at: [0, 0, -10.05], r: 4, speed: 30 },
    { type: 'weg', from: [0, 0, -14.1], to: [0, 0, -24], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -21] }
  ]),
  // Pendel: schwingt quer über ein Wegstück ohne Rand, im richtigen Moment darunter durch
  lv('pendel', 'Pendel', [
    anlauf(-11, 4),
    { type: 'weg', from: [0, 0, -11], to: [0, 0, -17], width: 3 },
    { type: 'pendel', at: [0, 0, -14] },
    { type: 'weg', from: [0, 0, -17], to: [0, 0, -26], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -23] }
  ])
];
