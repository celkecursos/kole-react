import { forwardRef, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Campo, descricaoDe, useCampoIds, type CampoBaseProps } from '../Campo/Campo';
import './CampoTextarea.css';

type TextareaNativo = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'className'>;

export interface CampoTextareaProps extends Omit<CampoBaseProps, 'variante'>, TextareaNativo {
  valor?: string;
  aoMudar?: (valor: string) => void;
  /** Com `maxLength`, mostra o contador `n/máx` no canto. */
  contador?: boolean;
}

export const CampoTextarea = forwardRef<HTMLTextAreaElement, CampoTextareaProps>(function CampoTextarea(
  { rotulo, dica, erro, aviso, obrigatorio, className, id: idExterno, valor, aoMudar, onChange, maxLength, contador = true, rows = 3, ...resto },
  ref,
) {
  const { id, msgId } = useCampoIds(idExterno);
  const comContador = contador && !!maxLength;
  const tamanho = valor?.length ?? 0;
  const pct = maxLength ? tamanho / maxLength : 0;

  const aoDigitar = (e: ChangeEvent<HTMLTextAreaElement>) => {
    aoMudar?.(e.target.value);
    onChange?.(e);
  };

  return (
    <Campo rotulo={rotulo} dica={dica} erro={erro} aviso={aviso} obrigatorio={obrigatorio} className={className} htmlFor={id} msgId={msgId}>
      <div className="lp-ta">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cx('lp-input', comContador && 'lp-ta--contador')}
          value={valor}
          onChange={aoDigitar}
          maxLength={maxLength}
          required={obrigatorio}
          aria-required={obrigatorio || undefined}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoDe({ erro, aviso, dica }, msgId)}
          {...resto}
        />
        {comContador && (
          <span
            className={cx('lp-ta-contador', pct >= 1 ? 'is-err' : pct >= 0.9 && 'is-warn')}
            aria-hidden="true"
          >
            {tamanho}/{maxLength}
          </span>
        )}
      </div>
    </Campo>
  );
});
