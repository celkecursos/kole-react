import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './BotaoFechar.css';

export interface BotaoFecharProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** `claro` = para fundos escuros. */
  variante?: 'padrao' | 'claro';
  tamanho?: 'pequeno' | 'medio';
  /** Nome para leitor de tela (padrão: "Fechar"). */
  rotulo?: string;
}

/** O × de fechar (avisos, diálogos, painéis), com o nome acessível. */
export function BotaoFechar({ variante = 'padrao', tamanho = 'medio', rotulo = 'Fechar', className, type = 'button', ...resto }: BotaoFecharProps) {
  return (
    <button
      type={type}
      className={cx('lp-fechar', variante === 'claro' && 'lp-fechar--claro', tamanho === 'pequeno' && 'lp-fechar--pequeno', className)}
      aria-label={rotulo}
      title={rotulo}
      {...resto}
    >
      <Icone icone="x" />
    </button>
  );
}
