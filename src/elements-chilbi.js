// Chilbi: Riesenrad mit Gondeln, die die Murmel hinauftragen. Gleiche Schnittstelle wie in elements.js.
import { DEG, quatYawPitch, add, scale, lerp3, fwdOf, rightOf, ease } from './math.js';
import { kinematicBody, boardParts, driveTo, norm } from './elements.js';
import { nimm, hatListe, zyklen, plan, wo } from './takt.js';

const TAU = Math.PI * 2;
const GONDEL_FARBEN = [0xE53935, 0xFDD835, 0x1E88E5, 0x43A047, 0xFB8C00, 0x8E24AA, 0x00ACC1, 0xEC407A];
const LAMPEN = [0xFFE082, 0xFF5A8A, 0x80D8FF, 0xB9F6CA];

export const CHILBI = {
  // Riesenrad: Gondeln (waagrechte Böden mit Rand links und rechts, vorne und hinten offen) hängen an einem Rad, das sich
  // in Schritten dreht: jede Gondel fährt einen Platz weiter und hält dann (pause), wie beim Ein- und Aussteigen am echten
  // Riesenrad. Die Gondeln bleiben waagrecht und nehmen die Murmel mit.
  // at = Boden der untersten Gondel (Mitte, Oberkante) = Einstieg, yaw = Fahrtrichtung der Murmel durch das Rad (= Achse),
  // radius, gondeln = Anzahl = Anzahl Plätze (Platz 0 unten, gondeln / 2 oben auf at + 2 · radius, dazwischen alle
  // 360 / gondeln Grad), size = [breit, tief] des Gondelbodens, time = s pro Schritt, pause = s Halt,
  // dir = 1: unten nach rechts weg und rechts hinauf, -1: links hinauf; offset = Startverzögerung, rim = Randhöhe.
  // Einsteigen von vorne am untersten Platz, hinaus nach hinten an jedem Platz: Wege bis an die Gondel legen (tief / 2 von
  // der Mitte des Platzes), auf gleicher Höhe. Rad und Stützen stehen vorne, hinter dem Rad ist alles frei.
  // Autopilot: einsteigen mit wait: ['phase', ['riesenrad', 0, 0, 0.2]] (Rad steht noch lange genug),
  // aussteigen mit wait: ['gondel', [0, platz]] (die Gondel mit der Murmel steht am Platz).
  // time/pause auch als Liste (Schritt k nimmt liste[k % länge], src/takt.js): das Rad hält mal kürzer, mal länger.
  // Autopilot: wait ['frei', 'riesenrad', n, rest] = das Rad steht noch mindestens rest s.
  // {type:'riesenrad', at, yaw?, radius?, gondeln?, size?, time?, pause?, dir?, offset?, rim?}
  riesenrad: {
    geo(d) {
      const yaw = (d.yaw || 0) * DEG, r = d.radius ?? 5, [b, t] = d.size || [3.2, 4];
      const G = { yaw, r, n: d.gondeln ?? 6, b, t, Rt: rightOf(yaw), F: fwdOf(yaw), C: add(d.at, [0, r, 0]), dir: d.dir ?? 1, time: d.time ?? 2.2, pause: d.pause ?? 2.6 };
      if (hatListe(d.time, d.pause)) G.plan = plan(zyklen(1, d.time, d.pause), k => nimm(d.time, k, 2.2) + nimm(d.pause, k, 2.6));
      return G;
    },
    // Stand des Rads zur Zeit t: k = ganze Schritte, frac = Anteil des laufenden Schritts (0 = steht), halt = s, die es noch steht
    takt(el, t) {
      if (el.G.plan) {
        const { k, u } = wo(el.G.plan, t), time = nimm(el.time, k, 2.2), pause = nimm(el.pause, k, 2.6);
        return u < pause ? { k, frac: 0, halt: pause - u } : { k, frac: ease((u - pause) / time), halt: 0 };
      }
      const { time, pause } = el.G, per = time + pause, k = Math.floor(t / per), u = t - k * per;
      return u < pause ? { k, frac: 0, halt: pause - u } : { k, frac: ease((u - pause) / time), halt: 0 };
    },
    // Boden der Gondel (Mitte, Oberkante), die s Plätze (auch Bruchteile) vom untersten Platz entfernt ist
    ort(el, s) {
      const { r, n, Rt, C, dir } = el.G, a = s * TAU / n;
      return add(C, add(scale(Rt, dir * Math.sin(a) * r), [0, -Math.cos(a) * r, 0]));
    },
    init(el, g) {
      const G = el.G = CHILBI.riesenrad.geo(el);
      el.per = G.plan ? G.plan.per : G.time + G.pause; // für die Wartebedingung 'phase' des Autopiloten: Phase 0 = Rad hält an
      el.bodies = [];
      for (let i = 0; i < G.n; i++) {
        const b = kinematicBody(g, boardParts(G.b, G.t, 0.5, el.rim ?? 0.5, 'gondel'));
        b.quaternion.set(...quatYawPitch(G.yaw, 0));
        b.userData = {};
        el.bodies.push(b);
      }
    },
    reset(el) {
      const { k } = CHILBI.riesenrad.takt(el, el.offset || 0);
      el.t = 0; el.mit = -1; el.platz = -1; el.halt = 0; el.away = 9;
      el.bodies.forEach((b, i) => { b.position.set(...CHILBI.riesenrad.ort(el, k + i)); b.velocity.set(0, 0, 0); b.lastV = [0, 0, 0]; });
    },
    frei: (el, rest) => CHILBI.riesenrad.takt(el, el.t + (el.offset || 0)).halt >= rest,
    pre(el, g, h) {
      el.t += h;
      const { k, frac, halt } = CHILBI.riesenrad.takt(el, el.t + (el.offset || 0)), n = el.G.n;
      el.halt = halt; el.mit = -1; el.platz = -1;
      el.bodies.forEach((b, i) => {
        driveTo(b, CHILBI.riesenrad.ort(el, k + frac + i), h);
        const v = b.velocity, l = b.lastV;
        if (g.groundBody === b) {
          // Murmel mitnehmen: gleiche Geschwindigkeitsänderung wie die Gondel (wie bei der Plattform), dazu nach unten:
          // sinkt die Gondel schneller weg, als die Murmel fällt (leichte Murmeln), hebt sie sonst ab und hüpft
          g.ball.velocity.x += v.x - l[0]; g.ball.velocity.z += v.z - l[2];
          if (v.y < l[1]) g.ball.velocity.y += v.y - l[1];
          el.mit = i; el.platz = ((k + i) % n + n) % n;
        }
        b.lastV = [v.x, v.y, v.z];
      });
      el.away = el.mit < 0 ? el.away + h : 0;
    },
    view(el, v) {
      const T = v.THREE, { yaw, r, n, b, t, C, dir } = el.G, rim = el.rim ?? 0.5, HANG = 2.6; // Aufhängung so hoch über dem Gondelboden
      const M = (color, extra) => new T.MeshPhongMaterial({ color, shininess: 60, ...extra });
      const weiss = M(0xF5F5F5), stahl = M(0xB0BEC5, { shininess: 120 }), UP = new T.Vector3(0, 1, 0);
      // Stab von a nach b (lokale Koordinaten der Gruppe)
      const stab = (grp, a, c, rad, m) => {
        const A = new T.Vector3(...a), B = new T.Vector3(...c), d = B.clone().sub(A), L = d.length();
        const s = new T.Mesh(new T.CylinderGeometry(rad, rad, L, 8), m);
        s.position.copy(A).addScaledVector(d, 0.5); s.quaternion.setFromUnitVectors(UP, d.divideScalar(L)); grp.add(s); return s;
      };
      // Gestell und Rad: lokal x = in der Radebene nach rechts, z = Achse (+z = vorne, wo die Murmel herkommt); Mitte = Höhe
      // der Aufhängungen. Rad und Stützen stehen nur vorne (einseitig gelagert wie ein modernes Aussichtsrad), die Gondeln
      // hängen an Achsen nach hinten: hinter dem Rad ist an jedem Platz frei für den Weg hinaus.
      const root = new T.Group(); root.position.set(C[0], C[1] + HANG, C[2]); root.quaternion.set(...quatYawPitch(yaw, 0)); v.scene.add(root);
      const rad = new T.Group(); root.add(rad);
      const lampen = LAMPEN.map(c => new T.MeshBasicMaterial({ color: c })), kugel = new T.SphereGeometry(0.16, 8, 6), z = t / 2 + 0.4;
      for (const [rr, dick] of [[r, 0.14], [r * 0.5, 0.08]]) { const ring = new T.Mesh(new T.TorusGeometry(rr, dick, 8, 64), weiss); ring.position.z = z; rad.add(ring); }
      for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n; stab(rad, [0, 0, z], [Math.sin(a) * r, -Math.cos(a) * r, z], 0.06, stahl); } // Speichen
      for (let i = 0; i < n * 4; i++) { // Lämpchen am Rad
        const a = (i + 0.5) * Math.PI / (n * 2), m = new T.Mesh(kugel, lampen[i % lampen.length]);
        m.position.set(Math.sin(a) * r, -Math.cos(a) * r, z + 0.18); rad.add(m);
      }
      for (let i = 0; i < n; i++) { const a = i * TAU / n; stab(rad, [Math.sin(a) * r, -Math.cos(a) * r, z], [Math.sin(a) * r, -Math.cos(a) * r, -(t / 2 - 0.1)], 0.08, stahl); } // Achsen der Gondeln
      stab(rad, [0, 0, z - 0.3], [0, 0, z + 0.9], 0.45, stahl); // Nabe
      const kappe = new T.Mesh(new T.CylinderGeometry(1, 1, 0.12, 24), M(0xE53935)); kappe.rotation.x = Math.PI / 2; kappe.position.z = z + 0.95; rad.add(kappe);
      // Stützen: am Einstieg unten so weit auseinander, dass der Weg zwischen ihnen durchpasst
      const floorY = (v.game.level.killY ?? -8) - 1, tief = C[1] + HANG - floorY, breit = (b / 2 + 1.6) * tief / (r + HANG), blau = M(0x1E88E5);
      for (const k of [-1, 1]) {
        stab(root, [0, 0, z + 0.6], [k * breit, -tief, z + 0.6], 0.24, blau);
        const fuss = new T.Mesh(new T.BoxGeometry(1.6, 0.4, 1.6), stahl); fuss.position.set(k * breit, -tief + 0.2, z + 0.6); root.add(fuss);
      }
      // Gondeln: Wanne (Boden und Rand wie die Physik), Bügel bis zur Aufhängung, Dach
      const gondeln = el.bodies.map((body, i) => {
        const g = new T.Group(), farbe = M(GONDEL_FARBEN[i % GONDEL_FARBEN.length]);
        const boden = new T.Mesh(new T.BoxGeometry(b, 0.5, t), farbe); boden.position.y = -0.25; boden.receiveShadow = true; g.add(boden);
        for (const k of [-1, 1]) {
          const wand = new T.Mesh(new T.BoxGeometry(0.3, rim + 0.5, t), weiss); wand.position.set(k * (b / 2 + 0.15), (rim - 0.5) / 2, 0); g.add(wand);
          for (const z of [-(t / 2 - 0.08), t / 2 - 0.08]) stab(g, [k * (b / 2 + 0.15), rim, z], [0, HANG, z], 0.05, stahl);
        }
        const dach = new T.Mesh(new T.CylinderGeometry(0.2, b / 2 + 0.5, 0.5, 20), farbe); dach.position.y = HANG - 0.5; g.add(dach);
        g.quaternion.set(...quatYawPitch(yaw, 0)); v.scene.add(g);
        return { g, body };
      });
      const mitte = add(C, [0, HANG, 0]), dirCam = norm(add(scale(el.G.F, -1), [0, 0.25, 0]));
      let blink = 0;
      return {
        tick(dt) {
          const { k, frac } = CHILBI.riesenrad.takt(el, el.t + (el.offset || 0));
          rad.rotation.z = dir * (k + frac) * TAU / n;
          for (const o of gondeln) o.g.position.copy(o.body.position);
          blink += dt; // Lauflicht
          const s = Math.floor(blink * 3);
          lampen.forEach((m, j) => m.color.setHex(LAMPEN[j]).multiplyScalar((j + s) % lampen.length === 0 ? 0.35 : 1));
        },
        // Fährt die Murmel mit, zeigt die Kamera von vorne das ganze Rad
        cam(p) {
          if (el.away > 0.4) return null;
          return { look: lerp3(mitte, p, 0.5), dir: dirCam, fit: r + 3.5, clear: t / 2 + 2.5 };
        }
      };
    }
  }
};
