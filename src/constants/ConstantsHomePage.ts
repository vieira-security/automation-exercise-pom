// Seletores e textos usados pelos locators do HomePage, centralizados para evitar magic strings.

export const SIGNUP_LOGIN_LINK_SELECTOR = 'a[href="/login"]';
export const CATEGORY_SIDEBAR_SELECTOR = '.left-sidebar h2';
export const CONTACT_US_LINK_SELECTOR = 'a[href="/contact_us"]';
// Escopado no menu: a home também tem botões "Test Cases" no carrossel
// com o mesmo href, o que bateria em 4 elementos (strict mode).
export const TEST_CASES_LINK_SELECTOR = '.shop-menu a[href="/test_cases"]';
export const PRODUCTS_LINK_SELECTOR = 'a[href="/products"]';
export const SUBSCRIBE_EMAIL_INPUT_SELECTOR = '#susbscribe_email';
export const SUBSCRIBE_BUTTON_SELECTOR = '#subscribe';
export const SUBSCRIBE_SUCCESS_MSG_SELECTOR = '#success-subscribe';
export const LOGGED_IN_AS_TEXT = 'Logged in as';
export const DELETE_ACCOUNT_LINK_SELECTOR = 'a[href="/delete_account"]';
export const LOGOUT_LINK_SELECTOR = 'a[href="/logout"]';
export const SUBSCRIBE_SUCCESS_TEXT = 'You have been successfully subscribed!';
