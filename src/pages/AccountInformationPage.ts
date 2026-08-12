import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
    ENTER_ACCOUNT_INFO_TEXT,
    PASSWORD_INPUT_SELECTOR,
    TITLE_MR_SELECTOR,
    TITLE_MRS_SELECTOR,
    DAY_SELECT_SELECTOR,
    MONTH_SELECT_SELECTOR,
    YEAR_SELECT_SELECTOR,
    NEWSLETTER_CHECKBOX_SELECTOR,
    SPECIAL_OFFERS_CHECKBOX_SELECTOR,
    FIRST_NAME_INPUT_SELECTOR,
    LAST_NAME_INPUT_SELECTOR,
    COMPANY_INPUT_SELECTOR,
    ADDRESS_INPUT_SELECTOR,
    ADDRESS_2_INPUT_SELECTOR,
    COUNTRY_SELECT_SELECTOR,
    STATE_INPUT_SELECTOR,
    CITY_INPUT_SELECTOR,
    ZIPCODE_INPUT_SELECTOR,
    MOBILE_NUMBER_INPUT_SELECTOR,
    CREATE_ACCOUNT_BUTTON_SELECTOR,
} from '../constants/ConstantsAccountInformationPage';

export class AccountInformationPage extends BasePage {
    private readonly enterAccountInfoHeading: Locator = this.page.getByText(ENTER_ACCOUNT_INFO_TEXT);
    private readonly passwordInput: Locator = this.page.locator(PASSWORD_INPUT_SELECTOR);
    private readonly titleMr: Locator = this.page.locator(TITLE_MR_SELECTOR);
    private readonly titleMrs: Locator = this.page.locator(TITLE_MRS_SELECTOR);
    private readonly daySelect: Locator = this.page.locator(DAY_SELECT_SELECTOR);
    private readonly monthSelect: Locator = this.page.locator(MONTH_SELECT_SELECTOR);
    private readonly yearSelect: Locator = this.page.locator(YEAR_SELECT_SELECTOR);
    private readonly newsletterCheckbox: Locator = this.page.locator(NEWSLETTER_CHECKBOX_SELECTOR);
    private readonly specialOffersCheckbox: Locator = this.page.locator(SPECIAL_OFFERS_CHECKBOX_SELECTOR);
    private readonly firstNameInput: Locator = this.page.locator(FIRST_NAME_INPUT_SELECTOR);
    private readonly lastNameInput: Locator = this.page.locator(LAST_NAME_INPUT_SELECTOR);
    private readonly companyInput: Locator = this.page.locator(COMPANY_INPUT_SELECTOR);
    private readonly addressInput: Locator = this.page.locator(ADDRESS_INPUT_SELECTOR);
    private readonly address2Input: Locator = this.page.locator(ADDRESS_2_INPUT_SELECTOR);
    private readonly countrySelect: Locator = this.page.locator(COUNTRY_SELECT_SELECTOR);
    private readonly stateInput: Locator = this.page.locator(STATE_INPUT_SELECTOR);
    private readonly cityInput: Locator = this.page.locator(CITY_INPUT_SELECTOR);
    private readonly zipcodeInput: Locator = this.page.locator(ZIPCODE_INPUT_SELECTOR);
    private readonly mobileNumberInput: Locator = this.page.locator(MOBILE_NUMBER_INPUT_SELECTOR);
    private readonly createAccountButton: Locator = this.page.locator(CREATE_ACCOUNT_BUTTON_SELECTOR);

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
