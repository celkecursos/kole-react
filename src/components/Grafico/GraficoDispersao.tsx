import { useState, type PointerEvent, type ReactNode } from 'react';
import type { Coluna } from '../Tabela/Tabela';
import { dominioDoEixo, escalaLinear, formatarPasso, formatarValor, larguraTexto, lerNumero, regressaoLinear } from './escalas';
import { CaixaDetalhes, MolduraGrafico, textoDetalhe, usePontoAtivo, useSeriesOcultas, type ItemLegenda, type LinhaDetalhe } from './MolduraGrafico';
import type { DadoGrafico, EixoGrafico, GraficoBaseProps } from './tipos';
import './GraficoDispersao.css';

export interface GraficoDispersaoProps extends GraficoBaseProps {
  /** Cada item é um ponto. */
  dados: DadoGrafico[];
  /** Eixo horizontal (numérico). */
  eixoX?: EixoGrafico;
  eixoY?: EixoGrafico;
  chaveX: string;
  chaveY: string;
  /** Campo mostrado como título da caixa de detalhes (ex.: o ano). */
  chaveRotulo?: string;
  /** Campo booleano: pontos destacados com `--graf-2`. */
  chaveDestaque?: string;
  /** Desenha a reta dos mínimos quadrados e mostra `r`, `r²` e `n` no canto. */
  regressao?: boolean;
  /** Texto abaixo do gráfico (ex.: p-valor calculado pelo app). */
  nota?: ReactNode;
  rotuloPontos?: string;
  rotuloDestaque?: string;
  rotuloRegressao?: string;
}

const DUAS = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "Vendas (mil R$)" · "Vendas" · "mil R$". */
function tituloDoEixo(eixo?: EixoGrafico): string {
  if (!eixo) return '';
  if (eixo.rotulo && eixo.unidade) return `${eixo.rotulo} (${eixo.unidade})`;
  return eixo.rotulo ?? eixo.unidade ?? '';
}

interface Ponto {
  indice: number;
  x: number;
  y: number;
  destaque: boolean;
  rotulo: string;
}

/** Cruzamento de duas medidas, um ponto por item, com reta de regressão opcional. */
export function GraficoDispersao(props: GraficoDispersaoProps) {
  const { dados, chaveX, chaveY, chaveRotulo, chaveDestaque, regressao, eixoX, eixoY } = props;
  const { rotuloPontos = 'Pontos', rotuloDestaque = 'Destaque', rotuloRegressao = 'Tendência linear' } = props;
  const [ocultas, alternar] = useSeriesOcultas();

  const itens: ItemLegenda[] = [
    { chave: 'pontos', rotulo: rotuloPontos, cor: 'var(--graf-1)', forma: 'ponto', visivel: !ocultas.has('pontos') },
    ...(chaveDestaque ? [{ chave: 'destaque', rotulo: rotuloDestaque, cor: 'var(--graf-2)', forma: 'ponto' as const, visivel: !ocultas.has('destaque') }] : []),
    ...(regressao ? [{ chave: 'regressao', rotulo: rotuloRegressao, cor: 'var(--graf-texto)', forma: 'linha' as const, tracejada: true, visivel: !ocultas.has('regressao') }] : []),
  ];

  const tabela = () => {
    const colunas: Coluna<DadoGrafico>[] = [
      ...(chaveRotulo ? [{ campo: chaveRotulo, rotulo: 'Ponto' }] : []),
      { campo: chaveX, rotulo: tituloDoEixo(eixoX) || chaveX, alinhamento: 'direita', formato: (v) => formatarValor(lerNumero(v), { ...eixoX, unidade: undefined }) },
      { campo: chaveY, rotulo: tituloDoEixo(eixoY) || chaveY, alinhamento: 'direita', formato: (v) => formatarValor(lerNumero(v), { ...eixoY, unidade: undefined }) },
      ...(chaveDestaque ? [{ campo: chaveDestaque, rotulo: rotuloDestaque, formato: (v: unknown) => (v ? 'Sim' : 'Não') }] : []),
    ];
    return { colunas, registros: dados };
  };

  return (
    <MolduraGrafico {...props} semDados={dados.length === 0} itensLegenda={itens} aoAlternarSerie={(c) => alternar(c, itens.length)} tabela={tabela}>
      {(largura) => <PlanoDispersao {...props} largura={largura} ocultas={ocultas} />}
    </MolduraGrafico>
  );
}

