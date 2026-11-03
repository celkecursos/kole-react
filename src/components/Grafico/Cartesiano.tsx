import { useState, type PointerEvent, type ReactNode } from 'react';
import type { Coluna } from '../Tabela/Tabela';
import {
  dominioDoEixo,
  dominioRedondo,
  escalaBanda,
  escalaLinear,
  formatarPasso,
  formatarValor,
  larguraTexto,
  lerNumero,
  posicaoX,
  rotulosACadaN,
  rotulosDoEixoX,
  rotulosQueCabem,
  type EscalaLinear,
} from './escalas';
import {
  CaixaDetalhes,
  MolduraGrafico,
  corDaSerie,
  textoDetalhe,
  usePontoAtivo,
  useSeriesOcultas,
  type ItemLegenda,
  type LinhaDetalhe,
} from './MolduraGrafico';
import type {
  DadoGrafico,
  EixoGrafico,
  EixoXGrafico,
  FaixaGrafico,
  GraficoBaseProps,
  ReferenciaGrafico,
  SerieGrafico,
  ValorGrafico,
} from './tipos';

export interface SerieCartesiana extends SerieGrafico {
  tipo: 'linha' | 'barra';
}

export interface CartesianoProps extends GraficoBaseProps {
  dados: DadoGrafico[];
  eixoX: EixoXGrafico;
  eixoY?: EixoGrafico;
  eixoYDireito?: EixoGrafico;
  series: SerieCartesiana[];
  orientacao?: 'vertical' | 'horizontal';
  pontos?: boolean;
  area?: boolean;
  referencias?: ReferenciaGrafico[];
  faixas?: FaixaGrafico[];
  divergente?: boolean;
  rotulosNasBarras?: boolean;
}

type Lado = 'esquerdo' | 'direito';

const ROTULO_X_PADRAO: Record<EixoXGrafico['tipo'], string> = { categoria: 'Categoria', data: 'Data', numero: 'Valor' };
const NUM = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

/** "Vendas (mil R$)" · "Vendas" · "mil R$". */
function tituloDoEixo(eixo?: EixoGrafico): string {
  if (!eixo) return '';
  if (eixo.rotulo && eixo.unidade) return `${eixo.rotulo} (${eixo.unidade})`;
  return eixo.rotulo ?? eixo.unidade ?? '';
}

