import { Codigo } from '../../Codigo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

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
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="estrutura"
      icone="layout-grid"
      componente="Estrutura"
      tipos={['ItemNav', 'Marca']}
      importar={['type SecaoNav', 'type ItemNav']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.estrutura.textos.contextoRecebeUmSeletor'))}</li>
          <li>{rico(t('docs.estrutura.textos.aEstruturaNaoTroca'))}</li>
          <li>{rico(t('docs.estrutura.textos.aBuscaDoTopo'))}</li>
          <li>{rico(t('docs.estrutura.textos.oCabecalhopaginaComTrilha'))}</li>
          <li>{t('docs.estrutura.textos.noCelularOMenu')}</li>
        </ul>
      }
    >
      <p className="doc-p">{rico(t('docs.estrutura.textos.estaDocumentacaoRodaDentro'))}</p>
      <h3 className="doc-exemplo-titulo">{t('docs.estrutura.textos.usoBasico')}</h3>
      <Codigo codigo={USO} />
      <h3 className="doc-exemplo-titulo">{t('docs.estrutura.textos.comReactRouter')}</h3>
      <Codigo codigo={ROUTER} />
    </PaginaComponente>
  );
}
