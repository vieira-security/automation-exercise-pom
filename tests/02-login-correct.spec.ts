import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SignupLoginPage } from '../src/pages/SignupLoginPage';
import { AccountInformationPage } from '../src/pages/AccountInformationPage';
import { AccountCreatedPage } from '../src/pages/AccountCreatedPage';
import { AccountDeletedPage } from '../src/pages/AccountDeletedPage';

test('Login User with correct email and password', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = `gabriel${Date.now()}@teste.com`;
  const password = 'Senha123!';

  await test.step('Criar uma conta de teste (setup)', async () => {
    await homePage.open();
    await homePage.clickSignupLogin();
    await signupLoginPage.fillSignupNameAndEmail('Gabriel Vieira de Sousa', email);
    await signupLoginPage.clickSignupButton();

    await accountInfoPage.selectTitle('Mr');
    await accountInfoPage.fillPassword(password);
    await accountInfoPage.fillDateOfBirth('10', '5', '1998');
    await accountInfoPage.checkNewsletterAndOffers();
    await accountInfoPage.fillNameAndCompany('Gabriel', 'Sousa', 'Minha Empresa');
    await accountInfoPage.fillAddressAndCountry('Rua Teste, 123', 'Apto 45', 'Canada');
    await accountInfoPage.fillStateCityZipcodeMobile('SP', 'Sao Paulo', '01000-000', '11999999999');
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
    await signupLoginPage.login(email, password);
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