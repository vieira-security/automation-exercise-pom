import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  private readonly accountDeletedHeading: Locator = this.page.locator('[data-qa="account-deleted"]');
  private readonly continueButton: Locator = this.page.locator('[data-qa="continue-button"]');

  constructor(page: Page) {
    super(page);
  }

  async verifyAccountDeletedVisible(): Promise<void> {
    await expect(this.accountDeletedHeading).toBeVisible();
    await expect(this.accountDeletedHeading).toHaveText('Account Deleted!');
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
