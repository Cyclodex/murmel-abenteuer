// Schweiz 3: Schoggifabrik. Über die Sortierbänder ohne Rand, die abwechselnd nach links und nach rechts laufen, dann
// das Tafelband hinunter, über das zwei Schieber Schoggitafeln stossen. Der Schoggifluss trägt die Murmel mit und lässt
// sie über den Schoggifall auf ein schmales Sims fallen; aus der Wand stossen dort Stössel. Im Kühltunnel bläst der Wind
// quer über ein Band ohne Rand. Dann in den Abfülltrichter, unten durchs Rohr auf das Giessblech: leere Formen sind
// Löcher, dazwischen ist das Blech eingeseift. Das Ziel liegt in der Pralinenschachtel.
const SCHOGGI = 0x6B3A1E;
const SY = -4;                       // Sims, Kühltunnel und Anlauf zum Trichter: Höhe
const KZ = -65;                      // Kühltunnel: Mittellinie (Fahrt nach +x)
const T = [28.2, -9.35, -75.5];      // Abfülltrichter: Mitte des Lochs (Bande oben bei SY - 0.9, Anlauf bei SY)
const BY = T[1] - 4.65;              // Auffangschale mit Abfluss darunter: Höhe des Bodens
const GY = -19.5, GX = 47;           // Giessblech: Höhe und vordere Kante (Fahrt nach +x, Mitte bei z = T[2])
// Sortierbänder: quer zum Weg, abwechselnd nach rechts und nach links
const sortier = [0, 1, 2, 3, 4].map(k => {
  const z = -4.2 - 2.4 * k, s = k % 2 ? -1 : 1;
  return { type: 'band', from: [-1.5 * s, 0, z], to: [1.5 * s, 0, z], width: 2.4, speed: 2, grip: 2 };
});
// Stössel: kommt aus der Wand links und stösst quer über das Sims
const stoessel = (z, offset) => ({ type: 'schieber', from: [-1.6, SY, z], to: [0.4, SY, z], size: [1.6, 0.8, 1], time: 0.5, pause: 2, offset, look: 'stahl' });

