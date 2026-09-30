// Einstieg: verbindet Spiel, Grafik, Eingabe und Bedienoberfläche.
/* global THREE, CANNON */
import { createGame } from './game.js';
import { createRenderer, createView } from './view.js';
import { createInput, POWERS } from './input.js';
import { createAudio, SOUND_MODES, buzz } from './audio.js';
import { WORLDS, LEVELS } from './levels/index.js';
import { SKINS } from './skins.js';
import { createTreppenView } from './treppe.js';
import { TRAILS } from './trails.js';
import { buildAlbum } from './stickers.js';
import { createCheer } from './cheer.js';
import { createProgress } from './progress.js';
import { angleDiff } from './math.js';
import { createRecorder, formatTime } from './ghost.js';
import { score, ranking } from './score.js';
import { createOnline } from './online.js';

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
const currentSkin = () => { const s = SKINS.find(k => k.id === progress.skin); return s && skinOpen(s) ? s : SKINS[0]; };
const trailOpen = t => (t.need.stars ? progress.totalStars() >= t.need.stars : stickerCount() >= (t.need.stickers || 0));
const trailNeed = t => (t.need.stars ? t.need.stars + '⭐' : t.need.stickers + '🏅');
const currentTrail = () => { const t = TRAILS.find(k => k.id === progress.trail); return t && trailOpen(t) ? t : TRAILS[0]; };
const ALBUM = buildAlbum(WORLDS);
const stickerCount = () => ALBUM.all.filter(st => progress.hasSticker(st.id)).length;
const cheer = createCheer($('cheerOv'), audio);
const rec = createRecorder(); // Fahrt aufnehmen (für die Geistermurmel der Bestzeit und die Online-Rangliste)
const online = createOnline(progress);
let race = null; // { level, name, track }: Online-Geist, gegen den gerade gefahren wird (statt der eigenen Bestzeit)

// Neu verdiente Sticker ins Album kleben, gibt sie zurück. run = was in diesem Lauf passiert ist ({ dreckig, sauber, geist })
function syncStickers(run = {}) {
  const fresh = [];
  for (let pass = 0, added = true; added && pass < 4; pass++) { // Extras hängen von anderen Stickern ab
    added = false;
    const ctx = { ...run, skinsOpen: SKINS.filter(skinOpen).length, trailsOpen: TRAILS.filter(trailOpen).length };
    for (const st of ALBUM.all) if (!progress.hasSticker(st.id) && st.has(progress, ctx)) { progress.addSticker(st.id); fresh.push(st); added = true; }
  }
  if (fresh.length) progress.save();
  return fresh;
}

// Steuerung im Spiel/auf der Karte zeigen: Knopf-Symbol = aktueller Modus, Joystick nur im Spiel sichtbar
function syncControl() {
  const emoji = input.mode === 'tilt' ? '📱' : '🕹️';
  $('btnControl').textContent = emoji; $('mapControl').textContent = emoji;
  show('joy', input.mode === 'joy' && !$('hud').classList.contains('hidden'));
}
const input = createInput({
  area: $('c'), joy: $('joy'), knob: $('knob'), onToast: toast,
  onCalButton: on => show('btnCal', on),
  onMode: m => { progress.setControl(m); syncControl(); } // auch wenn Kippen ausfällt und zurückgeschaltet wird
});
const renderer = createRenderer(THREE, $('c'));
input.setPower(power());

let game = null, view = null, running = false, levelIdx = 0, camYaw = 0;

// Level-Reihenfolge: erstes Level jeder Welt offen (bei Welten mit need erst ab so vielen Sternen),
// danach freigeschaltet durch das vorherige
// Schwere Version (lv.schwer = ID des normalen Levels): offen, sobald das normale Level geschafft ist
const worldOpen = w => !w.need || progress.totalStars() >= w.need;
function isOpen(i) {
  const lv = LEVELS[i];
  if (lv.schwer) return progress.isDone(lv.schwer);
  const w = WORLDS.find(x => x.levels.includes(lv)), k = w.levels.indexOf(lv);
  return k === 0 ? worldOpen(w) : progress.isDone(w.levels[k - 1].id);
}

