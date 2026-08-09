import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /products (listagem "All Products" e resultado
 * de busca "Searched Products"). Usada nos cenários 8 (ver detalhes do
 * primeiro produto) e 9 (buscar produto).
 */
export class ProductsPage extends BasePage {
  private readonly allProductsHeading: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchedProductsHeading: Locator;
  private readonly productList: Locator;
  private readonly viewProductLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.allProductsHeading = page.getByText('All Products');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByText('Searched Products');
    this.productList = page.locator('.product-image-wrapper');
    this.viewProductLinks = page.getByRole('link', { name: 'View Product' });
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

  /** Clica no link "View Product" de um produto específico, pelo seu ID numérico. */
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
