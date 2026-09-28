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

// Start -> Joystick -> Karte -> Level wählen
async function play(page, levelId = 'ausflug') {
  await page.goto('/');
  await page.waitForFunction(() => window.murmel && window.murmel.game);
  await page.click('#startJoy');
  await expect(page.locator('#mapOv')).toBeVisible();
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
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('murmel-abenteuer-v1')).skin)).toBe('fussball');
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

test('Alle Level sind schaffbar, alle Sterne erreichbar (Autopilot)', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = watchErrors(page);
  await page.goto('/');
  const res = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const { autopilot, ROUTES } = await import('/tests/autopilot.js');
    return LEVELS.map(L => { const r = autopilot(createGame(CANNON, L), ROUTES[L.id], 120); return { id: L.id, won: r.won, stars: r.stars, total: r.starTotal, falls: r.falls }; });
  });
  for (const r of res) {
    expect(r.won, r.id).toBe(true);
    expect(r.falls, r.id).toBe(0);
    if (r.id !== 'ausflug') expect(r.stars, r.id).toBe(r.total);
  }
  expect(errors).toEqual([]);
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
