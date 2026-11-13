/* Contas de data usadas pelo Calendario e pelo MiniCalendario (sempre no fuso local). */

export const NOMES_DIA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
export const CURTOS_DIA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const MES = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
export const DIA_LONGO = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
export const HORA = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
