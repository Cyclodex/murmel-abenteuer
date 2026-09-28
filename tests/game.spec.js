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

test('Spiel startet und die Murmel rollt mit der Pfeiltaste', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => window.murmel && window.murmel.game);
  await expect(page.locator('#startOv')).toBeVisible();
  await page.click('#startJoy');
  await expect(page.locator('#startOv')).toBeHidden();
  expect(await page.evaluate(() => window.murmel.running)).toBe(true);

  const z0 = await page.evaluate(() => window.murmel.game.ball.position.z);
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1500);
  await page.keyboard.up('ArrowUp');
  const p = await page.evaluate(() => { const b = window.murmel.game.ball.position; return { y: b.y, z: b.z }; });
  expect(p.z).toBeLessThan(z0 - 1);   // nach vorne gerollt
  expect(p.y).toBeGreaterThan(0);     // nicht runtergefallen
  await expect(page.locator('#stars')).toHaveText(/⭐ \d\/5/);
  expect(errors).toEqual([]);
});

test('Buttons oben rechts sind antippbar', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.click('#startJoy');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1000);
  await page.keyboard.up('ArrowUp');
  // Normaler Klick (ohne force): scheitert, wenn ein anderes Element den Button verdeckt
  await page.tap('#btnReset');
  const z = await page.evaluate(() => window.murmel.game.ball.position.z);
  expect(z).toBeCloseTo(2, 0); // wieder am Start
  // Kalibrieren-Button (nur im Kippen-Modus sichtbar)
  await page.evaluate(() => document.getElementById('btnCal').classList.remove('hidden'));
  await page.tap('#btnCal');
  await expect(page.locator('#toast')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Level 1 ist schaffbar (Simulation: immer geradeaus)', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  const r = await page.evaluate(async () => {
    const { createGame } = await import('/src/game.js');
    const { LEVELS } = await import('/src/levels/index.js');
    const g = createGame(CANNON, LEVELS[0]); g.reset();
    const all = [];
    for (let i = 0; i < 60 * 40 && !g.st.won; i++) all.push(...g.step(0, -1, 1 / 60));
    return { won: g.st.won, stars: g.st.stars, cp: g.st.cp, events: all };
  });
  expect(r.won).toBe(true);
  expect(r.cp).toBe(1);
  expect(r.events).toContain('jump');
  expect(r.stars).toBeGreaterThanOrEqual(4);
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
  expect(r.pos).toEqual([0, 2.5, -28]); // Checkpoint 1 + 1 m
});
