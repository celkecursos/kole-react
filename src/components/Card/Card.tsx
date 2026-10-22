import { useEffect, useId, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import type { Severidade } from '../../utils/tipos';
import './Card.css';

/** Mesmas cores do `Alerta`/`Badge`. */
export type CorCard = Severidade | 'pri' | 'destaque';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /** Capa que sangra até a borda (imagem, mapa…). */
  midia?: ReactNode;
  /**
   * Onde fica a mídia: `topo` (padrão) · `base` · `esquerda`/`direita`
   * (card horizontal) · `fundo` (texto sobre a imagem, com véu escuro).
   */
  posicaoMidia?: 'topo' | 'base' | 'esquerda' | 'direita' | 'fundo';
  /** Título do cabeçalho (com linha embaixo). */
  titulo?: ReactNode;
  subtitulo?: ReactNode;
  /** Conteúdo à direita do título (botões, badge). */
  ferramentas?: ReactNode;
  /** Botão de recolher/expandir o corpo no cabeçalho. */
  recolhivel?: boolean;
  /** Começa recolhido (com `recolhivel`). */
  recolhidoInicial?: boolean;
  /** Botão de fechar no cabeçalho: o card sai da tela. */
  dispensavel?: boolean;
  aoFechar?: () => void;
  /** Botão que abre o card em tela cheia (Esc volta). */
  telaCheia?: boolean;
  /** Ações flutuantes no canto superior direito (aparecem no hover). */
  acoes?: ReactNode;
  rodape?: ReactNode;
  /** Fundo na cor (texto claro/escuro conforme o contraste). */
  cor?: CorCard;
  /** Borda na cor, fundo normal. */
  borda?: CorCard;
  alinhamento?: 'esquerda' | 'centro' | 'direita';
  /** Corpo sem espaçamento interno (listas, tabelas, imagem inteira). */
  corpoSemEspaco?: boolean;
  /**
   * Painel de leitura que COBRE o card ao passar o mouse ou focar (ex.: algumas
   * linhas de `<Detalhes>`). Enriquecimento rápido, não substitui a ficha.
   */
  detalhes?: ReactNode;
  /** Torna o card inteiro clicável (role=button + Enter/Espaço). */
  aoClicar?: () => void;
  children?: ReactNode;
}

export function Card({
  midia,
  posicaoMidia = 'topo',
  titulo,
  subtitulo,
  ferramentas,
  recolhivel = false,
  recolhidoInicial = false,
  dispensavel = false,
  aoFechar,
  telaCheia = false,
  acoes,
  rodape,
  cor,
  borda,
  alinhamento,
  corpoSemEspaco = false,
  detalhes,
  aoClicar,
  children,
  className,
  ...resto
}: CardProps) {
  const [recolhido, setRecolhido] = useState(recolhidoInicial);
  const [fechado, setFechado] = useState(false);
  const [cheio, setCheio] = useState(false);
  const corpoId = useId();

  // tela cheia: Esc volta e a página atrás não rola
  useEffect(() => {
    if (!cheio) return;
    const h = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setCheio(false);
    document.addEventListener('keydown', h);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', h);
      document.body.style.overflow = antes;
    };
  }, [cheio]);

  if (fechado) return null;

  const interativo = !!aoClicar;
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      aoClicar?.();
    }
  };

  const comFerramentas = recolhivel || dispensavel || telaCheia || !!ferramentas;
  const cabecalho = (titulo || subtitulo || comFerramentas) && (
    <div className="lp-card-cab">
      <div className="lp-card-titulos">
        {titulo && <div className="lp-card-titulo">{titulo}</div>}
        {subtitulo && <div className="lp-card-subtitulo">{subtitulo}</div>}
      </div>
      {comFerramentas && (
        <div className="lp-card-ferramentas" onClick={(e) => e.stopPropagation()}>
          {ferramentas}
          {recolhivel && (
            <button type="button" className="lp-card-ferr" aria-expanded={!recolhido} aria-controls={corpoId} aria-label={recolhido ? 'Expandir' : 'Recolher'} title={recolhido ? 'Expandir' : 'Recolher'} onClick={() => setRecolhido((x) => !x)}>
              <Icone icone={recolhido ? 'chevron-down' : 'chevron-up'} />
            </button>
          )}
          {telaCheia && (
            <button type="button" className="lp-card-ferr" aria-pressed={cheio} aria-label={cheio ? 'Sair da tela cheia' : 'Tela cheia'} title={cheio ? 'Sair da tela cheia' : 'Tela cheia'} onClick={() => setCheio((x) => !x)}>
              <Icone icone={cheio ? 'minimize' : 'maximize'} />
            </button>
          )}
          {dispensavel && (
            <button
              type="button"
              className="lp-card-ferr"
              aria-label="Fechar"
              title="Fechar"
              onClick={() => {
                aoFechar?.();
                setFechado(true);
              }}
            >
              <Icone icone="x" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  const fundo = posicaoMidia === 'fundo';
  const horizontal = posicaoMidia === 'esquerda' || posicaoMidia === 'direita';
  const conteudo = (
    <>
      {cabecalho}
      <div id={corpoId} className={cx('lp-card-corpo', corpoSemEspaco && 'lp-card-corpo--sem-espaco')} hidden={recolhido}>
        {children}
      </div>
      {rodape && !recolhido && <div className="lp-card-rodape">{rodape}</div>}
    </>
  );

  return (
    <div
      className={cx(
        'lp-card',
        interativo && 'lp-card--interativo',
        !!midia && `lp-card--midia-${posicaoMidia}`,
        cor && 'lp-card--cor',
        borda && 'lp-card--borda',
        alinhamento && alinhamento !== 'esquerda' && `lp-card--${alinhamento}`,
        cheio && 'lp-card--cheio',
        className,
      )}
      data-cor={cor ?? borda}
      role={interativo ? 'button' : undefined}
      tabIndex={interativo ? 0 : undefined}
      onClick={aoClicar}
      onKeyDown={interativo ? aoTeclar : undefined}
      {...resto}
    >
      {acoes && (
        <div className="lp-card-acoes" onClick={(e) => e.stopPropagation()}>
          {acoes}
        </div>
      )}
      {midia && posicaoMidia !== 'base' && posicaoMidia !== 'direita' && <div className="lp-card-midia">{midia}</div>}
      {horizontal || fundo ? <div className="lp-card-conteudo">{conteudo}</div> : conteudo}
      {midia && (posicaoMidia === 'base' || posicaoMidia === 'direita') && <div className="lp-card-midia">{midia}</div>}
      {detalhes && (
        <div className="lp-card-detalhes" tabIndex={0} role="group" aria-label="Detalhes">
          {detalhes}
        </div>
      )}
    </div>
  );
}

/** Cards colados lado a lado, com a mesma altura (vira coluna em tela estreita). */
export function GrupoCards({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('lp-grupo-cards', className)}>{children}</div>;
}
