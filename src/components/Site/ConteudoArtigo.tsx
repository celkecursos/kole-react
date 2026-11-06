import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './ConteudoArtigo.css';

export interface ConteudoArtigoProps {
  /** HTML comum do texto: `p`, `h2`, `h3`, `ul`, `ol`, `blockquote`, `a`, `img`, `figure`. */
  children: ReactNode;
  className?: string;
}

/**
 * Área de leitura de posts e páginas de texto (termos, privacidade): largura de
 * cerca de 70 caracteres e o estilo dos elementos comuns. Markdown convertido em
 * HTML pelo app deve chegar já sanitizado.
 */
export function ConteudoArtigo({ children, className }: ConteudoArtigoProps) {
  return <div className={cx('lp-artigo', className)}>{children}</div>;
}
