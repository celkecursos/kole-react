import type { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Imagem.css';

/** `reto` · `arredondado` = cantos do card · `circulo` = pílula/círculo. */
export type CantosImagem = 'reto' | 'arredondado' | 'circulo';
/** `esquerda`/`direita` = flutua com o texto em volta · `centro` = bloco centralizado. */
export type AlinhamentoImagem = 'esquerda' | 'centro' | 'direita';

export interface ImagemProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'width'> {
  src: string;
  /** Texto alternativo. Use `''` só para imagem decorativa. */
  alt: string;
  /** Encolhe para caber no container (largura máx. 100%). Padrão: true. */
  responsiva?: boolean;
  cantos?: CantosImagem;
  /** Moldura de miniatura: borda fina e respiro em volta. */
  miniatura?: boolean;
  alinhamento?: AlinhamentoImagem;
  /** Recorta na proporção dada (ex.: `'1 / 1'`, `'16 / 9'`) sem distorcer. */
  proporcao?: string;
  /** Largura (ex.: `'12rem'`, `'50%'`). */
  largura?: string;
}

/** Imagem responsiva com cantos, miniatura, recorte e alinhamento. */
export function Imagem({
  responsiva = true,
  cantos = 'reto',
  miniatura = false,
  alinhamento,
  proporcao,
  largura,
  loading = 'lazy',
  className,
  style,
  ...resto
}: ImagemProps) {
  return (
    <img
      loading={loading}
      className={cx(
        'lp-img',
        responsiva && 'lp-img--responsiva',
        cantos !== 'reto' && `lp-img--${cantos}`,
        miniatura && 'lp-img--miniatura',
        alinhamento && `lp-img--${alinhamento}`,
        proporcao && 'lp-img--recorte',
        className,
      )}
      style={{ aspectRatio: proporcao, width: largura, ...style }}
      {...resto}
    />
  );
}

export interface FiguraProps {
  src: string;
  alt: string;
  /** Legenda abaixo da imagem. */
  legenda?: ReactNode;
  alinhamentoLegenda?: 'inicio' | 'centro' | 'fim';
  cantos?: CantosImagem;
  miniatura?: boolean;
  proporcao?: string;
  /** Posição da figura inteira (imagem + legenda). */
  alinhamento?: AlinhamentoImagem;
  /** Largura da figura (ex.: `'14rem'`). */
  largura?: string;
  className?: string;
  style?: CSSProperties;
}

/** Imagem com legenda (`<figure>` + `<figcaption>`). */
export function Figura({
  src,
  alt,
  legenda,
  alinhamentoLegenda = 'inicio',
  cantos = 'arredondado',
  miniatura,
  proporcao,
  alinhamento,
  largura,
  className,
  style,
}: FiguraProps) {
  return (
    <figure className={cx('lp-figura', alinhamento && `lp-figura--${alinhamento}`, className)} style={{ width: largura, ...style }}>
      <Imagem src={src} alt={alt} cantos={cantos} miniatura={miniatura} proporcao={proporcao} largura="100%" />
      {legenda && <figcaption className={cx('lp-figura-legenda', alinhamentoLegenda !== 'inicio' && `lp-figura-legenda--${alinhamentoLegenda}`)}>{legenda}</figcaption>}
    </figure>
  );
}
