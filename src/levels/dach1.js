// Dach 1: Dachrinne. Vom Holzdeck am Dachaustritt über den First, die Ziegel hinunter, über den Laufsteg des
// Kaminfegers und die Dachkante in die Dachrinne, durch den Rinnenkessel und das Fallrohr in die Regentonne (Ziel).
// Gefahren: Auf dem First (schmal, ohne Rand) blasen Böen quer, abwechselnd von vorne und von hinten, jede Böe mit eigenem,
// unregelmässigem Takt: zwischen den Böen-Feldern warten, bis es still ist; wer hinunterfällt, fällt gleich vom Dach
// (Solaranlage und hintere Dachfläche sind nur Grafik). Auf der Ziegel-Schräge stehen Schneefang, Gaube, Kamin, Antenne
// und Blumentöpfe der Dachterrasse (stossen weg) im Weg; die Lücke im unteren Schneefang liegt an der offenen Dachkante,
// und durch sie rollen Kastanien vom Nussbaum in Salven, mal gross, mal klein. Am Anfang des Laufstegs lösen sich lose
// Ziegel vom Dach und fallen auf den Steg ohne Rand (Schatten vorher; wer getroffen wird, fliegt hinunter). Dann lose
// Bretter (Falltüren mit wechselnder Frist: wer stockt, fällt), dazwischen streift der Arm eines Antennenrotors quer über
// den Steg. Zuletzt die Dachkante: schmal, ohne Rand, steil in die Rinne.
// Ziegel bremsen (surface 'ziegel'), die nasse Rinne schluckt den Aufprall.
// Massstab: 1 m im Spiel sind etwa 25 cm, die Murmel ist so gross wie ein Ball auf einem echten Hausdach.
const y = z => (z + 3) / 2;           // vordere Dachfläche: First bei z = -3 (y = 0), 26.6° steil, Traufe bei z = -27.5
const yH = z => -(z + 3) / 2;         // hintere Dachfläche
const L = -16;                        // Mitte des Laufstegs (Oberkante y = -6, eben)
const RZ = -28.7;                     // Mitte der Dachrinne
const rinneY = x => -14.05 - 0.06 * (x - 47.3); // Boden der Rinne, Gefälle nach rechts
const K = [55.3, rinneY(52) - 1.8, RZ];        // Rinnenkessel (Bodenmitte)
const T = [K[0] + 10.4, K[1] - 11.4, RZ];      // Regentonne (Bodenmitte)
const zink = h => ({ height: h, thick: 0.3, look: 'zink' });
const kastanie = { farbe: 0x7B4A2A, dir: [0, -1] };

