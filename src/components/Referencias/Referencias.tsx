import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { Recolhivel } from '../Recolhivel/Recolhivel';
import './Referencias.css';

export interface ItemReferencia {
  id: string;
  /** Nome da fonte (documento, página, artigo…). */
  titulo: ReactNode;
  /** Linha curta ao lado do título (ex.: "Página 3"). */
  detalhe?: ReactNode;
  /** Trecho citado; aparece truncado, com opção de expandir. */
  trecho?: ReactNode;
  /** Torna o título um link (abre em nova aba). */
  href?: string;
}

export interface ReferenciasProps {
  itens: ItemReferencia[];
  /** Começa aberta. */
  abertoInicial?: boolean;
  /** Texto do botão que abre a lista. Padrão: "3 fontes". */
  rotulo?: (quantidade: number) => ReactNode;
  rotuloMostrarMais?: string;
  rotuloMostrarMenos?: string;
  className?: string;
}

const rotuloPadrao = (n: number) => (n === 1 ? '1 fonte' : `${n} fontes`);

function Trecho({ children, mais, menos }: { children: ReactNode; mais: string; menos: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [cortado, setCortado] = useState(false);

  // só oferece "mostrar mais" se o trecho passar das linhas visíveis
  useLayoutEffect(() => {
    const t = el.current;
    if (!t) return;
    const medir = () => !aberto && setCortado(t.scrollHeight > t.clientHeight + 1);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(t);
    return () => ro.disconnect();
  }, [aberto, children]);

  return (
    <>
      <div ref={el} className={cx('lp-referencias-trecho', aberto && 'is-aberto')}>
        {children}
      </div>
      {(cortado || aberto) && (
        <button type="button" className="lp-referencias-mais" aria-expanded={aberto} onClick={() => setAberto((a) => !a)}>
          {aberto ? menos : mais}
        </button>
      )}
    </>
  );
}

/** Lista recolhível de fontes/citações de uma mensagem (vai no `rodape` da `Mensagem`). */
export function Referencias({
  itens,
  abertoInicial = false,
  rotulo = rotuloPadrao,
  rotuloMostrarMais = 'Mostrar trecho completo',
  rotuloMostrarMenos = 'Mostrar menos',
  className,
}: ReferenciasProps) {
  const id = useId();
  const [aberto, setAberto] = useState(abertoInicial);
  if (!itens.length) return null;

  return (
    <div className={cx('lp-referencias', aberto && 'is-aberto', className)}>
      <button type="button" className="lp-referencias-gatilho" aria-expanded={aberto} aria-controls={id} onClick={() => setAberto((a) => !a)}>
        <Icone icone="file-text" />
        <span>{rotulo(itens.length)}</span>
        <Icone icone="chevron-down" className="lp-referencias-seta" />
      </button>
      <Recolhivel aberto={aberto} id={id}>
        <ol className="lp-referencias-lista">
          {itens.map((item, i) => (
            <li key={item.id} className="lp-referencias-item">
              <span className="lp-referencias-num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="lp-referencias-corpo">
                <div className="lp-referencias-cab">
                  {item.href ? (
                    <a className="lp-referencias-titulo" href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.titulo}
                      <Icone icone="external-link" />
                    </a>
                  ) : (
                    <span className="lp-referencias-titulo">{item.titulo}</span>
                  )}
                  {item.detalhe && <span className="lp-referencias-detalhe">{item.detalhe}</span>}
                </div>
                {item.trecho && (
                  <Trecho mais={rotuloMostrarMais} menos={rotuloMostrarMenos}>
                    {item.trecho}
                  </Trecho>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Recolhivel>
    </div>
  );
}
