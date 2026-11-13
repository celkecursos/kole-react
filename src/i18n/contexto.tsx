import { createContext, useContext } from 'react';
import type { Idioma } from './idiomas';
import { textosPtBR, type Textos } from './pt-BR';

interface ValorIdioma {
  idioma: Idioma;
  textos: Textos;
}

export const ContextoIdioma = createContext<ValorIdioma>({ idioma: 'pt-BR', textos: textosPtBR });

/**
 * O dicionário do idioma ativo. Fora de um `ProvedorPreferencias` (ou
 * `ProvedorUi`), devolve o pt-BR: os componentes funcionam sozinhos.
 */
export function useTextos(): Textos {
  return useContext(ContextoIdioma).textos;
}

/** O idioma ativo (`pt-BR` fora do provedor): para formatar datas e números. */
export function useIdioma(): Idioma {
  return useContext(ContextoIdioma).idioma;
}
