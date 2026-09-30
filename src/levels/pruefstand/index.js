// Prüfstand: ein kurzes Level pro Bauteil (Anlauf, Bauteil, Ziel). Jedes muss mit jeder Murmel schaffbar sein
// (Test „Prüfstand …“ in tests/game.spec.js, läuft bei jedem PR). Nicht auf der Karte; im Spiel mit ?pruefstand als eigene Welt.
// Routen in tests/routes/pruefstand/<gruppe>.js (gleicher Dateiname wie hier).
import bahn from './bahn.js';
import beweglich from './beweglich.js';
import kraefte from './kraefte.js';
import welt from './welt.js';

export const GRUPPEN = { bahn, beweglich, kraefte, welt };
export const PRUEFSTAND = Object.values(GRUPPEN).flat();
// Markiert: keine Punkte-Rekorde (sonst landeten sie in der Online-Rangliste)
for (const l of PRUEFSTAND) l.pruefstand = true;
