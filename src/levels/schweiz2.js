// Schweiz 2: Uhrwerk. Im Innern einer riesigen Uhr, alles ohne Rand. Vier Zahnräder greifen ineinander (gross, klein,
// gross, klein, jedes andersrum): die dicke Achse in der Mitte lässt nur einen schmalen Ring zum Mitfahren, hinüber geht
// es nur dort, wo Zahn auf Zahn steht. Die Zugfeder führt schmal und ohne Rand eine Runde hinunter. Auf dem Zifferblatt
// ohne Rand kreuzen Minuten- und Stundenzeiger, jeder in seinem eigenen ruckenden Takt: in den Ecken ist man sicher, an den Kanten entlang nur, wenn beide Zeiger eben vorbei sind. Drei Uhrgewichte
// steigen und sinken nacheinander wie eine Welle, mal schnell, mal langsam, oben bleiben sie mal kurz, mal länger: man geht
// von Gewicht zu Gewicht, solange sie oben sind. Zuletzt der schmale Steg ohne Rand: ein Pendel, das mal rasch schwingt,
// mal an der Seite verharrt, gleich dahinter der Glockenhammer, der mal zweimal schnell schlägt und mal lange oben bleibt
// (zwischen den beiden ist gerade Platz für eine Murmel), dann ein zweites Pendel in einem eigenen, unregelmässigen Takt.
const D = 6.85 / Math.SQRT2;                        // Zahnräder: Versatz der Mitten (r 4 + r 3, Zähne greifen leicht ein)
const G = [[0, -8.2], [-D, -8.2 - D], [0, -8.2 - 2 * D], [-D, -8.2 - 3 * D]];
const X = -D;                                      // Ausfahrt vom letzten Zahnrad, Steg zum Zifferblatt
const ZF = -40, XF = X - 4.7;                      // Zifferblatt: Mitte (11 x 11, Weg 0.8 innerhalb der Kante)
const XS = XF - 4.7;                               // ab der hinteren linken Ecke des Zifferblatts
const GEW = [-50.2, -52.6, -55];                   // Uhrgewichte (z)
const Y = -3;                                      // nach der Zugfeder: Höhe von Zifferblatt, Gewichten und Glocke
// Kette eines Uhrgewichts (nur Grafik, links und rechts neben dem Gewicht)
const kette = z => [-1.3, 1.3].map(dx => ({ type: 'klotz', at: [XS + dx, Y + 1, z], size: [0.12, 16, 0.12], look: 'stahl', deko: true }));

