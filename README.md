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
| `src/levels/*.js` | Level als Daten (ein Objekt pro Level), Reihenfolge in `src/levels/index.js` |
| `src/elements.js` | Alle Bauteil-Typen: Klötze, Logik und Grafik je Typ |
| `src/game.js` | Physik + Spielregeln, ohne Grafik (auch headless nutzbar) |
| `src/view.js` | three.js-Szene, Kamera |
| `src/input.js` | Kippen, Joystick, Pfeiltasten |
| `src/main.js` | Start, Bedienung, Spielschleife |

## Level bauen

Koordinaten in Metern: `x` = rechts, `y` = oben, `-z` = vorwärts. Die Murmel hat Radius 0.5. Winkel (`yaw`) in Grad.

| Bauteil | Felder |
|---|---|
| `weg` | `from`, `to` (Oberkante, Höhenunterschied = Rampe), `width`, `walls` (Randhöhe), `caps` (`'start'`/`'end'`/`'both'`) |
| `wand` | `from`, `to` (Unterkante), `height` |
| `klotz` | `at` (Mitte), `size: [breit, hoch, tief]`, `yaw` |
| `stern` | `at` |
| `checkpoint` | `at` (Punkt auf dem Boden, dort geht es weiter), `size: [b, h, t]` Auslöse-Zone |
| `trampolin` | `at`, `size: [b, t]`, `jump`, `push`, `yaw` |
| `ziel` | `at`, `r` |

Neues Hindernis erfinden: in `src/elements.js` einen Typ ergänzen (`solids`, `reset`, `step`, `view`), danach kann es in jedem Level verwendet werden.
