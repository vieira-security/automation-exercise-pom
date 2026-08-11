import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupLoginPage extends BasePage {
    private readonly newUserSignupHeading: Locator = this.page.getByText('New User Signup');
    private readonly signupNameInput: Locator = this.page.locator('input[data-qa="signup-name"]');
    private readonly signupEmailInput: Locator = this.page.locator('input[data-qa="signup-email"]');
    private readonly signupButton: Locator = this.page.locator('button[data-qa="signup-button"]');
    private readonly loginHeading: Locator = this.page.getByText('Login to your account');
    private readonly loginEmailInput: Locator = this.page.locator('input[data-qa="login-email"]');
    private readonly loginPasswordInput: Locator = this.page.locator('input[data-qa="login-password"]');
    private readonly loginButton: Locator = this.page.locator('button[data-qa="login-button"]');
    private readonly loginErrorMsg: Locator = this.page.locator('form[action="/login"] p');
    private readonly signupErrorMsg: Locator = this.page.locator('form[action="/signup"] p');

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
        await expect(this.loginErrorMsg).toContainText('Your email or password is incorrect!');
    }

    async verifySignupErrorVisible(): Promise<void> {
        await expect(this.signupErrorMsg).toBeVisible();
        await expect(this.signupErrorMsg).toContainText('Email Address already exist!');
    }
}
