import { Children, isValidElement, useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { Vazio } from '../Vazio/Vazio';
import './Conversa.css';

export interface ConversaProps {
  /** As mensagens (`Mensagem`), da mais antiga para a mais nova. */
  children?: ReactNode;
  /** Mostrado quando não há mensagens. Padrão: um `Vazio`. */
  vazio?: ReactNode;
  /** Campo de envio fixo abaixo da rolagem (normalmente um `CampoMensagem`). */
  campo?: ReactNode;
  /** Largura máxima das mensagens e do campo, centralizados (ex.: `48rem` numa página inteira). */
  larguraMaxima?: string;
  /** Nome da conversa para leitores de tela. */
  rotulo?: string;
  rotuloIrParaFim?: string;
  className?: string;
}

/** distância do fim (px) que ainda conta como "no fim" */
const LIMIAR = 24;

/**
 * Área rolável de uma conversa. Acompanha o fim quando chegam mensagens ou a
 * última cresce (streaming); se a pessoa rolar para cima, para de puxar e
 * mostra "Ir para o fim". Ocupa a altura do contêiner pai.
 */
export function Conversa({
  children,
  vazio,
  campo,
  larguraMaxima,
  rotulo = 'Conversa',
  rotuloIrParaFim = 'Ir para o fim',
  className,
}: ConversaProps) {
  const rolagem = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  // ref para a lógica (o ResizeObserver não vê estado novo); estado para o botão
  const noFim = useRef(true);
  const [longe, setLonge] = useState(false);
  const filhos = Children.toArray(children);
  const semMensagens = filhos.length === 0;
  const quantas = useRef(filhos.length);
  // a mensagem que a própria pessoa acabou de enviar sempre leva ao fim
  const novaDoUsuario =
    filhos.length > quantas.current &&
    filhos.slice(quantas.current).some((f) => isValidElement<{ autor?: string }>(f) && f.props.autor === 'usuario');

  const irParaFim = useCallback(() => {
    const el = rolagem.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    noFim.current = true;
    setLonge(false);
  }, []);

  // conteúdo ou caixa mudou de tamanho: se estava no fim, continua no fim
  useLayoutEffect(() => {
    const el = rolagem.current;
    const ls = lista.current;
    if (!el || !ls) return;
    irParaFim();
    const ro = new ResizeObserver(() => {
      if (noFim.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(el);
    ro.observe(ls);
    return () => ro.disconnect();
  }, [irParaFim, semMensagens]);

  useLayoutEffect(() => {
    quantas.current = filhos.length;
    if (novaDoUsuario) irParaFim();
  });

  const aoRolar = () => {
    const el = rolagem.current;
    if (!el) return;
    const fim = el.scrollHeight - el.scrollTop - el.clientHeight <= LIMIAR;
    noFim.current = fim;
    setLonge(!fim);
  };

  const estilo = larguraMaxima ? ({ '--conversa-largura': larguraMaxima } as CSSProperties) : undefined;

  return (
    <div className={cx('lp-conversa', className)} style={estilo}>
      <div className="lp-conversa-area">
        <div ref={rolagem} className="lp-conversa-rolagem" tabIndex={0} aria-label={rotulo} onScroll={aoRolar}>
          <div ref={lista} className="lp-conversa-lista" role="log" aria-live="polite">
            {semMensagens ? (
              <div className="lp-conversa-vazio">
                {vazio ?? <Vazio titulo="Nenhuma mensagem ainda" descricao="Envie uma mensagem para começar a conversa." icone="message-square" />}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
        {longe && !semMensagens && (
          <Botao
            className="lp-conversa-fim"
            rotulo={rotuloIrParaFim}
            icone="arrow-down"
            severidade="secundario"
            tamanho="pequeno"
            sombra="media"
            onClick={irParaFim}
          />
        )}
      </div>
      {campo && <div className="lp-conversa-campo">{campo}</div>}
    </div>
  );
}
