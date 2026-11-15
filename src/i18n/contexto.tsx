import { createContext, useContext } from 'react';
import { textosEn } from './en';
import { IDIOMA_INICIAL, type Idioma } from './idiomas';
import type { Textos } from './pt-BR';

interface ValorIdioma {
  idioma: Idioma;
  textos: Textos;
}

export const ContextoIdioma = createContext<ValorIdioma>({ idioma: IDIOMA_INICIAL, textos: textosEn });

/**
 * O dicionário do idioma ativo. Fora de um `ProvedorPreferencias` (ou
 * `ProvedorUi`), devolve o inglês: os componentes funcionam sozinhos.
 */
export function useTextos(): Textos {
  return useContext(ContextoIdioma).textos;
}

/** O idioma ativo (`en` fora do provedor): para formatar datas e números. */
export function useIdioma(): Idioma {
  return useContext(ContextoIdioma).idioma;
}
