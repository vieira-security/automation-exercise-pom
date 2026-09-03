# Plano de Teste — Automation Exercise E2E Suite

Versão simplificada de um plano de teste real (ISTQB CTFL 4.0, conceito de
**Test Planning**), cobrindo a suíte completa de testes E2E deste
repositório contra o site público [automationexercise.com](https://automationexercise.com).

## Objetivo

Validar, de ponta a ponta (E2E) e em caixa preta, os fluxos essenciais de
um usuário no site automationexercise.com — cadastro, login/logout,
navegação e consulta de produtos, formulário de contato e assinatura de
newsletter — usando Playwright + TypeScript com o padrão Page Object
Model (POM). Além de verificar que os fluxos "felizes" funcionam, a suíte
também aplica técnicas de design de teste (partição de equivalência, BVA,
tabela de decisão, transição de estado, cobertura de decisão) para
investigar deliberadamente os limites e as lacunas de validação do site,
documentando qualquer defeito real encontrado no processo.

## Escopo

### Dentro do escopo
Os 10 cenários oficiais do site cobertos em `tests/01` a `tests/10`:

| # | Arquivo | Cenário |
|---|---------|---------|
| 1 | `01-register-user.spec.ts` | Cadastro de usuário (Register User) |
| 2 | `02-login-correct.spec.ts` | Login com credenciais corretas |
| 3 | `03-login-incorrect.spec.ts` | Login com credenciais incorretas |
| 4 | `04-logout-user.spec.ts` | Logout |
| 5 | `05-register-existing-email.spec.ts` | Cadastro com email já existente |
| 6 | `06-contact-us.spec.ts` | Formulário de contato |
| 7 | `07-test-cases-page.spec.ts` | Página de Test Cases |
| 8 | `08-verify-product-details.spec.ts` | Listagem e detalhe de produtos |
| 9 | `09-search-product.spec.ts` | Busca de produto |
| 10 | `10-subscription-home.spec.ts` | Assinatura de newsletter (home) |

Mais os testes adicionais que aplicam técnicas específicas de design de
teste sobre esses mesmos fluxos:

| Arquivo | Técnica aplicada | Onde |
|---------|-------------------|------|
| `11-password-partitions.spec.ts` | Partição de Equivalência | Campo de senha do cadastro |
| `12-title-mrs-branch.spec.ts` | Cobertura de Decisão | `AccountInformationPage.selectTitle()` |
| `13-quantity-boundary.spec.ts` | Análise de Valor de Limite (BVA) | Campo Quantity do produto |
| `14-login-decision-table.spec.ts` | Tabela de Decisão | Login (email × senha) |
| `15-state-transition.spec.ts` | Transição de Estado | Ciclo de vida da sessão |

### Fora do escopo
- **Testes de performance/carga** — a suíte não mede tempo de resposta
  sob volume, nem quantos usuários simultâneos o site aguenta.
- **Testes de segurança aprofundados** — não há varredura de
  vulnerabilidades (SQLi, XSS, etc.); as observações de segurança feitas
  aqui (ex: em `15-state-transition.spec.ts`) são achados incidentais de
  um teste funcional, não uma auditoria de segurança dedicada.
- **Testes de compatibilidade entre navegadores** — `playwright.config.ts`
  roda só no projeto `chromium`; não há execução em Firefox, WebKit/Safari
  ou navegadores mobile.
- **Testes de acessibilidade (a11y)** — não há verificação de conformidade
  com WCAG ou uso de leitor de tela.
- **Testes de API** — toda a suíte interage com o site pela UI (browser),
  não há chamadas diretas aos endpoints do backend.
- **Testes unitários** — o projeto não testa as Page Objects isoladamente
  (sem browser); toda a suíte é E2E.

## Critérios de entrada

Antes de rodar a suíte, é preciso que:
- Node.js (versão compatível, ver `package.json`) e as dependências
  estejam instaladas (`npm install`);
- Os browsers do Playwright estejam baixados (`npx playwright install`);
- O site `https://automationexercise.com` esteja acessível a partir do
  ambiente onde os testes rodam (a suíte não usa mocks — é o site real);
- O arquivo `fixtures/sample-upload.txt` exista (usado pelo Cenário 6 no
  upload do formulário de contato).

## Critérios de saída

A suíte é considerada "completa e aprovada" quando:
- Todos os testes dos cenários 01–10 (fluxos oficiais) passam;
- Todos os testes de técnica de design (11–15) passam ou, quando um teste
  documenta um comportamento real do site como parte do seu propósito
  (ex: partições de senha aceitas indevidamente, quantidade fora do
  limite aceita, transição de estado inválida não barrada), esse
  resultado está **documentado como esperado no próprio teste e/ou em
  `DEFECTS.md`** — não é tratado como falha de teste;
- Nenhum defeito crítico (que impeça um fluxo essencial de funcionar,
  como cadastro ou login) está em aberto sem workaround documentado;
- `npx tsc --noEmit` não acusa erro de tipo no projeto.

Falhas de rede pontuais contra o site real (timeout de navegação, etc.)
são tratadas como flakiness de ambiente, não como reprovação da suíte —
a prática adotada é reexecutar o teste isoladamente antes de concluir que
há uma regressão real (ver seção "Metodologia de validação" do
`README.md`).

## Abordagem de teste

- **Caixa preta**: os testes interagem só com a interface do site (o que
  o usuário vê e clica), sem inspecionar ou testar o código-fonte do
  automationexercise.com diretamente.
- **E2E (ponta a ponta)**: cada teste simula um fluxo completo de usuário
  real num browser de verdade (Chromium via Playwright), não chamadas
  isoladas a funções ou endpoints.
- **Autossuficiente**: cada teste cria os próprios dados de que precisa
  (ex: `generateRandomEmail()` para um email único por execução) e faz a
  limpeza no final quando aplicável (ex: deletar a conta criada) — nenhum
  teste depende do resultado ou da ordem de execução de outro, o que
  permite rodar tudo em paralelo (`fullyParallel: true`).
- **Page Object Model (POM)**: a interação com cada página do site fica
  isolada numa classe própria em `src/pages/`, e os arquivos em `tests/`
  descrevem só os passos do caso de teste, sem detalhes de seletor/DOM.

## Ferramentas

- **[Playwright](https://playwright.dev/)** — automação de browser e test runner
- **TypeScript** — tipagem estática nas Page Objects e nos testes
- **GitHub Actions** — pipeline de CI/CD que roda a suíte automaticamente
