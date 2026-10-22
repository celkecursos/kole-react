import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { portal } from '../../utils/portal';

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let abertos = 0;
// pilha das sobreposições abertas: o Esc é da que está no topo
const pilha: symbol[] = [];

export interface SobreposicaoProps {
  aoDispensar?: () => void;
  /** Esc e clique na máscara fecham. */
  dispensavel?: boolean;
  rotuloId?: string;
  descricaoId?: string;
  /** Elemento que recebe o foco ao abrir (seletor CSS dentro do painel). */
  focoInicial?: string;
  className?: string;
  /** Classe extra na máscara (ex.: alinhamento do painel lateral). */
  classeMascara?: string;
  children: ReactNode;
}

/**
 * Máscara + painel modal: portal no <body>, trava o scroll, prende o foco
 * (Tab circula dentro) e devolve o foco a quem abriu ao fechar.
 */
export function Sobreposicao({
  aoDispensar,
  dispensavel = true,
  rotuloId,
  descricaoId,
  focoInicial,
  className,
  classeMascara,
  children,
}: SobreposicaoProps) {
  const painel = useRef<HTMLDivElement>(null);
  const dispensar = useRef({ aoDispensar, dispensavel });
  dispensar.current = { aoDispensar, dispensavel };

  // Esc no documento: vale mesmo quando o foco caiu no <body> (ex.: o
  // elemento focado saiu da tela ao trocar o conteúdo do diálogo)
  useEffect(() => {
    const eu = Symbol('sobreposicao');
    pilha.push(eu);
    const h = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || pilha[pilha.length - 1] !== eu || e.defaultPrevented) return;
      if (painel.current?.contains(document.activeElement)) return; // o onKeyDown do painel cuida
      if (dispensar.current.dispensavel) dispensar.current.aoDispensar?.();
    };
    document.addEventListener('keydown', h);
    return () => {
      document.removeEventListener('keydown', h);
      pilha.splice(pilha.indexOf(eu), 1);
    };
  }, []);

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    abertos++;
    document.body.style.overflow = 'hidden';
    const el = painel.current;
    const alvo =
      (focoInicial && el?.querySelector<HTMLElement>(focoInicial)) ||
      el?.querySelector<HTMLElement>('[data-foco-inicial]') ||
      el?.querySelector<HTMLElement>('.lp-dlg-corpo ' + FOCAVEIS.split(',').join(', .lp-dlg-corpo ')) ||
      el;
    alvo?.focus();
    return () => {
      abertos--;
      if (!abertos) document.body.style.overflow = '';
      anterior?.focus?.();
    };
    // abre uma vez por montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && dispensavel) {
      e.stopPropagation();
      aoDispensar?.();
      return;
    }
    if (e.key !== 'Tab' || !painel.current) return;
    const lista = [...painel.current.querySelectorAll<HTMLElement>(FOCAVEIS)].filter((n) => n.offsetParent !== null);
    if (!lista.length) {
      e.preventDefault();
      return;
    }
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  };

  return portal(
    <div
      className={classeMascara ? `lp-sobre ${classeMascara}` : 'lp-sobre'}
      onMouseDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (dispensavel) aoDispensar?.();
        else {
          // não fecha por fora: um tremidinho avisa que é preciso usar os botões
          const el = painel.current;
          el?.classList.remove('lp-sobre-recusa');
          void el?.offsetWidth;
          el?.classList.add('lp-sobre-recusa');
        }
      }}
    >
      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={rotuloId}
        aria-describedby={descricaoId}
        tabIndex={-1}
        className={className}
        onKeyDown={aoTeclar}
      >
        {children}
      </div>
    </div>,
  );
}
