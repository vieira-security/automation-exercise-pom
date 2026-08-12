import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
    SIGNUP_LOGIN_LINK_SELECTOR,
    CATEGORY_SIDEBAR_SELECTOR,
    CONTACT_US_LINK_SELECTOR,
    TEST_CASES_LINK_SELECTOR,
    PRODUCTS_LINK_SELECTOR,
    SUBSCRIBE_EMAIL_INPUT_SELECTOR,
    SUBSCRIBE_BUTTON_SELECTOR,
    SUBSCRIBE_SUCCESS_MSG_SELECTOR,
    LOGGED_IN_AS_TEXT,
    DELETE_ACCOUNT_LINK_SELECTOR,
    LOGOUT_LINK_SELECTOR,
    SUBSCRIBE_SUCCESS_TEXT,
} from '../constants/ConstantsHomePage';

export class HomePage extends BasePage {
    private readonly signupLoginLink: Locator = this.page.locator(SIGNUP_LOGIN_LINK_SELECTOR);
    private readonly categorySidebar: Locator = this.page.locator(CATEGORY_SIDEBAR_SELECTOR).first();
    private readonly contactUsLink: Locator = this.page.locator(CONTACT_US_LINK_SELECTOR);
    // Escopado no menu: a home também tem botões "Test Cases" no carrossel
    // com o mesmo href, o que bateria em 4 elementos (strict mode).
    private readonly testCases: Locator = this.page.locator(TEST_CASES_LINK_SELECTOR);
    private readonly products: Locator = this.page.locator(PRODUCTS_LINK_SELECTOR);
    private readonly subscribeEmailInput: Locator = this.page.locator(SUBSCRIBE_EMAIL_INPUT_SELECTOR);
    private readonly subscribeButton: Locator = this.page.locator(SUBSCRIBE_BUTTON_SELECTOR);
    private readonly subscribeSucessMsg: Locator = this.page.locator(SUBSCRIBE_SUCCESS_MSG_SELECTOR);
    private readonly loggedInAsText: Locator = this.page.getByText(LOGGED_IN_AS_TEXT);
    private readonly deleteAccountLink: Locator = this.page.locator(DELETE_ACCOUNT_LINK_SELECTOR);
    private readonly logoutLink: Locator = this.page.locator(LOGOUT_LINK_SELECTOR);

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
        await expect(this.subscribeSucessMsg).toContainText(SUBSCRIBE_SUCCESS_TEXT);
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
