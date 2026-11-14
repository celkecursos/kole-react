import { Alerta } from '../../../src';
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';
import { Codigo } from '../Codigo';
import { PaginaGuia, Secao } from '../PaginaDoc';

const USO = `// main.tsx
import { createRoot } from 'react-dom/client';
import '@celke/kole-react/estilos.css';
import { ProvedorUi } from '@celke/kole-react';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <ProvedorUi>
    <App />
  </ProvedorUi>,
);`;

const PRIMEIRA_TELA = `// App.tsx
import { Botao, CabecalhoPagina, Card, useToast } from '@celke/kole-react';

export function App() {
  const toast = useToast();
  return (
    <main style={{ padding: 24 }}>
      <CabecalhoPagina titulo="Pedidos" icone="shopping-cart" />
      <Card titulo="Primeiro passo">
        <Botao rotulo="Funcionou?" onClick={() => toast.ok('Funcionou!')} />
      </Card>
    </main>
  );
}`;

const TEMA_HEAD = `import { scriptTemaInicial } from '@celke/kole-react';

// no <head> (SSR: Next.js, React Router em modo framework)
<script dangerouslySetInnerHTML={{ __html: scriptTemaInicial({ temaInicial: 'sistema' }) }} />`;

const TAILWIND = `/* app.css: a ordem das camadas vem antes do Tailwind */
@layer theme, base, kole, components, utilities;
@import 'tailwindcss';
@import '@celke/kole-react/tailwind.css'; /* opcional: tokens como utilitários */`;

export function DocInstalacao() {
  const { t } = useT();
  return (
    <PaginaGuia pagina="instalacao" icone="download">
      <Secao id="instalar" titulo={t('docs.instalacao.secoes.instalar')}>
        <Codigo linguagem="bash" codigo="npm i @celke/kole-react" />
        <p className="doc-p">{rico(t('docs.instalacao.textos.pacote'))}</p>
      </Secao>

      <Secao id="provedor" titulo={t('docs.instalacao.secoes.provedor')}>
        <Codigo codigo={USO} />
        <p className="doc-p">{rico(t('docs.instalacao.textos.provedor'))}</p>
      </Secao>

      <Secao id="primeira-tela" titulo={t('docs.instalacao.secoes.primeiraTela')}>
        <Codigo codigo={PRIMEIRA_TELA} />
      </Secao>

      <Secao id="tema-sem-piscar" titulo={t('docs.instalacao.secoes.temaSemPiscar')}>
        <p className="doc-p">{rico(t('docs.instalacao.textos.temaHead'))}</p>
        <Codigo codigo={TEMA_HEAD} />
        <p className="doc-p">{rico(t('docs.instalacao.textos.temaSemSsr'))}</p>
      </Secao>

      <Secao id="tailwind" titulo={t('docs.instalacao.secoes.tailwind')}>
        <Codigo linguagem="css" codigo={TAILWIND} />
        <Alerta severidade="warn" mensagem={t('docs.instalacao.textos.ordemTailwind')} />
      </Secao>
    </PaginaGuia>
  );
}
