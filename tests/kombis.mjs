// Die Kombinationen (Stärke, Murmel), mit denen pruefe-level.mjs (und die Autopilot-Tests) ein Level fahren:
// KOMBIS = 16: 3 Stärken mit der Standard-Murmel, dann alle anderen Murmeln mit Stärke normal.
// Level in echten Orten (Feld `ort`) fahren nur Stärke normal mit der Standard-Murmel (kombisFuer).
import { SKINS } from '../src/skins.js';
import { POWERS } from '../src/input.js';

export const KOMBIS = [...POWERS.map(P => [P, SKINS[0]]), ...SKINS.slice(1).map(S => [POWERS[1], S])];
export const kombisFuer = level => level.ort ? [KOMBIS[1]] : KOMBIS;
