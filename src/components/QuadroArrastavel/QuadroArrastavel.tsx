import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './QuadroArrastavel.css';

export interface ColunaArrastavel<T> {
  id: string;
  /** Nome da coluna (anunciado ao mover pelo teclado). */
  titulo?: string;
  itens: T[];
}

export interface QuadroArrastavelProps<T extends { id: string }> {
  colunas: ColunaArrastavel<T>[];
  /** Recebe as colunas já reordenadas. */
  aoMudar: (colunas: ColunaArrastavel<T>[]) => void;
  /** Desenha o item; ponha a `alca` (botão de arrastar) onde quiser, ex.: no cabeçalho do card. */
  renderItem: (item: T, alca: ReactNode) => ReactNode;
  /** Nome de cada item para leitor de tela (ex.: o título do card). */
  nomeItem: (item: T) => string;
  className?: string;
}

interface Arraste {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  largura: number;
}

type Posicao = { coluna: number; indice: number };

function localizar<T extends { id: string }>(colunas: ColunaArrastavel<T>[], id: string): Posicao | null {
  for (let c = 0; c < colunas.length; c++) {
    const i = colunas[c].itens.findIndex((x) => x.id === id);
    if (i >= 0) return { coluna: c, indice: i };
  }
  return null;
}

function mover<T extends { id: string }>(colunas: ColunaArrastavel<T>[], de: Posicao, para: Posicao): ColunaArrastavel<T>[] {
  const novas = colunas.map((c) => ({ ...c, itens: [...c.itens] }));
  const [item] = novas[de.coluna].itens.splice(de.indice, 1);
  novas[para.coluna].itens.splice(Math.min(para.indice, novas[para.coluna].itens.length), 0, item);
  return novas;
}

/**
 * Colunas de itens (cards) que se reordenam arrastando, entre colunas
 * inclusive. Mouse, toque e teclado: na alça, Espaço pega/solta, setas movem,
 * Esc devolve ao lugar de origem.
 */
