import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ContactUsPage } from '../src/pages/ContactUsPage';

test('Contact Us Form', async ({ page }) => {
  const homePage = new HomePage(page);
  const contactUsPage = new ContactUsPage(page);

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Clicar em Contact Us', async () => {
    await homePage.clickContactUs();
    await contactUsPage.verifyGetInTouchVisible();
  });

  await test.step('Preencher formulário de contato', async () => {
    await contactUsPage.fillContactForm(
      'Gabriel Vieira de Sousa',
      'gabriel@teste.com',
      'Assunto de teste',
      'Esta é uma mensagem de teste automatizada.'
    );
  });

  await test.step('Fazer upload de um arquivo', async () => {
    await contactUsPage.uploadFile('fixtures/sample-upload.txt');
  });

  await test.step('Enviar formulário', async () => {
    await contactUsPage.submitForm();
  });

  await test.step('Verificar mensagem de sucesso', async () => {
    await contactUsPage.verifySuccessMessageVisible();
  });

  await test.step('Clicar no botão Home e verificar que voltou pra home page', async () => {
    await contactUsPage.clickHomeButton();
    await homePage.verifyHomePageVisible();
  });
});
