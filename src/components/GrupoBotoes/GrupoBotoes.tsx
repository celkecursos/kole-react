import type { JSX, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { IconeProp } from '../../utils/Icone';
import { Botao, PadroesBotaoCtx, type BotaoProps, type PadroesBotao } from '../Botao/Botao';
import './GrupoBotoes.css';

export interface GrupoBotoesProps extends PadroesBotao {
  children: ReactNode;
  orientacao?: 'horizontal' | 'vertical';
  /** Nome do grupo para leitor de tela (ex.: "Controles do player"). */
  rotulo?: string;
  className?: string;
}

/**
 * Botões colados num bloco só. `severidade`, `aparencia`, `formato` e
 * `tamanho` viram o padrão dos botões de dentro (cada um pode sobrescrever).
 */
export function GrupoBotoes({ children, orientacao = 'horizontal', rotulo, className, ...padroes }: GrupoBotoesProps) {
  return (
    <PadroesBotaoCtx.Provider value={padroes}>
      <div role="group" aria-label={rotulo} className={cx('lp-grupo-btn', orientacao === 'vertical' && 'lp-grupo-btn--vertical', className)}>
        {children}
      </div>
    </PadroesBotaoCtx.Provider>
  );
}

export interface OpcaoAlternancia<V> {
  valor: V;
  rotulo?: string;
  icone?: IconeProp;
  /** Obrigatória quando a opção é só ícone. */
  dica?: string;
  desabilitada?: boolean;
}

interface BaseAlternancia<V> extends Omit<GrupoBotoesProps, 'children'> {
  opcoes: OpcaoAlternancia<V>[];
  /** Aparência das opções desmarcadas (as marcadas ficam sólidas). Padrão: `contorno`. */
  aparencia?: BotaoProps['aparencia'];
}

export interface GrupoAlternanciaUnicoProps<V> extends BaseAlternancia<V> {
  multiplo?: false;
  valor?: V | null;
  aoMudar?: (valor: V) => void;
}

export interface GrupoAlternanciaMultiploProps<V> extends BaseAlternancia<V> {
  multiplo: true;
  valor?: V[];
  aoMudar?: (valor: V[]) => void;
}

export type GrupoAlternanciaProps<V> = GrupoAlternanciaUnicoProps<V> | GrupoAlternanciaMultiploProps<V>;

/**
 * Grupo de botões de seleção: única (como rádio) ou múltipla (como caixas de
 * marcação). Cada opção é um botão de alternância (`aria-pressed`).
 */
export function GrupoAlternancia<V = string>(props: GrupoAlternanciaMultiploProps<V>): JSX.Element;
export function GrupoAlternancia<V = string>(props: GrupoAlternanciaUnicoProps<V>): JSX.Element;
export function GrupoAlternancia<V = string>(props: GrupoAlternanciaProps<V>): JSX.Element {
  const { opcoes, aparencia = 'contorno', ...grupo } = props;
  const marcados: V[] = props.multiplo ? (props.valor ?? []) : props.valor == null ? [] : [props.valor];
  const marcado = (v: V) => marcados.some((m) => Object.is(m, v));

  const alternar = (v: V) => {
    if (props.multiplo) props.aoMudar?.(marcado(v) ? marcados.filter((m) => !Object.is(m, v)) : [...marcados, v]);
    else props.aoMudar?.(v);
  };

  const { multiplo: _m, valor: _v, aoMudar: _a, ...resto } = grupo as GrupoAlternanciaProps<V>;
  return (
    <GrupoBotoes {...resto}>
      {opcoes.map((o, i) => (
        <Botao
          key={i}
          rotulo={o.rotulo}
          icone={o.icone}
          dica={o.dica}
          aria-label={o.rotulo ? undefined : o.dica}
          disabled={o.desabilitada}
          aparencia={marcado(o.valor) ? 'solido' : aparencia}
          pressionado={marcado(o.valor)}
          onClick={() => alternar(o.valor)}
        />
      ))}
    </GrupoBotoes>
  );
}

export interface BarraBotoesProps {
  children: ReactNode;
  /** Nome da barra para leitor de tela. */
  rotulo?: string;
  /** `inicio` (padrão) · `entre` = espalha os grupos de ponta a ponta. */
  distribuicao?: 'inicio' | 'entre';
  className?: string;
}

/** Barra de ferramentas: vários grupos (e campos) lado a lado. */
export function BarraBotoes({ children, rotulo, distribuicao = 'inicio', className }: BarraBotoesProps) {
  return (
    <div role="toolbar" aria-label={rotulo} className={cx('lp-barra-btn', distribuicao === 'entre' && 'lp-barra-btn--entre', className)}>
      {children}
    </div>
  );
}
