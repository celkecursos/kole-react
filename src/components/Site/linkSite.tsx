import { createContext, useContext, type MouseEvent, type ReactNode } from 'react';
import type { PropsLink } from '../Estrutura/Estrutura';

export interface ContextoLinkSite {
  aoNavegar?: (rota: string) => void;
  renderLink?: (props: PropsLink) => ReactNode;
  /** Chamado depois de cada navegação (a `EstruturaSite` fecha o menu do celular). */
  aoNavegou?: () => void;
}

const LinkSiteCtx = createContext<ContextoLinkSite>({});
export const ProvedorLinkSite = LinkSiteCtx.Provider;

/** Ctrl, Shift, Alt, ⌘ ou botão do meio: o navegador abre em outra aba ou janela, sem o roteador. */
function abreForaDaPagina(e: MouseEvent<HTMLAnchorElement>) {
  return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

/**
 * Link de verdade (`<a href>`) que, dentro da `EstruturaSite`, navega pelo roteador
 * do app (`aoNavegar` ou `renderLink`). Fora dela, é um link comum.
 */
export function useLinkSite() {
  const { aoNavegar, renderLink, aoNavegou } = useContext(LinkSiteCtx);
  return (href: string, conteudo: ReactNode, className: string, extra?: { atual?: boolean; aoClicar?: () => void; rotulo?: string }) => {
    const props: PropsLink & { 'aria-label'?: string } = {
      href,
      className,
      children: conteudo,
      'aria-current': extra?.atual ? 'page' : undefined,
      onClick: (e) => {
        extra?.aoClicar?.();
        if (abreForaDaPagina(e)) return;
        if (aoNavegar && !renderLink) {
          e.preventDefault();
          aoNavegar(href);
        }
        aoNavegou?.();
      },
    };
    if (extra?.rotulo) props['aria-label'] = extra.rotulo;
    return renderLink ? renderLink(props) : <a {...props} />;
  };
}
