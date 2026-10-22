import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import './Citacao.css';

export type CorCitacao = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';

export interface CitacaoProps {
  /** O texto citado. */
  children: ReactNode;
  /** Quem disse. */
  autor?: ReactNode;
  /** De onde veio (livro, discurso…), em itálico depois do autor. */
  fonte?: ReactNode;
  cor?: CorCitacao;
  /** `simples` = filete na lateral · `cartao` = fundo claro da cor, ícone e aspas. */
  aparencia?: 'simples' | 'cartao';
  alinhamento?: 'inicio' | 'centro' | 'fim';
  /** Ícone no canto do cartão (só na aparência `cartao`). */
  icone?: IconeProp;
  className?: string;
}

/** Citação (blockquote) com autor e fonte. */
export function Citacao({ children, autor, fonte, cor = 'pri', aparencia = 'simples', alinhamento = 'inicio', icone = 'info', className }: CitacaoProps) {
  return (
    <figure
      className={cx(
        'lp-citacao',
        cor !== 'pri' && `lp-citacao--${cor}`,
        `lp-citacao--${aparencia}`,
        alinhamento !== 'inicio' && `lp-citacao--${alinhamento}`,
        className,
      )}
    >
      {aparencia === 'cartao' && <Icone icone={icone} className="lp-citacao-ic" />}
      <blockquote className="lp-citacao-texto">{children}</blockquote>
      {(autor || fonte) && (
        <figcaption className="lp-citacao-autor">
          — {autor}
          {fonte && <> {autor && 'em '}<cite>{fonte}</cite></>}
        </figcaption>
      )}
    </figure>
  );
}
