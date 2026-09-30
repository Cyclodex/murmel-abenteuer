// Treppe: alle Murmeln fallen gleichzeitig eine Treppe hinunter (Vergleich + Hintergrund der Menüs).
// Jede Murmel hat ihre eigene Physik-Welt mit derselben Treppe, so stören sie sich nicht.
import { createGame } from './game.js';
import { createView, createBallMesh } from './view.js';
import { canvasTex } from './themes.js';
import { DOMINO_PAARE, dominoTex } from './elements-extra.js';

export const STEPS = 8, TREAD = 2, RISE = 1.2, LANE = 1.15, RUN = 12;
const ROUND = 11;  // Sekunden, dann starten alle wieder oben
const PUSH = 0.15; // leichte Neigung nach vorne (Anteil der Kipp-Eingabe): stärker, und sie springen über die Stufen
const GLASS = 8;   // Glaswand am Ende des Auslaufs: Flummi, Pingpong und Basketball springen dort bis 6.1 m hoch
const width = n => n * LANE + 1.2;

// Treppe nach vorne (+z) hinunter (9.6 m hoch, 31° steil), unten ein Auslauf und eine Glaswand, an der die Murmeln
// zurückprallen. Die Seitenwände sind niedrig (die Kamera schaut von der Seite): seitlich rollen die Murmeln nie.
export function treppenLevel(n) {
  const w = width(n), top = STEPS * RISE, parts = [];
  for (let k = 0; k < STEPS; k++) {
    const y = top - k * RISE, z0 = -STEPS * TREAD + k * TREAD;
    parts.push({ type: 'weg', from: [0, y, z0], to: [0, y, z0 + TREAD], width: w, walls: 1, thick: y + 1, caps: k === 0 ? 'start' : undefined });
  }
  const e = w / 2 + 0.4, zg = RUN + 0.2;
  parts.push(
    { type: 'weg', from: [0, 0, 0], to: [0, 0, RUN], width: w, walls: 1, thick: 1 },
    { type: 'wand', from: [-e, -1, zg], to: [e, -1, zg], height: GLASS + 1, look: 'plexi' },
    // Rahmen der Scheibe
    { type: 'klotz', at: [-w / 2 - 0.2, (GLASS - 1) / 2, zg], size: [0.6, GLASS + 1, 0.6], look: 'lego-rot', deko: true },
    { type: 'klotz', at: [w / 2 + 0.2, (GLASS - 1) / 2, zg], size: [0.6, GLASS + 1, 0.6], look: 'lego-blau', deko: true },
    { type: 'klotz', at: [0, GLASS + 0.25, zg], size: [w + 1.4, 0.5, 0.6], look: 'lego-gelb', deko: true }
  );
  return { id: 'treppe', name: 'Treppe', emoji: '🪜', theme: 'spielzimmer', start: [0, top, -STEPS * TREAD + 1], killY: -8, parts };
}

// Nur Physik (auch headless): games[i] gehört zu skins[i]
export function createTreppe(CANNON, skins) {
  const level = treppenLevel(skins.length);
  const games = skins.map(s => createGame(CANNON, level, s.ball));
  const t = {
    level, games, time: 0,
    laneX: i => (i - (skins.length - 1) / 2) * LANE,
    reset() {
      t.time = 0;
      games.forEach((g, i) => {
        g.reset(); g.brake = 0;
        g.spawn([t.laneX(i), STEPS * RISE + 0.6, -STEPS * TREAD + 0.8]);
        g.ball.velocity.set(0, 0, 3); // Schubs Richtung Treppe
      });
    },
    step(dt) {
      t.time += dt;
      if (t.time > ROUND) t.reset();
      for (const g of games) g.step(0, g.ball.position.z < 0 ? PUSH : 0, dt); // Neigung nur auf der Treppe
    }
  };
  t.reset();
  return t;
}