/** Caminho SVG com falhas nos `null`: cada trecho contínuo começa com um `M`. */
function caminho(pontos: Array<[number, number] | null>): string {
  let d = '';
  let novo = true;
  for (const p of pontos) {
    if (!p) {
      novo = true;
      continue;
    }
    d += `${novo ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    novo = false;
  }
  return d;
}

/** Trechos contínuos (sem `null`), para a área e para os pontos isolados. */
function trechos(pontos: Array<[number, number] | null>): Array<Array<[number, number]>> {
  const lista: Array<Array<[number, number]>> = [];
  let atual: Array<[number, number]> = [];
  for (const p of pontos) {
    if (p) atual.push(p);
    else if (atual.length) {
      lista.push(atual);
      atual = [];
    }
  }
  if (atual.length) lista.push(atual);
  return lista;
}

/**
 * Rótulo de categoria em até duas linhas de no máximo `maximo` px, quebrando nas
 * palavras. Só corta (com "…") o que não couber nem em duas linhas.
 */
function quebrarRotulo(texto: string, maximo: number): string[] {
  if (larguraTexto(texto) <= maximo) return [texto];
  const cabe = Math.max(2, Math.floor(maximo / larguraTexto('m')));
  const palavras = texto.split(' ');
  let primeira = '';
  while (palavras.length && larguraTexto(primeira ? `${primeira} ${palavras[0]}` : palavras[0]) <= maximo) {
    primeira = primeira ? `${primeira} ${palavras.shift()}` : (palavras.shift() ?? '');
  }
  if (!primeira) {
    const palavra = palavras.shift() ?? '';
    primeira = palavra.length > cabe ? `${palavra.slice(0, cabe - 1)}…` : palavra;
  }
  const resto = palavras.join(' ');
  if (!resto) return [primeira];
  return [primeira, resto.length > cabe ? `${resto.slice(0, cabe - 1)}…` : resto];
}

/** Texto do eixo X sem sair do SVG nas pontas. */
function ancoraNaBorda(x: number, texto: string, largura: number): 'start' | 'middle' | 'end' {
  const meia = larguraTexto(texto) / 2;
  if (x - meia < 0) return 'start';
  if (x + meia > largura) return 'end';
  return 'middle';
}

/**
 * Motor comum de `GraficoLinha`, `GraficoBarras` e `GraficoCombinado`: eixo X por
 * categoria (faixas), data ou número, um ou dois eixos Y, barras agrupadas e linhas.
 */
export function Cartesiano(props: CartesianoProps) {
  const { dados, eixoX, eixoY, eixoYDireito, series } = props;
  const [ocultas, alternar] = useSeriesOcultas();
  const temDireito = !!eixoYDireito;
  const ladoDe = (s: SerieCartesiana): Lado => (!temDireito ? 'esquerdo' : (s.eixo ?? (s.tipo === 'barra' ? 'esquerdo' : 'direito')));
  const eixoDe = (lado: Lado) => (lado === 'direito' ? eixoYDireito : eixoY);
  const { completos } = rotulosDoEixoX(
    dados.map((d) => d[eixoX.chave]),
    eixoX,
  );

  const itensLegenda: ItemLegenda[] = series.map((s, i) => {
    const lado = ladoDe(s);
    const unidade = eixoDe(lado)?.unidade;
    const sufixo = temDireito ? ` (${unidade ? `${unidade}, ` : ''}eixo ${lado})` : '';
    return {
      chave: s.chave,
      rotulo: s.rotulo + sufixo,
      cor: props.divergente && s.tipo === 'barra' ? 'var(--graf-pos)' : corDaSerie(i, s.cor),
      forma: s.tipo === 'barra' ? 'barra' : 'linha',
      tracejada: s.tracejada,
      visivel: !ocultas.has(s.chave),
    };
  });

  const tabela = () => {
    const colunas: Coluna<DadoGrafico>[] = [
      { campo: '__x', rotulo: eixoX.rotulo ?? ROTULO_X_PADRAO[eixoX.tipo] },
      ...series.map((s) => {
        const eixo = eixoDe(ladoDe(s));
        return {
          campo: s.chave,
          rotulo: eixo?.unidade ? `${s.rotulo} (${eixo.unidade})` : s.rotulo,
          alinhamento: 'direita' as const,
          formato: (v: unknown) => formatarValor(lerNumero(v), { ...eixo, unidade: undefined }),
        };
      }),
    ];
    return { colunas, registros: dados.map((d, i) => ({ ...d, __x: completos[i] })) };
  };

  return (
    <MolduraGrafico
      {...props}
      semDados={dados.length === 0 || series.length === 0}
      itensLegenda={itensLegenda}
      aoAlternarSerie={(chave) => alternar(chave, series.length)}
      tabela={tabela}
    >
      {(largura) => <Plano {...props} largura={largura} ocultas={ocultas} ladoDe={ladoDe} completos={completos} />}
    </MolduraGrafico>
  );
}

interface PlanoProps extends CartesianoProps {
  largura: number;
  ocultas: ReadonlySet<string>;
  ladoDe: (s: SerieCartesiana) => Lado;
  completos: string[];
}

function Plano({
  titulo,
  descricao,
  altura: alturaPedida = 280,
  dados,
  eixoX,
  eixoY,
  eixoYDireito,
  series,
  orientacao = 'vertical',
  pontos,
  area,
  referencias = [],
  faixas = [],
  divergente,
  rotulosNasBarras,
  largura,
  ocultas,
  ladoDe,
  completos,
}: PlanoProps) {
  const n = dados.length;
  const { ativo, setAtivo, aoTeclar } = usePontoAtivo(n);
  const [focado, setFocado] = useState(false);
  const horizontal = orientacao === 'horizontal';
  const indiceCor = new Map(series.map((s, i) => [s.chave, i]));
  const visiveis = series.filter((s) => !ocultas.has(s.chave));
  const barras = visiveis.filter((s) => s.tipo === 'barra');
  const linhas = visiveis.filter((s) => s.tipo === 'linha');
  const usaBanda = horizontal || series.some((s) => s.tipo === 'barra') || eixoX.tipo === 'categoria';
  const eixoDe = (lado: Lado) => (lado === 'direito' ? eixoYDireito : eixoY);
  const valor = (s: SerieGrafico, i: number): ValorGrafico => lerNumero(dados[i][s.chave]);
  const corDe = (s: SerieCartesiana, v?: ValorGrafico) =>
    divergente && s.tipo === 'barra' ? (v !== null && v !== undefined && v < 0 ? 'var(--graf-neg)' : 'var(--graf-pos)') : corDaSerie(indiceCor.get(s.chave) ?? 0, s.cor);
  const { curtos } = rotulosDoEixoX(
    dados.map((d) => d[eixoX.chave]),
    eixoX,
  );

  // ---- domínios dos eixos de valor ----
  const valoresDo = (lado: Lado) => {
    const v: number[] = [];
    for (const s of visiveis) {
      if (ladoDe(s) !== lado) continue;
      for (let i = 0; i < n; i++) {
        const x = valor(s, i);
        if (x !== null) v.push(x);
      }
    }
    for (const r of referencias) if ((r.eixo ?? 'esquerdo') === lado) v.push(r.valor);
    return v;
  };
  const primeiraLinha = linhas[0];
  const comZero = (lado: Lado) => barras.some((s) => ladoDe(s) === lado) || (!!area && !!primeiraLinha && ladoDe(primeiraLinha) === lado);

  const tituloEsq = tituloDoEixo(eixoY);
  const tituloDir = tituloDoEixo(eixoYDireito);
  const topo = tituloEsq || tituloDir ? 24 : 10;
  // categorias no eixo X: o nome que não cabe numa linha quebra em duas, em vez de
  // sumir (pular nomes esconde de qual categoria é cada barra); datas e números pulam
  const passoEstimado = (largura - 90) / Math.max(1, n);
  const quebrados =
    !horizontal && eixoX.tipo === 'categoria' && curtos.some((c) => larguraTexto(c) > passoEstimado - 6)
      ? curtos.map((c) => quebrarRotulo(c, passoEstimado - 6))
      : null;
  // abaixo de ~3 letras por faixa, nem abreviado dá para ler: aí pula nomes, como nas datas
  const quebraCabe = !!quebrados && passoEstimado >= larguraTexto('mmm') + 6;
  const baixo = quebraCabe ? 40 : 26;
  // ranking: rótulo longo quebra em duas linhas, e a faixa cresce para caber
  const limiteRotulo = largura * 0.5 - 12;
  const rotulosCat = horizontal ? curtos.map((c) => quebrarRotulo(c, limiteRotulo)) : [];
  const quebrou = rotulosCat.some((r) => r.length > 1);
  const altura = horizontal ? Math.max(alturaPedida, n * (quebrou ? 36 : 24) + topo + baixo) : alturaPedida;
  const alvoY = Math.max(2, Math.round((altura - topo - baixo) / 50));

  let x0: number;
  let x1: number;
  const y0 = topo;
  const y1 = altura - baixo;
  let escE: EscalaLinear;
  let escD: EscalaLinear | null = null;
  const rotuloE: string[] = [];

  if (horizontal) {
    const maiorCat = Math.max(0, ...rotulosCat.flat().map((c) => larguraTexto(c)));
    x0 = Math.min(maiorCat + 12, largura * 0.5);
    const valores = valoresDo('esquerdo');
    const maiorValor = rotulosNasBarras ? Math.max(0, ...valores.map((v) => larguraTexto(formatarValor(v, { ...eixoY, unidade: undefined })))) + 8 : 0;
    x1 = largura - Math.max(14, maiorValor);
    // menos passos quando os rótulos (ex.: "R$ 40.000") não cabem entre eles
    let alvo = Math.max(2, Math.floor((x1 - x0) / 60));
    let dom = dominioDoEixo(valores, eixoY, alvo, true);
    const largo = (d: typeof dom) => Math.max(...d.passos.map((p) => larguraTexto(formatarPasso(p, eixoY))));
    while (alvo > 2 && (x1 - x0) / Math.max(1, dom.passos.length - 1) < largo(dom) + 16) dom = dominioDoEixo(valores, eixoY, --alvo, true);
    escE = escalaLinear(dom, x0, x1);
  } else {
    const domE = dominioDoEixo(valoresDo('esquerdo'), eixoY, alvoY, comZero('esquerdo'));
    domE.passos.forEach((p) => rotuloE.push(formatarPasso(p, eixoY)));
    x0 = Math.max(28, Math.max(...rotuloE.map((r) => larguraTexto(r))) + 12);
    if (eixoYDireito) {
      const domD = dominioDoEixo(valoresDo('direito'), eixoYDireito, alvoY, comZero('direito'));
      const maior = Math.max(...domD.passos.map((p) => larguraTexto(formatarPasso(p, eixoYDireito))));
      x1 = largura - Math.max(28, maior + 12);
      escD = escalaLinear(domD, y1, y0);
    } else {
      x1 = largura - 12;
    }
    escE = escalaLinear(domE, y1, y0);
  }
  const escalaDo = (lado: Lado) => (lado === 'direito' && escD ? escD : escE);
  /** Valor 0 preso ao domínio: base das barras e da área. */
  const base = (esc: EscalaLinear) => esc(Math.min(esc.ate, Math.max(esc.de, 0)));

  // ---- eixo das categorias (X na vertical, Y na horizontal) ----
  const banda = horizontal ? escalaBanda(n, y0, y1, 0.25) : escalaBanda(n, x0, x1, barras.length ? 0.2 : 0);
  const xsLineares = !usaBanda ? dados.map((d) => posicaoX(d[eixoX.chave], eixoX.tipo)) : [];
  const xsValidos = xsLineares.filter((v): v is number => v !== null);
  const escX = !usaBanda && xsValidos.length ? escalaLinear({ de: Math.min(...xsValidos), ate: Math.max(...xsValidos), passos: [] }, x0, x1) : null;
  const posX = (i: number): number | null => {
    if (usaBanda) return banda.centro(i);
    const v = xsLineares[i];
    return v === null || !escX ? null : escX.de === escX.ate ? (x0 + x1) / 2 : escX(v);
  };

  const marcasX: Array<{ x: number; texto: string; linhas?: string[] }> = [];
  if (!horizontal) {
    if (quebraCabe && quebrados) {
      quebrados.forEach((l, i) => marcasX.push({ x: banda.centro(i), texto: curtos[i], linhas: l }));
    } else if (usaBanda) {
      for (const i of rotulosACadaN(banda.passo, curtos)) marcasX.push({ x: banda.centro(i), texto: curtos[i] });
    } else if (eixoX.tipo === 'numero' && escX && !eixoX.formatar) {
      const passos = dominioRedondo(escX.de, escX.ate, Math.max(2, Math.floor((x1 - x0) / 80))).passos.filter((p) => p >= escX.de && p <= escX.ate);
      for (const p of passos) marcasX.push({ x: escX(p), texto: NUM.format(p) });
    } else {
      const pos = dados.map((_, i) => posX(i) ?? -Infinity);
      for (const i of rotulosQueCabem(pos, curtos)) marcasX.push({ x: pos[i], texto: curtos[i] });
    }
  }

  // ---- faixas sombreadas no eixo X ----
  const indicePorValor = (v: string | number) => dados.findIndex((d) => String(d[eixoX.chave]) === String(v));
  const retFaixas = horizontal
    ? []
    : faixas.flatMap((f) => {
        let a: number | null;
        let b: number | null;
        if (usaBanda) {
          const i = indicePorValor(f.de);
          const j = indicePorValor(f.ate);
          if (i < 0 || j < 0) return [];
          a = banda.centro(Math.min(i, j)) - banda.passo / 2;
          b = banda.centro(Math.max(i, j)) + banda.passo / 2;
        } else {
          const pa = posicaoX(f.de, eixoX.tipo);
          const pb = posicaoX(f.ate, eixoX.tipo);
          if (pa === null || pb === null || !escX) return [];
          a = Math.max(x0, Math.min(escX(pa), escX(pb)));
          b = Math.min(x1, Math.max(escX(pa), escX(pb)));
          if (b <= a) return [];
        }
        return [{ x: a, w: b - a, rotulo: f.rotulo }];
      });

  // ---- caixa de detalhes ----
  const linhasDetalhe = (i: number): LinhaDetalhe[] =>
    visiveis.map((s) => {
      const v = valor(s, i);
      return { chave: s.chave, rotulo: s.rotulo, cor: corDe(s, v), forma: s.tipo === 'barra' ? 'barra' : 'linha', valor: formatarValor(v, eixoDe(ladoDe(s))) };
    });

  const indiceNoPonteiro = (e: PointerEvent<HTMLDivElement>): number | null => {
    if (!n) return null;
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    if (horizontal) return py < y0 || py > y1 ? null : banda.indice(py);
    if (px < x0 - 4 || px > x1 + 4) return null;
    if (usaBanda) return banda.indice(px);
    let melhor = -1;
    let dist = Infinity;
    for (let i = 0; i < n; i++) {
      const x = posX(i);
      if (x === null) continue;
      const d = Math.abs(x - px);
      if (d < dist) {
        dist = d;
        melhor = i;
      }
    }
    return melhor < 0 ? null : melhor;
  };

  // eixo de valores na horizontal: em tela estreita, só os rótulos que cabem (a grade fica toda)
  const passosVisiveis = new Set(
    horizontal
      ? rotulosQueCabem(
          escE.passos.map((p) => escE(p)),
          escE.passos.map((p) => formatarPasso(p, eixoY)),
        )
      : [],
  );
  const marcarPontos = pontos ?? n <= 60;
  const nome = descricao ? `${titulo}. ${descricao}` : titulo;
  const desenhos: ReactNode[] = [];

  // barras
  if (barras.length) {
    const k = barras.length;
    const cada = banda.largura / k;
    const folga = k > 1 ? Math.min(2, cada * 0.15) : 0;
    barras.forEach((s, j) => {
      const esc = escalaDo(ladoDe(s));
      const b0 = base(esc);
      for (let i = 0; i < n; i++) {
        const v = valor(s, i);
        if (v === null) continue;
        const pv = esc(v);
        const fim = Math.min(b0, pv);
        const tam = Math.abs(pv - b0);
        const inicio = banda.inicio(i) + j * cada + folga / 2;
        const grossura = Math.max(1, cada - folga);
        const cor = corDe(s, v);
        desenhos.push(
          horizontal ? (
            <rect key={`b${s.chave}${i}`} x={Math.min(b0, pv)} y={inicio} width={tam} height={grossura} rx={1.5} fill={cor} />
          ) : (
            <rect key={`b${s.chave}${i}`} x={inicio} y={fim} width={grossura} height={tam} rx={1.5} fill={cor} />
          ),
        );
        if (rotulosNasBarras) {
          const texto = formatarValor(v, { ...eixoDe(ladoDe(s)), unidade: undefined });
          if (horizontal) {
            desenhos.push(
              <text key={`r${s.chave}${i}`} className="lp-graf-texto" x={v < 0 ? pv - 4 : pv + 4} y={inicio + grossura / 2 + 4} textAnchor={v < 0 ? 'end' : 'start'}>
                {texto}
              </text>,
            );
          } else if (larguraTexto(texto) <= cada + 6) {
            desenhos.push(
              <text key={`r${s.chave}${i}`} className="lp-graf-texto" x={inicio + grossura / 2} y={v < 0 ? pv + 14 : pv - 4} textAnchor="middle">
                {texto}
              </text>,
            );
          }
        }
      }
    });
  }

  // linhas (com área abaixo da primeira e pontos)
  linhas.forEach((s) => {
    const esc = escalaDo(ladoDe(s));
    const cor = corDe(s);
    const pts = dados.map((_, i): [number, number] | null => {
      const v = valor(s, i);
      const x = posX(i);
      return v === null || x === null ? null : [x, esc(v)];
    });
    if (area && s === primeiraLinha) {
      const b0 = base(esc);
      trechos(pts).forEach((t, k) => {
        if (t.length < 2) return;
        const d = `${caminho(t)}L${t[t.length - 1][0].toFixed(1)} ${b0.toFixed(1)}L${t[0][0].toFixed(1)} ${b0.toFixed(1)}Z`;
        desenhos.push(<path key={`a${s.chave}${k}`} className="lp-graf-area-serie" d={d} fill={cor} />);
      });
    }
    desenhos.push(
      <path key={`l${s.chave}`} className="lp-graf-linha" d={caminho(pts)} stroke={cor} strokeDasharray={s.tracejada ? '6 4' : undefined} />,
    );
    // ponto sem vizinhos (entre dois `null`) não vira traço: marca sempre
    trechos(pts).forEach((t, k) => {
      if (marcarPontos || t.length === 1)
        t.forEach(([x, y], m) => desenhos.push(<circle key={`p${s.chave}${k}-${m}`} className="lp-graf-ponto" cx={x} cy={y} r={3} fill={cor} />));
    });
  });

  const xAtivo = ativo === null ? null : horizontal ? null : posX(ativo);

  return (
    <>
    <div
      className="lp-graf-plot"
      role="img"
      aria-label={nome}
      tabIndex={0}
      onPointerMove={(e) => setAtivo(indiceNoPonteiro(e))}
      onPointerDown={(e) => setAtivo(indiceNoPonteiro(e))}
      onPointerLeave={() => !focado && setAtivo(null)}
      onKeyDown={aoTeclar}
      onFocus={() => {
        setFocado(true);
        if (ativo === null) setAtivo(0);
      }}
      onBlur={() => {
        setFocado(false);
        setAtivo(null);
      }}
    >
      <svg className="lp-graf-svg" width={largura} height={altura} aria-hidden="true">
        {retFaixas.map((f, i) => (
          <g key={`f${i}`}>
            <rect className="lp-graf-faixa" x={f.x} y={y0} width={f.w} height={y1 - y0} />
            {f.rotulo && (
              <text className="lp-graf-texto lp-graf-texto--fundo" x={f.x + 4} y={y0 + 13}>
                {f.rotulo}
              </text>
            )}
          </g>
        ))}

        {/* destaque da categoria ativa, atrás dos dados */}
        {ativo !== null && usaBanda && (
          horizontal ? (
            <rect className="lp-graf-mira-faixa" x={x0} y={banda.centro(ativo) - banda.passo / 2} width={x1 - x0} height={banda.passo} />
          ) : (
            <rect className="lp-graf-mira-faixa" x={banda.centro(ativo) - banda.passo / 2} y={y0} width={banda.passo} height={y1 - y0} />
          )
        )}

        {/* grade e rótulos do eixo de valores */}
        {horizontal
          ? escE.passos.map((p, i) => (
              <g key={`g${p}`}>
                <line className="lp-graf-grade" x1={escE(p)} x2={escE(p)} y1={y0} y2={y1} />
                {passosVisiveis.has(i) && (
                  <text className="lp-graf-texto" x={escE(p)} y={y1 + 17} textAnchor={ancoraNaBorda(escE(p), formatarPasso(p, eixoY), largura)}>
                    {formatarPasso(p, eixoY)}
                  </text>
                )}
              </g>
            ))
          : escE.passos.map((p, i) => (
              <g key={`g${p}`}>
                <line className="lp-graf-grade" x1={x0} x2={x1} y1={escE(p)} y2={escE(p)} />
                <text className="lp-graf-texto" x={x0 - 6} y={escE(p) + 4} textAnchor="end">
                  {rotuloE[i]}
                </text>
              </g>
            ))}
        {escD?.passos.map((p) => (
          <text key={`d${p}`} className="lp-graf-texto" x={x1 + 6} y={escD(p) + 4}>
            {formatarPasso(p, eixoYDireito)}
          </text>
        ))}
        {tituloEsq && (
          <text className="lp-graf-texto lp-graf-texto--eixo" x={0} y={12}>
            {tituloEsq}
          </text>
        )}
        {tituloDir && (
          <text className="lp-graf-texto lp-graf-texto--eixo" x={largura} y={12} textAnchor="end">
            {tituloDir}
          </text>
        )}

        {/* eixo das categorias */}
        {horizontal ? (
          <>
            <line className="lp-graf-eixo" x1={x0} x2={x0} y1={y0} y2={y1} />
            {rotulosCat.map((linhasRotulo, i) => (
              <text key={`c${i}`} className="lp-graf-texto" x={x0 - 6} y={banda.centro(i) + 4 - (linhasRotulo.length - 1) * 7} textAnchor="end">
                {linhasRotulo.map((l, k) => (
                  <tspan key={k} x={x0 - 6} dy={k === 0 ? 0 : 14}>
                    {l}
                  </tspan>
                ))}
              </text>
            ))}
          </>
        ) : (
          <>
            <line className="lp-graf-eixo" x1={x0} x2={x1} y1={y1} y2={y1} />
            {marcasX.map((m, i) =>
              m.linhas ? (
                <text key={`x${i}`} className="lp-graf-texto" x={m.x} y={y1 + 17} textAnchor="middle">
                  {m.linhas.map((l, k) => (
                    <tspan key={k} x={m.x} dy={k === 0 ? 0 : 14}>
                      {l}
                    </tspan>
                  ))}
                </text>
              ) : (
                <text key={`x${i}`} className="lp-graf-texto" x={m.x} y={y1 + 17} textAnchor={ancoraNaBorda(m.x, m.texto, largura)}>
                  {m.texto}
                </text>
              ),
            )}
          </>
        )}

        {/* linha do zero: destacada nas divergentes e quando o eixo cruza o zero */}
        {(divergente || (escE.de < 0 && escE.ate > 0)) &&
          (horizontal ? (
            <line className="lp-graf-zero" x1={escE(0)} x2={escE(0)} y1={y0} y2={y1} />
          ) : (
            <line className="lp-graf-zero" x1={x0} x2={x1} y1={escE(0)} y2={escE(0)} />
          ))}

        {desenhos}

        {referencias.map((r, i) => {
          const esc = escalaDo(r.eixo ?? 'esquerdo');
          const p = esc(r.valor);
          return horizontal ? (
            <g key={`ref${i}`}>
              <line className="lp-graf-ref" x1={p} x2={p} y1={y0} y2={y1} />
              <text className="lp-graf-texto lp-graf-texto--fundo" x={p + 4} y={y0 - 4}>
                {r.rotulo}
              </text>
            </g>
          ) : (
            <g key={`ref${i}`}>
              <line className="lp-graf-ref" x1={x0} x2={x1} y1={p} y2={p} />
              <text className="lp-graf-texto lp-graf-texto--fundo" x={x1 - 4} y={p - 5} textAnchor="end">
                {r.rotulo}
              </text>
            </g>
          );
        })}

        {xAtivo !== null && !usaBanda && <line className="lp-graf-mira" x1={xAtivo} x2={xAtivo} y1={y0} y2={y1} />}
        {ativo !== null &&
          xAtivo !== null &&
          linhas.map((s) => {
            const v = valor(s, ativo);
            return v === null ? null : (
              <circle key={`m${s.chave}`} className="lp-graf-ponto" cx={xAtivo} cy={escalaDo(ladoDe(s))(v)} r={4.5} fill={corDe(s)} />
            );
          })}
      </svg>

      {ativo !== null && (
        <CaixaDetalhes
          x={horizontal ? x1 : (xAtivo ?? x0)}
          y={horizontal ? Math.min(altura - 70, banda.centro(ativo) + banda.passo / 2 + 4) : y0}
          largura={largura}
          titulo={completos[ativo]}
          linhas={linhasDetalhe(ativo)}
        />
      )}
    </div>
    {/* fora do role="img", que esconde os filhos do leitor de tela */}
    <div className="lp-sr" aria-live="polite">
      {ativo !== null ? textoDetalhe(completos[ativo], linhasDetalhe(ativo)) : ''}
    </div>
    </>
  );
}
