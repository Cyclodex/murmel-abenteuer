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
| `src/levels/schwer/*.js` | Schwere Versionen (💀) je Welt: Level mit `schwer: '<id des normalen Levels>'`, offen sobald das normale geschafft ist |
| `src/elements.js` | Grund-Bauteile: Klötze, Logik und Grafik je Typ |
| `src/elements-extra.js` | Weitere Bauteile (Röhre, Band, Wind, Balken, Magnet, Kanone, Domino, Spirale) |
| `src/elements-fallen.js` | Fallen für schwere Level (Feld mit Löchern, Falltür, Schieber, Hammer, Treppe, Fluss, Felsen) |
| `src/elements-welt.js` | Echte Dinge der Welten (Schüssel = Pfanne/Topf/Lavabo, Deko-Gegenstände, Herdplatte, Rasensprenger) |
| `src/elements-bad.js` | Badezimmer: Badewanne mit Wasser (hineinfallen = zurück zum Checkpoint), Schiffchen mit Trampolin, Wasserstrahl aus dem Hahn (wäscht), Toilette als Ziel |
| `src/props.js` | Riesige Alltagsgegenstände aus einfachen Formen (Apfel, Tasse, Toaster, Ente, Zwerg, Sandburg …) |
| `src/bauteile.js` | Sammelt alle Bauteil-Typen |
| `src/themes.js` | Aussehen der Welten (Boden, Wände, Himmel, Untergrund, Partikel) |
| `src/game.js` | Physik + Spielregeln, ohne Grafik (auch headless nutzbar), Oberflächen (Eis, Schlamm, Pfütze), Dreck (`g.dirt`: Schlamm macht dreckig, Pfütze/Wind/Wasser waschen), Hangabtrieb bergab (`SLOPE_PUSH`), Bremsen (`BREMSE`: Rollwiderstand gleichmässig in der Ebene, ausser beim Gasgeben in Fahrtrichtung; Luftwiderstand ∝ v²), Bremshilfe nur in der Ebene |
| `src/view.js` | three.js-Szene, Themen (Spielzimmer), Kamera |
| `src/input.js` | Kippen, schwebender Joystick (überall drücken + ziehen; Knopf 📱/🕹️ wechselt jederzeit), Pfeiltasten, Stärken 🐢/🐇/🚀 (`POWERS`) |
| `src/audio.js` | Alle Klänge + Musik live erzeugt (WebAudio): Effekte `SFX`, Rollgeräusch je Oberfläche, Lieder `SONGS` |
| `src/skins.js` | Murmel-Designs, ab wie vielen Sternen sie frei sind, Sprungkraft an Wand/Boden, Schwerkraft, Rollen und Dichte (`ball: {wand, boden, schwere, rollen, dichte}`, dichte in g/cm³: unter 1 schwimmt die Murmel im Fluss), optional Struktur (`bump`) |
| `src/treppe.js` | Treppe: alle Murmeln fallen gleichzeitig hinunter (Hintergrund der Menüs, Knopf 🪜 auf der Karte) |
| `src/trails.js` | Spuren hinter der Murmel (freischaltbar über Sterne ⭐ oder Sticker 🏅), Partikel-Pool als InstancedMesh |
| `src/stickers.js` | Sticker-Album: Sticker je Level/Welt werden aus `src/levels/index.js` erzeugt, dazu Extras |
| `src/ghost.js` | Bestzeit: Fahrt aufnehmen (alle 0.1 s), Geistermurmel fährt beim nächsten Mal mit, Zeitformat |
| `src/cheer.js` | Jubel beim Freischalten (Emojis, Konfetti, Klang `jubel`) |
| `src/progress.js` | Spielstand in localStorage: Spieler mit Name, Sterne, Bestzeiten, Murmel, Spur und Sticker pro Spieler, Rangliste; Einstellungen für alle; Geister-Fahrten getrennt (`murmel-geist-v1`) |
| `src/main.js` | Start, Karte, Menüs, Spielschleife |
| `tests/` | Playwright-Tests, Autopilot mit Route pro Level |

## Level bauen

Koordinaten in Metern: `x` = rechts, `y` = oben, `-z` = vorwärts. Murmel-Radius 0.5.
Winkel in Grad; `yaw` 0 = nach vorne (-z), 90 = nach links (-x), -90 = nach rechts (+x).
`theme`: `'spielzimmer'`, `'garten'`, `'kueche'`, `'badezimmer'`, `'weltraum'`, `'unterwasser'`, `'vulkan'` (siehe `src/themes.js`).
`physik`: `{ schwerkraft: 0.45, wasser: 0.35, abprall: 0.5 }` (Faktor Schwerkraft, Wasserbremse pro Sekunde, Faktor Abprall).

