import { dataIso, somarMoeda } from '../../../../src';

// Dados de exemplo das finanças. Tudo é gerado a partir de "hoje" com uma
// semente fixa: a mesma data dá sempre os mesmos números (o teste visual
// congela o relógio).

export type Espaco = 'pessoal' | 'empresa';
export type TipoLancamento = 'receita' | 'despesa' | 'transferencia';
export type TipoConta = 'corrente' | 'poupanca' | 'investimento' | 'carteira' | 'cartao';
/** Linha do DRE em que a categoria entra (só na empresa). */
export type GrupoDre = 'receita' | 'deducao' | 'custo' | 'despesa' | 'financeiro';

export interface Conta {
  id: string;
  espaco: Espaco;
  nome: string;
  tipo: TipoConta;
  instituicao: string;
  cor: string;
  /** Saldo no primeiro dia dos dados. */
  saldoInicial: number;
  /** Cartão: limite, dia de fechamento e de vencimento da fatura. */
  limite?: number;
  fechamento?: number;
  vencimento?: number;
  final?: string;
}

export interface Categoria {
  id: string;
  espaco: Espaco;
  nome: string;
  tipo: 'receita' | 'despesa';
  icone: string;
  cor: string;
  /** Orçamento mensal (despesas). */
  orcamento?: number;
  dre?: GrupoDre;
}

export interface Contato {
  id: string;
  nome: string;
  tipo: 'cliente' | 'fornecedor';
}

export interface CentroCusto {
  id: string;
  nome: string;
}

export interface Lancamento {
  id: string;
  espaco: Espaco;
  tipo: TipoLancamento;
  descricao: string;
  /** Sempre positivo: o sentido vem do `tipo`. */
  valor: number;
  /** Vencimento (ou data da compra), `AAAA-MM-DD`. É a data de competência do DRE. */
  data: string;
  pago: boolean;
  conta: string;
  /** Transferência: a conta que recebe. */
  contaDestino?: string;
  categoria?: string;
  centroCusto?: string;
  contato?: string;
  parcela?: { numero: number; total: number };
  recorrente?: boolean;
  observacao?: string;
}

export interface Meta {
  id: string;
  espaco: Espaco;
  nome: string;
  icone: string;
  cor: string;
  alvo: number;
  guardado: number;
  /** `AAAA-MM-DD`. */
  prazo: string;
}

export const ESPACOS = [
  { id: 'pessoal', nome: 'Minhas finanças', descricao: 'Pessoal', icone: 'wallet', cor: 'pri' },
  { id: 'empresa', nome: 'Estúdio Aurora', descricao: 'Empresa · CNPJ 12.345.678/0001-90', icone: 'building-2', cor: 'graf-3' },
] as const;

export const CONTAS: Conta[] = [
  { id: 'p-corrente', espaco: 'pessoal', nome: 'Conta corrente', tipo: 'corrente', instituicao: 'Banco Azul', cor: 'var(--graf-1)', saldoInicial: 3200 },
  { id: 'p-poupanca', espaco: 'pessoal', nome: 'Poupança', tipo: 'poupanca', instituicao: 'Banco Azul', cor: 'var(--graf-2)', saldoInicial: 9600 },
  { id: 'p-invest', espaco: 'pessoal', nome: 'Investimentos', tipo: 'investimento', instituicao: 'Corretora Norte', cor: 'var(--graf-3)', saldoInicial: 24500 },
  { id: 'p-carteira', espaco: 'pessoal', nome: 'Carteira', tipo: 'carteira', instituicao: 'Dinheiro', cor: 'var(--graf-4)', saldoInicial: 180 },
  { id: 'p-cartao', espaco: 'pessoal', nome: 'Cartão Roxo', tipo: 'cartao', instituicao: 'Banco Roxo', cor: '#7c3aed', saldoInicial: 0, limite: 9000, fechamento: 3, vencimento: 10, final: '4821' },
  { id: 'e-azul', espaco: 'empresa', nome: 'Conta PJ', tipo: 'corrente', instituicao: 'Banco Azul', cor: 'var(--graf-1)', saldoInicial: 38000 },
  { id: 'e-verde', espaco: 'empresa', nome: 'Recebimentos', tipo: 'corrente', instituicao: 'Banco Verde', cor: 'var(--graf-2)', saldoInicial: 12500 },
  { id: 'e-reserva', espaco: 'empresa', nome: 'Reserva de caixa', tipo: 'investimento', instituicao: 'Banco Azul', cor: 'var(--graf-3)', saldoInicial: 64000 },
  { id: 'e-cartao', espaco: 'empresa', nome: 'Cartão empresarial', tipo: 'cartao', instituicao: 'Banco Azul', cor: '#0f766e', saldoInicial: 0, limite: 20000, fechamento: 25, vencimento: 5, final: '0937' },
];

