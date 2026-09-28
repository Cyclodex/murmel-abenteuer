// Grafik mit three.js: baut die Szene aus den Spieldaten und zeichnet jedes Bild.
import { TYPES } from './elements.js';
import { R } from './game.js';

export function createRenderer(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  return renderer;
}

function makeMats(THREE) {
  return {
    floor: new THREE.MeshLambertMaterial({ color: 0xE2B26F }),
    ramp: new THREE.MeshLambertMaterial({ color: 0xF0C382 }),
    wall: new THREE.MeshLambertMaterial({ color: 0xA8743A }),
    pad: new THREE.MeshLambertMaterial({ color: 0xFF5A8A }),
    star: new THREE.MeshLambertMaterial({ color: 0xFFC928, emissive: 0x6a4a00 }),
    goal: new THREE.MeshLambertMaterial({ color: 0x3BB273, emissive: 0x1a5a30 }),
    goalFlag: new THREE.MeshLambertMaterial({ color: 0x3BB273 })
  };
}

function makeStarGeo(THREE) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.22 : 0.5, a = i * Math.PI / 5 + Math.PI / 2, x = Math.cos(a) * r, y = Math.sin(a) * r;
    i ? shape.lineTo(x, y) : shape.moveTo(x, y);
  }
  return new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false });
}

function ballTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = '#2F6FEB'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#FFFFFF'; x.fillRect(0, 26, 64, 12);
  return new THREE.CanvasTexture(c);
}

export function createView(THREE, renderer, game) {
  const scene = new THREE.Scene();
  const sky = game.level.sky ?? 0x9ED8F5;
  scene.background = new THREE.Color(sky);
  scene.fog = new THREE.Fog(sky, 40, 90);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a6a3a, 0.75));
  const sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
  scene.add(sun, sun.target);

  const v = { THREE, scene, mats: makeMats(THREE), starGeo: makeStarGeo(THREE), goal: null };

  for (const s of game.solids) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.half[0] * 2, s.half[1] * 2, s.half[2] * 2), v.mats[s.look] || v.mats.floor);
    m.position.set(...s.pos); m.quaternion.set(...s.quat); m.receiveShadow = true;
    scene.add(m);
  }
  const ticks = [];
  for (const el of game.els) {
    const r = TYPES[el.type].view?.(el, v);
    if (r && r.tick) ticks.push(r.tick);
  }

  const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 20), new THREE.MeshPhongMaterial({ map: ballTexture(THREE), shininess: 90 }));
  ballMesh.castShadow = true; scene.add(ballMesh);

  const confetti = [];
  function burst(pos, n, colors) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.3), new THREE.MeshBasicMaterial({ color: colors[i % colors.length], side: THREE.DoubleSide }));
      m.position.copy(pos); scene.add(m);
      confetti.push({ m, v: new THREE.Vector3((Math.random() - 0.5) * 6, 4 + Math.random() * 5, (Math.random() - 0.5) * 6), life: 2 });
    }
  }

  const camPos = new THREE.Vector3(0, 8, 12), tmp = new THREE.Vector3();
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  function render(dt, inX, inZ) {
    const b = game.ball;
    ballMesh.position.set(b.position.x, b.position.y, b.position.z);
    ballMesh.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    for (const t of ticks) t(dt, game);
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.v.y -= 9.8 * dt; c.m.position.addScaledVector(c.v, dt); c.m.rotation.x += dt * 6; c.life -= dt;
      if (c.life <= 0) { scene.remove(c.m); c.m.geometry.dispose(); c.m.material.dispose(); confetti.splice(i, 1); }
    }
    // Kamera folgt, kippt leicht mit der Eingabe
    const target = ballMesh.position;
    camPos.lerp(tmp.set(target.x * 0.6 - inX * 1.5, target.y + 7, target.z + 10 + inZ * 1.5), 0.08);
    camera.position.copy(camPos); camera.lookAt(target.x, target.y, target.z - 3);
    sun.position.set(target.x + 6, target.y + 14, target.z + 6); sun.target.position.copy(target);
    renderer.render(scene, camera);
  }

  return { scene, camera, ballMesh, burst, render, resize, get goal() { return v.goal; } };
}
