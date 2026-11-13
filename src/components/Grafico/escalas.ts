import { formatoData, formatoNumero, type Idioma } from '../../i18n/idiomas';
import { textosDe } from '../../i18n/textos';
import { formatDataBr } from '../../utils/datas';
import { formatarNumero } from '../../utils/texto';
import type { EixoGrafico, EixoXGrafico, ValorGrafico } from './tipos';

/* ---------- idioma ---------- */

// O idioma da renderização: cada gráfico registra o do contexto antes de
// desenhar (há um idioma por app, então as funções puras daqui podem lê-lo).
let idioma: Idioma = 'pt-BR';

/** Interno: o gráfico registra o idioma ativo antes de desenhar. */
export function usarIdiomaGrafico(i: Idioma): void {
  idioma = i;
}

/* ---------- números ---------- */

const num = (v: number) => formatoNumero(idioma, { maximumFractionDigits: 2 }).format(v);

/** Valor da caixa de detalhes e da tabela: `1.234,5 mm`. */
export function formatarValor(valor: ValorGrafico | undefined, eixo?: EixoGrafico): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return textosDe(idioma).grafico.semDado;
  const texto = eixo?.formatar ? eixo.formatar(valor) : num(valor);
  return eixo?.unidade ? `${texto} ${eixo.unidade}` : texto;
}

/** Rótulo do eixo: compacto a partir de 10 mil (`12,4 mil`). */
export function formatarPasso(valor: number, eixo?: EixoGrafico): string {
  if (eixo?.formatar) return eixo.formatar(valor);
  return formatarNumero(valor, { compacto: Math.abs(valor) >= 10000, idioma });
}

/** Lê o campo como número; texto, `undefined` e `NaN` viram `null` (sem dado). */
export function lerNumero(valor: unknown): ValorGrafico {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : null;
}

/** Passo "redondo" de 1, 2 ou 5 × 10ⁿ, o mais próximo acima do passo bruto. */
export function passoRedondo(bruto: number): number {
  if (!(bruto > 0)) return 1;
  const base = 10 ** Math.floor(Math.log10(bruto));
  const f = bruto / base;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * base;
}

export interface DominioRedondo {
  de: number;
  ate: number;
  passos: number[];
}

/** Domínio ampliado até múltiplos do passo, com cerca de `alvo` divisões. */
export function dominioRedondo(minimo: number, maximo: number, alvo = 5): DominioRedondo {
  let min = minimo;
  let max = maximo;
  if (min === max) {
    const folga = min === 0 ? 1 : Math.abs(min) * 0.1;
    min -= folga;
    max += folga;
  }
  const passo = passoRedondo((max - min) / Math.max(1, alvo));
  const casas = Math.max(0, -Math.floor(Math.log10(passo)));
  const de = Math.floor(min / passo + 1e-9) * passo;
  const ate = Math.ceil(max / passo - 1e-9) * passo;
  const passos: number[] = [];
  for (let v = de; v <= ate + passo / 2; v += passo) passos.push(Number(v.toFixed(casas)));
  return { de: passos[0], ate: passos[passos.length - 1], passos };
}

export interface EscalaLinear {
  (valor: number): number;
  de: number;
  ate: number;
  passos: number[];
}

/** Escala linear de `[de, ate]` para `[p0, p1]` (em px), com os passos redondos do domínio. */
export function escalaLinear(dominio: DominioRedondo, p0: number, p1: number): EscalaLinear {
  const { de, ate } = dominio;
  const k = ate === de ? 0 : (p1 - p0) / (ate - de);
  const escala = ((v: number) => p0 + (v - de) * k) as EscalaLinear;
  escala.de = de;
  escala.ate = ate;
  escala.passos = dominio.passos;
  return escala;
}

