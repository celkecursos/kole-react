import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './CardPlano.css';
import { useTextos } from '../../i18n/contexto';

export interface CardPlanoProps {
  nome: string;
  descricao?: string;
  /** Preço já formatado, sem a moeda (ex.: "99"). */
  preco: string;
  /** Padrão: "R$". */
  moeda?: string;
  /** Depois do preço (ex.: "/mês"). */
  periodo?: string;
  /** O que o plano inclui. */
  itens: string[];
  /** Plano recomendado: cartão marinho e selo no alto. */
  destaque?: boolean;
  /** Texto do selo do `destaque`. Padrão: "Mais escolhido". */
  rotuloDestaque?: string;
  /** Botão no pé do cartão (ex.: `<Botao bloco …>`). */
  acao?: ReactNode;
  className?: string;
}

/** Cartão de plano ou preço: nome, valor, lista do que inclui e o botão de contratar. */
export function CardPlano({ nome, descricao, preco, moeda = 'R$', periodo, itens, destaque, rotuloDestaque: rotuloDestaqueProp, acao, className }: CardPlanoProps) {
  const t = useTextos();
  const rotuloDestaque = rotuloDestaqueProp ?? t.site.maisEscolhido;
  return (
    <article className={cx('lp-plano', destaque && 'lp-plano--destaque', className)}>
      {destaque && <span className="lp-plano-selo">{rotuloDestaque}</span>}
      <div>
        <h3 className="lp-plano-nome">{nome}</h3>
        {descricao && <p className="lp-plano-desc">{descricao}</p>}
      </div>
      <div className="lp-plano-preco">
        <span className="lp-plano-moeda">{moeda}</span>
        <span className="lp-plano-valor">{preco}</span>
        {periodo && <span className="lp-plano-periodo">{periodo}</span>}
      </div>
      <ul className="lp-plano-itens">
        {itens.map((i) => (
          <li key={i}>
            <Icone icone="check" className="lp-plano-check" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
      {acao && <div className="lp-plano-acao">{acao}</div>}
    </article>
  );
}
