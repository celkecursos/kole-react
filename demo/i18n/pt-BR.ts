/**
 * Textos da demo em pt-BR: a FONTE. Toda chave nasce aqui; `en.ts` e `es.ts`
 * são parciais e o que faltar neles sai em português.
 *
 * ## Convenção de chaves
 *
 * - `menu.*`: o menu lateral. `menu.secoes.<secao>` é o título da seção,
 *   `menu.itens.<item>` cada link da demo e `menu.docs.*` a parte da
 *   documentação. O `rotulo` em demo/nav.ts e demo/docs/nav.ts continua o
 *   texto pt-BR e tem que ser igual ao daqui (o teste em
 *   tests/visual/demo.spec.ts confere).
 * - `paginas.<tela>.titulo|secoes|textos`: telas da demo (pedidos, perfil,
 *   finanças…). `titulo` é o do CabecalhoPagina (ou do Form); `secoes.<nome>`
 *   os títulos de Card e as legendas de FormSecao; `textos.<nome>` o resto
 *   (rótulos, parágrafos, mensagens).
 * - `docs.<pagina>.titulo|secoes|textos`: páginas da documentação, no mesmo
 *   formato. `<pagina>` é o slug em camelCase (`campo-texto` → `campoTexto`);
 *   em `secoes`, a chave é o `id` da `<Secao>` em camelCase
 *   (`primeira-tela` → `primeiraTela`); `textos.resumo` é o resumo do cabeçalho.
 *
 * Cada folha é um texto (com `{valor}` para interpolar) ou um plural no
 * formato `Plural` da biblioteca (`{ one, other }`, com `{n}` já formatado no
 * idioma). Num parágrafo da documentação, o trecho entre crases vira código
 * inline (`comCodigo`, em demo/docs/Codigo.tsx).
 *
 * ## Fallback
 *
 * Chave que falta em `en`/`es` (ou idioma sem dicionário) sai do pt-BR: dá
 * para extrair os textos de uma página agora e traduzir depois, sem nada
 * quebrar. Chave que falta AQUI é erro de tipo no `npm run typecheck`
 * (demo/i18n/chaves.tipos.ts): não existe chave sem texto em pt-BR.
 *
 * ## Como traduzir uma página
 *
 * 1. Acrescente aqui os textos, na chave da página. Ex.: a seção
 *    "1. Instalar o pacote" do guia de Instalação
 *    (`<Secao id="instalar" titulo="1. Instalar o pacote">`) vira
 *    `docs.instalacao.secoes.instalar: '1. Instalar o pacote'`.
 * 2. Na página, troque o texto pela chave:
 *    `const { t } = useT();` (demo/i18n/useT.ts) e
 *    `<Secao id="instalar" titulo={t('docs.instalacao.secoes.instalar')}>`.
 *    Plural: `tp('docs.indice.textos.resumo', total)`. Fora de componente
 *    (função de renderização, dados): receba o `t` por parâmetro, ou use
 *    `traduzir`/`traduzirPlural` (demo/i18n/traduzir.ts).
 * 3. Traduza em `en.ts` e `es.ts` a mesma chave (pode ficar para depois).
 * 4. Confira: `npm run typecheck`, e a página nos três idiomas pelo seletor
 *    da topbar. Em pt-BR o texto tem que sair igual ao de antes.
 *
 * O guia de Instalação (demo/docs/paginas/Instalacao.tsx) está inteiro no
 * dicionário e serve de modelo. Os blocos de código dos exemplos continuam em
 * pt-BR: mostram código como ele é escrito.
 *
 * Só dados: o teste visual importa o menu no Node, sem React nem CSS.
 */
