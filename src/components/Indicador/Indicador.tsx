import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Minigrafico } from '../Grafico/Minigrafico';
import { Skeleton } from '../Skeleton/Skeleton';
import './Indicador.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { formatoNumero } from '../../i18n/idiomas';

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
  /** Série para um minigráfico abaixo do valor, na cor de `cor` (ou `--graf-1`). Sem eixos: só a forma da tendência. */
  tendencia?: number[];
  /** Anima o minigráfico da `tendencia` ao aparecer (nunca com "reduzir movimento"). Padrão `false`. */
  animacao?: boolean;
  /** Linha miúda abaixo do valor (ex.: "há 6 min"). */
  descricao?: ReactNode;
  /** Rodapé (variação, comparação…). */
  children?: ReactNode;
  className?: string;
}


/** Card de KPI para dashboards. */
export function Indicador({ rotulo, valor, icone, cor, href, aoClicar, carregando, variacao, variacaoBoa = 'alta', tendencia, animacao, descricao, children, className }: IndicadorProps) {
  const t = useTextos();
  const idioma = useIdioma();
  const texto = typeof valor === 'number' ? formatoNumero(idioma).format(valor) : valor;
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
            {formatoNumero(idioma, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(variacao))}%<span className="lp-sr">{subiu ? t.grafico.alta : t.grafico.queda}</span>
          </span>
        </div>
      )}
      {tendencia && !carregando && <Minigrafico valores={tendencia} animacao={animacao} />}
      {descricao && <div className="lp-ind-desc">{descricao}</div>}
      {children && <div className="lp-ind-rodape">{children}</div>}
    </div>
  );
}

/** Grade responsiva de indicadores. */
export function Indicadores({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('lp-inds', className)}>{children}</div>;
}
