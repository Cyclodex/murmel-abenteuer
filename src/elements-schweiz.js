// Bauteile der Welt Schweiz: Zahnrad (drehende Scheibe zum Mitfahren) und Pendel (schwingt quer über den Weg).
// Gleiche Schnittstelle wie in elements.js.
import { DEG, quatYawPitch, add, scale, fwdOf, rightOf, mulQ } from './math.js';
import { phaseOf } from './elements-fallen.js';

const TAU = Math.PI * 2;
// Drehung um die lokale Vorwärtsachse (z): positiv = nach rechts ausschwingen
const quatRoll = a => [0, 0, Math.sin(a / 2), Math.cos(a / 2)];
const MESSING = 0x9A7B2A;

export const SCHWEIZ = {
  // Zahnrad: liegende Scheibe, die sich dreht und die Murmel mitnimmt (wer stillhält, fährt im Kreis mit).
  // at = Mitte (Oberkante), r = Radius bis zu den Zahnspitzen, speed = °/s (positiv = von oben gesehen gegen den Uhrzeigersinn),
  // nabe = Radius der Achse in der Mitte (Hindernis, 0 = keine), dick = Dicke, zaehne = Anzahl Zähne (nur Grafik), farbe.
  // Autopilot: wait: ['nahe', [x, z, r]] = mitfahren, bis die Murmel dort ist; Takt (phase) = eine Umdrehung.
  // {type:'zahnrad', at, r?, speed?, nabe?, dick?, zaehne?, yaw?, farbe?, surface?}
  zahnrad: {
    N: 8, // Scheibe = 16-Eck aus 8 gedrehten Klötzen
    init(el, g) {
      const C = g.C, r = el.r ?? 4, th = el.dick ?? 0.6, n = SCHWEIZ.zahnrad.N, nabe = el.nabe ?? 0.7;
      const body = new C.Body({ mass: 0, type: C.Body.KINEMATIC, material: g.matFor(el.surface) });
      const box = (half, off, yaw) => body.addShape(new C.Box(new C.Vec3(...half)), new C.Vec3(...off), new C.Quaternion(...quatYawPitch(yaw, 0)));
      for (let k = 0; k < n; k++) box([r * Math.cos(Math.PI / (2 * n)), th / 2, r * Math.sin(Math.PI / (2 * n))], [0, -th / 2, 0], k * Math.PI / n);
      if (nabe > 0) for (const k of [0, 1]) box([nabe * 0.9, 0.6, nabe * 0.9], [0, 0.6, 0], k * Math.PI / 4);
      body.collisionFilterGroup = 1; body.collisionFilterMask = 2 | 4;
      body.position.set(...el.at);
      body.userData = { surface: el.surface, dreht: true };
      g.world.addBody(body);
      el.body = body; el.per = 360 / Math.abs(el.speed ?? 30);
    },
    reset(el) { el.a = (el.yaw || 0) * DEG; el.t = 0; },
    pre(el, g, h) {
      const w = (el.speed ?? 30) * DEG, d = w * h;
      el.t += h;
      el.body.quaternion.set(...quatYawPitch(el.a, 0));
      el.body.angularVelocity.set(0, w, 0);
      // Murmel mitnehmen: ihr Tempo relativ zur Scheibe dreht sich mit, dazu das Tempo der Scheibe unter ihr
      // (auf halbem Weg des Schritts, so bleibt eine ruhende Murmel genau auf ihrem Kreis)
      if (g.groundBody === el.body && !g.lock) {
        const b = g.ball, v = b.velocity, rx = b.position.x - el.at[0], rz = b.position.z - el.at[2];
        const ux = v.x - w * rz, uz = v.z + w * rx, c = Math.cos(d), s = Math.sin(d), c2 = Math.cos(d / 2), s2 = Math.sin(d / 2);
        const rx1 = rx * c2 + rz * s2, rz1 = -rx * s2 + rz * c2;
        v.x = ux * c + uz * s + w * rz1; v.z = -ux * s + uz * c - w * rx1;
      }
      el.a += d;
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 4, th = el.dick ?? 0.6, nabe = el.nabe ?? 0.7, n = el.zaehne ?? Math.max(8, Math.round(TAU * r / 1.3));
      const col = el.farbe ?? MESSING, m = new T.MeshPhongMaterial({ color: col, shininess: 60, specular: 0x333322 });
      const dunkel = new T.MeshPhongMaterial({ color: new T.Color(col).multiplyScalar(0.55), shininess: 60 });
      const grp = new T.Group(), ri = r - 0.55;
      const scheibe = new T.Mesh(new T.CylinderGeometry(ri, ri, th, 48), m); scheibe.position.y = -th / 2; scheibe.receiveShadow = true; grp.add(scheibe);
      const zahn = new T.BoxGeometry(0.75, th, TAU * r / n * 0.55);
      for (let i = 0; i < n; i++) {
        const a = i * TAU / n, z = new T.Mesh(zahn, m);
        z.position.set(Math.cos(a) * (r - 0.3), -th / 2, Math.sin(a) * (r - 0.3)); z.rotation.y = -a; z.receiveShadow = true; grp.add(z);
      }
      // Speichen-Löcher und ein Ring oben: daran sieht man die Drehung
      const k = Math.max(3, Math.min(6, Math.round(r))), rl = (ri + nabe) / 2, loch = new T.CircleGeometry(Math.min((ri - nabe) * 0.3, rl * Math.sin(Math.PI / k) * 0.7), 20);
      for (let i = 0; i < k; i++) {
        const a = (i + 0.5) * TAU / k, o = new T.Mesh(loch, dunkel);
        o.rotation.x = -Math.PI / 2; o.position.set(Math.cos(a) * rl, 0.012, Math.sin(a) * rl); grp.add(o);
      }
      const ring = new T.Mesh(new T.RingGeometry(ri - 0.18, ri - 0.06, 48), dunkel); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.012; grp.add(ring);
      if (nabe > 0) {
        const achse = new T.Mesh(new T.CylinderGeometry(nabe * 0.95, nabe * 1.05, 1.2, 8), dunkel); achse.position.y = 0.6; achse.castShadow = true; grp.add(achse);
        const kopf = new T.Mesh(new T.CylinderGeometry(nabe * 0.5, nabe * 0.5, 0.25, 6), m); kopf.position.y = 1.3; grp.add(kopf);
      }
      v.scene.add(grp);
      // Welle nach unten (das Rad schwebt nicht)
      const welle = new T.Mesh(new T.CylinderGeometry(0.45, 0.45, 30, 12), v.mats.pole); welle.position.set(el.at[0], el.at[1] - th - 15, el.at[2]); v.scene.add(welle);
      return { tick() { grp.position.copy(el.body.position); grp.quaternion.copy(el.body.quaternion); } };
    }
  },

  // Pendel: hängt über dem Weg und schwingt quer darüber. Trifft die Kugel die Murmel, stösst sie sie weg.
  // at = Punkt auf dem Weg unter dem Aufhängepunkt (Oberkante), yaw = Wegrichtung, length = Stange (Aufhängung bis Kugelmitte),
  // winkel = Ausschlag je Seite (Grad), time = s für einmal hin und her, offset = Startverzögerung, r = Radius der Kugel,
  // luft = Abstand der Kugel zum Weg am tiefsten Punkt.
  // Takt (Autopilot phase): 0 = unten in der Mitte (schwingt nach rechts), 0.25 = ganz rechts, 0.5 = wieder Mitte, 0.75 = ganz links.
  // {type:'pendel', at, yaw?, length?, winkel?, time?, offset?, r?, luft?, farbe?}
  pendel: {
    init(el, g) {
      const C = g.C, r = el.r ?? 0.9, L = el.length ?? 6;
      el.yw = (el.yaw || 0) * DEG; el.q0 = quatYawPitch(el.yw, 0);
      el.pivot = add(el.at, [0, (el.luft ?? 0.15) + r + L, 0]);
      const body = new C.Body({ mass: 0, type: C.Body.KINEMATIC, material: g.matFor('normal') });
      body.addShape(new C.Sphere(r), new C.Vec3(0, -L, 0));
      body.collisionFilterGroup = 1; body.collisionFilterMask = 2 | 4;
      body.position.set(...el.pivot); body.userData = {};
      g.world.addBody(body);
      el.body = body; el.per = el.time ?? 4;
    },
    reset(el) { el.t = 0; el.a = SCHWEIZ.pendel.angleAt(el, 0); },
    angleAt: (el, t) => (el.winkel ?? 45) * DEG * Math.sin(TAU * phaseOf({ t, offset: el.offset }, el.per)),
    pre(el, g, h) {
      el.t += h;
      const a1 = SCHWEIZ.pendel.angleAt(el, el.t), w = (a1 - el.a) / h;
      el.body.quaternion.set(...mulQ(el.q0, quatRoll(el.a)));
      el.body.angularVelocity.set(...scale(fwdOf(el.yw), -w)); // lokale z-Achse zeigt nach hinten
      el.a = a1;
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 0.9, L = el.length ?? 6, p = el.pivot, grp = new T.Group();
      const m = new T.MeshPhongMaterial({ color: el.farbe ?? MESSING, shininess: 130, specular: 0x999966 });
      const stange = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, L, 8), v.mats.pole); stange.position.y = -L / 2;
      const kugel = new T.Mesh(new T.SphereGeometry(r, 24, 16), m); kugel.position.y = -L; kugel.castShadow = true;
      const reif = new T.Mesh(new T.TorusGeometry(r + 0.03, 0.07, 8, 32), v.mats.pole); reif.position.y = -L;
      grp.add(stange, kugel, reif); v.scene.add(grp);
      // Gestell: zwei Pfosten ausserhalb des Ausschlags und ein Querbalken
      const out = L * Math.sin((el.winkel ?? 45) * DEG) + r + 0.8, Rt = rightOf(el.yw), fuss = (v.game.level.killY ?? -8) - 1, hoch = p[1] + 0.4 - fuss;
      const holz = new T.MeshLambertMaterial({ color: 0x6D4C33 });
      for (const k of [-1, 1]) {
        const pf = new T.Mesh(new T.BoxGeometry(0.5, hoch, 0.5), holz);
        pf.position.set(p[0] + Rt[0] * k * out, fuss + hoch / 2, p[2] + Rt[2] * k * out); pf.rotation.y = el.yw; v.scene.add(pf);
      }
      const balken = new T.Mesh(new T.BoxGeometry(2 * out + 0.5, 0.5, 0.5), holz); balken.position.set(p[0], p[1] + 0.15, p[2]); balken.rotation.y = el.yw; v.scene.add(balken);
      return { tick() { grp.position.copy(el.body.position); grp.quaternion.copy(el.body.quaternion); } };
    }
  }
};
