import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { useCampoIds } from '../Campo/Campo';
import './CampoMensagem.css';

export interface CampoMensagemProps {
  valor: string;
  aoMudar: (valor: string) => void;
  /** Recebe o texto sem espaços nas pontas; nunca é chamado com texto vazio. */
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
  const podeEnviar = !desabilitado && !gerando && texto !== '' && (!maxCaracteres || valor.length <= maxCaracteres);
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

  const aoTeclar = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    // Enter que confirma a composição do IME (japonês, chinês…) não envia
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    enviar();
  };

  return (
    <div className={cx('lp-campo-mensagem', desabilitado && 'is-disabled', className)} onClick={() => campo.current?.focus()}>
      <label className="lp-sr" htmlFor={id}>
        {rotulo}
      </label>
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
