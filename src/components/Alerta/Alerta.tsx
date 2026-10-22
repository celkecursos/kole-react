import { useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import type { Severidade } from '../../utils/tipos';
import './Alerta.css';

/** Cores do alerta: as severidades + `pri` (azul de ação) e `destaque` (laranja da marca). */
export type CorAlerta = Severidade | 'pri' | 'destaque';

export type AparenciaAlerta = 'suave' | 'solido' | 'contorno' | 'destaque' | 'faixa' | 'cartao';

const ICONES: Record<CorAlerta, string> = {
  pri: 'info',
  destaque: 'circle-alert',
  ok: 'circle-check',
  info: 'info',
  warn: 'triangle-alert',
  err: 'circle-x',
  neutral: 'info',
};

export interface AlertaProps {
  severidade?: CorAlerta;
  /**
   * `suave` (padrão) = fundo claro · `solido` = fundo cheio · `contorno` =
   * só a borda · `destaque` = fundo neutro com filete lateral colorido ·
   * `faixa` = título numa faixa sólida sobre o texto · `cartao` = bloco
   * centralizado com ícone grande (avisos de página, confirmações).
   */
  aparencia?: AparenciaAlerta;
  /** `pilula` = cantos totalmente arredondados. */
  formato?: 'padrao' | 'pilula';
  sombra?: 'pequena' | 'media' | 'grande';
  /** Linha em negrito acima da mensagem. */
  titulo?: ReactNode;
  mensagem?: ReactNode;
  children?: ReactNode;
  /** Ícone da severidade por padrão; outro ícone, ou `false` para nenhum. */
  icone?: IconeProp | false;
  /** Imagem/avatar no lugar do ícone. */
  midia?: ReactNode;
  /** Botões ou links. */
  acoes?: ReactNode;
  /** `lado` = à direita da mensagem (padrão) · `abaixo` = sob o texto. */
  posicaoAcoes?: 'lado' | 'abaixo';
  /** Mostra o "×" e some ao clicar (sem controle externo). */
  dispensavel?: boolean;
  /** Mostra o "×" e avisa o app (que decide se o alerta sai da tela). */
  aoFechar?: () => void;
  /** `circulo` = "×" num círculo sólido da cor do alerta. */
  botaoFechar?: 'simples' | 'circulo';
  className?: string;
}

export function Alerta({
  severidade = 'info',
  aparencia = 'suave',
  formato = 'padrao',
  sombra,
  titulo,
  mensagem,
  children,
  icone,
  midia,
  acoes,
  posicaoAcoes,
  dispensavel = false,
  aoFechar,
  botaoFechar = 'simples',
  className,
}: AlertaProps) {
  const [fechado, setFechado] = useState(false);
  if (fechado) return null;

  const cartao = aparencia === 'cartao';
  const faixa = aparencia === 'faixa';
  const comFechar = dispensavel || !!aoFechar;
  const iconeFinal = icone === false ? null : (icone ?? ICONES[severidade]);
  const acoesAbaixo = (posicaoAcoes ?? (cartao || titulo ? 'abaixo' : 'lado')) === 'abaixo';

  const fechar = () => {
    aoFechar?.();
    if (dispensavel) setFechado(true);
  };
  const botaoX = comFechar && (
    <button type="button" className={cx('lp-alerta-fechar', botaoFechar === 'circulo' && 'lp-alerta-fechar--circulo')} aria-label="Fechar alerta" onClick={fechar}>
      <Icone icone="x" />
    </button>
  );

  const texto = (mensagem || children) && (
    <span className="lp-alerta-txt">
      {mensagem}
      {children}
    </span>
  );
  const blocoAcoes = acoes && <span className={cx('lp-alerta-acoes', acoesAbaixo && 'lp-alerta-acoes--abaixo')}>{acoes}</span>;

  const classes = cx(
    'lp-alerta',
    `lp-alerta--${aparencia}`,
    formato === 'pilula' && 'lp-alerta--pilula',
    sombra && `lp-alerta--sombra-${sombra}`,
    !!titulo && 'tem-titulo',
    comFechar && 'tem-fechar',
    className,
  );
  const papel = severidade === 'err' ? 'alert' : 'status';

  if (faixa) {
    return (
      <div className={classes} data-cor={severidade} role={papel}>
        <div className="lp-alerta-faixa">
          {iconeFinal && <Icone icone={iconeFinal} className="lp-alerta-ic" />}
          <span className="lp-alerta-tit">{titulo}</span>
          {botaoX}
        </div>
        <div className="lp-alerta-corpo">
          {texto}
          {blocoAcoes}
        </div>
      </div>
    );
  }

  return (
    <div className={classes} data-cor={severidade} role={papel}>
      <span className="lp-alerta-msg">
        {midia ? <span className="lp-alerta-midia">{midia}</span> : iconeFinal && <Icone icone={iconeFinal} className="lp-alerta-ic" />}
        <span className="lp-alerta-conteudo">
          {titulo && <span className="lp-alerta-tit">{titulo}</span>}
          {texto}
          {acoesAbaixo && blocoAcoes}
        </span>
      </span>
      {!acoesAbaixo && blocoAcoes}
      {botaoX}
    </div>
  );
}