/** Domínio de um eixo Y a partir dos valores, respeitando `minimo`/`maximo` do eixo. */
export function dominioDoEixo(valores: number[], eixo: EixoGrafico | undefined, alvo: number, comZero: boolean): DominioRedondo {
  let min = valores.length ? Math.min(...valores) : 0;
  let max = valores.length ? Math.max(...valores) : 1;
  if (comZero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }
  if (eixo?.minimo !== undefined) min = eixo.minimo;
  if (eixo?.maximo !== undefined) max = eixo.maximo;
  const d = dominioRedondo(min, max, alvo);
  // limite pedido pelo app é exato, sem arredondar para fora
  if (eixo?.minimo === undefined && eixo?.maximo === undefined) return d;
  const de = eixo?.minimo ?? d.de;
  const ate = eixo?.maximo ?? d.ate;
  return { de, ate, passos: d.passos.filter((p) => p >= de - 1e-9 && p <= ate + 1e-9) };
}

/* ---------- categorias ---------- */

export interface EscalaBanda {
  /** Início da faixa do item `i` (px). */
  inicio(i: number): number;
  centro(i: number): number;
  /** Largura útil da faixa (sem o espaço entre faixas). */
  largura: number;
  /** Largura de uma faixa inteira, com o espaço. */
  passo: number;
  /** Item sob a posição em px. */
  indice(px: number): number;
}

/** Uma faixa por item, com `espaco` (0 a 1) de folga entre elas. */
export function escalaBanda(n: number, p0: number, p1: number, espaco = 0.2): EscalaBanda {
  const passo = n > 0 ? (p1 - p0) / n : 0;
  const largura = passo * (1 - espaco);
  return {
    inicio: (i) => p0 + i * passo + (passo - largura) / 2,
    centro: (i) => p0 + i * passo + passo / 2,
    largura,
    passo,
    indice: (px) => Math.min(n - 1, Math.max(0, Math.floor((px - p0) / (passo || 1)))),
  };
}

/* ---------- datas ---------- */

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** `Date`, timestamp ou texto (`aaaa-mm-dd`, `aaaa-mm`, ISO). Texto sem hora é lido no fuso local. */
export function lerData(valor: unknown): Date | null {
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;
  if (typeof valor === 'number') return Number.isFinite(valor) ? new Date(valor) : null;
  if (typeof valor !== 'string') return null;
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(valor);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, m[3] ? Number(m[3]) : 1);
  const t = Date.parse(valor);
  return Number.isNaN(t) ? null : new Date(t);
}

type Granularidade = 'dia' | 'mes' | 'ano';

/** Pela menor distância entre datas seguidas: anual, mensal ou diária. */
function granularidade(datas: Date[]): Granularidade {
  const t = datas.map((d) => d.getTime()).sort((a, b) => a - b);
  let menor = Infinity;
  for (let i = 1; i < t.length; i++) if (t[i] > t[i - 1]) menor = Math.min(menor, t[i] - t[i - 1]);
  const dias = menor / 86_400_000;
  if (!Number.isFinite(dias)) return datas.every((d) => d.getMonth() === 0 && d.getDate() === 1) ? 'ano' : 'dia';
  return dias >= 360 ? 'ano' : dias >= 28 ? 'mes' : 'dia';
}

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Formatadores curto (eixo: `jan/21`) e completo (caixa de detalhes: `jan/2021`) para estas datas. */
export function formatadoresDeData(datas: Date[]): { curto: (d: Date) => string; completo: (d: Date) => string } {
  const g = granularidade(datas);
  if (g === 'ano') return { curto: (d) => String(d.getFullYear()), completo: (d) => String(d.getFullYear()) };
  // pt-BR: jan/26 e 13/11 (como sempre foi); outros idiomas: nome curto do mês e a ordem do Intl
  const ptBR = idioma === 'pt-BR';
  const mes = (d: Date) => (ptBR ? MESES[d.getMonth()] : formatoData(idioma, { month: 'short' }).format(d).replace('.', ''));
  if (g === 'mes') {
    return {
      curto: (d) => `${mes(d)}/${String(d.getFullYear()).slice(2)}`,
      completo: (d) => `${mes(d)}/${d.getFullYear()}`,
    };
  }
  if (!ptBR) {
    return {
      curto: (d) => formatoData(idioma, { day: '2-digit', month: '2-digit' }).format(d),
      completo: (d) => formatoData(idioma, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d),
    };
  }
  return { curto: (d) => `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}`, completo: formatDataBr };
}

