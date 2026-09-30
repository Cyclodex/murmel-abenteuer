// Unterwasser 2: Blasenlift. Neu: Blasen tragen die Murmel nach oben, ein Strudel (Spiraltrichter) zieht sie wieder hinunter.
const T = [10.5, 4.65, -38.2]; // Strudel: Mitte des Lochs (Bande oben bei y = 9.1, Anlauf bei 10)
const SY = 0;                  // Sandmulde darunter: Höhe des Bodens
export default {
  id: 'u2', name: 'Blasenlift', emoji: '🫧', theme: 'unterwasser',
  physik: { schwerkraft: 0.6, wasser: 0.35 },
  start: [0, 0, 2], killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -12], width: 5, walls: 0.8, caps: 'both' },
    { type: 'wind', at: [0, 0, -10], size: [4, 6, 4], up: true, strength: 12 },
    // Riff 1, links eine Nische
    { type: 'weg', from: [0, 5, -12], to: [0, 5, -28], width: 5 },
    { type: 'wand', from: [2.7, 5, -12], to: [2.7, 5, -28] },
    { type: 'wand', from: [-2.7, 5, -12], to: [-2.7, 5, -16.75] },
    { type: 'wand', from: [-2.7, 5, -19.25], to: [-2.7, 5, -28] },
    { type: 'wand', from: [-2.9, 5, -28.2], to: [2.9, 5, -28.2] },
    { type: 'nische', at: [-2.5, 5, -18], yaw: 90 },
    { type: 'checkpoint', at: [0, 5, -15], size: [5, 3, 3] },
    { type: 'wind', at: [0, 5, -26], size: [4, 6, 4], up: true, strength: 12 },
    // Riff 2, dann schräg über den Rand in den Strudel; darunter fängt eine Sandmulde die Murmel auf
    { type: 'weg', from: [0, 10, -28], to: [0, 10, -33], width: 5, walls: 0.8 },
    { type: 'checkpoint', at: [0, 10, -31], size: [5, 3, 3] },
    { type: 'weg', from: [0, 10, -33], to: [3, 10, T[2]], width: 3.2, walls: 0.6 },
    // das Wasser bremst schon: ohne die Bremse des Trichters (surface), sonst ist die Murmel nach 5 s unten statt nach 9 s
    { type: 'trichter', at: T, R: 6, h: 3.5, loch: 0.9, rim: 1.2, farbe: 0x26C6DA, surface: 'kunststoff' },
    { type: 'schuessel', at: [T[0], SY, T[2]], r: 2, R: 4.5, h: 2, rim: 0.5, art: 'sandkuchen', offen: [0] },
    { type: 'weg', from: [T[0], SY, T[2] - 1.9], to: [T[0], SY, T[2] - 14], width: 3, walls: 0.8, caps: 'end' },
    { type: 'checkpoint', at: [T[0], SY, T[2] - 7], size: [3, 3, 2] },
    { type: 'ziel', at: [T[0], SY, T[2] - 11] },

    { type: 'stern', at: [0, 0.9, -3] },
    { type: 'stern', at: [0, 6.5, -10] },
    { type: 'stern', at: [0, 11.5, -26] },
    // unter dem Strudel: nur wer durch das Loch fällt, holt ihn
    { type: 'stern', at: [T[0], SY + 2.4, T[2]] },
    { type: 'stern', at: [T[0], SY + 0.9, T[2] - 9] },
    { type: 'stern', at: [-5, 5.9, -18], bonus: true }
  ]
};
