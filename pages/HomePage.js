class HomePage {
    constructor(page) {
        this.page = page;
        this.globalNav = page.locator('#leftPanel'); // change as required
    }

    async isGlobalNavVisible() {
        return this.globalNav.isVisible();
    }

    async goToOpenNewAccount() {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.click('a[href*="openaccount.htm"]')
        ]);
    }
}

export default { HomePage };
