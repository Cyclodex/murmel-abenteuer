// Gegenstände der Welt Schweiz (Käserei, Uhrwerk, Schoggifabrik), gleiche Regeln wie in props.js:
// stehen auf y = 0, Mitte bei x = z = 0, Vorderseite nach -z. Werden in props.js in PROPS und PROP_SIZE eingetragen.
// kaeseharfe und zeiger passen auch auf einen drehenden Balken (balken mit form): opts.laenge = Länge des Balkens,
// opts.hoehe = Höhe des Balkens (der Gegenstand sitzt dann darauf).
import { mat, mesh, group, cyl } from './props.js';

const KAESE = 0xF2C230, RINDE = 0xC98A2B, HOLZ = 0x8D6E4B, MESSING = 0xC9A227, STAHL = 0xC9CED6, KUPFER = 0xC9753A, SCHOGGI = 0x6B3A1E;
const TAU = Math.PI * 2;

export const SIZE_SCHWEIZ = {
  laib: [5, 1.6, 5], kaeseregal: [8, 7, 2.4], kessi: [6, 4.5, 6], milchkanne: [2.6, 5, 2.6], kaeseharfe: [5.5, 5, 0.4],
  zeiger: [6, 0.3, 1], zifferblatt: [12, 0.1, 12], zahnrad: [6, 0.8, 6], glocke: [3.4, 3.6, 3.4], schraube: [1.6, 3, 1.6], schluessel: [3, 0.8, 6.5],
  tafel: [5, 0.8, 8], praline: [2.4, 2, 2.4], schoggihase: [3, 6, 2.4]
};

// Käselaib liegend: Rinde aussen, Teig oben, rundes Etikett
const laib = (T, r, h, rinde, x = 0, y = 0, z = 0) => group(T, mesh(T, cyl(T, r, r, h, 28), mat(T, rinde, { shininess: 15 }), x, y + h / 2, z),
  mesh(T, cyl(T, r * 0.93, r * 0.93, 0.04, 28), mat(T, KAESE, { shininess: 25 }), x, y + h + 0.02, z),
  mesh(T, cyl(T, r * 0.35, r * 0.35, 0.04, 20), mat(T, 0xD32F2F), x, y + h + 0.05, z));

