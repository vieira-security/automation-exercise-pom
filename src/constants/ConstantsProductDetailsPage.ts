// Seletores e textos usados pelos locators do ProductDetailsPage, centralizados para evitar magic strings.

export const PRODUCT_NAME_SELECTOR = '.product-information h2';
export const PRODUCT_INFO_PARAGRAPH_SELECTOR = '.product-information p';
export const PRODUCT_PRICE_SELECTOR = '.product-information span span';
export const QUANTITY_INPUT_SELECTOR = '#quantity';
export const ADD_TO_CART_BUTTON_SELECTOR = '.product-information button.cart';
export const CATEGORY_TEXT = 'Category:';
export const AVAILABILITY_TEXT = 'Availability:';
export const CONDITION_TEXT = 'Condition:';
export const BRAND_TEXT = 'Brand:';

// Modal "Added!" que aparece após clicar em Add to Cart, e a quantidade
// exibida na página /view_cart para onde o link "View Cart" do modal leva.
// Tecnicamente pertencem à página de carrinho, não a esta — mantidos aqui
// (locators simples, sem CartPage dedicada) só para viabilizar o teste de
// BVA da quantidade sem criar uma Page Object nova para um único uso.
export const CART_MODAL_VIEW_CART_LINK_SELECTOR = '#cartModal a[href="/view_cart"]';
export const CART_QUANTITY_VALUE_SELECTOR = '.cart_quantity button';
