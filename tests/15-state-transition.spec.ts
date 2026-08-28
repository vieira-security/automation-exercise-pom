import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SignupLoginPage } from '../src/pages/SignupLoginPage';
import { AccountInformationPage } from '../src/pages/AccountInformationPage';
import { AccountCreatedPage } from '../src/pages/AccountCreatedPage';
import { AccountDeletedPage } from '../src/pages/AccountDeletedPage';
import {
  FULL_NAME,
  FIRST_NAME,
  LAST_NAME,
  COMPANY,
  TITLE,
  PASSWORD,
  DATE_OF_BIRTH,
  ADDRESS,
  ADDRESS_2,
  COUNTRY,
  STATE,
  CITY,
  ZIPCODE,
  MOBILE_NUMBER,
  generateRandomEmail,
} from './testData';

/**
 * TESTE DE TRANSIÇÃO DE ESTADO (State Transition Testing) aplicado ao
 * ciclo de vida da sessão de um usuário no site.
 *
 * A ideia da técnica é modelar o sistema como uma "máquina de estados":
 * quais situações (estados) o usuário pode estar, quais ações (eventos)
 * fazem ele passar de um estado para outro, e o que acontece quando se
 * tenta uma ação que NÃO deveria ser permitida no estado atual.
 *
 * Diagrama de estados (ASCII):
 *
 *   ┌──────────┐  cadastro bem-sucedido   ┌─────────┐
 *   │ Anônimo  │ ───────────────────────► │ Logado  │
 *   │          │ ◄─────────────────────── │         │
 *   └────┬─────┘        logout            └────┬────┘
 *        │                                     │
 *        │ login com credenciais               │ delete account
 *        │ de conta existente                  │ (conta deixa de existir)
 *        └─────────────────────────────────────┘
 *                         ▲
 *                         │ volta para Anônimo, mas agora
 *                         │ SEM conta nenhuma para logar de novo
 *
 *   Estados: Anônimo, Logado (Deslogado é o mesmo estado "Anônimo", só
 *   que com a conta ainda existindo no banco — a diferença não é visível
 *   pela UI, só pelo fato de o login com aquelas credenciais ainda
 *   funcionar depois).
 *
 *   Transições válidas modeladas:
 *   - Anônimo --(cadastro bem-sucedido)--> Logado
 *   - Logado --(logout)--> Anônimo (conta ainda existe)
 *   - Anônimo --(login com credenciais da conta existente)--> Logado
 *   - Logado --(delete account)--> Anônimo (conta não existe mais)
 */

