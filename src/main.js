// Einstieg: verbindet Spiel, Grafik, Eingabe und Bedienoberfläche.
/* global THREE, CANNON */
import { createGame } from './game.js';
import { createRenderer, createView } from './view.js';
import { createInput, POWERS } from './input.js';
import { createAudio, SOUND_MODES, buzz } from './audio.js';
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
const audio = createAudio();
audio.setMode(progress.data.sound);
const power = () => POWERS.find(p => p.id === progress.data.power) || POWERS[1];
const ALL_STARS = LEVELS.reduce((n, l) => n + l.parts.filter(p => p.type === 'stern').length, 0);
const skinNeed = s => (s.need === 'alle' ? ALL_STARS : s.need);
const skinOpen = s => progress.totalStars() >= skinNeed(s);
const currentSkin = () => { const s = SKINS.find(k => k.id === progress.data.skin); return s && skinOpen(s) ? s : SKINS[0]; };

const input = createInput({
  area: $('c'), joy: $('joy'), knob: $('knob'), onToast: toast,
  onCalButton: on => show('btnCal', on)
});
const renderer = createRenderer(THREE, $('c'));
input.setPower(power());

let game = null, view = null, running = false, levelIdx = 0, camYaw = 0;

// Level-Reihenfolge: erstes Level jeder Welt offen, danach freigeschaltet durch das vorherige
function isOpen(i) {
  const lv = LEVELS[i], w = WORLDS.find(x => x.levels.includes(lv)), k = w.levels.indexOf(lv);
  return k === 0 || progress.isDone(w.levels[k - 1].id);
}

function loadLevel(i) {
  if (view) view.dispose();
  levelIdx = i;
  game = createGame(CANNON, LEVELS[i], currentSkin().ball);
  game.tilt = power().tilt * Math.PI / 180;
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
  audio.music(LEVELS[i].theme || 'standard'); audio.sfx('start');
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
  $('btnPower').textContent = power().emoji;
  $('btnSound').textContent = (SOUND_MODES.find(m => m.id === audio.mode) || SOUND_MODES[0]).emoji;
  audio.music('karte');
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
      b.onclick = () => { audio.sfx('tap'); startLevel(i); };
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
    b.onclick = () => { progress.setSkin(s.id); if (view) view.setSkin(s); showSkins(); audio.sfx('tap'); };
    grid.appendChild(b);
  }
  show('mapOv', false); show('skinOv');
}

// ---------- Start ----------
async function start(wantTilt) {
  audio.unlock(); // Audio muss aus einem Tipp heraus starten (iOS)
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
$('btnSkins').onclick = () => { audio.sfx('tap'); showSkins(); };
// Stärke der Steuerung umschalten: 🐢 -> 🐇 -> 🚀
$('btnPower').onclick = () => {
  const p = POWERS[(POWERS.indexOf(power()) + 1) % POWERS.length];
  progress.setPower(p.id); input.setPower(p); if (game) game.tilt = p.tilt * Math.PI / 180;
  $('btnPower').textContent = p.emoji; audio.sfx('tap');
};
// Ton umschalten: 🔊 alles -> ohne Musik -> 🔇
$('btnSound').onclick = () => {
  const m = SOUND_MODES[(SOUND_MODES.findIndex(x => x.id === audio.mode) + 1) % SOUND_MODES.length];
  progress.setSound(m.id); audio.setMode(m.id); $('btnSound').textContent = m.emoji; audio.sfx('tap');
};
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
  if (fresh.length) setTimeout(() => audio.sfx('unlock'), 1500);
  show('winUnlock', fresh.length > 0);
  show('nextBtn', levelIdx + 1 < LEVELS.length && isOpen(levelIdx + 1));
  view.burst(view.goal ? view.goal.position : view.ballMesh.position, 60, [0xFF5A8A, 0xFFC928, 0x3BB273, 0x2F6FEB]);
  setTimeout(() => { show('winOv'); show('joy', false); }, 900);
}

const VIBRATE = { boom: [80, 30, 40], roehre: 30, plopp: 20, star: 30, jump: 40, fall: 80, turbo: 20, click: 40, win: [60, 40, 60] };
function onEvent(e) {
  if (e === 'hit') { audio.sfx('hit', game.hitStrength); return; }
  if (e === 'tock') { audio.sfx('tock', game.tockIdx); return; }
  audio.sfx(e);
  if (VIBRATE[e]) buzz(VIBRATE[e]);
  if (e === 'star') view.burst(view.ballMesh.position, 12, [0xFFC928, 0xFFFFFF]);
  if (e === 'bonus') { buzz([30, 30, 30]); view.burst(view.ballMesh.position, 30, [0xC77DFF, 0xFFC928, 0xFFFFFF]); }
  if (e === 'win') onWin();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const [sx, sz] = input.read();
  // Kamera dreht weich mit der Bahn; Eingabe wirkt relativ zur Kamera
  camYaw += angleDiff(camYaw, game.track.yaw) * Math.min(1, dt * 3);
  const c = Math.cos(camYaw), s = Math.sin(camYaw);
  game.brake = input.mode === 'tilt' ? 0 : 1.5; // Joystick: Bremshilfe beim Loslassen
  if (running) for (const e of game.step(sx * c + sz * s, -sx * s + sz * c, dt)) onEvent(e);
  const bv = game.ball.velocity;
  audio.roll(running ? Math.hypot(bv.x, bv.y, bv.z) : 0, !!game.groundBody, game.groundBody?.userData?.surface || 'normal');
  $('stars').textContent = `⭐ ${game.st.stars}/${game.st.starTotal}`;
  view.render(dt, sx, sz, camYaw, power().tilt, input.mode === 'tilt' ? 1 : 0);
  requestAnimationFrame(loop);
}

loadLevel(0);
requestAnimationFrame(loop);

// Für Tests und zum Ausprobieren in der Konsole
window.murmel = {
  get game() { return game; }, get running() { return running; }, get camYaw() { return camYaw; },
  LEVELS, WORLDS, SKINS, progress, startLevel, showMap, audio, input, get view() { return view; }
};
