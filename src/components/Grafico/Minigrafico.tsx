import { cx } from '../../utils/cx';
import './Minigrafico.css';

export interface MinigraficoProps {
  valores: number[];
  className?: string;
}

/**
 * Linha pequena, sem eixos (sparkline), na cor `--ind-cor` do indicador ou `--graf-1`.
 * Decorativa: o valor em texto fica com quem a usa.
 */
export function Minigrafico({ valores, className }: MinigraficoProps) {
  const v = valores.filter((x) => Number.isFinite(x));
  if (v.length < 2) return null;
  const min = Math.min(...v);
  const max = Math.max(...v);
  const faixa = max - min || 1;
  // viewBox fixo e esticado na largura; o traço não engrossa (non-scaling-stroke)
  const pontos = v.map((x, i) => `${((i / (v.length - 1)) * 100).toFixed(2)},${(28 - ((x - min) / faixa) * 24).toFixed(2)}`).join(' ');
  return (
    <svg className={cx('lp-graf-mini', className)} viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pontos} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
