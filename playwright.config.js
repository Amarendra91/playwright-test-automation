// @ts-check
const { devices } = require('@playwright/test');
const { trace } = require('console');

const config = {
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    screenshot: 'on',
    trace: 'retain-on-failure',
    headless: true,
  },
};

module.exports = config;
