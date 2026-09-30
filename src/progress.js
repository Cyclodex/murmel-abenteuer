// Spielstand im Browser speichern (localStorage). Ohne Speicher läuft alles weiter, nur ohne Merken.
// Einstellungen (Steuerung, Stärke, Ton) gelten für alle, Sterne, Bonussterne, Bestzeiten, Punkte, Murmel, Spur und Sticker pro Spieler.
// bonus = Level, in denen der Bonusstern schon einmal ins Ziel gebracht wurde.
// runs = pro Level die Fahrt mit den meisten Punkten { stars, total, time, falls, power, score } (siehe score.js).
// Die Aufnahmen der Fahrten aus runs (Geistermurmel) liegen getrennt unter GHOST_KEY (grösser, dürfen verloren gehen).
const KEY = 'murmel-abenteuer-v2';
const GHOST_KEY = 'murmel-geist-v1';
const OLD_KEY = 'murmel-abenteuer-v1'; // alter Spielstand ohne Spieler
export const NAME_MAX = 16;

// Sticker gab es früher pro Level (lvl:, sterne:, bonus:): weglassen, gesammelte Bonussterne nach bonus übernehmen
const OLD_STICKER = /^(lvl|sterne|bonus):/;
const pick = (o, keep) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => keep(k)));
const oldBonus = st => Object.fromEntries(Object.keys(st || {}).filter(k => k.startsWith('bonus:')).map(k => [k.slice(6), true]));
const newPlayer = (name, from = {}) => ({
  id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  name, done: from.done || {}, best: from.best || {}, bonus: { ...oldBonus(from.stickers), ...from.bonus }, skin: from.skin || 'standard',
  stickers: pick(from.stickers, k => !OLD_STICKER.test(k)), trail: from.trail || 'keine', times: from.times || {}, runs: from.runs || {}
});

function load(key) {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    return d && typeof d === 'object' ? d : null;
  } catch (e) { return null; /* kein Speicher */ }
}

function read() {
  const d = load(KEY);
  if (d) {
    const players = Array.isArray(d.players) ? d.players.filter(p => p && p.id && p.name).map(p => ({ ...newPlayer(p.name, p), id: p.id })) : [];
    return { players, current: d.current || null, control: d.control || null, power: d.power || 'normal', sound: d.sound || 'alle', legacy: d.legacy || null, geist: d.geist || null };
  }
  // Alter Spielstand: Einstellungen übernehmen, Sterne bekommt der erste neue Spieler
  const o = load(OLD_KEY) || {};
  const legacy = o.done && Object.keys(o.done).length ? { done: o.done, best: o.best || {}, skin: o.skin, stickers: o.stickers, trail: o.trail } : null;
  return { players: [], current: null, control: o.control || null, power: o.power || 'normal', sound: o.sound || 'alle', legacy };
}

const stars = p => Object.values(p.best).reduce((a, b) => a + b, 0);
// Beste Fahrten als Zeilen für die Rangliste (gleiche Form wie später die Online-Rangliste, #9)
const rows = p => Object.entries(p.runs).map(([level, r]) => ({ name: p.name, level, score: r.score, power: r.power }));

export function createProgress() {
  const data = read();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* kein Speicher */ } };
  const ghosts = load(GHOST_KEY) || {}; // Spieler-ID -> Level-ID -> Aufnahme
  const saveGhosts = () => { try { localStorage.setItem(GHOST_KEY, JSON.stringify(ghosts)); } catch (e) { /* kein Speicher oder voll */ } };
  const empty = newPlayer('');
  const player = () => data.players.find(p => p.id === data.current) || null;
  const me = () => player() || empty; // ohne Spieler (vor der Auswahl): leerer Spielstand
  return {
    data,
    player,
    players: () => data.players,
    get skin() { return me().skin; },
    isDone: id => !!me().done[id],
    best: id => me().best[id] || 0,
    totalStars: (p = me()) => stars(p),
    // Zeilen aller Spieler für ranking() in score.js
    rows: () => data.players.flatMap(rows),
    // Neuer Spieler (oder vorhandener mit gleichem Namen) wird der aktuelle
    addPlayer(name) {
      name = String(name || '').trim().replace(/\s+/g, ' ').slice(0, NAME_MAX);
      if (!name) return null;
      let p = data.players.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (!p) { p = newPlayer(name, data.legacy || {}); data.legacy = null; data.players.push(p); }
      data.current = p.id; save();
      return p;
    },
    selectPlayer(id) { if (data.players.some(p => p.id === id)) { data.current = id; save(); } },
    hasBonus: id => !!me().bonus[id],
    // Level geschafft: merkt die beste Sternzahl und ob der Bonusstern dabei war
    finish(id, n, bonus = false) { const p = me(); p.done[id] = true; p.best[id] = Math.max(p.best[id] || 0, n); if (bonus) p.bonus[id] = true; save(); },
    run: id => me().runs[id] || null,
    // Fahrt mit Punkten: gibt true zurück, wenn sie mehr Punkte hat als die bisher beste in diesem Level
    setRun(id, r) { const p = me(), old = p.runs[id]; if (old && old.score >= r.score) return false; p.runs[id] = r; save(); return true; },
    // Bestzeit in Sekunden (0 = noch keine); setTime gibt true zurück, wenn die Zeit neu die beste ist
    bestTime: id => me().times[id] || 0,
    setTime(id, t) { const p = me(), old = p.times[id]; if (old && old <= t) return false; p.times[id] = +t.toFixed(2); save(); return true; },
    ghost: id => (player() && ghosts[player().id] && ghosts[player().id][id]) || null,
    // Aufnahme eines Spielers auf diesem Gerät (Name ohne Gross/Klein)
    ghostOf(name, id) { const p = data.players.find(x => x.name.toLowerCase() === name.toLowerCase()); return (p && ghosts[p.id] && ghosts[p.id][id]) || null; },
    setGhost(id, track) { const p = player(); if (!p) return; (ghosts[p.id] = ghosts[p.id] || {})[id] = track; saveGhosts(); },
    setSkin(id) { me().skin = id; save(); },
    get trail() { return me().trail; },
    setTrail(id) { me().trail = id; save(); },
    hasSticker: id => !!me().stickers[id],
    // Sticker ins Album kleben (ohne Speichern; danach save() aufrufen)
    addSticker(id) { me().stickers[id] = true; },
    save,
    setControl(c) { data.control = c; save(); },
    setPower(p) { data.power = p; save(); },
    setSound(m) { data.sound = m; save(); },
    // zuletzt gewählte Geister beim Levelstart ('ich', 'best', 'beide', 'kein')
    setGeist(g) { data.geist = g; save(); },
    clear() { const p = me(); p.done = {}; p.best = {}; p.bonus = {}; p.skin = 'standard'; p.stickers = {}; p.trail = 'keine'; p.times = {}; p.runs = {}; delete ghosts[p.id]; save(); saveGhosts(); }
  };
}
