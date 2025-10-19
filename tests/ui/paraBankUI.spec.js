const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('../../pages/RegistrationPage.js').default;
const { LoginPage } = require('../../pages/LoginPage.js');
const { HomePage } = require('../../pages/HomePage.js');
const { AccountPage } = require('../../pages/AccountPage.js');
const { BillPaymentPage } = require('../../pages/BillPaymentPage.js');
const { generateRandomUsername } = require('../../utils/dataGenerator.js');
const { CONFIG } = require('../../config/config.js');

test('E2E: Create user, login, open account, fund transfer & bill pay', async ({ page }) => {
    const username = generateRandomUsername();
    const password = CONFIG.defaultPassword;

    // 1. Navigate
    await page.goto(CONFIG.baseURL);

    // 2. Create user
    await page.click('a[href*="register"]');
    const registrationPage = new RegistrationPage(page);
    await registrationPage.registerNewUser({
        firstName: 'John',
        lastName: 'Doe',
        username,
        password
    });

    // 3. Login
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await expect(page.locator('#leftPanel')).toBeVisible();

    // 4. Verify navigation menu
    const homePage = new HomePage(page);
    expect(await homePage.isGlobalNavVisible()).toBeTruthy();

    // 5. Create savings account
    await homePage.goToOpenNewAccount();
    const accountPage = new AccountPage(page);
    const accountNumber = await accountPage.openSavingsAccount();
    console.log('Created account:', accountNumber);

    // 6. Validate account overview/balance (example)
    await page.click('a[href*="overview.htm"]'); // ensure overview open
    const balance = await accountPage.getAccountBalance(accountNumber);
    expect(balance).toBeTruthy();

    // 7. Transfer funds (this app's flow: fill transfer page)
    await page.click('a[href*="transfer.htm"]');
    await page.fill('input[name="amount"]', '100');
    await page.selectOption('select[name="fromAccountId"]', { label: accountNumber });
    // assume there is another account to transfer to: using same account for sample
    await page.selectOption('select[name="toAccountId"]', { index: 1 });
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.click('input[value="Transfer"]')
    ]);
    await expect(page.locator('text=Transfer Complete')).toBeVisible();

    // 8. Pay bill with the created account
    const billPaymentPage = new BillPaymentPage(page);
    await billPaymentPage.payBill({ name: 'ACME Corp' }, accountNumber, 50);
});
