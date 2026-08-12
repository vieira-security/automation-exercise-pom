// Seletores e textos usados pelos locators do SignupLoginPage, centralizados para evitar magic strings.

export const NEW_USER_SIGNUP_TEXT = 'New User Signup';
export const SIGNUP_NAME_INPUT_SELECTOR = 'input[data-qa="signup-name"]';
export const SIGNUP_EMAIL_INPUT_SELECTOR = 'input[data-qa="signup-email"]';
export const SIGNUP_BUTTON_SELECTOR = 'button[data-qa="signup-button"]';
export const LOGIN_HEADING_TEXT = 'Login to your account';
export const LOGIN_EMAIL_INPUT_SELECTOR = 'input[data-qa="login-email"]';
export const LOGIN_PASSWORD_INPUT_SELECTOR = 'input[data-qa="login-password"]';
export const LOGIN_BUTTON_SELECTOR = 'button[data-qa="login-button"]';
export const LOGIN_ERROR_MSG_SELECTOR = 'form[action="/login"] p';
export const SIGNUP_ERROR_MSG_SELECTOR = 'form[action="/signup"] p';
export const LOGIN_ERROR_TEXT = 'Your email or password is incorrect!';
export const SIGNUP_ERROR_TEXT = 'Email Address already exist!';
