import type { SecaoNav } from '../../src';

// Só dados: o teste visual importa o menu no Node, sem CSS nem páginas.

export const GUIAS = [
  { rota: '/docs/instalacao', rotulo: 'Instalação', icone: 'download' },
  { rota: '/docs/tema', rotulo: 'Tema e tokens', icone: 'palette' },
];

/** Componentes documentados, em ordem alfabética (o menu segue esta lista). */
export const COMPONENTES = [
  { rota: '/docs/componentes/alerta', rotulo: 'Alerta' },
  { rota: '/docs/componentes/badge', rotulo: 'Badge' },
  { rota: '/docs/componentes/botao', rotulo: 'Botão' },
  { rota: '/docs/componentes/campo-texto', rotulo: 'Campo de texto' },
  { rota: '/docs/componentes/dialogo', rotulo: 'Diálogo' },
];

/** Seção "Documentação" do menu da demo. */
export const NAV_DOCS: SecaoNav = {
  rotulo: 'Documentação',
  itens: [...GUIAS, { rotulo: 'Componentes', icone: 'layers', filhos: COMPONENTES }],
};
