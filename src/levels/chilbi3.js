// Chilbi 3: Achterbahn. Die Murmel ist der Wagen: Am Bahnhof zieht sie der Kettenlift hinauf, oben geht es die rote
// Schiene steil hinunter, mit dem Turbo durch den Looping und in der Zuckerwatte wieder zum Stehen. Dann die Helix:
// eine ganze Runde in der Steilkurve hinunter. Unten wartet die Schiessbude: die Kanone schiesst die Murmel an den
// Zielscheiben vorbei auf das Zuckerwatte-Kissen (rechts die Büchsen-Bude mit dem Bonusstern). Beim Hau den Lukas
// schlägt der grosse Hammer, auf der Putschauto-Bahn fahren zwei Autos quer, dahinter steht das Zirkuszelt mit dem Ziel.
const LIFT = 7, LOOP = 2, TAL = -3, BUDE = 1; // Höhen: Lift oben, Looping, nach der Helix, ab der Schiessbude
const BODEN = -12;                            // Boden der Welt (1 m unter killY), dort stehen die Stützen
// Stütze der Achterbahn vom Boden bis unter die Schiene
const stuetze = (x, z, oben) => ({ type: 'klotz', at: [x, (BODEN + oben) / 2, z], size: [0.6, oben - BODEN, 0.6], look: 'pfosten', deko: true });
// Sockel neben der Bahn (nur Grafik), darauf steht ein Gegenstand
const sockel = (x, y, z, b = 3, t = 3) => ({ type: 'klotz', at: [x, y - 0.5, z], size: [b, 1, t], deko: true });

