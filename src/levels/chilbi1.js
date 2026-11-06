// Chilbi 1: Rössliriiti. Durch den Torbogen auf die Chilbi, zwischen den Buden über klebrige Zuckerwatte (links in der
// Ecke hinter der Bude klebt der Bonusstern), beim Büchsenwerfen die Dosen umkegeln, aufs Karussell (den Rössli
// ausweichen, sie drehen langsam) und rechts hinaus zum Rutschturm: die Rutsche einmal rundherum hinunter bis vors Zirkuszelt.
const K = [0, 0, -36];  // Karussell: Mitte des Bodens
const T = [16, 0, -41]; // Rutschturm: Mitte (die Rutsche beginnt 5 m davor und kreist links herum)
const U = -5;           // Höhe unten nach der Rutsche

export default {
  id: 'c1', name: 'Rössliriiti', emoji: '🍭', theme: 'chilbi',
  start: [0, 0, 2], killY: -13,
  parts: [
    // Eingang: unter dem Torbogen durch, links und rechts eine Bude
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'torbogen', at: [0, 0, 0], yaw: 180 },
    { type: 'klotz', at: [-6.5, -0.5, -4.5], size: [7, 1, 9], deko: true },
    { type: 'klotz', at: [6.5, -0.5, -4.5], size: [7, 1, 9], deko: true },
    { type: 'deko', form: 'bude', at: [-6.6, 0, -4.5], yaw: -90 },
    { type: 'deko', form: 'bude', at: [6.6, 0, -4.5], yaw: 90, farbe: 0x1E88E5 },
    { type: 'deko', form: 'lolli', at: [4.2, 0, -0.9], yaw: 180, scale: 0.6, farbe: 0xFB8C00 },

    // Zuckerwatte klebt und bremst; links eine Ecke voll Zuckerwatte mit dem Bonusstern
    { type: 'weg', from: [0, 0, -8], to: [0, 0, -13], width: 5, surface: 'zuckerwatte' },
    { type: 'wand', from: [2.7, 0, -8], to: [2.7, 0, -13] },
    { type: 'wand', from: [-2.7, 0, -8], to: [-2.7, 0, -9.25] },
    { type: 'wand', from: [-2.7, 0, -11.75], to: [-2.7, 0, -13] },
    { type: 'nische', at: [-2.5, 0, -10.5], yaw: 90, surface: 'zuckerwatte' },
    { type: 'deko', form: 'zuckerwatte', at: [5, 0, -10.5], scale: 1.3 },
    { type: 'deko', form: 'zuckerwatte', at: [-8, 0, -10.5], farbe: 0x9FD8F5 },

    // Büchsenwerfen: breiter Platz, die Dosen stehen als Dreieck wie Kegel
    { type: 'weg', from: [0, 0, -13], to: [0, 0, -25], width: 7, walls: 0.8 },
    { type: 'wand', from: [-3.7, 0, -13], to: [-2.7, 0, -13] },
    { type: 'wand', from: [2.7, 0, -13], to: [3.7, 0, -13] },
    { type: 'wand', from: [-3.7, 0, -25], to: [-2.7, 0, -25] },
    { type: 'wand', from: [2.7, 0, -25], to: [3.7, 0, -25] },
    { type: 'domino', form: 'dose', from: [0, 0, -17.5], to: [0, 0, -19.9], count: 3, quer: 3, size: [0.9, 1.2, 0.9] },
    // Bude daneben mit einer Dosen-Pyramide auf der Theke, links Ballone
    { type: 'klotz', at: [7.6, -0.5, -19], size: [7, 1, 9], deko: true },
    { type: 'deko', form: 'bude', at: [7.9, 0, -19], yaw: 90, farbe: 0xFDD835 },
    { type: 'deko', form: 'dose', at: [7.3, 2.25, -18.4], farbe: 0x1E88E5 },
    { type: 'deko', form: 'dose', at: [7.3, 2.25, -19.6] },
    { type: 'deko', form: 'dose', at: [7.3, 3.55, -19], farbe: 0xFDD835 },
    { type: 'deko', form: 'ballons', at: [-5.3, 0, -20] },

    // Rössliriiti: rundes Karussell, zwei Rössli drehen langsam im Kreis; hinein von vorne, hinaus nach rechts
    { type: 'weg', from: [0, 0, -25], to: [0, 0, -29.9], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -27], size: [5, 3, 3] },
    { type: 'schuessel', art: 'karussell', at: K, r: 6.5, R: 7, h: 1, rim: 0.4, offen: [180, -90], luecke: 3.5 },
    { type: 'balken', form: 'pferd', enden: true, at: K, length: 10, speed: 28 },
    { type: 'deko', form: 'herz', at: [-9.6, 0, -33], yaw: -60 },
    { type: 'deko', form: 'popcorn', at: [-7.4, 0, -43.6], scale: 0.9 },
    { type: 'deko', form: 'lukas', at: [9.6, 0, -30.6], yaw: 180 },

    // nach rechts zum Rutschturm
    { type: 'weg', from: [6.1, 0, -36], to: [12, 0, -36], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [9.5, 0, -36], yaw: -90, size: [5, 3, 3] },
    { type: 'weg', from: [12, 0, -36], to: [16, 0, -36], width: 3.2, walls: 0.8 },
    { type: 'wand', from: [12, 0, -38.7], to: [12, 0, -38] },
    { type: 'wand', from: [12, 0, -34], to: [12, 0, -33.3] },
    // Rutsche: eine und eine Viertelrunde links um den Turm, 5 m hinunter
    { type: 'rinne', at: [16, 0, -36], yaw: -90, turn: -450, radius: 5, rise: U, r: 1.6, bogen: 80, farbe: 0xFDD835 },
    { type: 'deko', form: 'turm', at: [T[0], -14, T[2]], scale: 1.3 },

    // Auslauf bis vors Zirkuszelt
    { type: 'weg', from: [21, U, -41], to: [21, U, -60], width: 4, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [21, U, -45.5], size: [4, 3, 3] },
    { type: 'ziel', at: [21, U, -56.5] },
    { type: 'klotz', at: [21, U - 0.5, -66.2], size: [12, 1, 12], deko: true },
    { type: 'deko', form: 'zelt', at: [21, U, -66], yaw: 180 },
    { type: 'deko', form: 'ballons', at: [25, U, -57], farbe: 0x43A047 },
    { type: 'deko', form: 'lolli', at: [17, U, -57], yaw: 180 },

    { type: 'stern', at: [0, 0.9, -4] },
    { type: 'stern', at: [0, 0.9, -10.5] },
    { type: 'stern', at: [0, 0.9, -22.5] },
    { type: 'stern', at: [2.6, 0.9, -33.4] },
    { type: 'stern', at: [16, -1.1, -46] },
    { type: 'stern', at: [-5, 0.9, -10.5], bonus: true }
  ]
};
