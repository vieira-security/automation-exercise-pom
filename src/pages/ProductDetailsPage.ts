import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  PRODUCT_NAME_SELECTOR,
  PRODUCT_INFO_PARAGRAPH_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  QUANTITY_INPUT_SELECTOR,
  ADD_TO_CART_BUTTON_SELECTOR,
  CATEGORY_TEXT,
  AVAILABILITY_TEXT,
  CONDITION_TEXT,
  BRAND_TEXT,
} from '../constants/ConstantsProductDetailsPage';

export class ProductDetailsPage extends BasePage {
  private readonly productName: Locator = this.page.locator(PRODUCT_NAME_SELECTOR);
  private readonly productCategory: Locator = this.page.locator(PRODUCT_INFO_PARAGRAPH_SELECTOR).filter({ hasText: CATEGORY_TEXT });
  private readonly productPrice: Locator = this.page.locator(PRODUCT_PRICE_SELECTOR).first();
  private readonly productAvailability: Locator = this.page.locator(PRODUCT_INFO_PARAGRAPH_SELECTOR).filter({ hasText: AVAILABILITY_TEXT });
  private readonly productCondition: Locator = this.page.locator(PRODUCT_INFO_PARAGRAPH_SELECTOR).filter({ hasText: CONDITION_TEXT });
  private readonly productBrand: Locator = this.page.locator(PRODUCT_INFO_PARAGRAPH_SELECTOR).filter({ hasText: BRAND_TEXT });
  private readonly quantityInput: Locator = this.page.locator(QUANTITY_INPUT_SELECTOR);
  private readonly addToCartButton: Locator = this.page.locator(ADD_TO_CART_BUTTON_SELECTOR);

  constructor(page: Page) {
    super(page);
  }

  async verifyProductNameVisible(): Promise<void> {
    await expect(this.productName).toBeVisible();
  }

  async verifyProductDetailsVisible(): Promise<void> {
    await expect(this.productName).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productCategory).toContainText(CATEGORY_TEXT);
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productAvailability).toContainText(AVAILABILITY_TEXT);
    await expect(this.productCondition).toBeVisible();
    await expect(this.productCondition).toContainText(CONDITION_TEXT);
    await expect(this.productBrand).toBeVisible();
    await expect(this.productBrand).toContainText(BRAND_TEXT);
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
