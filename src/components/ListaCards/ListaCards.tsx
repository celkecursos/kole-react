import type { CSSProperties, Key, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { Paginacao, type PaginacaoProps } from '../Paginacao/Paginacao';
import { Skeleton } from '../Skeleton/Skeleton';
import { Vazio } from '../Vazio/Vazio';
import './ListaCards.css';

export interface ListaCardsProps<T> {
  itens: T[];
  /** Monta o card de cada item (normalmente um `<Card>` composto pelo módulo). */
  card: (item: T, indice: number) => ReactNode;
  chave?: (item: T, indice: number) => Key;
  /** Largura mínima de cada célula (padrão: 16rem) — define quantas colunas cabem. */
  larguraMin?: string;
  /** Altura das silhuetas: calibre pela altura do SEU card (padrão: 8.5rem). */
  alturaCard?: string;
  /** Nome acessível da grade. */
  rotulo?: string;
  /** Primeira carga: silhuetas no lugar dos cards. */
  carregando?: boolean;
  /** Recarga: mantém a grade esmaecida. */
  atualizando?: boolean;
  erro?: string | boolean;
  aoRecarregar?: () => void;
  vazioTitulo?: string;
  vazioDescricao?: string;
  vazioIcone?: string;
  vazioAcoes?: ReactNode;
  paginacao?: Omit<PaginacaoProps, 'embutida' | 'className'>;
  className?: string;
}

/** Listagem em grade de cards, irmã da `Tabela` (a ordenação fica na barra de filtros). */
export function ListaCards<T>({
  itens,
  card,
  chave = (i, n) => ((i as { id?: Key }).id ?? n) as Key,
  larguraMin = '16rem',
  alturaCard = '8.5rem',
  rotulo,
  carregando,
  atualizando,
  erro,
  aoRecarregar,
  vazioTitulo = 'Nenhum registro encontrado',
  vazioDescricao,
  vazioIcone = 'inbox',
  vazioAcoes,
  paginacao,
  className,
}: ListaCardsProps<T>) {
  const estilo = { '--lp-cards-min': larguraMin } as CSSProperties;

  let corpo: ReactNode;
  if (carregando) {
    corpo = (
      <div className="lp-cards" style={estilo} role="status" aria-busy="true" aria-label="Carregando registros">
        {Array.from({ length: Math.min(paginacao?.tamanho ?? 6, 12) }, (_, i) => (
          <Skeleton key={i} altura={alturaCard} />
        ))}
      </div>
    );
  } else if (erro) {
    corpo = (
      <Vazio icone="triangle-alert" titulo="Não foi possível carregar" descricao={typeof erro === 'string' ? erro : 'Verifique a conexão e tente de novo.'}>
        {aoRecarregar && <Botao rotulo="Tentar de novo" icone="refresh-cw" severidade="secundario" onClick={aoRecarregar} />}
      </Vazio>
    );
  } else if (!itens.length) {
    corpo = (
      <Vazio icone={vazioIcone} titulo={vazioTitulo} descricao={vazioDescricao}>
        {vazioAcoes}
      </Vazio>
    );
  } else {
    corpo = (
      <div
        className={cx('lp-cards', atualizando && 'is-atualizando')}
        style={estilo}
        role={rotulo ? 'group' : undefined}
        aria-label={rotulo || undefined}
        aria-busy={atualizando || undefined}
      >
        {itens.map((item, i) => (
          <div key={chave(item, i)} className="lp-cards-cel">
            {card(item, i)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cx('lp-cards-lista', className)}>
      {corpo}
      {paginacao && !carregando && !erro && paginacao.total > 0 && <Paginacao {...paginacao} />}
    </div>
  );
}
