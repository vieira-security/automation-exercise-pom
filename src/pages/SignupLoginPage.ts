import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /login, que na verdade contém DOIS formulários
 * lado a lado: "New User Signup" (cadastro) e "Login to your account"
 * (login). Por isso essa classe cobre tanto o começo do fluxo de
 * cadastro (nome + email, antes de ir para Account Information) quanto
 * o fluxo completo de login.
 */
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

    /** Verifica que o formulário "New User Signup" está visível. */
    async verifyNewUserSignupVisible(): Promise<void> {
        await expect(this.newUserSignupHeading).toBeVisible();
    }

    /** Preenche nome e email no formulário de cadastro (primeiro passo do Signup). */
    async fillSignupNameAndEmail(name: string, email: string): Promise<void> {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
    }

    /** Clica no botão "Signup", avançando para a página Account Information. */
    async clickSignupButton(): Promise<void> {
        await this.signupButton.click();
    }

    /** Preenche email e senha no formulário de login e clica em "Login". */
    async login(email: string, password: string): Promise<void> {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    /** Verifica que o formulário "Login to your account" está visível. */
    async verifyLoginFormVisible(): Promise<void> {
        await expect(this.loginHeading).toBeVisible();
    }

    /** Verifica a mensagem de erro exibida ao tentar logar com credenciais inválidas. */
    async verifyLoginErrorVisible(): Promise<void> {
        await expect(this.loginErrorMsg).toBeVisible();
        await expect(this.loginErrorMsg).toContainText('Your email or password is incorrect!');
    }

    /** Verifica a mensagem de erro exibida ao tentar cadastrar um email que já existe. */
    async verifySignupErrorVisible(): Promise<void> {
        await expect(this.signupErrorMsg).toBeVisible();
        await expect(this.signupErrorMsg).toContainText('Email Address already exist!');
    }
}
