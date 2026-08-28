# Aplicar Conceitos Avançados do ISTQB CTFL 4.0 no Projeto

Este arquivo pede ao Claude Code para implementar, no projeto de
automação já existente (Playwright + TypeScript + POM), exemplos
PRÁTICOS de técnicas de teste vistas no syllabus oficial ISTQB
Foundation Level 4.0. Cada seção abaixo explica o conceito em
linguagem simples, aponta onde aplicar no projeto, e pede uma
explicação didática ao final (em português, sem pressupor
conhecimento prévio de quem for ler).

---

## 1. Análise de Valor de Limite (Boundary Value Analysis - BVA)

### O que é
Técnica que foca nos LIMITES (bordas) entre um valor válido e um
inválido, já que é ali que desenvolvedores mais cometem erros (ex:
usar "<=" quando deveria ser "<"). Existem duas variações: BVA de
2 valores (testa o limite e seu vizinho mais próximo) e BVA de 3
valores (testa o limite e os dois vizinhos, mais rigoroso).

### Onde aplicar
Campo **Quantity** (quantidade) em `ProductDetailsPage.ts`, que no
HTML tem `min="1"` (`<input type="number" name="quantity" id="quantity" value="1" min="1">`).
A partição válida é "1 ou mais"; o limite inferior é o valor 1.

### O que implementar
Criar `tests/13-quantity-boundary.spec.ts` com testes cobrindo (BVA
de 3 valores, mais rigoroso):
- Quantidade = 1 (o próprio limite, deve ser aceito)
- Quantidade = 2 (vizinho superior do limite, deve ser aceito)
- Quantidade = 0 (vizinho inferior do limite, deve ser rejeitado
  ou ajustado automaticamente pelo navegador/site — documentar o
  comportamento real observado)
- Quantidade = -1 (valor negativo, fora da partição válida)

Para cada teste: preencher o campo de quantidade, clicar "Add to
cart", e verificar o que realmente acontece (produto adicionado com
a quantidade esperada, quantidade ajustada, ou erro). Se o
`ProductDetailsPage` não tiver um método pra verificar a quantidade
no carrinho, adicionar um Locator simples para isso ou documentar a
limitação.

---

## 2. Teste de Tabela de Decisão (Decision Table Testing)

### O que é
Técnica para testar sistematicamente todas as COMBINAÇÕES possíveis
de condições e suas ações resultantes. Útil quando o resultado
depende de mais de uma condição ao mesmo tempo.

### Onde aplicar
O fluxo de **login** (`SignupLoginPage.login()`), que depende de
duas condições: Email (válido/inválido) e Senha (válida/inválida).

Tabela de decisão a implementar:

| Regra | Email      | Senha      | Resultado esperado                     |
|-------|------------|------------|------------------------------------------|
| 1     | Válido     | Válida     | Login com sucesso ("Logged in as...")    |
| 2     | Válido     | Inválida   | Erro "Your email or password is incorrect!" |
| 3     | Inválido   | Válida     | Erro "Your email or password is incorrect!" |
| 4     | Inválido   | Inválida   | Erro "Your email or password is incorrect!" |

### O que implementar
Criar `tests/14-login-decision-table.spec.ts` com 4 testes (um por
regra da tabela), reaproveitando `homePage`, `signupLoginPage` e o
padrão de criação de conta autossuficiente já usado nos testes
anteriores (para ter um email/senha "válidos" de referência na
Regra 1). Nomear cada teste referenciando a regra correspondente,
ex: `test('Tabela de decisão - Regra 1: email válido + senha válida')`.

---

## 3. Teste de Transição de Estado (State Transition Testing)

### O que é
Técnica que modela o sistema como uma máquina de estados: quais
"estados" existem, quais eventos causam transição entre eles, e
quais transições são válidas ou inválidas.

### Onde aplicar
O ciclo de vida de uma sessão de usuário no site, que já foi
implicitamente testado nos Cenários 1 a 5:

Estados: `Anônimo` → `Logado` → `Deslogado` (via logout, mas conta
ainda existe) → `Conta Deletada`

Eventos/transições:
- `Anônimo` --(cadastro bem-sucedido)--> `Logado`
- `Logado` --(logout)--> `Anônimo` (com conta ainda existente)
- `Anônimo` --(login com credenciais da conta existente)--> `Logado`
- `Logado` --(delete account)--> `Anônimo` (conta não existe mais)

### O que implementar
Criar `tests/15-state-transition.spec.ts` cobrindo pelo menos:
1. **Cobertura de todos os estados**: um teste que passa por todos
   os 3 estados citados em sequência (isso já é parecido com o que
   o Cenário 1 faz, mas aqui o objetivo é comentar explicitamente
   no código QUAL estado está sendo verificado em cada trecho)
