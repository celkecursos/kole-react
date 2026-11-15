import { expect, test, type Page } from '@playwright/test';

// Projeto `pt-BR`: as telas com texto da biblioteca, com o português salvo (o
// padrão é o inglês, que as telas de demo.spec.ts já cobrem). Da demo, saem em
// português o menu, a trilha, os títulos, as legendas, os cards e os dados.

const preparar = async (page: Page, rota: string) => {
  await page.addInitScript(() => localStorage.setItem('lp-preferencias', JSON.stringify({ tema: 'claro', densidade: 'confortavel', idioma: 'pt-BR' })));
  await page.clock.setFixedTime(new Date('2026-07-01T10:00:00-03:00'));
  await page.goto(`/#${rota}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
};

test('pt-BR: tabela vazia', async ({ page }) => {
  await preparar(page, '/docs/componentes/tabela');
  const vazia = page.locator('.lp-vazio').first();
  await vazia.scrollIntoViewIfNeeded();
  await expect(vazia).toHaveScreenshot('tabela-vazia.png');
});

test('pt-BR: paginação', async ({ page }) => {
  await preparar(page, '/docs/componentes/paginacao');
  const pag = page.locator('.lp-pag').first();
  await pag.scrollIntoViewIfNeeded();
  // o <select> nativo varia 1 px entre capturas (desenho do navegador, não texto da lib)
  await expect(pag).toHaveScreenshot('paginacao.png', { mask: [pag.locator('select')] });
});

test('pt-BR: calendário', async ({ page }) => {
  await preparar(page, '/avancado/calendario');
  await expect(page).toHaveScreenshot('calendario.png', { fullPage: true });
});

test('pt-BR: topbar com o seletor de idioma aberto', async ({ page }) => {
  await preparar(page, '/');
  await page.locator('.lp-topbar').getByRole('button', { name: 'Idioma: Português' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page).toHaveScreenshot('topbar-idioma.png', { clip: { x: 0, y: 0, width: 1440, height: 260 } });
});

// moldura traduzida da demo: menu, trilha e título (só a janela, sem rolar)
test('pt-BR: documentação de componente', async ({ page }) => {
  await preparar(page, '/docs/componentes/botao');
  await expect(page).toHaveScreenshot('moldura-docs.png');
});

test('pt-BR: formulário com legendas', async ({ page }) => {
  await preparar(page, '/pedidos/novo');
  await expect(page).toHaveScreenshot('moldura-form.png');
});

test('pt-BR: tela com cards', async ({ page }) => {
  await preparar(page, '/solucoes/financas');
  await expect(page).toHaveScreenshot('moldura-cards.png');
});
