import { useCallback, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Botao } from '../Botao/Botao';
import { Skeleton } from '../Skeleton/Skeleton';
import { Tabela, type Coluna } from '../Tabela/Tabela';
import { Vazio } from '../Vazio/Vazio';
import type { DadoGrafico, GraficoBaseProps } from './tipos';
import './MolduraGrafico.css';

export type FormaLegenda = 'linha' | 'barra' | 'ponto';

export interface ItemLegenda {
  chave: string;
  rotulo: string;
  cor: string;
  forma: FormaLegenda;
  tracejada?: boolean;
  visivel: boolean;
}

export interface TabelaGrafico {
  colunas: Coluna<DadoGrafico>[];
  registros: DadoGrafico[];
}

interface MolduraGraficoProps extends GraficoBaseProps {
  semDados: boolean;
  itensLegenda?: ItemLegenda[];
  aoAlternarSerie?: (chave: string) => void;
  /** Montada só quando a pessoa pede a tabela. */
  tabela: () => TabelaGrafico;
  /** Texto abaixo do gráfico (ex.: estatística calculada pelo app). */
  nota?: ReactNode;
  /** O gráfico em si, desenhado na largura do container. */
  children: (largura: number) => ReactNode;
}

/** Largura do elemento, acompanhando o container (o SVG é redesenhado, não esticado). */
export function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [largura, setLargura] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setLargura(Math.floor(el.clientWidth));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, largura] as const;
}

/** Amostra da legenda e da caixa de detalhes: traço (linha), quadrado (barra) ou círculo (ponto). */
export function Amostra({ cor, forma, tracejada }: { cor: string; forma: FormaLegenda; tracejada?: boolean }) {
  return (
    <svg className="lp-graf-amostra" width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
      {forma === 'linha' ? (
        <line x1="1" y1="5" x2="15" y2="5" stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={tracejada ? '3 3' : undefined} />
      ) : forma === 'ponto' ? (
        <circle cx="8" cy="5" r="4" fill={cor} />
      ) : (
        <rect x="3" y="0" width="10" height="10" rx="2" fill={cor} />
      )}
    </svg>
  );
}

/** Esqueleto comum dos gráficos: título, legenda, ver dados, carregando e vazio. */
export function MolduraGrafico({
  titulo,
  altura = 280,
  legenda = true,
  carregando,
  textoVazio = 'Sem dados para mostrar.',
  verDados = true,
  animacao,
  className,
  semDados,
  itensLegenda = [],
  aoAlternarSerie,
  tabela,
  nota,
  children,
}: MolduraGraficoProps) {
  const [comoTabela, setComoTabela] = useState(false);
  const [area, largura] = useLargura<HTMLDivElement>();
  const mostrarLegenda = legenda && itensLegenda.length > 1 && !carregando && !semDados && !comoTabela;
  const t = comoTabela && !carregando && !semDados ? tabela() : null;

  return (
    <figure className={cx('lp-graf', animacao && 'lp-graf--animado', className)}>
      <div className="lp-graf-topo">
        <figcaption className="lp-graf-titulo">{titulo}</figcaption>
        {verDados && !carregando && !semDados && (
          <Botao
            rotulo={comoTabela ? 'Ver gráfico' : 'Ver dados'}
            icone={comoTabela ? 'chart-column' : 'table'}
            aparencia="texto"
            severidade="secundario"
            tamanho="pequeno"
            pressionado={comoTabela}
            onClick={() => setComoTabela((v) => !v)}
          />
        )}
      </div>
      {mostrarLegenda && (
        <div className="lp-graf-legenda" role="group" aria-label={`Séries de ${titulo}`}>
          {itensLegenda.map((item) => (
            <button
              key={item.chave}
              type="button"
              className={cx('lp-graf-leg-item', !item.visivel && 'is-oculta')}
              aria-pressed={item.visivel}
              title={item.visivel ? 'Esconder a série' : 'Mostrar a série'}
              onClick={() => aoAlternarSerie?.(item.chave)}
            >
              <Amostra cor={item.cor} forma={item.forma} tracejada={item.tracejada} />
              {item.rotulo}
            </button>
          ))}
        </div>
      )}
      <div ref={area} className="lp-graf-area">
        {carregando ? (
          <Skeleton altura={`${altura}px`} />
        ) : semDados ? (
          <Vazio titulo={textoVazio} icone="chart-column" />
        ) : t ? (
          <Tabela rotulo={titulo} colunas={t.colunas} registros={t.registros} aparencia="grade" />
        ) : (
          largura > 0 && children(largura)
        )}
      </div>
      {nota && !carregando && !semDados && <p className="lp-graf-nota">{nota}</p>}
    </figure>
  );
}

