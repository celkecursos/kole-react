import { useRef, type KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import type { Opcao } from '../../utils/tipos';
import { Campo, descricaoDe, useCampoIds, type CampoBaseProps } from '../Campo/Campo';
import './Escolha.css';

export interface EscolhaProps<V = string> extends Omit<CampoBaseProps, 'variante' | 'aviso'> {
  opcoes: Opcao<V>[];
  valor?: V | null;
  aoMudar?: (valor: V) => void;
  /** `segmentado` = botões colados · `radio` = lista de bolinhas. */
  aparencia?: 'segmentado' | 'radio';
  disabled?: boolean;
  ariaLabel?: string;
  id?: string;
}

/** Escolha única entre poucas opções (radiogroup). */
export function Escolha<V = string>({
  rotulo,
  dica,
  erro,
  obrigatorio,
  className,
  opcoes,
  valor,
  aoMudar,
  aparencia = 'segmentado',
  disabled = false,
  ariaLabel,
  id: idExterno,
}: EscolhaProps<V>) {
  const { id, msgId } = useCampoIds(idExterno);
  const grupo = useRef<HTMLDivElement>(null);
  const idxSel = opcoes.findIndex((o) => Object.is(o.valor, valor));
  const idxFoco = idxSel >= 0 ? idxSel : 0;

  const aoTeclar = (e: KeyboardEvent, i: number) => {
    const passo = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    let j = i;
    for (let n = 0; n < opcoes.length; n++) {
      j = (j + passo + opcoes.length) % opcoes.length;
      if (!opcoes[j].desabilitada) break;
    }
    aoMudar?.(opcoes[j].valor);
    grupo.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[j]?.focus();
  };

  return (
    <Campo rotulo={rotulo} dica={dica} erro={erro} obrigatorio={obrigatorio} className={cx('lp-escolha-campo', className)} msgId={msgId}>
      <div
        ref={grupo}
        id={id}
        role="radiogroup"
        className={cx('lp-esc', aparencia === 'radio' && 'lp-esc--radio')}
        aria-label={rotulo ?? ariaLabel}
        aria-required={obrigatorio || undefined}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricaoDe({ erro, dica }, msgId)}
      >
        {opcoes.map((o, i) => {
          const on = i === idxSel;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={on}
              className={cx('lp-esc-op', on && 'is-on')}
              tabIndex={i === idxFoco ? 0 : -1}
              disabled={disabled || o.desabilitada}
              onClick={() => aoMudar?.(o.valor)}
              onKeyDown={(e) => aoTeclar(e, i)}
            >
              {aparencia === 'radio' && <span className="lp-esc-dot" aria-hidden="true" />}
              {o.rotulo}
            </button>
          );
        })}
      </div>
    </Campo>
  );
}
