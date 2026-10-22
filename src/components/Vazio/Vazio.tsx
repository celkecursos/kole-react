import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import './Vazio.css';

export interface VazioProps {
  titulo: string;
  descricao?: string;
  icone?: IconeProp;
  /** Botões de ação abaixo do texto. */
  children?: ReactNode;
  className?: string;
}

/** Estado vazio (lista sem registros, busca sem resultado…). */
export function Vazio({ titulo, descricao, icone = 'inbox', children, className }: VazioProps) {
  return (
    <div className={cx('lp-vazio', className)}>
      <div className="lp-vazio-ic">
        <Icone icone={icone} />
      </div>
      <div className="lp-vazio-titulo">{titulo}</div>
      {descricao && <div className="lp-vazio-desc">{descricao}</div>}
      {children && <div className="lp-vazio-acoes">{children}</div>}
    </div>
  );
}
