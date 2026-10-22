import { Icone } from '../../utils/Icone';
import type { FormEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Alerta } from '../Alerta/Alerta';
import { Botao } from '../Botao/Botao';
import { Chip } from '../Chip/Chip';
import './Filtros.css';

export interface FiltroAplicado {
  campo: string;
  rotulo: string;
  aoRemover?: () => void;
}

export interface FiltrosProps {
  /** Campos de filtro — de preferência com `variante="inline"`. */
  children: ReactNode;
  aoConsultar: () => void;
  aoLimpar?: () => void;
  /** Chips dos filtros já aplicados. */
  aplicados?: FiltroAplicado[];
  /** Há mudanças ainda não consultadas (ponto âmbar + aviso). */
  alterado?: boolean;
  consultando?: boolean;
  /** `barra` = linha única em card · `secao` = moldura com legenda "Filtros". */
  aparencia?: 'barra' | 'secao';
  className?: string;
}

/** Barra de filtros de listagem: campos + Consultar + Limpar + chips. */
export function Filtros({
  children,
  aoConsultar,
  aoLimpar,
  aplicados = [],
  alterado,
  consultando,
  aparencia = 'barra',
  className,
}: FiltrosProps) {
  const aoSubmeter = (e: FormEvent) => {
    e.preventDefault();
    aoConsultar();
  };
  return (
    <div className={cx('lp-filtros', className)}>
      <form onSubmit={aoSubmeter} noValidate>
        <fieldset className={cx('lp-ff', aparencia === 'secao' && 'lp-ff--secao')}>
          {aparencia === 'secao' && (
            <legend className="lp-ff-leg">
              <Icone icone="funnel" />
              Filtros
            </legend>
          )}
          <div className={cx('lp-fb', aparencia === 'secao' && 'lp-fb--secao')}>
            <div className="lp-fb-campos">{children}</div>
            <div className="lp-fb-acoes">
              <span className="lp-fb-consultar">
                <Botao
                  type="submit"
                  rotulo="Consultar"
                  icone="search"
                  carregando={consultando}
                  aria-label={alterado ? 'Consultar, filtros alterados' : 'Consultar'}
                />
                {alterado && <span className="lp-fb-ponto" aria-hidden="true" />}
              </span>
              {aoLimpar && (
                <Botao icone="funnel-x" severidade="secundario" aria-label="Limpar filtros" dica="Limpar filtros" onClick={aoLimpar} />
              )}
            </div>
          </div>
        </fieldset>
      </form>
      {alterado && (
        <div className="lp-fb-avisos">
          <Alerta severidade="warn" mensagem="Filtros alterados — clique em Consultar para atualizar a lista." />
        </div>
      )}
      {aplicados.length > 0 && (
        <div className="lp-fb-chips" role="list" aria-label="Filtros aplicados">
          {aplicados.map((f) => (
            <span role="listitem" key={f.campo}>
              <Chip campo={f.campo} rotulo={f.rotulo} aoRemover={f.aoRemover} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
