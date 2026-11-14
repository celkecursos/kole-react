import { createElement, type ReactNode } from 'react';

// Marcação aceita num texto do dicionário (sem atributos, sem aninhar):
// `código` (o <C> da documentação), <code>, <strong>, <b>, <em>, <i>, <small>,
// <kbd>, <u>, <s>, <mark>, <sub>, <sup> e <br/>.
const MARCACAO = /`([^`]*)`|<(code|strong|b|em|i|small|kbd|u|s|mark|sub|sup)>([\s\S]*?)<\/\2>|<br\s*\/?>/g;

/**
 * Texto do dicionário com marcação inline → nós React. Sem marcação, devolve a
 * própria string. `'Use o \`ProvedorUi\` uma <strong>única</strong> vez'` →
 * Use o <code class="doc-c">ProvedorUi</code> uma <strong>única</strong> vez.
 */
export function rico(texto: string): ReactNode {
  if (!/[`<]/.test(texto)) return texto;
  const nos: ReactNode[] = [];
  let fim = 0;
  for (const m of texto.matchAll(MARCACAO)) {
    if (m.index > fim) nos.push(texto.slice(fim, m.index));
    const k = nos.length;
    if (m[1] !== undefined) nos.push(createElement('code', { key: k, className: 'doc-c' }, m[1]));
    else if (m[2]) nos.push(createElement(m[2], { key: k }, m[3]));
    else nos.push(createElement('br', { key: k }));
    fim = m.index + m[0].length;
  }
  if (fim < texto.length) nos.push(texto.slice(fim));
  return nos;
}
