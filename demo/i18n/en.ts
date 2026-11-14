import type { TextosDemoParciais } from './tipos';

/** Textos da demo em inglês. Parcial: o que faltar sai em pt-BR. */
export const textosDemoEn: TextosDemoParciais = {
  menu: {
    secoes: {
      documentacao: 'Documentation',
      paginas: 'Pages',
      tabelasForm: 'Tables / Form',
      ui: 'UI Elements',
      avancado: 'Advanced UI',
      aplicativos: 'Apps',
      solucoes: 'Solutions',
      site: 'Website',
      erro: 'Error',
      designSystem: 'Design System',
    },
    itens: {
      painel: 'Dashboard',
      perfil: 'My profile',
      pedidos: 'Orders',
      novoPedido: 'New order',
      tabelas: 'Tables',
      categorias: 'Categories',
      formasPagamento: 'Payment methods',
      localidades: 'Locations',
      estados: 'States',
      cidades: 'Cities',
      tabelaBotoes: 'Table with buttons',
      alertas: 'Alerts',
      badges: 'Badges',
      trilha: 'Breadcrumb',
      botoes: 'Buttons',
      grupoBotoes: 'Button groups',
      cards: 'Cards',
      menus: 'Dropdown menus',
      imagens: 'Images and figures',
      listas: 'Lists',
      abas: 'Tabs and navigation',
      baloes: 'Popovers',
      progresso: 'Progress',
      giradores: 'Spinners',
      dialogos: 'Dialogs',
      notificacoes: 'Notifications',
      paginacao: 'Pagination',
      toasts: 'Toasts',
      dicas: 'Tooltips',
      tipografia: 'Typography',
      acordeoes: 'Accordions and collapsibles',
      carrossel: 'Carousel',
      cardsArrastaveis: 'Draggable cards',
      modais: 'Modals and close',
      avaliacoes: 'Ratings',
      widgets: 'Widgets',
      graficos: 'Charts',
      calendario: 'Calendar',
      conversas: 'Chats',
      assistente: 'Assistant',
      kanban: 'Kanban',
      quadros: 'Boards',
      quadroLancamento: 'Board: Website launch',
      quadroVendas: 'Board: Sales pipeline',
      tarefas: 'Tasks',
      financas: 'Finance',
      finVisaoGeral: 'Overview',
      finLancamentos: 'Transactions',
      finContas: 'Accounts and cards',
      finPagarReceber: 'Payables and receivables',
      finOrcamento: 'Budget',
      finMetas: 'Goals',
      finFluxoCaixa: 'Cash flow',
      finRelatorios: 'Reports and P&L',
      siteHome: 'Website home',
      siteHomeClaro: 'Home with light banner',
      siteSobre: 'About',
      siteServicos: 'Services and plans',
      siteBlog: 'Blog',
      sitePost: 'Post',
      sitePostLateral: 'Post with sidebar',
      siteContato: 'Contact',
      siteTermos: 'Terms of use',
      sitePrivacidade: 'Privacy Policy',
      siteCookies: 'Cookie Policy',
      erro401: 'Error 401',
      erro404: 'Error 404',
      erro500: 'Error 500',
      campos: 'Fields and files',
      utilitarios: 'Utilities',
      loginConteudo: 'Login with content',
      loginFormulario: 'Login form only',
    },
    docs: {
      guias: {
        instalacao: 'Installation',
        tema: 'Theme and tokens',
        tailwind: 'Tailwind',
        carregamento: 'Loading',
        changelog: 'Changelog',
      },
      componentes: 'Components',
      todos: 'All',
      categorias: {
        acoes: 'Actions',
        formularios: 'Forms',
        dados: 'Data',
        feedback: 'Feedback',
        navegacao: 'Navigation and layout',
        telas: 'Screens and chat',
      },
      itens: {
        botao: 'Button',
        grupoBotoes: 'Button group',
        menuSuspenso: 'Dropdown menu',
        acaoLinha: 'Row action',
        botaoFechar: 'Close button',
        form: 'Form',
        campoTexto: 'Text field',
        camposProntos: 'Ready-made fields',
        campoTextarea: 'Text area',
        campoSenha: 'Password',
        campoSelect: 'Select',
        campoBusca: 'Search with suggestions',
        campoUf: 'State, city and person type',
        campoMarcacao: 'Checkbox and switch',
        escolha: 'Choice',
        arquivo: 'Attachments and photos',
        picklist: 'Picklist',
        avaliacao: 'Rating',
        filtros: 'Filters',
        tabela: 'Table',
        listaCards: 'Card list',
        paginacao: 'Pagination',
        lista: 'List',
        detalhes: 'Details',
        indicador: 'Indicator',
        graficos: 'Charts',
        valor: 'Value and money',
        navegadorPeriodo: 'Period navigator',
        calendario: 'Calendar',
        status: 'Status',
        badge: 'Badge',
        chip: 'Chip',
        avatar: 'Avatar',
        placa: 'License plate',
        citacao: 'Quote',
        referencias: 'References',
        alerta: 'Alert',
        toast: 'Toast',
        confirmacao: 'Confirmation',
        dialogo: 'Dialog',
        dica: 'Tooltip',
        balao: 'Popover',
        carregando: 'Loading',
        girador: 'Spinner',
        skeleton: 'Skeleton',
        progresso: 'Progress',
        vazio: 'Empty',
        estrutura: 'Layout',
        seletorContexto: 'Context selector',
        cabecalhoPagina: 'Page header',
        trilha: 'Breadcrumb',
        abas: 'Tabs',
        acordeao: 'Accordion',
        recolhivel: 'Collapsible',
        busca: 'Global search',
        card: 'Card',
        imagem: 'Image and figure',
        carrossel: 'Carousel',
        quadroArrastavel: 'Draggable board',
        kanban: 'Kanban',
        listaTarefas: 'Task list',
        boasVindas: 'Welcome',
        telaLogin: 'Login screen',
        telaErro: 'Error screen',
        conversa: 'Chat',
        site: 'Public website',
        idioma: 'Language',
      },
    },
  },
  paginas: {
    painel: { titulo: 'Dashboard' },
    pedidos: { titulo: 'Orders' },
    novoPedido: {
      titulo: 'New order',
      secoes: {
        cliente: 'Customer',
        enderecoEntrega: 'Shipping address',
        itens: 'Order items',
        valores: 'Amounts',
        pagamento: 'Payment',
        prazos: 'Deadlines and delivery',
      },
    },
    perfil: {
      titulo: 'My profile',
      secoes: {
        editarPerfil: 'Edit profile',
        alterarSenha: 'Change password',
        foto: 'Profile photo',
        visibilidadeFoto: 'Photo visibility',
      },
    },
    categorias: { titulo: 'Categories' },
    formasPagamento: { titulo: 'Payment methods' },
    estados: { titulo: 'States' },
    cidades: { titulo: 'Cities' },
    tabelaBotoes: { titulo: 'Table with buttons' },
    alertas: { titulo: 'Alerts' },
    badges: { titulo: 'Badges' },
    trilha: { titulo: 'Breadcrumb' },
    botoes: { titulo: 'Buttons' },
    grupoBotoes: { titulo: 'Button groups' },
    cards: {
      titulo: 'Cards',
      secoes: {
        destaque: 'Featured',
        cabecalho: 'Header',
        comRecolher: 'Card with collapse',
        comFechar: 'Card with close',
        comTelaCheia: 'Card with full screen',
        comCabecalho: 'With header',
        imagensSobrepostas: 'Overlaid images look great!',
        comCabecalhoRodape: 'With header and footer',
        largura75: '75% width',
        largura50: '50% width',
        horizontais: 'Horizontal cards',
      },
    },
    menus: { titulo: 'Dropdown menus' },
    imagens: { titulo: 'Images and figures' },
    listas: { titulo: 'Lists' },
    abas: { titulo: 'Tabs and navigation' },
    baloes: { titulo: 'Popovers' },
    progresso: { titulo: 'Progress' },
    giradores: { titulo: 'Spinners' },
    dialogos: {
      titulo: 'Dialogs',
      secoes: {
        dadosProduto: 'Product details',
        variacoes: 'Variants',
      },
    },
    notificacoes: { titulo: 'Notifications' },
    paginacao: { titulo: 'Pagination' },
    toasts: { titulo: 'Toasts' },
    dicas: { titulo: 'Tooltips' },
    tipografia: { titulo: 'Typography' },
    acordeoes: { titulo: 'Accordions and collapsibles' },
    carrossel: { titulo: 'Carousel' },
    cardsArrastaveis: {
      titulo: 'Draggable cards',
      secoes: {
        telaCheia: 'Card with full screen',
        imagensVeu: 'Images with an overlay look great!',
        recolhivel: 'Collapsible card',
        fecha: 'Closable card',
      },
    },
    modais: { titulo: 'Modals and close' },
    avaliacoes: { titulo: 'Ratings' },
    widgets: {
      titulo: 'Widgets',
      secoes: {
        resumoRh: 'HR summary',
        recrutadoresPremium: 'Premium recruiters',
        desempenhoEquipe: 'Team performance',
        vendasCategoria: 'Sales by category',
        principaisOrigens: 'Top sources',
        listaTarefas: 'Task list',
        transacoesRecentes: 'Recent transactions',
        statusTarefas: 'Task status',
        membrosEquipe: 'Team members',
        novosCandidatos: 'New candidates',
        transferenciaRapida: 'Quick transfer',
        candidatosRecentes: 'Recent candidates',
        contato: 'Contact',
        candidatos: 'Candidates',
        recrutadores: 'Recruiters',
        visualizacoes: 'Views',
        assinaturas: 'Subscriptions',
      },
    },
    graficos: { titulo: 'Charts' },
    calendario: { titulo: 'Calendar' },
    conversas: {
      titulo: 'Chats',
      secoes: {
        erro: 'Error and retry',
        vazio: 'Empty state',
      },
    },
    assistente: {
      titulo: 'Assistant',
      secoes: {
        componentesKole: 'kole components',
        ficaComApp: 'What stays with the app',
      },
    },
    kanban: {
      titulo: 'Kanban boards',
      textos: {
        naoEncontrado: 'Board not found',
      },
    },
    tarefas: {
      titulo: 'All tasks',
      textos: {
        meuDia: 'My day',
        concluidas: 'Completed',
        etiqueta: 'Label: {nome}',
      },
    },
    finVisaoGeral: {
      titulo: 'Overview',
      secoes: {
        proximosVencimentos: 'Upcoming due dates',
        contas: 'Accounts',
        ultimosLancamentos: 'Latest transactions',
        orcamentoMes: 'Monthly budget',
        orcamentoPeriodo: 'Budget for the period',
      },
    },
    finLancamentos: { titulo: 'Transactions' },
    finContas: { titulo: 'Accounts and cards' },
    finPagarReceber: { titulo: 'Payables and receivables' },
    finOrcamento: {
      titulo: 'Budget',
      secoes: {
        porCategoria: 'By category',
      },
    },
    finMetas: { titulo: 'Goals' },
    finFluxoCaixa: {
      titulo: 'Cash flow',
      secoes: {
        semanaASemana: 'Week by week',
      },
    },
    finRelatorios: {
      titulo: 'Reports',
      textos: {
        dre: 'P&L',
      },
    },
    campos: {
      titulo: 'Fields and files',
      secoes: {
        identificacao: 'Identification',
        documentos: 'Documents',
      },
    },
    utilitarios: { titulo: 'Utilities' },
  },
  docs: {
    abas: {
      titulo: 'Tabs',
    },
    acaoLinha: {
      titulo: 'Row action',
    },
    acordeao: {
      titulo: 'Accordion',
    },
    alerta: {
      titulo: 'Alert',
    },
    arquivo: {
      titulo: 'Attachments and photos',
    },
    avaliacao: {
      titulo: 'Rating',
    },
    avatar: {
      titulo: 'Avatar',
    },
    badge: {
      titulo: 'Badge',
    },
    balao: {
      titulo: 'Popover',
    },
    boasVindas: {
      titulo: 'Welcome',
    },
    botaoFechar: {
      titulo: 'Close button',
    },
    botao: {
      titulo: 'Button',
    },
    busca: {
      titulo: 'Global search',
    },
    cabecalhoPagina: {
      titulo: 'Page header',
    },
    calendario: {
      titulo: 'Calendar',
    },
    campoBusca: {
      titulo: 'Search with suggestions',
    },
    campoMarcacao: {
      titulo: 'Checkbox and switch',
    },
    campoSelect: {
      titulo: 'Select',
    },
    campoSenha: {
      titulo: 'Password',
    },
    campoTextarea: {
      titulo: 'Text area',
    },
    campoTexto: {
      titulo: 'Text field',
    },
    campoUf: {
      titulo: 'State, city and person type',
    },
    camposProntos: {
      titulo: 'Ready-made fields',
    },
    card: {
      titulo: 'Card',
    },
    carregando: {
      titulo: 'Loading',
    },
    carrossel: {
      titulo: 'Carousel',
    },
    chip: {
      titulo: 'Chip',
    },
    citacao: {
      titulo: 'Quote',
    },
    confirmacao: {
      titulo: 'Confirmation',
    },
    conversa: {
      titulo: 'Chat',
    },
    detalhes: {
      titulo: 'Details',
    },
    dialogo: {
      titulo: 'Dialog',
    },
    dica: {
      titulo: 'Tooltip',
    },
    escolha: {
      titulo: 'Choice',
    },
    estrutura: {
      titulo: 'Layout',
    },
    filtros: {
      titulo: 'Filters',
    },
    form: {
      titulo: 'Form',
    },
    girador: {
      titulo: 'Spinner',
    },
    graficos: {
      titulo: 'Charts',
    },
    grupoBotoes: {
      titulo: 'Button group',
    },
    idioma: {
      titulo: 'Language',
    },
    imagem: {
      titulo: 'Image and figure',
    },
    indicador: {
      titulo: 'Indicator',
    },
    kanban: {
      titulo: 'Kanban',
    },
    listaCards: {
      titulo: 'Card list',
    },
    listaTarefas: {
      titulo: 'Task list',
    },
    lista: {
      titulo: 'List',
    },
    menuSuspenso: {
      titulo: 'Dropdown menu',
    },
    navegadorPeriodo: {
      titulo: 'Period navigator',
    },
    paginacao: {
      titulo: 'Pagination',
    },
    picklist: {
      titulo: 'Picklist',
    },
    placa: {
      titulo: 'License plate',
    },
    progresso: {
      titulo: 'Progress',
    },
    quadroArrastavel: {
      titulo: 'Draggable board',
    },
    recolhivel: {
      titulo: 'Collapsible',
    },
    referencias: {
      titulo: 'References',
    },
    seletorContexto: {
      titulo: 'Context selector',
    },
    site: {
      titulo: 'Public website',
    },
    skeleton: {
      titulo: 'Skeleton',
    },
    status: {
      titulo: 'Status',
    },
    tabela: {
      titulo: 'Table',
    },
    telaErro: {
      titulo: 'Error screen',
    },
    telaLogin: {
      titulo: 'Login screen',
    },
    toast: {
      titulo: 'Toast',
    },
    trilha: {
      titulo: 'Breadcrumb',
    },
    valor: {
      titulo: 'Value and money',
    },
    vazio: {
      titulo: 'Empty',
    },
    instalacao: {
      titulo: 'Installation',
      secoes: {
        instalar: '1. Install the package',
        provedor: '2. Import the CSS and the ProvedorUi',
        primeiraTela: '3. First screen',
        temaSemPiscar: 'Theme without flashing on load',
        tailwind: 'With Tailwind 4',
      },
      textos: {
        resumo: 'From npm install to the first screen, in three steps. Works with Vite, Next.js (App Router) and any React 18.2+ or 19 app.',
        pacote: 'The package is ESM only, ships its TypeScript types and is already marked with `\'use client\'`. The Inter font is embedded in `estilos.css`, and the icons come from Lucide (installed with it).',
        provedor: '`ProvedorUi` wires up the theme and density (remembered in the browser), toasts (`useToast`) and confirmations (`useConfirmacao`). Import `estilos.css` only once, at the entry point.',
        temaHead: '`ProvedorUi` applies the theme after React mounts. So that dark theme users don\'t see the light page flash, apply the theme in the `<head>`, before the first paint:',
        temaSemSsr: 'Without SSR, paste into `index.html` the text that `scriptTemaInicial()` returns. The README has the ready-made version and the alternative for a Content-Security-Policy without `\'unsafe-inline\'`.',
        ordemTailwind: 'Import app.css before estilos.css. If estilos.css comes first, the kole layer ends up below Tailwind\'s preflight and the components lose their styles.',
      },
    },
    tema: {
      titulo: 'Theme and tokens',
    },
    tailwind: {
      titulo: 'Tailwind',
    },
    carregamento: {
      titulo: 'Loading',
    },
    changelog: {
      titulo: 'Changelog',
    },
    indice: {
      titulo: 'Components',
    },
  },
};
