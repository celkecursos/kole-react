import { expect, test, type Page } from '@playwright/test';

// Projeto `en`: as telas com texto da biblioteca, com o idioma inglês salvo.
// Da demo, saem em inglês o menu, a trilha, os títulos, as legendas e os cards
// (demo/i18n); o resto do conteúdo continua em português.

const preparar = async (page: Page, rota: string) => {
  await page.addInitScript(() => localStorage.setItem('lp-preferencias', JSON.stringify({ tema: 'claro', densidade: 'confortavel', idioma: 'en' })));
  await page.clock.setFixedTime(new Date('2026-07-01T10:00:00-03:00'));
  await page.goto(`/#${rota}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
};

test('en: tabela vazia', async ({ page }) => {
  await preparar(page, '/docs/componentes/tabela');
  const vazia = page.locator('.lp-vazio').first();
  await vazia.scrollIntoViewIfNeeded();
  await expect(vazia).toHaveScreenshot('tabela-vazia.png');
});

test('en: paginação', async ({ page }) => {
  await preparar(page, '/docs/componentes/paginacao');
  const pag = page.locator('.lp-pag').first();
  await pag.scrollIntoViewIfNeeded();
  // o <select> nativo varia 1 px entre capturas (desenho do navegador, não texto da lib)
  await expect(pag).toHaveScreenshot('paginacao.png', { mask: [pag.locator('select')] });
});

test('en: calendário', async ({ page }) => {
  await preparar(page, '/avancado/calendario');
  await expect(page).toHaveScreenshot('calendario.png', { fullPage: true });
});

test('en: topbar com o seletor de idioma aberto', async ({ page }) => {
  await preparar(page, '/');
  await page.locator('.lp-topbar').getByRole('button', { name: 'Language: English' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page).toHaveScreenshot('topbar-idioma.png', { clip: { x: 0, y: 0, width: 1440, height: 260 } });
});

// moldura traduzida da demo: menu, trilha e título (só a janela, sem rolar)
test('en: documentação de componente', async ({ page }) => {
  await preparar(page, '/docs/componentes/botao');
  await expect(page).toHaveScreenshot('moldura-docs.png');
});

test('en: formulário com legendas', async ({ page }) => {
  await preparar(page, '/pedidos/novo');
  await expect(page).toHaveScreenshot('moldura-form.png');
});

test('en: tela com cards', async ({ page }) => {
  await preparar(page, '/solucoes/financas');
  await expect(page).toHaveScreenshot('moldura-cards.png');
});
