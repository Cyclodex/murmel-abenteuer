// Autopilot-Routen der Welt Dach (id -> Wegpunkte, siehe tests/autopilot.js).
export default {
  // Links an der Gaube vorbei, über den Laufsteg nach rechts zum Stern und an den oberen Rand unter dem Kamin (Bonusstern
  // dahinter, grosser Sammelradius: bergauf käme 🐢 nicht), zurück und durch die linke Lücke im Schneefang in die Dachrinne
  // (warten, bis die Murmel darin liegt), der Rinne folgen, in den Kessel und durchs Fallrohr in die Regentonne
  d1: [
    { x: 0, z: -1.5, speed: 3 }, { x: -4.5, z: -4.5, speed: 3 }, { x: -5.5, z: -7, speed: 2.5 }, { x: -5, z: -10.5, speed: 2.5 },
    { x: 6, z: -10.5, speed: 3 }, { x: 7.5, z: -9.4, speed: 2, r: 0.5 }, { x: -3, z: -11, speed: 3 }, { x: -3, z: -17.5, speed: 2, r: 0.8 },
    { x: -3, z: -20.2, free: true, r: 1.2 }, { x: -3, z: -20.2, speed: 1, r: 5, wait: 'amBoden' },
    { follow: true, bisY: -9.4, speed: 4 }, { x: 14.3, z: -20.2, speed: 2, r: 0.4 }, { x: 24.7, z: -20.2, speed: 2, wait: 'abfluss' }
  ]
};
