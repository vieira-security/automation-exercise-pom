import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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

  async verifyAllProductsVisible(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
  }

  async verifyProductsListVisible(): Promise<void> {
    await expect(this.productList.first()).toBeVisible();
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async verifySearchedProductsVisible(): Promise<void> {
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  // Locator dinâmico (depende do ID em tempo de execução): fica no método,
  // não vira campo da classe.
  async viewProductDetails(productId: number): Promise<void> {
    await this.page.locator(`a[href="/product_details/${productId}"]`).click();
  }

  async viewFirstProduct(): Promise<void> {
    await this.viewProductLinks.first().click();
  }
}
