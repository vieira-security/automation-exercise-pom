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

/**
 * Aplica a técnica de PARTIÇÃO DE EQUIVALÊNCIA no campo de senha:
 * em vez de exercitar todas as combinações possíveis de senha, testa
 * um representante da partição "senha fraca" (só letras minúsculas,
 * sem maiúscula, número ou símbolo — ver WEAK_PASSWORD em testData.ts).
 *
 * automationexercise.com NÃO valida a força da senha no cadastro (aceita
 * qualquer valor não vazio no campo), então o resultado esperado aqui é
 * a conta sendo criada normalmente. O teste documenta esse comportamento
 * real do site — se um dia o site passar a exigir senha forte, este
 * teste vai falhar em verifyAccountCreatedVisible() e sinalizar a mudança.
 */
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
    await accountInfoPage.selectTitle('Mr');
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
