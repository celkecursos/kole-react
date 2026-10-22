import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import { useCliqueFora } from '../../utils/useCliqueFora';
import './Balao.css';

export type PosicaoBalao = 'cima' | 'direita' | 'baixo' | 'esquerda';
export type CorBalao = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';
/** `padrao` · `cabecalho` = só o título na cor · `solido` = balão todo na cor · `suave` = fundo claro da cor. */
export type AparenciaBalao = 'padrao' | 'cabecalho' | 'solido' | 'suave';
/**
 * `clique` = abre/fecha no clique; fecha também ao clicar fora ou Esc ·
 * `foco` = fecha no próximo clique em qualquer lugar · `passar` = abre com o
 * mouse em cima ou com o foco do teclado.
 */
export type GatilhoBalao = 'clique' | 'foco' | 'passar';

export interface BalaoProps {
  /** O elemento que abre o balão (botão, ícone, avatar…). */
  children: ReactNode;
  titulo?: ReactNode;
  conteudo: ReactNode;
  /** Lado preferido; vira para o oposto se não couber. */
  posicao?: PosicaoBalao;
  cor?: CorBalao;
  aparencia?: AparenciaBalao;
  gatilho?: GatilhoBalao;
  /** Largura máxima (padrão `17rem`). */
  largura?: string;
  className?: string;
}

interface Pos {
  top: number;
  left: number;
  lado: PosicaoBalao;
  /** deslocamento da seta ao longo do lado, em px */
  seta: number;
}

const OPOSTO: Record<PosicaoBalao, PosicaoBalao> = { cima: 'baixo', baixo: 'cima', direita: 'esquerda', esquerda: 'direita' };
const DISTANCIA = 10;
const MARGEM = 8;

function cabe(r: DOMRect, w: number, h: number, lado: PosicaoBalao) {
  if (lado === 'cima') return r.top - DISTANCIA - h >= MARGEM;
  if (lado === 'baixo') return r.bottom + DISTANCIA + h <= window.innerHeight - MARGEM;
  if (lado === 'esquerda') return r.left - DISTANCIA - w >= MARGEM;
  return r.right + DISTANCIA + w <= window.innerWidth - MARGEM;
}

function posicionar(r: DOMRect, w: number, h: number, preferido: PosicaoBalao): Pos {
  const lado = cabe(r, w, h, preferido) || !cabe(r, w, h, OPOSTO[preferido]) ? preferido : OPOSTO[preferido];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx_ = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let top: number;
  let left: number;
  if (lado === 'cima' || lado === 'baixo') {
    top = lado === 'cima' ? r.top - DISTANCIA - h : r.bottom + DISTANCIA;
    left = Math.max(MARGEM, Math.min(cx_ - w / 2, vw - w - MARGEM));
    return { top, left, lado, seta: cx_ - left };
  }
  left = lado === 'esquerda' ? r.left - DISTANCIA - w : r.right + DISTANCIA;
  top = Math.max(MARGEM, Math.min(cy - h / 2, vh - h - MARGEM));
  return { top, left, lado, seta: cy - top };
}

/**
 * Balão com título e conteúdo (popover), ancorado num elemento. Abre no
 * clique, no foco ou ao passar o mouse; nas 4 direções e em cores.
 */
export function Balao({
  children,
  titulo,
  conteudo,
  posicao = 'cima',
  cor = 'pri',
  aparencia = 'padrao',
  gatilho = 'clique',
  largura,
  className,
}: BalaoProps) {
  const id = useId();
  const alvo = useRef<HTMLSpanElement>(null);
  const balao = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  const medir = useCallback(() => {
    const a = alvo.current;
    const b = balao.current;
    if (!a || !b) return;
    // mede o próprio filho (o span-alvo pode ser maior que ele)
    const el = (a.firstElementChild as HTMLElement | null) ?? a;
    setPos(posicionar(el.getBoundingClientRect(), b.offsetWidth, b.offsetHeight, posicao));
  }, [posicao]);

  useLayoutEffect(() => {
    if (!aberto) {
      setPos(null);
      return;
    }
    medir();
    window.addEventListener('scroll', medir, true);
    window.addEventListener('resize', medir);
    return () => {
      window.removeEventListener('scroll', medir, true);
      window.removeEventListener('resize', medir);
    };
  }, [aberto, medir]);

  // Esc fecha; no gatilho `foco`, qualquer clique fecha
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', esc);
    if (gatilho !== 'foco') return () => document.removeEventListener('keydown', esc);
    // adiado: o próprio clique que abriu não pode fechar
    const t = window.setTimeout(() => document.addEventListener('pointerdown', fechar), 0);
    function fechar(e: PointerEvent) {
      if (alvo.current?.contains(e.target as Node)) return;
      setAberto(false);
    }
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', esc);
      document.removeEventListener('pointerdown', fechar);
    };
  }, [aberto, gatilho]);

  useCliqueFora([alvo, balao], aberto && gatilho === 'clique', () => setAberto(false));
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const passar = gatilho === 'passar';
  const abrirLogo = () => {
    window.clearTimeout(timer.current);
    setAberto(true);
  };
  // atraso ao sair: dá tempo de levar o mouse até o balão
  const fecharDepois = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAberto(false), 120);
  };

  const filhoDesabilitado = isValidElement<{ disabled?: boolean }>(children) && !!children.props.disabled;
  const filho = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-expanded': passar ? undefined : aberto,
        'aria-describedby': aberto ? id : undefined,
      })
    : children;

  return (
    <span
      ref={alvo}
      className="lp-balao-alvo"
      // botão desabilitado não recebe foco nem eventos: o próprio alvo assume
      tabIndex={filhoDesabilitado ? 0 : undefined}
      onClick={passar ? undefined : () => setAberto((a) => !a)}
      onMouseEnter={passar ? abrirLogo : undefined}
      onMouseLeave={passar ? fecharDepois : undefined}
      onFocus={passar ? abrirLogo : undefined}
      onBlur={passar ? fecharDepois : undefined}
    >
      {filho}
      {aberto &&
        portal(
          <div
            ref={balao}
            id={id}
            role={passar ? 'tooltip' : 'dialog'}
            aria-label={typeof titulo === 'string' ? titulo : undefined}
            className={cx(
              'lp-balao',
              cor !== 'pri' && `lp-balao--${cor}`,
              aparencia !== 'padrao' && `lp-balao--${aparencia}`,
              pos && `lp-balao--${pos.lado}`,
              className,
            )}
            style={
              {
                top: pos?.top ?? 0,
                left: pos?.left ?? 0,
                maxWidth: largura,
                visibility: pos ? undefined : 'hidden',
                '--balao-seta': pos ? `${pos.seta}px` : undefined,
              } as CSSProperties
            }
            onMouseEnter={passar ? abrirLogo : undefined}
            onMouseLeave={passar ? fecharDepois : undefined}
            // o portal ainda borbulha no React: sem isto, clicar no balão o fecharia pelo alvo
            onClick={(e) => e.stopPropagation()}
          >
            <span className="lp-balao-seta" aria-hidden="true" />
            {titulo && <div className="lp-balao-titulo">{titulo}</div>}
            <div className="lp-balao-corpo">{conteudo}</div>
          </div>,
        )}
    </span>
  );
}