export default {
  id: 'sch3', name: 'Schoggifabrik', emoji: '🍫', theme: 'schweiz', variante: 'schoggi',
  start: [0, 0, 2], killY: -27,
  parts: [
    // Warenannahme, dann die Sortierbänder ohne Rand
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 4, walls: 0.8, caps: 'start' },
    ...sortier,
    { type: 'weg', from: [0, 0, -15], to: [0, 0, -19], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -17], size: [3, 3, 2] },

    // Tafelband ohne Rand: zwei Schieber stossen Tafeln quer darüber, gegeneinander
    { type: 'band', from: [0, 0, -19], to: [0, 0, -29], width: 2, speed: 2, grip: 3 },
    { type: 'schieber', from: [-2.4, 0, -22], to: [2.4, 0, -22], size: [1.2, 0.5, 1.2], time: 1, pause: 1.2, look: 'schoggi' },
    { type: 'schieber', from: [2.4, 0, -25.5], to: [-2.4, 0, -25.5], size: [1.2, 0.5, 1.2], time: 1, pause: 1.2, offset: 3.4, look: 'schoggi-weiss' },
    { type: 'weg', from: [0, 0, -29], to: [0, 0, -33], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -31], size: [3, 3, 2] },

    // Schoggifluss und Schoggifall auf das Sims; links die Wand mit zwei Stösseln, rechts kein Rand
    { type: 'fluss', from: [0, 0, -33], to: [0, -1.5, -41], width: 2.4, speed: 4, banks: 0.6, farbe: SCHOGGI, dreck: 0.5 },
    { type: 'klotz', at: [0, -2.75, -41.08], size: [2.4, 2.1, 0.15], look: 'schoggi', deko: true }, // Schoggifall (nur Grafik)
    { type: 'weg', from: [0, SY, -41.2], to: [0, SY, -58], width: 1.6, look: 'stahl' },
    { type: 'wand', from: [-1, SY, -41.2], to: [-1, SY, -49.4], height: 2.2, look: 'stahl' },
    { type: 'wand', from: [-1, SY, -50.6], to: [-1, SY, -53.4], height: 2.2, look: 'stahl' },
    { type: 'wand', from: [-1, SY, -54.6], to: [-1, SY, -58], height: 2.2, look: 'stahl' },
    stoessel(-50, 0),
    stoessel(-54, 2.5),
    { type: 'checkpoint', at: [0, SY, -45.5], size: [1.6, 3, 1.2] },
    { type: 'weg', from: [0, SY, -58], to: [0, SY, -62], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, SY, -60], size: [3, 3, 2] },
    { type: 'kurve', at: [0, SY, -62], yaw: 0, turn: 90, radius: 3, width: 3, walls: 0.8 },

    // Kühltunnel: Band ohne Rand, die Ventilatoren blasen quer, erst nach links, dann nach rechts
    { type: 'band', from: [3, SY, KZ], to: [15, SY, KZ], width: 1.8, speed: 1.5, grip: 2 },
    { type: 'wind', at: [6.5, SY, KZ], size: [4, 3, 4], yaw: 0, strength: 3.5 },
    { type: 'wind', at: [11.5, SY, KZ], size: [4, 3, 4], yaw: 180, strength: 3.5 },
    ...[4, 9, 14].map(x => ({ type: 'klotz', at: [x, SY + 3.15, KZ], size: [0.4, 0.3, 5], look: 'stahl', deko: true })),
    { type: 'weg', from: [15, SY, KZ], to: [23, SY, KZ], width: 3.2, walls: 0.6 },
    { type: 'checkpoint', at: [18, SY, KZ], yaw: -90, size: [3.2, 3, 2] },

    // Anlauf schräg über den Rand in den Abfülltrichter, darunter die Auffangschale, durchs Rohr auf das Giessblech
    { type: 'weg', from: [23, SY, KZ], to: [T[0], SY, T[2] + 7.5], width: 3.2, walls: 0.6 },
    { type: 'trichter', at: T, R: 6, h: 3.5, loch: 0.9, rim: 1.2, farbe: SCHOGGI },
    { type: 'schuessel', at: [T[0], BY, T[2]], R: 4.5, h: 2, rim: 0.5, art: 'giessform', boden: 'rund', abfluss: true },
    { type: 'roehre', from: [T[0], BY, T[2]], down: true, to: [GX - 8.5, GY, T[2]], toYaw: -90, farbe: 0xB0BEC5 },
    { type: 'weg', from: [GX - 8.5, GY, T[2]], to: [GX, GY, T[2]], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [GX - 2.5, GY, T[2]], yaw: -90, size: [3, 3, 2] },

    // Giessblech: Reihen mit leeren Formen (Löcher), dazwischen eingeseift
    { type: 'feld', at: [GX, GY, T[2]], yaw: -90, cell: 1.6, walls: 0.6, look: 'schoggi', map: [
      '#####',
      '#.#.#',
      'ooooo',
      '.#.#.',
      'ooooo',
      '#.#.#',
      'ooooo',
      '.#.#.',
      '#####'
    ] },

    // Pralinenschachtel mit Goldfolie: Ziel
    { type: 'weg', from: [GX + 14.4, GY, T[2]], to: [GX + 20.4, GY, T[2]], width: 6, look: 'schoggi-weiss' },
    { type: 'wand', from: [GX + 14.4, GY, T[2] - 3.2], to: [GX + 20.4, GY, T[2] - 3.2], height: 1.2, look: 'folie' },
    { type: 'wand', from: [GX + 14.4, GY, T[2] + 3.2], to: [GX + 20.4, GY, T[2] + 3.2], height: 1.2, look: 'folie' },
    { type: 'wand', from: [GX + 20.6, GY, T[2] - 3.4], to: [GX + 20.6, GY, T[2] + 3.4], height: 1.2, look: 'folie' },
    { type: 'ziel', at: [GX + 17.4, GY, T[2]] },

    // Sterne: am linken Rand eines Sortierbands, hinter den Schiebern, auf dem Sims, im Kühltunnel, unter dem
    // Trichterloch (nur wer durch den Trichter fällt); Bonus am rechten Rand eines Sortierbands, das hinausschiebt
    { type: 'stern', at: [-0.9, 0.9, -11.4] },
    { type: 'stern', at: [-0.5, 0.9, -27.5] },
    { type: 'stern', at: [0.5, SY + 0.9, -45.5] },
    { type: 'stern', at: [9, SY + 0.9, KZ + 0.8] },
    { type: 'stern', at: [T[0], BY + 2.4, T[2]] },
    { type: 'stern', at: [1.25, 0.9, -9], bonus: true },

    // Warenannahme: Milchkannen und Schoggitafeln auf Paletten
    { type: 'klotz', at: [-4.2, -0.25, 1], size: [3, 0.5, 5], look: 'holz', deko: true },
    { type: 'deko', form: 'milchkanne', at: [-4.2, 0, 2.3], scale: 0.5 },
    { type: 'deko', form: 'milchkanne', at: [-4.2, 0, -0.3], scale: 0.5 },
    { type: 'klotz', at: [4.2, -0.25, 1], size: [3, 0.5, 5], look: 'holz', deko: true },
    { type: 'deko', form: 'tafel', at: [4.2, 0, 1], scale: 0.45 },
    { type: 'deko', form: 'tafel', at: [4.2, 0.36, 1], yaw: 25, scale: 0.45 },
    // Pralinen auf dem Nebenband, Kupferkessel neben dem Schoggifluss
    { type: 'klotz', at: [4.6, -0.25, -24], size: [1.8, 0.5, 10], look: 'stahl', deko: true },
    { type: 'deko', form: 'praline', at: [4.6, 0, -20.5], scale: 0.5 },
    { type: 'deko', form: 'praline', at: [4.6, 0, -23], scale: 0.5, farbe: 0xF3E5C0 },
    { type: 'deko', form: 'praline', at: [4.6, 0, -25.5], scale: 0.5, farbe: 0x3E2112 },
    { type: 'klotz', at: [4.8, -0.5, -36], size: [4.6, 1, 4.6], look: 'stahl', deko: true },
    { type: 'deko', form: 'kessi', at: [4.8, 0, -36], scale: 0.7 },
    // Pralinen in der Schachtel
    { type: 'deko', form: 'praline', at: [GX + 19.4, GY, T[2] - 2.2], scale: 0.5, fest: true },
    { type: 'deko', form: 'praline', at: [GX + 19.4, GY, T[2] + 2.2], scale: 0.5, fest: true, farbe: 0xF3E5C0 },
    { type: 'deko', form: 'praline', at: [GX + 15.6, GY, T[2] + 2.3], scale: 0.5, fest: true, farbe: 0x3E2112 }
  ]
};
