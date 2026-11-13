import type { IconeProp } from '../../utils/Icone';
import type { Severidade } from '../../utils/tipos';

/** Cores de coluna e etiqueta: tokens de severidade, a marca e as séries de gráfico. */
export type CorKanban = 'pri' | 'ok' | 'warn' | 'err' | 'info' | 'destaque' | 'neutro' | 'graf-1' | 'graf-2' | 'graf-3' | 'graf-4' | 'graf-5' | 'graf-6';

/** Prioridade de cartão ou tarefa. Use só os níveis de que precisa (ex.: baixa, média e alta). */
export type Prioridade = 'baixa' | 'media' | 'alta' | 'critica';

export const PRIORIDADES: Record<Prioridade, { rotulo: string; severidade: Severidade }> = {
  baixa: { rotulo: 'Baixa', severidade: 'neutral' },
  media: { rotulo: 'Média', severidade: 'info' },
  alta: { rotulo: 'Alta', severidade: 'warn' },
  critica: { rotulo: 'Crítica', severidade: 'err' },
};

export interface EtiquetaKanban {
  rotulo: string;
  cor?: CorKanban;
}

/** Situação de uma tarefa (a coluna do kanban, quando ele é agrupado por situação). */
export type SituacaoTarefa = 'aberta' | 'andamento' | 'bloqueada' | 'concluida';

export const SITUACOES_TAREFA: Record<SituacaoTarefa, { rotulo: string; severidade: Severidade; icone: IconeProp }> = {
  aberta: { rotulo: 'Aberta', severidade: 'neutral', icone: 'circle' },
  andamento: { rotulo: 'Em andamento', severidade: 'info', icone: 'play' },
  bloqueada: { rotulo: 'Bloqueada', severidade: 'err', icone: 'lock' },
  concluida: { rotulo: 'Concluída', severidade: 'ok', icone: 'circle-check' },
};

/** Subtarefas feitas e total (o cartão mostra a barra de progresso). */
export interface ContagemSubtarefas {
  feitas: number;
  total: number;
}
