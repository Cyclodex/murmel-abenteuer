// Physik + Spiellogik ohne Grafik. Läuft im Browser und headless (Node) mit CANNON.
import { TYPES } from './bauteile.js';
import { add } from './math.js';

export const R = 0.5;
export const G = 9.82;
export const MAX_TILT = 25 * Math.PI / 180;
export const H = 1 / 60; // fester Physikschritt
const HIT_MIN = 1.5;      // ab dieser Geschwindigkeitsänderung (m/s) klackt es
const BOUNCE_MIN = 0.8;   // ab dieser Aufprallgeschwindigkeit (m/s) prallt die Murmel ab

// Oberflächen: friction für die Physik, bounce = wie stark sie den Abprall zurückgibt (Faktor),
// grip = wie stark die Steuerung wirkt, drag = Abbremsen pro Sekunde (negativ = gleitet länger).
export const SURFACES = {
  normal: { friction: 0.4, bounce: 1, grip: 1, drag: 0 },
  eis: { friction: 0.02, bounce: 1, grip: 0.45, drag: -0.1 },
  schlamm: { friction: 0.9, bounce: 0.2, grip: 1, drag: 2.2 }
};

// Sprungkraft der Murmel: Anteil der Aufprallgeschwindigkeit, der zurückkommt (Wand / Boden),
// schwere = Faktor für die Schwerkraft nach unten (Mond < 1)
export const BALL = { wand: 0.5, boden: 0.25, schwere: 1 };

// Kollisionsgruppen: feste/bewegte Teile, Murmel, lose Teile (z. B. Dominos)
export const GRP = { fest: 1, murmel: 2, lose: 4 };
const DAMPING = 0.12;

