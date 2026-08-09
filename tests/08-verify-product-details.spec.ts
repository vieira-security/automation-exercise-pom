import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ProductsPage } from '../src/pages/ProductsPage';
import { ProductDetailsPage } from '../src/pages/ProductDetailsPage';
import { blockAds } from '../src/utils/blockAds';

test('Verify All Products and product detail page', async ({ page }) => {
  await blockAds(page);

  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  await test.step('Abrir home page e verificar visibilidade', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  await test.step('Clicar em Products e verificar navegação', async () => {
    await homePage.clickProducts();
    await productsPage.verifyAllProductsVisible();
    await productsPage.verifyProductsListVisible();
  });

  await test.step('Clicar em View Product do primeiro produto', async () => {
    await productsPage.viewFirstProduct();
  });

  await test.step('Verificar detalhes do produto visíveis', async () => {
    await productDetailsPage.verifyProductDetailsVisible();
  });
});
