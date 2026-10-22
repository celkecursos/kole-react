import { Icone } from '../../utils/Icone';
import { useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent, type Key } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import { useBuscaAssincrona, BUSCA_ATRASO_MS } from '../../utils/useBuscaAssincrona';
import { useCliqueFora } from '../../utils/useCliqueFora';
import { usePosicaoFlutuante } from '../../utils/usePosicaoFlutuante';
import { Campo, descricaoDe, MSG_OBRIGATORIO, RevelarCamposCtx, useCampoIds, type CampoBaseProps } from '../Campo/Campo';
import '../CampoSelect/CampoSelect.css';
import './CampoBusca.css';

export interface CampoBuscaProps<T> extends CampoBaseProps {
  /** A busca do módulo: termo → registros. */
  buscar: (termo: string) => Promise<T[]>;
  /** Texto do registro (no campo e em cada linha do painel). */
  paraRotulo: (item: T) => string;
  /** Linha secundária opcional no painel (ex.: CPF, lotação). */
  paraDetalhe?: (item: T) => string | undefined;
  /** Chave de cada resultado (padrão: `item.id` ou o rótulo). */
  chave?: (item: T) => Key;
  /** O REGISTRO escolhido — texto digitado sem escolha não é valor. */
  valor?: T | null;
  aoMudar?: (valor: T | null) => void;
  /** Mínimo de caracteres para buscar (padrão: 1). */
  minimo?: number;
  atraso?: number;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  /** Mensagem quando a busca não acha nada. */
  vazioTexto?: string;
}

/**
 * Autocompletar com busca no servidor: o jeito canônico de buscar e vincular
 * uma entidade (pessoa, servidor, fornecedor…) grande demais para carregar inteira.
 */
export function CampoBusca<T>({
  rotulo,
  dica,
  erro,
  aviso,
  obrigatorio,
  variante = 'campo',
  className,
  id: idExterno,
  buscar,
  paraRotulo,
  paraDetalhe,
  chave = (i) => ((i as { id?: Key }).id ?? paraRotulo(i)) as Key,
  valor = null,
  aoMudar,
  minimo = 1,
  atraso = BUSCA_ATRASO_MS,
  placeholder = 'Buscar…',
  disabled = false,
  vazioTexto = 'Nenhum resultado encontrado',
}: CampoBuscaProps<T>) {
  const { id, msgId } = useCampoIds(idExterno);
  const listaId = `${id}-lista`;
  const inline = variante === 'inline';
  const moldura = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const [editando, setEditando] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const tentativas = useContext(RevelarCamposCtx);

  const { termo, setTermo, resultados, carregando } = useBuscaAssincrona({ buscar, ativo: editando, minimo, atraso });
  const aberto = editando && termo.trim().length >= minimo;
  const pos = usePosicaoFlutuante(moldura, aberto);

  const fechar = useCallback(() => {
    setEditando(false);
    setTermo('');
  }, [setTermo]);
  useCliqueFora([moldura, painel], editando, fechar);

  useEffect(() => setAtivo(0), [resultados]);
  useEffect(() => {
    if (aberto) document.getElementById(`${id}-op-${ativo}`)?.scrollIntoView({ block: 'nearest' });
  }, [aberto, ativo, id]);

  const escolher = (item: T) => {
    aoMudar?.(item);
    fechar();
    input.current?.focus();
  };

  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && aberto) {
      e.preventDefault();
      setAtivo((i) => Math.min(i + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp' && aberto) {
      e.preventDefault();
      setAtivo((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && aberto && resultados[ativo]) {
      e.preventDefault();
      escolher(resultados[ativo]);
    } else if (e.key === 'Escape' && editando) {
      e.preventDefault();
      e.stopPropagation();
      fechar();
    } else if (e.key === 'Tab') {
      fechar();
    }
  };

  const erroFinal = erro || (obrigatorio && !valor && (revelado || tentativas > 0) ? MSG_OBRIGATORIO : undefined);

  return (
    <Campo
      rotulo={rotulo}
      dica={dica}
      erro={erroFinal}
      aviso={aviso}
      obrigatorio={obrigatorio}
      variante={variante}
      className={className}
      htmlFor={id}
      msgId={msgId}
    >
      <div ref={moldura} className={cx('lp-sel', !inline && 'lp-ctl-frame', erroFinal && 'is-invalid', disabled && 'is-disabled')}>
        <Icone icone="search" className="lp-busca-campo-ic" />
        <input
          ref={input}
          id={id}
          role="combobox"
          aria-expanded={aberto}
          aria-controls={listaId}
          aria-autocomplete="list"
          aria-activedescendant={aberto && resultados.length ? `${id}-op-${ativo}` : undefined}
          aria-required={obrigatorio || undefined}
          aria-invalid={erroFinal ? true : undefined}
          aria-describedby={descricaoDe({ erro: erroFinal, aviso, dica }, msgId)}
          autoComplete="off"
          className="lp-input lp-input--bare lp-sel-input"
          disabled={disabled}
          placeholder={placeholder}
          value={editando ? termo : valor ? paraRotulo(valor) : ''}
          onChange={(e) => {
            setEditando(true);
            setTermo(e.target.value);
            // texto digitado não casa mais com o registro escolhido
            if (valor) aoMudar?.(null);
          }}
          onKeyDown={aoTeclar}
          onBlur={() => setRevelado(true)}
        />
        {carregando && editando && (
          <span role="status" className="lp-busca-campo-carregando">
            <Icone icone="loader-circle" girar />
            <span className="lp-sr">Buscando</span>
          </span>
        )}
        {valor && !disabled && !editando && (
          <button type="button" className="lp-ctl-suffix" aria-label="Limpar seleção" onClick={() => aoMudar?.(null)}>
            <Icone icone="x" />
          </button>
        )}
      </div>

      {aberto &&
        pos &&
        portal(
          <div
            ref={painel}
            className="lp-sel-painel"
            style={{ top: pos.top, left: pos.left, width: pos.width, transform: pos.acima ? 'translateY(-100%)' : undefined }}
          >
            <ul id={listaId} role="listbox" className="lp-sel-lista" aria-busy={carregando || undefined}>
              {resultados.map((item, i) => (
                <li
                  key={chave(item)}
                  id={`${id}-op-${i}`}
                  role="option"
                  aria-selected={i === ativo}
                  data-ativo={i === ativo || undefined}
                  className="lp-sel-op lp-busca-campo-op"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setAtivo(i)}
                  onClick={() => escolher(item)}
                >
                  <span>{paraRotulo(item)}</span>
                  {paraDetalhe?.(item) && <span className="lp-busca-campo-det">{paraDetalhe(item)}</span>}
                </li>
              ))}
            </ul>
            {!resultados.length && (
              <div className="lp-sel-nada" role="status">
                {carregando ? 'Buscando…' : vazioTexto}
              </div>
            )}
          </div>,
        )}
    </Campo>
  );
}
