import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  GET_IN_TOUCH_TEXT,
  NAME_INPUT_SELECTOR,
  EMAIL_INPUT_SELECTOR,
  SUBJECT_INPUT_SELECTOR,
  MESSAGE_INPUT_SELECTOR,
  UPLOAD_FILE_INPUT_SELECTOR,
  SUBMIT_BUTTON_SELECTOR,
  CONTACT_PAGE_SELECTOR,
  SUCCESS_MESSAGE_TEXT,
  HOME_BUTTON_SELECTOR,
} from '../constants/ConstantsContactUsPage';

export class ContactUsPage extends BasePage {
  private readonly getInTouchHeading: Locator = this.page.getByText(GET_IN_TOUCH_TEXT);
  private readonly nameInput: Locator = this.page.locator(NAME_INPUT_SELECTOR);
  private readonly emailInput: Locator = this.page.locator(EMAIL_INPUT_SELECTOR);
  private readonly subjectInput: Locator = this.page.locator(SUBJECT_INPUT_SELECTOR);
  private readonly messageInput: Locator = this.page.locator(MESSAGE_INPUT_SELECTOR);
  private readonly uploadFileInput: Locator = this.page.locator(UPLOAD_FILE_INPUT_SELECTOR);
  private readonly submitButton: Locator = this.page.locator(SUBMIT_BUTTON_SELECTOR);
  // Escopado em #contact-page: o JS do site também preenche a caixa oculta
  // da newsletter com esse mesmo texto, e um getByText sem escopo bate nos
  // dois elementos (violação de strict mode).
  private readonly successMessage: Locator = this.page
    .locator(CONTACT_PAGE_SELECTOR)
    .getByText(SUCCESS_MESSAGE_TEXT);
  private readonly homeButton: Locator = this.page.locator(HOME_BUTTON_SELECTOR);

  constructor(page: Page) {
    super(page);
  }

  async verifyGetInTouchVisible(): Promise<void> {
    await expect(this.getInTouchHeading).toBeVisible();
  }

  async fillContactForm(name: string, email: string, subject: string, message: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath);
  }

  /**
   * O handler de submit (jQuery) só é ligado ao form perto do fim do body,
   * depois de um script do Google Maps que pode demorar — clicar Submit
   * antes disso cai no submit nativo do navegador (POST + reload), sem o
   * confirm() nem a mensagem de sucesso via JS. Por isso esperamos o
   * evento "submit" estar registrado antes de clicar, e registramos o
   * listener de dialog ANTES do clique pra aceitar o confirm() nativo.
   */
  async submitForm(): Promise<void> {
    await this.page.waitForFunction(() => {
      const jq = (window as unknown as { jQuery?: any }).jQuery;
      const form = document.getElementById('contact-us-form');
      const events = jq && jq._data ? jq._data(form, 'events') : null;
      return !!(events && events.submit && events.submit.length > 0);
    });

    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async verifySuccessMessageVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    await expect(this.successMessage).toContainText(SUCCESS_MESSAGE_TEXT);
  }

  async clickHomeButton(): Promise<void> {
    await this.homeButton.click();
  }
}
