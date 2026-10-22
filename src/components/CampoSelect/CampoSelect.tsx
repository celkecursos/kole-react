import { Icone } from '../../utils/Icone';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import { normalizar } from '../../utils/texto';
import type { Opcao } from '../../utils/tipos';
import { useCliqueFora } from '../../utils/useCliqueFora';
import { usePosicaoFlutuante } from '../../utils/usePosicaoFlutuante';
import { Campo, descricaoDe, useCampoIds, type CampoBaseProps } from '../Campo/Campo';
import './CampoSelect.css';

interface BaseSelectProps<V> extends CampoBaseProps {
  opcoes: Opcao<V>[];
  placeholder?: string;
  /** Digitar filtra as opções. */
  comBusca?: boolean;
  /** Mostra o "×" para limpar quando há valor. */
  botaoLimpar?: boolean;
  disabled?: boolean;
  id?: string;
}

export interface CampoSelectProps<V = string> extends BaseSelectProps<V> {
  valor?: V | null;
  aoMudar?: (valor: V | null) => void;
}

export interface CampoSelectMultiploProps<V = string> extends BaseSelectProps<V> {
  valor?: V[];
  aoMudar?: (valor: V[]) => void;
}


interface InternoProps<V> extends BaseSelectProps<V> {
  multiplo: boolean;
  selecionados: V[];
  alternar: (o: Opcao<V>) => void;
  limpar: () => void;
}