const P = 'pessoal';
const E = 'empresa';
export const CATEGORIAS: Categoria[] = [
  { id: 'p-salario', espaco: P, nome: 'Salário', tipo: 'receita', icone: 'briefcase', cor: 'var(--graf-1)' },
  { id: 'p-freela', espaco: P, nome: 'Freelance', tipo: 'receita', icone: 'banknote', cor: 'var(--graf-2)' },
  { id: 'p-rendimentos', espaco: P, nome: 'Rendimentos', tipo: 'receita', icone: 'trending-up', cor: 'var(--graf-3)' },
  { id: 'p-moradia', espaco: P, nome: 'Moradia', tipo: 'despesa', icone: 'house', cor: 'var(--graf-1)', orcamento: 2900 },
  { id: 'p-mercado', espaco: P, nome: 'Mercado', tipo: 'despesa', icone: 'shopping-basket', cor: 'var(--graf-2)', orcamento: 1400 },
  { id: 'p-restaurantes', espaco: P, nome: 'Restaurantes', tipo: 'despesa', icone: 'utensils', cor: 'var(--graf-3)', orcamento: 450 },
  { id: 'p-transporte', espaco: P, nome: 'Transporte', tipo: 'despesa', icone: 'car', cor: 'var(--graf-4)', orcamento: 650 },
  { id: 'p-saude', espaco: P, nome: 'Saúde', tipo: 'despesa', icone: 'heart-pulse', cor: 'var(--graf-5)', orcamento: 600 },
  { id: 'p-casa', espaco: P, nome: 'Contas da casa', tipo: 'despesa', icone: 'zap', cor: 'var(--graf-6)', orcamento: 450 },
  { id: 'p-educacao', espaco: P, nome: 'Educação', tipo: 'despesa', icone: 'graduation-cap', cor: '#0891b2', orcamento: 400 },
  { id: 'p-lazer', espaco: P, nome: 'Lazer e assinaturas', tipo: 'despesa', icone: 'gamepad-2', cor: '#db2777', orcamento: 400 },
  { id: 'p-compras', espaco: P, nome: 'Compras', tipo: 'despesa', icone: 'shirt', cor: '#65a30d', orcamento: 700 },
  { id: 'e-servicos', espaco: E, nome: 'Venda de serviços', tipo: 'receita', icone: 'briefcase', cor: 'var(--graf-1)', dre: 'receita' },
  { id: 'e-produtos', espaco: E, nome: 'Venda de produtos', tipo: 'receita', icone: 'package', cor: 'var(--graf-2)', dre: 'receita' },
  { id: 'e-financeiras', espaco: E, nome: 'Receitas financeiras', tipo: 'receita', icone: 'trending-up', cor: 'var(--graf-3)', dre: 'financeiro' },
  { id: 'e-impostos', espaco: E, nome: 'Impostos sobre vendas', tipo: 'despesa', icone: 'receipt', cor: 'var(--graf-5)', dre: 'deducao', orcamento: 3600 },
  { id: 'e-fornecedores', espaco: E, nome: 'Fornecedores', tipo: 'despesa', icone: 'truck', cor: 'var(--graf-2)', dre: 'custo', orcamento: 6500 },
  { id: 'e-folha', espaco: E, nome: 'Folha de pagamento', tipo: 'despesa', icone: 'users', cor: 'var(--graf-1)', dre: 'despesa', orcamento: 18500 },
  { id: 'e-prolabore', espaco: E, nome: 'Pró-labore', tipo: 'despesa', icone: 'user', cor: 'var(--graf-4)', dre: 'despesa', orcamento: 7000 },
  { id: 'e-aluguel', espaco: E, nome: 'Aluguel e condomínio', tipo: 'despesa', icone: 'building-2', cor: 'var(--graf-6)', dre: 'despesa', orcamento: 5600 },
  { id: 'e-marketing', espaco: E, nome: 'Marketing', tipo: 'despesa', icone: 'megaphone', cor: 'var(--graf-3)', dre: 'despesa', orcamento: 2500 },
  { id: 'e-software', espaco: E, nome: 'Software e ferramentas', tipo: 'despesa', icone: 'code', cor: '#0891b2', dre: 'despesa', orcamento: 600 },
  { id: 'e-contabilidade', espaco: E, nome: 'Contabilidade', tipo: 'despesa', icone: 'calculator', cor: '#db2777', dre: 'despesa', orcamento: 950 },
  { id: 'e-tarifas', espaco: E, nome: 'Tarifas bancárias', tipo: 'despesa', icone: 'landmark', cor: '#65a30d', dre: 'financeiro', orcamento: 120 },
];

