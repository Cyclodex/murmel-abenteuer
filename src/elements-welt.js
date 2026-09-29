// Echte Dinge aus der Umgebung: Schüssel (Pfanne, Topf, Lavabo, Badewanne-Becken), Deko-Gegenstände,
// Herdplatte, Rasensprenger. Gleiche Schnittstelle wie in elements.js.
import { DEG, quatYawPitch, add, scale, fwdOf, yawOf } from './math.js';
import { segment } from './elements.js';
import { buildProp, PROP_SIZE } from './props.js';

const R = 0.5;

// Aussehen der Schüsseln: innen, Rand/aussen
const BOWL = {
  pfanne: { inner: 0x2B2B30, outer: 0x9EA4AD, shine: 60 },
  topf: { inner: 0xC9CED6, outer: 0xB7BDC6, shine: 130 },
  lavabo: { inner: 0xF7F9FB, outer: 0xFFFFFF, shine: 110 },
  schuessel: { inner: 0xFFF3E0, outer: 0x4FC3F7, shine: 70 },
  sandkuchen: { inner: 0xE6C27A, outer: 0xD9B56C, shine: 5 }
};

// Richtung eines Segments (Winkel a in der x/z-Ebene)
const dirOf = a => [Math.cos(a), 0, Math.sin(a)];

