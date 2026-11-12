import { Fragment, type ReactNode } from 'react';
import CHANGELOG from '../../../CHANGELOG.md?raw';
import { C } from '../Codigo';
import { PaginaGuia } from '../PaginaDoc';

/** Texto com `código` e **negrito**. */
function Inline({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((parte, i) => {
        if (parte.startsWith('`')) return <C key={i}>{parte.slice(1, -1)}</C>;
        if (parte.startsWith('**')) return <strong key={i}>{parte.slice(2, -2)}</strong>;
        return <Fragment key={i}>{parte}</Fragment>;
      })}
    </>
  );
}

/** Markdown do CHANGELOG.md: títulos, parágrafos e listas (o que o arquivo usa). */
function renderizar(md: string): ReactNode[] {
  const blocos: ReactNode[] = [];
  let lista: string[] = [];
  let paragrafo: string[] = [];
  const fecharLista = () => {
    if (lista.length) blocos.push(<ul key={blocos.length}>{lista.map((l, i) => <li key={i}><Inline texto={l} /></li>)}</ul>);
    lista = [];
  };
  const fecharParagrafo = () => {
    if (paragrafo.length) blocos.push(<p key={blocos.length}><Inline texto={paragrafo.join(' ')} /></p>);
    paragrafo = [];
  };
  for (const linha of md.split('\n')) {
    if (/^#\s/.test(linha)) continue; // o "# Changelog" já é o título da página
    const titulo = /^(#{2,3})\s+(.*)/.exec(linha);
    const item = /^[-*]\s+(.*)/.exec(linha);
    if (titulo) {
      fecharLista();
      fecharParagrafo();
      const Tag = titulo[1].length === 2 ? 'h2' : 'h3';
      blocos.push(<Tag key={blocos.length}><Inline texto={titulo[2]} /></Tag>);
    } else if (item) {
      fecharParagrafo();
      lista.push(item[1]);
    } else if (/^\s+\S/.test(linha) && lista.length) {
      lista[lista.length - 1] += ' ' + linha.trim();
    } else if (linha.trim() === '') {
      fecharLista();
      fecharParagrafo();
    } else {
      fecharLista();
      paragrafo.push(linha.trim());
    }
  }
  fecharLista();
  fecharParagrafo();
  return blocos;
}

const CONTEUDO = renderizar(CHANGELOG);

export function DocChangelog() {
  return (
    <PaginaGuia titulo="Changelog" icone="history" resumo="O que mudou em cada versão, lido do CHANGELOG.md do pacote.">
      <div className="doc-md">{CONTEUDO}</div>
    </PaginaGuia>
  );
}
