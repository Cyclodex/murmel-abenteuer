# Plan: Produktion auf Cloudflare und Konten

Stand 7.11.2026. Issues: #102 (Produktion auf Cloudflare), #103 (Rangliste-Backend auf Worker + D1), #104 (Konten),
#105 (Verkaufsfähig machen, folgt später). Dieser Plan beschreibt die Releases und zerlegt sie in Tasks, die je ein
Subagent (Sonnet, Review Opus) in einem PR umsetzt. Jeder Task nennt Dateien, Vertrag und Testweg.

## Zielbild

- **Ein Worker-Projekt** `murmel` liefert das Spiel als statische Dateien (Workers Static Assets) und beantwortet die
  Rangliste unter `/api/*` aus einer D1-Datenbank. Gleiche Origin für Spiel und API, darum kein CORS, kein Key.
- **Veröffentlichen** wie heute bei Push auf main: `_site` mit `.github/stempel.mjs` stempeln, dann `wrangler deploy`.
  `version.json` und `<meta name="version">` bleiben, `src/update.js` funktioniert unverändert.
- **Vorschauen** bleiben auf Cloudflare Pages (`murmel-vorschau`, `vorschau.yml`) mit Rangliste aus. Ein Wechsel auf
  Worker-Preview-URLs ist später möglich, aber nicht Teil dieses Plans.
- **Domain**: eigene Domain bei Cloudflare (Name: Entscheid des Benutzers), dazu `murmel.<konto>.workers.dev` als
  Ersatzadresse. GitHub Pages wird nach einer Übergangszeit abgeschaltet.
- **Konten** sind Spieler, nicht Geräte: Jeder Spieler im Spiel (`progress.players[]`) bekommt ein Konto aus Kennung und
  Geheimnis. Der Server kennt nur den Hash. Kein Login, keine E-Mail. Übertragung aufs zweite Gerät per Code.
- **Kauf-Flag** am Konto, vorbereitet für #105, dort erst mit Zahlungsanbieter befüllt.

## Dateien und Struktur (neu)

```
wrangler.jsonc            Worker-Konfiguration: main, assets (directory _site, run_worker_first ["/api/*"]), D1-Binding DB
worker/index.js           Router: /api/<fn> → Handler, alles andere → Assets
worker/rangliste.js       submit_run, get_ranking, get_ghost (Portierung von supabase/schema.sql)
worker/konto.js           Konto anlegen, prüfen, Übertragungscode, Kauf-Flag (ab K1)
worker/sql.js             SQL-Texte, eine Stelle
worker/migrations/0001_runs.sql, 0002_konten.sql …   D1-Migrationen (wrangler d1 migrations apply)
_headers                  Cache-Header für Static Assets (in _site kopiert)
tests/worker.spec.js      API-Tests gegen wrangler dev (lokale D1)
docs/plan-cloudflare-konten.md   dieser Plan
```

Der Client bleibt `src/online.js`: eine Basis-URL `/api`, dieselben drei Aufrufe, später die Konto-Aufrufe.

## API-Vertrag

Alle Aufrufe `POST /api/<fn>` mit JSON-Body, Antwort JSON. Status: 200 ok, 400 ungültig (Client sendet nicht nochmal),
403 fremdes Konto oder Name vergeben (Client zeigt Hinweis, sendet nicht nochmal), 429 zu viele Versuche, 5xx später nochmal.

| Funktion | Body | Antwort | Ab |
|---|---|---|---|
| `submit_run` | wie heute `p_name … p_max_stars`, ab K1 dazu `konto`, `geheimnis` | `true`/`false` (geändert?) | R0 |
| `get_ranking` | `{}`; ab K3 `{ konto }` | Zeilen `name, level, power, stars, total, falls, max_stars, seconds, best_seconds, ghost?, fast_ghost?` | R0 |
| `get_ghost` | `{ p_name, p_level, p_kind? }` | Aufnahme `{ t, skin, p }` oder `null` | R0 |
| `konto_anlegen` | `{ konto, geheimnis, name }` | `{ ok }` oder 403 `{ grund: 'name' }` | K1 |
| `konto_code` | `{ konto, geheimnis }` | `{ code, gueltig_bis }` | K2 |
| `konto_holen` | `{ code }` | `{ konto, geheimnis, name }` einmalig, sonst 403/429 | K2 |
| `konto_stand` | `{ konto, geheimnis }` | `{ name, gekauft }` | K4 |

