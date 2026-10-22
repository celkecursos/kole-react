import { Icone } from '../../utils/Icone';
import { useContext, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import {
  filtrarItens,
  moverParaAlvo,
  moverParaFonte,
  normalizarPicklistValor,
  reordenarLista,
  type PicklistValor,
} from '../../utils/picklist';
import { Botao } from '../Botao/Botao';
import { Campo, MSG_OBRIGATORIO, RevelarCamposCtx, useCampoIds, type CampoBaseProps } from '../Campo/Campo';
import './Picklist.css';

export interface PicklistProps<T> extends Omit<CampoBaseProps, 'variante'> {
  valor?: PicklistValor<T>;
  aoMudar?: (valor: PicklistValor<T>) => void;
  rotuloFonte?: string;
  rotuloAlvo?: string;
  /** Texto do item (linha, filtro e anúncios). Obrigatório para objetos. */
  paraRotulo?: (item: T) => string;
  /** Linha customizada; padrão = `paraRotulo(item)`. */
  renderItem?: (item: T) => ReactNode;
  /** Campo de busca no topo de cada lista. */
  filtro?: boolean;
  /** Arrastar e soltar como caminho ADICIONAL (o teclado sempre funciona). */
  dragdrop?: boolean;
  /** Reordenar dentro da lista (Alt + setas, ou arrastando). */
  reordenar?: boolean;
  alturaLista?: string;
  disabled?: boolean;
  id?: string;
}

type Lado = 'fonte' | 'alvo';

/**
 * Transferência entre duas listas (disponíveis × selecionados). Teclado:
 * setas movem o foco, Espaço marca, Enter transfere, Alt+setas reordena;
 * duplo clique também transfere.
 */
export function Picklist<T>({
  rotulo,
  dica,
  erro,
  aviso,
  obrigatorio,
  className,
  id: idExterno,
  valor: valorBruto,
  aoMudar,
  rotuloFonte = 'Disponíveis',
  rotuloAlvo = 'Selecionados',
  paraRotulo = (i) => (typeof i === 'string' ? i : String(i)),
  renderItem,
  filtro = false,
  dragdrop = true,
  reordenar = true,
  alturaLista = '15rem',
  disabled = false,
}: PicklistProps<T>) {
  const { id, msgId } = useCampoIds(idExterno);
  const valor = normalizarPicklistValor(valorBruto);
  const [sel, setSel] = useState<{ fonte: Set<T>; alvo: Set<T> }>({ fonte: new Set(), alvo: new Set() });
  const [termo, setTermo] = useState({ fonte: '', alvo: '' });
  const [foco, setFoco] = useState({ fonte: 0, alvo: 0 });
  const [anuncio, setAnuncio] = useState('');
  const [mexido, setMexido] = useState(false);
  const tentativas = useContext(RevelarCamposCtx);
  const arrastado = useRef<{ lado: Lado; item: T } | null>(null);

  const visiveis = {
    fonte: filtrarItens(valor.fonte, termo.fonte, paraRotulo),
    alvo: filtrarItens(valor.alvo, termo.alvo, paraRotulo),
  };

  const mudar = (v: PicklistValor<T>, msg: string) => {
    setMexido(true);
    setAnuncio(msg);
    aoMudar?.(v);
  };

  const transferir = (de: Lado, itens: readonly T[]) => {
    if (!itens.length || disabled) return;
    const v = de === 'fonte' ? moverParaAlvo(valor, itens) : moverParaFonte(valor, itens);
    setSel({ fonte: new Set(), alvo: new Set() });
    const destino = de === 'fonte' ? rotuloAlvo : rotuloFonte;
    mudar(v, itens.length === 1 ? `${paraRotulo(itens[0])} movido para ${destino}` : `${itens.length} itens movidos para ${destino}`);
  };

  const marcar = (lado: Lado, item: T, aditivo: boolean) => {
    setSel((s) => {
      const atual = new Set(aditivo ? s[lado] : []);
      if (aditivo && atual.has(item)) atual.delete(item);
      else atual.add(item);
      return { ...s, [lado]: atual };
    });
  };

  const reordenarItem = (lado: Lado, item: T, passo: number) => {
    const lista = valor[lado];
    const i = lista.indexOf(item);
    const j = i + passo;
    if (i < 0 || j < 0 || j >= lista.length) return;
    mudar({ ...valor, [lado]: reordenarLista(lista, i, j) }, `${paraRotulo(item)} na posição ${j + 1}`);
  };

  const aoTeclar = (lado: Lado) => (e: KeyboardEvent<HTMLUListElement>) => {
    const lista = visiveis[lado];
    const i = Math.min(foco[lado], lista.length - 1);
    const item = lista[i];
    const focar = (n: number) => setFoco((f) => ({ ...f, [lado]: Math.max(0, Math.min(lista.length - 1, n)) }));
    if (e.altKey && reordenar && item && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      if (termo[lado]) return; // reordenar com filtro ativo embaralharia a posição real
      const passo = e.key === 'ArrowUp' ? -1 : 1;
      reordenarItem(lado, item, passo);
      focar(i + passo);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focar(i + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focar(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        focar(0);
        break;
      case 'End':
        e.preventDefault();
        focar(lista.length - 1);
        break;
      case ' ':
        e.preventDefault();
        if (item) marcar(lado, item, true);
        break;
      case 'Enter': {
        e.preventDefault();
        const marcados = lista.filter((x) => sel[lado].has(x));
        transferir(lado, marcados.length ? marcados : item ? [item] : []);
        break;
      }
    }
  };

  const soltar = (lado: Lado, antesDe?: T) => (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const a = arrastado.current;
    arrastado.current = null;
    if (!a || disabled) return;
    if (a.lado !== lado) {
      transferir(a.lado, [a.item]);
      return;
    }
    if (!reordenar || antesDe === undefined || antesDe === a.item) return;
    const lista = valor[lado];
    mudar({ ...valor, [lado]: reordenarLista(lista, lista.indexOf(a.item), lista.indexOf(antesDe)) }, `${paraRotulo(a.item)} reordenado`);
  };

  const erroFinal = erro || (obrigatorio && !valor.alvo.length && (mexido || tentativas > 0) ? MSG_OBRIGATORIO : undefined);

  const coluna = (lado: Lado, titulo: string) => {
    const lista = visiveis[lado];
    const listaId = `${id}-${lado}`;
    const ativo = Math.min(foco[lado], lista.length - 1);
    return (
      <div className="lp-pick-col">
        <div className="lp-pick-cab">
          <span id={`${listaId}-t`}>{titulo}</span>
          <span className="lp-contador">{valor[lado].length}</span>
        </div>
        {filtro && (
          <div className="lp-pick-filtro">
            <Icone icone="search" />
            <input
              className="lp-input lp-input--bare"
              placeholder="Buscar"
              aria-label={`Buscar em ${titulo}`}
              disabled={disabled}
              value={termo[lado]}
              onChange={(e) => {
                setTermo((t) => ({ ...t, [lado]: e.target.value }));
                setFoco((f) => ({ ...f, [lado]: 0 }));
              }}
            />
          </div>
        )}
        <ul
          id={listaId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={`${listaId}-t`}
          aria-activedescendant={lista.length ? `${listaId}-${ativo}` : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          className="lp-pick-lista"
          style={{ height: alturaLista }}
          onKeyDown={aoTeclar(lado)}
          onDragOver={(e) => dragdrop && e.preventDefault()}
          onDrop={soltar(lado)}
        >
          {lista.map((item, i) => (
            <li
              key={i}
              id={`${listaId}-${i}`}
              role="option"
              aria-selected={sel[lado].has(item)}
              data-ativo={i === ativo || undefined}
              className="lp-pick-item"
              draggable={dragdrop && !disabled}
              onDragStart={() => (arrastado.current = { lado, item })}
              onDragOver={(e) => dragdrop && e.preventDefault()}
              onDrop={soltar(lado, item)}
              onClick={(e) => {
                if (disabled) return;
                setFoco((f) => ({ ...f, [lado]: i }));
                marcar(lado, item, e.ctrlKey || e.metaKey);
              }}
              onDoubleClick={() => transferir(lado, [item])}
            >
              {dragdrop && !disabled && <Icone icone="menu" className="lp-pick-alca" />}
              <span className="lp-pick-rot">{renderItem ? renderItem(item) : paraRotulo(item)}</span>
            </li>
          ))}
          {!lista.length && <li className="lp-pick-vazio">{termo[lado] ? 'Nada encontrado' : 'Nenhum item'}</li>}
        </ul>
      </div>
    );
  };

  const marcadosFonte = visiveis.fonte.filter((x) => sel.fonte.has(x));
  const marcadosAlvo = visiveis.alvo.filter((x) => sel.alvo.has(x));

  return (
    <Campo rotulo={rotulo} dica={dica} erro={erroFinal} aviso={aviso} obrigatorio={obrigatorio} className={className} msgId={msgId}>
      <div className={cx('lp-pick', disabled && 'is-disabled', erroFinal && 'is-invalid')} aria-describedby={erroFinal || aviso || dica ? msgId : undefined}>
        {coluna('fonte', rotuloFonte)}
        <div className="lp-pick-acoes">
          <Botao icone="chevron-right" severidade="secundario" aparencia="contorno" dica="Mover selecionados" aria-label="Mover selecionados" disabled={disabled || !marcadosFonte.length} onClick={() => transferir('fonte', marcadosFonte)} />
          <Botao icone="chevrons-right" severidade="secundario" aparencia="contorno" dica="Mover todos" aria-label="Mover todos" disabled={disabled || !visiveis.fonte.length} onClick={() => transferir('fonte', visiveis.fonte)} />
          <Botao icone="chevron-left" severidade="secundario" aparencia="contorno" dica="Devolver selecionados" aria-label="Devolver selecionados" disabled={disabled || !marcadosAlvo.length} onClick={() => transferir('alvo', marcadosAlvo)} />
          <Botao icone="chevrons-left" severidade="secundario" aparencia="contorno" dica="Devolver todos" aria-label="Devolver todos" disabled={disabled || !visiveis.alvo.length} onClick={() => transferir('alvo', visiveis.alvo)} />
        </div>
        {coluna('alvo', rotuloAlvo)}
        <span className="lp-sr" aria-live="polite">
          {anuncio}
        </span>
      </div>
    </Campo>
  );
}
