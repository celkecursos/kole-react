/**
 * Períodos de relatório (mês, trimestre, ano ou intervalo livre) com datas
 * `AAAA-MM-DD` no fuso local — as mesmas do `CampoData` e do `paraData`.
 */
import { paraData } from './tempo';

export type TipoPeriodo = 'mes' | 'trimestre' | 'ano' | 'personalizado';

export interface Periodo {
  tipo: TipoPeriodo;
  /** Primeiro dia, `AAAA-MM-DD`. */
  de: string;
  /** Último dia (inclusive), `AAAA-MM-DD`. */
  ate: string;
}

const p2 = (n: number) => String(n).padStart(2, '0');

/** `Date` → `AAAA-MM-DD` no fuso local. */
export function dataIso(d: Date): string {
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}

/** O mês, o trimestre ou o ano que contém `data` (padrão: hoje). */
export function periodoDe(tipo: Exclude<TipoPeriodo, 'personalizado'>, data: Date | string = new Date()): Periodo {
  const d = paraData(data);
  const ano = d.getFullYear();
  const mes = tipo === 'ano' ? 0 : tipo === 'trimestre' ? Math.floor(d.getMonth() / 3) * 3 : d.getMonth();
  const meses = tipo === 'ano' ? 12 : tipo === 'trimestre' ? 3 : 1;
  return { tipo, de: dataIso(new Date(ano, mes, 1)), ate: dataIso(new Date(ano, mes + meses, 0)) };
}

/**
 * Anda `passos` períodos para a frente (ou para trás, se negativo). O
 * personalizado anda pelo próprio tamanho: 10 dias viram os 10 seguintes.
 */
export function moverPeriodo(p: Periodo, passos: number): Periodo {
  if (p.tipo === 'personalizado') {
    const de = paraData(p.de);
    const ate = paraData(p.ate);
    const dias = Math.round((Date.UTC(ate.getFullYear(), ate.getMonth(), ate.getDate()) - Date.UTC(de.getFullYear(), de.getMonth(), de.getDate())) / 86_400_000) + 1;
    const novoDe = new Date(de.getFullYear(), de.getMonth(), de.getDate() + dias * passos);
    const novoAte = new Date(novoDe.getFullYear(), novoDe.getMonth(), novoDe.getDate() + dias - 1);
    return { tipo: 'personalizado', de: dataIso(novoDe), ate: dataIso(novoAte) };
  }
  const d = paraData(p.de);
  const meses = p.tipo === 'ano' ? 12 : p.tipo === 'trimestre' ? 3 : 1;
  return periodoDe(p.tipo, new Date(d.getFullYear(), d.getMonth() + meses * passos, 1));
}

/** `data` cai dentro do período (as pontas contam). */
export function noPeriodo(data: Date | string, p: Periodo): boolean {
  const iso = typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : dataIso(paraData(data));
  return iso >= p.de && iso <= p.ate;
}

const MES = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
const DIA_MES = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' });

/**
 * "novembro de 2026" · "3º trimestre de 2026" · "2026" · "5 de nov. a 14 de nov. de 2026".
 * `curto` tira o ano do mês e do trimestre quando é o ano de `agora`.
 */
export function rotuloPeriodo(p: Periodo, opcoes: { curto?: boolean; agora?: Date } = {}): string {
  const de = paraData(p.de);
  const ate = paraData(p.ate);
  const ano = de.getFullYear();
  const mesmoAno = !!opcoes.curto && ano === (opcoes.agora ?? new Date()).getFullYear();
  if (p.tipo === 'ano') return String(ano);
  if (p.tipo === 'mes') return mesmoAno ? MES.format(de) : `${MES.format(de)} de ${ano}`;
  if (p.tipo === 'trimestre') {
    const t = `${Math.floor(de.getMonth() / 3) + 1}º trimestre`;
    return mesmoAno ? t : `${t} de ${ano}`;
  }
  if (p.de === p.ate) return `${DIA_MES.format(de)} de ${ano}`;
  const fim = `${DIA_MES.format(ate)} de ${ate.getFullYear()}`;
  return ano === ate.getFullYear() ? `${DIA_MES.format(de)} a ${fim}` : `${DIA_MES.format(de)} de ${ano} a ${fim}`;
}

/** Cada mês do período, como o primeiro dia (`AAAA-MM-01`): o eixo X de um gráfico mensal. */
export function mesesDoPeriodo(p: Periodo): string[] {
  const de = paraData(p.de);
  const ate = paraData(p.ate);
  const lista: string[] = [];
  for (let d = new Date(de.getFullYear(), de.getMonth(), 1); d <= ate; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) lista.push(dataIso(d));
  return lista;
}
