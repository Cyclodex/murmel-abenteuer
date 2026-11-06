// Kinderzimmer 3: Fensterbank (Echte Orte, grauer Rohbau). 1 Einheit = 1.6 cm, Murmel Ø 1.6 cm.
// Lange, schmale Steinplatte vor dem Fenster (draussen der Garten, OG-Höhe), vom Vorhang am Westende nach Osten:
// Slalom um Blumentöpfe und einen Kaktus, durch einen Untersetzer mit Erde (bremst), an Spielfiguren und Muscheln vorbei
// in eine grosse Muschel vor dem Vorhang am Ostende. Die Steinplatte ist glatt (Oberfläche stein: rollt weit),
// der Vorhang bremst (stoff). Zum Zimmer hin fällt man auf den Boden, zum Fenster hin ist Glas.
// Raum und Möbel: src/orte/kinderzimmer.js. Level-Nullpunkt = Fensterbank oben, Westende, Mitte der Tiefe;
// yaw 90: Osten = -z (vorwärts), Fenster (Süden) rechts (+x), Zimmer links (-x).
// Fensterbank: x -7.81..7.81, z 0..-93.75, Oberkante y 0. Zimmerboden: y -56.25 (= killY - 1).
import kinderzimmer from '../../orte/kinderzimmer.js';

const U = 1.6;                        // cm pro Einheit
const B = { b: 25 / U, l: 150 / U };  // Fensterbank 150 × 25 cm
const X0 = -B.b / 2, X1 = B.b / 2;    // Zimmerkante, Glas
const TOPF = 7.5, TOPF_H = 7.5;       // Blumentopf Ø 12 cm, 12 cm hoch (Rohbau: Würfel)
const VORHANG = { d: 2.5, h: 50, saum: 5.5 }; // Vorhang zusammengerafft an den Enden, Saum liegt auf der Fensterbank
const SAUM = 0.25;                    // Saum 4 mm dick
const MUSCHEL = [0, 0, -84];

// Blumentopf mit Pflanze (Pflanze nur zum Anschauen)
const topf = (x, z) => [
  { type: 'klotz', at: [x, TOPF_H / 2, z], size: [TOPF, TOPF_H, TOPF], look: 'topf' },
  { type: 'klotz', at: [x, TOPF_H + 4, z], size: [TOPF - 1, 8, TOPF - 1], look: 'pflanze', deko: true }
];

export default {
  id: 'kz3', name: 'Fensterbank', emoji: '🪴', theme: 'zuhause',
  ort: kinderzimmer,
  bereich: { at: [115, 90, 12.5], yaw: 90, strecke: ['fensterbank'] },
  start: [0, SAUM, -5], killY: -90 / U + 1,
  parts: [
    // Fensterbank aus Stein (2 cm): glatt, rollt weit
    { type: 'klotz', at: [0, -0.625, -B.l / 2], size: [B.b, 1.25, B.l], look: 'stein', surface: 'stein', richtung: 0 },
    // Fensterglas (und Wand neben dem Fenster): die Murmel bleibt drinnen
    { type: 'klotz', at: [X1 + 0.5, 10, -B.l / 2], size: [1, 20, B.l], look: 'glas' },

    // Vorhang am Westende: zusammengerafft, der Saum liegt auf der Fensterbank (stoff bremst stark)
    { type: 'klotz', at: [0, VORHANG.h / 2, -VORHANG.d / 2], size: [B.b, VORHANG.h, VORHANG.d], look: 'vorhang', surface: 'stoff' },
    { type: 'klotz', at: [0, SAUM / 2, -VORHANG.d - VORHANG.saum / 2], size: [B.b, SAUM, VORHANG.saum], look: 'vorhang', surface: 'stoff', richtung: 0 },

    // Slalom: Blumentopf am Glas, Blumentopf an der Zimmerkante, Kaktus am Glas
    ...topf(X1 - TOPF / 2 - 0.3, -15),
    ...topf(X0 + TOPF / 2 + 0.3, -26),
    { type: 'klotz', at: [X1 - 2.5, 1.5, -36], size: [4, 3, 4], look: 'topf' },              // Kaktustopf
    { type: 'klotz', at: [X1 - 2.5, 5, -36], size: [2, 4, 2], look: 'kaktus' },              // Kaktus (Rohbau: Hindernis)
    { type: 'klotz', at: [X0 + 1.5, 1, -38], size: [1.2, 2, 1.2], look: 'figur' },           // Spielfigur an der Kante

    { type: 'checkpoint', at: [-1, 0, -42], size: [10, 3, 3] },

    // Untersetzer mit Erde (sand bremst), offen nach Westen und Osten: der Weg führt hindurch
    { type: 'schuessel', at: [-1, 0, -51], r: 3, R: 3.75, h: 0.6, rim: 0.3, art: 'topf', offen: [0, 180], luecke: 2.6, surface: 'sand' },
    { type: 'klotz', at: [X1 - 2.2, TOPF_H / 2, -51], size: [3.5, TOPF_H, 3.5], look: 'topf' },
    { type: 'klotz', at: [X1 - 2.2, TOPF_H + 3, -51], size: [3, 6, 3], look: 'pflanze', deko: true },

    // Spielfiguren und Muscheln
    { type: 'klotz', at: [3, 1, -60], size: [1.2, 2, 1.2], look: 'figur' },
    { type: 'klotz', at: [-3.5, 1, -63], size: [1.2, 2, 1.2], look: 'figur' },
    ...topf(X1 - TOPF / 2 - 0.3, -70),
    { type: 'klotz', at: [X0 + 2, 0.4, -72], size: [2.5, 0.8, 2], look: 'muschel', yaw: 30 },
    { type: 'klotz', at: [X1 - 2.5, 0.4, -77], size: [2, 0.8, 1.8], look: 'muschel', yaw: -20 },
    // Fenstergriff am Fensterrahmen (nur zum Anschauen)
    { type: 'klotz', at: [X1 - 1, 9, -46.9], size: [2.5, 0.8, 0.8], look: 'griff', deko: true },

    // Grosse Muschel (Ziel), dahinter der Vorhang am Ostende
    { type: 'schuessel', at: MUSCHEL, r: 2, R: 3.5, h: 0.8, rim: 0.3, art: 'schuessel', offen: [180] },
    { type: 'ziel', at: MUSCHEL, r: 1.8 },
    { type: 'klotz', at: [0, SAUM / 2, -B.l + VORHANG.d + VORHANG.saum / 2], size: [B.b, SAUM, VORHANG.saum], look: 'vorhang', surface: 'stoff', richtung: 0 },
    { type: 'klotz', at: [0, VORHANG.h / 2, -B.l + VORHANG.d / 2], size: [B.b, VORHANG.h, VORHANG.d], look: 'vorhang', surface: 'stoff' },

    { type: 'stern', at: [-3.5, 0.9, -15] },                // neben dem ersten Topf
    { type: 'stern', at: [3.5, 0.9, -26] },                 // neben dem zweiten Topf
    { type: 'stern', at: [-1, 0.9, -51] },                  // in der Erde des Untersetzers
    { type: 'stern', at: [0, 0.9, -63] },                   // zwischen den Spielfiguren
    { type: 'stern', at: [-3.5, 0.9, -77] }                 // neben der Muschel an der Kante
  ]
};
