import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestCasesPage extends BasePage {
  // O corpo da página repete "Test Cases" várias vezes; um getByText sem
  // escopo bateria em várias violações de strict mode.
  private readonly testCasesHeading: Locator = this.page.locator('h2.title', { hasText: 'Test Cases' });

  constructor(page: Page) {
    super(page);
  }

  async verifyTestCasesPageVisible(): Promise<void> {
    await expect(this.testCasesHeading).toBeVisible();
    await expect(this.testCasesHeading).toContainText('Test Cases');
  }
}
