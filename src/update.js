// Neue Version erkennen. Die veröffentlichte Seite trägt ihre Version in <meta name="version"> und version.json
// (.github/stempel.mjs, beim Veröffentlichen). check() holt version.json ohne Cache und gibt die neue Version zurück
// ({ version, label }), wenn sie anders ist als die laufende, sonst null. Lokal (Tests, Entwicklung) steht dort "dev": aus.
// Das Spiel fragt dann, ob es neu laden soll: reload(v) lädt neu, later(v) merkt sich das Nein.
// Jede neue Version wird pro Tab nur einmal angeboten (sessionStorage): nach „Später“ fragt es für diese Version nicht
// mehr, und kommt nach dem Neuladen noch die alte Seite (Cache, Verteilung noch nicht fertig), fragt es nicht endlos.
// label: kurze Anzeige, "Version 0.3 · 01.11.26, 22:38" (Nummer = Updates auf main, Zeit des Commits in Ortszeit),
// ohne Nummer der Commit ("Version 3fd0424 · …"), lokal "Version dev". In der Vorschau eines PRs (<meta name="vorschau">,
// .github/workflows/vorschau.yml) davor "Vorschau PR 12 · ".
const KEY = 'murmel-update';

const labelOf = (version, zeit, nummer) => {
  const t = Date.parse(zeit || '');
  return `Version ${nummer || (version === 'dev' ? 'dev' : version.slice(0, 7))}` +
    (isNaN(t) ? '' : ' · ' + new Date(t).toLocaleString('de-CH', { dateStyle: 'short', timeStyle: 'short' }));
};

export function createUpdate(doc = document) {
  const meta = doc.querySelector('meta[name="version"]'), mine = meta ? meta.content : 'dev';
  const zeitMeta = doc.querySelector('meta[name="version-zeit"]'), nrMeta = doc.querySelector('meta[name="version-nummer"]');
  const vorschau = doc.querySelector('meta[name="vorschau"]')?.content;
  const tried = () => { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } };
  const remember = v => { try { sessionStorage.setItem(KEY, v); } catch (e) { /* ohne Speicher: dann fragt es wieder */ } };
  return {
    version: mine,
    label: (vorschau ? `Vorschau ${vorschau} · ` : '') + labelOf(mine, zeitMeta && zeitMeta.content, nrMeta && nrMeta.content),
    async check() {
      if (!mine || mine === 'dev') return null;
      try {
        const r = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
        const j = r.ok ? await r.json() : null, v = j && j.version;
        return typeof v === 'string' && v && v !== mine && v !== tried() ? { version: v, label: labelOf(v, j.zeit, typeof j.nummer === 'string' && j.nummer) } : null;
      } catch (e) { return null; } // ohne Netz: weiter mit der laufenden Version
    },
    reload(v) { remember(v); location.reload(); },
    later(v) { remember(v); }
  };
}
