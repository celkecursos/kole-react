import { Icone, type IconeProp } from '../../utils/Icone';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import type { Severidade } from '../../utils/tipos';
import './Toast.css';

type SevToast = Exclude<Severidade, 'neutral'>;

export type CorToast = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';
/** `suave` (padrão) = fundo claro da cor · `padrao` = fundo neutro, ícone na cor · `solido` · `translucido` = vidro fosco. */
export type AparenciaToast = 'suave' | 'padrao' | 'solido' | 'translucido';
export type PosicaoToast =
  | 'topo-esquerda'
  | 'topo-centro'
  | 'topo-direita'
  | 'meio-esquerda'
  | 'meio-centro'
  | 'meio-direita'
  | 'base-esquerda'
  | 'base-centro'
  | 'base-direita';

const ICONE: Record<SevToast, string> = {
  ok: 'circle-check',
  info: 'info',
  warn: 'triangle-alert',
  err: 'circle-x',
};

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Dá o ícone e a cor padrão. */
  severidade?: SevToast;
  /** Cor no lugar da que vem da severidade. */
  cor?: CorToast;
  aparencia?: AparenciaToast;
  titulo?: ReactNode;
  detalhe?: ReactNode;
  /** Ícone no lugar do da severidade; `false` tira. */
  icone?: IconeProp | false;
  /** `cabecalho` = linha de cima com ícone, título, tempo e ×; o detalhe vai embaixo. */
  modelo?: 'compacto' | 'cabecalho';
  /** Quando aconteceu (ex.: "há 11 min"), no modelo com cabeçalho. */
  tempo?: string;
  /** Botões ou links abaixo do texto. */
  acoes?: ReactNode;
  /** Mostra o × e é chamado ao fechar. */
  aoFechar?: () => void;
}

/**
 * O cartão de aviso. Aparece sozinho via `useToast()`; use direto para um
 * aviso fixo na página.
 */
export function Toast({
  severidade,
  cor,
  aparencia = 'suave',
  titulo,
  detalhe,
  icone,
  modelo = 'compacto',
  tempo,
  acoes,
  aoFechar,
  children,
  className,
  ...resto
}: ToastProps) {
  const tom = cor ?? severidade ?? 'pri';
  const ic = icone === false ? null : (icone ?? (severidade ? ICONE[severidade] : null));
  const fechar = aoFechar && (
    <button type="button" className="lp-toast-fechar" aria-label="Fechar aviso" onClick={aoFechar}>
      <Icone icone="x" />
    </button>
  );
  const corpo = (
    <>
      {detalhe && <span className="lp-toast-detalhe">{detalhe}</span>}
      {children}
      {acoes && <div className="lp-toast-acoes">{acoes}</div>}
    </>
  );

  return (
    <div className={cx('lp-toast', `lp-toast--${tom}`, `lp-toast--${aparencia}`, modelo === 'cabecalho' && 'lp-toast--cabecalho', className)} {...resto}>
      {modelo === 'cabecalho' ? (
        <>
          <div className="lp-toast-cab">
            {ic && <Icone icone={ic} className="lp-toast-ic" />}
            <strong className="lp-toast-titulo">{titulo}</strong>
            {tempo && <small className="lp-toast-tempo">{tempo}</small>}
            {fechar}
          </div>
          <div className="lp-toast-corpo">{corpo}</div>
        </>
      ) : (
        <>
          {ic && <Icone icone={ic} className="lp-toast-ic" />}
          <div className="lp-toast-corpo">
            {titulo && <strong className="lp-toast-titulo">{titulo}</strong>}
            {corpo}
          </div>
          {fechar}
        </>
      )}
    </div>
  );
}

export interface OpcoesToast {
  severidade?: SevToast;
  titulo: string;
  detalhe?: string;
  /** ms até sumir sozinho. 0 = só fecha no ×. */
  duracao?: number;
  /** Canto/lado da tela. Padrão: `topo-direita`. */
  posicao?: PosicaoToast;
  cor?: CorToast;
  aparencia?: AparenciaToast;
  /** Ícone no lugar do da severidade; `false` tira. */
  icone?: IconeProp | false;
}

interface ItemToast extends OpcoesToast {
  id: number;
  severidade: SevToast;
  posicao: PosicaoToast;
  saindo: boolean;
}

export interface ApiToast {
  mostrar: (o: OpcoesToast) => number;
  ok: (titulo: string, detalhe?: string) => number;
  info: (titulo: string, detalhe?: string) => number;
  warn: (titulo: string, detalhe?: string) => number;
  err: (titulo: string, detalhe?: string) => number;
  fechar: (id: number) => void;
}

