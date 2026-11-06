// Schweiz 2: Uhrwerk. Im Innern einer riesigen Uhr: auf drehenden Zahnrädern mitfahren (erst eines zum Üben, dann zwei,
// die ineinandergreifen), über das Zifferblatt an den Zeigern vorbei, mit dem Uhrgewicht als Lift nach oben,
// unter dem Pendel durch und am Glockenhammer vorbei zum Ziel.
const X = -9; // ab dem zweiten Zahnrad-Paar läuft alles auf dieser Linie
// Takt: yaw des Minutenzeigers und offset von Lift, Pendel und Hammer sind so gewählt, dass eine zügige Fahrt (Autopilot,
// Stärke normal) nirgends lange warten muss. Wer die Strecke davor ändert, stimmt sie neu ab (sonst nur längere Wartezeit).
// Zifferblatt 14 x 14 mit Rand, vorne und hinten offen (wie der Teller in Küche 2)
const blatt = (x, z, open = 2.2) => [
  { type: 'klotz', at: [x, -0.5, z], size: [14, 1, 14], look: 'zifferblatt' },
  { type: 'deko', form: 'zifferblatt', at: [x, 0, z], scale: 1.15 },
  { type: 'wand', from: [x - 7.2, 0, z + 7], to: [x - 7.2, 0, z - 7] },
  { type: 'wand', from: [x + 7.2, 0, z + 7], to: [x + 7.2, 0, z - 7] },
  { type: 'wand', from: [x - 7.4, 0, z + 7.2], to: [x - open, 0, z + 7.2] },
  { type: 'wand', from: [x + open, 0, z + 7.2], to: [x + 7.4, 0, z + 7.2] },
  { type: 'wand', from: [x - 7.4, 0, z - 7.2], to: [x - open, 0, z - 7.2] },
  { type: 'wand', from: [x + open, 0, z - 7.2], to: [x + 7.4, 0, z - 7.2] }
];
export default {
  id: 'sch2', name: 'Uhrwerk', emoji: '🕰️', theme: 'schweiz', variante: 'uhrwerk',
  start: [0, 0, 2], killY: -8,
  parts: [
    // Start auf der Messingplatte, daneben der Aufziehschlüssel
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -6], width: 5, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'schluessel', at: [-6.5, -1, 1], yaw: 20, scale: 1.2 },

    // Erstes Zahnrad zum Üben: vorne drauf, stillhalten, hinten wieder hinunter (die Achse versperrt den geraden Weg).
    // Wer schon rechts aussteigt, findet hinter der Schraube den Bonusstern.
    { type: 'zahnrad', at: [0, 0, -10.05], r: 4, speed: 30 },
    { type: 'nische', at: [4.1, 0, -10.05], yaw: -90, width: 3, depth: 3.2 },
    { type: 'klotz', at: [6.4, -0.5, -7.2], size: [2.6, 1, 2.3] },
    { type: 'deko', form: 'schraube', at: [6.4, 0, -7.3], scale: 1.1 },
    { type: 'deko', form: 'zahnrad', at: [-6.95, -1.6, -10.05], dreh: -40, farbe: 0x9E9E9E },
    { type: 'weg', from: [0, 0, -14.1], to: [0, 0, -19.05], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [0, 0, -16.3], size: [4, 3, 3] },

    // Zwei Zahnräder greifen ineinander: das grosse dreht im Uhrzeigersinn und trägt die Murmel nach links,
    // dort übergibt es sie dem kleinen, das sie nach hinten trägt
    { type: 'zahnrad', at: [0, 0, -24.1], r: 5, speed: -24 },
    { type: 'zahnrad', at: [X, 0, -24.1], r: 4, speed: 30, farbe: 0xB87333 },
    { type: 'deko', form: 'zahnrad', at: [7.9, -1.6, -24.1], dreh: 40, farbe: 0x9E9E9E },
    { type: 'deko', form: 'zahnrad', at: [X - 6.3, -1.6, -19.85], scale: 1.2, dreh: -33, farbe: 0x9E9E9E },
    { type: 'weg', from: [X, 0, -28.15], to: [X, 0, -33], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [X, 0, -30.5], size: [4, 3, 3] },

    // Zifferblatt: der lange Minutenzeiger fegt im Uhrzeigersinn herum, der kurze Stundenzeiger schleicht hinterher.
    // Links herum mit dem Zeiger mitfahren
    ...blatt(X, -40),
    { type: 'balken', at: [X, 0, -40], length: 11, speed: -30, yaw: -60, form: 'zeiger', farbe: 'stahl' },
    { type: 'balken', at: [X, 0, -40], length: 5, speed: -6, yaw: 60, form: 'zeiger', farbe: 'messing' },
    { type: 'weg', from: [X, 0, -47], to: [X, 0, -52], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [X, 0, -49.5], size: [4, 3, 3] },

    // Das Uhrgewicht als Lift: es fährt an zwei Stangen hinauf und hinunter
    { type: 'plattform', from: [X, 0, -54], to: [X, 3, -54], size: [4, 4], time: 2, pause: 2, offset: 4.5 },
    { type: 'klotz', at: [X - 2.6, 1, -54], size: [0.25, 18, 0.25], look: 'stahl', deko: true },
    { type: 'klotz', at: [X + 2.6, 1, -54], size: [0.25, 18, 0.25], look: 'stahl', deko: true },
    // Obere Ebene (dick, damit man unten nicht drunter durchrollt)
    { type: 'weg', from: [X, 3, -56], to: [X, 3, -60], width: 4, walls: 0.8, thick: 3 },
    { type: 'checkpoint', at: [X, 3, -58], size: [4, 3, 2] },

    // Das Pendel schwingt quer über den Steg ohne Rand
    { type: 'weg', from: [X, 3, -60], to: [X, 3, -66], width: 3 },
    { type: 'pendel', at: [X, 3, -63], offset: 1.5 },
    { type: 'weg', from: [X, 3, -66], to: [X, 3, -70], width: 4, walls: 0.8 },
    { type: 'checkpoint', at: [X, 3, -68], size: [4, 3, 2] },

    // Der Glockenhammer schlägt neben der Glocke (auf ihrem Holzturm) auf den Steg
    { type: 'weg', from: [X, 3, -70], to: [X, 3, -77], width: 3 },
    { type: 'hammer', at: [X, 3, -73.5], side: 1, length: 4, size: [3.2, 1.4, 1.6], offset: 1.5, farbe: 'gelb' },
    { type: 'klotz', at: [X - 3.5, -3, -73.5], size: [4, 12, 4], look: 'holz-dunkel' },
    { type: 'deko', form: 'glocke', at: [X - 3.5, 3, -73.5], fest: true },
    { type: 'weg', from: [X, 3, -77], to: [X, 3, -84], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [X, 3, -81.5] },

    { type: 'stern', at: [0, 0.9, -2] },
    { type: 'stern', at: [0, 0.9, -21.1] },
    { type: 'stern', at: [X - 4.5, 0.9, -40] },
    { type: 'stern', at: [X, 3.9, -54] },
    { type: 'stern', at: [X, 3.9, -63] },
    { type: 'stern', at: [6.2, 0.9, -10.05], bonus: true }
  ]
};
