// App-Symbole aus icons/icon.svg zeichnen (mit dem Chromium von Playwright): node icons/mache-icons.mjs
// - icon-192.png, icon-512.png: fürs Manifest (manifest.json)
// - icon-maskable-512.png: Android schneidet rund oder eckig aus, darum der Inhalt (<g id="inhalt">) auf 80 % verkleinert
// - apple-touch-icon.png (180): Home-Bildschirm auf iPhone und iPad
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const svg = readFileSync(dir + 'icon.svg', 'utf8');
const maskable = svg.replace('<g id="inhalt">', '<g id="inhalt" transform="translate(51.2 51.2) scale(.8)">');
const out = [['icon-192.png', 192, svg], ['icon-512.png', 512, svg], ['icon-maskable-512.png', 512, maskable], ['apple-touch-icon.png', 180, svg]];

// ohne Playwright-Chromium: ICON_BROWSER=msedge oder chrome (installierter Browser)
const browser = await chromium.launch(process.env.ICON_BROWSER ? { channel: process.env.ICON_BROWSER } : {});
for (const [name, size, s] of out) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${s}`);
  await page.screenshot({ path: dir + name, omitBackground: false });
  await page.close();
  console.log(name, size);
}
await browser.close();
