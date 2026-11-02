import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CAMADA, comTemaSistema, naCamada } from './scripts/css-kole.mjs';

const SRC = resolve(import.meta.dirname, 'src').replace(/\\/g, '/') + '/';
const TOKENS = resolve(import.meta.dirname, 'src/styles/tokens.css');

/**
 * CSS de `src/` na camada `@layer kole` e com o tema "sistema" no tokens.css.
 * Vale no dev, na demo e no build: a demo vê a mesma cascata que o app que
 * instala o pacote (o demo.css fica fora da camada, como o CSS de um app).
 */
function cssKole(): Plugin {
  return {
    name: 'css-kole',
    enforce: 'pre',
    transform(codigo, id) {
      const caminho = id.split('?')[0].replace(/\\/g, '/');
      if (!caminho.startsWith(SRC) || !caminho.endsWith('.css')) return null;
      const css = caminho.endsWith('/styles/tokens.css') ? comTemaSistema(codigo) : codigo;
      return { code: naCamada(css), map: null };
    },
  };
}

// `vite`            → servidor da demo (index.html → demo/main.tsx)
// `vite build`      → biblioteca em dist/ (index.js + estilos.css + tokens.css + tailwind.css)
// `vite build --mode demo` → demo estática em dist-demo/
export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return { plugins: [react(), cssKole()], base: './', build: { outDir: 'dist-demo' } };
  }
  return {
    plugins: [
      react(),
      cssKole(),
      {
        name: 'copiar-css-avulso',
        closeBundle() {
          const dist = (nome: string) => resolve(import.meta.dirname, 'dist', nome);
          if (!readFileSync(dist('estilos.css'), 'utf8').includes(`@layer ${CAMADA}`)) {
            throw new Error(`build: dist/estilos.css saiu sem @layer ${CAMADA}`);
          }
          writeFileSync(dist('tokens.css'), naCamada(comTemaSistema(readFileSync(TOKENS, 'utf8'))));
          // diretivas do Tailwind: quem processa é o Tailwind do app, então vai sem camada
          copyFileSync(resolve(import.meta.dirname, 'src/tailwind.css'), dist('tailwind.css'));
        },
      },
    ],
    build: {
      lib: {
        entry: resolve(import.meta.dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: () => 'index.js',
        cssFileName: 'estilos',
      },
      rollupOptions: {
        // dependências e peers ficam fora do bundle, inclusive subcaminhos (react/jsx-runtime, react-dom/client…)
        external: [/^react(\/|$)/, /^react-dom(\/|$)/, /^lucide-react(\/|$)/],
        // componentes usam hooks: no Next.js (App Router) o pacote precisa ser client component
        output: { banner: "'use client';" },
      },
      sourcemap: true,
      // public/ (favicon) é só da demo; não entra no pacote da biblioteca
      copyPublicDir: false,
    },
  };
});
