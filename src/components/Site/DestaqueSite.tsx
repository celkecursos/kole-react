import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './DestaqueSite.css';

export interface DestaqueSiteProps {
  /** Título principal (vira o `<h1>` da página). */
  titulo: string;
  /** Trecho do título pintado em laranja (ex.: "melhor preço"). */
  realce?: string;
  /** Acima de tudo (ex.: uma `Trilha` nas páginas internas). */
  topo?: ReactNode;
  /** Selo acima do título (ex.: "Atualizado hoje"). */
  selo?: ReactNode;
  /** Texto curto acima do título, em maiúsculas (alternativa ao selo). */
  sobretitulo?: string;
  descricao?: ReactNode;
  /** Abaixo do texto: normalmente um `CampoPesquisa aparencia="destaque"` ou botões. */
  children?: ReactNode;
  /** `escuro` (padrão) = faixa marinha com coluna à direita · `claro` = fundo claro, texto centralizado e `midia` embaixo. */
  aparencia?: 'escuro' | 'claro';
  /** Coluna da direita, no `escuro` (ex.: imagem do produto). */
  lateral?: ReactNode;
  /** Imagem larga abaixo do texto, no `claro` (cantos de cima arredondados, encostada na borda de baixo). */
  midia?: ReactNode;
  /** Nível do título. Padrão: `1`. */
  nivel?: 1 | 2;
  className?: string;
}

function comRealce(titulo: string, realce?: string): ReactNode {
  const i = realce ? titulo.indexOf(realce) : -1;
  if (!realce || i < 0) return titulo;
  return (
    <>
      {titulo.slice(0, i)}
      <span className="lp-destaque-realce">{realce}</span>
      {titulo.slice(i + realce.length)}
    </>
  );
}

/** Faixa marinha de abertura (hero): selo, título com realce, texto, busca e uma coluna livre. */
export function DestaqueSite({ topo, titulo, realce, selo, sobretitulo, descricao, children, aparencia = 'escuro', lateral, midia, nivel = 1, className }: DestaqueSiteProps) {
  const Titulo = nivel === 1 ? 'h1' : 'h2';
  const claro = aparencia === 'claro';
  return (
    <section className={cx('lp-destaque', claro && 'lp-destaque--claro', className)}>
      <div className="lp-destaque-brilho" aria-hidden="true" />
      <div className={cx('lp-destaque-in', !claro && !!lateral && 'lp-destaque-in--lateral')}>
        <div className="lp-destaque-texto">
          {topo}
          {selo && (
            <div className="lp-destaque-selo">
              <span className="lp-destaque-selo-ponto" aria-hidden="true" />
              {selo}
            </div>
          )}
          {sobretitulo && <div className="lp-destaque-sobre">{sobretitulo}</div>}
          <Titulo className="lp-destaque-titulo">{comRealce(titulo, realce)}</Titulo>
          {descricao && <p className="lp-destaque-desc">{descricao}</p>}
          {children}
        </div>
        {!claro && lateral && <div className="lp-destaque-lateral">{lateral}</div>}
      </div>
      {claro && midia && <div className="lp-destaque-midia">{midia}</div>}
    </section>
  );
}
