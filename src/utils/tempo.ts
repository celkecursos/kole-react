/**
 * Tempo relativo em pt-BR ("há 5 min", "ontem", "em 3 dias") e situação de
 * um prazo (atrasado, vence hoje, em breve). Datas `AAAA-MM-DD` valem no fuso
 * local (não em UTC, como o `new Date('2026-11-13')` faria).
 */

import { formatoData, interpolar, pluralizar, type Idioma } from '../i18n/idiomas';
import { textosDe } from '../i18n/textos';

const DIA_MS = 86_400_000;

/** `Date`, ISO completo ou só a data (`AAAA-MM-DD`, lida no fuso local). */
export function paraData(valor: Date | string): Date {
  if (valor instanceof Date) return valor;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim());
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(valor);
}

/** Dias de calendário de `de` até `ate` (negativo se `ate` é antes), ignorando a hora. */
export function diasEntre(de: Date | string, ate: Date | string): number {
  const a = paraData(de);
  const b = paraData(ate);
  // pelo meio-dia: a troca de horário de verão não tira nem põe um dia
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / DIA_MS);
}

/** `13/11` no mesmo ano de `agora`; `13/11/2025` em outro. */
export function dataCurta(valor: Date | string, agora: Date = new Date(), idioma: Idioma = 'pt-BR'): string {
  const d = paraData(valor);
  const mesmoAno = d.getFullYear() === agora.getFullYear();
  return formatoData(idioma, { day: '2-digit', month: '2-digit', ...(mesmoAno ? {} : { year: 'numeric' }) }).format(d);
}

/** `13/11/2026` (pt-BR) · `11/13/2026` (en) · `13/11/2026` (es). */
function dataNumerica(d: Date, idioma: Idioma): string {
  return formatoData(idioma, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

/**
 * Quanto tempo falta ou passou: "agora mesmo", "há 5 min", "há 2 h",
 * "ontem", "há 3 dias", "há 2 meses", "em 10 min", "amanhã", "em 4 dias"…
 */
export function tempoRelativo(valor: Date | string, agora: Date = new Date(), idioma: Idioma = 'pt-BR'): string {
  const t = textosDe(idioma).tempo;
  const d = paraData(valor);
  const seg = (agora.getTime() - d.getTime()) / 1000;
  const passado = seg >= 0;
  const abs = Math.abs(seg);
  const fmt = (quanto: string) => interpolar(passado ? t.passado : t.futuro, { quanto });
  if (abs < 60) return t.agora;
  if (abs < 3600) return fmt(`${Math.floor(abs / 60)} ${t.minutos}`);
  if (abs < 86_400) return fmt(`${Math.floor(abs / 3600)} ${t.horas}`);
  const dias = Math.abs(diasEntre(d, agora));
  if (dias <= 1) return passado ? t.ontem : t.amanha;
  if (dias < 30) return fmt(pluralizar(idioma, dias, t.dias));
  const meses = Math.floor(dias / 30);
  if (meses < 12) return fmt(pluralizar(idioma, meses, t.meses));
  const anos = Math.floor(dias / 365);
  return fmt(pluralizar(idioma, anos, t.anos));
}

export type SituacaoPrazo = 'atrasado' | 'hoje' | 'em-breve' | 'no-prazo';

export interface Prazo {
  situacao: SituacaoPrazo;
  /** Dias de hoje até o vencimento (negativo = atrasado). */
  dias: number;
  /** Curto, para o selo: "Atrasado", "Hoje", "Amanhã", "13/11". */
  rotulo: string;
  /** Por extenso, para dica e leitor de tela: "Venceu há 2 dias (11/11/2026)". */
  descricao: string;
}

/**
 * Situação de um vencimento em relação a hoje. `emBreve` = quantos dias
 * antes passa a ser "em breve" (padrão: 2).
 */
export function situacaoPrazo(vencimento: Date | string, agora: Date = new Date(), emBreve = 2, idioma: Idioma = 'pt-BR'): Prazo {
  const t = textosDe(idioma).tempo;
  const d = paraData(vencimento);
  const dias = diasEntre(agora, d);
  const data = dataNumerica(d, idioma);
  if (dias < 0) {
    const quando = dias === -1 ? t.ontem : interpolar(t.passado, { quanto: pluralizar(idioma, -dias, t.dias) });
    return { situacao: 'atrasado', dias, rotulo: t.atrasado, descricao: interpolar(t.venceu, { quando, data }) };
  }
  if (dias === 0) return { situacao: 'hoje', dias, rotulo: t.hoje, descricao: interpolar(t.venceHoje, { data }) };
  const situacao: SituacaoPrazo = dias <= emBreve ? 'em-breve' : 'no-prazo';
  const rotulo = dias === 1 ? t.amanhaRotulo : dataCurta(d, agora, idioma);
  const quando = dias === 1 ? t.amanha : interpolar(t.futuro, { quanto: pluralizar(idioma, dias, t.dias) });
  return { situacao, dias, rotulo, descricao: interpolar(t.vence, { quando, data }) };
}
