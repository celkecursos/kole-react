import { expect, test } from '@playwright/test';
import type { ItemNav } from '../../src';
import { NAV } from '../../demo/nav';

/** Páginas da demo: todas as rotas do menu (demo/nav.ts), inclusive as dos submenus. */
const rotasDe = (itens: ItemNav[]): string[] => itens.flatMap((i) => [...(i.rota ? [i.rota] : []), ...rotasDe(i.filhos ?? [])]);
const ROTAS = NAV.flatMap((secao) => rotasDe(secao.itens));

for (const rota of ROTAS) {
  test(`demo ${rota}`, async ({ page }, info) => {
    const tema = info.project.name;
    // a escolha salva vale nas duas versões comparadas (a referência pode ser de antes do tema "sistema")
    await page.addInitScript((t) => localStorage.setItem('lp-preferencias', JSON.stringify({ tema: t, densidade: 'confortavel' })), tema);
    // relógio parado: o painel e as conversas mostram horários relativos ("há 26 h")
    await page.clock.setFixedTime(new Date('2026-07-01T10:00:00-03:00'));
    await page.goto(`/#${rota}`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    const nome = rota === '/' ? 'painel' : rota.slice(1).replace(/\//g, '-');
    // [data-visual-ignorar] = trecho que muda de propósito entre os projetos (ex.: o tema marcado)
    await expect(page).toHaveScreenshot(`${nome}.png`, { fullPage: true, mask: [page.locator('[data-visual-ignorar]')] });
  });
}