function loadLevel(i) {
  if (view) view.dispose();
  levelIdx = i;
  game = createGame(CANNON, LEVELS[i], currentSkin().ball);
  game.tilt = power().tilt * Math.PI / 180;
  view = createView(THREE, renderer, game);
  view.setSkin(currentSkin());
  view.setTrail(currentTrail());
  view.resize();
  game.reset(); rec.reset();
  camYaw = game.track.yaw;
  showGhost();
  setupPilot();
}

// Geistermurmel der Bestzeit (falls vorhanden) mit der Murmel, mit der sie gefahren ist; oder der gewählte Online-Geist
function showGhost() {
  const id = LEVELS[levelIdx].id, gh = race && race.level === id ? race.track : progress.ghost(id);
  view.setGhost(gh, gh && (SKINS.find(s => s.id === gh.skin) || SKINS[0]));
}

function startLevel(i) {
  backdrop = false; race = null;
  loadLevel(i);
  ['mapOv', 'winOv', 'skinOv', 'albumOv', 'startOv', 'playerOv'].forEach(id => show(id, false));
  show('hud'); show('joy', input.mode === 'joy');
  if (input.mode === 'tilt') input.calibrate(true);
  running = true;
  toast(`${LEVELS[i].emoji} ${LEVELS[i].name}`);
  audio.music(LEVELS[i].theme || 'standard'); audio.sfx('start');
}

function restart() {
  if (pilot) pilot.i = 0;
  game.reset(); rec.reset(); showGhost(); camYaw = game.track.yaw; show('winOv', false); running = true;
  if (input.mode === 'tilt') input.calibrate();
}

// ---------- Karte ----------
function starRow(have, total) { return '⭐'.repeat(have) + '☆'.repeat(Math.max(0, total - have)); }
function showMap() {
  running = false; backdrop = true;
  ['hud', 'joy', 'winOv', 'skinOv', 'albumOv', 'startOv', 'playerOv', 'treppeBack'].forEach(id => show(id, false));
  syncStickers(); // schon verdiente Sticker nachtragen (alter Spielstand, anderer Spieler), ohne Jubel
  $('mapStars').textContent = `⭐ ${progress.totalStars()}`;
  $('btnPlayer').textContent = `👤 ${progress.player().name}`;
  $('btnPower').textContent = power().emoji;
  syncControl();
  $('btnSound').textContent = (SOUND_MODES.find(m => m.id === audio.mode) || SOUND_MODES[0]).emoji;
  audio.music('karte');
  const box = $('worlds'); box.textContent = '';
  // pro Welt eine Reihe; hat ein offenes Level eine schwere Version, ist die Kachel diagonal geteilt:
  // oben links das normale Level, unten rechts das schwere (🔒, bis das normale geschafft ist)
  const tile = (lv, cls, label, html) => {
    const i = LEVELS.indexOf(lv), b = document.createElement('button');
    b.className = cls + (progress.isDone(lv.id) ? ' done' : '');
    b.disabled = !isOpen(i); b.dataset.level = lv.id;
    b.setAttribute('aria-label', label); b.title = label;
    b.innerHTML = html;
    b.onclick = () => { audio.sfx('tap'); startLevel(i); };
    return b;
  };
  const stars = lv => `<span class="s">⭐${progress.best(lv.id)}</span>`;
  for (const w of WORLDS) {
    const row = document.createElement('div'); row.className = 'world'; row.dataset.world = w.id;
    row.innerHTML = `<div class="wicon" title="${w.name}">${w.emoji}</div><div class="levels"></div>`;
    w.levels.forEach((lv, k) => {
      const hard = (w.hard || []).find(h => h.schwer === lv.id);
      if (!isOpen(LEVELS.indexOf(lv))) {
        // gesperrte Welt: so viele Sterne braucht es
        row.lastChild.appendChild(tile(lv, 'lvl', lv.name, `<span>🔒</span><span class="s">${k === 0 && !worldOpen(w) ? `${w.need}⭐` : k + 1}</span>`));
        return;
      }
      const normal = tile(lv, 'lvl', lv.name, `<span>${lv.emoji}</span>${stars(lv)}`);
      if (!hard) { row.lastChild.appendChild(normal); return; }
      const pair = document.createElement('div'); pair.className = 'pair';
      pair.append(normal, tile(hard, 'lvl hard', `💀 ${hard.name}`, isOpen(LEVELS.indexOf(hard)) ? `<span>${hard.emoji}</span>${stars(hard)}` : '<span>🔒</span>'));
      row.lastChild.appendChild(pair);
    });
    box.appendChild(row);
  }
  show('mapOv');
  online.sync(); // Rekorde nachsenden, Rangliste für den Gewinn-Bildschirm holen
}

