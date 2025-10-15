class BillPaymentPage {
    constructor(page) {
        this.page = page;
    }

    async payBill(payee, accountNumber, amount) {
        await this.page.click('a[href*="billpay.htm"]');
        await this.page.fill('input[name="payee.name"]', payee.name);
        await this.page.fill('input[name="payee.address.street"]', payee.address || '');
        await this.page.fill('input[name="payee.city"]', payee.city || '');
        await this.page.fill('input[name="payee.state"]', payee.state || '');
        await this.page.fill('input[name="payee.zipCode"]', payee.zip || '');
        await this.page.fill('input[name="payee.phoneNumber"]', payee.phone || '');
        await this.page.fill('input[name="amount"]', amount.toString());
        await this.page.selectOption('select[name="fromAccountId"]', { label: accountNumber });
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.click('input[value="Send Payment"]')
        ]);
        // Ideally verify the success message
        await this.page.waitForSelector('text=Bill Payment Complete', { timeout: 15000 });
    }
}

export default { BillPaymentPage };
