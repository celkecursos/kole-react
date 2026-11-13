// Só dados: o menu (demo/nav.ts) e as páginas usam as mesmas rotas.
const BASE = '/solucoes/financas';

export const ROTAS = {
  visaoGeral: BASE,
  lancamentos: `${BASE}/lancamentos`,
  contas: `${BASE}/contas`,
  pagarReceber: `${BASE}/pagar-receber`,
  orcamento: `${BASE}/orcamento`,
  metas: `${BASE}/metas`,
  fluxoCaixa: `${BASE}/fluxo-de-caixa`,
  relatorios: `${BASE}/relatorios`,
} as const;

export const ehFinancas = (rota: string) => rota === BASE || rota.startsWith(`${BASE}/`);
