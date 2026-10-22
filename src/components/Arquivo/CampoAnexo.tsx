import { Icone } from '../../utils/Icone';
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState, type DragEvent } from 'react';
import { formatBytes, iconeArquivo, tipoDeArquivo, type Anexo } from '../../utils/anexos';
import { cx } from '../../utils/cx';
import { listaPorExtenso } from '../../utils/texto';
import { AcaoLinha } from '../AcaoLinha/AcaoLinha';
import { Campo, RevelarCamposCtx, useCampoIds, type CampoBaseProps } from '../Campo/Campo';
import { DialogoArquivo } from './DialogoArquivo';
import './Arquivo.css';

export interface CampoAnexoProps extends Omit<CampoBaseProps, 'variante' | 'obrigatorio'> {
  /** Lista serializável de anexos (sem o `File`). */
  valor?: Anexo[];
  aoMudar?: (valor: Anexo[]) => void;
  /** Filtro do seletor nativo (ex.: `image/*,.pdf`). */
  accept?: string;
  /** Vários arquivos (padrão: sim). Com `false`, a nova escolha substitui. */
  multiple?: boolean;
  /** Tamanho máximo por arquivo, em bytes (0 = sem limite). */
  maxTamanho?: number;
  /** Mínimo de anexos; acima de zero o campo é obrigatório. */
  minimo?: number;
  disabled?: boolean;
  id?: string;
}

/** O que a `ref` do `CampoAnexo` expõe. */
export interface CampoAnexoRef {
  /** O `File` da sessão por trás do anexo, ou `null` (anexo já salvo no backend). */
  arquivoDe: (anexo: Pick<Anexo, 'nome' | 'tamanho'>) => File | null;
}

const chaveDe = (a: Pick<Anexo, 'nome' | 'tamanho'>) => `${a.nome}|${a.tamanho}`;

/**
 * Zona de anexos (clicar ou arrastar). O valor é `Anexo[]`; o `File` real fica
 * na sessão e sai por `ref.current.arquivoDe(anexo)` na hora do upload.
 */
export const CampoAnexo = forwardRef<CampoAnexoRef, CampoAnexoProps>(function CampoAnexo({
  rotulo,
  dica,
  erro,
  aviso,
  className,
  id: idExterno,
  valor = [],
  aoMudar,
  accept,
  multiple = true,
  maxTamanho = 0,
  minimo = 0,
  disabled = false,
}, ref) {
  const { id, msgId } = useCampoIds(idExterno);
  const input = useRef<HTMLInputElement>(null);
  const arquivos = useRef(new Map<string, File>());
  const urls = useRef(new Map<string, string>());
  const [sobre, setSobre] = useState(false);
  const [recusados, setRecusados] = useState('');
  const [visualizando, setVisualizando] = useState<number | null>(null);
  const [mexido, setMexido] = useState(false);
  const tentativas = useContext(RevelarCamposCtx);

  useImperativeHandle(ref, () => ({ arquivoDe: (a) => arquivos.current.get(chaveDe(a)) ?? null }), []);

  // libera as URLs de pré-visualização ao desmontar
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const adicionar = (lista: FileList | null) => {
    if (!lista?.length || disabled) return;
    setMexido(true);
    const aceitos: Anexo[] = [];
    const grandes: string[] = [];
    for (const f of Array.from(lista)) {
      if (maxTamanho && f.size > maxTamanho) {
        grandes.push(f.name);
        continue;
      }
      const k = chaveDe({ nome: f.name, tamanho: f.size });
      arquivos.current.set(k, f);
      let url = urls.current.get(k);
      if (!url) {
        url = URL.createObjectURL(f);
        urls.current.set(k, url);
      }
      aceitos.push({ nome: f.name, tamanho: f.size, tipo: f.type, url });
    }
    setRecusados(grandes.length ? `${listaPorExtenso(grandes)} excede${grandes.length > 1 ? 'm' : ''} ${formatBytes(maxTamanho)}.` : '');
    if (!aceitos.length) return;
    if (!multiple) aoMudar?.(aceitos.slice(0, 1));
    else {
      const existentes = new Set(valor.map(chaveDe));
      aoMudar?.([...valor, ...aceitos.filter((a) => !existentes.has(chaveDe(a)))]);
    }
  };

  const remover = (a: Anexo) => {
    setMexido(true);
    aoMudar?.(valor.filter((x) => chaveDe(x) !== chaveDe(a)));
  };

  const aoSoltar = (e: DragEvent) => {
    e.preventDefault();
    setSobre(false);
    adicionar(e.dataTransfer.files);
  };

  const faltam = minimo > 0 && valor.length < minimo && (mexido || tentativas > 0);
  const erroFinal =
    erro ||
    recusados ||
    (faltam ? (minimo === 1 ? 'Anexe pelo menos um arquivo' : `Anexe pelo menos ${minimo} arquivos`) : undefined);

  return (
    <Campo
      rotulo={rotulo}
      dica={dica}
      erro={erroFinal}
      aviso={aviso}
      obrigatorio={minimo > 0}
      className={className}
      htmlFor={id}
      msgId={msgId}
    >
      <div
        className={cx('lp-anexo-zona', sobre && 'is-sobre', erroFinal && 'is-invalid', disabled && 'is-disabled')}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setSobre(true);
        }}
        onDragLeave={() => setSobre(false)}
        onDrop={aoSoltar}
      >
        <Icone icone="cloud-upload" />
        <span>
          <strong>Clique para escolher</strong> ou arraste {multiple ? 'os arquivos' : 'o arquivo'} até aqui
        </span>
        {maxTamanho > 0 && <small>Até {formatBytes(maxTamanho)} por arquivo</small>}
        <input
          ref={input}
          id={id}
          type="file"
          className="lp-sr"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={erroFinal || aviso || dica ? msgId : undefined}
          aria-invalid={erroFinal ? true : undefined}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            adicionar(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {valor.length > 0 && (
        <ul className="lp-anexo-lista">
          {valor.map((a, i) => (
            <li key={chaveDe(a)} className="lp-anexo-item">
              <button type="button" className="lp-anexo-abrir" onClick={() => setVisualizando(i)} title={`Visualizar ${a.nome}`}>
                <span className="lp-anexo-thumb">
                  {tipoDeArquivo(a.tipo, a.nome) === 'imagem' && a.url ? (
                    <img src={a.miniatura ?? a.url} alt="" />
                  ) : (
                    <Icone icone={iconeArquivo(a.tipo, a.nome)} />
                  )}
                </span>
                <span className="lp-anexo-txt">
                  <span className="lp-anexo-nome">{a.nome}</span>
                  <span className="lp-anexo-tam">{formatBytes(a.tamanho)}</span>
                </span>
              </button>
              {!disabled && <AcaoLinha icone="x" rotulo={`Remover ${a.nome}`} severidade="err" onClick={() => remover(a)} />}
            </li>
          ))}
        </ul>
      )}

      <DialogoArquivo
        aberto={visualizando !== null}
        aoFechar={() => setVisualizando(null)}
        arquivos={valor}
        indice={visualizando ?? 0}
        aoMudarIndice={setVisualizando}
      />
    </Campo>
  );
});
