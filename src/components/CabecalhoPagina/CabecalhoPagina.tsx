import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Trilha, type ItemTrilha } from '../Trilha/Trilha';
import './CabecalhoPagina.css';

export interface CabecalhoPaginaProps {
  titulo: string;
  icone?: IconeProp;
  /** Linha pequena em caixa alta acima do título. */
  categoria?: string;
  /**
   * Trilha de navegação logo abaixo do título. `true` = caminho automático do
   * menu (via `Estrutura`); lista = automático + estes passos no fim (ex.: o
   * registro aberto).
   */
  trilha?: boolean | ItemTrilha[];
  /** Botões à direita do título. */
  acoes?: ReactNode;
  /** Texto descritivo abaixo. */
  children?: ReactNode;
  className?: string;
}

export function CabecalhoPagina({ titulo, icone, categoria, trilha, acoes, children, className }: CabecalhoPaginaProps) {
  return (
    <header className={cx('lp-cab', className)}>
      <div className="lp-cab-topo">
        {icone && (
          <span className="lp-cab-tile">
            <Icone icone={icone} />
          </span>
        )}
        <div className="lp-cab-titulos">
          {categoria && <p className="lp-cab-categoria">{categoria}</p>}
          <h1 className="lp-cab-titulo">{titulo}</h1>
          {trilha && <Trilha extras={Array.isArray(trilha) ? trilha : undefined} className="lp-cab-trilha" />}
        </div>
        {acoes && <div className="lp-cab-acoes">{acoes}</div>}
      </div>
      {children && <div className="lp-cab-descricao">{children}</div>}
    </header>
  );
}
