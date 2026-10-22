import type { CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import './Girador.css';

/** `atual` = cor do texto em volta (para usar dentro de botões). */
export type CorGirador = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro' | 'atual';

export interface GiradorProps {
  /** `anel` = gira · `pulso` = cresce e some · `pontos` = três pontos piscando. */
  tipo?: 'anel' | 'pulso' | 'pontos';
  cor?: CorGirador;
  /** Escala pronta, ou qualquer medida CSS (ex.: `'3rem'`). */
  tamanho?: 'pequeno' | 'medio' | 'grande' | (string & {});
  /** Texto para leitor de tela (e visível com `mostrarRotulo`). */
  rotulo?: string;
  mostrarRotulo?: boolean;
  className?: string;
}

const ESCALA: Record<string, string> = { pequeno: '1rem', medio: '1.75rem', grande: '2.75rem' };

/** Indicador de atividade em linha (spinner). Para espera de seção inteira, use `Carregando`. */
export function Girador({ tipo = 'anel', cor = 'pri', tamanho = 'medio', rotulo = 'Carregando...', mostrarRotulo = false, className }: GiradorProps) {
  return (
    <span
      role="status"
      className={cx('lp-girador', `lp-girador--${tipo}`, cor !== 'pri' && `lp-girador--${cor}`, className)}
      style={{ '--gir-tam': ESCALA[tamanho] ?? tamanho } as CSSProperties}
    >
      <span className="lp-girador-forma" aria-hidden="true">
        {tipo === 'pontos' && (
          <>
            <span />
            <span />
            <span />
          </>
        )}
      </span>
      <span className={mostrarRotulo ? 'lp-girador-rotulo' : 'lp-sr'}>{rotulo}</span>
    </span>
  );
}