Validierung aus `submit_run` (schema.sql Zeilen 65 bis 78) wird 1:1 übernommen: Name 1 bis 16 Zeichen ohne
Steuerzeichen, Level `^[a-z0-9]{1,16}$`, Sterne 0 bis 50 und `stars ≤ total`, Sekunden 0 < s < 10000, Stürze 0 bis
9999, Stärke `sanft|normal|extrem`, Punkte 0 bis 100000, Aufnahme Objekt mit `p`-Array und höchstens 65536 Bytes.

## Datenbank (D1, SQLite)

```sql
-- 0001_runs.sql
create table runs (
  name text not null, name_key text not null, level text not null,
  stars int, total int, seconds real, falls int, power text, score int,
  ghost text, best_seconds real, fast_ghost text, max_stars int,
  updated_at text not null default (datetime('now')),
  primary key (name_key, level)
);
-- 0002_konten.sql (K1)
create table konten (
  id text primary key,                 -- 22 Zeichen base64url, vom Client erzeugt
  geheimnis_hash text not null,        -- SHA-256 des Geheimnisses
  name text not null, name_key text not null unique,
  erstellt text not null default (datetime('now')), gesehen text,
  gekauft text, gekauft_quelle text    -- K4
);
alter table runs add column konto text references konten(id);
create index runs_konto on runs(konto);
-- 0003_codes.sql (K2)
create table codes (
  code_hash text primary key, konto text not null references konten(id),
  gueltig_bis text not null, versuche int not null default 0
);
```

Die drei Updates von `submit_run` (mehr Punkte, schneller, mehr Sterne) laufen als `db.batch([...])`, D1 führt einen
Batch atomar aus. Geister werden als Text gespeichert; `get_ranking` liefert sie wie heute mit, bis Task R3.2 sie
auslagert.

## Releases Hosting und Backend

### R0 Worker und D1 im Repo, lokal lauffähig (#103)

Kein sichtbares Verhalten für Spieler. Ergebnis: `npx wrangler dev` liefert das Spiel aus `_site` und beantwortet
`/api/*` aus einer lokalen D1.

- **R0.1 Worker-Grundgerüst und Deploy-Konfiguration.** `wrangler.jsonc`, `worker/index.js` (Router, 404 für unbekannte
  `/api/*`), `_headers`, `package.json`-Skripte `worker:dev` (stempelt nach `_site` mit Version `dev`, startet
  `wrangler dev`) und `worker:deploy`. README-Abschnitt „Veröffentlichen“ vorbereiten. Test: `wrangler dev` liefert
  `index.html` und `version.json`, `/api/nix` gibt 404. Sonnet.
- **R0.2 Rangliste portieren.** `worker/rangliste.js` mit `submit_run`, `get_ranking`, `get_ghost`, Migration
  `0001_runs.sql`, `tests/worker.spec.js` (startet `wrangler dev --local`, prüft jede Validierungsregel mit 400, die drei
  Update-Pfade, Geist-Grösse, Ablehnung ohne `p`). Sonnet, Review Opus (Transaktionen, Validierung).
- **R0.3 Client auf `/api` umstellen.** `src/online.js`: `API = new URL('api/', document.baseURI)`-artig relativ zur
  Seite, kein `apikey`-Header, 403 wie 400 behandeln (abgelehnt). Der 404-Fallback für den alten Server (Zeilen 81 bis
  82) entfällt. `tests/game.spec.js` `fakeSupabase` → `fakeApi` mit Route `**/api/**`, Header-Prüfung weg, `server.old`
  weg. Fehlerfilter `supabase.co` anpassen. Sonnet.
- **R0.4 Export und Import.** Skript `worker/import-supabase.mjs`: holt `get_ranking` und je Zeile beide Geister über
  `get_ghost` von Supabase (URL und Key als Argumente), schreibt SQL-Dateien für `wrangler d1 execute --file`. Trockenlauf
  gegen die lokale D1, Zählung Zeilen vorher und nachher. Sonnet.

### R1 Testbetrieb unter workers.dev (#102, #103)

Spiel und API laufen produktiv auf Cloudflare mit einer Kopie der Daten, GitHub Pages und Supabase laufen unverändert
weiter. Die Familie testet unter `murmel.<konto>.workers.dev`.

- **R1.1 Workflow `veroeffentlichen.yml`.** Aus `pages.yml` ableiten: stempeln wie heute, dann `wrangler deploy`, D1-Migrationen
  vorher mit `wrangler d1 migrations apply --remote`. Secrets wie `vorschau.yml` (`CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`); das Token braucht neu Workers Scripts Edit, D1 Edit, Zone DNS. Kopfkommentar erklärt die
  Einrichtung. `pages.yml` bleibt in R1 bestehen (Doppelbetrieb). Sonnet.
