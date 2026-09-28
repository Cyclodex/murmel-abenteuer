import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  use: { baseURL: 'http://localhost:8123/', viewport: { width: 390, height: 844 }, hasTouch: true },
  webServer: { command: 'node tests/server.js 8123', url: 'http://localhost:8123/', reuseExistingServer: true }
});
