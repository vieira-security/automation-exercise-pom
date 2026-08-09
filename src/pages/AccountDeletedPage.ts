import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da tela "Account Deleted!" exibida logo após o usuário
 * deletar a própria conta (via HomePage.clickDeleteAccount()).
 */
export class AccountDeletedPage extends BasePage {
  private readonly accountDeletedHeading: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  /** Verifica que a mensagem "Account Deleted!" está visível. */
  async verifyAccountDeletedVisible(): Promise<void> {
    await expect(this.accountDeletedHeading).toBeVisible();
  }

  /** Clica no botão "Continue", que leva o usuário de volta à home (deslogado). */
  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