2. **Uma transição inválida**: tentar uma ação que não deveria ser
   possível no estado atual — por exemplo, tentar acessar
   `/delete_account` diretamente pela URL estando no estado
   `Anônimo` (deslogado), e documentar o que o site realmente faz
   (redireciona para login? mostra erro? permite acessar mesmo
   assim, o que seria uma falha de segurança a ser reportada?)

Incluir no início do arquivo um comentário em bloco com o diagrama
de estados em formato texto simples (ASCII), para servir de
documentação visual de referência.

---

## 4. Gerenciamento de Defeitos (Defect Management)

### O que é
Prática formal de registrar, documentar e rastrear defeitos (bugs)
encontrados durante os testes, geralmente contendo: título, passos
para reproduzir, resultado esperado vs. resultado obtido,
severidade/prioridade, e evidências (screenshots, logs).

### O que implementar
Criar um arquivo `DEFECTS.md` na raiz do projeto documentando o bug
real encontrado durante o desenvolvimento do Cenário 6 (Contact Us
Form). Usar um formato de relatório de defeito profissional, por
exemplo:

```markdown
# Registro de Defeitos

## DEF-001: Formulário de Contact Us não confirma envio via alert nativo de forma consistente

**Severidade:** Média
**Prioridade:** Média
**Status:** Investigação em andamento / Contornado

### Passos para reproduzir
1. Acessar /contact_us
2. Preencher todos os campos do formulário
3. Anexar um arquivo
4. Clicar em "Submit"

### Resultado esperado
Um alert nativo do navegador ("Press OK to proceed!") deveria
aparecer de forma consistente, e ao aceitar, a mensagem de sucesso
"Success! Your details have been submitted successfully." deveria
aparecer sem reload da página.

### Resultado obtido
Em ambiente automatizado (Playwright/Chromium), o alert nativo não
é disparado de forma confiável. Quando o formulário é submetido, a
requisição é enviada via POST tradicional (com reload completo da
página), resultando no formulário voltando ao estado vazio, sem
exibir a mensagem de sucesso esperada dentro do tempo de espera
configurado.

### Evidências
- Rastreamento de rede confirmou POST para /contact_us retornando
  status 200
- Screenshot do momento da falha mostra formulário vazio (anexar
  referência ao arquivo de screenshot gerado pelo Playwright, se
  disponível em test-results/)

### Observações
Testado manualmente (fora do ambiente automatizado) e o alert
nativo funciona normalmente nesse caso, sugerindo uma diferença de
comportamento específica do ambiente automatizado, possivelmente
relacionada ao timing de carregamento de scripts de terceiros
(anúncios) na página.
```

---

## 5. Plano de Teste básico (Test Plan)

### O que implementar
Criar um arquivo `TEST_PLAN.md` na raiz do projeto com uma versão
simplificada de um plano de teste real, contendo as seções:
- **Objetivo**: o que esta suíte de testes busca validar
- **Escopo**: quais funcionalidades do site estão cobertas (listar
  os 10 cenários) e quais estão fora do escopo (ex: testes de
  performance, testes de segurança aprofundados, testes de
  compatibilidade entre navegadores além do Chromium)
- **Critérios de entrada**: condições necessárias antes de rodar a
  suíte (ex: ambiente com Node.js e dependências instaladas, site
  automationexercise.com acessível)
- **Critérios de saída**: condições que definem quando a suíte é
  considerada "completa e aprovada" (ex: todos os cenários
  passando, nenhum defeito crítico em aberto)
- **Abordagem de teste**: caixa preta, E2E, autossuficiente
  (cada teste cria seus próprios dados)
- **Ferramentas**: Playwright, TypeScript, GitHub Actions (CI/CD)

---

## 6. Resumo explicativo esperado ao final

Depois de implementar todos os itens acima, apresentar um resumo em
português cobrindo, para CADA técnica (BVA, Tabela de Decisão,
Transição de Estado, Gerenciamento de Defeitos, Plano de Teste):
1. O conceito explicado em linguagem simples
2. Como foi aplicado neste projeto especificamente, com exemplo real
3. Como rodar os novos testes:
   - `npx playwright test tests/13-quantity-boundary.spec.ts`
   - `npx playwright test tests/14-login-decision-table.spec.ts`
   - `npx playwright test tests/15-state-transition.spec.ts`
4. Uma nota final conectando essas técnicas ao conteúdo do syllabus
   ISTQB CTFL 4.0, mencionando que essas são técnicas cobradas na
   certificação Foundation Level, então este projeto agora serve
   tanto como portfólio prático quanto como material de estudo
   aplicado para quem for se preparar para a certificação.
