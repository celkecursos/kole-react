import { useEffect, useRef } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import './Carregando.css';

export interface CarregandoProps {
  mensagem?: string;
  /** Imagem da marca (ex.: logo) no lugar do anel. */
  logo?: string;
  /** Cobre a página inteira com máscara e bloqueia interação. */
  bloqueante?: boolean;
  className?: string;
}

/** Indicador de espera de seção/página. Para listas, prefira Skeleton. */
export function Carregando({ mensagem = 'Carregando', logo, bloqueante = false, className }: CarregandoProps) {
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bloqueante) return;
    const anterior = document.activeElement as HTMLElement | null;
    painel.current?.focus();
    return () => anterior?.focus?.();
  }, [bloqueante]);

  const conteudo = (
    <div
      className={cx('lp-carr', bloqueante && 'lp-carr--overlay', className)}
      role="status"
      aria-busy={bloqueante || undefined}
      onKeyDown={bloqueante ? (e) => e.key === 'Tab' && e.preventDefault() : undefined}
    >
      <div className="lp-carr-painel" ref={painel} tabIndex={-1}>
        <span className="lp-carr-pilha">
          {logo ? <img className="lp-carr-logo" src={logo} alt="" aria-hidden="true" /> : <span className="lp-carr-anel" aria-hidden="true" />}
          <span className="lp-carr-traco" aria-hidden="true" />
          <span className="lp-carr-txt">
            <span>{mensagem}</span>
            <span className="lp-carr-pontos" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </span>
        </span>
      </div>
    </div>
  );

  return bloqueante ? portal(conteudo) : conteudo;
}
