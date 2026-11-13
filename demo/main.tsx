import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './demo.css';
import { Estrutura, ProvedorUi, useToast } from '../src';
import { PaginaCadastro } from './paginas/Cadastro';
import { PaginaListagem } from './paginas/Listagem';
import { PaginaPainel } from './paginas/Painel';
import { PaginaTabelas } from './paginas/Tabelas';
import { PaginaTabelaBotoes } from './paginas/TabelaBotoes';
import { PaginaCampos } from './paginas/Campos';
import { PaginaLogin } from './paginas/Login';
import { PERFIL_INICIAL, PaginaPerfil, type DadosPerfil } from './paginas/Perfil';
import { PaginaUtilitarios } from './paginas/Utilitarios';
import { PaginaAlertas } from './paginas/ui/Alertas';
import { PaginaBadges } from './paginas/ui/Badges';
import { MODELOS_TRILHA, PaginaTrilhas } from './paginas/ui/Trilhas';
import { PaginaBotoes } from './paginas/ui/Botoes';
import { PaginaGrupoBotoes } from './paginas/ui/GrupoBotoes';
import { PaginaCards } from './paginas/ui/Cards';
import { PaginaMenusSuspensos } from './paginas/ui/MenusSuspensos';
import { PaginaImagens } from './paginas/ui/Imagens';
import { PaginaListas } from './paginas/ui/Listas';
import { PaginaAbasNavegacao } from './paginas/ui/AbasNavegacao';
import { PaginaBaloes } from './paginas/ui/Baloes';
import { PaginaProgressos } from './paginas/ui/Progressos';
import { PaginaGiradores } from './paginas/ui/Giradores';
import { PaginaDialogos } from './paginas/ui/Dialogos';
import { PaginaNotificacoes } from './paginas/ui/Notificacoes';
import { PaginaPaginacoes } from './paginas/ui/Paginacoes';
import { PaginaToasts } from './paginas/ui/Toasts';
import { PaginaDicas } from './paginas/ui/Dicas';
import { PaginaTipografia } from './paginas/ui/Tipografia';
import { PaginaAcordeoes } from './paginas/avancado/Acordeoes';
import { PaginaCarrosseis } from './paginas/avancado/Carrosseis';
import { PaginaCardsArrastaveis } from './paginas/avancado/CardsArrastaveis';
import { PaginaModais } from './paginas/avancado/Modais';
import { PaginaAvaliacoes } from './paginas/avancado/Avaliacoes';
import { PaginaWidgets } from './paginas/avancado/Widgets';
import { PaginaConversas } from './paginas/avancado/Conversas';
import { PaginaAssistente } from './paginas/avancado/Assistente';
import { PaginaGraficos } from './paginas/avancado/Graficos';
import { PaginaCalendario } from './paginas/avancado/CalendarioDemo';
import { PaginaKanban } from './paginas/apps/Kanban';
import { PaginaTarefas } from './paginas/apps/Tarefas';
import { PaginaFinancas, SeletorEspaco, ehFinancas } from './paginas/solucoes/financas/Financas';
import { PaginaErro } from './paginas/Erro';
import { PaginaSite } from './paginas/site/Site';
import { version } from '../package.json';
import { NAV } from './nav';
import { paginaDocs } from './docs/rotas';

