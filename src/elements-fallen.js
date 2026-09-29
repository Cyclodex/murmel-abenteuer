// Fallen und Hindernisse für schwere Level: Feld mit Löchern, Falltür, Schieber, Hammer (quetscht),
// Treppe, Fluss, rollende Felsen. Gleiche Schnittstelle wie in elements.js.
import { DEG, quatYawPitch, rotate, add, sub, scale, lerp3, toLocal, fwdOf, rightOf, ease } from './math.js';
import { TYPES, segment, track, kinematicBody, driveTo, ballPos } from './elements.js';

const R = 0.5;
const norm = v => { const l = Math.hypot(...v) || 1; return scale(v, 1 / l); };
// Quaternionen multiplizieren (a danach b in lokalen Achsen)
const mulQ = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
];
// Drehung um die lokale Vorwärtsachse (z): positiv = rechte Seite nach oben
const quatRoll = a => [0, 0, Math.sin(a / 2), Math.cos(a / 2)];

// Zeichen im Feld -> Oberfläche ('' = normaler Boden)
const FELD = { '#': '', e: 'eis', s: 'schlamm', p: 'pfuetze', a: 'sand', o: 'seife', h: 'handtuch' };

// Zeitplan für Teile, die im Takt laufen (Hammer, Felsen): Phase 0..1 im Takt, mit Startverzögerung offset
export const phaseOf = (el, per) => (((el.t + (el.offset || 0)) % per) + per) % per / per;

