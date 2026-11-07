// Chilbi 1: Rössliriiti. Durch den Torbogen auf einen Steg aus Zuckerwatte ohne Rand: dreimal im S hin und her, die
// Zuckerwatte klebt und bremst, wer zu wenig kippt, steht still (fällt nicht, verliert aber Zeit), wer die Kurve schneidet,
// fällt. Dann über die Theke vom Büchsenwerfen: Dosen stehen im Weg, man fährt durch die Lücke daneben, und aus den Buden
// rollen Wurfbälle in Salven quer über die Theke (ohne Rand): jede Bude wirft anders (drei, zwei oder vier Bälle kurz
// hintereinander, gross und langsam oder klein und schnell), warten, bis die Salve vorbei ist. Dann der Wackelboden ohne
// Rand: er kippt im Takt nach links, rechts, vorne und hinten, flach bleibt er mal lang, mal kurz. Auf dem Karussell drehen
// zwei Balken gegeneinander, aussen die grossen Rössli bis an den Zaun, innen die kleinen; im Zaun stehen Flipper-Pilze,
// die zurück zu den kleinen Rössli schiessen. Man fährt hinter einem grossen Rössli her im schmalen Ring zwischen beiden
// drei Viertel rundherum; rechts und hinten sind Lücken im Zaun ins Leere, hinaus geht es links. Rechts draussen auf einem Brett der Bonusstern: hinaus und wieder hinein, wenn das nächste Rössli vorbei ist.
// Zum Schluss eine schmale Rampe ohne Rand hinunter und um die Ecke zum Zirkuszelt.
const X = 6;             // Mittellinie ab der Theke
const KZ = -74;          // Karussell: Mitte des Bodens (z)
const K = [X, 0, KZ];
const U = -3;            // Höhe unten beim Zirkuszelt
const DOSE = { type: 'domino', form: 'dose', size: [0.9, 1.2, 0.9] };
const WURF = { type: 'felsen', farbe: 0xF5F5F5, wobble: 0.2, anzahl: 4 }; // Wurfbälle in Salven, Grösse und Tempo wechseln
const ZW = { width: 1.6, surface: 'zuckerwatte' };

