import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  
  use: {
  baseURL: 'https://automationexercise.com',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
   },
   reporter: 'html',

   projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
   ],
});