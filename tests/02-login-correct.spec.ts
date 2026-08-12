import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SignupLoginPage } from '../src/pages/SignupLoginPage';
import { AccountInformationPage } from '../src/pages/AccountInformationPage';
import { AccountCreatedPage } from '../src/pages/AccountCreatedPage';
import { AccountDeletedPage } from '../src/pages/AccountDeletedPage';
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

test('Login User with correct email and password', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = generateRandomEmail();

  await test.step('Criar uma conta de teste (setup)', async () => {
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

  await test.step('Fazer logout', async () => {
    await homePage.verifyLoggedInAsVisible();
    await homePage.clickLogout();
  });

  await test.step('Fazer login com o email e senha corretos', async () => {
    await signupLoginPage.verifyLoginFormVisible();
    await signupLoginPage.login(email, PASSWORD);
  });

  await test.step('Verificar que logou com sucesso', async () => {
    await homePage.verifyLoggedInAsVisible();
  });

  await test.step('Deletar a conta (limpeza)', async () => {
    await homePage.clickDeleteAccount();
    await accountDeletedPage.verifyAccountDeletedVisible();
    await accountDeletedPage.clickContinueButton();
  });
});
