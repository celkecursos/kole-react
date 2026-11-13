import { useState, type MouseEvent } from 'react';
import { cx } from '../../utils/cx';
import type { Coluna } from '../Tabela/Tabela';
import { lerNumero } from './escalas';
import { Amostra, MolduraGrafico, corDaSerie, usePontoAtivo, useSeriesOcultas } from './MolduraGrafico';
import type { DadoGrafico, GraficoBaseProps } from './tipos';
import './GraficoRosca.css';

export interface GraficoRoscaProps extends GraficoBaseProps {
  /** Cada item é uma fatia. Valores zero, negativos ou sem dado ficam de fora. */
  dados: DadoGrafico[];
  /** Campo com o nome da fatia (ex.: a categoria). */
  chaveRotulo: string;
  chaveValor: string;
  /** Campo com a cor de cada fatia (padrão: `--graf-1`, `--graf-2`… na ordem). */
  chaveCor?: string;
  /** Formata os valores (padrão: número pt-BR). Ex.: `(v) => formatarMoeda(v)`. */
  formatar?: (valor: number) => string;
  /** Texto do meio quando nenhuma fatia está ativa. Padrão: "Total" e a soma das visíveis. */
  centro?: { rotulo?: string; valor?: string };
  /**
   * Junta as menores numa fatia "Outros" a partir desta quantidade (ex.: `6`
   * mostra as 5 maiores e "Outros"). Sem ela, mostra todas.
   */
  maxFatias?: number;
  rotuloOutros?: string;
  /** Espessura do anel, em fração do raio (0,1 a 0,9). Padrão `0.32`. */
  espessura?: number;
  /** Legenda ao lado (`lado`, se couber) ou `abaixo`. Padrão `lado`. */
  posicaoLegenda?: 'lado' | 'abaixo';
  /** Clique numa fatia (ex.: filtrar os lançamentos da categoria). */
  aoEscolher?: (item: DadoGrafico, indice: number) => void;
}

interface Fatia {
  chave: string;
  rotulo: string;
  valor: number;
  cor: string;
  /** Índice em `dados` (-1 = "Outros"). */
  indice: number;
}

const NUM = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const PCT = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const TAU = Math.PI * 2;
/** Abaixo desta largura, a legenda desce para baixo do anel. */
const LARGURA_LADO = 460;

function fatiasDe({ dados, chaveRotulo, chaveValor, chaveCor, maxFatias, rotuloOutros = 'Outros' }: GraficoRoscaProps): Fatia[] {
  const todas: Fatia[] = [];
  dados.forEach((d, indice) => {
    const v = lerNumero(d[chaveValor]);
    if (v === null || v <= 0) return;
    const cor = chaveCor && typeof d[chaveCor] === 'string' ? (d[chaveCor] as string) : corDaSerie(indice);
    todas.push({ chave: `f${indice}`, rotulo: String(d[chaveRotulo] ?? ''), valor: v, cor, indice });
  });
  if (!maxFatias || todas.length <= maxFatias) return todas;
  const ordenadas = [...todas].sort((a, b) => b.valor - a.valor);
  const ficam = ordenadas.slice(0, Math.max(1, maxFatias - 1));
  const resto = ordenadas.slice(ficam.length);
  // mantém a ordem original entre as que ficam
  const visiveis = todas.filter((f) => ficam.includes(f));
  return [...visiveis, { chave: 'outros', rotulo: rotuloOutros, valor: resto.reduce((s, f) => s + f.valor, 0), cor: 'var(--graf-texto)', indice: -1 }];
}

/** Ponto no círculo; ângulo 0 = topo, sentido horário. */
const ponto = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const;

