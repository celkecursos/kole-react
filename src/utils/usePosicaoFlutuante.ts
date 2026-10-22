import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

export interface PosicaoFlutuante {
  top: number;
  left: number;
  width: number;
  /** true quando abriu para CIMA por falta de espaço embaixo */
  acima: boolean;
}

/**
 * Posição `fixed` de um painel flutuante ancorado num elemento (select,
 * dica). Recalcula em scroll (de qualquer container) e resize.
 */
export function usePosicaoFlutuante(
  ancora: RefObject<HTMLElement | null>,
  aberto: boolean,
  alturaEstimada = 260,
  espaco = 4,
): PosicaoFlutuante | null {
  const [pos, setPos] = useState<PosicaoFlutuante | null>(null);

  const medir = useCallback(() => {
    const el = ancora.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const abaixo = window.innerHeight - r.bottom;
    const acima = abaixo < alturaEstimada && r.top > abaixo;
    setPos({
      top: acima ? r.top - espaco : r.bottom + espaco,
      left: r.left,
      width: r.width,
      acima,
    });
  }, [ancora, alturaEstimada, espaco]);

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

  return pos;
}
