// Badezimmer: Badewanne mit Wasser, schwimmende Schiffchen (mit Trampolin), Toilette als Ziel.
// Gleiche Schnittstelle wie in elements.js; wird in bauteile.js eingetragen.
import { DEG, quatYawPitch, rotate, add, sub, scale, lerp3, toLocal, fwdOf, rightOf, ease } from './math.js';
import { TYPES, kinematicBody, boardParts, driveTo, ballPos } from './elements.js';
import { WELT } from './elements-welt.js';
import { buildProp } from './props.js';

const R = 0.5;
const EMAIL = { color: 0xFBFCFD, shininess: 120, specular: 0x777777 }; // weisses Email (Wanne, Klo)

export const BAD = {
  // Badewanne voll Wasser: at = Mitte der Wasseroberfläche, size = [breit, lang] innen, yaw = Längsrichtung,
  // rim = Rand über dem Wasser, depth = Wassertiefe. Wer ins Wasser fällt, spritzt und startet am Checkpoint neu.
  // enten = Liste von [x, z] (relativ zur Mitte, x = rechts, z = nach hinten) für schwimmende Quietscheenten (nur Deko)
  // {type:'wanne', at, size?, yaw?, rim?, depth?, enten?}
  wanne: {
    solids(d) {
      const [b, t] = d.size || [8, 16], rim = d.rim ?? 1.2, dp = d.depth ?? 2, w = 0.8, yaw = (d.yaw || 0) * DEG, q = quatYawPitch(yaw, 0);
      const H = rim + dp, L = (x, z) => add(d.at, rotate(q, [x, (rim - dp) / 2, z])); // Mitte einer Wand
      const out = [{ pos: add(d.at, [0, -dp - 0.3, 0]), half: [b / 2 + w, 0.3, t / 2 + w], quat: q, look: 'wanne', hide: true }];
      for (const k of [-1, 1]) {
        out.push({ pos: L(k * (b / 2 + w / 2), 0), half: [w / 2, H / 2, t / 2 + w], quat: q, look: 'wanne', hide: true });
        out.push({ pos: L(0, k * (t / 2 + w / 2)), half: [b / 2, H / 2, w / 2], quat: q, look: 'wanne', hide: true });
      }
      return out;
    },
    init(el) { el.yw = (el.yaw || 0) * DEG; },
    reset(el) { el.splash = null; },
    step(el, g, h, ev) {
      const [b, t] = el.size || [8, 16], l = toLocal(ballPos(g), el.at, el.yw);
      if (Math.abs(l[0]) < b / 2 && Math.abs(l[2]) < t / 2 && l[1] < 0.1 && !g.lock) {
        el.splash = { p: [g.ball.position.x, el.at[1], g.ball.position.z], t: 0 };
        ev.push('spritz'); g.fall(ev);
      }
    },
    view(el, v) {
      const T = v.THREE, [b, t] = el.size || [8, 16], rim = el.rim ?? 1.2, dp = el.depth ?? 2, w = 0.8, grp = new T.Group();
      const enamel = new T.MeshPhongMaterial(EMAIL);
      // Wanne: Boden, Wände, abgerundeter Rand oben
      const box = (sx, sy, sz, x, y, z) => { const m = new T.Mesh(new T.BoxGeometry(sx, sy, sz), enamel); m.position.set(x, y, z); m.receiveShadow = true; grp.add(m); };
      box(b + 2 * w, 0.6, t + 2 * w, 0, -dp - 0.3, 0);
      for (const k of [-1, 1]) { box(w, rim + dp, t + 2 * w, k * (b / 2 + w / 2), (rim - dp) / 2, 0); box(b, rim + dp, w, 0, (rim - dp) / 2, k * (t / 2 + w / 2)); }
      for (const k of [-1, 1]) {
        const s = new T.Mesh(new T.CylinderGeometry(w / 2, w / 2, t + 2 * w, 12), enamel); s.rotation.x = Math.PI / 2; s.position.set(k * (b / 2 + w / 2), rim, 0); grp.add(s);
        const e = new T.Mesh(new T.CylinderGeometry(w / 2, w / 2, b + 2 * w, 12), enamel); e.rotation.z = Math.PI / 2; e.position.set(0, rim, k * (t / 2 + w / 2)); grp.add(e);
      }
      // Füsse (Löwenfüsse in Gold)
      const gold = new T.MeshPhongMaterial({ color: 0xFFC928, shininess: 120, specular: 0xffffff });
      for (const x of [-1, 1]) for (const z of [-1, 1]) { const f = new T.Mesh(new T.SphereGeometry(0.7, 12, 8), gold); f.position.set(x * (b / 2 + w * 0.3), -dp - 0.8, z * (t / 2 + w * 0.3)); grp.add(f); }
      // Wasser mit Wellen
      const tex = v.canvasTex(128, 128, (x, W, H) => {
        x.fillStyle = '#5EC4F0'; x.fillRect(0, 0, W, H);
        x.strokeStyle = 'rgba(255,255,255,0.5)'; x.lineWidth = 2;
        for (let i = 0; i < 10; i++) { const y = i * 13 + 5; x.beginPath(); x.moveTo(0, y); for (let k = 0; k <= W; k += 16) x.quadraticCurveTo(k + 8, y + (i % 2 ? 4 : -4), k + 16, y); x.stroke(); }
      });
      tex.repeat.set(b / 4, t / 4);
      const water = new T.Mesh(new T.PlaneGeometry(b, t), new T.MeshPhongMaterial({ map: tex, transparent: true, opacity: 0.8, shininess: 120, specular: 0xffffff, depthWrite: false }));
      water.rotation.x = -Math.PI / 2; grp.add(water);
      // Schaum am Rand
      const foamMat = new T.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 80 }), foam = [];
      for (let i = 0; i < 40; i++) {
        const side = i % 4, u = ((i * 37) % 40) / 40 - 0.5, s = 0.3 + ((i * 13) % 7) / 14;
        const m = new T.Mesh(new T.SphereGeometry(s, 10, 6), foamMat);
        m.position.set(side < 2 ? (side ? 1 : -1) * (b / 2 - s * 0.6) : u * b, 0, side < 2 ? u * t : (side === 2 ? 1 : -1) * (t / 2 - s * 0.6));
        m.scale.y = 0.6; grp.add(m); foam.push(m);
      }
      // Quietscheenten
      const ducks = (el.enten || []).map(([x, z], i) => { const d = buildProp(T, 'ente', {}); d.scale.setScalar(0.35); d.position.set(x, -0.2, z); d.rotation.y = i * 2.1; grp.add(d); return d; });
      // Spritzer beim Hineinfallen: Ring, der grösser wird
      const ring = new T.Mesh(new T.RingGeometry(0.6, 0.9, 32), new T.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2; v.scene.add(ring);
      grp.position.set(...el.at); grp.rotation.y = el.yw; v.scene.add(grp);
      let time = 0;
      return {
        tick(dt) {
          time += dt;
          tex.offset.set((tex.offset.x + dt * 0.03) % 1, (tex.offset.y + dt * 0.05) % 1);
          foam.forEach((m, i) => { m.position.y = 0.05 + Math.sin(time * 1.5 + i) * 0.06; });
          ducks.forEach((d, i) => { d.position.y = -0.2 + Math.sin(time * 2 + i * 1.7) * 0.12; d.rotation.z = Math.sin(time * 1.6 + i) * 0.08; d.rotation.y += dt * 0.15; });
          const s = el.splash;
          if (s && s.t < 1) { s.t += dt; ring.position.set(s.p[0], s.p[1] + 0.05, s.p[2]); ring.scale.setScalar(1 + s.t * 4); ring.material.opacity = 0.9 * (1 - s.t); }
          else ring.material.opacity = 0;
        }
      };
    }
  },

  // Schiffchen: schwimmt auf dem Wasser (at = Mitte der Wasseroberfläche darunter), schaukelt auf und ab,
  // fährt optional hin und her (to, time, pause, offset wie bei der Plattform). Deck aus Frottee (die Murmel hüpft kaum),
  // surface = andere Oberfläche (z. B. 'normal' = Holz für eine Fähre: Frottee bremst gegen die Fahrt).
  // size = [breit, lang], deck = Deckhöhe über dem Wasser, bob = wie stark es schaukelt (m).
  // trampolin = { vorne: Abstand der Mitte nach vorne, size: [b, t], ziel: Landepunkt (Oberkante), time: Flugzeit s (bei normaler Schwerkraft), bremse: Tempo nach der Landung (Anteil) }
  //   springt immer genau auf das Ziel (wie die Kanone: Flug ausgerechnet, in der Luft nicht lenken)
  // {type:'schiff', at, size?, yaw?, deck?, bob?, to?, time?, pause?, offset?, farbe?, segel?, surface?, trampolin?}
  schiff: {
    init(el, g) {
      const [b, len] = el.size || [3.5, 5];
      el.yw = (el.yaw || 0) * DEG; el.deckY = el.deck ?? 0.5;
      el.surf = el.surface ?? 'handtuch';
      el.body = kinematicBody(g, boardParts(b, len, 0.6, 0.35, 'handtuch'), el.surf);
      el.body.quaternion.set(...quatYawPitch(el.yw, 0));
      el.body.userData = { surface: el.surf, track: null, yaw: el.yw };
      el.from = el.at; el.to = el.to || el.at;
    },
    reset(el) {
      el.t = el.offset || 0; el.lastV = [0, 0, 0]; el.flug = 0; el.cool = 0;
      el.body.position.set(...BAD.schiff.posAt(el, el.t)); el.body.velocity.set(0, 0, 0);
    },
    posAt(el, t) {
      const base = el.to === el.from ? el.from : TYPES.plattform.posAt(el, t);
      return add(base, [0, el.deckY + (el.bob ?? 0.12) * Math.sin(t * 2.4), 0]);
    },
    pre(el, g, h) {
      el.t += h;
      driveTo(el.body, BAD.schiff.posAt(el, el.t), h);
      // Murmel mitnehmen (waagrecht), wie auf der Plattform
      const v = el.body.velocity;
      if (g.groundBody === el.body) { g.ball.velocity.x += v.x - el.lastV[0]; g.ball.velocity.z += v.z - el.lastV[2]; }
      el.lastV = [v.x, v.y, v.z];
    },
    step(el, g, h, ev) {
      const tr = el.trampolin;
      if (!tr) return;
      el.cool -= h;
      if (el.flug > 0) { // im Flug: nicht lenken, bis die Murmel landet
        el.flug += h;
        if ((g.groundBody && el.flug > 0.2) || el.flug > 4 || !g.lock) {
          if (g.groundBody && g.lock) { // weich landen: das Frottee fängt die Murmel auf (waagrecht abbremsen, passend rollen)
            const v = g.ball.velocity, k = tr.bremse ?? 0.3;
            v.x *= k; v.z *= k; g.ball.angularVelocity.set(v.z / R, 0, -v.x / R);
          }
          g.lock = false; el.flug = 0;
        }
        return;
      }
      const pad = add([el.body.position.x, el.body.position.y, el.body.position.z], scale(fwdOf(el.yw), tr.vorne ?? 1.5));
      const l = toLocal(ballPos(g), pad, el.yw), [pb, pt] = tr.size || [2.4, 1.6];
      if (el.cool <= 0 && !g.lock && Math.abs(l[0]) < pb / 2 && Math.abs(l[2]) < pt / 2 && l[1] < R + 0.2 && l[1] > R - 0.4) {
        // Flug so ausrechnen, dass die Murmel genau auf dem Ziel landet (Schwerkraft der Murmel, ohne Luftbremse)
        // etwas anheben und passend drehen, sonst bremst die Reibung am Deck den Absprung
        // gleich hoher Bogen für jede Murmel: bei weniger Schwerkraft (Mond) dauert der Flug länger
        const T = (tr.time ?? 1) * Math.sqrt(9.82 / g.G), p = add(ballPos(g), [0, 0.05, 0]), aim = add(tr.ziel, [0, R, 0]), d = sub(aim, p), vx = d[0] / T, vz = d[2] / T;
        g.ball.position.set(...p);
        g.ball.velocity.set(vx, d[1] / T + 0.5 * g.G * T, vz);
        g.ball.angularVelocity.set(vz / R, 0, -vx / R);
        g.lock = true; el.flug = 1e-6; el.cool = 0.6; ev.push('jump');
      }
    },
    view(el, v) {
      const T = v.THREE, [b, len] = el.size || [3.5, 5], grp = new T.Group(), col = el.farbe ?? 0xE53935;
      // Rumpf: Umriss mit spitzem Bug (vorne = -z), nach unten schmaler
      const sh = new T.Shape(), hb = b / 2 + 0.3, hl = len / 2;
      sh.moveTo(-hb, hl); sh.lineTo(hb, hl); sh.lineTo(hb, -hl + 1.2); sh.quadraticCurveTo(hb * 0.6, -hl - 0.5, 0, -hl - 1.2); sh.quadraticCurveTo(-hb * 0.6, -hl - 0.5, -hb, -hl + 1.2); sh.closePath();
      const hull = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 1.1, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 2 }), new T.MeshPhongMaterial({ color: col, shininess: 70 }));
      hull.rotation.x = Math.PI / 2; hull.position.y = -0.62; hull.castShadow = true; grp.add(hull);
      const stripe = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.18, bevelEnabled: false }), new T.MeshPhongMaterial({ color: 0xFFFFFF }));
      stripe.rotation.x = Math.PI / 2; stripe.position.y = -1.3; stripe.scale.set(1.03, 1.03, 1); grp.add(stripe);
      // Deck (Frottee) und Reling
      const towel = v.canvasTex(64, 64, (x, W, H) => { x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.fillStyle = '#4FC3F7'; x.fillRect(0, 24, W, 16); });
      towel.repeat.set(1, len / 2);
      const deckMat = el.surf === 'handtuch' ? new T.MeshLambertMaterial({ map: towel }) : new T.MeshLambertMaterial({ color: 0xD7B98E }); // Frottee oder Holz
      const deck = new T.Mesh(new T.BoxGeometry(b, 0.6, len), deckMat); deck.position.y = -0.3; deck.receiveShadow = true; grp.add(deck);
      for (const k of [-1, 1]) { const r = new T.Mesh(new T.BoxGeometry(0.3, 0.35, len), new T.MeshPhongMaterial({ color: 0xFFFFFF })); r.position.set(k * (b / 2 + 0.15), 0.175, 0); grp.add(r); }
      // Mast mit Segel (seitlich, damit die Bahn frei bleibt)
      if (el.segel !== false) {
        const mx = -(b / 2 + 0.15), mast = new T.Mesh(new T.CylinderGeometry(0.1, 0.12, 3.2, 8), new T.MeshLambertMaterial({ color: 0x8D6E63 }));
        mast.position.set(mx, 1.6, hl * 0.3); grp.add(mast);
        const sail = new T.Shape(); sail.moveTo(0, 0); sail.lineTo(0, 2.6); sail.lineTo(-1.6, 0.2); sail.closePath();
        const s = new T.Mesh(new T.ShapeGeometry(sail), new T.MeshLambertMaterial({ color: 0xFFF59D, side: T.DoubleSide })); s.rotation.y = Math.PI / 2; s.position.set(mx, 0.5, hl * 0.3 - 0.1); grp.add(s);
        const flag = new T.Mesh(new T.PlaneGeometry(0.7, 0.4), new T.MeshLambertMaterial({ color: col, side: T.DoubleSide })); flag.position.set(mx, 3.05, hl * 0.3 + 0.35); flag.rotation.y = Math.PI / 2; grp.add(flag);
      }
      // Trampolin auf dem Deck: Rahmen mit Federn, rosa Sprungtuch
      let padMat = null;
      if (el.trampolin) {
        const [pb, pt] = el.trampolin.size || [2.4, 1.6], z = -(el.trampolin.vorne ?? 1.5);
        padMat = new T.MeshLambertMaterial({ color: 0xFF5A8A, emissive: 0x000000 });
        const pad = new T.Mesh(new T.BoxGeometry(pb, 0.08, pt), padMat); pad.position.set(0, 0.04, z); grp.add(pad);
        const frame = new T.MeshPhongMaterial({ color: 0x455A64, shininess: 60 });
        for (const k of [-1, 1]) {
          const a = new T.Mesh(new T.BoxGeometry(0.12, 0.12, pt + 0.24), frame); a.position.set(k * (pb / 2 + 0.06), 0.06, z); grp.add(a);
          const c = new T.Mesh(new T.BoxGeometry(pb + 0.24, 0.12, 0.12), frame); c.position.set(0, 0.06, z + k * (pt / 2 + 0.06)); grp.add(c);
        }
        // Zielkreis dort, wo die Murmel landet
        const ring = new T.Mesh(new T.RingGeometry(0.6, 0.85, 28), new T.MeshBasicMaterial({ color: 0xFF5A8A, transparent: true, opacity: 0.6, side: T.DoubleSide, depthWrite: false }));
        ring.rotation.x = -Math.PI / 2; ring.position.set(el.trampolin.ziel[0], el.trampolin.ziel[1] + 0.04, el.trampolin.ziel[2]); v.scene.add(ring);
      }
      v.scene.add(grp);
      let time = 0;
      return {
        tick(dt) {
          time += dt;
          grp.position.copy(el.body.position);
          grp.quaternion.copy(el.body.quaternion);
          grp.rotateZ(Math.sin(time * 1.7) * 0.04); // schaukeln (nur Grafik)
          if (padMat) padMat.emissive.setHex(el.cool > 0.3 ? 0x552030 : 0x000000);
        }
      };
    }
  },

  // Wasserstrahl aus einem Hahn: fällt senkrecht von at (Auslauf oben) bis unten (y). Wer hindurchrollt oder -fliegt,
  // wird gewaschen (wash = Abwaschen pro Sekunde, ganz sauber nach etwa 3.5 / wash Sekunden) und leicht nach unten gedrückt.
  // hahn:true = Wasserhahn dazu zeichnen (yaw = Richtung, in die der Auslauf zeigt, lang = Länge des Auslaufs,
  // fuss = Höhe der Säule unter dem Auslauf) {type:'strahl', at, unten, r?, wash?, push?, hahn?, yaw?, lang?, fuss?}
  strahl: {
    reset(el) { el.inside = false; },
    step(el, g, h, ev) {
      const p = g.ball.position, r = el.r ?? 0.5;
      const inside = Math.hypot(p.x - el.at[0], p.z - el.at[2]) < r + R && p.y < el.at[1] && p.y > el.unten - R;
      if (inside) {
        g.washK += el.wash ?? 15;
        g.ball.velocity.y -= (el.push ?? 6) * h;
        if (!el.inside) ev.push('spritz');
      }
      el.inside = inside;
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 0.5, len = el.at[1] - el.unten, grp = new T.Group();
      const col = new T.Mesh(new T.CylinderGeometry(r * 0.8, r, len, 16, 1, true), new T.MeshPhongMaterial({ color: 0x9FDCFF, transparent: true, opacity: 0.45, shininess: 120, specular: 0xffffff, depthWrite: false, side: T.DoubleSide }));
      col.position.y = -len / 2; grp.add(col);
      const drops = [], dm = new T.MeshBasicMaterial({ color: 0xE1F5FE, transparent: true, opacity: 0.85 }), dg = new T.SphereGeometry(0.1, 6, 4);
      for (let i = 0; i < 24; i++) { const m = new T.Mesh(dg, dm); grp.add(m); drops.push({ m, u: i / 24, a: i * 2.4 }); }
      const splash = new T.Mesh(new T.RingGeometry(r * 0.6, r * 1.6, 24), new T.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6, side: T.DoubleSide, depthWrite: false }));
      splash.rotation.x = -Math.PI / 2; splash.position.y = -len + 0.05; grp.add(splash);
      if (el.hahn) { // Wasserhahn: Säule am Rand, Auslauf (Länge lang) bis über den Strahl
        const chrome = new T.MeshPhongMaterial({ color: 0xD7DCE2, shininess: 160, specular: 0xffffff }), f = fwdOf((el.yaw || 0) * DEG), L = el.lang ?? 2.2;
        const spout = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, L, 14), chrome);
        spout.rotation.order = 'YXZ'; spout.rotation.set(Math.PI / 2, (el.yaw || 0) * DEG, 0);
        spout.position.set(...scale(f, -L / 2)); spout.position.y = 0.25; grp.add(spout);
        const tip = new T.Mesh(new T.CylinderGeometry(0.34, 0.3, 0.35, 14), chrome); tip.position.y = 0.1; grp.add(tip);
        const fuss = el.fuss ?? 2.7, post = new T.Mesh(new T.CylinderGeometry(0.35, 0.45, fuss + 0.6, 16), chrome); post.position.set(...scale(f, -L)); post.position.y = 0.3 - fuss / 2; grp.add(post);
        const knob = new T.Mesh(new T.SphereGeometry(0.45, 14, 10), new T.MeshPhongMaterial({ color: 0x4FC3F7, shininess: 120 })); knob.position.set(...scale(f, -L)); knob.position.y = 0.6; grp.add(knob);
      }
      grp.position.set(...el.at); v.scene.add(grp);
      let t = 0;
      return {
        tick(dt) {
          t += dt;
          for (const d of drops) { d.u = (d.u + dt * 1.4) % 1; d.m.position.set(Math.cos(d.a) * r * 0.7, -d.u * len, Math.sin(d.a) * r * 0.7); }
          splash.scale.setScalar(1 + Math.sin(t * 12) * 0.15);
        }
      };
    }
  },

  // Toilette als Ziel: Schüssel (Physik wie schuessel) mit Wasser, Brille, Deckel und Spülkasten hinten.
  // at = Mitte des Schüsselbodens, yaw = Blickrichtung beim Hineinfahren (Deckel und Spülkasten stehen dahinter),
  // r, R, h, rim wie bei schuessel. Ins Ziel legen: {type:'ziel', at} in der Mitte. Beim Gewinnen wird gespült.
  // {type:'klo', at, yaw?, r?, R?, h?, rim?}
  klo: {
    solids(d) {
      const out = WELT.schuessel.solids({ r: 1.5, R: 3.2, h: 2, rim: 0.9, ...d, aussen: true });
      // Deckel und Spülkasten hinten: fängt die Murmel auf, wenn sie zu weit fliegt
      const yaw = (d.yaw || 0) * DEG, q = quatYawPitch(yaw, 0), Rr = (d.R ?? 3.2) + (d.rim ?? 0.9), h = d.h ?? 2;
      out.push({ pos: add(add(d.at, scale(fwdOf(yaw), Rr + 0.3)), [0, h + 3, 0]), half: [Rr, 3, 0.3], quat: q, look: 'wall', hide: true });
      out.push({ pos: add(add(d.at, scale(fwdOf(yaw), Rr + 2.2)), [0, h + 3.5, 0]), half: [Rr + 0.6, 3.5, 1.6], quat: q, look: 'wall', hide: true });
      return out;
    },
    reset(el) { el.spuel = 0; },
    step(el, g, h, ev) { if (g.st.won && !el.spuel) { el.spuel = 1e-6; ev.push('spuel'); } },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 1.5, Rr = el.R ?? 3.2, h = el.h ?? 2, rim = el.rim ?? 0.9, grp = new T.Group();
      const enamel = new T.MeshPhongMaterial({ ...EMAIL, side: T.DoubleSide });
      const V2 = (x, y) => new T.Vector2(x, y);
      // Schüssel innen und aussen (Fuss unten schmaler)
      grp.add(new T.Mesh(new T.LatheGeometry([V2(0.01, 0), V2(r, 0), V2(Rr, h), V2(Rr + rim, h), V2(Rr + rim - 0.3, h - 1.2), V2(r + 0.8, -1.5), V2(r + 1.2, -4)], 40), enamel));
      // Wasser unten mit Strudel (dreht beim Spülen schnell)
      const swirl = v.canvasTex(128, 128, (x, W, H) => {
        x.fillStyle = '#7FD3F7'; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(255,255,255,0.7)'; x.lineWidth = 3;
        for (let k = 0; k < 3; k++) { x.beginPath(); for (let a = 0; a < 9; a += 0.2) { const rr = a * 6.5, px = W / 2 + Math.cos(a + k * 2.1) * rr, py = H / 2 + Math.sin(a + k * 2.1) * rr; a ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
      }, false);
      const water = new T.Mesh(new T.CircleGeometry(r + 0.35, 32), new T.MeshPhongMaterial({ map: swirl, transparent: true, opacity: 0.85, shininess: 120, depthWrite: false }));
      water.rotation.x = -Math.PI / 2; water.position.y = 0.15; grp.add(water);
      // Brille (hellblau) auf dem Rand
      const seat = new T.Mesh(new T.TorusGeometry(Rr + rim / 2, rim / 2, 10, 40), new T.MeshPhongMaterial({ color: 0x81D4FA, shininess: 90 }));
      seat.rotation.x = Math.PI / 2; seat.position.y = h + 0.25; seat.scale.z = 0.5; grp.add(seat);
      // Deckel hochgeklappt und Spülkasten mit Knopf (hinten = vorwärts in Fahrtrichtung)
      const back = new T.Group();
      const lid = new T.Mesh(new T.CylinderGeometry(Rr + rim, Rr + rim, 0.4, 36), new T.MeshPhongMaterial({ color: 0x81D4FA, shininess: 90 }));
      lid.scale.z = 0.8; lid.rotation.x = Math.PI / 2 - 0.12; lid.position.set(0, h + (Rr + rim) * 0.8, -(Rr + rim) - 0.2); back.add(lid);
      const tank = new T.Mesh(new T.BoxGeometry(2 * (Rr + rim) + 1.2, 7, 3.2), enamel); tank.position.set(0, h + 3.5, -(Rr + rim) - 2.2); back.add(tank);
      const lidTop = new T.Mesh(new T.BoxGeometry(2 * (Rr + rim) + 1.6, 0.4, 3.6), enamel); lidTop.position.set(0, h + 7.2, -(Rr + rim) - 2.2); back.add(lidTop);
      const btn = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, 0.3, 20), new T.MeshPhongMaterial({ color: 0xD7DCE2, shininess: 160, specular: 0xffffff }));
      btn.position.set(0, h + 7.5, -(Rr + rim) - 2.2); back.add(btn);
      back.rotation.y = (el.yaw || 0) * DEG; grp.add(back);
      grp.position.set(...el.at); v.scene.add(grp);
      return {
        tick(dt) {
          if (el.spuel > 0) el.spuel += dt;
          const fast = el.spuel > 0 && el.spuel < 3;
          water.rotation.z += dt * (fast ? 9 : 0.4);
          btn.position.y = h + 7.5 - (fast && el.spuel < 0.5 ? 0.2 : 0);
        }
      };
    }
  }
};
