import type { Severidade } from '../../src';

/* ---------------- pedidos ---------------- */

export type SituacaoPedido = 'Aguardando pagamento' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface Pedido {
  id: number;
  /** Número exibido (ex.: PED-2026-0001). */
  numero: string;
  cliente: string;
  uf: string;
  itens: number;
  total: number;
  pagamento: string;
  /** Previsão de entrega, ISO `aaaa-mm-dd`. */
  entrega: string;
  situacao: SituacaoPedido;
}

const CLIENTES = [
  'Mercado Bom Preço',
  'Padaria Pão Dourado',
  'Farmácia Vida Plena',
  'Construtora Alicerce',
  'Loja Casa & Cia',
  'Restaurante Sabor Caseiro',
  'Auto Peças Rota Sul',
  'Papelaria Ponto Final',
  'Clínica Bem-Estar',
  'Distribuidora Litoral',
];
const PAGAMENTOS = ['Pix', 'Boleto', 'Cartão de crédito', 'Cartão de débito', 'Transferência'];
const UFS = ['PR', 'SP', 'RJ', 'MG', 'SC', 'GO', 'DF', 'BA'];
const SITUACOES: SituacaoPedido[] = ['Aguardando pagamento', 'Pago', 'Enviado', 'Entregue', 'Cancelado'];

export const PEDIDOS: Pedido[] = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  numero: `PED-2026-${String(i + 1).padStart(4, '0')}`,
  cliente: CLIENTES[(i * 3) % CLIENTES.length],
  uf: UFS[i % UFS.length],
  itens: 1 + ((i * 7) % 24),
  total: 89.9 + ((i * 1279.37) % 18000),
  pagamento: PAGAMENTOS[(i * 7) % PAGAMENTOS.length],
  entrega: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
  situacao: SITUACOES[(i * 3) % SITUACOES.length],
}));

export const SEVERIDADE: Record<SituacaoPedido, Severidade> = {
  'Aguardando pagamento': 'warn',
  Pago: 'info',
  Enviado: 'neutral',
  Entregue: 'ok',
  Cancelado: 'err',
};

export const OPCOES_PAGAMENTO = PAGAMENTOS.map((p) => ({ valor: p, rotulo: p }));
export const OPCOES_UF = UFS.map((u) => ({ valor: u, rotulo: u }));
export const OPCOES_SITUACAO = SITUACOES.map((s) => ({ valor: s, rotulo: s }));
export const OPCOES_CLIENTE = CLIENTES.map((c) => ({ valor: c, rotulo: c }));

/* ---------------- tabelas auxiliares ---------------- */

export interface Categoria {
  id: number;
  nome: string;
  codigo: string;
  descricao: string;
  produtos: number;
  ativa: boolean;
}

export const TABELA_CATEGORIAS: Categoria[] = (
  [
    ['Alimentos', 'ALI', 'Mercearia, frios e laticínios', 312, true],
    ['Bebidas', 'BEB', 'Sucos, refrigerantes e águas', 148, true],
    ['Limpeza', 'LIM', 'Produtos de limpeza doméstica', 96, true],
    ['Higiene', 'HIG', 'Higiene pessoal e cosméticos', 121, true],
    ['Papelaria', 'PAP', 'Material de escritório e escolar', 87, true],
    ['Eletrônicos', 'ELE', 'Acessórios e pequenos eletrônicos', 54, true],
    ['Utilidades', 'UTI', 'Utensílios para casa e cozinha', 73, true],
    ['Ferramentas', 'FER', 'Ferramentas manuais e elétricas', 41, false],
    ['Pet', 'PET', 'Rações e acessórios para animais', 38, true],
    ['Jardinagem', 'JAR', 'Sementes, vasos e adubos', 19, false],
    ['Brinquedos', 'BRI', 'Brinquedos e jogos', 27, true],
    ['Embalagens', 'EMB', 'Caixas, sacolas e fitas', 64, true],
  ] as const
).map(([nome, codigo, descricao, produtos, ativa], i) => ({ id: i + 1, nome, codigo, descricao, produtos, ativa }));

