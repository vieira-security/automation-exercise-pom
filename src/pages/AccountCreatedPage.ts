import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da tela "Account Created!" exibida logo após o cadastro
 * (fluxo de Signup) ser concluído com sucesso.
 */
export class AccountCreatedPage extends BasePage {
  private readonly accountCreatedHeading: Locator = this.page.locator('[data-qa="account-created"]');
  private readonly continueButton: Locator = this.page.locator('[data-qa="continue-button"]');

  constructor(page: Page) {
    super(page);
  }

  /** Verifica que a mensagem "Account Created!" está visível. */
  async verifyAccountCreatedVisible(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
    await expect(this.accountCreatedHeading).toHaveText('Account Created!');
  }

  /** Clica no botão "Continue", que leva o usuário de volta à home (já logado). */
  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
