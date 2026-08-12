import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountInformationPage extends BasePage {
    private readonly enterAccountInfoHeading: Locator = this.page.getByText('Enter Account Information');
    private readonly passwordInput: Locator = this.page.locator('input[data-qa="password"]');
    private readonly titleMr: Locator = this.page.locator('#id_gender1');
    private readonly titleMrs: Locator = this.page.locator('#id_gender2');
    private readonly daySelect: Locator = this.page.locator('#days');
    private readonly monthSelect: Locator = this.page.locator('#months');
    private readonly yearSelect: Locator = this.page.locator('#years');
    private readonly newsletterCheckbox: Locator = this.page.locator('#newsletter');
    private readonly specialOffersCheckbox: Locator = this.page.locator('#optin');
    private readonly firstNameInput: Locator = this.page.locator('#first_name');
    private readonly lastNameInput: Locator = this.page.locator('#last_name');
    private readonly companyInput: Locator = this.page.locator('#company');
    private readonly addressInput: Locator = this.page.locator('#address1');
    private readonly address2Input: Locator = this.page.locator('#address2');
    private readonly countrySelect: Locator = this.page.locator('#country');
    private readonly stateInput: Locator = this.page.locator('#state');
    private readonly cityInput: Locator = this.page.locator('#city');
    private readonly zipcodeInput: Locator = this.page.locator('#zipcode');
    private readonly mobileNumberInput: Locator = this.page.locator('#mobile_number');
    private readonly createAccountButton: Locator = this.page.locator('[data-qa="create-account"]');

    constructor(page: Page) {
        super(page);
    }

    async verifyEnterAccountInfoVisible(): Promise<void> {
        await expect(this.enterAccountInfoHeading).toBeVisible();
    }

    async selectTitle(title: 'Mr' | 'Mrs'): Promise<void> {
         if (title === 'Mr') {
            await this.titleMr.check();
            } else {
        await this.titleMrs.check();
         }
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async fillDateOfBirth(day: string, month: string, year: string): Promise<void> {
        await this.daySelect.selectOption(day);
        await this.monthSelect.selectOption(month);
        await this.yearSelect.selectOption(year);
    }

    async checkNewsletterAndOffers(): Promise<void> {
        await this.newsletterCheckbox.check();
        await this.specialOffersCheckbox.check();
    }

    async fillNameAndCompany(firstName: string, lastName: string, company: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.companyInput.fill(company);
    }

    async fillAddressAndCountry(address: string, address2: string, country: string): Promise<void> {
        await this.addressInput.fill(address);
        await this.address2Input.fill(address2);
        await this.countrySelect.selectOption(country);
    }

    async fillStateCityZipcodeMobile(state: string, city: string, zipcode: string, mobileNumber: string): Promise<void> {
        await this.stateInput.fill(state);
        await this.cityInput.fill(city);
        await this.zipcodeInput.fill(zipcode);
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }
}
