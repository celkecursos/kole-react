import { createContext, forwardRef, useContext, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Dica } from '../Dica/Dica';
import './Botao.css';

export type SeveridadeBotao = 'pri' | 'secundario' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'escuro';
/**
 * `solido` · `contorno` · `texto` · `suave` = fundo claro da cor · `gradiente`
 * · `fantasma` = contorno discreto que se preenche no hover.
 */
export type AparenciaBotao = 'solido' | 'contorno' | 'texto' | 'suave' | 'gradiente' | 'fantasma';

/** Padrões que um grupo (`GrupoBotoes`) repassa aos botões de dentro. */
export interface PadroesBotao {
  severidade?: SeveridadeBotao;
  aparencia?: AparenciaBotao;
  formato?: 'pilula' | 'retangulo';
  tamanho?: 'pequeno' | 'medio' | 'grande';
}
export const PadroesBotaoCtx = createContext<PadroesBotao>({});

export interface BotaoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  rotulo?: string;
  icone?: IconeProp;
  posicaoIcone?: 'esquerda' | 'direita';
  severidade?: SeveridadeBotao;
  aparencia?: AparenciaBotao;
  /** Mostra spinner e recusa o clique (o botão segue focável). */
  carregando?: boolean;
  /** Ocupa 100% da largura. */
  bloco?: boolean;
  /** `pilula` (padrão) · `retangulo` = cantos levemente arredondados. */
  formato?: 'pilula' | 'retangulo';
  tamanho?: 'pequeno' | 'medio' | 'grande';
  /** Sombra fixa, ou `elevado` (sombra da cor que sobe no hover). */
  sombra?: 'pequena' | 'media' | 'grande' | 'elevado';
  /** Ícone num segmento mais escuro, colado à borda ("botão com rótulo"). */
  iconeDestacado?: boolean;
  /** Botão de alternância: liga/desliga (vira `aria-pressed`). */
  pressionado?: boolean;
  /** Balão de dica — use em botões só com ícone. */
  dica?: string;
  children?: ReactNode;
}

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(function Botao(
  {
    rotulo,
    icone,
    posicaoIcone = 'esquerda',
    severidade: severidadeProp,
    aparencia: aparenciaProp,
    carregando = false,
    bloco = false,
    formato: formatoProp,
    tamanho: tamanhoProp,
    sombra,
    iconeDestacado = false,
    pressionado,
    dica,
    children,
    className,
    type = 'button',
    onClick,
    ...resto
  },
  ref,
) {
  const padroes = useContext(PadroesBotaoCtx);
  const severidade = severidadeProp ?? padroes.severidade ?? 'pri';
  const aparencia = aparenciaProp ?? padroes.aparencia ?? 'solido';
  const formato = formatoProp ?? padroes.formato ?? 'pilula';
  const tamanho = tamanhoProp ?? padroes.tamanho ?? 'medio';
  const texto = children ?? rotulo;
  const soIcone = !texto && !!icone;

  const aoClicar = (e: MouseEvent<HTMLButtonElement>) => {
    if (carregando) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const botao = (
    <button
      ref={ref}
      type={type}
      className={cx(
        'lp-btn',
        `lp-btn--${aparencia}`,
        severidade !== 'pri' && `lp-btn--${severidade}`,
        soIcone && 'lp-btn--icone',
        posicaoIcone === 'direita' && 'lp-btn--icone-dir',
        bloco && 'lp-btn--bloco',
        formato === 'retangulo' && 'lp-btn--retangulo',
        tamanho !== 'medio' && `lp-btn--${tamanho}`,
        sombra && `lp-btn--sombra-${sombra}`,
        iconeDestacado && !soIcone && 'lp-btn--icone-destacado',
        pressionado && 'is-pressionado',
        className,
      )}
      aria-pressed={pressionado}
      aria-disabled={carregando || undefined}
      aria-busy={carregando || undefined}
      onClick={aoClicar}
      {...resto}
    >
      {iconeDestacado && !soIcone && (icone || carregando) ? (
        <span className="lp-btn-segmento">{carregando ? <Icone icone="loader-circle" girar /> : <Icone icone={icone} />}</span>
      ) : carregando ? (
        <Icone icone="loader-circle" girar />
      ) : (
        <Icone icone={icone} />
      )}
      {texto && <span className="lp-btn-rotulo">{texto}</span>}
    </button>
  );

  return dica ? <Dica texto={dica}>{botao}</Dica> : botao;
});
