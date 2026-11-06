import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useLinkSite } from './linkSite';
import './CardConteudo.css';

export interface CardConteudoProps {
  titulo: string;
  /**
   * `vertical` = mídia 16:9 no topo (grade de posts) · `destaque` = mídia no topo e título grande ·
   * `horizontal` = mídia à esquerda (post em destaque) · `compacto` = miniatura quadrada à esquerda ·
   * `linha` = item de listagem, com um quadro à direita (`lateral`).
   */
  formato?: 'vertical' | 'destaque' | 'horizontal' | 'compacto' | 'linha';
  resumo?: ReactNode;
  /** Linha acima do título: `Badge`s, categoria, data. */
  etiquetas?: ReactNode;
  /** Imagem (ou qualquer nó) do cartão. */
  midia?: ReactNode;
  /** Linha miúda no fim (ex.: "Autor · 05/11/2026 · 6 min de leitura"). */
  rodape?: ReactNode;
  /** `linha`: quadro à direita (ex.: preço, quantidade). */
  lateral?: ReactNode;
  /** O cartão inteiro vira um link (o do título, esticado: o leitor de tela lê só o título). */
  href?: string;
  /** Sem `href`: o cartão inteiro vira um botão. */
  aoClicar?: () => void;
  /** Nível do título. Padrão: `3`. */
  nivel?: 2 | 3 | 4;
  className?: string;
}

/** Cartão de post, notícia, produto ou pessoa do site, em cinco formatos. */
export function CardConteudo({ titulo, formato = 'vertical', resumo, etiquetas, midia, rodape, lateral, href, aoClicar, nivel = 3, className }: CardConteudoProps) {
  const link = useLinkSite();
  const Titulo = `h${nivel}` as 'h2' | 'h3' | 'h4';
  const acionavel = !!href || !!aoClicar;
  const textoTitulo = href ? (
    link(href, titulo, 'lp-cc-link', { aoClicar })
  ) : aoClicar ? (
    <button type="button" className="lp-cc-link" onClick={aoClicar}>
      {titulo}
    </button>
  ) : (
    titulo
  );
  return (
    <article className={cx('lp-cc', `lp-cc--${formato}`, acionavel && 'lp-cc--acionavel', className)}>
      {midia && <div className="lp-cc-midia">{midia}</div>}
      <div className="lp-cc-corpo">
        {etiquetas && <div className="lp-cc-etiquetas">{etiquetas}</div>}
        <Titulo className="lp-cc-titulo">{textoTitulo}</Titulo>
        {resumo && <p className="lp-cc-resumo">{resumo}</p>}
        {rodape && <div className="lp-cc-rodape">{rodape}</div>}
      </div>
      {lateral && formato === 'linha' && <div className="lp-cc-lateral">{lateral}</div>}
    </article>
  );
}
