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

const fakeNoOrderPayload = {
  data: [],
  message: 'No Orders',
};

test.beforeAll('Login and Create Order by API call', async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
}),
  test('Verify no order message displayed in UI by altering network response traffic.', async ({
    page,
  }) => {
    page.addInitScript((value) => {
      window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForURL(
      'https://rahulshettyacademy.com/client/dashboard/dash'
    );

    await page.route(
      'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
      async (route) => {
        /*Intercept response*/
        const actualResponse = await page.request.fetch(route.request());
        let body = JSON.stringify(fakeNoOrderPayload);
        route.fulfill({
          actualResponse,
          body,
        });
      }
    );

    await page.locator('button[routerlink*="myorders"]').click();
    await page.waitForResponse(
      'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*'
    );

    const actualText = await page.locator('.mt-4').textContent();
    expect(
      actualText.includes('You have No Orders to show at this time.')
    ).toBeTruthy();
  });
