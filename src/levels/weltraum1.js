// Weltraum 1: Mondhüpfer. Wenig Schwerkraft: mit dem Trampolin weit springen, in der Luft lenken, in der Halfpipe hoch hinaus.
const HP = 4, HPY = 3; // Halfpipe: Radius, Höhe unten
// Stern an der Halfpipe-Wand: Winkel phi (Grad) von unten, Seite k (-1 links, 1 rechts)
const wand = (phi, k, z) => {
  const a = phi * Math.PI / 180;
  return [k * (HP - 0.5) * Math.sin(a), HPY + HP * (1 - Math.cos(a)) + 0.5 * Math.cos(a), z];
};
export default {
  id: 'w1', name: 'Mondhüpfer', emoji: '🌙', theme: 'weltraum',
  physik: { schwerkraft: 0.45, abprall: 0.5 },
  start: [0, 0, 2], killY: -10,
  parts: [
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -8], width: 5, walls: 0.8, caps: 'start' },
    { type: 'trampolin', at: [0, 0, -6], size: [4, 2], jump: 6, tempo: 5 },
    // Plattform B
    { type: 'weg', from: [0, 0, -16], to: [0, 0, -28], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -21], size: [6, 3, 3] },
    { type: 'trampolin', at: [0, 0, -26], size: [5, 2], jump: 6, tempo: 5 },
    // Plattform C (höher), dann die Halfpipe: bei wenig Schwerkraft schwingt die Murmel weit hinauf.
    { type: 'weg', from: [0, HPY, -33], to: [0, HPY, -40], width: 6, walls: 0.8 },
    { type: 'checkpoint', at: [0, HPY, -38], size: [6, 3, 2] },
    // Der Rand ist senkrecht (bogen 90) und hat oben eine Bande: bei wenig Schwerkraft trägt die Steuerung
    // die Murmel sonst über den Rand hinaus.
    { type: 'rinne', from: [0, HPY, -40], to: [0, HPY, -60], r: HP, bogen: 90, farbe: 0x5C6BC0 },
    ...[-1, 1].flatMap(k => [
      { type: 'wand', from: [k * (HP + 0.2), HPY + HP, -39.8], to: [k * (HP + 0.2), HPY + HP, -60.2], height: 4 },
      // Enden: seitlich zu, nur die Mitte ist offen (sonst rollt die Murmel hoch oben an der Wand hinaus)
      { type: 'wand', from: [k * 2.8, HPY, -40], to: [k * (HP + 0.4), HPY, -40], height: HP + 4 },
      { type: 'wand', from: [k * 2.8, HPY, -60], to: [k * (HP + 0.4), HPY, -60], height: HP + 4 }
    ]),
    { type: 'weg', from: [0, HPY, -60], to: [0, HPY, -68], width: 6, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [0, HPY, -64] },
    // Bonus-Asteroid rechts, mit Trampolin zurück Richtung Plattform B
    { type: 'klotz', at: [5, 1.5, -12], size: [4, 1, 4] },
    { type: 'trampolin', at: [5, 2, -12], size: [4, 4], jump: 5, tempo: 4, yaw: 25 },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 4.2, -12] },
    { type: 'stern', at: [0, 4.5, -31] },
    { type: 'stern', at: wand(55, -1, -46) },
    { type: 'stern', at: wand(80, 1, -54) },
    { type: 'stern', at: [0, 0.9, -23.5] },
    { type: 'stern', at: [5, 3.2, -12], bonus: true, r: 2.2 }
  ]
};
