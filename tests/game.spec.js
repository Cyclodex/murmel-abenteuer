import { test, expect } from '@playwright/test';

// Externe Schrift (Google Fonts) im Test nicht laden: das Spiel soll ohne Netz laufen
test.beforeEach(async ({ page }) => {
  await page.route(u => !u.hostname.startsWith('localhost'), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
});

// Sammelt alle JS-Fehler der Seite
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('Laden fehlgeschlagen: ' + r.url()));
  return errors;
}

// Neuen Spieler anlegen (Spieler-Auswahl muss offen sein)
async function newPlayer(page, name) {
  await expect(page.locator('#playerOv')).toBeVisible();
  await page.fill('#playerName', name);
  await page.click('#playerForm button');
  await expect(page.locator('#mapOv')).toBeVisible();
}

// Start -> Joystick -> Spieler -> Karte -> Level wählen
async function play(page, levelId = 'ausflug') {
  await page.goto('/');
  await page.waitForFunction(() => window.murmel && window.murmel.game);
  await page.click('#startJoy');
  await newPlayer(page, 'Test');
  await page.click(`.lvl[data-level="${levelId}"]`);
  await expect(page.locator('#hud')).toBeVisible();
  expect(await page.evaluate(() => window.murmel.running)).toBe(true);
}
const ballPos = page => page.evaluate(() => { const b = window.murmel.game.ball.position; return { x: b.x, y: b.y, z: b.z }; });

test('Spiel startet, Karte erscheint, Murmel rollt mit der Pfeiltaste', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page);
  const z0 = (await ballPos(page)).z;
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1500);
  await page.keyboard.up('ArrowUp');
  const p = await ballPos(page);
  expect(p.z).toBeLessThan(z0 - 1);
  expect(p.y).toBeGreaterThan(0);
  await expect(page.locator('#stars')).toHaveText(/⭐ \d\/5/);
  expect(errors).toEqual([]);
});

test('Jedes Level lässt sich mit Grafik laden und zeichnen', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => window.murmel && window.murmel.game);
  const ids = await page.evaluate(() => window.murmel.LEVELS.map(l => l.id));
  for (const id of ids) {
    await page.evaluate(i => window.murmel.startLevel(window.murmel.LEVELS.findIndex(l => l.id === i)), id);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    expect(errors, id).toEqual([]);
  }
});

test('Schwebender Joystick: irgendwo drücken und ziehen', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page);
  const z0 = (await ballPos(page)).z;
  await page.mouse.move(200, 400);
  await page.mouse.down();
  await page.mouse.move(200, 330, { steps: 5 });  // nach oben ziehen = vorwärts
  await expect(page.locator('#joy')).toHaveClass(/active/);
  const box = await page.locator('#joy').boundingBox();
  expect(Math.abs(box.x + box.width / 2 - 200)).toBeLessThan(2); // erscheint beim Finger
  expect(Math.abs(box.y + box.height / 2 - 400)).toBeLessThan(2);
  await page.waitForTimeout(1200);
  await page.mouse.up();
  await expect(page.locator('#joy')).not.toHaveClass(/active/);
  expect((await ballPos(page)).z).toBeLessThan(z0 - 1);
  expect(errors).toEqual([]);
});

test('Buttons oben rechts sind antippbar', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page);
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1000);
  await page.keyboard.up('ArrowUp');
  // Normaler Klick (ohne force): scheitert, wenn ein anderes Element den Button verdeckt
  await page.tap('#btnReset');
  expect((await ballPos(page)).z).toBeCloseTo(2, 0);
  await page.evaluate(() => document.getElementById('btnCal').classList.remove('hidden'));
  await page.tap('#btnCal');
  await expect(page.locator('#toast')).toBeVisible();
  await page.tap('#btnHome');
  await expect(page.locator('#mapOv')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Nach der Kurve wirkt die Steuerung relativ zur Kamera', async ({ page }) => {
  await play(page, 'sz1');
  // auf die Gerade nach der Rechtskurve setzen (Bahn zeigt nach +x)
  await page.evaluate(() => window.murmel.game.spawn([8, 0.6, -25]));
  await page.waitForFunction(() => Math.abs(window.murmel.camYaw + Math.PI / 2) < 0.05, null, { timeout: 5000 });
  const x0 = (await ballPos(page)).x, t0 = await page.evaluate(() => window.murmel.game.time);
  await page.keyboard.down('ArrowUp');
  await page.waitForFunction(t => window.murmel.game.time > t + 1.5, t0); // Spielzeit (unter Last laufen weniger Schritte pro Sekunde)
  await page.keyboard.up('ArrowUp');
  const p = await ballPos(page);
  expect(p.x).toBeGreaterThan(x0 + 1);        // "hoch" = vorwärts entlang der Bahn
  expect(Math.abs(p.z + 25)).toBeLessThan(0.5); // nicht seitlich weg
});

test('Level schaffen speichert Fortschritt und schaltet frei', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page, 'ausflug');
  // 5 Sterne "gesammelt", dann ins Ziel setzen
  await page.evaluate(() => { const g = window.murmel.game; g.st.stars = 5; g.spawn([0, 5, -69]); });
  await expect(page.locator('#winOv')).toBeVisible();
  await expect(page.locator('#winUnlock')).toContainText('⚽');
  await page.reload();
  await page.click('#startJoy');
  await expect(page.locator('#mapStars')).toHaveText('⭐ 5');
  await expect(page.locator('.lvl[data-level="ausflug"]')).toHaveClass(/done/);
  await expect(page.locator('.lvl[data-level="sz1"]')).toBeEnabled();
  await expect(page.locator('.lvl[data-level="sz2"]')).toBeDisabled();    // erst nach sz1
  await page.click('#btnSkins');
  await expect(page.locator('.skin[data-skin="fussball"]')).toBeEnabled();
  await expect(page.locator('.skin[data-skin="melone"]')).toBeDisabled();
  await page.click('.skin[data-skin="fussball"]');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('murmel-abenteuer-v2')).players[0].skin)).toBe('fussball');
  expect(errors).toEqual([]);
});

test('Mehrere Spieler: eigener Spielstand, Rangliste nach Punkten', async ({ page }) => {
  const errors = watchErrors(page);
  const win = async (id, stars, spot, falls = 0) => {
    await page.click(`.lvl[data-level="${id}"]`);
    await page.evaluate(([n, p, f]) => { const g = window.murmel.game; for (let k = 0; k < f; k++) g.fall([]); g.st.stars = n; g.spawn(p); }, [stars, spot, falls]);
    await expect(page.locator('#winOv')).toBeVisible();
  };
  await page.goto('/');
  await page.click('#startJoy');
  await page.click('#playerForm button');               // leerer Name: nichts passiert
  await expect(page.locator('#playerOv')).toBeVisible();
  await newPlayer(page, '  Anna  ');
  await expect(page.locator('#btnPlayer')).toHaveText('👤 Anna');
  // 3 von 5 Sternen, sofort im Ziel (Zeitbonus voll), 1 Absturz: 600 + 750 + 200
  await win('ausflug', 3, [0, 5, -69], 1);
  await expect(page.locator('#winScore')).toHaveText('🏆 1550 · 💥1');
  await expect(page.locator('#winRank')).toBeHidden();  // nur ein Spieler
  await page.click('#mapBtn');
  // zweiter Spieler startet bei null
  await page.click('#btnPlayer');
  await newPlayer(page, '<b>Ben</b>');
  await expect(page.locator('#btnPlayer')).toHaveText('👤 <b>Ben</b>'); // Name als Text, nicht als HTML
  await expect(page.locator('#mapStars')).toHaveText('⭐ 0');
  await expect(page.locator('.lvl[data-level="ausflug"]')).not.toHaveClass(/done/);
  await win('ausflug', 5, [0, 5, -69]);
  await expect(page.locator('#winScore')).toHaveText('🏆 2050');
  await expect(page.locator('#winRank')).toHaveText('🥇 <b>Ben</b> 🏆2050 🐇\n🥈 Anna 🏆1550 🐇');
  // nach Neuladen: Ben ist noch dran, Rangliste in der Auswahl
  await page.reload();
  await page.click('#startJoy');
  await expect(page.locator('#btnPlayer')).toHaveText('👤 <b>Ben</b>');
  await page.click('#btnPlayer');
  await expect(page.locator('.player')).toHaveText(['🥇 <b>Ben</b> 🏆2050 ⭐5', '🥈 Anna 🏆1550 ⭐3']);
  await expect(page.locator('.player.sel')).toHaveText(/Ben/);
  await page.click('.player:has-text("Anna")');
  await expect(page.locator('#mapStars')).toHaveText('⭐ 3');
  // gleicher Name nochmal (andere Schreibweise) = kein neuer Spieler
  await page.click('#btnPlayer');
  await newPlayer(page, 'anna');
  await expect(page.locator('#mapStars')).toHaveText('⭐ 3');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('murmel-abenteuer-v2')).players.length)).toBe(2);
  expect(errors).toEqual([]);
});

test('Alter Spielstand geht an den ersten neuen Spieler', async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => {
    if (!localStorage.getItem('murmel-abenteuer-v2')) localStorage.setItem('murmel-abenteuer-v1', JSON.stringify(
      { done: { ausflug: true }, best: { ausflug: 4 }, skin: 'fussball', control: 'joy', power: 'extrem', sound: 'aus' }));
  });
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Mia');
  await expect(page.locator('#mapStars')).toHaveText('⭐ 4');
  await expect(page.locator('#btnPower')).toHaveText('🚀');
  await page.click('#btnPlayer');
  await newPlayer(page, 'Leo');
  await expect(page.locator('#mapStars')).toHaveText('⭐ 0');
  expect(errors).toEqual([]);
});

test('Ohne localStorage läuft das Spiel trotzdem', async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('gesperrt'); } });
  });
  await play(page, 'sz1');
  expect(errors).toEqual([]);
});

// Autopilot pro Welt (laufen parallel): jede Stärke mit der Standard-Murmel, jede Murmel mit Stärke normal.
// Neue Welt: hier eintragen (der Test darunter meldet vergessene Welten).
const WELTEN = ['uebung', 'spielzimmer', 'garten', 'kueche', 'badezimmer', 'weltraum', 'unterwasser', 'vulkan'];

