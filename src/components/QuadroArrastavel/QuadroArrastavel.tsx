import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { portal } from '../../utils/portal';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './QuadroArrastavel.css';
import { useTextos } from '../../i18n/contexto';
import { interpolar } from '../../i18n/idiomas';

export interface ColunaArrastavel<T> {
  id: string;
  /** Nome da coluna (anunciado ao mover pelo teclado). */
  titulo?: string;
  itens: T[];
  /** Recolhida: os itens somem e soltar nela põe o item no fim. */
  recolhida?: boolean;
}

/** Lugar de um item: id da coluna e posição nela (contando sem o próprio item). */
export interface PosicaoQuadro {
  coluna: string;
  indice: number;
}

/** O que `aoSoltar` recebe quando um item muda de lugar. */
export interface SoltarItem<T, C = ColunaArrastavel<T>> {
  item: T;
  de: PosicaoQuadro;
  para: PosicaoQuadro;
  /** As colunas já com o item no lugar novo (as mesmas de `aoMudar`). */
  colunas: C[];
}

/** O que `aoSoltarColuna` recebe quando uma coluna muda de lugar. */
export interface SoltarColuna<C> {
  coluna: C;
  de: number;
  para: number;
  colunas: C[];
}

export interface QuadroArrastavelProps<T extends { id: string }, C extends ColunaArrastavel<T> = ColunaArrastavel<T>> {
  /** Colunas com os itens; podem ter campos a mais (cor, limite…), que voltam em `aoMudar`. */
  colunas: (ColunaArrastavel<T> & C)[];
  /** Recebe as colunas na ordem nova, uma vez, ao soltar (durante o arraste o quadro mostra uma prévia). */
  aoMudar: (colunas: C[]) => void;
  /** Avisa de onde para onde o item foi, ao soltar: é o que o servidor precisa para gravar. */
  aoSoltar?: (evento: SoltarItem<T, C>) => void;
  /**
   * Regra de destino: `false` impede soltar o item ali (ex.: coluna cheia).
   * `de` é o lugar onde o arraste começou.
   */
  podeSoltar?: (item: T, para: PosicaoQuadro, de: PosicaoQuadro) => boolean;
  /** Filtro: os itens com `false` ficam escondidos, mas continuam no lugar ao arrastar os outros. */
  visivel?: (item: T) => boolean;
  /** Desenha o item; ponha a `alca` (botão de arrastar) onde quiser, ex.: no cabeçalho do card. */
  renderItem: (item: T, alca: ReactNode) => ReactNode;
  /** Nome de cada item para leitor de tela (ex.: o título do card). */
  nomeItem: (item: T) => string;
  /**
   * `grade` (padrão) = as colunas dividem a largura e quebram linha ·
   * `faixa` = colunas de largura fixa lado a lado, com rolagem horizontal (kanban).
   */
  layout?: 'grade' | 'faixa';
  /** Na `faixa`, a largura de cada coluna; na `grade`, a largura mínima (padrão: 18rem e 16rem). */
  larguraColuna?: string;
  /** Topo de cada coluna. `alca` é o botão de arrastar a coluna (com `colunasArrastaveis`). */
  cabecalhoColuna?: (coluna: C, alca: ReactNode) => ReactNode;
  /** Pé de cada coluna (ex.: "Adicionar cartão"). Some na coluna recolhida. */
  rodapeColuna?: (coluna: C) => ReactNode;
  /** As colunas também se reordenam, pela alça do cabeçalho. */
  colunasArrastaveis?: boolean;
  /** Avisa a coluna que mudou de lugar, ao soltar. */
  aoSoltarColuna?: (evento: SoltarColuna<C>) => void;
  /** Conteúdo depois da última coluna, na mesma fileira (ex.: "Adicionar coluna"). */
  fim?: ReactNode;
  /** Classe extra de cada coluna (vale também para a cópia que segue o ponteiro). */
  classeColuna?: (coluna: C) => string | undefined;
  /** Nome acessível do quadro. */
  rotulo?: string;
  className?: string;
}

interface Arraste {
  tipo: 'item' | 'coluna';
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  largura: number;
}

type Posicao = { coluna: number; indice: number };

/** Distância da borda (px) em que a rolagem automática começa, e a velocidade máxima por quadro. */
const BORDA_ROLAGEM = 56;
const VELOCIDADE_ROLAGEM = 20;