function PlanoDispersao({
  titulo,
  descricao,
  altura = 280,
  dados,
  eixoX,
  eixoY,
  chaveX,
  chaveY,
  chaveRotulo,
  chaveDestaque,
  regressao,
  animacao,
  largura,
  ocultas,
}: GraficoDispersaoProps & { largura: number; ocultas: ReadonlySet<string> }) {
  const todos: Ponto[] = [];
  dados.forEach((d, indice) => {
    const x = lerNumero(d[chaveX]);
    const y = lerNumero(d[chaveY]);
    if (x === null || y === null) return;
    todos.push({ indice, x, y, destaque: !!(chaveDestaque && d[chaveDestaque]), rotulo: chaveRotulo ? String(d[chaveRotulo] ?? '') : `Ponto ${indice + 1}` });
  });
  // o teclado anda da esquerda para a direita
  todos.sort((a, b) => a.x - b.x || a.y - b.y);
  const visiveis = todos.filter((p) => !ocultas.has(p.destaque ? 'destaque' : 'pontos'));
  const { ativo, setAtivo, aoTeclar } = usePontoAtivo(visiveis.length);
  const [focado, setFocado] = useState(false);
  const reta = regressao ? regressaoLinear(todos) : null;

  const tituloX = tituloDoEixo(eixoX);
  const tituloY = tituloDoEixo(eixoY);
  const topo = tituloY ? 24 : 10;
  const baixo = tituloX ? 42 : 26;
  const y0 = topo;
  const y1 = altura - baixo;
  const domY = dominioDoEixo(
    todos.map((p) => p.y),
    eixoY,
    Math.max(2, Math.round((y1 - y0) / 50)),
    false,
  );
  const rotulosY = domY.passos.map((p) => formatarPasso(p, eixoY));
  const x0 = Math.max(28, Math.max(...rotulosY.map((r) => larguraTexto(r))) + 12);
  const x1 = largura - 12;
  const domX = dominioDoEixo(
    todos.map((p) => p.x),
    eixoX,
    Math.max(2, Math.floor((x1 - x0) / 80)),
    false,
  );
  const escX = escalaLinear(domX, x0, x1);
  const escY = escalaLinear(domY, y1, y0);

  const detalhe = (p: Ponto): LinhaDetalhe[] => [
    { chave: 'x', rotulo: eixoX?.rotulo ?? chaveX, cor: p.destaque ? 'var(--graf-2)' : 'var(--graf-1)', forma: 'ponto', valor: formatarValor(p.x, eixoX) },
    { chave: 'y', rotulo: eixoY?.rotulo ?? chaveY, cor: p.destaque ? 'var(--graf-2)' : 'var(--graf-1)', forma: 'ponto', valor: formatarValor(p.y, eixoY) },
  ];

  const maisPerto = (e: PointerEvent<HTMLDivElement>): number | null => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    let melhor: number | null = null;
    let dist = 32 * 32;
    visiveis.forEach((p, i) => {
      const d = (escX(p.x) - px) ** 2 + (escY(p.y) - py) ** 2;
      if (d < dist) {
        dist = d;
        melhor = i;
      }
    });
    return melhor;
  };

  // reta presa ao retângulo do gráfico
  let segmento: [number, number, number, number] | null = null;
  if (reta && !ocultas.has('regressao')) {
    const yDe = (x: number) => reta.inclinacao * x + reta.intercepto;
    const xDe = (y: number) => (y - reta.intercepto) / reta.inclinacao;
    let xa = domX.de;
    let xb = domX.ate;
    if (reta.inclinacao !== 0) {
      const xMin = xDe(domY.de);
      const xMax = xDe(domY.ate);
      xa = Math.max(xa, Math.min(xMin, xMax));
      xb = Math.min(xb, Math.max(xMin, xMax));
    }
    if (xb > xa) segmento = [escX(xa), escY(yDe(xa)), escX(xb), escY(yDe(xb))];
  }
  const estat = reta ? `r = ${DUAS.format(reta.r)} · r² = ${DUAS.format(reta.r2)} · n = ${reta.n}` : '';
  const p = ativo === null ? null : visiveis[ativo];

  return (
    <>
      <div
        className="lp-graf-plot"
        role="img"
        aria-label={[titulo, descricao, estat].filter(Boolean).join('. ')}
        tabIndex={0}
        onPointerMove={(e) => setAtivo(maisPerto(e))}
        onPointerDown={(e) => setAtivo(maisPerto(e))}
        onPointerLeave={() => !focado && setAtivo(null)}
        onKeyDown={aoTeclar}
        onFocus={() => {
          setFocado(true);
          if (ativo === null && visiveis.length) setAtivo(0);
        }}
        onBlur={() => {
          setFocado(false);
          setAtivo(null);
        }}
      >
        <svg className="lp-graf-svg" width={largura} height={altura} aria-hidden="true">
          {domY.passos.map((v, i) => (
            <g key={`y${v}`}>
              <line className="lp-graf-grade" x1={x0} x2={x1} y1={escY(v)} y2={escY(v)} />
              <text className="lp-graf-texto" x={x0 - 6} y={escY(v) + 4} textAnchor="end">
                {rotulosY[i]}
              </text>
            </g>
          ))}
          {domX.passos.map((v, i) => {
            const texto = formatarPasso(v, eixoX);
            return (
              <g key={`x${v}`}>
                <line className="lp-graf-grade" x1={escX(v)} x2={escX(v)} y1={y0} y2={y1} />
                <text className="lp-graf-texto" x={escX(v)} y={y1 + 17} textAnchor={i === domX.passos.length - 1 ? 'end' : 'middle'}>
                  {texto}
                </text>
              </g>
            );
          })}
          <line className="lp-graf-eixo" x1={x0} x2={x1} y1={y1} y2={y1} />
          <line className="lp-graf-eixo" x1={x0} x2={x0} y1={y0} y2={y1} />
          {domY.de < 0 && domY.ate > 0 && <line className="lp-graf-zero" x1={x0} x2={x1} y1={escY(0)} y2={escY(0)} />}
          {tituloY && (
            <text className="lp-graf-texto lp-graf-texto--eixo" x={0} y={12}>
              {tituloY}
            </text>
          )}
          {tituloX && (
            <text className="lp-graf-texto lp-graf-texto--eixo" x={x1} y={altura - 4} textAnchor="end">
              {tituloX}
            </text>
          )}
          {segmento && <line className="lp-graf-ref lp-graf-regressao lp-graf-depois" x1={segmento[0]} y1={segmento[1]} x2={segmento[2]} y2={segmento[3]} />}
          {visiveis.map((v, i) => (
            <circle
              key={v.indice}
              className="lp-graf-ponto lp-graf-ponto-disp"
              // na entrada animada, os pontos surgem da esquerda para a direita
              style={animacao ? { animationDelay: `${Math.round((i / Math.max(1, visiveis.length - 1)) * 350)}ms` } : undefined}
              cx={escX(v.x)}
              cy={escY(v.y)}
              r={i === ativo ? 6 : v.destaque ? 5 : 4.5}
              fill={v.destaque ? 'var(--graf-2)' : 'var(--graf-1)'}
            />
          ))}
          {estat && !ocultas.has('regressao') && (
            <text className="lp-graf-estat lp-graf-depois" x={x1 - 4} y={y0 + 14} textAnchor="end">
              {estat}
            </text>
          )}
        </svg>
        {p && <CaixaDetalhes x={escX(p.x)} y={Math.max(4, Math.min(altura - 80, escY(p.y) - 30))} largura={largura} titulo={p.rotulo} linhas={detalhe(p)} />}
      </div>
      <div className="lp-sr" aria-live="polite">
        {p ? textoDetalhe(p.rotulo, detalhe(p)) : ''}
      </div>
    </>
  );
}
