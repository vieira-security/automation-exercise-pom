import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  ALL_PRODUCTS_TEXT,
  SEARCH_INPUT_SELECTOR,
  SEARCH_BUTTON_SELECTOR,
  SEARCHED_PRODUCTS_TEXT,
  PRODUCT_LIST_SELECTOR,
  VIEW_PRODUCT_LINK_NAME,
  PRODUCT_DETAILS_HREF_PREFIX,
} from '../constants/ConstantsProductsPage';

export class ProductsPage extends BasePage {
  private readonly allProductsHeading: Locator = this.page.getByText(ALL_PRODUCTS_TEXT);
  private readonly searchInput: Locator = this.page.locator(SEARCH_INPUT_SELECTOR);
  private readonly searchButton: Locator = this.page.locator(SEARCH_BUTTON_SELECTOR);
  private readonly searchedProductsHeading: Locator = this.page.getByText(SEARCHED_PRODUCTS_TEXT);
  private readonly productList: Locator = this.page.locator(PRODUCT_LIST_SELECTOR);
  private readonly viewProductLinks: Locator = this.page.getByRole('link', { name: VIEW_PRODUCT_LINK_NAME });

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
    await this.page.locator(`a[href="${PRODUCT_DETAILS_HREF_PREFIX}${productId}"]`).click();
  }

  async viewFirstProduct(): Promise<void> {
    await this.viewProductLinks.first().click();
  }
}