function localizar<T extends { id: string }>(colunas: ColunaArrastavel<T>[], id: string): Posicao | null {
  for (let c = 0; c < colunas.length; c++) {
    const i = colunas[c].itens.findIndex((x) => x.id === id);
    if (i >= 0) return { coluna: c, indice: i };
  }
  return null;
}

function mover<T extends { id: string }, C extends ColunaArrastavel<T>>(colunas: C[], de: Posicao, para: Posicao): C[] {
  const novas = colunas.map((c) => ({ ...c, itens: [...c.itens] }));
  const [item] = novas[de.coluna].itens.splice(de.indice, 1);
  novas[para.coluna].itens.splice(Math.min(para.indice, novas[para.coluna].itens.length), 0, item);
  return novas;
}

function moverColuna<C>(colunas: C[], de: number, para: number): C[] {
  const novas = [...colunas];
  const [c] = novas.splice(de, 1);
  novas.splice(para, 0, c);
  return novas;
}

/**
 * Posição real numa lista para a posição `visivel` contada só entre os itens
 * visíveis: antes do N-ésimo visível, ou logo depois do último.
 */
function indiceReal<T>(itens: T[], visivel: number, eVisivel: (item: T) => boolean): number {
  const visiveis: number[] = [];
  itens.forEach((it, i) => eVisivel(it) && visiveis.push(i));
  if (visivel < visiveis.length) return visiveis[visivel];
  return visiveis.length ? visiveis[visiveis.length - 1] + 1 : itens.length;
}

