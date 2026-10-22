import type { MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import './Lista.css';

export type CorItemLista = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';

export interface ListaProps {
  children: ReactNode;
  /** `padrao` = caixa com borda · `sem-borda` = encostada no container (dentro de card). */
  variante?: 'padrao' | 'sem-borda';
  /** Numera os itens (1, 2, 3…). */
  numerada?: boolean;
  /** Itens lado a lado; com breakpoint, só a partir dele (`sm` 36rem · `md` 48rem · `lg` 64rem · `xl` 75rem). */
  horizontal?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  /** Nome da lista para leitor de tela. */
  rotulo?: string;
  className?: string;
}

/** Grupo de itens empilhados (list group): lista simples, de links, de seleção… */
export function Lista({ children, variante = 'padrao', numerada = false, horizontal = false, rotulo, className }: ListaProps) {
  const Tag = numerada ? 'ol' : 'ul';
  return (
    <Tag
      aria-label={rotulo}
      className={cx(
        'lp-lista',
        variante === 'sem-borda' && 'lp-lista--sem-borda',
        numerada && 'lp-lista--numerada',
        horizontal === true && 'lp-lista--horizontal',
        typeof horizontal === 'string' && `lp-lista--horizontal-${horizontal}`,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export interface ItemListaProps {
  /** Conteúdo principal (ou a descrição, quando há `titulo`). */
  children?: ReactNode;
  /** Linha em negrito acima do conteúdo. */
  titulo?: ReactNode;
  /** Ícone à esquerda (atalho para `inicio`). */
  icone?: IconeProp;
  /** Conteúdo à esquerda: avatar, ícone em caixa… */
  inicio?: ReactNode;
  /** Conteúdo à direita: badge, contagem, data… */
  fim?: ReactNode;
  ativo?: boolean;
  desabilitado?: boolean;
  /** Tom do item: fundo claro da cor, ou sólido com `solido`. */
  cor?: CorItemLista;
  solido?: boolean;
  /** Vira link. */
  href?: string;
  /** Vira botão. */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Vira item de seleção: caixa de marcação ou rádio. */
  marcacao?: 'caixa' | 'radio';
  marcado?: boolean;
  aoMarcar?: (marcado: boolean) => void;
  /** Nome do grupo de rádios. */
  nome?: string;
  className?: string;
}

/** Item de `Lista`. Estático, link (`href`), botão (`onClick`) ou seleção (`marcacao`). */
export function ItemLista({
  children,
  titulo,
  icone,
  inicio,
  fim,
  ativo = false,
  desabilitado = false,
  cor,
  solido = false,
  href,
  onClick,
  marcacao,
  marcado,
  aoMarcar,
  nome,
  className,
}: ItemListaProps) {
  const esquerda = inicio ?? (icone ? <Icone icone={icone} className="lp-lista-icone" /> : null);
  const conteudo = (
    <>
      {marcacao && (
        <input
          type={marcacao === 'radio' ? 'radio' : 'checkbox'}
          className="lp-lista-marca"
          name={nome}
          checked={marcado ?? false}
          disabled={desabilitado}
          onChange={(e) => aoMarcar?.(e.target.checked)}
        />
      )}
      {esquerda && <span className="lp-lista-inicio">{esquerda}</span>}
      <span className="lp-lista-meio">
        {titulo && <span className="lp-lista-titulo">{titulo}</span>}
        {children && <span className={titulo ? 'lp-lista-desc' : 'lp-lista-texto'}>{children}</span>}
      </span>
      {fim && <span className="lp-lista-fim">{fim}</span>}
    </>
  );

  let corpo: ReactNode;
  if (marcacao) corpo = <label className="lp-lista-corpo lp-lista-corpo--acao">{conteudo}</label>;
  else if (href && !desabilitado)
    corpo = (
      <a className="lp-lista-corpo lp-lista-corpo--acao" href={href} aria-current={ativo ? 'page' : undefined} onClick={onClick}>
        {conteudo}
      </a>
    );
  else if (onClick || href)
    corpo = (
      <button type="button" className="lp-lista-corpo lp-lista-corpo--acao" disabled={desabilitado} aria-pressed={onClick ? ativo : undefined} onClick={onClick}>
        {conteudo}
      </button>
    );
  else corpo = <div className="lp-lista-corpo">{conteudo}</div>;

  return (
    <li
      className={cx(
        'lp-lista-it',
        cor && `lp-lista-it--${cor}`,
        cor && solido && 'lp-lista-it--solido',
        ativo && 'is-ativo',
        desabilitado && 'is-desabilitado',
        className,
      )}
      aria-current={ativo && !href && !onClick ? 'true' : undefined}
      aria-disabled={desabilitado && !onClick && !href && !marcacao ? true : undefined}
    >
      {corpo}
    </li>
  );
}
