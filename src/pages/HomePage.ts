import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da Home page (automationexercise.com/).
 * Concentra a navegação pelo menu superior, a assinatura de newsletter
 * no rodapé e as ações de sessão (login/logout/deletar conta) que
 * refletem na home (ex: "Logged in as ...").
 */
export class HomePage extends BasePage {
    private readonly signupLoginLink: Locator = this.page.locator('a[href="/login"]');
    private readonly categorySidebar: Locator = this.page.locator('.left-sidebar h2').first();
    private readonly contactUsLink: Locator = this.page.locator('a[href="/contact_us"]');
    // Restrito ao menu de navegação: a home também tem botões
    // promocionais "Test Cases" (class="test_cases_list") no carrossel
    // de itens em destaque com o mesmo href, o que faria esse locator
    // bater em 4 elementos (violação de strict mode do Playwright).
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

    /** Navega direto para a home page ('/'). */
    async open(): Promise<void> {
        await this.goto('/');
    }

    /** Verifica que a home carregou de fato, checando a sidebar de categorias. */
    async verifyHomePageVisible(): Promise<void> {
        await expect(this.categorySidebar).toBeVisible();
    }

    /**
     * Verifica a mensagem de sucesso da assinatura de newsletter no rodapé.
     * Atenção: o site só mostra essa mensagem por ~1.5s antes de escondê-la
     * de novo (ver subscription.js), então chame logo depois de subscribeWithEmail().
     */
    async verifySubscribeSuccess(): Promise<void> {
        await expect(this.subscribeSucessMsg).toBeVisible();
        await expect(this.subscribeSucessMsg).toContainText('You have been successfully subscribed!');
    }

    /** Clica no link "Signup / Login" do menu, navegando para /login. */
    async clickSignupLogin(): Promise<void> {
        await this.signupLoginLink.click();
    }

    /** Clica no link "Contact us" do menu, navegando para /contact_us. */
    async clickContactUs(): Promise<void> {
        await this.contactUsLink.click();
    }

    /** Clica no link "Test Cases" do menu, navegando para /test_cases. */
    async clickTestCases(): Promise<void> {
        await this.testCases.click();
    }

    /** Clica no link "Products" do menu, navegando para /products. */
    async clickProducts(): Promise<void>{
        await this.products.click();
    }

    /**
     * Rola até o rodapé, preenche o campo de email da newsletter e clica
     * no botão de assinar. Não verifica o resultado — use
     * verifySubscribeSuccess() em seguida para isso.
     */
    async subscribeWithEmail(email: string): Promise<void> {
        await this.scrollToBottom();
        await this.subscribeEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    /** Verifica que o texto "Logged in as ..." está visível (usuário autenticado). */
    async verifyLoggedInAsVisible(): Promise<void> {
        await expect(this.loggedInAsText).toBeVisible();
    }

    /** Clica no link "Delete Account" do menu (usuário precisa estar logado). */
    async clickDeleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
    }

    /** Clica no link "Logout" do menu. */
    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }
}
