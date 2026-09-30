// Online-Rangliste (#9) über Supabase: pro Name und Level die Fahrt mit den meisten Punkten, dazu ihre Geist-Aufnahme.
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
    return { rejected: r.status === 400 };
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

  // Beste Fahrt zum Senden vormerken (pro Name und Level nur die neueste, sie hat immer die meisten Punkte)
  const queue = (name, level, run, ghost) => { store.queue[name.toLowerCase() + '\n' + level] = { name, level, run, ghost }; };
  // Erster Start mit Rangliste: die schon gespeicherten besten Fahrten aller Spieler (ohne Aufnahme) nachtragen
  if (!store.seeded) {
    for (const p of progress.players()) for (const [level, run] of Object.entries(p.runs || {})) queue(p.name, level, run, null);
    store.seeded = true; save();
  }

  // Vorgemerkte Fahrten der Reihe nach senden; bei Netzfehler aufhören und beim nächsten Mal weitermachen
  async function flush() {
    for (const [k, { name, level, run, ghost }] of Object.entries(store.queue)) {
      const r = await rpc('submit_run', {
        p_name: name, p_level: level, p_stars: run.stars, p_total: run.total, p_seconds: run.time,
        p_falls: run.falls, p_power: run.power, p_score: run.score, p_ghost: ghost
      });
      if (!r.ok && !r.rejected) return false;
      if (store.queue[k] && store.queue[k].run === run) delete store.queue[k];
      save();
    }
    return true;
  }

  // Rangliste holen: Zeilen wie progress.rows() (Punkte mit der aktuellen score() neu gerechnet), dazu ob es einen Geist gibt
  async function refresh() {
    const r = await rpc('get_ranking', {});
    if (!r.ok || !Array.isArray(r.data)) return false;
    rows = r.data.filter(x => x && typeof x.name === 'string' && typeof x.level === 'string').map(x => ({
      name: x.name, level: x.level, power: x.power, ghost: !!x.ghost,
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
    // Neuer Rekord eines Spielers in einem Level: vormerken und senden
    submit(name, level, run, ghost) { if (!on) return Promise.resolve(false); queue(name, level, run, ghost); save(); return sync(); },
    // Geist einer Online-Fahrt laden (null ohne Netz oder wenn es keinen gibt)
    async ghost(name, level) {
      if (!on) return null;
      const r = await rpc('get_ghost', { p_name: name, p_level: level });
      return r.ok && validTrack(r.data) ? r.data : null;
    }
  };
}
