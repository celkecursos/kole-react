import { normalizar } from './texto';

/** Valor do picklist: o par disponíveis (`fonte`) × escolhidos (`alvo`). */
export interface PicklistValor<T> {
  fonte: T[];
  alvo: T[];
}

export const PICKLIST_VAZIO: PicklistValor<never> = { fonte: [], alvo: [] };

export function normalizarPicklistValor<T>(v: PicklistValor<T> | null | undefined): PicklistValor<T> {
  return { fonte: [...(v?.fonte ?? [])], alvo: [...(v?.alvo ?? [])] };
}

/** Move `itens` para o fim do destino, na ordem de ORIGEM. */
function mover<T>(de: readonly T[], para: readonly T[], itens: readonly T[]) {
  const s = new Set(itens);
  return { de: de.filter((i) => !s.has(i)), para: [...para, ...de.filter((i) => s.has(i))] };
}

export function moverParaAlvo<T>(v: PicklistValor<T>, itens: readonly T[]): PicklistValor<T> {
  const r = mover(v.fonte, v.alvo, itens);
  return { fonte: r.de, alvo: r.para };
}

export function moverParaFonte<T>(v: PicklistValor<T>, itens: readonly T[]): PicklistValor<T> {
  const r = mover(v.alvo, v.fonte, itens);
  return { fonte: r.para, alvo: r.de };
}

export function moverTudoParaAlvo<T>(v: PicklistValor<T>, apenas?: readonly T[]): PicklistValor<T> {
  return moverParaAlvo(v, apenas ?? v.fonte);
}

export function moverTudoParaFonte<T>(v: PicklistValor<T>, apenas?: readonly T[]): PicklistValor<T> {
  return moverParaFonte(v, apenas ?? v.alvo);
}

/** Move o item de `de` para `para` (índices limitados; nunca lança). */
export function reordenarLista<T>(lista: readonly T[], de: number, para: number): T[] {
  const l = [...lista];
  if (!l.length) return l;
  const a = Math.max(0, Math.min(de, l.length - 1));
  const b = Math.max(0, Math.min(para, l.length - 1));
  const [item] = l.splice(a, 1);
  l.splice(b, 0, item);
  return l;
}

/** Filtro sem acento/caixa; termo vazio devolve tudo (cópia). */
export function filtrarItens<T>(itens: readonly T[], termo: string, texto: (item: T) => string): T[] {
  const t = normalizar(termo.trim());
  return t ? itens.filter((i) => normalizar(texto(i)).includes(t)) : [...itens];
}