function arco(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  // círculo inteiro: dois meios arcos (um arco SVG de 360° não desenha)
  if (a1 - a0 >= TAU - 1e-6) {
    const m = a0 + Math.PI;
    return `${arco(cx, cy, r0, r1, a0, m)} ${arco(cx, cy, r0, r1, m, a0 + TAU)}`;
  }
  const grande = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = ponto(cx, cy, r1, a0);
  const [x1, y1] = ponto(cx, cy, r1, a1);
  const [x2, y2] = ponto(cx, cy, r0, a1);
  const [x3, y3] = ponto(cx, cy, r0, a0);
  return `M${x0} ${y0} A${r1} ${r1} 0 ${grande} 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${grande} 0 ${x3} ${y3}Z`;
}

/** Participação de cada parte num todo (despesas por categoria, carteira, canais de venda). */
export function GraficoRosca(props: GraficoRoscaProps) {
  const { formatar = (v: number) => NUM.format(v), chaveRotulo, chaveValor } = props;
  const [ocultas, alternar] = useSeriesOcultas();
  const fatias = fatiasDe(props);
  const total = fatias.reduce((s, f) => s + f.valor, 0);

  const tabela = () => {
    const colunas: Coluna<DadoGrafico>[] = [
      { campo: 'rotulo', rotulo: chaveRotulo === 'rotulo' ? 'Item' : chaveRotulo[0].toUpperCase() + chaveRotulo.slice(1) },
      { campo: 'valor', rotulo: chaveValor === 'valor' ? 'Valor' : chaveValor[0].toUpperCase() + chaveValor.slice(1), alinhamento: 'direita', formato: (v) => formatar(v as number) },
      { campo: 'parte', rotulo: 'Participação', alinhamento: 'direita', formato: (v) => PCT.format(v as number) },
    ];
    return { colunas, registros: fatias.map((f) => ({ rotulo: f.rotulo, valor: f.valor, parte: f.valor / total })) };
  };

  return (
    // a legenda é própria (com valor e %): a da moldura fica desligada
    <MolduraGrafico {...props} semDados={fatias.length === 0} itensLegenda={[]} tabela={tabela}>
      {(largura) => <Anel {...props} formatar={formatar} largura={largura} fatias={fatias} ocultas={ocultas} alternar={(c) => alternar(c, fatias.length)} />}
    </MolduraGrafico>
  );
}