export default {
  id: 'c1', name: 'Rössliriiti', emoji: '🍭', theme: 'chilbi',
  start: [0, 0, 2], killY: -8,
  parts: [
    // Eingang: unter dem Torbogen durch, links und rechts eine Bude
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -2], width: 5, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'torbogen', at: [0, 0, 1], yaw: 180 },
    { type: 'klotz', at: [-6.5, -0.5, -2], size: [7, 1, 9], deko: true },
    { type: 'klotz', at: [10.5, -0.5, -2], size: [7, 1, 9], deko: true },
    { type: 'deko', form: 'bude', at: [-6.6, 0, -2], yaw: -90 },
    { type: 'deko', form: 'bude', at: [10.6, 0, -2], yaw: 90, farbe: 0x1E88E5 },
    { type: 'deko', form: 'lolli', at: [4.2, 0, 2.1], yaw: 180, scale: 0.6, farbe: 0xFB8C00 },

    // Zuckerwatte-Steg ohne Rand: dreimal im S, nach rechts, zurück und wieder nach rechts
    { type: 'weg', from: [0, 0, -2], to: [0, 0, -6], ...ZW },
    { type: 'kurve', at: [0, 0, -6], yaw: 0, turn: 90, radius: 3, ...ZW },
    { type: 'kurve', at: [3, 0, -9], yaw: -90, turn: -90, radius: 3, ...ZW },
    { type: 'weg', from: [6, 0, -12], to: [6, 0, -15], ...ZW },
    { type: 'kurve', at: [6, 0, -15], yaw: 0, turn: -90, radius: 3, ...ZW },
    { type: 'kurve', at: [3, 0, -18], yaw: 90, turn: 90, radius: 3, ...ZW },
    { type: 'weg', from: [0, 0, -21], to: [0, 0, -22], ...ZW },
    { type: 'kurve', at: [0, 0, -22], yaw: 0, turn: 90, radius: 3, ...ZW },
    { type: 'kurve', at: [3, 0, -25], yaw: -90, turn: -90, radius: 3, ...ZW },
    { type: 'weg', from: [X, 0, -28], to: [X, 0, -29], ...ZW },
    { type: 'deko', form: 'zuckerwatte', at: [3.2, 0, -12.5], scale: 1.3 },
    { type: 'deko', form: 'zuckerwatte', at: [-3.5, 0, -12], farbe: 0x9FD8F5 },
    { type: 'deko', form: 'zuckerwatte', at: [9.5, 0, -21], farbe: 0xF8BBD0 },
    { type: 'weg', from: [X, 0, -29], to: [X, 0, -33], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [X, 0, -31], size: [4, 3, 2] },

    // Büchsenwerfen: Theke ohne Rand, Dosen stehen im Weg, Wurfbälle rollen in Salven quer (zwei bis vier Bälle kurz
    // hintereinander, verschieden gross und schnell, dann eine längere Pause)
    { type: 'weg', from: [X, 0, -33], to: [X, 0, -54], width: 3.4 },
    { ...DOSE, at: [X - 1.25, 0, -35.5] }, { ...DOSE, at: [X - 0.3, 0, -35.5] },
    { ...WURF, from: [X - 1.6, 0, -39.5], dir: [1, 0], every: [0.9, 0.9, 4.6], r: [0.55, 0.4, 0.65], speed: [7, 9, 6] },
    { ...DOSE, at: [X + 1.25, 0, -43] }, { ...DOSE, at: [X + 0.3, 0, -43] },
    { ...WURF, from: [X + 1.6, 0, -46.5], dir: [-1, 0], offset: 2, every: [1.3, 3.9, 0.7, 4.4], r: [0.6, 0.45], speed: [8, 6, 9] },
    { ...DOSE, at: [X - 1.25, 0, -49.5] }, { ...DOSE, at: [X - 0.3, 0, -49.5] },
    { ...WURF, from: [X - 1.6, 0, -52.5], dir: [1, 0], offset: 1, every: [0.7, 0.7, 0.7, 5.2], r: [0.5, 0.6, 0.4, 0.65], speed: [6, 8, 7, 9] },
    // Buden links und rechts, aus denen geworfen wird, mit einer Dosen-Pyramide auf der Theke
    { type: 'klotz', at: [X - 7.5, -0.5, -39.5], size: [7, 1, 8], deko: true },
    { type: 'deko', form: 'bude', at: [X - 7.8, 0, -39.5], yaw: -90, farbe: 0xFDD835 },
    { type: 'klotz', at: [X + 7.5, -0.5, -46.5], size: [7, 1, 8], deko: true },
    { type: 'deko', form: 'bude', at: [X + 7.8, 0, -46.5], yaw: 90 },
    { type: 'deko', form: 'dose', at: [X + 7.2, 2.25, -45.9], farbe: 0x1E88E5 },
    { type: 'deko', form: 'dose', at: [X + 7.2, 2.25, -47.1] },
    { type: 'deko', form: 'dose', at: [X + 7.2, 3.55, -46.5], farbe: 0xFDD835 },
    { type: 'weg', from: [X, 0, -54], to: [X, 0, -58], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [X, 0, -56], size: [4, 3, 2] },

    // Wackelboden ohne Rand: kippt im Takt zur Seite und nach vorne oder hinten, nur flach hinüber
    { type: 'rutschplatte', pos: [X, 0, -62], size: [4, 8], look: 'wackel',
      takt: [[3.4, 0, 0], [1.1, 9, 0], [0.7, -6, 4], [2.8, 0, 0], [1.4, -9, -3], [0.6, 7, 0], [1.8, 0, 0], [0.9, 0, 6]] },
    { type: 'weg', from: [X, 0, -66], to: [X, 0, KZ + 6.6], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [X, 0, -67], size: [4, 3, 2] },

    // Rössliriiti: aussen grosse Rössli bis an den Zaun, innen kleine, gegeneinander; Lücken vorne, rechts, hinten, links.
    // Zwischen den Lücken stehen Flipper-Pilze im Zaun: wer nach aussen gedrückt wird, fliegt zurück zu den kleinen Rössli
    { type: 'schuessel', art: 'karussell', at: K, r: 6.5, R: 7, h: 1, rim: 0.4, offen: [180, -90, 0, 90], luecke: 2.4 },
    { type: 'balken', form: 'pferd', enden: true, at: K, length: 12.6, speed: 24 },
    { type: 'balken', form: 'pferd', enden: true, at: K, length: 9, speed: -50, farbe: 'blau', scale: 0.45 },
    ...[45, 135, 225, 315].map(a => ({ type: 'bumper', pos: [X + 7 * Math.sin(a * Math.PI / 180), 0, KZ + 7 * Math.cos(a * Math.PI / 180)], r: 0.5, hoch: 0.6, kick: 7, look: 'flipper' })),
    // rechts draussen: Brett mit dem Bonusstern
    { type: 'weg', from: [X + 7, 0, KZ], to: [X + 9.6, 0, KZ], width: 1.4 },
    { type: 'deko', form: 'popcorn', at: [X + 8, 0, KZ - 9], scale: 0.9 },
    { type: 'deko', form: 'lukas', at: [X + 9.6, 0, KZ + 5.4], yaw: 180 },

    // links hinaus, dann die schmale Rampe ohne Rand hinunter und um die Ecke
    { type: 'weg', from: [X - 7, 0, KZ], to: [X - 10.5, 0, KZ], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [X - 8.75, 0, KZ], yaw: 90, size: [3, 3, 2] },
    { type: 'weg', from: [X - 10.5, 0, KZ], to: [X - 18, U, KZ], width: 1.6 },
    { type: 'kurve', at: [X - 18, U, KZ], yaw: 90, turn: 90, radius: 3, width: 1.6 },
    { type: 'deko', form: 'herz', at: [X - 14, 0, KZ + 6], yaw: -60 },

    // Platz vor dem Zirkuszelt
    { type: 'weg', from: [X - 21, U, KZ - 3], to: [X - 21, U, KZ - 13], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [X - 21, U, KZ - 9] },
    { type: 'klotz', at: [X - 21, U - 0.5, KZ - 19.2], size: [12, 1, 12], deko: true },
    { type: 'deko', form: 'zelt', at: [X - 21, U, KZ - 19], yaw: 180 },
    { type: 'deko', form: 'ballons', at: [X - 17, U, KZ - 9], farbe: 0x43A047 },
    { type: 'deko', form: 'lolli', at: [X - 25, U, KZ - 9], yaw: 180 },

    // Sterne: aussen in der ersten Kurve, am Rand der Zuckerwatte, hinter dem ersten Wurfball am Rand, im Ring hinten
    // aussen neben der Fahrlinie, am Rand der Rampe; Bonus draussen rechts vom Karussell
    { type: 'stern', at: [0.35, 0.9, -8.6] },
    { type: 'stern', at: [6.55, 0.9, -13.5] },
    { type: 'stern', at: [X + 1.3, 0.9, -41.4] },
    { type: 'stern', at: [X - 2.05, 0.9, KZ - 5.64] },
    { type: 'stern', at: [X - 14.25, U / 2 + 0.9, KZ - 0.55] },
    { type: 'stern', at: [X + 8.8, 0.9, KZ], bonus: true }
  ]
};
