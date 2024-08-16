const { test, expect } = require('@playwright/test');

test('Playwright test with Browser context', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator('#username');
  const password = page.locator('[type="password"]');
  const signIn = page.locator('#signInBtn');
  const cardTitles = page.locator('.card-body >> a');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  console.log(await page.title());
  await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');
  await userName.fill('rahulshetty');
  await password.fill('learning');
  await signIn.click();
  console.log(await page.locator('[style*="block"]').textContent());
  await expect(page.locator('[style*="block"]')).toContainText('Incorrect');
  await userName.fill('');
  await userName.fill('rahulshettyacademy');
  await signIn.click();
  // console.log(await cardTitles.first().textContent());
  // console.log(await cardTitles.nth(1).textContent());
  // console.log(await cardTitles.last().textContent());
  await cardTitles.last().waitFor();
  const allProductTitles = await cardTitles.allTextContents();
  console.log(allProductTitles);
});

test('UI Control', async ({ page }) => {
  const documentLink = page.locator('[href*="documents-request"]');
  const radioButton = page.locator('.radiotextsty');
  const dropdown = page.locator('select.form-control');
  const checkBox = page.locator('#terms');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  console.log(await page.title());
  await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');
  // console.log(await radioButton.last().isChecked());
  expect(await radioButton.last().isChecked()).toBeFalsy();
  await radioButton.last().click();
  await expect(radioButton.last()).toBeChecked();
  await page.locator('#okayBtn').click();
  await dropdown.selectOption('consult');
  expect(await checkBox.isChecked()).toBeFalsy();
  await checkBox.click();
  await expect(checkBox).toBeChecked();
  await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

test('Child window Handling', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const documentLink = page.locator('[href*="documents-request"]');
  const userName = page.locator('#username');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click(),
  ]);
  await expect(newPage.locator('.red')).toContainText(
    'Please email us at mentor@rahulshettyacademy.com with below template to receive response'
  );
  const text = await newPage.locator('.red').textContent();
  const fetchedUserId = text.split('@')[1].split(' ')[0];
  await userName.fill(fetchedUserId);
  console.log(fetchedUserId);
});

test('Playwright test with Page context', async ({ page }) => {
  const email = page.locator('#userEmail');
  const password = page.locator('#userPassword');
  const login = page.locator('#login');
  const cardTitles = page.locator('.card-body b');
  await page.goto('https://rahulshettyacademy.com/client');
  console.log(await page.title());
  await expect(page).toHaveTitle("Let's Shop");
  await email.fill('anshika@gmail.com');
  await password.fill('Iamking@000');
  await login.click();
  // await page.waitForLoadState('networkidle'); -- not recommended anymore
  await cardTitles.last().waitFor();
  const allProductTitles = await cardTitles.allTextContents();
  console.log(allProductTitles);
});
