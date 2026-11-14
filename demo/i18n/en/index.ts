/** Textos da demo em inglês. Parcial: o que faltar sai em pt-BR. */
import type { TextosDemoParciais } from '../tipos';
import { menu } from './menu';
import { paginasGeral } from './paginas/geral';
import { paginasTabelas } from './paginas/tabelas';
import { paginasUi } from './paginas/ui';
import { paginasAvancado } from './paginas/avancado';
import { paginasApps } from './paginas/apps';
import { paginasFinancas } from './paginas/financas';
import { paginasSite } from './paginas/site';
import { paginasErro } from './paginas/erro';
import { docsGuias } from './docs/guias';
import { docsAcoes } from './docs/acoes';
import { docsFormularios } from './docs/formularios';
import { docsDados } from './docs/dados';
import { docsFeedback } from './docs/feedback';
import { docsNavegacao } from './docs/navegacao';
import { docsTelas } from './docs/telas';

export const textosDemoEn: TextosDemoParciais = {
  menu,
  paginas: { ...paginasGeral, ...paginasTabelas, ...paginasUi, ...paginasAvancado, ...paginasApps, ...paginasFinancas, ...paginasSite, ...paginasErro },
  docs: { ...docsGuias, ...docsAcoes, ...docsFormularios, ...docsDados, ...docsFeedback, ...docsNavegacao, ...docsTelas },
};
