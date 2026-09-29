// Spielzimmer 3 💀: Kinderzimmer-Chaos. Knete (Schlamm) mit Klötzen, Murmelbahn-Trichter, Eis-Teppich mit Löchern,
// Gabelung: Schalter am Ende eines Eis-Stegs für die Brücke oder langer Knete-Umweg (Bonusstern),
// blauer Hammer, drehender Kreisel neben dem zweiten Schalter, Brücke hinauf zum Ziel.
export default {
  id: 'sz3s', schwer: 'sz3', name: 'Kinderzimmer-Chaos', emoji: '🧸', theme: 'spielzimmer',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    // Knete: bremst, Klötze im Weg
    { type: 'weg', from: [0, 0, -6], to: [0, 0, -14], width: 4, walls: 0.8, surface: 'schlamm' },
    { type: 'klotz', at: [-1.1, 0.6, -8.5], size: [1.6, 1.2, 1.6], look: 'klotz-rot' },
    { type: 'klotz', at: [1.1, 0.6, -12], size: [1.6, 1.2, 1.6], look: 'klotz-blau', yaw: 30 },
    // Rampe hinauf zum Rand des Murmelbahn-Trichters, hinten rollt man durch die Lücke hinaus
    { type: 'weg', from: [0, 0, -14], to: [0, 1.5, -21], width: 3, walls: 0.6 },
    { type: 'schuessel', at: [0, 0, -26.5], r: 2, R: 5, h: 1.5, rim: 0.5, art: 'schuessel', offen: [0] },
    { type: 'weg', from: [0, 0, -28], to: [0, 0, -36], width: 2.4 },
    { type: 'checkpoint', at: [0, 0, -34], size: [2.4, 3, 3] },
    // Eis-Teppich mit Löchern und Legosteinen
    {
      type: 'feld', at: [0, 0, -36], cell: 2, walls: 0.8, map: [
        '#####',
        '#eee#',
        '#e.e#',
        '.ewe.',
        '.eee.',
        'w#e#w'
      ]
    },
    { type: 'weg', from: [0, 0, -48], to: [0, 0, -52], width: 10 },
    { type: 'checkpoint', at: [0, 0, -49.5], size: [10, 3, 3] },
    // rechts: Eis-Steg ohne Rand mit dem Schalter für die Brücke
    { type: 'weg', from: [5, 0, -50], to: [13, 0, -50], width: 1.6, surface: 'eis' },
    { type: 'schalter', at: [11.5, 0, -50], id: 'b1' },
    { type: 'bruecke', from: [0, 0, -52], to: [0, 0, -62], width: 3, walls: 0.6, id: 'b1', drop: 12 },
    // links: langer Umweg durch die Knete (ohne Schalter)
    { type: 'weg', from: [-4, 0, -50], to: [-12, 0, -50], width: 3, surface: 'schlamm' },
    { type: 'weg', from: [-12, 0, -48.5], to: [-12, 0, -65.5], width: 3, surface: 'schlamm' },
    { type: 'weg', from: [-12, 0, -65], to: [-3, 0, -65], width: 3, surface: 'schlamm' },
    { type: 'weg', from: [0, 0, -62], to: [0, 0, -68], width: 6 },
    { type: 'checkpoint', at: [0, 0, -65], size: [6, 3, 3] },
    // schmale Strecke mit blauem Hammer
    { type: 'weg', from: [0, 0, -68], to: [0, 0, -80], width: 3 },
    { type: 'hammer', at: [0, 0, -74], side: 1, length: 4, size: [3.2, 1.4, 1.6], farbe: 'blau' },
    // Kreisel dreht sich in der Mitte, der zweite Schalter liegt in der Ecke
    { type: 'weg', from: [0, 0, -80], to: [0, 0, -90], width: 10, walls: 0.8 },
    { type: 'checkpoint', at: [-3.5, 0, -81], size: [3, 3, 2] },
    { type: 'balken', at: [0, 0, -85], length: 7, speed: 60, farbe: 'gelb' },
    { type: 'schalter', at: [-4, 0, -89], id: 'b2' },
    { type: 'bruecke', from: [0, 0, -90], to: [0, 2.5, -99], width: 3, walls: 0.6, id: 'b2', drop: 10 },
    { type: 'weg', from: [0, 2.5, -99], to: [0, 2.5, -106], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 2.5, -103] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -10] },
    { type: 'stern', at: [0, 0.9, -26.5] },
    { type: 'stern', at: [-2, 0.9, -43] },
    { type: 'stern', at: [11.5, 1.3, -50] },
    { type: 'stern', at: [0, 0.9, -57] },
    { type: 'stern', at: [0, 0.9, -74] },
    { type: 'stern', at: [0, 2.3, -95] },
    { type: 'stern', at: [-12, 0.9, -57], bonus: true },

    // Chaos auf dem Teppich
    { type: 'klotz', at: [-8, -8, -10], size: [2, 2, 2], look: 'abc', text: 'E', deko: true },
    { type: 'klotz', at: [-9, -8, -30], size: [2, 2, 2], look: 'abc', text: 'X', deko: true, yaw: 35 },
    { type: 'klotz', at: [10, -7.4, -30], size: [4, 3.2, 2], look: 'lego-gelb', deko: true, yaw: 20 },
    { type: 'klotz', at: [9, -7.4, -88], size: [4, 3.2, 2], look: 'lego-rot', deko: true, yaw: -30 },
    { type: 'deko', form: 'teddy', at: [9, -9, -12], yaw: 60, scale: 1.8 },
    { type: 'deko', form: 'auto', at: [-7, -9, -20], yaw: 110, farbe: 0x43A047 },
    { type: 'deko', form: 'wuerfel', at: [8, -9, -62], yaw: 15, farbe: 0xE53935 },
    { type: 'deko', form: 'wuerfel', at: [10.5, -9, -65], yaw: -20, farbe: 0x1E88E5 },
    { type: 'deko', form: 'kreisel', at: [-20, -9, -80], dreh: 150, scale: 1.4 },
    { type: 'deko', form: 'teddy', at: [-10, -9, -100], yaw: -40, scale: 1.5, farbe: 0xFFCC80 }
  ]
};
