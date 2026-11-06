// Riesige Alltagsgegenstände aus einfachen Formen (three.js), damit die Murmel wirklich in der Küche,
// im Garten, im Bad ... unterwegs ist. Massstab: Murmel = 1 m, also ist eine Tasse etwa 5 m hoch.
//   PROPS[form](T, opts) -> THREE.Group, steht auf y = 0, Mitte bei x = z = 0
//   PROP_SIZE[form]      -> ungefähre Grösse [b, h, t] für einen Kollisions-Klotz (deko mit fest:true)
// opts.farbe überschreibt die Hauptfarbe.
import { werkstattProps, WERKSTATT_SIZE } from './props-werkstatt.js';

export const mat = (T, color, extra = {}) => new T.MeshPhongMaterial({ color, shininess: 40, ...extra });
export const mesh = (T, geo, m, x = 0, y = 0, z = 0) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; return o; };
export const group = (T, ...kids) => { const g = new T.Group(); kids.forEach(k => g.add(k)); return g; };
export const cyl = (T, rt, rb, h, n = 24, ...rest) => new T.CylinderGeometry(rt, rb, h, n, ...rest);

export const PROP_SIZE = {
  apfel: [4, 4, 4], orange: [3.6, 3.6, 3.6], tomate: [3, 2.6, 3], tasse: [5, 5, 4], teekanne: [7, 6, 5], toaster: [6, 4.1, 3.5],
  loeffel: [2.4, 0.6, 12], teller: [9, 0.6, 9], glas: [3.4, 6, 3.4], milch: [3.5, 7, 3.5], kaese: [4, 2.4, 4], salz: [1.6, 3.6, 1.6],
  flasche: [2.4, 7, 2.4], ente: [4, 4, 4.4], zahnbuerste: [1, 1, 11], becher: [3, 4, 3], seife: [4, 1.4, 2.6], shampoo: [2.6, 6, 1.8],
  blume: [3, 6, 3], zwerg: [3, 6, 3], giesskanne: [7, 5, 3], eimer: [4, 4, 4], schaufel: [1.6, 0.5, 9], burg: [9, 7, 9], baum: [6, 12, 6],
  pilz: [3, 3, 3], stein: [4, 2.4, 3.4], teddy: [5, 6, 4], wuerfel: [3, 3, 3], auto: [3.6, 2.4, 6], kreisel: [3, 3.2, 3],
  tanne: [5, 9.6, 5], schneemann: [3.4, 7, 3.4], iglu: [8, 4, 8], schlitten: [2.2, 1.2, 6], huette: [7.6, 6.2, 6.8], muetze: [4.2, 3, 4.2],
  pinguin: [2.4, 3.9, 2.2], torstange: [0.5, 2.6, 0.5], eiszapfen: [2, 3, 0.8],
  fisch: [2, 2.4, 5], muschel: [4, 1.6, 4], anker: [5, 6, 1], truhe: [5, 4, 3.4], seestern: [4, 0.6, 4], koralle: [3, 5, 3],
  rakete: [3, 10, 3], satellit: [8, 3, 3], ufo: [6, 2.4, 6], kristall: [2.4, 5, 2.4], vulkanstein: [4, 3, 4],
  satschuessel: [3, 4, 2],
  bude: [7, 6, 4.4], zelt: [9, 9.5, 9], ballons: [3, 7, 3], zuckerwatte: [2.4, 5, 2.4], popcorn: [3, 4.4, 3], lolli: [2.8, 6, 0.8],
  herz: [4, 4.2, 0.8], pferd: [1.4, 3.6, 3.2], putschauto: [2.4, 1.6, 3.4], dose: [1, 1.3, 1], lukas: [2.4, 9, 2.4], turm: [5, 14.5, 5],
  torbogen: [8, 10, 1], zielscheibe: [3, 3.8, 0.6]
};

