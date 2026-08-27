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

/**
 * COBERTURA DE DECISÃO (Decision/Branch Coverage) aplicada ao método
 * `AccountInformationPage.selectTitle()`:
 *
 *   async selectTitle(title: 'Mr' | 'Mrs'): Promise<void> {
 *     if (title === 'Mr') {
 *       await this.titleMr.check();   // Ramo 1 ("if")
 *     } else {
 *       await this.titleMrs.check();  // Ramo 2 ("else")
 *     }
 *   }
 *
 * Um if/else só tem 100% de cobertura de decisão quando existe pelo
 * menos um teste que força a condição a ser VERDADEIRA (Ramo 1) e outro
 * que força a condição a ser FALSA (Ramo 2). Todos os testes do projeto
 * até aqui (01, 02, 04, 05 e o antigo 11) chamam selectTitle(TITLE), e
 * TITLE em testData.ts vale sempre 'Mr' — ou seja, só o Ramo 1 era
 * exercitado. Cobertura de decisão desse método antes deste teste: 50%.
 *
 * Este teste chama selectTitle('Mrs') para exercitar o Ramo 2 pelo menos
 * uma vez. Com isso, a cobertura de decisão de selectTitle() passa a
 * ser 100% (ambos os ramos, 'Mr' e 'Mrs', cobertos por pelo menos um teste).
 */
test('Cadastro selecionando title Mrs (cobre o ramo else de selectTitle)', async ({ page }) => {
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

  await test.step('Preencher os dados da conta escolhendo title Mrs', async () => {
    await accountInfoPage.selectTitle('Mrs');
    await accountInfoPage.fillPassword(PASSWORD);
    await accountInfoPage.fillDateOfBirth(DATE_OF_BIRTH.day, DATE_OF_BIRTH.month, DATE_OF_BIRTH.year);
    await accountInfoPage.checkNewsletterAndOffers();
    await accountInfoPage.fillNameAndCompany(FIRST_NAME, LAST_NAME, COMPANY);
    await accountInfoPage.fillAddressAndCountry(ADDRESS, ADDRESS_2, COUNTRY);
    await accountInfoPage.fillStateCityZipcodeMobile(STATE, CITY, ZIPCODE, MOBILE_NUMBER);
  });

  await test.step('Clicar em Create Account', async () => {
    await accountInfoPage.clickCreateAccountButton();
  });

  await test.step('Verificar Account Created e clicar Continue', async () => {
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
