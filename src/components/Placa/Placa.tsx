import { cx } from '../../utils/cx';
import './Placa.css';

export interface PlacaProps {
  /** Número da placa (ex.: `QBX-7H42`) — sempre exibido em maiúsculas. */
  numero: string;
  /** UF da faixa superior (padrão: PR). */
  uf?: string;
  className?: string;
}

/** Arte da placa de veículo (faixa BRASIL/UF + número), só leitura. */
export function Placa({ numero, uf = 'PR', className }: PlacaProps) {
  const n = (numero ?? '').toUpperCase();
  const u = (uf ?? '').toUpperCase();
  return (
    <span className={cx('lp-placa', className)} role="img" aria-label={`Placa ${n}${u ? `, ${u}` : ''}`}>
      <span className="lp-placa-faixa" aria-hidden="true">
        <span>BRASIL</span>
        {u && <span className="lp-placa-uf">{u}</span>}
      </span>
      <span className="lp-placa-numero" aria-hidden="true">
        {n}
      </span>
    </span>
  );
}
