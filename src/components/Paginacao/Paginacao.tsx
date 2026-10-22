import { Icone } from '../../utils/Icone';
import { cx } from '../../utils/cx';
import './Paginacao.css';

export interface PaginacaoProps {
  total: number;
  /** Página atual, começando em 1. */
  pagina: number;
  tamanho: number;
  tamanhoOpcoes?: number[];
  aoMudarPagina: (pagina: number) => void;
  aoMudarTamanho?: (tamanho: number) => void;
  /** Sem borda própria (dentro do card da tabela). */
  embutida?: boolean;
  className?: string;
}

type Item = number | '…';

function listaPaginas(atual: number, total: number): Item[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (atual <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (atual >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', atual - 1, atual, atual + 1, '…', total];
}

export function Paginacao({
  total,
  pagina,
  tamanho,
  tamanhoOpcoes = [10, 20, 50, 100],
  aoMudarPagina,
  aoMudarTamanho,
  embutida,
  className,
}: PaginacaoProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / tamanho));
  const atual = Math.min(Math.max(1, pagina), totalPaginas);
  const ini = total ? (atual - 1) * tamanho + 1 : 0;
  const fim = Math.min(atual * tamanho, total);
  const ir = (p: number) => p >= 1 && p <= totalPaginas && p !== atual && aoMudarPagina(p);

  return (
    <nav className={cx('lp-pag', embutida && 'lp-pag--embutida', className)} aria-label="Paginação">
      <span className="lp-pag-exibindo">
        Exibindo <strong>{total ? `${ini}–${fim}` : '0'}</strong> de {total}
      </span>
      <div className="lp-pag-dir">
        {aoMudarTamanho && tamanhoOpcoes.length > 0 && (
          <label className="lp-pag-por">
            Por página:
            <select className="lp-pag-sel" value={tamanho} onChange={(e) => aoMudarTamanho(Number(e.target.value))}>
              {tamanhoOpcoes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="lp-pag-paginas">
          <button type="button" className="lp-pag-bt" aria-label="Página anterior" disabled={atual === 1} onClick={() => ir(atual - 1)}>
            <Icone icone="chevron-left" />
          </button>
          {listaPaginas(atual, totalPaginas).map((p, i) =>
            p === '…' ? (
              <span key={`g${i}`} className="lp-pag-bt lp-pag-gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={cx('lp-pag-bt', p === atual && 'is-on')}
                aria-current={p === atual ? 'page' : undefined}
                onClick={() => ir(p)}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            className="lp-pag-bt"
            aria-label="Próxima página"
            disabled={atual === totalPaginas}
            onClick={() => ir(atual + 1)}
          >
            <Icone icone="chevron-right" />
          </button>
        </div>
      </div>
    </nav>
  );
}