export function createGame(CANNON, level, ballProps = BALL) {
  // Level-Physik: schwerkraft = Faktor (Weltraum < 1), wasser = Abbremsen pro Sekunde in alle Richtungen,
  // abprall = Faktor für das Abprallen (z. B. weicher Mondstaub)
  const phys = level.physik || {}, gy = G * (phys.schwerkraft ?? 1), water = phys.wasser ?? 0, bounceF = phys.abprall ?? 1;
  const world = new CANNON.World();
  world.gravity.set(0, -gy, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 12;

  const mBall = new CANNON.Material('ball');
  const surfaceMat = {};
  const matFor = name => {
    const key = SURFACES[name] ? name : 'normal';
    if (!surfaceMat[key]) {
      const s = SURFACES[key];
      surfaceMat[key] = new CANNON.Material(key);
      world.addContactMaterial(new CANNON.ContactMaterial(surfaceMat[key], mBall, { friction: s.friction, restitution: 0 }));
    }
    return surfaceMat[key];
  };

  // Wände ohne Reibung: cannon.js begrenzt Reibung nicht pro Zeitschritt (viel zu stark), die Murmel
  // würde nach dem Aufprall zwischen Wand- und Bodenreibung festklemmen.
  const np = world.narrowphase, makeFriction = np.createFrictionEquationsFromContact;
  np.createFrictionEquationsFromContact = function (c, out) {
    const made = makeFriction.call(this, c, out);
    if (made && Math.abs(c.ni.y) < 0.7) for (const f of out.slice(-2)) f.minForce = f.maxForce = 0;
    return made;
  };

  const g = {
    C: CANNON, world, level, matFor, els: [], solids: [], checkpoints: [], switches: {},
    st: { stars: 0, starTotal: 0, cp: -1, won: false },
    groundBody: null, touchBody: null, surface: SURFACES.normal, tilt: MAX_TILT, brake: 0,
    // Leichte Murmel (schwere < 1) nur in Welten mit normaler Schwerkraft; im Weltraum gilt die Level-Schwerkraft
    ballProps, G: phys.schwerkraft ? gy : gy * (ballProps.schwere ?? 1), lock: false, track: { yaw: (level.startYaw || 0) * Math.PI / 180, lateral: 0 }
  };

  level.parts.forEach((d, i) => {
    const t = TYPES[d.type];
    if (!t) throw new Error(`Level "${level.id}": unbekanntes Bauteil "${d.type}" (Teil ${i})`);
    const el = { ...d, index: i };
    g.els.push(el);
    for (const s of (t.solids ? t.solids(el) : [])) {
      g.solids.push(s);
      if (s.deko) continue;
      const body = new CANNON.Body({ mass: 0, material: matFor(s.surface), shape: new CANNON.Box(new CANNON.Vec3(...s.half)) });
      body.position.set(...s.pos);
      body.quaternion.set(...s.quat);
      body.collisionFilterGroup = GRP.fest; body.collisionFilterMask = GRP.murmel | GRP.lose;
      body.userData = s;
      world.addBody(body);
    }
  });
  for (const el of g.els) TYPES[el.type].init?.(el, g);

  const ball = new CANNON.Body({ mass: 1, material: mBall, shape: new CANNON.Sphere(R), linearDamping: DAMPING, angularDamping: 0.3 });
  ball.collisionFilterGroup = GRP.murmel; ball.collisionFilterMask = GRP.fest | GRP.lose;
  world.addBody(ball);
  g.ball = ball;

  const killY = level.killY ?? -8;
  const spawnPoint = () => add(g.st.cp < 0 ? level.start : g.checkpoints[g.st.cp].at, [0, 1, 0]);
  let acc = 0;

  g.spawn = p => {
    ball.position.set(...p); ball.velocity.set(0, 0, 0); ball.angularVelocity.set(0, 0, 0);
    g.groundBody = g.touchBody = null; g.lock = false; ball.linearDamping = DAMPING;
  };
  g.reset = () => {
    Object.assign(g.st, { stars: 0, cp: -1, won: false });
    g.switches = {}; acc = 0; g.time = 0; g.hitCool = 0.5; g.hitStrength = 0;
    g.track.yaw = (level.startYaw || 0) * Math.PI / 180;
    for (const el of g.els) TYPES[el.type].reset?.(el, g);
    g.spawn(spawnPoint());
  };

  // Welcher Körper berührt die Murmel? (Boden = Berührung von unten)
  function contacts() {
    let best = null, bestNy = -2, ground = null;
    for (const c of world.contacts) {
      let other = null, ny = 0;
      if (c.bi === ball) { other = c.bj; ny = -c.ni.y; } else if (c.bj === ball) { other = c.bi; ny = c.ni.y; }
      if (!other) continue;
      if (ny > bestNy) { bestNy = ny; best = other; }
      if (ny > 0.3) ground = other;
    }
    g.touchBody = best; g.groundBody = ground;
    const u = best && best.userData;
    if (u && u.track) {
      const tr = u.track, p = ball.position;
      g.track.yaw = tr.yaw;
      g.track.lateral = (p.x - tr.mid[0]) * tr.right[0] + (p.y - tr.mid[1]) * tr.right[1] + (p.z - tr.mid[2]) * tr.right[2];
    }
    g.surface = SURFACES[ground && ground.userData && ground.userData.surface] || SURFACES.normal;
  }

  // Abprall selbst rechnen: cannon.js schluckt fast den ganzen Rückprall (Restitution 0.8 -> ~0.3).
  // Nur bei deutlichem Aufprall (schnell genug und steil genug), damit Rollen, Kurven- und
  // Looping-Segmente oder Rampenübergänge nicht hüpfen.
  const tmpV = new CANNON.Vec3(), tmpP = new CANNON.Vec3();
  function bounce(vx, vy, vz) {
    const v = ball.velocity;
    let floorN = null, wallHit = false;
    for (const c of world.contacts) {
      let other = null, s = 1;
      if (c.bi === ball) { other = c.bj; s = -1; } else if (c.bj === ball) other = c.bi;
      if (!other || other.type === CANNON.Body.DYNAMIC) continue; // lose Teile (Dominos) nicht abprallen lassen
      const nx = c.ni.x * s, ny = c.ni.y * s, nz = c.ni.z * s; // zeigt von der Wand zur Murmel
      tmpP.set(ball.position.x - nx * R, ball.position.y - ny * R, ball.position.z - nz * R);
      const ov = other.type === CANNON.Body.KINEMATIC ? other.getVelocityAtWorldPoint(tmpP, tmpV) : null;
      const rx = vx - (ov ? ov.x : 0), ry = vy - (ov ? ov.y : 0), rz = vz - (ov ? ov.z : 0);
      const vn0 = rx * nx + ry * ny + rz * nz, floor = ny > 0.7;
      if (floor) floorN = [nx, ny, nz];
      if (-vn0 < BOUNCE_MIN || -vn0 < 0.35 * Math.hypot(rx, ry, rz)) continue;
      const e = (floor ? g.ballProps.boden : g.ballProps.wand) * (SURFACES[other.material && other.material.name] || SURFACES.normal).bounce * bounceF;
      const vn1 = (v.x - (ov ? ov.x : 0)) * nx + (v.y - (ov ? ov.y : 0)) * ny + (v.z - (ov ? ov.z : 0)) * nz;
      const dv = -e * vn0 - vn1;
      if (dv > 0) { v.x += nx * dv; v.y += ny * dv; v.z += nz * dv; wallHit ||= !floor; }
    }
    // Nach dem Wandabprall rollt die Murmel in die neue Richtung (sonst bremst der alte Drall sie sofort)
    if (wallHit && floorN) {
      const [ux, uy, uz] = floorN, w = ball.angularVelocity, wu = w.x * ux + w.y * uy + w.z * uz;
      w.set((uy * v.z - uz * v.y) / R + ux * wu, (uz * v.x - ux * v.z) / R + uy * wu, (ux * v.y - uy * v.x) / R + uz * wu);
    }
  }

  function substep(ix, iz, ev) {
    const grip = g.lock ? 0 : g.surface.grip; // lock: Röhre/Kanone steuern die Murmel
    world.gravity.set(Math.sin(g.tilt) * G * ix * grip, -g.G, Math.sin(g.tilt) * G * iz * grip);
    for (const el of g.els) TYPES[el.type].pre?.(el, g, H);
    const v = ball.velocity, vx = v.x, vy = v.y, vz = v.z, gr = world.gravity;
    world.step(H);
    bounce(vx, vy, vz);
    // Aufprall: Geschwindigkeitsänderung, die nicht von der Schwerkraft kommt
    const hit = Math.hypot(v.x - vx - gr.x * H, v.y - vy - gr.y * H, v.z - vz - gr.z * H);
    g.hitCool -= H;
    if (hit > HIT_MIN && g.hitCool <= 0) { g.hitStrength = (hit - HIT_MIN) / 4; g.hitCool = 0.12; ev.push('hit'); }
    g.time += H;
    contacts();
    if (water) { const f = Math.exp(-water * H); ball.velocity.x *= f; ball.velocity.y *= f; ball.velocity.z *= f; }
    if (g.surface.drag) { const f = Math.exp(-g.surface.drag * H); ball.velocity.x *= f; ball.velocity.z *= f; }
    // Bremshilfe (Joystick): ohne Eingabe am Boden sanft abbremsen
    if (g.brake && g.groundBody && Math.hypot(ix, iz) < 0.1 && Math.hypot(ball.velocity.x, ball.velocity.z) < 7) { const f = Math.exp(-g.brake * H); ball.velocity.x *= f; ball.velocity.z *= f; }
    for (const el of g.els) TYPES[el.type].step?.(el, g, H, ev);
    if (ball.position.y < killY) { g.spawn(spawnPoint()); ev.push('fall'); }
  }

  // ix/iz: Eingabe in Welt-Richtung (-1..1), x = rechts, z = nach hinten
  g.step = (ix, iz, dt) => {
    const ev = [];
    acc += dt;
    let n = 0;
    while (acc >= H - 1e-9 && n < 4) { substep(ix, iz, ev); acc -= H; n++; }
    if (n === 4) acc = Math.min(acc, H);
    return ev;
  };
  return g;
}
