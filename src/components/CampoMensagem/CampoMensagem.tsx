import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState, type ClipboardEvent, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';
import { formatBytes, iconeArquivo } from '../../utils/anexos';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { Botao } from '../Botao/Botao';
import { useCampoIds } from '../Campo/Campo';
import './CampoMensagem.css';

/** Arquivo anexado à mensagem, mostrado em chip acima do texto. */
export interface AnexoMensagem {
  id: string | number;
  nome: string;
  /** Em bytes. */
  tamanho?: number;
  /** Tipo MIME (define o ícone). */
  tipo?: string;
  /** Envio em andamento, de 0 a 100: a barra aparece e o Enviar espera. */
  progresso?: number;
  /** O envio falhou: o chip fica vermelho com este texto. */
  erro?: string;
}

export interface CampoMensagemProps {
  valor: string;
  aoMudar: (valor: string) => void;
  /** Recebe o texto sem espaços nas pontas; só vem vazio quando há anexos. */
  aoEnviar: (texto: string) => void;
  /** Uma resposta está chegando: o Enviar vira Parar. */
  gerando?: boolean;
  /** Chamado pelo botão Parar (sem ele, o Parar fica desabilitado). */
  aoParar?: () => void;
  desabilitado?: boolean;
  placeholder?: string;
  /** Limite de caracteres; o contador aparece perto do limite. */
  maxCaracteres?: number;
  /** Até quantas linhas o campo cresce antes de rolar. */
  linhasMaximas?: number;
  autoFocus?: boolean;
  /** Botões próprios do app à esquerda do Enviar (anexar, escolher documentos…). */
  acoesExtras?: ReactNode;
  /** Chips dos arquivos anexados, acima do texto. Com anexos, dá para enviar sem texto. */
  anexos?: AnexoMensagem[];
  /** Mostra o "×" em cada chip. */
  aoRemoverAnexo?: (id: AnexoMensagem['id']) => void;
  /** Arquivos soltos sobre o campo ou colados nele (Ctrl+V de uma imagem): o app valida e envia. */
  aoAdicionarArquivos?: (arquivos: File[]) => void;
  /** Rótulo do campo para leitores de tela. */
  rotulo?: string;
  rotuloEnviar?: string;
  rotuloParar?: string;
  id?: string;
  className?: string;
}

/** a partir de que fração do limite o contador aparece */
const AVISO_CONTADOR = 0.8;

/**
 * Campo de envio de mensagem: Enter envia, Shift+Enter quebra a linha. Cresce
 * com o texto até `linhasMaximas` e depois rola.
 */
