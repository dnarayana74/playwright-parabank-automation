const { test, expect } = require('@playwright/test');
const { findTransactionByAmount } = require('../../utils/apiHelper.js');

test('API: find transactions by amount', async ({ request }) => {
    const customerId = '12345'; // Replace with dynamic value from UI or config
    const amount = 50;

    const result = await findTransactionByAmount(request, customerId, amount);

    console.log('API result:', result);
    expect(result).toBeTruthy();
});
