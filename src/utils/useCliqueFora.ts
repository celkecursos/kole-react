import { useEffect, type RefObject } from 'react';

/** Chama `aoClicarFora` em pointerdown fora de TODOS os elementos dados. */
export function useCliqueFora(
  refs: Array<RefObject<HTMLElement | null>>,
  ativo: boolean,
  aoClicarFora: () => void,
) {
  useEffect(() => {
    if (!ativo) return;
    const handler = (e: PointerEvent) => {
      const alvo = e.target as Node;
      if (refs.some((r) => r.current?.contains(alvo))) return;
      aoClicarFora();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
    // refs são estáveis (useRef); o callback muda a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo, aoClicarFora]);
}
