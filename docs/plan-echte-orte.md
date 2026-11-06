# Plan: Echte Orte statt Bahn im Leeren (#84)

Ziel: Ein Level ist ein Weg durch einen echten Ort. Die Kulisse ist der Ort, die Hindernisse sind Dinge dieses Ortes,
das Material verändert das Fahren. Bestehende Level bleiben, wie sie sind.

## 1. Stand (geprüft im Code)

| Wo | Kulisse | Bahn |
|---|---|---|
| main, alle Welten | `theme.ground(tools, floorY)`: eine Ebene bei `floorY = killY - 1` (`src/view.js:282`) und `scatter()` (`src/themes.js:80`): 26 Gegenstände im Ring 14–69 m um (0, -25), unabhängig vom Level, so verkleinert, dass sie unter der Bahn bleiben | allgemeine Teile (`weg`, `rinne`, `klotz` …) mit Welt-Material |
| #79 Winter, #80 Chilbi, #82 Werkstatt, #83 Schweiz | gleiches Muster: Ebene + `scatter` + Deko-Klötze. Kein Raum, keine Wände, kein Dach | allgemeine Teile neu eingefärbt; neue Oberflächen `schnee`, `zuckerwatte`, `saegemehl`, `schoggi` |
| #78 Dach (`d1`) | einziger echter Ort: `level.haus` baut Hauswände, Giebel, hintere Dachfläche, Garten, Nachbarhäuser (nur Grafik) | allgemeine Teile, aber nach dem Haus gelegt (Neigung 0.5 = `haus.neigung`); Oberflächen `ziegel`, `dachrinne` |

Grössen der Level auf main (Ausdehnung der Teile, gemessen): 8–56 m breit, 37–138 m lang (`b1` am längsten).
Kamera: `far` 200, Nebel je Welt z. B. 50–120 (Spielzimmer).

## 2. Massstab

Die Murmel hat Ø 1 Einheit (`R = 0.5`). Pro Ort einen Massstab wählen und im Level-Kopf notieren:

| 1 Einheit = | Murmel Ø | passt für | Beispiel in Einheiten |
|---|---|---|---|
| 1.6 cm | 1.6 cm (echte Murmel) | Tisch, Werkbank, Schublade | Tisch 120 × 80 cm = 75 × 50 |
| 5 cm | 5 cm | ein Zimmer | Zimmer 4 × 3.5 × 2.5 m = 80 × 70 × 50 |
| 10 cm | 10 cm | grosses Zimmer, Treppenhaus | Zimmer 4 × 3.5 × 2.5 m = 40 × 35 × 25 |
| 25 cm | 25 cm (Ball) | Haus, Dach (`d1`) | Haus in `d1`: 19.2 × 33.2 = 4.8 × 8.3 m |

Vorschlag für den ersten Raum: **1 Einheit = 5 cm**. 80 × 70 liegt im Bereich der heutigen Level, die Kamera (`far` 200)
reicht ohne Änderung.

## 3. Technik