export interface FormaPagamento {
  id: number;
  nome: string;
  tipo: 'À vista' | 'A prazo';
  /** Taxa cobrada pela operadora, em %. */
  taxa: number;
  /** Dias para o dinheiro cair na conta. */
  prazo: number;
}

export const TABELA_PAGAMENTOS: FormaPagamento[] = (
  [
    ['Pix', 'À vista', 0, 0],
    ['Dinheiro', 'À vista', 0, 0],
    ['Cartão de débito', 'À vista', 1.39, 1],
    ['Cartão de crédito à vista', 'À vista', 2.99, 30],
    ['Cartão de crédito parcelado', 'A prazo', 4.59, 30],
    ['Boleto bancário', 'À vista', 1.5, 2],
    ['Boleto a prazo (30 dias)', 'A prazo', 1.5, 30],
    ['Transferência (TED)', 'À vista', 0, 1],
    ['Vale-alimentação', 'À vista', 3.5, 30],
    ['Crediário próprio', 'A prazo', 0, 60],
  ] as const
).map(([nome, tipo, taxa, prazo], i) => ({ id: i + 1, nome, tipo, taxa, prazo }));

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: string;
  capital: string;
}

export const TABELA_ESTADOS: Estado[] = (
  [
    ['AC', 'Acre', 'Norte', 'Rio Branco'],
    ['AL', 'Alagoas', 'Nordeste', 'Maceió'],
    ['AM', 'Amazonas', 'Norte', 'Manaus'],
    ['BA', 'Bahia', 'Nordeste', 'Salvador'],
    ['CE', 'Ceará', 'Nordeste', 'Fortaleza'],
    ['DF', 'Distrito Federal', 'Centro-Oeste', 'Brasília'],
    ['ES', 'Espírito Santo', 'Sudeste', 'Vitória'],
    ['GO', 'Goiás', 'Centro-Oeste', 'Goiânia'],
    ['MA', 'Maranhão', 'Nordeste', 'São Luís'],
    ['MG', 'Minas Gerais', 'Sudeste', 'Belo Horizonte'],
    ['PA', 'Pará', 'Norte', 'Belém'],
    ['PR', 'Paraná', 'Sul', 'Curitiba'],
    ['RJ', 'Rio de Janeiro', 'Sudeste', 'Rio de Janeiro'],
    ['RS', 'Rio Grande do Sul', 'Sul', 'Porto Alegre'],
    ['SC', 'Santa Catarina', 'Sul', 'Florianópolis'],
    ['SP', 'São Paulo', 'Sudeste', 'São Paulo'],
  ] as const
).map(([sigla, nome, regiao, capital], i) => ({ id: i + 1, sigla, nome, regiao, capital }));

export interface Cidade {
  id: number;
  nome: string;
  uf: string;
  populacao: number;
  capital: boolean;
}

export const TABELA_CIDADES: Cidade[] = (
  [
    ['Maringá', 'PR', 409657, false],
    ['Ponta Grossa', 'PR', 358371, false],
    ['Cascavel', 'PR', 348051, false],
    ['Foz do Iguaçu', 'PR', 285415, false],
    ['São Paulo', 'SP', 11451999, true],
    ['Campinas', 'SP', 1139047, false],
    ['Rio de Janeiro', 'RJ', 6211223, true],
    ['Niterói', 'RJ', 481758, false],
    ['Belo Horizonte', 'MG', 2315560, true],
    ['Uberlândia', 'MG', 713224, false],
    ['Curitiba', 'PR', 1773718, true],
    ['Londrina', 'PR', 555937, false],
    ['Goiânia', 'GO', 1437366, true],
    ['Brasília', 'DF', 2817381, true],
    ['Salvador', 'BA', 2417678, true],
  ] as const
).map(([nome, uf, populacao, capital], i) => ({ id: i + 1, nome, uf, populacao, capital }));
