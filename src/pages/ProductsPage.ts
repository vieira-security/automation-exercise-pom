import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /products (listagem "All Products" e resultado
 * de busca "Searched Products"). Usada nos cenários 8 (ver detalhes do
 * primeiro produto) e 9 (buscar produto).
 */
export class ProductsPage extends BasePage {
  private readonly allProductsHeading: Locator = this.page.getByText('All Products');
  private readonly searchInput: Locator = this.page.locator('#search_product');
  private readonly searchButton: Locator = this.page.locator('#submit_search');
  private readonly searchedProductsHeading: Locator = this.page.getByText('Searched Products');
  private readonly productList: Locator = this.page.locator('.product-image-wrapper');
  private readonly viewProductLinks: Locator = this.page.getByRole('link', { name: 'View Product' });

  constructor(page: Page) {
    super(page);
  }

  /** Verifica que o heading "All Products" está visível. */
  async verifyAllProductsVisible(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
  }

  /** Verifica que existe ao menos um produto renderizado na grade (lista não vazia). */
  async verifyProductsListVisible(): Promise<void> {
    await expect(this.productList.first()).toBeVisible();
  }

  /** Preenche o campo de busca com o nome do produto e clica no botão de buscar. */
  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  /** Verifica que o heading "Searched Products" (resultado da busca) está visível. */
  async verifySearchedProductsVisible(): Promise<void> {
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  /**
   * Clica no link "View Product" de um produto específico, pelo seu ID numérico.
   * Locator dinâmico (depende de um parâmetro em tempo de execução): por
   * isso continua sendo construído aqui dentro do método, e não como campo
   * da classe.
   */
  async viewProductDetails(productId: number): Promise<void> {
    await this.page.locator(`a[href="/product_details/${productId}"]`).click();
  }

  /**
   * Clica no link "View Product" do primeiro produto da lista atual,
   * sem precisar saber o ID de antemão (usado no cenário 8).
   */
  async viewFirstProduct(): Promise<void> {
    await this.viewProductLinks.first().click();
  }
}
