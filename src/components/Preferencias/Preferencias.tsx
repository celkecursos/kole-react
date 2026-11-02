import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ProvedorConfirmacao } from '../Confirmacao/Confirmacao';
import { ProvedorToast } from '../Toast/Toast';

/** `sistema` = segue o modo do sistema operacional, inclusive quando ele muda com a página aberta. */
export type Tema = 'claro' | 'escuro' | 'sistema';
export type Densidade = 'compacta' | 'confortavel' | 'espacosa';

const CLASSE_DENSIDADE: Record<Densidade, string> = {
  compacta: 'density-compact',
  confortavel: 'density-comfortable',
  espacosa: 'density-cozy',
};

const ATRIBUTO_TEMA: Record<Tema, string> = { claro: 'light', escuro: 'dark', sistema: 'system' };

const CONSULTA_ESCURO = '(prefers-color-scheme: dark)';

/**
 * Sem escolha salva nem `temaInicial`, segue o sistema operacional. Antes, o
 * tema do sistema era lido na primeira visita e salvo como claro/escuro, e o
 * app parava de acompanhar se o sistema mudasse depois.
 */
const TEMA_PADRAO: Tema = 'sistema';

export interface Preferencias {
  tema: Tema;
  /** O tema que está na tela: com `sistema`, o do sistema operacional agora. */
  escuro: boolean;
  densidade: Densidade;
  definirTema: (t: Tema) => void;
  alternarTema: () => void;
  definirDensidade: (d: Densidade) => void;
}

const Ctx = createContext<Preferencias | null>(null);

const CHAVE = 'lp-preferencias';

function ler(): Partial<{ tema: Tema; densidade: Densidade }> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '{}');
  } catch {
    return {};
  }
}

function sistemaEscuro(): boolean {
  try {
    return window.matchMedia(CONSULTA_ESCURO).matches;
  } catch {
    return false;
  }
}

/** Acompanha o modo do sistema operacional, só enquanto o tema é `sistema`. */
function useSistemaEscuro(ativo: boolean): boolean {
  const [escuro, setEscuro] = useState(sistemaEscuro);
  useEffect(() => {
    if (!ativo) return undefined;
    let consulta: MediaQueryList;
    try {
      consulta = window.matchMedia(CONSULTA_ESCURO);
    } catch {
      return undefined;
    }
    setEscuro(consulta.matches);
    const aoMudar = (e: MediaQueryListEvent) => setEscuro(e.matches);
    consulta.addEventListener('change', aoMudar);
    return () => consulta.removeEventListener('change', aoMudar);
  }, [ativo]);
  return escuro;
}

/**
 * Script para o `<head>` que aplica tema e densidade ANTES da primeira pintura.
 * Sem ele, o `ProvedorPreferencias` só aplica no primeiro efeito, e quem salvou
 * o tema escuro vê a página clara piscar ao abrir. Lê a mesma chave do
 * `localStorage`; passe o mesmo `temaInicial`/`densidadeInicial` do provedor.
 *
 * SSR: `<script dangerouslySetInnerHTML={{ __html: scriptTemaInicial() }} />`.
 * Vite/HTML estático: o README traz o script pronto para colar no index.html.
 */
export function scriptTemaInicial({ temaInicial, densidadeInicial = 'confortavel' }: { temaInicial?: Tema; densidadeInicial?: Densidade } = {}): string {
  return (
    `(function(){var p={};try{p=JSON.parse(localStorage.getItem(${JSON.stringify(CHAVE)})||"{}")||{}}catch(e){}` +
    `var t=p.tema||${JSON.stringify(temaInicial ?? TEMA_PADRAO)};` +
    `var h=document.documentElement;h.setAttribute("data-theme",${JSON.stringify(ATRIBUTO_TEMA)}[t]||"light");` +
    `var d=${JSON.stringify(CLASSE_DENSIDADE)}[p.densidade||${JSON.stringify(densidadeInicial)}];if(d)h.classList.add(d)})();`
  );
}

export interface ProvedorPreferenciasProps {
  children: ReactNode;
  /** Tema enquanto a pessoa não escolhe outro. Padrão: `sistema`. */
  temaInicial?: Tema;
  densidadeInicial?: Densidade;
}

/**
 * Tema (claro/escuro/sistema) e densidade, lembrados no navegador. Aplica
 * `data-theme` (`light`/`dark`/`system`) no <html> e a classe de densidade no
 * <body>. Para não piscar ao abrir, use também o `scriptTemaInicial` no <head>.
 */
export function ProvedorPreferencias({ children, temaInicial, densidadeInicial = 'confortavel' }: ProvedorPreferenciasProps) {
  const [tema, setTema] = useState<Tema>(() => ler().tema ?? temaInicial ?? TEMA_PADRAO);
  const [densidade, setDensidade] = useState<Densidade>(() => ler().densidade ?? densidadeInicial);
  const escuroDoSistema = useSistemaEscuro(tema === 'sistema');
  const escuro = tema === 'escuro' || (tema === 'sistema' && escuroDoSistema);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', ATRIBUTO_TEMA[tema] ?? 'light');
  }, [tema]);

  useEffect(() => {
    const body = document.body;
    Object.values(CLASSE_DENSIDADE).forEach((c) => body.classList.remove(c));
    body.classList.add(CLASSE_DENSIDADE[densidade]);
  }, [densidade]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ tema, densidade }));
    } catch {
      /* navegação privada: segue sem lembrar */
    }
  }, [tema, densidade]);

  // alterna o que está na tela: no `sistema`, sai dele para o oposto do atual
  const alternarTema = useCallback(() => setTema(escuro ? 'claro' : 'escuro'), [escuro]);

  const valor = useMemo<Preferencias>(
    () => ({
      tema,
      escuro,
      densidade,
      definirTema: setTema,
      alternarTema,
      definirDensidade: setDensidade,
    }),
    [tema, escuro, densidade, alternarTema],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function usePreferencias(): Preferencias {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePreferencias precisa de <ProvedorPreferencias> (ou <ProvedorUi>) acima na árvore.');
  return ctx;
}

/** Tudo que a biblioteca precisa na raiz do app: preferências, toasts e confirmação. */
export function ProvedorUi({ children, ...prefs }: ProvedorPreferenciasProps) {
  return (
    <ProvedorPreferencias {...prefs}>
      <ProvedorToast>
        <ProvedorConfirmacao>{children}</ProvedorConfirmacao>
      </ProvedorToast>
    </ProvedorPreferencias>
  );
}

/** Igual a `usePreferencias`, mas devolve `null` fora do provedor. */
export function usePreferenciasOpcional(): Preferencias | null {
  return useContext(Ctx);
}
