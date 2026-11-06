// Dach 1: Dachrinne. Ein echter Weg statt einer Bahn im Leeren: vom Holzdeck am First über die Ziegel hinunter
// (an Gaube und Kamin vorbei), über den Laufsteg des Kaminfegers, durch eine Lücke im Schneefang in die Dachrinne,
// die Rinne entlang in den Rinnenkessel und durch das Fallrohr hinunter in die Regentonne (Ziel).
// Neu: Ziegel bremsen (surface 'ziegel'), das Solarpanel ist glatt wie Eis, die nasse Rinne schluckt den Aufprall.
// Massstab: 1 m im Spiel sind etwa 25 cm, die Murmel ist so gross wie ein Ball auf einem echten Hausdach.
const yA = z => (z + 2) / 2;          // Ziegel oben: First bei z = -2 (y = 0), 26.6° steil, bis zum Laufsteg (z = -9, y = -3.5)
const yB = z => -3.5 + (z + 12) / 2;  // Ziegel unten: vom Laufsteg (z = -12) bis zur Traufe (z = -19, y = -7)
const RZ = -20.2;                     // Mitte der Dachrinne (die Ziegel ragen 0.4 über ihren Rand)
const rinneY = x => -8.8 - 1.2 * (x + 9.4) / 20.4; // Boden der Rinne, Gefälle nach rechts
const K = [14.3, -11.8, RZ];          // Rinnenkessel (Bodenmitte), sein Rand liegt knapp unter dem Ende der Rinne
const T = [24.7, -23.2, RZ];          // Regentonne (Bodenmitte)
const zink = h => ({ height: h, thick: 0.3, look: 'zink' });

export default {
  id: 'd1', name: 'Dachrinne', emoji: '🌧️', theme: 'dach',
  start: [0, 0, 2], killY: -23,
  // Kulisse (nur Grafik, src/themes.js): Hauswände unter dem Dach, hintere Dachfläche, Garten in Höhe killY - 1
  haus: { x: [-8.6, 10.6], z: [-18.6, 14.6], first: -2, neigung: 0.5 },
  parts: [
    // Holzdeck am First (Dachaustritt)
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -2], width: 5, walls: 0.8, caps: 'start' },

    // Ziegel oben: mitten im Weg die Gaube, rechts der Kamin, links die Satellitenschüssel
    { type: 'weg', from: [1, 0, -2], to: [1, -3.5, -9], width: 20, walls: 0.5, surface: 'ziegel' },
    { type: 'klotz', at: [0, -1.55, -7], size: [5, 4.5, 3], look: 'putz' },
    { type: 'klotz', at: [0, 0.85, -7.1], size: [5.8, 0.35, 3.6], look: 'ziegel', deko: true },
    { type: 'klotz', at: [0, -1.2, -8.56], size: [3, 2, 0.1], look: 'fenster', deko: true },
    { type: 'klotz', at: [7.5, 0.4, -5], size: [3, 7, 3], look: 'backstein' },
    { type: 'klotz', at: [7.5, 4.1, -5], size: [3.6, 0.4, 3.6], look: 'zink', deko: true },
    { type: 'deko', form: 'satschuessel', at: [-8.2, yA(-3), -3], yaw: 200, scale: 0.8 },

    // Laufsteg des Kaminfegers: eben, hier geht es nach dem Runterfallen weiter
    { type: 'weg', from: [1, -3.5, -9], to: [1, -3.5, -12], width: 20, walls: 0.5, look: 'zink' },
    { type: 'checkpoint', at: [1, -3.5, -10.5], size: [20, 3, 2.6] },

    // Ziegel unten: Solarpanel (glatt wie Eis), davor der Schneefang mit zwei Lücken
    { type: 'weg', from: [1, -3.5, -12], to: [1, -7, -19], width: 20, walls: 0.5, surface: 'ziegel' },
    { type: 'weg', from: [3, yB(-12.8) + 0.06, -12.8], to: [3, yB(-16.8) + 0.06, -16.8], width: 5, thick: 0.3, surface: 'eis', look: 'solar' },
    { type: 'wand', from: [-9, yB(-17.5), -17.5], to: [-4.5, yB(-17.5), -17.5], ...zink(0.8) },
    { type: 'wand', from: [-1.5, yB(-17.5), -17.5], to: [5.5, yB(-17.5), -17.5], ...zink(0.8) },
    { type: 'wand', from: [8.5, yB(-17.5), -17.5], to: [11, yB(-17.5), -17.5], ...zink(0.8) },

    // Dachrinne unter der Traufe: hineinfallen und nach rechts rollen. Links ist sie zu.
    { type: 'rinne', from: [-9.4, rinneY(-9.4), RZ], to: [11, rinneY(11), RZ], r: 1.6, bogen: 90, surface: 'dachrinne', farbe: 0x9AA5AD },
    { type: 'klotz', at: [-9.55, -8, RZ], size: [0.3, 2.4, 3.6], look: 'zink' },
    { type: 'checkpoint', at: [4, rinneY(4), RZ], size: [3, 3, 3], yaw: -90, side: 1 },

    // Rinnenkessel: ein Kasten aus Zink fängt die Murmel, in der Mitte geht es ins Fallrohr
    { type: 'schuessel', at: K, R: 3, h: 1.6, rim: 0.6, art: 'kessel', boden: 'rund', abfluss: true, surface: 'dachrinne' },
    { type: 'wand', from: [K[0] + 3.8, K[1] + 1.6, RZ - 3.8], to: [K[0] + 3.8, K[1] + 1.6, RZ + 3.8], ...zink(3) },
    { type: 'wand', from: [K[0] - 3.4, K[1] + 1.6, RZ - 3.8], to: [K[0] + 3.8, K[1] + 1.6, RZ - 3.8], ...zink(3) },
    { type: 'wand', from: [K[0] - 3.4, K[1] + 1.6, RZ + 3.8], to: [K[0] + 3.8, K[1] + 1.6, RZ + 3.8], ...zink(3) },
    { type: 'wand', from: [K[0] - 3.4, K[1] + 1.6, RZ - 3.8], to: [K[0] - 3.4, K[1] + 1.6, RZ - 1.75], ...zink(3) },
    { type: 'wand', from: [K[0] - 3.4, K[1] + 1.6, RZ + 1.75], to: [K[0] - 3.4, K[1] + 1.6, RZ + 3.8], ...zink(3) },

    // Fallrohr hinunter in die Regentonne: wer hineinplumpst, hat gewonnen
    { type: 'roehre', from: K, down: true, to: [T[0] - 2.4, T[1] + 1.4, RZ], toYaw: -90, farbe: 0x9AA5AD },
    { type: 'schuessel', at: T, r: 2.4, R: 2.6, h: 2.8, rim: 0.3, art: 'tonne', surface: 'pfuetze', offen: [90], luecke: 2.2 },
    { type: 'ziel', at: [T[0], T[1] + 0.8, RZ], r: 2.2 },

    { type: 'stern', at: [-5.5, yA(-7) + 0.9, -7] },
    { type: 'stern', at: [6, -2.6, -10.5] },
    { type: 'stern', at: [-3, yB(-17.5) + 0.9, -17.5] },
    { type: 'stern', at: [2, rinneY(2) + 0.9, RZ] },
    { type: 'stern', at: [9, rinneY(9) + 0.9, RZ] },
    // versteckt hinter dem Kamin: vom Laufsteg aus an den oberen Rand rollen (grosser Sammelradius, bergauf kommt 🐢 nicht)
    { type: 'stern', at: [7.5, yA(-8.2) + 0.9, -8.2], bonus: true, r: 1.8 }
  ]
};
