import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import './CardRecurso.css';

export interface CardRecursoProps {
  titulo: ReactNode;
  /** Texto de apoio. */
  children?: ReactNode;
  /** Ícone num quadrado azul-claro. */
  icone?: IconeProp;
  /** No lugar do ícone, um número em laranja (ex.: "01" nos valores da empresa). */
  numero?: string;
  /** Texto miúdo acima do título (ex.: "Telefone" no cartão de contato). */
  sobretitulo?: string;
  /** Abaixo do texto (ex.: um link "Saiba mais →"). */
  acao?: ReactNode;
  /** `vertical` = ícone em cima · `horizontal` = ícone à esquerda. */
  formato?: 'vertical' | 'horizontal';
  /** Nível do título. Padrão: `3`. */
  nivel?: 2 | 3 | 4;
  className?: string;
}

/** Cartão de diferencial, serviço, valor ou canal de contato: ícone (ou número), título e texto. */
export function CardRecurso({ titulo, children, icone, numero, sobretitulo, acao, formato = 'vertical', nivel = 3, className }: CardRecursoProps) {
  const Titulo = `h${nivel}` as 'h2' | 'h3' | 'h4';
  return (
    <article className={cx('lp-recurso', `lp-recurso--${formato}`, className)}>
      {icone ? (
        <span className="lp-recurso-ic" aria-hidden="true">
          <Icone icone={icone} />
        </span>
      ) : numero ? (
        <span className="lp-recurso-num" aria-hidden="true">
          {numero}
        </span>
      ) : null}
      <div className="lp-recurso-tx">
        {sobretitulo && <div className="lp-recurso-sobre">{sobretitulo}</div>}
        <Titulo className="lp-recurso-titulo">{titulo}</Titulo>
        {children && <div className="lp-recurso-desc">{children}</div>}
        {acao && <div className="lp-recurso-acao">{acao}</div>}
      </div>
    </article>
  );
}
