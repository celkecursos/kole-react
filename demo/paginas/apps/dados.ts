import type { ColunaKanban, CorKanban, EtiquetaKanban, PessoaAvatar, Prioridade, SituacaoTarefa, TarefaLista } from '../../../src';
import { cena, retrato } from '../Bloco';

/*
 * Dados fictícios das telas de Kanban e Tarefas. As datas saem de "hoje" (o
 * teste visual fixa o relógio, então as telas saem sempre iguais).
 */

/** `AAAA-MM-DD` daqui a `dias` dias (negativo = no passado). */
export function dia(dias: number, base = new Date()) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/** Instante de `horas` horas atrás. */
export const haHoras = (horas: number) => new Date(Date.now() - horas * 3_600_000);

export interface Pessoa extends PessoaAvatar {
  id: string;
}

export const PESSOAS: Pessoa[] = [
  { id: 'ana', nome: 'Ana Souza', foto: retrato('#1f5fe0', 'AS') },
  { id: 'bruno', nome: 'Bruno Lima' },
  { id: 'carla', nome: 'Carla Mendes', foto: retrato('#13795b', 'CM') },
  { id: 'diego', nome: 'Diego Rocha' },
  { id: 'elisa', nome: 'Elisa Prado', foto: retrato('#7c3aed', 'EP') },
  { id: 'fabio', nome: 'Fábio Nunes' },
];
export const pessoa = (id: string) => PESSOAS.find((p) => p.id === id)!;
export const pessoas = (ids: string[]) => ids.map(pessoa);

export interface EtiquetaDemo extends EtiquetaKanban {
  id: string;
}

export const ETIQUETAS: EtiquetaDemo[] = [
  { id: 'design', rotulo: 'Design', cor: 'graf-4' },
  { id: 'front', rotulo: 'Front-end', cor: 'pri' },
  { id: 'back', rotulo: 'Back-end', cor: 'graf-6' },
  { id: 'conteudo', rotulo: 'Conteúdo', cor: 'graf-3' },
  { id: 'bug', rotulo: 'Bug', cor: 'err' },
  { id: 'urgente', rotulo: 'Urgente', cor: 'warn' },
  { id: 'cliente', rotulo: 'Cliente', cor: 'graf-2' },
  { id: 'financeiro', rotulo: 'Financeiro', cor: 'graf-5' },
];
export const etiquetas = (ids: string[]) => ids.map((id) => ETIQUETAS.find((e) => e.id === id)!);

export interface Subtarefa {
  id: string;
  texto: string;
  feita: boolean;
}

export interface Comentario {
  autor: string;
  texto: string;
  quando: Date;
}

export interface CartaoDemo {
  id: string;
  titulo: string;
  descricao?: string;
  capa?: string;
  etiquetas: string[];
  prioridade?: Prioridade;
  vencimento?: string;
  responsaveis: string[];
  subtarefas: Subtarefa[];
  anexos?: number;
  comentarios: Comentario[];
  /** Negócio do funil de vendas (CRM): aparece no espaço `extra` do cartão. */
  negocio?: { empresa: string; valor: number; chance: number };
}

export type ColunaDemo = ColunaKanban<CartaoDemo>;

export interface QuadroDemo {
  id: string;
  nome: string;
  descricao: string;
  cor: CorKanban;
  favorito: boolean;
  atualizado: Date;
  membros: string[];
  /** Coluna em que o cartão conta como concluído (prazo verde, progresso do quadro). */
  colunaConcluida?: string;
  colunas: ColunaDemo[];
}

let seq = 0;
const sub = (texto: string, feita = false): Subtarefa => ({ id: `s${++seq}`, texto, feita });
const cartao = (c: Partial<CartaoDemo> & { id: string; titulo: string }): CartaoDemo => ({
  etiquetas: [],
  responsaveis: [],
  subtarefas: [],
  comentarios: [],
  ...c,
});