test('Jedes Level hat eine Route und gehört zu einer Welt aus WELTEN', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { WORLDS, LEVELS } = await import('/src/levels/index.js');
    const { ROUTES } = await import('/tests/autopilot.js');
    return { worlds: WORLDS.map(w => w.id), ohneRoute: LEVELS.filter(l => !ROUTES[l.id]).map(l => l.id) };
  });
  for (const w of r.worlds) expect(WELTEN, w).toContain(w);
  expect(r.ohneRoute).toEqual([]);
});

for (const welt of WELTEN) for (const art of ['normal', 'schwer']) {
  test(`Autopilot ${welt} ${art}: alle Level mit jeder Stärke und jeder Murmel schaffbar, alle Sterne erreichbar`, async ({ page }) => {
    test.setTimeout(900_000);
    const errors = watchErrors(page);
    await page.goto('/');
    const res = await page.evaluate(async ([welt, art]) => {
      const { createGame } = await import('/src/game.js');
      const { WORLDS } = await import('/src/levels/index.js');
      const { checkLevel, ROUTES } = await import('/tests/autopilot.js');
      const { POWERS } = await import('/src/input.js');
      const { SKINS } = await import('/src/skins.js');
      const w = WORLDS.find(x => x.id === welt), out = [];
      if (!w) return out; // Welt (noch) nicht vorhanden
      for (const L of art === 'normal' ? w.levels : w.hard || []) {
        const combos = [...POWERS.map(P => [P, SKINS[0]]), ...SKINS.slice(1).map(S => [POWERS[1], S])];
        for (const [P, S] of combos) {
          const r = checkLevel(() => { const g = createGame(CANNON, L, S.ball); g.tilt = P.tilt * Math.PI / 180; return g; }, ROUTES[L.id]);
          out.push({ lv: L.id, id: `${L.id} ${P.emoji} ${S.id}`, ...r });
        }
      }
      return out;
    }, [welt, art]);
    for (const r of res) {
      expect(r.won, r.id).toBe(true);
      expect(r.falls, r.id).toBe(0);
      if (r.lv !== 'ausflug') expect(r.stars, r.id).toBe(r.total); // im ersten Level fehlt ein Stern auf der Route
    }
    expect(errors).toEqual([]);
  });
}

test('Murmeln prallen je nach Art verschieden stark von der Wand ab', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const lv = { id: 't', start: [0, 0, 0], parts: [{ type: 'weg', from: [0, 0, 5], to: [0, 0, -5], width: 6, walls: 1 }] };
    const out = {};
    for (const S of SKINS) {
      const g = createGame(CANNON, lv, S.ball); g.reset();
      for (let i = 0; i < 60; i++) g.step(0, 0, 1 / 60);
      g.ball.velocity.set(5, 0, 0); g.ball.angularVelocity.set(0, 0, -10); // rollt nach rechts auf die Wand zu
      let vin = 0, back = 0;
      for (let i = 0; i < 90; i++) {
        const v0 = g.ball.velocity.x; g.step(0, 0, 1 / 60);
        if (v0 > 0 && g.ball.velocity.x < 0) vin = v0;
        back = Math.min(back, g.ball.velocity.x);
      }
      // eine halbe Sekunde nach dem Aufprall rollt sie noch zurück (klebt nicht an der Wand)
      out[S.id] = { e: +(-back / vin).toFixed(2), vx: g.ball.velocity.x, x: g.ball.position.x };
    }
    return out;
  });
  expect(r.standard.e).toBe(0.5);
  expect(r.fussball.e).toBe(0.75);
  expect(r.flummi.e).toBe(0.97);
  expect(r.basketball.e).toBe(0.8);
  expect(r.bowling.e).toBe(0.1);
  expect(r.melone.e).toBe(0.2);
  for (const id of ['standard', 'fussball', 'flummi', 'tennis', 'basketball']) {
    expect(r[id].vx, id).toBeLessThan(-0.5); // rollt noch zurück
    expect(r[id].x, id).toBeLessThan(1.5);   // klar weg von der Wand (Berührung bei x = 2.5)
  }
});

test('Golfball hüpft kaum und rollt weiter als die Standard-Murmel', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const lv = { id: 't', start: [0, 0, 0], parts: [{ type: 'weg', from: [0, 0, 60], to: [0, 0, -60], width: 6, walls: 1 }] };
    const out = {};
    for (const id of ['standard', 'golf']) {
      const ball = SKINS.find(s => s.id === id).ball;
      const g = createGame(CANNON, lv, ball); g.reset();
      for (let i = 0; i < 60; i++) g.step(0, 0, 1 / 60);
      const z0 = g.ball.position.z; g.ball.velocity.set(0, 0, -5); g.ball.angularVelocity.set(-10, 0, 0);
      for (let i = 0; i < 300; i++) g.step(0, 0, 1 / 60);
      const f = createGame(CANNON, lv, ball); f.reset(); f.spawn([0, 3.5, 0]); // aus 3 m fallen lassen
      let up = 0; for (let i = 0; i < 120; i++) { f.step(0, 0, 1 / 60); up = Math.max(up, f.ball.velocity.y); }
      out[id] = { weg: z0 - g.ball.position.z, up };
    }
    return out;
  });
  expect(r.golf.weg).toBeGreaterThan(r.standard.weg * 1.2);
  expect(r.golf.up).toBeLessThan(2.5); // früher ~5.6 m/s Rückprall
});

test('Treppe: alle Murmeln kommen unten an, der Flummi springt am höchsten', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createTreppe } = await import('/src/treppe.js');
    const { SKINS } = await import('/src/skins.js');
    const t = createTreppe(CANNON, SKINS);
    const up = SKINS.map(() => 0);
    for (let i = 0; i < 60 * 9; i++) { t.step(1 / 60); t.games.forEach((g, k) => { up[k] = Math.max(up[k], g.ball.velocity.y); }); }
    return SKINS.map((s, k) => ({ id: s.id, z: t.games[k].ball.position.z, up: up[k] }));
  });
  const by = Object.fromEntries(r.map(x => [x.id, x]));
  for (const x of r) expect(x.z, x.id).toBeGreaterThan(0); // unten im Auslauf
  for (const x of r) if (x.id !== 'flummi') expect(by.flummi.up, x.id).toBeGreaterThan(x.up);
  expect(by.basketball.up).toBeGreaterThan(by.standard.up);
});

test('Menüs zeigen die Treppe im Hintergrund, Knopf 🪜 zeigt sie im Vollbild', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => window.murmel && window.murmel.backdrop);
  await page.click('#startJoy');
  await newPlayer(page, 'Test');
  await page.click('#btnTreppe');
  await expect(page.locator('#mapOv')).toBeHidden();
  await page.waitForFunction(() => window.murmel.treppe.treppe.time > 0.5);
  await page.click('#treppeBack');
  await page.click('.lvl[data-level="ausflug"]');
  expect(await page.evaluate(() => window.murmel.backdrop)).toBe(false);
  expect(errors).toEqual([]);
});

test('Zuschau-Modus ?autopilot fährt das Level sichtbar bis ins Ziel', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/?autopilot');
  await page.click('#startJoy');
  await newPlayer(page, 'Robo');
  await page.click('.lvl[data-level="ausflug"]');
  await expect(page.locator('#pilotInfo')).toContainText('🤖 Ziel');
  await expect(page.locator('#winOv')).toBeVisible({ timeout: 50_000 });
  expect(errors).toEqual([]);
});

test('Band gegen die Fahrtrichtung dreht die Kamera nicht um', async ({ page }) => {
  await page.goto('/');
  const d = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { default: k1 } = await import('/src/levels/kueche1.js');
    const g = createGame(CANNON, k1); g.reset();
    g.track.yaw = Math.PI / 2; // nach der Kurve: Blick nach -x
    g.spawn([-12, 1, -27]);     // auf das Band, das nach +x zurückschiebt
    for (let i = 0; i < 30; i++) g.step(0, 0, 1 / 60);
    return Math.atan2(Math.sin(g.track.yaw - Math.PI / 2), Math.cos(g.track.yaw - Math.PI / 2));
  });
  expect(Math.abs(d)).toBeLessThan(0.01);
});

test('Dominos fallen nicht vom Kippen um, nur wenn die Murmel sie trifft', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const out = {};
    for (const id of ['k3', 'u3']) {
      const L = LEVELS.find(l => l.id === id);
      const dom = g => g.els.find(e => e.type === 'domino');
      const up = g => dom(g).bodies.filter(b => b.quaternion.vmult(new CANNON.Vec3(0, 1, 0)).y > 0.9).length;
      // Murmel steht vor den Dominos, Welt 3 s voll nach vorne gekippt (auch mit leichter Murmel)
      const tilt = createGame(CANNON, L, SKINS.find(s => s.id === 'pingpong').ball); tilt.reset();
      const [x, y, z] = dom(tilt).from;
      for (let i = 0; i < 180; i++) { tilt.spawn([x, y + 1, z + 3]); tilt.step(0, -1, 1 / 60); }
      // Murmel rollt hinein
      const hit = createGame(CANNON, L); hit.reset(); hit.spawn([x, y + 1, z + 3]);
      for (let i = 0; i < 60 * 4; i++) hit.step(0, -1, 1 / 60);
      out[id] = { tiltUp: up(tilt), hitUp: up(hit) };
    }
    return out;
  });
  expect(r.k3).toEqual({ tiltUp: 6, hitUp: 0 });
  expect(r.u3).toEqual({ tiltUp: 6, hitUp: 0 });
});

test('Schlamm macht die Murmel dreckig, Pfütze und Wind waschen sie', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const { autopilot, mainRoute, ROUTES } = await import('/tests/autopilot.js');
    // Gartenschlauch: durchs Beet (Schlamm), später durch die Pfütze
    const g = createGame(CANNON, LEVELS.find(l => l.id === 'g1'));
    const run = autopilot(g, mainRoute(ROUTES.g1));
    const ev = run.log.filter(x => /platsch|sauber/.test(x)).map(x => x.split('@')[0]);
    // Wind bläst den Dreck weg (Pusteblume, Aufwind)
    const w = createGame(CANNON, LEVELS.find(l => l.id === 'g2')); w.reset();
    const up = w.els.find(e => e.type === 'wind' && e.up);
    w.dirt = 1; w.dirty = true; w.spawn([up.at[0], up.at[1] + 1, up.at[2]]);
    for (let i = 0; i < 90; i++) w.step(0, 0, 1 / 60);
    // Stehen auf normalem Boden wäscht fast nichts ab
    const s = createGame(CANNON, LEVELS[0]); s.reset(); s.dirt = 1;
    for (let i = 0; i < 120; i++) s.step(0, 0, 1 / 60);
    return { won: run.won, ev, peak: g.dirtPeak, washed: g.washed, wind: w.dirt, still: s.dirt };
  });
  expect(r.won).toBe(true);
  expect(r.ev).toEqual(['platsch', 'sauber']);
  expect(r.peak).toBe(1);
  expect(r.washed).toBe(true);
  expect(r.wind).toBeLessThan(0.1);
  expect(r.still).toBeGreaterThan(0.95);
});

