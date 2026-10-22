import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import type { Severidade } from '../../utils/tipos';
import './Badge.css';

/** Mesmas cores do `Alerta`: severidades + `pri` (azul) e `destaque` (laranja). */
export type CorBadge = Severidade | 'pri' | 'destaque';

export interface BadgeProps {
  cor?: CorBadge;
  /**
   * `solido` (padrão) · `suave` = fundo claro · `contorno` = só a borda ·
   * `gradiente` · `inverso` = fundo da superfície com texto colorido (para
   * usar dentro de um botão sólido da mesma cor).
   */
  aparencia?: 'solido' | 'suave' | 'contorno' | 'gradiente' | 'inverso';
  /** `pilula` = cantos totalmente arredondados. */
  formato?: 'padrao' | 'pilula';
  /** `herdar` = acompanha o tamanho do texto em volta (títulos). */
  tamanho?: 'pequeno' | 'medio' | 'herdar';
  icone?: IconeProp;
  /** Texto do badge (ou use `children`). */
  rotulo?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Etiqueta curta: contagem, rótulo de novidade, categoria. */
export function Badge({ cor = 'pri', aparencia = 'solido', formato = 'padrao', tamanho = 'pequeno', icone, rotulo, children, className }: BadgeProps) {
  return (
    <span
      className={cx('lp-badge', `lp-badge--${aparencia}`, formato === 'pilula' && 'lp-badge--pilula', `lp-badge--${tamanho}`, className)}
      data-cor={cor}
    >
      <Icone icone={icone} />
      {rotulo}
      {children}
    </span>
  );
}

export interface ComBadgeProps {
  /** Elemento que recebe o badge (avatar, botão, ícone). */
  children: ReactNode;
  /** Contagem ou texto no canto; com `ponto`, é ignorado. */
  conteudo?: ReactNode;
  /** Acima disto vira "N+" (só para números; padrão: 99). */
  max?: number;
  /** Só um ponto (ex.: "online", "não lido"). */
  ponto?: boolean;
  cor?: CorBadge;
  /** Canto do badge (padrão: superior direito). */
  posicao?: 'superior-direita' | 'inferior-direita' | 'superior-esquerda' | 'inferior-esquerda';
  /** Texto para leitor de tela (ex.: "99 mensagens não lidas"). */
  descricao?: string;
  className?: string;
}

/** Posiciona um badge (ou ponto) no canto de outro elemento. */
export function ComBadge({ children, conteudo, max = 99, ponto = false, cor = 'err', posicao = 'superior-direita', descricao, className }: ComBadgeProps) {
  const vazio = conteudo === undefined || conteudo === null || conteudo === false || conteudo === '';
  const texto = typeof conteudo === 'number' && conteudo > max ? `${max}+` : conteudo;
  return (
    <span className={cx('lp-com-badge', className)}>
      {children}
      {(ponto || !vazio) && (
        <span className={cx('lp-com-badge-marca', `is-${posicao}`, ponto ? 'lp-com-badge-ponto' : 'lp-badge lp-badge--solido lp-badge--pilula lp-badge--pequeno')} data-cor={cor}>
          {!ponto && texto}
          {descricao && <span className="lp-sr">{descricao}</span>}
        </span>
      )}
    </span>
  );
}
