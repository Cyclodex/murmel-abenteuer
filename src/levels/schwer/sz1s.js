// Spielzimmer 1 💀: Bauklotz-Stadt. Kurven ohne Rand, Strassenkreuzung mit Spielzeugautos (Schieber),
// Weggabelung (schmaler Balken mit Hammer oder Lego-Strassennetz mit Löchern), Bauklotz-Turm (Dominos),
// gelber Hammer, Turbo-Rampe aufs Dach und ein drehender Kreisel vor dem Ziel.
export default {
  id: 'sz1s', schwer: 'sz1', name: 'Bauklotz-Stadt', emoji: '🏙️', theme: 'spielzimmer',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    // schmale Rechtskurve ohne Rand
    { type: 'kurve', at: [0, 0, -8], yaw: 0, turn: 90, radius: 5, width: 3 },
    // Strassenkreuzung: zwei Spielzeugautos fahren quer über die schmale Strasse
    { type: 'weg', from: [5, 0, -13], to: [20, 0, -13], width: 3 },
    { type: 'weg', from: [10, 0, -7.5], to: [10, 0, -18.5], width: 2.4 },
    { type: 'weg', from: [15, 0, -7.5], to: [15, 0, -18.5], width: 2.4 },
    { type: 'schieber', from: [10, 0, -8.5], to: [10, 0, -17.5], size: [2, 1.4, 3.6], time: 1.6, pause: 1.6, look: 'klotz-rot' },
    { type: 'schieber', from: [15, 0, -17.5], to: [15, 0, -8.5], size: [2, 1.4, 3.6], time: 1.6, pause: 1.6, offset: 4.3, look: 'klotz-blau' },
    { type: 'checkpoint', at: [18.5, 0, -13], yaw: -90, size: [3, 3, 3] },
    // Linkskurve zum Stadtplatz
    { type: 'kurve', at: [20, 0, -13], yaw: -90, turn: -90, radius: 4, width: 3 },
    { type: 'weg', from: [24, 0, -17], to: [24, 0, -23], width: 12 },
    { type: 'checkpoint', at: [24, 0, -19.5], size: [12, 3, 3] },
    // Gabelung links: schmaler Balken mit Hammer (kurz, riskant, Bonusstern)
    { type: 'weg', from: [19.5, 0, -23], to: [19.5, 0, -45], width: 1.6 },
    { type: 'hammer', at: [19.5, 0, -33], side: -1, length: 4, size: [2.2, 1.4, 1.6], farbe: 'blau' },
    // Gabelung rechts: Strassennetz aus Legoplatten mit Löchern und Mauersteinen (lang, sicherer)
    {
      type: 'feld', at: [26, 0, -23], cell: 2, walls: 0.8, map: [
        '####',
        'w..#',
        '####',
        '#.w.',
        '#..w',
        '##.w',
        '.#..',
        '.#w.',
        '.###',
        'ww.#',
        '..##'
      ]
    },
    // zweiter Platz, dann der Bauklotz-Turm (Dominos) in der Gasse
    { type: 'weg', from: [24, 0, -45], to: [24, 0, -51], width: 12 },
    { type: 'checkpoint', at: [24, 0, -48], size: [12, 3, 3] },
    { type: 'weg', from: [24, 0, -51], to: [24, 0, -64], width: 5, walls: 0.8 },
    { type: 'domino', from: [24, 0, -54], to: [24, 0, -61.2], count: 7, size: [3.6, 1.8, 0.3] },
    { type: 'kurve', at: [24, 0, -64], yaw: 0, turn: -90, radius: 5, width: 3 },
    // schmale Gasse mit gelbem Hammer
    { type: 'weg', from: [19, 0, -69], to: [5, 0, -69], width: 3 },
    { type: 'checkpoint', at: [17.5, 0, -69], yaw: 90, size: [3, 3, 3] },
    { type: 'hammer', at: [12, 0, -69], yaw: 90, side: 1, length: 4, size: [3.2, 1.4, 1.6], farbe: 'gelb' },
    // Turbo und Rampe aufs Dach, Rechtskurve ohne Rand
    { type: 'turbo', at: [6, 0, -69], yaw: 90, size: [2.6, 2], speed: 9 },
    { type: 'weg', from: [5, 0, -69], to: [-5, 3, -69], width: 3, walls: 0.6 },
    { type: 'weg', from: [-5, 3, -69], to: [-7, 3, -69], width: 3, walls: 0.6 },
    { type: 'kurve', at: [-7, 3, -69], yaw: 90, turn: 90, radius: 5, width: 3 },
    { type: 'weg', from: [-12, 3, -74], to: [-12, 3, -80], width: 3 },
    { type: 'checkpoint', at: [-12, 3, -76], size: [3, 3, 3] },
    // Kreisel dreht sich auf dem Dach
    { type: 'weg', from: [-12, 3, -80], to: [-12, 3, -88], width: 6 },
    { type: 'balken', at: [-12, 3, -84], length: 5, speed: 50, farbe: 'lila' },
    { type: 'weg', from: [-12, 3, -88], to: [-12, 3, -91], width: 3 },
    { type: 'weg', from: [-12, 3, -91], to: [-12, 3, -98], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [-12, 3, -95] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [1.46, 0.9, -11.54] },
    { type: 'stern', at: [12.5, 0.9, -13] },
    { type: 'stern', at: [23, 0.9, -36] },
    { type: 'stern', at: [24, 0.9, -58] },
    { type: 'stern', at: [12, 0.9, -69] },
    { type: 'stern', at: [-10.54, 3.9, -70.46] },
    { type: 'stern', at: [-12, 3.9, -89.5] },
    { type: 'stern', at: [19.5, 0.9, -38], bonus: true },

    // Stadt aus Bauklötzen auf dem Teppich
    { type: 'klotz', at: [33, -4, -30], size: [4, 10, 4], look: 'lego-blau', deko: true },
    { type: 'klotz', at: [33, -5, -40], size: [4, 8, 4], look: 'lego-gelb', deko: true },
    { type: 'klotz', at: [14, -3.5, -30], size: [3, 11, 3], look: 'lego-rot', deko: true },
    { type: 'klotz', at: [30, -5.5, -60], size: [4, 7, 5], look: 'lego-gruen', deko: true },
    { type: 'klotz', at: [-4, -4, -80], size: [4, 10, 4], look: 'lego-rot', deko: true },
    { type: 'klotz', at: [-7, -8, -4], size: [2, 2, 2], look: 'abc', text: 'S', deko: true },
    { type: 'klotz', at: [-4.5, -8, -4], size: [2, 2, 2], look: 'abc', text: 'T', deko: true, yaw: 10 },
    { type: 'klotz', at: [-2, -8, -5], size: [2, 2, 2], look: 'abc', text: 'A', deko: true, yaw: -15 },
    { type: 'klotz', at: [0.5, -8, -5.5], size: [2, 2, 2], look: 'abc', text: 'D', deko: true },
    { type: 'klotz', at: [3, -8, -5], size: [2, 2, 2], look: 'abc', text: 'T', deko: true, yaw: 20 },
    { type: 'deko', form: 'auto', at: [8, -9, -3], yaw: 30 },
    { type: 'deko', form: 'auto', at: [20, -9, -4], yaw: -20, farbe: 0x1E88E5 },
    { type: 'deko', form: 'teddy', at: [-8, -9, -45], yaw: -60, scale: 1.6 },
    { type: 'deko', form: 'kreisel', at: [8, -9, -52], dreh: 120, scale: 1.4 },
    { type: 'deko', form: 'wuerfel', at: [2, -9, -80], yaw: 25, farbe: 0xE53935 }
  ]
};
