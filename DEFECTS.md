# Registro de Defeitos

Este arquivo aplica a prática de **Gerenciamento de Defeitos** (Defect
Management, ISTQB CTFL 4.0) ao projeto: registrar formalmente um bug real
encontrado durante o desenvolvimento da suíte, com passos para reproduzir,
resultado esperado vs. obtido, severidade/prioridade e evidências — em vez
de só "consertar e esquecer".

---

## DEF-001: Formulário de Contact Us não confirma envio via alert nativo de forma consistente

**Severidade:** Média
**Prioridade:** Média
**Status:** Investigação concluída / Contornado no lado do teste
**Encontrado em:** Cenário 6 — `tests/06-contact-us.spec.ts` / `src/pages/ContactUsPage.ts`

### Passos para reproduzir
1. Acessar `/contact_us`
2. Preencher todos os campos do formulário (Name, Email, Subject, Message)
3. Anexar um arquivo
4. Clicar em "Submit" **imediatamente** após a página terminar de renderizar
   o formulário (velocidade típica de um script de automação, bem mais
   rápida que um clique humano)

### Resultado esperado
Um `alert` nativo do navegador ("Press OK to proceed!") deveria aparecer
de forma consistente assim que o botão é clicado e, ao aceitá-lo, a
mensagem "Success! Your details have been submitted successfully."
deveria aparecer na própria página, sem reload.

### Resultado obtido
Em ambiente automatizado (Playwright/Chromium), o `alert` nativo e a
mensagem de sucesso via JS não apareciam de forma confiável. Causa raiz
identificada por investigação empírica: a página só registra o handler de
`submit` (via jQuery) num `<script>` inline perto do fim do `<body>`,
**depois** de um `<script src="maps.google.com/...">` que bloqueia o
parser HTML por um tempo. Um script de automação consegue preencher o
formulário inteiro e clicar em "Submit" **antes** desse handler existir.
Sem o handler do jQuery ligado, o clique cai no comportamento padrão do
navegador: um `POST` HTML tradicional com reload completo da página — sem
o `confirm()`/`alert()` nem a injeção de sucesso via JS que o site
pretendia mostrar. O formulário volta ao estado vazio, sem exibir a
mensagem de sucesso esperada dentro do tempo configurado.

### Evidências
- Um script de diagnóstico isolado, checando `jQuery._data(form, 'events')`
  logo antes do clique em Submit, retornou `events: null` no momento da
  falha — prova direta de que o handler de submit ainda não existia.
- Rastreamento de rede confirmou `POST /contact_us` retornando status 200
  (a requisição chega ao servidor normalmente; o problema é só do lado do
  binding de eventos no front-end).
- Screenshots/vídeos de falhas anteriores a esse diagnóstico ficam em
  `test-results/` quando um teste falha (`screenshot: 'only-on-failure'`,
  `video: 'retain-on-failure'` em `playwright.config.ts`).

### Contorno aplicado (workaround)
Em vez de um `waitForTimeout` arbitrário — que seria só um chute de tempo
— ou `waitForLoadState('networkidle')` — que não resolve, já que os
beacons de anúncio do Google nunca deixam a rede realmente "parada" — o
teste passou a esperar a condição real de que precisa antes de clicar:

```ts
await this.page.waitForFunction(() => {
  const jq = (window as any).jQuery;
  const form = document.getElementById('contact-us-form');
  const events = jq?._data ? jq._data(form, 'events') : null;
  return !!(events?.submit?.length > 0);
});

this.page.once('dialog', (dialog) => dialog.accept());
await this.submitButton.click();
```

Ver `ContactUsPage.submitForm()` para a implementação completa.

### Observações
- Testado manualmente (fora do ambiente automatizado, com cliques
  "normais" de velocidade humana) e o `alert` nativo funciona
  normalmente — reforça que a causa raiz é a diferença de timing entre um
  clique automatizado (muito rápido) e o carregamento de um script de
  terceiros (o Google Maps) que atrasa o binding do handler de submit.
- Este defeito é do **site sob teste**, não do framework de automação: um
  formulário cujo comportamento correto depende de um script de terceiros
  específico terminar de carregar primeiro é uma fragilidade real de
  front-end, só fica mais visível sob automação porque um script clica
  mais rápido que uma pessoa.
- O contorno resolve o problema para fins de teste automatizado, mas não
  corrige a causa raiz no site — um usuário real "rápido o suficiente"
  (ex: usando preenchimento automático do navegador + Enter) ainda
  poderia, em tese, esbarrar no mesmo problema.
