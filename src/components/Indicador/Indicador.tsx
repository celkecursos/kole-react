import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Skeleton } from '../Skeleton/Skeleton';
import './Indicador.css';

export interface IndicadorProps {
  rotulo: string;
  valor: number | string;
  icone?: IconeProp;
  /** Cor de destaque (qualquer cor CSS, de preferência um token: `var(--ok-solid)`). */
  cor?: string;
  /** Torna o card um link. */
  href?: string;
  aoClicar?: () => void;
  carregando?: boolean;
  /** Variação em % (ex.: `1.31` ou `-9.26`): seta e cor ao lado do valor. */
  variacao?: number;
  /** Qual direção é boa (verde). Padrão: `alta`; use `baixa` para despesas, rejeições… */
  variacaoBoa?: 'alta' | 'baixa';
  /** Linha miúda abaixo do valor (ex.: "há 6 min"). */
  descricao?: ReactNode;
  /** Rodapé (variação, comparação…). */
  children?: ReactNode;
  className?: string;
}

const NUM = new Intl.NumberFormat('pt-BR');
const PCT = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Card de KPI para dashboards. */
export function Indicador({ rotulo, valor, icone, cor, href, aoClicar, carregando, variacao, variacaoBoa = 'alta', descricao, children, className }: IndicadorProps) {
  const texto = typeof valor === 'number' ? NUM.format(valor) : valor;
  const subiu = (variacao ?? 0) >= 0;
  const boa = subiu === (variacaoBoa === 'alta');
  const estilo = cor ? ({ '--ind-cor': cor } as CSSProperties) : undefined;
  const acionavel = !!href || !!aoClicar;
  return (
    <div className={cx('lp-ind', cor && 'lp-ind--cor', acionavel && 'lp-ind--link', className)} style={estilo}>
      {href ? (
        <a className="lp-ind-link" href={href} onClick={aoClicar} aria-label={`${rotulo}: ${texto}`} />
      ) : aoClicar ? (
        <button type="button" className="lp-ind-link" onClick={aoClicar} aria-label={`${rotulo}: ${texto}`} />
      ) : null}
      <div className="lp-ind-topo">
        <span className="lp-ind-rotulo">{rotulo}</span>
        {icone && (
          <span className="lp-ind-tile">
            <Icone icone={icone} />
          </span>
        )}
      </div>
      {carregando ? (
        <Skeleton largura="4.5rem" altura="1.8rem" />
      ) : variacao === undefined ? (
        <div className="lp-ind-valor">{texto}</div>
      ) : (
        <div className="lp-ind-linha">
          <span className="lp-ind-valor">{texto}</span>
          <span className={cx('lp-ind-var', boa ? 'is-boa' : 'is-ruim')}>
            <Icone icone={subiu ? 'arrow-up' : 'arrow-down'} />
            {PCT.format(Math.abs(variacao))}%<span className="lp-sr">{subiu ? ' de alta' : ' de queda'}</span>
          </span>
        </div>
      )}
      {descricao && <div className="lp-ind-desc">{descricao}</div>}
      {children && <div className="lp-ind-rodape">{children}</div>}
    </div>
  );
}

/** Grade responsiva de indicadores. */
export function Indicadores({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('lp-inds', className)}>{children}</div>;
}