/** Elementos que rolam, do mais interno ao documento, a partir de `el`. */
function rolaveis(el: Element | null, conjunto: Set<Element>) {
  for (let e = el; e && e !== document.documentElement && e !== document.body; e = e.parentElement) {
    const s = getComputedStyle(e);
    const y = /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight;
    const x = /(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth;
    if (x || y) conjunto.add(e);
  }
}

/** Rola `el` se o ponteiro estiver perto de uma borda dele. Devolve se rolou. */
function rolarNaBorda(el: Element, x: number, y: number): boolean {
  const doc = el === document.scrollingElement;
  const r = doc ? { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight } : el.getBoundingClientRect();
  if (x < r.left || x > r.right || y < r.top || y > r.bottom) return false;
  const vel = (dist: number) => Math.ceil(((BORDA_ROLAGEM - dist) / BORDA_ROLAGEM) * VELOCIDADE_ROLAGEM);
  let dx = 0;
  let dy = 0;
  if (y - r.top < BORDA_ROLAGEM) dy = -vel(y - r.top);
  else if (r.bottom - y < BORDA_ROLAGEM) dy = vel(r.bottom - y);
  if (x - r.left < BORDA_ROLAGEM) dx = -vel(x - r.left);
  else if (r.right - x < BORDA_ROLAGEM) dx = vel(r.right - x);
  if (!dx && !dy) return false;
  const antes = [el.scrollLeft, el.scrollTop];
  el.scrollLeft += dx;
  el.scrollTop += dy;
  return el.scrollLeft !== antes[0] || el.scrollTop !== antes[1];
}

/**
 * Colunas de itens (cards) que se reordenam arrastando, entre colunas
 * inclusive. Mouse, toque e teclado: na alça, Espaço pega/solta, setas movem,
 * Esc devolve ao lugar de origem. Perto da borda, a tela rola sozinha.
 */
export function QuadroArrastavel<T extends { id: string }, C extends ColunaArrastavel<T> = ColunaArrastavel<T>>({
  colunas,
  aoMudar,
  aoSoltar,
  podeSoltar,
  visivel,
  renderItem,
  nomeItem,
  layout = 'grade',
  larguraColuna,
  cabecalhoColuna,
  rodapeColuna,
  colunasArrastaveis = false,
  aoSoltarColuna,
  fim,
  classeColuna,
  rotulo,
  className,
}: QuadroArrastavelProps<T, C>) {
  const tq = useTextos().quadro;
  const [arraste, setArraste] = useState<Arraste | null>(null);
  // pego pelo teclado
  const [pego, setPego] = useState<{ tipo: 'item' | 'coluna'; id: string } | null>(null);
  // as colunas enquanto algo está sendo movido; ao soltar, vão para `aoMudar`
  const [previa, setPrevia] = useState<C[] | null>(null);
  const [bloqueada, setBloqueada] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState('');
  const refsColunas = useRef(new Map<string, HTMLDivElement>());
  const raiz = useRef<HTMLDivElement>(null);
  const origem = useRef<{ colunas: C[]; tipo: 'item' | 'coluna'; id: string; pos: PosicaoQuadro | number } | null>(null);
  const ponteiro = useRef<{ x: number; y: number } | null>(null);

  const cols = previa ?? colunas;
  const colsRef = useRef(cols);
  colsRef.current = cols;

  const eVisivel = (it: T) => !visivel || visivel(it);
  const nomeColuna = (c: number) => colsRef.current[c]?.titulo ?? interpolar(tq.colunaN, { n: c + 1 });
  const item = (id: string) => colsRef.current.flatMap((c) => c.itens).find((x) => x.id === id);
  const posicaoDe = (cs: C[], p: Posicao): PosicaoQuadro => ({ coluna: cs[p.coluna].id, indice: p.indice });

  const permitido = (it: T, para: Posicao) => {
    const o = origem.current;
    if (!podeSoltar || !o || typeof o.pos === 'number') return true;
    return podeSoltar(it, posicaoDe(colsRef.current, para), o.pos);
  };

  const comecar = (tipo: 'item' | 'coluna', id: string) => {
    const cs = colsRef.current;
    const pos = tipo === 'item' ? posicaoDe(cs, localizar(cs, id)!) : cs.findIndex((c) => c.id === id);
    origem.current = { colunas: cs, tipo, id, pos };
    setPrevia(cs);
  };

  const atualizar = (novas: C[]) => {
    colsRef.current = novas;
    setPrevia(novas);
  };

  /** Termina o movimento: grava (`aoMudar` + `aoSoltar*`) ou devolve tudo ao lugar. */
  const terminar = (gravar: boolean) => {
    const o = origem.current;
    const final = colsRef.current;
    origem.current = null;
    setPrevia(null);
    setBloqueada(null);
    if (!o) return;
    if (!gravar) {
      colsRef.current = o.colunas;
      return;
    }
    if (o.tipo === 'item') {
      const p = localizar(final, o.id);
      const de = o.pos as PosicaoQuadro;
      if (!p) return;
      const para = posicaoDe(final, p);
      if (para.coluna === de.coluna && para.indice === de.indice) return;
      aoMudar(final);
      aoSoltar?.({ item: final[p.coluna].itens[p.indice], de, para, colunas: final });
    } else {
      const de = o.pos as number;
      const para = final.findIndex((c) => c.id === o.id);
      if (para === de || para < 0) return;
      aoMudar(final);
      aoSoltarColuna?.({ coluna: final[para], de, para, colunas: final });
    }
  };

  const terminarRef = useRef(terminar);
  terminarRef.current = terminar;

  // ---- ponteiro (mouse e toque) ----
  const aoPressionar = (e: PointerEvent<HTMLButtonElement>, tipo: 'item' | 'coluna', id: string) => {
    if (e.button !== 0) return;
    const el = e.currentTarget.closest<HTMLElement>(tipo === 'item' ? '[data-quadro-item]' : '[data-quadro-coluna]');
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    comecar(tipo, id);
    ponteiro.current = { x: e.clientX, y: e.clientY };
    setArraste({ tipo, id, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, largura: r.width });
  };

  // coluna sob o ponteiro (ou a mais próxima; em tela estreita elas ficam empilhadas)
  const colunaMaisProxima = (x: number, y: number, ignorar?: string) => {
    let alvo = -1;
    let menor = Infinity;
    colsRef.current.forEach((c, i) => {
      const el = refsColunas.current.get(c.id);
      if (!el || c.id === ignorar) return;
      const r = el.getBoundingClientRect();
      const fora = (v: number, min: number, max: number) => (v < min ? min - v : v > max ? v - max : 0);
      const dist = fora(x, r.left, r.right) + fora(y, r.top, r.bottom);
      if (dist < menor) {
        menor = dist;
        alvo = i;
      }
    });
    return alvo;
  };

  // ouvido na janela: ao trocar de coluna a alça é remontada e perderia o ponteiro
  const aoMoverPonteiro = useRef<(x: number, y: number) => void>(() => {});
  aoMoverPonteiro.current = (x, y) => {
    const a = arraste;
    if (!a) return;
    const cs = colsRef.current;
    if (a.tipo === 'coluna') {
      const de = cs.findIndex((c) => c.id === a.id);
      const perto = colunaMaisProxima(x, y, a.id);
      if (de < 0 || perto < 0) return;
      const r = refsColunas.current.get(cs[perto].id)!.getBoundingClientRect();
      const outras = cs.filter((c) => c.id !== a.id);
      let para = outras.indexOf(cs[perto]);
      if (x > r.left + r.width / 2) para++;
      if (para !== de) atualizar(moverColuna(cs, de, para));
      return;
    }
    const alvo = colunaMaisProxima(x, y);
    const col = cs[alvo];
    const de = localizar(cs, a.id);
    if (!col || !de) return;
    const outrosItens = col.itens.filter((it) => it.id !== a.id);
    let indice: number;
    if (col.recolhida) indice = outrosItens.length;
    else {
      // posição: quantos itens visíveis (fora o arrastado) têm o meio acima do ponteiro
      const el = refsColunas.current.get(col.id)!;
      const visiveis = Array.from(el.querySelectorAll<HTMLElement>('[data-quadro-item]')).filter((n) => n.dataset.quadroItem !== a.id);
      const acima = visiveis.filter((n) => {
        const r = n.getBoundingClientRect();
        return r.top + r.height / 2 < y;
      }).length;
      indice = indiceReal(outrosItens, acima, eVisivel);
    }
    const para = { coluna: alvo, indice };
    if (!permitido(item(a.id)!, para)) {
      setBloqueada(col.id);
      return;
    }
    setBloqueada(null);
    if (de.coluna !== alvo || de.indice !== indice) atualizar(mover(cs, de, para));
  };

  const arrastando = !!arraste;
  useEffect(() => {
    if (!arrastando) return;
    const mover_ = (e: globalThis.PointerEvent) => {
      ponteiro.current = { x: e.clientX, y: e.clientY };
      setArraste((a) => (a ? { ...a, x: e.clientX, y: e.clientY } : a));
      aoMoverPonteiro.current(e.clientX, e.clientY);
    };
    const fimArraste = (gravar: boolean) => {
      const a = origem.current;
      if (gravar && a?.tipo === 'item') {
        const p = localizar(colsRef.current, a.id);
        if (p) setAnuncio(interpolar(tq.solto, { nome: nomeItem(item(a.id)!), coluna: nomeColuna(p.coluna), n: p.indice + 1 }));
      }
      terminarRef.current(gravar);
      setArraste(null);
      ponteiro.current = null;
    };
    const soltar = () => fimArraste(true);
    const cancelar = () => fimArraste(false);
    const tecla = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      cancelar();
    };
    // rolagem automática: perto da borda do quadro, de uma coluna ou da janela
    let quadro = 0;
    const passo = () => {
      const p = ponteiro.current;
      if (p) {
        const alvos = new Set<Element>();
        rolaveis(document.elementFromPoint(p.x, p.y), alvos);
        rolaveis(raiz.current, alvos);
        if (document.scrollingElement) alvos.add(document.scrollingElement);
        let rolou = false;
        for (const el of alvos) rolou = rolarNaBorda(el, p.x, p.y) || rolou;
        if (rolou) aoMoverPonteiro.current(p.x, p.y);
      }
      quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    window.addEventListener('pointermove', mover_);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', cancelar);
    window.addEventListener('keydown', tecla);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('pointermove', mover_);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', cancelar);
      window.removeEventListener('keydown', tecla);
    };
  }, [arrastando]);

  // pelo teclado, mover remonta a alça: devolve o foco a ela
  useLayoutEffect(() => {
    if (!pego) return;
    const seletor =
      pego.tipo === 'item'
        ? `[data-quadro-item="${CSS.escape(pego.id)}"] .lp-quadro-alca`
        : `[data-quadro-coluna="${CSS.escape(pego.id)}"] .lp-quadro-alca--coluna`;
    const alca = raiz.current?.querySelector<HTMLElement>(seletor);
    if (alca && document.activeElement !== alca) alca.focus();
  }, [cols, pego]);

  // ---- teclado ----
  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>, tipo: 'item' | 'coluna', id: string) => {
    const cs = colsRef.current;
    const nome = tipo === 'item' ? nomeItem(item(id)!) : nomeColuna(cs.findIndex((c) => c.id === id));
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (pego?.id === id) {
        if (tipo === 'item') {
          const p = localizar(cs, id)!;
          setAnuncio(interpolar(tq.solto, { nome, coluna: nomeColuna(p.coluna), n: p.indice + 1 }));
        } else setAnuncio(interpolar(tq.colunaSolta, { nome, n: cs.findIndex((c) => c.id === id) + 1 }));
        terminar(true);
        setPego(null);
      } else if (!pego) {
        comecar(tipo, id);
        setPego({ tipo, id });
        setAnuncio(
          interpolar(tipo === 'coluna' ? tq.colunaPega : tq.pego, { nome }),
        );
      }
      return;
    }
    if (!pego || pego.id !== id) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      terminar(false);
      setPego(null);
      setAnuncio(interpolar(tq.cancelado, { nome }));
      return;
    }
    if (!e.key.startsWith('Arrow')) return;
    e.preventDefault();

    if (tipo === 'coluna') {
      const de = cs.findIndex((c) => c.id === id);
      const para = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? de - 1 : de + 1;
      if (para < 0 || para >= cs.length) return;
      atualizar(moverColuna(cs, de, para));
      setAnuncio(interpolar(tq.colunaPosicao, { nome, n: para + 1, total: cs.length }));
      return;
    }

    const de = localizar(cs, id);
    if (!de) return;
    const it = cs[de.coluna].itens[de.indice];
    const col = cs[de.coluna];
    let para: Posicao | null = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // troca com o vizinho visível
      const passo = e.key === 'ArrowUp' ? -1 : 1;
      for (let j = de.indice + passo; j >= 0 && j < col.itens.length; j += passo) {
        if (!eVisivel(col.itens[j])) continue;
        if (permitido(it, { coluna: de.coluna, indice: j })) para = { coluna: de.coluna, indice: j };
        break;
      }
    } else {
      // a coluna vizinha (pula as recolhidas e as que não aceitam), na mesma altura
      const passo = e.key === 'ArrowLeft' ? -1 : 1;
      const altura = col.itens.slice(0, de.indice).filter(eVisivel).length;
      for (let c = de.coluna + passo; c >= 0 && c < cs.length; c += passo) {
        if (cs[c].recolhida) continue;
        const p = { coluna: c, indice: indiceReal(cs[c].itens, altura, eVisivel) };
        if (permitido(it, p)) {
          para = p;
          break;
        }
      }
    }
    if (!para) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') setAnuncio(interpolar(tq.semDestino, { nome }));
      return;
    }
    const novas = mover(cs, de, para);
    atualizar(novas);
    const final = localizar(novas, id)!;
    const total = novas[final.coluna].itens.filter(eVisivel).length;
    const posVisivel = novas[final.coluna].itens.slice(0, final.indice).filter(eVisivel).length + 1;
    setAnuncio(interpolar(tq.posicao, { nome, coluna: nomeColuna(final.coluna), n: posVisivel, total }));
  };

  const aoSairDaAlca = (tipo: 'item' | 'coluna', id: string) => {
    // adiado: se a alça só foi remontada, o foco volta a ela antes disto rodar
    window.setTimeout(() => {
      const ativo = document.activeElement as HTMLElement | null;
      const seletor = tipo === 'item' ? '[data-quadro-item]' : '[data-quadro-coluna]';
      const dono = ativo?.closest(seletor)?.getAttribute(tipo === 'item' ? 'data-quadro-item' : 'data-quadro-coluna');
      if (pego?.id === id && dono !== id) {
        terminar(true);
        setPego(null);
      }
    }, 0);
  };

  const alca = (it: T) => (
    <button
      type="button"
      className={cx('lp-quadro-alca', pego?.id === it.id && 'is-pego')}
      aria-label={interpolar(tq.mover, { nome: nomeItem(it) })}
      aria-pressed={pego?.id === it.id}
      title={tq.arrastar}
      onPointerDown={(e) => aoPressionar(e, 'item', it.id)}
      onKeyDown={(e) => aoTeclar(e, 'item', it.id)}
      onBlur={() => aoSairDaAlca('item', it.id)}
    >
      <Icone icone="grip-vertical" />
    </button>
  );

  const alcaColuna = (c: C, i: number) =>
    colunasArrastaveis ? (
      <button
        type="button"
        className={cx('lp-quadro-alca lp-quadro-alca--coluna', pego?.id === c.id && 'is-pego')}
        aria-label={interpolar(tq.moverColuna, { nome: c.titulo ?? i + 1 })}
        aria-pressed={pego?.id === c.id}
        title={tq.arrastarColuna}
        onPointerDown={(e) => aoPressionar(e, 'coluna', c.id)}
        onKeyDown={(e) => aoTeclar(e, 'coluna', c.id)}
        onBlur={() => aoSairDaAlca('coluna', c.id)}
      >
        <Icone icone="grip-vertical" />
      </button>
    ) : null;

  // na cópia que segue o ponteiro: só o desenho da alça
  const alcaFalsa = (
    <span className="lp-quadro-alca">
      <Icone icone="grip-vertical" />
    </span>
  );
  const alcaColunaFalsa = (
    <span className="lp-quadro-alca lp-quadro-alca--coluna">
      <Icone icone="grip-vertical" />
    </span>
  );

  const conteudoColuna = (col: C, i: number, fantasma: boolean) => {
    const a = fantasma ? (colunasArrastaveis ? alcaColunaFalsa : null) : alcaColuna(col, i);
    const cab = cabecalhoColuna ? cabecalhoColuna(col, a) : a ? <span className="lp-quadro-coluna-titulo">{a}{col.titulo}</span> : null;
    return (
      <>
        {cab && <div className="lp-quadro-coluna-cab">{cab}</div>}
        {!col.recolhida && (
          <div className="lp-quadro-itens">
            {col.itens.map((it) =>
              eVisivel(it) ? (
                <div
                  key={it.id}
                  data-quadro-item={fantasma ? undefined : it.id}
                  className={cx('lp-quadro-item', !fantasma && arraste?.id === it.id && 'is-vazio', !fantasma && pego?.id === it.id && 'is-pego')}
                >
                  {renderItem(it, fantasma ? alcaFalsa : alca(it))}
                </div>
              ) : null,
            )}
          </div>
        )}
        {!col.recolhida && rodapeColuna && <div className="lp-quadro-coluna-pe">{rodapeColuna(col)}</div>}
      </>
    );
  };

  const fantasmaItem = arraste?.tipo === 'item' ? item(arraste.id) : undefined;
  const fantasmaColuna = arraste?.tipo === 'coluna' ? cols.find((c) => c.id === arraste.id) : undefined;
  const colunaDoArrastado = arraste?.tipo === 'item' ? cols[localizar(cols, arraste.id)?.coluna ?? -1]?.id : undefined;
  const estilo = larguraColuna ? ({ '--qd-coluna': larguraColuna } as CSSProperties) : undefined;

  return (
    <div
      ref={raiz}
      className={cx('lp-quadro', `lp-quadro--${layout}`, arraste && 'is-arrastando', arraste && `is-arrastando-${arraste.tipo}`, className)}
      style={estilo}
      role={rotulo ? 'region' : undefined}
      aria-label={rotulo}
    >
      {cols.map((col, i) => (
        <div
          key={col.id}
          ref={(el) => {
            if (el) refsColunas.current.set(col.id, el);
            else refsColunas.current.delete(col.id);
          }}
          data-quadro-coluna={col.id}
          className={cx(
            'lp-quadro-coluna',
            classeColuna?.(col),
            col.recolhida && 'is-recolhida',
            colunaDoArrastado === col.id && 'is-alvo',
            bloqueada === col.id && 'is-bloqueada',
            arraste?.tipo === 'coluna' && arraste.id === col.id && 'is-vazio',
            pego?.tipo === 'coluna' && pego.id === col.id && 'is-pego',
          )}
          aria-label={col.titulo}
          role={col.titulo ? 'group' : undefined}
        >
          {conteudoColuna(col, i, false)}
        </div>
      ))}
      {fim && <div className="lp-quadro-fim">{fim}</div>}
      <div className="lp-sr" aria-live="assertive">
        {anuncio}
      </div>
      {arraste &&
        (fantasmaItem || fantasmaColuna) &&
        portal(
          <div
            className={cx('lp-quadro-fantasma', fantasmaColuna && 'lp-quadro-fantasma--coluna')}
            style={{ left: arraste.x - arraste.dx, top: arraste.y - arraste.dy, width: arraste.largura } as CSSProperties}
            aria-hidden="true"
            inert
          >
            {fantasmaItem ? (
              renderItem(fantasmaItem, alcaFalsa)
            ) : (
              <div className={cx('lp-quadro-coluna', 'lp-quadro-coluna--fantasma', classeColuna?.(fantasmaColuna!))}>
                {conteudoColuna(fantasmaColuna!, cols.indexOf(fantasmaColuna!), true)}
              </div>
            )}
          </div>,
        )}
    </div>
  );
}
