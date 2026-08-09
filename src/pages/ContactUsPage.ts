import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /contact_us (cenário 6).
 * Contém as duas correções não óbvias do bug original: esperar o handler
 * de submit do jQuery estar realmente ligado ao form antes de clicar
 * Submit (ver submitForm()), e escopar a mensagem de sucesso pro
 * container certo (ver o comentário no construtor).
 */
export class ContactUsPage extends BasePage {
  private readonly getInTouchHeading: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly subjectInput: Locator;
  private readonly messageInput: Locator;
  private readonly uploadFileInput: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  private readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.getInTouchHeading = page.getByText('Get In Touch');
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    // Escopado em #contact-page de propósito: o próprio JS do site roda
    // $(".alert-success").html(...) no submit, o que (por classe, não id)
    // também preenche a caixa oculta da newsletter (#success-subscribe,
    // no rodapé) com esse mesmo texto. Um getByText(...) sem escopo bate
    // nos dois e dispara uma violação de strict mode do Playwright que
    // parece só um timeout comum do toBeVisible().
    this.successMessage = page
      .locator('#contact-page')
      .getByText('Success! Your details have been submitted successfully.');
    this.homeButton = page.locator('a.btn.btn-success[href="/"]');
  }

  /** Verifica que o heading "Get In Touch" (formulário de contato) está visível. */
  async verifyGetInTouchVisible(): Promise<void> {
    await expect(this.getInTouchHeading).toBeVisible();
  }

  /** Preenche nome, email, assunto e mensagem do formulário de contato. */
  async fillContactForm(name: string, email: string, subject: string, message: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
  }

  /** Faz upload de um arquivo no campo de anexo do formulário. */
  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath);
  }

  /**
   * Clica no botão Submit do formulário de contato.
   *
   * Antes de clicar, espera deterministicamente o handler de "submit" do
   * jQuery estar de fato ligado ao <form id="contact-us-form">. Motivo: a
   * página liga esse handler num <script> inline perto do fim do <body>,
   * DEPOIS de um <script> do Google Maps que bloqueia o parser e pode
   * demorar. O heading "Get In Touch" e os campos do form renderizam bem
   * antes disso, então o Playwright consegue preencher tudo e clicar em
   * Submit antes do handler existir. Quando isso acontece, não há
   * confirm() nenhum: o clique cai no submit nativo do navegador, gerando
   * um POST real + reload completo da página, em vez da mensagem de
   * sucesso via JS que o site pretende mostrar. Esperar
   * networkidle/load state não resolve de forma confiável (os beacons de
   * anúncio/consentimento do Google ficam disparando e nunca deixam a
   * rede "parada"), então esperamos a condição real que precisamos: o
   * evento "submit" estar registrado no form via jQuery.
   *
   * Depois disso, registra o listener de dialog ANTES do clique: o
   * handler de submit do site chama o confirm() nativo
   * ("Press OK to proceed!"), e a Promise do click() só resolve depois
   * do dialog ser tratado — sem listener, o Playwright descarta o dialog
   * automaticamente (equivalente a clicar em Cancelar).
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

  /** Verifica a mensagem "Success! Your details have been submitted successfully." */
  async verifySuccessMessageVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }

  /** Clica no botão "Home" que aparece no lugar do formulário após o sucesso. */
  async clickHomeButton(): Promise<void> {
    await this.homeButton.click();
  }
}
