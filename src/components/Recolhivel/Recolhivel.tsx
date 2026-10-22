import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Recolhivel.css';

export interface RecolhivelProps {
  aberto: boolean;
  children: ReactNode;
  /** `vertical` (padrão) anima a altura; `horizontal`, a largura. */
  orientacao?: 'vertical' | 'horizontal';
  id?: string;
  className?: string;
}

/**
 * Mostra/esconde o conteúdo com animação. Fechado, o conteúdo sai da ordem de
 * foco e do leitor de tela (`inert`).
 */
export function Recolhivel({ aberto, children, orientacao = 'vertical', id, className }: RecolhivelProps) {
  return (
    <div id={id} className={cx('lp-recolhivel', orientacao === 'horizontal' && 'lp-recolhivel--horizontal', aberto && 'is-aberto', className)} inert={!aberto}>
      <div className="lp-recolhivel-interno">{children}</div>
    </div>
  );
}
