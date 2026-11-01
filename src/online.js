// Online-Rangliste (#9) über Supabase: pro Name und Level die Fahrt mit den meisten Punkten, dazu ihre Geist-Aufnahme
// und die Bestzeit (schnellste Fahrt ins Ziel, für die Rangliste „Schnellste“) mit ihrer Aufnahme.
// Nur fetch auf die drei Funktionen aus supabase/schema.sql, kein SDK. Ohne Netz, bei Fehlern oder Timeout läuft
// alles wie ohne Rangliste: Fehler werden geschluckt, neue Rekorde warten in localStorage und gehen später raus.
// Auf localhost (Tests, Entwicklung) ist die Rangliste aus, damit keine Testfahrten online landen;
// localStorage 'murmel-online' = 'an' schaltet sie dort ein (die Tests leiten die Anfragen dann auf page.route um).
// Der Publishable Key ist öffentlich gedacht: die Tabelle ist gesperrt, erlaubt sind nur die drei Funktionen.
import { score } from './score.js';

export const SUPABASE_URL = 'https://qnxkkwiflepmhokkeslx.supabase.co';
const KEY = 'sb_publishable_gJFi5aPRHaS0BcH7-s-UhA_4HSJ44vY';
const STORE = 'murmel-online-v1';
const TIMEOUT = 3000;

const local = /^(localhost|127\.|\[::1\])/.test(location.hostname);
const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

// Antwort des Servers: ok, abgelehnt (ungültig, nicht nochmal senden) oder nicht erreichbar (später nochmal)
async function rpc(fn, args) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST', signal: ctl.signal,
      headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args)
    });
    if (r.ok) return { ok: true, data: await r.json() };
    return { rejected: r.status === 400, status: r.status };
  } catch (e) { return {}; } finally { clearTimeout(timer); }
}

// Geist-Aufnahme prüfen, bevor sie in die Szene kommt (kommt von fremden Geräten)
const validTrack = g => g && typeof g === 'object' && Array.isArray(g.p) && g.p.length >= 3 && g.p.length % 3 === 0 &&
  g.p.every(Number.isFinite) && typeof g.skin === 'string';

export function createOnline(progress) {
  const on = !local || get('murmel-online') === 'an';
  let store = {};
  try { store = JSON.parse(get(STORE)) || {}; } catch (e) { /* kaputt: neu anfangen */ }
  store.queue = store.queue || {};
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(store)); } catch (e) { /* kein Speicher oder voll */ } };
  let rows = [], busy = null;

  // Beste Fahrt und Bestzeit zum Senden vormerken (pro Name und Level nur die neueste, sie hat immer die meisten Punkte).
  // ghost = Aufnahme der Fahrt mit den meisten Punkten, fast = Aufnahme der schnellsten Fahrt, wenn es eine andere ist
  // (sonst nimmt der Server ghost). Noch wartende Aufnahmen bleiben erhalten, solange Fahrt und Bestzeit dieselben sind.
  const queue = (name, level, run, ghost, best, fast = null) => {
    const k = name.toLowerCase() + '\n' + level, old = store.queue[k];
    best = Math.min(run.time, best || Infinity);
    if (!ghost && old && old.run.score === run.score) ghost = old.ghost;
    if (!fast && old && old.best === best && old.run.time !== best) fast = old.fast || (old.run.time === best ? old.ghost : null);
    store.queue[k] = { name, level, run, ghost, best, fast };
  };
  // Erster Start mit Rangliste: die schon gespeicherten besten Fahrten aller Spieler (ohne Aufnahme) nachtragen,
  // seit es die Rangliste „Schnellste“ gibt auch mit Bestzeit
  if (!store.seededBest) {
    for (const p of progress.players()) for (const [level, run] of Object.entries(p.runs || {})) queue(p.name, level, run, null, (p.times || {})[level]);
    store.seeded = store.seededBest = true; save();
  }

  // Vorgemerkte Fahrten der Reihe nach senden; bei Netzfehler aufhören und beim nächsten Mal weitermachen
  async function flush() {
    for (const [k, e] of Object.entries(store.queue)) {
      const { name, level, run, ghost, best, fast } = e;
      const args = {
        p_name: name, p_level: level, p_stars: run.stars, p_total: run.total, p_seconds: run.time,
        p_falls: run.falls, p_power: run.power, p_score: run.score, p_ghost: ghost
      };
      let r = await rpc('submit_run', { ...args, p_best: best || run.time, p_fast_ghost: fast || null });
      // Server noch mit dem alten schema.sql (submit_run ohne p_best): ohne Bestzeit senden und beim nächsten Start
      // alle Bestzeiten nochmal nachtragen, bis der Server sie annimmt
      if (r.status === 404) { r = await rpc('submit_run', args); store.seededBest = false; }
      if (!r.ok && !r.rejected) return false;
      if (store.queue[k] === e) delete store.queue[k];
      save();
    }
    return true;
  }

  // Rangliste holen: Zeilen wie progress.rows() (Punkte mit der aktuellen score() neu gerechnet), dazu ob es einen Geist gibt.
  // best_seconds fehlt bei einem Server mit altem schema.sql: dann zählt die Zeit der Fahrt mit den meisten Punkten.
  async function refresh() {
    const r = await rpc('get_ranking', {});
    if (!r.ok || !Array.isArray(r.data)) return false;
    rows = r.data.filter(x => x && typeof x.name === 'string' && typeof x.level === 'string').map(x => ({
      name: x.name, level: x.level, power: x.power, ghost: !!x.ghost, fastGhost: !!x.fast_ghost,
      stars: +x.stars, total: +x.total, falls: +x.falls,
      time: +x.seconds, best: Math.min(+x.seconds, +x.best_seconds || Infinity),
      score: score({ level: x.level, stars: +x.stars, total: +x.total, time: +x.seconds, falls: +x.falls })
    }));
    return true;
  }

  // Senden und danach die Rangliste neu holen; läuft schon eine Runde, wird keine zweite gestartet
  const sync = () => {
    if (!on) return Promise.resolve(false);
    if (!busy) busy = flush().then(refresh).finally(() => { busy = null; });
    return busy;
  };

  return {
    on,
    rows: () => rows,
    pending: () => Object.keys(store.queue).length,
    sync,
    // Fahrten eines Namens aus der Rangliste (frisch geholt), z. B. um einen Spielstand auf ein neues Gerät zu holen
    async findPlayer(name) {
      if (!on || !name) return [];
      await sync();
      return rows.filter(r => r.name.toLowerCase() === name.toLowerCase());
    },
    // Neuer Rekord (Punkte, dann mit Aufnahme, oder nur Bestzeit) eines Spielers in einem Level: vormerken und senden
    submit(name, level, run, ghost, best, fast) { if (!on) return Promise.resolve(false); queue(name, level, run, ghost, best, fast); save(); return sync(); },
    // Geist einer Online-Fahrt laden (null ohne Netz oder wenn es keinen gibt); kind 'zeit' = Aufnahme der schnellsten Fahrt
    async ghost(name, level, kind = 'punkte') {
      if (!on) return null;
      const r = await rpc('get_ghost', { p_name: name, p_level: level, ...(kind === 'zeit' ? { p_kind: 'zeit' } : {}) });
      return r.ok && validTrack(r.data) ? r.data : null;
    }
  };
}
