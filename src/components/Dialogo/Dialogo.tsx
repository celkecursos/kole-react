import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Sobreposicao } from './Sobreposicao';
import './Dialogo.css';

export type TamanhoDialogo = 'pequeno' | 'medio' | 'grande' | 'extragrande' | 'full';

/** Efeito de entrada do diálogo central. */
export type AnimacaoDialogo =
  | 'padrao'
  | 'escala'
  | 'deslizar-direita'
  | 'deslizar-baixo'
  | 'jornal'
  | 'queda'
  | 'girar-horizontal'
  | 'girar-vertical'
  | 'super-escala'
  | 'placa'
  | 'girar-baixo'
  | 'girar-esquerda';

export interface DialogoProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  subtitulo?: string;
  icone?: IconeProp;
  tamanho?: TamanhoDialogo;
  /** Tela cheia só abaixo desta largura (`sm` 36rem · `md` 48rem · `lg` 64rem · `xl` 75rem · `xxl` 87.5rem). */
  telaCheiaAbaixo?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * `central` (padrão) · `lateral` = painel encostado à direita, altura
   * total (gaveta). No lateral, `full` cai para `grande`.
   */
  aparencia?: 'central' | 'lateral';
  /** Onde o diálogo central fica: `centro` (padrão) ou `topo`. */
  posicao?: 'centro' | 'topo';
  /**
   * Conteúdo longo: `corpo` (padrão) rola só o miolo, com cabeçalho e rodapé
   * fixos · `pagina` deixa o diálogo crescer e rola a máscara inteira.
   */
  rolagem?: 'corpo' | 'pagina';
  animacao?: AnimacaoDialogo;
  /** `escuro` = cabeçalho na cor da marca. */
  tom?: 'claro' | 'escuro';
  /** Esc / clique fora fecham (padrão: sim). */
  dispensavel?: boolean;
  /** Botões do rodapé. */
  rodape?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Dialogo({
  aberto,
  aoFechar,
  titulo,
  subtitulo,
  icone,
  tamanho = 'medio',
  telaCheiaAbaixo,
  aparencia = 'central',
  posicao = 'centro',
  rolagem = 'corpo',
  animacao = 'padrao',
  tom = 'claro',
  dispensavel = true,
  rodape,
  children,
  className,
}: DialogoProps) {
  const tituloId = useId();
  if (!aberto) return null;
  const lateral = aparencia === 'lateral';
  return (
    <Sobreposicao
      aoDispensar={aoFechar}
      dispensavel={dispensavel}
      rotuloId={tituloId}
      classeMascara={cx(
        lateral && 'lp-sobre--lateral',
        !lateral && posicao === 'topo' && 'lp-sobre--topo',
        !lateral && rolagem === 'pagina' && 'lp-sobre--rolar',
        telaCheiaAbaixo && `lp-sobre--cheia-${telaCheiaAbaixo}`,
      )}
      className={cx(
        'lp-dlg',
        `lp-dlg--${lateral && tamanho === 'full' ? 'grande' : tamanho}`,
        lateral && 'lp-dlg--lateral',
        !lateral && rolagem === 'pagina' && 'lp-dlg--rolar-pagina',
        !lateral && animacao !== 'padrao' && `lp-dlg--anim-${animacao}`,
        telaCheiaAbaixo && `lp-dlg--cheia-${telaCheiaAbaixo}`,
        tom === 'escuro' && 'lp-dlg--escuro',
        className,
      )}
    >
      <div className="lp-dlg-cab">
        {icone && (
          <span className="lp-dlg-ic">
            <Icone icone={icone} />
          </span>
        )}
        <div className="lp-dlg-titulos">
          <span className="lp-dlg-titulo" id={tituloId}>
            {titulo}
          </span>
          {subtitulo && <span className="lp-dlg-sub">{subtitulo}</span>}
        </div>
        <button type="button" className="lp-dlg-fechar" aria-label="Fechar" title="Fechar" onClick={aoFechar}>
          <Icone icone="x" />
        </button>
      </div>
      <div className="lp-dlg-corpo">{children}</div>
      {rodape && <div className="lp-dlg-rodape">{rodape}</div>}
    </Sobreposicao>
  );
}