export const WELT = {
  // Schüssel: runder Boden, schräge Wand, flacher Rand (und aussen eine Wand bis zum Boden).
  // at = Mitte des Bodens (Oberkante), r = Bodenradius, R = Radius oben, h = Randhöhe, rim = Randbreite,
  // art = 'pfanne' | 'topf' | 'lavabo' | 'schuessel' | 'sandkuchen', offen = Liste von yaw (Grad): dort ist eine Lücke
  // (z. B. für eine Rampe hinein/hinaus), luecke = Breite der Lücke, aussen:false = keine Aussenwand (z. B. in einer Ablage),
  // griff = yaw des Pfannenstiels, hahn = yaw des Wasserhahns (Lavabo), abfluss:true = Abfluss in der Mitte zeigen
  // (dazu eine roehre mit down:true bei at legen). surface = Oberfläche innen.
  // {type:'schuessel', at, r?, R?, h?, rim?, art?, offen?, luecke?, aussen?, griff?, hahn?, abfluss?, surface?}
  schuessel: {
    segs(d) {
      const n = d.n ?? 32, Rr = d.R ?? 4, gap = (d.luecke ?? 2.6) / 2 / Rr;
      const gaps = (d.offen || []).map(y => { const f = fwdOf(y * DEG); return Math.atan2(f[2], f[0]); });
      const out = [];
      for (let k = 0; k < n; k++) {
        const a = (k + 0.5) * 2 * Math.PI / n;
        const open = gaps.some(ga => Math.abs(Math.atan2(Math.sin(a - ga), Math.cos(a - ga))) < gap + Math.PI / n);
        out.push({ k, a, open });
      }
      return { n, list: out };
    },
    solids(d) {
      const r = d.r ?? 2, Rr = d.R ?? 4, h = d.h ?? 1.2, rim = d.rim ?? 0.5, th = 0.4, c = d.at, out = [];
      const { n, list } = WELT.schuessel.segs(d), surface = d.surface;
      out.push({ pos: add(c, [0, -0.5, 0]), half: [r, 0.5, r], quat: [0, 0, 0, 1], look: 'floor', surface, hide: true });
      for (const { a, open } of list) {
        if (open) continue;
        const u = dirOf(a), s = segment(add(c, scale(u, r - 0.05)), add(add(c, scale(u, Rr)), [0, h, 0]));
        const wid = 2 * Rr * Math.sin(Math.PI / n) + 0.1;
        out.push({ pos: add(s.mid, scale(s.up, -th / 2)), half: [wid / 2, th / 2, s.L / 2 + 0.05], quat: s.q, look: 'floor', surface, hide: true });
        const q = quatYawPitch(yawOf(u[0], u[2]), 0), wr = 2 * (Rr + rim) * Math.sin(Math.PI / n) + 0.1;
        if (rim > 0) out.push({ pos: add(add(c, scale(u, Rr + rim / 2)), [0, h - th / 2, 0]), half: [wr / 2, th / 2, rim / 2 + 0.02], quat: q, look: 'floor', hide: true });
        if (d.aussen !== false) out.push({ pos: add(add(c, scale(u, Rr + rim - 0.15)), [0, (h - th) / 2 - 0.5, 0]), half: [wr / 2, (h - th) / 2 + 0.5, 0.15], quat: q, look: 'wall', hide: true });
      }
      return out;
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 2, Rr = el.R ?? 4, h = el.h ?? 1.2, rim = el.rim ?? 0.5, c = el.at, st = BOWL[el.art] || BOWL.schuessel;
      const V2 = (x, y) => new T.Vector2(x, y);
      const prof = [V2(0.01, 0), V2(r, 0), V2(Rr, h), V2(Rr + rim, h)];
      if (el.aussen !== false) prof.push(V2(Rr + rim, -0.02));
      const inner = new T.MeshPhongMaterial({ color: st.inner, shininess: st.shine, side: T.DoubleSide, specular: 0x666666 });
      const { n, list } = WELT.schuessel.segs(el), grp = new T.Group();
      // zusammenhängende Bögen ohne Lücke als Drehkörper
      let start = null;
      const flush = end => {
        if (start === null) return;
        const a0 = start * 2 * Math.PI / n, a1 = end * 2 * Math.PI / n;
        const m = new T.Mesh(new T.LatheGeometry(prof, Math.max(2, end - start) * 2, Math.PI / 2 - a1, a1 - a0), inner);
        m.receiveShadow = true; grp.add(m); start = null;
      };
      list.forEach(({ k, open }) => { if (!open && start === null) start = k; if (open) flush(k); });
      flush(n);
      if (list.some(s => s.open)) { // Boden als Scheibe, falls Lücken den Drehkörper unterbrechen
        const floor = new T.Mesh(new T.CircleGeometry(r, 32), inner); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01; grp.add(floor);
      }
      const outerMat = new T.MeshPhongMaterial({ color: st.outer, shininess: st.shine });
      if (el.art === 'pfanne') { // Stiel
        const f = fwdOf((el.griff ?? 90) * DEG), L = 7;
        const stiel = new T.Mesh(new T.BoxGeometry(0.9, 0.5, L), new T.MeshPhongMaterial({ color: 0x1B1B1F, shininess: 30 }));
        stiel.position.set(...add(scale(f, Rr + rim + L / 2 - 0.2), [0, h - 0.1, 0])); stiel.rotation.y = (el.griff ?? 90) * DEG; grp.add(stiel);
        const rimRing = new T.Mesh(new T.TorusGeometry(Rr + rim, 0.12, 8, 48), outerMat); rimRing.rotation.x = Math.PI / 2; rimRing.position.y = h; grp.add(rimRing);
      }
      if (el.art === 'topf') for (const s of [-1, 1]) { // Henkel
        const f = fwdOf(((el.griff ?? 90) + (s < 0 ? 180 : 0)) * DEG);
        const ear = new T.Mesh(new T.TorusGeometry(0.7, 0.18, 8, 16, Math.PI), outerMat);
        ear.position.set(...add(scale(f, Rr + rim + 0.1), [0, h - 0.4, 0])); ear.rotation.y = (el.griff ?? 90) * DEG + Math.PI / 2; grp.add(ear);
      }
      if (el.hahn !== undefined) { // Wasserhahn am Rand
        const f = fwdOf(el.hahn * DEG), chrome = new T.MeshPhongMaterial({ color: 0xD7DCE2, shininess: 160, specular: 0xffffff });
        const post = new T.Mesh(new T.CylinderGeometry(0.35, 0.45, 3, 16), chrome); post.position.set(...add(scale(f, Rr + rim * 0.6), [0, h + 1.5, 0]));
        const spout = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 2.4, 14), chrome); spout.rotation.x = Math.PI / 2; spout.rotation.y = el.hahn * DEG;
        spout.position.set(...add(scale(f, Rr + rim * 0.6 - 1.1), [0, h + 3, 0]));
        grp.add(post, spout);
      }
      if (el.abfluss) { // Abfluss mit Gitter
        const drain = new T.Mesh(new T.CircleGeometry(0.75, 24), new T.MeshPhongMaterial({ color: 0x9EA4AD, shininess: 140 }));
        drain.rotation.x = -Math.PI / 2; drain.position.y = 0.03; grp.add(drain);
        const hole = new T.Mesh(new T.RingGeometry(0.15, 0.6, 24, 1), new T.MeshBasicMaterial({ color: 0x222222 }));
        hole.rotation.x = -Math.PI / 2; hole.position.y = 0.04; grp.add(hole);
      }
      grp.position.set(...c); v.scene.add(grp);
    }
  },

  // Deko: grosser Gegenstand aus src/props.js (Apfel, Tasse, Toaster, Ente, Zwerg, Sandburg ...).
  // fest:true = man kann nicht hindurch (Kollisions-Klotz in ungefährer Grösse), scale = Grösse, dreh = °/s drehen
  // {type:'deko', form, at, yaw?, scale?, farbe?, fest?, dreh?}
  deko: {
    solids(d) {
      if (!d.fest) return [];
      const s = d.scale ?? 1, size = (PROP_SIZE[d.form] || [2, 2, 2]).map(x => x * s);
      return [{ pos: add(d.at, [0, size[1] / 2, 0]), half: scale(size, 0.5), quat: quatYawPitch((d.yaw || 0) * DEG, 0), look: 'wall', hide: true }];
    },
    view(el, v) {
      const g = buildProp(v.THREE, el.form, el);
      g.scale.setScalar(el.scale ?? 1); g.position.set(...el.at); g.rotation.y = (el.yaw || 0) * DEG;
      v.scene.add(g);
      if (el.dreh) return { tick(dt) { g.rotation.y += dt * el.dreh * DEG; } };
    }
  },

  // Herdplatte: glüht; wer darauf rollt, hüpft wie auf heissem Blech. Liegt auf einem Weg.
  // {type:'herdplatte', at, r?, jump?}
  herdplatte: {
    reset(el) { el.cool = 0; el.hot = 0; },
    step(el, g, h, ev) {
      el.cool -= h; el.hot = Math.max(0, el.hot - h);
      const p = g.ball.position;
      if (el.cool <= 0 && g.groundBody && Math.hypot(p.x - el.at[0], p.z - el.at[2]) < (el.r ?? 2) && Math.abs(p.y - el.at[1] - R) < 0.3) {
        g.ball.velocity.y = el.jump ?? 4; el.cool = 0.45; el.hot = 0.3; ev.push('zisch');
      }
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 2, grp = new T.Group();
      grp.add(new T.Mesh(new T.CylinderGeometry(r, r, 0.08, 40), new T.MeshPhongMaterial({ color: 0x1A1A1A, shininess: 80 })));
      const glow = new T.MeshPhongMaterial({ color: 0x7A1A0A, emissive: 0xFF3D00, emissiveIntensity: 0.6 });
      for (let i = 1; i <= 3; i++) { const ring = new T.Mesh(new T.TorusGeometry(r * i / 3.6, 0.07, 6, 40), glow); ring.rotation.x = Math.PI / 2; ring.position.y = 0.06; grp.add(ring); }
      grp.position.set(el.at[0], el.at[1] + 0.04, el.at[2]); v.scene.add(grp);
      let t = 0;
      return { tick(dt) { t += dt; glow.emissiveIntensity = 0.5 + 0.25 * Math.sin(t * 4) + el.hot * 2; } };
    }
  },

  // Rasensprenger: dreht sich, zwei Wasserstrahlen schieben die Murmel nach aussen weg.
  // at = Boden in der Mitte, length = Reichweite beider Strahlen zusammen, speed = °/s, strength = Schub m/s², breite = Strahlbreite
  // (Autopilot: Wartebedingung balkenWeg gilt auch für den Sprenger)
  // {type:'sprenger', at, length?, speed?, strength?, breite?, yaw?}
  sprenger: {
    reset(el) { el.a = (el.yaw || 0) * DEG; },
    pre(el, g, h) { el.a += (el.speed ?? 60) * DEG * h; },
    step(el, g, h, ev) {
      const p = g.ball.position, dx = p.x - el.at[0], dz = p.z - el.at[2], d = [Math.cos(el.a), -Math.sin(el.a)]; // Achse wie beim Balken
      const along = dx * d[0] + dz * d[1], perp = -dx * d[1] + dz * d[0], L = (el.length ?? 8) / 2;
      if (Math.abs(perp) < (el.breite ?? 1.2) / 2 + R && Math.abs(along) < L && Math.abs(along) > 0.6 && p.y - el.at[1] < 2.5) {
        const s = Math.sign(along) * (el.strength ?? 10) * h;
        g.ball.velocity.x += d[0] * s; g.ball.velocity.z += d[1] * s; g.washK += 6;
        if (!el.wet) ev.push('spritz');
        el.wet = 0.3;
      }
      el.wet = Math.max(0, (el.wet || 0) - h);
    },
    view(el, v) {
      const T = v.THREE, L = (el.length ?? 8) / 2, grp = new T.Group(), arm = new T.Group();
      const yellow = new T.MeshPhongMaterial({ color: 0xFDD835, shininess: 60 });
      grp.add(new T.Mesh(new T.CylinderGeometry(0.6, 0.9, 0.5, 16), new T.MeshPhongMaterial({ color: 0x2E9E48 })));
      const bar = new T.Mesh(new T.BoxGeometry(2.4, 0.25, 0.3), yellow); bar.position.y = 0.6; arm.add(bar);
      const drops = [], dropMat = new T.MeshBasicMaterial({ color: 0x6EC6FF, transparent: true, opacity: 0.8 }), dg = new T.SphereGeometry(0.13, 6, 4);
      for (let i = 0; i < 28; i++) { const m = new T.Mesh(dg, dropMat); arm.add(m); drops.push({ m, s: i % 2 ? 1 : -1, u: Math.random() }); }
      grp.add(arm); grp.position.set(...el.at); v.scene.add(grp);
      return {
        tick(dt) {
          arm.rotation.y = el.a;
          for (const o of drops) { o.u = (o.u + dt * 0.9) % 1; const x = o.s * (1.2 + o.u * (L - 1.2)); o.m.position.set(x, 0.7 + Math.sin(o.u * Math.PI) * 1.2, 0); }
        }
      };
    }
  }
};
