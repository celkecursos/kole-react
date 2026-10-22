import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ProvedorConfirmacao } from '../Confirmacao/Confirmacao';
import { ProvedorToast } from '../Toast/Toast';

export type Tema = 'claro' | 'escuro';
export type Densidade = 'compacta' | 'confortavel' | 'espacosa';

const CLASSE_DENSIDADE: Record<Densidade, string> = {
  compacta: 'density-compact',
  confortavel: 'density-comfortable',
  espacosa: 'density-cozy',
};

export interface Preferencias {
  tema: Tema;
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

function temaDoSistema(): Tema {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  } catch {
    return 'claro';
  }
}

export interface ProvedorPreferenciasProps {
  children: ReactNode;
  temaInicial?: Tema;
  densidadeInicial?: Densidade;
}

/**
 * Tema (claro/escuro) e densidade, lembrados no navegador. Aplica
 * `data-theme` no <html> e a classe de densidade no <body>.
 */
export function ProvedorPreferencias({ children, temaInicial, densidadeInicial = 'confortavel' }: ProvedorPreferenciasProps) {
  const [tema, setTema] = useState<Tema>(() => ler().tema ?? temaInicial ?? temaDoSistema());
  const [densidade, setDensidade] = useState<Densidade>(() => ler().densidade ?? densidadeInicial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema === 'escuro' ? 'dark' : 'light');
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

  const alternarTema = useCallback(() => setTema((t) => (t === 'escuro' ? 'claro' : 'escuro')), []);

  const valor = useMemo<Preferencias>(
    () => ({
      tema,
      escuro: tema === 'escuro',
      densidade,
      definirTema: setTema,
      alternarTema,
      definirDensidade: setDensidade,
    }),
    [tema, densidade, alternarTema],
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
