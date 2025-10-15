class RegistrationPage {
    constructor(page) {
        this.page = page;
    }

    async registerNewUser(user) {
        await this.page.fill('#customer\\.firstName', user.firstName);
        await this.page.fill('#customer\\.lastName', user.lastName);
        await this.page.fill('#customer\\.address\\.street', user.address || '123 Elm St');
        await this.page.fill('#customer\\.address\\.city', user.city || 'New York');
        await this.page.fill('#customer\\.address\\.state', user.state || 'NY');
        await this.page.fill('#customer\\.address\\.zipCode', user.zip || '10001');
        await this.page.fill('#customer\\.phoneNumber', user.phone || '1234567890');
        await this.page.fill('#customer\\.ssn', user.ssn || '111-22-3333');
        await this.page.fill('#customer\\.username', user.username);
        await this.page.fill('#customer\\.password', user.password);
        await this.page.fill('#repeatedPassword', user.password);

        // Click register and wait for confirmation
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.click('input[value="Register"]')
        ]);

        // Confirm registration success message
        const successMessage = this.page.locator('text=Your account was created successfully');
        if (await successMessage.count() > 0) {
            console.log('Registration success message found');
            await successMessage.waitFor({ state: 'visible', timeout: 5000 });
        }

        // Detect direct redirect to login page
        const usernameField = this.page.locator('input[name="username"]');
        if (await usernameField.count() > 0) {
            console.log('Redirected directly to login page.');
            await usernameField.waitFor({ state: 'visible', timeout: 10000 });
            return;
        }

        // Navigate to login page if a link exists
        const loginLink = this.page.locator('a[href*="login.htm"]');
        if (await loginLink.count() > 0) {
            console.log('🡒 Found login link, navigating...');
            await Promise.all([
                this.page.waitForLoadState('load'),
                loginLink.click(),
            ]);
        } else {
            console.warn('Neither login link nor username field found, taking screenshot...');
            await this.page.screenshot({ path: 'debug-registration.png', fullPage: true });
        }
        // Wait the username field on login
        // await this.page.waitForSelector('input[name="username"]', { timeout: 60000 });
    };
}

module.exports = { RegistrationPage };
