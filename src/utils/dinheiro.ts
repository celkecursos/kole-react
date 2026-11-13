/**
 * Dinheiro e porcentagem. Os formatadores ficam em cache por idioma e
 * combinação de opções: criar um `Intl.NumberFormat` a cada célula pesa.
 * O idioma muda só a formatação (`R$ 1.234,50` · `R$1,234.50`); a moeda vem
 * de `moeda` (BRL por padrão).
 */
import { formatoNumero, type Idioma } from '../i18n/idiomas';

export interface OpcoesMoeda {
  /** Código ISO 4217. Padrão `BRL`. */
  moeda?: string;
  /** `+ R$ 10,00` nos positivos (os negativos sempre levam `−`). */
  sinal?: boolean;
  /** `R$ 12,4 mil` · `R$ 1,2 mi` (deixe o valor cheio no `title`). */
  compacto?: boolean;
  /** Padrão `true`. `false` arredonda para reais inteiros. */
  centavos?: boolean;
  /** Sem o símbolo: `1.234,56`. */
  semSimbolo?: boolean;
  /** Idioma da formatação. Padrão `pt-BR`. */
  idioma?: Idioma;
}

/** O sinal de menos tipográfico (U+2212): mais legível que o hífen em colunas de valores. */
export const MENOS = '−';

/**
 * `1234.5` → `R$ 1.234,50` · `-80` → `−R$ 80,00` · com `sinal`: `+R$ 10,00`.
 * O espaço depois de `R$` é inseparável (não quebra a linha no meio do valor).
 */
export function formatarMoeda(valor: number, opcoes: OpcoesMoeda = {}): string {
  const { moeda = 'BRL', sinal, compacto, centavos = true, semSimbolo, idioma = 'pt-BR' } = opcoes;
  const casas = compacto ? undefined : centavos ? 2 : 0;
  const f = formatoNumero(idioma, {
    ...(semSimbolo ? {} : { style: 'currency', currency: moeda }),
    ...(compacto ? { notation: 'compact', maximumFractionDigits: 1 } : { minimumFractionDigits: casas, maximumFractionDigits: casas }),
  });
  const v = Object.is(valor, -0) ? 0 : valor;
  const texto = f.format(Math.abs(v));
  // `−0,00` não existe: o que arredonda para zero sai sem sinal
  const zero = Number(f.format(Math.abs(v)).replace(/[^\d]/g, '')) === 0;
  if (v < 0 && !zero) return `${MENOS}${texto}`;
  if (sinal && v > 0 && !zero) return `+${texto}`;
  return texto;
}

export interface OpcoesPercentual {
  /** Casas decimais. Padrão `1`. */
  casas?: number;
  /** `+12,5%` nos positivos. */
  sinal?: boolean;
  /** `valor` já está em fração (`0.125` = 12,5%). Padrão: em pontos (`12.5`). */
  fracao?: boolean;
  /** Idioma da formatação. Padrão `pt-BR`. */
  idioma?: Idioma;
}

/** `12.5` → `12,5%` · `-3` → `−3,0%` · com `fracao`: `0.125` → `12,5%`. */
export function formatarPercentual(valor: number, opcoes: OpcoesPercentual = {}): string {
  const { casas = 1, sinal, fracao, idioma = 'pt-BR' } = opcoes;
  const f = formatoNumero(idioma, { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const pontos = fracao ? valor * 100 : valor;
  const texto = `${f.format(Math.abs(pontos))}%`;
  const zero = Number(f.format(Math.abs(pontos)).replace(/[^\d]/g, '')) === 0;
  if (pontos < 0 && !zero) return `${MENOS}${texto}`;
  if (sinal && pontos > 0 && !zero) return `+${texto}`;
  return texto;
}

/** Variação de `anterior` para `atual`, em pontos (`10 → 12` = `20`). `null` quando `anterior` é zero. */
export function variacaoPercentual(atual: number, anterior: number): number | null {
  if (!anterior) return null;
  return ((atual - anterior) / Math.abs(anterior)) * 100;
}

/**
 * Divide `total` em `n` parcelas com centavos exatos: a diferença do
 * arredondamento vai para a primeira (`100 / 3` → `33,34 · 33,33 · 33,33`).
 */
export function dividirEmParcelas(total: number, n: number): number[] {
  if (n < 1) return [];
  const centavos = Math.round(total * 100);
  const base = Math.trunc(centavos / n);
  const resto = centavos - base * n;
  return Array.from({ length: n }, (_, i) => (base + (i === 0 ? resto : 0)) / 100);
}

/** Soma sem o erro de ponto flutuante (`0.1 + 0.2` = `0.3`), arredondando em centavos. */
export function somarMoeda(valores: readonly number[]): number {
  return valores.reduce((s, v) => s + Math.round(v * 100), 0) / 100;
}
