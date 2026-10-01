// Einstieg: verbindet Spiel, Grafik, Eingabe und Bedienoberfläche.
/* global THREE, CANNON */
import { createGame, R } from './game.js';
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
import { figurVon } from './checkpoint-figuren.js';
import { createRecorder, ghostAt, formatTime, DT } from './ghost.js';
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
const rec = createRecorder(); // Fahrt aufnehmen (für die Geistermurmel und die Online-Rangliste)
const online = createOnline(progress);
// Geister, die mitfahren: { level, list: [{ name, track, own }] }; null = die eigene beste Fahrt
let race = null;
// Zuschauen: { level, name, track, end }; die Murmel fährt eine Aufnahme nach (siehe followTrack)
let watching = null;

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

// Karten-Knopf: Symbol und Text darunter
function label(id, emoji, name) { const b = $(id); b.firstChild.textContent = emoji; b.lastChild.textContent = name; }
// Steuerung im Spiel/auf der Karte zeigen: Knopf-Symbol = aktueller Modus, Joystick nur im Spiel sichtbar
function syncControl() {
  const tilt = input.mode === 'tilt', emoji = tilt ? '📱' : '🕹️';
  $('btnControl').textContent = emoji; label('mapControl', emoji, tilt ? 'Kippen' : 'Joystick');
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
// Kamerafahrt (view.cinema): Überflug beim Levelstart (nicht in automatischen Tests, ausser mit ?flug) und nach dem Gewinn;
// Tippen auf das Bild überspringt sie
const FLUG = !navigator.webdriver || new URLSearchParams(location.search).has('flug');
const WIN_OV = 3, WIN_SKIP = 3.3; // Gewinn-Fenster nach 3 s (Hochflug ist bei 3.3 s oben)
let intro = false, winShow = null, winT = 0;
function stopCinema() {
  intro = false; winShow = null; clearTimeout(winT);
  if (view) view.cinema(null);
}
function endIntro() {
  if (!intro) return;
  stopCinema(); running = true;
  if (input.mode === 'tilt') input.calibrate(true);
}
$('c').addEventListener('pointerdown', () => {
  if (winShow) { view.cinemaSkip(WIN_SKIP); winShow(); } else endIntro();
});

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
  stopCinema();
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

// Geistermurmeln mit der Murmel, mit der sie gefahren sind: die gewählten oder die eigene beste Fahrt (falls vorhanden).
// Namensschild bei fremden Geistern, bei zwei Geistern auch beim eigenen.
const skinOf = track => SKINS.find(s => s.id === track.skin) || SKINS[0];
function showGhost() {
  const id = LEVELS[levelIdx].id, own = progress.ghost(id);
  const list = race && race.level === id ? race.list : own ? [{ name: progress.player().name, track: own, own: true }] : [];
  view.setGhosts(list.map(g => ({ track: g.track, skin: skinOf(g.track), name: !g.own || list.length > 1 ? g.name : '' })));
}

// list = Geister, die mitfahren (null = die eigene beste Fahrt)
function startLevel(i, list = null) {
  backdrop = false; watching = null; race = list ? { level: LEVELS[i].id, list } : null;
  loadLevel(i);
  ['mapOv', 'winOv', 'skinOv', 'albumOv', 'startOv', 'playerOv', 'rankOv', 'rankGhostOv', 'ghostOv'].forEach(id => show(id, false));
  $('hud').classList.remove('watch'); show('hud'); show('joy', input.mode === 'joy');
  if (FLUG) { intro = true; running = false; view.cinema('intro'); } // endIntro() startet das Spiel
  else { running = true; if (input.mode === 'tilt') input.calibrate(true); }
  toast(`${LEVELS[i].emoji} ${LEVELS[i].name}`);
  audio.music(LEVELS[i].theme || 'standard'); audio.sfx('start');
}

function restart() {
  stopCinema();
  if (pilot) pilot.i = 0;
  game.reset(); rec.reset(); showGhost(); camYaw = game.track.yaw; show('winOv', false); running = true;
  if (input.mode === 'tilt') input.calibrate();
}

// ---------- Karte ----------
function starRow(have, total) { return '⭐'.repeat(have) + '☆'.repeat(Math.max(0, total - have)); }
function showMap() {
  stopCinema();
  running = false; backdrop = true; watching = null;
  ['hud', 'joy', 'winOv', 'skinOv', 'albumOv', 'startOv', 'playerOv', 'treppeBack', 'rankOv', 'rankGhostOv', 'ghostOv'].forEach(id => show(id, false));
  syncStickers(); // schon verdiente Sticker nachtragen (alter Spielstand, anderer Spieler), ohne Jubel
  $('mapStars').textContent = `⭐ ${progress.totalStars()}`;
  $('btnPlayer').textContent = `👤 ${progress.player().name}`;
  label('btnPower', power().emoji, power().name);
  syncControl();
  const sound = SOUND_MODES.find(m => m.id === audio.mode) || SOUND_MODES[0];
  label('btnSound', sound.emoji, sound.name);
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
    b.onclick = () => { audio.sfx('tap'); chooseLevel(i); };
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
const fmtScore = n => n.toLocaleString('de-CH'); // Tausendertrenner: 25’123
const powerEmoji = r => r.power ? (POWERS.find(p => p.id === r.power) || POWERS[1]).emoji : '';
// Spielerliste als Text: "🥇 Anna 🏆3’274 ⭐12" (Namen nie als HTML einsetzen)
const rankText = (r, i) => `${MEDALS[i] || `${i + 1}.`} ${r.name} 🏆${fmtScore(r.score)}`;
// Alle Spieler auf dem Gerät nach Punkten (auch die ohne Fahrt, mit 0)
function playerRanking() {
  const pts = new Map(ranking(progress.rows()).map(r => [r.name.toLowerCase(), r.score]));
  return progress.players()
    .map(p => ({ id: p.id, name: p.name, score: pts.get(p.name.toLowerCase()) || 0, stars: progress.totalStars(p) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

// Lokale Fahrten und Online-Rangliste zusammen (pro Name und Level zählt in ranking() die beste)
const allRows = () => [...progress.rows(), ...online.rows()];

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
$('btnReset').onclick = () => { if (watching) game.reset(); else restart(); }; // Zuschauen: Aufnahme von vorne
$('btnHome').onclick = () => { if (watching) stopWatch(); else showMap(); };
$('againBtn').onclick = restart;
$('mapBtn').onclick = showMap;
$('nextBtn').onclick = () => { if (levelIdx + 1 < LEVELS.length) chooseLevel(levelIdx + 1); };
$('btnSkins').onclick = () => { audio.sfx('tap'); showSkins(); };
$('btnAlbum').onclick = () => { audio.sfx('tap'); showAlbum(); };
$('albumBack').onclick = showMap;
// Stärke der Steuerung umschalten: 🐢 -> 🐇 -> 🚀
$('btnPower').onclick = () => {
  const p = POWERS[(POWERS.indexOf(power()) + 1) % POWERS.length];
  progress.setPower(p.id); input.setPower(p); if (game) game.tilt = p.tilt * Math.PI / 180;
  label('btnPower', p.emoji, p.name); audio.sfx('tap');
};
// Ton umschalten: 🔊 alles -> 🔉 ohne Musik -> 🔇
$('btnSound').onclick = () => {
  const m = SOUND_MODES[(SOUND_MODES.findIndex(x => x.id === audio.mode) + 1) % SOUND_MODES.length];
  progress.setSound(m.id); audio.setMode(m.id); label('btnSound', m.emoji, m.name); audio.sfx('tap');
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
  const t = game.time, had = progress.bestTime(lv.id), fastest = progress.setTime(lv.id, t);
  // Geister, die mitgefahren sind: schneller als alle = Sticker 👻
  const ghosts = race && race.level === lv.id ? race.list.map(g => g.track) : [progress.ghost(lv.id)].filter(Boolean);
  // Punkte der Fahrt (Zeit gerundet wie gespeichert, damit sie sich aus den gespeicherten Werten nachrechnen lassen)
  const run = { stars: game.st.stars, total: game.st.starTotal, time: +t.toFixed(2), falls: game.st.falls, power: power().id };
  run.score = score({ level: lv.id, ...run });
  const hadRun = progress.run(lv.id), record = !lv.pruefstand && progress.setRun(lv.id, run); // Prüfstand: kein Rekord, nicht online
  // Neuer Rekord: die Fahrt wird der eigene Geist (auch in einer laufenden Wettfahrt) und geht mit Aufnahme in die
  // Online-Rangliste, danach Rangliste neu zeigen
  if (record) {
    const track = rec.track(t, currentSkin().id);
    progress.setGhost(lv.id, track);
    if (race) for (const g of race.list) if (g.own) g.track = track;
    online.submit(progress.player().name, lv.id, run, track).then(ok => { if (ok && lv === LEVELS[levelIdx]) showWinRank(); });
  }
  $('winScore').textContent = `🏆 ${fmtScore(run.score)}` + (run.falls ? ` · 💥${run.falls}` : '') + (record ? (hadRun ? ' 🆕' : '') : hadRun ? ` · 🏆 ${fmtScore(hadRun.score)}` : '');
  $('winTime').textContent = `⏱ ${formatTime(t)}` + (fastest ? (had ? ' 🏁 Bestzeit!' : '') : ` · 🏁 ${formatTime(had)}`);
  const after = progress.totalStars();
  const stickers = syncStickers({ dreckig: game.dirtPeak >= 1, sauber: game.washed, geist: ghosts.length > 0 && ghosts.every(g => t < g.t) });
  const fresh = SKINS.filter(s => skinNeed(s) > before && skinNeed(s) <= after);
  const freshTrails = TRAILS.filter(t => trailOpen(t) && !trailsBefore.includes(t));
  const news = [...fresh, ...freshTrails];
  $('winStars').textContent = starRow(game.st.stars, game.st.starTotal);
  $('winUnlock').textContent = news.length ? '🔮 ' + news.map(s => s.emoji).join(' ') + ' 🆕' : '';
  show('winUnlock', news.length > 0);
  const cheers = [...fresh.map(s => ({ emoji: s.emoji, text: 'Neue Murmel' })), ...freshTrails.map(t => ({ emoji: t.emoji, text: 'Neue Spur' })),
    ...stickers.map(st => ({ emoji: st.emoji, text: st.text, kind: '🏅 Neuer Sticker' }))];
  showWinRank();
  show('nextBtn', levelIdx + 1 < LEVELS.length && isOpen(levelIdx + 1));
  // Zielmoment, Hochflug über das Level mit der gefahrenen Strecke, dann das Gewinn-Fenster (Tippen: sofort)
  view.cinema('win', { track: rec.track(t) });
  winShow = () => { winShow = null; clearTimeout(winT); show('winOv'); show('joy', false); cheer.show(cheers); };
  winT = setTimeout(winShow, WIN_OV * 1000);
}

// Vergleich mit den anderen Spielern auf dem Gerät und online (beste Punkte in diesem Level, mit Stärke):
// die besten 5 und der eigene Platz; Knopf 👻 fährt gegen die Aufnahme des Besten (ausser sich selbst)
function showWinRank() {
  const id = LEVELS[levelIdx].id, rank = ranking(allRows(), id), me = progress.player().name.toLowerCase();
  const k = rank.findIndex(r => r.name.toLowerCase() === me);
  $('winRank').replaceChildren(rankTable(rank, [...rank.slice(0, 5), ...(k >= 5 ? [rank[k]] : [])], me).tab);
  show('winRank', rank.length > 1);
  const b = bestOther(id);
  $('winGhost').textContent = b ? `👻 ${place(b.i)} ${b.r.name}` : '';
  $('winGhost').dataset.name = b ? b.r.name : '';
  show('winGhost', !!b);
}
$('winGhost').onclick = async () => {
  audio.sfx('tap');
  const id = LEVELS[levelIdx].id, name = $('winGhost').dataset.name, track = name && await loadGhost(name, id);
  if (!track) { toast('📡 ❌'); return; }
  race = { level: id, list: [{ name, track }] }; restart(); toast(`👻 ${name}`);
};
$('winRank').onclick = () => { audio.sfx('tap'); showRanks(LEVELS[levelIdx].id, false); };

// ---------- Geister: eigene Aufnahmen und die der anderen (auf dem Gerät oder online) ----------
const same = (a, b) => a.toLowerCase() === b.toLowerCase();
const place = i => MEDALS[i] || `${i + 1}.`;
const okTrack = tr => (tr && Array.isArray(tr.p) && tr.p.length >= 3 ? tr : null);
// Aufnahme zu einem Namen: zuerst ein Spieler auf dem Gerät, sonst online (hasGhost weiss nur, ob es online eine gibt)
const localGhost = (name, id) => okTrack(progress.ghostOf(name, id));
const hasGhost = (name, id) => !!localGhost(name, id) || online.rows().some(x => x.ghost && x.level === id && same(x.name, name));
const loadGhost = async (name, id) => localGhost(name, id) || await online.ghost(name, id);
// Rangliste als Tabelle: Kopfzeile 🏆 (und 👻, wenn es Aufnahmen gibt), Platz, Name mit Stärke, Punkte rechtsbündig,
// eigene Zeile hervorgehoben. rows[j] gehört zu list[j]. Namen nur als Text einsetzen, nie als HTML.
function rankTable(rank, list, me, ghosts = false) {
  const tab = document.createElement('div'); tab.className = 'rtab';
  const line = (cls, cells) => {
    const row = document.createElement('div'); row.className = cls;
    for (const [c, t] of cells) { const x = document.createElement('span'); x.className = c; x.textContent = t; row.appendChild(x); }
    tab.appendChild(row); return row;
  };
  const cols = (pl, name, pts, gh) => [['rpl', pl], ['rname', name], ['rscore', pts], ...(ghosts ? [['rghost', gh]] : [])];
  line('rhead', cols('', '', '🏆', '👻'));
  const rows = list.map(r => line('rrow' + (same(r.name, me) ? ' me' : ''),
    cols(place(rank.indexOf(r)), [r.name, powerEmoji(r)].filter(Boolean).join(' '), fmtScore(r.score), '')));
  return { tab, rows };
}
// Bester andere Spieler mit Aufnahme in der Level-Rangliste: { r, i } (i = Platz) oder null
function bestOther(id) {
  const rank = ranking(allRows(), id), me = progress.player().name;
  const i = rank.findIndex(r => !same(r.name, me) && hasGhost(r.name, id));
  return i < 0 ? null : { r: rank[i], i };
}

// Level antippen: Hat ein anderer eine Aufnahme, wählen gegen wen: eigener Geist, der beste andere, beide oder keiner.
// Sonst geht es gleich los (mit dem eigenen Geist, falls vorhanden).
function chooseLevel(i) {
  const lv = LEVELS[i], best = bestOther(lv.id), own = okTrack(progress.ghost(lv.id)), me = progress.player().name;
  if (!best) { startLevel(i); return; }
  $('ghostTitle').textContent = `${lv.emoji} ${lv.name}`;
  const box = $('ghostPick'); box.textContent = '';
  const opts = [
    own && { id: 'ich', text: `👻 ${me}`, label: 'Gegen deinen Geist' },
    { id: 'best', text: `👻 ${place(best.i)} ${best.r.name}`, label: `Gegen ${best.r.name}` },
    own && { id: 'beide', text: '👻 👻', label: 'Gegen beide' },
    { id: 'kein', text: '🚫', label: 'Ohne Geist' }
  ].filter(Boolean);
  const pick = opts.some(o => o.id === progress.data.geist) ? progress.data.geist : opts[0].id;
  for (const o of opts) {
    const b = document.createElement('button');
    b.className = 'big' + (o.id === pick ? ' sel' : ''); b.dataset.geist = o.id; b.textContent = o.text;
    b.setAttribute('aria-label', o.label);
    b.onclick = async () => {
      audio.sfx('tap'); progress.setGeist(o.id);
      box.querySelectorAll('button').forEach(x => { x.disabled = true; });
      const list = o.id === 'ich' || o.id === 'beide' ? [{ name: me, track: own, own: true }] : [];
      const other = o.id === 'best' || o.id === 'beide' ? await loadGhost(best.r.name, lv.id) : null;
      if (other) list.push({ name: best.r.name, track: other });
      if ($('ghostOv').classList.contains('hidden')) return; // inzwischen zur Karte
      startLevel(i, list);
      if ((o.id === 'best' || o.id === 'beide') && !other) toast('📡 ❌');
    };
    box.appendChild(b);
  }
  ['mapOv', 'winOv', 'rankOv'].forEach(id => show(id, false));
  show('ghostOv');
}
$('ghostBack').onclick = () => { audio.sfx('tap'); showMap(); };

// ---------- Rangliste: 🌍 alle Level zusammen oder ein Level; 👻 bei einer Aufnahme: zuschauen 📺 oder gegen sie fahren 🏁 ----------
let rankPage = 0, rankFromWin = false;
const rankPages = () => [null, ...LEVELS.filter((lv, i) => !lv.pruefstand && isOpen(i))];
// levelId = diese Seite zeigen (null = 🌍); fromWin = vom Gewinn-Bildschirm aus (✔️ geht dorthin zurück, sonst zur Karte)
function showRanks(levelId = null, fromWin = false) {
  rankFromWin = fromWin;
  if (fromWin) show('winOv', false);
  else { stopCinema(); running = false; backdrop = true; ['hud', 'joy', 'mapOv', 'treppeBack'].forEach(id => show(id, false)); }
  rankPage = Math.max(0, rankPages().findIndex(lv => (lv ? lv.id : null) === levelId));
  renderRanks();
  show('rankOv');
  online.sync().then(ok => { if (ok && !$('rankOv').classList.contains('hidden')) renderRanks(); });
}
function renderRanks() {
  const pages = rankPages(), lv = pages[rankPage], id = lv ? lv.id : null, me = progress.player().name;
  $('rankTitle').textContent = lv ? `${lv.emoji} ${lv.name}` : '🌍';
  // die besten 10 und der eigene Platz
  const rank = ranking(allRows(), id), k = rank.findIndex(r => same(r.name, me));
  const list = [...rank.slice(0, 10), ...(k >= 10 ? [rank[k]] : [])];
  const { tab, rows } = rankTable(rank, list, me, !!id);
  $('rankList').replaceChildren(...(rank.length ? [tab] : []));
  // 👻 nur bei Aufnahmen: öffnet die Auswahl zuschauen / gegen den Geist fahren
  if (id) list.forEach((r, j) => {
    if (!hasGhost(r.name, id)) return;
    const b = document.createElement('button'); b.textContent = '👻'; b.setAttribute('aria-label', `Aufnahme von ${r.name}`);
    b.onclick = () => { audio.sfx('tap'); pickGhost(lv, r); };
    rows[j].querySelector('.rghost').appendChild(b);
  });
  show('rankEmpty', !rank.length);
}
// Auswahl zur Aufnahme eines Spielers: 📺 zuschauen, 🏁 gegen den Geist fahren (nicht gegen sich selbst), ✖️ zurück
function pickGhost(lv, r) {
  const own = same(r.name, progress.player().name);
  $('rankGhostTitle').textContent = `👻 ${r.name} · 🏆 ${fmtScore(r.score)}`;
  $('rankRace').textContent = `🏁 Gegen ${r.name} fahren`;
  show('rankRace', !own);
  const go = fn => async () => {
    audio.sfx('tap');
    const track = await loadGhost(r.name, lv.id);
    if ($('rankGhostOv').classList.contains('hidden')) return; // inzwischen geschlossen
    show('rankGhostOv', false);
    if (!track) { toast('📡 ❌'); return; }
    fn(track);
  };
  $('rankWatch').onclick = go(track => watchRun(LEVELS.indexOf(lv), r.name, track));
  $('rankRace').onclick = go(track => { startLevel(LEVELS.indexOf(lv), [{ name: r.name, track }]); toast(`👻 ${r.name}`); });
  show('rankGhostOv');
}
$('rankGhostBack').onclick = () => { audio.sfx('tap'); show('rankGhostOv', false); };
const flip = d => { audio.sfx('tap'); const n = rankPages().length; rankPage = (rankPage + d + n) % n; renderRanks(); };
$('rankPrev').onclick = () => flip(-1);
$('rankNext').onclick = () => flip(1);
$('rankBack').onclick = () => { audio.sfx('tap'); if (rankFromWin) { show('rankOv', false); show('winOv'); } else showMap(); };
$('mapStars').onclick = () => { audio.sfx('tap'); showRanks(); };

// ---------- Zuschauen: eine Aufnahme abspielen ----------
// Das Level läuft wie beim Fahren (Sterne, Schalter, Kamera), nur wird die Murmel jedes Bild auf die Aufnahme gesetzt,
// mit dem Tempo aus der Aufnahme. Ziel, Punkte und Sticker zählen nicht. Danach zurück zur Rangliste des Levels.
function watchRun(i, name, track) {
  race = null; backdrop = false; running = false;
  loadLevel(i);
  watching = { level: LEVELS[i].id, name, track, end: track.p.length / 3 * DT + 1.5 };
  view.setGhosts([]); view.setSkin(skinOf(track));
  ['mapOv', 'winOv', 'rankOv', 'rankGhostOv', 'ghostOv'].forEach(id => show(id, false));
  $('watchName').textContent = `📺 ${name}`;
  $('hud').classList.add('watch'); show('hud'); show('joy', false);
  audio.music(LEVELS[i].theme || 'standard');
}
function stopWatch() {
  const id = watching.level;
  watching = null; $('hud').classList.remove('watch');
  showRanks(id);
}
const wp = [0, 0, 0], wq = [0, 0, 0];
function followTrack() {
  const tr = watching.track, p = ghostAt(tr, game.time, wp), q = ghostAt(tr, game.time + DT, wq);
  let vx = (q[0] - p[0]) / DT, vy = (q[1] - p[1]) / DT, vz = (q[2] - p[2]) / DT;
  if (Math.hypot(vx, vy, vz) > 30) vx = vy = vz = 0; // Sprung in der Aufnahme (am Checkpoint neu eingesetzt)
  game.spawn(p);
  game.ball.velocity.set(vx, vy, vz);
  game.ball.angularVelocity.set(vz / R, 0, -vx / R); // rollen
}

const VIBRATE = { quetsch: [120, 40, 60], klapp: 30, platsch: 40, spritz: 30, spuel: [40, 60, 40], boom: [80, 30, 40], roehre: 30, plopp: 20, wieder: 20, star: 30, jump: 40, fall: 80, turbo: 20, click: 40, win: [60, 40, 60] };
function onEvent(e) {
  if (e === 'hit') { audio.sfx('hit', game.hitStrength); return; }
  if (e === 'tock') { audio.sfx('tock', game.tockIdx); return; }
  audio.sfx(e === 'cp' ? 'cp-' + figurVon(game.checkpoints[game.st.cp], game.level.theme) : e); // Checkpoint: Jubel der Figur
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
    // Boden unter dem Wegpunkt suchen (von oberhalb der höchsten Bahn: Ausflug startet auf 60 m)
    ray.reset();
    game.world.raycastClosest(new CANNON.Vec3(w.x, 100, w.z), new CANNON.Vec3(w.x, -20, w.z), { collisionFilterMask: 1, skipBackfaces: true }, ray);
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
  let [sx, sz] = watching ? [0, 0] : input.read();
  if (pilot && running) { const [ix, iz] = pilot.drive(); sx = ix * c - iz * s; sz = ix * s + iz * c; } // Welt -> Kamera
  game.brake = input.mode === 'tilt' || pilot ? 0 : 1.5; // Joystick: Bremshilfe beim Loslassen
  if (running) {
    for (const e of game.step(sx * c + sz * s, -sx * s + sz * c, dt)) onEvent(e);
    if (running) rec.add(game.time, game.ball.position);
    const tt = `⏱ ${formatTime(game.time)}`;
    if ($('timer').textContent !== tt) $('timer').textContent = tt;
  } else if (watching) {
    if (game.time > watching.end) stopWatch();
    else {
      followTrack();
      for (const e of game.step(0, 0, dt)) if (e !== 'win') onEvent(e);
      const tt = `⏱ ${formatTime(game.time)}`;
      if ($('timer').textContent !== tt) $('timer').textContent = tt;
    }
  }
  const bv = game.ball.velocity;
  audio.roll(running || watching ? Math.hypot(bv.x, bv.y, bv.z) : 0, !!game.groundBody, game.groundBody?.userData?.surface || 'normal');
  if (intro && view.cinemaT >= view.INTRO_END) endIntro();
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
  LEVELS, WORLDS, SKINS, TRAILS, ALBUM, cheer, progress, online, startLevel, showMap, get watching() { return watching; }, audio, input, get view() { return view; }, treppe, get backdrop() { return backdrop; }
};
