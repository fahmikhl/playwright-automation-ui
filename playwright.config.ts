import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { storageStatePath } from './src/utils/authFiles';

dotenv.config();

const proxyServer = process.env.PLAYWRIGHT_PROXY;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://demoqa.com',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    proxy: proxyServer ? { server: proxyServer } : undefined,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      // Anonymous (logged-out) flows: book store, search, pagination, login.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /profile\.spec\.ts/,
    },
    {
      // Authenticated flows reuse the API-generated session via storageState.
      name: 'chromium-auth',
      use: { ...devices['Desktop Chrome'], storageState: storageStatePath },
      dependencies: ['setup'],
      testMatch: /profile\.spec\.ts/,
    },
  ],
});
