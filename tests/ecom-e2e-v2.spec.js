import { test, expect } from '@playwright/test';

let webContext;

/* save log in state into session storage and inject to browser context for login state reuse */
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const email = 'amarendra867+test1@gmail.com';
  const password = 'Iamking@000';
  await page.goto('https://rahulshettyacademy.com/client');
  await expect(page).toHaveTitle("Let's Shop");
  await page.getByPlaceholder('email@example.com').fill(email);
  await page.getByPlaceholder('enter your passsword').fill(password);
  await page.getByText('Login').click();
  await page.waitForLoadState('networkidle');
  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('Client app Login, Order product & validate order summary', async () => {
  const page = await webContext.newPage();
  const products = page.locator('.card-body');
  const cardTitles = page.locator('.card-body b');
  const productName = 'ZARA COAT 3';
  const cvv = '432';
  const cardHolderName = 'John Doe';
  const couponCode = 'rahulshettyacademy';
  await page.goto('https://rahulshettyacademy.com/client');
  await cardTitles.last().waitFor();
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    // compare user should be able to find the expected product
    if ((await products.nth(i).locator('b').textContent()) === productName) {
      // add to cart
      await products.nth(i).locator('text= Add To Cart').click();
      break;
    }
  }
  await page.locator('[routerlink*="cart"]').click();
  await page.locator('div li').last().waitFor();
  expect(
    // sudo class selector example
    await page.locator("h3:has-text('ZARA COAT 3')").isVisible()
  ).toBeTruthy();
  await page.locator('text = Checkout').click();
  // Payment method section visibility
  await page.locator('.payment').waitFor();
  expect(await page.locator('.payment__type--cc').isVisible()).toBeTruthy();
  //Personal information(Credit card)code pending
  await page.locator('.small [type="text"]').first().fill(cvv);
  await page.locator('.field .txt').nth(2).fill(cardHolderName);
  await page.locator('.small [type="text"]').last().fill(couponCode);
  await page.locator('button[type="submit"]').click();
  await page.locator('p.ng-star-inserted').waitFor();
  await expect(page.locator('p.ng-star-inserted')).toHaveText(
    '* Coupon Applied'
  );

  // Shipping Information
  await expect(page.locator('.user__name [type="text"]').first()).toHaveText(
    'amarendra867+test1@gmail.com'
  );
  await page.locator('[placeholder*="Country"]').pressSequentially('ind');
  const dropdown = page.locator('.ta-results');
  await dropdown.waitFor();
  const options = await dropdown.locator('button').count();
  for (let i = 0; i < options; i++) {
    const text = await dropdown.locator('button').nth(i).textContent();

    if (text === ' India') {
      await dropdown.locator('button i.fa').nth(i).click();
      break;
    }
  }

  // Place Order
  await page.locator('.action__submit').click();
  await expect(page.locator('.hero-primary')).toHaveText(
    ' Thankyou for the order. '
  );
  const orderId = await page
    .locator('.em-spacer-1 .ng-star-inserted')
    .textContent();
  console.log(orderId);
  // Verify order id present inside Order History section
  await page.locator('button[routerlink*="myorders"]').click();
  await page.locator('tbody').waitFor();
  const rows = page.locator('tbody tr');
  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
});

test('Client app Login & print all product titles', async () => {
  const page = await webContext.newPage();
  const cardTitles = page.locator('.card-body b');
  await page.goto('https://rahulshettyacademy.com/client');
  await cardTitles.last().waitFor();
  let titles = await cardTitles.allTextContents();
  console.log(titles);
});
