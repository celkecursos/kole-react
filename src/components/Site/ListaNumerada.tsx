import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useLinkSite } from './linkSite';
import './ListaNumerada.css';

export interface ItemListaNumerada {
  /** Chave do item (padrão: o título). */
  id?: string;
  titulo: string;
  /** Linha miúda abaixo (ex.: data, quantidade). */
  detalhe?: ReactNode;
  /** Texto abaixo do título, em tamanho de leitura (ex.: passos de "Como funciona"). */
  descricao?: ReactNode;
  href?: string;
}

export interface ListaNumeradaProps {
  itens: ItemListaNumerada[];
  /** `padrao` = números grandes (ranking da semana) · `compacto` = para colunas laterais. */
  tamanho?: 'padrao' | 'compacto';
  /** Nome da lista para leitor de tela. */
  rotulo?: string;
  className?: string;
}

/** Lista numerada (01, 02…) com os números em laranja: mais lidos, ranking, passos de um processo. */
export function ListaNumerada({ itens, tamanho = 'padrao', rotulo, className }: ListaNumeradaProps) {
  const link = useLinkSite();
  return (
    <ol className={cx('lp-lnum', `lp-lnum--${tamanho}`, className)} aria-label={rotulo}>
      {itens.map((item, i) => (
        <li key={item.id ?? item.titulo} className="lp-lnum-item">
          <span className="lp-lnum-n" aria-hidden="true">
            {tamanho === 'compacto' ? i + 1 : String(i + 1).padStart(2, '0')}
          </span>
          <span className="lp-lnum-tx">
            {item.href ? link(item.href, item.titulo, 'lp-lnum-titulo lp-lnum-titulo--link') : <span className="lp-lnum-titulo">{item.titulo}</span>}
            {item.descricao && <span className="lp-lnum-desc">{item.descricao}</span>}
            {item.detalhe && <span className="lp-lnum-detalhe">{item.detalhe}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
