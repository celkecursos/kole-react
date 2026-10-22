import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// `vite`            → servidor da demo (index.html → demo/main.tsx)
// `vite build`      → biblioteca em dist/ (index.js + estilos.css + tokens.css)
// `vite build --mode demo` → demo estática em dist-demo/
export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return { plugins: [react()], base: './', build: { outDir: 'dist-demo' } };
  }
  return {
    plugins: [
      react(),
      {
        name: 'copiar-tokens',
        closeBundle() {
          copyFileSync(resolve(import.meta.dirname, 'src/styles/tokens.css'), resolve(import.meta.dirname, 'dist/tokens.css'));
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
