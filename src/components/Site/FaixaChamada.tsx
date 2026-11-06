import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './FaixaChamada.css';

export interface FaixaChamadaProps {
  titulo: string;
  descricao?: ReactNode;
  /** Botões à direita. */
  acoes?: ReactNode;
  /** `pri` = azul da marca (padrão) · `escuro` = marinho. */
  cor?: 'pri' | 'escuro';
  /** Nível do título. Padrão: `2`. */
  nivel?: 2 | 3;
  className?: string;
}

/** Faixa de chamada para ação ("Pronto para começar?"), com botões. */
export function FaixaChamada({ titulo, descricao, acoes, cor = 'pri', nivel = 2, className }: FaixaChamadaProps) {
  const Titulo = `h${nivel}` as 'h2' | 'h3';
  return (
    <div className={cx('lp-faixa-cta', `lp-faixa-cta--${cor}`, className)}>
      <div className="lp-faixa-cta-tx">
        <Titulo className="lp-faixa-cta-titulo">{titulo}</Titulo>
        {descricao && <p className="lp-faixa-cta-desc">{descricao}</p>}
      </div>
      {acoes && <div className="lp-faixa-cta-acoes">{acoes}</div>}
    </div>
  );
}
