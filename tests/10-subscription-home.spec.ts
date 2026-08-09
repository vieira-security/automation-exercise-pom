import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { blockAds } from '../src/utils/blockAds';

test('Verify Subscription in home page', async ({ page }) => {
  await blockAds(page);

  const homePage = new HomePage(page);

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Rolar até o rodapé e assinar com um email', async () => {
    await homePage.subscribeWithEmail(`gabriel${Date.now()}@teste.com`);
  });

  await test.step('Verificar mensagem de sucesso da assinatura', async () => {
    await homePage.verifySubscribeSuccess();
  });
});
