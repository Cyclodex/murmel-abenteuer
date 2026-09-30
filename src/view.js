// Grafik mit three.js: baut die Szene aus den Spieldaten und zeichnet jedes Bild.
import { TYPES } from './bauteile.js';
import { R, SURFACES, RESPAWN_T } from './game.js';
import { THEMES, COLORS, canvasTex, rnd, woodTex } from './themes.js';
import { createTrailFx } from './trails.js';
import { ghostAt } from './ghost.js';

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
const puddleTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  x.fillStyle = '#3F8FD8'; x.fillRect(0, 0, w, h);
  const r = rnd(5);
  x.strokeStyle = 'rgba(220,240,255,0.55)'; x.lineWidth = 2;
  for (let i = 0; i < 14; i++) { const cx = r() * w, cy = r() * h, rr = 4 + r() * 14; x.beginPath(); x.ellipse(cx, cy, rr, rr * 0.6, 0, 0, 7); x.stroke(); }
});
const stripeTex = THREE => canvasTex(THREE, 64, 64, (x, w, h) => { // Warnstreifen (Falltür)
  x.fillStyle = '#FFD23F'; x.fillRect(0, 0, w, h); x.fillStyle = '#2B2B2B';
  for (let i = -2; i < 4; i++) { x.beginPath(); x.moveTo(i * 24, 0); x.lineTo(i * 24 + 12, 0); x.lineTo(i * 24 + 12 + h, h); x.lineTo(i * 24 + h, h); x.fill(); }
});
const sandTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => {
  x.fillStyle = '#EACB86'; x.fillRect(0, 0, w, h);
  const r = rnd(8);
  for (let i = 0; i < 500; i++) { x.fillStyle = r() > 0.5 ? '#D9B56C' : '#F5DDA3'; x.fillRect(r() * w, r() * h, 2, 2); }
});
const pebbleTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => { // Flussbett
  x.fillStyle = '#7E8A8F'; x.fillRect(0, 0, w, h);
  const r = rnd(12);
  for (let i = 0; i < 70; i++) { const c = 110 + Math.floor(r() * 70); x.fillStyle = `rgb(${c},${c + 5},${c + 8})`; x.beginPath(); x.ellipse(r() * w, r() * h, 3 + r() * 6, 2 + r() * 4, r() * 3, 0, 7); x.fill(); }
});
const towelTex = THREE => canvasTex(THREE, 64, 64, (x, w, h) => { // Frottee mit Streifen
  x.fillStyle = '#F7A8C4'; x.fillRect(0, 0, w, h); x.fillStyle = '#FFFFFF'; x.fillRect(0, 26, w, 12);
  const r = rnd(4); x.fillStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < 300; i++) x.fillRect(r() * w, r() * h, 1, 1);
});
const soapTex = THREE => canvasTex(THREE, 128, 128, (x, w, h) => { // Seifenschaum
  x.fillStyle = '#CFEFFF'; x.fillRect(0, 0, w, h);
  const r = rnd(6);
  for (let i = 0; i < 40; i++) { x.strokeStyle = 'rgba(255,255,255,0.9)'; x.lineWidth = 2; x.beginPath(); x.arc(r() * w, r() * h, 3 + r() * 9, 0, 7); x.stroke(); }
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

// Dreckflecken auf der Kugel: je dreckiger, desto mehr Flecken (t = ab welchem Dreck ein Fleck erscheint)
const MUD = ['#5B3A1E', '#6B4A2B', '#4A2F18', '#7D5A36'];
const BLOBS = (() => {
  const r = rnd(11);
  return Array.from({ length: 70 }, (_, i) => ({ x: r() * 256, y: 12 + r() * 104, rx: 5 + r() * 15, ry: 4 + r() * 9, a: r() * 3, t: 0.05 + i / 70 * 0.9, c: MUD[i % MUD.length] }));
})();

// Murmel-Kugel mit Design (Textur, Planetenring, Glanz, Struktur)
export function createBallMesh(THREE) {
  const skinCanvas = document.createElement('canvas'); skinCanvas.width = 256; skinCanvas.height = 128;
  const skinTex = new THREE.CanvasTexture(skinCanvas);
  // Bump-Map für Oberflächen mit Struktur (Golf-Dellen), feiner als die Farbe; je Design nur einmal berechnet
  const bumpCanvas = document.createElement('canvas'); bumpCanvas.width = 512; bumpCanvas.height = 256;
  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  const baseCanvas = document.createElement('canvas'); baseCanvas.width = 256; baseCanvas.height = 128; // Design ohne Dreck
  const ballMat = new THREE.MeshPhongMaterial({ map: skinTex, shininess: 90 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 20), ballMat);
  mesh.castShadow = true;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.85, 40), new THREE.MeshLambertMaterial({ color: 0xE8D5A8, side: THREE.DoubleSide }));
  ring.rotation.x = Math.PI / 2.4; mesh.add(ring);
  let shiny = false, dirtLvl = 0;
  // Design + Dreck in die Textur malen; Dreck matt macht die Kugel matt
  function paint() {
    const c = skinCanvas.getContext('2d'), k = dirtLvl / 20;
    c.drawImage(baseCanvas, 0, 0);
    if (k > 0) {
      for (const b of BLOBS) if (b.t <= k) for (const dx of [-256, 0, 256]) { c.fillStyle = b.c; c.beginPath(); c.ellipse(b.x + dx, b.y, b.rx, b.ry, b.a, 0, 7); c.fill(); }
      c.globalAlpha = k * 0.35; c.fillStyle = MUD[1]; c.fillRect(0, 0, 256, 128); c.globalAlpha = 1;
    }
    skinTex.needsUpdate = true;
    ballMat.shininess = (shiny ? 200 : 90) * (1 - 0.85 * k);
    ballMat.specular.setHex(shiny ? 0xFFF2B0 : 0x111111).multiplyScalar(1 - k);
  }
  // Dreck 0..1, in 20 Stufen (neu malen nur, wenn sich die Stufe ändert)
  function setDirt(d) {
    const lvl = Math.round(Math.max(0, Math.min(1, d || 0)) * 20);
    if (lvl !== dirtLvl) { dirtLvl = lvl; paint(); }
  }
  function setSkin(skin) {
    skin.paint(baseCanvas.getContext('2d'), 256, 128);
    shiny = !!skin.shiny; paint();
    ring.visible = !!skin.ring;
    if (skin.bump) {
      if (!BUMPS.has(skin)) { const c = document.createElement('canvas'); c.width = 512; c.height = 256; skin.bump(c.getContext('2d'), 512, 256); BUMPS.set(skin, c); }
      bumpCanvas.getContext('2d').drawImage(BUMPS.get(skin), 0, 0); bumpTex.needsUpdate = true;
    }
    const bump = skin.bump ? bumpTex : null;
    if (ballMat.bumpMap !== bump) { ballMat.bumpMap = bump; ballMat.bumpScale = 0.02; ballMat.needsUpdate = true; }
  }
  return { mesh, setSkin, setDirt, get dirtLevel() { return dirtLvl / 20; } };
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
    else if (look === 'pfuetze') m = new THREE.MeshPhongMaterial({ map: puddleTex(THREE), shininess: 120, specular: 0xCCE8FF });
    else if (look === 'band') m = lambert(0x3A3F47);
    else if (look === 'glas') m = new THREE.MeshPhongMaterial({ color: 0xDFF4FF, transparent: true, opacity: 0.16, shininess: 150, depthWrite: false });
    else if (look === 'nagelwand') m = lambert(0xffffff, { map: woodTex(THREE, '#D9A066', '#7A4A1E') });
    else if (look === 'falltuer') m = lambert(0xffffff, { map: stripeTex(THREE) });
    else if (look === 'schieber') m = new THREE.MeshPhongMaterial({ color: 0x8E24AA, shininess: 50 });
    else if (kind === 'hammer') m = new THREE.MeshPhongMaterial({ color: COLORS[col] ?? COLORS.rot, shininess: 70 });
    else if (look === 'stiel') m = lambert(0x9C6B3C);
    else if (look === 'treppe') m = theme.stairs ? theme.stairs(tools) : (cache.ramp = cache.ramp || theme.ramp(tools));
    else if (look === 'flussbett') m = lambert(0xffffff, { map: pebbleTex(THREE) });
    else if (look === 'ufer') m = lambert(theme.bank ?? 0x6D8F4E);
    else if (look === 'sand') m = lambert(0xffffff, { map: sandTex(THREE) });
    else if (look === 'handtuch') m = lambert(0xffffff, { map: towelTex(THREE) });
    else if (look === 'seife') m = new THREE.MeshPhongMaterial({ map: soapTex(THREE), shininess: 100, specular: 0xffffff });
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
      return { grp, tick() { grp.position.copy(body.position); grp.quaternion.copy(body.quaternion); } };
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
  const pillars = [], blockers = [], thru = new Map();
  v.blocker = mesh => blockers.push(mesh); // Bauteile mit eigener Grafik: Kamera rückt davor näher an die Murmel
  // halb durchsichtig (Looping-Schienen, was vor der Bauteil-Kamera liegt): die Murmel bleibt dahinter sichtbar
  const seeThrough = m => thru.get(m) || thru.set(m, Object.assign(m.clone(), { transparent: true, opacity: 0.45, depthWrite: false })).get(m);
  for (const s of game.solids) {
    if (s.hide) continue; // nur Physik, die Grafik baut das Bauteil selbst (z. B. Schüssel)
    let m0 = s.look === 'abc' ? abcMat(s.text) : mat(s.look);
    if (s.glass) m0 = seeThrough(m0);
    const mesh = new THREE.Mesh(s.look === 'abc' ? new THREE.BoxGeometry(s.half[0] * 2, s.half[1] * 2, s.half[2] * 2) : boxGeo(THREE, s.half[0] * 2, s.half[1] * 2, s.half[2] * 2), m0);
    mesh.position.set(...s.pos); mesh.quaternion.set(...s.quat); mesh.receiveShadow = true;
    scene.add(mesh);
    if (!s.deko && !s.clear && !s.glass) blockers.push(mesh); // durchsichtiges Glas hält die Kamera nicht auf
    // Legonoppen oben drauf. Rastermass = Breite des Steins (dünne Wand = 1er-Stein, breiter Klotz = 2er-Stein),
    // Noppen wie beim Original: Durchmesser 0.6, Höhe 0.2125 des Rastermasses
    const col = !s.glass && m0.userData.lego;
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
  const pillarMeshes = [];
  if (theme.pillars) {
    pillars.forEach((s, i) => {
      const top = s.pos[1] - s.half[1], hgt = top - floorY;
      if (hgt < 0.5) return;
      const p = new THREE.Mesh(boxGeo(THREE, 1.2, hgt, 1.2), mat(theme.pillars[i % theme.pillars.length]));
      p.position.set(s.pos[0], floorY + hgt / 2, s.pos[2]); scene.add(p); pillarMeshes.push(p);
    });
  }

  const ticks = [], cams = [];
  for (const el of game.els) {
    const r = TYPES[el.type].view?.(el, v);
    if (r && r.tick) ticks.push(r.tick);
    if (r && r.cam) cams.push(r.cam);
  }

  // ---------- Murmel ----------
  const ball = createBallMesh(THREE), ballMesh = ball.mesh, setSkin = ball.setSkin;
  scene.add(ballMesh);

  const trailFx = createTrailFx(THREE, scene); // Spur hinter der Murmel (src/trails.js)
  // Spritzer im Schlamm und in der Pfütze (gleicher Partikel-Pool wie die Spuren)
  const splash = { schlamm: createTrailFx(THREE, scene), pfuetze: createTrailFx(THREE, scene) };
  splash.schlamm.set({ shape: 'kugel', colors: [0x5B3A1E, 0x7D5A36, 0x4A2F18], size: 0.2, life: 0.5, every: 0.3, spread: 2.2, rise: 2.5, gravity: 12 });
  splash.pfuetze.set({ shape: 'kugel', colors: [0xBDEBFF, 0x7FC4F5, 0xFFFFFF], size: 0.18, life: 0.45, every: 0.2, spread: 2.5, rise: 3, gravity: 12, opacity: 0.8 });

  // ---------- Geistermurmeln: fahren beste Fahrten mit (src/ghost.js), mit Namensschild darüber ----------
  let ghosts = [];
  const gp = [0, 0, 0], gDelta = new THREE.Vector3(), gAxis = new THREE.Vector3(), gQ = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0);
  const disposeObj = o => o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map) x.material.map.dispose(); x.material.dispose(); } });
  // Name als Schild (immer lesbar, auch hinter Wänden); Text kommt von anderen Geräten, wird nur auf die Leinwand gemalt
  function nameTag(text) {
    const c = document.createElement('canvas'), x = c.getContext('2d'), f = '800 44px "Baloo 2", system-ui, sans-serif';
    x.font = f; const w = Math.ceil(x.measureText(text).width) + 36;
    c.width = w; c.height = 64;
    x.font = f; x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc(32, 32, 32, Math.PI / 2, Math.PI * 1.5); x.arc(w - 32, 32, 32, -Math.PI / 2, Math.PI / 2); x.fill();
    x.fillStyle = '#3A2A14'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, 34);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
    sp.scale.set(0.4 * w / 64, 0.4, 1); sp.renderOrder = 10;
    return sp;
  }
  // list = [{ track, skin, name }]; name = Schild über der Murmel (leer = keins)
  function setGhosts(list = []) {
    for (const g of ghosts) { scene.remove(g.mesh); disposeObj(g.mesh); if (g.tag) { scene.remove(g.tag); disposeObj(g.tag); } }
    ghosts = [];
    for (const { track, skin, name } of list) {
      if (!track || !track.p || !track.p.length) continue;
      const b = createBallMesh(THREE);
      if (skin) b.setSkin(skin);
      b.mesh.castShadow = false;
      b.mesh.traverse(x => { if (x.material) Object.assign(x.material, { transparent: true, opacity: 0.4, depthWrite: false }); });
      scene.add(b.mesh);
      const tag = name ? nameTag(name) : null;
      if (tag) scene.add(tag);
      ghosts.push({ mesh: b.mesh, tag, track, last: new THREE.Vector3(), fresh: true });
    }
  }
  function moveGhosts() {
    for (const g of ghosts) {
      const p = ghostAt(g.track, game.time, gp), m = g.mesh;
      m.position.set(p[0], p[1], p[2]);
      if (g.tag) g.tag.position.set(p[0], p[1] + R + 0.45, p[2]);
      // rollen: um die Achse quer zur Bewegung drehen (Sprünge wie Neustart nicht)
      gDelta.subVectors(m.position, g.last); const d = gDelta.length();
      if (!g.fresh && d > 1e-4 && d < 3) { gAxis.crossVectors(UP, gDelta).normalize(); m.quaternion.premultiply(gQ.setFromAxisAngle(gAxis, d / R)); }
      g.last.copy(m.position); g.fresh = false;
    }
  }

  // ---------- Konfetti ----------
  const confetti = [];
  function burst(pos, n, colors) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.3), new THREE.MeshBasicMaterial({ color: colors[i % colors.length], side: THREE.DoubleSide }));
      m.position.copy(pos); scene.add(m);
      confetti.push({ m, v: new THREE.Vector3((Math.random() - 0.5) * 6, 4 + Math.random() * 5, (Math.random() - 0.5) * 6), life: 2 });
    }
  }

  // ---------- Runterfallen: Ring am Checkpoint, Murmel ploppt dort ein ----------
  const RING_FADE = 0.6, POP_T = 0.3;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.05, 40), new THREE.MeshBasicMaterial({ color: 0xFFC928, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.visible = false; scene.add(ring);
  let popT = -1, ringT = -1; // Zeit seit dem Einploppen (-1 = aus)
  function plopp() {
    popT = 0; ringT = 0;
    burst(ballMesh.position, 14, [0xFFC928, 0xFFFFFF]);
  }

  // ---------- Kamera ----------
  const camPos = new THREE.Vector3(), tmp = new THREE.Vector3(), ray = new THREE.Raycaster(), dir = new THREE.Vector3();
  let camInit = false;
  // Runterfallen: watch = Kamera bleibt stehen und schaut der Murmel nach, fly = Flug im Bogen zum Checkpoint (solange game.holdT)
  const lookPt = new THREE.Vector3(), flyP0 = new THREE.Vector3(), flyL0 = new THREE.Vector3();
  let watch = false, flyT = -1, flyArc = 0, lastTime = 0;
  // Bauteil-Kamera (z. B. Looping, Nagelwand): Anteil 0..1, Blickpunkt, Ort, wie weit vor dem Blickpunkt noch gezeichnet wird
  const elLook = new THREE.Vector3(), elPos = new THREE.Vector3(), occluders = [...blockers, ...pillarMeshes], faded = new Set();
  let elW = 0, elClear = 0;
  // Abstand so, dass `fit` Meter um den Blickpunkt ins Bild passen
  function elementCam(p) {
    let c = null;
    for (const h of cams) if ((c = h(p))) break;
    if (!c) return false;
    const dist = Math.min(24, c.fit / (Math.tan(camera.fov * Math.PI / 360) * Math.min(1, camera.aspect)));
    elPos.copy(elLook.set(...c.look)).addScaledVector(dir.set(...c.dir), dist);
    elClear = c.clear;
    return true;
  }
  // Was bei der Bauteil-Kamera zwischen Kamera und Murmel liegt, wird halb durchsichtig (statt die Kamera zu versetzen)
  function fade(on, target) {
    if (!on && !faded.size) return;
    const hits = new Set();
    if (on) {
      dir.subVectors(camera.position, target); const d = dir.length();
      ray.set(target, dir.divideScalar(d)); ray.far = d;
      for (const h of ray.intersectObjects(occluders, false)) hits.add(h.object);
    }
    for (const m of faded) if (!hits.has(m)) { m.material = m.userData.mat0; faded.delete(m); }
    for (const m of hits) if (!faded.has(m)) { m.userData.mat0 = m.material; m.material = seeThrough(m.material); faded.add(m); }
  }
  // Ort hinter der Murmel (in tmp). Ist etwas zwischen Murmel und Kamera, rückt die Kamera näher heran. Liefert das Nachziehtempo.
  function behind(target, fx, fz, rx, rz, back, side) {
    tmp.set(target.x - fx * back + rx * side, target.y + 7, target.z - fz * back + rz * side);
    dir.subVectors(tmp, target); const dist = dir.length(); dir.divideScalar(dist);
    ray.set(target, dir); ray.far = dist;
    const hit = ray.intersectObjects(blockers, false)[0];
    if (hit && hit.distance > 0.8) { tmp.copy(target).addScaledVector(dir, Math.max(2.5, hit.distance - 0.6)); return 0.3; }
    return 0.08;
  }
  // Kamera in camPos, Blick auf lookPt, ohne Kippen und ohne Bauteil-Kamera (Runterfallen)
  function still() {
    camera.position.copy(camPos); camera.lookAt(lookPt);
    if (camera.near !== 0.1) { camera.near = 0.1; camera.updateProjectionMatrix(); }
    fade(false);
    sun.position.set(lookPt.x + 6, lookPt.y + 14, lookPt.z + 6); sun.target.position.copy(lookPt);
    renderer.render(scene, camera);
  }
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  // lean = 1: Welt kippt sichtbar mit (Kippen), 0: ruhige Kamera, nur die Kugel rollt (Joystick)
  function render(dt, inX, inZ, camYaw, tiltDeg = 25, lean = 1) {
    const b = game.ball;
    ballMesh.position.set(b.position.x, b.position.y, b.position.z);
    ballMesh.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    // zerquetscht: platt auf dem Boden
    if (game.squashT > 0) { ballMesh.quaternion.set(0, 0, 0, 1); ballMesh.scale.set(1.6, 0.3, 1.6); ballMesh.position.y -= R * 0.7; }
    else if (popT >= 0 && popT < POP_T) { // einploppen: wächst mit kleinem Überschwingen
      const s = popT / POP_T - 1; ballMesh.scale.setScalar(1 + 2.70158 * s * s * s + 1.70158 * s * s); popT += dt;
    } else ballMesh.scale.set(1, 1, 1);
    ballMesh.visible = !(game.holdT > 0); // wartet am Checkpoint, bis die Kamera dort ist
    if (ringT >= 0) { // Ring nach dem Einploppen: wird grösser und blendet aus
      ringT += dt; const k = Math.min(1, ringT / RING_FADE);
      ring.material.opacity = 0.9 * (1 - k); ring.scale.setScalar(1 + k * 0.8);
      if (k >= 1) { ring.visible = false; ringT = -1; }
    }
    for (const t of ticks) t(dt, game);
    moveGhosts();
    if (groundFx && groundFx.tick) groundFx.tick(dt, camera);
    trailFx.update(dt, ballMesh.position);
    for (const [name, fx] of Object.entries(splash)) fx.update(dt, ballMesh.position, !!game.groundBody && game.surface === SURFACES[name]);
    ball.setDirt(game.dirt);
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
    if (game.time < lastTime) watch = false; // Level neu gestartet
    lastTime = game.time;
    if (game.holdT > 0) { // Flug im Bogen zum Checkpoint: Start = wo die Kamera beim Runterfallen stand, Ziel = hinter der wartenden Murmel
      behind(target, fx, fz, rx, rz, 10, 0);
      if (flyT < 0) {
        flyT = 0; watch = false; elW = 0; flyP0.copy(camPos); flyL0.copy(lookPt);
        ring.position.set(target.x, target.y - 1 + 0.04, target.z); ring.visible = true; ringT = -1;
        flyArc = Math.min(8, flyP0.distanceTo(tmp) * 0.35); // weiter weg = höherer Bogen (Überblick über die Bahn)
      }
      flyT += dt;
      const u = Math.min(1, flyT / RESPAWN_T), e = u * u * (3 - 2 * u);
      camPos.lerpVectors(flyP0, tmp, e); camPos.y += flyArc * Math.sin(Math.PI * e);
      lookPt.lerpVectors(flyL0, dir.set(target.x + fx * 3, target.y, target.z + fz * 3), e);
      ring.material.opacity = 0.9 * Math.min(1, u * 3); ring.scale.setScalar(1 + 0.12 * Math.sin(flyT * 9));
      return still();
    }
    flyT = -1;
    // Fällt die Murmel ins Leere, bleibt die Kamera stehen und schaut ihr nach (bis sie doch wieder auf etwas landet;
    // eine Kante streifen zählt nicht, danach fällt sie meist weiter)
    const bv = game.ball.velocity;
    if (watch && (game.groundBody || bv.y > 0 || game.squashT > 0)) watch = false;
    if (!watch && !game.touchBody && !game.lock && !(game.squashT > 0) && bv.y < -3 && game.insLeere()) watch = true;
    if (watch) { lookPt.lerp(target, 1 - Math.exp(-dt * 10)); return still(); }
    // Bei manchen Bauteilen (Looping, Nagelwand) übernimmt deren eigene Kamera, weich überblendet
    elW = Math.max(0, Math.min(1, elW + (elementCam([target.x, target.y, target.z]) ? dt : -dt) * 2.5));
    const w = elW * elW * (3 - 2 * elW);
    const k = w < 1 ? behind(target, fx, fz, rx, rz, 10 + inZ * 1.5 * lean, -inX * 1.5 * lean - lat) : 0.08;
    tmp.lerp(elPos, w);
    if (!camInit) { camPos.copy(tmp); camInit = true; } else camPos.lerp(tmp, k);
    camera.position.copy(camPos);
    camera.lookAt(lookPt.set(target.x + fx * 3, target.y, target.z + fz * 3).lerp(elLook, w));
    // Bahn sichtbar mitkippen: rechts kippen = rechte Seite tiefer (nicht bei der Bauteil-Kamera)
    const roll = tiltDeg * 0.3 * Math.PI / 180 * lean * (1 - w);
    camera.rotateZ(inX * roll); camera.rotateX(inZ * roll * 0.4);
    // Bauteil-Kamera: was näher bei der Kamera liegt als `clear` vor dem Blickpunkt, wird nicht gezeichnet (Wege, Säulen davor)
    const near = 0.1 + Math.max(0, camera.position.distanceTo(elLook) - elClear - 0.1) * w;
    if (camera.near !== near) { camera.near = near; camera.updateProjectionMatrix(); }
    fade(w > 0, target);
    sun.position.set(target.x + 6, target.y + 14, target.z + 6); sun.target.position.copy(target);
    renderer.render(scene, camera);
  }

  function dispose() {
    fade(false); // ausgeblendete Klötze zurück auf ihr Material, damit es mit aufgeräumt wird
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const ms = o.material ? [].concat(o.material) : [];
      for (const m of ms) { if (m.map) m.map.dispose(); m.dispose(); }
    });
    for (const m of thru.values()) m.dispose();
  }

  const view = { scene, camera, ballMesh, burst, plopp, render, resize, setSkin, setTrail: trailFx.set, trailFx, splash, ball, setGhosts, get ghost() { return ghosts.length ? ghosts[0].mesh : null; }, get ghosts() { return ghosts.map(g => g.mesh); }, dispose, fixedCam: null, sun, get goal() { return v.goal; } };
  return view;
}
