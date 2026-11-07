// Kinderzimmer 1: Schreibtisch (Echte Orte, grauer Rohbau). Die Murmel ist echt gross (Ø 1.6 cm, 1 Einheit = 1.6 cm).
// Eine lange Strecke durchs halbe Zimmer: Start am Ostende der Fensterbank (Stein, rollt weit), nach Westen im Slalom um
// Blumentöpfe und einen Kaktus, durch den Durchzug zum offenen Fenster (wer hinausfällt, landet im Garten), durch den
// Untersetzer mit Erde (Checkpoint davor), an Spielfiguren vorbei bis ans Westende. Dort führt ein Lineal über die Lücke
// neben dem Tisch auf einen hohen Bücherturm (wer fällt, landet auf dem Zimmerboden). Die Bücher hinunter, über das Lineal,
// das auf einem Radiergummi wippt, im Gegenwind des Tischventilators (Checkpoint), Slalom zwischen Farbstiften auf dem Heft,
// am Hufeisenmagneten an der Tischkante vorbei in den Kugelschreiber. Dort zielt man selbst (Richtung ±30°, Weite 15 bis 44):
// Nur wer quer über den Tisch genau das Mauspad auf Atlas und Lexikon trifft (41 weit, 8 × 8), bleibt oben liegen (Checkpoint).
// Zu kurz landet auf dem Tisch: zurück zum Kugelschreiber oder die Rampe (schräges Schulbuch) hinauf auf den Stapel. Zu weit
// rollt vom Stapel nach Westen in die Ecke beim Stiftebecher (Sackgasse, von dort geht es nur noch auf den Boden); zu weit
// rechts prallt an den Spieleschachteln ab oder landet auf der Fensterbank. Eine Reihe Farbstifte trennt die Gasse am
// linken Tischrand vom übrigen Tisch: hinein kommt man nur über die Lineal-Rutsche vom Stapel. In der Gasse unter dem Locher
// durch (Checkpoint), übers kleine Lineal in die offene Schublade (Checkpoint), durch die Bauklötze in
// das Eisstiel-Katapult, das sie über die Schubladenwand auf den Stuhl schleudert (Checkpoint). Über die Jacke, am
// Kuscheltier vorbei, die Autorennbahn hinunter auf die Spielmatte am Boden und in den Becher.
// Spieleschachteln stehen hochkant an der Fensterbank: von der Bank fällt man nicht auf den Tisch (sonst Abkürzung).
// Raum und Möbel: src/orte/kinderzimmer.js. Level-Nullpunkt = Tischplatte oben, 10 cm vom Westende, Mitte der Tiefe;
// yaw 90: Osten = -z (vorwärts), Fenster (Süden) rechts (+x), Stuhl und Schublade links (-x).
// Tischplatte: x -25..25, z 6.25..-68.75, Oberkante y 0. Fensterbank: x 15.63..31.25, z 21.88..-71.88, y 9.38.
// Stuhl: Sitz x -28.1..-56.25, z -15.6..-46.9, y -18.75. Zimmerboden: y -46.875 (killY knapp darunter).
import kinderzimmer from '../../orte/kinderzimmer.js';

