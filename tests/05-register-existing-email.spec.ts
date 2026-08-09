import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SignupLoginPage } from '../src/pages/SignupLoginPage';
import { AccountInformationPage } from '../src/pages/AccountInformationPage';
import { AccountCreatedPage } from '../src/pages/AccountCreatedPage';

test('Register User with existing email', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);

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

  await test.step('Fazer logout pra liberar o menu Signup/Login', async () => {
    await homePage.clickLogout();
  });

  await test.step('Tentar cadastrar novo usuário com o mesmo email', async () => {
    await signupLoginPage.verifyNewUserSignupVisible();
    await signupLoginPage.fillSignupNameAndEmail('Outro Nome', email);
    await signupLoginPage.clickSignupButton();
  });

  await test.step('Verificar erro de email já existente', async () => {
    await signupLoginPage.verifySignupErrorVisible();
  });
});