export const CENTROS_CUSTO: CentroCusto[] = [
  { id: 'projetos', nome: 'Projetos' },
  { id: 'loja', nome: 'Loja on-line' },
  { id: 'adm', nome: 'Administrativo' },
];

export const CONTATOS: Contato[] = [
  { id: 'c-padaria', nome: 'Padaria Pão Dourado', tipo: 'cliente' },
  { id: 'c-clinica', nome: 'Clínica Bem Viver', tipo: 'cliente' },
  { id: 'c-mercado', nome: 'Mercado Sol Nascente', tipo: 'cliente' },
  { id: 'c-escola', nome: 'Escola Primeiros Passos', tipo: 'cliente' },
  { id: 'c-hotel', nome: 'Pousada Mar Azul', tipo: 'cliente' },
  { id: 'c-academia', nome: 'Academia Movimento', tipo: 'cliente' },
  { id: 'f-grafica', nome: 'Gráfica Rápida', tipo: 'fornecedor' },
  { id: 'f-papelaria', nome: 'Papelaria Central', tipo: 'fornecedor' },
  { id: 'f-embalagens', nome: 'Embalagens Brasil', tipo: 'fornecedor' },
  { id: 'f-foto', nome: 'Estúdio de Foto Luz', tipo: 'fornecedor' },
];

const HOJE = new Date();
HOJE.setHours(0, 0, 0, 0);
export const hoje = () => new Date(HOJE);

/** Hoje + `n` dias, `AAAA-MM-DD`. */
export const dia = (n: number) => dataIso(new Date(HOJE.getFullYear(), HOJE.getMonth(), HOJE.getDate() + n));

/** Dia `d` do mês `deslocamento` meses a partir do atual (o dia passa do fim → último dia). */
function noMes(deslocamento: number, d: number): string {
  const ultimo = new Date(HOJE.getFullYear(), HOJE.getMonth() + deslocamento + 1, 0).getDate();
  return dataIso(new Date(HOJE.getFullYear(), HOJE.getMonth() + deslocamento, Math.min(d, ultimo)));
}

/** Gerador pseudoaleatório com semente (mulberry32): mesmos números a cada carga. */
function sorteador(semente: number) {
  let a = semente >>> 0;
  const proximo = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    entre: (min: number, max: number) => Math.round((min + proximo() * (max - min)) * 100) / 100,
    inteiro: (min: number, max: number) => Math.floor(min + proximo() * (max - min + 1)),
    chance: (p: number) => proximo() < p,
    um: <T,>(lista: readonly T[]) => lista[Math.floor(proximo() * lista.length)],
  };
}

/** Meses de dados: 12 para trás, o atual e 3 à frente (cobre a projeção de 90 dias). */
export const MES_INICIAL = -12;
const MES_FINAL = 3;
/** Primeiro dia dos dados (base dos saldos iniciais). */
export const INICIO_DADOS = noMes(MES_INICIAL, 1);

let seq = 0;
const novoIdBase = () => `l${++seq}`;