- **R1.2 Erste Datenkopie und Abnahme.** Import aus R0.4 gegen die echte D1, Spiel unter workers.dev durchspielen:
  Rekord senden, Rangliste, Geist, Spielstand holen, Update-Erkennung (zweiter Deploy), Installation als App. Checkliste
  im PR-Text. Benutzer.

### R2 Umzug auf die Domain (#102)

- **R2.1 Umzugs-Übergabe im Spiel.** `src/umzug.js` erweitern: `pack()` liefert den gepackten Spielstand auch als
  String; neue Funktion `umzugLink(ziel)` baut `https://<ziel>/#umzug=<daten>` (Stufen wie beim Cookie, aber bis
  32 KB). Beim Start liest `main.js` `#umzug=`: ohne eigenen Spielstand übernehmen, mit eigenem nachfragen („Spielstand
  von der alten Adresse übernehmen?“), danach Fragment entfernen. Geister wandern nicht (wie iOS). Test: Playwright
  mit zwei Origins (`localhost:8123` und `127.0.0.1:8123`). Sonnet.
- **R2.2 Umzugshinweis an der alten Adresse.** `index.html` und `main.js`: Wenn `<meta name="umzug" content="<ziel>">`
  gesetzt ist, zeigt die Karte oben ein Band „Das Spiel ist umgezogen“ mit Knopf (öffnet `umzugLink`), die Rangliste
  ist aus. `pages.yml` setzt den Meta-Tag per `sed` wie `vorschau.yml` den Vorschau-Tag. Sonnet.
- **R2.3 Cut-over (Benutzer, mit Checkliste im Issue).** Domain in Cloudflare auf den Worker, `wrangler.jsonc` `routes`
  ergänzen. Supabase-Funktion `submit_run` entziehen (`revoke execute … from anon`) → nur noch lesen. Import endgültig.
  `pages.yml` mit Umzugs-Meta laufen lassen. README: Spielen-Link, Abschnitte „Veröffentlichen“, „Online-Rangliste“,
  „Einrichtung“, „Pausieren“ entfernen. `rangliste-wach.yml` löschen. Sonnet für den PR, Benutzer für Domain und Supabase.

### R3 Aufräumen und schlanker (#102, #103)

Frühestens vier Wochen nach R2.

- **R3.1 GitHub Pages abschalten.** `pages.yml` löschen, Pages in den Repo-Einstellungen aus; alte Adresse antwortet dann
  404. Vorher prüfen, ob noch Zugriffe kommen (Cloudflare Analytics zeigt Referer `github.io`). Supabase-Projekt löschen,
  `supabase/` und `.mcp.json`-Eintrag entfernen, CLAUDE.md-Zeile zur Rangliste anpassen. Sonnet.
- **R3.2 Rangliste schlank.** `get_ranking` ohne Geister (nur `get_ghost` liefert sie), pro Level höchstens die 100
  besten Zeilen plus die eigenen (ab K3 über `konto`). Geister beim Aufnehmen ausdünnen: Punkte nur bei Richtungswechsel
  oder alle 100 ms statt alle 50 ms (Datei der Aufnahme in `src/ghost.js`), Wiedergabe interpoliert. Richtwert: ein
  Geist unter 20 KB. `pruefe-level.mjs` ist nicht betroffen, Playwright-Test „Online-Geist fahren“ prüft die Wiedergabe.
  Opus (Physik der Wiedergabe).

## Releases Konten (#104)

Beginnt nach R0.2 (Schema steht), läuft parallel zu R1 und R2. Sichtbar für Spieler erst mit K2.

### K1 Konto pro Spieler, Rekorde am Konto

- **K1.1 Backend.** Migration `0002_konten.sql`, `worker/konto.js`: `konto_anlegen` (Name frei oder gleicher Name mit
  Zeile ohne Konto → Konto übernimmt die Zeilen, sonst 403 `name`), Prüfung `geheimnis` gegen Hash in `submit_run`
  (Pflicht, sonst 403 `konto`). Übergang: `runs`-Zeilen ohne `konto` sind 60 Tage übernehmbar, danach gesperrt
  (Datum fest im Code). Hash mit `crypto.subtle.digest('SHA-256')`. Keine Rate-Begrenzung nötig für `submit_run`
  (Geheimnis 32 Bytes). Tests in `tests/worker.spec.js`. Sonnet, Review Opus.
