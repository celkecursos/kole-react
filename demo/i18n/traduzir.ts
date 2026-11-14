/**
 * Tradução dos textos da demo, sem React (serve também no Node). A interpolação
 * e o plural são os mesmos da biblioteca (`interpolar`/`pluralizar`).
 */
import { interpolar, pluralizar, type Idioma, type Plural } from '../../src/i18n/idiomas';
import { textosDemoEn } from './en';
import { textosDemoEs } from './es';
import { textosDemoPtBR } from './pt-BR';
import type { ChavePlural, ChaveTexto, TextosDemoParciais } from './tipos';

type Valores = Record<string, string | number>;

const DICIONARIOS: Record<string, TextosDemoParciais | undefined> = { en: textosDemoEn, es: textosDemoEs };

function obter(dic: unknown, chave: string): unknown {
  let v = dic;
  for (const parte of chave.split('.')) {
    if (!v || typeof v !== 'object') return undefined;
    v = (v as Record<string, unknown>)[parte];
  }
  return v;
}

/** O valor da chave no idioma; o que faltar (ou idioma sem dicionário) sai do pt-BR. */
function valorDe(idioma: Idioma, chave: string): unknown {
  return obter(DICIONARIOS[idioma], chave) ?? obter(textosDemoPtBR, chave);
}

/** Texto da demo no idioma, com `{valor}` trocado. */
export function traduzir(idioma: Idioma, chave: ChaveTexto, valores?: Valores): string {
  const v = valorDe(idioma, chave);
  return typeof v === 'string' ? interpolar(v, valores) : chave;
}

/** Plural da demo no idioma, com `{n}` formatado no idioma. */
export function traduzirPlural(idioma: Idioma, chave: ChavePlural, n: number, valores?: Valores): string {
  const v = valorDe(idioma, chave);
  return v && typeof v === 'object' ? pluralizar(idioma, n, v as Plural, valores) : chave;
}
