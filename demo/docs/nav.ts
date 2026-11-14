import type { ChaveMenu, ItemNavDemo, SecaoNavDemo } from '../i18n/menu';

// Só dados: o teste visual importa o menu no Node, sem CSS nem páginas.
// `rotulo` é o texto em pt-BR; `chave` aponta para o dicionário (demo/i18n).

export const GUIAS: ItemNavDemo[] = [
  { chave: 'menu.docs.guias.instalacao', rota: '/docs/instalacao', rotulo: 'Instalação', icone: 'download' },
  { chave: 'menu.docs.guias.tema', rota: '/docs/tema', rotulo: 'Tema e tokens', icone: 'palette' },
  { chave: 'menu.docs.guias.tailwind', rota: '/docs/tailwind', rotulo: 'Tailwind', icone: 'code' },
  { chave: 'menu.docs.guias.carregamento', rota: '/docs/carregamento', rotulo: 'Carregamento', icone: 'loader-circle' },
  { chave: 'menu.docs.guias.changelog', rota: '/docs/changelog', rotulo: 'Changelog', icone: 'history' },
];

export interface ComponenteDoc {
  /** Final da rota: /docs/componentes/<slug>. */
  slug: string;
  /** Chave do rótulo no dicionário (`menu.docs.itens.<slug>`). */
  chave: ChaveMenu;
  rotulo: string;
  /** Uma linha para o índice de componentes. */
  desc: string;
}

