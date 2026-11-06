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
  **Entscheid (Benutzer):** vorerst so lassen (Physik wie im Original). Später verfeinern, je nach Höhe der Strecke;
  dafür gibt es schon `level.physik.schwerkraft` pro Level.
- **`d1` (#78)** rechnet mit 25 cm pro Einheit. Für die Kategorie muss es im neuen Massstab neu gebaut werden: Das Haus
  wird 15.6-mal grösser (25 / 1.6), die Strecke deckt nur noch ein Stück Dach ab (z. B. letzte Ziegelreihen → Dachrinne → Fallrohr →
  Regentonne).

## 3. Technik

### 3.1 `ort` an der Welt
- Neues Modul `src/orte.js` mit Bauern je Art: `raum`, `haus`, `tisch` (alle neu, `level.haus` aus #78 nur als Vorlage).
- Die Welt beschreibt den Ort als Daten in echten cm, der Bauer rechnet in Einheiten um, z. B.
  `ort: { art: 'raum', cm: [400, 250, 350], moebel: [{ art: 'tisch', cm: [120, 75, 80], at: [...] }, ...], fenster: [...] }`.
- Jedes Level sagt, wo sein Nullpunkt im Raum liegt (`bereich: { at: [x, y, z] in cm, yaw }`); Strecke und Start bleiben in
  Level-Koordinaten wie heute, der Raum wird darum herum verschoben.
- `view.js` baut den Ort statt `theme.ground`; kein `scatter`.
- Nur Grafik. Was die Murmel berührt, bleibt in `parts` (Physik, Autopilot, `pruefe-level.mjs` laufen headless ohne Grafik).
  Liegt die Strecke auf einem Möbel, steht dieses Möbel als Körper in `parts`, die übrigen Möbel sind Kulisse.

### 3.2 Kamera im geschlossenen Raum
- **Wände und Decke einseitig, nach innen** (three.js Standard `FrontSide`): von aussen unsichtbar. Steht die Kamera hinter
  einer Wand, sieht man wie in ein Puppenhaus hinein. Gilt auch für den Überflug und den Hochflug nach dem Gewinn (`cinema()`).
- **Möbel**, die zwischen Kamera und Murmel kommen: als eigene Liste `kulisse` halb durchsichtig machen, wie heute `fade()`
  bei der Bauteil-Kamera (`view.js:397`), nicht als `blockers` (die ziehen die Kamera bis auf 2.5 m heran).
- Kamera-Höhe heute `target.y + 7` (`behind()`), das sind 11 cm über der Murmel. Unter der Decke (156 Einheiten) kein
  Problem; unter Möbeln (Tisch, Bett) prüfen.

### 3.3 Abstürze im Raum
**Entscheid (Benutzer):** Der Boden ist Absturz.
- Wie heute: unter `killY` = runtergefallen, zurück zum Checkpoint. Der Zimmerboden liegt bei `killY - 1`, die Murmel wird
  kurz vor dem Boden zurückgesetzt. Strecken liegen darum immer auf Möbeln oder Dingen, nie auf dem Boden.

### 3.4 Licht
- Draussen wie heute (Sonne). Drinnen: `ort.licht` mit Fensterlicht und Deckenlampe, Nebel weiter weg als der Raum
  (Nebel im Zimmer sieht falsch aus). Schattenkamera der Sonne (±12 um die Murmel) bleibt.

### 3.5 Kategorie «Echte Orte»
**Entscheid (Benutzer):** Umschalter auf der Karte, Kategorie von Anfang an offen.
- Heute ist die Karte eine Liste von Welten (`WORLDS` in `src/levels/index.js`, eine Reihe pro Welt in `showMap()`,
  `src/main.js:204`). Neu bekommt jede Welt `kategorie`: `'bahn'` (Standard, alle heutigen Welten) oder `'orte'`.
- Karte: Umschalter oben «🎢 Bahnen / 🏠 Echte Orte». `showMap()` zeigt nur die Welten der gewählten Kategorie. Die Wahl
  wird gemerkt (Einstellungen in `src/progress.js`). «▶️ Weiter» (`markNext()`, `src/main.js:307`) sucht im DOM der
  Karte und bleibt damit von selbst in der gewählten Kategorie.
- Offen von Anfang an: kein `need`; das erste Level jeder Welt ist offen wie heute (`isOpen`, `src/main.js:151`).
- Die Welten der Kategorie stehen in `WORLDS` hinter den heutigen, so ändert sich an Reihenfolge und Freischalten der
  bisherigen Level nichts (`isOpen` geht nach der Stelle in `LEVELS`).
- Knopf «Nächstes Level» im Gewinn-Fenster nimmt heute `levelIdx + 1` (`src/main.js:438`, `:515`): am Ende der letzten
  Bahn-Welt darf er nicht in die Kategorie «Echte Orte» springen (und umgekehrt).
- Sterne, Bestzeiten, Rangliste, Geister und Sticker laufen pro Level bzw. pro Welt und brauchen nichts Neues.
- Bisherige Level und Welten bleiben unverändert, auch Themen und `scatter`.

### 3.6 Welt = ein Ort, Level = ein Bereich darin
**Entscheid (Benutzer):** Räume dürfen auf mehrere Level aufgeteilt werden, alles wird neu gebaut.
- Eine Welt der Kategorie ist ein Ort (z. B. Kinderzimmer). Der Ort steht einmal als Daten an der Welt (`world.ort`),
  alle Level der Welt zeigen denselben Raum.
- Jedes Level ist ein Bereich dieses Orts (`level.bereich`, z. B. Schreibtisch, Regal, Bett, Fensterbank) mit
  eigener Strecke. Die Kamera sieht den Raum jedes Mal von einer anderen Stelle.
- Level dürfen aneinander anschliessen (Ziel des einen = Start des nächsten, z. B. Schublade), müssen aber nicht
  (Entscheid Benutzer).
- Nichts wird aus den bisherigen Leveln, Themen oder Props übernommen; auch `d1` aus #78 dient nur als Vorlage.

## 4. Schritte (je ein PR)

0. **Kategorie auf der Karte**: `kategorie` an den Welten, Umschalter in `showMap()`, Wahl gemerkt, «Nächstes Level»
   bleibt in der Kategorie. Tests: Umschalter wechselt die Welten, Wahl bleibt nach Neuladen, bisherige Welten unverändert
   unter «Bahnen».
1. **`ort` + Massstab**: `src/orte.js`, `world.ort` und `level.bereich`, Masse in cm, `far`/Nebel aus der Grösse des Orts.
2. **`raum` + Kamera**: Bauer für Wände, Boden, Decke, Fenster, Tür, einfache Möbel (Kisten-Formen); einseitige Wände;
   `kulisse` mit `fade()`. Neuer Test «Kamera im Raum»: auf der Route des Levels in Abständen prüfen, dass der Strahl
   Kamera → Murmel keine undurchsichtige Kulisse trifft.
3. **Pilot-Welt Kinderzimmer, Level 1 Schreibtisch** (Stufe 1): Die Strecke liegt auf der Tischplatte (75 × 50
   Einheiten), ringsum das ganze Zimmer als Kulisse. Start auf dem Bücherstapel → Bücher als Treppe hinunter → am
   Stiftebecher vorbei → Lineal als Brücke über die Lücke zwischen Heft und Federmäppchen → Ziel in der offenen
   Schublade. Runter vom Tisch = Absturz. Richtzeit messen (`richtzeiten.mjs`).
4. **Bauteile aus echten Dingen** (Stufe 2): `buch` (Klotz mit Buchrücken, stapelbar), `lineal` (schmaler Weg mit
   Zentimetern), `bett` (Matratze + Decke), `tisch` (Platte + Beine als Körper). Je ein Prüfstand-Level `p-<name>`, 16/16.
5. **Weitere Bereiche im Kinderzimmer** (Stufe 3, echte Wege): Regal (Bretter, Spielzeug), Bett (Matratze federt, neue
   Oberfläche `matratze`), Nachttisch, Fensterbank. Jeder Bereich ein Level.
6. **Weitere Orte, alles neu gebaut**, je eine Welt mit mehreren Bereichen, z. B.:
   - Dach: Ziegel, Dachrinne, Fallrohr → Regentonne (Ideen aus #78, neu im echten Massstab).
   - Küche: Ablage, Spüle, Herd.
   - Badezimmer: Lavabo, Badewannenrand.
   - Werkstatt: Werkbank, Werkzeugwand.
   - Treppenhaus: eine Stufe 17 cm = 10.6 Einheiten.
   Die Bahn-Welten (auch die offenen PRs #79, #80, #82, #83) bleiben, wie sie sind.

## 5. Woran wir es erkennen

- Ohne Levelnamen lässt sich sagen, wo das Level spielt (Screenshot an jemanden zeigen, der das Level nicht kennt).
- Hindernisse gehören an den Ort; Material wirkt aufs Fahren, wo es passt.
- Test «Kamera im Raum» grün: Die Murmel ist auf der ganzen Route sichtbar.
- `pruefe-level.mjs` 16/16 (alle Stärken × Murmeln), im PR.
- Bildrate auf dem Handy nicht schlechter als in den heutigen Leveln (im Pilot messen, vorher/nachher).

## 6. Später

- Zeitlupe verfeinern, je nach Höhe der Strecke (`level.physik.schwerkraft`).
