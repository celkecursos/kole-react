import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './Carrossel.css';

export interface SlideCarrossel {
  imagem: string;
  alt: string;
  titulo?: ReactNode;
  descricao?: ReactNode;
  /** Tempo deste slide, em ms (sobrepõe o `intervalo` do carrossel). */
  intervalo?: number;
}

export interface CarrosselProps {
  slides: SlideCarrossel[];
  /** Nome do carrossel para leitor de tela. */
  rotulo: string;
  /** Avança sozinho. Desligado para quem prefere menos movimento. */
  automatico?: boolean;
  /** Tempo de cada slide, em ms. */
  intervalo?: number;
  /** Setas de anterior/próximo. */
  controles?: boolean;
  /** Tracinhos que levam a cada slide. */
  indicadores?: boolean;
  /** `deslizar` (padrão) ou `esmaecer`. */
  transicao?: 'deslizar' | 'esmaecer';
  /** Controles e legendas escuros, para imagens claras. */
  escuro?: boolean;
  /** Arrastar para os lados no toque/mouse troca o slide. */
  arrastar?: boolean;
  /** Proporção da área (ex.: `'16 / 9'`). */
  proporcao?: string;
  className?: string;
}

const prefereMenosMovimento = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Carrossel de imagens com legendas, setas, indicadores e avanço automático. */
export function Carrossel({
  slides,
  rotulo,
  automatico = true,
  intervalo = 5000,
  controles = false,
  indicadores = false,
  transicao = 'deslizar',
  escuro = false,
  arrastar = true,
  proporcao = '16 / 10',
  className,
}: CarrosselProps) {
  const n = slides.length;
  const [atual, setAtual] = useState(0);
  const [pausadoUsuario, setPausadoUsuario] = useState(() => prefereMenosMovimento());
  const [pausadoHover, setPausadoHover] = useState(false);
  const inicioArraste = useRef<number | null>(null);

  const ir = useCallback((i: number) => setAtual(((i % n) + n) % n), [n]);
  // a partir do estado mais recente: cliques seguidos não usam um índice velho
  const proximo = useCallback(() => setAtual((a) => (a + 1) % n), [n]);
  const anterior = () => setAtual((a) => (a - 1 + n) % n);

  const rodando = automatico && !pausadoUsuario && !pausadoHover && n > 1;
  useEffect(() => {
    if (!rodando) return;
    const t = window.setTimeout(proximo, slides[atual]?.intervalo ?? intervalo);
    return () => window.clearTimeout(t);
  }, [rodando, proximo, atual, slides, intervalo]);

  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') proximo();
    else if (e.key === 'ArrowLeft') anterior();
    else return;
    e.preventDefault();
  };

  const aoPressionar = (e: PointerEvent) => {
    if (arrastar) inicioArraste.current = e.clientX;
  };
  const aoSoltar = (e: PointerEvent) => {
    const x0 = inicioArraste.current;
    inicioArraste.current = null;
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (dx < -40) proximo();
    else if (dx > 40) anterior();
  };

  return (
    <section
      className={cx('lp-carrossel', `lp-carrossel--${transicao}`, escuro && 'lp-carrossel--escuro', !arrastar && 'lp-carrossel--sem-arraste', className)}
      aria-roledescription="carrossel"
      aria-label={rotulo}
      onMouseEnter={() => setPausadoHover(true)}
      onMouseLeave={() => setPausadoHover(false)}
      onFocus={() => setPausadoHover(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setPausadoHover(false)}
      onKeyDown={aoTeclar}
    >
      <div
        className="lp-carrossel-janela"
        style={{ aspectRatio: proporcao }}
        // anúncio só quando a troca vem do usuário: com avanço automático, silêncio
        aria-live={rodando ? 'off' : 'polite'}
        onPointerDown={aoPressionar}
        onPointerUp={aoSoltar}
        onPointerCancel={() => (inicioArraste.current = null)}
      >
        <div className="lp-carrossel-trilho" style={transicao === 'deslizar' ? { transform: `translateX(${-atual * 100}%)` } : undefined}>
          {slides.map((s, i) => (
            <div
              key={i}
              className={cx('lp-carrossel-slide', i === atual && 'is-atual')}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${n}`}
              inert={i !== atual}
            >
              <img src={s.imagem} alt={s.alt} draggable={false} />
              {(s.titulo || s.descricao) && (
                <div className="lp-carrossel-legenda">
                  {s.titulo && <strong>{s.titulo}</strong>}
                  {s.descricao && <span>{s.descricao}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {controles && n > 1 && (
        <>
          <button type="button" className="lp-carrossel-seta lp-carrossel-seta--ant" aria-label="Slide anterior" onClick={anterior}>
            <Icone icone="chevron-left" />
          </button>
          <button type="button" className="lp-carrossel-seta lp-carrossel-seta--prox" aria-label="Próximo slide" onClick={proximo}>
            <Icone icone="chevron-right" />
          </button>
        </>
      )}
      {indicadores && n > 1 && (
        <div className="lp-carrossel-indicadores">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cx('lp-carrossel-ind', i === atual && 'is-atual')}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === atual ? 'true' : undefined}
              onClick={() => ir(i)}
            />
          ))}
        </div>
      )}
      {automatico && n > 1 && (
        <button
          type="button"
          className="lp-carrossel-pausa"
          aria-label={pausadoUsuario ? 'Retomar a troca automática' : 'Pausar a troca automática'}
          onClick={() => setPausadoUsuario((p) => !p)}
        >
          <Icone icone={pausadoUsuario ? 'play' : 'pause'} />
        </button>
      )}
    </section>
  );
}
