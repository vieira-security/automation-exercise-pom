import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TEST_CASES_HEADING_SELECTOR, TEST_CASES_TEXT } from '../constants/ConstantsTestCasesPage';

export class TestCasesPage extends BasePage {
  // O corpo da página repete "Test Cases" várias vezes; um getByText sem
  // escopo bateria em várias violações de strict mode.
  private readonly testCasesHeading: Locator = this.page.locator(TEST_CASES_HEADING_SELECTOR, { hasText: TEST_CASES_TEXT });

  constructor(page: Page) {
    super(page);
  }

  async verifyTestCasesPageVisible(): Promise<void> {
    await expect(this.testCasesHeading).toBeVisible();
    await expect(this.testCasesHeading).toContainText(TEST_CASES_TEXT);
  }
}
