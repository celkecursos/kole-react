import type { InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useCampoIds } from '../Campo/Campo';
import './CampoMarcacao.css';

export interface CampoMarcacaoProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'className' | 'value'> {
  rotulo?: string;
  valor?: boolean;
  aoMudar?: (valor: boolean) => void;
  /** `caixa` = checkbox · `chave` = interruptor (switch). */
  aparencia?: 'caixa' | 'chave';
  dica?: string;
  erro?: string;
  obrigatorio?: boolean;
  className?: string;
}

export function CampoMarcacao({
  rotulo,
  valor,
  aoMudar,
  aparencia = 'caixa',
  dica,
  erro,
  obrigatorio,
  className,
  id: idExterno,
  onChange,
  ...resto
}: CampoMarcacaoProps) {
  const { id, msgId } = useCampoIds(idExterno);
  return (
    <div className={cx('lp-marc-wrap', className)}>
      <label className={cx('lp-marc', aparencia === 'chave' && 'lp-marc--chave')}>
        <input
          id={id}
          type="checkbox"
          className="lp-marc-in"
          role={aparencia === 'chave' ? 'switch' : undefined}
          checked={valor}
          onChange={(e) => {
            aoMudar?.(e.target.checked);
            onChange?.(e);
          }}
          aria-required={obrigatorio || undefined}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro || dica ? msgId : undefined}
          {...resto}
        />
        <span className="lp-marc-visual" aria-hidden="true" />
        {rotulo && (
          <span className="lp-marc-rotulo">
            {rotulo}
            {obrigatorio && <span className="lp-campo-req" aria-hidden="true">*</span>}
          </span>
        )}
      </label>
      {erro ? (
        <span className="lp-campo-msg lp-campo-msg--err" role="alert" id={msgId}>{erro}</span>
      ) : dica ? (
        <span className="lp-campo-msg lp-campo-msg--dica" id={msgId}>{dica}</span>
      ) : null}
    </div>
  );
}
