import './docs.css';
import type { ReactNode } from 'react';
import { DocAlerta } from './paginas/Alerta';
import { DocBadge } from './paginas/Badge';
import { DocBotao } from './paginas/Botao';
import { DocCampoTexto } from './paginas/CampoTexto';
import { DocDialogo } from './paginas/Dialogo';
import { DocInstalacao } from './paginas/Instalacao';
import { DocTema } from './paginas/Tema';

/** Página de cada rota de /docs (o menu fica em nav.ts). */
const PAGINAS: Record<string, () => ReactNode> = {
  '/docs': DocInstalacao,
  '/docs/instalacao': DocInstalacao,
  '/docs/tema': DocTema,
  '/docs/componentes/alerta': DocAlerta,
  '/docs/componentes/badge': DocBadge,
  '/docs/componentes/botao': DocBotao,
  '/docs/componentes/campo-texto': DocCampoTexto,
  '/docs/componentes/dialogo': DocDialogo,
};

/** Página da documentação para a rota, ou `null` se não existe. */
export function paginaDocs(rota: string): ReactNode {
  const Pagina = PAGINAS[rota];
  return Pagina ? <Pagina /> : null;
}
