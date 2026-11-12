import { Alerta } from '../../../src';
import { C, Codigo } from '../Codigo';
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
  return (
    <PaginaGuia
      titulo="Instalação"
      icone="download"
      resumo="Do npm install à primeira tela, em três passos. Funciona com Vite, Next.js (App Router) e qualquer app React 18.2+ ou 19."
    >
      <Secao id="instalar" titulo="1. Instalar o pacote">
        <Codigo linguagem="bash" codigo="npm i @celke/kole-react" />
        <p className="doc-p">
          O pacote é só ESM, traz os tipos TypeScript e já vem marcado com <C>'use client'</C>. A fonte Inter vem embutida no{' '}
          <C>estilos.css</C>, e os ícones são do Lucide (instalado junto).
        </p>
      </Secao>

      <Secao id="provedor" titulo="2. Importar o CSS e o ProvedorUi">
        <Codigo codigo={USO} />
        <p className="doc-p">
          O <C>ProvedorUi</C> liga o tema e a densidade (lembrados no navegador), os toasts (<C>useToast</C>) e as confirmações (
          <C>useConfirmacao</C>). Importe o <C>estilos.css</C> uma vez só, no ponto de entrada.
        </p>
      </Secao>

      <Secao id="primeira-tela" titulo="3. Primeira tela">
        <Codigo codigo={PRIMEIRA_TELA} />
      </Secao>

      <Secao id="tema-sem-piscar" titulo="Tema sem piscar ao abrir">
        <p className="doc-p">
          O <C>ProvedorUi</C> aplica o tema depois que o React monta. Para quem usa o tema escuro não ver a página clara piscar, aplique o
          tema no <C>{'<head>'}</C>, antes da primeira pintura:
        </p>
        <Codigo codigo={TEMA_HEAD} />
        <p className="doc-p">
          Sem SSR, cole no <C>index.html</C> o texto que <C>scriptTemaInicial()</C> devolve. O README tem a versão pronta e a alternativa
          para Content-Security-Policy sem <C>'unsafe-inline'</C>.
        </p>
      </Secao>

      <Secao id="tailwind" titulo="Com Tailwind 4">
        <Codigo linguagem="css" codigo={TAILWIND} />
        <Alerta
          severidade="warn"
          mensagem="Importe o app.css antes do estilos.css. Se o estilos.css vier primeiro, a camada kole fica abaixo do preflight do Tailwind e os componentes perdem o estilo."
        />
      </Secao>
    </PaginaGuia>
  );
}
