import { Page, expect } from '@playwright/test';

/**
 * Classe base de onde todas as outras Page Objects herdam.
 * Guarda a instância do `page` do Playwright e concentra ações/verificações
 * genéricas que fazem sentido em qualquer página do site.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navega para um caminho relativo à baseURL configurada em playwright.config.ts
   * (ex: '/', '/login', '/contact_us'). Usa o path padrão ('/') se nenhum for passado.
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Verifica que algum texto está visível na página, buscando por substring
   * (não precisa ser o texto exato) e pegando só a primeira ocorrência.
   * Útil para checagens rápidas e genéricas que não merecem um locator próprio.
   */
  async verifyTextVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: false}).first()).toBeVisible();
  }

  /**
   * Rola a página inteira até o final (usado, por exemplo, para chegar
   * na caixa de assinatura de newsletter no rodapé).
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}
