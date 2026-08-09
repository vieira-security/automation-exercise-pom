import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da tela "Account Created!" exibida logo após o cadastro
 * (fluxo de Signup) ser concluído com sucesso.
 */
export class AccountCreatedPage extends BasePage {
  private readonly accountCreatedHeading: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  /** Verifica que a mensagem "Account Created!" está visível. */
  async verifyAccountCreatedVisible(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  /** Clica no botão "Continue", que leva o usuário de volta à home (já logado). */
  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
