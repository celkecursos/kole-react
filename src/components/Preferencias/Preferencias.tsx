import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ContextoIdioma } from '../../i18n/contexto';
import { registrarTextos, textosDe, type TextosParciais } from '../../i18n/textos';
import type { Idioma } from '../../i18n/idiomas';
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
  /** Idioma dos textos da biblioteca (padrão `pt-BR`). */
  idioma: Idioma;
  definirTema: (t: Tema) => void;
  alternarTema: () => void;
  definirDensidade: (d: Densidade) => void;
  /** Troca o idioma: todos os componentes mudam na hora, e a escolha fica lembrada. */
  definirIdioma: (i: Idioma) => void;
}

const Ctx = createContext<Preferencias | null>(null);

const CHAVE = 'lp-preferencias';

function ler(): Partial<{ tema: Tema; densidade: Densidade; idioma: Idioma }> {
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
export function scriptTemaInicial({
  temaInicial,
  densidadeInicial = 'confortavel',
  idiomaInicial,
}: { temaInicial?: Tema; densidadeInicial?: Densidade; idiomaInicial?: Idioma } = {}): string {
  return (
    `(function(){var p={};try{p=JSON.parse(localStorage.getItem(${JSON.stringify(CHAVE)})||"{}")||{}}catch(e){}` +
    `var t=p.tema||${JSON.stringify(temaInicial ?? TEMA_PADRAO)};` +
    `var h=document.documentElement;h.setAttribute("data-theme",${JSON.stringify(ATRIBUTO_TEMA)}[t]||"light");` +
    // o lang só muda quando há idioma salvo ou `idiomaInicial`: sem isso, fica o do HTML
    `var l=p.idioma||${JSON.stringify(idiomaInicial ?? '')};if(l)h.lang=l;` +
    `var d=${JSON.stringify(CLASSE_DENSIDADE)}[p.densidade||${JSON.stringify(densidadeInicial)}];if(d)h.classList.add(d)})();`
  );
}

export interface ProvedorPreferenciasProps {
  children: ReactNode;
  /** Tema enquanto a pessoa não escolhe outro. Padrão: `sistema`. */
  temaInicial?: Tema;
  densidadeInicial?: Densidade;
  /**
   * Idioma enquanto a pessoa não escolhe outro (ex.: o `users.locale` do
   * servidor). Padrão: `pt-BR`. O navegador não é consultado.
   */
  idiomaInicial?: Idioma;
  /**
   * Chamado ao montar e a cada troca de idioma: o lugar de sincronizar o i18n
   * do sistema (ex.: `i18n.changeLanguage`) e de gravar a escolha no servidor.
   */
  aoMudarIdioma?: (idioma: Idioma) => void;
  /**
   * Textos por idioma, por cima dos da biblioteca: troca um texto
   * (`{ 'pt-BR': { tabela: { rotulo: 'Lista' } } }`) ou acrescenta um idioma
   * (`{ fr: { … } }`; o que faltar sai em pt-BR).
   */
  textos?: Partial<Record<Idioma, TextosParciais>>;
}

/**
 * Tema (claro/escuro/sistema) e densidade, lembrados no navegador. Aplica
 * `data-theme` (`light`/`dark`/`system`) no <html> e a classe de densidade no
 * <body>. Para não piscar ao abrir, use também o `scriptTemaInicial` no <head>.
 */
export function ProvedorPreferencias({ children, temaInicial, densidadeInicial = 'confortavel', idiomaInicial, aoMudarIdioma, textos }: ProvedorPreferenciasProps) {
  const [tema, setTema] = useState<Tema>(() => ler().tema ?? temaInicial ?? TEMA_PADRAO);
  const [densidade, setDensidade] = useState<Densidade>(() => ler().densidade ?? densidadeInicial);
  // `escolhido`: o idioma veio de uma escolha (salva ou agora). Só ele é gravado,
  // para o `idiomaInicial` do servidor continuar valendo enquanto a pessoa não troca.
  const [{ idioma, escolhido }, setIdioma] = useState<{ idioma: Idioma; escolhido: boolean }>(() => {
    const salvo = ler().idioma;
    return { idioma: salvo ?? idiomaInicial ?? 'pt-BR', escolhido: !!salvo };
  });
  const explicito = escolhido || !!idiomaInicial;
  const definirIdioma = useCallback((i: Idioma) => setIdioma({ idioma: i, escolhido: true }), []);
  const avisar = useRef(aoMudarIdioma);
  avisar.current = aoMudarIdioma;
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
      localStorage.setItem(CHAVE, JSON.stringify(escolhido ? { tema, densidade, idioma } : { tema, densidade }));
    } catch {
      /* navegação privada: segue sem lembrar */
    }
  }, [tema, densidade, idioma, escolhido]);

  // sem idioma salvo nem `idiomaInicial`, o `lang` do HTML do sistema fica como está
  useEffect(() => {
    if (explicito) document.documentElement.lang = idioma;
  }, [idioma, explicito]);

  useEffect(() => {
    avisar.current?.(idioma);
  }, [idioma]);

  registrarTextos(textos);
  const valorIdioma = useMemo(() => ({ idioma, textos: textosDe(idioma) }), [idioma, textos]);

  // alterna o que está na tela: no `sistema`, sai dele para o oposto do atual
  const alternarTema = useCallback(() => setTema(escuro ? 'claro' : 'escuro'), [escuro]);

  const valor = useMemo<Preferencias>(
    () => ({
      tema,
      escuro,
      densidade,
      idioma,
      definirTema: setTema,
      alternarTema,
      definirDensidade: setDensidade,
      definirIdioma,
    }),
    [tema, escuro, densidade, idioma, alternarTema, definirIdioma],
  );

  return (
    <Ctx.Provider value={valor}>
      <ContextoIdioma.Provider value={valorIdioma}>{children}</ContextoIdioma.Provider>
    </Ctx.Provider>
  );
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
