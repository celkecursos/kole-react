/**
 * Menu da demo com chave de tradução. `demo/nav.ts` e `demo/docs/nav.ts`
 * guardam o rótulo pt-BR (o teste visual lê esses arquivos no Node) e a chave
 * `menu.*`; `traduzirNav` troca o rótulo pelo do idioma ativo.
 */
import type { ItemNav, SecaoNav } from '../../src';
import type { Idioma } from '../../src/i18n/idiomas';
import { traduzir } from './traduzir';
import type { ChaveTexto } from './tipos';

/** Só as chaves do grupo `menu.*`. */
export type ChaveMenu = Extract<ChaveTexto, `menu.${string}`>;

export interface ItemNavDemo extends Omit<ItemNav, 'filhos'> {
  /** Chave do rótulo no dicionário (o `rotulo` fica como o texto em pt-BR). */
  chave: ChaveMenu;
  filhos?: ItemNavDemo[];
}

export interface SecaoNavDemo extends Omit<SecaoNav, 'itens'> {
  /** Chave do rótulo da seção (só quando ela tem `rotulo`). */
  chave?: ChaveMenu;
  itens: ItemNavDemo[];
}

function traduzirItem(item: ItemNavDemo, idioma: Idioma): ItemNav {
  const { chave, filhos, ...resto } = item;
  return { ...resto, rotulo: traduzir(idioma, chave), ...(filhos && { filhos: filhos.map((f) => traduzirItem(f, idioma)) }) };
}

/** O menu no idioma (a `Estrutura` deriva dele a trilha e a busca Ctrl K). */
export function traduzirNav(nav: SecaoNavDemo[], idioma: Idioma): SecaoNav[] {
  return nav.map(({ chave, itens, ...resto }) => ({
    ...resto,
    ...(chave && { rotulo: traduzir(idioma, chave) }),
    itens: itens.map((i) => traduzirItem(i, idioma)),
  }));
}

/**
 * Pares rótulo pt-BR do arquivo × texto pt-BR do dicionário que não batem:
 * os dois têm que ser iguais para o português da demo não mudar.
 */
export function divergenciasPtBR(nav: SecaoNavDemo[]): string[] {
  const erros: string[] = [];
  const conferir = (rotulo: string | undefined, chave: ChaveMenu | undefined) => {
    if (chave && rotulo !== traduzir('pt-BR', chave)) erros.push(`${chave}: "${rotulo}" ≠ "${traduzir('pt-BR', chave)}"`);
  };
  const percorrer = (itens: ItemNavDemo[]) =>
    itens.forEach((i) => {
      conferir(i.rotulo, i.chave);
      percorrer(i.filhos ?? []);
    });
  nav.forEach((s) => {
    conferir(s.rotulo, s.chave);
    percorrer(s.itens);
  });
  return erros;
}
