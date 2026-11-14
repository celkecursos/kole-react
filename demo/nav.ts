import { NAV_DOCS } from './docs/nav';
import type { SecaoNavDemo } from './i18n/menu';
import { ROTAS as FIN } from './paginas/solucoes/financas/rotas';

/**
 * Menu da demo. Também é a lista de páginas do teste visual (tests/visual/demo.spec.ts).
 * `rotulo` é o texto em pt-BR; `chave` aponta para o dicionário (demo/i18n), e a
 * `Estrutura` recebe o menu já traduzido (`traduzirNav`, em demo/main.tsx).
 */
export const NAV: SecaoNavDemo[] = [
  {
    itens: [{ chave: 'menu.itens.painel', rotulo: 'Painel', icone: 'house', rota: '/' }],
  },
  NAV_DOCS,
  {
    chave: 'menu.secoes.paginas',
    rotulo: 'Pages',
    itens: [
      { chave: 'menu.itens.perfil', rotulo: 'Meu perfil', icone: 'user', rota: '/perfil' },
      { chave: 'menu.itens.pedidos', rotulo: 'Pedidos', icone: 'shopping-cart', rota: '/pedidos' },
      { chave: 'menu.itens.novoPedido', rotulo: 'Novo pedido', icone: 'circle-plus', rota: '/pedidos/novo' },
    ],
  },
  {
    chave: 'menu.secoes.tabelasForm',
    rotulo: 'Tabelas / Form',
    itens: [
      {
        chave: 'menu.itens.tabelas',
        rotulo: 'Tabelas',
        icone: 'table',
        filhos: [
          { chave: 'menu.itens.categorias', rotulo: 'Categorias', icone: 'tags', rota: '/tabelas/categorias' },
          { chave: 'menu.itens.formasPagamento', rotulo: 'Formas de pagamento', icone: 'credit-card', rota: '/tabelas/pagamentos' },
          {
            chave: 'menu.itens.localidades',
            rotulo: 'Localidades',
            icone: 'map',
            filhos: [
              { chave: 'menu.itens.estados', rotulo: 'Estados', rota: '/tabelas/estados' },
              { chave: 'menu.itens.cidades', rotulo: 'Cidades', rota: '/tabelas/cidades' },
            ],
          },
        ],
      },
      { chave: 'menu.itens.tabelaBotoes', rotulo: 'Tabela com botões', icone: 'list', rota: '/tabelas/botoes' },
    ],
  },
  {
    chave: 'menu.secoes.ui',
    rotulo: 'UI Elements',
    itens: [
      { chave: 'menu.itens.alertas', rotulo: 'Alertas', icone: 'triangle-alert', rota: '/ui/alertas' },
      { chave: 'menu.itens.badges', rotulo: 'Badges', icone: 'tag', rota: '/ui/badges' },
      { chave: 'menu.itens.trilha', rotulo: 'Trilha de navegação', icone: 'list', rota: '/ui/trilha' },
      { chave: 'menu.itens.botoes', rotulo: 'Botões', icone: 'square-mouse-pointer', rota: '/ui/botoes' },
      { chave: 'menu.itens.grupoBotoes', rotulo: 'Grupo de botões', icone: 'layout-grid', rota: '/ui/grupo-botoes' },
      { chave: 'menu.itens.cards', rotulo: 'Cards', icone: 'layers', rota: '/ui/cards' },
      { chave: 'menu.itens.menus', rotulo: 'Menus suspensos', icone: 'chevron-down', rota: '/ui/menus' },
      { chave: 'menu.itens.imagens', rotulo: 'Imagens e figuras', icone: 'image', rota: '/ui/imagens' },
      { chave: 'menu.itens.listas', rotulo: 'Listas', icone: 'list', rota: '/ui/listas' },
      { chave: 'menu.itens.abas', rotulo: 'Abas e navegação', icone: 'panel-right', rota: '/ui/abas' },
      { chave: 'menu.itens.baloes', rotulo: 'Balões', icone: 'message-square', rota: '/ui/baloes' },
      { chave: 'menu.itens.progresso', rotulo: 'Progresso', icone: 'chart-column', rota: '/ui/progresso' },
      { chave: 'menu.itens.giradores', rotulo: 'Giradores', icone: 'loader-circle', rota: '/ui/giradores' },
      { chave: 'menu.itens.dialogos', rotulo: 'Diálogos', icone: 'app-window', rota: '/ui/dialogos' },
      { chave: 'menu.itens.notificacoes', rotulo: 'Notificações', icone: 'bell', rota: '/ui/notificacoes' },
      { chave: 'menu.itens.paginacao', rotulo: 'Paginação', icone: 'chevrons-right', rota: '/ui/paginacao' },
      { chave: 'menu.itens.toasts', rotulo: 'Toasts', icone: 'bell', rota: '/ui/toasts' },
      { chave: 'menu.itens.dicas', rotulo: 'Dicas', icone: 'circle-question-mark', rota: '/ui/dicas' },
      { chave: 'menu.itens.tipografia', rotulo: 'Tipografia', icone: 'file-type', rota: '/ui/tipografia' },
    ],
  },
  {
    chave: 'menu.secoes.avancado',
    rotulo: 'Advanced UI',
    itens: [
      { chave: 'menu.itens.acordeoes', rotulo: 'Acordeões e recolhíveis', icone: 'list', rota: '/avancado/acordeoes' },
      { chave: 'menu.itens.carrossel', rotulo: 'Carrossel', icone: 'image', rota: '/avancado/carrossel' },
      { chave: 'menu.itens.cardsArrastaveis', rotulo: 'Cards arrastáveis', icone: 'grip-vertical', rota: '/avancado/cards-arrastaveis' },
      { chave: 'menu.itens.modais', rotulo: 'Modais e fechar', icone: 'app-window', rota: '/avancado/modais' },
      { chave: 'menu.itens.avaliacoes', rotulo: 'Avaliações', icone: 'star', rota: '/avancado/avaliacoes' },
      { chave: 'menu.itens.widgets', rotulo: 'Widgets', icone: 'layout-grid', rota: '/avancado/widgets' },
      { chave: 'menu.itens.graficos', rotulo: 'Gráficos', icone: 'chart-line', rota: '/avancado/graficos' },
      { chave: 'menu.itens.calendario', rotulo: 'Calendário', icone: 'calendar', rota: '/avancado/calendario' },
      { chave: 'menu.itens.conversas', rotulo: 'Conversas', icone: 'message-square', rota: '/avancado/conversas' },
      { chave: 'menu.itens.assistente', rotulo: 'Assistente', icone: 'sparkles', rota: '/avancado/assistente' },
    ],
  },
  {
    chave: 'menu.secoes.aplicativos',
    rotulo: 'Aplicativos',
    itens: [
      {
        chave: 'menu.itens.kanban',
        rotulo: 'Kanban',
        icone: 'square-kanban',
        filhos: [
          { chave: 'menu.itens.quadros', rotulo: 'Quadros', rota: '/apps/kanban' },
          { chave: 'menu.itens.quadroLancamento', rotulo: 'Quadro: Lançamento do site', rota: '/apps/kanban/lancamento-site' },
          { chave: 'menu.itens.quadroVendas', rotulo: 'Quadro: Funil de vendas', rota: '/apps/kanban/vendas' },
        ],
      },
      { chave: 'menu.itens.tarefas', rotulo: 'Tarefas', icone: 'list-todo', rota: '/apps/tarefas' },
    ],
  },
  {
    chave: 'menu.secoes.solucoes',
    rotulo: 'Soluções',
    itens: [
      {
        chave: 'menu.itens.financas',
        rotulo: 'Finanças',
        icone: 'wallet',
        filhos: [
          { chave: 'menu.itens.finVisaoGeral', rotulo: 'Visão geral', rota: FIN.visaoGeral },
          { chave: 'menu.itens.finLancamentos', rotulo: 'Lançamentos', rota: FIN.lancamentos },
          { chave: 'menu.itens.finContas', rotulo: 'Contas e cartões', rota: FIN.contas },
          { chave: 'menu.itens.finPagarReceber', rotulo: 'A pagar e receber', rota: FIN.pagarReceber },
          { chave: 'menu.itens.finOrcamento', rotulo: 'Orçamento', rota: FIN.orcamento },
          { chave: 'menu.itens.finMetas', rotulo: 'Metas', rota: FIN.metas },
          { chave: 'menu.itens.finFluxoCaixa', rotulo: 'Fluxo de caixa', rota: FIN.fluxoCaixa },
          { chave: 'menu.itens.finRelatorios', rotulo: 'Relatórios e DRE', rota: FIN.relatorios },
        ],
      },
    ],
  },
  {
    chave: 'menu.secoes.site',
    rotulo: 'Site',
    itens: [
      { chave: 'menu.itens.siteHome', rotulo: 'Home do site', icone: 'app-window', rota: '/site' },
      { chave: 'menu.itens.siteHomeClaro', rotulo: 'Home com faixa clara', icone: 'sun', rota: '/site/inicio-claro' },
      { chave: 'menu.itens.siteSobre', rotulo: 'Sobre', icone: 'users', rota: '/site/sobre' },
      { chave: 'menu.itens.siteServicos', rotulo: 'Serviços e planos', icone: 'package', rota: '/site/servicos' },
      { chave: 'menu.itens.siteBlog', rotulo: 'Blog', icone: 'file-text', rota: '/site/blog' },
      { chave: 'menu.itens.sitePost', rotulo: 'Post', icone: 'file-pen', rota: '/site/blog/post' },
      { chave: 'menu.itens.sitePostLateral', rotulo: 'Post com coluna lateral', icone: 'panel-right', rota: '/site/blog/post-lateral' },
      { chave: 'menu.itens.siteContato', rotulo: 'Contato', icone: 'mail', rota: '/site/contato' },
      { chave: 'menu.itens.siteTermos', rotulo: 'Termos de uso', icone: 'file-text', rota: '/site/termos' },
      { chave: 'menu.itens.sitePrivacidade', rotulo: 'Política de Privacidade', icone: 'shield', rota: '/site/privacidade' },
      { chave: 'menu.itens.siteCookies', rotulo: 'Política de Cookies', icone: 'file-text', rota: '/site/cookies' },
    ],
  },
  {
    chave: 'menu.secoes.erro',
    rotulo: 'Error',
    itens: [
      { chave: 'menu.itens.erro401', rotulo: 'Erro 401', icone: 'lock', rota: '/erro/401' },
      { chave: 'menu.itens.erro404', rotulo: 'Erro 404', icone: 'search', rota: '/erro/404' },
      { chave: 'menu.itens.erro500', rotulo: 'Erro 500', icone: 'triangle-alert', rota: '/erro/500' },
    ],
  },
  {
    chave: 'menu.secoes.designSystem',
    rotulo: 'Design System',
    itens: [
      { chave: 'menu.itens.campos', rotulo: 'Campos e arquivos', icone: 'pencil', rota: '/campos' },
      { chave: 'menu.itens.utilitarios', rotulo: 'Utilitários', icone: 'code', rota: '/utilitarios' },
      { chave: 'menu.itens.loginConteudo', rotulo: 'Login com conteúdo', icone: 'log-in', rota: '/login' },
      { chave: 'menu.itens.loginFormulario', rotulo: 'Login só formulário', icone: 'lock', rota: '/login/simples' },
    ],
  },
];
