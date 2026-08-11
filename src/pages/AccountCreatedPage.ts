import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
  private readonly accountCreatedHeading: Locator = this.page.locator('[data-qa="account-created"]');
  private readonly continueButton: Locator = this.page.locator('[data-qa="continue-button"]');

  constructor(page: Page) {
    super(page);
  }

  async verifyAccountCreatedVisible(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
    await expect(this.accountCreatedHeading).toHaveText('Account Created!');
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
