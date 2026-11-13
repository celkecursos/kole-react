import type { EventoCalendario } from './Calendario';
import { chave, meiaNoite, somaDias } from './datasCalendario';

export interface RegraRepeticao {
  frequencia: 'diaria' | 'semanal' | 'mensal' | 'anual';
  /** A cada quantos dias, semanas, meses ou anos. Padrão: `1`. */
  intervalo?: number;
  /** Semanal: dias da semana (`0` = domingo … `6` = sábado). Padrão: o dia do `inicio`. */
  diasSemana?: number[];
  /** Último dia possível (inclusive). */
  ate?: Date;
  /** Número de ocorrências, contadas desde o início da série (as `excecoes` também contam). */
  vezes?: number;
  /** Dias que a série pula (ex.: a ocorrência foi apagada ou movida sozinha). */
  excecoes?: Date[];
}

const p2 = (n: number) => String(n).padStart(2, '0');
/** Teto de segurança: uma série sem fim nunca passa disso dentro de um período. */
const MAX_PASSOS = 20000;

/**
 * Ocorrências de um evento que se repete dentro do período (fim exclusivo), prontas
 * para o `Calendario`. Cada uma ganha `id` `"<id>@aaaa-mm-dd"`, `repete: true` e
 * `serie` com o `id` do evento base; o horário e a duração são os do evento base.
 *
 * Mensal no dia 31 (ou anual em 29 de fevereiro) pula os meses (anos) sem esse dia.
 * Use com o `aoMudarPeriodo` do calendário: calcule só o período visível.
 */
export function repetirEvento(base: EventoCalendario, regra: RegraRepeticao, periodo: { inicio: Date; fim: Date }): EventoCalendario[] {
  const intervalo = Math.max(1, Math.floor(regra.intervalo ?? 1));
  const d0 = meiaNoite(base.inicio);
  const duracao = base.fim ? base.fim.getTime() - base.inicio.getTime() : undefined;
  const pular = new Set((regra.excecoes ?? []).map(chave));
  const ate = regra.ate ? meiaNoite(regra.ate) : null;
  const saida: EventoCalendario[] = [];
  let n = 0;

  /** Registra o dia; `false` quando a série acabou. */
  const emitir = (dia: Date) => {
    if (regra.vezes != null && n >= regra.vezes) return false;
    if ((ate && dia > ate) || dia >= periodo.fim) return false;
    n++;
    if (pular.has(chave(dia))) return true;
    const inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), base.inicio.getHours(), base.inicio.getMinutes(), base.inicio.getSeconds());
    const fim = duracao != null ? new Date(inicio.getTime() + duracao) : undefined;
    const termina = fim ?? inicio;
    if (termina > periodo.inicio || inicio >= periodo.inicio) {
      saida.push({
        ...base,
        id: `${base.id}@${dia.getFullYear()}-${p2(dia.getMonth() + 1)}-${p2(dia.getDate())}`,
        inicio,
        fim,
        repete: true,
        serie: base.id,
      });
    }
    return true;
  };

  if (regra.frequencia === 'diaria') {
    for (let k = 0; k < MAX_PASSOS; k++) if (!emitir(somaDias(d0, k * intervalo))) break;
  } else if (regra.frequencia === 'semanal') {
    const dias = [...new Set(regra.diasSemana?.length ? regra.diasSemana : [d0.getDay()])].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
    const domingo = somaDias(d0, -d0.getDay());
    externo: for (let s = 0; s < MAX_PASSOS && dias.length; s++) {
      for (const ds of dias) {
        const dia = somaDias(domingo, s * 7 * intervalo + ds);
        if (dia < d0) continue;
        if (!emitir(dia)) break externo;
      }
    }
  } else {
    const meses = regra.frequencia === 'mensal' ? intervalo : intervalo * 12;
    for (let k = 0; k < MAX_PASSOS; k++) {
      const alvo = new Date(d0.getFullYear(), d0.getMonth() + k * meses, 1);
      const dia = new Date(alvo.getFullYear(), alvo.getMonth(), d0.getDate());
      if (dia.getMonth() !== alvo.getMonth()) {
        // mês sem esse dia: pula, mas para se já passou do período
        if (alvo >= periodo.fim || (ate && alvo > ate)) break;
        continue;
      }
      if (!emitir(dia)) break;
    }
  }
  return saida;
}