// Dominos: eigene Physik-Welt mit der Treppe (feste Klötze der ersten Welt), den Steinen und je einer Kugel pro Murmel,
// die der echten Murmel folgt. Die Murmeln werfen die Steine um, merken selbst aber nichts davon:
// so bleiben ihre Welten getrennt und die Treppe für alle gleich.
// In jeder Bahn steht ein Stein vorne auf Stufe 4 und zwei im Auslauf.
const DOM = [0.8, 1.6, 0.28]; // Breite, Höhe, Dicke
function createDominos(THREE, CANNON, scene, t) {
  const C = CANNON, world = new C.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new C.SAPBroadphase(world);
  world.allowSleep = true;
  world.solver.iterations = 10;
  const mFest = new C.Material(), mStein = new C.Material(), mKugel = new C.Material();
  world.addContactMaterial(new C.ContactMaterial(mFest, mStein, { friction: 0.8, restitution: 0 }));
  world.addContactMaterial(new C.ContactMaterial(mStein, mStein, { friction: 0.6, restitution: 0 }));
  world.addContactMaterial(new C.ContactMaterial(mKugel, mStein, { friction: 0.3, restitution: 0.1 }));
  for (const s of t.games[0].solids) {
    if (s.deko) continue;
    const b = new C.Body({ mass: 0, material: mFest, shape: new C.Box(new C.Vec3(...s.half)) });
    b.position.set(...s.pos); b.quaternion.set(...s.quat);
    b.computeAABB(); // feste Körper rechnen ihn sonst nie neu: er bliebe im Ursprung, und die Breitphase fände sie nicht
    b.collisionFilterGroup = 1; b.collisionFilterMask = 4;
    world.addBody(b);
  }
  const boden = new C.Body({ mass: 0, material: mFest, shape: new C.Plane() }); // Teppich (wie in view.js): hinausgeflogene Steine landen dort
  boden.quaternion.setFromAxisAngle(new C.Vec3(1, 0, 0), -Math.PI / 2); boden.position.set(0, (t.level.killY ?? -8) - 1, 0);
  boden.collisionFilterGroup = 1; boden.collisionFilterMask = 4; boden.computeAABB();
  world.addBody(boden);
  // Die Kugeln sind schwer (20 Steine), aber nicht unendlich schwer wie ein kinematischer Körper: klemmt ein Stein zwischen
  // Kugel und Wand (die Murmel prallt in ihrer Welt an die Scheibe), weicht die Kugel aus, statt ihn durch die Wand zu drücken
  const kugeln = t.games.map(g => {
    const b = new C.Body({ mass: 2, material: mKugel, shape: new C.Sphere(g.ball.shapes[0].radius) });
    b.collisionFilterGroup = 2; b.collisionFilterMask = 4; b.allowSleep = false;
    world.addBody(b);
    return b;
  });
  // Vor jedem Teilschritt zieht eine Feder die Kugel zur Murmel (Position und Tempo), die Schwerkraft wird aufgehoben.
  // Nur eine Kraft, kein gesetztes Tempo: sonst wäre sie doch wieder unendlich schwer.
  const FEDER = 600, DAEMPFUNG = 2 * Math.sqrt(FEDER); // kritisch gedämpft
  world.addEventListener('preStep', () => t.games.forEach((g, i) => {
    const k = kugeln[i], p = g.ball.position, v = g.ball.velocity, f = k.force, m = k.mass;
    f.x += m * (FEDER * (p.x - k.position.x) + DAEMPFUNG * (v.x - k.velocity.x));
    f.y += m * (FEDER * (p.y - k.position.y) + DAEMPFUNG * (v.y - k.velocity.y) + 9.82);
    f.z += m * (FEDER * (p.z - k.position.z) + DAEMPFUNG * (v.z - k.velocity.z));
    k.angularVelocity.set(0, 0, 0);
  }));
  const [bw, bh, bt] = DOM, homes = []; // [x, y (Boden), z]
  t.games.forEach((g, i) => {
    const x = t.laneX(i);
    homes.push([x, (STEPS - 3) * RISE, -STEPS * TREAD + 4 * TREAD - 0.5]);
    for (let j = 0; j < 2; j++) homes.push([x, 0, 3 + j * 1.1]);
  });
  const geo = new THREE.BoxGeometry(bw, bh, bt), white = new THREE.MeshPhongMaterial({ color: 0xF7F4EC, shininess: 60 });
  const v = { canvasTex: (w, h, draw) => canvasTex(THREE, w, h, draw) }, faces = {};
  const steine = homes.map((p, i) => {
    const body = new C.Body({ mass: 0.1, material: mStein, shape: new C.Box(new C.Vec3(bw / 2, bh / 2, bt / 2)) });
    body.collisionFilterGroup = 4; body.collisionFilterMask = 1 | 2 | 4;
    body.sleepSpeedLimit = 0.2; body.sleepTimeLimit = 0.5;
    body.home = [p[0], p[1] + bh / 2, p[2]];
    world.addBody(body);
    const [o, u] = DOMINO_PAARE[(i * 11 + 5) % DOMINO_PAARE.length];
    const face = faces[o + '-' + u] ||= new THREE.MeshPhongMaterial({ map: dominoTex(v, o, u), shininess: 60 });
    const mesh = new THREE.Mesh(geo, [white, white, white, white, face, face]);
    mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh);
    return { body, mesh };
  });
  const d = {
    count: steine.length,
    // umgefallen: mehr als 60° gekippt
    get fallen() { return steine.filter(s => { const q = s.body.quaternion; return 1 - 2 * (q.x * q.x + q.z * q.z) < 0.5; }).length; },
    reset() {
      for (const { body } of steine) {
        body.position.set(...body.home); body.quaternion.set(0, 0, 0, 1);
        body.velocity.set(0, 0, 0); body.angularVelocity.set(0, 0, 0); body.sleep();
        body.computeAABB(); // schlafend rechnet cannon.js ihn nicht neu, die Breitphase fände den Stein nicht
      }
      t.games.forEach((g, i) => { kugeln[i].position.copy(g.ball.position); kugeln[i].velocity.copy(g.ball.velocity); });
    },
    step(dt) {
      world.step(1 / 60, dt, 4);
      for (const { body, mesh } of steine) { mesh.position.copy(body.position); mesh.quaternion.copy(body.quaternion); }
    }
  };
  d.reset();
  return d;
}

