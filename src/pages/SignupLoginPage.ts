import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
    NEW_USER_SIGNUP_TEXT,
    SIGNUP_NAME_INPUT_SELECTOR,
    SIGNUP_EMAIL_INPUT_SELECTOR,
    SIGNUP_BUTTON_SELECTOR,
    LOGIN_HEADING_TEXT,
    LOGIN_EMAIL_INPUT_SELECTOR,
    LOGIN_PASSWORD_INPUT_SELECTOR,
    LOGIN_BUTTON_SELECTOR,
    LOGIN_ERROR_MSG_SELECTOR,
    SIGNUP_ERROR_MSG_SELECTOR,
    LOGIN_ERROR_TEXT,
    SIGNUP_ERROR_TEXT,
} from '../constants/ConstantsSignupLoginPage';

export class SignupLoginPage extends BasePage {
    private readonly newUserSignupHeading: Locator = this.page.getByText(NEW_USER_SIGNUP_TEXT);
    private readonly signupNameInput: Locator = this.page.locator(SIGNUP_NAME_INPUT_SELECTOR);
    private readonly signupEmailInput: Locator = this.page.locator(SIGNUP_EMAIL_INPUT_SELECTOR);
    private readonly signupButton: Locator = this.page.locator(SIGNUP_BUTTON_SELECTOR);
    private readonly loginHeading: Locator = this.page.getByText(LOGIN_HEADING_TEXT);
    private readonly loginEmailInput: Locator = this.page.locator(LOGIN_EMAIL_INPUT_SELECTOR);
    private readonly loginPasswordInput: Locator = this.page.locator(LOGIN_PASSWORD_INPUT_SELECTOR);
    private readonly loginButton: Locator = this.page.locator(LOGIN_BUTTON_SELECTOR);
    private readonly loginErrorMsg: Locator = this.page.locator(LOGIN_ERROR_MSG_SELECTOR);
    private readonly signupErrorMsg: Locator = this.page.locator(SIGNUP_ERROR_MSG_SELECTOR);

    constructor(page: Page){
        super(page);
    }

    async verifyNewUserSignupVisible(): Promise<void> {
        await expect(this.newUserSignupHeading).toBeVisible();
    }

    async fillSignupNameAndEmail(name: string, email: string): Promise<void> {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
    }

    async clickSignupButton(): Promise<void> {
        await this.signupButton.click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginFormVisible(): Promise<void> {
        await expect(this.loginHeading).toBeVisible();
    }

    async verifyLoginErrorVisible(): Promise<void> {
        await expect(this.loginErrorMsg).toBeVisible();
        await expect(this.loginErrorMsg).toContainText(LOGIN_ERROR_TEXT);
    }

    async verifySignupErrorVisible(): Promise<void> {
        await expect(this.signupErrorMsg).toBeVisible();
        await expect(this.signupErrorMsg).toContainText(SIGNUP_ERROR_TEXT);
    }
}
