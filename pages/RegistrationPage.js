// pages/RegistrationPage.js
import fs from 'fs';

export class RegistrationPage {
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

        // Click Register and wait for navigation
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.click('input[value="Register"]'),
        ]);

        // Confirm registration success
        const successMessage = this.page.locator('text=Your account was created successfully');
        if (await successMessage.count() > 0) {
            console.log('Registration success message found.');
            await successMessage.waitFor({ state: 'visible', timeout: 5000 });
        } else {
            console.warn('⚠️ Registration message not found, continuing.');
        }

        // Always navigate directly to login page
        console.log('Navigating to login page manually...');
        await this.page.goto('http://localhost:9090/login.htm', { waitUntil: 'domcontentloaded' });

        // Debug HTML capture
        console.log('Current URL:', this.page.url());
        const html = await this.page.content();
        fs.writeFileSync('debug-page.html', html);

        // Wait for login form
        await this.page.waitForSelector('input[name="username"]', {
            timeout: 30000,
            state: 'visible',
        });
        console.log('Reached login page.');
    }
}

export default { RegistrationPage };
