import { Icone } from '../../utils/Icone';
import { createContext, useContext, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Campo.css';

/** Props comuns a todo campo de formulário. */
export interface CampoBaseProps {
  rotulo?: string;
  /** Texto de ajuda abaixo do campo. */
  dica?: string;
  /** Mensagem de erro (pinta o campo de vermelho). */
  erro?: string;
  /** Aviso não-bloqueante (âmbar). */
  aviso?: string;
  obrigatorio?: boolean;
  /** `campo` = rótulo em cima · `inline` = pílula com rótulo dentro (barras de filtro). */
  variante?: 'campo' | 'inline';
  className?: string;
}

export interface CampoProps extends CampoBaseProps {
  htmlFor?: string;
  msgId?: string;
  children: ReactNode;
}

/**
 * Contador de "tentativas de salvar" do formulário em volta. O `Form` o
 * incrementa a cada envio; acima de zero, todo campo revela sua pendência
 * mesmo sem ter sido tocado.
 */
export const RevelarCamposCtx = createContext(0);

export const MSG_OBRIGATORIO = 'Campo obrigatório';

interface OpcoesValidacao {
  valor: string;
  /** Regra de formato do campo: mensagem, ou `''` se válido. */
  validar?: (valor: string) => string;
  obrigatorio?: boolean;
  /** Erro vindo do app — sempre vence. */
  erro?: string;
  aviso?: string;
}

/**
 * Regra de exibição de pendência:
 * - o erro só aparece ao SAIR do campo depois de o usuário mexer nele, ou
 *   quando o formulário tenta salvar;
 * - um valor recebido de fora (carga de registro) que não atende ao formato
 *   NÃO é reformatado nem recusado: vira aviso âmbar não bloqueante.
 */
export function useValidacaoCampo({ valor, validar, obrigatorio, erro, aviso }: OpcoesValidacao) {
  const tentativas = useContext(RevelarCamposCtx);
  const [mexido, setMexido] = useState(false);
  const [revelado, setRevelado] = useState(false);

  const vazio = !valor?.trim();
  const formato = !vazio && validar ? validar(valor) : '';
  const visivel = revelado || tentativas > 0;

  let erroFinal = erro;
  let avisoFinal = aviso;
  if (!erroFinal) {
    if (vazio && obrigatorio && visivel) erroFinal = MSG_OBRIGATORIO;
    else if (formato && mexido && visivel) erroFinal = formato;
    else if (formato && !mexido && !avisoFinal) avisoFinal = `${formato}. O valor será mantido como está.`;
  }

  return {
    erro: erroFinal || undefined,
    aviso: avisoFinal || undefined,
    /** Chame no evento de digitação/gesto real do usuário. */
    aoInteragir: () => setMexido(true),
    /** Chame no blur do controle. */
    aoSair: () => mexido && setRevelado(true),
  };
}

/** Ids estáveis do campo e da mensagem associada (aria-describedby). */
export function useCampoIds(idExterno?: string) {
  const gerado = useId();
  const id = idExterno ?? `lp-${gerado.replace(/:/g, '')}`;
  return { id, msgId: `${id}-msg` };
}

export function descricaoDe(p: Pick<CampoBaseProps, 'erro' | 'aviso' | 'dica'>, msgId: string) {
  return p.erro || p.aviso || p.dica ? msgId : undefined;
}

/**
 * Moldura de campo: rótulo, asterisco de obrigatório, erro/aviso/dica.
 * Envolve qualquer controle — os campos da biblioteca já a usam por dentro.
 */
export function Campo({
  rotulo,
  dica,
  erro,
  aviso,
  obrigatorio,
  variante = 'campo',
  className,
  htmlFor,
  msgId,
  children,
}: CampoProps) {
  const inline = variante === 'inline';
  const rotuloRef = useRef<HTMLLabelElement>(null);
  const [rotuloW, setRotuloW] = useState(0);

  // no inline o rótulo é sobreposto: o valor recua a largura medida dele
  useLayoutEffect(() => {
    if (!inline || !rotuloRef.current) return;
    const el = rotuloRef.current;
    const medir = () => setRotuloW(el.offsetWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [inline, rotulo]);

  const estilo = inline ? ({ '--rotulo-w': `${rotuloW}px` } as CSSProperties) : undefined;

  return (
    <div
      className={cx('lp-campo', inline && 'lp-campo--inline', inline && erro && 'is-invalid', className)}
      style={estilo}
      title={inline ? erro || aviso || undefined : undefined}
    >
      {rotulo &&
        (inline ? (
          <label ref={rotuloRef} className="lp-campo-rotulo-inline" htmlFor={htmlFor}>
            {rotulo}
            {obrigatorio && <span className="lp-campo-req" aria-hidden="true">*</span>}:
          </label>
        ) : (
          <label className="lp-campo-rotulo" htmlFor={htmlFor}>
            <span className="lp-campo-rotulo-txt">{rotulo}</span>
            {obrigatorio && <span className="lp-campo-req" aria-hidden="true">*</span>}
          </label>
        ))}

      <div className="lp-campo-ctl">{children}</div>

      {inline ? (
        erro ? (
          <>
            <Icone icone="circle-alert" className="lp-campo-ic-err" />
            <span className="lp-sr" role="alert" id={msgId}>{erro}</span>
          </>
        ) : aviso ? (
          <>
            <Icone icone="triangle-alert" className="lp-campo-ic-aviso" />
            <span className="lp-sr" id={msgId}>{aviso}</span>
          </>
        ) : dica ? (
          <span className="lp-sr" id={msgId}>{dica}</span>
        ) : null
      ) : erro ? (
        <span className="lp-campo-msg lp-campo-msg--err" role="alert" id={msgId}>{erro}</span>
      ) : aviso ? (
        <span className="lp-campo-msg lp-campo-msg--aviso" id={msgId}>
          <Icone icone="triangle-alert" />
          <span>{aviso}</span>
        </span>
      ) : dica ? (
        <span className="lp-campo-msg lp-campo-msg--dica" id={msgId}>{dica}</span>
      ) : null}
    </div>
  );
}
