// Transformações do CSS da biblioteca, usadas pelo plugin do vite.config.ts
// (no dev, na demo e no build, para os três verem o mesmo CSS).

export const CAMADA = 'kole';

/**
 * Põe o CSS na camada `@layer kole`. CSS fora de camada sempre vence CSS em
 * camada: o CSS do app personaliza o kole sem disputar especificidade nem ordem
 * de import, e com Tailwind 4 o app declara a ordem
 * `@layer theme, base, kole, components, utilities;` (utilitários vencem os
 * componentes, que vencem o preflight).
 */
export function naCamada(css) {
  return `@layer ${CAMADA} {\n${css.trimEnd()}\n}\n`;
}

const SELETOR_ESCURO = '[data-theme="dark"], .theme-dark {';

/**
 * Tema `sistema` (`<html data-theme="system">`): segue o modo do sistema
 * operacional. Copia as declarações do bloco escuro do tokens.css para um
 * `@media (prefers-color-scheme: dark)` — os tokens escuros ficam escritos uma
 * vez só no fonte.
 */
export function comTemaSistema(css) {
  const inicio = css.indexOf(SELETOR_ESCURO);
  if (inicio < 0) throw new Error(`css-kole: bloco do tema escuro (${SELETOR_ESCURO}) não encontrado no tokens.css`);
  const abre = inicio + SELETOR_ESCURO.length;
  const fecha = css.indexOf('}', abre);
  // as declarações não têm chaves; se aparecer uma, o bloco mudou de formato
  if (fecha < 0 || css.slice(abre, fecha).includes('{')) throw new Error('css-kole: bloco do tema escuro com formato inesperado');
  const declaracoes = css.slice(abre, fecha).trim();
  return `${css.trimEnd()}\n\n/* tema "sistema": gerado do bloco escuro acima (scripts/css-kole.mjs) */\n@media screen and (prefers-color-scheme: dark) {\n  [data-theme="system"] {\n    ${declaracoes}\n  }\n}\n`;
}
