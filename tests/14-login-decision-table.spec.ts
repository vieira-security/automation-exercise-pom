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

/**
 * TABELA DE DECISÃO (Decision Table Testing) aplicada ao login.
 *
 * O resultado do login depende de DUAS condições ao mesmo tempo (email e
 * senha), não de uma só — é exatamente esse tipo de situação que a
 * técnica de tabela de decisão foi feita para cobrir de forma sistemática,
 * testando toda combinação possível das condições em vez de só alguns
 * casos escolhidos "no olho".
 *
 * | Regra | Email    | Senha    | Resultado esperado                          |
 * |-------|----------|----------|----------------------------------------------|
 * | 1     | Válido   | Válida   | Login com sucesso ("Logged in as...")         |
 * | 2     | Válido   | Inválida | Erro "Your email or password is incorrect!"   |
 * | 3     | Inválido | Válida   | Erro "Your email or password is incorrect!"   |
 * | 4     | Inválido | Inválida | Erro "Your email or password is incorrect!"   |
 *
 * "Válido"/"inválido" aqui significa "corresponde (ou não) a uma conta
 * que realmente existe no site" — por isso as Regras 1 e 2 precisam criar
 * uma conta de teste antes (só assim existe um email "válido" de
 * referência); as Regras 3 e 4 usam um email que nunca foi cadastrado.
 */

const INVALID_EMAIL = 'naoexiste@teste.com';
const WRONG_PASSWORD = 'senhaErrada123';

// Cria uma conta de teste autossuficiente e devolve o email usado, para
// servir de "email válido" de referência nas Regras 1 e 2.
async function createTestAccount(page: import('@playwright/test').Page): Promise<string> {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);

  const email = generateRandomEmail();

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

  return email;
}

// REGRA 1: Email válido + Senha válida -> login com sucesso.
test('Tabela de decisão - Regra 1: email válido + senha válida', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = await createTestAccount(page);

  await test.step('Logout (a conta fica criada, mas deslogada)', async () => {
    await homePage.verifyLoggedInAsVisible();
    await homePage.clickLogout();
  });

  await test.step('Login com email e senha válidos', async () => {
    await signupLoginPage.verifyLoginFormVisible();
    await signupLoginPage.login(email, PASSWORD);
  });

  await test.step('Verificar login com sucesso', async () => {
    await homePage.verifyLoggedInAsVisible();
  });

  await test.step('Deletar a conta (limpeza)', async () => {
    await homePage.clickDeleteAccount();
    await accountDeletedPage.verifyAccountDeletedVisible();
    await accountDeletedPage.clickContinueButton();
  });
});

// REGRA 2: Email válido + Senha inválida -> erro de credenciais.
test('Tabela de decisão - Regra 2: email válido + senha inválida', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = await createTestAccount(page);

  await test.step('Logout (a conta fica criada, mas deslogada)', async () => {
    await homePage.verifyLoggedInAsVisible();
    await homePage.clickLogout();
  });

  await test.step('Tentar login com email válido e senha errada', async () => {
    await signupLoginPage.verifyLoginFormVisible();
    await signupLoginPage.login(email, WRONG_PASSWORD);
  });

  await test.step('Verificar mensagem de erro visível', async () => {
    await signupLoginPage.verifyLoginErrorVisible();
  });

  await test.step('Login de verdade para poder limpar a conta', async () => {
    await signupLoginPage.login(email, PASSWORD);
    await homePage.verifyLoggedInAsVisible();
  });

  await test.step('Deletar a conta (limpeza)', async () => {
    await homePage.clickDeleteAccount();
    await accountDeletedPage.verifyAccountDeletedVisible();
    await accountDeletedPage.clickContinueButton();
  });
});

// REGRA 3: Email inválido + Senha válida -> erro de credenciais.
// Não precisa criar conta: o email usado nunca existiu no site.
test('Tabela de decisão - Regra 3: email inválido + senha válida', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);

  await test.step('Abrir home page e ir para o formulário de login', async () => {
    await homePage.open();
    await homePage.clickSignupLogin();
    await signupLoginPage.verifyLoginFormVisible();
  });

  await test.step('Tentar login com email inexistente e senha em formato válido', async () => {
    await signupLoginPage.login(INVALID_EMAIL, PASSWORD);
  });

  await test.step('Verificar mensagem de erro visível', async () => {
    await signupLoginPage.verifyLoginErrorVisible();
  });
});

// REGRA 4: Email inválido + Senha inválida -> erro de credenciais.
test('Tabela de decisão - Regra 4: email inválido + senha inválida', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);

  await test.step('Abrir home page e ir para o formulário de login', async () => {
    await homePage.open();
    await homePage.clickSignupLogin();
    await signupLoginPage.verifyLoginFormVisible();
  });

  await test.step('Tentar login com email e senha inexistentes', async () => {
    await signupLoginPage.login(INVALID_EMAIL, WRONG_PASSWORD);
  });

  await test.step('Verificar mensagem de erro visível', async () => {
    await signupLoginPage.verifyLoginErrorVisible();
  });
});
