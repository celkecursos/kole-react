import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { portal } from '../../utils/portal';
import { Avatar } from '../Avatar/Avatar';
import { Botao } from '../Botao/Botao';
import './ChatFlutuante.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { pluralizar } from '../../i18n/idiomas';

export interface ChatFlutuanteProps {
  /** Normalmente uma `Conversa` (com o `CampoMensagem` no `campo`). Ocupa a altura do painel. */
  children: ReactNode;
  /** Título do painel. Padrão: "Fale com a gente". */
  titulo?: string;
  /** Abaixo do título (ex.: "Respondemos em poucos minutos"). */
  subtitulo?: ReactNode;
  /** Foto (URL) ou nó (ícone, `Avatar`) ao lado do título. Padrão: o ícone do botão. */
  avatar?: ReactNode;
  /** Texto do botão. No celular, só o ícone aparece. Padrão: o `titulo`. */
  rotuloBotao?: string;
  icone?: IconeProp;
  /** Bolinha com a contagem sobre o botão (mensagens não lidas). */
  naoLidas?: number;
  /** Controlado: o app abre e fecha. */
  aberto?: boolean;
  aoMudarAberto?: (aberto: boolean) => void;
  abertoInicial?: boolean;
  /** Canto da tela. Padrão: `direita`. */
  lado?: 'direita' | 'esquerda';
  /** Ações no topo do painel, antes do fechar (ex.: "Nova conversa"). */
  acoes?: ReactNode;
  className?: string;
}

/**
 * Chat de atendimento para site: botão fixo no canto que abre um painel com a conversa.
 * Esc fecha e o foco volta ao botão; no celular o painel ocupa a tela.
 */
export function ChatFlutuante({
  children,
  titulo: tituloProp,
  subtitulo,
  avatar,
  rotuloBotao,
  icone = 'message-circle',
  naoLidas,
  aberto: abertoProp,
  aoMudarAberto,
  abertoInicial = false,
  lado = 'direita',
  acoes,
  className,
}: ChatFlutuanteProps) {
  const txt = useTextos();
  const idioma = useIdioma();
  const titulo = tituloProp ?? txt.chat.titulo;
  const [abertoInterno, setAbertoInterno] = useState(abertoInicial);
  const aberto = abertoProp ?? abertoInterno;
  const mudar = (v: boolean) => {
    if (abertoProp === undefined) setAbertoInterno(v);
    aoMudarAberto?.(v);
  };
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const primeiraVez = useRef(true);
  const idTitulo = useId();

  // ao abrir, o foco vai para o campo de texto; ao fechar, volta ao botão
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      if (!aberto) return;
    }
    if (aberto) {
      const t = window.setTimeout(() => (painel.current?.querySelector<HTMLElement>('textarea, input') ?? painel.current)?.focus(), 30);
      return () => window.clearTimeout(t);
    }
    botao.current?.focus();
  }, [aberto]);

  const teclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    e.preventDefault();
    mudar(false);
  };

  const rotulo = rotuloBotao ?? titulo;
  const avatarNo =
    typeof avatar === 'string' ? (
      <Avatar nome={titulo} foto={avatar} tamanho="2.25rem" />
    ) : (
      (avatar ?? (
        <span className="lp-chatf-avatar" aria-hidden="true">
          <Icone icone={icone} />
        </span>
      ))
    );

  return portal(
    <div className={cx('lp-chatf', `lp-chatf--${lado}`, aberto && 'is-aberto', className)}>
      {aberto && (
        <div ref={painel} className="lp-chatf-painel" role="dialog" aria-labelledby={idTitulo} tabIndex={-1} onKeyDown={teclar}>
          <div className="lp-chatf-topo">
            {avatarNo}
            <div className="lp-chatf-topo-tx">
              <span id={idTitulo} className="lp-chatf-titulo">
                {titulo}
              </span>
              {subtitulo && <span className="lp-chatf-subtitulo">{subtitulo}</span>}
            </div>
            {acoes}
            <Botao icone="x" aria-label={txt.chat.fechar} dica={txt.comum.fechar} severidade="secundario" aparencia="texto" tamanho="pequeno" onClick={() => mudar(false)} />
          </div>
          <div className="lp-chatf-corpo">{children}</div>
        </div>
      )}
      <button
        ref={botao}
        type="button"
        className={cx('lp-chatf-botao', aberto && 'is-aberto')}
        aria-expanded={aberto}
        aria-label={aberto ? txt.chat.fechar : `${rotulo}${naoLidas ? `, ${pluralizar(idioma, naoLidas, txt.chat.novas)}` : ''}`}
        onClick={() => mudar(!aberto)}
      >
        <Icone icone={aberto ? 'x' : icone} className="lp-chatf-botao-icone" />
        {!aberto && <span className="lp-chatf-botao-tx">{rotulo}</span>}
        {!aberto && !!naoLidas && (
          <span className="lp-chatf-badge" aria-hidden="true">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>
    </div>,
  );
}