test('Dreckige Murmel: Flecken auf der Kugel, Spritzer, Sticker 🐷 und 🧼', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page, 'g1');
  // im Beet (z 0 bis -6) hin und her rollen, bis die Murmel ganz dreckig ist: Spritzer fliegen
  // (einfach durchgerollt ist sie nur 0.03 s ganz dreckig, das verpasst die Abfrage leicht)
  let key = 'ArrowUp';
  await page.keyboard.down(key);
  for (const t0 = Date.now(); Date.now() - t0 < 30_000;) {
    const { z, dirt } = await page.evaluate(() => ({ z: window.murmel.game.ball.position.z, dirt: window.murmel.game.dirt }));
    if (dirt >= 1) break;
    const want = z < -4 ? 'ArrowDown' : z > -1.5 && key === 'ArrowDown' ? 'ArrowUp' : key;
    if (want !== key) { await page.keyboard.up(key); key = want; await page.keyboard.down(key); }
    await page.waitForTimeout(50);
  }
  await page.keyboard.up(key);
  expect(await page.evaluate(() => window.murmel.view.ball.dirtLevel)).toBe(1);
  expect(await page.evaluate(() => window.murmel.view.splash.schlamm.count)).toBeGreaterThan(0);
  // gewaschen ins Ziel: beide Sticker
  await page.evaluate(() => { window.murmel.game.dirt = 0; window.murmel.game.washed = true; });
  await winLevel(page, 1);
  const st = (await saved(page)).stickers;
  expect(st['x:dreck']).toBe(true);
  expect(st['x:sauber']).toBe(true);
  await page.click('#cheerOv');
  // sauber ins Ziel: kein Dreck-Sticker für einen neuen Spieler
  await page.click('#mapBtn'); await page.click('#btnPlayer'); await newPlayer(page, 'Sauber');
  await page.click('.lvl[data-level="ausflug"]');
  await winLevel(page, 1);
  expect((await saved(page)).stickers['x:dreck']).toBeUndefined();
  expect(errors).toEqual([]);
});

// Kleine Testbahn fahren: liefert Ereignisse (ohne Klacken) und Endposition
const fahre = (page, parts, start, sek, input = [0, 0], extra = '') => page.evaluate(async ([parts, start, sek, input, extra]) => {
  const { createGame } = await import('/src/game.js');
  const g = createGame(CANNON, { id: 't', start, killY: -8, parts }); g.reset();
  if (extra) new Function('g', extra)(g);
  const ev = [];
  for (let i = 0; i < sek * 60; i++) for (const e of g.step(input[0], input[1], 1 / 60)) if (e !== 'hit') ev.push(e);
  const p = g.ball.position;
  return { ev, p: [p.x, p.y, p.z], dirt: g.dirt, falls: g.st.falls };
}, [parts, start, sek, input, extra]);

test('Fallen: Hammer quetscht, Falltür klappt auf, Loch im Feld, Schieber schiebt weg', async ({ page }) => {
  await page.goto('/');
  const weg = { type: 'weg', from: [0, 0, 4], to: [0, 0, -30], width: 3 };
  // Hammer: Murmel steht darunter -> platt, dann zurück zum Start
  const h = await fahre(page, [weg, { type: 'hammer', at: [0, 0, -3] }, { type: 'checkpoint', at: [0, 0, 2], size: [3, 3, 2] }], [0, 0, 2], 4, [0, 0], 'g.spawn([0, 1, -3]); g.st.cp = 0;');
  expect(h.ev.slice(0, 2)).toEqual(['quetsch', 'zurueck']);
  expect(h.falls).toBe(h.ev.filter(e => e === 'quetsch').length); // zählt als Absturz (Punkte)
  // Falltür: stehen bleiben -> Klappe auf, runterfallen; schnell drüber -> kommt durch
  const tuer = [{ type: 'weg', from: [0, 0, 4], to: [0, 0, -1.5], width: 3 }, { type: 'falltuer', at: [0, 0, -3], size: [3, 3] }, { type: 'weg', from: [0, 0, -4.5], to: [0, 0, -40], width: 3 }];
  const steh = await fahre(page, tuer, [0, 0, -3], 3);
  expect(steh.ev.slice(0, 2)).toEqual(['klapp', 'fall']); // Neustart liegt wieder auf der Klappe
  expect(steh.falls).toBe(steh.ev.filter(e => e === 'fall').length);
  const schnell = await fahre(page, tuer, [0, 0, 3], 2, [0, 0], 'g.ball.velocity.set(0, 0, -8); g.ball.angularVelocity.set(-16, 0, 0);');
  expect(schnell.ev).not.toContain('fall'); // Klappe geht erst hinter der Murmel auf
  expect(schnell.p[2]).toBeLessThan(-6);
  // Feld: Loch in der Mitte
  const feld = await fahre(page, [{ type: 'feld', at: [0, 0, 2], cell: 2, map: ['###', '#.#', '###'] }], [0, 0, 1], 3, [0, -0.6]);
  expect(feld.ev[0]).toBe('fall');
  // Schieber schiebt die stehende Murmel vom Weg
  const sch = await fahre(page, [weg, { type: 'schieber', from: [-3, 0, -3], to: [0.5, 0, -3], size: [2, 1.2, 2], time: 0.8, pause: 1 }], [0, 0, -3], 5);
  expect(sch.ev).toContain('fall');
});

test('Nagelwand: jede Murmel fällt hindurch, prallt an Nägeln ab und kommt unten an', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const parts = [
      { type: 'weg', from: [0, 14, 6], to: [0, 14, 0], width: 3, walls: 0.6, caps: 'start' },
      { type: 'nagelbrett', at: [0, 14, 0], breite: 10, hoehe: 14 },
      { type: 'weg', from: [-7, 0, -0.65], to: [7, 0, -0.65], width: 5, walls: 0.8, caps: 'both' }
    ];
    return SKINS.map(S => {
      const g = createGame(CANNON, { id: 't', start: [0, 14, 3], killY: -8, parts }, S.ball); g.reset();
      let hits = 0, unten = -1, xs = new Set();
      for (let i = 0; i < 60 * 15 && unten < 0; i++) {
        // oben bis über die Kante lenken (liegen lassen bremst sie sonst davor ab), dann nur noch fallen
        hits += g.step(0, g.ball.position.z > -0.2 && g.ball.position.y > 13 ? -0.5 : 0, 1 / 60).filter(e => e === 'hit').length;
        if (g.ball.position.y < 1.5) unten = i / 60;
      }
      return { id: S.id, hits, unten, x: +g.ball.position.x.toFixed(1) };
    });
  });
  for (const x of r) {
    expect(x.unten, x.id).toBeGreaterThan(0); // unten angekommen (klemmt nirgends)
    expect(x.hits, x.id).toBeGreaterThan(2);  // an Nägeln abgeprallt
  }
  expect(new Set(r.map(x => x.x)).size).toBeGreaterThan(3); // verschiedene Murmeln landen an verschiedenen Stellen
});

test('Bergab: Treppe runter, Fluss trägt und wäscht, Felsen rollen los', async ({ page }) => {
  await page.goto('/');
  const t = await fahre(page, [{ type: 'weg', from: [0, 4, 4], to: [0, 4, 0], width: 3 }, { type: 'treppe', from: [0, 4, 0], to: [0, 0, -10], steps: 6, width: 3 },
    { type: 'weg', from: [0, 0, -10], to: [0, 0, -20], width: 3, walls: 1, caps: 'end' }], [0, 4, 2], 7, [0, -0.3]);
  expect(t.p[1]).toBeLessThan(1);
  expect(t.p[2]).toBeLessThan(-10);
  const f = await fahre(page, [{ type: 'fluss', from: [0, 0, 2], to: [0, -2, -20], width: 3, speed: 3 }, { type: 'weg', from: [0, -2.7, -20], to: [0, -2.7, -30], width: 3, walls: 1, caps: 'end' }],
    [0, 0.5, 0], 8, [0, 0], 'g.dirt = 1; g.dirty = true;');
  expect(f.p[2]).toBeLessThan(-18); // ohne Steuern flussabwärts getragen
  expect(f.dirt).toBe(0);
  const r = await fahre(page, [{ type: 'weg', from: [0, 4, 10], to: [0, 0, -10], width: 3 }, { type: 'felsen', from: [0, 4, 8], every: 3 }], [20, 0, 0], 4);
  expect(r.ev.filter(e => e === 'rumpel').length).toBe(2);
});

test('Bergab zieht es: Rampe beschleunigt kräftig, Bremshilfe nur in der Ebene, Fluss bremst schnelle Murmel nicht', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const tempo = (parts, start, sek, brake = 0, v0 = 0) => {
      const g = createGame(CANNON, { id: 't', start, killY: -50, parts }); g.reset(); g.brake = brake;
      g.ball.velocity.set(0, 0, -v0); g.ball.angularVelocity.set(-v0 / 0.5, 0, 0);
      for (let i = 0; i < sek * 60; i++) g.step(0, 0, 1 / 60);
      const v = g.ball.velocity; return Math.hypot(v.x, v.y, v.z);
    };
    const tan = d => Math.tan(d * Math.PI / 180);
    const rampe = [{ type: 'weg', from: [0, tan(10) * 100, 0], to: [0, 0, -100], width: 4 }], rStart = [0, tan(10) * 98, -2];
    const eben = [{ type: 'weg', from: [0, 0, 0], to: [0, 0, -100], width: 4 }];
    const fluss = [{ type: 'fluss', from: [0, tan(15) * 100, 0], to: [0, 0, -100], width: 3.6, speed: 4 }];
    return {
      rampe: tempo(rampe, rStart, 3), rampeBremse: tempo(rampe, rStart, 3, 1.5),
      eben: tempo(eben, [0, 0, -2], 2, 0, 3), ebenBremse: tempo(eben, [0, 0, -2], 2, 1.5, 3),
      fluss: tempo(fluss, [0, tan(15) * 98 - 0.7, -2], 4)
    };
  });
  // 10°-Rampe, 3 s: rollende Kugel ohne Verluste wäre 5/7 * g * sin(10°) * 3 s = 3.65 m/s
  expect(r.rampe).toBeGreaterThan(3.2);
  expect(Math.abs(r.rampeBremse - r.rampe)).toBeLessThan(0.01); // Bremshilfe bremst bergab nicht
  expect(r.ebenBremse).toBeLessThan(r.eben - 0.5); // in der Ebene bremst sie weiter
  expect(r.fluss).toBeGreaterThan(5); // steiler Fluss: schneller als die Strömung (4 m/s)
});

