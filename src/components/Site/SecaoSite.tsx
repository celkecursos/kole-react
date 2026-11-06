import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './SecaoSite.css';

export interface SecaoSiteProps {
  children: ReactNode;
  /** `padrao` = fundo da página · `superficie` = faixa branca com linha embaixo · `escuro` = faixa marinha. */
  fundo?: 'padrao' | 'superficie' | 'escuro';
  /** `estreita` = 55rem, para FAQ, texto e formulários centralizados. Padrão: `padrao` (largura do site). */
  largura?: 'padrao' | 'estreita';
  /** Espaço acima e abaixo. Padrão: `medio`. */
  espaco?: 'compacto' | 'medio' | 'amplo';
  /** Nome da região para leitor de tela (vira um `<section>` com `aria-label`). */
  rotulo?: string;
  className?: string;
}

/** Faixa do site com o conteúdo centralizado na largura `--site-largura`. */
export function SecaoSite({ children, fundo = 'padrao', largura = 'padrao', espaco = 'medio', rotulo, className }: SecaoSiteProps) {
  return (
    <section className={cx('lp-site-secao', `lp-site-secao--${fundo}`, `lp-site-secao--${espaco}`, largura === 'estreita' && 'lp-site-secao--estreita', className)} aria-label={rotulo}>
      <div className="lp-site-secao-in">{children}</div>
    </section>
  );
}