// Mit Grafik: Szene der ersten Welt + je eine Kugel pro Murmel, feste Kamera schräg von rechts vorne
// (40° zur Seite, 30° von oben), so weit weg, dass die ganze Welt ins Bild passt
export function createTreppenView(THREE, CANNON, renderer, skins) {
  const t = createTreppe(CANNON, skins);
  const view = createView(THREE, renderer, t.games[0]);
  view.setSkin(skins[0]);
  const meshes = [view.ballMesh];
  skins.slice(1).forEach(s => { const b = createBallMesh(THREE); b.setSkin(s); view.scene.add(b.mesh); meshes.push(b.mesh); });
  Object.assign(view.sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 100 });
  view.sun.shadow.camera.updateProjectionMatrix();
  const dominos = createDominos(THREE, CANNON, view.scene, t);
  const w = width(skins.length);
  const lo = [-w / 2 - 0.8, -1, -STEPS * TREAD - 0.4], hi = [w / 2 + 0.8, GLASS + 0.5, RUN + 0.6];
  const look = new THREE.Vector3((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2);
  const YAW = 40 * Math.PI / 180, PITCH = 30 * Math.PI / 180;
  const back = new THREE.Vector3(Math.sin(YAW) * Math.cos(PITCH), Math.sin(PITCH), Math.cos(YAW) * Math.cos(PITCH));
  const right = new THREE.Vector3(Math.cos(YAW), 0, -Math.sin(YAW)), up = new THREE.Vector3().crossVectors(back, right);
  const c = new THREE.Vector3();
  view.fixedCam = cam => {
    // Abstand: jede Ecke der Welt muss ins Bild passen (Hochformat braucht mehr Abstand)
    const tv = Math.tan(cam.fov * Math.PI / 360), th = tv * cam.aspect;
    let d = 0;
    for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) {
      c.set(x, y, z).sub(look);
      d = Math.max(d, Math.max(Math.abs(c.dot(right)) / th, Math.abs(c.dot(up)) / tv) * 1.05 + c.dot(back));
    }
    cam.position.copy(look).addScaledVector(back, d);
    cam.lookAt(look);
    return look;
  };
  let last = 0;
  return {
    treppe: t, view, dominos,
    frame(dt) {
      t.step(dt);
      if (t.time < last) dominos.reset(); // neue Runde
      last = t.time;
      dominos.step(dt);
      t.games.forEach((g, i) => {
        const b = g.ball, m = meshes[i];
        m.position.set(b.position.x, b.position.y, b.position.z);
        m.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
      });
      view.render(dt, 0, 0, 0);
    },
    resize: () => view.resize(),
    dispose: () => view.dispose()
  };
}
