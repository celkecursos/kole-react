import { cx } from '../../utils/cx';
import { Avatar } from '../Avatar/Avatar';
import './CardDepoimento.css';

export interface CardDepoimentoProps {
  /** O depoimento, sem aspas (o cartão põe). */
  texto: string;
  nome: string;
  /** Linha abaixo do nome (ex.: "Cargo · Empresa"). */
  cargo?: string;
  /** URL da foto. Sem ela, as iniciais do `nome`. */
  foto?: string;
  /** De 0 a 5 estrelas. Padrão: `5`; `0` esconde. */
  nota?: number;
  className?: string;
}

/** Depoimento de cliente: estrelas, citação e quem disse. */
export function CardDepoimento({ texto, nome, cargo, foto, nota = 5, className }: CardDepoimentoProps) {
  const estrelas = Math.max(0, Math.min(5, Math.round(nota)));
  return (
    <figure className={cx('lp-depo', className)}>
      {estrelas > 0 && (
        <div className="lp-depo-nota" role="img" aria-label={`Nota ${estrelas} de 5`}>
          {'★'.repeat(estrelas)}
          <span className="lp-depo-nota-vazia">{'★'.repeat(5 - estrelas)}</span>
        </div>
      )}
      <blockquote className="lp-depo-texto">“{texto}”</blockquote>
      <figcaption className="lp-depo-autor">
        <Avatar nome={nome} foto={foto} tamanho="2.5rem" />
        <span>
          <span className="lp-depo-nome">{nome}</span>
          {cargo && <span className="lp-depo-cargo">{cargo}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
