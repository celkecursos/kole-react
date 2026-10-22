import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import type { Severidade } from '../../utils/tipos';
import './Status.css';

export interface StatusProps {
  rotulo: string;
  severidade?: Severidade;
  icone?: IconeProp;
  className?: string;
}

/** Selo de situação (Ativo, Pendente, Cancelado…). */
export function Status({ rotulo, severidade = 'neutral', icone, className }: StatusProps) {
  return (
    <span className={cx('lp-status', className)} data-sev={severidade}>
      <Icone icone={icone} />
      <span>{rotulo}</span>
    </span>
  );
}
