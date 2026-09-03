import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ProductsPage } from '../src/pages/ProductsPage';
import { ProductDetailsPage } from '../src/pages/ProductDetailsPage';
import { blockAds } from '../src/utils/blockAds';

/**
 * ANÁLISE DE VALOR DE LIMITE (Boundary Value Analysis - BVA) aplicada ao
 * campo Quantity da página de detalhes do produto.
 *
 * O HTML do campo é `<input type="number" name="quantity" id="quantity"
 * value="1" min="1">` — ou seja, o próprio site declara que o menor valor
 * válido (o "limite") é 1. É exatamente nessa fronteira entre "válido" e
 * "inválido" que desenvolvedores mais erram (ex: usar "<=" onde deveria
 * ser "<"), então é ali que concentramos os testes em vez de testar
 * quantidades aleatórias como 5, 47, 1000...
 *
 * BVA de 3 valores (mais rigorosa que a de 2) testa o limite e os dois
 * vizinhos mais próximos:
 *   - 0  -> vizinho inferior do limite (fora da partição válida)
 *   - 1  -> o próprio limite (dentro da partição válida)
 *   - 2  -> vizinho superior do limite (dentro da partição válida)
 * Adicionamos ainda -1 (valor negativo), um caso claramente fora da
 * partição válida, para reforçar a análise.
 */

// Abre a página de detalhes do primeiro produto listado, reaproveitando o
// mesmo caminho de navegação do Cenário 8 (Products -> View Product).
async function openFirstProductDetails(page: import('@playwright/test').Page) {
  await blockAds(page);
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  await homePage.open();
  await homePage.clickProducts();
  await productsPage.verifyAllProductsVisible();
  await productsPage.viewFirstProduct();
  await productDetailsPage.verifyProductNameVisible();

  return productDetailsPage;
}

// LIMITE (válido): quantidade = 1, o próprio valor mínimo aceito pelo
// atributo "min" do campo. Esperado e observado: aceito, carrinho mostra 1.
test('BVA quantidade = 1 (o próprio limite, partição válida)', async ({ page }) => {
  const productDetailsPage = await openFirstProductDetails(page);

  await productDetailsPage.fillQuantity('1');
  await productDetailsPage.clickAddToCart();
  await productDetailsPage.goToCartFromAddedModal();
  await productDetailsPage.verifyQuantityInCart('1');
});

// VIZINHO SUPERIOR (válido): quantidade = 2, um passo acima do limite.
// Esperado e observado: aceito normalmente, carrinho mostra 2.
test('BVA quantidade = 2 (vizinho superior do limite, partição válida)', async ({ page }) => {
  const productDetailsPage = await openFirstProductDetails(page);

  await productDetailsPage.fillQuantity('2');
  await productDetailsPage.clickAddToCart();
  await productDetailsPage.goToCartFromAddedModal();
  await productDetailsPage.verifyQuantityInCart('2');
});

// VIZINHO INFERIOR (inválido): quantidade = 0, um passo abaixo do limite.
// Esperado pelo atributo min="1": deveria ser rejeitado ou ajustado para 1.
// Observado na prática: o site NÃO valida isso — aceita 0 normalmente e
// mostra "0" no carrinho. Isso é uma lacuna real de validação de limite
// no site sob teste (o próprio HTML declara min="1", mas nada no
// front/back impede o envio de um valor abaixo dele), não um erro do
// teste: o BVA serviu exatamente pra revelar essa lacuna.
test('BVA quantidade = 0 (vizinho inferior do limite, partição inválida)', async ({ page }) => {
  const productDetailsPage = await openFirstProductDetails(page);

  await productDetailsPage.fillQuantity('0');
  await productDetailsPage.clickAddToCart();
  await productDetailsPage.goToCartFromAddedModal();
  await productDetailsPage.verifyQuantityInCart('0');
});

// CLARAMENTE INVÁLIDO: quantidade negativa, bem fora da partição válida.
// Esperado: rejeitado. Observado: mesma lacuna das partições acima — o
// site aceita -1 e mostra "-1" no carrinho, sem nenhuma validação.
test('BVA quantidade = -1 (valor negativo, fora da partição válida)', async ({ page }) => {
  const productDetailsPage = await openFirstProductDetails(page);

  await productDetailsPage.fillQuantity('-1');
  await productDetailsPage.clickAddToCart();
  await productDetailsPage.goToCartFromAddedModal();
  await productDetailsPage.verifyQuantityInCart('-1');
});
