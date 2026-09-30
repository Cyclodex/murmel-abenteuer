# Hinweise für Claude

## Tests

Die volle Suite (`npm test`, 73 Tests) dauert im Cloud-Container 24 Minuten: 16 Autopilot-Tests fahren jedes Level mit
allen Stärken und Murmeln. `npm run test:schnell` (die übrigen 57) dauert dort 5.2 Minuten.
Die volle Suite läuft als GitHub Action (`.github/workflows/tests.yml`) nachts, wenn main neue Commits hat, und lässt sich
von Hand starten (Actions → „Tests (voll)“ → „Run workflow“). In der Session die volle Suite nicht selbst starten,
ausser der Benutzer will es.
Jeder PR startet `.github/workflows/pr.yml` („Tests (PR)“): `npm run test:schnell` und `pruefe-level.mjs` für die Level,
deren Datei oder Route der PR ändert (`tests/geaenderte-level.mjs`; Änderung an `src/levels/index.js`, `tests/autopilot.js`
oder `tests/pruefe-level.mjs` → alle Level).

**Tests nicht selbst in der Session starten** (weder `npm test` noch `test:schnell`, einzelne Playwright-Tests oder
`pruefe-level.mjs`), ausser der Benutzer will es: Das macht der PR (GitHub Action „Tests (PR)“, `.github/workflows/pr.yml`).
Nach dem Push das Ergebnis der Action abwarten und Fehler beheben.

Welche Tests eine Änderung betrifft (im PR-Text nennen):

| Geändert | Prüfen |
|---|---|
| Grafik, Kamera, Menüs, HUD (`view.js`, `themes.js`, `props.js`, `main.js`, `style.css`, `index.html`, `view()` der Bauteile) | `npm run test:schnell` (alles ausser den 16 Autopilot-Tests) oder einzelne Tests: `npx playwright test -g "<Name>"` |
| Ein Level oder seine Route (`src/levels/`, `tests/autopilot.js`, `tests/routes/`) | `node tests/pruefe-level.mjs <id>` (ohne Browser) für jedes betroffene Level; neues Level oder geänderte Strecke: Richtzeit mit `node tests/richtzeiten.mjs <id>` neu messen |
| Online-Rangliste (`src/online.js`, `supabase/schema.sql`) | Tests „Online-Rangliste“; SQL-Änderungen gegen ein lokales Postgres prüfen (Rollen `anon`, `authenticated` anlegen, Schema zweimal ausführen) und dem Benutzer sagen, dass er `schema.sql` im Supabase SQL-Editor neu ausführen muss |
| Physik, Bauteile, Murmeln (`game.js`, `solids`/`init`/`step` in `src/elements*.js`, `skins.js`, `input.js`) | `pruefe-level.mjs` für die Level, die das Bauteil nutzen, und `npm run test:schnell`; im PR erwähnen, dass die volle Suite nachts läuft |