test('Bremsen: langsam bleibt die Murmel bald stehen, schnell behält sie Schwung, leichtes Gefälle rollt', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const tan = d => Math.tan(d * Math.PI / 180);
    const lauf = (parts, start, v0, sek, input = [0, 0]) => {
      const g = createGame(CANNON, { id: 't', start, killY: -50, parts }); g.reset();
      for (let i = 0; i < 30; i++) g.step(0, 0, 1 / 60);
      g.ball.velocity.set(0, 0, -v0); g.ball.angularVelocity.set(-v0 / 0.5, 0, 0);
      let t = 0, stand = null;
      while (t < sek) { g.step(input[0], input[1], 1 / 60); t += 1 / 60; if (stand === null && g.ball.velocity.length() < 0.05) stand = t; }
      return { v: g.ball.velocity.length(), stand };
    };
    const eben = [{ type: 'weg', from: [0, 0, 5], to: [0, 0, -300], width: 6 }];
    return {
      langsam: lauf(eben, [0, 0, 0], 3, 6).stand,                   // Kippen, keine Eingabe
      schnell: lauf(eben, [0, 0, 0], 10, 2, [0.0, -0.3]).v,          // leicht weiter kippen: Luftwiderstand, kein Rollwiderstand
      gefaelle: lauf([{ type: 'weg', from: [0, tan(3) * 105, 5], to: [0, 0, -100], width: 6 }], [0, tan(3) * 100, 0], 0, 3).v
    };
  });
  expect(r.langsam).not.toBeNull();
  expect(r.langsam).toBeLessThan(4);   // früher erst nach ~19 s
  expect(r.schnell).toBeGreaterThan(9); // Schwung bleibt
  expect(r.gefaelle).toBeGreaterThan(0.5); // 3° Gefälle: rollt von selbst los
});

test('Fluss: leichte Murmeln schwimmen oben, schwere rollen am Grund, alle kommen durch', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const dy = Math.tan(5 * Math.PI / 180) * 30;
    const parts = [{ type: 'fluss', from: [0, dy, 0], to: [0, 0, -30], width: 3.6, speed: 4 }, { type: 'weg', from: [0, -0.7, -30], to: [0, -0.7, -60], width: 3.6, walls: 1 }];
    const out = {};
    for (const id of ['pingpong', 'fussball', 'standard', 'gold']) {
      const g = createGame(CANNON, { id: 't', start: [0, dy - 0.7, -1], killY: -20, parts }, SKINS.find(s => s.id === id).ball); g.reset();
      let t = 0, hoehe = 0, n = 0, durch = null;
      while (t < 15) {
        g.step(0, 0, 1 / 60); t += 1 / 60;
        const p = g.ball.position;
        if (t > 1.5 && t < 3) { hoehe += p.y - dy * (1 + p.z / 30); n++; } // Mitte über der Wasseroberfläche
        if (durch === null && p.z < -30) durch = t;
      }
      out[id] = { hoehe: hoehe / n, durch };
    }
    return out;
  });
  for (const id of ['pingpong', 'fussball']) expect(r[id].hoehe, id).toBeGreaterThan(0.2);   // schwimmt oben
  for (const id of ['standard', 'gold']) expect(r[id].hoehe, id).toBeLessThan(-0.15);        // liegt am Grund (0.7 m tief)
  for (const id in r) expect(r[id].durch, id).not.toBeNull();                                 // alle treibt es hinaus
});

test('Lavabo: Bälle springen auf der Keramik, kreisen und fallen erst unten durchs Loch in den Abfluss', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const parts = [
      { type: 'schuessel', at: [0, 0, 0], r: 1.5, R: 4.5, h: 2, rim: 1, art: 'lavabo', abfluss: true },
      { type: 'roehre', from: [0, 0, 0], down: true, to: [0, -6, -14], toYaw: 0 },
      { type: 'weg', from: [0, -6, -14], to: [0, -6, -30], width: 4, walls: 0.8, caps: 'end' }
    ];
    const out = {};
    // wie von der Schanze: schräg von oben mitten ins Becken, und seitlich mit Schwung hinein
    for (const [fall, p0, v0] of [['schanze', [0, 3.5, 6], [0, 2, -6]], ['seitlich', [3, 3, 0], [0, 0, -4]]]) for (const id of ['standard', 'pingpong', 'golf']) {
      const g = createGame(CANNON, { id: 't', start: [0, 0, 20], killY: -30, parts }, SKINS.find(s => s.id === id).ball); g.reset();
      g.ball.position.set(...p0); g.ball.velocity.set(...v0);
      let t = 0, spruenge = 0, lastVy = 0, gurgel = null, winkel = 0, la = null, gelandet = null;
      while (t < 12 && gurgel === null) {
        const ev = g.step(0, 0, 1 / 60); t += 1 / 60;
        const p = g.ball.position, v = g.ball.velocity;
        if (gelandet === null && g.touchBody) gelandet = t;
        if (lastVy < -1 && v.y > 0.5) spruenge++;
        lastVy = v.y;
        const a = Math.atan2(p.z, p.x); if (la !== null && Math.hypot(p.x, p.z) > 0.8) winkel += Math.atan2(Math.sin(a - la), Math.cos(a - la)); la = a;
        if (ev.includes('gurgel')) gurgel = t;
      }
      out[fall + ' ' + id] = { spruenge, gurgel, gelandet, runden: Math.abs(winkel) / 2 / Math.PI };
    }
    return out;
  });
  for (const k in r) expect(r[k].gurgel, k).not.toBeNull();                 // alle fallen durchs Loch ...
  for (const k in r) expect(r[k].gurgel, k).toBeLessThan(8);                // ... nach ein paar Sekunden
  // nichts wird in der Luft geschluckt: vor dem Hineinfallen berührt die Murmel das Becken (Standard trifft von der Schanze
  // direkt das Loch und fällt über die Lochwand hinein, die anderen springen und kreisen zuerst)
  for (const k in r) expect(r[k].gelandet, k).toBeLessThan(r[k].gurgel);
  expect(r['schanze pingpong'].spruenge).toBeGreaterThan(2);                // Pingpong springt auf der Keramik herum
  expect(r['schanze pingpong'].spruenge).toBeGreaterThan(r['schanze golf'].spruenge);
  for (const id of ['standard', 'golf']) expect(r['seitlich ' + id].runden, id).toBeGreaterThan(0.5); // kreist hinunter
});

test('Abfluss: echtes Loch und Rohr, die Murmel rollt ohne Klemmen hindurch und kommt unten mit Schwung heraus', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    const parts = [
      { type: 'schuessel', at: [0, 0, 0], r: 1.5, R: 4.5, h: 2, rim: 1, art: 'lavabo', abfluss: true },
      { type: 'roehre', from: [0, 0, 0], down: true, to: [0, -6, -14], toYaw: 0 },
      { type: 'weg', from: [0, -6, -14], to: [0, -6, -40], width: 4, walls: 0.8, caps: 'end' }
    ];
    const out = {};
    // schräg von der Schanze, seitlich (kreist ins Loch), knapp neben dem Loch fallen lassen, langsam an den Lochrand rollen
    const faelle = [['schanze', [0, 3.5, 6], [0, 2, -6]], ['seitlich', [3, 3, 0], [0, 0, -4]], ['mitte', [0.3, 1, 0], [0, 0, 0]], ['rand', [1.5, 0.6, 0], [-0.3, 0, 0]]];
    for (const [fall, p0, v0] of faelle) for (const id of ['pingpong', 'standard', 'golf', 'bowling']) {
      const g = createGame(CANNON, { id: 't', start: [0, 0, 20], killY: -30, parts }, SKINS.find(s => s.id === id).ball); g.reset();
      g.ball.position.set(...p0); g.ball.velocity.set(...v0);
      let t = 0, gurgel = null, plopp = null, vAus = null, still = 0, klemmt = false, minV = 99;
      while (t < 20 && plopp === null) {
        const ev = g.step(0, 0, 1 / 60); t += 1 / 60;
        const v = g.ball.velocity, sp = Math.hypot(v.x, v.y, v.z);
        if (ev.includes('gurgel')) gurgel = t;
        if (gurgel !== null && t > gurgel + 0.5) minV = Math.min(minV, sp);
        if (ev.includes('plopp')) { plopp = t; vAus = Math.hypot(v.x, v.z); }
        still = sp < 0.05 ? still + 1 / 60 : 0;
        if (still > 1) klemmt = true; // eine Sekunde still: liegt am Lochrand oder klemmt im Rohr
      }
      out[fall + ' ' + id] = { gurgel, rohr: plopp && plopp - gurgel, vAus, klemmt, minV, z: g.ball.position.z };
    }
    return out;
  });
  for (const k in r) {
    expect(r[k].klemmt, k).toBe(false);         // bleibt nirgends liegen, weder am Lochrand noch im Rohr
    expect(r[k].rohr, k).not.toBeNull();        // kommt unten heraus
    expect(r[k].rohr, k).toBeLessThan(4.5);     // gemessen 2.8 bis 3.5 s (Rohr 16.6 m lang, 5 m hinunter)
    expect(r[k].vAus, k).toBeGreaterThan(4);    // gemessen 5.0 bis 6.5 m/s
    expect(r[k].vAus, k).toBeLessThan(8);
    expect(r[k].minV, k).toBeGreaterThan(1.5);  // holpert nicht bis fast zum Stillstand (gemessen mindestens 2.8 m/s)
  }
});