/** Rótulos do eixo X (curto) e da caixa de detalhes (completo), um por item. */
export function rotulosDoEixoX(valores: unknown[], eixoX: EixoXGrafico): { curtos: string[]; completos: string[] } {
  if (eixoX.formatar) {
    const f = eixoX.formatar;
    const r = valores.map((v) => (v === null || v === undefined ? '' : f(v as string | number | Date)));
    return { curtos: r, completos: r };
  }
  if (eixoX.tipo === 'data') {
    const datas = valores.map(lerData);
    const { curto, completo } = formatadoresDeData(datas.filter((d): d is Date => !!d));
    return { curtos: datas.map((d) => (d ? curto(d) : '')), completos: datas.map((d) => (d ? completo(d) : '')) };
  }
  if (eixoX.tipo === 'numero') {
    const r = valores.map((v) => (typeof v === 'number' ? num(v) : String(v ?? '')));
    return { curtos: r, completos: r };
  }
  const r = valores.map((v) => String(v ?? ''));
  return { curtos: r, completos: r };
}

/** Valor numérico do eixo X (`data` vira timestamp); `null` se não der para ler. */
export function posicaoX(valor: unknown, tipo: EixoXGrafico['tipo']): number | null {
  if (tipo === 'data') return lerData(valor)?.getTime() ?? null;
  return lerNumero(valor);
}

/* ---------- texto ---------- */

/**
 * Largura aproximada do texto em px (Inter a 12px, com folga). Estimativa fixa: o
 * desenho não depende da fonte já ter carregado, e o teste visual sai sempre igual.
 */
export function larguraTexto(texto: string, tamanho = 12): number {
  return texto.length * tamanho * 0.56;
}

/**
 * Índices cujos rótulos cabem sem se sobrepor, andando da esquerda para a direita
 * (o primeiro sempre entra). `posicoes` em px, na ordem dos itens.
 */
export function rotulosQueCabem(posicoes: number[], rotulos: string[], folga = 10): number[] {
  const escolhidos: number[] = [];
  let fim = -Infinity;
  posicoes.forEach((p, i) => {
    const meia = larguraTexto(rotulos[i]) / 2;
    if (!rotulos[i] || p - meia < fim + folga) return;
    escolhidos.push(i);
    fim = p + meia;
  });
  return escolhidos;
}

/**
 * Um rótulo a cada N itens, com N fixo (para faixas de mesmo tamanho): o mesmo
 * espaçamento do começo ao fim do eixo.
 */
export function rotulosACadaN(passo: number, rotulos: string[], folga = 10): number[] {
  const maior = Math.max(0, ...rotulos.map((r) => larguraTexto(r)));
  const n = Math.max(1, Math.ceil((maior + folga) / Math.max(1, passo)));
  return rotulos.map((_, i) => i).filter((i) => i % n === 0);
}

/* ---------- estatística ---------- */

export interface RegressaoLinear {
  inclinacao: number;
  intercepto: number;
  /** Correlação de Pearson. */
  r: number;
  r2: number;
  n: number;
}

/**
 * Reta dos mínimos quadrados (`y = inclinacao × x + intercepto`) com `r`, `r²` e `n`.
 * Pontos com `x` ou `y` não numérico ficam de fora. `null` com menos de 3 pontos ou
 * variância zero em `x` ou em `y`.
 */
export function regressaoLinear(pontos: ReadonlyArray<{ x: number | null; y: number | null }>): RegressaoLinear | null {
  const validos = pontos.filter(
    (p): p is { x: number; y: number } => typeof p.x === 'number' && typeof p.y === 'number' && Number.isFinite(p.x) && Number.isFinite(p.y),
  );
  const n = validos.length;
  if (n < 3) return null;
  const mx = validos.reduce((s, p) => s + p.x, 0) / n;
  const my = validos.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of validos) {
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
    sxy += (p.x - mx) * (p.y - my);
  }
  if (sxx === 0 || syy === 0) return null;
  const inclinacao = sxy / sxx;
  const r = sxy / Math.sqrt(sxx * syy);
  return { inclinacao, intercepto: my - inclinacao * mx, r, r2: r * r, n };
}
