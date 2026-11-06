# Plan: Echte Orte statt Bahn im Leeren (#84)

Ziel: Ein Level ist ein Weg durch einen echten Ort. Die Kulisse ist der Ort, die Hindernisse sind Dinge dieses Ortes,
das Material verändert das Fahren.

**Entscheid (Benutzer):** Die echten Orte sind eine neue Kategorie im ganzen Spiel. Die bisherigen Strecken werden nicht
verändert.

## 1. Stand (geprüft im Code)

| Wo | Kulisse | Bahn |
|---|---|---|
| main, alle Welten | `theme.ground(tools, floorY)`: eine Ebene bei `floorY = killY - 1` (`src/view.js:282`) und `scatter()` (`src/themes.js:80`): 26 Gegenstände im Ring 14–69 m um (0, -25), unabhängig vom Level, so verkleinert, dass sie unter der Bahn bleiben | allgemeine Teile (`weg`, `rinne`, `klotz` …) mit Welt-Material |
| #79 Winter, #80 Chilbi, #82 Werkstatt, #83 Schweiz | gleiches Muster: Ebene + `scatter` + Deko-Klötze. Kein Raum, keine Wände, kein Dach | allgemeine Teile neu eingefärbt; neue Oberflächen `schnee`, `zuckerwatte`, `saegemehl`, `schoggi` |
| #78 Dach (`d1`) | einziger echter Ort: `level.haus` baut Hauswände, Giebel, hintere Dachfläche, Garten, Nachbarhäuser (nur Grafik) | allgemeine Teile, aber nach dem Haus gelegt (Neigung 0.5 = `haus.neigung`); Oberflächen `ziegel`, `dachrinne` |

Grössen der Level auf main (Ausdehnung der Teile, gemessen): 8–56 m breit, 37–138 m lang (`b1` am längsten).
Kamera: `far` 200, Nebel je Welt z. B. 50–120 (Spielzimmer).

## 2. Massstab

**Entscheid (Benutzer):** Die Murmel ist so gross wie echt. Für alle echten Orte gilt darum **1 Einheit = 1.6 cm**
(Murmel Ø 1 Einheit = 1.6 cm, `R = 0.5`). Alles andere wird in echten Massen gebaut und umgerechnet (cm / 1.6):

