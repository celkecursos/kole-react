import { useSyncExternalStore } from 'react';
import { dataIso, periodoDe, somarMoeda, situacaoPrazo, type Periodo, type Severidade } from '../../../../src';
import { CATEGORIAS, CONTAS, LANCAMENTOS, METAS, dia, hoje, type Categoria, type Conta, type Espaco, type Lancamento, type Meta } from './dados';

// Estado da solução, compartilhado entre as telas (e com o seletor do topo):
// o espaço, o período e os registros sobrevivem à troca de página. Num
// sistema de verdade, isto viria do servidor.

interface Estado {
  espaco: Espaco;
  periodo: Periodo;
  lancamentos: Lancamento[];
  metas: Meta[];
  /** Orçamento por categoria (sobrescreve o padrão da categoria). */
  orcamentos: Record<string, number>;
  /** Filtro que outra tela pede ao abrir os lançamentos (ex.: clique numa fatia). */
  filtroInicial: FiltroInicial | null;
}

export interface FiltroInicial {
  categoria?: string;
  conta?: string;
}

let estado: Estado = {
  espaco: 'pessoal',
  periodo: periodoDe('mes', hoje()),
  lancamentos: LANCAMENTOS,
  metas: METAS,
  orcamentos: {},
  filtroInicial: null,
};
const ouvintes = new Set<() => void>();

function mudar(f: (e: Estado) => Partial<Estado>) {
  estado = { ...estado, ...f(estado) };
  ouvintes.forEach((o) => o());
}

export function useFinancas() {
  return useSyncExternalStore(
    (o) => {
      ouvintes.add(o);
      return () => ouvintes.delete(o);
    },
    () => estado,
  );
}

export const acoes = {
  trocarEspaco: (espaco: Espaco) => mudar(() => ({ espaco })),
  mudarPeriodo: (periodo: Periodo) => mudar(() => ({ periodo })),
  salvar: (novos: Lancamento[]) =>
    mudar((e) => {
      const ids = new Set(novos.map((l) => l.id));
      return { lancamentos: [...e.lancamentos.filter((l) => !ids.has(l.id)), ...novos].sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0)) };
    }),
  excluir: (ids: string[]) => mudar((e) => ({ lancamentos: e.lancamentos.filter((l) => !ids.includes(l.id)) })),
  marcarPago: (ids: string[], pago = true) => mudar((e) => ({ lancamentos: e.lancamentos.map((l) => (ids.includes(l.id) ? { ...l, pago } : l)) })),
  definirOrcamento: (categoria: string, valor: number) => mudar((e) => ({ orcamentos: { ...e.orcamentos, [categoria]: valor } })),
  salvarMeta: (meta: Meta) => mudar((e) => ({ metas: e.metas.some((m) => m.id === meta.id) ? e.metas.map((m) => (m.id === meta.id ? meta : m)) : [...e.metas, meta] })),
  pedirFiltro: (filtroInicial: FiltroInicial | null) => mudar(() => ({ filtroInicial })),
  excluirMeta: (id: string) => mudar((e) => ({ metas: e.metas.filter((m) => m.id !== id) })),
};

// ---------- consultas ----------

const CONTA = new Map(CONTAS.map((c) => [c.id, c]));
const CATEGORIA = new Map(CATEGORIAS.map((c) => [c.id, c]));
export const conta = (id?: string): Conta | undefined => (id ? CONTA.get(id) : undefined);
export const categoria = (id?: string): Categoria | undefined => (id ? CATEGORIA.get(id) : undefined);
export const contasDo = (espaco: Espaco) => CONTAS.filter((c) => c.espaco === espaco);
export const categoriasDo = (espaco: Espaco, tipo?: 'receita' | 'despesa') => CATEGORIAS.filter((c) => c.espaco === espaco && (!tipo || c.tipo === tipo));
export const orcamentoDe = (c: Categoria, orcamentos: Record<string, number>) => orcamentos[c.id] ?? c.orcamento ?? 0;

/** Quanto o lançamento mexe no saldo da conta (0 se não a toca). */
export function efeito(l: Lancamento, idConta: string): number {
  if (l.tipo === 'transferencia') return l.conta === idConta ? -l.valor : l.contaDestino === idConta ? l.valor : 0;
  if (l.conta !== idConta) return 0;
  return l.tipo === 'receita' ? l.valor : -l.valor;
}