test('Kugelbahn: Trichter lässt kreisen und fällt unten hinaus, Halfpipe schaukelt, Rutsche hält in der Kurve', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const mk = parts => { const g = createGame(CANNON, { id: 't', start: [0, 0, 50], killY: -30, parts }); g.reset(); return g; };
    // Trichter: schräg nach innen auf den Rand
    const tr = mk([{ type: 'trichter', at: [0, 0, 0], R: 6, h: 3.5, loch: 0.9, rim: 1.2 }, { type: 'weg', from: [0, -4, 4], to: [0, -4, -10], width: 6, walls: 1, caps: 'both' }]);
    const a = 25 * Math.PI / 180, vx = -5 * Math.cos(a), vz = -5 * Math.sin(a);
    tr.ball.position.set(0, 4.1, 6.6); tr.ball.velocity.set(vx, 0, vz); tr.ball.angularVelocity.set(vz / 0.5, 0, -vx / 0.5);
    let t = 0, w = 0, la = null, durch = null;
    while (t < 20 && durch === null) {
      tr.step(0, 0, 1 / 60); t += 1 / 60; const p = tr.ball.position, an = Math.atan2(p.z, p.x);
      if (la !== null) w += Math.atan2(Math.sin(an - la), Math.cos(an - la)); la = an;
      if (p.y < -1) durch = t;
    }
    // Halfpipe: auf halber Höhe der Wand rollend loslassen
    const hp = mk([{ type: 'rinne', from: [0, 0, 5], to: [0, 0, -40], r: 4, bogen: 80 }]);
    hp.ball.position.set(0, 0.5, -10); hp.ball.velocity.set(6, 0, 0); hp.ball.angularVelocity.set(0, 0, -12);
    const um = []; let dir = 1, maxY = 0;
    for (let i = 0; i < 60 * 16; i++) { hp.step(0, 0, 1 / 60); const d = Math.sign(hp.ball.velocity.x); if (d && d !== dir) { um.push(hp.ball.position.y); dir = d; } maxY = Math.max(maxY, hp.ball.position.y); }
    // Rutsche: 180°-Kurve abwärts mit viel Schwung
    const ru = mk([{ type: 'weg', from: [0, 6, 10], to: [0, 6, 0], width: 3 }, { type: 'rinne', at: [0, 6, 0], yaw: 0, turn: 180, radius: 6, rise: -4, r: 1.6, bogen: 75 },
      { type: 'weg', from: [12, 2, 0], to: [12, 2, 20], width: 4, walls: 1, caps: 'end' }]);
    ru.ball.position.set(0, 6.5, 3); ru.ball.velocity.set(0, 0, -12); ru.ball.angularVelocity.set(24, 0, 0);
    let unten = null; t = 0;
    while (t < 10 && unten === null) { ru.step(0, 0, 1 / 60); t += 1 / 60; const p = ru.ball.position; if (p.y < 0) break; if (p.x > 10 && p.z > 1) unten = t; }
    return { runden: Math.abs(w) / 2 / Math.PI, durch, um, maxY, halfpipeY: hp.ball.position.y, unten };
  });
  expect(r.durch).not.toBeNull();            // fällt durchs Loch
  expect(r.runden).toBeGreaterThan(1);       // vorher kreist sie
  expect(r.um.length).toBeGreaterThan(4);    // schaukelt von Wand zu Wand
  for (let i = 1; i < r.um.length; i++) expect(r.um[i]).toBeLessThan(r.um[i - 1] + 0.05); // schaukelt sich nicht auf
  expect(r.maxY).toBeLessThan(4);            // bleibt in der Halfpipe (Rand bei 3.3 m)
  expect(r.halfpipeY).toBeGreaterThan(0);
  expect(r.unten).not.toBeNull();            // Rutsche: kommt unten an, fliegt nicht aus der Kurve
});

test('Echte Dinge: durch die Pfanne, Herdplatte hüpft, Abfluss im Lavabo, Sprenger und Schlauch', async ({ page }) => {
  await page.goto('/');
  // Pfanne: über den Rand hinein, vorne durch die Lücke hinaus
  const pf = await fahre(page, [{ type: 'weg', from: [0, 0, 6], to: [0, 0, -4], width: 4, walls: 0.8, caps: 'start' }, { type: 'weg', from: [0, 0, -4], to: [0, 1, -6.8], width: 2.6 },
    { type: 'schuessel', at: [0, 0, -12], r: 3, R: 5, h: 1, rim: 0.4, art: 'pfanne', offen: [0] }, { type: 'weg', from: [0, 0, -14], to: [0, 0, -30], width: 2.6, walls: 0.8, caps: 'end' }], [0, 0, 2], 8, [0, -0.6]);
  expect(pf.ev).not.toContain('fall');
  expect(pf.p[2]).toBeLessThan(-18);
  // Herdplatte: Murmel hüpft
  const hp = await fahre(page, [{ type: 'weg', from: [0, 0, 4], to: [0, 0, -8], width: 5 }, { type: 'herdplatte', at: [0, 0, -2] }], [0, 0, -2], 2);
  expect(hp.ev.filter(e => e === 'zisch').length).toBeGreaterThan(1);
  // Lavabo mit Abfluss: Murmel rollt in die Mitte, fällt durchs Loch, rollt durchs Rohr und kommt unten heraus
  const lv = await fahre(page, [{ type: 'schuessel', at: [0, 0, 0], r: 1.5, R: 3.5, h: 1.5, rim: 1.5, art: 'lavabo', abfluss: true, aussen: false },
    { type: 'roehre', from: [0, 0, 0], down: true, to: [0, -6, -12], toYaw: 0 }, { type: 'weg', from: [0, -6, -12], to: [0, -6, -30], width: 4, walls: 0.8, caps: 'end' }], [2, 0.5, 0], 6);
  expect(lv.ev.filter(e => e === 'gurgel' || e === 'plopp')).toEqual(['gurgel', 'plopp']);
  expect(lv.p[1]).toBeLessThan(-5);
  expect(lv.p[2]).toBeLessThan(-13); // aus dem Rohr heraus weitergerollt
  // Rasensprenger schiebt die Murmel weg, Schlauch wäscht
  const sp = await fahre(page, [{ type: 'weg', from: [0, 0, 10], to: [0, 0, -10], width: 20 }, { type: 'sprenger', at: [0, 0, 0], length: 8, speed: 90 }], [2.5, 0, 0], 4);
  expect(Math.hypot(sp.p[0], sp.p[2])).toBeGreaterThan(4);
  const sl = await fahre(page, [{ type: 'weg', from: [0, 0, 10], to: [0, 0, -10], width: 20 }, { type: 'wind', at: [0, 0, 0], size: [4, 3, 4], yaw: -90, strength: 6, look: 'schlauch' }], [0, 0, 0], 1.5, [0, 0], 'g.dirt = 1; g.dirty = true;');
  expect(sl.p[0]).toBeGreaterThan(1);
  expect(sl.dirt).toBeLessThan(0.1);
});

test('Badezimmer: Schiffchen-Trampolin trifft mit jeder Murmel, ins Badewasser fallen, Wasserstrahl wäscht, Toilette spült', async ({ page }) => {
  await page.goto('/');
  const bad = [{ type: 'wanne', at: [0, -2, -10], size: [6, 22] },
    { type: 'schiff', at: [0, -2, -3], size: [4, 5], trampolin: { vorne: 1.5, ziel: [0, -1.5, -13], time: 1 } }, { type: 'schiff', at: [0, -2, -13], size: [4, 5] }];
  // Trampolin auf dem Schiff: Flug wird für die Schwerkraft jeder Murmel ausgerechnet, sie landet auf dem nächsten Schiff
  const r = await page.evaluate(async parts => {
    const { createGame } = await import('/src/game.js');
    const { SKINS } = await import('/src/skins.js');
    return SKINS.map(S => {
      const g = createGame(CANNON, { id: 't', start: [0, -0.5, -4.5], killY: -8, parts }, S.ball); g.reset();
      const ev = [];
      for (let i = 0; i < 60 * 3; i++) ev.push(...g.step(0, 0, 1 / 60).filter(e => e !== 'hit'));
      return { id: S.id, ev, z: g.ball.position.z, y: g.ball.position.y };
    });
  }, bad);
  for (const x of r) {
    expect(x.ev, x.id).toEqual(['jump']);
    expect(Math.abs(x.z + 13), x.id).toBeLessThan(2.5);
    expect(x.y, x.id).toBeGreaterThan(-2);
  }
  // neben die Schiffchen ins Wasser: spritzt, zurück zum Start
  const nass = await fahre(page, bad, [2.2, 0, -8], 1.5);
  expect(nass.ev.slice(0, 2)).toEqual(['spritz', 'fall']);
  // Wasserstrahl aus dem Hahn wäscht die dreckige Murmel beim Durchrollen
  const strahl = await fahre(page, [{ type: 'weg', from: [0, 0, 4], to: [0, 0, -12], width: 3, walls: 0.5, caps: 'end' }, { type: 'strahl', at: [0, 3, -3], unten: 0, hahn: true }],
    [0, 0, 2], 3, [0, -0.5], 'g.dirt = 1; g.dirty = true;');
  expect(strahl.ev).toEqual(expect.arrayContaining(['spritz', 'sauber']));
  expect(strahl.dirt).toBe(0);
  // Toilette: in die Schüssel fallen, durchs Loch hinunter ins Rohr = Ziel, dann wird gespült
  const klo = await fahre(page, [{ type: 'klo', at: [0, 0, 0] }, { type: 'ziel', at: [0, -2, 0] }], [1, 3, 0], 3);
  expect(klo.ev).toEqual(['win', 'spuel']);
  expect(klo.p[1]).toBeLessThan(-2.5); // liegt unten im Rohr
  const kloRand = await fahre(page, [{ type: 'klo', at: [0, 0, 0] }, { type: 'ziel', at: [0, -2, 0] }], [2.5, 3, 0], 0.8);
  expect(kloRand.ev).toEqual([]); // in der Schüssel ist man noch nicht im Ziel
  // Fynns Badezimmer: im Matsch dreckig, im Wasserstrahl am Lavabo wieder sauber, dann Abfluss, Schiffchen, Toilette
  const lv = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const { autopilot, mainRoute, ROUTES } = await import('/tests/autopilot.js');
    const g = createGame(CANNON, LEVELS.find(l => l.id === 'b1'));
    const run = autopilot(g, mainRoute(ROUTES.b1));
    return { won: run.won, peak: g.dirtPeak, ev: run.log.map(x => x.split('@')[0]).filter(e => /platsch|sauber|gurgel|plopp|win/.test(e)) };
  });
  expect(lv.won).toBe(true);
  expect(lv.peak).toBe(1);
  expect(lv.ev).toEqual(['platsch', 'sauber', 'gurgel', 'plopp', 'win']);
});