| Bauteil | Felder |
|---|---|
| `weg` | `from`, `to` (Oberkante; Höhenunterschied = Rampe), `width`, `walls`, `caps` (`'start'`/`'end'`/`'both'`), `thick`, `surface` (`'eis'`/`'schlamm'`/`'pfuetze'`/`'sand'`/`'seife'`/`'handtuch'`) |
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
| `feld` | `at` (Mitte der vorderen Kante), `yaw`, `cell` (Kachel, Standard 2), `map` (Zeilen, unterste = Einfahrt): `#` Boden, `.` Loch, `w` Mauer, `e`/`s`/`p`/`a`/`o`/`h` Eis/Schlamm/Pfütze/Sand/Seife/Handtuch; `walls` |
| `falltuer` | `at`, `size: [b, t]`, `yaw`, `delay` (s bis sie aufklappt, Standard 0.6), `offen` (s bis sie zugeht) |
| `schieber` | `from`, `to` (Mitte unten), `size: [b, h, t]`, `time`, `pause`, `offset` – schiebt die Murmel weg |
| `hammer` | `at` (Aufschlag, Oberkante), `yaw` (Wegrichtung), `side` (1 = Stiel rechts), `length`, `size`, `up`, `down`, `offset`, `farbe` – quetscht die Murmel |
| `treppe` | `from` (oberste Stufe), `to` (unterste), `steps`, `width`, `walls` |
| `fluss` | `from`, `to` (Wasseroberfläche), `width`, `depth`, `speed`, `banks` – trägt die Murmel mit (bremst sie bergab nicht auf `speed` ab), Auftrieb nach Dichte (leichte schwimmen, schwere rollen am Grund), wäscht |
| `nagelbrett` | `at` (Mitte der oberen Vorderkante, Höhe des Wegs, der hineinführt), `yaw`, `breite`, `hoehe`, `abstand`, `tiefe` – Nagelwand: die Murmel fällt senkrecht und prallt von Nagel zu Nagel; vorne Glas, unten offen (quer darunter einen Weg legen) |
| `felsen` | `from`, `dir: [x, z]`, `speed`, `every` (s), `r`, `offset`, `farbe` – rollende Felsen (oder Kartoffeln, Äpfel …), bergab einsetzen |
| `schuessel` | `at` (Bodenmitte), `r`, `R`, `h`, `rim`, `art` (`'pfanne'`/`'topf'`/`'lavabo'`/`'schuessel'`/`'sandkuchen'`), `offen: [yaw]` (Lücke für eine Rampe), `aussen`, `griff`, `hahn`, `abfluss` |
| `roehre` mit `down: true` | Abfluss: bei `from` geht es senkrecht hinunter, `fang` = Fangradius (z. B. Mitte vom Lavabo) |
| `wind` mit `look` | `'schlauch'` (Gartenschlauch) oder `'hahn'` (Wasserhahn): Wasserstrahl statt Ventilator |
| `sprenger` | `at`, `length` (Reichweite), `speed` (°/s), `strength`, `breite` – Rasensprenger schiebt die Murmel weg |
| `herdplatte` | `at` (auf einem Weg), `r`, `jump` – heiss, die Murmel hüpft |
| `deko` | `form` (siehe `src/props.js`), `at`, `yaw`, `scale`, `farbe`, `fest` (man kann nicht hindurch), `dreh` (°/s) |
| `wanne` | `at` (Mitte der Wasseroberfläche), `size: [b, lang]`, `yaw`, `rim`, `depth`, `enten: [[x, z]]` – Badewanne, ins Wasser fallen = zurück zum Checkpoint |
| `schiff` | `at` (Wasseroberfläche), `size: [b, lang]`, `yaw`, `deck`, `bob`, `to`/`time`/`pause`/`offset` (fährt wie die Plattform), `farbe`, `segel`, `surface` (Standard Frottee; `'normal'` = Holz, z. B. für eine Fähre), `trampolin: { vorne, size, ziel, time, bremse }` – springt immer genau auf `ziel` (Flug je Murmel ausgerechnet), Frottee-Deck fängt auf |
| `strahl` | `at` (Auslauf oben), `unten` (y), `r`, `wash`, `push`, `hahn`, `yaw`, `lang` – Wasserstrahl, wäscht die Murmel |
| `klo` | `at` (Schüsselboden), `yaw`, `r`, `R`, `h`, `rim` – Toilette mit Deckel und Spülkasten, `ziel` in die Mitte legen, spült beim Gewinnen |

Neues Hindernis erfinden: in `src/elements.js` einen Typ ergänzen (`solids`, `init`, `reset`, `pre`, `step`, `view`), danach kann es in jedem Level verwendet werden.
Neues Level testen: in `tests/autopilot.js` (schwere Level: `tests/routes/<welt>.js`) eine Route (Wegpunkte) ergänzen, dann `node tests/pruefe-level.mjs <id>` (schnell, ohne Browser; `--fahrt` zeigt eine Fahrt mit Wegpunkten und Abstürzen) und `npm test`. Wegpunkte können warten (`wait: 'platAtTo'`, `'amBoden'`, `['hoehe', 7]`, `['balkenWeg', [x, z]]` (auch Sprenger), `['phase', ['hammer', 0, 0.72, 0.85]]` (Takt von Hammer/Felsen/Plattform/Schieber), `['tuerZu', 0]`, `['tiefer', y]`) oder der Bahn folgen (`{ follow: true, bisY }`); mehrere Routen pro Level sind möglich (z. B. Umweg zum Bonusstern).
Autopilot zuschauen: Spiel mit `?autopilot` öffnen (z. B. `http://localhost:8123/?autopilot`), Level wählen. Ringe = Wegpunkte (orange = aktuelles Ziel, lila = wartet, grau = erledigt).
