import type { ItemNav, SecaoNav } from '../../src';

// Só dados: o teste visual importa o menu no Node, sem CSS nem páginas.

export const GUIAS = [
  { rota: '/docs/instalacao', rotulo: 'Instalação', icone: 'download' },
  { rota: '/docs/tema', rotulo: 'Tema e tokens', icone: 'palette' },
  { rota: '/docs/tailwind', rotulo: 'Tailwind', icone: 'code' },
  { rota: '/docs/carregamento', rotulo: 'Carregamento', icone: 'loader-circle' },
  { rota: '/docs/changelog', rotulo: 'Changelog', icone: 'history' },
];

export interface ComponenteDoc {
  /** Final da rota: /docs/componentes/<slug>. */
  slug: string;
  rotulo: string;
  /** Uma linha para o índice de componentes. */
  desc: string;
}

/** Catálogo da documentação: categoria → componentes (o menu e o índice seguem esta lista). */
export const CATEGORIAS: { rotulo: string; icone: string; itens: ComponenteDoc[] }[] = [
  {
    rotulo: 'Ações',
    icone: 'square-mouse-pointer',
    itens: [
      { slug: 'botao', rotulo: 'Botão', desc: 'Cores, aparências, ícone e carregando' },
      { slug: 'grupo-botoes', rotulo: 'Grupo de botões', desc: 'Botões colados, barra e alternância' },
      { slug: 'menu-suspenso', rotulo: 'Menu suspenso', desc: 'Lista de ações num botão' },
      { slug: 'acao-linha', rotulo: 'Ação de linha', desc: 'Ícone de ação em tabelas' },
      { slug: 'botao-fechar', rotulo: 'Botão fechar', desc: 'O × de cards e painéis' },
    ],
  },
  {
    rotulo: 'Formulários',
    icone: 'pencil',
    itens: [
      { slug: 'form', rotulo: 'Formulário', desc: 'Página ou modal com seções e Salvar' },
      { slug: 'campo-texto', rotulo: 'Campo de texto', desc: 'Rótulo, máscara, prefixo e validação' },
      { slug: 'campos-prontos', rotulo: 'Campos prontos', desc: 'CPF, CNPJ, CEP, data, moeda, placa…' },
      { slug: 'campo-textarea', rotulo: 'Área de texto', desc: 'Texto longo com contador' },
      { slug: 'campo-senha', rotulo: 'Senha', desc: 'Revelar e medidor de força' },
      { slug: 'campo-select', rotulo: 'Seleção', desc: 'Uma ou várias opções, com busca' },
      { slug: 'campo-busca', rotulo: 'Busca com sugestões', desc: 'Autocompletar vindo do servidor' },
      { slug: 'campo-uf', rotulo: 'UF, cidade e tipo de pessoa', desc: 'Campos de domínio prontos' },
      { slug: 'campo-marcacao', rotulo: 'Caixa e chave', desc: 'Sim/não: checkbox ou switch' },
      { slug: 'escolha', rotulo: 'Escolha', desc: 'Segmentado ou rádio' },
      { slug: 'arquivo', rotulo: 'Anexos e fotos', desc: 'Upload, visualizador e foto' },
      { slug: 'picklist', rotulo: 'Picklist', desc: 'Mover itens entre duas listas' },
      { slug: 'avaliacao', rotulo: 'Avaliação', desc: 'Estrelas ou corações' },
      { slug: 'filtros', rotulo: 'Filtros', desc: 'Barra de filtros de listagem' },
    ],
  },
  {
    rotulo: 'Dados',
    icone: 'table',
    itens: [
      { slug: 'tabela', rotulo: 'Tabela', desc: 'Ordenação, seleção, ações e estados' },
      { slug: 'lista-cards', rotulo: 'Lista de cards', desc: 'Listagem em grade de cards' },
      { slug: 'paginacao', rotulo: 'Paginação', desc: 'Páginas e itens por página' },
      { slug: 'lista', rotulo: 'Lista', desc: 'Itens com ícone, marcação e links' },
      { slug: 'detalhes', rotulo: 'Detalhes', desc: 'Pares rótulo e valor' },
      { slug: 'indicador', rotulo: 'Indicador', desc: 'Número de painel com variação' },
      { slug: 'graficos', rotulo: 'Gráficos', desc: 'Linha, barras, rosca, dispersão e mapa de calor' },
      { slug: 'valor', rotulo: 'Valor e dinheiro', desc: 'Moeda com sinal, cor e ocultar valores' },
      { slug: 'navegador-periodo', rotulo: 'Navegador de período', desc: 'Mês a mês, atalhos e intervalo' },
      { slug: 'calendario', rotulo: 'Calendário', desc: 'Agenda em mês, semana, dia e lista' },
      { slug: 'status', rotulo: 'Status', desc: 'Situação de um registro' },
      { slug: 'badge', rotulo: 'Badge', desc: 'Etiqueta e contagem' },
      { slug: 'chip', rotulo: 'Chip', desc: 'Filtro aplicado removível' },
      { slug: 'avatar', rotulo: 'Avatar', desc: 'Foto ou iniciais' },
      { slug: 'placa', rotulo: 'Placa', desc: 'Placa de veículo Mercosul' },
      { slug: 'citacao', rotulo: 'Citação', desc: 'Trecho destacado com autor' },
      { slug: 'referencias', rotulo: 'Referências', desc: 'Fontes de uma resposta' },
    ],
  },
  {
    rotulo: 'Feedback',
    icone: 'bell',
    itens: [
      { slug: 'alerta', rotulo: 'Alerta', desc: 'Mensagem fixa na página' },
      { slug: 'toast', rotulo: 'Toast', desc: 'Aviso passageiro' },
      { slug: 'confirmacao', rotulo: 'Confirmação', desc: 'Tem certeza? e remoção' },
      { slug: 'dialogo', rotulo: 'Diálogo', desc: 'Modal central ou lateral' },
      { slug: 'dica', rotulo: 'Dica', desc: 'Balão no hover e no foco' },
      { slug: 'balao', rotulo: 'Balão', desc: 'Conteúdo flutuante no clique' },
      { slug: 'carregando', rotulo: 'Carregando', desc: 'Tela ou área ocupada' },
      { slug: 'girador', rotulo: 'Girador', desc: 'Indicador de atividade' },
      { slug: 'skeleton', rotulo: 'Skeleton', desc: 'Silhueta do conteúdo' },
      { slug: 'progresso', rotulo: 'Progresso', desc: 'Barra de andamento' },
      { slug: 'vazio', rotulo: 'Vazio', desc: 'Nada para mostrar' },
    ],
  },
  {
    rotulo: 'Navegação e layout',
    icone: 'layout-grid',
    itens: [
      { slug: 'estrutura', rotulo: 'Estrutura', desc: 'Sidebar, topo e conteúdo do sistema' },
      { slug: 'seletor-contexto', rotulo: 'Seletor de contexto', desc: 'Pessoal × empresa, filial, escola' },
      { slug: 'cabecalho-pagina', rotulo: 'Cabeçalho de página', desc: 'Título, trilha e ações' },
      { slug: 'trilha', rotulo: 'Trilha', desc: 'Caminho de navegação' },
      { slug: 'abas', rotulo: 'Abas', desc: 'Painéis alternados' },
      { slug: 'acordeao', rotulo: 'Acordeão', desc: 'Seções que abrem e fecham' },
      { slug: 'recolhivel', rotulo: 'Recolhível', desc: 'Animação de abrir e fechar' },
      { slug: 'busca', rotulo: 'Busca global', desc: 'Busca do topo com Ctrl K' },
      { slug: 'card', rotulo: 'Card', desc: 'Caixa de conteúdo' },
      { slug: 'imagem', rotulo: 'Imagem e figura', desc: 'Imagem responsiva com legenda' },
      { slug: 'carrossel', rotulo: 'Carrossel', desc: 'Slides com imagens' },
      { slug: 'quadro-arrastavel', rotulo: 'Quadro arrastável', desc: 'Colunas e itens que se arrastam' },
      { slug: 'kanban', rotulo: 'Kanban', desc: 'Quadro com colunas, cartões e limites' },
      { slug: 'lista-tarefas', rotulo: 'Lista de tarefas', desc: 'Concluir, prazo, prioridade e reordenar' },
      { slug: 'boas-vindas', rotulo: 'Boas-vindas', desc: 'Saudação do painel' },
    ],
  },
  {
    rotulo: 'Telas e conversa',
    icone: 'app-window',
    itens: [
      { slug: 'tela-login', rotulo: 'Tela de login', desc: 'Login com dois fatores' },
      { slug: 'tela-erro', rotulo: 'Tela de erro', desc: '401, 404, 500' },
      { slug: 'conversa', rotulo: 'Conversa', desc: 'Chat: mensagens e campo' },
      { slug: 'site', rotulo: 'Site público', desc: 'Moldura e seções de site' },
    ],
  },
];

export const rotaComponente = (slug: string) => `/docs/componentes/${slug}`;

/** Seção "Documentação" do menu da demo. */
export const NAV_DOCS: SecaoNav = {
  rotulo: 'Documentação',
  itens: [
    ...GUIAS,
    {
      rotulo: 'Componentes',
      icone: 'layers',
      filhos: [
        { rotulo: 'Todos', rota: '/docs/componentes' },
        ...CATEGORIAS.map(
          (c): ItemNav => ({ rotulo: c.rotulo, filhos: c.itens.map((i) => ({ rotulo: i.rotulo, rota: rotaComponente(i.slug) })) }),
        ),
      ],
    },
  ],
};