test('Runterfallen setzt am Checkpoint wieder ein', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const g = createGame(CANNON, LEVELS[0]); g.reset();
    for (let i = 0; i < 60 * 20 && g.st.cp < 0; i++) g.step(0, -1, 1 / 60);
    g.spawn([20, 1, -28]); // neben die Bahn setzen
    let fell = false;
    for (let i = 0; i < 60 * 10 && !fell; i++) fell = g.step(0, 0, 1 / 60).includes('fall');
    const p = g.ball.position;
    return { fell, cp: g.st.cp, pos: [p.x, p.y, p.z] };
  });
  expect(r.fell).toBe(true);
  expect(r.cp).toBe(0);
  expect(r.pos).toEqual([0, 2.5, -28]);
});

test('Kippen: Kennlinie der drei Stärken', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { POWERS, tiltToInput } = await import('/src/input.js');
    return POWERS.map(p => ({ id: p.id, v: [0.5, 1, 5, 10, p.full, 30, -10].map(d => +tiltToInput(d, p).toFixed(3)) }));
  });
  // [0.5°, 1°, 5°, 10°, voll, 30°, -10°]
  expect(r).toEqual([
    { id: 'sanft', v: [0, 0, 0.167, 0.444, 1, 1, -0.444] },
    { id: 'normal', v: [0, 0, 0.267, 0.6, 1, 1, -0.6] },
    { id: 'extrem', v: [0, 0, 0.364, 0.818, 1, 1, -0.818] }
  ]);
});

test('Stärke und Ton umschalten, wird gespeichert', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Test');
  await expect(page.locator('#btnPower')).toHaveText('🐇');
  await page.click('#btnPower');
  await expect(page.locator('#btnPower')).toHaveText('🚀');
  await page.click('.lvl[data-level="sz1"]');
  expect(await page.evaluate(() => +(window.murmel.game.tilt * 180 / Math.PI).toFixed(1))).toBe(55);
  await page.click('#btnHome');
  await expect(page.locator('#btnSound')).toHaveText('🔊');
  await page.click('#btnSound');
  await expect(page.locator('#btnSound')).toHaveText('🎵❌');
  await page.click('#btnSound');
  await expect(page.locator('#btnSound')).toHaveText('🔇');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('murmel-abenteuer-v2')));
  expect(saved.power).toBe('extrem');
  expect(saved.sound).toBe('aus');
  await page.reload();
  await page.click('#startJoy');
  await expect(page.locator('#btnPower')).toHaveText('🚀');
  await expect(page.locator('#btnSound')).toHaveText('🔇');
  expect(errors).toEqual([]);
});

test('Alle Klänge sind hörbar und übersteuern nicht (offline gerendert)', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createAudio } = await import('/src/audio.js');
    const peak = buf => { let m = 0; const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) m = Math.max(m, Math.abs(d[i])); return m; };
    const render = async (fn, secs = 2.5) => {
      const ctx = new OfflineAudioContext(1, 44100 * secs, 44100), a = createAudio({ ctx });
      fn(a); const buf = await ctx.startRendering(); a.music(null); return +peak(buf).toFixed(3);
    };
    const out = {};
    for (const n of ['tap', 'start', 'star', 'bonus', 'jump', 'fall', 'cp', 'turbo', 'click', 'bridge', 'win', 'unlock', 'roehre', 'plopp', 'wind', 'magnet', 'laden', 'boom', 'tock', 'jubel', 'platsch', 'sauber', 'klapp', 'quetsch', 'rumpel', 'zisch', 'spritz', 'gurgel', 'spuel']) out[n] = await render(a => a.sfx(n));
    out.hitLeise = await render(a => a.sfx('hit', 0.1));
    out.hitStark = await render(a => a.sfx('hit', 1));
    out.rollen = await render(a => a.roll(6, true, 'normal'), 1);
    out.rollenEis = await render(a => a.roll(6, true, 'eis'), 1);
    out.rollenPfuetze = await render(a => a.roll(6, true, 'pfuetze'), 1);
    out.rollenLuft = await render(a => a.roll(6, false, 'normal'), 1);
    out.aus = await render(a => { a.setMode('aus'); a.sfx('win'); });
    for (const song of ['karte', 'standard', 'spielzimmer', 'garten', 'kueche', 'weltraum', 'unterwasser', 'vulkan', 'badezimmer']) out['musik_' + song] = await render(a => a.music(song), 1);
    out.musikOhne = await render(a => { a.setMode('ohneMusik'); a.music('standard'); }, 1);
    return out;
  });
  for (const n of ['tap', 'start', 'star', 'bonus', 'jump', 'fall', 'cp', 'turbo', 'click', 'bridge', 'win', 'unlock', 'roehre', 'plopp', 'wind', 'magnet', 'laden', 'boom', 'tock', 'jubel', 'platsch', 'sauber', 'klapp', 'quetsch', 'rumpel', 'zisch', 'spritz', 'gurgel', 'spuel', 'hitStark', 'rollen', 'rollenEis', 'rollenPfuetze', 'musik_karte', 'musik_standard', 'musik_spielzimmer', 'musik_garten', 'musik_kueche', 'musik_weltraum', 'musik_unterwasser', 'musik_vulkan', 'musik_badezimmer']) {
    expect(r[n], n).toBeGreaterThan(0.02);
    expect(r[n], n).toBeLessThan(1);
  }
  expect(r.hitLeise).toBeLessThan(r.hitStark);
  expect(r.rollenLuft).toBeLessThan(0.01);
  expect(r.aus).toBeLessThan(0.01);
  expect(r.musikOhne).toBeLessThan(0.01);
});

// Rollwinkel der Kamera (0 = Horizont gerade)
const camRoll = page => page.evaluate(() => {
  const c = window.murmel.view.camera, x = new THREE.Vector3(1, 0, 0).applyQuaternion(c.quaternion);
  return Math.asin(Math.max(-1, Math.min(1, x.y))) * 180 / Math.PI;
});

test('Joystick: Welt bleibt gerade, Kugel bremst beim Loslassen', async ({ page }) => {
  await play(page, 'sz1');
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(600);
  expect(Math.abs(await camRoll(page))).toBeLessThan(0.5);
  await page.keyboard.up('ArrowRight');
  expect(await page.evaluate(() => window.murmel.game.brake)).toBe(1.5);
});

test('Kippen: Welt kippt sichtbar mit, keine Bremshilfe', async ({ page }) => {
  await play(page, 'sz1');
  await page.evaluate(() => {
    const inp = window.murmel.input; inp.useJoy();
    // Kipp-Modus simulieren: Sensorwerte senden
    window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta: 0, gamma: 0 }));
  });
  await page.evaluate(() => window.murmel.input.useTilt());
  const ori = (beta, gamma) => page.evaluate(([b, g]) => window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta: b, gamma: g })), [beta, gamma]);
  await ori(0, 0);   // erster Wert = Nulllage (Kalibrierung)
  await ori(0, 12);  // 12° nach rechts
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.murmel.input.mode)).toBe('tilt');
  expect(await camRoll(page)).toBeGreaterThan(3);   // rechts gekippt = sichtbare Schräglage
  expect(await page.evaluate(() => window.murmel.game.brake)).toBe(0);
});

test('Steuerung wechseln: im Spiel und auf der Karte, wird gespeichert', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page, 'sz1');
  await expect(page.locator('#btnControl')).toHaveText('🕹️');
  // Kippen-Modus: Sensor liefert Werte
  await page.evaluate(() => window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta: 0, gamma: 0 })));
  await page.tap('#btnControl');
  await expect(page.locator('#btnControl')).toHaveText('📱');
  expect(await page.evaluate(() => window.murmel.input.mode)).toBe('tilt');
  await expect(page.locator('#joy')).toBeHidden();
  await expect(page.locator('#btnCal')).toBeVisible();
  expect(await page.evaluate(() => window.murmel.game.brake)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('murmel-abenteuer-v2')).control)).toBe('tilt');
  // zurück zum Joystick, mitten im Spiel
  await page.tap('#btnControl');
  await expect(page.locator('#btnControl')).toHaveText('🕹️');
  await expect(page.locator('#joy')).not.toHaveClass(/hidden/);
  await expect(page.locator('#btnCal')).toBeHidden();
  // auf der Karte: Joystick bleibt unsichtbar, Knopf zeigt den Modus
  await page.tap('#btnHome');
  await expect(page.locator('#mapControl')).toHaveText('🕹️');
  await page.click('#mapControl');
  await expect(page.locator('#mapControl')).toHaveText('📱');
  await expect(page.locator('#joy')).toBeHidden();
  expect(errors).toEqual([]);
});

test('Karte im Querformat: oberste Knöpfe und letzte Welt erreichbar', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Quer');
  await expect(page.locator('#btnSound')).toBeInViewport();
  await page.locator('.lvl[data-level="v1"]').scrollIntoViewIfNeeded(); // Profi-Welt ganz unten
  await expect(page.locator('.lvl[data-level="v1"]')).toBeInViewport();
  await page.click('.lvl[data-level="u1"]'); // erste Level jeder Welt sind offen
  await expect(page.locator('#hud')).toBeVisible();
});

test('Schwere Versionen: 💀-Reihe, offen nach dem normalen Level, Sticker 💀', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page, 'ausflug');
  await page.click('#btnHome');
  await expect(page.locator('.world.hard .lvl[data-level="ausflugs"]')).toBeDisabled();
  await expect(page.locator('.lvl[data-level="ausflugs"]')).toContainText('💀1');
  await page.click('.lvl[data-level="ausflug"]');
  await winLevel(page, 5);
  await page.click('#cheerOv').catch(() => {});
  await page.click('#mapBtn');
  await expect(page.locator('.lvl[data-level="ausflugs"]')).toBeEnabled();
  await page.click('.lvl[data-level="ausflugs"]');
  await expect(page.locator('#hud')).toBeVisible();
  await winLevel(page, 7);
  expect((await saved(page)).stickers['profi:uebung']).toBe(true);
  expect(errors).toEqual([]);
});

