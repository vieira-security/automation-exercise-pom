import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ACCOUNT_DELETED_SELECTOR, CONTINUE_BUTTON_SELECTOR, ACCOUNT_DELETED_TEXT } from '../constants/ConstantsAccountDeletedPage';

export class AccountDeletedPage extends BasePage {
  private readonly accountDeletedHeading: Locator = this.page.locator(ACCOUNT_DELETED_SELECTOR);
  private readonly continueButton: Locator = this.page.locator(CONTINUE_BUTTON_SELECTOR);

  constructor(page: Page) {
    super(page);
  }

  async verifyAccountDeletedVisible(): Promise<void> {
    await expect(this.accountDeletedHeading).toBeVisible();
    await expect(this.accountDeletedHeading).toHaveText(ACCOUNT_DELETED_TEXT);
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