/** Saldo da conta no fim do dia `ate` (padrão: hoje), contando só o que foi pago. */
export function saldoConta(c: Conta, lancamentos: Lancamento[], ate = dia(0)): number {
  return somarMoeda([c.saldoInicial, ...lancamentos.filter((l) => l.pago && l.data <= ate).map((l) => efeito(l, c.id))]);
}

/** Receita (+) ou despesa (−); transferência não é resultado (fica 0). */
export const resultado = (l: Lancamento) => (l.tipo === 'receita' ? l.valor : l.tipo === 'despesa' ? -l.valor : 0);

export type Situacao = 'pago' | 'recebido' | 'atrasado' | 'hoje' | 'pendente';

export function situacao(l: Lancamento): Situacao {
  if (l.pago) return l.tipo === 'receita' ? 'recebido' : 'pago';
  const s = situacaoPrazo(l.data, hoje()).situacao;
  return s === 'atrasado' ? 'atrasado' : s === 'hoje' ? 'hoje' : 'pendente';
}

export const SITUACOES: Record<Situacao, { rotulo: string; severidade: Severidade; icone: string }> = {
  pago: { rotulo: 'Pago', severidade: 'ok', icone: 'circle-check' },
  recebido: { rotulo: 'Recebido', severidade: 'ok', icone: 'circle-check' },
  atrasado: { rotulo: 'Atrasado', severidade: 'err', icone: 'circle-alert' },
  hoje: { rotulo: 'Vence hoje', severidade: 'warn', icone: 'clock' },
  pendente: { rotulo: 'Pendente', severidade: 'info', icone: 'clock' },
};

/** Ex.: "a receber" / "a pagar" de um pendente; transferência pendente conta como a pagar. */
export const aReceber = (l: Lancamento) => l.tipo === 'receita';

/** Compra no cartão não se paga sozinha: entra na fatura (que é o que vence). */
export const vencePorSi = (l: Lancamento) => !(l.tipo === 'despesa' && conta(l.conta)?.tipo === 'cartao');

/** "1 lançamento" · "3 lançamentos". */
export const qtdLancamentos = (n: number) => `${n} ${n === 1 ? 'lançamento' : 'lançamentos'}`;

export const doEspaco = (lancamentos: Lancamento[], espaco: Espaco) => lancamentos.filter((l) => l.espaco === espaco);
export const noIntervalo = (lancamentos: Lancamento[], p: { de: string; ate: string }) => lancamentos.filter((l) => l.data >= p.de && l.data <= p.ate);

export function totais(lancamentos: Lancamento[]) {
  const receitas = somarMoeda(lancamentos.filter((l) => l.tipo === 'receita').map((l) => l.valor));
  const despesas = somarMoeda(lancamentos.filter((l) => l.tipo === 'despesa').map((l) => l.valor));
  return { receitas, despesas, saldo: somarMoeda([receitas, -despesas]) };
}

/** Mesmo intervalo do período, deslocado `meses` (para comparar com o anterior). */
export function intervaloDeslocado(p: Periodo, meses: number) {
  const de = new Date(`${p.de}T00:00`);
  const ate = new Date(`${p.ate}T00:00`);
  const novoDe = new Date(de.getFullYear(), de.getMonth() + meses, de.getDate());
  // fim de mês continua fim de mês (31/03 − 1 mês = 28/02)
  const fimDoMes = ate.getDate() === new Date(ate.getFullYear(), ate.getMonth() + 1, 0).getDate();
  const novoAte = fimDoMes ? new Date(ate.getFullYear(), ate.getMonth() + meses + 1, 0) : new Date(ate.getFullYear(), ate.getMonth() + meses, ate.getDate());
  return { de: dataIso(novoDe), ate: dataIso(novoAte) };
}

/** Despesas somadas por categoria, da maior para a menor. */
export function porCategoria(lancamentos: Lancamento[], tipo: 'receita' | 'despesa') {
  const mapa = new Map<string, number>();
  for (const l of lancamentos) if (l.tipo === tipo && l.categoria) mapa.set(l.categoria, (mapa.get(l.categoria) ?? 0) + l.valor);
  return [...mapa.entries()]
    .map(([id, valor]) => ({ categoria: categoria(id)!, valor: Math.round(valor * 100) / 100 }))
    .sort((a, b) => b.valor - a.valor);
}
