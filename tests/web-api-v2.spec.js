import { test, expect, request } from '@playwright/test';
const { APIUtils } = require('./utils/APIUtils');

let response;
const loginPayLoad = {
  userEmail: 'amarendra867+test1@gmail.com',
  userPassword: 'Iamking@000',
};
let orderPayLoad = {
  orders: [{ country: 'India', productOrderedId: '6581ca399fd99c85e8ee7f45' }],
};

// test.describe('Login and Order product by API call and verify exact orderId from Order history page in UI')
test.beforeAll('Login and Create Order by API call', async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
}),
  test('Verify orderId created by API Call matches on UI', async ({ page }) => {
    page.addInitScript((value) => {
      window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForURL(
      'https://rahulshettyacademy.com/client/dashboard/dash'
    );
    // Verify order id present inside Order History section
    await page.locator('button[routerlink*="myorders"]').click();
    await page.locator('tbody').waitFor();
    const rows = page.locator('tbody tr');
    for (let i = 0; i < (await rows.count()); i++) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();
      if (response.orderId.includes(rowOrderId)) {
        await rows.nth(i).locator('button').first().click();
        break;
      }
    }
    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
  });
