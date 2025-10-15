class AccountPage {
    constructor(page) {
        this.page = page;
    }

    async openSavingsAccount() {
        await this.page.selectOption('#type', '1'); // '1' may be savings - adjust if needed
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.click('input[value="Open New Account"]')
        ]);
        // account number shown in link or text
        const accountLink = this.page.locator('a.accountId');
        await accountLink.waitFor({ state: 'visible', timeout: 15000 });
        const accountNumber = await accountLink.innerText();
        return accountNumber.trim();
    }

    async getAccountBalance(accountNumber) {
        // Navigate to accounts overview and find balance by account number
        await this.page.click('a[href*="overview.htm"]');
        const balance = await this.page.locator(`tr:has-text("${accountNumber}") >> td.balance`).innerText();
        return balance;
    }
}

export default { AccountPage };
