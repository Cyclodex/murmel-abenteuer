// Einstieg: verbindet Spiel, Grafik, Eingabe und Bedienoberfläche.
/* global THREE, CANNON */
import { createGame } from './game.js';
import { createRenderer, createView } from './view.js';
import { createInput } from './input.js';
import { SOUNDS, beep } from './audio.js';
import { LEVELS } from './levels/index.js';

const $ = id => document.getElementById(id);

let toastT = 0;
function toast(t) {
  const el = $('toast'); el.textContent = t; el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 2200);
}

const input = createInput({
  joy: $('joy'), knob: $('knob'), onToast: toast,
  onCalButton: on => $('btnCal').classList.toggle('hidden', !on)
});
const renderer = createRenderer(THREE, $('c'));

let game = null, view = null, running = false;

function loadLevel(level) {
  game = createGame(CANNON, level);
  view = createView(THREE, renderer, game);
  view.resize();
  game.reset();
}

function restart() {
  game.reset(); $('winOv').classList.add('hidden'); running = true;
  if (input.mode === 'tilt') input.calibrate();
}

async function start(wantTilt) {
  beep([1], 0.01); // Audio auf iOS freischalten
  $('startOv').classList.add('hidden');
  if (wantTilt) await input.useTilt(); else input.useJoy();
  game.reset(); running = true;
}

$('startTilt').onclick = () => start(true);
$('startJoy').onclick = () => start(false);
$('btnCal').onclick = () => input.calibrate();
$('btnReset').onclick = restart;
$('againBtn').onclick = restart;
addEventListener('resize', () => view.resize());

function onEvent(e) {
  SOUNDS[e]?.();
  if (e === 'star') view.burst(view.ballMesh.position, 12, [0xFFC928, 0xFFFFFF]);
  if (e === 'win') {
    running = false;
    view.burst(view.goal ? view.goal.position : view.ballMesh.position, 60, [0xFF5A8A, 0xFFC928, 0x3BB273, 0x2F6FEB]);
    $('winStars').textContent = '⭐'.repeat(game.st.stars) + '☆'.repeat(game.st.starTotal - game.st.stars);
    setTimeout(() => $('winOv').classList.remove('hidden'), 900);
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const [inX, inZ] = input.read();
  if (running) for (const e of game.step(inX, inZ, dt)) onEvent(e);
  $('stars').textContent = `⭐ ${game.st.stars}/${game.st.starTotal}`;
  view.render(dt, inX, inZ);
  requestAnimationFrame(loop);
}

loadLevel(LEVELS[0]);
requestAnimationFrame(loop);

// Für Tests und zum Ausprobieren in der Konsole
window.murmel = { get game() { return game; }, get running() { return running; }, LEVELS, loadLevel };
