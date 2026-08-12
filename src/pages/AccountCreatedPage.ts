import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ACCOUNT_CREATED_SELECTOR, CONTINUE_BUTTON_SELECTOR, ACCOUNT_CREATED_TEXT } from '../constants/ConstantsAccountCreatedPage';

export class AccountCreatedPage extends BasePage {
  private readonly accountCreatedHeading: Locator = this.page.locator(ACCOUNT_CREATED_SELECTOR);
  private readonly continueButton: Locator = this.page.locator(CONTINUE_BUTTON_SELECTOR);

  constructor(page: Page) {
    super(page);
  }

  async verifyAccountCreatedVisible(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
    await expect(this.accountCreatedHeading).toHaveText(ACCOUNT_CREATED_TEXT);
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
