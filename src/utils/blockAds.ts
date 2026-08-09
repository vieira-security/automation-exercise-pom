import { Page } from '@playwright/test';

// O automationexercise.com carrega bastante coisa de anúncio/consentimento
// do Google (auto ads, funding choices, pings de anúncio). Isso às vezes
// sobrepõe conteúdo da página ou atrasa a execução de scripts o suficiente
// pra fazer um clique em link de navegação "cair no vazio", causando
// falhas intermitentes de navegação sem relação nenhuma com o app sendo
// testado. Bloquear esses domínios deixa os testes determinísticos sem
// mexer na funcionalidade real do site.
const AD_DOMAIN_PATTERNS = [
  'googlesyndication.com',
  'fundingchoicesmessages.google.com',
  'csi.gstatic.com',
  'doubleclick.net',
  'google.com/pagead',
  'googleadservices.com',
];

/**
 * Intercepta todas as requisições da página e bloqueia (aborta) as que
 * baterem em algum domínio de anúncio/consentimento do Google conhecido
 * por causar flakiness nos testes. Chame antes de navegar (logo no
 * início do teste), ex: `await blockAds(page);`.
 */
export async function blockAds(page: Page): Promise<void> {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (AD_DOMAIN_PATTERNS.some((pattern) => url.includes(pattern))) {
      return route.abort();
    }
    return route.continue();
  });
}