const Ctx = createContext<ApiToast | null>(null);

const MAX_VISIVEIS = 4;
let seq = 0;

/** Fornece `useToast()` e renderiza a pilha. Já incluso no `ProvedorUi`. */
export function ProvedorToast({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemToast[]>([]);
  const timers = useRef(new Map<number, { t?: number; resta: number; inicio: number }>());

  const remover = useCallback((id: number) => {
    setItens((l) => l.map((t) => (t.id === id ? { ...t, saindo: true } : t)));
    window.setTimeout(() => setItens((l) => l.filter((t) => t.id !== id)), 180);
    const tm = timers.current.get(id);
    if (tm?.t) window.clearTimeout(tm.t);
    timers.current.delete(id);
  }, []);

  const agendar = useCallback(
    (id: number, ms: number) => {
      if (ms <= 0) return;
      const t = window.setTimeout(() => remover(id), ms);
      timers.current.set(id, { t, resta: ms, inicio: Date.now() });
    },
    [remover],
  );

  const pausar = (id: number) => {
    const tm = timers.current.get(id);
    if (!tm?.t) return;
    window.clearTimeout(tm.t);
    timers.current.set(id, { resta: tm.resta - (Date.now() - tm.inicio), inicio: Date.now() });
  };
  const retomar = (id: number) => {
    const tm = timers.current.get(id);
    if (tm && !tm.t) agendar(id, Math.max(tm.resta, 1500));
  };

  const mostrar = useCallback(
    (o: OpcoesToast) => {
      const id = ++seq;
      const severidade = o.severidade ?? 'info';
      const duracao = o.duracao ?? (severidade === 'err' ? 8000 : 5000);
      setItens((l) => [...l, { ...o, id, severidade, duracao, posicao: o.posicao ?? 'topo-direita', saindo: false }]);
      agendar(id, duracao);
      return id;
    },
    [agendar],
  );

  const api = useMemo<ApiToast>(
    () => ({
      mostrar,
      ok: (titulo, detalhe) => mostrar({ severidade: 'ok', titulo, detalhe }),
      info: (titulo, detalhe) => mostrar({ severidade: 'info', titulo, detalhe }),
      warn: (titulo, detalhe) => mostrar({ severidade: 'warn', titulo, detalhe }),
      err: (titulo, detalhe) => mostrar({ severidade: 'err', titulo, detalhe }),
      fechar: remover,
    }),
    [mostrar, remover],
  );

  useEffect(() => {
    const mapa = timers.current;
    return () => mapa.forEach((tm) => tm.t && window.clearTimeout(tm.t));
  }, []);

  const ultimo = itens[itens.length - 1];
  // uma pilha por posição, na ordem em que aparecem
  const posicoes = [...new Set(itens.map((t) => t.posicao))];

  return (
    <Ctx.Provider value={api}>
      {children}
      {portal(
        <>
          <div className="lp-sr" aria-live="polite">
            {ultimo && ultimo.severidade !== 'err' ? `${ultimo.titulo}. ${ultimo.detalhe ?? ''}` : ''}
          </div>
          {posicoes.map((pos) => {
            const daqui = itens.filter((t) => t.posicao === pos);
            const visiveis = daqui.slice(-MAX_VISIVEIS);
            const ocultos = daqui.length - visiveis.length;
            return (
              <div key={pos} className={cx('lp-toasts', `lp-toasts--${pos}`)}>
                {visiveis.map((t) => (
                  <Toast
                    key={t.id}
                    severidade={t.severidade}
                    cor={t.cor}
                    aparencia={t.aparencia}
                    icone={t.icone}
                    titulo={t.titulo}
                    detalhe={t.detalhe}
                    className={t.saindo ? 'is-saindo' : undefined}
                    role={t.severidade === 'err' ? 'alert' : undefined}
                    onMouseEnter={() => pausar(t.id)}
                    onMouseLeave={() => retomar(t.id)}
                    onFocus={() => pausar(t.id)}
                    onBlur={() => retomar(t.id)}
                    aoFechar={() => remover(t.id)}
                  />
                ))}
                {ocultos > 0 && (
                  <div className="lp-toast-mais">
                    e mais {ocultos} {ocultos === 1 ? 'aviso' : 'avisos'}
                  </div>
                )}
              </div>
            );
          })}
        </>,
      )}
    </Ctx.Provider>
  );
}

/** `const toast = useToast(); toast.ok('Salvo com sucesso');` */
export function useToast(): ApiToast {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast precisa de <ProvedorToast> (ou <ProvedorUi>) acima na árvore.');
  return ctx;
}
