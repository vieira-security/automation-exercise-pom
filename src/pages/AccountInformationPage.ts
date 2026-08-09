import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página "Enter Account Information", segundo passo do
 * fluxo de cadastro (Signup). Aqui o usuário preenche senha, data de
 * nascimento, endereço completo e finaliza clicando em "Create Account".
 */
export class AccountInformationPage extends BasePage {
    private readonly enterAccountInfoHeading: Locator;
    private readonly passwordInput: Locator;
    private readonly titleMr: Locator;
    private readonly titleMrs: Locator;
    private readonly daySelect: Locator;
    private readonly monthSelect: Locator;
    private readonly yearSelect: Locator;
    private readonly newsletterCheckbox: Locator;
    private readonly specialOffersCheckbox: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly companyInput: Locator;
    private readonly addressInput: Locator;
    private readonly address2Input: Locator;
    private readonly countrySelect: Locator;
    private readonly stateInput: Locator;
    private readonly cityInput: Locator;
    private readonly zipcodeInput: Locator;
    private readonly mobileNumberInput: Locator;
    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);

        this.enterAccountInfoHeading = page.getByText('Enter Account Information');
        this.passwordInput = page.locator('input[data-qa="password"]');
        this.titleMr = page.locator('#id_gender1');
        this.titleMrs = page.locator('#id_gender2');
        this.daySelect = page.locator('#days');
        this.monthSelect = page.locator('#months');
        this.yearSelect = page.locator('#years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.specialOffersCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.companyInput = page.locator('#company');
        this.addressInput = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.countrySelect = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileNumberInput = page.locator('#mobile_number');
        this.createAccountButton = page.locator('[data-qa="create-account"]');

    }

    /** Verifica que o formulário "Enter Account Information" está visível. */
    async verifyEnterAccountInfoVisible(): Promise<void> {
        await expect(this.enterAccountInfoHeading).toBeVisible();
    }

    /** Seleciona o título/tratamento do usuário ("Mr" ou "Mrs") via radio button. */
    async selectTitle(title: 'Mr' | 'Mrs'): Promise<void> {
         if (title === 'Mr') {
            await this.titleMr.check();
            } else {
        await this.titleMrs.check();
         }
    }

    /** Preenche o campo de senha da conta. */
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /** Seleciona dia, mês e ano de nascimento nos três <select> correspondentes. */
    async fillDateOfBirth(day: string, month: string, year: string): Promise<void> {
        await this.daySelect.selectOption(day);
        await this.monthSelect.selectOption(month);
        await this.yearSelect.selectOption(year);
    }

    /** Marca os checkboxes de "Sign up for our newsletter!" e "Receive special offers". */
    async checkNewsletterAndOffers(): Promise<void> {
        await this.newsletterCheckbox.check();
        await this.specialOffersCheckbox.check();
    }

    /** Preenche nome, sobrenome e empresa. */
    async fillNameAndCompany(firstName: string, lastName: string, company: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.companyInput.fill(company);
    }

    /** Preenche endereço (linha 1 e 2) e seleciona o país no <select>. */
    async fillAddressAndCountry(address: string, address2: string, country: string): Promise<void> {
        await this.addressInput.fill(address);
        await this.address2Input.fill(address2);
        await this.countrySelect.selectOption(country);
    }

    /** Preenche estado, cidade, CEP e número de celular. */
    async fillStateCityZipcodeMobile(state: string, city: string, zipcode: string, mobileNumber: string): Promise<void> {
        await this.stateInput.fill(state);
        await this.cityInput.fill(city);
        await this.zipcodeInput.fill(zipcode);
        await this.mobileNumberInput.fill(mobileNumber);
    }

    /** Clica no botão "Create Account", finalizando o cadastro. */
    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }
}
