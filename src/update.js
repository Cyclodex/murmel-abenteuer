// Neue Version erkennen und neu laden. Die veröffentlichte Seite trägt ihre Version in <meta name="version"> und
// version.json (.github/stempel.mjs, beim Veröffentlichen). check() holt version.json ohne Cache und gibt die neue
// Version zurück, wenn sie anders ist als die laufende, sonst null. Lokal (Tests, Entwicklung) steht dort "dev": aus.
// Jede neue Version wird pro Tab nur einmal versucht (sessionStorage): kommt nach dem Neuladen noch die alte Seite
// (Cache, Verteilung noch nicht fertig), lädt es nicht endlos neu, die neue kommt dann beim nächsten Mal.
// label: kurze Anzeige für die Karte, "Version 3fd0424 · 01.11.26, 22:38" (Zeit des Commits, Ortszeit), lokal "Version dev".
const KEY = 'murmel-update';

export function createUpdate(doc = document) {
  const meta = doc.querySelector('meta[name="version"]'), mine = meta ? meta.content : 'dev';
  const zeitMeta = doc.querySelector('meta[name="version-zeit"]'), zeit = zeitMeta ? Date.parse(zeitMeta.content) : NaN;
  const when = isNaN(zeit) ? '' : ' · ' + new Date(zeit).toLocaleString('de-CH', { dateStyle: 'short', timeStyle: 'short' });
  const tried = () => { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } };
  return {
    version: mine,
    label: `Version ${mine === 'dev' ? 'dev' : mine.slice(0, 7)}${when}`,
    async check() {
      if (!mine || mine === 'dev') return null;
      try {
        const r = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
        const v = r.ok ? (await r.json()).version : null;
        return typeof v === 'string' && v && v !== mine && v !== tried() ? v : null;
      } catch (e) { return null; } // ohne Netz: weiter mit der laufenden Version
    },
    reload(v) {
      try { sessionStorage.setItem(KEY, v); } catch (e) { /* ohne Speicher: trotzdem neu laden */ }
      location.reload();
    }
  };
}
