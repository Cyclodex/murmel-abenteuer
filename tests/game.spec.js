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
  const x0 = (await ballPos(page)).x;
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1500);
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

test('Mehrere Spieler: eigener Spielstand, Rangliste nach Sternen', async ({ page }) => {
  const errors = watchErrors(page);
  const win = async (id, stars, spot) => {
    await page.click(`.lvl[data-level="${id}"]`);
    await page.evaluate(([n, p]) => { const g = window.murmel.game; g.st.stars = n; g.spawn(p); }, [stars, spot]);
    await expect(page.locator('#winOv')).toBeVisible();
  };
  await page.goto('/');
  await page.click('#startJoy');
  await page.click('#playerForm button');               // leerer Name: nichts passiert
  await expect(page.locator('#playerOv')).toBeVisible();
  await newPlayer(page, '  Anna  ');
  await expect(page.locator('#btnPlayer')).toHaveText('👤 Anna');
  await win('ausflug', 3, [0, 5, -69]);
  await expect(page.locator('#winRank')).toBeHidden();  // nur ein Spieler
  await page.click('#mapBtn');
  // zweiter Spieler startet bei null
  await page.click('#btnPlayer');
  await newPlayer(page, '<b>Ben</b>');
  await expect(page.locator('#btnPlayer')).toHaveText('👤 <b>Ben</b>'); // Name als Text, nicht als HTML
  await expect(page.locator('#mapStars')).toHaveText('⭐ 0');
  await expect(page.locator('.lvl[data-level="ausflug"]')).not.toHaveClass(/done/);
  await win('ausflug', 5, [0, 5, -69]);
  await expect(page.locator('#winRank')).toHaveText('🥇 <b>Ben</b> ⭐5\n🥈 Anna ⭐3');
  // nach Neuladen: Ben ist noch dran, Rangliste in der Auswahl
  await page.reload();
  await page.click('#startJoy');
  await expect(page.locator('#btnPlayer')).toHaveText('👤 <b>Ben</b>');
  await page.click('#btnPlayer');
  await expect(page.locator('.player')).toHaveText(['🥇 <b>Ben</b> ⭐5', '🥈 Anna ⭐3']);
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

test('Alle Level sind mit jeder Stärke schaffbar, alle Sterne erreichbar (Autopilot)', async ({ page }) => {
  test.setTimeout(600_000);
  const errors = watchErrors(page);
  await page.goto('/');
  const res = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const { checkLevel, ROUTES } = await import('/tests/autopilot.js');
    const { POWERS } = await import('/src/input.js');
    const out = [];
    for (const P of POWERS) for (const L of LEVELS) {
      const r = checkLevel(() => { const g = createGame(CANNON, L); g.tilt = P.tilt * Math.PI / 180; return g; }, ROUTES[L.id]);
      out.push({ id: L.id + ' ' + P.emoji, ...r });
    }
    return { out, n: LEVELS.length * POWERS.length };
  }).then(x => { expect(x.out.length).toBe(x.n); return x.out; });
  for (const r of res) {
    expect(r.won, r.id).toBe(true);
    expect(r.falls, r.id).toBe(0);
    if (!r.id.startsWith('ausflug')) expect(r.stars, r.id).toBe(r.total);
  }
  expect(errors).toEqual([]);
});

test('Jede Murmel schafft alle Level (Autopilot, Stärke normal)', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto('/');
  const res = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const { checkLevel, ROUTES } = await import('/tests/autopilot.js');
    const { SKINS } = await import('/src/skins.js');
    const out = [];
    for (const S of SKINS) for (const L of LEVELS) {
      const r = checkLevel(() => createGame(CANNON, L, S.ball), ROUTES[L.id]);
      out.push({ id: L.id + ' ' + S.id, ...r });
    }
    return out;
  });
  for (const r of res) {
    expect(r.won, r.id).toBe(true);
    expect(r.falls, r.id).toBe(0);
    if (!r.id.startsWith('ausflug')) expect(r.stars, r.id).toBe(r.total);
  }
});

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
  for (const id of ['standard', 'fussball', 'flummi', 'tennis', 'basketball']) expect(r[id].x, id).toBeLessThan(1);
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
    for (const n of ['tap', 'start', 'star', 'bonus', 'jump', 'fall', 'cp', 'turbo', 'click', 'bridge', 'win', 'unlock', 'roehre', 'plopp', 'wind', 'magnet', 'laden', 'boom', 'tock', 'jubel']) out[n] = await render(a => a.sfx(n));
    out.hitLeise = await render(a => a.sfx('hit', 0.1));
    out.hitStark = await render(a => a.sfx('hit', 1));
    out.rollen = await render(a => a.roll(6, true, 'normal'), 1);
    out.rollenEis = await render(a => a.roll(6, true, 'eis'), 1);
    out.rollenLuft = await render(a => a.roll(6, false, 'normal'), 1);
    out.aus = await render(a => { a.setMode('aus'); a.sfx('win'); });
    for (const song of ['karte', 'standard', 'spielzimmer', 'garten', 'kueche', 'weltraum', 'unterwasser']) out['musik_' + song] = await render(a => a.music(song), 1);
    out.musikOhne = await render(a => { a.setMode('ohneMusik'); a.music('standard'); }, 1);
    return out;
  });
  for (const n of ['tap', 'start', 'star', 'bonus', 'jump', 'fall', 'cp', 'turbo', 'click', 'bridge', 'win', 'unlock', 'roehre', 'plopp', 'wind', 'magnet', 'laden', 'boom', 'tock', 'jubel', 'hitStark', 'rollen', 'rollenEis', 'musik_karte', 'musik_standard', 'musik_spielzimmer', 'musik_garten', 'musik_kueche', 'musik_weltraum', 'musik_unterwasser']) {
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

test('Karte im Querformat: oberste Knöpfe und letzte Welt erreichbar', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await page.click('#startJoy');
  await newPlayer(page, 'Quer');
  await expect(page.locator('#btnSound')).toBeInViewport();
  await page.click('.lvl[data-level="u1"]'); // erste Level jeder Welt sind offen
  await expect(page.locator('#hud')).toBeVisible();
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
  await expect(page.locator('#albumCount')).toHaveText(`📒 7/${total}`);
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
  // Spur-Teilchen sind ein einziges InstancedMesh (keine neuen Meshes pro Bild)
  const meshes = await page.evaluate(() => { let k = 0; window.murmel.view.scene.traverse(() => k++); return k; });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => { let k = 0; window.murmel.view.scene.traverse(() => k++); return k; })).toBe(meshes);
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
