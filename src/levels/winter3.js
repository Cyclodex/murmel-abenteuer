// Winter 3: Skischanze. Oben auf dem Turm geht die Startschranke im Takt auf und zu: wer beim Zugehen darunter ist,
// wird vom schmalen Startsteg geschoben. Der Anlauf ist breit, der Schanzentisch aber schmal: genau zentrieren, sonst
// fällt man neben dem Tisch hinunter. Absprung mit festem Schwung, Aufsprunghang schmal und ohne Rand.
// Dann über den Grat (schmal, ohne Rand, mit Eisplatten) zum Eiskanal: Doppelschranke mit zwei verschiedenen
// Takten, dazwischen warten. Im Eiskanal Tempo halten: die zweite Steilkurve steigt an, wer zu langsam ist,
// rollt zurück.
export default {
  id: 'wi3', name: 'Skischanze', emoji: '🎿', theme: 'winter',
  start: [0, 0, 2], killY: -38,
  parts: [
    // Startturm mit Hütte
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -3], width: 4, walls: 0.8, caps: 'start' },
    { type: 'klotz', at: [-7.7, -0.5, 1.5], size: [9.2, 1, 9], look: 'schneeblock', deko: true },
    { type: 'deko', form: 'huette', at: [-7.9, 0, 1.5], yaw: -90 },
    { type: 'deko', form: 'schlitten', at: [-4.4, 0, -1.6], scale: 0.8 },
    { type: 'klotz', at: [0, -10, 1.5], size: [4, 19, 9], look: 'stamm', deko: true },
    // Startschranke über dem schmalen Startsteg
    { type: 'weg', from: [0, 0, -3], to: [0, 0, -7], width: 2.4 },
    { type: 'schieber', from: [0, 0, -5], to: [2.9, 0, -5], size: [2.6, 1, 0.6], time: 0.7, pause: 1.6, look: 'stamm' },
    { type: 'klotz', at: [3.6, 0.7, -5], size: [0.4, 1.4, 0.4], look: 'stamm', deko: true },

    // Anlauf breit, Schanzentisch schmal (zentrieren!), Absprung mit festem Schwung
    { type: 'weg', from: [0, 0, -7], to: [0, -6.5, -22], width: 5 },
    { type: 'weg', from: [0, -6.5, -22], to: [0, -8, -27], width: 5 },
    { type: 'weg', from: [0, -8, -27], to: [0, -8, -31], width: 1.4 },
    { type: 'trampolin', at: [0, -8, -30.2], size: [1.4, 1.6], tempo: 12, jump: 3 },
    { type: 'deko', form: 'torstange', at: [-1.2, -8, -31], farbe: 0xE53935 },
    { type: 'deko', form: 'torstange', at: [1.2, -8, -31], farbe: 0x1E88E5 },
    // Aufsprunghang: Pulverschnee, schmal, ohne Rand
    { type: 'weg', from: [0, -9.1, -31.5], to: [0, -23.5, -71.5], width: 3, surface: 'schnee' },
    { type: 'deko', form: 'tanne', at: [-6, -30, -50], scale: 1.5 },
    { type: 'deko', form: 'tanne', at: [6, -30, -60], scale: 1.3 },
    { type: 'weg', from: [0, -23.5, -71.5], to: [0, -23.5, -80], width: 6, walls: 0.8, surface: 'schnee' },
    { type: 'checkpoint', at: [0, -23.5, -76], size: [6, 3, 2] },
    { type: 'deko', form: 'pinguin', at: [-4.5, -23.5, -74], yaw: -90 },
    { type: 'deko', form: 'pinguin', at: [-4.5, -23.5, -77], yaw: -70, scale: 0.8 },

    // Grat: schmal, ohne Rand, Pulverschnee und blanke Eisplatten
    { type: 'kurve', at: [0, -23.5, -80], yaw: 0, turn: 90, radius: 6, width: 1.6, surface: 'schnee' },
    { type: 'weg', from: [6, -23.5, -86], to: [10, -23.5, -86], width: 1.6, surface: 'eis' },
    { type: 'weg', from: [10, -23.5, -86], to: [12, -23.5, -86], width: 1.6, surface: 'schnee' },
    { type: 'weg', from: [12, -23.5, -86], to: [16, -23.5, -86], width: 1.6, surface: 'eis' },
    { type: 'kurve', at: [16, -23.5, -86], yaw: -90, turn: -90, radius: 6, width: 1.6, surface: 'schnee' },
    { type: 'weg', from: [22, -23.5, -92], to: [22, -23.5, -96], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [22, -23.5, -94], size: [4, 3, 2] },

    // Start des Eiskanals: Doppelschranke mit zwei Takten, dazwischen Platz zum Warten
    { type: 'weg', from: [22, -23.5, -96], to: [22, -23.5, -103], width: 2 },
    { type: 'schieber', from: [22, -23.5, -98.5], to: [24.6, -23.5, -98.5], size: [2.2, 1, 0.6], time: 0.7, pause: 1.8, look: 'stamm' },
    { type: 'schieber', from: [22, -23.5, -101.5], to: [19.4, -23.5, -101.5], size: [2.2, 1, 0.6], time: 0.6, pause: 1.4, offset: 1, look: 'stamm' },
    // Eiskanal: Steilkurve hinunter, Steilkurve hinauf (Tempo halten), zum Ziel hinunter
    { type: 'rinne', from: [22, -23.5, -103], to: [22, -26, -111], r: 1.6, bogen: 80, surface: 'eis', farbe: 0xBFE6FA },
    { type: 'rinne', at: [22, -26, -111], yaw: 0, turn: -180, radius: 4, rise: -2, r: 1.6, bogen: 90, surface: 'eis', farbe: 0xBFE6FA },
    { type: 'rinne', from: [14, -28, -111], to: [14, -30, -103], r: 1.6, bogen: 80, surface: 'eis', farbe: 0xBFE6FA },
    { type: 'rinne', at: [14, -30, -103], yaw: 180, turn: 180, radius: 4, rise: 1, r: 1.6, bogen: 90, surface: 'eis', farbe: 0xBFE6FA },
    { type: 'rinne', from: [6, -29, -103], to: [6, -32, -111], r: 1.6, bogen: 80, surface: 'eis', farbe: 0xBFE6FA },
    { type: 'weg', from: [6, -32, -111], to: [6, -32, -119], width: 6, walls: 0.8, caps: 'end', surface: 'schnee' },
    { type: 'deko', form: 'iglu', at: [6, -32, -124], yaw: 180 },
    { type: 'deko', form: 'pinguin', at: [10, -32, -114], yaw: 90 },
    { type: 'deko', form: 'pinguin', at: [10, -32, -117], yaw: 110, scale: 0.8 },
    { type: 'deko', form: 'tanne', at: [28, -30, -100] },
    { type: 'ziel', at: [6, -32, -116.5] },

    { type: 'stern', at: [1.8, -2.1, -14] },
    { type: 'stern', at: [0, -7, -34], r: 1.4 },
    { type: 'stern', at: [11, -22.6, -86] },
    { type: 'stern', at: [22, -22.6, -100] },
    { type: 'stern', at: [8.2, -31.1, -113.5] },
    { type: 'stern', at: [-2.2, 0.1, -9], bonus: true }
  ]
};
