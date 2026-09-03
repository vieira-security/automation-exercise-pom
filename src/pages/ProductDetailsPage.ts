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
  CART_MODAL_VIEW_CART_LINK_SELECTOR,
  CART_QUANTITY_VALUE_SELECTOR,
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
  private readonly viewCartModalLink: Locator = this.page.locator(CART_MODAL_VIEW_CART_LINK_SELECTOR);
  private readonly cartQuantityValue: Locator = this.page.locator(CART_QUANTITY_VALUE_SELECTOR);

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

  // Após "Add to Cart" o site abre um modal "Added!" com um link "View
  // Cart"; usamos esse link em vez de navegar direto pra /view_cart pra
  // seguir o mesmo fluxo que um usuário real seguiria.
  async goToCartFromAddedModal(): Promise<void> {
    await this.viewCartModalLink.click();
  }

  // Lê a quantidade exibida na página /view_cart para o produto recém
  // adicionado. Útil para BVA: confirma se o site respeita (ou não) o
  // atributo min="1" do campo quantity ao exibir o valor no carrinho.
  async verifyQuantityInCart(expectedQuantity: string): Promise<void> {
    await expect(this.cartQuantityValue.first()).toHaveText(expectedQuantity);
  }
}