const U = 1.6;                    // cm pro Einheit
const BUCH = [13.13, 1.56, 17.5]; // Buch 21 × 2.5 × 28 cm
const STIFT = [7.5, 0.63, 0.63];  // dicker Farbstift, schon kurz gespitzt: 12 cm, Ø 1 cm (zu hoch zum Drüberrollen)
const HEFT_Y = 0.1;               // Heft liegt 1.6 mm hoch
const RADIERER = [3.13, 1.25, 0.63]; // Radiergummi 5 × 2 × 1 cm, hochkant, quer unter dem Lineal
// Fensterbank (Stein, 2 cm): 150 × 25 cm, 15 cm über dem Tisch, ragt über die hintere Tischkante bis zur Wand
const FB = { x0: 15.625, x1: 31.25, z0: 21.875, z1: -71.875, y: 9.375 };
const FB_X = (FB.x0 + FB.x1) / 2;
const TOPF = 7.5, TOPF_H = 7.5;   // Blumentopf Ø 12 cm, 12 cm hoch (Rohbau: Würfel)
// Bücherturm am Westende des Tischs: fünf Bücher, jedes 3 Einheiten weiter nach Westen, das oberste ragt über die Tischkante
const TURM_X = -5, TURM = [-10, -7, -4, -1, 2], TURM_Y = TURM.length * BUCH[1];
const TURM_LOOKS = ['buch-blau', 'buch-gruen', 'buch-rot', 'buch-blau', 'buch-gruen'];
// Lineal 30 cm über die Lücke: von der Fensterbank auf den Turm, z = 9 (westlich der Tischkante, darunter nur der Boden)
const LINEAL_Z = 9, LINEAL_D = 0.19;
// Schublade: 24 cm herausgezogen nach Norden (links), Boden 15 cm unter der Tischplatte, bis unter die Platte (4 cm) hoch
const SB = { x0: -40, x1: -25, z0: -65.63, z1: -47.5 };
const SB_Y = -9.375;              // Oberkante Schubladenboden
// Slalom auf dem Heft: Stifte quer (entlang x), abwechselnd links und rechts, die Murmel fährt nach vorne (-z)
const SLALOM = [[1.25, 'stift-gelb', -45], [7.4, 'stift-rot', -47.75], [1.25, 'stift-blau', -50.5], [7.4, 'stift-gruen', -53.25], [1.25, 'stift-gelb', -56]];
// Spieleschachteln hochkant an der Fensterbank (7 cm dick, 28 bis 35 cm lang, 26 bis 31 cm hoch)
const SCHACHTELN = [[6.25, 17.5, 17.5, 'schachtel-rot'], [-11.25, 20, 18.75, 'schachtel-gelb'], [-31.25, 18.75, 16.25, 'schachtel-blau'], [-50, 18.75, 19.4, 'schachtel-gruen']];
// Stapel quer über dem Tisch (Atlas und Lexikon, 21 × 28 cm, zusammen 7 cm), darauf Mauspad und Federmäppchen
const STAPEL = { x0: -25, x1: -11.87, z0: -32.5, z1: -15 }, STAPEL_Y = 4.38, PAD_Y = STAPEL_Y + 0.19;
const GASSE_X = -17.3;            // Farbstifte der Reihe nach hingelegt: Gasse x -25..-17.6 vom Stapel bis zur Schublade
// Stuhl: Sitzkissen (4 cm) auf dem Sitz
const KISSEN_Y = -18.75 + 2.5;
const BODEN_Y = -75 / U;          // Zimmerboden
const MATTE_Y = BODEN_Y + 0.625;  // Spielmatte (Schaumstoff 1 cm)

// Blumentopf mit Pflanze (Pflanze nur zum Anschauen)
const topf = (x, z) => [
  { type: 'klotz', at: [x, FB.y + TOPF_H / 2, z], size: [TOPF, TOPF_H, TOPF], look: 'topf' },
  { type: 'klotz', at: [x, FB.y + TOPF_H + 4, z], size: [TOPF - 1, 8, TOPF - 1], look: 'pflanze', deko: true }
];
const figur = (x, z) => ({ type: 'klotz', at: [x, FB.y + 1, z], size: [1.2, 2, 1.2], look: 'figur' });

