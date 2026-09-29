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
| `src/levels/*.js` | Level als Daten (ein Objekt pro Level), Welten und Reihenfolge in `src/levels/index.js` (`need` = Welt erst ab so vielen Sternen offen, z. B. Profi-Welt Vulkan) |
| `src/elements.js` | Grund-Bauteile: Klötze, Logik und Grafik je Typ |
| `src/elements-extra.js` | Weitere Bauteile (Röhre, Band, Wind, Balken, Magnet, Kanone, Domino, Spirale) |
| `src/bauteile.js` | Sammelt alle Bauteil-Typen |
| `src/themes.js` | Aussehen der Welten (Boden, Wände, Himmel, Untergrund, Partikel) |
| `src/game.js` | Physik + Spielregeln, ohne Grafik (auch headless nutzbar), Oberflächen (Eis, Schlamm, Pfütze), Dreck (`g.dirt`: Schlamm macht dreckig, Pfütze/Wind/Wasser waschen) |
| `src/view.js` | three.js-Szene, Themen (Spielzimmer), Kamera |
| `src/input.js` | Kippen, schwebender Joystick (überall drücken + ziehen), Pfeiltasten, Stärken 🐢/🐇/🚀 (`POWERS`) |
| `src/audio.js` | Alle Klänge + Musik live erzeugt (WebAudio): Effekte `SFX`, Rollgeräusch je Oberfläche, Lieder `SONGS` |
| `src/skins.js` | Murmel-Designs, ab wie vielen Sternen sie frei sind, Sprungkraft an Wand/Boden, Schwerkraft und Rollen (`ball: {wand, boden, schwere, rollen}`), optional Struktur (`bump`) |
| `src/treppe.js` | Treppe: alle Murmeln fallen gleichzeitig hinunter (Hintergrund der Menüs, Knopf 🪜 auf der Karte) |
| `src/trails.js` | Spuren hinter der Murmel (freischaltbar über Sterne ⭐ oder Sticker 📒), Partikel-Pool als InstancedMesh |
| `src/stickers.js` | Sticker-Album: Sticker je Level/Welt werden aus `src/levels/index.js` erzeugt, dazu Extras |
| `src/cheer.js` | Jubel beim Freischalten (Emojis, Konfetti, Klang `jubel`) |
| `src/progress.js` | Spielstand in localStorage: Spieler mit Name, Sterne, Murmel, Spur und Sticker pro Spieler, Rangliste; Einstellungen für alle |
| `src/main.js` | Start, Karte, Menüs, Spielschleife |
| `tests/` | Playwright-Tests, Autopilot mit Route pro Level |

## Level bauen

Koordinaten in Metern: `x` = rechts, `y` = oben, `-z` = vorwärts. Murmel-Radius 0.5.
Winkel in Grad; `yaw` 0 = nach vorne (-z), 90 = nach links (-x), -90 = nach rechts (+x).
`theme`: `'spielzimmer'`, `'garten'`, `'kueche'`, `'weltraum'`, `'unterwasser'`, `'vulkan'` (siehe `src/themes.js`).
`physik`: `{ schwerkraft: 0.45, wasser: 0.35, abprall: 0.5 }` (Faktor Schwerkraft, Wasserbremse pro Sekunde, Faktor Abprall).

| Bauteil | Felder |
|---|---|
| `weg` | `from`, `to` (Oberkante; Höhenunterschied = Rampe), `width`, `walls`, `caps` (`'start'`/`'end'`/`'both'`), `thick`, `surface` (`'eis'`/`'schlamm'`/`'pfuetze'`) |
| `kurve` | `at` (Start, Mitte), `yaw` (Startrichtung), `turn` (+ rechts / - links), `radius`, `width`, `walls` |
| `looping` | `at` (Einfahrt unten), `yaw`, `radius`, `width`, `shift` (Ausfahrt seitlich versetzt). Braucht `turbo` davor |
| `wand` | `from`, `to` (Unterkante), `height`, `look` |
| `klotz` | `at` (Mitte), `size: [b, h, t]`, `yaw`, `look` (`'lego-rot'`, `'klotz-blau'`, `'abc'` + `text`), `deko: true` = ohne Physik |
| `nische` | `at` (Mitte der Öffnung am Wegrand), `yaw` (nach aussen), `width`, `depth` – Wand dort mit Lücke bauen |
| `stern` | `at`, `bonus: true` (lila, versteckt), `r` (Sammelradius) |
| `checkpoint` | `at` (Boden, dort geht es weiter), `size: [b, h, t]`, `yaw` |
| `trampolin` | `at`, `size: [b, t]`, `jump`, `push` oder `tempo` (fester Schwung), `yaw` |
| `turbo` | `at`, `size: [b, t]`, `yaw`, `speed` |
| `plattform` | `from`, `to` (Mitte Oberkante), `size: [b, t]`, `yaw`, `time`, `pause`, `rim` |
| `wippe` | `at` (Drehpunkt, Oberkante), `size: [b, länge]`, `yaw`, `angle` |
| `schalter` | `at`, `id` |
| `bruecke` | `from`, `to`, `width`, `walls`, `id` (wie Schalter), `drop` |
| `ziel` | `at`, `r` |
| `spirale` | wie `kurve`, mit `turn` (z. B. 720) und `rise` (z. B. -8) |
| `roehre` | `from`, `yaw` (hinein), `to`, `toYaw` (heraus), `bogen`, `speed`, `out`, `farbe` – vor der Öffnung einen schmalen Weg bauen |
| `band` | wie `weg` + `speed` (m/s), `grip` (wie stark) |
| `wind` | `at` (Boden, Mitte), `size: [b, h, t]`, `yaw` (Blasrichtung) oder `up: true`, `strength` |
| `balken` | `at` (Drehpunkt), `length`, `speed` (°/s, negativ = andersrum), `farbe` |
| `magnet` | `at` (Boden darunter), `radius`, `strength` (negativ = stösst ab) |
| `kanone` | `at` (Boden), `target` (Landepunkt), `time` (Flugzeit) |
| `domino` | `from`, `to`, `count`, `size: [b, h, t]` |

Neues Hindernis erfinden: in `src/elements.js` einen Typ ergänzen (`solids`, `init`, `reset`, `pre`, `step`, `view`), danach kann es in jedem Level verwendet werden.
Neues Level testen: in `tests/autopilot.js` eine Route (Wegpunkte) ergänzen, dann `npm test`. Wegpunkte können warten (`wait: 'platAtTo'`, `'amBoden'`, `['hoehe', 7]`, `['balkenWeg', [x, z]]`) oder der Bahn folgen (`{ follow: true, bisY }`); mehrere Routen pro Level sind möglich (z. B. Umweg zum Bonusstern).
Autopilot zuschauen: Spiel mit `?autopilot` öffnen (z. B. `http://localhost:8123/?autopilot`), Level wählen. Ringe = Wegpunkte (orange = aktuelles Ziel, lila = wartet, grau = erledigt).
