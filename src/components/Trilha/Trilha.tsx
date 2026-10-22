import { createContext, Fragment, useContext, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import './Trilha.css';

/** Um passo da trilha. Sem `rota`, aparece como texto (grupo do menu). */
export interface ItemTrilha {
  rotulo: string;
  rota?: string;
  icone?: IconeProp;
}

/** Separadores prontos, ou qualquer nó React (ex.: `'|'` ou um ícone). */
export type SeparadorTrilha = 'chevron' | 'barra' | 'duplo' | 'seta' | 'til' | 'ponto' | ReactNode;

/** Aparência da trilha — pode valer para o sistema todo (`Estrutura.modeloTrilha`). */
export interface ModeloTrilha {
  /** Padrão: `chevron` (›). */
  separador?: SeparadorTrilha;
  /** Ícones: só no Início (padrão), em todos os passos que têm, ou nenhum. */
  icones?: 'inicio' | 'todos' | 'nenhum';
  /** `simples` (padrão) · `fundo` = faixa com fundo suave. */
  aparencia?: 'simples' | 'fundo';
}

interface CtxTrilha {
  /** Caminho da página atual, calculado do menu (já com "Início"). */
  itens: ItemTrilha[];
  /** Desenha um link pelo mesmo caminho dos links do menu (renderLink/aoNavegar). */
  link: (rota: string, conteudo: ReactNode, className: string) => ReactNode;
  /** Modelo padrão do sistema. */
  modelo?: ModeloTrilha;
}

const TrilhaCtx = createContext<CtxTrilha | null>(null);
export const ProvedorTrilha = TrilhaCtx.Provider;

/** Caminho calculado pela `Estrutura` para a rota atual (vazio fora dela). */
export function useTrilha(): ItemTrilha[] {
  return useContext(TrilhaCtx)?.itens ?? [];
}

interface NoMenu {
  rotulo: string;
  rota?: string;
  icone?: IconeProp;
  filhos?: NoMenu[];
}

/**
 * Caminho no menu até o item da rota atual: seção › grupo(s) › item. Vence o
 * item de rota mais longa que casa (em `/pedidos/novo`, "Novo pedido" ganha
 * de "Pedidos").
 */
export function caminhoNoMenu(
  secoes: { rotulo?: string; itens: NoMenu[] }[],
  ativo: (rota?: string) => boolean,
): ItemTrilha[] {
  let melhor: ItemTrilha[] = [];
  let tamanho = -1;
  const visitar = (itens: NoMenu[], pais: ItemTrilha[]) => {
    for (const item of itens) {
      if (item.rota && ativo(item.rota) && item.rota.length > tamanho) {
        melhor = [...pais, { rotulo: item.rotulo, rota: item.rota, icone: item.icone }];
        tamanho = item.rota.length;
      }
      if (item.filhos) visitar(item.filhos, [...pais, { rotulo: item.rotulo, icone: item.icone }]);
    }
  };
  for (const s of secoes) visitar(s.itens, s.rotulo ? [{ rotulo: s.rotulo }] : []);
  return melhor;
}

const SEPARADORES: Record<string, ReactNode> = {
  chevron: <Icone icone="chevron-right" />,
  barra: '/',
  duplo: '»',
  seta: <Icone icone="arrow-right" />,
  til: '~',
  ponto: '•',
};

export interface TrilhaProps extends ModeloTrilha {
  /** Passos explícitos. Sem a prop, usa o caminho calculado pela `Estrutura`. */
  itens?: ItemTrilha[];
  /** Passos acrescentados ao final do caminho automático (ex.: o registro aberto). */
  extras?: ItemTrilha[];
  /** Mostra mesmo com um passo só (por padrão, some: o título já diz onde se está). */
  mostrarUnico?: boolean;
  className?: string;
}

/**
 * Trilha de navegação (breadcrumb). O último passo é a página atual; os do
 * meio com rota são links. Em tela estreita vira só "‹ nível de cima".
 */
export function Trilha({ itens: explicitos, extras = [], mostrarUnico = false, separador, icones, aparencia, className }: TrilhaProps) {
  const ctx = useContext(TrilhaCtx);
  const itens = [...(explicitos ?? ctx?.itens ?? []), ...extras];
  if (!itens.length || (itens.length < 2 && !mostrarUnico)) return null;

  const modelo = ctx?.modelo ?? {};
  const sep = separador ?? modelo.separador ?? 'chevron';
  const modoIcones = icones ?? modelo.icones ?? 'inicio';
  const aparenciaFinal = aparencia ?? modelo.aparencia ?? 'simples';
  const marcaSep = typeof sep === 'string' && sep in SEPARADORES ? SEPARADORES[sep] : sep;

  const ultimo = itens.length - 1;
  const desenharLink = (it: ItemTrilha, conteudo: ReactNode, classe: string) =>
    ctx ? ctx.link(it.rota!, conteudo, classe) : <a href={it.rota} className={classe}>{conteudo}</a>;
  // nível de cima com destino: o único passo que aparece em tela estreita
  let pai = -1;
  for (let i = ultimo - 1; i >= 0; i--)
    if (itens[i].rota) {
      pai = i;
      break;
    }

  return (
    <nav className={cx('lp-trilha', `lp-trilha--${aparenciaFinal}`, className)} aria-label="Trilha de navegação">
      <ol className="lp-trilha-lista">
        {itens.map((it, i) => {
          const comIcone = !!it.icone && (modoIcones === 'todos' || (modoIcones === 'inicio' && i === 0));
          const conteudo = (
            <Fragment>
              {comIcone && <Icone icone={it.icone} className="lp-trilha-ic" />}
              <span className="lp-trilha-rot">{it.rotulo}</span>
            </Fragment>
          );
          return (
            <li key={`${i}-${it.rotulo}`} className={cx('lp-trilha-item', i === pai && 'is-pai')}>
              {i > 0 && (
                <span className="lp-trilha-sep" aria-hidden="true">
                  {marcaSep}
                </span>
              )}
              {i === ultimo ? (
                <span className="lp-trilha-atual" aria-current="page" title={it.rotulo}>
                  {conteudo}
                </span>
              ) : it.rota ? (
                desenharLink(
                  it,
                  <>
                    <Icone icone="chevron-left" className="lp-trilha-voltar" />
                    {conteudo}
                  </>,
                  'lp-trilha-link',
                )
              ) : (
                <span className="lp-trilha-grupo" title={it.rotulo}>
                  {conteudo}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
