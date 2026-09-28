// Einstieg: verbindet Spiel, Grafik, Eingabe und Bedienoberfläche.
/* global THREE, CANNON */
import { createGame } from './game.js';
import { createRenderer, createView } from './view.js';
import { createInput } from './input.js';
import { SOUNDS, beep } from './audio.js';
import { WORLDS, LEVELS } from './levels/index.js';
import { SKINS } from './skins.js';
import { createProgress } from './progress.js';
import { angleDiff } from './math.js';

const $ = id => document.getElementById(id);
const show = (id, on = true) => $(id).classList.toggle('hidden', !on);

let toastT = 0;
function toast(t) {
  const el = $('toast'); el.textContent = t; el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 2200);
}

const progress = createProgress();
const ALL_STARS = LEVELS.reduce((n, l) => n + l.parts.filter(p => p.type === 'stern').length, 0);
const skinNeed = s => (s.need === 'alle' ? ALL_STARS : s.need);
const skinOpen = s => progress.totalStars() >= skinNeed(s);
const currentSkin = () => { const s = SKINS.find(k => k.id === progress.data.skin); return s && skinOpen(s) ? s : SKINS[0]; };

const input = createInput({
  area: $('c'), joy: $('joy'), knob: $('knob'), onToast: toast,
  onCalButton: on => show('btnCal', on)
});
const renderer = createRenderer(THREE, $('c'));

let game = null, view = null, running = false, levelIdx = 0, camYaw = 0;

// Level-Reihenfolge: erstes Level jeder Welt offen, danach freigeschaltet durch das vorherige
function isOpen(i) {
  const lv = LEVELS[i], w = WORLDS.find(x => x.levels.includes(lv)), k = w.levels.indexOf(lv);
  return k === 0 || progress.isDone(w.levels[k - 1].id);
}

function loadLevel(i) {
  if (view) view.dispose();
  levelIdx = i;
  game = createGame(CANNON, LEVELS[i]);
  view = createView(THREE, renderer, game);
  view.setSkin(currentSkin());
  view.resize();
  game.reset();
  camYaw = game.track.yaw;
}

function startLevel(i) {
  loadLevel(i);
  ['mapOv', 'winOv', 'skinOv', 'startOv'].forEach(id => show(id, false));
  show('hud'); show('joy', input.mode === 'joy');
  if (input.mode === 'tilt') input.calibrate(true);
  running = true;
  toast(`${LEVELS[i].emoji} ${LEVELS[i].name}`);
}

function restart() {
  game.reset(); camYaw = game.track.yaw; show('winOv', false); running = true;
  if (input.mode === 'tilt') input.calibrate();
}

// ---------- Karte ----------
function starRow(have, total) { return '⭐'.repeat(have) + '☆'.repeat(Math.max(0, total - have)); }
function showMap() {
  running = false;
  ['hud', 'joy', 'winOv', 'skinOv', 'startOv'].forEach(id => show(id, false));
  $('mapStars').textContent = `⭐ ${progress.totalStars()}`;
  const box = $('worlds'); box.textContent = '';
  for (const w of WORLDS) {
    const row = document.createElement('div'); row.className = 'world';
    row.innerHTML = `<div class="wicon" title="${w.name}">${w.emoji}</div><div class="levels"></div>`;
    w.levels.forEach((lv, k) => {
      const i = LEVELS.indexOf(lv), open = isOpen(i), total = lv.parts.filter(p => p.type === 'stern').length;
      const b = document.createElement('button');
      b.className = 'lvl' + (progress.isDone(lv.id) ? ' done' : '');
      b.disabled = !open; b.dataset.level = lv.id;
      b.setAttribute('aria-label', lv.name);
      b.innerHTML = open ? `<span>${lv.emoji}</span><span class="s">${starRow(progress.best(lv.id), total)}</span>` : `<span>🔒</span><span class="s">${k + 1}</span>`;
      b.onclick = () => startLevel(i);
      row.lastChild.appendChild(b);
    });
    box.appendChild(row);
  }
  show('mapOv');
}

// ---------- Murmel-Auswahl ----------
function showSkins() {
  const grid = $('skinGrid'); grid.textContent = '';
  for (const s of SKINS) {
    const b = document.createElement('button'), open = skinOpen(s);
    b.className = 'skin' + (currentSkin().id === s.id ? ' sel' : '');
    b.disabled = !open; b.dataset.skin = s.id;
    b.innerHTML = open ? s.emoji : `🔒<small>${skinNeed(s)}⭐</small>`;
    b.onclick = () => { progress.setSkin(s.id); if (view) view.setSkin(s); showSkins(); beep([660, 880], 0.07); };
    grid.appendChild(b);
  }
  show('mapOv', false); show('skinOv');
}

// ---------- Start ----------
async function start(wantTilt) {
  beep([1], 0.01); // Audio auf iOS freischalten
  progress.setControl(wantTilt ? 'tilt' : 'joy');
  if (wantTilt) await input.useTilt(); else input.useJoy();
  show('startOv', false);
  showMap();
}

$('startTilt').onclick = () => start(true);
$('startJoy').onclick = () => start(false);
$('btnCal').onclick = () => input.calibrate();
$('btnReset').onclick = restart;
$('btnHome').onclick = showMap;
$('againBtn').onclick = restart;
$('mapBtn').onclick = showMap;
$('nextBtn').onclick = () => { if (levelIdx + 1 < LEVELS.length) startLevel(levelIdx + 1); };
$('btnSkins').onclick = showSkins;
$('skinBack').onclick = showMap;
addEventListener('resize', () => view && view.resize());

function onWin() {
  running = false;
  const before = progress.totalStars();
  progress.finish(LEVELS[levelIdx].id, game.st.stars);
  const after = progress.totalStars();
  const fresh = SKINS.filter(s => skinNeed(s) > before && skinNeed(s) <= after);
  $('winStars').textContent = starRow(game.st.stars, game.st.starTotal);
  $('winUnlock').textContent = fresh.length ? '🎨 ' + fresh.map(s => s.emoji).join(' ') + ' 🆕' : '';
  show('winUnlock', fresh.length > 0);
  show('nextBtn', levelIdx + 1 < LEVELS.length && isOpen(levelIdx + 1));
  view.burst(view.goal ? view.goal.position : view.ballMesh.position, 60, [0xFF5A8A, 0xFFC928, 0x3BB273, 0x2F6FEB]);
  setTimeout(() => { show('winOv'); show('joy', false); }, 900);
}

function onEvent(e) {
  SOUNDS[e]?.();
  if (e === 'star') view.burst(view.ballMesh.position, 12, [0xFFC928, 0xFFFFFF]);
  if (e === 'win') onWin();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const [sx, sz] = input.read();
  // Kamera dreht weich mit der Bahn; Eingabe wirkt relativ zur Kamera
  camYaw += angleDiff(camYaw, game.track.yaw) * Math.min(1, dt * 3);
  const c = Math.cos(camYaw), s = Math.sin(camYaw);
  if (running) for (const e of game.step(sx * c + sz * s, -sx * s + sz * c, dt)) onEvent(e);
  $('stars').textContent = `⭐ ${game.st.stars}/${game.st.starTotal}`;
  view.render(dt, sx, sz, camYaw);
  requestAnimationFrame(loop);
}

loadLevel(0);
requestAnimationFrame(loop);

// Für Tests und zum Ausprobieren in der Konsole
window.murmel = {
  get game() { return game; }, get running() { return running; }, get camYaw() { return camYaw; },
  LEVELS, WORLDS, SKINS, progress, startLevel, showMap
};