export const textosDemoPtBR = {
  menu: {
    secoes: {
      documentacao: 'Documentação',
      paginas: 'Pages',
      tabelasForm: 'Tabelas / Form',
      ui: 'UI Elements',
      avancado: 'Advanced UI',
      aplicativos: 'Aplicativos',
      solucoes: 'Soluções',
      site: 'Site',
      erro: 'Error',
      designSystem: 'Design System',
    },
    itens: {
      painel: 'Painel',
      perfil: 'Meu perfil',
      pedidos: 'Pedidos',
      novoPedido: 'Novo pedido',
      tabelas: 'Tabelas',
      categorias: 'Categorias',
      formasPagamento: 'Formas de pagamento',
      localidades: 'Localidades',
      estados: 'Estados',
      cidades: 'Cidades',
      tabelaBotoes: 'Tabela com botões',
      alertas: 'Alertas',
      badges: 'Badges',
      trilha: 'Trilha de navegação',
      botoes: 'Botões',
      grupoBotoes: 'Grupo de botões',
      cards: 'Cards',
      menus: 'Menus suspensos',
      imagens: 'Imagens e figuras',
      listas: 'Listas',
      abas: 'Abas e navegação',
      baloes: 'Balões',
      progresso: 'Progresso',
      giradores: 'Giradores',
      dialogos: 'Diálogos',
      notificacoes: 'Notificações',
      paginacao: 'Paginação',
      toasts: 'Toasts',
      dicas: 'Dicas',
      tipografia: 'Tipografia',
      acordeoes: 'Acordeões e recolhíveis',
      carrossel: 'Carrossel',
      cardsArrastaveis: 'Cards arrastáveis',
      modais: 'Modais e fechar',
      avaliacoes: 'Avaliações',
      widgets: 'Widgets',
      graficos: 'Gráficos',
      calendario: 'Calendário',
      conversas: 'Conversas',
      assistente: 'Assistente',
      kanban: 'Kanban',
      quadros: 'Quadros',
      quadroLancamento: 'Quadro: Lançamento do site',
      quadroVendas: 'Quadro: Funil de vendas',
      tarefas: 'Tarefas',
      financas: 'Finanças',
      finVisaoGeral: 'Visão geral',
      finLancamentos: 'Lançamentos',
      finContas: 'Contas e cartões',
      finPagarReceber: 'A pagar e receber',
      finOrcamento: 'Orçamento',
      finMetas: 'Metas',
      finFluxoCaixa: 'Fluxo de caixa',
      finRelatorios: 'Relatórios e DRE',
      siteHome: 'Home do site',
      siteHomeClaro: 'Home com faixa clara',
      siteSobre: 'Sobre',
      siteServicos: 'Serviços e planos',
      siteBlog: 'Blog',
      sitePost: 'Post',
      sitePostLateral: 'Post com coluna lateral',
      siteContato: 'Contato',
      siteTermos: 'Termos de uso',
      sitePrivacidade: 'Política de Privacidade',
      siteCookies: 'Política de Cookies',
      erro401: 'Erro 401',
      erro404: 'Erro 404',
      erro500: 'Erro 500',
      campos: 'Campos e arquivos',
      utilitarios: 'Utilitários',
      loginConteudo: 'Login com conteúdo',
      loginFormulario: 'Login só formulário',
    },
    docs: {
      guias: {
        instalacao: 'Instalação',
        tema: 'Tema e tokens',
        tailwind: 'Tailwind',
        carregamento: 'Carregamento',
        changelog: 'Changelog',
      },
      componentes: 'Componentes',
      todos: 'Todos',
      categorias: {
        acoes: 'Ações',
        formularios: 'Formulários',
        dados: 'Dados',
        feedback: 'Feedback',
        navegacao: 'Navegação e layout',
        telas: 'Telas e conversa',
      },
      itens: {
        botao: 'Botão',
        grupoBotoes: 'Grupo de botões',
        menuSuspenso: 'Menu suspenso',
        acaoLinha: 'Ação de linha',
        botaoFechar: 'Botão fechar',
        form: 'Formulário',
        campoTexto: 'Campo de texto',
        camposProntos: 'Campos prontos',
        campoTextarea: 'Área de texto',
        campoSenha: 'Senha',
        campoSelect: 'Seleção',
        campoBusca: 'Busca com sugestões',
        campoUf: 'UF, cidade e tipo de pessoa',
        campoMarcacao: 'Caixa e chave',
        escolha: 'Escolha',
        arquivo: 'Anexos e fotos',
        picklist: 'Picklist',
        avaliacao: 'Avaliação',
        filtros: 'Filtros',
        tabela: 'Tabela',
        listaCards: 'Lista de cards',
        paginacao: 'Paginação',
        lista: 'Lista',
        detalhes: 'Detalhes',
        indicador: 'Indicador',
        graficos: 'Gráficos',
        valor: 'Valor e dinheiro',
        navegadorPeriodo: 'Navegador de período',
        calendario: 'Calendário',
        status: 'Status',
        badge: 'Badge',
        chip: 'Chip',
        avatar: 'Avatar',
        placa: 'Placa',
        citacao: 'Citação',
        referencias: 'Referências',
        alerta: 'Alerta',
        toast: 'Toast',
        confirmacao: 'Confirmação',
        dialogo: 'Diálogo',
        dica: 'Dica',
        balao: 'Balão',
        carregando: 'Carregando',
        girador: 'Girador',
        skeleton: 'Skeleton',
        progresso: 'Progresso',
        vazio: 'Vazio',
        estrutura: 'Estrutura',
        seletorContexto: 'Seletor de contexto',
        cabecalhoPagina: 'Cabeçalho de página',
        trilha: 'Trilha',
        abas: 'Abas',
        acordeao: 'Acordeão',
        recolhivel: 'Recolhível',
        busca: 'Busca global',
        card: 'Card',
        imagem: 'Imagem e figura',
        carrossel: 'Carrossel',
        quadroArrastavel: 'Quadro arrastável',
        kanban: 'Kanban',
        listaTarefas: 'Lista de tarefas',
        boasVindas: 'Boas-vindas',
        telaLogin: 'Tela de login',
        telaErro: 'Tela de erro',
        conversa: 'Conversa',
        site: 'Site público',
        idioma: 'Idioma',
      },
    },
  },
  paginas: {
    painel: { titulo: 'Painel' },
    pedidos: { titulo: 'Pedidos' },
    novoPedido: {
      titulo: 'Novo pedido',
      secoes: {
        cliente: 'Cliente',
        enderecoEntrega: 'Endereço de entrega',
        itens: 'Itens do pedido',
        valores: 'Valores',
        pagamento: 'Pagamento',
        prazos: 'Prazos e entrega',
      },
    },
    perfil: {
      titulo: 'Meu perfil',
      secoes: {
        editarPerfil: 'Editar perfil',
        alterarSenha: 'Alterar senha',
        foto: 'Foto do perfil',
        visibilidadeFoto: 'Visibilidade da foto',
      },
    },
    categorias: { titulo: 'Categorias' },
    formasPagamento: { titulo: 'Formas de pagamento' },
    estados: { titulo: 'Estados' },
    cidades: { titulo: 'Cidades' },
    tabelaBotoes: { titulo: 'Tabela com botões' },
    alertas: { titulo: 'Alertas' },
    badges: { titulo: 'Badges' },
    trilha: { titulo: 'Trilha de navegação' },
    botoes: { titulo: 'Botões' },
    grupoBotoes: { titulo: 'Grupo de botões' },
    cards: {
      titulo: 'Cards',
      secoes: {
        destaque: 'Destaque',
        cabecalho: 'Cabeçalho',
        comRecolher: 'Card com recolher',
        comFechar: 'Card com fechar',
        comTelaCheia: 'Card com tela cheia',
        comCabecalho: 'Com cabeçalho',
        imagensSobrepostas: 'Imagens sobrepostas são ótimas!',
        comCabecalhoRodape: 'Com cabeçalho e rodapé',
        largura75: 'Largura de 75%',
        largura50: 'Largura de 50%',
        horizontais: 'Cards horizontais',
      },
    },
    menus: { titulo: 'Menus suspensos' },
    imagens: { titulo: 'Imagens e figuras' },
    listas: { titulo: 'Listas' },
    abas: { titulo: 'Abas e navegação' },
    baloes: { titulo: 'Balões' },
    progresso: { titulo: 'Progresso' },
    giradores: { titulo: 'Giradores' },
    dialogos: {
      titulo: 'Diálogos',
      secoes: {
        dadosProduto: 'Dados do produto',
        variacoes: 'Variações',
      },
    },
    notificacoes: { titulo: 'Notificações' },
    paginacao: { titulo: 'Paginação' },
    toasts: { titulo: 'Toasts' },
    dicas: { titulo: 'Dicas' },
    tipografia: { titulo: 'Tipografia' },
    acordeoes: { titulo: 'Acordeões e recolhíveis' },
    carrossel: { titulo: 'Carrossel' },
    cardsArrastaveis: {
      titulo: 'Cards arrastáveis',
      secoes: {
        telaCheia: 'Card com tela cheia',
        imagensVeu: 'Imagens com véu ficam ótimas!',
        recolhivel: 'Card recolhível',
        fecha: 'Card que fecha',
      },
    },
    modais: { titulo: 'Modais e fechar' },
    avaliacoes: { titulo: 'Avaliações' },
    widgets: {
      titulo: 'Widgets',
      secoes: {
        resumoRh: 'Resumo de RH',
        recrutadoresPremium: 'Recrutadores premium',
        desempenhoEquipe: 'Desempenho da equipe',
        vendasCategoria: 'Vendas por categoria',
        principaisOrigens: 'Principais origens',
        listaTarefas: 'Lista de tarefas',
        transacoesRecentes: 'Transações recentes',
        statusTarefas: 'Status das tarefas',
        membrosEquipe: 'Membros da equipe',
        novosCandidatos: 'Novos candidatos',
        transferenciaRapida: 'Transferência rápida',
        candidatosRecentes: 'Candidatos recentes',
        contato: 'Contato',
        candidatos: 'Candidatos',
        recrutadores: 'Recrutadores',
        visualizacoes: 'Visualizações',
        assinaturas: 'Assinaturas',
      },
    },
    graficos: { titulo: 'Gráficos' },
    calendario: { titulo: 'Calendário' },
    conversas: {
      titulo: 'Conversas',
      secoes: {
        erro: 'Erro e tentar novamente',
        vazio: 'Estado vazio',
      },
    },
    assistente: {
      titulo: 'Assistente',
      secoes: {
        componentesKole: 'Componentes do kole',
        ficaComApp: 'O que fica com o app',
      },
    },
    kanban: {
      titulo: 'Quadros Kanban',
      textos: {
        naoEncontrado: 'Quadro não encontrado',
      },
    },
    tarefas: {
      titulo: 'Todas as tarefas',
      textos: {
        meuDia: 'Meu dia',
        concluidas: 'Concluídas',
        etiqueta: 'Etiqueta: {nome}',
      },
    },
    finVisaoGeral: {
      titulo: 'Visão geral',
      secoes: {
        proximosVencimentos: 'Próximos vencimentos',
        contas: 'Contas',
        ultimosLancamentos: 'Últimos lançamentos',
        orcamentoMes: 'Orçamento do mês',
        orcamentoPeriodo: 'Orçamento do período',
      },
    },
    finLancamentos: { titulo: 'Lançamentos' },
    finContas: { titulo: 'Contas e cartões' },
    finPagarReceber: { titulo: 'Contas a pagar e receber' },
    finOrcamento: {
      titulo: 'Orçamento',
      secoes: {
        porCategoria: 'Por categoria',
      },
    },
    finMetas: { titulo: 'Metas' },
    finFluxoCaixa: {
      titulo: 'Fluxo de caixa',
      secoes: {
        semanaASemana: 'Semana a semana',
      },
    },
    finRelatorios: {
      titulo: 'Relatórios',
      textos: {
        dre: 'DRE',
      },
    },
    campos: {
      titulo: 'Campos e arquivos',
      secoes: {
        identificacao: 'Identificação',
        documentos: 'Documentos',
      },
    },
    utilitarios: { titulo: 'Utilitários' },
  },
  docs: {
    abas: {
      titulo: 'Abas',
      textos: { resumo: 'Painéis alternados na mesma área, com nove variantes (sublinhado, pílulas, segmentado, passos…), ícones, pendências e orientação vertical.' },
    },
    acaoLinha: {
      titulo: 'Ação de linha',
      textos: { resumo: 'Botão só com ícone para as ações de cada linha de uma tabela ou lista: visualizar, editar, excluir.' },
    },
    acordeao: {
      titulo: 'Acordeão',
      textos: { resumo: 'Seções que abrem e fecham: perguntas frequentes, grupos de configurações, detalhes opcionais.' },
    },
    alerta: {
      titulo: 'Alerta',
      textos: { resumo: 'Mensagem fixa na página: informação, sucesso, atenção ou erro. Para avisos passageiros, use o toast.' },
    },
    arquivo: {
      titulo: 'Anexos e fotos',
      textos: { resumo: 'Envio de arquivos com arrastar e soltar, visualizador de imagem com zoom e a foto de uma pessoa ou registro.' },
    },
    avaliacao: {
      titulo: 'Avaliação',
      textos: { resumo: 'Nota com estrelas ou corações: para votar, com meio ponto e mensagem por nota, ou só para mostrar.' },
    },
    avatar: {
      titulo: 'Avatar',
      textos: { resumo: 'Foto ou iniciais de uma pessoa ou empresa, com contagem ou ponto de status no canto (ComBadge) e avatares sobrepostos com +N (GrupoAvatares).' },
    },
    badge: {
      titulo: 'Badge',
      textos: { resumo: 'Etiqueta curta para contagem, categoria ou novidade.' },
    },
    balao: {
      titulo: 'Balão',
      textos: { resumo: 'Conteúdo flutuante preso a um elemento: explicação mais longa, detalhes de um item. Abre no clique (padrão), no foco ou ao passar o mouse.' },
    },
    boasVindas: {
      titulo: 'Boas-vindas',
      textos: { resumo: 'Faixa de saudação do painel inicial: nome, cargo, setor, último acesso e as ações mais usadas.' },
    },
    botaoFechar: {
      titulo: 'Botão fechar',
      textos: { resumo: 'O × padrão de diálogos, cards, alertas e painéis, com nome acessível e área de toque adequada.' },
    },
    botao: {
      titulo: 'Botão',
      textos: { resumo: 'Dispara uma ação. Tem oito cores, seis aparências, três tamanhos, ícone, estado de carregando e modo alternância.' },
    },
    busca: {
      titulo: 'Busca global',
      textos: { resumo: 'A busca do topo do sistema: encontra páginas do menu enquanto digita e, com Enter, busca no servidor. Abre com Ctrl K.' },
    },
    cabecalhoPagina: {
      titulo: 'Cabeçalho de página',
      textos: { resumo: 'O topo de cada página: título com ícone, categoria, trilha de navegação, texto de apoio e as ações principais.' },
    },
    calendario: {
      titulo: 'Calendário',
      textos: { resumo: 'Agenda de eventos nas visões mês, semana, dia e lista, em pt-BR, com arrastar, eventos que se repetem e o MiniCalendario para a coluna lateral. O app guarda e busca os eventos; o calendário mostra e avisa as mudanças.' },
    },
    campoBusca: {
      titulo: 'Busca com sugestões',
      textos: { resumo: 'Autocompletar com dados do servidor: espera a digitação parar, busca e mostra as sugestões. O valor é o registro escolhido, não o texto.' },
    },
    campoMarcacao: {
      titulo: 'Caixa e chave',
      textos: { resumo: 'Sim ou não: caixa de marcação (checkbox) ou chave (switch), com rótulo clicável, dica e erro.' },
    },
    campoSelect: {
      titulo: 'Seleção',
      textos: { resumo: 'Escolha de uma opção (CampoSelect) ou de várias (CampoSelectMultiplo) numa lista, com busca e botão de limpar.' },
    },
    campoSenha: {
      titulo: 'Senha',
      textos: { resumo: 'Campo de senha com botão de revelar, medidor de força e política de requisitos.' },
    },
    campoTextarea: {
      titulo: 'Área de texto',
      textos: { resumo: 'Texto de várias linhas, com rótulo, dica, erro e contador de caracteres.' },
    },
    campoTexto: {
      titulo: 'Campo de texto',
      textos: { resumo: 'Entrada de texto com rótulo, dica, máscara, prefixo/sufixo e validação. É a base dos outros campos da biblioteca.' },
    },
    campoUf: {
      titulo: 'UF, cidade e tipo de pessoa',
      textos: { resumo: 'Campos de domínio já com as opções: as 27 UFs, a cidade da UF escolhida e pessoa física ou jurídica.' },
    },
    camposProntos: {
      titulo: 'Campos prontos',
      textos: { resumo: 'CampoTexto com máscara, placeholder, teclado e validação prontos para os formatos brasileiros mais comuns.' },
    },
    card: {
      titulo: 'Card',
      textos: { resumo: 'Caixa de conteúdo com título, mídia, ferramentas, ações e rodapé. Pode recolher, abrir em tela cheia, sair da tela e ser clicável.' },
    },
    carregando: {
      titulo: 'Carregando',
      textos: { resumo: 'Aviso de espera com animação e mensagem, numa área ou cobrindo a tela inteira (bloqueante).' },
    },
    carrossel: {
      titulo: 'Carrossel',
      textos: { resumo: 'Slides de imagens com título e descrição, setas, indicadores, troca automática e arrastar no celular.' },
    },
    chip: {
      titulo: 'Chip',
      textos: { resumo: 'Pílula de um filtro aplicado ou valor escolhido, com o campo, o valor e o botão de remover.' },
    },
    citacao: {
      titulo: 'Citação',
      textos: { resumo: 'Trecho destacado com autor e fonte: regra de negócio, depoimento, nota de manual.' },
    },
    confirmacao: {
      titulo: 'Confirmação',
      textos: { resumo: 'O diálogo de \'tem certeza?\' como uma função: await confirmar(...) devolve true ou false. Inclui o atalho de remoção e o aviso de um botão só.' },
    },
    conversa: {
      titulo: 'Conversa',
      textos: { resumo: 'Chat completo: a área que rola e acompanha a última mensagem, os balões de cada autor com os estados de envio, e o campo com Enter para enviar. Para assistentes de IA: histórico, tela inicial com sugestões, anexos, código com copiar e o chat flutuante do site.' },
    },
    detalhes: {
      titulo: 'Detalhes',
      textos: { resumo: 'Par rótulo e valor para telas de visualização: resumo de pedido, perfil, diálogo de detalhes.' },
    },
    dialogo: {
      titulo: 'Diálogo',
      textos: { resumo: 'Janela sobre a página para uma tarefa curta: cadastro rápido, detalhes, filtros. Pode ser central ou lateral (gaveta).' },
    },
    dica: {
      titulo: 'Dica',
      textos: { resumo: 'Balão curto que aparece ao passar o mouse ou focar o elemento: o nome de um botão só com ícone, uma explicação rápida.' },
    },
    escolha: {
      titulo: 'Escolha',
      textos: { resumo: 'Uma opção entre poucas, todas à vista: controle segmentado ou grupo de rádios.' },
    },
    estrutura: {
      titulo: 'Estrutura',
      textos: { resumo: 'A moldura do sistema: menu lateral recolhível com seções e submenus, barra do topo com busca, tema, notificações e usuário, trilha automática e rodapé.' },
    },
    filtros: {
      titulo: 'Filtros',
      textos: { resumo: 'Barra de filtros de listagem: campos, Consultar, Limpar e os chips dos filtros aplicados.' },
    },
    form: {
      titulo: 'Formulário',
      textos: { resumo: 'Moldura de cadastro: em página (com menu lateral de etapas) ou em modal. Traz título, Salvar/Cancelar, pendências e a grade dos campos.' },
    },
    girador: {
      titulo: 'Girador',
      textos: { resumo: 'Indicador de atividade em três formas (anel, pulso, pontos), com cor e tamanho.' },
    },
    graficos: {
      titulo: 'Gráficos',
      textos: { resumo: 'Gráficos em SVG próprio, sem biblioteca externa: linha, barras, combinado (barras e linha com dois eixos), dispersão, rosca e mapa de calor. Seguem o tema e a densidade.' },
    },
    grupoBotoes: {
      titulo: 'Grupo de botões',
      textos: { resumo: 'Botões colados num bloco (GrupoBotoes), alinhados numa barra (BarraBotoes) ou funcionando como seletor (GrupoAlternancia).' },
    },
    idioma: {
      titulo: 'Idioma',
      textos: { resumo: 'Os textos da própria biblioteca (rótulos padrão, listas vazias, aria-labels, validações, datas e números) em português do Brasil, inglês ou espanhol. O padrão continua pt-BR: nada muda até o sistema pedir.' },
    },
    imagem: {
      titulo: 'Imagem e figura',
      textos: { resumo: 'Imagem responsiva com cantos, proporção, miniatura e alinhamento; a Figura acrescenta a legenda.' },
    },
    indicador: {
      titulo: 'Indicador',
      textos: { resumo: 'Número de destaque do painel: rótulo, valor, ícone, variação sobre o período anterior e minigráfico de tendência.' },
    },
    kanban: {
      titulo: 'Kanban',
      textos: { resumo: 'Quadro kanban pronto: colunas com cor, contagem, limite e menu (renomear, recolher, excluir), cartões que se arrastam entre colunas, adicionar cartão e coluna, rolagem horizontal e tela vazia. O app guarda os dados; o quadro mostra e avisa as mudanças.' },
    },
    listaCards: {
      titulo: 'Lista de cards',
      textos: { resumo: 'A mesma listagem da Tabela, em grade de cards: com paginação e os estados de carregando, vazio e erro.' },
    },
    listaTarefas: {
      titulo: 'Lista de tarefas',
      textos: { resumo: 'Tarefas em linhas: marcar como feita, situação, prioridade, prazo, etiquetas, subtarefas e responsáveis; clicar abre o detalhe e a alça reordena arrastando (mouse, toque e teclado).' },
    },
    lista: {
      titulo: 'Lista',
      textos: { resumo: 'Lista de itens com ícone, título, conteúdo no início e no fim, item ativo, links e marcação (caixa ou rádio).' },
    },
    menuSuspenso: {
      titulo: 'Menu suspenso',
      textos: { resumo: 'Um botão que abre uma lista de ações. Aceita títulos, divisores, atalhos, links e o modo dividido.' },
    },
    navegadorPeriodo: {
      titulo: 'Navegador de período',
      textos: { resumo: '“‹ Novembro de 2026 ›”: as setas andam de mês em mês (ou trimestre, ano, intervalo), e o rótulo abre atalhos e um intervalo livre de/até. Para relatórios, extratos e painéis.' },
    },
    paginacao: {
      titulo: 'Paginação',
      textos: { resumo: 'Navegação entre páginas de uma listagem, com o total de registros e a escolha de itens por página.' },
    },
    picklist: {
      titulo: 'Picklist',
      textos: { resumo: 'Duas listas lado a lado para mover itens de uma para a outra: permissões, colunas visíveis, membros de um grupo.' },
    },
    placa: {
      titulo: 'Placa',
      textos: { resumo: 'Placa de veículo no padrão Mercosul, para cadastros de frota, entregas e estacionamento.' },
    },
    progresso: {
      titulo: 'Progresso',
      textos: { resumo: 'Barra de andamento: envio, meta, etapas. Mostra o valor de vários jeitos e aceita segmentos coloridos.' },
    },
    quadroArrastavel: {
      titulo: 'Quadro arrastável',
      textos: { resumo: 'Colunas de itens que se reordenam e trocam de coluna arrastando, também pelo teclado. É a base do Kanban e da ListaTarefas.' },
    },
    recolhivel: {
      titulo: 'Recolhível',
      textos: { resumo: 'Só a animação de abrir e fechar, para qualquer conteúdo: o app decide o botão e o estado.' },
    },
    referencias: {
      titulo: 'Referências',
      textos: { resumo: 'Lista recolhível das fontes de uma resposta (assistente, busca): título, detalhe, trecho e link.' },
    },
    seletorContexto: {
      titulo: 'Seletor de contexto',
      textos: { resumo: 'Troca o contexto do sistema inteiro: pessoal ou empresa, a empresa do grupo, a filial, a escola. Fica no topo da Estrutura (prop contexto) ou onde o app quiser.' },
    },
    site: {
      titulo: 'Site público',
      textos: { resumo: 'Componentes para o site da empresa, no mesmo pacote e com os mesmos tokens do sistema: moldura com menu e rodapé, faixa de abertura, seções, cards de recurso, plano, conteúdo e depoimento.' },
    },
    skeleton: {
      titulo: 'Skeleton',
      textos: { resumo: 'Silhueta animada no lugar do conteúdo que ainda está carregando, para a página não pular quando os dados chegam.' },
    },
    status: {
      titulo: 'Status',
      textos: { resumo: 'Selo da situação de um registro: pago, em análise, cancelado. Cor e ícone vêm da severidade.' },
    },
    tabela: {
      titulo: 'Tabela',
      textos: { resumo: 'Listagem de registros com colunas formatadas, selo de situação, ações por linha, ordenação, seleção, paginação e os estados de carregando, vazio e erro.' },
    },
    telaErro: {
      titulo: 'Tela de erro',
      textos: { resumo: 'Página de erro (401, 404, 500 ou outra) com código, explicação, detalhe técnico e as saídas possíveis.' },
    },
    telaLogin: {
      titulo: 'Tela de login',
      textos: { resumo: 'Tela de entrada completa: apresentação do sistema, formulário com CPF, e-mail ou usuário, senha, e a etapa do código de verificação em duas etapas.' },
    },
    toast: {
      titulo: 'Toast',
      textos: { resumo: 'Aviso passageiro no canto da tela: retorno de uma ação (salvou, excluiu, falhou). Sai sozinho depois de alguns segundos.' },
    },
    trilha: {
      titulo: 'Trilha',
      textos: { resumo: 'O caminho até a página atual (breadcrumb), com separador, ícones e aparência configuráveis.' },
    },
    valor: {
      titulo: 'Valor e dinheiro',
      textos: { resumo: 'Valor em dinheiro com sinal e cor de entrada e saída, números alinhados em coluna e o “ocultar valores” dos apps de finanças. Junto vêm os formatadores de moeda e porcentagem.' },
    },
    vazio: {
      titulo: 'Vazio',
      textos: { resumo: 'O que mostrar quando não há nada: lista sem registros, busca sem resultado, caixa de entrada limpa.' },
    },
    instalacao: {
      titulo: 'Instalação',
      secoes: {
        instalar: '1. Instalar o pacote',
        provedor: '2. Importar o CSS e o ProvedorUi',
        primeiraTela: '3. Primeira tela',
        temaSemPiscar: 'Tema sem piscar ao abrir',
        tailwind: 'Com Tailwind 4',
      },
      textos: {
        resumo: 'Do npm install à primeira tela, em três passos. Funciona com Vite, Next.js (App Router) e qualquer app React 18.2+ ou 19.',
        pacote: 'O pacote é só ESM, traz os tipos TypeScript e já vem marcado com `\'use client\'`. A fonte Inter vem embutida no `estilos.css`, e os ícones são do Lucide (instalado junto).',
        provedor: 'O `ProvedorUi` liga o tema e a densidade (lembrados no navegador), os toasts (`useToast`) e as confirmações (`useConfirmacao`). Importe o `estilos.css` uma vez só, no ponto de entrada.',
        temaHead: 'O `ProvedorUi` aplica o tema depois que o React monta. Para quem usa o tema escuro não ver a página clara piscar, aplique o tema no `<head>`, antes da primeira pintura:',
        temaSemSsr: 'Sem SSR, cole no `index.html` o texto que `scriptTemaInicial()` devolve. O README tem a versão pronta e a alternativa para Content-Security-Policy sem `\'unsafe-inline\'`.',
        ordemTailwind: 'Importe o app.css antes do estilos.css. Se o estilos.css vier primeiro, a camada kole fica abaixo do preflight do Tailwind e os componentes perdem o estilo.',
      },
    },
    tema: {
      titulo: 'Tema e tokens',
      textos: { resumo: 'Toda cor e medida vem de variáveis CSS (os tokens). Trocar a marca é redefinir alguns tokens; o tema escuro e a densidade usam os mesmos nomes.' },
    },
    tailwind: {
      titulo: 'Tailwind',
      textos: { resumo: 'A kole-react não depende de Tailwind, mas convive com ele. Com a ordem de camadas certa, o kole vence o preflight e os utilitários vencem o kole.' },
    },
    carregamento: {
      titulo: 'Carregamento',
      textos: { resumo: 'Qual loading usar em cada situação: ao salvar, ao abrir uma página, ao paginar uma lista, ao gerar um arquivo. Os componentes já trazem o estado de espera; o app só liga a prop.' },
    },
    changelog: {
      titulo: 'Changelog',
      textos: { resumo: 'O que mudou em cada versão, lido do CHANGELOG.md do pacote.' },
    },
    indice: {
      titulo: 'Componentes',
      textos: {
        resumo: {
          one: '{n} página, com exemplos funcionando, o código de cada exemplo e a tabela de props.',
          other: '{n} páginas, cada uma com exemplos funcionando, o código de cada exemplo e a tabela de props.',
        },
      },
    },
  },
};
