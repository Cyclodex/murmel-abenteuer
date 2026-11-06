// Werkstatt: Schraubstock (Tor, das auf- und zugeht und quetscht) und Messband (Rollmeter, dessen Band über die Lücke ausfährt).
// Gleiche Schnittstelle wie in elements.js.
import { DEG, quatYawPitch, add, scale, toLocal, fwdOf, rightOf } from './math.js';
import { TYPES, segment, track, kinematicBody, boardParts, driveTo, ballPos } from './elements.js';
import { canvasTex } from './themes.js';
import { immer } from './takt.js';

const R = 0.5;
const ZU = 0.2;     // so weit bleiben die Backen des Schraubstocks zu noch auseinander
const HAUS = 3;     // Rollmeter: Länge des Gehäuses hinter dem Bandaustritt
const BAND_TH = 0.3; // Rollmeter: Dicke des tragenden Bands

export const WERKSTATT = {
  // Schraubstock quer über dem Weg: auf einer Seite die feste Backe, auf der anderen die bewegliche. Sie fährt im Takt zu und
  // wieder auf (wie Plattform und Schieber: pause offen, time zufahren, pause zu, time auffahren). Wer beim Zufahren
  // dazwischen ist, wird zur festen Backe geschoben und zerquetscht (zurück zum Checkpoint).
  // at = Mitte der Durchfahrt (Oberkante des Wegs), yaw = Wegrichtung, weit = Abstand der Backen offen,
  // size = Backe [dick (quer), hoch, lang (längs)], time = s zum Zu-/Auffahren, pause = s offen/zu, offset = Startverzögerung,
  // seite = 1: bewegliche Backe rechts (Standard), -1: links
  // time/pause als Zahl oder Liste (jeder Halt mit der folgenden Fahrt ist ein Zyklus, src/takt.js).
  // Autopilot: wait ['frei', 'schraubstock', n, rest] = die Backen bleiben die nächsten rest s weit genug offen.
  // {type:'schraubstock', at, yaw?, weit?, size?, time?, pause?, offset?, seite?}
  schraubstock: {
    // Masse: [dick, hoch, lang], Öffnung, Seite, yaw (Bogenmass)
    mass(d) { return { size: d.size || [1.2, 1.6, 2.4], weit: d.weit ?? 3, s: d.seite ?? 1, yw: (d.yaw || 0) * DEG }; },
    solids(d) {
      const { size: [dk, h, l], weit, s, yw } = WERKSTATT.schraubstock.mass(d);
      // feste Backe (Grafik in view)
      return [{ pos: add(add(d.at, scale(rightOf(yw), -s * (weit / 2 + dk / 2))), [0, h / 2, 0]), half: [dk / 2, h / 2, l / 2], quat: quatYawPitch(yw, 0), look: 'wall', hide: true }];
    },
    init(el, g) {
      const { size: [dk, h, l], weit, s, yw } = WERKSTATT.schraubstock.mass(el), r = rightOf(yw);
      el.time = el.time ?? 1.2; el.pause = el.pause ?? 2.5; // auch für die Wartebedingung 'phase' des Autopiloten
      el.from = add(el.at, scale(r, s * (weit / 2 + dk / 2)));       // offen
      el.to = add(el.at, scale(r, s * (-weit / 2 + dk / 2 + ZU)));   // zu
      el.body = kinematicBody(g, [{ half: [dk / 2, h / 2, l / 2], off: [0, h / 2, 0], look: 'wall' }]);
      el.body.quaternion.set(...quatYawPitch(yw, 0));
      el.body.userData = {};
    },
    // Abstand der Backen, wenn die bewegliche bei p steht
    spalt(el, p) {
      const { size: [dk], weit, s, yw } = WERKSTATT.schraubstock.mass(el);
      return s * toLocal(p, el.at, yw)[0] - dk / 2 + weit / 2;
    },
    frei: (el, rest) => immer(rest, s => WERKSTATT.schraubstock.spalt(el, TYPES.plattform.posAt(el, el.t + s)) > 2 * R + 0.6),
    reset(el) {
      el.t = el.offset || 0;
      const p = TYPES.plattform.posAt(el, el.t);
      el.body.position.set(...p); el.body.velocity.set(0, 0, 0); el.spalt = WERKSTATT.schraubstock.spalt(el, p);
    },
    pre(el, g, h) {
      el.t += h;
      const p = TYPES.plattform.posAt(el, el.t), sp = WERKSTATT.schraubstock.spalt(el, p);
      driveTo(el.body, p, h);
      // Backen fahren zu und die Murmel passt nicht mehr dazwischen: zerquetscht
      if (sp < el.spalt && sp < 2 * R + 0.1 && !g.squashT) {
        const { size: [, hh, l], weit, s, yw } = WERKSTATT.schraubstock.mass(el), b = toLocal(ballPos(g), el.at, yw), x = s * b[0];
        if (x > -weit / 2 - 0.1 && x < -weit / 2 + sp + 0.1 && Math.abs(b[2]) < l / 2 + 0.2 && b[1] > 0 && b[1] < hh + R) g.squash();
      }
      el.spalt = sp;
    },
    view(el, v) {
      const T = v.THREE, { size: [dk, h, l], weit, s, yw } = WERKSTATT.schraubstock.mass(el);
      const blau = new T.MeshPhongMaterial({ color: 0x1E6FB8, shininess: 70 }), stahl = new T.MeshPhongMaterial({ color: 0xC3CAD1, shininess: 140, specular: 0xffffff });
      const dunkel = new T.MeshPhongMaterial({ color: 0x37474F, shininess: 60 });
      const box = (m, b, hh, t, x, y, z = 0) => { const o = new T.Mesh(new T.BoxGeometry(b, hh, t), m); o.position.set(x, y, z); o.castShadow = true; return o; };
      // Backe: Körper (reicht seitlich am Weg hinunter) und Stahlplatte innen; innen = Richtung der anderen Backe (lokal x)
      const backe = innen => { const b = new T.Group(); b.add(box(blau, dk, h + 1.2, l, 0, h / 2 - 0.6), box(stahl, 0.14, h * 0.5, l + 0.04, innen * (dk / 2 + 0.02), h * 0.72)); return b; };
      const root = new T.Group(); root.position.set(...el.at); root.rotation.y = yw; v.scene.add(root);
      const fest = backe(s); fest.position.x = -s * (weit / 2 + dk / 2); root.add(fest);
      // bewegliche Backe mit Spindel und Knebel; die Spindel läuft durch den Bock aussen
      const los = backe(-s), spL = weit + 2.4;
      const spindel = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, spL, 12), stahl); spindel.rotation.z = Math.PI / 2; spindel.position.set(s * (dk / 2 + spL / 2), h * 0.4, 0);
      const knebel = new T.Group(); knebel.position.set(s * (dk / 2 + spL - 0.3), h * 0.4, 0);
      const stab = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 2.2, 8), stahl); knebel.add(stab);
      for (const y of [-1.1, 1.1]) { const k = new T.Mesh(new T.SphereGeometry(0.16, 10, 8), stahl); k.position.y = y; knebel.add(k); }
      los.add(spindel, knebel); root.add(los);
      root.add(box(blau, 0.9, h * 0.8 + 1.2, 1.4, s * (weit / 2 + dk + 1), h * 0.4 - 0.6), box(dunkel, weit + 2 * dk + 1.6, 0.5, l * 0.5, s * 0.75, -1.25));
      return {
        tick() {
          const x = toLocal([el.body.position.x, 0, el.body.position.z], el.at, yw)[0];
          los.position.x = x; knebel.rotation.x = x * 3;
        }
      };
    }
  },

  // Messband (Rollmeter): Das Gehäuse steht hinter from auf dem Boden (dort ist es im Weg), das gelbe Band fährt nach to aus,
  // sobald der Schalter mit gleicher id gedrückt ist. Es trägt erst, wenn der Haken drüben einhängt (Ereignis 'bridge').
  // from = Bandaustritt (Mitte, Oberkante des Bodens), to = Ende des ausgefahrenen Bands, time = s zum Ausfahren,
  // kante = so viele Meter liegt das Band ab from noch auf dem Boden (dort nur Grafik); erst danach trägt es und hat einen
  // leicht hochgewölbten Rand (rand = Höhe).
  // {type:'messband', from, to, width?, id, time?, kante?, rand?}
  messband: {
    solids(d) {
      const s = segment(d.from, d.to), w = d.width ?? 3.5, f = fwdOf(s.yaw);
      // Gehäuse (Grafik in view)
      return [{ pos: add(add(d.from, scale(f, -HAUS / 2)), [0, 1.6, 0]), half: [w / 2 + 0.3, 1.6, HAUS / 2], quat: quatYawPitch(s.yaw, 0), look: 'wall', hide: true }];
    },
    init(el, g) {
      const s = segment(el.from, el.to), w = el.width ?? 3.5, k = Math.min(el.kante ?? 0, s.L - 1), fwd = scale([el.to[0] - el.from[0], el.to[1] - el.from[1], el.to[2] - el.from[2]], 1 / s.L);
      el.seg = s; el.ab = k;
      el.body = kinematicBody(g, boardParts(w, s.L - k, BAND_TH, el.rand ?? 0.3, 'bridge'));
      el.body.quaternion.set(...s.q);
      el.body.position.set(...add(el.from, scale(fwd, k + (s.L - k) / 2)));
      el.body.userData = { track: track(s) };
    },
    reset(el) { el.k = 0; el.up = false; el.body.collisionFilterGroup = 0; },
    pre(el, g, h) { if (g.switches[el.id]) el.k = Math.min(1, el.k + h / (el.time ?? 1.5)); },
    step(el, g, h, ev) {
      // eingehängt: jetzt trägt das Band (vorher ist der Körper ohne Kollisionsgruppe, also für Murmel und Strahlen nicht da)
      if (el.k >= 1 && !el.up) { el.up = true; el.body.collisionFilterGroup = 1; ev.push('bridge'); }
    },
    view(el, v) {
      const T = v.THREE, s = el.seg, w = el.width ?? 3.5, L = s.L, rand = el.rand ?? 0.3;
      const gelb = new T.MeshPhongMaterial({ color: 0xFDD835, shininess: 80 }), schwarz = new T.MeshPhongMaterial({ color: 0x2B2B2B, shininess: 60 });
      const stahl = new T.MeshPhongMaterial({ color: 0xC3CAD1, shininess: 140, specular: 0xffffff });
      const box = (m, b, hh, t, x, y, z) => { const o = new T.Mesh(new T.BoxGeometry(b, hh, t), m); o.position.set(x, y, z); o.castShadow = true; return o; };
      // Gehäuse: steht hinter from, waagrecht ausgerichtet
      const haus = new T.Group(); haus.position.set(...el.from); haus.rotation.y = s.yaw; v.scene.add(haus);
      const rund = new T.Mesh(new T.CylinderGeometry(1.6, 1.6, w + 0.6, 28), gelb); rund.rotation.z = Math.PI / 2; rund.position.set(0, 1.6, HAUS - 1.6); rund.castShadow = true;
      const knopf = new T.Mesh(new T.CylinderGeometry(0.8, 0.8, w + 0.7, 20), schwarz); knopf.rotation.z = Math.PI / 2; knopf.position.copy(rund.position);
      v.blocker(rund); // steht die Murmel dahinter, rückt die Kamera näher
      haus.add(rund, knopf, box(gelb, w + 0.6, 1.7, HAUS - 1.5, 0, 0.85, (HAUS - 1.5) / 2), box(schwarz, w + 0.2, 0.5, 0.2, 0, 0.5, -0.02), box(schwarz, 1.2, 0.5, 0.9, 0, 3.2, HAUS - 1.6));
      // Band: Zentimeter-Striche, wächst aus dem Gehäuse (lokal -z = Richtung to); Striche wandern mit der Spitze mit
      const tex = canvasTex(T, 128, 128, (x, cw, ch) => {
        x.fillStyle = '#FDD835'; x.fillRect(0, 0, cw, ch); x.fillStyle = '#2B2B2B';
        for (let i = 0; i < 8; i++) { const lang = i % 4 === 0 ? 46 : i % 2 === 0 ? 30 : 18; x.fillRect(0, i * 16, lang, 2); x.fillRect(cw - lang, i * 16, lang, 2); }
        x.fillStyle = '#C62828'; x.font = '700 30px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('1', cw / 2, 32); x.fillText('2', cw / 2, 96);
      });
      const bandGeo = new T.PlaneGeometry(w, 1).rotateX(-Math.PI / 2).translate(0, 0, -0.5); // v = 1 an der Spitze (-z), v = 0 hinten
      const band = new T.Mesh(bandGeo, new T.MeshLambertMaterial({ map: tex, side: T.DoubleSide })); band.position.y = 0.03; band.receiveShadow = true;
      const haken = new T.Group(); haken.add(box(stahl, w * 0.5, 0.1, 0.5, 0, 0.09, 0.2), box(stahl, w * 0.5, 0.5, 0.1, 0, -0.14, -0.05));
      // hochgewölbter Rand dort, wo das Band trägt
      const kante = [-1, 1].map(k => { const o = new T.Mesh(new T.BoxGeometry(0.3, rand, 1).translate(0, rand / 2, -0.5), gelb); o.position.x = k * (w / 2 + 0.15); return o; });
      const aus = new T.Group(); aus.position.set(...el.from); aus.quaternion.set(...s.q); aus.add(band, haken, ...kante); v.scene.add(aus);
      return {
        tick() {
          const len = Math.max(0.01, L * el.k), rep = len / 2;
          band.scale.z = len; tex.repeat.set(1, rep); tex.offset.y = -rep;
          haken.position.z = -len;
          kante.forEach(o => { const l = len - el.ab; o.visible = l > 0.05; o.position.z = -el.ab; o.scale.z = Math.max(0.01, l); });
        }
      };
    }
  }
};
