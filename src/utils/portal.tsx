import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const semAssinatura = () => () => {};

/**
 * `true` só no navegador depois da hidratação. No servidor (SSR/Next.js) e no
 * render de hidratação fica `false`, sem render extra num app só cliente.
 */
export function useNoNavegador(): boolean {
  return useSyncExternalStore(
    semAssinatura,
    () => true,
    () => false,
  );
}

function Portal({ children }: { children: ReactNode }) {
  return useNoNavegador() ? createPortal(children, document.body) : null;
}

/** `createPortal(no, document.body)` que não quebra no SSR (lá não existe `document`). */
export function portal(no: ReactNode) {
  return <Portal>{no}</Portal>;
}