function rotaDoHash() {
  return window.location.hash.replace(/^#/, '') || '/';
}

function App() {
  const [rota, setRota] = useState(rotaDoHash);
  const [perfil, setPerfil] = useState<DadosPerfil>(PERFIL_INICIAL);
  // modelo de trilha escolhido na página "Trilha de navegação" (lembrado no navegador)
  const [modeloTrilha, setModeloTrilha] = useState(() => {
    try {
      return localStorage.getItem('demo-modelo-trilha') ?? 'padrao';
    } catch {
      return 'padrao';
    }
  });
  const mudarModeloTrilha = (id: string) => {
    setModeloTrilha(id);
    try {
      localStorage.setItem('demo-modelo-trilha', id);
    } catch {
      /* navegação privada: vale só nesta sessão */
    }
  };
  const toast = useToast();

  useEffect(() => {
    const h = () => setRota(rotaDoHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const navegar = (r: string) => {
    window.location.hash = r;
  };

  let pagina;
  if (rota === '/docs' || rota.startsWith('/docs/')) pagina = paginaDocs(rota) ?? <PaginaPainel navegar={navegar} />;
  else if (rota === '/') pagina = <PaginaPainel navegar={navegar} />;
  else if (rota === '/pedidos') pagina = <PaginaListagem navegar={navegar} />;
  else if (rota === '/pedidos/novo' || rota.startsWith('/pedidos/novo/')) pagina = <PaginaCadastro rota={rota} navegar={navegar} />;
  else if (rota === '/campos') pagina = <PaginaCampos />;
  else if (rota === '/utilitarios') pagina = <PaginaUtilitarios />;
  else if (rota === '/ui/alertas') pagina = <PaginaAlertas />;
  else if (rota === '/ui/badges') pagina = <PaginaBadges />;
  else if (rota === '/ui/botoes') pagina = <PaginaBotoes />;
  else if (rota === '/ui/grupo-botoes') pagina = <PaginaGrupoBotoes />;
  else if (rota === '/ui/cards') pagina = <PaginaCards />;
  else if (rota === '/ui/menus') pagina = <PaginaMenusSuspensos />;
  else if (rota === '/ui/imagens') pagina = <PaginaImagens />;
  else if (rota === '/ui/listas') pagina = <PaginaListas />;
  else if (rota === '/ui/abas') pagina = <PaginaAbasNavegacao />;
  else if (rota === '/ui/baloes') pagina = <PaginaBaloes />;
  else if (rota === '/ui/progresso') pagina = <PaginaProgressos />;
  else if (rota === '/ui/giradores') pagina = <PaginaGiradores />;
  else if (rota === '/ui/dialogos') pagina = <PaginaDialogos />;
  else if (rota === '/ui/notificacoes') pagina = <PaginaNotificacoes />;
  else if (rota === '/ui/paginacao') pagina = <PaginaPaginacoes />;
  else if (rota === '/ui/toasts') pagina = <PaginaToasts />;
  else if (rota === '/ui/dicas') pagina = <PaginaDicas />;
  else if (rota === '/ui/tipografia') pagina = <PaginaTipografia />;
  else if (rota === '/avancado/acordeoes') pagina = <PaginaAcordeoes />;
  else if (rota === '/avancado/carrossel') pagina = <PaginaCarrosseis />;
  else if (rota === '/avancado/cards-arrastaveis') pagina = <PaginaCardsArrastaveis />;
  else if (rota === '/avancado/modais') pagina = <PaginaModais />;
  else if (rota === '/avancado/avaliacoes') pagina = <PaginaAvaliacoes />;
  else if (rota === '/avancado/widgets') pagina = <PaginaWidgets />;
  else if (rota === '/avancado/conversas') pagina = <PaginaConversas />;
  else if (rota === '/avancado/assistente') pagina = <PaginaAssistente />;
  else if (rota === '/avancado/graficos') pagina = <PaginaGraficos />;
  else if (rota === '/avancado/calendario') pagina = <PaginaCalendario />;
  else if (rota === '/apps/kanban' || rota.startsWith('/apps/kanban/')) pagina = <PaginaKanban rota={rota} navegar={navegar} />;
  else if (rota === '/apps/tarefas') pagina = <PaginaTarefas />;
  else if (ehFinancas(rota)) pagina = <PaginaFinancas rota={rota} navegar={navegar} />;
  else if (rota === '/ui/trilha') pagina = <PaginaTrilhas modeloAtual={modeloTrilha} aoMudarModelo={mudarModeloTrilha} navegar={navegar} />;
  else if (rota === '/perfil' || rota.startsWith('/perfil/'))
    pagina = <PaginaPerfil rota={rota} navegar={navegar} perfil={perfil} aoSalvar={setPerfil} />;
  else if (rota === '/tabelas/botoes') pagina = <PaginaTabelaBotoes />;
  else if (rota.startsWith('/tabelas/')) pagina = <PaginaTabelas tabela={rota.slice('/tabelas/'.length)} />;
  else pagina = <PaginaPainel navegar={navegar} />;

  // a tela de login ocupa a janela inteira, fora da moldura do sistema
  if (rota === '/login' || rota === '/login/simples')
    return <PaginaLogin key={rota} navegar={navegar} modelo={rota === '/login' ? 'conteudo' : 'formulario'} />;
  // o site público tem a própria moldura (EstruturaSite), fora da do sistema
  if (rota === '/site' || rota.startsWith('/site/')) return <PaginaSite rota={rota} navegar={navegar} />;
  // as páginas de erro também ocupam a janela inteira
  if (rota === '/erro/401' || rota === '/erro/404' || rota === '/erro/500')
    return <PaginaErro codigo={rota.slice('/erro/'.length) as '401' | '404' | '500'} navegar={navegar} />;

  return (
    <Estrutura
      marca={{ nome: 'Gestor', subtitulo: 'Gestão comercial' }}
      nav={NAV}
      rotaAtual={rota}
      // nas finanças, o topo troca entre o pessoal e a empresa
      contexto={ehFinancas(rota) ? <SeletorEspaco /> : undefined}
      aoNavegar={navegar}
      modeloTrilha={MODELOS_TRILHA.find((m) => m.id === modeloTrilha)?.modelo}
      usuario={{ nome: perfil.nome, cargo: perfil.cargo, foto: perfil.foto }}
      menuUsuario={[
        { id: 'perfil', rotulo: 'Meu perfil', icone: 'user' },
        { id: 'senha', rotulo: 'Alterar senha', icone: 'key' },
        { id: 'sair', rotulo: 'Sair', icone: 'log-out', destrutivo: true, divisorAntes: true },
      ]}
      aoEscolherMenuUsuario={(id) => {
        if (id === 'perfil') navegar('/perfil');
        else if (id === 'senha') navegar('/perfil/senha');
        else if (id === 'sair') navegar('/login');
      }}
      notificacoes={[
        { id: '1', titulo: 'Pagamento confirmado', descricao: 'Pedido PED-2026-0042 — Mercado Bom Preço.', tempo: 'há 5 min', naoLida: true, icone: 'wallet' },
        { id: '2', titulo: 'Novo cliente cadastrado', tempo: 'há 1 h', icone: 'user-plus' },
      ]}
      aoEscolherNotificacao={(id) => toast.info(`Notificação ${id}`)}
      menuDesenvolvimento={[{ id: 'cache', rotulo: 'Limpar cache', icone: 'refresh-cw' }]}
      aoEscolherMenuDesenvolvimento={() => toast.ok('Cache limpo')}
      ambiente={{ rotulo: 'Homologação', severidade: 'warn' }}
      // a versão do pacote, lida do package.json: acompanha cada release
      versao={`v${version}`}
      rodape={
        <>
          <span>© 2026 Celke · Licença MIT</span>
          <span>
            Criado por <strong>Cesar Szpak</strong>
          </span>
        </>
      }
      rodapeSidebar={<span className="lp-ocultar-recolhido">Celke Kole</span>}
      aoBuscar={(t) => toast.info('Busca', t || '(vazia)')}
    >
      {pagina}
    </Estrutura>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProvedorUi>
      <App />
    </ProvedorUi>
  </StrictMode>,
);