export function quadrosIniciais(): QuadroDemo[] {
  return [
    {
      id: 'lancamento-site',
      nome: 'Lançamento do site',
      descricao: 'Novo site institucional com loja e blog.',
      cor: 'pri',
      favorito: true,
      atualizado: haHoras(2),
      membros: ['ana', 'bruno', 'carla', 'diego', 'elisa'],
      colunaConcluida: 'feito',
      colunas: [
        {
          id: 'fazer',
          titulo: 'A fazer',
          cor: 'neutro',
          itens: [
            cartao({
              id: 'c1',
              titulo: 'Escrever os textos da página Sobre',
              descricao: 'História da empresa, missão e equipe, em até 600 palavras.',
              etiquetas: ['conteudo'],
              prioridade: 'media',
              vencimento: dia(5),
              responsaveis: ['carla'],
              subtarefas: [sub('Rascunho'), sub('Revisão'), sub('Fotos da equipe')],
            }),
            cartao({
              id: 'c2',
              titulo: 'Configurar o domínio e o certificado',
              etiquetas: ['back'],
              prioridade: 'alta',
              vencimento: dia(1),
              responsaveis: ['diego'],
              comentarios: [{ autor: 'diego', texto: 'O registro do domínio já foi renovado.', quando: haHoras(20) }],
            }),
            cartao({ id: 'c3', titulo: 'Política de privacidade', etiquetas: ['conteudo'], prioridade: 'baixa', responsaveis: ['ana'] }),
          ],
        },
        {
          id: 'andamento',
          titulo: 'Em andamento',
          cor: 'info',
          limite: 3,
          itens: [
            cartao({
              id: 'c4',
              titulo: 'Layout da página inicial',
              descricao: 'Faixa principal, destaques de produto e depoimentos.',
              capa: cena('#4fb3e8', '#15803d'),
              etiquetas: ['design', 'urgente'],
              prioridade: 'critica',
              vencimento: dia(-1),
              responsaveis: ['elisa', 'ana', 'bruno', 'carla'],
              subtarefas: [sub('Desktop', true), sub('Celular', true), sub('Modo escuro'), sub('Aprovação do cliente')],
              anexos: 3,
              comentarios: [
                { autor: 'ana', texto: 'O cliente pediu mais destaque para a loja.', quando: haHoras(30) },
                { autor: 'elisa', texto: 'Ajustei a faixa principal, podem revisar?', quando: haHoras(3) },
              ],
            }),
            cartao({
              id: 'c5',
              titulo: 'Carrinho e checkout',
              etiquetas: ['front', 'back'],
              prioridade: 'alta',
              vencimento: dia(0),
              responsaveis: ['bruno', 'diego'],
              subtarefas: [sub('Carrinho', true), sub('Frete', true), sub('Pagamento com Pix')],
              anexos: 1,
            }),
          ],
        },
        {
          id: 'revisao',
          titulo: 'Revisão',
          cor: 'warn',
          itens: [
            cartao({
              id: 'c6',
              titulo: 'Corrigir o menu no celular',
              descricao: 'O menu não fecha ao tocar fora dele no Safari.',
              etiquetas: ['bug', 'front'],
              prioridade: 'alta',
              vencimento: dia(2),
              responsaveis: ['bruno'],
              comentarios: [{ autor: 'carla', texto: 'Reproduzi no iPhone 13.', quando: haHoras(5) }],
            }),
          ],
        },
        {
          id: 'feito',
          titulo: 'Concluído',
          cor: 'ok',
          itens: [
            cartao({
              id: 'c7',
              titulo: 'Identidade visual',
              etiquetas: ['design'],
              vencimento: dia(-6),
              responsaveis: ['elisa'],
              subtarefas: [sub('Logo', true), sub('Cores', true), sub('Tipografia', true)],
              anexos: 5,
            }),
            cartao({ id: 'c8', titulo: 'Escolher a hospedagem', etiquetas: ['back'], vencimento: dia(-10), responsaveis: ['diego'] }),
          ],
        },
      ],
    },
    {
      id: 'vendas',
      nome: 'Funil de vendas',
      descricao: 'Negócios do trimestre, da prospecção ao fechamento.',
      cor: 'graf-2',
      favorito: true,
      atualizado: haHoras(26),
      membros: ['ana', 'fabio'],
      colunaConcluida: 'fechado',
      colunas: [
        {
          id: 'prospeccao',
          titulo: 'Prospecção',
          cor: 'neutro',
          itens: [
            cartao({ id: 'v1', titulo: 'Plano anual de manutenção', responsaveis: ['fabio'], negocio: { empresa: 'Padaria Pão Dourado', valor: 4800, chance: 20 } }),
            cartao({ id: 'v2', titulo: 'Sistema de pedidos', responsaveis: ['ana'], negocio: { empresa: 'Restaurante Sabor Caseiro', valor: 12500, chance: 30 } }),
          ],
        },
        {
          id: 'proposta',
          titulo: 'Proposta enviada',
          cor: 'info',
          itens: [
            cartao({
              id: 'v3',
              titulo: 'Loja virtual',
              etiquetas: ['cliente'],
              vencimento: dia(3),
              responsaveis: ['fabio'],
              negocio: { empresa: 'Loja Casa & Cia', valor: 28000, chance: 60 },
            }),
          ],
        },
        {
          id: 'negociacao',
          titulo: 'Negociação',
          cor: 'warn',
          itens: [
            cartao({
              id: 'v4',
              titulo: 'Integração com o ERP',
              etiquetas: ['urgente'],
              prioridade: 'alta',
              vencimento: dia(-2),
              responsaveis: ['ana', 'fabio'],
              negocio: { empresa: 'Distribuidora Litoral', valor: 46000, chance: 75 },
            }),
          ],
        },
        {
          id: 'fechado',
          titulo: 'Fechado',
          cor: 'ok',
          itens: [cartao({ id: 'v5', titulo: 'Site institucional', responsaveis: ['ana'], negocio: { empresa: 'Clínica Bem-Estar', valor: 9600, chance: 100 } })],
        },
      ],
    },
    {
      id: 'suporte',
      nome: 'Atendimento e suporte',
      descricao: 'Chamados dos clientes, do pedido à solução.',
      cor: 'graf-6',
      favorito: false,
      atualizado: haHoras(4),
      membros: ['carla', 'diego', 'bruno'],
      colunaConcluida: 'resolvidos',
      colunas: [
        {
          id: 'novos',
          titulo: 'Novos',
          itens: [
            cartao({ id: 's1', titulo: 'Erro ao emitir boleto', etiquetas: ['bug', 'financeiro'], prioridade: 'critica', vencimento: dia(0), responsaveis: ['diego'] }),
            cartao({ id: 's2', titulo: 'Trocar o e-mail de acesso', prioridade: 'baixa', responsaveis: ['carla'] }),
          ],
        },
        { id: 'atendimento', titulo: 'Em atendimento', limite: 4, itens: [cartao({ id: 's3', titulo: 'Relatório de vendas em branco', etiquetas: ['bug'], prioridade: 'media', responsaveis: ['bruno'] })] },
        { id: 'aguardando', titulo: 'Aguardando cliente', itens: [] },
        { id: 'resolvidos', titulo: 'Resolvidos', itens: [cartao({ id: 's4', titulo: 'Importar planilha de clientes', responsaveis: ['carla'] })] },
      ],
    },
    {
      id: 'black-friday',
      nome: 'Campanha de Black Friday',
      descricao: 'Peças, e-mails e posts da campanha de novembro.',
      cor: 'graf-5',
      favorito: false,
      atualizado: haHoras(72),
      membros: ['elisa', 'ana'],
      colunaConcluida: 'publicado',
      colunas: [
        { id: 'ideias', titulo: 'Ideias', itens: [cartao({ id: 'b1', titulo: 'Contagem regressiva no site', etiquetas: ['design'], responsaveis: ['elisa'] })] },
        { id: 'producao', titulo: 'Produção', itens: [cartao({ id: 'b2', titulo: 'E-mail de pré-venda', etiquetas: ['conteudo'], vencimento: dia(4), responsaveis: ['ana'] })] },
        { id: 'publicado', titulo: 'Publicado', itens: [] },
      ],
    },
    {
      id: 'planejamento',
      nome: 'Planejamento do próximo ano',
      descricao: 'Metas e projetos ainda por definir.',
      cor: 'graf-3',
      favorito: false,
      atualizado: haHoras(240),
      membros: ['ana'],
      colunas: [],
    },
  ];
}

