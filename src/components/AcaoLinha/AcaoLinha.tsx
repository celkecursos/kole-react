import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Dica } from '../Dica/Dica';
import './AcaoLinha.css';

export interface AcaoLinhaProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icone: IconeProp;
  /** Nome da ação: vira dica e aria-label. */
  rotulo: string;
  /** `pri` = azul · `destaque` = laranja · `err` = vermelho. */
  severidade?: 'neutra' | 'pri' | 'destaque' | 'err';
  carregando?: boolean;
}

/** Botão-ícone compacto para ações de linha de tabela/card. */
export function AcaoLinha({
  icone,
  rotulo,
  severidade = 'neutra',
  carregando = false,
  disabled,
  className,
  type = 'button',
  ...resto
}: AcaoLinhaProps) {
  return (
    <Dica texto={rotulo}>
      <button
        type={type}
        className={cx('lp-acao', severidade !== 'neutra' && `lp-acao--${severidade}`, className)}
        aria-label={rotulo}
        aria-busy={carregando || undefined}
        disabled={disabled || carregando}
        {...resto}
      >
        {carregando ? <Icone icone="loader-circle" girar /> : <Icone icone={icone} />}
      </button>
    </Dica>
  );
}