export const CampoMensagem = forwardRef<HTMLTextAreaElement, CampoMensagemProps>(function CampoMensagem(
  {
    valor,
    aoMudar,
    aoEnviar,
    gerando = false,
    aoParar,
    desabilitado = false,
    placeholder = 'Escreva uma mensagem',
    maxCaracteres,
    linhasMaximas = 6,
    autoFocus,
    acoesExtras,
    anexos = [],
    aoRemoverAnexo,
    aoAdicionarArquivos,
    rotulo = 'Mensagem',
    rotuloEnviar = 'Enviar mensagem',
    rotuloParar = 'Parar',
    id: idExterno,
    className,
  },
  ref,
) {
  const { id } = useCampoIds(idExterno);
  const campo = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => campo.current as HTMLTextAreaElement);

  const texto = valor.trim();
  const anexoCarregando = anexos.some((a) => a.progresso != null && a.progresso < 100 && !a.erro);
  const anexosOk = anexos.filter((a) => !a.erro).length;
  const podeEnviar =
    !desabilitado && !gerando && !anexoCarregando && (texto !== '' || anexosOk > 0) && (!maxCaracteres || valor.length <= maxCaracteres);
  const [soltando, setSoltando] = useState(false);
  const pct = maxCaracteres ? valor.length / maxCaracteres : 0;

  // altura = conteúdo, até o limite de linhas; daí em diante, rola
  const ajustarAltura = useCallback(() => {
    const el = campo.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const linha = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    const max = linha * linhasMaximas + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [linhasMaximas]);

  useLayoutEffect(ajustarAltura, [valor, ajustarAltura]);

  // largura mudou (janela, painel): as linhas quebram em outro ponto
  useLayoutEffect(() => {
    const el = campo.current;
    if (!el) return;
    let largura = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === largura) return;
      largura = el.clientWidth;
      ajustarAltura();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ajustarAltura]);

  const enviar = () => {
    if (!podeEnviar) return;
    aoEnviar(texto);
  };

  // arrastar arquivos para o campo, ou colar uma imagem
  const temArquivos = (e: DragEvent) => Array.from(e.dataTransfer.types).includes('Files');
  const arrasto = aoAdicionarArquivos
    ? {
        onDragEnter: (e: DragEvent<HTMLDivElement>) => {
          if (!temArquivos(e) || desabilitado) return;
          e.preventDefault();
          setSoltando(true);
        },
        onDragOver: (e: DragEvent<HTMLDivElement>) => {
          if (!temArquivos(e) || desabilitado) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        },
        onDragLeave: (e: DragEvent<HTMLDivElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSoltando(false);
        },
        onDrop: (e: DragEvent<HTMLDivElement>) => {
          setSoltando(false);
          if (!temArquivos(e) || desabilitado) return;
          e.preventDefault();
          const arquivos = Array.from(e.dataTransfer.files);
          if (arquivos.length) aoAdicionarArquivos(arquivos);
        },
      }
    : {};
  const colar = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    if (!aoAdicionarArquivos) return;
    const arquivos = Array.from(e.clipboardData.files);
    if (!arquivos.length) return;
    e.preventDefault();
    aoAdicionarArquivos(arquivos);
  };

  const aoTeclar = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    // Enter que confirma a composição do IME (japonês, chinês…) não envia
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    enviar();
  };

  return (
    <div className={cx('lp-campo-mensagem', desabilitado && 'is-disabled', soltando && 'is-soltando', className)} onClick={() => campo.current?.focus()} {...arrasto}>
      <label className="lp-sr" htmlFor={id}>
        {rotulo}
      </label>
      {anexos.length > 0 && (
        <ul className="lp-campo-mensagem-anexos" aria-label="Anexos" onClick={(e) => e.stopPropagation()}>
          {anexos.map((a) => {
            const carregando = a.progresso != null && a.progresso < 100 && !a.erro;
            return (
              <li key={a.id} className={cx('lp-campo-mensagem-anexo', !!a.erro && 'is-erro', carregando && 'is-carregando')} title={a.erro ?? a.nome}>
                <Icone icone={a.erro ? 'triangle-alert' : iconeArquivo(a.tipo ?? '', a.nome)} className="lp-campo-mensagem-anexo-icone" />
                <span className="lp-campo-mensagem-anexo-tx">
                  <span className="lp-campo-mensagem-anexo-nome">{a.nome}</span>
                  <span className="lp-campo-mensagem-anexo-det">
                    {a.erro ?? (carregando ? `Enviando… ${Math.round(a.progresso!)}%` : a.tamanho != null ? formatBytes(a.tamanho) : '')}
                  </span>
                </span>
                {carregando && (
                  <span className="lp-campo-mensagem-anexo-barra" role="progressbar" aria-label={`Enviando ${a.nome}`} aria-valuenow={Math.round(a.progresso!)} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ width: `${a.progresso}%` }} />
                  </span>
                )}
                {aoRemoverAnexo && (
                  <button type="button" className="lp-campo-mensagem-anexo-remover" aria-label={`Remover ${a.nome}`} title="Remover" onClick={() => aoRemoverAnexo(a.id)}>
                    <Icone icone="x" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {soltando && (
        <div className="lp-campo-mensagem-soltar" aria-hidden="true">
          <Icone icone="upload" /> Solte para anexar
        </div>
      )}
      <textarea
        ref={campo}
        id={id}
        rows={1}
        className="lp-campo-mensagem-texto"
        value={valor}
        placeholder={placeholder}
        maxLength={maxCaracteres}
        disabled={desabilitado}
        autoFocus={autoFocus}
        enterKeyHint="send"
        onChange={(e) => aoMudar(e.target.value)}
        onKeyDown={aoTeclar}
        onPaste={colar}
      />
      <div className="lp-campo-mensagem-barra" onClick={(e) => e.stopPropagation()}>
        {acoesExtras && <div className="lp-campo-mensagem-extras">{acoesExtras}</div>}
        {maxCaracteres && pct >= AVISO_CONTADOR && (
          <span className={cx('lp-campo-mensagem-contador', pct >= 1 ? 'is-err' : pct >= 0.9 && 'is-warn')} aria-hidden="true">
            {valor.length}/{maxCaracteres}
          </span>
        )}
        {gerando ? (
          <Botao
            
            icone="square"
            aria-label={rotuloParar}
            dica={rotuloParar}
            severidade="secundario"
            disabled={!aoParar}
            onClick={aoParar}
          />
        ) : (
          <Botao icone="send" aria-label={rotuloEnviar} dica={rotuloEnviar} disabled={!podeEnviar} onClick={enviar} />
        )}
      </div>
    </div>
  );
});
