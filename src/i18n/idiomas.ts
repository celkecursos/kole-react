/**
 * Idiomas da biblioteca e as peças sem React do multi-idioma: interpolação,
 * plural e formatadores `Intl` com cache por idioma.
 */

/** Idiomas com dicionário pronto na biblioteca. */
export type IdiomaPadrao = 'pt-BR' | 'en' | 'es';

/**
 * Idioma ativo. Além dos três prontos, o sistema pode acrescentar outro (ex.:
 * `'fr'`) passando os textos dele em `textos` do `ProvedorPreferencias`; o que
 * faltar sai em pt-BR.
 */
export type Idioma = IdiomaPadrao | (string & {});

export const IDIOMAS_PADRAO: readonly IdiomaPadrao[] = ['pt-BR', 'en', 'es'];

/** Formas do plural (categorias do `Intl.PluralRules`); `other` é obrigatória e serve de reserva. */
export interface Plural {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/** Locale do `Intl` para o idioma (`en` → `en-US`, `es` → `es-ES`; os outros, como vierem). */
export function localeDe(idioma: Idioma): string {
  return idioma === 'en' ? 'en-US' : idioma === 'es' ? 'es-ES' : idioma;
}

/** `'Página {atual} de {total}'` + `{ atual: 2, total: 9 }` → `'Página 2 de 9'`. Chave sem valor fica como está. */
export function interpolar(modelo: string, valores?: Record<string, string | number>): string {
  if (!valores) return modelo;
  return modelo.replace(/\{(\w+)\}/g, (inteiro, chave: string) => (chave in valores ? String(valores[chave]) : inteiro));
}

const cache = new Map<string, unknown>();
function emCache<T>(chave: string, criar: () => T): T {
  let v = cache.get(chave) as T | undefined;
  if (v === undefined) {
    v = criar();
    cache.set(chave, v);
  }
  return v;
}

/** `Intl.NumberFormat` do idioma, criado uma vez por combinação de opções. */
export function formatoNumero(idioma: Idioma, opcoes?: Intl.NumberFormatOptions): Intl.NumberFormat {
  return emCache(`n|${idioma}|${JSON.stringify(opcoes ?? {})}`, () => new Intl.NumberFormat(localeDe(idioma), opcoes));
}

/** `Intl.DateTimeFormat` do idioma, criado uma vez por combinação de opções. */
export function formatoData(idioma: Idioma, opcoes?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return emCache(`d|${idioma}|${JSON.stringify(opcoes ?? {})}`, () => new Intl.DateTimeFormat(localeDe(idioma), opcoes));
}

/** `Intl.ListFormat` (`a, b e c` · `a, b and c` · `a, b y c`). */
export function formatoLista(idioma: Idioma, tipo: 'conjunction' | 'disjunction' = 'conjunction'): Intl.ListFormat {
  return emCache(`l|${idioma}|${tipo}`, () => new Intl.ListFormat(localeDe(idioma), { style: 'long', type: tipo }));
}

function regrasPlural(idioma: Idioma): Intl.PluralRules {
  return emCache(`p|${idioma}`, () => new Intl.PluralRules(localeDe(idioma)));
}

/**
 * A forma certa do plural para `n`, já com `{n}` (formatado no idioma) e os
 * outros valores trocados: `{ one: '{n} item', other: '{n} itens' }`.
 */
export function pluralizar(idioma: Idioma, n: number, formas: Plural, valores?: Record<string, string | number>): string {
  const forma = formas[regrasPlural(idioma).select(n) as keyof Plural] ?? formas.other;
  return interpolar(forma, { n: formatoNumero(idioma).format(n), ...valores });
}

/** Os 7 dias da semana, começando no domingo, no formato pedido (`short` = `dom.`/`Sun`). */
export function diasDaSemana(idioma: Idioma, formato: 'narrow' | 'short' | 'long' = 'short'): string[] {
  const f = formatoData(idioma, { weekday: formato });
  // 2023-01-01 foi um domingo
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2023, 0, 1 + i)));
}

/** Os 12 meses (`long` = janeiro/January). */
export function mesesDoAno(idioma: Idioma, formato: 'narrow' | 'short' | 'long' = 'long'): string[] {
  const f = formatoData(idioma, { month: formato });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(2023, i, 1)));
}