test('Profi-Welt Vulkan ist erst ab genug Sternen offen', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Profi');
  const need = await page.evaluate(() => window.murmel.WORLDS.find(w => w.id === 'vulkan').need);
  await expect(page.locator('.lvl[data-level="v1"]')).toBeDisabled();
  await expect(page.locator('.lvl[data-level="v1"]')).toContainText(`${need}⭐`);
  // ein Stern zu wenig: noch zu; genug: offen, v2 erst nach v1
  const setStars = n => page.evaluate(n => {
    const { progress, LEVELS, showMap } = window.murmel;
    let left = n;
    for (const lv of LEVELS) { const k = Math.min(left, lv.parts.filter(p => p.type === 'stern').length); if (k) progress.finish(lv.id, k); left -= k; }
    showMap();
  }, n);
  await setStars(need - 1);
  await expect(page.locator('.lvl[data-level="v1"]')).toBeDisabled();
  await setStars(need);
  await expect(page.locator('.lvl[data-level="v1"]')).toBeEnabled();
  await expect(page.locator('.lvl[data-level="v2"]')).toBeDisabled();
  await page.click('.lvl[data-level="v1"]');
  await expect(page.locator('#hud')).toBeVisible();
  expect(errors).toEqual([]);
});

// ---------- Belohnungen: Sticker, Spuren, Jubel ----------
// Spielstand des aktuellen Spielers
const saved = page => page.evaluate(() => { const d = JSON.parse(localStorage.getItem('murmel-abenteuer-v2')); return d.players.find(p => p.id === d.current); });
// Level gewinnen: Sterne setzen (optional Bonusstern), dann ins Ziel
async function winLevel(page, stars, bonus = false) {
  await page.evaluate(([n, b]) => {
    const g = window.murmel.game; g.st.stars = n;
    if (b) g.els.find(e => e.type === 'stern' && e.bonus).got = true;
    const goal = g.els.find(e => e.type === 'ziel');
    g.spawn([goal.at[0], goal.at[1] + 1, goal.at[2]]);
  }, [stars, bonus]);
  await expect(page.locator('#winOv')).toBeVisible();
}

test('Sticker werden vergeben, gespeichert und im Album gezeigt; Jubel erscheint', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page, 'ausflug');
  await winLevel(page, 5);
  await expect(page.locator('#cheerOv')).toBeVisible();
  await expect(page.locator('#cheerOv .items')).toContainText('⚽');  // neue Murmel
  await expect(page.locator('#cheerOv .items')).toContainText('🏆');  // Welt komplett
  const st = (await saved(page)).stickers;
  expect(Object.keys(st).sort()).toEqual(['lvl:ausflug', 'sterne:ausflug', 'welt:uebung', 'x:murmel', 'x:spur'].sort());
  await page.click('#cheerOv');                                        // Antippen schliesst
  await expect(page.locator('#cheerOv')).toBeHidden();

  // Level im Spielzimmer mit Bonusstern, aber nicht allen Sternen
  await page.click('#mapBtn');
  await page.click('.lvl[data-level="sz1"]');
  await winLevel(page, 3, true);
  const st2 = (await saved(page)).stickers;
  expect(st2['bonus:sz1']).toBe(true);
  expect(st2['sterne:sz1']).toBeUndefined();
  expect(st2['welt:spielzimmer']).toBeUndefined();

  // nach Neuladen im Album sichtbar
  await page.reload();
  await page.click('#startJoy');
  await page.click('#btnAlbum');
  await expect(page.locator('#albumOv')).toBeVisible();
  const total = await page.evaluate(() => window.murmel.ALBUM.all.length);
  await expect(page.locator('#albumCount')).toHaveText(`🏅 7/${total}`);
  await expect(page.locator('.sticker[data-sticker="lvl:ausflug"]')).toHaveClass(/got/);
  await expect(page.locator('.sticker[data-sticker="welt:uebung"]')).toHaveClass(/got/);
  await page.click('.tab[data-page="spielzimmer"]');
  await expect(page.locator('.sticker[data-sticker="bonus:sz1"]')).toHaveClass(/got/);
  await expect(page.locator('.sticker[data-sticker="sterne:sz1"]')).not.toHaveClass(/got/);
  await expect(page.locator('.sticker[data-sticker="sterne:sz1"]')).toContainText('🔒');
  await page.click('#albumBack');
  await expect(page.locator('#mapOv')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Alter Spielstand ohne Sticker: verdiente Sticker werden nachgetragen, Sticker pro Spieler', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('murmel-abenteuer-v2'))
      localStorage.setItem('murmel-abenteuer-v1', JSON.stringify({ done: { ausflug: true, sz1: true }, best: { ausflug: 2, sz1: 6 }, skin: 'standard' }));
  });
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Alt');
  const st = (await saved(page)).stickers;
  expect(Object.keys(st).sort()).toEqual(['bonus:sz1', 'lvl:ausflug', 'lvl:sz1', 'sterne:sz1', 'welt:uebung', 'x:murmel', 'x:spur'].sort());
  await expect(page.locator('#cheerOv')).toBeHidden(); // kein Jubel beim Nachtragen
  // zweiter Spieler hat ein leeres Album
  await page.click('#btnPlayer');
  await newPlayer(page, 'Neu');
  expect((await saved(page)).stickers).toEqual({});
  await page.click('#btnAlbum');
  await expect(page.locator('.sticker.got')).toHaveCount(0);
});

test('Spur auswählbar, gespeichert und sichtbar hinter der Murmel', async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => {
    if (!localStorage.getItem('murmel-abenteuer-v2'))
      localStorage.setItem('murmel-abenteuer-v1', JSON.stringify({ done: { ausflug: true }, best: { ausflug: 5 } }));
  });
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Spur');
  await page.click('#btnSkins');
  await expect(page.locator('.skin[data-trail="keine"]')).toHaveClass(/sel/);
  await expect(page.locator('.skin[data-trail="funken"]')).toBeEnabled();   // 3 Sterne
  await expect(page.locator('.skin[data-trail="blasen"]')).toBeEnabled();   // 3 Sticker
  await expect(page.locator('.skin[data-trail="sterne"]')).toBeDisabled();  // 12 Sterne
  await expect(page.locator('.skin[data-trail="sterne"]')).toContainText('12⭐');
  await page.click('.skin[data-trail="funken"]');
  await expect(page.locator('.skin[data-trail="funken"]')).toHaveClass(/sel/);
  expect((await saved(page)).trail).toBe('funken');
  await page.reload();
  await page.click('#startJoy');
  await page.click('.lvl[data-level="ausflug"]');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1200);
  const n = await page.evaluate(() => window.murmel.view.trailFx.count);
  await page.keyboard.up('ArrowUp');
  expect(n).toBeGreaterThan(3);
  // Spur-Teilchen sind ein einziges InstancedMesh (keine neuen Meshes pro Bild). Konfetti (0.2 x 0.3) nicht mitzählen:
  // rollt die Murmel in der Zeit über einen Stern, kommt es dazu oder verschwindet
  const count = () => page.evaluate(() => {
    let k = 0;
    window.murmel.view.scene.traverse(o => { const p = o.geometry && o.geometry.parameters; if (!(p && p.width === 0.2 && p.height === 0.3)) k++; });
    return k;
  });
  const meshes = await count();
  await page.waitForTimeout(500);
  expect(await count()).toBe(meshes);
  expect(errors).toEqual([]);
});

test('Alle Spuren laufen ohne Fehler', async ({ page }) => {
  const errors = watchErrors(page);
  await play(page, 'ausflug');
  for (const id of ['funken', 'blasen', 'sterne', 'regenbogen', 'herzen', 'feuer', 'keine']) {
    await page.evaluate(id => window.murmel.view.setTrail(window.murmel.TRAILS.find(t => t.id === id)), id);
    await page.evaluate(() => { const b = window.murmel.game.ball; b.velocity.set(0, 0, -6); });
    await page.waitForTimeout(250);
  }
  expect(await page.evaluate(() => window.murmel.view.trailFx.count)).toBe(0);
  expect(errors).toEqual([]);
});

// Online-Rangliste (#9): Supabase-Anfragen auf page.route umleiten. Auf localhost ist die Rangliste sonst aus.
// server.down = true: Server antwortet mit 503 (pausiert oder weg), server.hang = true: gar nicht; calls sammelt die Anfragen je Funktion.
async function fakeSupabase(page, rows = [], ghosts = {}) {
  const server = { down: false, calls: { submit_run: [], get_ranking: [], get_ghost: [] }, rows };
  await page.addInitScript(() => localStorage.setItem('murmel-online', 'an'));
  await page.route('https://qnxkkwiflepmhokkeslx.supabase.co/**', async route => {
    const req = route.request(), fn = new URL(req.url()).pathname.split('/').pop(), body = JSON.parse(req.postData() || '{}');
    expect(req.headers().apikey).toMatch(/^sb_publishable_/);
    if (server.hang) return; // keine Antwort: online.js bricht nach 3 s ab
    if (server.down) return route.fulfill({ status: 503, body: '' });
    server.calls[fn].push(body);
    const json = data => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
    if (fn === 'get_ranking') return json(server.rows);
    if (fn === 'get_ghost') return json(ghosts[body.p_name + '/' + body.p_level] ?? null);
    const b = body;
    server.rows = server.rows.filter(r => !(r.name.toLowerCase() === b.p_name.toLowerCase() && r.level === b.p_level));
    server.rows.push({ name: b.p_name, level: b.p_level, stars: b.p_stars, total: b.p_total, seconds: b.p_seconds, falls: b.p_falls, power: b.p_power, score: b.p_score, ghost: !!b.p_ghost });
    return json(true);
  });
  return server;
}
const online = (name, level, stars, total, seconds, falls, ghost = false) => ({ name, level, stars, total, seconds, falls, power: 'normal', score: 0, ghost });

