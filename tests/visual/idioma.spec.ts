import { expect, test, type Page } from '@playwright/test';

// Projeto `en`: as telas com texto da biblioteca, com o idioma inglês salvo.
// O conteúdo da demo continua em português; muda o que vem da lib.

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
  await expect(pag).toHaveScreenshot('paginacao.png');
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
