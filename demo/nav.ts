import type { SecaoNav } from '../src';
import { NAV_DOCS } from './docs/nav';

/** Menu da demo. Também é a lista de páginas do teste visual (tests/visual/demo.spec.ts). */
export const NAV: SecaoNav[] = [
  {
    itens: [{ rotulo: 'Painel', icone: 'house', rota: '/' }],
  },
  NAV_DOCS,
  {
    rotulo: 'Pages',
    itens: [
      { rotulo: 'Meu perfil', icone: 'user', rota: '/perfil' },
      { rotulo: 'Pedidos', icone: 'shopping-cart', rota: '/pedidos' },
      { rotulo: 'Novo pedido', icone: 'circle-plus', rota: '/pedidos/novo' },
    ],
  },
  {
    rotulo: 'Tabelas / Form',
    itens: [
      {
        rotulo: 'Tabelas',
        icone: 'table',
        filhos: [
          { rotulo: 'Categorias', icone: 'tags', rota: '/tabelas/categorias' },
          { rotulo: 'Formas de pagamento', icone: 'credit-card', rota: '/tabelas/pagamentos' },
          {
            rotulo: 'Localidades',
            icone: 'map',
            filhos: [
              { rotulo: 'Estados', rota: '/tabelas/estados' },
              { rotulo: 'Cidades', rota: '/tabelas/cidades' },
            ],
          },
        ],
      },
      { rotulo: 'Tabela com botões', icone: 'list', rota: '/tabelas/botoes' },
    ],
  },
  {
    rotulo: 'UI Elements',
    itens: [
      { rotulo: 'Alertas', icone: 'triangle-alert', rota: '/ui/alertas' },
      { rotulo: 'Badges', icone: 'tag', rota: '/ui/badges' },
      { rotulo: 'Trilha de navegação', icone: 'list', rota: '/ui/trilha' },
      { rotulo: 'Botões', icone: 'square-mouse-pointer', rota: '/ui/botoes' },
      { rotulo: 'Grupo de botões', icone: 'layout-grid', rota: '/ui/grupo-botoes' },
      { rotulo: 'Cards', icone: 'layers', rota: '/ui/cards' },
      { rotulo: 'Menus suspensos', icone: 'chevron-down', rota: '/ui/menus' },
      { rotulo: 'Imagens e figuras', icone: 'image', rota: '/ui/imagens' },
      { rotulo: 'Listas', icone: 'list', rota: '/ui/listas' },
      { rotulo: 'Abas e navegação', icone: 'panel-right', rota: '/ui/abas' },
      { rotulo: 'Balões', icone: 'message-square', rota: '/ui/baloes' },
      { rotulo: 'Progresso', icone: 'chart-column', rota: '/ui/progresso' },
      { rotulo: 'Giradores', icone: 'loader-circle', rota: '/ui/giradores' },
      { rotulo: 'Diálogos', icone: 'app-window', rota: '/ui/dialogos' },
      { rotulo: 'Notificações', icone: 'bell', rota: '/ui/notificacoes' },
      { rotulo: 'Paginação', icone: 'chevrons-right', rota: '/ui/paginacao' },
      { rotulo: 'Toasts', icone: 'bell', rota: '/ui/toasts' },
      { rotulo: 'Dicas', icone: 'circle-question-mark', rota: '/ui/dicas' },
      { rotulo: 'Tipografia', icone: 'file-type', rota: '/ui/tipografia' },
    ],
  },
  {
    rotulo: 'Advanced UI',
    itens: [
      { rotulo: 'Acordeões e recolhíveis', icone: 'list', rota: '/avancado/acordeoes' },
      { rotulo: 'Carrossel', icone: 'image', rota: '/avancado/carrossel' },
      { rotulo: 'Cards arrastáveis', icone: 'grip-vertical', rota: '/avancado/cards-arrastaveis' },
      { rotulo: 'Modais e fechar', icone: 'app-window', rota: '/avancado/modais' },
      { rotulo: 'Avaliações', icone: 'star', rota: '/avancado/avaliacoes' },
      { rotulo: 'Widgets', icone: 'layout-grid', rota: '/avancado/widgets' },
      { rotulo: 'Gráficos', icone: 'chart-line', rota: '/avancado/graficos' },
      { rotulo: 'Calendário', icone: 'calendar', rota: '/avancado/calendario' },
      { rotulo: 'Conversas', icone: 'message-square', rota: '/avancado/conversas' },
    ],
  },
  {
    rotulo: 'Aplicativos',
    itens: [
      {
        rotulo: 'Kanban',
        icone: 'square-kanban',
        filhos: [
          { rotulo: 'Quadros', rota: '/apps/kanban' },
          { rotulo: 'Quadro: Lançamento do site', rota: '/apps/kanban/lancamento-site' },
          { rotulo: 'Quadro: Funil de vendas', rota: '/apps/kanban/vendas' },
        ],
      },
      { rotulo: 'Tarefas', icone: 'list-todo', rota: '/apps/tarefas' },
    ],
  },
  {
    rotulo: 'Site',
    itens: [
      { rotulo: 'Home do site', icone: 'app-window', rota: '/site' },
      { rotulo: 'Home com faixa clara', icone: 'sun', rota: '/site/inicio-claro' },
      { rotulo: 'Sobre', icone: 'users', rota: '/site/sobre' },
      { rotulo: 'Serviços e planos', icone: 'package', rota: '/site/servicos' },
      { rotulo: 'Blog', icone: 'file-text', rota: '/site/blog' },
      { rotulo: 'Post', icone: 'file-pen', rota: '/site/blog/post' },
      { rotulo: 'Post com coluna lateral', icone: 'panel-right', rota: '/site/blog/post-lateral' },
      { rotulo: 'Contato', icone: 'mail', rota: '/site/contato' },
      { rotulo: 'Termos de uso', icone: 'file-text', rota: '/site/termos' },
      { rotulo: 'Política de Privacidade', icone: 'shield', rota: '/site/privacidade' },
      { rotulo: 'Política de Cookies', icone: 'file-text', rota: '/site/cookies' },
    ],
  },
  {
    rotulo: 'Error',
    itens: [
      { rotulo: 'Erro 401', icone: 'lock', rota: '/erro/401' },
      { rotulo: 'Erro 404', icone: 'search', rota: '/erro/404' },
      { rotulo: 'Erro 500', icone: 'triangle-alert', rota: '/erro/500' },
    ],
  },
  {
    rotulo: 'Design System',
    itens: [
      { rotulo: 'Campos e arquivos', icone: 'pencil', rota: '/campos' },
      { rotulo: 'Utilitários', icone: 'code', rota: '/utilitarios' },
      { rotulo: 'Login com conteúdo', icone: 'log-in', rota: '/login' },
      { rotulo: 'Login só formulário', icone: 'lock', rota: '/login/simples' },
    ],
  },
];