export const FALLEN = {
  // Feld aus Zeichen: jede Zeile ist eine Reihe Kacheln, die unterste Zeile liegt bei at (Einfahrt), nach oben geht es vorwärts.
  // '#' Boden, '.' oder ' ' Loch, 'w' Mauerblock, e/s/p/a/o/h = Eis/Schlamm/Pfütze/Sand/Seife/Handtuch.
  // at = Mitte der vorderen Kante (Oberkante), cell = Kachelgrösse, walls = Rand links/rechts (Höhe), wallH = Höhe der Mauerblöcke.
  // {type:'feld', at, yaw?, cell?, map:[...], walls?, wallH?, look?}
  feld: {
    solids(d) {
      const yaw = (d.yaw || 0) * DEG, q = quatYawPitch(yaw, 0), F = fwdOf(yaw), Rt = rightOf(yaw);
      const c = d.cell ?? 2, rows = d.map, nr = rows.length, nc = Math.max(...rows.map(r => r.length)), th = d.thick ?? 1, wh = d.wallH ?? 1.2;
      const out = [], tr = { yaw, mid: add(d.at, scale(F, nr * c / 2)), right: Rt };
      for (let i = 0; i < nr; i++) {
        const row = rows[nr - 1 - i];
        for (let j = 0; j < nc;) {
          const ch = row[j] || ' ';
          let k = j;
          while (k + 1 < nc && (row[k + 1] || ' ') === ch) k++;
          const cx = ((j + k + 1) / 2 - nc / 2) * c, len = (k - j + 1) * c;
          const center = add(add(d.at, scale(Rt, cx)), scale(F, (i + 0.5) * c));
          if (ch === 'w') out.push({ pos: add(center, [0, wh / 2, 0]), half: [len / 2, wh / 2, c / 2], quat: q, look: 'wall' });
          else if (ch in FELD) {
            const surface = FELD[ch] || d.surface;
            out.push({ pos: add(center, [0, -th / 2, 0]), half: [len / 2, th / 2, c / 2], quat: q, look: surface || d.look || 'floor', surface, track: tr });
          }
          j = k + 1;
        }
      }
      if (d.walls) for (const k of [-1, 1]) {
        out.push({ pos: add(add(add(d.at, scale(Rt, k * (nc * c / 2 + 0.2))), scale(F, nr * c / 2)), [0, d.walls / 2, 0]), half: [0.2, d.walls / 2, nr * c / 2], quat: q, look: 'wall' });
      }
      return out;
    }
  },

  // Falltür: Klappe im Boden, die kurz nach dem Drauffahren nach unten aufklappt und später wieder zugeht.
  // at = Mitte (Oberkante), size = [breit, tief], yaw, delay = s bis sie aufgeht, offen = s bis sie wieder zu ist
  // {type:'falltuer', at, size?, yaw?, delay?, offen?}
  falltuer: {
    init(el, g) {
      const [b, t] = el.size || [3, 3];
      el.yw = (el.yaw || 0) * DEG; el.q0 = quatYawPitch(el.yw, 0);
      el.hinge = add(el.at, scale(rightOf(el.yw), -b / 2)); // Scharnier an der linken Kante
      el.body = kinematicBody(g, [{ half: [b / 2, 0.15, t / 2], off: [b / 2, -0.15, 0], look: 'falltuer' }]);
      el.body.position.set(...el.hinge);
      el.body.userData = { track: { yaw: el.yw, mid: el.at, right: rightOf(el.yw) } };
    },
    reset(el) { el.a = 0; el.state = 'zu'; el.t = 0; },
    pre(el, g, h) {
      if (el.state === 'zu' && el.a < 1e-3 && g.groundBody === el.body) { el.state = 'warnt'; el.t = 0; }
      const want = el.state === 'auf' ? 95 * DEG : 0, rate = (el.state === 'auf' ? 500 : 120) * DEG;
      const w = Math.max(-rate, Math.min(rate, (want - el.a) / h));
      el.body.quaternion.set(...mulQ(el.q0, quatRoll(-el.a))); // rechte Kante klappt nach unten
      el.body.angularVelocity.set(...scale(fwdOf(el.yw), w));
      el.a += w * h;
    },
    step(el, g, h, ev) {
      el.t += h;
      if (el.state === 'warnt' && el.t > (el.delay ?? 0.6)) { el.state = 'auf'; el.t = 0; ev.push('klapp'); }
      else if (el.state === 'auf' && el.t > (el.offen ?? 2.5)) { el.state = 'zu'; el.t = 0; }
    },
    view(el, v) {
      const b = v.bodyGroup(el.body);
      let t = 0;
      return { tick(dt) { b.tick(); t += dt; if (el.state === 'warnt') { b.grp.position.y += Math.sin(t * 70) * 0.06; b.grp.position.x += Math.cos(t * 55) * 0.04; } } }; // wackelt kurz vorher
    }
  },

  // Schieber: Klotz, der hin- und herfährt (wie die Plattform) und die Murmel vom Weg schiebt.
  // from/to = Mitte unten, size = [breit, hoch, tief], time = Fahrzeit, pause = Pause an den Enden, offset = Startverzögerung
  // {type:'schieber', from, to, size?, yaw?, time?, pause?, offset?, look?}
  schieber: {
    init(el, g) {
      const [b, hh, t] = el.size || [2, 1.2, 2];
      el.body = kinematicBody(g, [{ half: [b / 2, hh / 2, t / 2], off: [0, hh / 2, 0], look: el.look || 'schieber' }]);
      el.body.quaternion.set(...quatYawPitch((el.yaw || 0) * DEG, 0));
      el.body.userData = {};
      el.lastV = [0, 0, 0];
    },
    reset(el, g) { el.t = el.offset || 0; el.body.position.set(...TYPES.plattform.posAt(el, el.t)); el.body.velocity.set(0, 0, 0); el.lastV = [0, 0, 0]; },
    pre(el, g, h) { el.t += h; driveTo(el.body, TYPES.plattform.posAt(el, el.t), h); },
    view(el, v) { return v.bodyGroup(el.body); }
  },

  // Hammer: schwingt von der Seite auf den Weg. Ist die Murmel darunter, wird sie zerquetscht (zurück zum Checkpoint).
  // at = Aufschlagpunkt (Mitte, Oberkante des Wegs), yaw = Wegrichtung, side = 1: Stiel rechts, -1: links,
  // length = Drehpunkt bis Kopfmitte, size = Kopf [quer, hoch, längs], up/down = s oben warten / unten liegen, offset = Startverzögerung
  // {type:'hammer', at, yaw?, side?, length?, size?, up?, down?, offset?, farbe?}
  hammer: {
    init(el, g) {
      const [hb, hh, ht] = el.size || [2.4, 1.4, 1.6], L = el.length ?? 4, s = el.side ?? 1;
      el.yw = (el.yaw || 0) * DEG; el.q0 = quatYawPitch(el.yw, 0); el.s = s; el.L = L; el.hsize = [hb, hh, ht];
      el.pivot = add(add(el.at, scale(rightOf(el.yw), s * L)), [0, hh / 2, 0]);
      el.body = kinematicBody(g, [
        { half: [hb / 2, hh / 2, ht / 2], off: [-s * L, 0, 0], look: 'hammer-' + (el.farbe || 'rot') },
        { half: [(L - hb / 2) / 2, 0.14, 0.14], off: [-s * (L - hb / 2) / 2, 0, 0], look: 'stiel' }
      ]);
      el.body.position.set(...el.pivot);
      el.body.userData = {};
      const up = el.up ?? 1.5, down = el.down ?? 0.6;
      el.times = [up, 0.28, down, 1.1]; // oben, zuschlagen, unten, hochheben
      el.per = up + 0.28 + down + 1.1;
    },
    reset(el) { el.t = 0; el.a = TYPES.hammer.angleAt(el, 0); el.hit = false; },
    // Winkel zur Zeit t: 0 = unten auf dem Weg, 80° = oben
    angleAt(el, t) {
      const [up, slam, down, lift] = el.times, top = 80 * DEG;
      let u = phaseOf({ t, offset: el.offset }, el.per) * el.per;
      if (u < up) return top;
      if ((u -= up) < slam) { const k = u / slam; return top * (1 - k * k); }
      if ((u -= slam) < down) return 0;
      return top * ease((u - down) / lift);
    },
    pre(el, g, h) {
      el.t += h;
      const a1 = TYPES.hammer.angleAt(el, el.t), w = (a1 - el.a) / h;
      // Kopf liegt lokal bei -side * x: hochheben = um die lokale z-Achse um -side * Winkel drehen
      el.body.quaternion.set(...mulQ(el.q0, quatRoll(-el.s * el.a)));
      el.body.angularVelocity.set(...scale(fwdOf(el.yw), el.s * w)); // lokale z-Achse zeigt nach hinten
      // Schlägt der Kopf gerade auf, und die Murmel ist darunter: zerquetscht
      if (w < 0 && a1 < 25 * DEG && !g.squashT) {
        const [hb, hh, ht] = el.hsize, l = toLocal(ballPos(g), el.at, el.yw);
        if (Math.abs(l[0]) < hb / 2 + 0.25 && Math.abs(l[2]) < ht / 2 + 0.25 && l[1] < hh + R) g.squash();
      }
      el.a = a1;
    },
    view(el, v) {
      // Holzhammer: runder Kopf (Schlagfläche unten), Holzstiel, Pfosten am Drehpunkt
      const T = v.THREE, p = el.pivot, [hb, hh, ht] = el.hsize, L = el.L, s = el.s, grp = new T.Group();
      const COL = { rot: 0xE53935, blau: 0x1E88E5, gelb: 0xFDD835, gruen: 0x43A047, orange: 0xFB8C00, lila: 0x8E24AA };
      const headMat = new T.MeshPhongMaterial({ color: COL[el.farbe] ?? COL.rot, shininess: 60 }), ringMat = new T.MeshPhongMaterial({ color: 0x424242, shininess: 90 });
      const r = Math.min(hb, ht) / 2 + 0.1;
      const head = new T.Mesh(new T.CylinderGeometry(r, r, hh, 24), headMat); head.position.x = -s * L; head.castShadow = true;
      for (const y of [-hh / 2 + 0.12, hh / 2 - 0.12]) { const band = new T.Mesh(new T.CylinderGeometry(r + 0.05, r + 0.05, 0.18, 24), ringMat); band.position.set(-s * L, y, 0); grp.add(band); }
      const stiel = new T.Mesh(new T.CylinderGeometry(0.16, 0.2, L, 10), new T.MeshLambertMaterial({ color: 0x9C6B3C }));
      stiel.rotation.z = Math.PI / 2; stiel.position.x = -s * L / 2; grp.add(head, stiel); v.scene.add(grp);
      const post = new T.Mesh(new T.CylinderGeometry(0.25, 0.35, p[1] - el.at[1] + 1.5, 12), v.mats.pole);
      post.position.set(p[0], (p[1] + el.at[1] - 1.5) / 2, p[2]); v.scene.add(post);
      return { tick() { grp.position.copy(el.body.position); grp.quaternion.copy(el.body.quaternion); } };
    }
  },

  // Treppe: Stufen von from (oberste Stufe) nach to (unterste Stufe), Oberkanten. steps = Anzahl Stufen.
  // {type:'treppe', from, to, width?, steps?, walls?, look?}
  treppe: {
    solids(d) {
      const n = d.steps ?? 6, w = d.width ?? 4, s = segment([d.from[0], 0, d.from[2]], [d.to[0], 0, d.to[2]]);
      const len = s.L / n, bottom = Math.min(d.from[1], d.to[1]) - 1, q = quatYawPitch(s.yaw, 0), F = fwdOf(s.yaw), out = [];
      for (let i = 0; i < n; i++) {
        const top = d.from[1] + (d.to[1] - d.from[1]) * (n > 1 ? i / (n - 1) : 0), hh = top - bottom;
        const c = add([d.from[0], 0, d.from[2]], scale(F, (i + 0.5) * len));
        const mid = [c[0], top, c[2]];
        out.push({ pos: [c[0], bottom + hh / 2, c[2]], half: [w / 2, hh / 2, len / 2 + 0.01], quat: q, look: d.look || 'treppe', track: { yaw: s.yaw, mid, right: s.right } });
        if (d.walls) for (const k of [-1, 1]) out.push({ pos: add(add(mid, scale(s.right, k * (w / 2 + 0.2))), [0, d.walls / 2, 0]), half: [0.2, d.walls / 2, len / 2 + 0.01], quat: q, look: 'wall' });
      }
      return out;
    }
  },

  // Fluss: Rinne mit Wasser, die Strömung trägt die Murmel mit (auch bergab). from/to = Wasseroberfläche (Mitte),
  // width, depth = Wassertiefe, speed = Strömung m/s, banks = Ufer über dem Wasser
  // {type:'fluss', from, to, width?, depth?, speed?, banks?}
  fluss: {
    solids(d) {
      const dp = d.depth ?? 0.7, down = [0, -dp, 0];
      const out = TYPES.weg.solids({ from: add(d.from, down), to: add(d.to, down), width: d.width ?? 4, walls: dp + (d.banks ?? 0.5), look: 'flussbett' });
      for (const o of out.slice(1)) o.look = 'ufer';
      return out;
    },
    init(el) { el.seg = segment(el.from, el.to); el.dir = norm(sub(el.to, el.from)); },
    step(el, g, h) {
      const s = el.seg, p = ballPos(g), rel = sub(p, s.mid);
      const along = rel[0] * el.dir[0] + rel[1] * el.dir[1] + rel[2] * el.dir[2], side = rel[0] * s.right[0] + rel[2] * s.right[2];
      const up = rel[0] * s.up[0] + rel[1] * s.up[1] + rel[2] * s.up[2];
      if (Math.abs(along) > s.L / 2 || Math.abs(side) > (el.width ?? 4) / 2 || up > R + 0.1 || up < -(el.depth ?? 0.7) - 0.5) return;
      const v = g.ball.velocity, sp = el.speed ?? 3, va = v.x * el.dir[0] + v.y * el.dir[1] + v.z * el.dir[2], k = Math.min(1, 2.5 * h);
      const dv = (sp - va) * k;
      v.x += el.dir[0] * dv; v.y += el.dir[1] * dv; v.z += el.dir[2] * dv;
      // seitlich bremst das Wasser, Auftrieb hält die Murmel oben
      const vs = v.x * s.right[0] + v.z * s.right[2], f = Math.min(1, 1.5 * h);
      v.x -= s.right[0] * vs * f; v.z -= s.right[2] * vs * f;
      v.y += g.G * 0.35 * h;
      g.washK += 2;
    },
    view(el, v) {
      const T = v.THREE, w = el.width ?? 4, s = el.seg;
      const tex = v.canvasTex(64, 64, (x, W, H) => {
        x.fillStyle = '#3FA3E6'; x.fillRect(0, 0, W, H);
        x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 2;
        for (let i = 0; i < 6; i++) { const y = i * 11 + 3; x.beginPath(); x.moveTo(8 + (i % 2) * 20, y); x.quadraticCurveTo(24 + (i % 2) * 20, y + 5, 40 + (i % 2) * 20, y); x.stroke(); }
      });
      tex.repeat.set(Math.max(1, Math.round(w / 2)), s.L / 2);
      const m = new T.Mesh(new T.PlaneGeometry(w, s.L), new T.MeshPhongMaterial({ map: tex, transparent: true, opacity: 0.7, shininess: 90, depthWrite: false }));
      m.quaternion.set(...s.q); m.rotateX(-Math.PI / 2);
      m.position.set(...add(s.mid, scale(s.up, -0.1))); v.scene.add(m);
      return { tick(dt) { tex.offset.y = (tex.offset.y - dt * (el.speed ?? 3) / 2) % 1; } };
    }
  },

  // Nagelwand: senkrechte Wand mit vielen Nägeln. Die Murmel rollt oben hinein, fällt senkrecht und prallt von Nagel zu Nagel.
  // Vorne Glas (durchsichtig), unten offen: dort einen Weg quer darunter legen, auf dem es weitergeht.
  // at = Mitte der oberen Vorderkante (Höhe des Wegs, der hineinführt), yaw = Fahrtrichtung, breite, hoehe,
  // abstand = Nagelabstand, tiefe = Spalt für die Murmel
  // {type:'nagelbrett', at, yaw?, breite?, hoehe?, abstand?, tiefe?}
  nagelbrett: {
    geo(d) {
      const yaw = (d.yaw || 0) * DEG, F = fwdOf(yaw), Rt = rightOf(yaw), W = d.breite ?? 10, H = d.hoehe ?? 14, gap = d.tiefe ?? 1.3;
      return { yaw, q: quatYawPitch(yaw, 0), F, Rt, W, H, gap, C: add(d.at, scale(F, gap / 2)), bottom: d.at[1] - H };
    },
    solids(d) {
      const { q, F, Rt, W, H, gap, C, bottom } = FALLEN.nagelbrett.geo(d), top = d.at[1], open = 1.4; // unten offen zum Hinausrollen
      const wall = (off, y0, y1, half, look, extra = {}) => ({ pos: add(add(C, scale(F, off)), [0, (y0 + y1) / 2 - C[1], 0]), half: [half[0], (y1 - y0) / 2, half[1]], quat: q, look, ...extra });
      return [
        wall(gap / 2 + 0.15, bottom + open, top + 2.5, [W / 2 + 0.3, 0.15], 'nagelwand'),
        wall(-gap / 2 - 0.1, bottom + open, top, [W / 2 + 0.3, 0.1], 'glas', { clear: true }),
        ...[-1, 1].map(k => ({ pos: add(add(C, scale(Rt, k * (W / 2 + 0.15))), [0, (bottom + top + 2.5) / 2 - C[1], 0]), half: [0.15, (top + 2.5 - bottom) / 2, gap / 2 + 0.25], quat: q, look: 'wall' }))
      ];
    },
    init(el, g) {
      const C0 = g.C, { Rt, W, H, C, bottom } = FALLEN.nagelbrett.geo(el), a = el.abstand ?? 1.7, top = el.at[1];
      const body = new C0.Body({ mass: 0, material: g.matFor('nagel') });
      el.pins = [];
      for (let r = 0, y = top - 1.8; y > bottom + 2.4; r++, y -= a * 0.8) {
        // symmetrisch zur Mitte, versetzt; zur Seitenwand bleibt mehr Platz als die Murmel breit ist (sonst klemmt sie)
        const lim = W / 2 - 1.35, x0 = r % 2 ? a / 2 : 0, k0 = Math.floor((lim + x0) / a);
        for (let x = x0 - k0 * a; x <= lim + 1e-6; x += a) {
          // wie von Hand eingeschlagen: leicht versetzt, damit die Murmel nie genau auf einer Nagelspitze balanciert
          const j = Math.sin((x + 3.7) * 12.9898 + y * 78.233) * 43758.5453, jit = (j - Math.floor(j) - 0.5) * 0.3;
          const p = add(add(C, scale(Rt, x + jit)), [0, y - C[1], 0]);
          body.addShape(new C0.Sphere(0.2), new C0.Vec3(p[0] - C[0], p[1] - C[1], p[2] - C[2]));
          el.pins.push(p);
        }
      }
      body.position.set(...C);
      body.collisionFilterGroup = 1; body.collisionFilterMask = 2 | 4; body.userData = {};
      g.world.addBody(body);
    },
    view(el, v) {
      // Nägel: Schaft quer durch den Spalt, runder Kopf vorne
      const T = v.THREE, { yaw, F, gap } = FALLEN.nagelbrett.geo(el), n = el.pins.length;
      const shaft = new T.InstancedMesh(new T.CylinderGeometry(0.13, 0.13, gap + 0.3, 8).rotateX(Math.PI / 2), new T.MeshPhongMaterial({ color: 0xB0B7C0, shininess: 120 }), n);
      const head = new T.InstancedMesh(new T.CylinderGeometry(0.3, 0.3, 0.08, 16).rotateX(Math.PI / 2), new T.MeshPhongMaterial({ color: 0xD7DCE2, shininess: 160 }), n);
      const m = new T.Matrix4(), q = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw), one = new T.Vector3(1, 1, 1), p = new T.Vector3();
      el.pins.forEach((pin, i) => {
        shaft.setMatrixAt(i, m.compose(p.set(...pin), q, one));
        head.setMatrixAt(i, m.compose(p.set(...add(pin, scale(F, -gap / 2 - 0.2))), q, one));
      });
      v.scene.add(shaft, head);
    }
  },

  // Rollende Felsen: kommen alle `every` Sekunden bei from herunter und rollen in Richtung dir (bergab).
  // dir = Richtung [x, z] (Standard vorwärts -z), speed = Anfangstempo, r = Grösse
  // {type:'felsen', from, dir?:[x,z], speed?, every?, r?, offset?}
  felsen: {
    init(el, g) {
      const C = g.C, r = el.r ?? 0.9;
      el.body = new C.Body({ mass: 4, material: g.matFor('normal'), shape: new C.Sphere(r), linearDamping: 0.05, angularDamping: 0.1 });
      el.body.collisionFilterGroup = 4; el.body.collisionFilterMask = 1 | 2 | 4;
      el.body.userData = {};
      g.world.addBody(el.body);
      el.per = el.every ?? 5;
    },
    reset(el) { el.t = 0; el.k = -1; TYPES.felsen.park(el); },
    park(el) { el.body.position.set(el.from[0], el.from[1] - 200, el.from[2]); el.body.velocity.set(0, 0, 0); el.body.angularVelocity.set(0, 0, 0); el.body.type = 4; /* KINEMATIC: parken */ },
    // wie Dominos: Kippen gilt nur für die Murmel
    pre(el, g) {
      const b = el.body, gr = g.world.gravity;
      if (b.type === 1) { b.force.x -= b.mass * gr.x; b.force.y += b.mass * (-gr.y - g.gy); b.force.z -= b.mass * gr.z; }
    },
    step(el, g, h, ev) {
      el.t += h;
      const k = Math.floor((el.t + (el.offset || 0)) / el.per);
      if (k !== el.k) { // neuer Felsen
        el.k = k;
        const b = el.body, dir = el.dir || [0, -1], d = norm([dir[0], 0, dir[1]]), sp = el.speed ?? 3;
        b.type = 1; b.position.set(el.from[0], el.from[1] + (el.r ?? 0.9), el.from[2]);
        b.velocity.set(d[0] * sp, 0, d[2] * sp); b.angularVelocity.set(0, 0, 0); b.wakeUp && b.wakeUp();
        ev.push('rumpel');
      }
      if (el.body.position.y < (g.level.killY ?? -8)) TYPES.felsen.park(el);
    },
    view(el, v) {
      const T = v.THREE, m = new T.Mesh(new T.DodecahedronGeometry(el.r ?? 0.9, 1), new T.MeshLambertMaterial({ color: 0x8A7F72, flatShading: true }));
      m.castShadow = true; v.scene.add(m);
      return { tick() { m.position.copy(el.body.position); m.quaternion.copy(el.body.quaternion); } };
    }
  }
};