export const PROPS = {
  // ---------- Küche ----------
  apfel(T, o) {
    const m = mat(T, o.farbe ?? 0xE53935, { shininess: 90 });
    return group(T, mesh(T, new T.SphereGeometry(2, 24, 18), m, 0, 2, 0), mesh(T, cyl(T, 0.12, 0.15, 1), mat(T, 0x6D4C41), 0, 4.2, 0),
      mesh(T, new T.SphereGeometry(0.5, 10, 6).scale(1.4, 0.3, 0.7), mat(T, 0x43A047), 0.5, 4.3, 0));
  },
  orange(T, o) { return group(T, mesh(T, new T.SphereGeometry(1.8, 24, 18), mat(T, o.farbe ?? 0xFB8C00, { shininess: 20 }), 0, 1.8, 0), mesh(T, new T.SphereGeometry(0.2, 8, 6), mat(T, 0x558B2F), 0, 3.6, 0)); },
  tomate(T, o) { return group(T, mesh(T, new T.SphereGeometry(1.5, 22, 16).scale(1, 0.85, 1), mat(T, o.farbe ?? 0xD32F2F, { shininess: 100 }), 0, 1.3, 0), mesh(T, cyl(T, 0.6, 0.6, 0.15, 5), mat(T, 0x388E3C), 0, 2.55, 0)); },
  tasse(T, o) {
    const m = mat(T, o.farbe ?? 0xFFFFFF, { shininess: 80, side: T.DoubleSide });
    const handle = mesh(T, new T.TorusGeometry(1.3, 0.3, 10, 20, Math.PI), m, 2.3, 2.6, 0); handle.rotation.z = -Math.PI / 2;
    return group(T, mesh(T, cyl(T, 2.2, 1.9, 5, 28, 1, true), m, 0, 2.5, 0), mesh(T, cyl(T, 1.9, 1.9, 0.2), m, 0, 0.1, 0),
      mesh(T, cyl(T, 2.05, 2.05, 0.1), mat(T, 0x5D4037), 0, 4.3, 0), handle);
  },
  teekanne(T, o) {
    const m = mat(T, o.farbe ?? 0x4FC3F7, { shininess: 90 });
    const spout = mesh(T, cyl(T, 0.3, 0.6, 3, 12), m, 3, 3, 0); spout.rotation.z = -0.9;
    const handle = mesh(T, new T.TorusGeometry(1.2, 0.3, 10, 20, Math.PI), m, -2.6, 3, 0); handle.rotation.z = Math.PI / 2;
    return group(T, mesh(T, new T.SphereGeometry(2.8, 24, 18).scale(1, 0.85, 1), m, 0, 2.5, 0), mesh(T, new T.SphereGeometry(0.4, 10, 8), m, 0, 5.1, 0), spout, handle);
  },
  toaster(T, o) {
    const m = mat(T, o.farbe ?? 0xC0C6CF, { shininess: 140, specular: 0xffffff });
    const g = group(T, mesh(T, new T.BoxGeometry(6, 4, 3.4), m, 0, 2, 0));
    for (const x of [-1.3, 1.3]) g.add(mesh(T, new T.BoxGeometry(2, 0.1, 0.6), mat(T, 0x222222), x, 4.02, 0));
    g.add(mesh(T, new T.BoxGeometry(0.3, 0.8, 0.4), mat(T, 0x222222), 3.1, 2.6, 0));
    return g;
  },
  loeffel(T, o) {
    const m = mat(T, o.farbe ?? 0xD7DCE2, { shininess: 150, specular: 0xffffff });
    return group(T, mesh(T, new T.SphereGeometry(1.2, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2).scale(1, 0.4, 1.5), m, 0, 0.5, -4), mesh(T, new T.BoxGeometry(0.6, 0.2, 8), m, 0, 0.3, 1.5));
  },
  teller(T, o) { const m = mat(T, o.farbe ?? 0xFAFAFA, { shininess: 80 }); return group(T, mesh(T, cyl(T, 4.5, 3, 0.6, 36), m, 0, 0.3, 0), mesh(T, cyl(T, 3, 3, 0.05, 36), mat(T, 0x90CAF9), 0, 0.62, 0)); },
  glas(T, o) { return group(T, mesh(T, cyl(T, 1.7, 1.4, 6, 24, 1, true), mat(T, o.farbe ?? 0xE3F2FD, { transparent: true, opacity: 0.4, shininess: 120, side: T.DoubleSide, depthWrite: false }), 0, 3, 0), mesh(T, cyl(T, 1.55, 1.35, 3.5, 24), mat(T, 0xFF7043, { transparent: true, opacity: 0.8 }), 0, 1.8, 0)); },
  milch(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(3.4, 6, 3.4), mat(T, 0xFFFFFF), 0, 3, 0));
    const roof = mesh(T, new T.CylinderGeometry(0, 2.4, 1.2, 4), mat(T, o.farbe ?? 0x1E88E5), 0, 6.6, 0); roof.rotation.y = Math.PI / 4; g.add(roof);
    g.add(mesh(T, new T.BoxGeometry(3.45, 1.4, 3.45), mat(T, o.farbe ?? 0x1E88E5), 0, 3.5, 0));
    return g;
  },
  kaese(T, o) {
    const shape = new T.Shape(); shape.moveTo(0, 0); shape.lineTo(4, 0); shape.lineTo(0, 3); shape.closePath();
    const geo = new T.ExtrudeGeometry(shape, { depth: 2.4, bevelEnabled: false }); geo.rotateX(-Math.PI / 2); geo.translate(-1.3, 0, 1);
    return group(T, mesh(T, geo, mat(T, o.farbe ?? 0xFFCA28)));
  },
  salz(T, o) { return group(T, mesh(T, cyl(T, 0.8, 0.8, 3, 16), mat(T, 0xFFFFFF, { transparent: true, opacity: 0.8 }), 0, 1.5, 0), mesh(T, new T.SphereGeometry(0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, o.farbe ?? 0xB0BEC5, { shininess: 120 }), 0, 3, 0)); },
  flasche(T, o) { const m = mat(T, o.farbe ?? 0x66BB6A, { transparent: true, opacity: 0.75, shininess: 120 }); return group(T, mesh(T, cyl(T, 1.2, 1.2, 4.5, 20), m, 0, 2.25, 0), mesh(T, cyl(T, 0.45, 1.2, 1.5, 20), m, 0, 5.25, 0), mesh(T, cyl(T, 0.45, 0.45, 1, 16), m, 0, 6.5, 0)); },

  // ---------- Bad ----------
  ente(T, o) {
    const y = mat(T, o.farbe ?? 0xFFD600, { shininess: 70 });
    const beak = mesh(T, new T.ConeGeometry(0.5, 1.2, 12), mat(T, 0xFF6D00), 0, 3.2, -2.2); beak.rotation.x = -Math.PI / 2;
    const g = group(T, mesh(T, new T.SphereGeometry(2, 22, 16).scale(1, 0.8, 1.2), y, 0, 1.6, 0), mesh(T, new T.SphereGeometry(1.2, 20, 14), y, 0, 3.3, -1), beak);
    for (const x of [-0.5, 0.5]) g.add(mesh(T, new T.SphereGeometry(0.18, 8, 6), mat(T, 0x111111), x, 3.7, -2));
    return g;
  },
  zahnbuerste(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(0.8, 0.5, 9), mat(T, o.farbe ?? 0x29B6F6, { shininess: 80 }), 0, 0.25, 1));
    const bristle = mat(T, 0xFFFFFF);
    for (let i = 0; i < 5; i++) g.add(mesh(T, new T.BoxGeometry(0.7, 0.8, 0.3), bristle, 0, 0.9, -3.2 - i * 0.35));
    return g;
  },
  becher(T, o) { return group(T, mesh(T, cyl(T, 1.5, 1.3, 4, 20, 1, true), mat(T, o.farbe ?? 0x80CBC4, { side: T.DoubleSide }), 0, 2, 0), mesh(T, cyl(T, 0.15, 0.15, 5, 8), mat(T, 0xEC407A), 0.4, 3.4, 0)); },
  seife(T, o) { return group(T, mesh(T, new T.BoxGeometry(4, 1.4, 2.6), mat(T, o.farbe ?? 0xF48FB1, { shininess: 90 }), 0, 0.7, 0)); },
  shampoo(T, o) { return group(T, mesh(T, new T.BoxGeometry(2.6, 5, 1.8), mat(T, o.farbe ?? 0xAB47BC, { shininess: 90 }), 0, 2.5, 0), mesh(T, cyl(T, 0.6, 0.6, 1, 12), mat(T, 0xFFFFFF), 0, 5.5, 0)); },

  // ---------- Garten ----------
  blume(T, o) {
    const g = group(T, mesh(T, cyl(T, 0.15, 0.15, 5, 8), mat(T, 0x388E3C), 0, 2.5, 0), mesh(T, new T.SphereGeometry(0.6, 12, 8), mat(T, 0xFFD54F), 0, 5.2, 0));
    const p = mat(T, o.farbe ?? 0xFF5A8A);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g.add(mesh(T, new T.SphereGeometry(0.6, 10, 6).scale(1.2, 0.4, 0.8), p, Math.cos(a) * 1.1, 5.1, Math.sin(a) * 1.1)); }
    return g;
  },
  zwerg(T, o) {
    return group(T, mesh(T, cyl(T, 1, 1.4, 2.6, 16), mat(T, o.farbe ?? 0x1E88E5), 0, 1.3, 0), mesh(T, new T.SphereGeometry(0.9, 16, 12), mat(T, 0xFFCCBC), 0, 3.2, 0),
      mesh(T, new T.ConeGeometry(0.8, 1.6, 12), mat(T, 0xFFFFFF), 0, 2.6, -0.6), mesh(T, new T.ConeGeometry(1, 2.2, 16), mat(T, 0xE53935), 0, 4.8, 0));
  },
  giesskanne(T, o) {
    const m = mat(T, o.farbe ?? 0x43A047, { shininess: 60 });
    const spout = mesh(T, cyl(T, 0.25, 0.5, 4, 10), m, 3.2, 3, 0); spout.rotation.z = -0.8;
    const handle = mesh(T, new T.TorusGeometry(1.4, 0.25, 8, 20, Math.PI), m, -0.3, 4, 0);
    return group(T, mesh(T, cyl(T, 1.8, 1.8, 4, 22), m, 0, 2, 0), spout, handle);
  },
  eimer(T, o) { const m = mat(T, o.farbe ?? 0x1E88E5, { side: T.DoubleSide }); const h = mesh(T, new T.TorusGeometry(1.9, 0.08, 6, 24, Math.PI), mat(T, 0x333333), 0, 4, 0); return group(T, mesh(T, cyl(T, 2, 1.5, 4, 22, 1, true), m, 0, 2, 0), mesh(T, cyl(T, 1.5, 1.5, 0.1, 22), m, 0, 0.05, 0), h); },
  schaufel(T, o) { const m = mat(T, o.farbe ?? 0xFDD835); return group(T, mesh(T, new T.BoxGeometry(2.4, 0.2, 3), m, 0, 0.2, -3), mesh(T, new T.BoxGeometry(0.5, 0.4, 6), m, 0, 0.25, 1.5)); },
  burg(T, o) {
    const s = mat(T, o.farbe ?? 0xE6C27A), g = group(T, mesh(T, new T.BoxGeometry(7, 3.5, 7), s, 0, 1.75, 0));
    for (const [x, z] of [[-3.5, -3.5], [3.5, -3.5], [-3.5, 3.5], [3.5, 3.5]]) {
      g.add(mesh(T, cyl(T, 1.1, 1.3, 5, 14), s, x, 2.5, z));
      g.add(mesh(T, new T.ConeGeometry(1.3, 2, 14), s, x, 6, z));
    }
    g.add(mesh(T, cyl(T, 0.05, 0.05, 2, 6), mat(T, 0x6D4C41), 0, 4.5, 0));
    g.add(mesh(T, new T.BoxGeometry(1.2, 0.7, 0.05), mat(T, 0xE53935), 0.6, 5.1, 0));
    return g;
  },
  baum(T, o) { return group(T, mesh(T, cyl(T, 0.8, 1.1, 6, 12), mat(T, 0x795548), 0, 3, 0), mesh(T, new T.SphereGeometry(3.4, 18, 14), mat(T, o.farbe ?? 0x43A047), 0, 8, 0), mesh(T, new T.SphereGeometry(2.4, 16, 12), mat(T, o.farbe ?? 0x4CAF50), 1.8, 9.5, 0.8)); },
  pilz(T, o) { const g = group(T, mesh(T, cyl(T, 0.6, 0.8, 2, 12), mat(T, 0xFFF3E0), 0, 1, 0), mesh(T, new T.SphereGeometry(1.5, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, o.farbe ?? 0xE53935), 0, 1.9, 0)); for (let i = 0; i < 5; i++) { const a = i * 1.3; g.add(mesh(T, new T.SphereGeometry(0.22, 8, 6), mat(T, 0xFFFFFF), Math.cos(a) * 0.9, 2.9, Math.sin(a) * 0.9)); } return g; },
  stein(T, o) { const m = mesh(T, new T.DodecahedronGeometry(1.8, 0).scale(1.1, 0.7, 0.95), mat(T, o.farbe ?? 0x9E9E9E, { flatShading: true }), 0, 1.1, 0); return group(T, m); },

  // ---------- Winter ----------
  tanne(T, o) { // verschneite Tanne: drei Stufen, jede mit Schneehaube
    const gruen = mat(T, o.farbe ?? 0x2E7D4F, { flatShading: true }), weiss = mat(T, 0xFFFFFF, { shininess: 10 });
    const g = group(T, mesh(T, cyl(T, 0.5, 0.7, 2.4, 10), mat(T, 0x6D4C41), 0, 1.2, 0));
    for (const [r, h, y] of [[2.6, 4, 3.6], [2, 3.4, 6], [1.3, 2.8, 8.2]]) {
      g.add(mesh(T, new T.ConeGeometry(r, h, 10), gruen, 0, y, 0), mesh(T, new T.ConeGeometry(r * 0.62, h * 0.6, 10), weiss, 0, y + h * 0.2 + 0.02, 0));
    }
    return g;
  },
  schneemann(T, o) {
    const s = mat(T, 0xFFFFFF, { shininess: 10 }), kohle = mat(T, 0x222222);
    const g = group(T, mesh(T, new T.SphereGeometry(1.7, 20, 16), s, 0, 1.5, 0), mesh(T, new T.SphereGeometry(1.25, 20, 16), s, 0, 3.7, 0), mesh(T, new T.SphereGeometry(0.9, 18, 14), s, 0, 5.3, 0));
    const nase = mesh(T, new T.ConeGeometry(0.2, 1, 10), mat(T, 0xFF7A1A), 0, 5.3, -1.3); nase.rotation.x = -Math.PI / 2; g.add(nase);
    for (const x of [-0.35, 0.35]) g.add(mesh(T, new T.SphereGeometry(0.13, 8, 6), kohle, x, 5.6, -0.78));
    for (const y of [3.3, 3.9, 4.4]) g.add(mesh(T, new T.SphereGeometry(0.14, 8, 6), kohle, 0, y, -Math.sqrt(1.25 * 1.25 - (y - 3.7) * (y - 3.7))));
    g.add(mesh(T, cyl(T, 1, 1, 0.12, 18), kohle, 0, 6.05, 0), mesh(T, cyl(T, 0.65, 0.65, 0.9, 18), mat(T, o.farbe ?? 0x333333), 0, 6.5, 0));
    const schal = mesh(T, new T.TorusGeometry(0.85, 0.22, 8, 20), mat(T, 0xE53935), 0, 4.6, 0); schal.rotation.x = Math.PI / 2; g.add(schal);
    for (const k of [-1, 1]) { const a = mesh(T, cyl(T, 0.08, 0.08, 2, 6), mat(T, 0x6D4C41), k * 1.9, 4.2, 0); a.rotation.z = -k; g.add(a); }
    return g;
  },
  iglu(T, o) { // Eingang (Tunnel) zeigt nach -z
    const s = mat(T, o.farbe ?? 0xEAF4FB, { flatShading: true, shininess: 20 });
    const tunnel = mesh(T, cyl(T, 1.3, 1.3, 2.4, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2), s, 0, 0, -3.6);
    const loch = mesh(T, new T.CircleGeometry(1.05, 12, 0, Math.PI), mat(T, 0x37474F, { side: T.DoubleSide }), 0, 0, -4.82); loch.castShadow = false;
    return group(T, mesh(T, new T.SphereGeometry(4, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), s, 0, 0, 0), tunnel, loch);
  },
  schlitten(T, o) { // Davoser Schlitten, fährt nach -z
    const holz = mat(T, o.farbe ?? 0xC68A4A), g = group(T);
    for (const x of [-0.9, 0.9]) {
      g.add(mesh(T, new T.BoxGeometry(0.18, 0.18, 5), holz, x, 0.09, 0.4));
      const horn = mesh(T, new T.BoxGeometry(0.18, 0.18, 1.5), holz, x, 0.52, -2.65); horn.rotation.x = 0.7; g.add(horn);
      for (const z of [-1.1, 1.8]) g.add(mesh(T, new T.BoxGeometry(0.15, 0.9, 0.15), holz, x, 0.6, z));
    }
    for (const z of [-1.1, 1.8]) g.add(mesh(T, new T.BoxGeometry(2, 0.12, 0.2), holz, 0, 1, z));
    for (let i = 0; i < 5; i++) g.add(mesh(T, new T.BoxGeometry(0.3, 0.1, 4), holz, -0.8 + i * 0.4, 1.1, 0.4));
    return g;
  },
  huette(T, o) { // Berghütte mit Schnee auf dem Dach, Tür zeigt nach -z
    const g = group(T, mesh(T, new T.BoxGeometry(7, 3.6, 6), mat(T, o.farbe ?? 0x8D5A34, { shininess: 10 }), 0, 1.8, 0));
    g.add(mesh(T, new T.CylinderGeometry(0, 5.4, 2.6, 4).rotateY(Math.PI / 4).scale(1, 1, 0.88), mat(T, 0xFFFFFF, { flatShading: true, shininess: 10 }), 0, 4.9, 0));
    g.add(mesh(T, new T.BoxGeometry(1.3, 2.2, 0.1), mat(T, 0x4E342E), -1.5, 1.1, -3.03));
    g.add(mesh(T, new T.BoxGeometry(1.4, 1.1, 0.1), mat(T, 0xFFE082, { emissive: 0xFFB300, emissiveIntensity: 0.5 }), 1.5, 2.1, -3.03));
    g.add(mesh(T, new T.BoxGeometry(0.8, 1.8, 0.8), mat(T, 0x757575), 2, 5, 1), mesh(T, new T.BoxGeometry(1, 0.25, 1), mat(T, 0xFFFFFF), 2, 6, 1));
    return g;
  },
  muetze(T, o) { // Zipfelmütze mit Bommel
    const weiss = mat(T, 0xFFFFFF, { shininess: 5 });
    const rand = mesh(T, new T.TorusGeometry(1.7, 0.42, 8, 22), weiss, 0, 0.42, 0); rand.rotation.x = Math.PI / 2;
    return group(T, mesh(T, new T.SphereGeometry(1.7, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 1.15, 1), mat(T, o.farbe ?? 0xE53935, { shininess: 5 }), 0, 0.42, 0), rand,
      mesh(T, new T.SphereGeometry(0.55, 12, 8), weiss, 0, 2.6, 0));
  },
  pinguin(T, o) {
    const schwarz = mat(T, o.farbe ?? 0x263238, { shininess: 60 }), weiss = mat(T, 0xFFFFFF), gelb = mat(T, 0xFF9800);
    const schnabel = mesh(T, new T.ConeGeometry(0.22, 0.6, 10), gelb, 0, 3.1, -0.85); schnabel.rotation.x = -Math.PI / 2;
    const g = group(T, mesh(T, new T.SphereGeometry(1, 18, 14).scale(1, 1.5, 0.9), schwarz, 0, 1.55, 0), mesh(T, new T.SphereGeometry(0.8, 16, 12).scale(1, 1.4, 0.6), weiss, 0, 1.45, -0.45),
      mesh(T, new T.SphereGeometry(0.7, 16, 12), schwarz, 0, 3.2, 0), schnabel);
    for (const k of [-1, 1]) {
      g.add(mesh(T, new T.SphereGeometry(0.14, 8, 6), weiss, k * 0.28, 3.4, -0.58), mesh(T, new T.SphereGeometry(0.07, 8, 6), mat(T, 0x111111), k * 0.28, 3.42, -0.7));
      g.add(mesh(T, new T.SphereGeometry(0.4, 10, 8).scale(1, 0.3, 1.4), gelb, k * 0.45, 0.12, -0.45));
      const fl = mesh(T, new T.SphereGeometry(0.7, 10, 8).scale(0.25, 1, 0.6), schwarz, k * 1.02, 1.8, 0); fl.rotation.z = k * 0.3; g.add(fl);
    }
    return g;
  },
  torstange(T, o) { // Slalomstange mit Fähnchen
    const m = mat(T, o.farbe ?? 0xE53935, { shininess: 60 });
    return group(T, mesh(T, cyl(T, 0.09, 0.09, 2.6, 8), m, 0, 1.3, 0), mesh(T, new T.BoxGeometry(0.9, 0.6, 0.04), m, 0.5, 2.2, 0), mesh(T, new T.SphereGeometry(0.4, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.4, 1), mat(T, 0xFFFFFF), 0, 0, 0));
  },
  eiszapfen(T, o) { // hängen von y = 3 herunter
    const m = mat(T, o.farbe ?? 0xBFE6FA, { shininess: 140, specular: 0xffffff, transparent: true, opacity: 0.85 }), g = group(T);
    for (const [x, h] of [[-0.7, 2.1], [0, 3], [0.65, 1.7], [-0.3, 1.2]]) g.add(mesh(T, new T.ConeGeometry(0.28, h, 8).rotateX(Math.PI), m, x, 3 - h / 2, 0));
    return g;
  },

  // ---------- Spielzimmer ----------
  teddy(T, o) {
    const b = mat(T, o.farbe ?? 0xA1887F, { shininess: 5 }), g = group(T, mesh(T, new T.SphereGeometry(2, 18, 14), b, 0, 2, 0), mesh(T, new T.SphereGeometry(1.4, 18, 14), b, 0, 4.6, 0));
    for (const x of [-1, 1]) { g.add(mesh(T, new T.SphereGeometry(0.55, 12, 8), b, x * 1.1, 5.8, 0)); g.add(mesh(T, new T.SphereGeometry(0.7, 12, 8), b, x * 1.9, 2.6, -0.4)); g.add(mesh(T, new T.SphereGeometry(0.15, 8, 6), mat(T, 0x111111), x * 0.45, 4.9, -1.25)); }
    g.add(mesh(T, new T.SphereGeometry(0.45, 10, 8), mat(T, 0xD7CCC8), 0, 4.4, -1.3));
    return g;
  },
  wuerfel(T, o) { const g = group(T, mesh(T, new T.BoxGeometry(3, 3, 3), mat(T, o.farbe ?? 0xFFFFFF, { shininess: 60 }), 0, 1.5, 0)); const d = mat(T, 0x222222); for (const [x, y] of [[-0.8, 0.8], [0, 0], [0.8, -0.8]]) g.add(mesh(T, new T.SphereGeometry(0.25, 8, 6), d, x, 1.5 + y, -1.5)); return g; },
  auto(T, o) {
    const m = mat(T, o.farbe ?? 0xE53935, { shininess: 90 }), g = group(T, mesh(T, new T.BoxGeometry(3.4, 1.2, 6), m, 0, 1.2, 0), mesh(T, new T.BoxGeometry(2.8, 1, 3), m, 0, 2.3, 0.4));
    g.add(mesh(T, new T.BoxGeometry(2.6, 0.8, 0.1), mat(T, 0x90CAF9), 0, 2.3, -1.12));
    for (const x of [-1.7, 1.7]) for (const z of [-1.9, 1.9]) { const w = mesh(T, cyl(T, 0.7, 0.7, 0.5, 16), mat(T, 0x222222), x, 0.7, z); w.rotation.z = Math.PI / 2; g.add(w); }
    return g;
  },
  kreisel(T, o) { return group(T, mesh(T, new T.ConeGeometry(1.5, 1.5, 20).rotateX(Math.PI), mat(T, o.farbe ?? 0x8E24AA), 0, 0.75, 0), mesh(T, cyl(T, 1.5, 1.5, 0.6, 20), mat(T, 0xFDD835), 0, 1.8, 0), mesh(T, cyl(T, 0.2, 0.2, 1.2, 8), mat(T, 0x8E24AA), 0, 2.6, 0)); },

  // ---------- Unterwasser ----------
  fisch(T, o) { const m = mat(T, o.farbe ?? 0xFF9800, { shininess: 80 }); const tail = mesh(T, new T.ConeGeometry(0.9, 1.4, 4), m, 0, 1.2, 2.6); tail.rotation.x = -Math.PI / 2; return group(T, mesh(T, new T.SphereGeometry(1, 16, 12).scale(0.6, 1, 2), m, 0, 1.2, 0), tail, mesh(T, new T.SphereGeometry(0.15, 8, 6), mat(T, 0x111111), 0.5, 1.5, -1.3)); },
  muschel(T, o) { return group(T, mesh(T, new T.SphereGeometry(2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.6, 1), mat(T, o.farbe ?? 0xFFCCBC, { flatShading: true }), 0, 0, 0)); },
  anker(T, o) { const m = mat(T, o.farbe ?? 0x546E7A, { shininess: 60 }); const arc = mesh(T, new T.TorusGeometry(2, 0.3, 8, 20, Math.PI), m, 0, 1.6, 0); arc.rotation.z = Math.PI; return group(T, mesh(T, new T.BoxGeometry(0.5, 5.5, 0.5), m, 0, 2.9, 0), arc, mesh(T, new T.TorusGeometry(0.6, 0.2, 8, 16), m, 0, 6, 0), mesh(T, new T.BoxGeometry(3, 0.4, 0.4), m, 0, 4.8, 0)); },
  truhe(T, o) { const w = mat(T, o.farbe ?? 0x8D6E63), gold = mat(T, 0xFFC928, { shininess: 120 }); return group(T, mesh(T, new T.BoxGeometry(5, 2.6, 3.4), w, 0, 1.3, 0), mesh(T, cyl(T, 1.7, 1.7, 5, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2), w, 0, 2.6, 0), mesh(T, new T.BoxGeometry(0.6, 0.8, 0.1), gold, 0, 2.3, -1.72)); },
  seestern(T, o) { const s = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.8 : 2, a = i * Math.PI / 5; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(r, 0); } const geo = new T.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false }); geo.rotateX(-Math.PI / 2); return group(T, mesh(T, geo, mat(T, o.farbe ?? 0xFF7043))); },
  koralle(T, o) { const m = mat(T, o.farbe ?? 0xFF6F61), g = group(T); for (let i = 0; i < 5; i++) { const b = mesh(T, cyl(T, 0.2, 0.4, 3 + (i % 3), 8), m, (i - 2) * 0.5, 1.8, (i % 2) * 0.6); b.rotation.z = (i - 2) * 0.3; g.add(b); } return g; },

  // ---------- Weltraum / Vulkan ----------
  rakete(T, o) { const w = mat(T, 0xFAFAFA, { shininess: 80 }), r = mat(T, o.farbe ?? 0xE53935); const g = group(T, mesh(T, cyl(T, 1.2, 1.2, 6, 20), w, 0, 4, 0), mesh(T, new T.ConeGeometry(1.2, 2.5, 20), r, 0, 8.25, 0), mesh(T, new T.SphereGeometry(0.5, 12, 8), mat(T, 0x4FC3F7), 0, 5.5, -1.1)); for (let i = 0; i < 3; i++) { const f = mesh(T, new T.BoxGeometry(0.2, 2, 1.4), r, Math.cos(i * 2.1) * 1.3, 1.5, Math.sin(i * 2.1) * 1.3); f.rotation.y = -i * 2.1; g.add(f); } return g; },
  satellit(T, o) { const g = group(T, mesh(T, new T.BoxGeometry(2, 2, 2), mat(T, 0xFFC928, { shininess: 120 }), 0, 1.5, 0)); for (const x of [-3, 3]) g.add(mesh(T, new T.BoxGeometry(3, 0.1, 1.6), mat(T, o.farbe ?? 0x1565C0, { shininess: 120 }), x, 1.5, 0)); return g; },
  ufo(T, o) { return group(T, mesh(T, new T.SphereGeometry(3, 24, 12).scale(1, 0.3, 1), mat(T, 0xB0BEC5, { shininess: 150 }), 0, 1, 0), mesh(T, new T.SphereGeometry(1.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, o.farbe ?? 0x76FF03, { transparent: true, opacity: 0.6 }), 0, 1.5, 0)); },
  kristall(T, o) { const m = mat(T, o.farbe ?? 0xB388FF, { emissive: o.farbe ?? 0x5E35B1, emissiveIntensity: 0.4, flatShading: true, shininess: 120 }); return group(T, mesh(T, new T.OctahedronGeometry(1.2, 0).scale(1, 2, 1), m, 0, 2.4, 0), mesh(T, new T.OctahedronGeometry(0.7, 0).scale(1, 2, 1), m, 1, 1.4, 0.3)); },
  // ---------- Dach ----------
  satschuessel(T, o) { // Satellitenschüssel auf einem Mast, schaut schräg nach oben
    const grau = mat(T, o.farbe ?? 0xE6EAEE, { shininess: 90, side: T.DoubleSide }), dunkel = mat(T, 0x55606A);
    const dish = mesh(T, new T.SphereGeometry(2.4, 24, 10, 0, Math.PI * 2, 0, 0.62), grau, 0, 0.9, 1.9); dish.rotation.x = -2.0;
    const arm = mesh(T, cyl(T, 0.06, 0.06, 1.7, 6), dunkel, 0, 2.9, -0.5); arm.rotation.x = 1.1;
    return group(T, mesh(T, cyl(T, 0.14, 0.14, 2.6, 10), dunkel, 0, 1.3, 0), dish, arm, mesh(T, new T.SphereGeometry(0.22, 10, 8), dunkel, 0, 3.3, -1.25));
  },
  vulkanstein(T, o) { return group(T, mesh(T, new T.DodecahedronGeometry(2, 0).scale(1, 0.75, 1), mat(T, o.farbe ?? 0x3E3438, { flatShading: true }), 0, 1.4, 0)); },

  // ---------- Chilbi ----------
  // Bude: Theke, vier Pfosten, schräges Streifendach
  bude(T, o) {
    const c = o.farbe ?? 0xE53935, weiss = mat(T, 0xFAFAFA), farbe = mat(T, c);
    const g = group(T, mesh(T, new T.BoxGeometry(6.4, 2, 3.4), mat(T, 0xC98B4F), 0, 1, 0), mesh(T, new T.BoxGeometry(6.8, 0.25, 3.8), mat(T, 0xFFF3E0), 0, 2.12, 0));
    for (const x of [-3, 3]) for (const z of [-1.5, 1.5]) g.add(mesh(T, cyl(T, 0.12, 0.12, 3, 8), weiss, x, 3.6, z));
    const dach = group(T); dach.position.y = 5.3; dach.rotation.x = 0.16;
    for (let i = 0; i < 8; i++) dach.add(mesh(T, new T.BoxGeometry(0.875, 0.3, 4.4), i % 2 ? weiss : farbe, -3.06 + i * 0.875, 0, 0));
    for (let i = 0; i < 8; i++) dach.add(mesh(T, new T.SphereGeometry(0.44, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), i % 2 ? farbe : weiss, -3.06 + i * 0.875, -0.1, -2.2)); // Zacken vorne
    g.add(dach);
    return g;
  },
  // Zirkuszelt: runde Wand und spitzes Dach in Streifen, Wimpel
  zelt(T, o) {
    const c = o.farbe ?? 0xE53935, ms = [mat(T, c, { side: T.DoubleSide }), mat(T, 0xFAFAFA, { side: T.DoubleSide })], g = group(T), n = 12, w = Math.PI * 2 / n;
    for (let i = 0; i < n; i++) {
      g.add(mesh(T, cyl(T, 4.4, 4.4, 3.4, 3, 1, true, i * w, w), ms[i % 2], 0, 1.7, 0));
      g.add(mesh(T, cyl(T, 0.3, 4.6, 4.6, 3, 1, true, i * w, w), ms[(i + 1) % 2], 0, 5.7, 0));
    }
    g.add(mesh(T, cyl(T, 0.06, 0.06, 1.6, 6), mat(T, 0x6D4C41), 0, 8.7, 0), mesh(T, new T.ConeGeometry(0.35, 1, 3).rotateZ(-Math.PI / 2), mat(T, 0xFDD835), 0.5, 9.1, 0));
    g.add(mesh(T, new T.BoxGeometry(1.6, 2.4, 0.1), mat(T, 0x4A2C5E), 0, 1.2, -4.3)); // Eingang
    return g;
  },
  // Drei Ballone an Schnüren
  ballons(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(0.6, 0.4, 0.6), mat(T, 0x795548), 0, 0.2, 0)), schnur = mat(T, 0xEEEEEE);
    [[o.farbe ?? 0xE53935, -0.9, 6, 0.2], [0xFDD835, 0.2, 6.5, -0.4], [0x1E88E5, 0.9, 5.7, 0.5]].forEach(([c, x, y, z]) => {
      g.add(mesh(T, new T.SphereGeometry(0.8, 16, 12).scale(1, 1.2, 1), mat(T, c, { shininess: 110 }), x, y, z), mesh(T, new T.ConeGeometry(0.14, 0.2, 8), mat(T, c), x, y - 1.02, z));
      const L = Math.hypot(x, y - 1.4, z), s = mesh(T, cyl(T, 0.02, 0.02, L, 4), schnur, x / 2, (y - 1) / 2 + 0.2, z / 2);
      s.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(x, y - 1.4, z).normalize()); g.add(s);
    });
    return g;
  },
  // Zuckerwatte am Stiel
  zuckerwatte(T, o) {
    const rosa = mat(T, o.farbe ?? 0xF8A5C8, { shininess: 5 }), g = group(T, mesh(T, new T.ConeGeometry(0.28, 2.6, 10).rotateX(Math.PI), mat(T, 0xFFFDE7), 0, 1.3, 0));
    for (const [x, y, z, r] of [[0, 3.4, 0, 1.15], [0.5, 2.8, 0.2, 0.8], [-0.5, 3, -0.2, 0.85], [0.1, 4.2, 0.1, 0.8], [-0.2, 2.5, 0.4, 0.6]]) g.add(mesh(T, new T.SphereGeometry(r, 12, 10), rosa, x, y, z));
    return g;
  },
  // Popcorn-Tüte mit Streifen
  popcorn(T, o) {
    const g = group(T, mesh(T, cyl(T, 1.5, 1.1, 3.2, 4).rotateY(Math.PI / 4), mat(T, o.farbe ?? 0xE53935), 0, 1.6, 0));
    for (const y of [0.9, 2.2]) g.add(mesh(T, cyl(T, 1.22 + y * 0.125, 1.16 + y * 0.125, 0.5, 4).rotateY(Math.PI / 4), mat(T, 0xFAFAFA), 0, y, 0));
    const korn = mat(T, 0xFFF3C4, { shininess: 10 });
    for (let i = 0; i < 9; i++) { const a = i * 2.4; g.add(mesh(T, new T.DodecahedronGeometry(0.42, 0), korn, Math.cos(a) * (i % 3) * 0.38, 3.4 + (i % 2) * 0.4 + (i === 0 ? 0.5 : 0), Math.sin(a) * (i % 3) * 0.38)); }
    return g;
  },
  // Lolli: Scheibe mit Ringen am Stiel
  lolli(T, o) {
    const g = group(T, mesh(T, cyl(T, 0.1, 0.1, 3.4, 8), mat(T, 0xFAFAFA), 0, 1.7, 0), mesh(T, cyl(T, 1.4, 1.4, 0.4, 28).rotateX(Math.PI / 2), mat(T, o.farbe ?? 0xEC407A, { shininess: 110 }), 0, 4.6, 0));
    for (const r of [0.45, 0.95]) for (const z of [-0.2, 0.2]) g.add(mesh(T, new T.TorusGeometry(r, 0.1, 6, 24), mat(T, 0xFAFAFA), 0, 4.6, z));
    return g;
  },
  // Lebkuchenherz mit Zuckerguss
  herz(T, o) {
    const s = new T.Shape(); s.moveTo(0, 0); s.bezierCurveTo(-2.6, 1.6, -2.4, 4.4, 0, 3.2); s.bezierCurveTo(2.4, 4.4, 2.6, 1.6, 0, 0);
    const platte = (k, d, m, z) => { const geo = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); geo.translate(0, 0, -d / 2); const p = mesh(T, geo, m, 0, 1.9 * (1 - k) + 0.3, z); p.scale.set(k, k, 1); return p; };
    return group(T, platte(1, 0.6, mat(T, o.farbe ?? 0x8D5A2B, { shininess: 10 }), 0), platte(0.82, 0.1, mat(T, 0xFAFAFA), -0.32), platte(0.7, 0.1, mat(T, 0xE53935), -0.36), platte(0.3, 0.1, mat(T, 0xFAFAFA), -0.4));
  },
  // Karussellpferd an der Stange
  pferd(T, o) {
    const w = mat(T, o.farbe ?? 0xFAFAFA, { shininess: 80 }), gold = mat(T, 0xFFC928, { shininess: 120 }), rot = mat(T, 0xE53935);
    const hals = mesh(T, cyl(T, 0.24, 0.3, 0.9, 10), w, 0, 2.45, -0.8); hals.rotation.x = -0.6;
    const schweif = mesh(T, new T.ConeGeometry(0.2, 0.9, 8), gold, 0, 1.75, 1.2); schweif.rotation.x = -2.4;
    const g = group(T, mesh(T, cyl(T, 0.07, 0.07, 3.6, 8), gold, 0, 1.8, 0), mesh(T, new T.SphereGeometry(0.5, 14, 10).scale(0.85, 0.95, 2), w, 0, 1.9, 0), hals,
      mesh(T, new T.SphereGeometry(0.3, 12, 8).scale(0.8, 0.9, 1.5), w, 0, 2.85, -1.25), mesh(T, new T.BoxGeometry(0.9, 0.2, 0.7), rot, 0, 2.38, 0.05), schweif);
    for (const x of [-0.25, 0.25]) for (const [z, a] of [[-0.6, -0.5], [0.6, 0.5]]) { const bein = mesh(T, cyl(T, 0.09, 0.07, 1, 6), w, x, 1.15, z + Math.sin(a) * 0.4); bein.rotation.x = a; g.add(bein); }
    for (const x of [-0.13, 0.13]) g.add(mesh(T, new T.ConeGeometry(0.07, 0.2, 6), w, x, 3.15, -1.05));
    return g;
  },
  // Putschauto: Gummiwulst rundum, bunte Haube, Lenkrad, Stange mit Stromabnehmer
  putschauto(T, o) {
    const farbe = mat(T, o.farbe ?? 0xE53935, { shininess: 110 }), gummi = mat(T, 0x212121, { shininess: 20 });
    const g = group(T, mesh(T, cyl(T, 1.2, 1.2, 0.5, 24).scale(1, 1, 1.42), gummi, 0, 0.3, 0),
      mesh(T, new T.SphereGeometry(1.05, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.95, 1.45), farbe, 0, 0.5, 0),
      mesh(T, new T.BoxGeometry(1.3, 0.5, 0.9), mat(T, 0x37474F), 0, 1.25, 0.55), mesh(T, cyl(T, 0.04, 0.04, 2.2, 6), mat(T, 0xB0BEC5), 0, 2.4, 1.35));
    const rad = mesh(T, new T.TorusGeometry(0.3, 0.06, 6, 16), gummi, 0, 1.5, -0.1); rad.rotation.x = -1; g.add(rad);
    for (const x of [-0.55, 0.55]) g.add(mesh(T, new T.SphereGeometry(0.18, 10, 8), mat(T, 0xFFF59D, { emissive: 0xFFE082, emissiveIntensity: 0.7 }), x, 0.85, -1.3));
    return g;
  },
  // Büchse mit Etikett
  dose(T, o) { const blech = mat(T, 0xCFD8DC, { shininess: 140, specular: 0xffffff }); return group(T, mesh(T, cyl(T, 0.5, 0.5, 1.3, 20), blech, 0, 0.65, 0), mesh(T, cyl(T, 0.515, 0.515, 0.75, 20), mat(T, o.farbe ?? 0xE53935), 0, 0.65, 0)); },
  // Hau den Lukas: Sockel mit Schlagfläche, Skala, oben die Glocke
  lukas(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(2.4, 0.8, 2.4), mat(T, o.farbe ?? 0xE53935), 0, 0.4, 0), mesh(T, cyl(T, 0.55, 0.55, 0.3, 16), mat(T, 0xFDD835), 0, 0.95, -0.6),
      mesh(T, new T.BoxGeometry(1, 7, 0.3), mat(T, 0xFAFAFA), 0, 4.3, 0.4), mesh(T, new T.BoxGeometry(0.5, 0.3, 0.2), mat(T, 0x212121), 0, 1.6, 0.2));
    [0x43A047, 0x7CB342, 0xFDD835, 0xFB8C00, 0xE53935].forEach((c, i) => g.add(mesh(T, new T.BoxGeometry(0.8, 0.9, 0.06), mat(T, c), 0, 2.2 + i * 1.15, 0.23)));
    g.add(mesh(T, new T.SphereGeometry(0.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(T, 0xFFC928, { shininess: 140, specular: 0xffffff }), 0, 8, 0.3), mesh(T, new T.SphereGeometry(0.16, 8, 6), mat(T, 0xFFC928), 0, 8.7, 0.3));
    return g;
  },
  // Rutschturm: gestreifter Turm mit Spitzdach und Wimpel (Mitte einer Rutsche als Spirale)
  turm(T, o) {
    const c = o.farbe ?? 0xE53935, g = group(T);
    for (let i = 0; i < 6; i++) g.add(mesh(T, cyl(T, 2.2 - (i + 1) * 0.07, 2.2 - i * 0.07, 2, 20), mat(T, i % 2 ? 0xFAFAFA : c), 0, 1 + i * 2, 0));
    g.add(mesh(T, new T.ConeGeometry(2.6, 2.2, 20), mat(T, 0x1E88E5), 0, 13.1, 0), mesh(T, cyl(T, 0.05, 0.05, 1, 6), mat(T, 0x6D4C41), 0, 14.4, 0), mesh(T, new T.ConeGeometry(0.3, 0.8, 3).rotateZ(-Math.PI / 2), mat(T, 0xFDD835), 0.4, 14.6, 0));
    return g;
  },
  // Torbogen am Eingang: zwei gestreifte Pfosten, Bogen mit Lämpchen, Schild
  torbogen(T, o) {
    const c = o.farbe ?? 0xE53935, g = group(T), licht = mat(T, 0xFFF59D, { emissive: 0xFFD54F, emissiveIntensity: 0.9 });
    for (const x of [-3.6, 3.6]) for (let i = 0; i < 6; i++) g.add(mesh(T, new T.BoxGeometry(0.8, 1, 0.8), mat(T, i % 2 ? 0xFAFAFA : c), x, 0.5 + i, 0));
    g.add(mesh(T, new T.TorusGeometry(3.6, 0.4, 10, 28, Math.PI), mat(T, 0x1E88E5), 0, 6, 0), mesh(T, new T.BoxGeometry(4.4, 1.2, 0.3), mat(T, 0xFDD835), 0, 7.6, 0));
    for (let i = 0; i <= 10; i++) { const a = i * Math.PI / 10; g.add(mesh(T, new T.SphereGeometry(0.2, 8, 6), licht, Math.cos(a) * 3.6, 6 + Math.sin(a) * 3.6, -0.45)); }
    return g;
  },
  // Zielscheibe der Schiessbude auf einem Ständer
  zielscheibe(T, o) {
    const g = group(T, mesh(T, new T.BoxGeometry(0.2, 2.2, 0.2), mat(T, 0x795548), 0, 1.1, 0.2), mesh(T, new T.BoxGeometry(1.6, 0.2, 1), mat(T, 0x795548), 0, 0.1, 0.2));
    [[1.5, 0xFAFAFA], [1.1, o.farbe ?? 0xE53935], [0.7, 0xFAFAFA], [0.3, o.farbe ?? 0xE53935]].forEach(([r, c], i) => g.add(mesh(T, cyl(T, r, r, 0.12, 28).rotateX(Math.PI / 2), mat(T, c), 0, 2.3, -i * 0.04)));
    return g;
  }
};

// Gegenstand bauen (unbekannte Form: Klotz als Platzhalter)
export function buildProp(T, form, opts = {}) {
  const f = PROPS[form];
  return f ? f(T, opts) : group(T, mesh(T, new T.BoxGeometry(2, 2, 2), mat(T, 0xFF00FF), 0, 1, 0));
}

// Werkzeuge der Welt Werkstatt liegen in einer eigenen Datei
Object.assign(PROPS, werkstattProps({ mat, mesh, group, cyl }));
Object.assign(PROP_SIZE, WERKSTATT_SIZE);