function gerar(): Lancamento[] {
  const r = sorteador(20261113);
  const lista: Lancamento[] = [];
  const hojeIso = dia(0);
  const add = (l: Omit<Lancamento, 'id' | 'pago'> & { pago?: boolean }) => {
    // no futuro só existe o que já se sabe: o fixo, a parcela e a nota emitida
    // para um cliente ou fornecedor (a compra do mercado de semana que vem, não)
    if (l.data > hojeIso && l.pago === undefined && !l.recorrente && !l.parcela && !l.contato) return;
    lista.push({ ...l, id: novoIdBase(), pago: l.pago ?? l.data <= hojeIso });
  };

  for (let m = MES_INICIAL; m <= MES_FINAL; m++) {
    // ---------- pessoal ----------
    add({ espaco: P, tipo: 'receita', descricao: 'Salário', valor: m >= -5 ? 8900 : 8500, data: noMes(m, 5), conta: 'p-corrente', categoria: 'p-salario', recorrente: true });
    if (r.chance(0.45)) add({ espaco: P, tipo: 'receita', descricao: r.um(['Freelance: site institucional', 'Freelance: identidade visual', 'Freelance: manutenção de loja']), valor: r.entre(900, 2600), data: noMes(m, r.inteiro(14, 24)), conta: 'p-corrente', categoria: 'p-freela' });
    add({ espaco: P, tipo: 'receita', descricao: 'Rendimento do CDB', valor: r.entre(160, 230), data: noMes(m, 31), conta: 'p-invest', categoria: 'p-rendimentos', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Aluguel', valor: 2200, data: noMes(m, 5), conta: 'p-corrente', categoria: 'p-moradia', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Condomínio', valor: 640, data: noMes(m, 10), conta: 'p-corrente', categoria: 'p-moradia', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Conta de luz', valor: r.entre(150, 260), data: noMes(m, 12), conta: 'p-corrente', categoria: 'p-casa', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Conta de água', valor: r.entre(70, 110), data: noMes(m, 15), conta: 'p-corrente', categoria: 'p-casa', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Internet e celular', valor: 159.9, data: noMes(m, 20), conta: 'p-corrente', categoria: 'p-casa', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Plano de saúde', valor: 489.5, data: noMes(m, 8), conta: 'p-corrente', categoria: 'p-saude', recorrente: true });
    if (r.chance(0.35)) add({ espaco: P, tipo: 'despesa', descricao: r.um(['Farmácia', 'Consulta', 'Exames']), valor: r.entre(40, 260), data: noMes(m, r.inteiro(2, 27)), conta: 'p-cartao', categoria: 'p-saude' });
    add({ espaco: P, tipo: 'despesa', descricao: 'Curso de inglês', valor: 350, data: noMes(m, 10), conta: 'p-corrente', categoria: 'p-educacao', recorrente: true });
    for (const d of [3, 10, 17, 24]) add({ espaco: P, tipo: 'despesa', descricao: r.um(['Supermercado Bom Preço', 'Atacadão da Esquina', 'Hortifruti']), valor: r.entre(230, 420), data: noMes(m, d + r.inteiro(0, 2)), conta: 'p-cartao', categoria: 'p-mercado' });
    for (let i = 0, n = r.inteiro(2, 5); i < n; i++) add({ espaco: P, tipo: 'despesa', descricao: r.um(['Pizzaria', 'Almoço', 'Cafeteria', 'Hamburgueria', 'Restaurante japonês']), valor: r.entre(38, 170), data: noMes(m, r.inteiro(1, 28)), conta: 'p-cartao', categoria: 'p-restaurantes' });
    for (let i = 0; i < 2; i++) add({ espaco: P, tipo: 'despesa', descricao: 'Combustível', valor: r.entre(170, 260), data: noMes(m, 6 + i * 13), conta: 'p-cartao', categoria: 'p-transporte' });
    for (let i = 0, n = r.inteiro(1, 4); i < n; i++) add({ espaco: P, tipo: 'despesa', descricao: 'Corrida por aplicativo', valor: r.entre(16, 48), data: noMes(m, r.inteiro(1, 28)), conta: 'p-cartao', categoria: 'p-transporte' });
    add({ espaco: P, tipo: 'despesa', descricao: 'Streaming de vídeo', valor: 55.9, data: noMes(m, 14), conta: 'p-cartao', categoria: 'p-lazer', recorrente: true });
    add({ espaco: P, tipo: 'despesa', descricao: 'Streaming de música', valor: 21.9, data: noMes(m, 14), conta: 'p-cartao', categoria: 'p-lazer', recorrente: true });
    if (r.chance(0.6)) add({ espaco: P, tipo: 'despesa', descricao: r.um(['Cinema', 'Show', 'Passeio no parque', 'Livraria']), valor: r.entre(60, 240), data: noMes(m, r.inteiro(1, 28)), conta: 'p-cartao', categoria: 'p-lazer' });
    if (r.chance(0.7)) add({ espaco: P, tipo: 'despesa', descricao: r.um(['Roupas', 'Tênis', 'Presente de aniversário', 'Utensílios de cozinha']), valor: r.entre(80, 460), data: noMes(m, r.inteiro(1, 28)), conta: 'p-cartao', categoria: 'p-compras' });
    if (r.chance(0.5)) add({ espaco: P, tipo: 'despesa', descricao: 'Feira', valor: r.entre(40, 90), data: noMes(m, r.inteiro(1, 28)), conta: 'p-carteira', categoria: 'p-mercado' });
    add({ espaco: P, tipo: 'transferencia', descricao: 'Guardar na poupança', valor: 800, data: noMes(m, 6), conta: 'p-corrente', contaDestino: 'p-poupanca', recorrente: true });
    if (m % 2 === 0) add({ espaco: P, tipo: 'transferencia', descricao: 'Saque', valor: 200, data: noMes(m, 9), conta: 'p-corrente', contaDestino: 'p-carteira' });

    // ---------- empresa ----------
    for (let i = 0, n = r.inteiro(5, 8); i < n; i++) {
      const c = r.um(CONTATOS.filter((x) => x.tipo === 'cliente'));
      add({ espaco: E, tipo: 'receita', descricao: `${r.um(['Projeto de site', 'Identidade visual', 'Gestão de redes', 'Campanha', 'Manutenção mensal'])}: ${c.nome}`, valor: r.entre(1800, 8600), data: noMes(m, r.inteiro(1, 28)), conta: r.chance(0.6) ? 'e-azul' : 'e-verde', categoria: 'e-servicos', contato: c.id, centroCusto: 'projetos' });
    }
    for (const d of [7, 14, 21, 28]) add({ espaco: E, tipo: 'receita', descricao: 'Vendas da loja on-line', valor: r.entre(1600, 4200), data: noMes(m, d), conta: 'e-verde', categoria: 'e-produtos', centroCusto: 'loja' });
    add({ espaco: E, tipo: 'receita', descricao: 'Rendimento da reserva', valor: r.entre(480, 620), data: noMes(m, 31), conta: 'e-reserva', categoria: 'e-financeiras', centroCusto: 'adm', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Folha de pagamento', valor: m >= -3 ? 19800 : 18400, data: noMes(m, 5), conta: 'e-azul', categoria: 'e-folha', centroCusto: 'adm', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Pró-labore', valor: 7000, data: noMes(m, 5), conta: 'e-azul', categoria: 'e-prolabore', centroCusto: 'adm', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Aluguel do escritório', valor: 4800, data: noMes(m, 10), conta: 'e-azul', categoria: 'e-aluguel', centroCusto: 'adm', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Condomínio', valor: 760, data: noMes(m, 10), conta: 'e-azul', categoria: 'e-aluguel', centroCusto: 'adm', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Honorários contábeis', valor: 950, data: noMes(m, 10), conta: 'e-azul', categoria: 'e-contabilidade', centroCusto: 'adm', recorrente: true });
    for (let i = 0, n = r.inteiro(2, 3); i < n; i++) {
      const f = r.um(CONTATOS.filter((x) => x.tipo === 'fornecedor'));
      add({ espaco: E, tipo: 'despesa', descricao: `Compra: ${f.nome}`, valor: r.entre(700, 3200), data: noMes(m, r.inteiro(3, 26)), conta: 'e-azul', categoria: 'e-fornecedores', contato: f.id, centroCusto: f.id === 'f-embalagens' ? 'loja' : 'projetos' });
    }
    add({ espaco: E, tipo: 'despesa', descricao: 'Anúncios on-line', valor: r.entre(1100, 2900), data: noMes(m, 15), conta: 'e-cartao', categoria: 'e-marketing', centroCusto: 'loja' });
    add({ espaco: E, tipo: 'despesa', descricao: 'Editor de design', valor: 249, data: noMes(m, 2), conta: 'e-cartao', categoria: 'e-software', centroCusto: 'projetos', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Hospedagem dos sites', valor: 159, data: noMes(m, 8), conta: 'e-cartao', categoria: 'e-software', centroCusto: 'projetos', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'E-mail e documentos', valor: 89, data: noMes(m, 12), conta: 'e-cartao', categoria: 'e-software', centroCusto: 'adm', recorrente: true });
    add({ espaco: E, tipo: 'despesa', descricao: 'Tarifas do mês', valor: r.entre(45, 95), data: noMes(m, 31), conta: 'e-azul', categoria: 'e-tarifas', centroCusto: 'adm' });
  }

  // compra parcelada: notebook em 10x, começou há 4 meses
  for (let i = 0; i < 10; i++) add({ espaco: P, tipo: 'despesa', descricao: 'Notebook', valor: 389.9, data: noMes(-4 + i, 12), conta: 'p-cartao', categoria: 'p-compras', parcela: { numero: i + 1, total: 10 } });

  // impostos: 6% do faturamento do mês anterior, no dia 20
  for (let m = MES_INICIAL + 1; m <= MES_FINAL; m++) {
    const [de, ate] = [noMes(m - 1, 1), noMes(m - 1, 31)];
    const fat = somarMoeda(lista.filter((l) => l.espaco === E && l.tipo === 'receita' && l.categoria !== 'e-financeiras' && l.data >= de && l.data <= ate).map((l) => l.valor));
    add({ espaco: E, tipo: 'despesa', descricao: 'Simples Nacional (DAS)', valor: Math.round(fat * 6) / 100, data: noMes(m, 20), conta: 'e-azul', categoria: 'e-impostos', centroCusto: 'adm', recorrente: true });
  }

  // fatura dos cartões: as compras do mês anterior, paga pela conta corrente
  for (const cartao of CONTAS.filter((c) => c.tipo === 'cartao')) {
    const origem = cartao.espaco === P ? 'p-corrente' : 'e-azul';
    for (let m = MES_INICIAL + 1; m <= MES_FINAL; m++) {
      const [de, ate] = [noMes(m - 1, 1), noMes(m - 1, 31)];
      const total = somarMoeda(lista.filter((l) => l.conta === cartao.id && l.tipo === 'despesa' && l.data >= de && l.data <= ate).map((l) => l.valor));
      add({ espaco: cartao.espaco, tipo: 'transferencia', descricao: `Fatura ${cartao.nome}`, valor: total, data: noMes(m, cartao.vencimento ?? 10), conta: origem, contaDestino: cartao.id, recorrente: true });
    }
  }

  // o que pede atenção hoje: atrasados, vencendo e a receber
  add({ espaco: P, tipo: 'despesa', descricao: 'IPVA (3ª parcela)', valor: 412.3, data: dia(-3), pago: false, conta: 'p-corrente', categoria: 'p-transporte', parcela: { numero: 3, total: 3 } });
  add({ espaco: P, tipo: 'despesa', descricao: 'Seguro do carro', valor: 189, data: dia(0), pago: false, conta: 'p-corrente', categoria: 'p-transporte', recorrente: true });
  add({ espaco: P, tipo: 'receita', descricao: 'Freelance: loja da padaria', valor: 1800, data: dia(4), pago: false, conta: 'p-corrente', categoria: 'p-freela' });
  add({ espaco: E, tipo: 'receita', descricao: 'Identidade visual: Mercado Sol Nascente', valor: 4200, data: dia(-6), pago: false, conta: 'e-azul', categoria: 'e-servicos', contato: 'c-mercado', centroCusto: 'projetos', parcela: { numero: 2, total: 2 } });
  add({ espaco: E, tipo: 'receita', descricao: 'Campanha: Clínica Bem Viver', valor: 3600, data: dia(-1), pago: false, conta: 'e-azul', categoria: 'e-servicos', contato: 'c-clinica', centroCusto: 'projetos' });
  add({ espaco: E, tipo: 'despesa', descricao: 'Compra: Gráfica Rápida', valor: 1280, data: dia(0), pago: false, conta: 'e-azul', categoria: 'e-fornecedores', contato: 'f-grafica', centroCusto: 'projetos' });

  return lista.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
}

export const LANCAMENTOS: Lancamento[] = gerar();

export const METAS: Meta[] = [
  { id: 'm-reserva', espaco: P, nome: 'Reserva de emergência', icone: 'shield-check', cor: 'ok', alvo: 30000, guardado: 18400, prazo: dia(240) },
  { id: 'm-viagem', espaco: P, nome: 'Viagem de férias', icone: 'plane', cor: 'info', alvo: 15000, guardado: 6200, prazo: dia(420) },
  { id: 'm-carro', espaco: P, nome: 'Troca do carro', icone: 'car', cor: 'destaque', alvo: 40000, guardado: 9000, prazo: dia(900) },
  { id: 'm-caixa', espaco: E, nome: 'Reserva de 3 meses de custos', icone: 'piggy-bank', cor: 'ok', alvo: 120000, guardado: 74000, prazo: dia(300) },
  { id: 'm-equip', espaco: E, nome: 'Equipamento de fotografia', icone: 'camera', cor: 'info', alvo: 25000, guardado: 11000, prazo: dia(150) },
];

export const novoId = () => `n-${Date.now().toString(36)}-${(++seq).toString(36)}`;
