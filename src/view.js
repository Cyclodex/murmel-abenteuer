// Grafik mit three.js: baut die Szene aus den Spieldaten und zeichnet jedes Bild.
import { TYPES } from './bauteile.js';
import { R } from './game.js';
import { THEMES, COLORS, canvasTex } from './themes.js';
import { createTrailFx } from './trails.js';

export function createRenderer(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  return renderer;
}

// ---------- Texturen (alle im Code gezeichnet, keine Bilddateien) ----------
const mudTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  x.fillStyle = '#6B4A2B'; x.fillRect(0, 0, w, h);
  const r = rnd(3);
  for (let i = 0; i < 40; i++) { x.fillStyle = r() > 0.5 ? '#7D5A36' : '#57391F'; x.beginPath(); x.arc(r() * w, r() * h, 3 + r() * 8, 0, 7); x.fill(); }
});
const arrowTex = THREE => canvasTex(THREE, 64, 64, (x, w, h) => {
  x.fillStyle = '#FF7A00'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#FFE14D'; x.beginPath();
  x.moveTo(8, 44); x.lineTo(32, 16); x.lineTo(56, 44); x.lineTo(46, 50); x.lineTo(32, 34); x.lineTo(18, 50); x.closePath(); x.fill();
});
const letterTex = (THREE, ch, bg) => canvasTex(THREE, 128, 128, (x, w, h) => {
  x.fillStyle = bg; x.fillRect(0, 0, w, h);
  x.strokeStyle = '#FFFFFF'; x.lineWidth = 8; x.strokeRect(10, 10, w - 20, h - 20);
  x.fillStyle = '#FFFFFF'; x.font = 'bold 84px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, w / 2, h / 2 + 4);
}, false);


// Box mit UVs in Weltgrösse (Textur wiederholt sich pro `tile` Meter statt zu strecken)
function boxGeo(THREE, sx, sy, sz, tile = 2) {
  const geo = new THREE.BoxGeometry(sx, sy, sz), uv = geo.attributes.uv;
  const dims = [[sz, sy], [sz, sy], [sx, sz], [sx, sz], [sx, sy], [sx, sy]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile);
  }
  return geo;
}

const BUMPS = new Map(); // Design -> fertig berechnete Bump-Map

// Murmel-Kugel mit Design (Textur, Planetenring, Glanz, Struktur)
export function createBallMesh(THREE) {
  const skinCanvas = document.createElement('canvas'); skinCanvas.width = 256; skinCanvas.height = 128;
  const skinTex = new THREE.CanvasTexture(skinCanvas);
  // Bump-Map für Oberflächen mit Struktur (Golf-Dellen), feiner als die Farbe; je Design nur einmal berechnet
  const bumpCanvas = document.createElement('canvas'); bumpCanvas.width = 512; bumpCanvas.height = 256;
  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  const ballMat = new THREE.MeshPhongMaterial({ map: skinTex, shininess: 90 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 20), ballMat);
  mesh.castShadow = true;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.85, 40), new THREE.MeshLambertMaterial({ color: 0xE8D5A8, side: THREE.DoubleSide }));
  ring.rotation.x = Math.PI / 2.4; mesh.add(ring);
  function setSkin(skin) {
    skin.paint(skinCanvas.getContext('2d'), 256, 128); skinTex.needsUpdate = true;
    ring.visible = !!skin.ring;
    if (skin.bump) {
      if (!BUMPS.has(skin)) { const c = document.createElement('canvas'); c.width = 512; c.height = 256; skin.bump(c.getContext('2d'), 512, 256); BUMPS.set(skin, c); }
      bumpCanvas.getContext('2d').drawImage(BUMPS.get(skin), 0, 0); bumpTex.needsUpdate = true;
    }
    const bump = skin.bump ? bumpTex : null;
    if (ballMat.bumpMap !== bump) { ballMat.bumpMap = bump; ballMat.bumpScale = 0.02; ballMat.needsUpdate = true; }
    ballMat.shininess = skin.shiny ? 200 : 90; ballMat.specular.setHex(skin.shiny ? 0xFFF2B0 : 0x111111);
  }
  return { mesh, setSkin };
}

