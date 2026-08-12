import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    private readonly signupLoginLink: Locator = this.page.locator('a[href="/login"]');
    private readonly categorySidebar: Locator = this.page.locator('.left-sidebar h2').first();
    private readonly contactUsLink: Locator = this.page.locator('a[href="/contact_us"]');
    // Escopado no menu: a home também tem botões "Test Cases" no carrossel
    // com o mesmo href, o que bateria em 4 elementos (strict mode).
    private readonly testCases: Locator = this.page.locator('.shop-menu a[href="/test_cases"]');
    private readonly products: Locator = this.page.locator('a[href="/products"]');
    private readonly subscribeEmailInput: Locator = this.page.locator('#susbscribe_email');
    private readonly subscribeButton: Locator = this.page.locator('#subscribe');
    private readonly subscribeSucessMsg: Locator = this.page.locator('#success-subscribe');
    private readonly loggedInAsText: Locator = this.page.getByText('Logged in as');
    private readonly deleteAccountLink: Locator = this.page.locator('a[href="/delete_account"]');
    private readonly logoutLink: Locator = this.page.locator('a[href="/logout"]');

    constructor(page: Page) {
        super(page);
    }

    async open(): Promise<void> {
        await this.goto('/');
    }

    async verifyHomePageVisible(): Promise<void> {
        await expect(this.categorySidebar).toBeVisible();
    }

    // O site esconde essa mensagem ~1.5s depois de exibi-la; chame logo após subscribeWithEmail().
    async verifySubscribeSuccess(): Promise<void> {
        await expect(this.subscribeSucessMsg).toBeVisible();
        await expect(this.subscribeSucessMsg).toContainText('You have been successfully subscribed!');
    }

    async clickSignupLogin(): Promise<void> {
        await this.signupLoginLink.click();
    }

    async clickContactUs(): Promise<void> {
        await this.contactUsLink.click();
    }

    async clickTestCases(): Promise<void> {
        await this.testCases.click();
    }

    async clickProducts(): Promise<void>{
        await this.products.click();
    }

    async subscribeWithEmail(email: string): Promise<void> {
        await this.scrollToBottom();
        await this.subscribeEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    async verifyLoggedInAsVisible(): Promise<void> {
        await expect(this.loggedInAsText).toBeVisible();
    }

    async clickDeleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
    }

    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }
}
