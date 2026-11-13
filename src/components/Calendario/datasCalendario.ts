/* Contas de data usadas pelo Calendario e pelo MiniCalendario (sempre no fuso local). */

import { diasDaSemana, formatoData, type Idioma } from '../../i18n/idiomas';
import type { Textos } from '../../i18n/pt-BR';
import { textosDe } from '../../i18n/textos';

// Formatadores e textos do idioma da renderização: o Calendario e o
// MiniCalendario chamam `usarIdiomaCalendario` antes de desenhar (há um idioma
// por app). Em pt-BR, os nomes curtos dos dias ficam como sempre (dom, seg…).
const NOMES_PT = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const CURTOS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export let NOMES_DIA = NOMES_PT;
export let CURTOS_DIA = CURTOS_PT;
export let MES = formatoData('pt-BR', { month: 'long', year: 'numeric' });
export let DIA_LONGO = formatoData('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
export let HORA = formatoData('pt-BR', { hour: '2-digit', minute: '2-digit' });
export let SEMANA_TITULO = formatoData('pt-BR', { day: 'numeric', month: 'short' });
export let DIA_TITULO = formatoData('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export let TXT: Textos['calendario'] = textosDe('pt-BR').calendario;
let atual: Idioma = 'pt-BR';

/** Interno: troca formatadores e textos para o idioma ativo. */
export function usarIdiomaCalendario(idioma: Idioma): void {
  TXT = textosDe(idioma).calendario;
  if (idioma === atual) return;
  atual = idioma;
  const pt = idioma === 'pt-BR';
  NOMES_DIA = pt ? NOMES_PT : diasDaSemana(idioma, 'long');
  CURTOS_DIA = pt ? CURTOS_PT : diasDaSemana(idioma, 'short').map((d) => d.replace('.', ''));
  MES = formatoData(idioma, { month: 'long', year: 'numeric' });
  DIA_LONGO = formatoData(idioma, { weekday: 'long', day: 'numeric', month: 'long' });
  HORA = formatoData(idioma, { hour: '2-digit', minute: '2-digit' });
  SEMANA_TITULO = formatoData(idioma, { day: 'numeric', month: 'short' });
  DIA_TITULO = formatoData(idioma, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export const meiaNoite = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const somaDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Mesmo horário, `n` dias depois (pelo calendário, não por 24 h). */
export const somaDiasHora = (d: Date, n: number, minutos = 0) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes() + minutos, d.getSeconds());
export const mesmoDia = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
/** Dias de calendário de `a` até `b`. */
export const difDias = (b: Date, a: Date) => Math.round((meiaNoite(b).getTime() - meiaNoite(a).getTime()) / 86400000);
export const chave = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
export const deChave = (k: string) => {
  const [a, m, d] = k.split('-').map(Number);
  return new Date(a, m, d);
};
export const primeiraMaiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const inicioDaSemana = (d: Date, inicioSemana: 0 | 1) => somaDias(d, -((d.getDay() - inicioSemana + 7) % 7));

/** As 6 semanas (42 dias) que mostram o mês de `ref`, começando no `inicioSemana`. */
export function gradeDoMes(ref: Date, inicioSemana: 0 | 1): Date[] {
  const inicio = inicioDaSemana(new Date(ref.getFullYear(), ref.getMonth(), 1), inicioSemana);
  return Array.from({ length: 42 }, (_, i) => somaDias(inicio, i));
}

/** Dia que as teclas de uma grade de mês levam (setas, Home/End, Page Up/Down), ou `null` para outra tecla. */
export function diaPelaTecla(tecla: string, dia: Date, inicioSemana: 0 | 1): Date | null {
  const passos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  const pos = (dia.getDay() - inicioSemana + 7) % 7;
  if (tecla in passos) return somaDias(dia, passos[tecla]);
  if (tecla === 'Home') return somaDias(dia, -pos);
  if (tecla === 'End') return somaDias(dia, 6 - pos);
  if (tecla === 'PageUp' || tecla === 'PageDown') return new Date(dia.getFullYear(), dia.getMonth() + (tecla === 'PageUp' ? -1 : 1), Math.min(dia.getDate(), 28));
  return null;
}
