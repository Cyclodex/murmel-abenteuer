# Hinweise für Claude

## Tests

Die volle Suite (`npm test`, 70 Tests) dauert im Cloud-Container 24 Minuten: 16 Autopilot-Tests fahren jedes Level mit
allen Stärken und Murmeln. `npm run test:schnell` (die übrigen 54) dauert dort 5 Minuten.
Die volle Suite läuft als GitHub Action (`.github/workflows/tests.yml`) nachts, wenn main neue Commits hat, und lässt sich
von Hand starten (Actions → „Tests (voll)“ → „Run workflow“). In der Session die volle Suite nicht selbst starten,
ausser der Benutzer will es.
Jeder PR startet `.github/workflows/pr.yml` („Tests (PR)“): `npm run test:schnell` und `pruefe-level.mjs` für die Level,
deren Datei oder Route der PR ändert (`tests/geaenderte-level.mjs`; Änderung an `src/levels/index.js`, `tests/autopilot.js`
oder `tests/pruefe-level.mjs` → alle Level).

Vor dem Push gezielt prüfen, passend zur Änderung:

| Geändert | Prüfen |
|---|---|
| Grafik, Kamera, Menüs, HUD (`view.js`, `themes.js`, `props.js`, `main.js`, `style.css`, `index.html`, `view()` der Bauteile) | `npm run test:schnell` (alles ausser den 16 Autopilot-Tests) oder einzelne Tests: `npx playwright test -g "<Name>"` |
| Ein Level oder seine Route (`src/levels/`, `tests/autopilot.js`, `tests/routes/`) | `node tests/pruefe-level.mjs <id>` (ohne Browser) für jedes betroffene Level |
| Physik, Bauteile, Murmeln (`game.js`, `solids`/`init`/`step` in `src/elements*.js`, `skins.js`, `input.js`) | `pruefe-level.mjs` für die Level, die das Bauteil nutzen, und `npm run test:schnell`; im PR erwähnen, dass die volle Suite nachts läuft |