function SelectInterno<V>({
  rotulo,
  dica,
  erro,
  aviso,
  obrigatorio,
  variante = 'campo',
  className,
  id: idExterno,
  opcoes,
  placeholder = 'Selecione',
  comBusca = false,
  botaoLimpar = false,
  disabled = false,
  multiplo,
  selecionados,
  alternar,
  limpar,
}: InternoProps<V>) {
  const { id, msgId } = useCampoIds(idExterno);
  const listaId = `${id}-lista`;
  const inline = variante === 'inline';

  const moldura = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const gatilho = useRef<HTMLDivElement & HTMLInputElement>(null);

  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const [termo, setTermo] = useState('');

  const pos = usePosicaoFlutuante(moldura, aberto);
  const estaSel = (o: Opcao<V>) => selecionados.some((v) => Object.is(v, o.valor));

  const visiveis = comBusca && termo.trim()
    ? opcoes.filter((o) => normalizar(o.rotulo).includes(normalizar(termo.trim())))
    : opcoes;

  const rotuloSelecao = opcoes
    .filter(estaSel)
    .map((o) => o.rotulo)
    .join(', ');

  const fechar = useCallback(() => {
    setAberto(false);
    setTermo('');
    setAtivo(-1);
  }, []);

  const abrir = () => {
    if (disabled) return;
    const idx = opcoes.findIndex(estaSel);
    setAtivo(idx >= 0 ? idx : 0);
    setAberto(true);
  };

  useCliqueFora([moldura, painel], aberto, fechar);

  // mantém a opção ativa visível ao navegar por teclado
  useEffect(() => {
    if (aberto && ativo >= 0) document.getElementById(`${id}-op-${ativo}`)?.scrollIntoView({ block: 'nearest' });
  }, [aberto, ativo, id]);

  const mover = (passo: number) => {
    if (!visiveis.length) return;
    let i = ativo;
    for (let n = 0; n < visiveis.length; n++) {
      i = (i + passo + visiveis.length) % visiveis.length;
      if (!visiveis[i].desabilitada) break;
    }
    setAtivo(i);
  };

  const escolher = (o: Opcao<V>) => {
    if (o.desabilitada) return;
    alternar(o);
    if (!multiplo) {
      fechar();
      gatilho.current?.focus();
    } else {
      setTermo('');
    }
  };

  const aoTeclar = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (aberto) mover(1);
        else abrir();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (aberto) mover(-1);
        else abrir();
        break;
      case 'Home':
        if (aberto) {
          e.preventDefault();
          setAtivo(0);
        }
        break;
      case 'End':
        if (aberto) {
          e.preventDefault();
          setAtivo(visiveis.length - 1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (aberto && visiveis[ativo]) escolher(visiveis[ativo]);
        else if (!aberto) abrir();
        break;
      case ' ':
        if (comBusca) break;
        e.preventDefault();
        if (aberto && visiveis[ativo]) escolher(visiveis[ativo]);
        else abrir();
        break;
      case 'Escape':
        if (aberto) {
          e.preventDefault();
          e.stopPropagation();
          fechar();
        }
        break;
      case 'Tab':
        if (aberto) fechar();
        break;
    }
  };

  const ariaComum = {
    id,
    role: 'combobox',
    'aria-expanded': aberto,
    'aria-controls': listaId,
    'aria-haspopup': 'listbox' as const,
    'aria-activedescendant': aberto && ativo >= 0 ? `${id}-op-${ativo}` : undefined,
    'aria-required': obrigatorio || undefined,
    'aria-invalid': erro ? true : undefined,
    'aria-describedby': descricaoDe({ erro, aviso, dica }, msgId),
    'aria-disabled': disabled || undefined,
    onKeyDown: aoTeclar,
  };

  return (
    <Campo
      rotulo={rotulo}
      dica={dica}
      erro={erro}
      aviso={aviso}
      obrigatorio={obrigatorio}
      variante={variante}
      className={className}
      htmlFor={id}
      msgId={msgId}
    >
      <div
        ref={moldura}
        className={cx('lp-sel', !inline && 'lp-ctl-frame', erro && 'is-invalid', disabled && 'is-disabled')}
      >
        {comBusca ? (
          <input
            ref={gatilho}
            {...ariaComum}
            className="lp-input lp-input--bare lp-sel-input"
            aria-autocomplete="list"
            autoComplete="off"
            disabled={disabled}
            placeholder={rotuloSelecao || placeholder}
            value={aberto ? termo : rotuloSelecao}
            onChange={(e) => {
              setTermo(e.target.value);
              setAtivo(0);
              if (!aberto) setAberto(true);
            }}
            onClick={() => !aberto && abrir()}
          />
        ) : (
          <div
            ref={gatilho}
            {...ariaComum}
            tabIndex={disabled ? -1 : 0}
            className="lp-sel-gatilho"
            onClick={() => (aberto ? fechar() : abrir())}
          >
            <span className={cx('lp-sel-texto', !rotuloSelecao && 'lp-sel-ph')}>{rotuloSelecao || placeholder}</span>
          </div>
        )}
        {botaoLimpar && selecionados.length > 0 && !disabled && (
          <button type="button" className="lp-ctl-suffix" aria-label="Limpar seleção" onClick={limpar}>
            <Icone icone="x" />
          </button>
        )}
        <button
          type="button"
          className="lp-ctl-suffix lp-sel-seta"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onClick={() => {
            if (aberto) fechar();
            else {
              abrir();
              gatilho.current?.focus();
            }
          }}
        >
          <Icone icone={aberto ? 'chevron-up' : 'chevron-down'} />
        </button>
      </div>

      {aberto &&
        pos &&
        portal(
          <div
            ref={painel}
            className="lp-sel-painel"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              transform: pos.acima ? 'translateY(-100%)' : undefined,
            }}
          >
            <ul id={listaId} role="listbox" className="lp-sel-lista" aria-multiselectable={multiplo || undefined}>
              {visiveis.map((o, i) => {
                const sel = estaSel(o);
                return (
                  <li
                    key={i}
                    id={`${id}-op-${i}`}
                    role="option"
                    aria-selected={sel}
                    aria-disabled={o.desabilitada || undefined}
                    data-ativo={i === ativo || undefined}
                    className="lp-sel-op"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setAtivo(i)}
                    onClick={() => escolher(o)}
                  >
                    {multiplo && <span className="lp-sel-check" aria-hidden="true" />}
                    {o.rotulo}
                  </li>
                );
              })}
            </ul>
            {!visiveis.length && (
              <div className="lp-sel-nada" role="status">
                Nenhum resultado encontrado
              </div>
            )}
          </div>,
        )}
    </Campo>
  );
}

/** Select de opção única. */
export function CampoSelect<V = string>({ valor, aoMudar, ...p }: CampoSelectProps<V>) {
  const temValor = valor !== null && valor !== undefined;
  return (
    <SelectInterno<V>
      {...p}
      multiplo={false}
      selecionados={temValor ? [valor] : []}
      alternar={(o) => aoMudar?.(o.valor)}
      limpar={() => aoMudar?.(null)}
    />
  );
}

/** Select de várias opções (com caixas de marcação). */
export function CampoSelectMultiplo<V = string>({ valor = [], aoMudar, ...p }: CampoSelectMultiploProps<V>) {
  return (
    <SelectInterno<V>
      {...p}
      multiplo
      selecionados={valor}
      alternar={(o) =>
        aoMudar?.(valor.some((v) => Object.is(v, o.valor)) ? valor.filter((v) => !Object.is(v, o.valor)) : [...valor, o.valor])
      }
      limpar={() => aoMudar?.([])}
    />
  );
}
