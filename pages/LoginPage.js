class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async login(username, password) {
        await this.page.fill('input[name="username"]', username);
        await this.page.fill('input[name="password"]', password);
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.click('input[value="Log In"]')
        ]);
    }
}

module.exports = { LoginPage };