export default {
  id: 'kz1', name: 'Schreibtisch', emoji: '✏️', theme: 'zuhause',
  ort: kinderzimmer,
  bereich: { at: [150, 75, 50], yaw: 90, strecke: ['schreibtisch', 'fensterbank'] },
  start: [FB_X, FB.y, -69], startYaw: 180, killY: BODEN_Y + 0.4,
  parts: [
    // Tischplatte (4 cm), ohne richtung: der Blick folgt der Rollrichtung
    { type: 'klotz', at: [0, -1.25, -31.25], size: [50, 2.5, 75], look: 'holz' },

    // 1. Fensterbank aus Stein: glatt, rollt weit. Zum Fenster hin ist es offen (Garten), zum Zimmer hin stehen die Schachteln
    { type: 'klotz', at: [FB_X, FB.y - 0.625, (FB.z0 + FB.z1) / 2], size: [FB.x1 - FB.x0, 1.25, FB.z0 - FB.z1], look: 'stein', surface: 'stein', richtung: 180 },
    ...SCHACHTELN.map(([z, l, h, look]) => ({ type: 'klotz', at: [13.44, h / 2, z - l / 2], size: [4.375, h, l], look })),
    // Vorhang an beiden Enden zusammengerafft (bremst stark)
    { type: 'klotz', at: [FB_X, FB.y + 15, FB.z1 + 0.625], size: [FB.x1 - FB.x0, 30, 1.25], look: 'vorhang', surface: 'stoff' },
    { type: 'klotz', at: [FB_X, FB.y + 15, FB.z0 - 0.625], size: [FB.x1 - FB.x0, 30, 1.25], look: 'vorhang', surface: 'stoff' },
    // Slalom: Topf am Fenster, Topf an den Schachteln (daneben bläst der Durchzug zum offenen Fenster), Kaktus am Fenster
    ...topf(FB.x1 - TOPF / 2 - 0.3, -62),
    ...topf(FB.x0 + TOPF / 2 + 0.3, -52),
    { type: 'wind', at: [FB_X, FB.y, -52], size: [10, 6, FB.x1 - FB.x0], yaw: -90, strength: 2 },
    { type: 'klotz', at: [FB.x1 - 2.5, FB.y + 1.5, -44], size: [4, 3, 4], look: 'topf' },  // Kaktustopf
    { type: 'klotz', at: [FB.x1 - 2.5, FB.y + 5, -44], size: [2, 4, 2], look: 'kaktus' },  // Kaktus (Rohbau: Hindernis)
    figur(17, -42),
    { type: 'checkpoint', at: [FB_X, FB.y, -36], size: [12, 3, 3], yaw: 180 },
    // Untersetzer mit Erde (sand bremst), offen nach Osten und Westen, daneben ein kleiner Topf am Fenster
    { type: 'schuessel', at: [FB_X, FB.y, -28], r: 3, R: 3.75, h: 0.6, rim: 0.3, art: 'topf', offen: [0, 180], luecke: 2.6, surface: 'sand' },
    { type: 'klotz', at: [FB.x1 - 2.2, FB.y + TOPF_H / 2, -28], size: [3.5, TOPF_H, 3.5], look: 'topf' },
    { type: 'klotz', at: [FB.x1 - 2.2, FB.y + TOPF_H + 3, -28], size: [3, 6, 3], look: 'pflanze', deko: true },
    figur(22, -19), figur(25.5, -14), figur(21, -9),
    ...topf(FB.x1 - TOPF / 2 - 0.3, -2),

    // 2. Lineal 30 × 3 cm über die Lücke neben dem Tisch auf den Bücherturm. Schmal und ohne Rand.
    { type: 'weg', from: [16.6, FB.y + 0.03, LINEAL_Z], to: [-2.15, TURM_Y + LINEAL_D, LINEAL_Z], width: 1.875, thick: LINEAL_D, look: 'lineal' },
    ...TURM.map((z, i) => ({ type: 'klotz', at: [TURM_X + (i % 2 ? 0.4 : -0.3), BUCH[1] * (i + 0.5), z], size: BUCH, look: TURM_LOOKS[i], richtung: 0 })),

    // 3. Lineal wippt auf einem Radiergummi, der Tischventilator bläst quer darüber zum Stuhl
    { type: 'wippe', at: [4, 1.73, -31], size: [1.875, 18.75], yaw: 0, angle: 10, rim: 0, look: 'lineal' },
    { type: 'klotz', at: [4, RADIERER[1] / 2, -31], size: RADIERER, look: 'radierer', deko: true },
    { type: 'wind', at: [4, 0, -31], size: [8, 6, 12], yaw: 90, strength: 2 },
    { type: 'klotz', at: [9.5, 0.3, -31], size: [3.5, 0.6, 5], look: 'ventilator', deko: true },  // Fuss
    { type: 'klotz', at: [9.5, 3.3, -31], size: [0.9, 5.4, 0.9], look: 'ventilator', deko: true }, // Stiel
    { type: 'klotz', at: [9.3, 6, -31], size: [1.6, 2.5, 2.5], look: 'ventilator', deko: true },   // Motor
    { type: 'checkpoint', at: [4, 0, -42.5], size: [8, 3, 3] },

    // 4. Heft A4 hochkant, darauf der Slalom zwischen fünf Farbstiften
    { type: 'klotz', at: [4.5, HEFT_Y / 2, -51.5], size: [13.13, HEFT_Y, 18.56], look: 'papier', richtung: 0 },
    ...SLALOM.map(([x, look, z]) => ({ type: 'klotz', at: [x, HEFT_Y + STIFT[1] / 2, z], size: STIFT, look })),

    // 5. Hufeisenmagnet an der Tischkante (Ostende) zieht die Murmel zur Kante
    { type: 'magnet', at: [8, 0, -66.8], radius: 7, strength: 4 },

    // 6. Kugelschreiber als Katapult zum Zielen: Richtung ±30° um Westen, Weite 15 bis 44 (Start 25), 4 s Zeit.
    //    Gut: Mauspad auf dem Stapel (Mitte -16, -26, 41 weit, 25° links). Das Mäppchen dahinter und ein Stift am
    //    linken Rand halten die Murmel; über die Lineal-Rutsche geht es in die Gasse am linken Tischrand.
    { type: 'kanone', at: [1, 0, -63], yaw: 180, zielen: { winkel: 30, weite: [15, 44], zeit: 4, hoehe: PAD_Y, start: 25 }, look: 'kugelschreiber' },
    { type: 'klotz', at: [(STAPEL.x0 + STAPEL.x1) / 2, 1.25, (STAPEL.z0 + STAPEL.z1) / 2], size: [STAPEL.x1 - STAPEL.x0, 2.5, STAPEL.z1 - STAPEL.z0], look: 'buch-rot', richtung: 0 },  // Atlas
    { type: 'klotz', at: [(STAPEL.x0 + STAPEL.x1) / 2, 3.44, (STAPEL.z0 + STAPEL.z1) / 2], size: [STAPEL.x1 - STAPEL.x0, 1.88, STAPEL.z1 - STAPEL.z0], look: 'buch-blau', richtung: 0 }, // Lexikon
    { type: 'klotz', at: [-16, STAPEL_Y + 0.095, -26], size: [8, 0.19, 8], look: 'mauspad', surface: 'handtuch' }, // Mauspad 13 × 13 cm, Neopren
    { type: 'klotz', at: [-18.4, STAPEL_Y + 1.565, -19.5], size: [12.5, 3.13, 5], look: 'maeppchen' },  // Federmäppchen 20 × 8 × 5 cm, quer
    { type: 'klotz', at: [-24.6, STAPEL_Y + STIFT[1] / 2, -25.75], size: [STIFT[1], STIFT[1], STIFT[0]], look: 'stift-rot' }, // Stift am linken Rand
    { type: 'checkpoint', at: [-20, STAPEL_Y, -31], size: [6, 3, 3] },
    // Rutsche: Lineal 15 cm vom Stapel hinunter in die Gasse
    { type: 'weg', from: [-21, STAPEL_Y, STAPEL.z0 - 0.05], to: [-21, 0.1, -42], width: 1.875, thick: LINEAL_D, look: 'lineal' },
    // Rampe zurück auf den Stapel für zu kurze Schüsse: Schulbuch schräg an den Stapel gelehnt
    { type: 'weg', from: [1.6, 0, -24], to: [STAPEL.x1, STAPEL_Y, -24], width: 4, thick: 0.3, look: 'buch-gruen' },
    // Farbstifte der Reihe nach: trennen die Gasse vom übrigen Tisch
    ...[-36.25, -43.5, -50.75, -58, -65].map((z, i) => ({ type: 'klotz', at: [GASSE_X, STIFT[1] / 2, z], size: [STIFT[1], STIFT[1], STIFT[0]], look: ['stift-gelb', 'stift-blau', 'stift-gruen', 'stift-rot', 'stift-gelb'][i] })),

    // 7. Schreibtischlampe am Westende neben dem Turm: runder Fuss und Stange (als Klötze), Arm und Schirm nur zum Anschauen
    { type: 'klotz', at: [6.5, 0.6, -8], size: [9.38, 1.2, 9.38], look: 'lampe' },
    { type: 'klotz', at: [7, 12.6, -11], size: [1.2, 22.8, 1.2], look: 'lampe' },
    { type: 'klotz', at: [2, 24, -8], size: [11.7, 1, 1], yaw: 31, look: 'lampe', deko: true },
    { type: 'klotz', at: [-3, 22.5, -5], size: [7, 3, 7], look: 'lampe', deko: true },

    // 8. Locher in der Gasse: der Hebel schlägt auf die Strecke, Gehäuse hinter den Stiften
    { type: 'hammer', at: [-21, 0, -54], side: 1, length: 4, size: [3.2, 1.4, 1.6], look: 'locher', offset: 1.7 },
    { type: 'klotz', at: [-16.3, 0.7, -54], size: [2.4, 1.4, 4], look: 'locher-dunkel', deko: true },
    { type: 'checkpoint', at: [-20.5, 0, -59], size: [7, 3, 3] },

    // 9. Kleines Lineal (15 cm) auf einem Radiergummi als Sprungschanze über die Tischkante in die Schublade
    { type: 'weg', from: [-19.2, 0.1, -62], to: [-24.75, 1.35, -62], width: 1.875, look: 'lineal' },
    { type: 'klotz', at: [-24, RADIERER[1] / 2, -62], size: [0.63, 1.25, 3.13], look: 'radierer', deko: true },

    // Dinge auf dem Tisch neben der Strecke
    { type: 'klotz', at: [-19, 3.125, 0], size: [5, 6.25, 5], look: 'becher' },           // Stiftebecher 8 × 10 cm

    // 10. Schublade: Boden, Front und Seiten (hinten schliesst die Tischplatte ab), Filz zum Landen, Bauklötze, Katapult
    { type: 'klotz', at: [(SB.x0 + SB.x1) / 2, -9.69, (SB.z0 + SB.z1) / 2], size: [SB.x1 - SB.x0, 0.63, SB.z1 - SB.z0], look: 'schublade' },
    { type: 'wand', from: [SB.x0, SB_Y, SB.z1], to: [SB.x0, SB_Y, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x0, SB_Y, SB.z1], to: [SB.x1, SB_Y, SB.z1], height: 5, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x0, SB_Y, SB.z0], to: [SB.x1, SB_Y, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'wand', from: [SB.x1, SB_Y, SB.z1], to: [SB.x1, SB_Y, SB.z0], height: 6.88, thick: 0.63, look: 'schublade' },
    { type: 'klotz', at: [-30, SB_Y + 0.15, -61], size: [9, 0.3, 7], look: 'filz', surface: 'handtuch' }, // Filzmatte
    { type: 'checkpoint', at: [-30.5, SB_Y + 0.3, -61], size: [8, 3, 6], yaw: 180 },
    { type: 'domino', from: [-33, SB_Y, -58.5], to: [-33, SB_Y, -55.5], count: 4, size: [1.9, 2.5, 0.63], look: 'bauklotz' }, // Bauklötze 3 × 4 × 1 cm
    // Eisstiel-Katapult: schleudert die Murmel hoch über die Schubladenwand auf den Stuhl
    { type: 'kanone', at: [-33, SB_Y, -50.5], target: [-42, KISSEN_Y, -37], time: 4, look: 'katapult' },

    // 11. Stuhl: Sitzkissen (Stoff bremst), ein Kissen an der Lehne, die Jacke als Hügel, das Kuscheltier
    { type: 'klotz', at: [-41.5, KISSEN_Y - 1.25, -31.25], size: [26, 2.5, 30], look: 'sitzkissen', surface: 'stoff', richtung: 180 },
    { type: 'klotz', at: [-52.5, KISSEN_Y + 5, -31.25], size: [4, 10, 28], look: 'kissen', surface: 'stoff' },
    { type: 'checkpoint', at: [-42, KISSEN_Y, -38], size: [10, 3, 8], yaw: 180 },
    { type: 'weg', from: [-44, KISSEN_Y, -31], to: [-44, KISSEN_Y + 1.25, -28], width: 8, look: 'jacke', surface: 'stoff' },
    { type: 'weg', from: [-44, KISSEN_Y + 1.25, -28], to: [-44, KISSEN_Y, -25], width: 8, look: 'jacke', surface: 'stoff' },
    { type: 'klotz', at: [-35, KISSEN_Y + 2.5, -28], size: [5, 5, 5], look: 'kuscheltier' },

    // 12. Autorennbahn (Plastik, 4 cm breit) vom Stuhl hinunter auf die Spielmatte, in den Becher am Boden
    { type: 'weg', from: [-42, KISSEN_Y, -16.25], to: [-42, -33, 3.75], width: 2.5, walls: 0.6, thick: 0.3, look: 'rennbahn-orange' },
    { type: 'weg', from: [-42, -33, 3.75], to: [-42, -42.3, 23.75], width: 2.5, walls: 0.6, thick: 0.3, look: 'rennbahn-orange' },
    { type: 'weg', from: [-42, -42.3, 23.75], to: [-42, MATTE_Y + 0.1, 46], width: 2.5, walls: 0.6, thick: 0.3, look: 'rennbahn-orange' },
    { type: 'klotz', at: [-42, MATTE_Y - 0.3125, 56], size: [20, 0.625, 22], look: 'matte', surface: 'handtuch', richtung: 180 },
    { type: 'schuessel', at: [-42, MATTE_Y, 62], r: 2, R: 3, h: 2.5, rim: 0.3, art: 'schuessel', offen: [0] },
    { type: 'ziel', at: [-42, MATTE_Y, 62], r: 1.8 },

    { type: 'stern', at: [28, FB.y + 0.9, -52] },          // im Durchzug neben dem Topf am Fenster
    { type: 'stern', at: [29, FB.y + 0.9, 14] },           // am Westende der Fensterbank, über der Lücke am Fenster
    { type: 'stern', at: [7, 9.7, LINEAL_Z] },             // mitten auf dem Lineal über der Lücke
    { type: 'stern', at: [7.5, 0.9, -62.5] },              // beim Magneten an der Tischkante
    { type: 'stern', at: [-30.5, KISSEN_Y + 0.9, -21] }    // an der Kante des Stuhls
  ]
};
