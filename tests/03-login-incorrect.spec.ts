import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SignupLoginPage } from '../src/pages/SignupLoginPage';

const INVALID_EMAIL = 'naoexiste@teste.com';
const INVALID_PASSWORD = 'senhaErrada123';

test('Login User with incorrect email and password', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Clicar em Signup/Login e verificar formulário', async () => {
    await homePage.clickSignupLogin();
    await signupLoginPage.verifyLoginFormVisible();
  });

  await test.step('Tentar login com email e senha incorretos', async () => {
    await signupLoginPage.login(INVALID_EMAIL, INVALID_PASSWORD);
  });

  await test.step('Verificar mensagem de erro visível', async () => {
    await signupLoginPage.verifyLoginErrorVisible();
  });
});
