import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Detalhes.css';

export interface DetalhesProps {
  rotulo: string;
  /** Valor em texto; `children` substitui. Vazio mostra travessão. */
  valor?: ReactNode;
  /** `coluna` = rótulo em cima · `linha` = rótulo à esquerda, valor à direita. */
  disposicao?: 'coluna' | 'linha';
  children?: ReactNode;
  className?: string;
}

/** Par rótulo/valor para telas de visualização. */
export function Detalhes({ rotulo, valor, disposicao = 'coluna', children, className }: DetalhesProps) {
  const conteudo = children ?? (valor === undefined || valor === null || valor === '' ? '—' : valor);
  return (
    <div className={cx('lp-det', disposicao === 'linha' && 'lp-det--linha', className)}>
      <span className="lp-det-rotulo">{rotulo}</span>
      <span className="lp-det-valor">{conteudo}</span>
    </div>
  );
}
