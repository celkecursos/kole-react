import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './CabecalhoSecao.css';

export interface CabecalhoSecaoProps {
  titulo: string;
  /** Texto curto acima do título, em maiúsculas e laranja (ex.: "Novidades"). */
  sobretitulo?: string;
  descricao?: ReactNode;
  /** À direita (ex.: um link "Ver todos →"). */
  acao?: ReactNode;
  /** Nível do título. Padrão: `2`. */
  nivel?: 1 | 2 | 3;
  /** `titulo` de página (maior) ou de `secao` (padrão). */
  tamanho?: 'pagina' | 'secao';
  /** `centro` para seções centralizadas (FAQ, planos). */
  alinhamento?: 'inicio' | 'centro';
  className?: string;
}

/** Título de seção ou de página do site, com sobretítulo e ação. */
export function CabecalhoSecao({ titulo, sobretitulo, descricao, acao, nivel = 2, tamanho = 'secao', alinhamento = 'inicio', className }: CabecalhoSecaoProps) {
  const Titulo = `h${nivel}` as 'h1' | 'h2' | 'h3';
  return (
    <div className={cx('lp-cab-secao', `lp-cab-secao--${tamanho}`, alinhamento === 'centro' && 'lp-cab-secao--centro', className)}>
      <div className="lp-cab-secao-tx">
        {sobretitulo && <div className="lp-cab-secao-sobre">{sobretitulo}</div>}
        <Titulo className="lp-cab-secao-titulo">{titulo}</Titulo>
        {descricao && <p className="lp-cab-secao-desc">{descricao}</p>}
      </div>
      {acao && <div className="lp-cab-secao-acao">{acao}</div>}
    </div>
  );
}