export default {
  id: 'c3', name: 'Achterbahn', emoji: '🎢', theme: 'chilbi',
  start: [0, 0, 2], killY: -11,
  parts: [
    // Bahnhof: Steg mit Torbogen, links die Kasse
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'wand', from: [-2.7, 0, -6], to: [-1.9, 0, -6], look: 'zelt-rot' },
    { type: 'wand', from: [1.9, 0, -6], to: [2.7, 0, -6], look: 'zelt-rot' },
    sockel(-3.6, 0, -5, 1.2, 1.2), sockel(3.6, 0, -5, 1.2, 1.2),
    { type: 'deko', form: 'torbogen', at: [0, 0, -5] },
    sockel(-7, 0, 1, 8, 6),
    { type: 'deko', form: 'bude', at: [-7.5, 0, 1], yaw: -90 },
    sockel(5, 0, 2, 4, 4),
    { type: 'deko', form: 'ballons', at: [5, 0, 3] },
    { type: 'deko', form: 'zuckerwatte', at: [5.4, 0, 0.8] },

    // Kettenlift: das Band zieht die Murmel hinauf
    { type: 'band', from: [0, 0, -6], to: [0, LIFT, -24], width: 3, walls: 0.8, speed: 4 },
    { type: 'weg', from: [0, LIFT, -24], to: [0, LIFT, -30], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [0, LIFT, -27.5], size: [3, 3, 2] },
    stuetze(-1.4, -15, 2.4), stuetze(1.4, -15, 2.4), stuetze(-1.4, -25, LIFT - 1), stuetze(1.4, -25, LIFT - 1),
    { type: 'deko', form: 'turm', at: [-7, BODEN, -27], scale: 1.5 },

    // Erste Abfahrt: rote Schiene, oben steil, unten immer flacher (sonst springt die Murmel am Knick)
    { type: 'rinne', from: [0, LIFT, -30], to: [0, 3.2, -39], r: 1.6, bogen: 75, farbe: 0xE53935 },
    { type: 'rinne', from: [0, 3.2, -39], to: [0, 2.3, -43], r: 1.6, bogen: 75, farbe: 0xE53935 },
    { type: 'rinne', from: [0, 2.3, -43], to: [0, LOOP, -47], r: 1.6, bogen: 75, farbe: 0xE53935 },
    stuetze(0, -36, 4), stuetze(0, -45, 1.7),
    // Turbo und Looping, Ausfahrt 5 m weiter rechts
    { type: 'weg', from: [0, LOOP, -47], to: [0, LOOP, -52], width: 3, walls: 0.8 },
    { type: 'turbo', at: [0, LOOP, -50.5], size: [2.6, 2], speed: 13 },
    { type: 'looping', at: [0, LOOP, -52], yaw: 0, radius: 3, width: 3, shift: 5 },
    stuetze(-2.2, -52, LOOP + 5), stuetze(7.2, -52, LOOP + 5),
    // Auslauf: die Zuckerwatte bremst
    { type: 'weg', from: [5, LOOP, -52], to: [5, LOOP, -56], width: 4, walls: 0.8 },
    { type: 'weg', from: [5, LOOP, -56], to: [5, LOOP, -61], width: 4, walls: 0.8, surface: 'zuckerwatte' },
    { type: 'checkpoint', at: [5, LOOP, -59.5], size: [4, 3, 2] },
    { type: 'wand', from: [2.8, LOOP, -61], to: [3.5, LOOP, -61], look: 'zelt-gelb' },
    { type: 'wand', from: [6.5, LOOP, -61], to: [7.2, LOOP, -61], look: 'zelt-gelb' },
    { type: 'weg', from: [5, LOOP, -61], to: [5, LOOP, -64], width: 2.6, walls: 0.8 },
    sockel(9, LOOP, -58.5),
    { type: 'deko', form: 'zuckerwatte', at: [9, LOOP, -58.5] },

    // Helix: eine ganze Runde rechts herum hinunter, wer schnell ist, fährt die Wand hoch (mit Vollgas fliegt man hinaus)
    { type: 'rinne', at: [5, LOOP, -64], yaw: 0, turn: 360, radius: 6, rise: TAL - LOOP, r: 1.6, bogen: 90, farbe: 0xFDD835 },
    stuetze(11, -64, LOOP), stuetze(11, -70, 0.3), stuetze(17, -64, -0.95), stuetze(11, -58, -2.2),
    { type: 'weg', from: [5, TAL, -64], to: [5, TAL, -71], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [5, TAL, -68], size: [5, 3, 2] },

    // Schiessbude: die Kanone schiesst im hohen Bogen hinauf auf das Zuckerwatte-Kissen (dort springt nichts mehr),
    // links und rechts stehen die Zielscheiben
    { type: 'wand', from: [2.3, TAL, -71], to: [3.5, TAL, -71], look: 'zelt-blau' },
    { type: 'wand', from: [6.5, TAL, -71], to: [7.7, TAL, -71], look: 'zelt-blau' },
    { type: 'weg', from: [5, TAL, -71], to: [5, TAL, -77], width: 2.6, walls: 0.8, caps: 'end' },
    { type: 'kanone', at: [5, TAL, -75], target: [5, BUDE, -92], time: 2.2 },
    { type: 'weg', from: [5, BUDE, -88], to: [5, BUDE, -97], width: 4, walls: 0.8, caps: 'start', surface: 'zuckerwatte' },
    sockel(0.8, BUDE, -89.5, 3, 2), sockel(9.2, BUDE, -91.5, 3, 2), sockel(0.8, BUDE, -95, 3, 2),
    { type: 'deko', form: 'zielscheibe', at: [0.8, BUDE, -89.5], yaw: 180 },
    { type: 'deko', form: 'zielscheibe', at: [9.2, BUDE, -91.5], yaw: 180 },
    { type: 'deko', form: 'zielscheibe', at: [0.8, BUDE, -95], yaw: 180 },
    // Büchsen-Bude rechts: in der Nische schwebt der Bonusstern über den Büchsen (hineinfahren und sie umwerfen)
    { type: 'weg', from: [5, BUDE, -97], to: [5, BUDE, -104], width: 4 },
    { type: 'wand', from: [2.8, BUDE, -97], to: [2.8, BUDE, -104] },
    { type: 'wand', from: [7.2, BUDE, -97], to: [7.2, BUDE, -99.25] },
    { type: 'wand', from: [7.2, BUDE, -101.75], to: [7.2, BUDE, -104] },
    { type: 'checkpoint', at: [5, BUDE, -98], size: [4, 3, 2], side: -1 },
    { type: 'nische', at: [7, BUDE, -100.5], yaw: -90 },
    { type: 'domino', from: [7.9, BUDE, -100.5], to: [8.8, BUDE, -100.5], count: 2, quer: 3, abstand: 0.9, size: [0.8, 1.1, 0.8], form: 'dose' },
    sockel(9, BUDE, -96.5, 3, 3),
    { type: 'deko', form: 'popcorn', at: [9, BUDE, -96.5] },

    // Hau den Lukas: unter dem grossen Hammer durch, wenn er oben ist
    { type: 'weg', from: [5, BUDE, -104], to: [5, BUDE, -113], width: 4, walls: 0.5 },
    { type: 'hammer', at: [5, BUDE, -108.5], side: -1, length: 4, size: [3.8, 1.4, 1.6], farbe: 'rot', offset: 1.7 },
    sockel(8.8, BUDE, -108.5),
    { type: 'deko', form: 'lukas', at: [8.8, BUDE, -108.5] },
    { type: 'weg', from: [5, BUDE, -113], to: [5, BUDE, -115], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [5, BUDE, -114], size: [4, 3, 2] },

    // Putschauto-Bahn: zwei Autos fahren quer hin und her und schubsen die Murmel weg
    { type: 'klotz', at: [5, BUDE - 0.5, -122], size: [12, 1, 14] },
    { type: 'wand', from: [-1.2, BUDE, -115], to: [-1.2, BUDE, -129], look: 'zelt-blau' },
    { type: 'wand', from: [11.2, BUDE, -115], to: [11.2, BUDE, -129], look: 'zelt-blau' },
    { type: 'wand', from: [-1.4, BUDE, -114.8], to: [2.8, BUDE, -114.8], look: 'zelt-blau' },
    { type: 'wand', from: [7.2, BUDE, -114.8], to: [11.4, BUDE, -114.8], look: 'zelt-blau' },
    { type: 'wand', from: [-1.4, BUDE, -129.2], to: [2.3, BUDE, -129.2], look: 'zelt-blau' },
    { type: 'wand', from: [7.7, BUDE, -129.2], to: [11.4, BUDE, -129.2], look: 'zelt-blau' },
    { type: 'schieber', form: 'putschauto', from: [2.4, BUDE, -119], to: [7.6, BUDE, -119], size: [2.4, 1.4, 3.4], yaw: -90, time: 1.6, pause: 1.6 },
    { type: 'schieber', form: 'putschauto', from: [7.6, BUDE, -125], to: [2.4, BUDE, -125], size: [2.4, 1.4, 3.4], yaw: 90, time: 1.6, pause: 1.6 },

    // Ziel vor dem Zirkuszelt
    { type: 'weg', from: [5, BUDE, -129], to: [5, BUDE, -137], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [5, BUDE, -134] },
    sockel(5, BUDE, -143, 11, 11),
    { type: 'deko', form: 'zelt', at: [5, BUDE, -143], yaw: 180 },
    sockel(-0.5, BUDE, -133, 3, 3), sockel(10.5, BUDE, -133, 3, 3),
    { type: 'deko', form: 'herz', at: [-0.5, BUDE, -133], yaw: 180 },
    { type: 'deko', form: 'lolli', at: [10.5, BUDE, -133], yaw: 180 },

    { type: 'stern', at: [0, 4.4, -15] },
    { type: 'stern', at: [2.5, LOOP + 5.3, -52] },
    { type: 'stern', at: [17, -0.5 + 0.9, -64] },
    { type: 'stern', at: [5, BUDE + 0.9, -92] },
    { type: 'stern', at: [5, BUDE + 0.9, -122] },
    { type: 'stern', at: [8.6, BUDE + 1.2, -100.5], bonus: true, r: 1.4 }
  ]
};
