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
  WEAK_PASSWORD,
  SHORT_PASSWORD,
  EMPTY_PASSWORD,
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
 * PARTIÇÃO DE EQUIVALÊNCIA aplicada ao campo de senha do cadastro.
 *
 * Em vez de testar dezenas de senhas diferentes, dividimos as entradas
 * possíveis em grupos ("partições") onde se espera que todo valor do
 * mesmo grupo se comporte da mesma forma no site. Testamos só UM valor
 * representante de cada grupo:
 *   1. válida  -> senha forte (maiúscula + minúscula + número)
 *   2. inválida -> só letras minúsculas
 *   3. inválida -> muito curta
 *   4. inválida -> vazia
 *
 * "Válida"/"inválida" aqui descreve a intenção de uma senha robusta,
 * não necessariamente o que o site aceita — automationexercise.com não
 * implementa validação de força de senha, então as partições 1, 2 e 3
 * são todas aceitas e criam a conta normalmente. Isso não é um erro do
 * teste: é uma lacuna de validação do próprio site, e os testes abaixo
 * documentam esse comportamento real observado. Só a partição 4 (senha
 * vazia) é rejeitada, porque o formulário não avança sem preenchê-la.
 */

// Preenche e envia o formulário de cadastro reaproveitando o fluxo comum
// às 4 partições. Cada teste decide o que verificar depois, pois o
// resultado esperado (conta criada ou formulário rejeitado) muda por partição.
async function submitRegistrationWithPassword(
  page: import('@playwright/test').Page,
  password: string
) {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = generateRandomEmail();

  await homePage.open();
  await homePage.verifyHomePageVisible();
  await homePage.clickSignupLogin();
  await signupLoginPage.verifyNewUserSignupVisible();
  await signupLoginPage.fillSignupNameAndEmail(FULL_NAME, email);
  await signupLoginPage.clickSignupButton();
  await accountInfoPage.verifyEnterAccountInfoVisible();

  await accountInfoPage.selectTitle(TITLE);
  await accountInfoPage.fillPassword(password);
  await accountInfoPage.fillDateOfBirth(DATE_OF_BIRTH.day, DATE_OF_BIRTH.month, DATE_OF_BIRTH.year);
  await accountInfoPage.checkNewsletterAndOffers();
  await accountInfoPage.fillNameAndCompany(FIRST_NAME, LAST_NAME, COMPANY);
  await accountInfoPage.fillAddressAndCountry(ADDRESS, ADDRESS_2, COUNTRY);
  await accountInfoPage.fillStateCityZipcodeMobile(STATE, CITY, ZIPCODE, MOBILE_NUMBER);
  await accountInfoPage.clickCreateAccountButton();

  return { homePage, accountInfoPage, accountCreatedPage, accountDeletedPage };
}

// Confirma que a conta foi criada e deleta em seguida, para não deixar
// contas de teste acumulando no site. Reaproveitado pelas 3 partições
// aceitas (1, 2 e 3).
async function confirmAccountCreatedAndCleanUp(pages: {
  homePage: HomePage;
  accountCreatedPage: AccountCreatedPage;
  accountDeletedPage: AccountDeletedPage;
}) {
  await pages.accountCreatedPage.verifyAccountCreatedVisible();
  await pages.accountCreatedPage.clickContinueButton();
  await pages.homePage.verifyLoggedInAsVisible();
  await pages.homePage.clickDeleteAccount();
  await pages.accountDeletedPage.verifyAccountDeletedVisible();
  await pages.accountDeletedPage.clickContinueButton();
}

// PARTIÇÃO 1 (válida): senha forte, com maiúscula, minúscula e número.
// Resultado esperado e observado: site aceita e cria a conta normalmente.
test('Cadastro com senha forte (partição válida)', async ({ page }) => {
  const pages = await submitRegistrationWithPassword(page, PASSWORD);
  await confirmAccountCreatedAndCleanUp(pages);
});

// PARTIÇÃO 2 (inválida): senha só com letras minúsculas, sem
// maiúscula/número/símbolo. Resultado esperado e observado: o site NÃO
// valida força de senha, então a conta é criada normalmente mesmo assim
// — o que expõe uma lacuna de validação do sistema sob teste.
test('Cadastro com senha totalmente minúscula (partição inválida)', async ({ page }) => {
  const pages = await submitRegistrationWithPassword(page, WEAK_PASSWORD);
  await confirmAccountCreatedAndCleanUp(pages);
});

// PARTIÇÃO 3 (inválida): senha muito curta (3 caracteres). Resultado
// esperado e observado: o site não impõe tamanho mínimo, então a conta
// também é criada normalmente — mesma lacuna de validação da partição 2.
test('Cadastro com senha muito curta (partição inválida)', async ({ page }) => {
  const pages = await submitRegistrationWithPassword(page, SHORT_PASSWORD);
  await confirmAccountCreatedAndCleanUp(pages);
});

// PARTIÇÃO 4 (inválida): campo de senha deixado em branco. Resultado
// observado: diferente das partições 2 e 3, aqui o site REJEITA o envio
// — o formulário não avança para "Account Created" e permanece na
// própria tela "Enter Account Information". Não há conta criada, logo
// não há necessidade (nem como) fazer limpeza via Delete Account.
test('Cadastro com senha vazia (partição inválida)', async ({ page }) => {
  const { accountInfoPage } = await submitRegistrationWithPassword(page, EMPTY_PASSWORD);
  await accountInfoPage.verifyEnterAccountInfoVisible();
});
