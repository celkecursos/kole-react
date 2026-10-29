import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { formatDataHoraBr, formatHoraBr } from '../../utils/datas';
import { Icone } from '../../utils/Icone';
import { Avatar } from '../Avatar/Avatar';
import { Botao } from '../Botao/Botao';
import { useToastOpcional } from '../Toast/Toast';
import './Mensagem.css';

/** `usuario` = à direita, em destaque · `assistente` = à esquerda, neutra · `sistema` = aviso centralizado. */
export type AutorMensagem = 'usuario' | 'assistente' | 'sistema';
/**
 * `enviando` = ainda não confirmada · `gerando` = a resposta está chegando
 * (sem conteúdo, mostra os três pontos) · `concluida` · `erro`.
 */
export type EstadoMensagem = 'enviando' | 'gerando' | 'concluida' | 'erro';

export interface MensagemProps {
  autor?: AutorMensagem;
  /** O conteúdo. Texto puro preserva as quebras de linha; Markdown chega já renderizado pelo app. */
  children?: ReactNode;
  /** Nome de quem escreveu, acima da bolha. */
  nome?: string;
  /** `true` = iniciais do `nome` · texto = URL da foto · ou um nó próprio (`<Avatar>`, ícone). */
  avatar?: ReactNode;
  /** Quando foi enviada. `Date` vira `HH:mm` (hoje) ou `dd/mm/aaaa HH:mm`; texto aparece como veio. */
  hora?: Date | string;
  estado?: EstadoMensagem;
  /** Texto do erro, com `estado="erro"`. */
  erro?: ReactNode;
  /** Mostra "Tentar novamente" no erro. */
  aoTentarNovamente?: () => void;
  /** Botão que copia o texto da mensagem. */
  copiavel?: boolean;
  /** O que copiar, quando o conteúdo não é texto puro. Padrão: o texto visível. */
  textoCopia?: string;
  /** Outras ações abaixo da bolha (botões pequenos). */
  acoes?: ReactNode;
  /** Abaixo do conteúdo, dentro da bolha (ex.: `Referencias`). */
  rodape?: ReactNode;
  rotuloTentarNovamente?: string;
  rotuloCopiar?: string;
  /** Lido pelo leitor de tela no lugar dos três pontos. */
  rotuloGerando?: string;
  rotuloEnviando?: string;
  className?: string;
}

function formatarHora(d: Date) {
  return d.toDateString() === new Date().toDateString() ? formatHoraBr(d) : formatDataHoraBr(d);
}

/** Uma mensagem da `Conversa`: bolha com autor, hora, estado e ações. */
export function Mensagem({
  autor = 'assistente',
  children,
  nome,
  avatar,
  hora,
  estado = 'concluida',
  erro,
  aoTentarNovamente,
  copiavel = false,
  textoCopia,
  acoes,
  rodape,
  rotuloTentarNovamente = 'Tentar novamente',
  rotuloCopiar = 'Copiar mensagem',
  rotuloGerando = 'Gerando resposta',
  rotuloEnviando = 'Enviando',
  className,
}: MensagemProps) {
  const toast = useToastOpcional();
  const conteudo = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [copiado, setCopiado] = useState(false);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const vazio = children === undefined || children === null || children === false || children === '';
  const texto = typeof children === 'string';
  const gerando = estado === 'gerando';
  const comErro = estado === 'erro';

  const copiar = async () => {
    const valor = textoCopia ?? (texto ? children : (conteudo.current?.innerText ?? ''));
    try {
      await navigator.clipboard.writeText(valor);
      toast?.ok('Mensagem copiada');
      setCopiado(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast?.err('Não foi possível copiar', 'O navegador bloqueou o acesso à área de transferência.');
    }
  };

  if (autor === 'sistema') {
    return (
      <div className={cx('lp-mensagem', 'lp-mensagem--sistema', className)}>
        <div className="lp-mensagem-conteudo" ref={conteudo}>
          {children}
        </div>
      </div>
    );
  }

  const blocoAvatar =
    avatar === true ? (
      <Avatar nome={nome} tom={autor === 'usuario' ? 'escuro' : 'claro'} />
    ) : typeof avatar === 'string' ? (
      <Avatar foto={avatar} nome={nome} />
    ) : (
      avatar
    );
  const comAcoes = (copiavel && !vazio && !gerando) || !!acoes;
  const dataHora = hora instanceof Date ? hora.toISOString() : undefined;

  return (
    <div
      className={cx('lp-mensagem', `lp-mensagem--${autor}`, `is-${estado}`, className)}
      // a resposta ainda está mudando: o leitor de tela espera ela terminar
      aria-busy={gerando || undefined}
    >
      {blocoAvatar && <div className="lp-mensagem-avatar">{blocoAvatar}</div>}
      <div className="lp-mensagem-coluna">
        {(nome || hora) && (
          <div className="lp-mensagem-meta">
            {nome && <span className="lp-mensagem-nome">{nome}</span>}
            {hora && <time dateTime={dataHora}>{hora instanceof Date ? formatarHora(hora) : hora}</time>}
          </div>
        )}
        {/* erro antes de qualquer conteúdo: só a faixa de erro, sem bolha vazia */}
        {(!vazio || gerando || rodape) && (
          <div className="lp-mensagem-bolha">
            {gerando && vazio ? (
              <span className="lp-mensagem-digitando">
                <span className="lp-sr">{rotuloGerando}</span>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </span>
            ) : (
              <div className={cx('lp-mensagem-conteudo', texto && 'lp-mensagem-conteudo--texto')} ref={conteudo}>
                {children}
                {gerando && <span className="lp-mensagem-cursor" aria-hidden="true" />}
              </div>
            )}
            {rodape && <div className="lp-mensagem-rodape">{rodape}</div>}
          </div>
        )}
        {estado === 'enviando' && <div className="lp-mensagem-situacao">{rotuloEnviando}…</div>}
        {comErro && (
          <div className="lp-mensagem-erro" role="alert">
            <Icone icone="circle-alert" className="lp-mensagem-erro-ic" />
            <span className="lp-mensagem-erro-txt">{erro ?? 'Não foi possível concluir esta mensagem.'}</span>
            {aoTentarNovamente && (
              <Botao rotulo={rotuloTentarNovamente} icone="refresh-cw" severidade="err" aparencia="texto" tamanho="pequeno" onClick={aoTentarNovamente} />
            )}
          </div>
        )}
        {comAcoes && (
          <div className="lp-mensagem-acoes">
            {copiavel && !vazio && !gerando && (
              <Botao
                icone={copiado ? 'check' : 'copy'}
                aria-label={rotuloCopiar}
                dica={rotuloCopiar}
                severidade="secundario"
                aparencia="texto"
                tamanho="pequeno"
                onClick={copiar}
              />
            )}
            {acoes}
          </div>
        )}
      </div>
    </div>
  );
}
