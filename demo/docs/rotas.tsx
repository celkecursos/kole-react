import './docs.css';
import type { ComponentType, ReactNode } from 'react';
import { DocChangelog } from './paginas/Changelog';
import { DocIndice } from './paginas/Indice';
import { DocInstalacao } from './paginas/Instalacao';
import { DocTailwind } from './paginas/Tailwind';
import { DocTema } from './paginas/Tema';
import { CATEGORIAS, rotaComponente } from './nav';

/** Páginas gerais. */
const GUIAS: Record<string, ComponentType> = {
  '/docs': DocInstalacao,
  '/docs/instalacao': DocInstalacao,
  '/docs/tema': DocTema,
  '/docs/tailwind': DocTailwind,
  '/docs/changelog': DocChangelog,
  '/docs/componentes': DocIndice,
};

// Página de componente = paginas/componentes/<slug>.tsx (export default); o slug vem do catálogo em nav.ts.
const MODULOS = import.meta.glob<{ default: ComponentType }>('./paginas/componentes/*.tsx', { eager: true });
const COMPONENTES: Record<string, ComponentType> = {};
for (const { itens } of CATEGORIAS) {
  for (const { slug } of itens) {
    const modulo = MODULOS[`./paginas/componentes/${slug}.tsx`];
    if (!modulo) throw new Error(`Documentação: falta paginas/componentes/${slug}.tsx`);
    COMPONENTES[rotaComponente(slug)] = modulo.default;
  }
}

/** Página da documentação para a rota, ou `null` se não existe. */
export function paginaDocs(rota: string): ReactNode {
  const Pagina = GUIAS[rota] ?? COMPONENTES[rota];
  return Pagina ? <Pagina /> : null;
}
