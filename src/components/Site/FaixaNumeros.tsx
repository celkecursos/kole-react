import { cx } from '../../utils/cx';
import './FaixaNumeros.css';

export interface NumeroSite {
  /** O número já formatado (ex.: "1.200", "4,9/5"). */
  valor: string;
  /** Em laranja, logo depois (ex.: "+", "%", "h"). */
  sufixo?: string;
  rotulo: string;
}

export interface FaixaNumerosProps {
  itens: NumeroSite[];
  /**
   * `faixa` = bloco marinho arredondado, números grandes · `cartoes` = um cartão claro por número ·
   * `simples` = só os números, para ficar sobre a faixa de abertura.
   */
  aparencia?: 'faixa' | 'cartoes' | 'simples';
  /** Nome da lista para leitor de tela (ex.: "Números da empresa"). */
  rotulo?: string;
  className?: string;
}

/** Números de destaque (clientes, satisfação, anos de mercado). */
export function FaixaNumeros({ itens, aparencia = 'faixa', rotulo, className }: FaixaNumerosProps) {
  return (
    <div className={cx('lp-numeros', `lp-numeros--${aparencia}`, className)} role="list" aria-label={rotulo}>
      {aparencia === 'faixa' && <div className="lp-numeros-brilho" aria-hidden="true" />}
      {itens.map((n) => (
        <div key={n.rotulo} className="lp-numeros-item" role="listitem">
          <div className="lp-numeros-valor">
            {n.valor}
            {n.sufixo && <span className="lp-numeros-sufixo">{n.sufixo}</span>}
          </div>
          <div className="lp-numeros-rotulo">{n.rotulo}</div>
        </div>
      ))}
    </div>
  );
}