export const formatarMoeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// ---------------------------------------------------------------- tarefas

export interface TarefaDemo extends TarefaLista {
  situacao: SituacaoTarefa;
  descricao?: string;
  /** Id da lista (ou nenhuma). */
  lista?: string;
  /** Está no "Meu dia". */
  meuDia?: boolean;
  /** Ids das etiquetas (as `etiquetas` da linha saem delas). */
  idsEtiquetas: string[];
  idResponsavel?: string;
  criadaEm: Date;
}

export const LISTAS = [
  { id: 'site', rotulo: 'Lançamento do site', cor: 'pri' as CorKanban },
  { id: 'financeiro', rotulo: 'Financeiro', cor: 'graf-5' as CorKanban },
  { id: 'pessoal', rotulo: 'Pessoal', cor: 'graf-3' as CorKanban },
];

export function tarefasIniciais(): TarefaDemo[] {
  const t = (x: Omit<TarefaDemo, 'criadaEm' | 'idsEtiquetas'> & { idsEtiquetas?: string[]; criadaHa?: number }): TarefaDemo => ({
    idsEtiquetas: [],
    criadaEm: haHoras(x.criadaHa ?? 48),
    ...x,
  });
  return [
    t({ id: 't1', titulo: 'Revisar o layout da página inicial', situacao: 'andamento', prioridade: 'alta', vencimento: dia(0), lista: 'site', meuDia: true, idsEtiquetas: ['design'], idResponsavel: 'ana', subtarefas: { feitas: 2, total: 4 } }),
    t({ id: 't2', titulo: 'Pagar a fatura da hospedagem', situacao: 'aberta', prioridade: 'alta', vencimento: dia(-1), lista: 'financeiro', meuDia: true, idsEtiquetas: ['financeiro', 'urgente'], idResponsavel: 'ana' }),
    t({ id: 't3', titulo: 'Responder o orçamento da Loja Casa & Cia', situacao: 'aberta', prioridade: 'media', vencimento: dia(1), meuDia: true, idsEtiquetas: ['cliente'], idResponsavel: 'fabio', descricao: 'Mandar a proposta revisada com o desconto de 5%.' }),
    t({ id: 't4', titulo: 'Configurar o certificado do domínio', situacao: 'bloqueada', prioridade: 'alta', vencimento: dia(2), lista: 'site', idsEtiquetas: ['back'], idResponsavel: 'diego', descricao: 'Esperando o acesso ao painel do registro.' }),
    t({ id: 't5', titulo: 'Conferir as notas fiscais do mês', situacao: 'aberta', prioridade: 'media', vencimento: dia(4), lista: 'financeiro', idsEtiquetas: ['financeiro'], idResponsavel: 'ana' }),
    t({ id: 't6', titulo: 'Agendar a revisão do carro', situacao: 'aberta', prioridade: 'baixa', vencimento: dia(9), lista: 'pessoal' }),
    t({ id: 't7', titulo: 'Escrever os textos da página Sobre', situacao: 'aberta', prioridade: 'media', vencimento: dia(5), lista: 'site', idsEtiquetas: ['conteudo'], idResponsavel: 'carla' }),
    t({ id: 't8', titulo: 'Enviar o relatório semanal', situacao: 'concluida', prioridade: 'media', vencimento: dia(-2), idResponsavel: 'ana' }),
    t({ id: 't9', titulo: 'Escolher a hospedagem', situacao: 'concluida', lista: 'site', vencimento: dia(-10), idsEtiquetas: ['back'], idResponsavel: 'diego' }),
  ];
}
