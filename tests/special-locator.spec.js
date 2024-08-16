const { test, expect } = require('@playwright/test');

test('Playwright special locators', async ({ browser }) => {
  const monthNumber = '6';
  const date = '15';
  const year = '1999';

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/angularpractice/');
  await page.getByRole('textbox').first().fill('John Doe');
  await page.getByRole('textbox').nth(1).fill('Johndoe@gmail.com');
  await page.getByPlaceholder('Password').fill('abc123');
  await page.getByLabel('Check me out if you Love IceCreams!').check();
  await page.getByLabel('Gender').selectOption('Female');
  await page.getByLabel('Employed').check();
  await page.getByRole('button').click();
  await page
    .getByText('Success! The Form has been submitted successfully!.')
    .isVisible();
  await page.getByRole('link', { name: 'Shop' }).click();
  await page
    .locator('app-card')
    .filter({ hasText: 'Nokia Edge' })
    .getByRole('button')
    .click();
});