test('Online-Rangliste: Rekord mit Aufnahme senden, Welt- und Level-Rangliste, gegen Online-Geist fahren', async ({ page }) => {
  const errors = watchErrors(page);
  // ausflug: Max 1000 + 750 + 200 = 1950, Zoe 800 + 750 + 300 = 1850 (mit Aufnahme); sz1: Max 1000 + 750 + 300 = 2050
  const track = { t: 3, skin: 'fussball', p: [0, 100, 0, 0, 100, -500, 0, 100, -1000] }; // Zentimeter
  const server = await fakeSupabase(page,
    [online('Max', 'ausflug', 5, 5, 1, 1), online('Zoe', 'ausflug', 4, 5, 1, 0, true), online('Max', 'sz1', 6, 6, 1, 0)],
    { 'Zoe/ausflug': track });
  await play(page, 'ausflug');
  expect(server.calls.get_ranking.length).toBeGreaterThan(0); // beim Öffnen der Karte geholt
  await page.evaluate(() => { const g = window.murmel.game; g.st.stars = 5; g.spawn([0, 5, -69]); });
  await expect(page.locator('#winOv')).toBeVisible();
  // Rekord gesendet: Rohwerte, Punkte und die Aufnahme der Fahrt
  await expect.poll(() => server.calls.submit_run.length).toBe(1);
  const sent = server.calls.submit_run[0];
  expect(sent).toMatchObject({ p_name: 'Test', p_level: 'ausflug', p_stars: 5, p_total: 5, p_falls: 0, p_power: 'normal', p_score: 2050 });
  expect(sent.p_seconds).toBeGreaterThan(0);
  expect(sent.p_ghost.skin).toBe('standard');
  expect(sent.p_ghost.p.length % 3).toBe(0);
  expect(sent.p_ghost.p.length).toBeGreaterThan(0);
  // Level-Rangliste mit den Online-Fahrten (Punkte aus den Rohwerten neu gerechnet), Geist des besten anderen mit Aufnahme
  await expect(page.locator('#winRank')).toHaveText('🥇 Test 🏆2050 🐇\n🥈 Max 🏆1950 🐇\n🥉 Zoe 🏆1850 🐇');
  await expect(page.locator('#winGhost')).toHaveText('👻 🥉 Zoe');
  await page.click('#cheerOv').catch(() => {});
  await page.click('#winGhost');
  await expect(page.locator('#winOv')).toBeHidden();
  expect(server.calls.get_ghost).toEqual([{ p_name: 'Zoe', p_level: 'ausflug' }]);
  expect(await page.evaluate(() => window.murmel.running)).toBe(true);
  await page.waitForFunction(() => window.murmel.game.time > 0.5);
  expect(await page.evaluate(() => window.murmel.view.ghost.position.z)).toBeLessThan(-9); // Zoes Aufnahme, nicht die eigene
  // Weltrangliste in der Spieler-Auswahl: Summe über alle Level
  await page.click('#btnHome');
  await page.click('#btnPlayer');
  await expect(page.locator('#worldRank')).toHaveText('🌍\n🥇 Max 🏆4000\n🥈 Test 🏆2050\n🥉 Zoe 🏆1850');
  expect(errors).toEqual([]);
});

test('Online-Rangliste ohne Server: Spiel läuft, Rekord wartet und geht beim nächsten Start raus', async ({ page }) => {
  const errors = watchErrors(page);
  const server = await fakeSupabase(page);
  server.down = true;
  await play(page, 'ausflug');
  await page.evaluate(() => { const g = window.murmel.game; g.st.stars = 3; g.spawn([0, 5, -69]); });
  await expect(page.locator('#winOv')).toBeVisible();
  await expect(page.locator('#winScore')).toHaveText('🏆 1650');
  await expect(page.locator('#winGhost')).toBeHidden();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('murmel-online-v1')).queue['test\nausflug'].run.score)).toBe(1650);
  // Server antwortet gar nicht: nach dem Timeout geht es ohne Fehler weiter, der Rekord wartet weiter
  server.down = false; server.hang = true;
  expect(await page.evaluate(() => window.murmel.online.sync())).toBe(false);
  expect(await page.evaluate(() => window.murmel.online.pending())).toBe(1);
  // Server wieder da: beim nächsten Start (Karte) wird nachgesendet, die Warteschlange ist leer
  server.hang = false;
  await page.reload();
  await page.click('#startJoy');
  await expect.poll(() => server.calls.submit_run.length).toBe(1);
  expect(server.calls.submit_run[0]).toMatchObject({ p_name: 'Test', p_level: 'ausflug', p_stars: 3, p_score: 1650 });
  await expect.poll(() => page.evaluate(() => window.murmel.online.pending())).toBe(0);
  // Anfragen an den Server schlagen fehl (503, beim Neuladen abgebrochen), sonst keine Fehler
  expect(errors.filter(e => !e.includes('supabase.co') && !e.includes('503'))).toEqual([]);
});

test('Punkte: Sterne, Zeit gegen Richtzeit, Abstürze; Rangliste aus Zeilen', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { score, ranking } = await import('/src/score.js');
    const { RICHTZEIT } = await import('/src/levels/richtzeiten.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const run = (stars, time, falls, level = 'sz1') => score({ level, stars, total: 6, time, falls });
    const rows = [
      { name: 'Anna', level: 'sz1', score: 100, power: 'normal' }, { name: 'anna', level: 'sz1', score: 300, power: 'extrem' },
      { name: 'Anna', level: 'k1', score: 50, power: 'normal' }, { name: 'Ben', level: 'sz1', score: 200, power: 'sanft' }
    ];
    return {
      par: RICHTZEIT.sz1, missing: LEVELS.filter(l => !(RICHTZEIT[l.id] > 0)).map(l => l.id),
      pts: [run(6, 25, 1), run(6, 40, 0), run(4, 20, 0), run(6, 5, 0), run(6, 0, 0), run(0, 43.8, 5), run(3, 10, 0, 'unbekannt')],
      total: ranking(rows), sz1: ranking(rows, 'sz1')
    };
  });
  expect(r.missing).toEqual([]); // jedes Level hat eine Richtzeit (node tests/richtzeiten.mjs)
  expect(r.par).toBe(21.9);
  // 1000 + 438 + 200 | 1000 + 273.75 + 300 | 666.7 + 547.5 + 300 | 2050 = Maximum | Zeit 0 | 250 + 0 | ohne Richtzeit kein Zeitbonus
  expect(r.pts).toEqual([1638, 1574, 1514, 2050, 2050, 250, 800]);
  // pro Name (ohne Gross/Klein) und Level die beste Zeile; Stärke nur in der Level-Rangliste
  expect(r.total).toEqual([{ name: 'anna', score: 350 }, { name: 'Ben', score: 200 }]);
  expect(r.sz1).toEqual([{ name: 'anna', score: 300, power: 'extrem' }, { name: 'Ben', score: 200, power: 'sanft' }]);
});

test('Zeit messen: Aufnahme, Geistermurmel und Zeitformat', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createRecorder, ghostAt, formatTime, DT } = await import('/src/ghost.js');
    const rec = createRecorder();
    for (let t = 0; t <= 1.0001; t += 1 / 60) rec.add(t, { x: t * 2, y: 0.5, z: -t * 4 }); // 2 m/s nach rechts, 4 m/s vorwärts
    const tr = rec.track(1, 'standard');
    return { n: rec.length, dt: DT, mid: ghostAt(tr, 0.55), end: ghostAt(tr, 5), fmt: [0, 9.99, 12.34, 62.3, 125].map(formatTime) };
  });
  expect(r.n).toBe(11); // 0.0 .. 1.0 s alle 0.1 s
  expect(r.mid.map(v => +v.toFixed(2))).toEqual([1.1, 0.5, -2.2]);
  expect(r.end.map(v => +v.toFixed(2))).toEqual([2, 0.5, -4]); // bleibt am Ende stehen
  expect(r.fmt).toEqual(['0.0', '9.9', '12.3', '1:02.3', '2:05.0']);
});

test('Bestzeit: Zeit im HUD, Geistermurmel fährt mit, Sticker 👻 wenn schneller', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/?autopilot');
  await page.click('#startJoy');
  await newPlayer(page, 'Flitzer');
  await page.click('.lvl[data-level="ausflug"]');
  await expect(page.locator('#timer')).toHaveText(/⏱ \d+\.\d/);
  expect(await page.evaluate(() => window.murmel.view.ghost)).toBeNull(); // noch keine Bestzeit
  await expect(page.locator('#winOv')).toBeVisible({ timeout: 50_000 });
  const t1 = await page.evaluate(() => window.murmel.progress.bestTime('ausflug'));
  expect(t1).toBeGreaterThan(5);
  await expect(page.locator('#winTime')).toHaveText(/^⏱ \d+\.\d$/);
  expect((await saved(page)).stickers['x:geist']).toBeUndefined();
  await page.click('#cheerOv').catch(() => {});
  // nochmal: der Geist fährt die Bestzeit mit
  await page.click('#againBtn');
  await page.waitForFunction(() => window.murmel.game.time > 2);
  const g = await page.evaluate(() => { const m = window.murmel, p = m.view.ghost.position; return { z: p.z, t: m.game.time, opacity: m.view.ghost.material.opacity }; });
  expect(g.z).toBeLessThan(-1); // ist schon losgerollt
  expect(g.opacity).toBeLessThan(1);
  // schneller ins Ziel: neue Bestzeit, Geist-Sticker
  await winLevel(page, 5);
  await expect(page.locator('#winTime')).toContainText('🏁 Bestzeit!');
  const t2 = await page.evaluate(() => window.murmel.progress.bestTime('ausflug'));
  expect(t2).toBeLessThan(t1);
  expect((await saved(page)).stickers['x:geist']).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('murmel-geist-v1'))[JSON.parse(localStorage.getItem('murmel-abenteuer-v2')).current].ausflug.t)).toBe(t2);
  expect(errors).toEqual([]);
});

test('Ohne localStorage: gewinnen, Sticker, Album und Spur funktionieren', async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('gesperrt'); } });
  });
  await play(page, 'ausflug');
  await winLevel(page, 5);
  await expect(page.locator('#cheerOv')).toBeVisible();
  await page.click('#cheerOv');
  await page.click('#mapBtn');
  await page.click('#btnAlbum');
  await expect(page.locator('.sticker[data-sticker="lvl:ausflug"]')).toHaveClass(/got/);
  await page.click('#albumBack');
  await page.click('#btnSkins');
  await page.click('.skin[data-trail="funken"]');
  await expect(page.locator('.skin[data-trail="funken"]')).toHaveClass(/sel/);
  expect(errors).toEqual([]);
});
