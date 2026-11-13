/**
 * Dicionários sem React: a mescla pt-BR › idioma › textos do sistema, que os
 * utilitários (`validar`, `situacaoPrazo`…) também usam.
 */
import { textosEn } from './en';
import { textosEs } from './es';
import type { Idioma } from './idiomas';
import { textosPtBR, type Textos } from './pt-BR';

/** Qualquer parte dos textos: cada componente e cada texto dele ficam opcionais. */
export type TextosParciais = {
  [K in keyof Textos]?: Textos[K] extends object ? { [J in keyof Textos[K]]?: Textos[K][J] } : Textos[K];
};

/** Os dicionários que vêm com a biblioteca. */
export const DICIONARIOS: Record<'pt-BR' | 'en' | 'es', Textos> = { 'pt-BR': textosPtBR, en: textosEn, es: textosEs };

const ehObjeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** `sobre` em cima de `base`, chave a chave (dois níveis: componente › texto). */
function mesclar(base: Textos, sobre?: TextosParciais): Textos {
  if (!sobre) return base;
  const r: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(sobre)) {
    if (v === undefined) continue;
    const atual = r[k];
    r[k] = ehObjeto(atual) && ehObjeto(v) ? { ...atual, ...v } : v;
  }
  return r as Textos;
}

// os textos do sistema (prop `textos` do ProvedorPreferencias), para os utilitários
let extrasAtivos: Partial<Record<Idioma, TextosParciais>> | undefined;
const cache = new Map<Idioma, Textos>();

/** Interno: o `ProvedorPreferencias` registra aqui os textos que o sistema passou. */
export function registrarTextos(extras?: Partial<Record<Idioma, TextosParciais>>): void {
  if (extras === extrasAtivos) return;
  extrasAtivos = extras;
  cache.clear();
}

/**
 * O dicionário de um idioma: pt-BR por baixo (o que faltar sai em português),
 * o dicionário pronto do idioma por cima e, por último, os textos do sistema.
 */
export function textosDe(idioma: Idioma = 'pt-BR'): Textos {
  let t = cache.get(idioma);
  if (!t) {
    const pronto = (DICIONARIOS as Record<string, Textos | undefined>)[idioma];
    t = mesclar(pronto ? mesclar(textosPtBR, pronto as TextosParciais) : textosPtBR, extrasAtivos?.[idioma]);
    cache.set(idioma, t);
  }
  return t;
}
