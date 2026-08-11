import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SignupLoginPage } from '../src/pages/SignupLoginPage';
import { AccountInformationPage } from '../src/pages/AccountInformationPage';
import { AccountCreatedPage } from '../src/pages/AccountCreatedPage';
import {
  FULL_NAME,
  FIRST_NAME,
  LAST_NAME,
  COMPANY,
  TITLE,
  PASSWORD,
  DATE_OF_BIRTH,
  ADDRESS,
  ADDRESS_2,
  COUNTRY,
  STATE,
  CITY,
  ZIPCODE,
  MOBILE_NUMBER,
  generateRandomEmail,
} from './testData';

test('Logout User', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);

  const email = generateRandomEmail();

  await test.step('Criar uma conta de teste (setup, já fica logado)', async () => {
    await homePage.open();
    await homePage.clickSignupLogin();
    await signupLoginPage.fillSignupNameAndEmail(FULL_NAME, email);
    await signupLoginPage.clickSignupButton();

    await accountInfoPage.selectTitle(TITLE);
    await accountInfoPage.fillPassword(PASSWORD);
    await accountInfoPage.fillDateOfBirth(DATE_OF_BIRTH.day, DATE_OF_BIRTH.month, DATE_OF_BIRTH.year);
    await accountInfoPage.checkNewsletterAndOffers();
    await accountInfoPage.fillNameAndCompany(FIRST_NAME, LAST_NAME, COMPANY);
    await accountInfoPage.fillAddressAndCountry(ADDRESS, ADDRESS_2, COUNTRY);
    await accountInfoPage.fillStateCityZipcodeMobile(STATE, CITY, ZIPCODE, MOBILE_NUMBER);
    await accountInfoPage.clickCreateAccountButton();

    await accountCreatedPage.verifyAccountCreatedVisible();
    await accountCreatedPage.clickContinueButton();
  });

  await test.step('Verificar que está logado antes de deslogar', async () => {
    await homePage.verifyLoggedInAsVisible();
  });

  await test.step('Clicar em Logout', async () => {
    await homePage.clickLogout();
  });

  await test.step('Verificar que voltou pra tela de login', async () => {
    await signupLoginPage.verifyLoginFormVisible();
  });
});
