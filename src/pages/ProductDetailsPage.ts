import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object da página /product_details/{id}, com nome, categoria,
 * preço, disponibilidade, condição e marca do produto, além da ação de
 * adicionar ao carrinho. Usada no cenário 8.
 */
export class ProductDetailsPage extends BasePage {
  private readonly productName: Locator;
  private readonly productCategory: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  private readonly productCondition: Locator;
  private readonly productBrand: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p').filter({ hasText: 'Category:' });
    this.productPrice = page.locator('.product-information span span').first();
    this.productAvailability = page.locator('.product-information p').filter({ hasText: 'Availability:' });
    this.productCondition = page.locator('.product-information p').filter({ hasText: 'Condition:' });
    this.productBrand = page.locator('.product-information p').filter({ hasText: 'Brand:' });
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('.product-information button.cart');
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
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productCondition).toBeVisible();
    await expect(this.productBrand).toBeVisible();
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