### 3.1 `level.ort` statt `level.haus`
- Neues Modul `src/orte.js` mit Bauern je Art: `haus` (aus #78 übernommen), `raum`, `tisch`.
- Level beschreibt den Ort als Daten, z. B. `ort: { art: 'raum', x: [-40, 40], z: [-70, 0], boden: -20, decke: 30, fenster: [...], moebel: [...] }`.
- `view.js` ruft `ort` nach `theme.ground` auf; ein Level mit `ort` braucht kein `scatter`.
- Nur Grafik. Was die Murmel berührt, bleibt in `parts` (Physik, Autopilot, `pruefe-level.mjs` laufen headless ohne Grafik).

### 3.2 Kamera im geschlossenen Raum
- **Wände und Decke einseitig, nach innen** (three.js Standard `FrontSide`): von aussen unsichtbar. Steht die Kamera hinter
  einer Wand, sieht man wie in ein Puppenhaus hinein. Gilt auch für den Überflug und den Hochflug nach dem Gewinn (`cinema()`).
- **Möbel**, die zwischen Kamera und Murmel kommen: als eigene Liste `kulisse` halb durchsichtig machen, wie heute `fade()`
  bei der Bauteil-Kamera (`view.js:397`), nicht als `blockers` (die ziehen die Kamera bis auf 2.5 m heran).
- Kamera-Höhe heute `target.y + 7` (`behind()`): bei Decke 50 Einheiten über dem Boden kein Problem, bei tiefen Räumen
  (10-cm-Massstab, Decke 25) prüfen.

### 3.3 Abstürze im Raum
- Bleibt wie heute: unter `killY` = runtergefallen, zurück zum Checkpoint. Der Zimmerboden liegt bei `killY - 1`
  (wie der Untergrund heute), die Murmel wird kurz vor dem Boden zurückgesetzt.
- Der Boden ist damit «Lava»: Die Strecke führt über Möbel. Ein befahrbarer Boden (Teppich als Strecke) wäre eine eigene
  Entscheidung, siehe Fragen.

### 3.4 Licht
- Draussen wie heute (Sonne). Drinnen: `ort.licht` mit Fensterlicht und Deckenlampe, Nebel weiter weg als der Raum
  (Nebel im Zimmer sieht falsch aus). Schattenkamera der Sonne (±12 um die Murmel) bleibt.

## 4. Schritte (je ein PR)

1. **`level.ort` + `haus`** (nach Merge von #78): `haus` aus `themes.js` nach `src/orte.js`, `d1` auf `ort: { art: 'haus' }`.
   Kein Unterschied im Bild. Test: Screenshot-Test von `d1` unverändert, `pruefe-level.mjs d1` 16/16.
2. **`raum` + Kamera**: Bauer für Wände, Boden, Decke, Fenster, Tür, einfache Möbel (Kisten-Formen); einseitige Wände;
   `kulisse` mit `fade()`. Neuer Test «Kamera im Raum»: auf der Route des Levels in Abständen prüfen, dass der Strahl
   Kamera → Murmel keine undurchsichtige Kulisse trifft.
3. **Pilot-Level Kinderzimmer** (Stufe 1, Massstab 5 cm): Start oben auf dem Regal → Bücherreihe als Rampe → aufs Bett
   (Matratze federt) → Bettkante → Lineal als Brücke zum Schreibtisch → über die Tischplatte am Stiftebecher vorbei →
   Ziel in der Spielzeugkiste. Neue Oberfläche `matratze` (federt, bremst). Richtzeit messen (`richtzeiten.mjs`).
4. **Bauteile aus echten Dingen** (Stufe 2): `buch` (Klotz mit Buchrücken, stapelbar), `lineal` (schmaler Weg mit
   Zentimetern), `bett` (Matratze + Decke), `tisch` (Platte + Beine als Körper). Je ein Prüfstand-Level `p-<name>`, 16/16.
5. **Echte Wege in weiteren Orten** (Stufe 3), Vorschläge für die offenen Welten:
   - Werkstatt (#82): Werkbank als `tisch` im 1.6-cm-Massstab, Werkzeug liegt auf der Platte statt riesig daneben.
   - Schweiz (#83): Käserei und Schoggifabrik als `raum` (Halle), Uhrwerk als Gehäuse.
   - Winter (#79): Hang statt Ebene (Gelände folgt der Piste), Hütte als Ziel.
   - Chilbi (#80): Platz mit Buden ringsum statt verstreut.
6. **Mehr Orte im Haus**: Treppenhaus (10 cm), Keller, Küche als Raum. Zusammen mit `d1` eine Welt «Zuhause».

## 5. Woran wir es erkennen

- Ohne Levelnamen lässt sich sagen, wo das Level spielt (Screenshot an jemanden zeigen, der das Level nicht kennt).
- Hindernisse gehören an den Ort; Material wirkt aufs Fahren, wo es passt.
- Test «Kamera im Raum» grün: Die Murmel ist auf der ganzen Route sichtbar.
- `pruefe-level.mjs` 16/16 (alle Stärken × Murmeln), im PR.
- Bildrate auf dem Handy nicht schlechter als in den heutigen Leveln (im Pilot messen, vorher/nachher).

## 6. Offene Fragen an den Benutzer

1. Massstab Zimmer 5 cm (Murmel Ø 5 cm) oder 1.6 cm (echte Murmel, Zimmer 250 Einheiten breit)?
2. Boden im Raum: Absturz wie heute, oder befahrbar (dann braucht es eine andere Regel für «runtergefallen»)?
3. Die vier offenen Welt-PRs (#79, #80, #82, #83) vor dem Merge auf echte Orte umbauen oder erst danach?
4. Neue Welt «Zuhause» (Dach, Kinderzimmer, Treppenhaus …) oder Räume in die bestehenden Welten?
