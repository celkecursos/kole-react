import { useMemo } from 'react';
import { useIdioma } from '../../src/i18n/contexto';
import type { Idioma } from '../../src/i18n/idiomas';
import { traduzirConteudo } from './conteudo';
import { traduzir, traduzirPlural } from './traduzir';
import type { ChavePlural, ChaveTexto } from './tipos';

type Valores = Record<string, string | number>;

export interface TradutorDemo {
  /** O idioma ativo (o mesmo do `useIdioma()` da biblioteca). */
  idioma: Idioma;
  /** `t('docs.instalacao.titulo')`, `t('chave', { nome: 'Ana' })` para `{nome}`. */
  t: (chave: ChaveTexto, valores?: Valores) => string;
  /** `tp('docs.indice.textos.resumo', 12)` → `12 páginas, cada uma…`. */
  tp: (chave: ChavePlural, n: number, valores?: Valores) => string;
  /** Dado de exemplo pelo texto em pt-BR: `tc(cliente.nome)`, `tc('Arroz tipo 1 — 5 kg')` (ver conteudo.ts). */
  tc: <T>(texto: T) => T;
}

/**
 * Textos da demo no idioma do seletor da topbar. Segue o `useIdioma()` da
 * biblioteca: trocar o idioma rerenderiza quem usa o hook, sem recarregar.
 */
export function useT(): TradutorDemo {
  const idioma = useIdioma();
  return useMemo(
    () => ({
      idioma,
      t: (chave, valores) => traduzir(idioma, chave, valores),
      tp: (chave, n, valores) => traduzirPlural(idioma, chave, n, valores),
      tc: (texto) => traduzirConteudo(idioma, texto),
    }),
    [idioma],
  );
}
