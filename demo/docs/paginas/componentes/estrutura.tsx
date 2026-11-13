import { C, Codigo } from '../../Codigo';
import { PaginaComponente } from '../../PaginaDoc';

const USO = `import { useState } from 'react';
import { Estrutura, type SecaoNav } from '@celke/kole-react';

const NAV: SecaoNav[] = [
  { itens: [{ rotulo: 'Painel', icone: 'house', rota: '/' }] },
  {
    rotulo: 'Cadastros',
    itens: [
      { rotulo: 'Clientes', icone: 'users', rota: '/clientes' },
      {
        rotulo: 'Produtos',
        icone: 'package',
        filhos: [
          { rotulo: 'Catálogo', rota: '/produtos' },
          { rotulo: 'Categorias', rota: '/produtos/categorias' },
        ],
      },
    ],
  },
];

export function App({ sair }: { sair: () => void }) {
  const [rota, setRota] = useState('/');
  return (
    <Estrutura
      marca={{ nome: 'Gestor', subtitulo: 'Gestão comercial' }}
      nav={NAV}
      rotaAtual={rota}
      aoNavegar={setRota}
      usuario={{ nome: 'Ana Souza', cargo: 'Gerente' }}
      menuUsuario={[{ id: 'sair', rotulo: 'Sair', icone: 'log-out', destrutivo: true }]}
      aoEscolherMenuUsuario={(id) => id === 'sair' && sair()}
      ambiente={{ rotulo: 'Homologação', severidade: 'warn' }}
    >
      {/* a página da rota atual */}
    </Estrutura>
  );
}`;

const ROUTER = `import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

function Layout() {
  const { pathname } = useLocation();
  const navegar = useNavigate();
  return (
    <Estrutura
      marca={{ nome: 'Gestor' }}
      nav={NAV}
      rotaAtual={pathname}
      aoNavegar={navegar}
      // links de verdade: Ctrl+clique abre em nova aba
      renderLink={(p) => (
        <Link to={p.href} className={p.className} onClick={p.onClick} aria-current={p['aria-current']}>
          {p.children}
        </Link>
      )}
    >
      <Outlet />
    </Estrutura>
  );
}`;

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Estrutura"
      icone="layout-grid"
      componente="Estrutura"
      tipos={['ItemNav', 'Marca']}
      importar={['type SecaoNav', 'type ItemNav']}
      resumo="A moldura do sistema: menu lateral recolhível com seções e submenus, barra do topo com busca, tema, notificações e usuário, trilha automática e rodapé."
      notas={
        <ul className="doc-lista">
          <li>
            <C>contexto</C> recebe um seletor (em geral o <C>SeletorContexto</C>: pessoal × empresa, filial) à esquerda do topo, visível
            também no celular. <C>complementosTopbar</C> some no celular.
          </li>
          <li>
            A <C>Estrutura</C> não troca de página sozinha: ela mostra <C>rotaAtual</C> e avisa por <C>aoNavegar</C>. Isso permite
            usar qualquer roteador.
          </li>
          <li>
            A busca do topo (Ctrl K) já procura nos itens do <C>nav</C>. Passe <C>aoBuscar</C> para buscar também no servidor, ou{' '}
            <C>{'busca={false}'}</C> para tirar.
          </li>
          <li>
            O <C>CabecalhoPagina</C> com <C>trilha</C> monta o caminho a partir do menu: a página não precisa saber onde está.
          </li>
          <li>
            No celular, o menu vira um painel que abre pelo botão do topo. O estado recolhido do menu é lembrado no navegador.
          </li>
        </ul>
      }
    >
      <p className="doc-p">
        Esta documentação roda dentro de uma <C>Estrutura</C>: o menu à esquerda, a barra do topo e o rodapé são ela. Por isso os exemplos
        abaixo são só código.
      </p>
      <h3 className="doc-exemplo-titulo">Uso básico</h3>
      <Codigo codigo={USO} />
      <h3 className="doc-exemplo-titulo">Com React Router</h3>
      <Codigo codigo={ROUTER} />
    </PaginaComponente>
  );
}
