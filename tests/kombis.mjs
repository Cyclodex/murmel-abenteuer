// Die 16 Kombinationen, mit denen pruefe-level.mjs (und die Autopilot-Tests) jedes Level fahren:
// 3 Stärken mit der Standard-Murmel, dann alle anderen Murmeln mit Stärke normal.
import { SKINS } from '../src/skins.js';
import { POWERS } from '../src/input.js';

export const KOMBIS = [...POWERS.map(P => [P, SKINS[0]]), ...SKINS.slice(1).map(S => [POWERS[1], S])];
