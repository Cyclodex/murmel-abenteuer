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
// grip = wie stark die Steuerung wirkt, drag = Abbremsen pro Sekunde (negativ = gleitet länger), roll = Faktor Rollwiderstand,
// dirt = macht die Murmel dreckig (pro m/s und Sekunde), wash = wäscht den Dreck ab (pro Meter, exponentiell).
export const SURFACES = {
  normal: { friction: 0.4, bounce: 1, grip: 1, drag: 0, wash: 0.015 },
  eis: { friction: 0.02, bounce: 1, grip: 0.45, drag: -0.1, wash: 0.04, roll: 0.2 },
  schlamm: { friction: 0.9, bounce: 0.2, grip: 1, drag: 2.2, dirt: 0.15 },
  pfuetze: { friction: 0.4, bounce: 0.3, grip: 1, drag: 0.8, wash: 1 },
  sand: { friction: 0.7, bounce: 0.3, grip: 0.9, drag: 1.4, dirt: 0.03 },
  seife: { friction: 0.02, bounce: 1, grip: 0.4, drag: -0.15, wash: 0.8, roll: 0.2 },
  handtuch: { friction: 0.9, bounce: 0.1, grip: 1, drag: 1.8, wash: 0.3 },
  nagel: { friction: 0.3, bounce: 0.55, grip: 1, drag: 0 }, // Nägel der Nagelwand schlucken etwas Schwung
  flussbett: { friction: 0.4, bounce: 0.05, grip: 1, drag: 0, wash: 0.5 }, // Grund im Fluss: Wasser schluckt den Aufprall
  keramik: { friction: 0.3, bounce: 1, grip: 1, drag: 0.9, wash: 0.5 }, // nasses Lavabo: hart (Bälle springen), ein Wasserfilm bremst etwas
  kunststoff: { friction: 0.3, bounce: 1, grip: 1, drag: 0 }, // Kugelbahn: Rinne
  rohr: { friction: 0.3, bounce: 1, grip: 0, drag: 0 }, // geschlossenes Rohr (Abfluss): drinnen lenkt man nicht
  trichter: { friction: 0.3, bounce: 1, grip: 1, drag: 0.5 } // Spiraltrichter: bremst etwas, damit die Murmel nach innen kreist
};
const DIRT_STILL = 0.08; // so viel Dreck pro Sekunde auch im Stehen im Schlamm
const WASH_WATER = 0.6;  // Unterwasser: Abwaschen pro Sekunde

// Sprungkraft der Murmel: Anteil der Aufprallgeschwindigkeit, der zurückkommt (Wand / Boden),
// schwere = Faktor für die Schwerkraft nach unten (Mond, Pingpong < 1),
// rollen = Faktor für Roll- und Luftwiderstand (< 1 = rollt weiter, z. B. Golfball),
// dichte = g/cm³ (Wasser = 1): leichter schwimmt im Fluss, schwerer sinkt (Glasmurmel 2.5)
export const BALL = { wand: 0.5, boden: 0.25, schwere: 1, rollen: 1, dichte: 2.5 };

// Kollisionsgruppen: feste/bewegte Teile, Murmel, lose Teile (z. B. Dominos)
export const GRP = { fest: 1, murmel: 2, lose: 4 };
// Bremsen wie bei Neverball statt Dämpfung: Rollwiderstand bremst gleichmässig (rollen, m/s²) auf ebenem Boden,
// ausser man gibt in Fahrtrichtung Gas. Dazu Luftwiderstand (luft · v², immer).
// Schnell behält die Murmel so ihren Schwung, langsam bleibt sie sauber stehen.
export const BREMSE = { rollen: 1, luft: 0.012 };
const ROLL_FLAT = 0.9998; // Rollwiderstand nur auf ebenem Boden (Neigung < 1.1°), sonst bleibt sie an leichtem Gefälle liegen
// Hangabtrieb: rollt die Murmel auf geneigten Bahnstücken (Weg, Rampe, Spirale, Fluss) bergab, zieht es sie zusätzlich
// (Faktor der Hangkraft), sonst schluckt das Rollen einen grossen Teil davon und bergab wirkt zäh.
const SLOPE_PUSH = 0.3;
const BRAKE_FLAT = 0.998; // Bremshilfe nur auf (fast) ebenem Boden (Neigung < 3.6°), bergab rollt die Murmel weiter