export default {
  id: 'd1', name: 'Dachrinne', emoji: '🌧️', theme: 'dach',
  start: [0, 0, 2], killY: T[1] + 0.2,
  // Kulisse (nur Grafik, src/themes.js): Hauswände unter dem Dach, hintere Dachfläche, Garten in Höhe killY - 1
  haus: { x: [-10, 50.4], z: [-27, 21], first: -3, neigung: 0.5 },
  parts: [
    // Holzdeck am Dachaustritt
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -1], width: 5, walls: 0.8, caps: 'start' },

    // First: schmal, ohne Rand, quer darüber die Böen. Links ein kurzer Stummel bis zur Antenne (Bonusstern)
    { type: 'weg', from: [0, 0, -1], to: [0, 0, -3.8], width: 1.6, thick: 0.6 },
    { type: 'weg', from: [-6, 0, -3], to: [19, 0, -3], width: 1.6, thick: 0.6, look: 'zink' },
    { type: 'klotz', at: [-6.4, 2, -3], size: [0.3, 4, 0.3], look: 'zink' },
    { type: 'deko', form: 'satschuessel', at: [-6.4, 2.6, -3], yaw: 160, scale: 0.6 },
    { type: 'wind', at: [5, 0, -3], size: [3.4, 2.5, 5], yaw: 180, strength: 4, takt: [[2.5, 0], [1.2, 1], [1, 0.4], [0.8, 1.3], [3.2, 0], [1.5, 1]] },
    { type: 'wind', at: [10, 0, -3], size: [3.4, 2.5, 5], yaw: 0, strength: 4, takt: [[3, 0], [0.8, 1.3], [2, 0], [1.4, 0.8], [1, 0.2], [1.2, 1.1]], offset: 1 },
    { type: 'wind', at: [15, 0, -3], size: [3.4, 2.5, 5], yaw: 180, strength: 4, takt: [[2, 0], [1, 1.2], [3.5, 0], [0.7, 1.3], [1.5, 0.5]], offset: 2.5 },
    // unter dem First vorne die Solaranlage, hinten die Ziegel der Kulisse: beide nur Grafik, wer hinunterfällt, fällt gleich
    { type: 'weg', from: [6.6, y(-3.9) + 0.05, -3.9], to: [6.6, y(-27.5) + 0.05, -27.5], width: 26, thick: 0.3, look: 'solar', deko: true },

    // Podest am Ende des Firsts neben dem Kamin
    { type: 'weg', from: [18.5, 0, -3], to: [24, 0, -3], width: 2.4, thick: 0.6 },
    { type: 'wand', from: [18.5, 0, -1.8], to: [24, 0, -1.8], ...zink(0.8) },
    { type: 'wand', from: [24, 0, -1.8], to: [24, 0, -4.2], ...zink(0.8) },
    { type: 'checkpoint', at: [21.5, 0, -3], size: [5, 3, 2.4], side: -1 },
    { type: 'klotz', at: [26.5, 0.5, -2.5], size: [3, 7, 3], look: 'backstein' },
    { type: 'klotz', at: [26.5, 4.2, -2.5], size: [3.6, 0.4, 3.6], look: 'zink', deko: true },

    // Ziegel-Schräge: oberer Schneefang mit Lücke über der Gaube, unterer mit Lücke an der offenen linken Kante
    { type: 'weg', from: [35, y(-4.2), -4.2], to: [35, y(-15), -15], width: 30.8, thick: 0.6, surface: 'ziegel' },
    { type: 'wand', from: [19.6, y(-7.5), -7.5], to: [31, y(-7.5), -7.5], ...zink(0.7) },
    { type: 'wand', from: [33.6, y(-7.5), -7.5], to: [50.4, y(-7.5), -7.5], ...zink(0.7) },
    { type: 'wand', from: [22.6, y(-12.5), -12.5], to: [50.4, y(-12.5), -12.5], ...zink(0.7) },
    // Gaube unter der oberen Lücke, Antenne und zweiter Kamin rechts
    { type: 'klotz', at: [32, y(-10) + 0.6, -10], size: [4, 3, 2], look: 'putz' },
    { type: 'klotz', at: [32, y(-10) + 2.2, -10], size: [4.6, 0.35, 2.6], look: 'ziegel', deko: true },
    { type: 'klotz', at: [32, y(-10) + 0.4, -11.03], size: [2.6, 1.4, 0.1], look: 'fenster', deko: true },
    { type: 'klotz', at: [38, y(-5.5) + 1.5, -5.5], size: [0.3, 4, 0.3], look: 'zink' },
    { type: 'deko', form: 'satschuessel', at: [38, y(-5.5) + 2.5, -5.5], yaw: 200, scale: 0.7 },
    { type: 'klotz', at: [44, y(-10) + 1, -10], size: [2.4, 4, 2.4], look: 'backstein' },
    // Blumentöpfe der Dachterrasse über dem unteren Schneefang: wer anstösst, wird weggestossen
    { type: 'bumper', pos: [27, y(-10.3), -10.3], r: 0.7, kick: 5, look: 'topf' },
    { type: 'bumper', pos: [37.6, y(-11), -11], r: 0.6, kick: 5, look: 'topf' },
    // Kastanien vom Nussbaum: rollen in Salven durch die untere Lücke, mal gross, mal klein
    { type: 'felsen', from: [21.1, y(-8.3), -8.3], speed: [1.5, 2.2, 1.2], every: [1.2, 4.5, 1, 1, 5], r: [0.55, 0.4, 0.6, 0.45, 0.5], wobble: 0.3, ...kastanie },
    { type: 'deko', form: 'baum', at: [16, T[1] - 0.8, -9], scale: 2.2 },

    // Laufsteg des Kaminfegers: eben, ohne Rand. Lose Ziegel fallen vom Dach auf den Anfang, dann drei lose Bretter (Falltüren)
    { type: 'weg', from: [19.6, -6, L], to: [28, -6, L], width: 2, thick: 0.4 },
    { type: 'checkpoint', at: [23.1, -6, L], size: [2, 3, 2], yaw: -90 },
    { type: 'fallend', from: [24.2, 1, L], to: [26, L], stellen: [0.5, 0, 0.9, 0.3, 1], every: [1.3, 0.9, 4.5, 2, 5.5], warn: 0.8, form: 'ziegel', kick: 5 },
    { type: 'falltuer', at: [29, -6, L], size: [2, 2], yaw: -90, delay: [0.6, 0.45, 0.7], offen: [2.5, 1.2, 3.5] },
    { type: 'weg', from: [30, -6, L], to: [33, -6, L], width: 2, thick: 0.4 },
    { type: 'falltuer', at: [34, -6, L], size: [2, 2], yaw: -90, delay: [0.6, 0.7, 0.45], offen: [1.5, 3] },
    { type: 'weg', from: [35, -6, L], to: [36.2, -6, L], width: 2, thick: 0.4 },
    { type: 'falltuer', at: [37.2, -6, L], size: [2, 2], yaw: -90, delay: [0.65, 0.5], offen: [2, 1, 3] },
    { type: 'weg', from: [38.2, -6, L], to: [49.5, -6, L], width: 2, thick: 0.4 },
    { type: 'klotz', at: [31.5, y(-18.6) + 0.8, -18.6], size: [0.35, 3.2, 0.35], look: 'zink', deko: true },
    { type: 'balken', at: [31.5, -6, -18.6], length: 6.4, speed: 40, farbe: 'gelb' },
    // unter dem Laufsteg wieder Solarpanels (nur Grafik), rechts davon die Brandmauer zum Nachbarhaus
    { type: 'weg', from: [30.15, y(-17.1) + 0.05, -17.1], to: [30.15, y(-27.5) + 0.05, -27.5], width: 21.1, thick: 0.3, look: 'solar', deko: true },
    { type: 'wand', from: [40.7, y(-17.2), -17.2], to: [40.7, y(-27.5), -27.5], height: 1.4, thick: 0.6, look: 'backstein' },
    // Podest am Ende des Laufstegs: Rand ringsum, nur rechts vorne offen zur Dachkante
    { type: 'wand', from: [41, -6, L + 1], to: [49.5, -6, L + 1], ...zink(0.8) },
    { type: 'wand', from: [49.5, -6, L + 1], to: [49.5, -6, L - 1], ...zink(0.8) },
    { type: 'wand', from: [41, -6, L - 1], to: [47.8, -6, L - 1], ...zink(0.8) },
    { type: 'checkpoint', at: [45, -6, L], size: [6, 3, 2], yaw: -90 },

    // Dachkante: schmal, ohne Rand, steil hinunter in die Rinne; links Solarpanels (nur Grafik), rechts nichts
    { type: 'weg', from: [44.15, y(-17.1) + 0.05, -17.1], to: [44.15, y(-27.5) + 0.05, -27.5], width: 6.9, thick: 0.3, look: 'solar', deko: true },
    { type: 'weg', from: [48.6, -6, L - 1], to: [48.6, y(-27.5) + 0.1, -27.5], width: 1.6, thick: 0.6, surface: 'ziegel' },

    // Dachrinne unter der Traufe: hineinfallen und nach rechts rollen. Links ist sie zu.
    { type: 'rinne', from: [47.3, rinneY(47.3), RZ], to: [52, rinneY(52), RZ], r: 1.6, bogen: 90, surface: 'dachrinne', farbe: 0x9AA5AD },
    { type: 'klotz', at: [47.15, rinneY(47.3) + 0.8, RZ], size: [0.3, 2.4, 3.6], look: 'zink' },

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

    { type: 'stern', at: [10, 0.9, -3] },
    { type: 'stern', at: [35.5, y(-10) + 0.9, -10] },
    { type: 'stern', at: [21.1, y(-12.6) + 0.9, -12.6] },
    { type: 'stern', at: [31.5, -5.1, L] },
    { type: 'stern', at: [48.6, y(-24) + 1.2, -24] },
    // versteckt am Ende des Firsts links, unter der Antenne
    { type: 'stern', at: [-5.2, 0.9, -3], bonus: true }
  ]
};
