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
  WEAK_PASSWORD,
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

// Partição de equivalência inválida: senha só com minúsculas (WEAK_PASSWORD).
// O site não valida força de senha, então a conta deve ser criada normalmente.
test('Register User with a weak (all lowercase) password', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = generateRandomEmail();

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Clicar em Signup/Login e verificar formulário', async () => {
    await homePage.clickSignupLogin();
    await signupLoginPage.verifyNewUserSignupVisible();
  });

  await test.step('Preencher nome e email, clicar Signup', async () => {
    await signupLoginPage.fillSignupNameAndEmail(FULL_NAME, email);
    await signupLoginPage.clickSignupButton();
  });

  await test.step('Verificar Enter Account Information visível', async () => {
    await accountInfoPage.verifyEnterAccountInfoVisible();
  });

  await test.step('Preencher os dados da conta com senha fraca (só minúsculas)', async () => {
    await accountInfoPage.selectTitle(TITLE);
    await accountInfoPage.fillPassword(WEAK_PASSWORD);
    await accountInfoPage.fillDateOfBirth(DATE_OF_BIRTH.day, DATE_OF_BIRTH.month, DATE_OF_BIRTH.year);
    await accountInfoPage.checkNewsletterAndOffers();
    await accountInfoPage.fillNameAndCompany(FIRST_NAME, LAST_NAME, COMPANY);
    await accountInfoPage.fillAddressAndCountry(ADDRESS, ADDRESS_2, COUNTRY);
    await accountInfoPage.fillStateCityZipcodeMobile(STATE, CITY, ZIPCODE, MOBILE_NUMBER);
  });

  await test.step('Clicar em Create Account', async () => {
    await accountInfoPage.clickCreateAccountButton();
  });

  await test.step('Verificar que o site aceitou a senha fraca (conta criada)', async () => {
    await accountCreatedPage.verifyAccountCreatedVisible();
    await accountCreatedPage.clickContinueButton();
  });

  await test.step('Deletar a conta (limpeza)', async () => {
    await homePage.verifyLoggedInAsVisible();
    await homePage.clickDeleteAccount();
    await accountDeletedPage.verifyAccountDeletedVisible();
    await accountDeletedPage.clickContinueButton();
  });
});