export default {
  id: 'sch2', name: 'Uhrwerk', emoji: '🕰️', theme: 'schweiz', variante: 'uhrwerk',
  start: [0, 0, 2], killY: -11,
  parts: [
    // Start auf der Messingplatte, daneben der Aufziehschlüssel
    { type: 'weg', from: [0, 0, 6], to: [0, 0, -4.3], width: 4, walls: 0.8, caps: 'start' },
    { type: 'deko', form: 'schluessel', at: [-6.5, -1, 1], yaw: 20, scale: 1.2 },

    // Zahnradkette: gross (r 4) und klein (r 3, schneller), im Wechsel andersrum; die Achse lässt nur einen Ring frei
    { type: 'zahnrad', at: [G[0][0], 0, G[0][1]], r: 4, speed: -22, nabe: 1.6 },
    { type: 'zahnrad', at: [G[1][0], 0, G[1][1]], r: 3, speed: 29.33, nabe: 1.2, farbe: 0xB87333 },
    { type: 'zahnrad', at: [G[2][0], 0, G[2][1]], r: 4, speed: -22, nabe: 1.6 },
    { type: 'zahnrad', at: [G[3][0], 0, G[3][1]], r: 3, speed: 29.33, nabe: 1.2, farbe: 0xB87333 },
    // rechts am ersten Rad eine kleine Schraube: wer die Runde andersherum fährt, findet dort den Bonusstern
    { type: 'klotz', at: [5, -0.5, G[0][1]], size: [2, 1, 2], look: 'messing-dunkel' },
    { type: 'deko', form: 'schraube', at: [5.3, 0, G[0][1] + 0.6], scale: 0.6 },
    { type: 'deko', form: 'zahnrad', at: [6.5, -1.6, -17], dreh: 40, farbe: 0x9E9E9E },
    { type: 'deko', form: 'zahnrad', at: [-11, -1.6, -12], scale: 1.2, dreh: -33, farbe: 0x9E9E9E },
    { type: 'weg', from: [X, 0, G[3][1] - 2.9], to: [X, 0, -31.5], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [X, 0, -29.5], size: [3, 3, 2] },

    // Zugfeder: schmal und ohne Rand eine Runde links hinunter
    { type: 'kurve', at: [X, 0, -31.5], yaw: 0, turn: -360, radius: 4, width: 1.6, rise: Y },
    { type: 'deko', form: 'zahnrad', at: [X - 4, Y - 1.6, -31.5], scale: 0.9, dreh: 25, farbe: 0x9E9E9E },

    // Zifferblatt ohne Rand: von der vorderen rechten Ecke der rechten Kante entlang, dann der hinteren Kante entlang
    { type: 'weg', from: [X, Y, -31.5], to: [X, Y, ZF + 5.5], width: 2.6, walls: 0.8 },
    { type: 'checkpoint', at: [X, Y, -33], size: [2.6, 3, 1.4] },
    { type: 'klotz', at: [XF, Y - 0.5, ZF], size: [11, 1, 11], look: 'zifferblatt' },
    { type: 'deko', form: 'zifferblatt', at: [XF, Y, ZF], scale: 0.9 },
    // Minutenzeiger ruckt (schnell, Halt, schnell, Halt, dann eine Weile gemächlich), der Stundenzeiger zieht mal an
    // und zuckt kurz zurück
    { type: 'balken', at: [XF, Y, ZF], length: 11, speed: -20, yaw: 30, form: 'zeiger', farbe: 'stahl', takt: [[0.6, 3], [1.4, 0], [0.6, 3], [1.4, 0], [2, 0.8]] },
    { type: 'balken', at: [XF, Y, ZF], length: 8.6, speed: -6, yaw: 3, form: 'zeiger', farbe: 'messing', takt: [[3, 1], [1, 0], [1.5, 3], [1.5, -1]] },
    { type: 'weg', from: [XS, Y, ZF - 5.5], to: [XS, Y, -46.5], width: 1.6 },
    { type: 'weg', from: [XS, Y, -46.5], to: [XS, Y, -49.1], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [XS, Y, -47.8], size: [3, 3, 1.6] },

    // Drei Uhrgewichte steigen und sinken nacheinander; oben liegen sie bündig mit dem Steg
    ...GEW.map((z, k) => ({ type: 'plattform', from: [XS, Y - 5, z], to: [XS, Y, z], size: [2.2, 2.2], rim: 0, time: [1.5, 1.1, 1.9], pause: [3, 2.7, 3.6, 2.8], offset: -1.5 * k })),
    ...GEW.flatMap(kette),
    { type: 'weg', from: [XS, Y, -56.1], to: [XS, Y, -60], width: 3, walls: 0.8 },
    { type: 'checkpoint', at: [XS, Y, -58], size: [3, 3, 2] },

    // Pendel, gleich dahinter der Glockenhammer, dann ein zweites Pendel; jedes in seinem eigenen Takt; Steg ohne Rand
    { type: 'weg', from: [XS, Y, -60], to: [XS, Y, -72], width: 1.6 },
    { type: 'pendel', at: [XS, Y, -61.5], time: [3.9, 2.8, 4.6, 3.2], pause: [0, 0.8, 0.2, 1.4], r: 0.7 },
    { type: 'hammer', at: [XS, Y, -65], side: 1, length: 4, size: [3.2, 1.4, 1.6], up: [2, 0.7, 0.6, 2.6], down: [0.5, 0.35, 0.6], pause: [0.3, 0, 1.8, 0.6], offset: 2.46, farbe: 'gelb' },
    { type: 'klotz', at: [XS - 3.5, Y - 6, -65], size: [4, 12, 4], look: 'holz-dunkel' },
    { type: 'deko', form: 'glocke', at: [XS - 3.5, Y, -65], fest: true },
    { type: 'pendel', at: [XS, Y, -69.5], time: [4.4, 3.4, 5.2], pause: [0.4, 0, 1.2, 0.2], offset: 1, r: 0.7 },
    { type: 'weg', from: [XS, Y, -72], to: [XS, Y, -80], width: 5, walls: 0.8, caps: 'end' },
    { type: 'ziel', at: [XS, Y, -77] },

    // Sterne: aussen auf dem dritten Zahnrad, an der rechten Kante des Zifferblatts, auf dem letzten Uhrgewicht,
    // unter dem Glockenhammer, am Stegrand vor dem zweiten Pendel; Bonus auf der Schraube rechts vom ersten Rad
    { type: 'stern', at: [-3.5, 0.9, G[2][1]] },
    { type: 'stern', at: [X + 0.3, Y + 0.9, ZF] },
    { type: 'stern', at: [XS, Y + 0.9, GEW[2]] },
    { type: 'stern', at: [XS, Y + 0.9, -65] },
    { type: 'stern', at: [XS + 0.5, Y + 0.9, -66.4] },
    { type: 'stern', at: [5.2, 0.9, G[0][1]], bonus: true }
  ]
};
