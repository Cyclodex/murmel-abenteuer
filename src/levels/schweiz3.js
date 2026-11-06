// Schweiz 3: Schoggifabrik. Von der Warenannahme übers Förderband unter dem Stempel durch, gegen das Band, das
// zurückschiebt, in den Schoggifluss (macht die Murmel braun) und den Schoggifall hinunter, durch den Kühltunnel
// (bläst sie wieder sauber), über das Giessblech mit den leeren Formen, das Band hoch in den Abfülltrichter,
// unten in die Pralinenform und hinaus in die Pralinenschachtel.
const SCHOGGI = 0x6B3A1E;
const Y1 = -5.7;                  // Halle unten: Grund am Ende des Schoggiflusses, Kühltunnel, Giessblech
const Z1 = -57.2;                 // Mittellinie der Halle unten (Fahrt nach +x)
const T = [65.2, -8.05, -67.7];   // Abfülltrichter: Mitte des Lochs (Bande oben bei y = -3.6, Anlauf bei -2.7), Masse wie in Küche 3
const SY = -12.7;                 // Pralinenform darunter: Höhe des Bodens
export default {
  id: 'sch3', name: 'Schoggifabrik', emoji: '🍫', theme: 'schweiz', variante: 'schoggi',
  start: [0, 0, 2], killY: -19,
  parts: [
    // Warenannahme, Förderband
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'band', from: [0, 0, -6], to: [0, 0, -16], width: 4, walls: 0.8, speed: 5 },
    // Stempel presst die Schoggi flach: abwarten, bis er hochgeht
    { type: 'weg', from: [0, 0, -16], to: [0, 0, -26], width: 3, walls: 0.8 },
    { type: 'wand', from: [-2.2, 0, -16], to: [-1.7, 0, -16] },
    { type: 'wand', from: [1.7, 0, -16], to: [2.2, 0, -16] },
    { type: 'hammer', at: [0, 0, -21.5], side: 1, length: 4, size: [2.6, 1.4, 2], farbe: 'gelb', offset: 0.6 },
    { type: 'klotz', at: [0, 0.02, -21.5], size: [2.4, 0.04, 1.8], look: 'schoggi', deko: true },
    // dieses Band läuft zurück: dagegen rollen
    { type: 'band', from: [0, 0, -36], to: [0, 0, -26], width: 3, walls: 0.8, speed: 1, grip: 1 },
    // Podest vor dem Schoggifluss, links eine Nische
    { type: 'weg', from: [0, 0, -36], to: [0, 0, -43], width: 5 },
    { type: 'wand', from: [-2.7, 0, -36], to: [-1.7, 0, -36] },
    { type: 'wand', from: [1.7, 0, -36], to: [2.7, 0, -36] },
    { type: 'wand', from: [2.7, 0, -36], to: [2.7, 0, -43] },
    { type: 'wand', from: [-2.7, 0, -36], to: [-2.7, 0, -39.25] },
    { type: 'wand', from: [-2.7, 0, -41.75], to: [-2.7, 0, -43] },
    { type: 'wand', from: [-2.7, 0, -43], to: [-2, 0, -43] },
    { type: 'wand', from: [2, 0, -43], to: [2.7, 0, -43] },
    { type: 'nische', at: [-2.5, 0, -40.5], yaw: 90, depth: 3, look: 'schoggi-dunkel' },
    { type: 'checkpoint', at: [0, 0, -37.5], size: [5, 3, 3] },

    // Schoggifluss: trägt die Murmel mit und macht sie braun; am Ende der Schoggifall hinunter in den Querfluss
    { type: 'fluss', from: [0, 0, -43], to: [0, -2, -55], width: 3.6, speed: 4, farbe: SCHOGGI, dreck: 0.5 },
    { type: 'fluss', from: [-2.2, -4.2, Z1], to: [10, -5, Z1], width: 4, speed: 4, banks: 1.5, farbe: SCHOGGI, dreck: 0.5 },
    { type: 'wand', from: [-2.4, -4.9, Z1 - 2.4], to: [-2.4, -4.9, Z1 + 2.4], height: 2.2, look: 'ufer' },
    { type: 'klotz', at: [0, -3.2, -55.33], size: [3.6, 2.4, 0.15], look: 'schoggi', deko: true }, // Schoggifall (nur Grafik)
    // Spritzschutz gegenüber dem Schoggifall: wer weit fliegt, prallt ab und fällt in den Fluss
    { type: 'wand', from: [-2.6, -2.7, Z1 - 2.6], to: [4, -2.7, Z1 - 2.6], height: 2.5, look: 'stahl' },
    { type: 'wand', from: [-2.8, -2.7, Z1 - 2.6], to: [-2.8, -2.7, Z1 + 2], height: 2.5, look: 'stahl' },

    // Kühltunnel: Ventilatoren blasen von beiden Seiten und putzen die Schoggi weg
    { type: 'weg', from: [10, Y1, Z1], to: [14, Y1, Z1], width: 4, walls: 0.8 },
    { type: 'weg', from: [14, Y1, Z1], to: [22, Y1, Z1], width: 4, look: 'stahl' },
    { type: 'wand', from: [14, Y1, Z1 - 2.2], to: [22, Y1, Z1 - 2.2], height: 3, look: 'stahl' },
    { type: 'wand', from: [14, Y1, Z1 + 2.2], to: [22, Y1, Z1 + 2.2], height: 3, look: 'stahl' },
    { type: 'wind', at: [16.2, Y1, Z1], size: [3, 3, 4], yaw: 0, strength: 5 },
    { type: 'wind', at: [19.8, Y1, Z1], size: [3, 3, 4], yaw: 180, strength: 5 },
    { type: 'klotz', at: [14.2, Y1 + 3.15, Z1], size: [0.4, 0.3, 4.8], look: 'stahl', deko: true },
    { type: 'klotz', at: [18, Y1 + 3.15, Z1], size: [0.4, 0.3, 4.8], look: 'stahl', deko: true },
    { type: 'klotz', at: [21.8, Y1 + 3.15, Z1], size: [0.4, 0.3, 4.8], look: 'stahl', deko: true },
    { type: 'weg', from: [22, Y1, Z1], to: [26, Y1, Z1], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [24, Y1, Z1], yaw: -90, size: [5, 3, 3] },

    // Giessblech: die leeren Formen sind Löcher, in Schlangenlinie darum herum
    { type: 'feld', at: [26, Y1, Z1], yaw: -90, cell: 2, walls: 0.8, look: 'schoggi', map: [
      '#####',
      '.##..',
      '#####',
      '...##',
      '#####',
      '.##..',
      '#####'
    ] },
    { type: 'wand', from: [25.8, Y1, Z1 - 5.4], to: [25.8, Y1, Z1 - 2.9] },
    { type: 'wand', from: [25.8, Y1, Z1 + 2.9], to: [25.8, Y1, Z1 + 5.4] },
    { type: 'wand', from: [40.2, Y1, Z1 - 5.4], to: [40.2, Y1, Z1 - 2.9] },
    { type: 'wand', from: [40.2, Y1, Z1 + 2.9], to: [40.2, Y1, Z1 + 5.4] },
    { type: 'weg', from: [40, Y1, Z1], to: [44, Y1, Z1], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [42, Y1, Z1], yaw: -90, size: [5, 3, 3] },

    // Band hoch, Anlauf und schräg über den Rand in den Abfülltrichter, darunter fängt die Pralinenform die Murmel auf
    { type: 'band', from: [44, Y1, Z1], to: [56, Y1 + 3, Z1], width: 4, walls: 0.8 },
    { type: 'weg', from: [56, Y1 + 3, Z1], to: [60, Y1 + 3, Z1], width: 3.2, walls: 0.6 },
    { type: 'checkpoint', at: [58, Y1 + 3, Z1], yaw: -90, size: [3.2, 3, 2] },
    { type: 'weg', from: [60, Y1 + 3, Z1], to: [T[0], Y1 + 3, Z1 - 3], width: 3.2, walls: 0.6 },
    { type: 'trichter', at: T, R: 6, h: 3.5, loch: 0.9, rim: 1.2, farbe: SCHOGGI },
    { type: 'schuessel', at: [T[0], SY, T[2]], r: 2, R: 4.5, h: 2, rim: 0.5, art: 'giessform', offen: [-90] },
    { type: 'weg', from: [T[0] + 1.9, SY, T[2]], to: [T[0] + 8, SY, T[2]], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [T[0] + 5.5, SY, T[2]], yaw: -90, size: [3, 3, 2] },
    // Pralinenschachtel mit Goldfolie: Ziel
    { type: 'weg', from: [T[0] + 8, SY, T[2]], to: [T[0] + 14, SY, T[2]], width: 6, look: 'schoggi-weiss' },
    { type: 'wand', from: [T[0] + 8, SY, T[2] - 3.2], to: [T[0] + 14, SY, T[2] - 3.2], height: 1.2, look: 'folie' },
    { type: 'wand', from: [T[0] + 8, SY, T[2] + 3.2], to: [T[0] + 14, SY, T[2] + 3.2], height: 1.2, look: 'folie' },
    { type: 'wand', from: [T[0] + 14.2, SY, T[2] - 3.4], to: [T[0] + 14.2, SY, T[2] + 3.4], height: 1.2, look: 'folie' },
    { type: 'wand', from: [T[0] + 8, SY, T[2] - 3.2], to: [T[0] + 8, SY, T[2] - 1.7], height: 1.2, look: 'folie' },
    { type: 'wand', from: [T[0] + 8, SY, T[2] + 1.7], to: [T[0] + 8, SY, T[2] + 3.2], height: 1.2, look: 'folie' },
    { type: 'ziel', at: [T[0] + 11, SY, T[2]] },

    { type: 'stern', at: [0, 0.9, -11] },
    { type: 'stern', at: [0, 0.9, -31] },
    { type: 'stern', at: [5, -4.5, Z1] },
    { type: 'stern', at: [33, Y1 + 0.9, Z1 + 2.8] },
    // unter dem Trichterloch: nur wer durch den Trichter fällt, holt ihn
    { type: 'stern', at: [T[0], SY + 2.4, T[2]] },
    { type: 'stern', at: [-4.6, 0.9, -40.5], bonus: true },

    // Warenannahme: Milchkannen und Schoggitafeln auf Paletten
    { type: 'klotz', at: [-4.7, -0.25, 1], size: [3, 0.5, 5], look: 'holz', deko: true },
    { type: 'deko', form: 'milchkanne', at: [-4.7, 0, 2.3], scale: 0.5 },
    { type: 'deko', form: 'milchkanne', at: [-4.7, 0, -0.3], scale: 0.5 },
    { type: 'klotz', at: [4.7, -0.25, 1], size: [3, 0.5, 5], look: 'holz', deko: true },
    { type: 'deko', form: 'tafel', at: [4.7, 0, 1], scale: 0.45 },
    { type: 'deko', form: 'tafel', at: [4.7, 0.36, 1], yaw: 25, scale: 0.45 },
    // Pralinen fahren auf dem Nebenband mit, Tafeln neben dem Stempel
    { type: 'klotz', at: [3.6, -0.25, -11], size: [1.8, 0.5, 10], look: 'stahl', deko: true },
    { type: 'deko', form: 'praline', at: [3.6, 0, -7.5], scale: 0.5 },
    { type: 'deko', form: 'praline', at: [3.6, 0, -10], scale: 0.5, farbe: 0xF3E5C0 },
    { type: 'deko', form: 'praline', at: [3.6, 0, -12.5], scale: 0.5, farbe: 0x3E2112 },
    { type: 'deko', form: 'praline', at: [3.6, 0, -15], scale: 0.5 },
    { type: 'klotz', at: [-3.4, -0.25, -21.5], size: [2.4, 0.5, 6], look: 'stahl', deko: true },
    { type: 'deko', form: 'tafel', at: [-3.4, 0, -21.5], scale: 0.4 },
    { type: 'klotz', at: [-3.3, -0.25, -31], size: [2.4, 0.5, 8], look: 'stahl', deko: true },
    { type: 'deko', form: 'tafel', at: [-3.3, 0, -28.5], scale: 0.35, farbe: 0x3E2112 },
    { type: 'deko', form: 'tafel', at: [-3.3, 0, -33.5], scale: 0.35, farbe: 0xF3E5C0 },
    // Schoggihase neben der Nische, Kupferkessel am Schoggifluss
    { type: 'klotz', at: [-4.6, -0.25, -37], size: [2.4, 0.5, 2.4], look: 'holz', deko: true },
    { type: 'deko', form: 'schoggihase', at: [-4.6, 0, -37], yaw: -90, scale: 0.6 },
    { type: 'klotz', at: [5.4, -0.5, -41], size: [4.6, 1, 4.6], look: 'stahl', deko: true },
    { type: 'deko', form: 'kessi', at: [5.4, 0, -41], scale: 0.7 },
    // Pralinen in der Schachtel
    { type: 'deko', form: 'praline', at: [T[0] + 13, SY, T[2] - 2.2], scale: 0.5, fest: true },
    { type: 'deko', form: 'praline', at: [T[0] + 13, SY, T[2] + 2.2], scale: 0.5, fest: true, farbe: 0xF3E5C0 },
    { type: 'deko', form: 'praline', at: [T[0] + 9.2, SY, T[2] + 2.3], scale: 0.5, fest: true, farbe: 0x3E2112 }
  ]
};