function Anel({
  titulo,
  descricao,
  altura = 240,
  legenda = true,
  centro,
  espessura = 0.32,
  posicaoLegenda = 'lado',
  aoEscolher,
  dados,
  formatar,
  largura,
  fatias,
  ocultas,
  alternar,
}: GraficoRoscaProps & {
  formatar: (v: number) => string;
  largura: number;
  fatias: Fatia[];
  ocultas: ReadonlySet<string>;
  alternar: (chave: string) => void;
}) {
  const visiveis = fatias.filter((f) => !ocultas.has(f.chave));
  const { ativo, setAtivo, aoTeclar } = usePontoAtivo(visiveis.length);
  const [focado, setFocado] = useState(false);
  const total = visiveis.reduce((s, f) => s + f.valor, 0);

  const aoLado = legenda && posicaoLegenda === 'lado' && largura >= LARGURA_LADO;
  const lado = Math.max(120, Math.min(altura, aoLado ? largura * 0.45 : largura));
  const c = lado / 2;
  const r1 = c - 6;
  const r0 = r1 * (1 - Math.min(0.9, Math.max(0.1, espessura)));

  // ângulos acumulados; uma fresta mínima separa as fatias
  let acc = 0;
  const arcos = visiveis.map((f) => {
    const a0 = (acc / total) * TAU;
    acc += f.valor;
    return { ...f, a0, a1: (acc / total) * TAU };
  });

  const naPosicao = (e: MouseEvent<HTMLDivElement>): number | null => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left - c;
    const y = e.clientY - r.top - c;
    const d = Math.hypot(x, y);
    if (d < r0 - 4 || d > r1 + 8) return null;
    let a = Math.atan2(x, -y);
    if (a < 0) a += TAU;
    const i = arcos.findIndex((f) => a >= f.a0 && a < f.a1);
    return i < 0 ? null : i;
  };

  const f = ativo === null ? null : arcos[ativo];
  const parte = (v: number) => PCT.format(total ? v / total : 0);
  const textoAtivo = f ? `${f.rotulo}: ${formatar(f.valor)}, ${parte(f.valor)}` : '';
  const resumo = [titulo, descricao, `Total ${formatar(total)}`, ...arcos.map((a) => `${a.rotulo} ${parte(a.valor)}`)].filter(Boolean).join('. ');

  return (
    <div className={cx('lp-rosca', aoLado ? 'lp-rosca--lado' : 'lp-rosca--abaixo')}>
      <div
        className={cx('lp-graf-plot', 'lp-rosca-plot', aoEscolher && f && 'is-clicavel')}
        style={{ width: lado, height: lado }}
        role="img"
        aria-label={resumo}
        tabIndex={0}
        onPointerMove={(e) => setAtivo(naPosicao(e))}
        onPointerDown={(e) => setAtivo(naPosicao(e))}
        onPointerLeave={() => !focado && setAtivo(null)}
        onClick={(e) => {
          const i = naPosicao(e);
          const alvo = i === null ? null : arcos[i];
          if (alvo && alvo.indice >= 0) aoEscolher?.(dados[alvo.indice], alvo.indice);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && f && f.indice >= 0 && aoEscolher) {
            e.preventDefault();
            aoEscolher(dados[f.indice], f.indice);
            return;
          }
          aoTeclar(e);
        }}
        onFocus={() => {
          setFocado(true);
          if (ativo === null && visiveis.length) setAtivo(0);
        }}
        onBlur={() => {
          setFocado(false);
          setAtivo(null);
        }}
      >
        <svg className="lp-graf-svg lp-rosca-svg" width={lado} height={lado} aria-hidden="true">
          <g className="lp-rosca-fatias" style={{ transformOrigin: `${c}px ${c}px` }}>
            {arcos.map((a, i) => (
              <path
                key={a.chave}
                className={cx('lp-rosca-fatia', ativo !== null && i !== ativo && 'is-apagada')}
                d={arco(c, c, i === ativo ? r0 - 2 : r0, i === ativo ? r1 + 5 : r1, a.a0, a.a1)}
                fill={a.cor}
              />
            ))}
          </g>
        </svg>
        <div className="lp-rosca-centro" aria-hidden="true" style={{ width: r0 * 1.6 }}>
          <span className="lp-rosca-centro-rotulo">{f ? f.rotulo : centro?.rotulo ?? 'Total'}</span>
          <span className="lp-rosca-centro-valor">{f ? formatar(f.valor) : centro?.valor ?? formatar(total)}</span>
          {f && <span className="lp-rosca-centro-parte">{parte(f.valor)}</span>}
        </div>
      </div>
      {legenda && (
        <ul className="lp-rosca-legenda" aria-label={`Fatias de ${titulo}`}>
          {fatias.map((fatia) => {
            const oculta = ocultas.has(fatia.chave);
            const i = arcos.findIndex((a) => a.chave === fatia.chave);
            return (
              <li key={fatia.chave}>
                <button
                  type="button"
                  className={cx('lp-rosca-leg-item', oculta && 'is-oculta', i >= 0 && i === ativo && 'is-ativa')}
                  aria-pressed={!oculta}
                  title={oculta ? 'Mostrar a fatia' : 'Esconder a fatia'}
                  onClick={() => alternar(fatia.chave)}
                  onPointerEnter={() => i >= 0 && setAtivo(i)}
                  onPointerLeave={() => !focado && setAtivo(null)}
                >
                  <Amostra cor={fatia.cor} forma="ponto" />
                  <span className="lp-rosca-leg-rotulo">{fatia.rotulo}</span>
                  <span className="lp-rosca-leg-valor">{formatar(fatia.valor)}</span>
                  <span className="lp-rosca-leg-parte">{oculta ? '—' : parte(fatia.valor)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="lp-sr" aria-live="polite">
        {textoAtivo}
      </div>
    </div>
  );
}