- **K1.2 Client.** `src/progress.js`: `newPlayer` erzeugt `konto: { id, geheimnis }` (`crypto.getRandomValues`), bestehende
  Spieler bekommen es beim nächsten Laden nach. `src/online.js`: vor dem ersten `submit_run` eines Spielers
  `konto_anlegen`; 403 `name` → Ereignis `nameVergeben`, das `main.js` als Dialog zeigt („Diesen Namen hat schon jemand
  online. Ist das dein Name? Dann hol dein Konto vom anderen Gerät (ab K2), sonst wähl einen anderen Namen.“), bis dahin
  bleibt der Spieler offline. `murmel-online-v1`-Queue trägt die Konto-Kennung mit. Spielstand (`murmel-abenteuer-v2`)
  bleibt kompatibel, nur ein neues Feld. iOS-Umzug (`umzug.js`) und R2.1 packen das Konto mit. Sonnet.

### K2 Übertragung aufs zweite Gerät

- **K2.1 Backend.** Migration `0003_codes.sql`, `konto_code` (6 Zeichen aus `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, 10 Minuten,
  nur Hash gespeichert, pro Konto höchstens ein offener Code), `konto_holen` (gibt Konto und Geheimnis einmal heraus,
  löscht den Code; falscher Code zählt `versuche`, ab 5 Versuchen gesperrt; pro IP höchstens 20 `konto_holen` pro
  Stunde über KV oder eine kleine Tabelle). Tests. Sonnet, Review Opus (Missbrauch).
- **K2.2 Client.** Spieler-Menü: „Auf ein anderes Gerät“ zeigt Code gross mit Ablaufzeit; auf dem anderen Gerät im
  Spieler-anlegen-Dialog „Ich habe einen Code“ (6 grosse Felder, nur die erlaubten Zeichen). Nach `konto_holen`: Spieler
  mit Name und Konto anlegen, dann direkt „Spielstand holen“ (bestehender Ablauf `#restoreOv`, hier ohne Nachfrage).
  Kinder-tauglich: keine Tastatur-Pflicht, Grossbuchstaben automatisch. Playwright-Test mit zwei Kontexten. Sonnet.

### K3 Spielstand holen und Rangliste am Konto

- **K3.1.** `get_ranking` nimmt `konto` entgegen und liefert die eigenen Zeilen immer, auch wenn R3.2 die Liste kürzt.
  `progress.restore` prüft Zeilen über `konto` statt Namen. „Spielstand holen“ erscheint nur noch für das eigene Konto;
  der Fall „gleicher Name auf anderem Gerät“ führt zu K2. Namensänderung am Konto (`konto_name`, gleicher Vertrag wie
  `konto_anlegen`) als Zusatz, falls Zeit. Sonnet.

### K4 Kauf-Flag (Vorbereitung für #105)

- **K4.1.** `konto_stand` liefert `gekauft`; Client cached es in `progress` und fragt beim Start nach (3 s Timeout, bei
  Fehler bleibt der Cache). Noch kein Webhook und keine Sperre im Spiel; das kommt in #105 mit dem Zahlungsanbieter.
  Sonnet.

## Reihenfolge und Abhängigkeiten

```
R0.1 → R0.2 → R0.3 → R0.4 → R1.1 → R1.2 → R2.1 → R2.2 → R2.3 → (4 Wochen) → R3.1, R3.2
              └─────────── K1.1 → K1.2 → K2.1 → K2.2 → K3.1 → K4.1
```

K1 kann ab R0.2 beginnen, sollte aber vor R2.3 produktiv sein, damit beim Cut-over gleich Konten entstehen und die
60-Tage-Übergangsfrist für alte Namen mit dem Umzug startet.

## Tests und PR-Regeln

- Worker: `tests/worker.spec.js` läuft in `pr.yml` als eigener Job (`npx wrangler dev --local` mit `--port`, dann
  `node --test`), ohne Browser, unter einer Minute.
- Client: Tests „Online-Rangliste“ in `tests/game.spec.js` (Teil von `test:schnell`), Fake-API statt Fake-Supabase.
- Kein Level betroffen, `pruefe-level.mjs` läuft nur bei R3.2 (Geist-Wiedergabe) nicht, dort ersetzt der
  Playwright-Test „Online-Geist fahren“ die Prüfung.
- Jeder Task ist ein PR gegen main mit Verweis auf sein Unter-Issue. Vorschau-Deploy bleibt an, Rangliste dort aus.

## Entscheide des Benutzers

1. Domainname und ob die Domain bei Cloudflare registriert oder nur per DNS dorthin gezeigt wird.
2. Token-Rechte erweitern (Workers Scripts Edit, D1 Edit, Zone DNS) und als Secret eintragen, vor R1.1.
3. Übergangsfrist für Namen ohne Konto (Vorschlag 60 Tage) und Dauer des Doppelbetriebs vor R3 (Vorschlag 4 Wochen).
4. Ob mehrere Spieler pro Gerät bleiben (Plan: ja, jeder Spieler ein Konto).
