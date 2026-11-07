// Riesige Werkzeuge für die Welt Werkstatt (wie src/props.js: stehen auf y = 0, Mitte bei x = z = 0, vorne = -z).
// props.js hängt sie an PROPS und PROP_SIZE an: werkstattProps(helfer) -> { form: (T, opts) => THREE.Group }

export const WERKSTATT_SIZE = {
  hammer: [3.4, 1.6, 10], schraube: [2.4, 5, 2.4], mutter: [3.2, 1.2, 3.2], farbdose: [4, 4.8, 4], bleistift: [0.9, 0.9, 11],
  saege: [3, 0.5, 12], schraubenzieher: [1.4, 1.4, 10], werkzeugkasten: [7, 4.8, 3.6], rollmeter: [3.4, 3.2, 1.6],
  holzstapel: [3, 1.8, 8], saegeblatt: [6.4, 0.3, 6.4]
};

export const werkstattProps = ({ mat, mesh, group, cyl }) => {
  const stahl = T => mat(T, 0xB8C0C8, { shininess: 130, specular: 0xffffff });
  const holz = (T, c = 0xC89858) => mat(T, c, { shininess: 10 });
  const liegend = (m, x = Math.PI / 2) => { m.rotation.x = x; return m; }; // Zylinder der Länge nach hinlegen (entlang z)
  return {
    // Hammer liegt auf der Seite: Stiel entlang z, Kopf vorne
    hammer(T, o) {
      const kopf = mesh(T, new T.BoxGeometry(3.4, 1.4, 1.5), stahl(T), 0, 0.8, -4.2);
      return group(T, liegend(mesh(T, cyl(T, 0.32, 0.4, 8.6, 12), holz(T, o.farbe ?? 0xC89858), 0, 0.8, 0.6)), kopf,
        mesh(T, new T.BoxGeometry(1.1, 1.5, 1.6), mat(T, 0x8A929A, { shininess: 90 }), 0, 0.8, -4.2));
    },
    // Schraube steckt mit der Spitze im Boden, Kopf mit Schlitz oben
    schraube(T, o) {
      const m = mat(T, o.farbe ?? 0xC9CFD6, { shininess: 140, specular: 0xffffff });
      const g = group(T, mesh(T, cyl(T, 0.42, 0.42, 4.2, 14), m, 0, 2.1, 0), mesh(T, cyl(T, 1.2, 0.5, 0.7, 20), m, 0, 4.45, 0),
        mesh(T, new T.BoxGeometry(2, 0.12, 0.3), mat(T, 0x555B62), 0, 4.82, 0));
      for (let i = 0; i < 6; i++) { const r = mesh(T, new T.TorusGeometry(0.47, 0.09, 6, 16), m, 0, 0.5 + i * 0.6, 0); r.rotation.set(Math.PI / 2 + 0.18, 0, 0); g.add(r); }
      return g;
    },
    mutter(T, o) {
      return group(T, mesh(T, cyl(T, 1.6, 1.6, 1.2, 6), mat(T, o.farbe ?? 0xAEB6BE, { shininess: 130, specular: 0xffffff, flatShading: true }), 0, 0.6, 0),
        mesh(T, cyl(T, 0.75, 0.75, 1.22, 18), mat(T, 0x3A3F45), 0, 0.6, 0));
    },
    // Farbdose mit Deckel, Farbe läuft über den Rand
    farbdose(T, o) {
      const farbe = mat(T, o.farbe ?? 0xE53935, { shininess: 90 }), blech = stahl(T);
      const henkel = mesh(T, new T.TorusGeometry(2.05, 0.07, 6, 24, Math.PI), mat(T, 0x555B62), 0, 3.2, 0); henkel.rotation.x = 0.5;
      const g = group(T, mesh(T, cyl(T, 2, 2, 4.4, 28), blech, 0, 2.2, 0), mesh(T, cyl(T, 2.03, 2.03, 2.2, 28), mat(T, 0xFAFAFA), 0, 2, 0),
        mesh(T, cyl(T, 2.03, 2.03, 0.5, 28), farbe, 0, 2, 0), mesh(T, cyl(T, 2.08, 2.08, 0.25, 28), blech, 0, 4.4, 0), mesh(T, cyl(T, 1.7, 1.7, 0.1, 28), farbe, 0, 4.56, 0), henkel);
      for (const [a, l] of [[0.3, 1.5], [1.1, 0.9], [4.2, 1.2]]) g.add(mesh(T, new T.SphereGeometry(0.28, 10, 8).scale(1, l / 0.56, 0.5), farbe, Math.cos(a) * 2.03, 4.3 - l / 2, Math.sin(a) * 2.03));
      return g;
    },
    // Bleistift liegt, Spitze vorne
    bleistift(T, o) {
      const spitze = liegend(mesh(T, new T.ConeGeometry(0.45, 1.4, 6), mat(T, 0xE8C99A), 0, 0.45, -4.8), -Math.PI / 2);
      const mine = liegend(mesh(T, new T.ConeGeometry(0.16, 0.5, 6), mat(T, 0x333333), 0, 0.45, -5.25), -Math.PI / 2);
      return group(T, liegend(mesh(T, cyl(T, 0.45, 0.45, 8.2, 6), mat(T, o.farbe ?? 0xFDD835, { shininess: 60, flatShading: true }), 0, 0.45, 0)), spitze, mine,
        liegend(mesh(T, cyl(T, 0.47, 0.47, 0.5, 12), stahl(T), 0, 0.45, 4.35)), liegend(mesh(T, cyl(T, 0.42, 0.42, 0.8, 12), mat(T, 0xF48FB1), 0, 0.45, 5)));
    },
    // Fuchsschwanz liegt flach: Blatt mit Zähnen vorne, Griff hinten
    saege(T, o) {
      const kante = y => -0.3 - (y + 5.5) * 1.1 / 8.5; // linke Kante des Blatts (dort sitzen die Zähne)
      const s = new T.Shape(); s.moveTo(-1.4, 3); s.lineTo(1.4, 3); s.lineTo(0.9, -5.5); s.lineTo(-0.3, -5.5);
      for (let i = 0; i < 17; i++) { const y = -5.5 + i * 0.5; s.lineTo(kante(y + 0.25) - 0.3, y + 0.25); s.lineTo(kante(y + 0.5), y + 0.5); }
      s.closePath();
      const blatt = new T.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false }); blatt.rotateX(Math.PI / 2); blatt.translate(0, 0.3, 0);
      const griff = mat(T, o.farbe ?? 0xB5651D, { shininess: 30 });
      return group(T, mesh(T, blatt, stahl(T)), mesh(T, new T.BoxGeometry(3, 0.5, 1), griff, 0, 0.25, 3.3), mesh(T, new T.BoxGeometry(1, 0.5, 2.4), griff, -1, 0.25, 4.6),
        mesh(T, new T.BoxGeometry(1, 0.5, 2.4), griff, 1, 0.25, 4.6), mesh(T, new T.BoxGeometry(3, 0.5, 0.8), griff, 0, 0.25, 5.6));
    },
    schraubenzieher(T, o) {
      return group(T, liegend(mesh(T, cyl(T, 0.7, 0.55, 4, 10), mat(T, o.farbe ?? 0xE53935, { shininess: 80, flatShading: true }), 0, 0.7, 3)),
        liegend(mesh(T, cyl(T, 0.18, 0.18, 5.6, 10), stahl(T), 0, 0.7, -1.8)), mesh(T, new T.BoxGeometry(0.5, 0.1, 0.7), stahl(T), 0, 0.7, -4.8));
    },
    werkzeugkasten(T, o) {
      const m = mat(T, o.farbe ?? 0xD32F2F, { shininess: 90 }), dunkel = mat(T, 0x37474F, { shininess: 60 });
      const g = group(T, mesh(T, new T.BoxGeometry(7, 2.6, 3.6), m, 0, 1.3, 0), mesh(T, new T.BoxGeometry(7.1, 1, 3.7), m, 0, 3.15, 0), mesh(T, new T.BoxGeometry(7.12, 0.12, 3.72), dunkel, 0, 2.62, 0),
        mesh(T, new T.BoxGeometry(3.2, 0.3, 0.5), dunkel, 0, 4.6, 0));
      for (const x of [-1.6, 1.6]) g.add(mesh(T, new T.BoxGeometry(0.3, 1, 0.5), dunkel, x, 4.15, 0), mesh(T, new T.BoxGeometry(0.7, 0.8, 0.12), mat(T, 0xCFD8DC, { shininess: 130 }), x * 1.3, 2.7, -1.87));
      return g;
    },
    // Rollmeter steht: Band kommt unten vorne heraus
    rollmeter(T, o) {
      const m = mat(T, o.farbe ?? 0xFDD835, { shininess: 80 }), schwarz = mat(T, 0x2B2B2B);
      const rund = mesh(T, cyl(T, 1.6, 1.6, 1.5, 28), m, 0.1, 1.6, 0); rund.rotation.x = Math.PI / 2;
      const knopf = mesh(T, cyl(T, 0.8, 0.8, 1.6, 20), schwarz, 0.1, 1.6, 0); knopf.rotation.x = Math.PI / 2;
      return group(T, rund, knopf, mesh(T, new T.BoxGeometry(1.7, 1.6, 1.5), m, -0.85, 0.8, 0), mesh(T, new T.BoxGeometry(0.2, 0.7, 1.3), schwarz, -1.75, 0.45, 0),
        mesh(T, new T.BoxGeometry(1.2, 0.06, 1), mat(T, 0xFFEE58), -2.3, 0.2, 0), mesh(T, new T.BoxGeometry(0.1, 0.4, 1.1), stahl(T), -2.9, 0.22, 0));
    },
    // drei Bretter aufeinander
    holzstapel(T, o) {
      const g = group(T);
      [[0, 0xD9B07A, 0], [0.25, 0xC89858, 0.06], [-0.15, 0xE2C08E, -0.05]].forEach(([x, c, rot], i) => { const b = mesh(T, new T.BoxGeometry(2.6, 0.55, 8 - i * 0.6), holz(T, i === 1 && o.farbe ? o.farbe : c), x, 0.3 + i * 0.6, 0); b.rotation.y = rot; g.add(b); });
      return g;
    },
    // Kreissägeblatt liegt flach
    saegeblatt(T, o) {
      const s = new T.Shape(), n = 28;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, b = (i + 0.75) / n * Math.PI * 2; i ? s.lineTo(Math.cos(a) * 3.2, Math.sin(a) * 3.2) : s.moveTo(3.2, 0); s.lineTo(Math.cos(b) * 2.7, Math.sin(b) * 2.7); }
      s.closePath();
      const geo = new T.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
      return group(T, mesh(T, geo, mat(T, o.farbe ?? 0xC3CAD1, { shininess: 150, specular: 0xffffff })), mesh(T, cyl(T, 0.9, 0.9, 0.2, 20), mat(T, 0xE53935), 0, 0.12, 0), mesh(T, cyl(T, 0.3, 0.3, 0.26, 12), mat(T, 0x333333), 0, 0.13, 0));
    }
  };
};
