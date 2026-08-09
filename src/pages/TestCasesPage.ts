import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /test_cases (cenário 7 — lista oficial de casos
 * de teste do próprio site).
 */
export class TestCasesPage extends BasePage {
  private readonly testCasesHeading: Locator;

  constructor(page: Page) {
    super(page);
    // O corpo da página repete "Test Cases" várias vezes (no texto de
    // descrição de cada caso de teste), então um getByText(...) sem
    // escopo bate em várias violações de strict mode. O heading/título
    // da própria página é único.
    this.testCasesHeading = page.locator('h2.title', { hasText: 'Test Cases' });
  }

  /** Verifica que a página de Test Cases carregou (heading do título visível). */
  async verifyTestCasesPageVisible(): Promise<void> {
    await expect(this.testCasesHeading).toBeVisible();
  }
}
