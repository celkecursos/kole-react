import { isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import './Dica.css';

export type PosicaoDica = 'cima' | 'direita' | 'baixo' | 'esquerda';
export type CorDica = 'padrao' | 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'claro';

export interface DicaProps {
  /** Texto do balão (aceita conteúdo formatado). Vazio = sem dica (o filho é renderizado puro). */
  texto?: ReactNode;
  children: ReactNode;
  /** Atraso para abrir no hover, em ms. */
  atraso?: number;
  /** Lado preferido; vira para o oposto se não couber. Padrão: `cima`. */
  posicao?: PosicaoDica;
  cor?: CorDica;
}

interface Pos {
  top: number;
  left: number;
  lado: PosicaoDica;
}

/** Espaço mínimo (px) para a dica caber de um lado antes de virar para o outro. */
const FOLGA_V = 48;
const FOLGA_H = 160;
const DISTANCIA = 6;

function posicionar(r: DOMRect, preferido: PosicaoDica): Pos {
  let lado = preferido;
  if (lado === 'cima' && r.top < FOLGA_V) lado = 'baixo';
  else if (lado === 'baixo' && window.innerHeight - r.bottom < FOLGA_V) lado = 'cima';
  else if (lado === 'direita' && window.innerWidth - r.right < FOLGA_H) lado = 'esquerda';
  else if (lado === 'esquerda' && r.left < FOLGA_H) lado = 'direita';
  const cx_ = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  if (lado === 'cima') return { top: r.top - DISTANCIA, left: cx_, lado };
  if (lado === 'baixo') return { top: r.bottom + DISTANCIA, left: cx_, lado };
  if (lado === 'direita') return { top: cy, left: r.right + DISTANCIA, lado };
  return { top: cy, left: r.left - DISTANCIA, lado };
}

/** Balão de dica (tooltip) no hover/foco do elemento envolvido. */
export function Dica({ texto, children, atraso = 350, posicao = 'cima', cor = 'padrao' }: DicaProps) {
  const alvo = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<Pos | null>(null);

  const abrir = (imediato: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        const el = alvo.current;
        if (!el) return;
        // mede o próprio filho (o span-alvo pode ser maior que ele)
        const medido = (el.firstElementChild as HTMLElement | null) ?? el;
        setPos(posicionar(medido.getBoundingClientRect(), posicao));
      },
      imediato ? 0 : atraso,
    );
  };
  const fechar = () => {
    window.clearTimeout(timer.current);
    setPos(null);
  };

  useEffect(() => {
    if (!pos) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', esc);
    window.addEventListener('scroll', fechar, true);
    return () => {
      window.removeEventListener('keydown', esc);
      window.removeEventListener('scroll', fechar, true);
    };
  }, [pos]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!texto) return <>{children}</>;

  // elemento desabilitado não recebe foco nem eventos: o próprio alvo assume
  const filhoDesabilitado = isValidElement<{ disabled?: boolean }>(children) && !!children.props.disabled;

  return (
    <span
      ref={alvo}
      className="lp-dica-alvo"
      tabIndex={filhoDesabilitado ? 0 : undefined}
      onMouseEnter={() => abrir(false)}
      onMouseLeave={fechar}
      onFocus={() => abrir(true)}
      onBlur={fechar}
      onPointerDown={fechar}
    >
      {children}
      {pos &&
        portal(
          <div
            className={cx('lp-dica', `lp-dica--${pos.lado}`, cor !== 'padrao' && `lp-dica--${cor}`)}
            style={{ top: pos.top, left: pos.left }}
            aria-hidden="true"
          >
            {texto}
          </div>,
        )}
    </span>
  );
}