// ---------- Spieler ----------
const MEDALS = ['🥇', '🥈', '🥉'];
// Rangliste als Text: "🥇 Anna 🏆3274 ⭐12" bzw. im Level "🥇 Anna 🏆1637 🐇" (Namen nie als HTML einsetzen)
const rankText = (r, i) => `${MEDALS[i] || `${i + 1}.`} ${r.name} 🏆${r.score}` + (r.power ? ` ${(POWERS.find(p => p.id === r.power) || POWERS[1]).emoji}` : '');
// Alle Spieler auf dem Gerät nach Punkten (auch die ohne Fahrt, mit 0)
function playerRanking() {
  const pts = new Map(ranking(progress.rows()).map(r => [r.name.toLowerCase(), r.score]));
  return progress.players()
    .map(p => ({ id: p.id, name: p.name, score: pts.get(p.name.toLowerCase()) || 0, stars: progress.totalStars(p) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

// Lokale Fahrten und Online-Rangliste zusammen (pro Name und Level zählt in ranking() die beste)
const allRows = () => [...progress.rows(), ...online.rows()];
// Weltrangliste in der Spieler-Auswahl: die besten 10 nach Punkten über alle Level
function showWorldRank() {
  const rank = ranking(allRows()).slice(0, 10);
  $('worldRank').textContent = ['🌍', ...rank.map(rankText)].join('\n');
  show('worldRank', online.rows().length > 0);
}

function showPlayers() {
  backdrop = true;
  ['mapOv', 'startOv'].forEach(id => show(id, false));
  const list = $('playerList'); list.textContent = '';
  playerRanking().forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'player' + (progress.player()?.id === r.id ? ' sel' : '');
    b.dataset.player = r.id; b.textContent = `${rankText(r, i)} ⭐${r.stars}`;
    b.onclick = () => { audio.sfx('tap'); progress.selectPlayer(r.id); showMap(); };
    list.appendChild(b);
  });
  showWorldRank();
  online.sync().then(ok => { if (ok && !$('playerOv').classList.contains('hidden')) showWorldRank(); });
  $('playerName').value = '';
  show('playerOv');
}
$('playerForm').onsubmit = e => {
  e.preventDefault();
  if (!progress.addPlayer($('playerName').value)) { $('playerName').focus(); return; }
  $('playerName').blur(); audio.sfx('tap'); showMap();
};

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
  const tg = $('trailGrid'); tg.textContent = '';
  for (const t of TRAILS) {
    const b = document.createElement('button'), open = trailOpen(t);
    b.className = 'skin' + (currentTrail().id === t.id ? ' sel' : '');
    b.disabled = !open; b.dataset.trail = t.id;
    b.innerHTML = open ? t.emoji : `🔒<small>${trailNeed(t)}</small>`;
    b.onclick = () => { progress.setTrail(t.id); if (view) view.setTrail(t); showSkins(); audio.sfx('tap'); };
    tg.appendChild(b);
  }
  show('mapOv', false); show('skinOv');
}

// ---------- Sticker-Album ----------
// eine Zeile pro Welt; Antippen eines Stickers zeigt, wofür es ihn gibt
const ALBUM_HINT = '👆 Tippe auf einen Sticker';
function showAlbum() {
  $('albumCount').textContent = `🏅 ${stickerCount()}/${ALBUM.all.length}`;
  const info = $('albumInfo'); info.textContent = ALBUM_HINT;
  const grid = $('albumGrid'); grid.textContent = '';
  for (const r of ALBUM.rows) {
    const row = document.createElement('div'); row.className = 'srow'; row.dataset.row = r.id;
    row.innerHTML = `<div class="wicon">${r.emoji}</div><div class="list"></div>`;
    for (const st of r.stickers) {
      const b = document.createElement('button'), got = progress.hasSticker(st.id);
      b.className = 'sticker' + (got ? ' got' : ''); b.dataset.sticker = st.id;
      b.setAttribute('aria-label', st.text);
      b.innerHTML = got ? `<span>${st.emoji}</span>` : `<span>${st.emoji}</span><b>🔒</b>`;
      b.onclick = () => {
        audio.sfx('tap');
        grid.querySelectorAll('.sticker.sel').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        info.textContent = `${st.emoji} ${st.text}` + (got ? ' ✅' : '');
      };
      row.lastChild.appendChild(b);
    }
    grid.appendChild(row);
  }
  show('mapOv', false); show('albumOv');
}

// ---------- Start ----------
async function start(wantTilt) {
  audio.unlock(); // Audio muss aus einem Tipp heraus starten (iOS)
  progress.setControl(wantTilt ? 'tilt' : 'joy');
  if (wantTilt) await input.useTilt(); else input.useJoy();
  show('startOv', false);
  if (progress.player()) showMap(); else showPlayers();
}

$('startTilt').onclick = () => start(true);
$('startJoy').onclick = () => start(false);
$('btnCal').onclick = () => input.calibrate();
// Steuerung wechseln (Kippen <-> Joystick), auch mitten im Spiel
async function toggleControl() {
  audio.sfx('tap');
  if (input.mode === 'tilt') input.useJoy(); else await input.useTilt();
}
$('btnControl').onclick = toggleControl;
$('mapControl').onclick = toggleControl;
$('btnReset').onclick = restart;
$('btnHome').onclick = showMap;
$('againBtn').onclick = restart;
$('mapBtn').onclick = showMap;
$('nextBtn').onclick = () => { if (levelIdx + 1 < LEVELS.length) startLevel(levelIdx + 1); };
$('btnSkins').onclick = () => { audio.sfx('tap'); showSkins(); };
$('btnAlbum').onclick = () => { audio.sfx('tap'); showAlbum(); };
$('albumBack').onclick = showMap;
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
$('btnPlayer').onclick = () => { audio.sfx('tap'); showPlayers(); };
// Treppe im Vollbild anschauen: alle Murmeln im Vergleich
$('btnTreppe').onclick = () => { audio.sfx('tap'); show('mapOv', false); show('treppeBack'); treppe.treppe.reset(); };
$('treppeBack').onclick = () => { audio.sfx('tap'); showMap(); };
addEventListener('resize', () => { if (view) view.resize(); treppe.resize(); });

function onWin() {
  running = false;
  const lv = LEVELS[levelIdx], before = progress.totalStars(), trailsBefore = TRAILS.filter(trailOpen);
  const bonus = game.els.some(e => e.type === 'stern' && e.bonus && e.got);
  progress.finish(lv.id, game.st.stars, bonus);
  // Bestzeit: neue Bestzeit speichert die Fahrt als Geistermurmel
  const t = game.time, had = progress.bestTime(lv.id), fastest = progress.setTime(lv.id, t);
  if (fastest) progress.setGhost(lv.id, rec.track(t, currentSkin().id));
  // Punkte der Fahrt (Zeit gerundet wie gespeichert, damit sie sich aus den gespeicherten Werten nachrechnen lassen)
  const run = { stars: game.st.stars, total: game.st.starTotal, time: +t.toFixed(2), falls: game.st.falls, power: power().id };
  run.score = score({ level: lv.id, ...run });
  const hadRun = progress.run(lv.id), record = !lv.pruefstand && progress.setRun(lv.id, run); // Prüfstand: kein Rekord, nicht online
  // Neuer Rekord: mit Aufnahme in die Online-Rangliste, danach Rangliste neu zeigen
  if (record) online.submit(progress.player().name, lv.id, run, rec.track(t, currentSkin().id)).then(ok => { if (ok && lv === LEVELS[levelIdx]) showWinRank(); });
  $('winScore').textContent = `🏆 ${run.score}` + (run.falls ? ` · 💥${run.falls}` : '') + (record ? (hadRun ? ' 🆕' : '') : hadRun ? ` · 🏆 ${hadRun.score}` : '');
  $('winTime').textContent = `⏱ ${formatTime(t)}` + (fastest ? (had ? ' 🏁 Bestzeit!' : '') : ` · 🏁 ${formatTime(had)}`);
  const after = progress.totalStars();
  const stickers = syncStickers({ dreckig: game.dirtPeak >= 1, sauber: game.washed, geist: fastest && had > 0 });
  const fresh = SKINS.filter(s => skinNeed(s) > before && skinNeed(s) <= after);
  const freshTrails = TRAILS.filter(t => trailOpen(t) && !trailsBefore.includes(t));
  const news = [...fresh, ...freshTrails];
  $('winStars').textContent = starRow(game.st.stars, game.st.starTotal);
  $('winUnlock').textContent = news.length ? '🔮 ' + news.map(s => s.emoji).join(' ') + ' 🆕' : '';
  show('winUnlock', news.length > 0);
  const cheers = [...news, ...stickers].map(x => x.emoji);
  showWinRank();
  show('nextBtn', levelIdx + 1 < LEVELS.length && isOpen(levelIdx + 1));
  view.burst(view.goal ? view.goal.position : view.ballMesh.position, 60, [0xFF5A8A, 0xFFC928, 0x3BB273, 0x2F6FEB]);
  setTimeout(() => { show('winOv'); show('joy', false); cheer.show(cheers); }, 900);
}

// Vergleich mit den anderen Spielern auf dem Gerät und online (beste Punkte in diesem Level, mit Stärke):
// die besten 5 und der eigene Platz; Knopf 👻 fährt gegen die Aufnahme des Besten (ausser sich selbst)
function showWinRank() {
  const id = LEVELS[levelIdx].id, rank = ranking(allRows(), id), me = progress.player().name.toLowerCase();
  const k = rank.findIndex(r => r.name.toLowerCase() === me);
  $('winRank').textContent = [...rank.slice(0, 5), ...(k >= 5 ? [rank[k]] : [])].map(r => rankText(r, rank.indexOf(r))).join('\n');
  show('winRank', rank.length > 1);
  const has = name => online.rows().some(x => x.ghost && x.level === id && x.name.toLowerCase() === name.toLowerCase());
  const i = rank.findIndex(r => r.name.toLowerCase() !== me && has(r.name)), best = rank[i];
  $('winGhost').textContent = best ? `👻 ${MEDALS[i] || `${i + 1}.`} ${best.name}` : '';
  $('winGhost').dataset.name = best ? best.name : '';
  show('winGhost', !!best);
}
$('winGhost').onclick = async () => {
  audio.sfx('tap');
  const id = LEVELS[levelIdx].id, name = $('winGhost').dataset.name, track = name && await online.ghost(name, id);
  if (!track) { toast('📡 ❌'); return; }
  race = { level: id, name, track }; restart(); toast(`👻 ${name}`);
};

const VIBRATE = { quetsch: [120, 40, 60], klapp: 30, platsch: 40, spritz: 30, spuel: [40, 60, 40], boom: [80, 30, 40], roehre: 30, plopp: 20, wieder: 20, star: 30, jump: 40, fall: 80, turbo: 20, click: 40, win: [60, 40, 60] };
function onEvent(e) {
  if (e === 'hit') { audio.sfx('hit', game.hitStrength); return; }
  if (e === 'tock') { audio.sfx('tock', game.tockIdx); return; }
  audio.sfx(e);
  if (VIBRATE[e]) buzz(VIBRATE[e]);
  if (e === 'star') view.burst(view.ballMesh.position, 12, [0xFFC928, 0xFFFFFF]);
  if (e === 'platsch') view.burst(view.ballMesh.position, 16, [0x5B3A1E, 0x7D5A36]);
  if (e === 'sauber') view.burst(view.ballMesh.position, 20, [0xFFFFFF, 0xBDEBFF, 0x7FC4F5]);
  if (e === 'bonus') { buzz([30, 30, 30]); view.burst(view.ballMesh.position, 30, [0xC77DFF, 0xFFC928, 0xFFFFFF]); }
  if (e === 'wieder') view.plopp();
  if (e === 'win') onWin();
  if ((e === 'fall' || e === 'zurueck') && pilot) pilot.fell();
}

// ---------- Zuschau-Modus: Spiel mit ?autopilot öffnen, der Test-Autopilot fährt sichtbar ----------
// Ringe = Wegpunkte (orange = aktuelles Ziel, lila = wartet dort, grau = erledigt).
const PILOT = new URLSearchParams(location.search).has('autopilot');
let pilotMod = null, pilot = null, marks = [];
if (PILOT) import('../tests/autopilot.js').then(m => { pilotMod = m; if (game) setupPilot(); });

function setupPilot() {
  pilot = null; marks = [];
  const wps = pilotMod && pilotMod.mainRoute(pilotMod.ROUTES[LEVELS[levelIdx].id]);
  show('pilotInfo', !!wps);
  if (!wps) return;
  pilot = pilotMod.createPilot(game, wps);
  const ray = new CANNON.RaycastResult();
  marks = wps.map(w => {
    if (w.x === undefined) return null; // „der Bahn folgen“ hat keinen Ort
    // Boden unter dem Wegpunkt suchen
    ray.reset();
    game.world.raycastClosest(new CANNON.Vec3(w.x, 40, w.z), new CANNON.Vec3(w.x, -20, w.z), { collisionFilterMask: 1, skipBackfaces: true }, ray);
    const m = new THREE.Mesh(new THREE.TorusGeometry(w.r ?? 1.2, 0.07, 6, 32), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    m.rotation.x = Math.PI / 2;
    m.position.set(w.x, (ray.hasHit ? ray.hitPointWorld.y : 0) + 0.06, w.z);
    view.scene.add(m);
    return m;
  });
}
function updatePilot() {
  if (!pilot) return;
  marks.forEach((m, k) => m && m.material.color.setHex(k < pilot.i ? 0x999999 : k > pilot.i ? 0xFFFFFF : pilot.waiting ? 0xC77DFF : 0xFF8A00));
  const v = game.ball.velocity, WAIT = { platAtFrom: 'wartet auf Plattform', platAtTo: 'fährt mit Plattform', bridgeUp: 'wartet auf Brücke', hoehe: 'steigt im Aufwind', balkenWeg: 'wartet auf den Balken', amBoden: 'wartet bis am Boden', abfluss: 'wartet bis im Abfluss' };
  $('pilotInfo').textContent = `🤖 Ziel ${Math.min(pilot.i + 1, marks.length)}/${marks.length} · ${Math.hypot(v.x, v.z).toFixed(1)} m/s` + (pilot.waiting ? ` · ${WAIT[pilot.waiting] || pilot.waiting}` : '');
}

// Hinter Start, Spieler, Karte und Murmel-Auswahl: alle Murmeln fallen die Treppe hinunter
const treppe = createTreppenView(THREE, CANNON, renderer, SKINS);
treppe.resize();
let backdrop = true;

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (backdrop) {
    audio.roll(0, false, 'normal');
    treppe.frame(dt);
    requestAnimationFrame(loop);
    return;
  }
  // Kamera dreht weich mit der Bahn; Eingabe wirkt relativ zur Kamera
  camYaw += angleDiff(camYaw, game.track.yaw) * Math.min(1, dt * 3);
  if (game.holdT > 0) camYaw = game.track.yaw; // nach dem Runterfallen: Blickrichtung am Checkpoint (die Kamera fliegt hin)
  const c = Math.cos(camYaw), s = Math.sin(camYaw);
  let [sx, sz] = input.read();
  if (pilot && running) { const [ix, iz] = pilot.drive(); sx = ix * c - iz * s; sz = ix * s + iz * c; } // Welt -> Kamera
  game.brake = input.mode === 'tilt' || pilot ? 0 : 1.5; // Joystick: Bremshilfe beim Loslassen
  if (running) {
    for (const e of game.step(sx * c + sz * s, -sx * s + sz * c, dt)) onEvent(e);
    if (running) rec.add(game.time, game.ball.position);
    const tt = `⏱ ${formatTime(game.time)}`;
    if ($('timer').textContent !== tt) $('timer').textContent = tt;
  }
  const bv = game.ball.velocity;
  audio.roll(running ? Math.hypot(bv.x, bv.y, bv.z) : 0, !!game.groundBody, game.groundBody?.userData?.surface || 'normal');
  updatePilot();
  $('stars').textContent = `⭐ ${game.st.stars}/${game.st.starTotal}`;
  view.render(dt, sx, sz, camYaw, power().tilt, input.mode === 'tilt' ? 1 : 0);
  requestAnimationFrame(loop);
}

loadLevel(0);
requestAnimationFrame(loop);

// Für Tests und zum Ausprobieren in der Konsole
window.murmel = {
  get game() { return game; }, get running() { return running; }, get camYaw() { return camYaw; },
  LEVELS, WORLDS, SKINS, TRAILS, ALBUM, cheer, progress, online, startLevel, showMap, audio, input, get view() { return view; }, treppe, get backdrop() { return backdrop; }
};
