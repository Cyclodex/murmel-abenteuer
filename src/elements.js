// Alle Bauteile, die in Level-Daten vorkommen dürfen.
// Ein Bauteil-Typ kann haben:
//   solids(d)            -> feste Klötze [{pos, half, quat, look, surface, track, glass}] (Physik + Grafik automatisch;
//                           glass = halb durchsichtig)
//   init(el, g)          -> Zustand/bewegliche Körper anlegen (einmal)
//   reset(el, g)         -> Zustand auf Anfang (bei Neustart)
//   pre(el, g, h)        -> vor jedem Physikschritt (h Sekunden), z. B. bewegte Teile steuern
//   step(el, g, h, ev)   -> nach jedem Physikschritt: Spiellogik, Ereignisse in ev schreiben
//   view(el, v)          -> zusätzliche Grafik; darf {tick(dt, g), cam(p)} zurückgeben
//                           cam(p): eigene Kamera, solange die Murmel (p = [x, y, z]) dort ist, sonst null;
//                           {look, dir: Richtung vom Blickpunkt zur Kamera, fit: so viele m ab look muss man mindestens
//                           in jede Richtung sehen (bestimmt den Abstand), clear: nur was höchstens so weit vor look
//                           liegt, wird gezeichnet (alles näher bei der Kamera fällt weg)}
// Winkel in Level-Daten sind in Grad. yaw 0 = nach vorne (-z), positiv = nach links drehen.
import { buildCheckpoint } from './checkpoint-figuren.js';
import { DEG, quatYawPitch, rotate, add, scale, lerp3, yawOf, toLocal, fwdOf, rightOf, ease, mulQ } from './math.js';

const R = 0.5; // Murmel-Radius
const TAU = Math.PI * 2;
export const norm = v => scale(v, 1 / (Math.hypot(...v) || 1));
// Looping: seitlicher Versatz nach dem Winkel a (0..2PI). Beginnt und endet weich: Ein- und Ausfahrt laufen gerade,
// sonst knickt die Bahn dort seitlich ab und eine Murmel am Rand prallt auf die Schiene.
const loopLat = (shift, a) => shift * ease(a / TAU);

export function segment(from, to, fallbackYaw) {
  const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
  const hl = Math.hypot(dx, dz);
  const yaw = hl > 1e-6 ? yawOf(dx, dz) : (fallbackYaw || 0) * DEG;
  const pitch = Math.atan2(dy, hl);
  const q = quatYawPitch(yaw, pitch);
  return { q, L: Math.hypot(hl, dy), mid: scale(add(from, to), 0.5), up: rotate(q, [0, 1, 0]), right: rotate(q, [1, 0, 0]), yaw, pitch };
}
export const track = s => ({ yaw: s.yaw, mid: s.mid, right: s.right });

// Beweglicher Körper aus mehreren Klötzen (Form-Liste in lokalen Koordinaten)
export function kinematicBody(g, parts, surface) {
  const C = g.C;
  const body = new C.Body({ mass: 0, type: C.Body.KINEMATIC, material: g.matFor(surface) });
  for (const p of parts) body.addShape(new C.Box(new C.Vec3(...p.half)), new C.Vec3(...p.off));
  body.collisionFilterGroup = 1; body.collisionFilterMask = 2 | 4;
  g.world.addBody(body);
  body.looks = parts.map(p => p.look || 'floor');
  return body;
}
// Form-Liste für ein flaches Brett mit optionalen Seitenrändern; Oberkante bei y = 0
export function boardParts(w, len, th, rim, look) {
  const parts = [{ half: [w / 2, th / 2, len / 2], off: [0, -th / 2, 0], look }];
  if (rim > 0) for (const k of [-1, 1]) parts.push({ half: [0.15, rim / 2, len / 2], off: [k * (w / 2 + 0.15), rim / 2, 0], look: 'wall' });
  return parts;
}
// Kinematischen Körper so bewegen, dass er nach h Sekunden bei p ist
export function driveTo(body, p, h) {
  body.velocity.set((p[0] - body.position.x) / h, (p[1] - body.position.y) / h, (p[2] - body.position.z) / h);
}
export const ballPos = g => [g.ball.position.x, g.ball.position.y, g.ball.position.z];