| Ding | echt | Einheiten |
|---|---|---|
| Tischplatte | 120 × 80 cm, 75 cm hoch | 75 × 50, 46.9 hoch |
| Zimmer | 4 × 3.5 × 2.5 m | 250 × 218.75 × 156.25 |
| Haus wie in `d1` (#78) | 4.8 × 8.3 m | 300 × 518.75 |
| Fallrohr 3 m | 3 m | 187.5 |

Folgen (berechnet):
- **Strecken liegen auf Möbeln, nicht quer durchs Zimmer.** Die heutigen Level sind 37–138 Einheiten lang, das sind
  0.6–2.2 m echt: eine Tischplatte, ein Regal, ein Stück Dach. Der Rest des Raums ist Kulisse.
- **Kamera:** `far` 200 reicht im Zimmer nicht, die Raumdiagonale ist 367 Einheiten. Für Level mit `ort` `far` und Nebel
  aus der Grösse des Orts setzen.
- **Physik bleibt** (`G = 9.82` Einheiten/s², gleich wie alle Level, Autopilot und die 16 Kombinationen). Weil eine Einheit
  1.6 cm statt 1 m ist, läuft alles wie in Zeitlupe, Faktor √(100 / 1.6) = 7.9: Ein Fall von der Tischplatte dauert im
  Spiel 3.09 s, echt 0.39 s. Das passt zum Gefühl «klein sein in einem grossen Raum» (wie *Tinykin*). Die Schwerkraft
  62.5-mal stärker zu machen, wäre echt schnell, aber nicht mehr steuerbar.
- **`d1` (#78)** rechnet mit 25 cm pro Einheit. Für die Kategorie muss es im neuen Massstab neu gebaut werden: Das Haus
  wird 15.6-mal grösser (25 / 1.6), die Strecke deckt nur noch ein Stück Dach ab (z. B. letzte Ziegelreihen → Dachrinne → Fallrohr →
  Regentonne).

## 3. Technik

### 3.1 `level.ort` statt `level.haus`
- Neues Modul `src/orte.js` mit Bauern je Art: `haus` (aus #78 übernommen), `raum`, `tisch`.
- Level beschreibt den Ort als Daten in echten cm, der Bauer rechnet in Einheiten um, z. B.
  `ort: { art: 'raum', cm: [400, 250, 350], tisch: { cm: [120, 75, 80], at: [...] }, fenster: [...], moebel: [...] }`.
- `view.js` ruft `ort` nach `theme.ground` auf; ein Level mit `ort` braucht kein `scatter`.
- Nur Grafik. Was die Murmel berührt, bleibt in `parts` (Physik, Autopilot, `pruefe-level.mjs` laufen headless ohne Grafik).

### 3.2 Kamera im geschlossenen Raum
- **Wände und Decke einseitig, nach innen** (three.js Standard `FrontSide`): von aussen unsichtbar. Steht die Kamera hinter
  einer Wand, sieht man wie in ein Puppenhaus hinein. Gilt auch für den Überflug und den Hochflug nach dem Gewinn (`cinema()`).
- **Möbel**, die zwischen Kamera und Murmel kommen: als eigene Liste `kulisse` halb durchsichtig machen, wie heute `fade()`
  bei der Bauteil-Kamera (`view.js:397`), nicht als `blockers` (die ziehen die Kamera bis auf 2.5 m heran).
- Kamera-Höhe heute `target.y + 7` (`behind()`), das sind 11 cm über der Murmel. Unter der Decke (156 Einheiten) kein
  Problem; unter Möbeln (Tisch, Bett) prüfen.

### 3.3 Abstürze im Raum
- Bleibt wie heute: unter `killY` = runtergefallen, zurück zum Checkpoint. Der Zimmerboden liegt bei `killY - 1`
  (wie der Untergrund heute), die Murmel wird kurz vor dem Boden zurückgesetzt.
- Der Boden ist damit «Lava»: Die Strecke führt über Möbel. Ein befahrbarer Boden (Teppich als Strecke) wäre eine eigene
  Entscheidung, siehe Fragen.

### 3.4 Licht
- Draussen wie heute (Sonne). Drinnen: `ort.licht` mit Fensterlicht und Deckenlampe, Nebel weiter weg als der Raum
  (Nebel im Zimmer sieht falsch aus). Schattenkamera der Sonne (±12 um die Murmel) bleibt.

### 3.5 Kategorie «Echte Orte»
- Heute ist die Karte eine Liste von Welten (`WORLDS` in `src/levels/index.js`, eine Reihe pro Welt in `showMap()`,
  `src/main.js:204`). Neu bekommt jede Welt `kategorie`: `'bahn'` (Standard, alle heutigen Welten) oder `'orte'`.
- Karte: zwei Abschnitte mit Überschrift, zuerst «Bahnen», darunter «Echte Orte 🏠». Die Welten der Kategorie stehen in
  `WORLDS` hinter den heutigen, so ändert sich an Reihenfolge und Freischalten der bisherigen Level nichts (`isOpen` geht
  nach der Stelle in `LEVELS`).
- Sterne, Bestzeiten, Rangliste, Geister und Sticker laufen pro Level bzw. pro Welt und brauchen nichts Neues.
- Bisherige Level und Welten bleiben unverändert, auch Themen und `scatter`.

## 4. Schritte (je ein PR)

0. **Kategorie auf der Karte**: `kategorie` an den Welten, zwei Abschnitte in `showMap()`. Test: Karte zeigt beide
   Abschnitte, bisherige Welten unverändert in «Bahnen».
1. **`level.ort` + Massstab**: `src/orte.js`, Masse in cm, `far`/Nebel aus der Grösse des Orts, Bauer `tisch`.
2. **`raum` + Kamera**: Bauer für Wände, Boden, Decke, Fenster, Tür, einfache Möbel (Kisten-Formen); einseitige Wände;
   `kulisse` mit `fade()`. Neuer Test «Kamera im Raum»: auf der Route des Levels in Abständen prüfen, dass der Strahl
   Kamera → Murmel keine undurchsichtige Kulisse trifft.
3. **Pilot-Level Schreibtisch im Kinderzimmer** (Stufe 1): Die Strecke liegt auf der Tischplatte (75 × 50 Einheiten),
   ringsum das ganze Zimmer als Kulisse. Start auf dem Bücherstapel → Bücher als Treppe hinunter → am Stiftebecher
   vorbei → Lineal als Brücke über die Lücke zwischen Heft und Federmäppchen → Ziel in der offenen Schublade.
   Runter vom Tisch = Absturz. Richtzeit messen (`richtzeiten.mjs`).
3b. **`d1` im echten Massstab** (nach Merge von #78): `haus` aus `themes.js` nach `src/orte.js`, Masse in cm, Strecke neu
   auf einem Stück Dach. `pruefe-level.mjs d1` 16/16.
4. **Bauteile aus echten Dingen** (Stufe 2): `buch` (Klotz mit Buchrücken, stapelbar), `lineal` (schmaler Weg mit
   Zentimetern), `bett` (Matratze + Decke), `tisch` (Platte + Beine als Körper). Je ein Prüfstand-Level `p-<name>`, 16/16.
5. **Echte Wege in weiteren Orten** (Stufe 3), als neue Level der Kategorie. Die Welt-PRs #79, #80, #82, #83 bleiben
   Bahn-Welten; ihre Themen können als echte Orte neu entstehen:
   - Werkbank als `tisch`, Werkzeug in echter Grösse liegt auf der Platte.
   - Käserei und Schoggifabrik als `raum` (Halle), Uhrwerk als Gehäuse.
   - Schlittelhang: Gelände folgt der Piste, Hütte als Ziel.
   - Chilbi-Platz mit Buden ringsum.
6. **Mehr Orte im Haus**: Treppe (eine Stufe 17 cm = 10.6 Einheiten), Keller, Küchenablage. Zusammen mit `d1` und dem Kinderzimmer eine Welt
   «Zuhause».

## 5. Woran wir es erkennen

- Ohne Levelnamen lässt sich sagen, wo das Level spielt (Screenshot an jemanden zeigen, der das Level nicht kennt).
- Hindernisse gehören an den Ort; Material wirkt aufs Fahren, wo es passt.
- Test «Kamera im Raum» grün: Die Murmel ist auf der ganzen Route sichtbar.
- `pruefe-level.mjs` 16/16 (alle Stärken × Murmeln), im PR.
- Bildrate auf dem Handy nicht schlechter als in den heutigen Leveln (im Pilot messen, vorher/nachher).

## 6. Offene Fragen an den Benutzer

1. Zeitlupe durch den echten Massstab (Abschnitt 2) so lassen?
2. Boden im Raum: Absturz wie heute, oder befahrbar (dann braucht es eine andere Regel für «runtergefallen»)?
3. Kategorie «Echte Orte» von Anfang an offen, oder erst ab einer Anzahl Sterne (wie Vulkan mit `need`)?
4. Karte: zwei Abschnitte untereinander (Vorschlag) oder Umschalter «Bahnen / Echte Orte»?
