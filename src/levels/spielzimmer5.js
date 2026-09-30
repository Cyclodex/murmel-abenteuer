// Spielzimmer 5: Kugelbahn. Neu: Rutsche (gerade und als Serpentine), Spiraltrichter, Halfpipe.
// Koordinaten in Metern: x = rechts, y = oben, -z = vorwärts. Murmel-Radius 0.5.
const T = [30.5, -2.35, -27.2]; // Trichter: Mitte des Lochs (Bande oben bei y = 2.1, Anlauf bei 3)
const HP = 4, HPY = -7;         // Halfpipe: Radius, Höhe unten
// Stern an der Halfpipe-Wand: Winkel phi (Grad) von unten, Seite k (-1 links, 1 rechts)
const wand = (phi, k, z) => {
  const a = phi * Math.PI / 180;
  return [T[0] + k * (HP * Math.sin(a) - 0.5 * Math.sin(a)), HPY + HP * (1 - Math.cos(a)) + 0.5 * Math.cos(a), z];
};

export default {
  id: 'sz5',
  name: 'Kugelbahn',
  emoji: '🌀',
  theme: 'spielzimmer',
  start: [0, 12, 2],
  killY: -14,
  parts: [
    // Start oben, dann die Rutsche hinunter
    { type: 'weg', from: [0, 12, 6], to: [0, 12, -4], width: 4, walls: 0.8, caps: 'start' },
    { type: 'rinne', from: [0, 12, -4], to: [0, 8, -18], r: 1.6, bogen: 75, farbe: 0x42A5F5 },
    // Serpentine: rechts herum zurück, dann links herum wieder nach vorne
    { type: 'rinne', at: [0, 8, -18], yaw: 0, turn: 180, radius: 5, rise: -2.5, r: 1.6, bogen: 75, farbe: 0x66BB6A },
    { type: 'rinne', at: [10, 5.5, -18], yaw: 180, turn: -180, radius: 5, rise: -2.5, r: 1.6, bogen: 75, farbe: 0xEF5350 },
    // Anlauf: schräg nach innen über die Bande in den Trichter springen
    { type: 'weg', from: [20, 3, -18], to: [20, 3, -22], width: 3.2, walls: 0.6 },
    { type: 'checkpoint', at: [20, 3, -20], size: [3.2, 3, 2] },
    { type: 'weg', from: [20, 3, -22], to: [23, 3, -27.2], width: 3.2, walls: 0.6 },
    { type: 'trichter', at: T, R: 6, h: 3.5, loch: 0.9, rim: 1.2, farbe: 0xFFB300 },
    // Unter dem Loch fängt eine Schüssel die Murmel auf, vorne hinaus zur Halfpipe
    { type: 'schuessel', at: [T[0], HPY, T[2]], r: 2, R: 4.5, h: 2, rim: 0.5, art: 'schuessel', offen: [0] },
    { type: 'weg', from: [T[0], HPY, T[2] - 1.9], to: [T[0], HPY, -38], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [T[0], HPY, -36], size: [3, 3, 2] },
    { type: 'rinne', from: [T[0], HPY, -38], to: [T[0], HPY, -62], r: HP, bogen: 80, farbe: 0xAB47BC },
    { type: 'weg', from: [T[0], HPY, -62], to: [T[0], HPY, -70], width: 4, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [T[0], HPY, -67] },

    { type: 'stern', at: [0, 12.9, 0] },
    { type: 'stern', at: [0, 10.9, -11] },
    { type: 'stern', at: [5, 7.65, -23] },
    { type: 'stern', at: wand(50, -1, -44) },
    { type: 'stern', at: wand(50, 1, -52) },
    { type: 'stern', at: [T[0], HPY + 0.9, -65] },
    { type: 'stern', at: wand(72, -1, -58), bonus: true },

    { type: 'klotz', at: [-6, 3, -10], size: [2, 2, 2], look: 'abc', text: 'K', deko: true },
    { type: 'klotz', at: [38, -4, -45], size: [4, 3.2, 2], look: 'lego-rot', deko: true }
  ]
};
