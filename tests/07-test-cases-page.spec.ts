import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { TestCasesPage } from '../src/pages/TestCasesPage';
import { blockAds } from '../src/utils/blockAds';

test('Verify Test Cases Page', async ({ page }) => {
  await blockAds(page);

  const homePage = new HomePage(page);
  const testCasesPage = new TestCasesPage(page);

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Clicar em Test Cases e verificar navegação', async () => {
    await homePage.clickTestCases();
    await testCasesPage.verifyTestCasesPageVisible();
  });
});