test('Cobertura de todos os estados: Anônimo -> Logado -> Anônimo (deslogado) -> Logado -> Conta deletada', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInfoPage = new AccountInformationPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const email = generateRandomEmail();

  // ESTADO 1: Anônimo. Ninguém logado, nenhuma conta criada ainda.
  await test.step('[Estado: Anônimo] Abrir home page', async () => {
    await homePage.open();
    await homePage.verifyHomePageVisible();
  });

  // TRANSIÇÃO: Anônimo --(cadastro bem-sucedido)--> Logado.
  await test.step('[Transição: cadastro] Criar uma conta nova', async () => {
    await homePage.clickSignupLogin();
    await signupLoginPage.fillSignupNameAndEmail(FULL_NAME, email);
    await signupLoginPage.clickSignupButton();

    await accountInfoPage.selectTitle(TITLE);
    await accountInfoPage.fillPassword(PASSWORD);
    await accountInfoPage.fillDateOfBirth(DATE_OF_BIRTH.day, DATE_OF_BIRTH.month, DATE_OF_BIRTH.year);
    await accountInfoPage.checkNewsletterAndOffers();
    await accountInfoPage.fillNameAndCompany(FIRST_NAME, LAST_NAME, COMPANY);
    await accountInfoPage.fillAddressAndCountry(ADDRESS, ADDRESS_2, COUNTRY);
    await accountInfoPage.fillStateCityZipcodeMobile(STATE, CITY, ZIPCODE, MOBILE_NUMBER);
    await accountInfoPage.clickCreateAccountButton();

    await accountCreatedPage.verifyAccountCreatedVisible();
    await accountCreatedPage.clickContinueButton();
  });

  // ESTADO 2: Logado. A conta existe e a sessão está ativa.
  await test.step('[Estado: Logado] Verificar "Logged in as" visível', async () => {
    await homePage.verifyLoggedInAsVisible();
  });

  // TRANSIÇÃO: Logado --(logout)--> Anônimo, mas a conta continua existindo.
  await test.step('[Transição: logout] Deslogar', async () => {
    await homePage.clickLogout();
  });

  // ESTADO 3: Anônimo (deslogado). Visualmente igual ao Estado 1, mas a
  // conta ainda existe — é o que a próxima transição (login) comprova.
  await test.step('[Estado: Anônimo/deslogado] Verificar que voltou pra tela de login', async () => {
    await signupLoginPage.verifyLoginFormVisible();
  });

  // TRANSIÇÃO: Anônimo --(login com credenciais da conta existente)--> Logado.
  await test.step('[Transição: login] Logar de novo com a mesma conta', async () => {
    await signupLoginPage.login(email, PASSWORD);
  });

  // ESTADO 4: Logado novamente — prova de que a conta sobreviveu ao logout.
  await test.step('[Estado: Logado] Verificar "Logged in as" visível de novo', async () => {
    await homePage.verifyLoggedInAsVisible();
  });

  // TRANSIÇÃO: Logado --(delete account)--> Anônimo, e a conta deixa de existir.
  await test.step('[Transição: delete account] Deletar a conta', async () => {
    await homePage.clickDeleteAccount();
  });

  // ESTADO 5: Anônimo, e desta vez sem conta nenhuma por trás — a conta
  // foi destruída, não é só uma sessão encerrada.
  await test.step('[Estado: Anônimo, conta deletada] Verificar "Account Deleted!"', async () => {
    await accountDeletedPage.verifyAccountDeletedVisible();
    await accountDeletedPage.clickContinueButton();
  });
});

/**
 * TRANSIÇÃO INVÁLIDA: tentar acessar /delete_account diretamente pela URL
 * estando no estado Anônimo (sem sessão ativa nenhuma).
 *
 * Resultado esperado de um sistema bem projetado: redirecionar para o
 * login ou mostrar algum erro de acesso negado, já que "deletar a conta"
 * só faz sentido para quem está no estado Logado.
 *
 * Resultado REAL observado (investigado empiricamente navegando direto
 * pra URL sem nenhum login prévio): o site exibe a mesma página de
 * confirmação "ACCOUNT DELETED!" normalmente usada após um delete
 * legítimo — sem checar se existe sessão ativa. Ou seja, a rota não
 * valida o estado atual antes de renderizar a resposta.
 *
 * Isso é registrado aqui como uma observação de robustez do fluxo de
 * estados (não necessariamente uma falha de segurança grave, já que não
 * existe uma conta real de terceiros sendo apagada nesse cenário — o
 * servidor simplesmente não tem sessão nenhuma para agir em cima), mas é
 * exatamente o tipo de comportamento que a técnica de Transição de
 * Estado existe para revelar: uma transição que o sistema deveria barrar
 * e não barra.
 */
test('Transição inválida: acessar /delete_account estando Anônimo (sem login)', async ({ page }) => {
  await page.goto('/delete_account');

  const accountDeletedPage = new AccountDeletedPage(page);
  // Comportamento real observado: a página "Account Deleted!" aparece
  // mesmo sem nenhuma sessão ativa, em vez de redirecionar para o login
  // ou mostrar um erro de acesso negado.
  await accountDeletedPage.verifyAccountDeletedVisible();
});