export function createGame(CANNON, level, ballProps = BALL) {
  // Level-Physik: schwerkraft = Faktor (Weltraum < 1), wasser = Abbremsen pro Sekunde in alle Richtungen,
  // abprall = Faktor für das Abprallen (z. B. weicher Mondstaub)
  const phys = level.physik || {}, gy = G * (phys.schwerkraft ?? 1), water = phys.wasser ?? 0, bounceF = phys.abprall ?? 1;
  const world = new CANNON.World();
  world.gravity.set(0, -gy, 0);
  // Kontakt-Tabelle nur für echte Kontakte statt n² Felder, die cannon.js jeden Schritt leert
  // (1000 Klötze: 3.9 statt 0.4 ms pro Schritt). Dient nur für Ereignisse, die Physik bleibt gleich.
  world.collisionMatrix = new CANNON.ObjectCollisionMatrix();
  world.collisionMatrixPrevious = new CANNON.ObjectCollisionMatrix();
  // Breitphase: feste Klötze nie gegeneinander prüfen, nur bewegliche Körper (Murmel, Dominos, bewegte Teile) gegen alle.
  // Gleiche Paare in gleicher Reihenfolge wie NaiveBroadphase, aber nicht alle n² Paare (Kugelbahn-Teile haben Hunderte Klötze).
  const bp = world.broadphase = new CANNON.NaiveBroadphase(), STATIC = CANNON.Body.STATIC, moving = [];
  bp.collisionPairs = function (w, p1, p2) {
    const l = w.bodies, n = l.length;
    moving.length = 0;
    for (let i = 0; i < n; i++) if (l[i].type !== STATIC) moving.push(i);
    for (let i = 0; i < n; i++) {
      const bi = l[i];
      if (bi.type !== STATIC) { for (let j = 0; j < i; j++) if (this.needBroadphaseCollision(bi, l[j])) this.intersectionTest(bi, l[j], p1, p2); continue; }
      for (const j of moving) { if (j >= i) break; if (this.needBroadphaseCollision(bi, l[j])) this.intersectionTest(bi, l[j], p1, p2); }
    }
  };
  world.solver.iterations = 12;

  const mBall = new CANNON.Material('ball');
  // Lose Teile (Dominos): Murmel greift wie auf normalem Boden. Auf dem Boden haften sie stark: Stösst die Murmel einen
  // schmalen Stein unten an, soll er kippen statt wegzurutschen (Kippen ab F = m·g·(t/2)/0.5, Rutschen ab F = Reibung·m·g).
  const mLose = new CANNON.Material('lose');
  world.addContactMaterial(new CANNON.ContactMaterial(mLose, mBall, { friction: SURFACES.normal.friction, restitution: 0 }));
  world.addContactMaterial(new CANNON.ContactMaterial(mLose, mLose, { friction: 0.8, restitution: 0 }));
  const surfaceMat = {};
  const matFor = name => {
    const key = SURFACES[name] ? name : 'normal';
    if (!surfaceMat[key]) {
      const s = SURFACES[key];
      surfaceMat[key] = new CANNON.Material(key);
      world.addContactMaterial(new CANNON.ContactMaterial(surfaceMat[key], mBall, { friction: s.friction, restitution: 0 }));
      world.addContactMaterial(new CANNON.ContactMaterial(surfaceMat[key], mLose, { friction: 0.8, restitution: 0 }));
    }
    return surfaceMat[key];
  };

  // Wände ohne Reibung: cannon.js begrenzt Reibung nicht pro Zeitschritt (viel zu stark), die Murmel
  // würde nach dem Aufprall zwischen Wand- und Bodenreibung festklemmen.
  // Ausnahme runde Flächen (Rinne, Trichter, Schüssel): dort gibt es keine Ecke zum Klemmen, und ohne Reibung
  // dreht die Murmel oben an der Halfpipe-Wand in die alte Richtung weiter und verliert beim Zurückrollen viel Schwung.
  const np = world.narrowphase, makeFriction = np.createFrictionEquationsFromContact;
  np.createFrictionEquationsFromContact = function (c, out) {
    const made = makeFriction.call(this, c, out), u = (c.bi.userData && c.bi.userData.rund) || (c.bj.userData && c.bj.userData.rund);
    if (made && !u && Math.abs(c.ni.y) < 0.7) for (const f of out.slice(-2)) f.minForce = f.maxForce = 0;
    return made;
  };

  const g = {
    C: CANNON, world, level, matFor, mLose, els: [], solids: [], checkpoints: [], switches: {},
    st: { stars: 0, starTotal: 0, cp: -1, won: false },
    groundBody: null, groundN: [0, 1, 0], rundN: null, touchBody: null, surface: SURFACES.normal, tilt: MAX_TILT, brake: 0, dirt: 0, washK: 0,
    // Leichte Murmel (schwere < 1) nur in Welten mit normaler Schwerkraft; im Weltraum gilt die Level-Schwerkraft
    // gy = Schwerkraft des Levels für lose Teile (Dominos): ohne Kippen und ohne Murmel-Schwere
    ballProps, G: phys.schwerkraft ? gy : gy * (ballProps.schwere ?? 1), gy, lock: false, track: { yaw: (level.startYaw || 0) * Math.PI / 180, lateral: 0 }
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

  const ball = new CANNON.Body({ mass: 1, material: mBall, shape: new CANNON.Sphere(R), linearDamping: 0, angularDamping: 0 });
  ball.collisionFilterGroup = GRP.murmel; ball.collisionFilterMask = GRP.fest | GRP.lose;
  world.addBody(ball);
  g.ball = ball;

  const killY = level.killY ?? -8;
  const spawnPoint = () => add(g.st.cp < 0 ? level.start : g.checkpoints[g.st.cp].at, [0, 1, 0]);
  let acc = 0;
  // Nach dem Abprall drückt cannon.js die leicht eingedrungene Murmel noch ein paar Schritte aus der Wand und gibt ihr
  // dabei zusätzlich Schwung (Bowling kam je nach Tempo mit 0.1 bis 0.23 statt 0.1 zurück): kurz auf das Abpralltempo begrenzen.
  let last = null; // { body, v = Abpralltempo, t = Restzeit }

  g.spawn = p => {
    ball.position.set(...p); ball.velocity.set(0, 0, 0); ball.angularVelocity.set(0, 0, 0);
    g.groundBody = g.touchBody = null; g.rundN = null; g.lock = false; g.squashT = 0; last = null;
  };
  // Zerquetscht (z. B. Hammer): Murmel bleibt kurz platt liegen, dann geht es am Checkpoint weiter.
  // Events: 'quetsch' sofort, 'zurueck' beim Neustart.
  const SQUASH_T = 0.8;
  g.squash = () => {
    if (g.squashT > 0) return;
    const p = ball.position;
    g.squashT = SQUASH_T; g.squashPos = [p.x, p.y, p.z]; g.squashNew = true; g.lock = true;
  };
  // Runtergefallen (unter killY oder z. B. ins Badewasser): am Checkpoint neu einsetzen
  g.fall = ev => { g.spawn(spawnPoint()); ev.push('fall'); };
  g.reset = () => {
    Object.assign(g.st, { stars: 0, cp: -1, won: false });
    Object.assign(g, { dirt: 0, dirtPeak: 0, dirty: false, washed: false, washK: 0, squashT: 0, squashNew: false });
    g.switches = {}; acc = 0; g.time = 0; g.hitCool = 0.5; g.hitStrength = 0;
    g.track.yaw = (level.startYaw || 0) * Math.PI / 180;
    for (const el of g.els) TYPES[el.type].reset?.(el, g);
    g.spawn(spawnPoint());
  };

  // Welcher Körper berührt die Murmel? (Boden = Berührung von unten)
  function contacts() {
    let best = null, bestNy = -2, ground = null, rundNy = -2;
    g.rundN = null; g.rundRohr = false;
    for (const c of world.contacts) {
      let other = null, s = 1;
      if (c.bi === ball) { other = c.bj; s = -1; } else if (c.bj === ball) other = c.bi;
      if (!other) continue;
      const ny = c.ni.y * s; // Normale zeigt vom Körper zur Murmel
      if (ny > bestNy) { bestNy = ny; best = other; }
      if (ny > 0.3) { ground = other; g.groundN = [c.ni.x * s, ny, c.ni.z * s]; }
      if (other.userData && other.userData.rund && ny > rundNy) { rundNy = ny; g.rundN = [c.ni.x * s, ny, c.ni.z * s]; g.rundRohr = !!other.userData.rohr; }
    }
    g.touchBody = best; g.groundBody = ground;
    const u = best && best.userData;
    if (u && u.track) {
      const tr = u.track, p = ball.position;
      // Richtung eines Bahnstücks ist nur eine Achse: Läuft es gegen die Fahrtrichtung
      // (z. B. Förderband, das zurückschiebt), Blickrichtung behalten statt umzudrehen.
      const d = Math.atan2(Math.sin(tr.yaw - g.track.yaw), Math.cos(tr.yaw - g.track.yaw));
      const flip = Math.abs(d) > Math.PI / 2 ? -1 : 1;
      g.track.yaw = flip < 0 ? tr.yaw + Math.PI : tr.yaw;
      g.track.lateral = flip * ((p.x - tr.mid[0]) * tr.right[0] + (p.y - tr.mid[1]) * tr.right[1] + (p.z - tr.mid[2]) * tr.right[2]);
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
    if (last && (last.t -= H) <= 0) last = null;
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
      const vn1 = (v.x - (ov ? ov.x : 0)) * nx + (v.y - (ov ? ov.y : 0)) * ny + (v.z - (ov ? ov.z : 0)) * nz;
      if (-vn0 < BOUNCE_MIN || -vn0 < 0.35 * Math.hypot(rx, ry, rz)) {
        if (last && last.body === other && vn1 > last.v) { const d = vn1 - last.v; v.x -= nx * d; v.y -= ny * d; v.z -= nz * d; }
        continue;
      }
      const e = (floor ? g.ballProps.boden : g.ballProps.wand) * (SURFACES[other.material && other.material.name] || SURFACES.normal).bounce * bounceF;
      const dv = -e * vn0 - vn1;
      v.x += nx * dv; v.y += ny * dv; v.z += nz * dv; wallHit ||= !floor;
      last = { body: other, v: -e * vn0, t: 0.1 };
    }
    // Nach dem Wandabprall rollt die Murmel in die neue Richtung (sonst bremst der alte Drall sie sofort)
    if (wallHit && floorN) {
      const [ux, uy, uz] = floorN, w = ball.angularVelocity, wu = w.x * ux + w.y * uy + w.z * uz;
      w.set((uy * v.z - uz * v.y) / R + ux * wu, (uz * v.x - ux * v.z) / R + uy * wu, (ux * v.y - uy * v.x) / R + uz * wu);
    }
  }

  // Dreck (g.dirt 0..1): Schlamm macht die Murmel dreckig, Pfütze, Wasser und Wind (g.washK, von Bauteilen)
  // waschen ihn ab, Rollen reibt ihn langsam ab. Events: 'platsch' = ganz dreckig, 'sauber' = wieder blitzblank.
  function dirt(ev) {
    const s = g.groundBody ? g.surface : null, sp = Math.hypot(ball.velocity.x, ball.velocity.z);
    if (s && s.dirt) g.dirt = Math.min(1, g.dirt + (DIRT_STILL + s.dirt * sp) * H);
    else if (g.dirt > 0) {
      g.dirt *= Math.exp(-(g.washK + (water ? WASH_WATER : 0) + (s ? (s.wash || 0) * (sp + 0.5) : 0)) * H);
      if (g.dirt < 0.03) g.dirt = 0;
    }
    g.washK = 0;
    g.dirtPeak = Math.max(g.dirtPeak, g.dirt);
    if (!g.dirty && g.dirt >= 0.8) { g.dirty = true; ev.push('platsch'); }
    if (g.dirty && g.dirt === 0) { g.dirty = false; g.washed = true; ev.push('sauber'); }
  }

  // Hangabtrieb auf festen Bahnstücken (nicht im Looping, nicht an den Seiten einer Rinne, nicht auf bewegten Teilen wie Wippe oder Falltür)
  function slope() {
    const gb = g.groundBody, u = gb && gb.userData;
    if (g.lock || !u || !u.track || u.loop || u.pendel || gb.type !== CANNON.Body.STATIC) return;
    // Richtung bergab = Schwerkraft entlang der Fläche: (0, -1, 0) + n * ny, Länge = sin(Neigung)
    const [nx, ny, nz] = g.groundN, dx = nx * ny, dy = ny * ny - 1, dz = nz * ny, v = ball.velocity;
    if (v.x * dx + v.y * dy + v.z * dz <= 0) return; // nur bergab, bergauf bleibt es wie bisher
    const k = SLOPE_PUSH * g.G * H;
    v.x += dx * k; v.y += dy * k; v.z += dz * k;
  }

  // Runde Flächen (Rinne, Trichter, Lavabo, Rohr) bestehen aus geraden Latten: an jeder Naht schluckt cannon.js den Teil
  // des Tempos, der in die nächste Latte zeigt (bei 12° rund 4 % der Energie, in der Halfpipe ~40 % pro Schwung).
  // Diesen Teil entlang der Fläche zurückgeben (nur beim Übergang zwischen zwei Latten, nicht bei echten Aufprallen).
  // Im geschlossenen Rohr zusätzlich den Drall mit der Fläche mitdrehen: rollt die Murmel schnell vorwärts und pendelt
  // dabei quer über die Nähte, passte der alte Drall nicht mehr zur neuen Latte (bei 7 m/s und 15° rutscht der Berührpunkt
  // mit 1.8 m/s), und die Reibung bremste sie bei jeder Naht (auf 30 m ein Drittel des Tempos). Auf einer glatten Wand
  // dreht sich die Rollachse ohne Rutschen mit.
  function seam(vx, vy, vz, n0) {
    const n1 = g.rundN;
    if (!n0 || !n1) return;
    const c = n0[0] * n1[0] + n0[1] * n1[1] + n0[2] * n1[2];
    if (c > 0.99995 || c < 0.9) return; // gleiche Latte oder Knick über 25°
    const v = ball.velocity, w = ball.angularVelocity;
    if (g.rundRohr) {
      const ax = n0[1] * n1[2] - n0[2] * n1[1], ay = n0[2] * n1[0] - n0[0] * n1[2], az = n0[0] * n1[1] - n0[1] * n1[0], sn = Math.hypot(ax, ay, az);
      const kx = ax / sn, ky = ay / sn, kz = az / sn, d = kx * w.x + ky * w.y + kz * w.z; // Drehung n0 -> n1 (Rodrigues)
      const cx = ky * w.z - kz * w.y, cy = kz * w.x - kx * w.z, cz = kx * w.y - ky * w.x;
      w.set(w.x * c + cx * sn + kx * d * (1 - c), w.y * c + cy * sn + ky * d * (1 - c), w.z * c + cz * sn + kz * d * (1 - c));
    }
    const vin = vx * n1[0] + vy * n1[1] + vz * n1[2], sp = Math.hypot(v.x, v.y, v.z);
    if (vin >= 0 || sp < 1e-6) return;
    const k = Math.sqrt(sp * sp + vin * vin) / sp;
    v.x *= k; v.y *= k; v.z *= k; w.x *= k; w.y *= k; w.z *= k;
  }

  // Roll- und Luftwiderstand (siehe BREMSE). Nicht, solange Röhre, Kanone oder Schiffchen die Murmel steuern (lock).
  function resist(ix, iz) {
    if (g.lock) return;
    const v = ball.velocity, w = ball.angularVelocity, k = g.ballProps.rollen ?? 1, gb = g.groundBody;
    // Geschwindigkeit des Bodens (bewegte Plattform fährt mit)
    let ox = 0, oy = 0, oz = 0;
    if (gb && gb.type !== CANNON.Body.STATIC) {
      tmpP.set(ball.position.x - g.groundN[0] * R, ball.position.y - g.groundN[1] * R, ball.position.z - g.groundN[2] * R);
      gb.getVelocityAtWorldPoint(tmpP, tmpV); ox = tmpV.x; oy = tmpV.y; oz = tmpV.z;
    }
    const rel0 = Math.hypot(v.x - ox, v.y - oy, v.z - oz);
    const fa = Math.max(0, 1 - BREMSE.luft * k * Math.hypot(v.x, v.y, v.z) * H);
    v.x *= fa; v.y *= fa; v.z *= fa;
    if (!gb) return;
    // Rollwiderstand auf ebenem Boden, ausser man gibt in Fahrtrichtung Gas (beim Bremsen und Lenken hilft er)
    const vh = Math.hypot(v.x - ox, v.z - oz), push = vh > 1e-6 ? (ix * (v.x - ox) + iz * (v.z - oz)) / vh : Math.hypot(ix, iz);
    if (g.groundN[1] > ROLL_FLAT && push < 0.1) {
      const rx = v.x - ox, ry = v.y - oy, rz = v.z - oz, rs = Math.hypot(rx, ry, rz), dv = BREMSE.rollen * k * (g.surface.roll ?? 1) * H;
      const fr = rs > dv ? 1 - dv / rs : 0;
      v.x = ox + rx * fr; v.y = oy + ry * fr; v.z = oz + rz * fr;
    }
    // am Boden dreht die Murmel passend langsamer, sonst holt der Drall das Tempo über die Reibung zurück
    const fw = rel0 > 1e-6 ? Math.hypot(v.x - ox, v.y - oy, v.z - oz) / rel0 : 0;
    w.x *= fw; w.y *= fw; w.z *= fw;
  }

  function substep(ix, iz, ev) {
    const grip = g.lock ? 0 : g.surface.grip; // lock: Röhre/Kanone steuern die Murmel
    world.gravity.set(Math.sin(g.tilt) * G * ix * grip, -g.G, Math.sin(g.tilt) * G * iz * grip);
    for (const el of g.els) TYPES[el.type].pre?.(el, g, H);
    if (g.squashNew) { g.squashNew = false; ev.push('quetsch'); }
    const v = ball.velocity, vx = v.x, vy = v.y, vz = v.z, gr = world.gravity, n0 = g.rundN;
    world.step(H);
    if (g.squashT > 0) { // platt liegen bleiben
      ball.position.set(...g.squashPos); ball.velocity.set(0, 0, 0); ball.angularVelocity.set(0, 0, 0);
      g.hitCool = 0.3; g.time += H;
      if ((g.squashT -= H) <= 0) { g.spawn(spawnPoint()); ev.push('zurueck'); }
      for (const el of g.els) TYPES[el.type].step?.(el, g, H, ev);
      return;
    }
    bounce(vx, vy, vz);
    // Aufprall: Geschwindigkeitsänderung, die nicht von der Schwerkraft kommt
    const hit = Math.hypot(v.x - vx - gr.x * H, v.y - vy - gr.y * H, v.z - vz - gr.z * H);
    g.hitCool -= H;
    if (hit > HIT_MIN && g.hitCool <= 0) { g.hitStrength = (hit - HIT_MIN) / 4; g.hitCool = 0.12; ev.push('hit'); }
    g.time += H;
    contacts();
    seam(vx, vy, vz, n0);
    if (water) { const f = Math.exp(-water * H); ball.velocity.x *= f; ball.velocity.y *= f; ball.velocity.z *= f; }
    if (g.surface.drag) { const f = Math.exp(-g.surface.drag * H); ball.velocity.x *= f; ball.velocity.z *= f; }
    slope();
    resist(ix, iz);
    // Bremshilfe (Joystick): ohne Eingabe auf ebenem Boden sanft abbremsen
    if (g.brake && g.groundBody && g.groundN[1] > BRAKE_FLAT && Math.hypot(ix, iz) < 0.1 && Math.hypot(ball.velocity.x, ball.velocity.z) < 7) { const f = Math.exp(-g.brake * H); ball.velocity.x *= f; ball.velocity.z *= f; }
    for (const el of g.els) TYPES[el.type].step?.(el, g, H, ev);
    dirt(ev);
    if (ball.position.y < killY) g.fall(ev);
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
