/**
 * Tempo relativo em pt-BR ("há 5 min", "ontem", "em 3 dias") e situação de
 * um prazo (atrasado, vence hoje, em breve). Datas `AAAA-MM-DD` valem no fuso
 * local (não em UTC, como o `new Date('2026-11-13')` faria).
 */

const p2 = (n: number) => String(n).padStart(2, '0');
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
export function dataCurta(valor: Date | string, agora: Date = new Date()): string {
  const d = paraData(valor);
  const base = `${p2(d.getDate())}/${p2(d.getMonth() + 1)}`;
  return d.getFullYear() === agora.getFullYear() ? base : `${base}/${d.getFullYear()}`;
}

/**
 * Quanto tempo falta ou passou: "agora mesmo", "há 5 min", "há 2 h",
 * "ontem", "há 3 dias", "há 2 meses", "em 10 min", "amanhã", "em 4 dias"…
 */
export function tempoRelativo(valor: Date | string, agora: Date = new Date()): string {
  const d = paraData(valor);
  const seg = (agora.getTime() - d.getTime()) / 1000;
  const passado = seg >= 0;
  const abs = Math.abs(seg);
  const fmt = (n: number, unidade: string) => (passado ? `há ${n} ${unidade}` : `em ${n} ${unidade}`);
  if (abs < 60) return 'agora mesmo';
  if (abs < 3600) return fmt(Math.floor(abs / 60), 'min');
  if (abs < 86_400) return fmt(Math.floor(abs / 3600), 'h');
  const dias = Math.abs(diasEntre(d, agora));
  if (dias <= 1) return passado ? 'ontem' : 'amanhã';
  if (dias < 30) return fmt(dias, 'dias');
  const meses = Math.floor(dias / 30);
  if (meses < 12) return fmt(meses, meses === 1 ? 'mês' : 'meses');
  const anos = Math.floor(dias / 365);
  return fmt(anos, anos === 1 ? 'ano' : 'anos');
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
export function situacaoPrazo(vencimento: Date | string, agora: Date = new Date(), emBreve = 2): Prazo {
  const d = paraData(vencimento);
  const dias = diasEntre(agora, d);
  const data = `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
  if (dias < 0) {
    const quando = dias === -1 ? 'ontem' : `há ${-dias} dias`;
    return { situacao: 'atrasado', dias, rotulo: 'Atrasado', descricao: `Venceu ${quando} (${data})` };
  }
  if (dias === 0) return { situacao: 'hoje', dias, rotulo: 'Hoje', descricao: `Vence hoje (${data})` };
  const situacao: SituacaoPrazo = dias <= emBreve ? 'em-breve' : 'no-prazo';
  const rotulo = dias === 1 ? 'Amanhã' : dataCurta(d, agora);
  const quando = dias === 1 ? 'amanhã' : `em ${dias} dias`;
  return { situacao, dias, rotulo, descricao: `Vence ${quando} (${data})` };
}
