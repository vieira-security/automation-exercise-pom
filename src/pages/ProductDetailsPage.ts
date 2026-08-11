import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /product_details/{id}, com nome, categoria,
 * preço, disponibilidade, condição e marca do produto, além da ação de
 * adicionar ao carrinho. Usada no cenário 8.
 */
export class ProductDetailsPage extends BasePage {
  private readonly productName: Locator = this.page.locator('.product-information h2');
  private readonly productCategory: Locator = this.page.locator('.product-information p').filter({ hasText: 'Category:' });
  private readonly productPrice: Locator = this.page.locator('.product-information span span').first();
  private readonly productAvailability: Locator = this.page.locator('.product-information p').filter({ hasText: 'Availability:' });
  private readonly productCondition: Locator = this.page.locator('.product-information p').filter({ hasText: 'Condition:' });
  private readonly productBrand: Locator = this.page.locator('.product-information p').filter({ hasText: 'Brand:' });
  private readonly quantityInput: Locator = this.page.locator('#quantity');
  private readonly addToCartButton: Locator = this.page.locator('.product-information button.cart');

  constructor(page: Page) {
    super(page);
  }

  /** Verifica que o nome do produto (heading) está visível. */
  async verifyProductNameVisible(): Promise<void> {
    await expect(this.productName).toBeVisible();
  }

  /**
   * Verifica que todos os detalhes do produto exigidos pelo cenário 8
   * estão visíveis: nome, categoria, preço, disponibilidade, condição e marca.
   */
  async verifyProductDetailsVisible(): Promise<void> {
    await expect(this.productName).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productCategory).toContainText('Category:');
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productAvailability).toContainText('Availability:');
    await expect(this.productCondition).toBeVisible();
    await expect(this.productCondition).toContainText('Condition:');
    await expect(this.productBrand).toBeVisible();
    await expect(this.productBrand).toContainText('Brand:');
  }

  /** Preenche o campo de quantidade antes de adicionar ao carrinho. */
  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  /** Clica no botão "Add to cart". */
  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