/** Catálogo da documentação: categoria → componentes (o menu e o índice seguem esta lista). */
export const CATEGORIAS: { chave: ChaveMenu; rotulo: string; icone: string; itens: ComponenteDoc[] }[] = [
  {
    chave: 'menu.docs.categorias.acoes',
    rotulo: 'Ações',
    icone: 'square-mouse-pointer',
    itens: [
      { slug: 'botao', chave: 'menu.docs.itens.botao', rotulo: 'Botão', desc: 'Cores, aparências, ícone e carregando' },
      { slug: 'grupo-botoes', chave: 'menu.docs.itens.grupoBotoes', rotulo: 'Grupo de botões', desc: 'Botões colados, barra e alternância' },
      { slug: 'menu-suspenso', chave: 'menu.docs.itens.menuSuspenso', rotulo: 'Menu suspenso', desc: 'Lista de ações num botão' },
      { slug: 'acao-linha', chave: 'menu.docs.itens.acaoLinha', rotulo: 'Ação de linha', desc: 'Ícone de ação em tabelas' },
      { slug: 'botao-fechar', chave: 'menu.docs.itens.botaoFechar', rotulo: 'Botão fechar', desc: 'O × de cards e painéis' },
    ],
  },
  {
    chave: 'menu.docs.categorias.formularios',
    rotulo: 'Formulários',
    icone: 'pencil',
    itens: [
      { slug: 'form', chave: 'menu.docs.itens.form', rotulo: 'Formulário', desc: 'Página ou modal com seções e Salvar' },
      { slug: 'campo-texto', chave: 'menu.docs.itens.campoTexto', rotulo: 'Campo de texto', desc: 'Rótulo, máscara, prefixo e validação' },
      { slug: 'campos-prontos', chave: 'menu.docs.itens.camposProntos', rotulo: 'Campos prontos', desc: 'CPF, CNPJ, CEP, data, moeda, placa…' },
      { slug: 'campo-textarea', chave: 'menu.docs.itens.campoTextarea', rotulo: 'Área de texto', desc: 'Texto longo com contador' },
      { slug: 'campo-senha', chave: 'menu.docs.itens.campoSenha', rotulo: 'Senha', desc: 'Revelar e medidor de força' },
      { slug: 'campo-select', chave: 'menu.docs.itens.campoSelect', rotulo: 'Seleção', desc: 'Uma ou várias opções, com busca' },
      { slug: 'campo-busca', chave: 'menu.docs.itens.campoBusca', rotulo: 'Busca com sugestões', desc: 'Autocompletar vindo do servidor' },
      { slug: 'campo-uf', chave: 'menu.docs.itens.campoUf', rotulo: 'UF, cidade e tipo de pessoa', desc: 'Campos de domínio prontos' },
      { slug: 'campo-marcacao', chave: 'menu.docs.itens.campoMarcacao', rotulo: 'Caixa e chave', desc: 'Sim/não: checkbox ou switch' },
      { slug: 'escolha', chave: 'menu.docs.itens.escolha', rotulo: 'Escolha', desc: 'Segmentado ou rádio' },
      { slug: 'arquivo', chave: 'menu.docs.itens.arquivo', rotulo: 'Anexos e fotos', desc: 'Upload, visualizador e foto' },
      { slug: 'picklist', chave: 'menu.docs.itens.picklist', rotulo: 'Picklist', desc: 'Mover itens entre duas listas' },
      { slug: 'avaliacao', chave: 'menu.docs.itens.avaliacao', rotulo: 'Avaliação', desc: 'Estrelas ou corações' },
      { slug: 'filtros', chave: 'menu.docs.itens.filtros', rotulo: 'Filtros', desc: 'Barra de filtros de listagem' },
    ],
  },
  {
    chave: 'menu.docs.categorias.dados',
    rotulo: 'Dados',
    icone: 'table',
    itens: [
      { slug: 'tabela', chave: 'menu.docs.itens.tabela', rotulo: 'Tabela', desc: 'Ordenação, seleção, ações e estados' },
      { slug: 'lista-cards', chave: 'menu.docs.itens.listaCards', rotulo: 'Lista de cards', desc: 'Listagem em grade de cards' },
      { slug: 'paginacao', chave: 'menu.docs.itens.paginacao', rotulo: 'Paginação', desc: 'Páginas e itens por página' },
      { slug: 'lista', chave: 'menu.docs.itens.lista', rotulo: 'Lista', desc: 'Itens com ícone, marcação e links' },
      { slug: 'detalhes', chave: 'menu.docs.itens.detalhes', rotulo: 'Detalhes', desc: 'Pares rótulo e valor' },
      { slug: 'indicador', chave: 'menu.docs.itens.indicador', rotulo: 'Indicador', desc: 'Número de painel com variação' },
      { slug: 'graficos', chave: 'menu.docs.itens.graficos', rotulo: 'Gráficos', desc: 'Linha, barras, rosca, dispersão e mapa de calor' },
      { slug: 'valor', chave: 'menu.docs.itens.valor', rotulo: 'Valor e dinheiro', desc: 'Moeda com sinal, cor e ocultar valores' },
      { slug: 'navegador-periodo', chave: 'menu.docs.itens.navegadorPeriodo', rotulo: 'Navegador de período', desc: 'Mês a mês, atalhos e intervalo' },
      { slug: 'calendario', chave: 'menu.docs.itens.calendario', rotulo: 'Calendário', desc: 'Agenda em mês, semana, dia e lista' },
      { slug: 'status', chave: 'menu.docs.itens.status', rotulo: 'Status', desc: 'Situação de um registro' },
      { slug: 'badge', chave: 'menu.docs.itens.badge', rotulo: 'Badge', desc: 'Etiqueta e contagem' },
      { slug: 'chip', chave: 'menu.docs.itens.chip', rotulo: 'Chip', desc: 'Filtro aplicado removível' },
      { slug: 'avatar', chave: 'menu.docs.itens.avatar', rotulo: 'Avatar', desc: 'Foto ou iniciais' },
      { slug: 'placa', chave: 'menu.docs.itens.placa', rotulo: 'Placa', desc: 'Placa de veículo Mercosul' },
      { slug: 'citacao', chave: 'menu.docs.itens.citacao', rotulo: 'Citação', desc: 'Trecho destacado com autor' },
      { slug: 'referencias', chave: 'menu.docs.itens.referencias', rotulo: 'Referências', desc: 'Fontes de uma resposta' },
    ],
  },
  {
    chave: 'menu.docs.categorias.feedback',
    rotulo: 'Feedback',
    icone: 'bell',
    itens: [
      { slug: 'alerta', chave: 'menu.docs.itens.alerta', rotulo: 'Alerta', desc: 'Mensagem fixa na página' },
      { slug: 'toast', chave: 'menu.docs.itens.toast', rotulo: 'Toast', desc: 'Aviso passageiro' },
      { slug: 'confirmacao', chave: 'menu.docs.itens.confirmacao', rotulo: 'Confirmação', desc: 'Tem certeza? e remoção' },
      { slug: 'dialogo', chave: 'menu.docs.itens.dialogo', rotulo: 'Diálogo', desc: 'Modal central ou lateral' },
      { slug: 'dica', chave: 'menu.docs.itens.dica', rotulo: 'Dica', desc: 'Balão no hover e no foco' },
      { slug: 'balao', chave: 'menu.docs.itens.balao', rotulo: 'Balão', desc: 'Conteúdo flutuante no clique' },
      { slug: 'carregando', chave: 'menu.docs.itens.carregando', rotulo: 'Carregando', desc: 'Tela ou área ocupada' },
      { slug: 'girador', chave: 'menu.docs.itens.girador', rotulo: 'Girador', desc: 'Indicador de atividade' },
      { slug: 'skeleton', chave: 'menu.docs.itens.skeleton', rotulo: 'Skeleton', desc: 'Silhueta do conteúdo' },
      { slug: 'progresso', chave: 'menu.docs.itens.progresso', rotulo: 'Progresso', desc: 'Barra de andamento' },
      { slug: 'vazio', chave: 'menu.docs.itens.vazio', rotulo: 'Vazio', desc: 'Nada para mostrar' },
    ],
  },
  {
    chave: 'menu.docs.categorias.navegacao',
    rotulo: 'Navegação e layout',
    icone: 'layout-grid',
    itens: [
      { slug: 'estrutura', chave: 'menu.docs.itens.estrutura', rotulo: 'Estrutura', desc: 'Sidebar, topo e conteúdo do sistema' },
      { slug: 'seletor-contexto', chave: 'menu.docs.itens.seletorContexto', rotulo: 'Seletor de contexto', desc: 'Pessoal × empresa, filial, escola' },
      { slug: 'cabecalho-pagina', chave: 'menu.docs.itens.cabecalhoPagina', rotulo: 'Cabeçalho de página', desc: 'Título, trilha e ações' },
      { slug: 'trilha', chave: 'menu.docs.itens.trilha', rotulo: 'Trilha', desc: 'Caminho de navegação' },
      { slug: 'abas', chave: 'menu.docs.itens.abas', rotulo: 'Abas', desc: 'Painéis alternados' },
      { slug: 'acordeao', chave: 'menu.docs.itens.acordeao', rotulo: 'Acordeão', desc: 'Seções que abrem e fecham' },
      { slug: 'recolhivel', chave: 'menu.docs.itens.recolhivel', rotulo: 'Recolhível', desc: 'Animação de abrir e fechar' },
      { slug: 'busca', chave: 'menu.docs.itens.busca', rotulo: 'Busca global', desc: 'Busca do topo com Ctrl K' },
      { slug: 'card', chave: 'menu.docs.itens.card', rotulo: 'Card', desc: 'Caixa de conteúdo' },
      { slug: 'imagem', chave: 'menu.docs.itens.imagem', rotulo: 'Imagem e figura', desc: 'Imagem responsiva com legenda' },
      { slug: 'carrossel', chave: 'menu.docs.itens.carrossel', rotulo: 'Carrossel', desc: 'Slides com imagens' },
      { slug: 'quadro-arrastavel', chave: 'menu.docs.itens.quadroArrastavel', rotulo: 'Quadro arrastável', desc: 'Colunas e itens que se arrastam' },
      { slug: 'kanban', chave: 'menu.docs.itens.kanban', rotulo: 'Kanban', desc: 'Quadro com colunas, cartões e limites' },
      { slug: 'lista-tarefas', chave: 'menu.docs.itens.listaTarefas', rotulo: 'Lista de tarefas', desc: 'Concluir, prazo, prioridade e reordenar' },
      { slug: 'boas-vindas', chave: 'menu.docs.itens.boasVindas', rotulo: 'Boas-vindas', desc: 'Saudação do painel' },
    ],
  },
  {
    chave: 'menu.docs.categorias.telas',
    rotulo: 'Telas e conversa',
    icone: 'app-window',
    itens: [
      { slug: 'tela-login', chave: 'menu.docs.itens.telaLogin', rotulo: 'Tela de login', desc: 'Login com dois fatores' },
      { slug: 'tela-erro', chave: 'menu.docs.itens.telaErro', rotulo: 'Tela de erro', desc: '401, 404, 500' },
      { slug: 'conversa', chave: 'menu.docs.itens.conversa', rotulo: 'Conversa', desc: 'Chat: mensagens e campo' },
      { slug: 'site', chave: 'menu.docs.itens.site', rotulo: 'Site público', desc: 'Moldura e seções de site' },
      { slug: 'idioma', chave: 'menu.docs.itens.idioma', rotulo: 'Idioma', desc: 'pt-BR, inglês e espanhol; seletor na topbar' },
    ],
  },
];

export const rotaComponente = (slug: string) => `/docs/componentes/${slug}`;

/** Seção "Documentação" do menu da demo. */
export const NAV_DOCS: SecaoNavDemo = {
  chave: 'menu.secoes.documentacao',
  rotulo: 'Documentação',
  itens: [
    ...GUIAS,
    {
      chave: 'menu.docs.componentes',
      rotulo: 'Componentes',
      icone: 'layers',
      filhos: [
        { chave: 'menu.docs.todos', rotulo: 'Todos', rota: '/docs/componentes' },
        ...CATEGORIAS.map(
          (c): ItemNavDemo => ({
            chave: c.chave,
            rotulo: c.rotulo,
            filhos: c.itens.map((i) => ({ chave: i.chave, rotulo: i.rotulo, rota: rotaComponente(i.slug) })),
          }),
        ),
      ],
    },
  ],
};
