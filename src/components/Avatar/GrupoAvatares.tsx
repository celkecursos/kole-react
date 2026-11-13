import type { CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import { listaPorExtenso } from '../../utils/texto';
import { Avatar } from './Avatar';
import './Avatar.css';

export interface PessoaAvatar {
  nome: string;
  foto?: string;
}

export interface GrupoAvataresProps {
  pessoas: PessoaAvatar[];
  /** Quantos aparecem; o resto vira "+N" (padrão: 3). */
  max?: number;
  /** Tamanho CSS de cada avatar (padrão: `1.75rem`). */
  tamanho?: string;
  /** Começo do nome acessível (padrão: "Responsáveis"), seguido dos nomes. */
  rotulo?: string;
  className?: string;
}

/** Avatares sobrepostos com "+N" no fim (responsáveis, membros, participantes). */
export function GrupoAvatares({ pessoas, max = 3, tamanho = '1.75rem', rotulo = 'Responsáveis', className }: GrupoAvataresProps) {
  if (!pessoas.length) return null;
  const visiveis = pessoas.slice(0, max);
  const resto = pessoas.slice(max);
  const nomes = listaPorExtenso(pessoas.map((p) => p.nome));
  return (
    <span
      className={cx('lp-av-grupo', className)}
      style={{ '--av-size': tamanho } as CSSProperties}
      role="img"
      aria-label={`${rotulo}: ${nomes}`}
      title={nomes}
    >
      {visiveis.map((p, i) => (
        <Avatar key={`${p.nome}-${i}`} nome={p.nome} foto={p.foto} tamanho={tamanho} />
      ))}
      {resto.length > 0 && (
        <span className="lp-av lp-av--circulo lp-av--claro lp-av-grupo-mais" aria-hidden="true">
          <span className="lp-av-ini">+{resto.length}</span>
        </span>
      )}
    </span>
  );
}
