import { test, expect, request } from '@playwright/test';

const loginPayLoad = {
  userEmail: 'amarendra867+test1@gmail.com',
  userPassword: 'Iamking@000',
};
const orderPayLoad = {
  orders: [{ country: 'India', productOrderedId: '6581ca399fd99c85e8ee7f45' }],
};

let token;
let orderId;

// test.describe('Login and Order product by API call, verify order history from UI')
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  // Login API
  const loginResponse = await apiContext.post(
    'https://rahulshettyacademy.com/api/ecom/auth/login',
    {
      data: loginPayLoad,
    }
  );
  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseJson = await loginResponse.json();
  token = loginResponseJson.token;

  // Create order API
  const orderResponse = await apiContext.post(
    'https://rahulshettyacademy.com/api/ecom/order/create-order',
    {
      data: orderPayLoad,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }
  );
  expect(orderResponse.ok()).toBeTruthy();
  const orderResponseJson = await orderResponse.json();
  orderId = orderResponseJson.orders[0];
  console.log(orderId);
}),
  test('Verify orderId from Order History Page in UI', async ({ page }) => {
    page.addInitScript((value) => {
      window.localStorage.setItem('token', value);
    }, token);
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
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator('button').first().click();
        break;
      }
    }
    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  });
