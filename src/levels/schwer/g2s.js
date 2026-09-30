// Garten 2 💀: Sandburg. Windige Brücke ohne Rand (Pusteblumen-Böen), Sandkasten mit Löchern und Sandmauern,
// Sandkuchen-Förmchen, Sandklopf-Hammer vor dem Burgtor, Springbrunnen aus dem Gartenschlauch hoch auf die Burg,
// Gabelung (Zinne mit Sandschieber und Rutsche oder Wendeltreppe um den Turm), Burggraben und Zugbrücke mit Schalter.
export default {
  id: 'g2s', schwer: 'g2', name: 'Sandburg', emoji: '🏰', theme: 'garten',
  start: [0, 0, 2], killY: -6,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 5, walls: 0.8, caps: 'start' },
    // Brücke ohne Rand, Böen von beiden Seiten
    { type: 'weg', from: [0, 0, -4], to: [0, 0, -24], width: 2.4 },
    { type: 'wind', at: [0, 0, -8], size: [3, 3, 4], yaw: -90, strength: 5 },
    { type: 'wind', at: [0, 0, -14], size: [3, 3, 4], yaw: 90, strength: 5 },
    { type: 'wind', at: [0, 0, -20], size: [3, 3, 4], yaw: -90, strength: 5 },
    // Sandkasten: Löcher und Sandmauern
    { type: 'feld', at: [0, 0, -24], cell: 2, walls: 0.8, map: [
      'aaaaaa',
      'w.aa.w',
      '.aaaa.',
      '.a..a.',
      'aa..aa',
      'a.ww.a',
      'a.aa.a',
      'aaaaaa'
    ] },
    { type: 'wand', from: [-6.4, 0, -24.2], to: [-1.4, 0, -24.2] },
    { type: 'wand', from: [1.4, 0, -24.2], to: [6.4, 0, -24.2] },
    { type: 'wand', from: [-6.4, 0, -39.8], to: [-2.2, 0, -39.8] },
    { type: 'wand', from: [2.2, 0, -39.8], to: [6.4, 0, -39.8] },
    { type: 'weg', from: [0, 0, -40], to: [0, 0, -43.2], width: 4, walls: 0.6 },
    { type: 'checkpoint', at: [0, 0, -41.5], size: [4, 3, 2.4] },
    // Sandkuchen-Förmchen: hinein und vorne hinaus, dann die Rampe hoch
    { type: 'schuessel', at: [0, -1.2, -47], r: 2, R: 3.5, h: 1.2, rim: 0.3, art: 'sandkuchen', surface: 'sand', offen: [0] },
    { type: 'weg', from: [0, -1.2, -48.5], to: [0, -1.2, -52], width: 2.2, walls: 0.6 },
    { type: 'weg', from: [0, -1.2, -52], to: [0, 0, -58], width: 3, walls: 0.6, look: 'sand' },
    { type: 'weg', from: [0, 0, -58], to: [0, 0, -62], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -60], size: [5, 3, 3] },
    // Sandklopf-Hammer vor dem Burgtor
    { type: 'weg', from: [0, 0, -62], to: [0, 0, -70], width: 3.6, look: 'sand' },
    { type: 'hammer', at: [0, 0, -66], side: 1, length: 4, farbe: 'gelb' },
    // Burgtor (Tunnel) und Burghof
    { type: 'weg', from: [0, 0, -70], to: [0, 0, -78], width: 3.6, look: 'sand' },
    { type: 'klotz', at: [-3.3, 2.5, -74], size: [3, 5, 8], look: 'sand' },
    { type: 'klotz', at: [3.3, 2.5, -74], size: [3, 5, 8], look: 'sand' },
    { type: 'klotz', at: [0, 4.25, -74], size: [3.6, 1.5, 8], look: 'sand' },
    { type: 'deko', form: 'burg', at: [0, 5, -74], scale: 0.5 },
    { type: 'weg', from: [0, 0, -78], to: [0, 0, -90], width: 8, walls: 0.8, caps: 'end', look: 'sand' },
    { type: 'klotz', at: [-4.9, 2.5, -84], size: [1, 5, 12], look: 'sand' },
    { type: 'klotz', at: [4.9, 2.5, -84], size: [1, 5, 12], look: 'sand' },
    { type: 'checkpoint', at: [0, 0, -81], size: [8, 3, 3] },
    // Springbrunnen aus dem Gartenschlauch: hoch auf die Burgmauer
    { type: 'wind', at: [0, 0, -88], size: [4, 8, 4], up: true, strength: 16, look: 'schlauch' },
    { type: 'klotz', at: [0, 10, -88], size: [4.4, 1, 4.4], look: 'sand', surface: 'sand' },
    { type: 'weg', from: [2, 7, -90], to: [2, 7, -96], width: 10, walls: 0.8, look: 'sand' },
    { type: 'klotz', at: [2, 3, -93], size: [10, 6, 6], look: 'sand', deko: true },
    { type: 'wand', from: [-3.2, 7, -96.2], to: [-0.9, 7, -96.2] },
    { type: 'wand', from: [0.9, 7, -96.2], to: [4.3, 7, -96.2] },
    { type: 'checkpoint', at: [2, 7, -93], size: [10, 3, 3] },
    // links: Zinne ohne Rand mit Sandschieber, dann steile Rutsche
    { type: 'weg', from: [0, 7, -96], to: [0, 7, -110], width: 1.4, look: 'sand' },
    { type: 'schieber', from: [-3.2, 7, -103], to: [0.3, 7, -103], size: [2, 1.2, 2], time: 1, pause: 1 },
    { type: 'weg', from: [0, 7, -110], to: [0, 1, -124], width: 1.6 },
    // rechts: Wendeltreppe um den Turm (lang, aber mit Rand)
    { type: 'weg', from: [6, 7, -96], to: [6, 7, -100], width: 3, walls: 0.8 },
    { type: 'spirale', at: [6, 7, -100], yaw: 0, turn: 360, radius: 4, rise: -6, width: 3, walls: 1.2 },
    { type: 'klotz', at: [10, 3, -100], size: [3, 12, 3], look: 'sand', deko: true },
    { type: 'deko', form: 'burg', at: [10, 9, -100], scale: 0.35 },
    { type: 'weg', from: [6, 1, -100], to: [6, 1, -124], width: 3, walls: 0.8 },
    // Strand: Schalter für die Zugbrücke
    { type: 'weg', from: [3, 1, -124], to: [3, 1, -130], width: 10, walls: 0.8 },
    { type: 'wand', from: [-2.2, 1, -130.2], to: [1, 1, -130.2] },
    { type: 'wand', from: [5, 1, -130.2], to: [8.2, 1, -130.2] },
    { type: 'checkpoint', at: [3, 1, -127], size: [10, 3, 3] },
    { type: 'schalter', at: [-1, 1, -128], id: 'tor' },
    // Burggraben, dann über die Zugbrücke ins Ziel
    { type: 'fluss', from: [3, 1, -130], to: [3, -1, -146], width: 3.6, speed: 4 },
    { type: 'weg', from: [3, -1.7, -146], to: [3, -1.7, -149], width: 3.6, walls: 0.8 },
    { type: 'bruecke', from: [3, -1.7, -149], to: [3, -1.7, -157], width: 3.6, walls: 0.6, id: 'tor' },
    { type: 'weg', from: [3, -1.7, -157], to: [3, -1.7, -165], width: 6, walls: 0.8, caps: 'end', look: 'sand' },
    { type: 'ziel', at: [3, -1.7, -161] },

    // Sandkasten-Spielzeug
    { type: 'deko', form: 'eimer', at: [4, 0, 3], scale: 0.4 },
    { type: 'deko', form: 'schaufel', at: [-4, 0, 2], yaw: 30, scale: 0.5 },
    { type: 'deko', form: 'blume', at: [-3, -7, -14], scale: 1.2 },
    { type: 'deko', form: 'blume', at: [3.5, -7, -9], scale: 1.1, farbe: 0xFFFFFF },
    { type: 'deko', form: 'eimer', at: [-10, -7, -33], scale: 1.4, farbe: 0xE53935 },
    { type: 'deko', form: 'schaufel', at: [11, -7, -50], yaw: -40, scale: 1.5 },
    { type: 'deko', form: 'burg', at: [-12, -7, -118], scale: 1.4 },
    { type: 'deko', form: 'burg', at: [-5, -1.7, -163], scale: 0.6 },
    { type: 'deko', form: 'burg', at: [11, -1.7, -163], scale: 0.6 },

    { type: 'stern', at: [0, 0.9, -1] },
    { type: 'stern', at: [0, 0.9, -14] },
    { type: 'stern', at: [-5, 0.9, -29] },
    { type: 'stern', at: [0, 0.9, -66] },
    { type: 'stern', at: [0, 5, -88] },
    { type: 'stern', at: [14, 4.9, -100] },
    { type: 'stern', at: [-1, 1.9, -128] },
    { type: 'stern', at: [3, 0.5, -138] },
    { type: 'stern', at: [0, 7.9, -106], bonus: true },

    // einzelne Dominosteine
    { type: 'domino', from: [6.3, 1, -124.5], to: [6.2, 1, -126.4], count: 2, quer: 3 },
    { type: 'domino', at: [0.3, 1.2, -29], yaw: 81 },
    { type: 'domino', at: [-3.7, 5, -76.5], yaw: -26 },
    { type: 'domino', at: [5.8, 7, -93.5], yaw: -40 },
    { type: 'domino', at: [2.3, 0, -84], yaw: -28 }
  ]
};
