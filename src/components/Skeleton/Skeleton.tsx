import type { CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import './Skeleton.css';

export interface SkeletonProps {
  largura?: string;
  altura?: string;
  formato?: 'retangulo' | 'circulo';
  className?: string;
}

/** Silhueta de carregamento. */
export function Skeleton({ largura = '100%', altura = '1rem', formato = 'retangulo', className }: SkeletonProps) {
  const estilo: CSSProperties = { width: largura, height: altura };
  return <div className={cx('lp-skel', formato === 'circulo' && 'lp-skel--circulo', className)} style={estilo} aria-hidden="true" />;
}
