// Spielzimmer 2 💀: Bücherregal-Kletterei. Zwei Plattformen nacheinander über die Lücke, Fahrstuhl aufs Regal,
// Gabelung (schmales Brett mit Klappe oder Regalbrett mit Hammer und Wippe), Klappen der Spielzeugkiste,
// Bücherstapel-Treppe hinunter und ein blauer Hammer vor dem Ziel.
export default {
  id: 'sz2s', schwer: 'sz2', name: 'Bücherregal-Kletterei', emoji: '📚', theme: 'spielzimmer',
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    // zwei Plattformen im Takt: umsteigen, wenn die erste vorne und die zweite hinten ist
    { type: 'plattform', from: [0, 0, -10], to: [0, 0, -16], size: [4, 4], time: 2, pause: 2.5 },
    { type: 'plattform', from: [0, 0, -20], to: [0, 0, -26], size: [4, 4], time: 2, pause: 2.5, offset: 4.5 },
    { type: 'weg', from: [0, 0, -28], to: [0, 0, -34], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -30], size: [5, 3, 3] },
    // Fahrstuhl aufs Regal
    { type: 'plattform', from: [0, 0, -36], to: [0, 5, -36], size: [4, 4], time: 2.5, pause: 3 },
    { type: 'weg', from: [0, 5, -38], to: [0, 5, -46], width: 5, thick: 5 },
    { type: 'weg', from: [0, 5, -46], to: [0, 5, -50], width: 5 },
    { type: 'checkpoint', at: [0, 5, -48], size: [5, 3, 4] },
    // Gabelung links: schmales Brett mit Klappe (kurz, riskant, Bonusstern)
    { type: 'weg', from: [0, 5, -50], to: [0, 5, -54.5], width: 1.4 },
    { type: 'falltuer', at: [0, 5, -56], size: [1.4, 3] },
    { type: 'weg', from: [0, 5, -57.5], to: [0, 5, -62], width: 1.4 },
    // Gabelung rechts: Regalbrett mit Hammer, Wippe, zurück über ein Brett
    { type: 'weg', from: [2.5, 5, -48], to: [10, 5, -48], width: 2.4 },
    { type: 'hammer', at: [6.5, 5, -48], yaw: -90, side: 1, length: 4, size: [2.8, 1.4, 1.6], farbe: 'gelb' },
    { type: 'weg', from: [12, 5, -46], to: [12, 5, -50], width: 4 },
    { type: 'wippe', at: [12, 5.695, -54], size: [3, 8], angle: 10, rim: 0.3 },
    { type: 'weg', from: [12, 5, -58], to: [12, 5, -67], width: 3 },
    { type: 'weg', from: [10.5, 5, -65], to: [4, 5, -65], width: 2.4 },
    // Platz, dann Klappen der Spielzeugkiste
    { type: 'weg', from: [0, 5, -62], to: [0, 5, -68], width: 8 },
    { type: 'checkpoint', at: [0, 5, -66], size: [8, 3, 3] },
    { type: 'weg', from: [0, 5, -68], to: [0, 5, -70], width: 3 },
    { type: 'falltuer', at: [0, 5, -71.5], size: [3, 3] },
    { type: 'weg', from: [0, 5, -73], to: [0, 5, -74.5], width: 3 },
    { type: 'falltuer', at: [0, 5, -76], size: [3, 3] },
    { type: 'weg', from: [0, 5, -77.5], to: [0, 5, -79], width: 3 },
    { type: 'falltuer', at: [0, 5, -80.5], size: [3, 3] },
    { type: 'weg', from: [0, 5, -82], to: [0, 5, -86], width: 4 },
    { type: 'checkpoint', at: [0, 5, -84], size: [4, 3, 3] },
    // Bücherstapel-Treppe hinunter
    { type: 'treppe', from: [0, 5, -86], to: [0, 0, -98], steps: 6, width: 4, walls: 0.6 },
    { type: 'weg', from: [0, 0, -98], to: [0, 0, -101], width: 4 },
    { type: 'checkpoint', at: [0, 0, -99.5], size: [4, 3, 3] },
    { type: 'weg', from: [0, 0, -101], to: [0, 0, -110], width: 3 },
    { type: 'hammer', at: [0, 0, -105.5], side: -1, length: 4, size: [3.2, 1.4, 1.6], farbe: 'blau', offset: 1.7 },
    { type: 'weg', from: [0, 0, -110], to: [0, 0, -117], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, 0, -114] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 0.9, -13] },
    { type: 'stern', at: [0, 0.9, -23] },
    { type: 'stern', at: [0, 5.9, -42] },
    { type: 'stern', at: [6.5, 5.9, -48] },
    { type: 'stern', at: [12, 6.6, -54] },
    { type: 'stern', at: [0, 5.9, -76] },
    { type: 'stern', at: [0, 0.9, -105.5] },
    { type: 'stern', at: [0, 5.9, -56], bonus: true },

    // Regal und Bücher, Spielzeug auf dem Teppich
    { type: 'klotz', at: [-7, -4, -50], size: [2, 10, 26], look: 'lego-blau', deko: true },
    { type: 'klotz', at: [-4, -3.4, -92], size: [3, 1.2, 4], look: 'klotz-rot', deko: true },
    { type: 'klotz', at: [-4, -2.2, -92], size: [2.8, 1.2, 3.6], look: 'klotz-gelb', deko: true, yaw: 8 },
    { type: 'klotz', at: [-4, -1, -92], size: [3, 1.2, 4], look: 'klotz-gruen', deko: true, yaw: -5 },
    { type: 'klotz', at: [5, -3.4, -95], size: [3, 1.2, 4], look: 'klotz-blau', deko: true },
    { type: 'klotz', at: [5, -2.2, -95], size: [3, 1.2, 4], look: 'klotz-rot', deko: true, yaw: 10 },
    { type: 'klotz', at: [7, -8, -20], size: [2, 2, 2], look: 'abc', text: 'D', deko: true },
    { type: 'deko', form: 'teddy', at: [-9, -9, -70], yaw: -70, scale: 2.2 },
    { type: 'deko', form: 'truhe', at: [6, -9, -76], yaw: 90, scale: 1.6, farbe: 0xE53935 },
    { type: 'deko', form: 'wuerfel', at: [8, -9, -100], yaw: 30, farbe: 0x1E88E5 },
    { type: 'deko', form: 'kreisel', at: [18, -9, -40], dreh: 100, scale: 1.5 }
  ]
};
