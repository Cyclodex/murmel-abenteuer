# Hinweise für Claude

## Modelle und Kontext

Am 6. Nov. 2026 waren 95 % des 5-Stunden-Limits nach 56 Minuten weg: 11 Sessions gleichzeitig, 84 % des Verbrauchs auf Fable,
44 % in Subagenten, jeder Aufruf las im Schnitt 270k Tokens neu. Der Benutzer will das nicht mehr.

| Modell | Wofür |
|---|---|
| `fable` | Nur Planen und Entwerfen: Aufgabe zerlegen, Welt, Level oder Bauteil entwerfen, Briefings schreiben. Nie als Subagent, nie für eine Seitensession. |
| `opus` | Viel Urteil nötig: Physik, neue Bauteile, Fehler ohne klare Ursache, Reviews (`subagent_type: "reviewer"`). |
| `sonnet` | Standard fürs Umsetzen: Level nach Entwurf, Routen, Grafik, Menüs, Doku (`subagent_type: "implementer"`). |

- **Fable delegiert.** Eine Fable-Session plant und gibt das Umsetzen an Subagenten auf Sonnet oder Opus. Selbst macht sie nur,
  was wirklich nötig ist: ein paar Befehle (`git`, `gh`), kurzes Nachlesen, Entscheide. Bezahlt wird jeder Aufruf mit ihrem ganzen Kontext.
- **Modell immer nennen,** bei jedem `Agent`- und jedem `start_session`-Aufruf. Keine Forks (`subagent_type: "fork"`) aus einer
  Fable-Session: Sie erben Fable.
- **Wenig gleichzeitig.** Höchstens zwei Seitensessions. Vorher mit `get_usage` das Limit lesen: Über 50 % des 5-Stunden-Limits
  keine neue Session und keinen Workflow starten; über 80 % den Stand committen und pushen und dem Benutzer melden.
- **Kontext klein.** `.claude/settings.json` kompaktiert bei 250k (`autoCompactWindow`, übersteuert die Benutzer-Einstellung),
  `implementer` und `reviewer` bei 200k. Nicht höher ohne den Benutzer, nie 1M.
- **Neue Aufgabe, neuer Kontext.** Frische Session oder frischer Subagent, im Briefing Dateien und Issue statt Chatverlauf.
  Bei jedem Meilenstein (Commit, PR) `get_usage` lesen; über 150k den Stand zuerst sichern (Commit, Issue oder PR-Text).
- **Ausgaben klein.** Dateien nach Zeilenbereich, grosse Ausgaben in eine Datei und mit `grep` lesen, nie ein ganzes Log.

Technisch festgelegt sind nur die Kompaktion und das Standardmodell der Subagenten (Sonnet, wenn der Aufruf keines nennt).
Der Rest gilt als Regel: Das Modell einer Session wählt der Benutzer.

## Tests

Die volle Suite (`npm test`, 95 Tests) dauert im Cloud-Container 24 Minuten: 26 Autopilot-Tests fahren jedes Level mit
allen Stärken und Murmeln. `npm run test:schnell` (die übrigen 69) dauert dort 5.2 Minuten.
Die volle Suite läuft als GitHub Action (`.github/workflows/tests.yml`) nachts, wenn main neue Commits hat, und lässt sich
von Hand starten (Actions → „Tests (voll)“ → „Run workflow“). In der Session die volle Suite nicht selbst starten,
ausser der Benutzer will es.
Jeder PR startet `.github/workflows/pr.yml` („Tests (PR)“): `npm run test:schnell` und `pruefe-level.mjs` für die Level,
deren Datei oder Route der PR ändert (`tests/geaenderte-level.mjs`; Änderung an `src/levels/index.js`, `tests/autopilot.js`,
`tests/pruefe-level.mjs` oder `tests/kombis.mjs` → alle Level). Die Fahrten (Level × 16 Kombinationen) verteilt
`tests/verteile-level.mjs` nach Richtzeit auf 8 Jobs („level 1/8“ … „level 8/8“), der Check „level“ fasst sie zusammen.

**Tests nicht selbst in der Session starten** (weder `npm test` noch `test:schnell`, einzelne Playwright-Tests oder
`pruefe-level.mjs`), ausser der Benutzer will es: Das macht der PR (GitHub Action „Tests (PR)“, `.github/workflows/pr.yml`).
Nach dem Push das Ergebnis der Action abwarten und Fehler beheben.

Welche Tests eine Änderung betrifft (im PR-Text nennen):

| Geändert | Prüfen |
|---|---|
| Grafik, Kamera, Menüs, HUD (`view.js`, `themes.js`, `props.js`, `main.js`, `style.css`, `index.html`, `view()` der Bauteile) | `npm run test:schnell` (alles ausser den 26 Autopilot-Tests) oder einzelne Tests: `npx playwright test -g "<Name>"` |
| Ein Level oder seine Route (`src/levels/`, `tests/autopilot.js`, `tests/routes/`) | `node tests/pruefe-level.mjs <id>` (ohne Browser) für jedes betroffene Level; neues Level oder geänderte Strecke: Richtzeit mit `node tests/richtzeiten.mjs <id>` neu messen |
| Online-Rangliste (`src/online.js`, `supabase/schema.sql`) | Tests „Online-Rangliste“; SQL-Änderungen gegen ein lokales Postgres prüfen (Rollen `anon`, `authenticated` anlegen, Schema zweimal ausführen) und dem Benutzer sagen, dass er `schema.sql` im Supabase SQL-Editor neu ausführen muss |
| Physik, Bauteile, Murmeln (`game.js`, `solids`/`init`/`step` in `src/elements*.js`, `skins.js`, `input.js`) | `pruefe-level.mjs` für das Prüfstand-Level des Bauteils (`p-<name>`) und die Level, die das Bauteil nutzen, und `npm run test:schnell`; im PR erwähnen, dass die volle Suite nachts läuft |
| Neues Bauteil | Mini-Level im Prüfstand (`src/levels/pruefstand/`, Route in `tests/routes/pruefstand/`), muss mit `pruefe-level.mjs` 16/16 schaffen |