export function createView(THREE, renderer, game) {
  const theme = THEMES[game.level.theme] || THEMES.standard;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(theme.sky);
  scene.fog = new THREE.Fog(theme.sky, theme.fog[0], theme.fog[1]);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  const hemi = theme.hemi || [0xffffff, 0x8a6a3a, 0.75];
  scene.add(new THREE.HemisphereLight(hemi[0], hemi[1], hemi[2]));
  const sun = new THREE.DirectionalLight(0xffffff, theme.sun ?? 0.8);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
  scene.add(sun, sun.target);

  // ---------- Materialien je "look" ----------
  const lambert = (color, extra) => new THREE.MeshLambertMaterial({ color, ...extra });
  const cache = {};
  let wallIdx = 0;
  // Werkzeuge für die Welt-Themen (themes.js)
  const tools = {
    THREE, scene, lambert,
    plane(tex, y) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), lambert(0xffffff, { map: tex }));
      m.rotation.x = -Math.PI / 2; m.position.y = y; scene.add(m); return m;
    }
  };
  function mat(look) {
    // Wände: Looks der Welt der Reihe nach (z. B. Legosteine in wechselnden Farben)
    if (look === 'wall' && theme.walls) look = theme.walls[wallIdx++ % theme.walls.length];
    if (cache[look]) return cache[look];
    let m = theme.look ? theme.look(tools, look) : null;
    const [kind, col] = look.split('-');
    if (m) { /* eigener Look der Welt */ }
    else if (kind === 'lego' || kind === 'klotz') {
      m = new THREE.MeshPhongMaterial({ color: COLORS[col] ?? 0xE53935, shininess: kind === 'lego' ? 60 : 10 });
      if (kind === 'lego') m.userData.lego = COLORS[col] ? col : 'rot';
      // Überlappende Steine haben deckungsgleiche Flächen: feste Rangfolge je Farbe statt Z-Fighting
      const rank = Object.keys(COLORS).indexOf(col);
      Object.assign(m, { polygonOffset: true, polygonOffsetFactor: 0, polygonOffsetUnits: -(rank < 0 ? 0 : rank) - (kind === 'lego' ? 0 : 6) });
    }
    else if (look === 'floor') m = theme.floor(tools);
    else if (look === 'ramp' || look === 'bridge') m = (cache.ramp = cache.ramp || theme.ramp(tools));
    else if (look === 'eis') m = new THREE.MeshPhongMaterial({ color: 0x8ED3F2, shininess: 60, specular: 0x88aacc });
    else if (look === 'schlamm') m = lambert(0xffffff, { map: mudTex(THREE) });
    else if (look === 'band') m = lambert(0x3A3F47);
    else if (look === 'platform') m = new THREE.MeshPhongMaterial({ color: COLORS.gelb, shininess: 40 });
    else if (look === 'seesaw') m = new THREE.MeshPhongMaterial({ color: COLORS.orange, shininess: 40 });
    else m = lambert(theme.wall ?? 0xA8743A);
    return (cache[look] = m);
  }
  const letterMats = {};
  function abcMat(ch) {
    ch = (ch || 'A').slice(0, 1).toUpperCase();
    if (!letterMats[ch]) {
      const bg = '#' + Object.values(COLORS)[ch.charCodeAt(0) % 6].toString(16).padStart(6, '0');
      letterMats[ch] = new THREE.MeshLambertMaterial({ map: letterTex(THREE, ch, bg) });
    }
    return letterMats[ch];
  }

  const v = {
    THREE, scene, goal: null,
    mats: {
      pad: lambert(0xFF5A8A), star: lambert(0xFFC928, { emissive: 0x6a4a00 }), bonusStar: lambert(0xC77DFF, { emissive: 0x3a1060 }),
      goal: lambert(0x3BB273, { emissive: 0x1a5a30 }), goalFlag: lambert(0x3BB273), pole: lambert(0x8A8A8A), wall: lambert(0xA8743A)
    },
    starGeo: null,
    arrowTexture: () => arrowTex(THREE),
    canvasTex: (w, h, draw) => canvasTex(THREE, w, h, draw),
    // Meshes für einen beweglichen Körper, die ihm jedes Bild folgen
    bodyGroup(body) {
      const grp = new THREE.Group();
      body.shapes.forEach((sh, i) => {
        const he = sh.halfExtents, o = body.shapeOffsets[i];
        const m = new THREE.Mesh(boxGeo(THREE, he.x * 2, he.y * 2, he.z * 2), mat(body.looks[i]));
        m.position.set(o.x, o.y, o.z); m.receiveShadow = true; m.castShadow = true; grp.add(m);
      });
      scene.add(grp);
      return { tick() { grp.position.copy(body.position); grp.quaternion.copy(body.quaternion); } };
    }
  };
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.22 : 0.5, a = i * Math.PI / 5 + Math.PI / 2, x = Math.cos(a) * r, y = Math.sin(a) * r;
    i ? shape.lineTo(x, y) : shape.moveTo(x, y);
  }
  v.starGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false });

  // ---------- Feste Klötze ----------
  const studs = {}, studPos = []; // Farbe -> Liste von Matrizen; alle Noppen-Positionen
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpP = new THREE.Vector3(), tmpS = new THREE.Vector3();
  const STUD_R = 0.3, STUD_H = 0.2125; // relativ zum Rastermass (Original: 4.8 mm bzw. 1.7 mm bei 8 mm Raster)
  const pillars = [], blockers = [];
  for (const s of game.solids) {
    const m0 = s.look === 'abc' ? abcMat(s.text) : mat(s.look);
    const mesh = new THREE.Mesh(s.look === 'abc' ? new THREE.BoxGeometry(s.half[0] * 2, s.half[1] * 2, s.half[2] * 2) : boxGeo(THREE, s.half[0] * 2, s.half[1] * 2, s.half[2] * 2), m0);
    mesh.position.set(...s.pos); mesh.quaternion.set(...s.quat); mesh.receiveShadow = true;
    scene.add(mesh);
    if (!s.deko) blockers.push(mesh);
    // Legonoppen oben drauf. Rastermass = Breite des Steins (dünne Wand = 1er-Stein, breiter Klotz = 2er-Stein),
    // Noppen wie beim Original: Durchmesser 0.6, Höhe 0.2125 des Rastermasses
    const col = m0.userData.lego;
    if (col) {
      const [hx, hy, hz] = s.half, short = Math.min(hx, hz) * 2, pitch = short > 1 ? short / 2 : short;
      const nx = Math.max(1, Math.round(hx * 2 / pitch)), nz = Math.max(1, Math.round(hz * 2 / pitch));
      tmpQ.set(...s.quat); tmpS.setScalar(pitch);
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
        tmpP.set(-hx + (i + 0.5) * hx * 2 / nx, hy + STUD_H * pitch / 2, -hz + (j + 0.5) * hz * 2 / nz).applyQuaternion(tmpQ).add(mesh.position);
        // wo Steine überlappen, nur eine Noppe setzen (sonst stecken zwei ineinander und flimmern)
        if (studPos.some(p => p.distanceToSquared(tmpP) < (2 * STUD_R * pitch) ** 2)) continue;
        studPos.push(tmpP.clone());
        (studs[col] = studs[col] || []).push(tmpM.clone().compose(tmpP, tmpQ, tmpS));
      }
    }
    // Säulen unter flachen Bahnstücken (nur Optik)
    if (theme.pillars && s.track && !s.deko && Math.abs(s.quat[0]) < 1e-3 && Math.abs(s.quat[2]) < 1e-3 && s.half[2] >= 2) pillars.push(s);
  }
  const studGeo = new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 16);
  for (const [col, list] of Object.entries(studs)) {
    const im = new THREE.InstancedMesh(studGeo, cache['lego-' + col], list.length);
    list.forEach((mm, i) => im.setMatrixAt(i, mm));
    scene.add(im);
  }
  const floorY = (game.level.killY ?? -8) - 1;
  const groundFx = theme.ground ? theme.ground(tools, floorY) : null;
  if (theme.pillars) {
    pillars.forEach((s, i) => {
      const top = s.pos[1] - s.half[1], hgt = top - floorY;
      if (hgt < 0.5) return;
      const p = new THREE.Mesh(boxGeo(THREE, 1.2, hgt, 1.2), mat(theme.pillars[i % theme.pillars.length]));
      p.position.set(s.pos[0], floorY + hgt / 2, s.pos[2]); scene.add(p);
    });
  }

  const ticks = [];
  for (const el of game.els) {
    const r = TYPES[el.type].view?.(el, v);
    if (r && r.tick) ticks.push(r.tick);
  }

  // ---------- Murmel ----------
  const ball = createBallMesh(THREE), ballMesh = ball.mesh, setSkin = ball.setSkin;
  scene.add(ballMesh);

  const trailFx = createTrailFx(THREE, scene); // Spur hinter der Murmel (src/trails.js)

  // ---------- Konfetti ----------
  const confetti = [];
  function burst(pos, n, colors) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.3), new THREE.MeshBasicMaterial({ color: colors[i % colors.length], side: THREE.DoubleSide }));
      m.position.copy(pos); scene.add(m);
      confetti.push({ m, v: new THREE.Vector3((Math.random() - 0.5) * 6, 4 + Math.random() * 5, (Math.random() - 0.5) * 6), life: 2 });
    }
  }

  // ---------- Kamera ----------
  const camPos = new THREE.Vector3(), tmp = new THREE.Vector3(), ray = new THREE.Raycaster(), dir = new THREE.Vector3();
  let camInit = false;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  // lean = 1: Welt kippt sichtbar mit (Kippen), 0: ruhige Kamera, nur die Kugel rollt (Joystick)
  function render(dt, inX, inZ, camYaw, tiltDeg = 25, lean = 1) {
    const b = game.ball;
    ballMesh.position.set(b.position.x, b.position.y, b.position.z);
    ballMesh.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    for (const t of ticks) t(dt, game);
    if (groundFx && groundFx.tick) groundFx.tick(dt, camera);
    trailFx.update(dt, ballMesh.position);
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.v.y -= 9.8 * dt; c.m.position.addScaledVector(c.v, dt); c.m.rotation.x += dt * 6; c.life -= dt;
      if (c.life <= 0) { scene.remove(c.m); c.m.geometry.dispose(); c.m.material.dispose(); confetti.splice(i, 1); }
    }
    if (view.fixedCam) { // feste Kamera (z. B. Treppe): fixedCam(camera) stellt sie und liefert den Blickpunkt
      const look = view.fixedCam(camera);
      sun.position.set(look.x + 6, look.y + 14, look.z + 6); sun.target.position.copy(look);
      renderer.render(scene, camera);
      return;
    }
    // Kamera hinter der Murmel, dreht mit der Bahn, kippt leicht mit der Eingabe
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw), rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
    const target = ballMesh.position, lat = Math.max(-4, Math.min(4, game.track.lateral || 0)) * 0.4;
    const back = 10 + inZ * 1.5 * lean, side = -inX * 1.5 * lean - lat;
    tmp.set(target.x - fx * back + rx * side, target.y + 7, target.z - fz * back + rz * side);
    // Ist etwas zwischen Murmel und Kamera (z. B. Looping), rückt die Kamera näher heran
    dir.subVectors(tmp, target); const dist = dir.length(); dir.divideScalar(dist);
    ray.set(target, dir); ray.far = dist;
    const hit = ray.intersectObjects(blockers, false)[0];
    let k = 0.08;
    if (hit && hit.distance > 0.8) { tmp.copy(target).addScaledVector(dir, Math.max(2.5, hit.distance - 0.6)); k = 0.3; }
    if (!camInit) { camPos.copy(tmp); camInit = true; } else camPos.lerp(tmp, k);
    camera.position.copy(camPos); camera.lookAt(target.x + fx * 3, target.y, target.z + fz * 3);
    // Bahn sichtbar mitkippen: rechts kippen = rechte Seite tiefer
    const roll = tiltDeg * 0.3 * Math.PI / 180 * lean;
    camera.rotateZ(inX * roll); camera.rotateX(inZ * roll * 0.4);
    sun.position.set(target.x + 6, target.y + 14, target.z + 6); sun.target.position.copy(target);
    renderer.render(scene, camera);
  }

  function dispose() {
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const ms = o.material ? [].concat(o.material) : [];
      for (const m of ms) { if (m.map) m.map.dispose(); m.dispose(); }
    });
  }

  const view = { scene, camera, ballMesh, burst, render, resize, setSkin, setTrail: trailFx.set, trailFx, dispose, fixedCam: null, sun, get goal() { return v.goal; } };
  return view;
}
