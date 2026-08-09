# Automation Exercise – Testes E2E com Playwright + TypeScript

![Playwright](https://img.shields.io/badge/Playwright-1.61-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2F7-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Tests](https://img.shields.io/badge/tests-10%2F10%20passing-brightgreen)

Suíte de testes end-to-end para o site público [automationexercise.com](https://automationexercise.com), construída com **Playwright + TypeScript** usando o padrão **Page Object Model (POM)**, sem nenhum framework BDD por cima — só o test runner nativo do Playwright (`test()` / `test.step()`).

O objetivo do projeto não foi só "escrever teste que passa", mas reproduzir um cenário real de automação contra um site de terceiros: instável, cheio de scripts de anúncio, com bugs no próprio front-end. A seção [Desafios técnicos resolvidos](#-desafios-técnicos-resolvidos) documenta as investigações reais feitas pra deixar a suíte estável.

## 📋 Cenários cobertos

Os 10 primeiros casos de teste oficiais do site (de uma lista pública de 26), um por arquivo:

| # | Arquivo | Cenário | O que valida |
|---|---------|---------|---------------|
| 1 | `01-register-user.spec.ts` | Register User | Cadastro completo → conta criada → conta deletada |
| 2 | `02-login-correct.spec.ts` | Login com credenciais corretas | Login → "Logged in as" → logout |
| 3 | `03-login-incorrect.spec.ts` | Login com credenciais incorretas | Mensagem de erro exibida |
| 4 | `04-logout-user.spec.ts` | Logout | Sessão encerrada corretamente |
| 5 | `05-register-existing-email.spec.ts` | Cadastro com email já existente | Mensagem de erro exibida |
| 6 | `06-contact-us.spec.ts` | Formulário de contato | Preenchimento + upload + dialog nativo + mensagem de sucesso |
| 7 | `07-test-cases-page.spec.ts` | Página de Test Cases | Navegação via menu |
| 8 | `08-verify-product-details.spec.ts` | Produtos e detalhes | Lista de produtos → detalhe (nome, categoria, preço, disponibilidade, condição, marca) |
| 9 | `09-search-product.spec.ts` | Busca de produto | Busca → "Searched Products" com resultados |
| 10 | `10-subscription-home.spec.ts` | Assinatura de newsletter (home) | Preenchimento de email → mensagem de sucesso |

## 🏗️ Arquitetura

```
src/
├── pages/
│   ├── BasePage.ts                 # ações/verificações genéricas (goto, scroll, texto visível)
│   ├── HomePage.ts                 # menu, navegação, newsletter, sessão (login/logout/delete)
│   ├── SignupLoginPage.ts          # formulários de signup e login (mesma página no site)
│   ├── AccountInformationPage.ts   # 2º passo do cadastro (dados pessoais/endereço)
│   ├── AccountCreatedPage.ts
│   ├── AccountDeletedPage.ts
│   ├── ContactUsPage.ts            # formulário de contato (ver bugs resolvidos abaixo)
│   ├── TestCasesPage.ts
│   ├── ProductsPage.ts             # listagem "All Products" e "Searched Products"
│   └── ProductDetailsPage.ts
└── utils/
    └── blockAds.ts                 # bloqueia domínios de anúncio do Google via page.route()

tests/            # 1 spec por cenário oficial, numerados na ordem da lista do site
fixtures/         # arquivos de apoio (ex: upload de teste no Contact Us)
```

Cada Page Object herda de `BasePage` e expõe só **ações** (`click...`, `fill...`) e **verificações** (`verify...`) com nomes que descrevem intenção, não implementação — o teste em si lê quase como os passos do caso de teste oficial. Todos os métodos e locators têm comentários explicando o *porquê*, não só o *o quê* (essencial num site de terceiros, onde o motivo de um locator ser escrito de um jeito específico nem sempre é óbvio).

## 🚀 Como rodar

```bash
npm install
npx playwright install        # baixa os browsers (primeira vez)

npm test                      # roda toda a suíte (headless)
npm run test:headed           # com o browser visível
npm run test:ui               # UI mode do Playwright (interativo)
npm run report                # abre o último relatório HTML
```

> **Nota:** os testes rodam contra o site real (`baseURL` em `playwright.config.ts`), não um mock. Rodar tudo em paralelo (`fullyParallel: true`, padrão do projeto) é mais rápido, mas se notar flakiness ao rodar muitos workers ao mesmo tempo contra o site, tente `npx playwright test --workers=1`.

## 🔍 Desafios técnicos resolvidos

Esta seção documenta bugs reais encontrados **por investigação empírica** (inspecionando o DOM, os eventos do jQuery e as respostas de rede em tempo real), não achismo — cada hipótese abaixo foi testada rodando o fluxo repetidas vezes contra o site.

### 1. Contact Us: corrida entre o clique e o binding do handler de submit

**Sintoma:** depois de clicar em "Submit", a mensagem de sucesso nunca aparecia — o formulário parecia "reiniciar do zero".

**Causa raiz:** a página liga seu handler de `submit` (jQuery) num `<script>` inline perto do fim do `<body>`, **depois** de um `<script src="maps.google.com/...">` que bloqueia o parser HTML. O heading "Get In Touch" e os campos do formulário renderizam bem antes disso, então o Playwright — muito mais rápido que um humano — conseguia preencher tudo e clicar em Submit **antes** do handler existir. Sem handler, o clique caía no submit nativo do navegador: um POST real e um reload completo da página, em vez da injeção de sucesso via JS que o site pretendia mostrar.

**Como confirmei:** um script Playwright isolado checando `jQuery._data(form, 'events')` logo antes do clique mostrou `events: null` no momento da falha — a prova direta de que o handler simplesmente não existia ainda.

**Fix:** em vez de um `waitForTimeout` arbitrário ou `waitForLoadState('networkidle')` (que não resolve — os beacons de anúncio do Google nunca deixam a rede "parada"), o teste espera a condição real de que precisa:

```ts
await this.page.waitForFunction(() => {
  const jq = (window as any).jQuery;
  const form = document.getElementById('contact-us-form');
  const events = jq?._data ? jq._data(form, 'events') : null;
  return !!(events?.submit?.length > 0);
});
```

### 2. Contact Us: violação de strict mode escondida atrás de um "timeout"

**Sintoma:** mesmo depois de corrigir o problema acima, `expect(locator).toBeVisible()` continuava estourando timeout.

**Causa raiz:** o próprio JS do site atualiza a mensagem de sucesso com um seletor de **classe**, não de id: `$(".alert-success").html(...)`. Só que a caixa de sucesso da newsletter no rodapé (`#success-subscribe`) **também** tem a classe `alert-success` — então o clique em Submit do Contact Us acaba preenchendo as duas caixas com o mesmo texto. Um `getByText(...)` sem escopo batia nos dois elementos, o que o Playwright trata como erro de *strict mode*; `expect().toBeVisible()` fica retentando essa condição de erro até estourar o timeout, o que visualmente parece um timeout comum, sem pista nenhuma.

**Fix:** escopar o locator para o container real da página de contato:

```ts
this.successMessage = page
  .locator('#contact-page')
  .getByText('Success! Your details have been submitted successfully.');
```

### 3. Locators ambíguos pré-existentes, nunca exercitados

Ao escrever os cenários 7 e 8, dois `Locator`s antigos (nunca usados em nenhum teste anterior) quebraram assim que passaram a ser chamados:

- `HomePage`: `a[href="/test_cases"]` batia em **4 elementos** (o link do menu + 3 botões promocionais no carrossel da home com o mesmo `href`).
- `TestCasesPage`: `getByText('Test Cases')` batia em **7 elementos** (o texto se repete em várias descrições de casos de teste na própria página).

Ambos resolvidos escopando o locator para um seletor mais específico (`.shop-menu a[...]` e `h2.title`, respectivamente).

### 4. Flakiness de navegação causada por scripts de anúncio do Google

**Sintoma:** clicar no link "Products" da home às vezes (~1 em cada 5 execuções) não navegava — o teste seguinte falhava porque a página continuava na home.

**Causa raiz:** o site carrega bastante infraestrutura de anúncio/consentimento do Google (auto ads, funding choices, pings de anúncio) que ocasionalmente sobrepõe conteúdo da página ou atrasa a execução de scripts o suficiente pra fazer o clique cair no lugar errado.

**Fix:** um utilitário (`src/utils/blockAds.ts`) que intercepta e aborta requisições pra domínios de anúncio conhecidos via `page.route()`, chamado no início de cada teste que navega pelo menu:

```ts
await blockAds(page);
```

Validado rodando o mesmo cenário 8x seguidas sem falha (contra ~20% de falha antes do fix).

## 🧪 Metodologia de validação

Nenhuma correção acima foi considerada "pronta" só por parecer certa no código — cada uma foi:
1. Reproduzida contra o site real com um script de diagnóstico isolado;
2. Corrigida;
3. Re-executada múltiplas vezes seguidas (não só uma) pra descartar coincidência, já que boa parte dos bugs aqui eram condições de corrida.

## 📦 Stack

- **[Playwright](https://playwright.dev/)** — automação de browser e test runner
- **TypeScript** — tipagem estática nas Page Objects e nos testes
- **Page Object Model** — separação entre "o que o teste faz" (spec) e "como interagir com a página" (page object)

## 📄 Licença

ISC
