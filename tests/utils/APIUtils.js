import { test, expect, request } from '@playwright/test';

class APIUtils {
  constructor(apiContext, loginPayLoad) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }
  async loginToken() {
    /*Login API*/
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      {
        data: this.loginPayLoad,
      }
    );
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    let token = loginResponseJson.token;
    return token;
  }

  async createOrder(orderPayLoad) {
    let response = {};
    response.token = await this.loginToken();
    /*Create order API*/
    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayLoad,
        headers: {
          Authorization: response.token,
          'Content-Type': 'application/json',
        },
      }
    );
    expect(orderResponse.ok()).toBeTruthy();
    const orderResponseJson = await orderResponse.json();
    let orderId = orderResponseJson.orders[0];
    console.log(orderId);
    response.orderId = orderId;
    return response;
  }
}

module.exports = { APIUtils };