export const TYPES = {
  // Weg von A nach B (Oberkante). Wenn die Höhe sich ändert, wird er zur Rampe.
  // {type:'weg', from, to, width, walls?:Höhe, caps?:'start'|'end'|'both', thick?, surface?:'eis'|'schlamm', look?}
  weg: {
    solids(d) {
      const s = segment(d.from, d.to), w = d.width ?? 4, th = d.thick ?? 1;
      const look = d.look || (d.surface && d.surface !== 'normal' ? d.surface : (Math.abs(s.pitch) > 1e-3 ? 'ramp' : 'floor'));
      const out = [{ pos: add(s.mid, scale(s.up, -th / 2)), half: [w / 2, th / 2, s.L / 2], quat: s.q, look, surface: d.surface, track: track(s) }];
      const h = d.walls || 0;
      if (h > 0) {
        // Seitenwände enden an den Abschlusswänden (keine Überlappung -> kein Flimmern an den Ecken)
        const c0 = d.caps === 'start' || d.caps === 'both' ? 0.2 : 0, c1 = d.caps === 'end' || d.caps === 'both' ? 0.2 : 0;
        const fwd = scale([d.to[0] - d.from[0], d.to[1] - d.from[1], d.to[2] - d.from[2]], 1 / s.L), mid = add(s.mid, scale(fwd, (c0 - c1) / 2));
        for (const k of [-1, 1]) out.push({ pos: add(add(mid, scale(s.right, k * (w / 2 + 0.2))), scale(s.up, h / 2)), half: [0.2, h / 2, (s.L - c0 - c1) / 2], quat: s.q, look: 'wall' });
        const cap = p => out.push({ pos: add(p, scale(s.up, h / 2)), half: [w / 2 + 0.4, h / 2, 0.2], quat: s.q, look: 'wall' });
        if (d.caps === 'start' || d.caps === 'both') cap(d.from);
        if (d.caps === 'end' || d.caps === 'both') cap(d.to);
      }
      return out;
    }
  },

  // Kurve. at = Startpunkt (Mitte, Oberkante), yaw = Startrichtung,
  // turn = Grad (+ rechts, - links, auch mehr als 360 für Spiralen), radius = bis zur Wegmitte,
  // rise = Höhenänderung über die ganze Kurve (negativ = abwärts).
  // {type:'kurve', at, yaw?, turn, radius?, width?, walls?, thick?, rise?, surface?}
  kurve: {
    solids(d) {
      const h0 = (d.yaw || 0) * DEG, T = Math.abs(d.turn) * DEG, s = Math.sign(d.turn), r = d.radius ?? 5, w = d.width ?? 5, th = d.thick ?? 1;
      const n = Math.max(2, Math.ceil(Math.abs(d.turn) / 10)), dphi = T / n, wh = d.walls || 0;
      const R0 = rightOf(h0), F0 = fwdOf(h0), C = add(d.at, scale(R0, s * r));
      const P = (phi, rad) => add(C, add(scale(R0, -s * Math.cos(phi) * rad), scale(F0, Math.sin(phi) * rad)));
      const out = [], rise = d.rise || 0;
      for (let k = 0; k < n; k++) {
        const a = k * dphi, b = a + dphi, yaw = h0 - s * (a + b) / 2, q = quatYawPitch(yaw, 0);
        const chord = rad => 2 * rad * Math.sin(dphi / 2) + 0.06;
        if (rise) { // geneigtes Segment (Spirale)
          const pa = add(P(a, r), [0, rise * a / T, 0]), pb = add(P(b, r), [0, rise * b / T, 0]), sg = segment(pa, pb);
          const L = rad => chord(rad) / Math.cos(sg.pitch);
          out.push({ pos: add(sg.mid, scale(sg.up, -th / 2)), half: [w / 2, th / 2, L(r + w / 2) / 2], quat: sg.q, look: d.look || d.surface || 'ramp', surface: d.surface, track: track(sg) });
          if (wh > 0) for (const k2 of [-1, 1]) out.push({ pos: add(add(sg.mid, scale(sg.right, k2 * (w / 2 + 0.2))), scale(sg.up, wh / 2)), half: [0.2, wh / 2, L(r - k2 * s * (w / 2 + 0.2)) / 2], quat: sg.q, look: 'wall' });
          continue;
        }
        const mid = scale(add(P(a, r), P(b, r)), 0.5);
        out.push({ pos: add(mid, [0, -th / 2, 0]), half: [w / 2, th / 2, chord(r + w / 2) / 2], quat: q, look: d.look || d.surface || 'floor', surface: d.surface, track: { yaw, mid, right: rightOf(yaw) } });
        if (wh > 0) for (const rad of [r + w / 2 + 0.2, r - w / 2 - 0.2]) {
          const m = scale(add(P(a, rad), P(b, rad)), 0.5);
          out.push({ pos: add(m, [0, wh / 2, 0]), half: [0.2, wh / 2, chord(rad + 0.2) / 2], quat: q, look: 'wall' });
        }
      }
      return out;
    }
  },

  // Looping: at = Einfahrt unten (Oberkante), yaw = Richtung, radius, width,
  // shift = seitlicher Versatz der Ausfahrt (+ rechts). Braucht Schwung (turbo davor).
  // {type:'looping', at, yaw?, radius?, width?, shift?, rails?}
  looping: {
    solids(d) {
      const h = (d.yaw || 0) * DEG, Rl = d.radius ?? 3, w = d.width ?? 3, shift = d.shift ?? 5, rail = d.rails ?? 0.8, th = 0.4, n = 40;
      const F = fwdOf(h), U = [0, 1, 0], Rr = rightOf(h), C = add(d.at, scale(U, Rl));
      const out = [], L = TAU * (Rl + th) / n + 0.08, da = TAU / n;
      // Punkt auf der Schraubenlinie im Abstand r von der Mitte, seitlich um off verschoben
      const at = (a, r, off) => add(add(C, add(scale(F, Math.sin(a) * r), scale(U, -Math.cos(a) * r))), scale(Rr, loopLat(shift, a) + off));
      // Schienen: jedes Stück genau von einem Punkt der Schraubenlinie zum nächsten, schräg um den Versatz gedreht
      // (gerade Stücke stünden je um den Versatz vor: eine Treppe, an der die Murmel hängen bleibt)
      const rr = Rl - rail / 2, chord = 2 * rr * Math.sin(da / 2);
      for (let k = 0; k < n; k++) {
        const a = (k + 0.5) * da, q = quatYawPitch(h, a);
        const side = loopLat(shift, a + da / 2) - loopLat(shift, a - da / 2), sk = Math.atan2(side, chord);
        const qr = mulQ(q, [0, Math.sin(-sk / 2), 0, Math.cos(-sk / 2)]), Lr = Math.hypot(chord, side) + 0.02;
        const P = at(a, Rl, 0);
        const N = add(scale(U, Math.cos(a)), scale(F, -Math.sin(a)));
        out.push({ pos: add(P, scale(N, -th / 2)), half: [w / 2, th / 2, L / 2], quat: q, look: d.look || 'ramp', track: { yaw: h, mid: P, right: Rr }, loop: d });
        for (const k2 of [-1, 1]) {
          const A = at(a - da / 2, rr, k2 * (w / 2 + 0.2)), B = at(a + da / 2, rr, k2 * (w / 2 + 0.2));
          out.push({ pos: scale(add(A, B), 0.5), half: [0.2, rail / 2, Lr / 2], quat: qr, look: 'wall', glass: true, loop: d });
        }
      }
      return out;
    },
    reset(el) { el.prog = null; el.away = 0; },
    // Im Looping zählt Kippen nicht (die Seitenführung hält die Murmel auf der Spur, Lenken brächte sie nur an die Schiene)
    pre(el, g) { if (el.prog !== null && el.away === 0) { g.world.gravity.x = 0; g.world.gravity.z = 0; } },
    // Seitenführung: hält die Murmel auf der schraubenförmigen Spur, ohne dass sie an die Schienen prallt
    step(el, g, h) {
      const u = g.touchBody && g.touchBody.userData;
      if (!u || u.loop !== el) { if ((el.away += h) > 0.4) el.prog = null; return; }
      el.away = 0;
      const yaw = (el.yaw || 0) * DEG, Rl = el.radius ?? 3, shift = el.shift ?? 5;
      const F = fwdOf(yaw), Rr = rightOf(yaw), p = ballPos(g), v = g.ball.velocity;
      const c = add(el.at, [0, Rl, 0]), rel = [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
      const sa = rel[0] * F[0] + rel[2] * F[2], a = Math.atan2(sa, -rel[1]);           // -PI..PI, 0 = unten
      const lat = (p[0] - el.at[0]) * Rr[0] + (p[2] - el.at[2]) * Rr[2];
      if (el.prog === null) {                                                            // Einfahrt ~0, Ausfahrt ~2PI
        el.prog = a < -Math.PI / 2 ? a + TAU : a;
        el.lat0 = lat - loopLat(shift, Math.max(0, el.prog));                            // Versatz bei der Einfahrt
      } else el.prog += Math.atan2(Math.sin(a - el.prog), Math.cos(a - el.prog));
      const pr = Math.max(0, Math.min(TAU, el.prog)), rc = Rl - R;                       // rc = Bahn der Murmelmitte
      const vf = v.x * F[0] + v.z * F[2];
      // seitlich von der Einfahrtsstelle weich bis zur Ausfahrt (Versatz bei der Einfahrt baut sich über die Runde ab)
      const vt = Math.hypot(vf, v.y), dLat = shift * Math.PI / (2 * TAU) * Math.sin(Math.PI * pr / TAU) - el.lat0 / TAU; // pro Radiant
      const want = (el.prog > 0 && el.prog < TAU ? dLat * vt / rc : 0) + 4 * (el.lat0 * (1 - pr / TAU) + loopLat(shift, pr) - lat);
      const vl = v.x * Rr[0] + v.z * Rr[2], dv = want - vl;
      v.x += Rr[0] * dv; v.z += Rr[2] * dv;
    },
    // Kamera von der Seite (auf der Achse des Loopings), damit man die ganze Runde sieht; die Schienen sind
    // dafür halb durchsichtig. Von der Seite der Einfahrt: dort verdeckt die spätere Hälfte der Bahn nichts.
    // Erst wenn die Murmel im Looping ist (vorher lenkt man noch auf den Turbo, dafür braucht es die Sicht von hinten).
    view(el) {
      const yaw = (el.yaw || 0) * DEG, Rl = el.radius ?? 3, shift = el.shift ?? 5, w = el.width ?? 3;
      const Rr = rightOf(yaw), mid = add(add(el.at, [0, Rl, 0]), scale(Rr, shift / 2));
      const dir = norm(add(scale(Rr, shift < 0 ? 1 : -1), [0, 0.25, 0]));
      return {
        cam(p) {
          if (el.prog === null) return null;
          return { look: lerp3(mid, p, 0.3), dir, fit: Rl + 1.5, clear: Math.abs(shift) / 2 + w / 2 + 1.5 };
        }
      };
    }
  },

  // Einzelne Wand von A nach B (Unterkante). {type:'wand', from, to, height, thick?, look?}
  wand: {
    solids(d) {
      const s = segment(d.from, d.to), h = d.height ?? 0.8, t = d.thick ?? 0.4;
      return [{ pos: add(s.mid, scale(s.up, h / 2)), half: [t / 2, h / 2, s.L / 2], quat: s.q, look: d.look || 'wall' }];
    }
  },

  // Klotz: Mittelpunkt + Grösse. {type:'klotz', at, size:[b,h,t], yaw?, look?, text?, surface?, deko?}
  // look z. B. 'floor', 'wall', 'lego-rot', 'klotz-blau', 'abc' (mit text:'A'). deko:true = nur Grafik, keine Physik
  klotz: {
    solids(d) {
      return [{ pos: d.at, half: scale(d.size, 0.5), quat: quatYawPitch((d.yaw || 0) * DEG, 0), look: d.look || 'floor', text: d.text, surface: d.surface, deko: !!d.deko }];
    }
  },

  // Nische: kleine Ecke neben dem Weg (z. B. für Bonussterne). at = Mitte der Öffnung am Wegrand (Oberkante),
  // yaw = Richtung nach aussen. In der Wegwand muss dort eine Lücke sein.
  // {type:'nische', at, yaw, width?, depth?, walls?, surface?}
  nische: {
    solids(d) {
      const yaw = (d.yaw || 0) * DEG, q = quatYawPitch(yaw, 0), out = fwdOf(yaw), side = rightOf(yaw);
      const w = d.width ?? 2.5, dp = d.depth ?? 3.5, h = d.walls ?? 0.8;
      const res = [{ pos: add(add(d.at, scale(out, dp / 2)), [0, -0.5, 0]), half: [w / 2, 0.5, dp / 2], quat: q, look: d.look || d.surface || 'floor', surface: d.surface }];
      // Seitenwände enden an der Rückwand (keine Überlappung -> kein Flimmern an den Ecken)
      for (const k of [-1, 1]) res.push({ pos: add(add(add(d.at, scale(out, dp / 2)), scale(side, k * (w / 2 + 0.2))), [0, h / 2, 0]), half: [0.2, h / 2, dp / 2], quat: q, look: 'wall' });
      res.push({ pos: add(add(d.at, scale(out, dp + 0.2)), [0, h / 2, 0]), half: [w / 2 + 0.4, h / 2, 0.2], quat: q, look: 'wall' });
      return res;
    }
  },

  // Stern zum Sammeln. r = Sammelradius (Standard 1.1). {type:'stern', at, bonus?:true, r?}
  stern: {
    init(el, g) { g.st.starTotal++; },
    reset(el) { el.got = false; },
    step(el, g, h, ev) {
      const p = g.ball.position, s = el.at;
      if (!el.got && Math.hypot(p.x - s[0], p.y - s[1], p.z - s[2]) < (el.r ?? 1.1)) { el.got = true; g.st.stars++; ev.push(el.bonus ? 'bonus' : 'star'); }
    },
    view(el, v) {
      const m = new v.THREE.Mesh(v.starGeo, el.bonus ? v.mats.bonusStar : v.mats.star);
      m.position.set(...el.at); v.scene.add(m);
      return { tick(dt) { m.visible = !el.got; m.rotation.y += dt * (el.bonus ? 4 : 2); } };
    }
  },

  // Checkpoint: Zone auf einer Fläche (at = Punkt auf der Oberfläche, dort wird neu gestartet).
  // side = Figur nur rechts (1) oder links (-1) vom Weg (sonst dort, wo Platz ist), figur = andere Figur als die der Welt
  // {type:'checkpoint', at, size?:[b,h,t], yaw?, side?, figur?}
  checkpoint: {
    init(el, g) { el.order = g.checkpoints.push(el) - 1; },
    reset(el) { el.active = false; },
    step(el, g, h, ev) {
      if (el.order <= g.st.cp) return;
      const size = el.size || [6, 3, 3];
      const l = toLocal(ballPos(g), el.at, (el.yaw || 0) * DEG);
      if (Math.abs(l[0]) < size[0] / 2 && l[1] > 0 && l[1] < size[1] && Math.abs(l[2]) < size[2] / 2) {
        for (const c of g.checkpoints) if (c.order <= el.order) c.active = true;
        g.st.cp = el.order; ev.push('cp');
      }
    },
    // Zielband und Figur je Welt (src/checkpoint-figuren.js), nur Grafik
    view(el, v) { return buildCheckpoint(v, el, TYPES); }
  },

  // Trampolin: Rechteck auf dem Boden. {type:'trampolin', at, size:[b,t], yaw?, jump?, push?, tempo?}
  // push = Schwung in Blickrichtung des Trampolins; tempo = fester Schwung (egal wie schnell man kommt).
  trampolin: {
    reset(el) { el.cool = 0; },
    step(el, g, h, ev) {
      el.cool -= h;
      const p = g.ball.position, v = g.ball.velocity, yaw = (el.yaw || 0) * DEG;
      const l = toLocal([p.x, p.y, p.z], el.at, yaw);
      if (el.cool <= 0 && Math.abs(l[0]) < el.size[0] / 2 && Math.abs(l[2]) < el.size[1] / 2 && l[1] < R + 0.15 && l[1] > R - 0.4) {
        const f = [-Math.sin(yaw), -Math.cos(yaw)];          // Vorwärtsrichtung (x, z)
        const al = v.x * f[0] + v.z * f[1];
        const px = v.x - al * f[0], pz = v.z - al * f[1];
        const fw = el.tempo ?? (Math.max(0, al) + (el.push ?? 4)); // tempo = fester Absprung nach vorne
        v.set(px * 0.3 + f[0] * fw, el.jump ?? 11, pz * 0.3 + f[1] * fw);
        el.cool = 0.5; ev.push('jump');
      }
    },
    view(el, v) {
      const m = new v.THREE.Mesh(new v.THREE.BoxGeometry(el.size[0], 0.06, el.size[1]), v.mats.pad);
      m.position.set(el.at[0], el.at[1] + 0.03, el.at[2]); m.rotation.y = (el.yaw || 0) * DEG; v.scene.add(m);
    }
  },

  // Beschleunigungsstreifen: gibt Schwung in seine Richtung. {type:'turbo', at, size?:[b,t], yaw?, speed?}
  turbo: {
    reset(el) { el.cool = 0; },
    step(el, g, h, ev) {
      el.cool -= h;
      const yaw = (el.yaw || 0) * DEG, size = el.size || [3, 2], v = g.ball.velocity;
      const l = toLocal(ballPos(g), el.at, yaw);
      if (Math.abs(l[0]) < size[0] / 2 && Math.abs(l[2]) < size[1] / 2 && l[1] < R + 0.3) {
        const f = fwdOf(yaw), al = v.x * f[0] + v.z * f[2], sp = el.speed ?? 12;
        if (al < sp) { v.x += f[0] * (sp - al); v.z += f[2] * (sp - al); }
        if (el.cool <= 0) ev.push('turbo');
        el.cool = 0.6;
      }
    },
    view(el, v) {
      const T = v.THREE, size = el.size || [3, 2];
      const tex = v.arrowTexture(); tex.repeat.set(1, size[1] / 1.2);
      const m = new T.Mesh(new T.PlaneGeometry(size[0], size[1]), new T.MeshBasicMaterial({ map: tex }));
      m.rotation.order = 'YXZ'; m.rotation.y = (el.yaw || 0) * DEG; m.rotation.x = -Math.PI / 2;
      m.position.set(el.at[0], el.at[1] + 0.02, el.at[2]); v.scene.add(m);
      return { tick(dt) { tex.offset.y = (tex.offset.y - dt * 1.5) % 1; } };
    }
  },

  // Bewegte Plattform: pendelt zwischen from und to (Mitte der Oberkante).
  // {type:'plattform', from, to, size:[b,t], yaw?, time?:Fahrzeit s, pause?:s, rim?:Randhöhe, surface?, offset?:Startverzögerung s}
  plattform: {
    init(el, g) {
      const size = el.size || [4, 4];
      el.body = kinematicBody(g, boardParts(size[0], size[1], 0.5, el.rim ?? 0.4, 'platform'), el.surface);
      const yaw = (el.yaw || 0) * DEG;
      el.body.quaternion.set(...quatYawPitch(yaw, 0));
      el.body.userData = { surface: el.surface, track: null, yaw };
      el.lastV = [0, 0, 0];
    },
    reset(el) {
      el.t = el.offset || 0; el.body.position.set(...TYPES.plattform.posAt(el, el.t)); el.body.velocity.set(0, 0, 0); el.lastV = [0, 0, 0];
    },
    posAt(el, t) {
      const move = el.time ?? 3, pause = el.pause ?? 1.5, per = 2 * (move + pause), u = t % per;
      if (u < pause) return el.from;
      if (u < pause + move) return lerp3(el.from, el.to, ease((u - pause) / move));
      if (u < 2 * pause + move) return el.to;
      return lerp3(el.to, el.from, ease((u - 2 * pause - move) / move));
    },
    pre(el, g, h) {
      el.t += h;
      driveTo(el.body, TYPES.plattform.posAt(el, el.t), h);
      // Murmel mitnehmen: gleiche Geschwindigkeitsänderung wie die Plattform (waagrecht)
      const v = el.body.velocity;
      if (g.groundBody === el.body) { g.ball.velocity.x += v.x - el.lastV[0]; g.ball.velocity.z += v.z - el.lastV[2]; }
      el.lastV = [v.x, v.y, v.z];
    },
    view(el, v) { return v.bodyGroup(el.body); }
  },

  // Wippe: Brett, das sich um die Mitte (at, Oberkante) dreht. Am Anfang ist die Einfahrt unten;
  // fährt die Murmel über die Mitte, kippt die Wippe nach vorne.
  // {type:'wippe', at, size:[b, länge], yaw?, angle?:Grad, rim?}
  wippe: {
    init(el, g) {
      const size = el.size || [4, 8];
      el.body = kinematicBody(g, boardParts(size[0], size[1], 0.4, el.rim ?? 0.5, 'seesaw'), el.surface);
      el.yaw = (el.yaw || 0) * DEG;
      el.body.position.set(...el.at);
      el.body.userData = { surface: el.surface, track: { yaw: el.yaw, mid: el.at, right: rightOf(el.yaw) } };
    },
    reset(el) { el.max = (el.angle ?? 10) * DEG; el.a = el.max; el.target = el.max; el.away = 0; },
    pre(el, g, h) {
      if (g.groundBody === el.body) {
        el.away = 0;
        if (toLocal(ballPos(g), el.at, el.yaw)[2] < 0) el.target = -el.max;
      } else if ((el.away += h) > 1.2) el.target = el.max;
      const rate = 50 * DEG, w = Math.max(-rate, Math.min(rate, (el.target - el.a) / h));
      el.body.quaternion.set(...quatYawPitch(el.yaw, el.a));
      el.body.angularVelocity.set(...scale(rightOf(el.yaw), w));
      el.a += w * h;
    },
    view(el, v) {
      const T = v.THREE, g0 = v.bodyGroup(el.body);
      const foot = new T.Mesh(new T.CylinderGeometry(0.1, 0.6, 3, 12), v.mats.pole);
      foot.position.set(el.at[0], el.at[1] - 1.9, el.at[2]); v.scene.add(foot);
      return g0;
    }
  },

  // Schalter am Boden: einmal drüberrollen schaltet ihn ein. {type:'schalter', at, id}
  schalter: {
    reset(el, g) { el.on = false; },
    step(el, g, h, ev) {
      const p = g.ball.position, a = el.at;
      if (!el.on && Math.hypot(p.x - a[0], p.z - a[2]) < 1.0 && Math.abs(p.y - a[1] - R) < 0.6) {
        el.on = true; g.switches[el.id] = true; ev.push('click');
      }
    },
    view(el, v) {
      const T = v.THREE;
      const base = new T.Mesh(new T.CylinderGeometry(0.9, 1.0, 0.1, 24), v.mats.pole);
      base.position.set(el.at[0], el.at[1] + 0.05, el.at[2]);
      const btnMat = new T.MeshLambertMaterial({ color: 0xE53935, emissive: 0x400000 });
      const btn = new T.Mesh(new T.CylinderGeometry(0.6, 0.6, 0.25, 24), btnMat);
      btn.position.set(el.at[0], el.at[1] + 0.2, el.at[2]);
      v.scene.add(base, btn);
      return { tick() { btn.position.y = el.at[1] + (el.on ? 0.1 : 0.2); btnMat.color.setHex(el.on ? 0x3BB273 : 0xE53935); btnMat.emissive.setHex(el.on ? 0x0a3a1a : 0x400000); } };
    }
  },

  // Brücke, die hochfährt, sobald der Schalter mit gleicher id gedrückt ist.
  // {type:'bruecke', from, to, width?, walls?, id, drop?:m unter der Endlage}
  bruecke: {
    init(el, g) {
      const s = segment(el.from, el.to), w = el.width ?? 4;
      el.seg = s;
      el.body = kinematicBody(g, boardParts(w, s.L, 0.6, el.walls ?? 0.6, 'bridge'), el.surface);
      el.body.quaternion.set(...s.q);
      el.body.userData = { surface: el.surface, track: track(s) };
    },
    reset(el) {
      el.k = 0; el.body.position.set(...add(el.seg.mid, [0, -(el.drop ?? 6), 0])); el.body.velocity.set(0, 0, 0);
    },
    pre(el, g, h) {
      if (g.switches[el.id]) el.k = Math.min(1, el.k + h / 1.5);
      driveTo(el.body, add(el.seg.mid, [0, -(el.drop ?? 6) * (1 - ease(el.k)), 0]), h);
    },
    step(el, g, h, ev) { if (el.k >= 1 && !el.up) { el.up = true; ev.push('bridge'); } if (el.k < 1) el.up = false; },
    view(el, v) { return v.bodyGroup(el.body); }
  },

  // Ziel-Ring. {type:'ziel', at, r?}
  ziel: {
    reset(el) { el.done = false; },
    step(el, g, h, ev) {
      const p = g.ball.position, a = el.at, r = el.r ?? 1.2;
      if (!el.done && !g.st.won && Math.hypot(p.x - a[0], p.z - a[2]) < r && p.y < a[1] + 1.2 && p.y > a[1] - 1) {
        el.done = true; g.st.won = true; ev.push('win');
      }
    },
    view(el, v) {
      const T = v.THREE, r = el.r ?? 1.2;
      const ring = new T.Mesh(new T.TorusGeometry(r, 0.15, 12, 40), v.mats.goal);
      ring.rotation.x = -Math.PI / 2; ring.position.set(el.at[0], el.at[1] + 0.05, el.at[2]);
      const flag = new T.Mesh(new T.ConeGeometry(0.5, 1, 3), v.mats.goalFlag);
      flag.position.set(el.at[0], el.at[1] + 2.2, el.at[2]);
      v.scene.add(ring, flag); v.goal = ring;
      return { tick(dt) { flag.rotation.y += dt; } };
    }
  }
};

// Für Tests/Werkzeuge: Endpunkt und Endrichtung einer Kurve berechnen
export function kurveEnde(d) {
  const h0 = (d.yaw || 0) * DEG, T = Math.abs(d.turn) * DEG, s = Math.sign(d.turn), r = d.radius ?? 5;
  const R0 = rightOf(h0), F0 = fwdOf(h0), C = add(d.at, scale(R0, s * r));
  const end = add(C, add(scale(R0, -s * Math.cos(T) * r), scale(F0, Math.sin(T) * r)));
  return { at: add(end, [0, d.rise || 0, 0]), yaw: (d.yaw || 0) - s * Math.abs(d.turn) };
}
