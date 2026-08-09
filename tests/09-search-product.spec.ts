import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ProductsPage } from '../src/pages/ProductsPage';
import { blockAds } from '../src/utils/blockAds';

test('Search Product', async ({ page }) => {
  await blockAds(page);

  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Clicar em Products e verificar navegação', async () => {
    await homePage.clickProducts();
    await productsPage.verifyAllProductsVisible();
  });

  await test.step('Buscar por um produto', async () => {
    await productsPage.searchProduct('Top');
  });

  await test.step('Verificar Searched Products e lista de resultados', async () => {
    await productsPage.verifySearchedProductsVisible();
    await productsPage.verifyProductsListVisible();
  });
});