export function QuadroArrastavel<T extends { id: string }>({ colunas, aoMudar, renderItem, nomeItem, className }: QuadroArrastavelProps<T>) {
  const [arraste, setArraste] = useState<Arraste | null>(null);
  const [pego, setPego] = useState<{ id: string; origem: ColunaArrastavel<T>[] } | null>(null);
  const [anuncio, setAnuncio] = useState('');
  const refsColunas = useRef<Array<HTMLDivElement | null>>([]);

  const nomeColuna = (c: number) => colunas[c]?.titulo ?? `coluna ${c + 1}`;
  const item = (id: string) => colunas.flatMap((c) => c.itens).find((x) => x.id === id);

  // ---- ponteiro (mouse e toque) ----
  const aoPressionar = (e: PointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button !== 0) return;
    const el = e.currentTarget.closest<HTMLElement>('[data-quadro-item]');
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    setArraste({ id, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, largura: r.width });
  };

  // ouvido na janela: ao trocar de coluna a alça é remontada e perderia o ponteiro
  const aoMoverPonteiro = useRef<(e: globalThis.PointerEvent) => void>(() => {});
  aoMoverPonteiro.current = (e) => {
    if (!arraste) return;
    const { clientX: x, clientY: y } = e;
    setArraste({ ...arraste, x, y });
    // coluna sob o ponteiro (ou a mais próxima; em tela estreita elas ficam empilhadas)
    let alvo = -1;
    let menor = Infinity;
    refsColunas.current.forEach((col, c) => {
      if (!col) return;
      const r = col.getBoundingClientRect();
      const fora = (v: number, min: number, max: number) => (v < min ? min - v : v > max ? v - max : 0);
      const dist = fora(x, r.left, r.right) + fora(y, r.top, r.bottom);
      if (dist < menor) {
        menor = dist;
        alvo = c;
      }
    });
    const col = refsColunas.current[alvo];
    const de = localizar(colunas, arraste.id);
    if (!col || !de) return;
    // posição: quantos itens (fora o arrastado) têm o meio acima do ponteiro
    const outros = Array.from(col.querySelectorAll<HTMLElement>('[data-quadro-item]')).filter((el) => el.dataset.quadroItem !== arraste.id);
    const indice = outros.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 < y;
    }).length;
    if (de.coluna !== alvo || de.indice !== indice) aoMudar(mover(colunas, de, { coluna: alvo, indice }));
  };

  const arrastando = !!arraste;
  useEffect(() => {
    if (!arrastando) return;
    const mover_ = (e: globalThis.PointerEvent) => aoMoverPonteiro.current(e);
    const soltar = () => setArraste(null);
    window.addEventListener('pointermove', mover_);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      window.removeEventListener('pointermove', mover_);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }, [arrastando]);

  // pelo teclado, trocar de coluna remonta a alça: devolve o foco a ela
  useLayoutEffect(() => {
    if (!pego) return;
    const alca = document.querySelector<HTMLElement>(`[data-quadro-item="${CSS.escape(pego.id)}"] .lp-quadro-alca`);
    if (alca && document.activeElement !== alca) alca.focus();
  }, [colunas, pego]);

  // ---- teclado ----
  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const nome = nomeItem(item(id)!);
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (pego) {
        const p = localizar(colunas, id)!;
        setPego(null);
        setAnuncio(`${nome} solto em ${nomeColuna(p.coluna)}, posição ${p.indice + 1}.`);
      } else {
        setPego({ id, origem: colunas });
        setAnuncio(`${nome} pego. Use as setas para mover, Espaço para soltar, Esc para cancelar.`);
      }
      return;
    }
    if (!pego || pego.id !== id) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      aoMudar(pego.origem);
      setPego(null);
      setAnuncio(`Movimento cancelado. ${nome} voltou ao lugar.`);
      return;
    }
    const de = localizar(colunas, id);
    if (!de) return;
    let para: Posicao | null = null;
    if (e.key === 'ArrowUp' && de.indice > 0) para = { coluna: de.coluna, indice: de.indice - 1 };
    else if (e.key === 'ArrowDown' && de.indice < colunas[de.coluna].itens.length - 1) para = { coluna: de.coluna, indice: de.indice + 1 };
    else if (e.key === 'ArrowLeft' && de.coluna > 0) para = { coluna: de.coluna - 1, indice: de.indice };
    else if (e.key === 'ArrowRight' && de.coluna < colunas.length - 1) para = { coluna: de.coluna + 1, indice: de.indice };
    if (!e.key.startsWith('Arrow')) return;
    e.preventDefault();
    if (!para) return;
    const novas = mover(colunas, de, para);
    aoMudar(novas);
    const final = localizar(novas, id)!;
    setAnuncio(`${nome} em ${nomeColuna(final.coluna)}, posição ${final.indice + 1} de ${novas[final.coluna].itens.length}.`);
  };

  const alca = (it: T) => (
    <button
      type="button"
      className={cx('lp-quadro-alca', pego?.id === it.id && 'is-pego')}
      aria-label={`Mover ${nomeItem(it)}`}
      aria-pressed={pego?.id === it.id}
      title="Arrastar"
      onPointerDown={(e) => aoPressionar(e, it.id)}
      onKeyDown={(e) => aoTeclar(e, it.id)}
      onBlur={() => {
        // adiado: se a alça só foi remontada, o foco volta a ela antes disto rodar
        window.setTimeout(() => {
          const ativo = document.activeElement as HTMLElement | null;
          if (pego?.id === it.id && ativo?.closest('[data-quadro-item]')?.getAttribute('data-quadro-item') !== it.id) setPego(null);
        }, 0);
      }}
    >
      <Icone icone="grip-vertical" />
    </button>
  );

  const fantasma = arraste && item(arraste.id);

  return (
    <div className={cx('lp-quadro', arraste && 'is-arrastando', className)}>
      {colunas.map((col, c) => (
        <div key={col.id} ref={(el) => void (refsColunas.current[c] = el)} className="lp-quadro-coluna" aria-label={col.titulo} role={col.titulo ? 'group' : undefined}>
          {col.itens.map((it) => (
            <div
              key={it.id}
              data-quadro-item={it.id}
              className={cx('lp-quadro-item', arraste?.id === it.id && 'is-vazio', pego?.id === it.id && 'is-pego')}
            >
              {renderItem(it, alca(it))}
            </div>
          ))}
        </div>
      ))}
      <div className="lp-sr" aria-live="assertive">
        {anuncio}
      </div>
      {arraste &&
        fantasma &&
        portal(
          <div
            className="lp-quadro-fantasma"
            style={{ left: arraste.x - arraste.dx, top: arraste.y - arraste.dy, width: arraste.largura } as CSSProperties}
            aria-hidden="true"
            inert
          >
            {renderItem(fantasma, <span className="lp-quadro-alca">{<Icone icone="grip-vertical" />}</span>)}
          </div>,
        )}
    </div>
  );
}