export const PROPS_SCHWEIZ = {
  // ---------- Käserei ----------
  laib: (T, o) => laib(T, 2.5, 1.6, o.farbe ?? RINDE),
  kaeseregal(T, o) {
    const holz = mat(T, o.farbe ?? HOLZ, { shininess: 10 }), g = group(T);
    for (const x of [-3.85, 3.85]) for (const z of [-1, 1]) g.add(mesh(T, new T.BoxGeometry(0.3, 7, 0.3), holz, x, 3.5, z));
    [0.4, 2.7, 5].forEach((y, i) => {
      g.add(mesh(T, new T.BoxGeometry(8, 0.25, 2.4), holz, 0, y, 0));
      for (const x of [-2.5, 0, 2.5]) g.add(laib(T, 1.05, 0.9, (i + x) % 2 ? RINDE : 0xB8762A, x, y + 0.125, 0));
    });
    return g;
  },
  kessi(T, o) {
    const cu = mat(T, o.farbe ?? KUPFER, { shininess: 130, specular: 0xffddbb, side: T.DoubleSide }), g = group(T);
    g.add(mesh(T, cyl(T, 3, 2.2, 3.2, 28, 1, true), cu, 0, 2.6, 0), mesh(T, cyl(T, 2.2, 1.6, 0.4, 28), cu, 0, 0.9, 0));
    const rand = mesh(T, new T.TorusGeometry(3, 0.14, 8, 36), cu, 0, 4.2, 0); rand.rotation.x = Math.PI / 2; g.add(rand);
    g.add(mesh(T, cyl(T, 2.9, 2.9, 0.05, 28), mat(T, 0xFFF8E1, { shininess: 60 }), 0, 3.8, 0)); // Milch
    for (let i = 0; i < 3; i++) g.add(mesh(T, cyl(T, 0.18, 0.25, 0.8, 8), mat(T, 0x3E3E3E), Math.cos(i * 2.094) * 1.5, 0.4, Math.sin(i * 2.094) * 1.5));
    return g;
  },
  milchkanne(T, o) {
    const alu = mat(T, o.farbe ?? STAHL, { shininess: 140, specular: 0xffffff }), g = group(T);
    g.add(mesh(T, cyl(T, 1.2, 1.2, 3, 22), alu, 0, 1.5, 0), mesh(T, cyl(T, 0.7, 1.2, 0.8, 22), alu, 0, 3.4, 0), mesh(T, cyl(T, 0.7, 0.7, 0.6, 18), alu, 0, 4.1, 0),
      mesh(T, cyl(T, 0.85, 0.85, 0.25, 18), alu, 0, 4.5, 0), mesh(T, new T.SphereGeometry(0.22, 10, 8), alu, 0, 4.75, 0));
    for (const k of [-1, 1]) { const h = mesh(T, new T.TorusGeometry(0.4, 0.08, 6, 14, Math.PI), alu, k * 1.2, 2.6, 0); h.rotation.z = -k * Math.PI / 2; g.add(h); }
    return g;
  },
  // Käseharfe: Holzrahmen mit Drähten und Griff (steht frei oder sitzt auf dem drehenden Balken im Käsekessi)
  kaeseharfe(T, o) {
    const L = o.laenge ?? 5.5, frei = o.hoehe === undefined, y0 = frei ? 0.3 : o.hoehe + 0.05, y1 = y0 + 2.8;
    const holz = mat(T, o.farbe ?? HOLZ, { shininess: 10 }), draht = mat(T, 0xE0E4EA, { shininess: 150, specular: 0xffffff }), g = group(T);
    if (frei) g.add(mesh(T, new T.BoxGeometry(L, 0.3, 0.3), holz, 0, 0.15, 0));
    for (const k of [-1, 1]) g.add(mesh(T, new T.BoxGeometry(0.22, y1 - y0, 0.22), holz, k * (L / 2 - 0.11), (y0 + y1) / 2, 0));
    g.add(mesh(T, new T.BoxGeometry(L, 0.22, 0.22), holz, 0, y1 + 0.11, 0));
    const n = Math.max(3, Math.round((L - 0.6) / 0.45));
    for (let i = 0; i < n; i++) g.add(mesh(T, cyl(T, 0.03, 0.03, y1 - y0, 5), draht, -L / 2 + 0.3 + (L - 0.6) * (i + 0.5) / n, (y0 + y1) / 2, 0));
    g.add(mesh(T, cyl(T, 0.11, 0.11, 1.4, 8), holz, 0, y1 + 0.9, 0));
    const griff = mesh(T, cyl(T, 0.13, 0.13, 1.4, 8), holz, 0, y1 + 1.6, 0); griff.rotation.z = Math.PI / 2; g.add(griff);
    return g;
  },

  // ---------- Uhrwerk ----------
  // Uhrzeiger, liegt flach: Spitze bei +x, Ring am anderen Ende, Messingknopf in der Mitte
  zeiger(T, o) {
    const L = o.laenge ?? 6, y = o.hoehe === undefined ? 0 : o.hoehe + 0.06, a = L / 2, s = new T.Shape();
    s.moveTo(-a + 0.9, -0.22); s.lineTo(a - 1.3, -0.14); s.lineTo(a - 1, -0.5); s.lineTo(a, 0); s.lineTo(a - 1, 0.5); s.lineTo(a - 1.3, 0.14); s.lineTo(-a + 0.9, 0.22); s.closePath();
    const geo = new T.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
    const schwarz = mat(T, o.farbe ?? 0x1B1B1F, { shininess: 80 });
    const ring = mesh(T, new T.TorusGeometry(0.42, 0.11, 8, 20), schwarz, -a + 0.5, y + 0.07, 0); ring.rotation.x = Math.PI / 2;
    return group(T, mesh(T, geo, schwarz, 0, y, 0), ring, mesh(T, cyl(T, 0.55, 0.55, 0.22, 20), mat(T, MESSING, { shininess: 120 }), 0, y + 0.12, 0));
  },
  // Zifferblatt, liegt flach (Radius 6, 12 bei -z): als deko auf den Boden unter die Zeiger legen
  zifferblatt(T, o) {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d'), m = 256;
    x.fillStyle = '#FFF8E7'; x.beginPath(); x.arc(m, m, 254, 0, TAU); x.fill();
    x.strokeStyle = '#1B1B1F'; x.lineWidth = 6; x.beginPath(); x.arc(m, m, 240, 0, TAU); x.stroke();
    x.fillStyle = '#1B1B1F'; x.font = 'bold 54px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let i = 1; i <= 60; i++) {
      const a = i * TAU / 60, s = Math.sin(a), k = -Math.cos(a), gross = i % 5 === 0;
      x.lineWidth = gross ? 7 : 2; x.beginPath(); x.moveTo(m + s * (gross ? 212 : 224), m + k * (gross ? 212 : 224)); x.lineTo(m + s * 238, m + k * 238); x.stroke();
      if (gross) x.fillText(String(i / 5), m + s * 178, m + k * 178);
    }
    const blatt = mesh(T, new T.CircleGeometry(6, 48), new T.MeshPhongMaterial({ map: new T.CanvasTexture(c), shininess: 60 }), 0, 0.04, 0); blatt.rotation.x = -Math.PI / 2; blatt.castShadow = false; blatt.receiveShadow = true;
    const rand = mesh(T, new T.TorusGeometry(6, 0.12, 8, 64), mat(T, o.farbe ?? 0x94742A, { shininess: 70 }), 0, 0.05, 0); rand.rotation.x = Math.PI / 2;
    return group(T, blatt, rand);
  },
  zahnrad(T, o) {
    const m = mat(T, o.farbe ?? 0x94742A, { shininess: 50, specular: 0x333322 }), dunkel = mat(T, 0x5C4A14), g = group(T, mesh(T, cyl(T, 2.5, 2.5, 0.8, 36), m, 0, 0.4, 0));
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12, z = mesh(T, new T.BoxGeometry(0.9, 0.8, 0.8), m, Math.cos(a) * 2.7, 0.4, Math.sin(a) * 2.7); z.rotation.y = -a; g.add(z); }
    for (let i = 0; i < 5; i++) { const a = i * TAU / 5; g.add(mesh(T, cyl(T, 0.5, 0.5, 0.82, 16), dunkel, Math.cos(a) * 1.5, 0.4, Math.sin(a) * 1.5)); }
    g.add(mesh(T, cyl(T, 0.4, 0.4, 1.1, 6), dunkel, 0, 0.55, 0));
    return g;
  },
  glocke(T, o) {
    const m = mat(T, o.farbe ?? 0xB8860B, { shininess: 130, specular: 0xffeeaa, side: T.DoubleSide });
    const prof = [[0.25, 3.2], [0.8, 3.1], [1.1, 2.6], [1.25, 1.6], [1.4, 0.8], [1.65, 0.25], [1.72, 0]].map(([x, y]) => new T.Vector2(x, y));
    const krone = mesh(T, new T.TorusGeometry(0.3, 0.1, 8, 16), m, 0, 3.4, 0);
    return group(T, mesh(T, new T.LatheGeometry(prof, 28), m), mesh(T, cyl(T, 0.25, 0.25, 0.1, 12), m, 0, 3.2, 0), krone,
      mesh(T, cyl(T, 0.05, 0.05, 2.6, 6), mat(T, 0x3E3E3E), 0, 1.7, 0), mesh(T, new T.SphereGeometry(0.3, 12, 10), mat(T, 0x3E3E3E), 0, 0.35, 0));
  },
  schraube(T, o) {
    const m = mat(T, o.farbe ?? STAHL, { shininess: 150, specular: 0xffffff }), g = group(T, mesh(T, cyl(T, 0.35, 0.3, 2.5, 12), m, 0, 1.25, 0), mesh(T, cyl(T, 0.8, 0.8, 0.5, 20), m, 0, 2.75, 0),
      mesh(T, new T.BoxGeometry(1.5, 0.08, 0.22), mat(T, 0x333333), 0, 3.0, 0));
    for (let i = 0; i < 6; i++) { const r = mesh(T, new T.TorusGeometry(0.38, 0.06, 6, 14), m, 0, 0.3 + i * 0.38, 0); r.rotation.x = Math.PI / 2 + 0.12; g.add(r); }
    return g;
  },
  // Aufziehschlüssel, liegt flach: Flügel bei +z
  schluessel(T, o) {
    const m = mat(T, o.farbe ?? MESSING, { shininess: 120, specular: 0x777755 }), g = group(T);
    const schaft = mesh(T, cyl(T, 0.3, 0.3, 4, 12), m, 0, 0.4, -0.6); schaft.rotation.x = Math.PI / 2; g.add(schaft);
    for (const k of [-1, 1]) { const f = mesh(T, new T.TorusGeometry(0.85, 0.22, 8, 22), m, k * 0.85, 0.4, 2.3); f.rotation.x = Math.PI / 2; g.add(f); }
    g.add(mesh(T, new T.BoxGeometry(0.7, 0.7, 0.7), m, 0, 0.4, -2.9));
    return g;
  },

  // ---------- Schoggifabrik ----------
  // Schoggitafel, liegt flach: 3 x 5 Stücke, ein Ende steckt noch im Papier
  tafel(T, o) {
    const sch = mat(T, SCHOGGI, { shininess: 70 }), g = group(T, mesh(T, new T.BoxGeometry(5, 0.5, 8), sch, 0, 0.25, 0));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g.add(mesh(T, new T.BoxGeometry(1.4, 0.3, 1.35), sch, (i - 1) * 1.6, 0.65, -3.15 + j * 1.6));
    g.add(mesh(T, new T.BoxGeometry(5.15, 0.85, 3.4), mat(T, o.farbe ?? 0xD32F2F, { shininess: 30 }), 0, 0.43, 2.3),
      mesh(T, new T.BoxGeometry(5.1, 0.7, 0.35), mat(T, 0xE8C55A, { shininess: 160, specular: 0xffffff }), 0, 0.36, 0.5));
    return g;
  },
  praline(T, o) {
    const sch = mat(T, o.farbe ?? 0x5A3418, { shininess: 90 });
    const haube = mesh(T, new T.SphereGeometry(1, 20, 12, 0, TAU, 0, Math.PI / 2).scale(1, 1.15, 1), sch, 0, 0.8, 0);
    return group(T, mesh(T, cyl(T, 1.2, 0.9, 0.85, 14), mat(T, 0xE8C55A, { shininess: 120, flatShading: true }), 0, 0.42, 0), haube,
      mesh(T, new T.SphereGeometry(0.28, 10, 8), mat(T, 0xFFF3E0), 0, 1.95, 0));
  },
  schoggihase(T, o) {
    const sch = mat(T, o.farbe ?? 0x7B4A2A, { shininess: 80 }), g = group(T, mesh(T, new T.SphereGeometry(1.3, 20, 16).scale(1, 1.3, 0.9), sch, 0, 1.7, 0), mesh(T, new T.SphereGeometry(0.9, 18, 14), sch, 0, 3.75, -0.1));
    for (const k of [-1, 1]) {
      g.add(mesh(T, new T.SphereGeometry(0.35, 12, 10).scale(1, 2.6, 0.6), sch, k * 0.4, 5.1, 0));
      g.add(mesh(T, new T.SphereGeometry(0.1, 8, 6), mat(T, 0x111111), k * 0.32, 3.95, -0.92));
    }
    const band = mesh(T, new T.TorusGeometry(0.75, 0.12, 8, 20), mat(T, 0xD32F2F), 0, 3.0, 0); band.rotation.x = Math.PI / 2; g.add(band);
    g.add(mesh(T, new T.SphereGeometry(0.2, 10, 8), mat(T, 0xE8C55A, { shininess: 160 }), 0, 2.85, -0.85));
    return g;
  }
};
