// Pós-build da fonte: põe a Inter variável (do @fontsource) dentro do pacote,
// para quem instala a biblioteca não precisar instalar nem importar a fonte.
// - copia os .woff2 para dist/fonts/;
// - coloca os @font-face no topo do dist/estilos.css apontando para eles.
// Fica fora do Vite porque, no modo biblioteca, ele embute toda fonte em base64
// (o CSS triplicava e o navegador baixava todos os alfabetos, mesmo sem usar).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../dist');
const require = createRequire(import.meta.url);
const ORIGEM = dirname(require.resolve('@fontsource-variable/inter/index.css'));

const fonteCss = readFileSync(join(ORIGEM, 'index.css'), 'utf8');
const arquivos = [...fonteCss.matchAll(/url\(\.\/files\/([^)]+\.woff2)\)/g)].map((m) => m[1]);
if (!arquivos.length) throw new Error('embutir-fonte: nenhum .woff2 encontrado no CSS do @fontsource');

mkdirSync(join(DIST, 'fonts'), { recursive: true });
for (const arquivo of arquivos) copyFileSync(join(ORIGEM, 'files', arquivo), join(DIST, 'fonts', arquivo));
// a SIL OFL exige a licença junto da fonte redistribuída
copyFileSync(join(ORIGEM, 'LICENSE'), join(DIST, 'fonts', 'LICENSE'));

const estilos = join(DIST, 'estilos.css');
const faces = fonteCss.replace(/url\(\.\/files\//g, 'url(./fonts/');
writeFileSync(estilos, `/* Inter variável (@fontsource-variable/inter, SIL OFL 1.1) */\n${faces}\n${readFileSync(estilos, 'utf8')}`);

console.log(`embutir-fonte: ${arquivos.length} arquivo(s) .woff2 em dist/fonts/`);
