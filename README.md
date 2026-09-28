# Murmel-Abenteuer

3D-Murmelspiel fürs Handy. Spielen: https://cyclodex.github.io/murmel-abenteuer/

## Lokal starten

```sh
node tests/server.js        # http://localhost:8123/
npm install && npm test     # Playwright-Tests
```

Kein Build-Schritt. `index.html` lädt `vendor/` (three.js r128, cannon.js 0.6.2) und `src/main.js` als ES-Modul.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/levels/*.js` | Level als Daten (ein Objekt pro Level), Welten und Reihenfolge in `src/levels/index.js` |
| `src/elements.js` | Alle Bauteil-Typen: Klötze, Logik und Grafik je Typ |
| `src/game.js` | Physik + Spielregeln, ohne Grafik (auch headless nutzbar), Oberflächen (Eis, Schlamm) |
| `src/view.js` | three.js-Szene, Themen (Spielzimmer), Kamera |
| `src/input.js` | Kippen, schwebender Joystick (überall drücken + ziehen), Pfeiltasten, Stärken 🐢/🐇/🚀 (`POWERS`) |
| `src/audio.js` | Alle Klänge + Musik live erzeugt (WebAudio): Effekte `SFX`, Rollgeräusch je Oberfläche, Lieder `SONGS` |
| `src/skins.js` | Murmel-Designs, ab wie vielen Sternen sie frei sind, Sprungkraft an Wand/Boden (`ball`) |
| `src/progress.js` | Spielstand in localStorage |
| `src/main.js` | Start, Karte, Menüs, Spielschleife |
| `tests/` | Playwright-Tests, Autopilot mit Route pro Level |

## Level bauen

Koordinaten in Metern: `x` = rechts, `y` = oben, `-z` = vorwärts. Murmel-Radius 0.5.
Winkel in Grad; `yaw` 0 = nach vorne (-z), 90 = nach links (-x), -90 = nach rechts (+x).
`theme: 'spielzimmer'` gibt Holzbahn, Legowände und Teppich.

| Bauteil | Felder |
|---|---|
| `weg` | `from`, `to` (Oberkante; Höhenunterschied = Rampe), `width`, `walls`, `caps` (`'start'`/`'end'`/`'both'`), `thick`, `surface` (`'eis'`/`'schlamm'`) |
| `kurve` | `at` (Start, Mitte), `yaw` (Startrichtung), `turn` (+ rechts / - links), `radius`, `width`, `walls` |
| `looping` | `at` (Einfahrt unten), `yaw`, `radius`, `width`, `shift` (Ausfahrt seitlich versetzt). Braucht `turbo` davor |
| `wand` | `from`, `to` (Unterkante), `height`, `look` |
| `klotz` | `at` (Mitte), `size: [b, h, t]`, `yaw`, `look` (`'lego-rot'`, `'klotz-blau'`, `'abc'` + `text`), `deko: true` = ohne Physik |
| `nische` | `at` (Mitte der Öffnung am Wegrand), `yaw` (nach aussen), `width`, `depth` – Wand dort mit Lücke bauen |
| `stern` | `at`, `bonus: true` (lila, versteckt) |
| `checkpoint` | `at` (Boden, dort geht es weiter), `size: [b, h, t]`, `yaw` |
| `trampolin` | `at`, `size: [b, t]`, `jump`, `push`, `yaw` |
| `turbo` | `at`, `size: [b, t]`, `yaw`, `speed` |
| `plattform` | `from`, `to` (Mitte Oberkante), `size: [b, t]`, `yaw`, `time`, `pause`, `rim` |
| `wippe` | `at` (Drehpunkt, Oberkante), `size: [b, länge]`, `yaw`, `angle` |
| `schalter` | `at`, `id` |
| `bruecke` | `from`, `to`, `width`, `walls`, `id` (wie Schalter), `drop` |
| `ziel` | `at`, `r` |

Neues Hindernis erfinden: in `src/elements.js` einen Typ ergänzen (`solids`, `init`, `reset`, `pre`, `step`, `view`), danach kann es in jedem Level verwendet werden.
Neues Level testen: in `tests/autopilot.js` eine Route (Wegpunkte) ergänzen, dann `npm test`.
