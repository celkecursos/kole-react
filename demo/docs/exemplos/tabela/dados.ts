// Dados de exemplo das tabelas e listas da documentação.
export interface Pedido {
  id: number;
  numero: string;
  cliente: string;
  total: number;
  situacao: 'Pago' | 'Em aberto' | 'Cancelado';
}

const CLIENTES = ['Mercado Bom Preço', 'Padaria Pão Quente', 'Mercearia do Bairro', 'Supermercado Central', 'Empório Sabor'];
const SITUACOES: Pedido['situacao'][] = ['Pago', 'Em aberto', 'Pago', 'Cancelado', 'Pago'];

export const PEDIDOS: Pedido[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  numero: `PED-2026-${String(i + 1).padStart(4, '0')}`,
  cliente: CLIENTES[i % CLIENTES.length],
  total: Math.round((120 + ((i * 37) % 90) * 21.5) * 100) / 100,
  situacao: SITUACOES[(i * 3) % SITUACOES.length],
}));
