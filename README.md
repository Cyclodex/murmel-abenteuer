# Murmel-Abenteuer

3D-Murmelspiel fürs Handy. Spielen: https://cyclodex.github.io/murmel-abenteuer/

## Lokal starten

```sh
node tests/server.js        # http://localhost:8123/
npm install && npm test     # Playwright-Tests, alle (dauert lange, Autopilot fährt jedes Level)
npm run test:schnell        # ohne die Autopilot-Tests
```

Die volle Suite läuft als GitHub Action nachts, wenn main neue Commits hat, und von Hand über Actions → „Tests (voll)“ → „Run workflow“.

Kein Build-Schritt. `index.html` lädt `vendor/` (three.js r128, cannon.js 0.6.2) und `src/main.js` als ES-Modul.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/levels/*.js` | Level als Daten (ein Objekt pro Level), Welten und Reihenfolge in `src/levels/index.js` (`need` = Welt erst ab so vielen Sternen offen, z. B. Profi-Welt Vulkan) |
| `src/levels/schwer/*.js` | Schwere Versionen (💀) je Welt: Level mit `schwer: '<id des normalen Levels>'`, offen sobald das normale geschafft ist |
| `src/levels/pruefstand/*.js` | Prüfstand: ein kurzes Level pro Bauteil (Anlauf, Bauteil, Ziel), muss mit jeder Murmel schaffbar sein. Nicht auf der Karte, im Spiel mit `?pruefstand` als eigene Welt; Routen in `tests/routes/pruefstand/` |
| `src/elements.js` | Grund-Bauteile: Klötze, Logik und Grafik je Typ |
| `src/elements-extra.js` | Weitere Bauteile (Röhre, Band, Wind, Balken, Magnet, Kanone, Domino, Spirale) |
| `src/elements-fallen.js` | Fallen für schwere Level (Feld mit Löchern, Falltür, Schieber, Hammer, Treppe, Fluss, Felsen = auch Schneebälle) |
| `src/elements-welt.js` | Echte Dinge der Welten (Schüssel = Pfanne/Topf/Lavabo, Deko-Gegenstände, Herdplatte, Rasensprenger) |
| `src/elements-bahn.js` | Kugelbahn: Rinne (schmal = Rutsche, auch als Kurve/Spirale; breit = Halfpipe), Spiraltrichter; `ringSolids` baut runde Flächen (auch Schüsseln) aus Klötzen, `rohrSolids` ein geschlossenes Rohr (Abfluss, Klo) |
| `src/elements-bad.js` | Badezimmer: Badewanne mit Wasser (hineinfallen = zurück zum Checkpoint), Schiffchen mit Trampolin, Wasserstrahl aus dem Hahn (wäscht), Toilette als Ziel |
| `src/props.js` | Riesige Alltagsgegenstände aus einfachen Formen (Apfel, Tasse, Toaster, Ente, Zwerg, Sandburg, Tanne, Schneemann, Iglu, Schlitten, Berghütte …) |
| `src/checkpoint-figuren.js` | Checkpoint-Grafik: Zielband, das beim Durchfahren reisst, und eine Figur je Welt (Springteufel, Gartenzwerg, Toaster, Quietscheente, Astronaut, Oktopus, Schneemann, Geysir), die schläft und beim Erreichen mit der Fahne und eigenem Jubel-Klang (`cp-<figur>` in `src/audio.js`) jubelt |
| `src/bauteile.js` | Sammelt alle Bauteil-Typen |
| `src/themes.js` | Aussehen der Welten (Boden, Wände, Himmel, Untergrund, Partikel) |
| `src/game.js` | Physik + Spielregeln, ohne Grafik (auch headless nutzbar), Oberflächen (Eis, Schlamm, Pfütze, Schnee, Keramik, Kunststoff), Dreck (`g.dirt`: Schlamm macht dreckig, Pfütze/Wind/Wasser waschen), Hangabtrieb bergab (`SLOPE_PUSH`), Bremsen (`BREMSE`: Rollwiderstand gleichmässig in der Ebene, ausser beim Gasgeben in Fahrtrichtung; Luftwiderstand ∝ v²), Bremshilfe nur in der Ebene; runde Flächen (`rund`) geben den an den Nähten der Klötze verlorenen Schwung zurück und behalten Reibung auch an steilen Stellen; eigene Breitphase und Kontakt-Tabelle (schnell auch mit Hunderten Klötzen) |
| `src/view.js` | three.js-Szene, Themen (Spielzimmer), Kamera (Bauteile wie Looping, Nagelwand und Klo können eine eigene Kamera liefern: `view()` gibt `cam(p)` zurück), Kamerafahrt `cinema()`: Überflug beim Levelstart und nach dem Gewinn Hochflug in die Weitsicht über das ganze Level mit der gefahrenen Strecke (Tippen überspringt; in Playwright-Tests nur mit `?flug`) |
| `src/input.js` | Kippen, schwebender Joystick (überall drücken + ziehen; Knopf 📱/🕹️ wechselt jederzeit), Pfeiltasten, Stärken 🐢 Langsam / 🐇 Mittel / 🚀 Schnell (`POWERS`, auf der Karte beschriftet) |
| `src/audio.js` | Alle Klänge + Musik live erzeugt (WebAudio): Effekte `SFX`, Rollgeräusch je Oberfläche, Lieder `SONGS` |
| `src/skins.js` | Murmel-Designs, ab wie vielen Sternen sie frei sind, Sprungkraft an Wand/Boden, Schwerkraft, Rollen und Dichte (`ball: {wand, boden, schwere, rollen, dichte}`, dichte in g/cm³: unter 1 schwimmt die Murmel im Fluss), optional Struktur (`bump`) |
| `src/treppe.js` | Treppe: alle Murmeln fallen gleichzeitig hinunter, werfen unterwegs Dominos um und prallen unten an eine Glaswand (Hintergrund der Menüs, Knopf 🪜 auf der Karte) |
| `src/trails.js` | Spuren hinter der Murmel (freischaltbar über Sterne ⭐ oder Sticker 🏅), Partikel-Pool als InstancedMesh |
| `src/stickers.js` | Sticker-Album: pro Welt 🏆 🌟 💎 💀 (aus `src/levels/index.js` erzeugt), dazu Extras; Antippen im Album erklärt den Sticker |
| `src/ghost.js` | Fahrt aufnehmen (alle 0.1 s), Position einer Aufnahme zu einer Zeit (Geistermurmel, Zuschauen), Zeitformat |
| `src/cheer.js` | Jubel beim Freischalten (Emojis, Konfetti, Klang `jubel`) |
| `src/progress.js` | Spielstand in localStorage: Spieler mit Name, Sterne, Bestzeiten, beste Fahrt mit Punkten, Murmel, Spur, Bonussterne und Sticker pro Spieler; Einstellungen für alle; Geister-Fahrten getrennt (`murmel-geist-v1`, schnellste Fahrten `murmel-geist-schnell-v1`) |
| `src/score.js` | Punkte einer Fahrt (pro Level höchstens 2050: Sterne-Anteil 1000, Zeit gegen die Richtzeit bis 750, ohne Absturz 300, je Absturz 100 weniger) und Rangliste nach Punkten (Stärke wird nur angezeigt), Rangliste nach Bestzeit und Streckenrekorde (`fastest`) |
| `src/levels/richtzeiten.js` | Richtzeit pro Level für die Punkte (Autopilot, Stärke normal, Standard-Murmel), erzeugt mit `node tests/richtzeiten.mjs [id ...]` |
| `src/online.js` | Online-Rangliste über Supabase (nur `fetch`, 3 s Timeout, Fehler still): neue Rekorde (auch nur Bestzeit oder mehr Sterne) mit Geist-Aufnahme senden (ohne Netz in localStorage `murmel-online-v1` vormerken, später nachsenden), Rangliste holen, Geist laden. Auf localhost aus (Tests: localStorage `murmel-online` = `an`) |
| `supabase/schema.sql` | Tabelle und Funktionen der Online-Rangliste (dazu `keepalive` gegen das Pausieren), einmal im Supabase SQL-Editor ausführen |
| `src/update.js` | Neue Version erkennen (`version.json`) und auf der Karte neu laden |
| `src/install.js`, `manifest.json`, `sw.js`, `icons/` | App aufs Handy: Popup auf der Karte (Android: Dialog des Browsers über `beforeinstallprompt`, iPhone/iPad: Teilen → „Zum Home-Bildschirm“), danach über ⚙️ → 📲; Service Worker speichert nichts (nur für die Installierbarkeit). Symbole aus `icons/icon.svg` mit `node icons/mache-icons.mjs` |
| `src/umzug.js` | Umzug in die App auf iPhone/iPad: Die App vom Home-Bildschirm hat unter iOS einen eigenen Speicher, Safari kopiert beim Hinzufügen nur die Cookies (seit iOS 17.2). In Safari liegt darum der Spielstand gepackt im Cookie `murmel-umzug` (höchstens 3800 Zeichen, sonst ohne Fahrten/Bestzeiten der anderen Spieler; ohne Geister), die App übernimmt ihn beim ersten Start und löscht das Cookie |
| `src/main.js` | Start, Karte, Menüs, Spielschleife |
| `tests/` | Playwright-Tests, Autopilot mit Route pro Level |

## Veröffentlichen und Updates

Die Action „Seite veröffentlichen“ (`.github/workflows/pages.yml`) veröffentlicht bei jedem Push auf main eine Kopie aller Dateien auf GitHub Pages.
Vorher stempelt `.github/stempel.mjs` die Kopie mit der Version (Commit): `<meta name="version">` in `index.html`, `?v=<version>` an jeder eigenen
Datei und jedem relativen Import, dazu `version.json`. So mischt der Browser nach einem Update keine alten Dateien aus dem Cache mit neuen.

Das Spiel (`src/update.js`) holt `version.json` ohne Cache, wenn die Karte aufgeht und wenn es wieder in den Vordergrund kommt. Gibt es eine neue
Version, fragt ein Fenster „🆕 Neue Version – Jetzt laden?“ (mit Version und Zeit der neuen Version), aber nur auf der Karte (nie mitten im Level):
**🔄 Laden** lädt die Seite neu, der Spielstand bleibt in localStorage; **Später** schliesst das Fenster, für diese Version fragt es in diesem Tab
nicht mehr (sessionStorage), erst bei der nächsten neuen Version oder nach dem Neustart des Spiels. Lokal steht „dev“ in der Seite: keine Prüfung.
Klein auf dem ersten Startbildschirm und ganz unten auf der Karte steht die laufende Version mit der Zeit des Commits
(„Version 0.3 · 01.11.26, 22:38“, lokal „Version dev“; beim Draufzeigen der Commit). Die Nummer zählt die Action selbst hoch:
`0.<Anzahl Updates auf main seit 47990b0>` (`git rev-list --count --first-parent`), jeder Merge oder direkte Push auf main zählt eins.
Für eine neue Hauptnummer (1.0) in `pages.yml` die `0.` und den Start-Commit ändern.

Einmalig: Settings → Pages → Build and deployment → Source „GitHub Actions“. Neue Imports immer mit relativem Pfad und `.js` schreiben,
sonst bricht `stempel.mjs` ab (der Test „Veröffentlichen …“ merkt das schon im PR).

## Online-Rangliste

Eine weltweite Rangliste ohne Konten: pro Name und Level die Fahrt mit den meisten Punkten und ihre Aufnahme,
dazu die Bestzeit (schnellste Fahrt ins Ziel) mit ihrer Aufnahme und die meisten Sterne (irgendeine Fahrt ins Ziel).
Die Aufnahme der Fahrt mit den meisten Punkten ist der eigene Geist beim Levelstart; die der schnellsten Fahrt gibt es in der Rangliste „⏱ Schnellste“.
Ohne Netz läuft alles lokal weiter, dann mit den Spielern auf dem Gerät.

- **Rangliste** (Knopf ⭐ auf der Karte oder Antippen der Rangliste im Gewinn-Bildschirm): 🌍 alle Level zusammen, mit ◀️ ▶️ jedes offene Level.
  Umschalter 🏆 Punkte / ⏱ Schnellste (Bestzeiten; auf 🌍 die Streckenrekorde = in wie vielen Leveln jemand am schnellsten ist).
  Die besten 10 und der eigene Platz; wer eine Aufnahme hat (bei Punkten die Fahrt mit den meisten Punkten, bei Schnellste die schnellste):
  👻 → 📺 zuschauen (die Murmel fährt die Aufnahme nach) oder 🏁 gegen sie fahren.
- **Levelstart:** Haben andere schon eine Fahrt im Level, zeigt der Startbildschirm die besten 3 nach Punkten und nach Zeit (dazu den eigenen Platz)
  und die Geister als Schalter: „Dein Geist“ und „Bester Geist“ (bester anderer mit Aufnahme, nach Punkten), beide oder keiner (die Wahl wird gemerkt);
  ▶️ Los sagt, gegen wen es geht. Fremde Geister tragen ein Namensschild, bei zwei Geistern auch der eigene.
- **Gewinn-Bildschirm:** die besten 5 im Level und der eigene Platz, 👻 fährt gegen die Aufnahme des besten anderen.
- **Spielstand holen:** Hat ein Spieler online (gleicher Name) Level geschafft oder Sterne, die auf dem Gerät fehlen, fragt das Spiel
  „☁️ Name · +N Level · +N ⭐“: gleich beim Anlegen eines neuen Spielers („☁️ Name gibt es schon“), sonst auf der Karte.
  ✅ übernimmt geschaffte Level, meiste Sterne (alle Sterne = Bonusstern), Fahrten mit mehr Punkten und Bestzeiten und lädt deren Aufnahmen
  (eigener und schnellster Geist) im Hintergrund nach; Murmeln, Spuren und Welt-Sticker kommen über die Sterne zurück.
  Nicht online: Bonussterne aus Fahrten ohne alle Sterne, die Extra-Sticker 🐷🧼👻, gewählte Murmel und Spur.
  ✖️: erst wieder fragen, wenn online mehr Sterne dazukommen.

- **Datenschutz:** Namen und Fahrten sind für alle sichtbar und liegen bei Supabase (Region EU, Frankfurt). Nur Vornamen oder Spitznamen verwenden.
- **Kein Schutz gegen Schummeln:** Jeder kann beliebige Namen und Punkte senden. Gleicher Name = gleicher Eintrag, auch auf einem anderen Gerät.
- **Einrichtung:** Supabase-Projekt (Gratis-Plan), `supabase/schema.sql` im SQL-Editor ausführen, Projekt-URL und Publishable Key in `src/online.js`.
  Bei Änderungen an `schema.sql` zuerst das Schema neu ausführen, dann veröffentlichen (ältere Spiel-Versionen laufen mit dem neuen Schema weiter).
- **Pausieren:** Supabase pausiert Gratis-Projekte nach einer Woche ohne Aktivität; Lesezugriffe alle 3 Tage reichten im Oktober 2026 nicht mehr. Die Action „Rangliste wach halten“ (`.github/workflows/rangliste-wach.yml`) ruft darum täglich `keepalive` auf (schreibt eine Herzschlag-Zeile) und liest die Rangliste. Schlägt sie fehl, öffnet sie ein Issue; ist das Projekt pausiert, im Supabase-Dashboard „Restore project“ klicken.

## Level bauen

Koordinaten in Metern: `x` = rechts, `y` = oben, `-z` = vorwärts. Murmel-Radius 0.5.
Winkel in Grad; `yaw` 0 = nach vorne (-z), 90 = nach links (-x), -90 = nach rechts (+x).
`theme`: `'spielzimmer'`, `'garten'`, `'kueche'`, `'badezimmer'`, `'weltraum'`, `'unterwasser'`, `'winter'`, `'vulkan'` (siehe `src/themes.js`).
`physik`: `{ schwerkraft: 0.45, wasser: 0.35, abprall: 0.5 }` (Faktor Schwerkraft, Wasserbremse pro Sekunde, Faktor Abprall).

| Bauteil | Felder |
|---|---|
| `weg` | `from`, `to` (Oberkante; Höhenunterschied = Rampe), `width`, `walls`, `caps` (`'start'`/`'end'`/`'both'`), `thick`, `surface` (`'eis'`/`'schlamm'`/`'pfuetze'`/`'sand'`/`'seife'`/`'handtuch'`/`'schnee'` = Pulverschnee: bremst, schluckt Sprünge) |
| `kurve` | `at` (Start, Mitte), `yaw` (Startrichtung), `turn` (+ rechts / - links), `radius`, `width`, `walls` |
| `looping` | `at` (Einfahrt unten), `yaw`, `radius`, `width`, `shift` (Ausfahrt seitlich versetzt, beginnt und endet weich). Braucht `turbo` davor. Im Looping wirkt Kippen nicht |
| `wand` | `from`, `to` (Unterkante), `height`, `look` |
| `klotz` | `at` (Mitte), `size: [b, h, t]`, `yaw`, `look` (`'lego-rot'`, `'klotz-blau'`, `'abc'` + `text`), `deko: true` = ohne Physik |
| `nische` | `at` (Mitte der Öffnung am Wegrand), `yaw` (nach aussen), `width`, `depth` – Wand dort mit Lücke bauen |
| `stern` | `at`, `bonus: true` (lila, versteckt), `r` (Sammelradius) |
| `checkpoint` | `at` (Boden, dort geht es weiter), `size: [b, h, t]`, `yaw` (Fahrtrichtung: dorthin schaut die Kamera, wenn sie nach dem Runterfallen hinfliegt), `side` (Figur nur rechts 1 / links -1, sonst wo Platz ist), `figur` (andere Figur als die der Welt) |
| `trampolin` | `at`, `size: [b, t]`, `jump`, `push` oder `tempo` (fester Schwung), `yaw` |
| `turbo` | `at`, `size: [b, t]`, `yaw`, `speed` |
| `plattform` | `from`, `to` (Mitte Oberkante), `size: [b, t]`, `yaw`, `time`, `pause`, `rim` |
| `wippe` | `at` (Drehpunkt, Oberkante), `size: [b, länge]`, `yaw`, `angle` |
| `schalter` | `at`, `id` |
| `bruecke` | `from`, `to`, `width`, `walls`, `id` (wie Schalter), `drop` |
| `ziel` | `at`, `r` |
| `spirale` | wie `kurve`, mit `turn` (z. B. 720) und `rise` (z. B. -8) |
| `roehre` | `from`, `yaw` (hinein), `to`, `toYaw` (heraus), `bogen`, `speed`, `out`, `farbe` – vor der Öffnung einen schmalen Weg bauen (die Murmel fliegt geführt durch die Röhre) |
| `band` | wie `weg` + `speed` (m/s), `grip` (wie stark) |
| `wind` | `at` (Boden, Mitte), `size: [b, h, t]`, `yaw` (Blasrichtung) oder `up: true`, `strength` |
| `balken` | `at` (Drehpunkt), `length`, `speed` (°/s, negativ = andersrum), `farbe` |
| `magnet` | `at` (Boden darunter), `radius`, `strength` (negativ = stösst ab) |
| `kanone` | `at` (Boden), `target` (Landepunkt), `time` (Flugzeit) |
| `domino` | `from`, `to`, `count` (Reihen), `quer` (bis zu so viele Steine nebeneinander, versetzt, vorne als Dreieck), `abstand`, `size: [b, h, t]`; einzelner Stein: `at`, `yaw` |
| `feld` | `at` (Mitte der vorderen Kante), `yaw`, `cell` (Kachel, Standard 2), `map` (Zeilen, unterste = Einfahrt): `#` Boden, `.` Loch, `w` Mauer, `e`/`s`/`p`/`a`/`o`/`h`/`n` Eis/Schlamm/Pfütze/Sand/Seife/Handtuch/Schnee; `walls` |
| `falltuer` | `at`, `size: [b, t]`, `yaw`, `delay` (s bis sie aufklappt, Standard 0.6), `offen` (s bis sie zugeht) |
| `schieber` | `from`, `to` (Mitte unten), `size: [b, h, t]`, `time`, `pause`, `offset` – schiebt die Murmel weg |
| `hammer` | `at` (Aufschlag, Oberkante), `yaw` (Wegrichtung), `side` (1 = Stiel rechts), `length`, `size`, `up`, `down`, `offset`, `farbe` – quetscht die Murmel |
| `treppe` | `from` (oberste Stufe), `to` (unterste), `steps`, `width`, `walls` |
| `fluss` | `from`, `to` (Wasseroberfläche), `width`, `depth`, `speed`, `banks` – trägt die Murmel mit (bremst sie bergab nicht auf `speed` ab), Auftrieb nach Dichte (leichte schwimmen, schwere rollen am Grund), wäscht |
| `nagelbrett` | `at` (Mitte der oberen Vorderkante, Höhe des Wegs, der hineinführt), `yaw`, `breite`, `hoehe`, `abstand`, `tiefe` – Nagelwand: die Murmel fällt senkrecht und prallt von Nagel zu Nagel; vorne Glas, unten offen (quer darunter einen Weg legen) |
| `felsen` | `from`, `dir: [x, z]`, `speed`, `every` (s), `r`, `offset`, `farbe` – rollende Felsen (oder Kartoffeln, Äpfel, mit `farbe: 0xFFFFFF` Schneebälle …), bergab einsetzen |
| `schuessel` | `at` (Bodenmitte), `r`, `R`, `h`, `rim`, `art` (`'pfanne'`/`'topf'`/`'lavabo'`/`'schuessel'`/`'sandkuchen'`), `boden: 'rund'` (gewölbt bis zur Mitte; beim Lavabo Standard, dazu Oberfläche Keramik: Bälle springen und kreisen hinunter), `offen: [yaw]` (Lücke für eine Rampe), `aussen`, `griff`, `hahn`, `abfluss: true` (echtes Loch in der Mitte, Radius 0.7 wie das Rohr, mit steilem, abgesenktem Rand: die Murmel fällt hinein; darunter eine `roehre` mit `down: true`) |
| `rinne` | gerade: `from`, `to` (Mitte unten); oder Kurve/Spirale: `at`, `yaw`, `turn`, `radius`, `rise`; dazu `r` (Radius des Querschnitts: ~1.6 Rutsche, ~4 Halfpipe), `bogen` (Grad je Seite), `surface`, `farbe` – runde Bahn, in Kurven fährt die Murmel die Wand hoch |
| `trichter` | `at` (Mitte des Lochs), `R`, `h`, `loch`, `rim`, `wand` (Bande), `offen`, `surface` (Standard `trichter`, bremst etwas), `farbe` – Spiraltrichter: schräg über die Bande hinein, die Murmel kreist immer schneller hinunter und fällt durchs Loch (darunter auffangen) |
| `roehre` mit `down: true` | Abfluss: echtes, geschlossenes Rohr unter dem Loch bei `from` (Mitte der `schuessel` mit `abfluss`): fast senkrecht hinunter, im Bogen (`bogen` = Radius, Standard 4) in Richtung `toYaw` und mit `gefaelle` (Grad, Standard 3) bis `to` (Boden am Ausgang). Die Murmel rollt von selbst hindurch (17 m Rohr, 5 m hinunter: 2.8 bis 3.5 s, 5 bis 6.5 m/s am Ausgang), man lenkt darin nicht. Ereignisse `gurgel` (fällt hinein) und `plopp` (kommt heraus); Autopilot: `wait: 'abfluss'` |
| `wind` mit `look` | `'schlauch'` (Gartenschlauch) oder `'hahn'` (Wasserhahn): Wasserstrahl statt Ventilator |
| `sprenger` | `at`, `length` (Reichweite), `speed` (°/s), `strength`, `breite` – Rasensprenger schiebt die Murmel weg |
| `herdplatte` | `at` (auf einem Weg), `r`, `jump` – heiss, die Murmel hüpft |
| `deko` | `form` (siehe `src/props.js`), `at`, `yaw`, `scale`, `farbe`, `fest` (man kann nicht hindurch), `dreh` (°/s) |
| `wanne` | `at` (Mitte der Wasseroberfläche), `size: [b, lang]`, `yaw`, `rim`, `depth`, `enten: [[x, z]]` – Badewanne, ins Wasser fallen = zurück zum Checkpoint |
| `schiff` | `at` (Wasseroberfläche), `size: [b, lang]`, `yaw`, `deck`, `bob`, `to`/`time`/`pause`/`offset` (fährt wie die Plattform), `farbe`, `segel`, `surface` (Standard Frottee; `'normal'` = Holz, z. B. für eine Fähre), `trampolin: { vorne, size, ziel, time, bremse }` – springt immer genau auf `ziel` (Flug je Murmel ausgerechnet), Frottee-Deck fängt auf |
| `strahl` | `at` (Auslauf oben), `unten` (y), `r`, `wash`, `push`, `hahn`, `yaw`, `lang` – Wasserstrahl, wäscht die Murmel |
| `klo` | `at` (Schüsselboden), `yaw`, `r`, `R`, `h`, `rim`, `tief` (Rohr, Standard 3.5) – Toilette mit Deckel und Spülkasten, in der Mitte ein Loch mit geschlossenem Rohr darunter. `ziel` 2 m unter `at` ins Rohr legen: gewonnen, wenn die Murmel hinuntergespült ist; spült, sobald die Murmel im Abfluss ist; Kamera 45° von oben, solange die Murmel über der Schüssel ist |

Neues Hindernis erfinden: in `src/elements.js` einen Typ ergänzen (`solids`, `init`, `reset`, `pre`, `step`, `view`), danach kann es in jedem Level verwendet werden.
Neues Bauteil: im Prüfstand (`src/levels/pruefstand/<gruppe>.js`) ein Mini-Level dafür anlegen, Route in `tests/routes/pruefstand/<gruppe>.js`; der Test „Prüfstand …“ fährt es bei jedem PR mit jeder Stärke und jeder Murmel.

Neues Level testen: in `tests/autopilot.js` (schwere Level: `tests/routes/<welt>.js`) eine Route (Wegpunkte) ergänzen, dann `node tests/pruefe-level.mjs <id>` (schnell, ohne Browser; `--fahrt` zeigt eine Fahrt mit Wegpunkten und Abstürzen) und `npm test`. Wegpunkte können warten (`wait: 'platAtTo'`, `'amBoden'`, `['hoehe', 7]`, `['balkenWeg', [x, z]]` (auch Sprenger), `['phase', ['hammer', 0, 0.72, 0.85]]` (Takt von Hammer/Felsen/Plattform/Schieber), `['tuerZu', 0]`, `['tiefer', y]`) oder der Bahn folgen (`{ follow: true, bisY }`); mehrere Routen pro Level sind möglich (z. B. Umweg zum Bonusstern).
Neues oder geändertes Level: Richtzeit für die Punkte mit `node tests/richtzeiten.mjs <id>` messen.
Autopilot zuschauen: Spiel mit `?autopilot` öffnen (z. B. `http://localhost:8123/?autopilot`), Level wählen. Ringe = Wegpunkte (orange = aktuelles Ziel, lila = wartet, grau = erledigt).
