import type { CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import './Progresso.css';

export type CorProgresso = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';

export interface SegmentoProgresso {
  valor: number;
  cor?: CorProgresso;
  /** Nome do segmento (leitor de tela e texto `dentro`). */
  rotulo?: string;
}

export interface ProgressoProps {
  /** Valor atual (0 a `max`). Ignorado quando há `segmentos`. */
  valor?: number;
  max?: number;
  /** Várias barras empilhadas na mesma trilha. */
  segmentos?: SegmentoProgresso[];
  cor?: CorProgresso;
  /** `listrado` = faixas diagonais · `gradiente` = clareia no começo. */
  aparencia?: 'solido' | 'listrado' | 'gradiente';
  /** Faixas em movimento (com `listrado`). */
  animado?: boolean;
  /** A barra cresce do zero ao aparecer. */
  entrada?: boolean;
  altura?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Onde mostrar o valor: `dentro` da barra · no `fim` da linha · `balao`
   * acima da ponta · `pilula` na ponta da barra.
   */
  mostrarValor?: 'nenhum' | 'dentro' | 'fim' | 'balao' | 'pilula';
  /** Bolinha na ponta da barra. */
  marcador?: boolean;
  /** Pontos de marco ao longo da trilha (valores, ex.: `[25, 50, 75]`). */
  marcos?: number[];
  /** Trilha com o tom claro da cor. */
  trilhaColorida?: boolean;
  /** Selo colorido no começo da barra (ex.: "Celulares"). */
  etiqueta?: string;
  /** Nome acessível (ex.: "Envio do arquivo"). */
  rotulo?: string;
  /** Formata o valor exibido (padrão: porcentagem). */
  formatar?: (valor: number, max: number) => string;
  className?: string;
}

const pct = (v: number, max: number) => Math.max(0, Math.min(100, (v / max) * 100));
const PADRAO = (v: number, max: number) => `${Math.round(pct(v, max))}%`;

/** Barra de progresso: simples, listrada, em gradiente, com marcos, balão de valor ou várias barras. */
export function Progresso({
  valor = 0,
  max = 100,
  segmentos,
  cor = 'pri',
  aparencia = 'solido',
  animado = false,
  entrada = false,
  altura = 'md',
  mostrarValor = 'nenhum',
  marcador = false,
  marcos,
  trilhaColorida = false,
  etiqueta,
  rotulo,
  formatar = PADRAO,
  className,
}: ProgressoProps) {
  const p = pct(valor, max);
  const texto = formatar(valor, max);
  const classeBarra = (c: CorProgresso) =>
    cx(
      'lp-prog-barra',
      // sempre explícita: num segmento `pri` dentro de barra de outra cor
      `lp-prog--${c}`,
      aparencia !== 'solido' && `lp-prog-barra--${aparencia}`,
      animado && 'lp-prog-barra--animado',
      entrada && 'lp-prog-barra--entrada',
    );

  return (
    <div
      className={cx(
        'lp-prog',
        cor !== 'pri' && `lp-prog--${cor}`,
        `lp-prog--${altura}`,
        trilhaColorida && 'lp-prog--trilha-colorida',
        mostrarValor === 'balao' && 'lp-prog--com-balao',
        className,
      )}
    >
      {etiqueta && <span className="lp-prog-etiqueta">{etiqueta}</span>}
      {segmentos ? (
        <div className="lp-prog-trilha" role="group" aria-label={rotulo}>
          {segmentos.map((s, i) => (
            <div
              key={i}
              className={classeBarra(s.cor ?? cor)}
              style={{ width: `${pct(s.valor, max)}%` }}
              role="progressbar"
              aria-label={s.rotulo}
              aria-valuenow={s.valor}
              aria-valuemin={0}
              aria-valuemax={max}
            >
              {mostrarValor === 'dentro' && <span className="lp-prog-texto">{formatar(s.valor, max)}</span>}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="lp-prog-trilha"
          role="progressbar"
          aria-label={rotulo ?? etiqueta}
          aria-valuenow={valor}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={texto}
          style={{ '--prog-pct': `${p}%` } as CSSProperties}
        >
          <div className={classeBarra(cor)} style={{ width: `${p}%` }}>
            {mostrarValor === 'dentro' && <span className="lp-prog-texto">{texto}</span>}
          </div>
          {marcos?.map((m) => (
            <span key={m} className={cx('lp-prog-marco', m <= valor && 'is-atingido')} style={{ left: `${pct(m, max)}%` }} aria-hidden="true" />
          ))}
          {marcador && <span className="lp-prog-marcador" aria-hidden="true" />}
          {mostrarValor === 'balao' && (
            <span className="lp-prog-balao" aria-hidden="true">
              {texto}
            </span>
          )}
          {mostrarValor === 'pilula' && (
            <span className="lp-prog-pilula" aria-hidden="true">
              {texto}
            </span>
          )}
        </div>
      )}
      {mostrarValor === 'fim' && (
        <span className="lp-prog-valor" aria-hidden="true">
          {segmentos ? formatar(segmentos.reduce((t, s) => t + s.valor, 0), max) : texto}
        </span>
      )}
    </div>
  );
}
