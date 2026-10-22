import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Recolhivel } from '../Recolhivel/Recolhivel';
import './Acordeao.css';

export type CorAcordeao = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';
/**
 * `padrao` = caixa com borda · `sem-borda` = encostado no container ·
 * `solido` = cabeçalho aberto na cor · `suave` = cabeçalho aberto em tom
 * claro · `contorno` = borda na cor.
 */
export type VarianteAcordeao = 'padrao' | 'sem-borda' | 'solido' | 'suave' | 'contorno';

interface Ctx {
  abertos: string[];
  alternar: (valor: string) => void;
  icone: 'seta' | 'mais' | 'nenhum';
}
const AcordeaoCtx = createContext<Ctx | null>(null);

export interface AcordeaoProps {
  children: ReactNode;
  /** Vários itens abertos ao mesmo tempo. */
  multiplo?: boolean;
  /** Itens abertos (controlado). */
  abertos?: string[];
  /** Itens abertos de início (não controlado). */
  padraoAbertos?: string[];
  aoMudar?: (abertos: string[]) => void;
  variante?: VarianteAcordeao;
  cor?: CorAcordeao;
  /** Itens soltos, com espaço entre eles. */
  separado?: boolean;
  /** `seta` (padrão) · `mais` = + / − · `nenhum`. */
  icone?: 'seta' | 'mais' | 'nenhum';
  /** Lado do ícone. */
  posicaoIcone?: 'fim' | 'inicio';
  className?: string;
}

/** Lista de seções que abrem e fecham (acordeão). */
export function Acordeao({
  children,
  multiplo = false,
  abertos: controlado,
  padraoAbertos = [],
  aoMudar,
  variante = 'padrao',
  cor,
  separado = false,
  icone = 'seta',
  posicaoIcone = 'fim',
  className,
}: AcordeaoProps) {
  const [interno, setInterno] = useState(padraoAbertos);
  const abertos = controlado ?? interno;

  const alternar = (valor: string) => {
    const aberto = abertos.includes(valor);
    const novos = aberto ? abertos.filter((v) => v !== valor) : multiplo ? [...abertos, valor] : [valor];
    setInterno(novos);
    aoMudar?.(novos);
  };

  return (
    <AcordeaoCtx.Provider value={{ abertos, alternar, icone }}>
      <div
        className={cx(
          'lp-acord',
          `lp-acord--${variante}`,
          cor && cor !== 'pri' && `lp-acord--${cor}`,
          separado && 'lp-acord--separado',
          posicaoIcone === 'inicio' && 'lp-acord--icone-inicio',
          className,
        )}
      >
        {children}
      </div>
    </AcordeaoCtx.Provider>
  );
}

export interface ItemAcordeaoProps {
  valor: string;
  titulo: ReactNode;
  /** Ícone antes do título. */
  icone?: IconeProp;
  /** Cor só deste item (sobrepõe a do acordeão). */
  cor?: CorAcordeao;
  desabilitado?: boolean;
  children: ReactNode;
}

/** Seção de um `Acordeao`. */
export function ItemAcordeao({ valor, titulo, icone, cor, desabilitado = false, children }: ItemAcordeaoProps) {
  const ctx = useContext(AcordeaoCtx);
  const id = useId();
  if (!ctx) throw new Error('ItemAcordeao precisa estar dentro de <Acordeao>.');
  const aberto = ctx.abertos.includes(valor);

  return (
    <div className={cx('lp-acord-item', cor && `lp-acord--${cor}`, aberto && 'is-aberto', desabilitado && 'is-desabilitado')}>
      <h3 className="lp-acord-cab">
        <button
          type="button"
          id={`${id}-cab`}
          className="lp-acord-botao"
          aria-expanded={aberto}
          aria-controls={`${id}-painel`}
          disabled={desabilitado}
          onClick={() => ctx.alternar(valor)}
        >
          {icone && <Icone icone={icone} className="lp-acord-ic-titulo" />}
          <span className="lp-acord-titulo">{titulo}</span>
          {ctx.icone !== 'nenhum' && (
            <span className={cx('lp-acord-indicador', ctx.icone === 'seta' && 'lp-acord-indicador--seta')} aria-hidden="true">
              <Icone icone={ctx.icone === 'mais' ? (aberto ? 'minus' : 'plus') : 'chevron-down'} />
            </span>
          )}
        </button>
      </h3>
      <Recolhivel aberto={aberto}>
        <div id={`${id}-painel`} role="region" aria-labelledby={`${id}-cab`} className="lp-acord-corpo">
          {children}
        </div>
      </Recolhivel>
    </div>
  );
}
