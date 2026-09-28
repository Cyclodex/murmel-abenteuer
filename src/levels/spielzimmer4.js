// Spielzimmer 4: Grosse Holzbahn. Neu: Looping; dazu Kurve, Turbo und bewegte Plattform.
export default {
  id: 'sz4',
  name: 'Grosse Holzbahn',
  emoji: '🎢',
  theme: 'spielzimmer',
  start: [0, 0, 2],
  killY: -8,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'kurve', at: [0, 0, -6], yaw: 0, turn: -90, radius: 5, width: 5, walls: 0.8 },
    // Gerade nach links (-x), wird vor dem Looping schmaler (Trichter)
    { type: 'weg', from: [-5, 0, -11], to: [-13, 0, -11], width: 5 },
    { type: 'wand', from: [-5, 0, -8.3], to: [-10, 0, -8.3] },
    { type: 'wand', from: [-5, 0, -13.7], to: [-10, 0, -13.7] },
    { type: 'wand', from: [-10, 0, -8.3], to: [-13, 0, -9.3] },
    { type: 'wand', from: [-10, 0, -13.7], to: [-13, 0, -12.7] },
    { type: 'weg', from: [-13, 0, -11], to: [-16, 0, -11], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [-7, 0, -11], yaw: 90, size: [5, 3, 3] },
    { type: 'turbo', at: [-14.5, 0, -11], yaw: 90, size: [2.6, 2], speed: 13 },
    // Looping, Ausfahrt 5 m weiter rechts
    { type: 'looping', at: [-16, 0, -11], yaw: 90, radius: 3, width: 3, shift: 5 },
    { type: 'weg', from: [-16, 0, -16], to: [-24, 0, -16], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [-19, 0, -16], yaw: 90, size: [4, 3, 3] },
    // Bewegte Plattform über die Lücke
    { type: 'plattform', from: [-26, 0, -16], to: [-30, 0, -16], yaw: 90, size: [4, 4], time: 2.5, pause: 2.5 },
    // Ziel-Gerade mit Nische
    { type: 'weg', from: [-32, 0, -16], to: [-44, 0, -16], width: 6 },
    { type: 'wand', from: [-32, 0, -19.2], to: [-44, 0, -19.2] },
    { type: 'wand', from: [-32, 0, -12.8], to: [-35, 0, -12.8] },
    { type: 'wand', from: [-37.5, 0, -12.8], to: [-44, 0, -12.8] },
    { type: 'wand', from: [-44, 0, -19.6], to: [-44, 0, -12.4] },
    { type: 'nische', at: [-36.25, 0, -13], yaw: 180 },
    { type: 'ziel', at: [-40, 0, -16] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [-8.5, 0.9, -11] },
    { type: 'stern', at: [-16, 5.3, -13.5] },
    { type: 'stern', at: [-28, 0.9, -16] },
    { type: 'stern', at: [-34, 0.9, -16] },
    { type: 'stern', at: [-36.25, 0.9, -10.5], bonus: true },

    { type: 'klotz', at: [6, -8, -12], size: [2, 2, 2], look: 'abc', text: 'F', deko: true },
    { type: 'klotz', at: [-22, -7.4, -4], size: [4, 3.2, 2], look: 'lego-rot', deko: true }
  ]
};
