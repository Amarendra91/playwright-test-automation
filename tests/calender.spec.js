const { test, expect } = require('@playwright/test');

test('Calender validation', async ({ browser }) => {
  const expectedMonthNumber = '8';
  const expectedDate = '15';
  const expectedyear = '2030';

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
  await page.getByRole('button').last().click();
  await page.locator('button.react-calendar__navigation__label').click();
  await page.locator('button.react-calendar__navigation__label').click();
  const yearsData = page.locator('button.react-calendar__tile');

  for (let i = 0; i < (await yearsData.count()); i++) {
    const actualYear = await page
      .locator('button.react-calendar__tile')
      .nth(i)
      .textContent();
    if (actualYear === expectedyear) {
      await page.locator('button.react-calendar__tile').nth(i).click();
      break;
    }
  }
  await page
    .locator('button.react-calendar__year-view__months__month')
    .nth(Number(expectedMonthNumber) - 1)
    .click();

  await page.locator('//abbr[text()="' + expectedDate + '"]').click();
});
