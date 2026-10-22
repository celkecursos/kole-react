// Pós-build dos tipos (roda depois do `tsc -p tsconfig.build.json`):
// - remove `import './X.css'` dos .d.ts — o CSS de cada componente vira um só
//   `dist/estilos.css`, então esses arquivos não existem no pacote;
// - põe `.js` nos imports relativos, exigido por quem usa
//   `moduleResolution: node16/nodenext` num pacote `"type": "module"`.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../dist');

function arquivosDts(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return arquivosDts(caminho);
    return caminho.endsWith('.d.ts') ? [caminho] : [];
  });
}

function comExtensao(arquivo, especificador) {
  if (/\.(js|mjs|cjs|json)$/.test(especificador)) return especificador;
  const base = resolve(dirname(arquivo), especificador);
  if (existsSync(`${base}.d.ts`)) return `${especificador}.js`;
  if (existsSync(join(base, 'index.d.ts'))) return `${especificador}/index.js`;
  throw new Error(`ajustar-tipos: não achei a declaração de '${especificador}' (em ${arquivo})`);
}

let total = 0;
for (const arquivo of arquivosDts(DIST)) {
  const original = readFileSync(arquivo, 'utf8');
  const ajustado = original
    .replace(/^import\s+['"][^'"]+\.css['"];?\r?\n/gm, '')
    .replace(/(\bfrom\s+|\bimport\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2/g, (_, antes, aspas, esp) => `${antes}${aspas}${comExtensao(arquivo, esp)}${aspas}`);
  if (ajustado !== original) {
    writeFileSync(arquivo, ajustado);
    total++;
  }
}
// tipo vazio para `import '@celke/kole-react/estilos.css'` (e tokens.css) passar no TS sem
// `vite/client` — Next.js, tsc puro (TS 6 liga `noUncheckedSideEffectImports`)
writeFileSync(join(DIST, 'css.d.ts'), 'export {};\n');

console.log(`ajustar-tipos: ${total} arquivo(s) .d.ts ajustado(s)`);