/** Legenda: esconde/mostra uma série, mas nunca a última visível (o gráfico ficaria em branco). */
export function useSeriesOcultas() {
  const [ocultas, setOcultas] = useState<ReadonlySet<string>>(new Set());
  const alternar = useCallback((chave: string, total: number) => {
    setOcultas((atual) => {
      const nova = new Set(atual);
      if (nova.has(chave)) nova.delete(chave);
      else if (total - nova.size > 1) nova.add(chave);
      return nova;
    });
  }, []);
  return [ocultas, alternar] as const;
}

/** Ponto ativo da caixa de detalhes: mouse, toque e setas do teclado andam pelos itens. */
export function usePontoAtivo(total: number) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const aoTeclar = (e: KeyboardEvent) => {
    if (!total) return;
    const atual = ativo ?? -1;
    const proximo =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? Math.min(total - 1, atual + 1)
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? Math.max(0, atual < 0 ? 0 : atual - 1)
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? total - 1
              : null;
    if (e.key === 'Escape') {
      setAtivo(null);
      return;
    }
    if (proximo === null) return;
    e.preventDefault();
    setAtivo(proximo);
  };
  return { ativo: ativo !== null && ativo < total ? ativo : null, setAtivo, aoTeclar };
}

export interface LinhaDetalhe {
  chave: string;
  rotulo: string;
  cor: string;
  forma: FormaLegenda;
  valor: string;
}

/** Caixa de detalhes, ao lado da posição `x` (vira para a esquerda na metade direita). */
export function CaixaDetalhes({ x, y = 8, largura, titulo, linhas }: { x: number; y?: number; largura: number; titulo: string; linhas: LinhaDetalhe[] }) {
  const aDireita = x <= largura / 2;
  return (
    <div className="lp-graf-caixa" style={aDireita ? { left: x + 12, top: y } : { right: largura - x + 12, top: y }} aria-hidden="true">
      <div className="lp-graf-caixa-titulo">{titulo}</div>
      {linhas.map((l) => (
        <div key={l.chave} className="lp-graf-caixa-linha">
          <Amostra cor={l.cor} forma={l.forma} />
          <span className="lp-graf-caixa-rotulo">{l.rotulo}</span>
          <span className="lp-graf-caixa-valor">{l.valor}</span>
        </div>
      ))}
    </div>
  );
}

/** Texto da caixa de detalhes para o leitor de tela (a caixa visual fica escondida dele). */
export function textoDetalhe(titulo: string, linhas: LinhaDetalhe[]): string {
  return [titulo, ...linhas.map((l) => `${l.rotulo}: ${l.valor}`)].join('. ');
}

/**
 * Recorte que revela o desenho da esquerda para a direita, na entrada animada
 * (linhas, áreas e pontos). O retângulo cobre o SVG todo: no fim da animação,
 * não corta nada.
 */
export function useRevelacao(animacao: boolean | undefined, largura: number, altura: number) {
  const id = `lp-graf-rev-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (!animacao) return { recorte: undefined, definicao: null };
  return {
    recorte: `url(#${id})`,
    definicao: (
      <defs>
        <clipPath id={id}>
          <rect className="lp-graf-revela" x={0} y={-20} width={largura} height={altura + 40} />
        </clipPath>
      </defs>
    ),
  };
}

/** Cor padrão da série pela posição: `--graf-1`, `--graf-2`… */
export function corDaSerie(indice: number, cor?: string): string {
  return cor ?? `var(--graf-${(indice % 6) + 1})`;
}
