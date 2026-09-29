// Spielzimmer 4 💀: Riesen-Holzbahn. Vom hohen Start eine schmale Abfahrt ohne Rand, Gabelung: Turbo und Looping
// (kurz, Bonusstern oben im Looping) oder Spirale hinunter (lang, sicher), Trichter auf ein schmales Brett mit Hammer,
// Plattform über die Lücke, Kurve ohne Rand, ein zweiter Looping und eine Klappe vor dem Ziel.
export default {
  id: 'sz4s', schwer: 'sz4', name: 'Riesen-Holzbahn', emoji: '🎠', theme: 'spielzimmer',
  start: [0, 10, 2], killY: -3,
  parts: [
    { type: 'weg', from: [0, 10, 6], to: [0, 10, -4], width: 5, walls: 0.8, caps: 'start' },
    // schmale Abfahrt ohne Rand
    { type: 'weg', from: [0, 10, -4], to: [0, 7, -16], width: 3 },
    { type: 'weg', from: [0, 7, -16], to: [0, 7, -22], width: 9 },
    { type: 'checkpoint', at: [0, 7, -18], size: [9, 3, 3] },
    // Gabelung rechts: Turbo und Looping, dann Rampe hinunter
    { type: 'weg', from: [3, 7, -22], to: [3, 7, -27], width: 3, walls: 0.8 },
    { type: 'turbo', at: [3, 7, -25.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [3, 7, -27], radius: 3, width: 3, shift: 5 },
    { type: 'weg', from: [8, 7, -27], to: [8, 7, -37], width: 3, walls: 0.8 },
    { type: 'weg', from: [8, 7, -37], to: [8, 3, -49], width: 3 },
    // Gabelung links: Spirale hinunter und lange Gerade mit Klötzen
    { type: 'spirale', at: [-3.5, 7, -22], turn: -360, radius: 4, rise: -4, width: 3, walls: 0.8 },
    { type: 'weg', from: [-3.5, 3, -22], to: [-3.5, 3, -49], width: 3, walls: 0.8 },
    { type: 'klotz', at: [-4.3, 3.6, -30], size: [1.4, 1.2, 1.4], look: 'klotz-gelb' },
    { type: 'klotz', at: [-2.7, 3.6, -38], size: [1.4, 1.2, 1.4], look: 'klotz-gruen' },
    // Platz, dann Trichter auf ein schmales Brett mit Hammer
    { type: 'weg', from: [2, 3, -49], to: [2, 3, -55], width: 16 },
    { type: 'checkpoint', at: [2, 3, -52], size: [16, 3, 3] },
    { type: 'weg', from: [2, 3, -55], to: [2, 3, -63], width: 6 },
    { type: 'wand', from: [-1.2, 3, -55], to: [-1.2, 3, -59] },
    { type: 'wand', from: [5.2, 3, -55], to: [5.2, 3, -59] },
    { type: 'wand', from: [-1.2, 3, -59], to: [0.9, 3, -63] },
    { type: 'wand', from: [5.2, 3, -59], to: [3.1, 3, -63] },
    { type: 'weg', from: [2, 3, -63], to: [2, 3, -75], width: 1.6 },
    { type: 'hammer', at: [2, 3, -69], side: 1, length: 4, size: [2.2, 1.4, 1.6] },
    { type: 'weg', from: [2, 3, -75], to: [2, 3, -79], width: 4 },
    { type: 'checkpoint', at: [2, 3, -77], size: [4, 3, 3] },
    // Plattform über die Lücke, schmale Landung, Kurve ohne Rand
    { type: 'plattform', from: [2, 3, -81], to: [2, 3, -87], size: [3.5, 4], time: 2.5, pause: 2.5 },
    { type: 'weg', from: [2, 3, -89], to: [2, 3, -93], width: 3 },
    { type: 'kurve', at: [2, 3, -93], yaw: 0, turn: 90, radius: 5, width: 3 },
    // zweiter Looping, Ausfahrt 5 m weiter rechts
    { type: 'weg', from: [7, 3, -98], to: [13, 3, -98], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [8.5, 3, -98], yaw: -90, size: [3, 3, 3] },
    { type: 'turbo', at: [11.5, 3, -98], yaw: -90, size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [13, 3, -98], yaw: -90, radius: 3, width: 3, shift: 5 },
    { type: 'weg', from: [13, 3, -93], to: [17, 3, -93], width: 4, walls: 0.8 },
    { type: 'falltuer', at: [18.5, 3, -93], yaw: -90, size: [4, 3] },
    { type: 'weg', from: [20, 3, -93], to: [21, 3, -93], width: 4, walls: 0.8 },
    { type: 'weg', from: [21, 3, -93], to: [29, 3, -93], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [26, 3, -93] },

    { type: 'stern', at: [0, 10.9, -1] },
    { type: 'stern', at: [0, 9.4, -10] },
    { type: 'stern', at: [-11.5, 5.9, -22] },
    { type: 'stern', at: [-3.5, 3.9, -34] },
    { type: 'stern', at: [2, 3.9, -69] },
    { type: 'stern', at: [2, 3.9, -84] },
    { type: 'stern', at: [3.46, 3.9, -96.54] },
    { type: 'stern', at: [13, 8.3, -95.5] },
    { type: 'stern', at: [5.5, 12.3, -27], bonus: true },

    // Spielzeug unter der Bahn
    { type: 'klotz', at: [12, -3, -12], size: [2, 2, 2], look: 'abc', text: 'H', deko: true },
    { type: 'klotz', at: [14.5, -3, -12.5], size: [2, 2, 2], look: 'abc', text: 'O', deko: true, yaw: 15 },
    { type: 'klotz', at: [17, -3, -12], size: [2, 2, 2], look: 'abc', text: 'L', deko: true, yaw: -10 },
    { type: 'klotz', at: [19.5, -3, -12.5], size: [2, 2, 2], look: 'abc', text: 'Z', deko: true },
    { type: 'klotz', at: [-14, -2.4, -60], size: [4, 3.2, 2], look: 'lego-rot', deko: true, yaw: 25 },
    { type: 'deko', form: 'teddy', at: [-12, -4, -6], yaw: -50, scale: 1.8 },
    { type: 'deko', form: 'auto', at: [16, -4, -60], yaw: 20, farbe: 0xFDD835 },
    { type: 'deko', form: 'kreisel', at: [-8, -4, -80], dreh: 130, scale: 1.5 },
    { type: 'deko', form: 'wuerfel', at: [22, -4, -80], yaw: 40, farbe: 0x43A047 },
    { type: 'deko', form: 'teddy', at: [34, -4, -100], yaw: -100, scale: 1.4, farbe: 0xFFCC80 }
  ]
};
