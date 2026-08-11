import { Page, expect } from '@playwright/test';

/** Classe base de onde todas as Page Objects herdam. */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async verifyTextVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: false}).first()).toBeVisible();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}
