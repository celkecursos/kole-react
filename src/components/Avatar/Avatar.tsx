import { useState, type CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import './Avatar.css';

export interface AvatarProps {
  foto?: string;
  /** Nome completo — gera as iniciais quando não há foto. */
  nome?: string;
  iniciais?: string;
  tom?: 'claro' | 'escuro';
  formato?: 'circulo' | 'quadrado';
  /** Tamanho CSS (ex.: `2rem`). */
  tamanho?: string;
  className?: string;
}

function iniciaisDe(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export function Avatar({ foto, nome, iniciais, tom = 'claro', formato = 'circulo', tamanho, className }: AvatarProps) {
  const [falhou, setFalhou] = useState(false);
  const estilo = tamanho ? ({ '--av-size': tamanho } as CSSProperties) : undefined;
  return (
    <span className={cx('lp-av', `lp-av--${formato}`, `lp-av--${tom}`, className)} style={estilo} title={nome}>
      {foto && !falhou ? (
        <img src={foto} alt="" loading="lazy" onError={() => setFalhou(true)} />
      ) : (
        <span className="lp-av-ini" aria-hidden="true">
          {iniciais ?? iniciaisDe(nome)}
        </span>
      )}
    </span>
  );
}
